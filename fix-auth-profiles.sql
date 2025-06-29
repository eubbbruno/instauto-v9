-- CONSERTAR TRIGGER DE PROFILES PARA AUTH SOCIAL
-- Execute no Supabase SQL Editor

-- 1. Remover trigger problemático se existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Criar função que funciona com auth social
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'driver'
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Se der erro, não falha o cadastro do usuário
    RAISE WARNING 'Erro ao criar profile para usuário %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Criar trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Verificar se a tabela profiles tem as colunas certas
-- Se der erro aqui, significa que precisamos ajustar a estrutura
DO $$
BEGIN
  -- Tentar inserir um registro de teste para ver se funciona
  INSERT INTO public.profiles (id, email, name, type)
  VALUES (
    gen_random_uuid(),
    'teste@exemplo.com',
    'Usuário Teste',
    'driver'
  );
  
  -- Se chegou aqui, funcionou - remover o teste
  DELETE FROM public.profiles WHERE email = 'teste@exemplo.com';
  
  RAISE NOTICE '✅ Trigger configurado com sucesso!';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '❌ Erro na configuração: %', SQLERRM;
END $$;

-- 🔧 CORREÇÃO URGENTE - FIX AUTH PROFILES SCHEMA
-- Execute este script no SQL Editor do Supabase para corrigir os erros de cadastro

-- 1. REMOVER COLUNAS INCORRETAS DA TABELA PROFILES
-- Estas colunas devem estar nas tabelas específicas (drivers/workshops)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS cpf;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS cnpj;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS business_name;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS plan_type;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS birth_date;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS license_number;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS license_expiry;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS address;

-- 2. GARANTIR ESTRUTURA CORRETA DA TABELA PROFILES
-- A tabela profiles deve ter apenas dados básicos do usuário
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS type TEXT CHECK (type IN ('motorista', 'oficina')),
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 3. GARANTIR ESTRUTURA CORRETA DA TABELA DRIVERS
CREATE TABLE IF NOT EXISTS public.drivers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    cpf TEXT UNIQUE,
    birth_date DATE,
    license_number TEXT,
    license_expiry DATE,
    address JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. GARANTIR ESTRUTURA CORRETA DA TABELA WORKSHOPS
CREATE TABLE IF NOT EXISTS public.workshops (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    business_name TEXT NOT NULL,
    cnpj TEXT UNIQUE,
    address JSONB,
    services TEXT[] DEFAULT '{}',
    specialties TEXT[] DEFAULT '{}',
    rating DECIMAL(2,1) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    opening_hours JSONB,
    price_range TEXT CHECK (price_range IN ('$', '$$', '$$$')),
    photos TEXT[] DEFAULT '{}',
    plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'pro')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CRIAR ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_drivers_profile_id ON public.drivers(profile_id);
CREATE INDEX IF NOT EXISTS idx_workshops_profile_id ON public.workshops(profile_id);
CREATE INDEX IF NOT EXISTS idx_drivers_cpf ON public.drivers(cpf);
CREATE INDEX IF NOT EXISTS idx_workshops_cnpj ON public.workshops(cnpj);

-- 6. HABILITAR RLS NAS NOVAS TABELAS
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;

-- 7. CRIAR POLÍTICAS RLS PARA DRIVERS
DROP POLICY IF EXISTS "Drivers can view own data" ON public.drivers;
CREATE POLICY "Drivers can view own data" ON public.drivers 
FOR SELECT USING (profile_id = auth.uid());

DROP POLICY IF EXISTS "Drivers can update own data" ON public.drivers;
CREATE POLICY "Drivers can update own data" ON public.drivers 
FOR UPDATE USING (profile_id = auth.uid());

DROP POLICY IF EXISTS "Drivers can insert own data" ON public.drivers;
CREATE POLICY "Drivers can insert own data" ON public.drivers 
FOR INSERT WITH CHECK (profile_id = auth.uid());

-- 8. CRIAR POLÍTICAS RLS PARA WORKSHOPS
DROP POLICY IF EXISTS "Workshops can view own data" ON public.workshops;
CREATE POLICY "Workshops can view own data" ON public.workshops 
FOR SELECT USING (profile_id = auth.uid());

DROP POLICY IF EXISTS "Workshops can update own data" ON public.workshops;
CREATE POLICY "Workshops can update own data" ON public.workshops 
FOR UPDATE USING (profile_id = auth.uid());

DROP POLICY IF EXISTS "Workshops can insert own data" ON public.workshops;
CREATE POLICY "Workshops can insert own data" ON public.workshops 
FOR INSERT WITH CHECK (profile_id = auth.uid());

-- 9. ATUALIZAR FUNÇÃO handle_new_user PARA NÃO INSERIR CAMPOS INVÁLIDOS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, type, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'type', 'motorista'),
        NOW(),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. VERIFICAR SE TRIGGER EXISTE E RECRIAR
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ✅ SCRIPT CONCLUÍDO
-- Execute este script no Supabase SQL Editor
-- Depois teste o cadastro novamente

-- 🔍 VERIFICAÇÃO: Execute estas queries para confirmar
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'profiles' AND table_schema = 'public';
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'drivers' AND table_schema = 'public';
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'workshops' AND table_schema = 'public'; 