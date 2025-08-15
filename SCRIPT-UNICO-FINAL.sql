-- 🚀 SCRIPT ÚNICO FINAL - ADAPTA-SE À ESTRUTURA EXISTENTE
-- Execute APENAS este script - resolve tudo de uma vez

-- ============================================================================
-- STEP 1: VERIFICAR E CORRIGIR CONSTRAINT DO TIPO
-- ============================================================================

-- Permitir tipo 'admin' na tabela profiles
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_type_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_type_check 
CHECK (type IN ('motorista', 'oficina', 'admin'));

-- ============================================================================
-- STEP 2: CRIAR COLUNAS QUE FALTAM (SE NECESSÁRIO)
-- ============================================================================

-- Adicionar coluna 'name' se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'name'
    ) THEN
        ALTER TABLE profiles ADD COLUMN name TEXT;
    END IF;
END $$;

-- Adicionar coluna 'phone' se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'phone'
    ) THEN
        ALTER TABLE profiles ADD COLUMN phone TEXT;
    END IF;
END $$;

-- Adicionar coluna 'updated_at' se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE profiles ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- ============================================================================
-- STEP 3: CRIAR TABELA WORKSHOPS (SE NÃO EXISTIR)
-- ============================================================================

CREATE TABLE IF NOT EXISTS workshops (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    address_street TEXT,
    address_city TEXT,
    address_state TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    plan_type TEXT CHECK (plan_type IN ('free', 'pro')) DEFAULT 'free',
    is_active BOOLEAN DEFAULT true,
    is_trial BOOLEAN DEFAULT false,
    trial_starts_at TIMESTAMPTZ,
    trial_ends_at TIMESTAMPTZ,
    rating DECIMAL(3,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- STEP 4: HABILITAR RLS E CRIAR POLÍTICAS ADMIN
-- ============================================================================

-- Habilitar RLS se ainda não estiver
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;

-- Política para admins acessarem TODOS os profiles
DROP POLICY IF EXISTS "Admins can access all profiles" ON profiles;
CREATE POLICY "Admins can access all profiles" ON profiles
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.type = 'admin'
        )
    );

-- Política para admins acessarem TODAS as workshops
DROP POLICY IF EXISTS "Admins can access all workshops" ON workshops;
CREATE POLICY "Admins can access all workshops" ON workshops
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.type = 'admin'
        )
    );

-- ============================================================================
-- STEP 5: CRIAR USUÁRIO ADMIN
-- ============================================================================

-- Inserir/atualizar usuário admin
INSERT INTO profiles (
    id,
    email,
    name,
    type,
    created_at
) VALUES (
    'b80e798c-fa25-4e82-80a0-3447326ac007',
    'admin@instauto.com.br',
    'Admin InstaAuto',
    'admin',
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    type = 'admin',
    name = 'Admin InstaAuto';

-- ============================================================================
-- STEP 6: CRIAR USUÁRIOS DEMO SIMPLES
-- ============================================================================

-- Usuário motorista demo (você precisa criar este no Dashboard primeiro)
INSERT INTO profiles (
    id,
    email,
    name,
    type
) VALUES (
    'demo-motorista-uuid', -- SUBSTITUA pelo UUID real do Dashboard
    'motorista@demo.com',
    'João Demo',
    'motorista'
) ON CONFLICT (id) DO NOTHING;

-- Usuário oficina free demo (você precisa criar este no Dashboard primeiro)
INSERT INTO profiles (
    id,
    email,
    name,
    type
) VALUES (
    'demo-oficina-free-uuid', -- SUBSTITUA pelo UUID real do Dashboard
    'oficina.free@demo.com',
    'Oficina Free Demo',
    'oficina'
) ON CONFLICT (id) DO NOTHING;

-- Workshop para oficina free
INSERT INTO workshops (
    profile_id,
    name,
    plan_type,
    address_city,
    address_state
) VALUES (
    'demo-oficina-free-uuid', -- SUBSTITUA pelo UUID real
    'Oficina Free Demo',
    'free',
    'São Paulo',
    'SP'
) ON CONFLICT (profile_id) DO NOTHING;

-- Usuário oficina pro demo (você precisa criar este no Dashboard primeiro)
INSERT INTO profiles (
    id,
    email,
    name,
    type
) VALUES (
    'demo-oficina-pro-uuid', -- SUBSTITUA pelo UUID real do Dashboard
    'oficina.pro@demo.com',
    'Oficina Pro Demo',
    'oficina'
) ON CONFLICT (id) DO NOTHING;

-- Workshop para oficina pro (com trial de 7 dias)
INSERT INTO workshops (
    profile_id,
    name,
    plan_type,
    address_city,
    address_state,
    is_trial,
    trial_starts_at,
    trial_ends_at
) VALUES (
    'demo-oficina-pro-uuid', -- SUBSTITUA pelo UUID real
    'Oficina Pro Demo',
    'pro',
    'São Paulo',
    'SP',
    true,
    NOW(),
    NOW() + INTERVAL '7 days'
) ON CONFLICT (profile_id) DO NOTHING;

-- ============================================================================
-- STEP 7: VERIFICAÇÕES FINAIS
-- ============================================================================

-- Verificar estrutura da tabela profiles
SELECT 'ESTRUTURA PROFILES ATUALIZADA:' as status;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Verificar constraint atualizada
SELECT 'CONSTRAINT ADMIN ADICIONADA:' as status;
SELECT pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'profiles'::regclass 
AND conname = 'profiles_type_check';

-- Verificar usuário admin criado
SELECT 'USUÁRIO ADMIN CRIADO:' as status;
SELECT id, email, name, type FROM profiles WHERE type = 'admin';

-- Verificar políticas admin
SELECT 'POLÍTICAS ADMIN CRIADAS:' as status;
SELECT tablename, policyname FROM pg_policies 
WHERE policyname LIKE '%Admin%'
ORDER BY tablename;

SELECT '✅ TUDO PRONTO! Admin pode fazer login em /login' as status;
