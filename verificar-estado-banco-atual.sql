-- 🔍 SCRIPT PARA VERIFICAR ESTADO ATUAL DO BANCO
-- Execute este script no Supabase SQL Editor para ver o que já existe

-- ==================================================
-- 📊 VERIFICAR TABELAS EXISTENTES
-- ==================================================

SELECT 
    '📋 TABELAS EXISTENTES' as categoria,
    table_name as nome,
    table_type as tipo
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- ==================================================
-- 🔍 VERIFICAR COLUNAS DA TABELA PROFILES
-- ==================================================

SELECT 
    '👤 PROFILES - COLUNAS' as categoria,
    column_name as nome,
    data_type as tipo,
    is_nullable as nullable,
    column_default as padrao
FROM information_schema.columns 
WHERE table_name = 'profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- ==================================================
-- 🔍 VERIFICAR COLUNAS DA TABELA WORKSHOPS
-- ==================================================

SELECT 
    '🔧 WORKSHOPS - COLUNAS' as categoria,
    column_name as nome,
    data_type as tipo,
    is_nullable as nullable,
    column_default as padrao
FROM information_schema.columns 
WHERE table_name = 'workshops' AND table_schema = 'public'
ORDER BY ordinal_position;

-- ==================================================
-- 🔍 VERIFICAR COLUNAS DA TABELA DRIVERS
-- ==================================================

SELECT 
    '🚗 DRIVERS - COLUNAS' as categoria,
    column_name as nome,
    data_type as tipo,
    is_nullable as nullable,
    column_default as padrao
FROM information_schema.columns 
WHERE table_name = 'drivers' AND table_schema = 'public'
ORDER BY ordinal_position;

-- ==================================================
-- ⚙️ VERIFICAR FUNÇÕES EXISTENTES
-- ==================================================

SELECT 
    '⚙️ FUNÇÕES' as categoria,
    routine_name as nome,
    routine_type as tipo
FROM information_schema.routines 
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- ==================================================
-- 🔗 VERIFICAR TRIGGERS EXISTENTES
-- ==================================================

SELECT 
    '🔗 TRIGGERS' as categoria,
    trigger_name as nome,
    event_manipulation as evento,
    event_object_table as tabela
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY trigger_name;

-- ==================================================
-- 🔒 VERIFICAR POLÍTICAS RLS
-- ==================================================

SELECT 
    '🔒 POLÍTICAS RLS' as categoria,
    tablename as tabela,
    policyname as nome,
    permissive as permissiva,
    cmd as comando
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ==================================================
-- 📊 VERIFICAR DADOS EXISTENTES
-- ==================================================

-- Contar registros em cada tabela principal
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    -- Profiles
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
        SELECT COUNT(*) INTO table_count FROM public.profiles;
        RAISE NOTICE '📊 PROFILES: % registros', table_count;
    ELSE
        RAISE NOTICE '📊 PROFILES: tabela não existe';
    END IF;
    
    -- Drivers
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'drivers') THEN
        SELECT COUNT(*) INTO table_count FROM public.drivers;
        RAISE NOTICE '📊 DRIVERS: % registros', table_count;
    ELSE
        RAISE NOTICE '📊 DRIVERS: tabela não existe';
    END IF;
    
    -- Workshops
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'workshops') THEN
        SELECT COUNT(*) INTO table_count FROM public.workshops;
        RAISE NOTICE '📊 WORKSHOPS: % registros', table_count;
    ELSE
        RAISE NOTICE '📊 WORKSHOPS: tabela não existe';
    END IF;
END $$;

-- ==================================================
-- 🔍 VERIFICAR EXTENSÕES HABILITADAS
-- ==================================================

SELECT 
    '🔌 EXTENSÕES' as categoria,
    extname as nome,
    extversion as versao
FROM pg_extension
ORDER BY extname;

-- ==================================================
-- 📝 RESUMO FINAL
-- ==================================================

SELECT 
    '🎯 RESUMO' as categoria,
    'Verificação completa do banco realizada' as resultado,
    'Veja os resultados acima para entender o estado atual' as instrucao; 