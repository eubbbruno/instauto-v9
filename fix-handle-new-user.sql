-- 🔧 FIX: Correção da função handle_new_user
-- Execute este script no SQL Editor do Supabase

-- 1. DELETAR FUNÇÃO EXISTENTE (se houver problema)
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. CRIAR FUNÇÃO CORRIGIDA
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_type_value TEXT;
    user_name_value TEXT;
BEGIN
    -- Extrair valores do metadata com fallbacks seguros
    user_type_value := COALESCE(NEW.raw_user_meta_data->>'type', 'motorista');
    user_name_value := COALESCE(
        NEW.raw_user_meta_data->>'name', 
        NEW.raw_user_meta_data->>'full_name',
        NEW.email
    );
    
    -- Inserir na tabela profiles com verificação de erro
    BEGIN
        INSERT INTO public.profiles (id, email, name, type, created_at, updated_at)
        VALUES (
            NEW.id,
            NEW.email,
            user_name_value,
            user_type_value,
            NOW(),
            NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            updated_at = NOW();
            
    EXCEPTION WHEN OTHERS THEN
        -- Log do erro (opcional)
        RAISE LOG 'Erro ao criar profile para usuário %: %', NEW.id, SQLERRM;
        -- Não falhar o trigger, apenas logar
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. CRIAR TRIGGER CORRIGIDO
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. VERIFICAR SE FUNCIONOU
SELECT 'Função handle_new_user criada com sucesso!' as status; 