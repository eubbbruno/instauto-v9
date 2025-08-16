-- 🔧 CLAUDE WEB - RLS POLÍTICAS SIMPLES
-- Execute se o login ainda não funcionar

-- DESABILITAR RLS TEMPORARIAMENTE PARA DEBUG
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE workshops DISABLE ROW LEVEL SECURITY;
ALTER TABLE drivers DISABLE ROW LEVEL SECURITY;

SELECT '🔓 RLS DESABILITADO - Teste o login agora!' as status;
SELECT 'Se funcionar, o problema é RLS. Execute a próxima parte.' as status;

-- SE O LOGIN FUNCIONAR COM RLS DESABILITADO, EXECUTE ISTO:

/*
-- Reabilitar com políticas simples
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Limpar políticas antigas
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;

-- Criar políticas simples e funcionais
CREATE POLICY "Enable read access for all users" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on id" ON profiles
  FOR UPDATE USING (auth.uid() = id);

SELECT '✅ RLS reabilitado com políticas simples!' as status;
*/
