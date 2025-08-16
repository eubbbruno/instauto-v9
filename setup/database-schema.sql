-- 🏗️ INSTAUTO - SCHEMA COMPLETO DO BANCO DE DADOS
-- Execute este script no Supabase SQL Editor

-- ============================================================================
-- EXTENSÕES NECESSÁRIAS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABELA PROFILES (USUÁRIOS)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    type TEXT CHECK (type IN ('motorista', 'oficina', 'admin')) NOT NULL DEFAULT 'motorista',
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABELA DRIVERS (MOTORISTAS)
-- ============================================================================
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

-- ============================================================================
-- TABELA WORKSHOPS (OFICINAS)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.workshops (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    
    -- Endereço
    address_street TEXT,
    address_number TEXT,
    address_complement TEXT,
    address_neighborhood TEXT,
    address_city TEXT,
    address_state TEXT,
    address_zip_code TEXT,
    
    -- Localização
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Planos e status
    plan_type TEXT CHECK (plan_type IN ('free', 'pro')) DEFAULT 'free',
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    
    -- Trial para plano PRO
    is_trial BOOLEAN DEFAULT false,
    trial_starts_at TIMESTAMPTZ,
    trial_ends_at TIMESTAMPTZ,
    
    -- Avaliações
    rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    
    -- Horários (JSON para flexibilidade)
    business_hours JSONB DEFAULT '{}',
    
    -- Metadados
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABELA AGENDAMENTOS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.agendamentos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    driver_id UUID REFERENCES public.drivers(profile_id) ON DELETE CASCADE,
    workshop_id UUID REFERENCES public.workshops(profile_id) ON DELETE CASCADE,
    
    -- Dados do agendamento
    service_type TEXT NOT NULL,
    description TEXT,
    scheduled_date TIMESTAMPTZ NOT NULL,
    estimated_duration INTEGER, -- em minutos
    estimated_price DECIMAL(10,2),
    
    -- Status
    status TEXT CHECK (status IN ('agendado', 'confirmado', 'em_andamento', 'concluido', 'cancelado')) DEFAULT 'agendado',
    
    -- Veículo
    vehicle_brand TEXT,
    vehicle_model TEXT,
    vehicle_year INTEGER,
    vehicle_plate TEXT,
    
    -- Metadados
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABELA AVALIACOES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.avaliacoes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    agendamento_id UUID REFERENCES public.agendamentos(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES public.drivers(profile_id) ON DELETE CASCADE,
    workshop_id UUID REFERENCES public.workshops(profile_id) ON DELETE CASCADE,
    
    -- Avaliação
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    
    -- Metadados
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- HABILITAR RLS (ROW LEVEL SECURITY)
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avaliacoes ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- POLÍTICAS RLS - PROFILES
-- ============================================================================

-- Usuários podem ver próprio profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Usuários podem atualizar próprio profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Usuários podem inserir próprio profile
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Admins podem gerenciar todos os profiles
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
CREATE POLICY "Admins can manage all profiles" ON public.profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND type = 'admin'
        )
    );

-- ============================================================================
-- POLÍTICAS RLS - WORKSHOPS
-- ============================================================================

-- Oficinas podem gerenciar próprios dados
DROP POLICY IF EXISTS "Workshops can manage own data" ON public.workshops;
CREATE POLICY "Workshops can manage own data" ON public.workshops
    FOR ALL USING (auth.uid() = profile_id);

-- Motoristas podem ver workshops (para busca)
DROP POLICY IF EXISTS "Drivers can view workshops" ON public.workshops;
CREATE POLICY "Drivers can view workshops" ON public.workshops
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND type = 'motorista'
        )
    );

-- Admins podem gerenciar todas as workshops
DROP POLICY IF EXISTS "Admins can manage all workshops" ON public.workshops;
CREATE POLICY "Admins can manage all workshops" ON public.workshops
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND type = 'admin'
        )
    );

-- ============================================================================
-- POLÍTICAS RLS - DRIVERS
-- ============================================================================

-- Motoristas podem gerenciar próprios dados
DROP POLICY IF EXISTS "Drivers can manage own data" ON public.drivers;
CREATE POLICY "Drivers can manage own data" ON public.drivers
    FOR ALL USING (auth.uid() = profile_id);

-- Admins podem gerenciar todos os drivers
DROP POLICY IF EXISTS "Admins can manage all drivers" ON public.drivers;
CREATE POLICY "Admins can manage all drivers" ON public.drivers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND type = 'admin'
        )
    );

-- ============================================================================
-- FUNÇÃO TRIGGER PARA CRIAR PROFILES AUTOMATICAMENTE
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    -- Criar profile básico para todo novo usuário
    INSERT INTO public.profiles (id, email, name, type)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        COALESCE(new.raw_user_meta_data->>'user_type', 'motorista')
    );
    
    -- Se for oficina, criar registro na workshops
    IF (new.raw_user_meta_data->>'user_type' = 'oficina') THEN
        INSERT INTO public.workshops (profile_id, name, plan_type)
        VALUES (
            new.id, 
            COALESCE(new.raw_user_meta_data->>'name', 'Oficina'),
            COALESCE(new.raw_user_meta_data->>'plan_type', 'free')
        );
    END IF;
    
    -- Se for motorista, criar registro na drivers
    IF (new.raw_user_meta_data->>'user_type' = 'motorista') THEN
        INSERT INTO public.drivers (profile_id)
        VALUES (new.id);
    END IF;
    
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGER PARA CRIAR PROFILES AUTOMATICAMENTE
-- ============================================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- VERIFICAÇÕES FINAIS
-- ============================================================================
SELECT 'SCHEMA CRIADO COM SUCESSO!' as status;

SELECT 'TABELAS CRIADAS:' as status;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'workshops', 'drivers', 'agendamentos', 'avaliacoes')
ORDER BY table_name;

SELECT 'TRIGGER ATIVO:' as status;
SELECT tgname FROM pg_trigger 
WHERE tgrelid = 'auth.users'::regclass 
AND tgname = 'on_auth_user_created';

SELECT '✅ BANCO CONFIGURADO E PRONTO PARA USO!' as status;
