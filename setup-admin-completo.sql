-- 🚀 SETUP COMPLETO PARA ADMIN - EXECUTE ESTE ÚNICO SCRIPT
-- Este script resolve todos os problemas de uma vez

-- ============================================================================
-- STEP 1: CORRIGIR CONSTRAINT PARA PERMITIR 'admin'
-- ============================================================================

-- Remover constraint antiga
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_type_check;

-- Adicionar nova constraint que inclui 'admin'
ALTER TABLE profiles ADD CONSTRAINT profiles_type_check 
CHECK (type IN ('motorista', 'oficina', 'admin'));

-- ============================================================================
-- STEP 2: ADICIONAR CAMPO 'name' SE NÃO EXISTIR
-- ============================================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND table_schema = 'public' 
        AND column_name = 'name'
    ) THEN
        ALTER TABLE profiles ADD COLUMN name TEXT;
        RAISE NOTICE 'Campo name adicionado à tabela profiles';
    ELSE
        RAISE NOTICE 'Campo name já existe na tabela profiles';
    END IF;
END $$;

-- ============================================================================
-- STEP 3: CRIAR USUÁRIO ADMIN
-- ============================================================================

-- Inserir profile admin (substitua o UUID pelo real)
INSERT INTO profiles (
  id,
  email,
  name,
  type,
  created_at
) VALUES (
  'b80e798c-fa25-4e82-80a0-3447326ac007', -- UUID do usuário criado no Dashboard
  'admin@instauto.com.br',
  'Administrador InstaAuto',
  'admin',
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  type = 'admin',
  name = 'Administrador InstaAuto';

-- ============================================================================
-- STEP 4: CRIAR POLÍTICAS RLS PARA ADMIN
-- ============================================================================

-- Política para admins acessarem todos os profiles
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

-- Política para admins acessarem todos os workshops
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

-- ============================================================================
-- STEP 5: VERIFICAÇÕES FINAIS
-- ============================================================================

-- Verificar se o admin foi criado
SELECT 
    'USUÁRIO ADMIN CRIADO:' as status,
    id,
    email,
    name,
    type,
    created_at
FROM profiles 
WHERE type = 'admin';

-- Verificar constraint
SELECT 
    'CONSTRAINT ATUALIZADA:' as status,
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'profiles'::regclass 
AND contype = 'c'
AND conname = 'profiles_type_check';

-- Verificar políticas
SELECT 
    'POLÍTICAS RLS CRIADAS:' as status,
    tablename,
    policyname
FROM pg_policies 
WHERE schemaname = 'public' 
AND policyname LIKE '%Admin%'
ORDER BY tablename, policyname;

-- ============================================================================
-- INSTRUÇÕES FINAIS
-- ============================================================================

/*
🎯 PRÓXIMOS PASSOS:

1. ✅ Execute este script no Supabase SQL Editor
2. ✅ Faça login com admin@instauto.com.br no /login
3. ✅ Será redirecionado automaticamente para /admin
4. ✅ Acesse /admin/demo-users para criar usuários de teste
5. ✅ Acesse /admin/seed para importar oficinas reais

🔐 CREDENCIAIS ADMIN:
Email: admin@instauto.com.br
Senha: (a que você definiu no Supabase Dashboard)
Acesso: /admin

✨ TUDO PRONTO PARA USO!
*/
