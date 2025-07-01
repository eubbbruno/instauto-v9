-- 🔧 AJUSTES SEGUROS PARA INSTAUTO V7 - SCHEMA ORGANIZADO
-- Execute este script após o script do AI Assistant
-- ✅ SEGURO: Verifica se existe antes de criar

-- ==================================================
-- 1️⃣ VERIFICAR POLÍTICAS EXISTENTES
-- ==================================================

-- Listar todas as políticas atuais
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    cmd,
    qual 
FROM pg_policies 
WHERE tablename IN ('profiles', 'drivers', 'workshops')
ORDER BY tablename, policyname;

-- ==================================================
-- 2️⃣ REMOVER POLÍTICAS CONFLITANTES (se existirem)
-- ==================================================

-- Remover políticas que podem estar duplicadas ou incorretas
DROP POLICY IF EXISTS "Usuários podem inserir seus próprios dados" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios dados" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- ==================================================
-- 3️⃣ CRIAR POLÍTICAS RLS CORRETAS
-- ==================================================

-- Políticas para PROFILES
CREATE POLICY "profiles_insert_own" ON public.profiles
FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_update_own" ON public.profiles  
FOR UPDATE TO authenticated USING (id = auth.uid());

-- Verificar se já existe política de SELECT (se não, criar)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname LIKE '%select%' 
        AND cmd = 'SELECT'
    ) THEN
        EXECUTE 'CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid())';
        RAISE NOTICE 'Política SELECT criada para profiles';
    ELSE
        RAISE NOTICE 'Política SELECT já existe para profiles';
    END IF;
END $$;

-- ==================================================
-- 4️⃣ MELHORAR FUNÇÃO HANDLE_NEW_USER
-- ==================================================

-- Remover função existente para recriar
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP TRIGGER IF EXISTS new_user_trigger ON auth.users;

-- Criar função melhorada e mais robusta
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_name_value TEXT;
    user_type_value TEXT;
    profile_exists BOOLEAN := FALSE;
BEGIN
    -- Verificar se o perfil já existe (evitar duplicatas)
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = NEW.id) INTO profile_exists;
    
    IF profile_exists THEN
        RAISE LOG 'Profile já existe para usuário %', NEW.id;
        RETURN NEW;
    END IF;
    
    -- Extrair nome com múltiplos fallbacks
    user_name_value := COALESCE(
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'full_name', 
        NEW.raw_user_meta_data->>'display_name',
        NEW.raw_user_meta_data->>'user_name',
        split_part(NEW.email, '@', 1),
        'Usuário'
    );
    
    -- Extrair tipo com fallback para motorista
    user_type_value := COALESCE(
        NEW.raw_user_meta_data->>'type',
        'motorista'
    );
    
    -- Validar tipo (só aceitar valores válidos)
    IF user_type_value NOT IN ('motorista', 'oficina') THEN
        user_type_value := 'motorista';
    END IF;
    
    -- Inserir perfil básico com tratamento de erro
    BEGIN
        INSERT INTO public.profiles (id, email, name, type, created_at, updated_at)
        VALUES (
            NEW.id,
            NEW.email,
            user_name_value,
            user_type_value,
            NOW(),
            NOW()
        );
        
        RAISE LOG 'Profile criado: % | % | %', NEW.id, user_name_value, user_type_value;
        
    EXCEPTION 
        WHEN unique_violation THEN
            RAISE LOG 'Profile já existe para %', NEW.id;
        WHEN OTHERS THEN
            RAISE LOG 'Erro ao criar profile para %: %', NEW.id, SQLERRM;
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recriar trigger
CREATE TRIGGER new_user_trigger
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==================================================
-- 5️⃣ VERIFICAÇÃO FINAL
-- ==================================================

-- Listar políticas criadas
SELECT 
    '✅ POLÍTICAS RLS' as tipo,
    tablename, 
    policyname, 
    cmd
FROM pg_policies 
WHERE tablename IN ('profiles', 'drivers', 'workshops')
ORDER BY tablename, cmd, policyname;

-- Verificar função
SELECT 
    '✅ FUNÇÃO' as tipo,
    routine_name, 
    routine_type 
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user' 
AND routine_schema = 'public';

-- Verificar trigger
SELECT 
    '✅ TRIGGER' as tipo,
    trigger_name, 
    event_object_table 
FROM information_schema.triggers 
WHERE trigger_name = 'new_user_trigger';

-- ==================================================
-- 6️⃣ TESTE OPCIONAL
-- ==================================================

-- Testar se consegue inserir um profile (descomente para testar)
/*
DO $$
DECLARE
    test_id UUID := gen_random_uuid();
BEGIN
    -- Simular inserção como authenticated user
    SET LOCAL role = 'authenticated';
    
    INSERT INTO public.profiles (id, email, name, type)
    VALUES (test_id, 'teste@exemplo.com', 'Teste User', 'motorista');
    
    -- Limpar teste
    DELETE FROM public.profiles WHERE id = test_id;
    
    RAISE NOTICE '✅ Teste de inserção: OK';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '❌ Teste de inserção falhou: %', SQLERRM;
END $$;
*/

SELECT '🎉 AJUSTES APLICADOS COM SUCESSO!' as status; 