-- 🛡️ CORRIGIR RLS POLICIES - POLÍTICAS CORRETAS DE SEGURANÇA
-- Execute no Supabase SQL Editor APÓS o reset do banco

-- ============================================================================
-- POLÍTICAS PARA PROFILES
-- ============================================================================

-- Limpar políticas antigas
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can access all profiles" ON profiles;

-- Políticas básicas para usuários
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas especiais para ADMIN
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND type = 'admin'
    )
  );

CREATE POLICY "Admins can manage all profiles" ON profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND type = 'admin'
    )
  );

-- ============================================================================
-- POLÍTICAS PARA WORKSHOPS
-- ============================================================================

-- Limpar políticas antigas
DROP POLICY IF EXISTS "Workshops can manage own data" ON workshops;
DROP POLICY IF EXISTS "Admins can access all workshops" ON workshops;

-- Oficinas podem gerenciar próprios dados
CREATE POLICY "Workshops can manage own data" ON workshops
  FOR ALL USING (auth.uid() = profile_id);

-- Admins podem acessar todas as workshops
CREATE POLICY "Admins can access all workshops" ON workshops
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND type = 'admin'
    )
  );

-- Motoristas podem VER workshops (para busca)
CREATE POLICY "Motoristas can view workshops" ON workshops
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND type = 'motorista'
    )
  );

-- ============================================================================
-- POLÍTICAS PARA DRIVERS
-- ============================================================================

-- Limpar políticas antigas
DROP POLICY IF EXISTS "Drivers can manage own data" ON drivers;
DROP POLICY IF EXISTS "Admins can access all drivers" ON drivers;

-- Motoristas podem gerenciar próprios dados
CREATE POLICY "Drivers can manage own data" ON drivers
  FOR ALL USING (auth.uid() = profile_id);

-- Admins podem acessar todos os drivers
CREATE POLICY "Admins can access all drivers" ON drivers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND type = 'admin'
    )
  );

-- ============================================================================
-- VERIFICAÇÕES FINAIS
-- ============================================================================

-- Verificar políticas criadas
SELECT 'POLÍTICAS RLS CRIADAS:' as status;
SELECT 
  tablename,
  policyname,
  cmd as acao
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

SELECT '✅ RLS POLICIES CONFIGURADAS!' as status;
