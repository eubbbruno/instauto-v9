-- 🔧 CLAUDE WEB - CRIAR PROFILE ADMIN
-- Execute APÓS criar o usuário no Dashboard

-- PASSO 4: Criar profile admin
DO $$
DECLARE
  admin_id UUID;
BEGIN
  SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@instauto.com.br';
  
  IF admin_id IS NULL THEN
    RAISE EXCEPTION 'Admin não encontrado! Crie primeiro no Dashboard.';
  END IF;
  
  -- Criar/atualizar profile admin
  INSERT INTO profiles (id, email, name, type)
  VALUES (admin_id, 'admin@instauto.com.br', 'Administrador', 'admin')
  ON CONFLICT (id) DO UPDATE 
  SET type = 'admin', name = 'Administrador';
  
  RAISE NOTICE 'Admin profile criado/atualizado com ID: %', admin_id;
END $$;

-- PASSO 5: Verificar se foi criado
SELECT 
  '✅ ADMIN VERIFICAÇÃO:' as status,
  * 
FROM profiles 
WHERE email = 'admin@instauto.com.br';

SELECT '🎯 Agora teste o login!' as status;
