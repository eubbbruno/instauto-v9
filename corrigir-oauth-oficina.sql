-- 🔧 CORREÇÃO CRÍTICA: OAuth de Oficina redirecionando errado
-- Problema: handle_new_user não captura tipo correto dos parâmetros OAuth

-- ==================================================
-- 1️⃣ DIAGNOSTICAR PROBLEMA ATUAL
-- ==================================================

-- Ver perfis criados recentemente (para debug)
SELECT 
    id,
    email,
    name,
    type,
    created_at,
    '-- Perfil criado via OAuth --' as info
FROM public.profiles 
ORDER BY created_at DESC 
LIMIT 5;

-- Ver se há oficinas na tabela workshops
SELECT 
    w.id,
    w.business_name,
    w.plan_type,
    p.email,
    p.type as profile_type,
    '-- Dados de oficina --' as info
FROM public.workshops w
JOIN public.profiles p ON w.profile_id = p.id
ORDER BY w.created_at DESC
LIMIT 5;

-- ==================================================
-- 2️⃣ CORRIGIR FUNÇÃO HANDLE_NEW_USER
-- ==================================================

-- Remover função problemática
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP TRIGGER IF EXISTS new_user_trigger ON auth.users;

-- Criar função MELHORADA que processa OAuth corretamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_name_value TEXT;
    user_type_value TEXT;
    plan_type_value TEXT;
    profile_exists BOOLEAN := FALSE;
BEGIN
    -- Debug: Log dos dados recebidos
    RAISE LOG 'OAUTH DEBUG - ID: %, Email: %, Metadata: %', 
        NEW.id, NEW.email, NEW.raw_user_meta_data;
    
    -- Verificar se o perfil já existe
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
    
    -- CRÍTICO: Extrair tipo com prioridade para metadados OAuth
    user_type_value := COALESCE(
        NEW.raw_user_meta_data->>'type',           -- Primeiro: metadata do signup
        NEW.raw_app_meta_data->>'type',            -- Segundo: app metadata  
        'motorista'                                -- Último: fallback
    );
    
    -- Extrair plan_type se for oficina
    plan_type_value := COALESCE(
        NEW.raw_user_meta_data->>'plan_type',
        'free'  -- Default para oficinas
    );
    
    -- Validar tipo (só aceitar valores válidos)
    IF user_type_value NOT IN ('motorista', 'oficina') THEN
        user_type_value := 'motorista';
    END IF;
    
    -- Log do que vai ser criado
    RAISE LOG 'Criando profile: Tipo=%, Nome=%, PlanType=%', 
        user_type_value, user_name_value, plan_type_value;
    
    -- Inserir perfil básico
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
        
        -- Se for oficina E tem business_name nos metadados, criar registro na workshops
        IF user_type_value = 'oficina' THEN
            DECLARE
                business_name_value TEXT;
            BEGIN
                business_name_value := COALESCE(
                    NEW.raw_user_meta_data->>'business_name',
                    user_name_value  -- Usar nome como fallback
                );
                
                INSERT INTO public.workshops (
                    profile_id, 
                    business_name, 
                    plan_type,
                    created_at, 
                    updated_at
                )
                VALUES (
                    NEW.id,
                    business_name_value,
                    plan_type_value,
                    NOW(),
                    NOW()
                );
                
                RAISE LOG 'Workshop criado: % com plano %', business_name_value, plan_type_value;
                
            EXCEPTION WHEN OTHERS THEN
                RAISE LOG 'Erro ao criar workshop: %', SQLERRM;
            END;
        END IF;
        
        -- Se for motorista, criar registro básico na drivers
        IF user_type_value = 'motorista' THEN
            BEGIN
                INSERT INTO public.drivers (profile_id, created_at, updated_at)
                VALUES (NEW.id, NOW(), NOW());
                
                RAISE LOG 'Driver criado para %', NEW.id;
                
            EXCEPTION WHEN OTHERS THEN
                RAISE LOG 'Erro ao criar driver: %', SQLERRM;
            END;
        END IF;
        
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
-- 3️⃣ CORRIGIR PERFIS EXISTENTES (se necessário)
-- ==================================================

-- Se você tem perfis que foram criados como 'motorista' mas deveriam ser 'oficina',
-- pode corrigi-los manualmente. Descomente e ajuste o email:

/*
-- Exemplo: corrigir seu perfil que foi criado errado
UPDATE public.profiles 
SET type = 'oficina' 
WHERE email = 'seu-email@gmail.com'  -- COLOQUE SEU EMAIL AQUI
AND type = 'motorista';

-- Criar registro de workshop para o perfil corrigido
INSERT INTO public.workshops (profile_id, business_name, plan_type)
SELECT id, name, 'free'
FROM public.profiles 
WHERE email = 'seu-email@gmail.com'  -- COLOQUE SEU EMAIL AQUI
AND type = 'oficina'
AND NOT EXISTS (SELECT 1 FROM public.workshops WHERE profile_id = profiles.id);
*/

-- ==================================================
-- 4️⃣ VERIFICAÇÃO
-- ==================================================

-- Verificar função
SELECT 
    'FUNÇÃO ATUALIZADA' as status,
    routine_name, 
    routine_type 
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user' 
AND routine_schema = 'public';

-- Verificar trigger
SELECT 
    'TRIGGER ATIVO' as status,
    trigger_name, 
    event_object_table 
FROM information_schema.triggers 
WHERE trigger_name = 'new_user_trigger';

SELECT '🎉 CORREÇÃO OAUTH OFICINA APLICADA!' as resultado; 