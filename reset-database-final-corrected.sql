-- 🚨 RESET COMPLETO DO BANCO - ESTRUTURA SUPER SIMPLES COM RLS CORRIGIDO

-- STEP 1: DELETAR TUDO PRIMEIRO (IMPORTANTE!)
DROP TABLE IF EXISTS workshops CASCADE;
DROP TABLE IF EXISTS drivers CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- STEP 2: DELETAR FUNÇÕES E TRIGGERS ANTIGOS
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.convert_to_workshop(UUID, TEXT) CASCADE;

-- STEP 3: CRIAR TABELA PROFILES SIMPLES
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('motorista', 'oficina')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- STEP 4: HABILITAR RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- STEP 5: CRIAR POLÍTICAS RLS CORRETAS
-- Política para INSERT (criação de perfil)
CREATE POLICY "Anyone can insert profile for themselves" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Política para SELECT (leitura de perfil)  
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Política para UPDATE (atualização de perfil)
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Política para DELETE (exclusão de perfil)
CREATE POLICY "Users can delete own profile" ON profiles
  FOR DELETE USING (auth.uid() = id);

-- STEP 6: FUNÇÃO PARA CRIAR PROFILE AUTOMATICAMENTE (OPCIONAL)
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
EXCEPTION
  WHEN OTHERS THEN
    -- Se der erro, não falha o cadastro do usuário
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 7: TRIGGER PARA CRIAR PROFILE AUTOMATICAMENTE
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- STEP 8: VERIFICAÇÃO FINAL
SELECT 'Tabelas criadas:' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

SELECT 'Políticas RLS criadas:' as status;  
SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';

-- ✅ PRONTO! Agora deve funcionar!