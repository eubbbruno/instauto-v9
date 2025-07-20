-- ========================================
-- SUPABASE AUTH UI SETUP - INSTAUTO V7
-- ========================================
-- Execute este script no Supabase SQL Editor
-- Cria triggers automáticos para criação de profiles

-- 1️⃣ FUNÇÃO: handle_new_user (criação automática de profile)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    user_type,
    plan_type,
    email,
    full_name,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'motorista'),
    CASE 
      WHEN COALESCE(NEW.raw_user_meta_data->>'user_type', 'motorista') = 'oficina' 
      THEN COALESCE(NEW.raw_user_meta_data->>'plan_type', 'free')
      ELSE NULL
    END,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2️⃣ TRIGGER: on_auth_user_created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3️⃣ FUNÇÃO RPC: convert_to_workshop (conversão motorista → oficina)
-- Drop existing function first to avoid return type conflicts
DROP FUNCTION IF EXISTS public.convert_to_workshop(UUID, TEXT);
DROP FUNCTION IF EXISTS public.convert_to_workshop(UUID);

CREATE OR REPLACE FUNCTION public.convert_to_workshop(
  user_id UUID,
  plan_type TEXT DEFAULT 'free'
)
RETURNS JSON AS $$
DECLARE
  profile_record RECORD;
  workshop_record RECORD;
BEGIN
  -- Verificar se profile existe
  SELECT * INTO profile_record FROM public.profiles WHERE id = user_id;
  
  IF NOT FOUND THEN
    RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Profile não encontrado');
  END IF;

  -- Atualizar profile para oficina
  UPDATE public.profiles 
  SET 
    user_type = 'oficina',
    plan_type = plan_type,
    updated_at = NOW()
  WHERE id = user_id;

  -- Verificar se já existe workshop
  SELECT * INTO workshop_record FROM public.workshops WHERE user_id = user_id;
  
  IF NOT FOUND THEN
    -- Criar workshop
    INSERT INTO public.workshops (
      user_id,
      name,
      plan_type,
      status,
      created_at,
      updated_at
    ) VALUES (
      user_id,
      COALESCE(profile_record.full_name, profile_record.email) || ' - Oficina',
      plan_type,
      'active',
      NOW(),
      NOW()
    );
  ELSE
    -- Atualizar workshop existente
    UPDATE public.workshops 
    SET 
      plan_type = convert_to_workshop.plan_type,
      status = 'active',
      updated_at = NOW()
    WHERE user_id = user_id;
  END IF;

  RETURN JSON_BUILD_OBJECT('success', true, 'message', 'Convertido para oficina com sucesso');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4️⃣ POLÍTICAS RLS (Row Level Security)

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Workshops
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Workshop owners can view own workshop" ON public.workshops;
CREATE POLICY "Workshop owners can view own workshop" ON public.workshops
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Workshop owners can update own workshop" ON public.workshops;
CREATE POLICY "Workshop owners can update own workshop" ON public.workshops
  FOR UPDATE USING (auth.uid() = user_id);

-- 5️⃣ GRANT PERMISSIONS
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT ALL ON public.workshops TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.convert_to_workshop TO authenticated;

-- ========================================
-- 🎯 COMO USAR:
-- ========================================
-- 1. Execute este script no Supabase SQL Editor
-- 2. Teste as páginas: /auth/new-motorista e /auth/new-oficina
-- 3. OAuth criará profiles automaticamente
-- 4. Callback usará convert_to_workshop() se necessário
-- ========================================

-- ✅ SCRIPT CONCLUÍDO
SELECT 'Supabase Auth UI Setup - CONCLUÍDO ✅' as status;