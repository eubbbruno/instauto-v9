-- 🗑️ SCRIPT SEGURO PARA LIMPAR DADOS DE TESTE - SUPABASE
-- ⚠️ CUIDADO: Este script vai DELETAR TODOS os usuários e dados!
-- ✅ SEGURO: Só deleta tabelas que existem

-- ==================================================
-- 1️⃣ VERIFICAR QUAIS TABELAS EXISTEM
-- ==================================================

-- Listar todas as tabelas do seu schema public
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- ==================================================
-- 2️⃣ DELETAR DADOS (apenas tabelas que existem)
-- ==================================================

-- Deletar agendamentos se existir
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agendamentos') THEN
        DELETE FROM agendamentos WHERE true;
        RAISE NOTICE 'Tabela agendamentos limpa ✅';
    ELSE
        RAISE NOTICE 'Tabela agendamentos não existe - pulando';
    END IF;
END $$;

-- Deletar drivers se existir
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'drivers') THEN
        DELETE FROM drivers WHERE true;
        RAISE NOTICE 'Tabela drivers limpa ✅';
    ELSE
        RAISE NOTICE 'Tabela drivers não existe - pulando';
    END IF;
END $$;

-- Deletar workshops se existir
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'workshops') THEN
        DELETE FROM workshops WHERE true;
        RAISE NOTICE 'Tabela workshops limpa ✅';
    ELSE
        RAISE NOTICE 'Tabela workshops não existe - pulando';
    END IF;
END $$;

-- Deletar profiles se existir
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        DELETE FROM profiles WHERE true;
        RAISE NOTICE 'Tabela profiles limpa ✅';
    ELSE
        RAISE NOTICE 'Tabela profiles não existe - pulando';
    END IF;
END $$;

-- ==================================================
-- 3️⃣ DELETAR USUÁRIOS DO AUTH (sempre existe)
-- ==================================================

-- Deletar todos os usuários da autenticação
DELETE FROM auth.users WHERE true;
RAISE NOTICE 'Usuários auth.users deletados ✅';

-- Limpar sessões ativas
DELETE FROM auth.sessions WHERE true;
RAISE NOTICE 'Sessões limpas ✅';

-- Limpar tokens de refresh
DELETE FROM auth.refresh_tokens WHERE true;
RAISE NOTICE 'Tokens de refresh limpos ✅';

-- ==================================================
-- 4️⃣ VERIFICAÇÃO FINAL
-- ==================================================

-- Verificar contagem das tabelas que existem
DO $$
DECLARE
    profiles_count INTEGER := 0;
    drivers_count INTEGER := 0;
    workshops_count INTEGER := 0;
    agendamentos_count INTEGER := 0;
    users_count INTEGER := 0;
BEGIN
    -- Contar profiles se existir
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        SELECT count(*) INTO profiles_count FROM profiles;
    END IF;
    
    -- Contar drivers se existir
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'drivers') THEN
        SELECT count(*) INTO drivers_count FROM drivers;
    END IF;
    
    -- Contar workshops se existir
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'workshops') THEN
        SELECT count(*) INTO workshops_count FROM workshops;
    END IF;
    
    -- Contar agendamentos se existir
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agendamentos') THEN
        SELECT count(*) INTO agendamentos_count FROM agendamentos;
    END IF;
    
    -- Contar usuários auth (sempre existe)
    SELECT count(*) INTO users_count FROM auth.users;
    
    -- Mostrar resultados
    RAISE NOTICE '==========================================';
    RAISE NOTICE '📊 RESULTADO DA LIMPEZA:';
    RAISE NOTICE 'profiles: % registros', profiles_count;
    RAISE NOTICE 'drivers: % registros', drivers_count;
    RAISE NOTICE 'workshops: % registros', workshops_count;
    RAISE NOTICE 'agendamentos: % registros', agendamentos_count;
    RAISE NOTICE 'auth.users: % registros', users_count;
    RAISE NOTICE '==========================================';
    
    IF profiles_count = 0 AND drivers_count = 0 AND workshops_count = 0 AND agendamentos_count = 0 AND users_count = 0 THEN
        RAISE NOTICE '✅ LIMPEZA COMPLETA - TODOS OS DADOS FORAM REMOVIDOS!';
    ELSE
        RAISE NOTICE '⚠️ ALGUNS DADOS AINDA EXISTEM - VERIFIQUE MANUALMENTE';
    END IF;
END $$; 