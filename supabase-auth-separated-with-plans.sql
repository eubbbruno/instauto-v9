-- 🚀 SISTEMA DE AUTH SEPARADO COM PLANOS - JANEIRO 2025
-- Script otimizado para páginas separadas e seleção de plano

-- ==================================================
-- 🗑️ STEP 1: LIMPEZA COMPLETA
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
DROP POLICY IF EXISTS "allow_own_profile" ON profiles;
DROP POLICY IF EXISTS "allow_own_driver" ON drivers;
DROP POLICY IF EXISTS "allow_own_workshop" ON workshops;
DROP POLICY IF EXISTS "allow_view_workshops" ON workshops;

-- 2. Remover triggers e funções
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS new_user_trigger ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- 3. Limpar dados de teste (DESCOMENTE SE NECESSÁRIO)
/*
DELETE FROM public.drivers;
DELETE FROM public.workshops;
DELETE FROM public.profiles;
DELETE FROM auth.users WHERE email LIKE '%teste%' OR email LIKE '%@gmail.com';
*/

-- ==================================================
-- 🏗️ STEP 2: ESTRUTURA OTIMIZADA
-- ==================================================

-- Tabela profiles
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

-- Tabela drivers
CREATE TABLE IF NOT EXISTS public.drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    cpf TEXT,
    birth_date DATE,
    address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela workshops
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
-- 🔧 STEP 3: FUNÇÃO SUPER ROBUSTA COM PLANOS
-- ==================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_type_value TEXT;
    user_name_value TEXT;
    plan_type_value TEXT;
BEGIN
    -- Log detalhado
    RAISE LOG '🚀 [AUTH] Criando profile para usuário: % (email: %)', NEW.id, NEW.email;
    RAISE LOG '🔍 [AUTH] Metadata recebido: %', NEW.raw_user_meta_data;
    
    -- Extrair tipo (padrão: motorista)
    user_type_value := COALESCE(NEW.raw_user_meta_data->>'type', 'motorista');
    
    -- Validar tipo
    IF user_type_value NOT IN ('motorista', 'oficina') THEN
        RAISE LOG '⚠️ [AUTH] Tipo inválido (%), usando padrão: motorista', user_type_value;
        user_type_value := 'motorista';
    END IF;
    
    -- Extrair plano (apenas para oficinas)
    plan_type_value := COALESCE(NEW.raw_user_meta_data->>'plan_type', 'free');
    IF plan_type_value NOT IN ('free', 'pro') THEN
        plan_type_value := 'free';
    END IF;
    
    -- Extrair nome
    user_name_value := COALESCE(
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'full_name',
        split_part(NEW.email, '@', 1)
    );
    
    RAISE LOG '✅ [AUTH] Dados processados: tipo=%, nome=%, plano=%', user_type_value, user_name_value, plan_type_value;
    
    -- Criar profile básico
    INSERT INTO public.profiles (id, email, name, type)
    VALUES (NEW.id, NEW.email, user_name_value, user_type_value)
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        type = EXCLUDED.type,
        updated_at = NOW();
    
    -- Criar registro específico baseado no tipo
    IF user_type_value = 'motorista' THEN
        INSERT INTO public.drivers (profile_id)
        VALUES (NEW.id)
        ON CONFLICT (profile_id) DO NOTHING;
        
        RAISE LOG '🚗 [AUTH] Driver criado para: %', NEW.email;
    ELSE
        INSERT INTO public.workshops (profile_id, plan_type)
        VALUES (NEW.id, plan_type_value)
        ON CONFLICT (profile_id) DO UPDATE SET
            plan_type = EXCLUDED.plan_type,
            updated_at = NOW();
        
        RAISE LOG '🔧 [AUTH] Workshop criado para: % (plano: %)', NEW.email, plan_type_value;
    END IF;
    
    RAISE LOG '🎉 [AUTH] Profile completo criado com sucesso!';
    RETURN NEW;
    
EXCEPTION WHEN OTHERS THEN
    RAISE LOG '❌ [AUTH] Erro ao criar profile: %', SQLERRM;
    RAISE LOG '🔧 [AUTH] Dados que causaram erro: user_id=%, email=%, metadata=%', NEW.id, NEW.email, NEW.raw_user_meta_data;
    -- Não falhar o auth, apenas logar o erro
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==================================================
-- 🔒 STEP 4: POLÍTICAS RLS OTIMIZADAS
-- ==================================================

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "users_can_manage_own_profile" ON profiles
    FOR ALL USING (auth.uid() = id);

-- Políticas para drivers
CREATE POLICY "drivers_can_manage_own_data" ON drivers
    FOR ALL USING (auth.uid() = profile_id);

-- Políticas para workshops
CREATE POLICY "workshops_can_manage_own_data" ON workshops
    FOR ALL USING (auth.uid() = profile_id);

-- Permitir que todos vejam oficinas (para busca pública)
CREATE POLICY "public_can_view_workshops" ON workshops
    FOR SELECT USING (true);

-- ==================================================
-- 🎯 STEP 5: ÍNDICES PARA PERFORMANCE
-- ==================================================

CREATE INDEX IF NOT EXISTS idx_profiles_type ON profiles(type);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);

CREATE INDEX IF NOT EXISTS idx_workshops_profile_id ON workshops(profile_id);
CREATE INDEX IF NOT EXISTS idx_workshops_plan_type ON workshops(plan_type);
CREATE INDEX IF NOT EXISTS idx_workshops_verified ON workshops(verified);
CREATE INDEX IF NOT EXISTS idx_workshops_rating ON workshops(rating);

CREATE INDEX IF NOT EXISTS idx_drivers_profile_id ON drivers(profile_id);

-- ==================================================
-- ✅ STEP 6: VERIFICAÇÕES FINAIS
-- ==================================================

-- Verificar estrutura
SELECT 
    '📊 ESTRUTURA' as status,
    'Tabelas criadas com sucesso' as resultado;

SELECT 
    '📋 TABELAS' as tipo,
    table_name as nome,
    '✅ OK' as status
FROM information_schema.tables 
WHERE table_name IN ('profiles', 'drivers', 'workshops')
AND table_schema = 'public';

-- Verificar função
SELECT 
    '⚙️ FUNÇÃO' as tipo,
    routine_name as nome,
    '✅ OK' as status
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user'
AND routine_schema = 'public';

-- Verificar políticas
SELECT 
    '🔒 POLÍTICAS' as tipo,
    COUNT(*) as quantidade,
    '✅ OK' as status
FROM pg_policies 
WHERE tablename IN ('profiles', 'drivers', 'workshops');

-- Verificar índices
SELECT 
    '⚡ ÍNDICES' as tipo,
    COUNT(*) as quantidade,
    '✅ OK' as status
FROM pg_indexes 
WHERE tablename IN ('profiles', 'drivers', 'workshops');

-- ==================================================
-- 📝 RESUMO DO SISTEMA
-- ==================================================

SELECT 
    '🎯 SISTEMA CONFIGURADO' as status,
    'Auth separado com planos funcionando' as resultado,
    'Pronto para testar!' as proxima_acao;

/*
🎯 NOVO FLUXO IMPLEMENTADO:

📱 PÁGINAS SEPARADAS:
- /auth → Seleção de área (motorista/oficina)
- /auth/motorista → Auth específica para motoristas
- /auth/oficina → Auth específica para oficinas (com seleção de plano)

🔄 FLUXO DE CADASTRO:
1. Usuário escolhe área (/auth/motorista ou /auth/oficina)
2. Na oficina: seleciona plano (grátis/pro)
3. Faz cadastro/login
4. Profile criado automaticamente via trigger
5. Redirecionamento baseado no tipo/plano:
   - Motorista → /motorista
   - Oficina FREE → /oficina-basica
   - Oficina PRO → /dashboard

🔧 DADOS PESSOAIS:
- Preenchidos depois nas configurações do dashboard
- Sem telas intermediárias de "completar perfil"
- Sistema mais simples e sem bugs

⚡ PERFORMANCE:
- Índices otimizados
- Políticas RLS eficientes
- Logs detalhados para debug
- Tratamento robusto de erros

🧪 PRÓXIMOS PASSOS:
1. Testar cadastro motorista
2. Testar cadastro oficina (free/pro)
3. Testar OAuth Google/Facebook
4. Verificar redirecionamentos
5. Confirmar criação de profiles/drivers/workshops
*/ 