-- Corrigir profile ausente para usuário OAuth
-- ID do usuário: 00e01636-c2ef-440a-9632-4b31e64d846a
-- Email: privatemotelbr@gmail.com

-- 1. Verificar se o usuário existe na tabela auth.users
SELECT id, email, raw_user_meta_data->>'name' as name 
FROM auth.users 
WHERE id = '00e01636-c2ef-440a-9632-4b31e64d846a';

-- 2. Verificar se já existe profile
SELECT * FROM profiles WHERE id = '00e01636-c2ef-440a-9632-4b31e64d846a';

-- 3. Criar profile se não existir (assumindo que é motorista baseado no OAuth)
INSERT INTO profiles (
    id,
    name,
    email,
    type,
    avatar_url,
    created_at,
    updated_at
) VALUES (
    '00e01636-c2ef-440a-9632-4b31e64d846a',
    'Private Motel',
    'privatemotelbr@gmail.com',
    'motorista',
    'https://lh3.googleusercontent.com/a/ACg8ocLQwGeQqZ_2SedLi7D0qNv1I8s_j4r7h2HwuF1-PVG0hP1Lmw=s96-c',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- 4. Criar registro de motorista
INSERT INTO drivers (
    profile_id,
    created_at,
    updated_at
) VALUES (
    '00e01636-c2ef-440a-9632-4b31e64d846a',
    NOW(),
    NOW()
) ON CONFLICT (profile_id) DO NOTHING;

-- 5. Verificar se foi criado corretamente
SELECT 
    p.*,
    d.id as driver_id
FROM profiles p
LEFT JOIN drivers d ON p.id = d.profile_id
WHERE p.id = '00e01636-c2ef-440a-9632-4b31e64d846a';

-- 6. Verificar função handle_new_user
SELECT routine_name, routine_definition 
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user'; 