-- 🔍 VERIFICAR SE USUÁRIO FOI CRIADO CORRETAMENTE

-- STEP 1: Ver todos os profiles criados
SELECT 
    id,
    email,
    type,
    created_at
FROM profiles
ORDER BY created_at DESC;

-- STEP 2: Ver dados do auth.users
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at,
    raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC;

-- STEP 3: Contar registros
SELECT 
    'Profiles:' as tabela, 
    COUNT(*) as total 
FROM profiles
UNION ALL
SELECT 
    'Auth Users:' as tabela, 
    COUNT(*) as total 
FROM auth.users;

-- ✅ Execute isso para ver se tudo foi criado!