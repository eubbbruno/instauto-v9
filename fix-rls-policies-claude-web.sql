-- CORRECAO RLS POLICIES - Sugestao Claude Web
-- Permitir usuarios criarem proprio profile apos OAuth

-- Habilitar RLS se nao estiver habilitado
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

-- Remover politicas existentes que podem estar conflitando
DROP POLICY IF EXISTS \
Users
can
insert
own
profile\ ON profiles;
DROP POLICY IF EXISTS \Users
can
read
own
profile\ ON profiles;
DROP POLICY IF EXISTS \Users
can
update
own
profile\ ON profiles;
DROP POLICY IF EXISTS \Users
can
insert
own
driver\ ON drivers;
DROP POLICY IF EXISTS \Users
can
read
own
driver\ ON drivers;

-- Politicas para PROFILES
CREATE POLICY \Users
can
insert
own
profile\ ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY \Users
can
read
own
profile\ ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY \Users
can
update
own
profile\ ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Politicas para DRIVERS
CREATE POLICY \Users
can
insert
own
driver\ ON drivers
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY \Users
can
read
own
driver\ ON drivers
  FOR SELECT USING (auth.uid() = profile_id);

-- Verificar se politicas foram criadas
SELECT tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('profiles', 'drivers')
ORDER BY tablename, policyname;
