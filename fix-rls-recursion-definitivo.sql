-- ============================================
-- FIX RLS RECURSÃO INFINITA - SOLUÇÃO DEFINITIVA
-- ============================================

-- 1. DESABILITAR RLS TEMPORARIAMENTE
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE workshops DISABLE ROW LEVEL SECURITY;
ALTER TABLE drivers DISABLE ROW LEVEL SECURITY;

-- 2. REMOVER TODAS AS POLÍTICAS EXISTENTES
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_delete_own" ON profiles;

DROP POLICY IF EXISTS "workshops_select_own" ON workshops;
DROP POLICY IF EXISTS "workshops_insert_own" ON workshops;
DROP POLICY IF EXISTS "workshops_update_own" ON workshops;
DROP POLICY IF EXISTS "workshops_delete_own" ON workshops;

DROP POLICY IF EXISTS "drivers_select_own" ON drivers;
DROP POLICY IF EXISTS "drivers_insert_own" ON drivers;
DROP POLICY IF EXISTS "drivers_update_own" ON drivers;
DROP POLICY IF EXISTS "drivers_delete_own" ON drivers;

-- 3. RECRIAR POLÍTICAS SIMPLES SEM RECURSÃO
-- PROFILES: Política básica usando auth.uid()
CREATE POLICY "profiles_select_policy" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_policy" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- WORKSHOPS: Política usando profile_id direto
CREATE POLICY "workshops_select_policy" ON workshops
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "workshops_insert_policy" ON workshops
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "workshops_update_policy" ON workshops
  FOR UPDATE USING (auth.uid() = profile_id);

-- DRIVERS: Política usando profile_id direto
CREATE POLICY "drivers_select_policy" ON drivers
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "drivers_insert_policy" ON drivers
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "drivers_update_policy" ON drivers
  FOR UPDATE USING (auth.uid() = profile_id);

-- 4. REABILITAR RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

-- 5. VERIFICAR SE O PROFILE ADMIN EXISTE
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = '4c7a55d9-b3e9-40f9-8755-df07fa7eb689') THEN
    INSERT INTO profiles (
      id,
      email,
      name,
      type,
      created_at,
      updated_at
    ) VALUES (
      '4c7a55d9-b3e9-40f9-8755-df07fa7eb689',
      'admin@instauto.com.br',
      'Administrador',
      'admin',
      NOW(),
      NOW()
    );
    
    RAISE NOTICE 'Profile admin criado com sucesso!';
  ELSE
    RAISE NOTICE 'Profile admin já existe!';
  END IF;
END $$;

-- 6. TESTAR CONSULTA
SELECT 
  'TESTE RLS' as status,
  id,
  email,
  name,
  type
FROM profiles 
WHERE id = '4c7a55d9-b3e9-40f9-8755-df07fa7eb689';

RAISE NOTICE 'RLS corrigido com sucesso! Recursão infinita eliminada.';
