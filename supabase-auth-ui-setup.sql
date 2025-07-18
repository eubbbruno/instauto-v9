-- 🚀 SUPABASE AUTH UI + TRIGGERS - SOLUÇÃO DEFINITIVA
-- Execute este script no Supabase SQL Editor

-- 1. Limpar triggers e funções existentes
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Função para criar profile automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  user_type_value text DEFAULT 'motorista';
  plan_type_value text DEFAULT 'free';
  user_name_value text;
BEGIN
  -- Log do início
  RAISE LOG '🚀 [AUTH] Novo usuário criado: % (email: %)', NEW.id, NEW.email;
  RAISE LOG '🔍 [AUTH] Metadata: %', NEW.raw_user_meta_data;
  
  -- Extrair nome do usuário
  user_name_value := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1)
  );
  
  -- Criar profile básico (sempre como motorista por padrão)
  INSERT INTO public.profiles (id, email, name, type, avatar_url, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    user_name_value,
    user_type_value, -- Sempre 'motorista' por padrão
    NEW.raw_user_meta_data->>'avatar_url',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW();
  
  -- Criar registro de motorista por padrão
  INSERT INTO public.drivers (profile_id, created_at, updated_at)
  VALUES (NEW.id, NOW(), NOW())
  ON CONFLICT (profile_id) DO NOTHING;
  
  RAISE LOG '✅ [AUTH] Profile criado como motorista por padrão para: %', NEW.email;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Criar trigger para novos usuários
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Função para converter motorista em oficina
CREATE OR REPLACE FUNCTION public.convert_to_workshop(
  user_id uuid,
  plan_type text DEFAULT 'free'
)
RETURNS void AS $$
BEGIN
  -- Atualizar profile para oficina
  UPDATE public.profiles 
  SET type = 'oficina', updated_at = NOW()
  WHERE id = user_id;
  
  -- Remover de drivers se existir
  DELETE FROM public.drivers WHERE profile_id = user_id;
  
  -- Criar/atualizar registro de workshop
  INSERT INTO public.workshops (profile_id, plan_type, business_name, verified, created_at, updated_at)
  VALUES (
    user_id, 
    plan_type,
    (SELECT name FROM public.profiles WHERE id = user_id),
    false,
    NOW(),
    NOW()
  )
  ON CONFLICT (profile_id) DO UPDATE SET
    plan_type = EXCLUDED.plan_type,
    updated_at = NOW();
  
  RAISE LOG '🔧 [AUTH] Usuário % convertido para oficina (plano: %)', user_id, plan_type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Verificar se tudo foi criado corretamente
SELECT 
  'Função handle_new_user criada' as status,
  EXISTS(SELECT 1 FROM pg_proc WHERE proname = 'handle_new_user') as exists
UNION ALL
SELECT 
  'Função convert_to_workshop criada' as status,
  EXISTS(SELECT 1 FROM pg_proc WHERE proname = 'convert_to_workshop') as exists
UNION ALL
SELECT 
  'Trigger on_auth_user_created criado' as status,
  EXISTS(SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') as exists;

-- ✅ CONFIGURAÇÃO COMPLETA!
-- Agora todos os usuários são criados como motorista por padrão
-- Use a função convert_to_workshop(user_id, 'free'|'pro') para converter para oficina 