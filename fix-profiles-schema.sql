-- 🔧 CORREÇÃO DO SCHEMA DA TABELA PROFILES
-- Execute este script no Supabase SQL Editor para corrigir problemas de campos

-- STEP 1: Verificar estrutura atual
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- STEP 2: Adicionar campo 'name' se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND table_schema = 'public' 
        AND column_name = 'name'
    ) THEN
        ALTER TABLE profiles ADD COLUMN name TEXT;
        RAISE NOTICE 'Campo name adicionado à tabela profiles';
    ELSE
        RAISE NOTICE 'Campo name já existe na tabela profiles';
    END IF;
END $$;

-- STEP 3: Verificar se workshops table tem profile_id correto
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'workshops' 
        AND table_schema = 'public' 
        AND column_name = 'profile_id'
    ) THEN
        -- Se não tem profile_id, verificar se tem outra estrutura
        RAISE NOTICE 'ATENÇÃO: workshops não tem campo profile_id';
    ELSE
        RAISE NOTICE 'Campo profile_id existe na tabela workshops';
    END IF;
END $$;

-- STEP 4: Verificar estrutura final
SELECT 'ESTRUTURA FINAL PROFILES:' as status;
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'ESTRUTURA WORKSHOPS:' as status;
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'workshops' AND table_schema = 'public'
ORDER BY ordinal_position
LIMIT 10;
