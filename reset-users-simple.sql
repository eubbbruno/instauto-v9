-- 🧹 LIMPEZA RADICAL DE USUÁRIOS DE TESTE
-- Execute no Supabase SQL Editor

-- 1. Deletar dados relacionados primeiro (foreign keys)
DELETE FROM drivers WHERE profile_id IN (
  SELECT id FROM profiles WHERE email LIKE '%@gmail.com'
);

DELETE FROM workshops WHERE profile_id IN (
  SELECT id FROM profiles WHERE email LIKE '%@gmail.com'
);

-- 2. Deletar profiles
DELETE FROM profiles WHERE email LIKE '%@gmail.com';

-- 3. Verificar limpeza
SELECT 'VERIFICAÇÃO APÓS LIMPEZA:' as status;

SELECT 
  'profiles' as tabela,
  COUNT(*) as total,
  COUNT(CASE WHEN email LIKE '%@gmail.com' THEN 1 END) as gmail_users
FROM profiles
UNION ALL
SELECT 
  'drivers' as tabela,
  COUNT(*) as total,
  0 as gmail_users
FROM drivers
UNION ALL
SELECT 
  'workshops' as tabela,
  COUNT(*) as total,
  0 as gmail_users
FROM workshops;

-- 4. Opcional: Deletar TODOS os dados de teste (CUIDADO!)
-- Descomente apenas se quiser limpar TUDO:

-- DELETE FROM drivers;
-- DELETE FROM workshops; 
-- DELETE FROM profiles;

-- 5. Resetar sequências (se necessário)
-- SELECT setval('profiles_id_seq', 1, false);

SELECT 'LIMPEZA CONCLUÍDA! Agora pode testar com contas novas.' as resultado;