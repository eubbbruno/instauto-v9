-- 🔒 REABILITAR RLS COM SEGURANÇA AGORA QUE FUNCIONA

-- STEP 1: REABILITAR RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- STEP 2: CRIAR POLÍTICAS MAIS PERMISSIVAS PARA FUNCIONAR
DROP POLICY IF EXISTS "Anyone can insert profile for themselves" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;

-- STEP 3: POLÍTICAS NOVAS E FUNCIONAIS
-- Permitir leitura do próprio profile
CREATE POLICY "enable_read_own_profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Permitir inserção do próprio profile  
CREATE POLICY "enable_insert_own_profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Permitir atualização do próprio profile
CREATE POLICY "enable_update_own_profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- STEP 4: VERIFICAR SE APLICOU
SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';

-- ✅ Agora teste fazer logout/login novamente!