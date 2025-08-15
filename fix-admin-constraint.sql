-- 🔧 CORREÇÃO PARA PERMITIR TIPO 'admin' NA TABELA PROFILES
-- Execute este script no Supabase SQL Editor

-- STEP 1: Verificar constraint atual
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'profiles'::regclass 
AND contype = 'c';

-- STEP 2: Remover constraint antiga
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_type_check;

-- STEP 3: Adicionar nova constraint que inclui 'admin'
ALTER TABLE profiles ADD CONSTRAINT profiles_type_check 
CHECK (type IN ('motorista', 'oficina', 'admin'));

-- STEP 4: Verificar se foi aplicado
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'profiles'::regclass 
AND contype = 'c';

-- STEP 5: Testar inserção de admin (vai funcionar agora)
SELECT 'Constraint atualizada com sucesso! Agora pode inserir tipo admin.' as status;
