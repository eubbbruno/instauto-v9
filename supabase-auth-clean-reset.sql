-- 🧹 LIMPEZA COMPLETA: RESET TOTAL DO SISTEMA DE AUTH
-- Execute este script para começar do ZERO com um sistema simplificado

-- ==================================================
-- 🗑️ STEP 1: REMOVER TUDO QUE EXISTE
-- ==================================================

-- 1. Remover todas as políticas RLS
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "workshops_select_all" ON workshops;
DROP POLICY IF EXISTS "workshops_insert_own" ON workshops;
DROP POLICY IF EXISTS "workshops_update_own" ON workshops;
DROP POLICY IF EXISTS "drivers_select_own" ON drivers;
DROP POLICY IF EXISTS "drivers_insert_own" ON drivers;
DROP POLICY IF EXISTS "drivers_update_own" ON drivers;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Anyone can view workshops" ON workshops;
DROP POLICY IF EXISTS "Workshops can update own data" ON workshops;

-- 2. Remover triggers e funções
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS new_user_trigger ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- 3. Limpar dados de teste (CUIDADO: remove todos os usuários)
-- DESCOMENTE APENAS SE QUISER LIMPAR TUDO:
/*
DELETE FROM public.drivers;
DELETE FROM public.workshops;
DELETE FROM public.profiles;
DELETE FROM auth.users WHERE email LIKE '%teste%' OR email LIKE '%@gmail.com';
*/

-- ==================================================
-- 🏗️ STEP 2: ESTRUTURA SIMPLIFICADA
-- ==================================================

-- Verificar se as tabelas existem, se não, criar
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    type TEXT CHECK (type IN ('motorista', 'oficina')) NOT NULL DEFAULT 'motorista',
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    cpf TEXT,
    birth_date DATE,
    address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.workshops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    business_name TEXT,
    cnpj TEXT,
    plan_type TEXT CHECK (plan_type IN ('free', 'pro')) DEFAULT 'free',
    address JSONB,
    services TEXT[] DEFAULT '{}',
    specialties TEXT[] DEFAULT '{}',
    rating DECIMAL(2,1) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    opening_hours JSONB,
    price_range TEXT CHECK (price_range IN ('$', '$$', '$$$')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================================================
-- 🔧 STEP 3: FUNÇÃO SUPER SIMPLES
-- ==================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_type_value TEXT;
    user_name_value TEXT;
BEGIN
    -- Log básico
    RAISE LOG '🚀 Criando profile para usuário: % (email: %)', NEW.id, NEW.email;
    
    -- Extrair tipo (padrão: motorista)
    user_type_value := COALESCE(NEW.raw_user_meta_data->>'type', 'motorista');
    
    -- Validar tipo
    IF user_type_value NOT IN ('motorista', 'oficina') THEN
        user_type_value := 'motorista';
    END IF;
    
    -- Extrair nome (pode ser null, será preenchido depois)
    user_name_value := COALESCE(
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'full_name',
        split_part(NEW.email, '@', 1)
    );
    
    -- Criar profile básico APENAS
    INSERT INTO public.profiles (id, email, name, type)
    VALUES (NEW.id, NEW.email, user_name_value, user_type_value)
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        updated_at = NOW();
    
    -- Criar registro específico vazio (será preenchido depois)
    IF user_type_value = 'motorista' THEN
        INSERT INTO public.drivers (profile_id)
        VALUES (NEW.id)
        ON CONFLICT (profile_id) DO NOTHING;
    ELSE
        INSERT INTO public.workshops (profile_id)
        VALUES (NEW.id)
        ON CONFLICT (profile_id) DO NOTHING;
    END IF;
    
    RAISE LOG '✅ Profile criado: tipo=%, nome=%', user_type_value, user_name_value;
    RETURN NEW;
    
EXCEPTION WHEN OTHERS THEN
    RAISE LOG '❌ Erro ao criar profile: %', SQLERRM;
    RETURN NEW; -- Não falhar o auth
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==================================================
-- 🔒 STEP 4: POLÍTICAS RLS SIMPLES
-- ==================================================

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;

-- Políticas básicas
CREATE POLICY "allow_own_profile" ON profiles
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "allow_own_driver" ON drivers
    FOR ALL USING (auth.uid() = profile_id);

CREATE POLICY "allow_own_workshop" ON workshops
    FOR ALL USING (auth.uid() = profile_id);

-- Permitir que todos vejam oficinas (para busca)
CREATE POLICY "allow_view_workshops" ON workshops
    FOR SELECT USING (true);

-- ==================================================
-- 🎯 STEP 5: ÍNDICES BÁSICOS
-- ==================================================

CREATE INDEX IF NOT EXISTS idx_profiles_type ON profiles(type);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_workshops_profile_id ON workshops(profile_id);
CREATE INDEX IF NOT EXISTS idx_drivers_profile_id ON drivers(profile_id);

-- ==================================================
-- ✅ VERIFICAÇÃO
-- ==================================================

SELECT 
    '🎉 RESET COMPLETO!' as status,
    'Sistema de auth simplificado criado' as resultado,
    'Pronto para testar' as proxima_acao;

-- Verificar estrutura
SELECT 
    'TABELAS' as tipo,
    table_name as nome,
    'OK' as status
FROM information_schema.tables 
WHERE table_name IN ('profiles', 'drivers', 'workshops')
AND table_schema = 'public';

-- Verificar função
SELECT 
    'FUNÇÃO' as tipo,
    routine_name as nome,
    'OK' as status
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- ==================================================
-- 📝 INSTRUÇÕES FINAIS
-- ==================================================

/*
🎯 NOVO FLUXO SIMPLIFICADO:

1. CADASTRO/LOGIN:
   - Email/senha ou OAuth
   - Apenas escolhe tipo (motorista/oficina)
   - Profile básico criado automaticamente

2. REDIRECIONAMENTO:
   - Motorista → /motorista
   - Oficina FREE → /oficina-basica  
   - Oficina PRO → /dashboard

3. DADOS PESSOAIS:
   - Preenchidos depois em /configuracoes
   - Sem obrigatoriedade no cadastro
   - Sem tela de "completar perfil"

🧪 PRÓXIMOS PASSOS:
1. Atualizar páginas de auth
2. Remover lógica de completar perfil
3. Criar seção configurações robusta
4. Testar tudo
*/ 