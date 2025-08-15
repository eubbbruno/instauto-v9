-- 🔧 RESET TOTAL DO BANCO - SOLUÇÃO DEFINITIVA
-- ⚠️ CUIDADO: Isso apaga TODOS os dados! Execute no Supabase SQL Editor

-- ============================================================================
-- STEP 1: LIMPEZA TOTAL
-- ============================================================================

-- 1. Desabilitar triggers temporariamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- 2. Limpar tabelas na ordem correta
DELETE FROM workshops;
DELETE FROM drivers;
DELETE FROM profiles;

-- ============================================================================
-- STEP 2: CORRIGIR ESTRUTURA
-- ============================================================================

-- 3. Recriar constraint com ADMIN incluído
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_type_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_type_check 
  CHECK (type IN ('motorista', 'oficina', 'admin'));

-- ============================================================================
-- STEP 3: CRIAR FUNÇÃO DE TRIGGER CORRETA
-- ============================================================================

-- 4. Criar função de trigger CORRETA
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Criar profile básico para todo novo usuário
  INSERT INTO public.profiles (id, email, name, type)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'user_type', 'motorista')
  );
  
  -- Se for oficina, criar registro na workshops
  IF (new.raw_user_meta_data->>'user_type' = 'oficina') THEN
    INSERT INTO public.workshops (profile_id, name, plan_type)
    VALUES (
      new.id, 
      COALESCE(new.raw_user_meta_data->>'name', 'Oficina'),
      COALESCE(new.raw_user_meta_data->>'plan_type', 'free')
    );
  END IF;
  
  -- Se for motorista, criar registro na drivers
  IF (new.raw_user_meta_data->>'user_type' = 'motorista') THEN
    INSERT INTO public.drivers (profile_id)
    VALUES (new.id);
  END IF;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- STEP 4: RECRIAR TRIGGER
-- ============================================================================

-- 5. Recriar trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- STEP 5: CRIAR ADMIN MANUALMENTE
-- ============================================================================

-- 6. Criar admin na tabela auth (SE NÃO EXISTIR)
-- IMPORTANTE: Substitua 'SUA_SENHA_ADMIN' por uma senha forte!
DO $$
BEGIN
  -- Verificar se admin já existe
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@instauto.com.br') THEN
    -- Criar usuário admin na tabela auth
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_user_meta_data,
      is_super_admin
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated', 
      'admin@instauto.com.br',
      crypt('admin123', gen_salt('bf')), -- MUDE ESTA SENHA!
      NOW(),
      NOW(),
      NOW(),
      '{"user_type": "admin", "name": "Administrador"}'::jsonb,
      false
    );
  END IF;
END $$;

-- 7. Criar profile admin
INSERT INTO profiles (id, email, name, type)
SELECT id, email, 'Administrador InstaAuto', 'admin'
FROM auth.users 
WHERE email = 'admin@instauto.com.br'
ON CONFLICT (id) DO UPDATE SET 
  type = 'admin',
  name = 'Administrador InstaAuto';

-- ============================================================================
-- STEP 6: VERIFICAÇÕES FINAIS
-- ============================================================================

-- Verificar se tudo foi criado
SELECT 'ESTRUTURA VERIFICADA:' as status;

SELECT 'Admin criado:' as status, email, name, type 
FROM profiles WHERE type = 'admin';

SELECT 'Constraint atualizada:' as status, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'profiles'::regclass 
AND conname = 'profiles_type_check';

SELECT 'Trigger ativo:' as status, tgname 
FROM pg_trigger 
WHERE tgrelid = 'auth.users'::regclass 
AND tgname = 'on_auth_user_created';

SELECT '✅ RESET COMPLETO FINALIZADO!' as status;
