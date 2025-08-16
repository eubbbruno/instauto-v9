-- 🔧 CLAUDE WEB - RESET ADMIN COMPLETO
-- Execute este script no Supabase SQL Editor

-- PASSO 1: Verificar situação atual
SELECT 
  'SITUAÇÃO ATUAL ADMIN:' as status,
  au.id,
  au.email,
  au.created_at,
  p.type,
  p.email as profile_email
FROM auth.users au
LEFT JOIN profiles p ON p.id = au.id
WHERE au.email = 'admin@instauto.com.br';

-- PASSO 2: Deletar admin antigo (se existir)
DELETE FROM profiles WHERE email = 'admin@instauto.com.br';
DELETE FROM auth.users WHERE email = 'admin@instauto.com.br';

SELECT '✅ Admin antigo deletado - agora crie no Dashboard!' as status;

/*
🔧 IMPORTANTE: AGORA PARE E FAÇA ISTO:

1. Vá no Supabase Dashboard
2. Authentication → Users → Create User
3. Preencha:
   - Email: admin@instauto.com.br
   - Password: InstaAuto@2024
   - Auto Confirm User: ✓ (MARQUE ESTA OPÇÃO!)
4. Clique em "Create User"
5. DEPOIS execute a próxima parte deste script

*/
