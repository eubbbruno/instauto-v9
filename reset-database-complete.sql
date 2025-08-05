-- 🚨 RESET COMPLETO DO BANCO - ESTRUTURA SUPER SIMPLES

-- DELETAR TUDO PRIMEIRO
DROP TABLE IF EXISTS workshops CASCADE;
DROP TABLE IF EXISTS drivers CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- CRIAR TABELA PROFILES SIMPLES
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('motorista', 'oficina')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS SIMPLES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- POLÍTICA: Usuários podem ler/editar apenas seu próprio perfil
CREATE POLICY "Users can manage own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

-- FUNÇÃO PARA CRIAR PROFILE AUTOMATICAMENTE
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'motorista')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- TRIGGER PARA CRIAR PROFILE AUTOMATICAMENTE
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- VERIFICAR SE CRIOU TUDO
SELECT 'Tabelas criadas:' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

SELECT 'Políticas RLS:' as status;  
SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';