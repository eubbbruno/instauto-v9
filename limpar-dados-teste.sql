-- 🗑️ SCRIPT PARA LIMPAR TODOS OS DADOS DE TESTE - SUPABASE
-- ⚠️ CUIDADO: Este script vai DELETAR TODOS os usuários e dados!
-- Use apenas em ambiente de desenvolvimento/teste

-- ==================================================
-- 1️⃣ DELETAR DADOS DAS TABELAS (ordem importante por FK)
-- ==================================================

-- Deletar agendamentos primeiro (tem FK para drivers e workshops)
DELETE FROM agendamentos WHERE true;

-- Deletar drivers (tem FK para profiles)  
DELETE FROM drivers WHERE true;

-- Deletar workshops (tem FK para profiles)
DELETE FROM workshops WHERE true;

-- Deletar profiles (tabela principal)
DELETE FROM profiles WHERE true;

-- ==================================================
-- 2️⃣ DELETAR USUÁRIOS DO AUTH (Supabase Auth)
-- ==================================================

-- ⚠️ IMPORTANTE: Este comando só funciona se você for OWNER do projeto
-- Execute este comando no SQL Editor do Supabase Dashboard

-- Deletar todos os usuários da autenticação
DELETE FROM auth.users WHERE true;

-- Limpar sessões ativas
DELETE FROM auth.sessions WHERE true;

-- Limpar tokens de refresh
DELETE FROM auth.refresh_tokens WHERE true;

-- ==================================================
-- 3️⃣ RESETAR SEQUENCES (IDs auto-incrementais)
-- ==================================================

-- Resetar sequences se necessário
-- SELECT setval('profiles_id_seq', 1, false);
-- SELECT setval('drivers_id_seq', 1, false);  
-- SELECT setval('workshops_id_seq', 1, false);
-- SELECT setval('agendamentos_id_seq', 1, false);

-- ==================================================
-- 4️⃣ VERIFICAÇÃO
-- ==================================================

-- Verificar se tudo foi limpo
SELECT 'profiles' as tabela, count(*) as total FROM profiles
UNION ALL
SELECT 'drivers' as tabela, count(*) as total FROM drivers  
UNION ALL
SELECT 'workshops' as tabela, count(*) as total FROM workshops
UNION ALL
SELECT 'agendamentos' as tabela, count(*) as total FROM agendamentos
UNION ALL
SELECT 'auth.users' as tabela, count(*) as total FROM auth.users;

-- ==================================================
-- ✅ RESULTADO ESPERADO:
-- Todas as contagens devem ser 0 (zero)
-- ================================================== 