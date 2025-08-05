-- 🚨 CORREÇÃO EMERGENCIAL: DESABILITAR RLS TEMPORARIAMENTE

-- STEP 1: DESABILITAR RLS NA TABELA PROFILES
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- STEP 2: VERIFICAR SE DESABILITOU
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';

-- STEP 3: TESTAR INSERT MANUAL (deve funcionar agora)
-- Não execute isso, é só exemplo:
-- INSERT INTO profiles (id, email, type) VALUES ('test-id', 'test@test.com', 'motorista');

-- ✅ Agora teste criar usuário na aplicação!