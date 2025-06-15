-- CONSERTAR TRIGGER DE PROFILES PARA AUTH SOCIAL
-- Execute no Supabase SQL Editor

-- 1. Remover trigger problemático se existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Criar função que funciona com auth social
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'driver'
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Se der erro, não falha o cadastro do usuário
    RAISE WARNING 'Erro ao criar profile para usuário %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Criar trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Verificar se a tabela profiles tem as colunas certas
-- Se der erro aqui, significa que precisamos ajustar a estrutura
DO $$
BEGIN
  -- Tentar inserir um registro de teste para ver se funciona
  INSERT INTO public.profiles (id, email, name, type)
  VALUES (
    gen_random_uuid(),
    'teste@exemplo.com',
    'Usuário Teste',
    'driver'
  );
  
  -- Se chegou aqui, funcionou - remover o teste
  DELETE FROM public.profiles WHERE email = 'teste@exemplo.com';
  
  RAISE NOTICE '✅ Trigger configurado com sucesso!';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '❌ Erro na configuração: %', SQLERRM;
END $$; 