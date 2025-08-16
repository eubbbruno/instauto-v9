-- ============================================
-- RESET COMPLETO SUPABASE - COMEÇAR DO ZERO
-- ============================================

-- 1. DELETAR TODAS AS TABELAS
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;
DROP TABLE IF EXISTS public.service_orders CASCADE;
DROP TABLE IF EXISTS public.appointments CASCADE;
DROP TABLE IF EXISTS public.vehicles CASCADE;
DROP TABLE IF EXISTS public.drivers CASCADE;
DROP TABLE IF EXISTS public.workshops CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. DELETAR TODAS AS FUNÇÕES
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.exec_sql(text) CASCADE;

-- 3. CRIAR TABELA PROFILES SIMPLES
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('admin', 'motorista', 'oficina')),
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CRIAR TABELA WORKSHOPS SIMPLES
CREATE TABLE public.workshops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) NOT NULL,
  name TEXT NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('free', 'pro')) DEFAULT 'free',
  is_trial BOOLEAN DEFAULT false,
  trial_starts_at TIMESTAMP WITH TIME ZONE,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. CRIAR TABELA DRIVERS SIMPLES
CREATE TABLE public.drivers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) NOT NULL,
  license_number TEXT,
  license_category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. RLS SIMPLES E DIRETO
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

-- Políticas simples para profiles
CREATE POLICY "profiles_own_data" ON public.profiles
  FOR ALL USING (auth.uid() = id);

-- Políticas simples para workshops
CREATE POLICY "workshops_own_data" ON public.workshops
  FOR ALL USING (auth.uid() = profile_id);

-- Políticas simples para drivers
CREATE POLICY "drivers_own_data" ON public.drivers
  FOR ALL USING (auth.uid() = profile_id);

-- 7. FUNÇÃO PARA CRIAR PROFILE AUTOMÁTICO
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'motorista')
  );
  
  -- Se é oficina, criar workshop
  IF COALESCE(NEW.raw_user_meta_data->>'user_type', 'motorista') = 'oficina' THEN
    INSERT INTO public.workshops (profile_id, name, plan_type, is_trial, trial_starts_at, trial_ends_at)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'workshop_name', 'Minha Oficina'),
      COALESCE(NEW.raw_user_meta_data->>'plan_type', 'free'),
      CASE WHEN COALESCE(NEW.raw_user_meta_data->>'plan_type', 'free') = 'pro' THEN true ELSE false END,
      CASE WHEN COALESCE(NEW.raw_user_meta_data->>'plan_type', 'free') = 'pro' THEN NOW() ELSE NULL END,
      CASE WHEN COALESCE(NEW.raw_user_meta_data->>'plan_type', 'free') = 'pro' THEN NOW() + INTERVAL '7 days' ELSE NULL END
    );
  END IF;
  
  -- Se é motorista, criar driver
  IF COALESCE(NEW.raw_user_meta_data->>'user_type', 'motorista') = 'motorista' THEN
    INSERT INTO public.drivers (profile_id)
    VALUES (NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. TRIGGER PARA NOVOS USUÁRIOS
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. CRIAR ADMIN PADRÃO (substitua por suas credenciais)
-- Primeiro crie no Supabase Dashboard: admin@instauto.com.br / senha123
-- Depois execute:
INSERT INTO public.profiles (id, email, name, type)
VALUES (
  '4c7a55d9-b3e9-40f9-8755-df07fa7eb689', -- substitua pelo ID real do admin
  'admin@instauto.com.br',
  'Administrador',
  'admin'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type;

-- 10. TESTAR
SELECT 'RESET COMPLETO FINALIZADO!' as status;
SELECT * FROM public.profiles WHERE type = 'admin';
