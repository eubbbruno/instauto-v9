-- Script para criar usuário administrador do sistema InstaAuto
-- Execute este script no Supabase SQL Editor

-- 1. Primeiro vamos criar o profile admin diretamente
-- (O usuário de auth será criado via interface do Supabase)

-- Inserir profile admin
INSERT INTO profiles (
  id,
  email,
  name,
  type,
  created_at
) VALUES (
  'b80e798c-fa25-4e82-80a0-3447326ac007', -- ID temporário, substitua pelo ID real do usuário
  'admin@instauto.com.br',
  'Administrador InstaAuto',
  'admin',
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  type = 'admin',
  name = 'Administrador InstaAuto';

-- 2. Adicionar política RLS para admins acessarem tudo
DROP POLICY IF EXISTS "Admins can access all profiles" ON profiles;
CREATE POLICY "Admins can access all profiles"
  ON profiles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.type = 'admin'
    )
  );

-- 3. Política para admins acessarem workshops
DROP POLICY IF EXISTS "Admins can access all workshops" ON workshops;
CREATE POLICY "Admins can access all workshops"
  ON workshops FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.type = 'admin'
    )
  );

-- 4. Verificar se as políticas existem antes de criar
DO $$
BEGIN
  -- Política para profiles
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Admins can access all profiles'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can access all profiles"
      ON profiles FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.type = ''admin''
        )
      )';
  END IF;

  -- Política para workshops
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'workshops' 
    AND policyname = 'Admins can access all workshops'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can access all workshops"
      ON workshops FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.type = ''admin''
        )
      )';
  END IF;
END $$;

-- 4. Comentários de instruções
COMMENT ON TABLE profiles IS 'Tabela de perfis de usuários. Type ''admin'' tem acesso total ao sistema.';

-- 5. Exemplo de como criar o usuário admin via Supabase Dashboard:
/*
PASSO A PASSO PARA CRIAR ADMIN:

1. Vá para Supabase Dashboard → Authentication → Users
2. Clique em "Add user"
3. Preencha:
   - Email: admin@instauto.com.br
   - Password: (senha segura)
   - Email Confirm: true (para ativar imediatamente)
   
4. Após criar, copie o UUID do usuário criado
5. Execute UPDATE abaixo substituindo o ID:

UPDATE profiles 
SET id = 'UUID_DO_USUARIO_CRIADO'
WHERE email = 'admin@instauto.com.br';

Ou simplesmente delete o registro temporário e insira novamente:

DELETE FROM profiles WHERE email = 'admin@instauto.com.br';
INSERT INTO profiles (id, email, full_name, type, created_at, updated_at)
VALUES ('UUID_DO_USUARIO_CRIADO', 'admin@instauto.com.br', 'Administrador InstaAuto', 'admin', NOW(), NOW());
*/

-- 6. Query para verificar se foi criado corretamente
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.type,
  p.created_at,
  au.email_confirmed_at
FROM profiles p
LEFT JOIN auth.users au ON au.id = p.id
WHERE p.type = 'admin';
