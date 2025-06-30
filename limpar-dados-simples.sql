-- 🗑️ SCRIPT SUPER SIMPLES - Limpar dados Supabase
-- Execute uma linha por vez se quiser ir devagar

-- 1️⃣ Primeiro: Ver quais tabelas existem
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- 2️⃣ Deletar dados das tabelas (execute só as que existem)
-- DELETE FROM agendamentos;  -- Execute só se a tabela existir
-- DELETE FROM drivers;       -- Execute só se a tabela existir  
-- DELETE FROM workshops;     -- Execute só se a tabela existir
-- DELETE FROM profiles;      -- Execute só se a tabela existir

-- 3️⃣ Deletar usuários do Auth (sempre existem)
DELETE FROM auth.users;
DELETE FROM auth.sessions;
DELETE FROM auth.refresh_tokens;

-- 4️⃣ Verificar se limpou tudo
SELECT 'auth.users' as tabela, count(*) as total FROM auth.users;
-- Adicione outras verificações conforme as tabelas que você tem 