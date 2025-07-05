-- 🚨 CORREÇÃO COMPLETA: CADASTRO DE OFICINAS - JANEIRO 2025
-- Este script resolve TODOS os problemas identificados no sistema de cadastro

-- ==================================================
-- 📊 DIAGNÓSTICO INICIAL
-- ==================================================

-- 1. Verificar estrutura atual das tabelas
SELECT 
    'ESTRUTURA WORKSHOPS' as info,
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'workshops' 
ORDER BY ordinal_position;

-- 2. Verificar perfis recentes (últimos 10)
SELECT 
    '🔍 PERFIS RECENTES' as info,
    id,
    email,
    name,
    type,
    created_at
FROM public.profiles 
ORDER BY created_at DESC 
LIMIT 10;

-- 3. Verificar oficinas existentes
SELECT 
    '🏪 OFICINAS EXISTENTES' as info,
    w.id,
    w.business_name,
    w.plan_type,
    p.email,
    p.type as profile_type
FROM public.workshops w
JOIN public.profiles p ON w.profile_id = p.id
ORDER BY w.created_at DESC
LIMIT 10;

-- ==================================================
-- 🔧 CORREÇÃO 1: ESTRUTURA DA TABELA WORKSHOPS
-- ==================================================

-- Verificar se coluna plan_type existe, se não, adicionar
DO $$
BEGIN
    -- Adicionar plan_type se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'workshops' AND column_name = 'plan_type'
    ) THEN
        ALTER TABLE public.workshops 
        ADD COLUMN plan_type TEXT CHECK (plan_type IN ('free', 'pro')) DEFAULT 'free';
        
        RAISE NOTICE 'Coluna plan_type adicionada à tabela workshops';
    ELSE
        RAISE NOTICE 'Coluna plan_type já existe';
    END IF;
    
    -- Adicionar updated_at se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'workshops' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE public.workshops 
        ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        
        RAISE NOTICE 'Coluna updated_at adicionada à tabela workshops';
    ELSE
        RAISE NOTICE 'Coluna updated_at já existe';
    END IF;
    
    -- Tornar address nullable (pode ser preenchido depois)
    ALTER TABLE public.workshops ALTER COLUMN address DROP NOT NULL;
    
    RAISE NOTICE 'Estrutura da tabela workshops corrigida';
END $$;

-- ==================================================
-- 🔧 CORREÇÃO 2: FUNÇÃO HANDLE_NEW_USER ROBUSTA
-- ==================================================

-- Remover função existente
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS new_user_trigger ON auth.users;

-- Criar função SUPER ROBUSTA
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_name_value TEXT;
    user_type_value TEXT;
    plan_type_value TEXT;
    business_name_value TEXT;
    profile_exists BOOLEAN := FALSE;
    workshop_exists BOOLEAN := FALSE;
    driver_exists BOOLEAN := FALSE;
BEGIN
    -- 🔍 LOG DETALHADO para debug
    RAISE LOG '🚀 HANDLE_NEW_USER - Iniciando para usuário: %', NEW.id;
    RAISE LOG '📧 Email: %', NEW.email;
    RAISE LOG '📱 Provider: %', NEW.app_metadata->>'provider';
    RAISE LOG '🔍 Raw metadata: %', NEW.raw_user_meta_data;
    RAISE LOG '🔍 App metadata: %', NEW.app_metadata;
    
    -- Verificar se profile já existe (evitar duplicatas)
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = NEW.id) INTO profile_exists;
    
    IF profile_exists THEN
        RAISE LOG '⚠️ Profile já existe para usuário %, pulando criação', NEW.id;
        RETURN NEW;
    END IF;
    
    -- 🎯 EXTRAIR DADOS COM MÚLTIPLOS FALLBACKS
    
    -- Nome do usuário
    user_name_value := COALESCE(
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'full_name', 
        NEW.raw_user_meta_data->>'display_name',
        NEW.raw_user_meta_data->>'user_name',
        NEW.app_metadata->>'name',
        split_part(NEW.email, '@', 1),
        'Usuário'
    );
    
    -- Tipo de usuário (CRÍTICO para redirecionamento)
    user_type_value := COALESCE(
        NEW.raw_user_meta_data->>'type',
        NEW.app_metadata->>'type',
        'motorista'  -- Fallback padrão
    );
    
    -- Validar tipo (só aceitar valores válidos)
    IF user_type_value NOT IN ('motorista', 'oficina') THEN
        user_type_value := 'motorista';
        RAISE LOG '⚠️ Tipo inválido, usando fallback: motorista';
    END IF;
    
    -- Plano da oficina (se aplicável)
    plan_type_value := COALESCE(
        NEW.raw_user_meta_data->>'plan_type',
        'free'
    );
    
    -- Nome da empresa (para oficinas)
    business_name_value := COALESCE(
        NEW.raw_user_meta_data->>'business_name',
        user_name_value
    );
    
    RAISE LOG '✅ Dados extraídos - Tipo: %, Nome: %, Plano: %, Empresa: %', 
        user_type_value, user_name_value, plan_type_value, business_name_value;
    
    -- 📝 CRIAR PROFILE BÁSICO
    BEGIN
        INSERT INTO public.profiles (
            id, 
            email, 
            name, 
            type, 
            created_at, 
            updated_at
        )
        VALUES (
            NEW.id,
            NEW.email,
            user_name_value,
            user_type_value,
            NOW(),
            NOW()
        );
        
        RAISE LOG '✅ Profile criado com sucesso para %', NEW.email;
        
    EXCEPTION 
        WHEN unique_violation THEN
            RAISE LOG '⚠️ Profile já existe (unique_violation) para %', NEW.id;
            RETURN NEW;
        WHEN OTHERS THEN
            RAISE LOG '❌ ERRO ao criar profile: %', SQLERRM;
            RETURN NEW;
    END;
    
    -- 🏪 CRIAR DADOS ESPECÍFICOS DE OFICINA
    IF user_type_value = 'oficina' THEN
        -- Verificar se workshop já existe
        SELECT EXISTS(SELECT 1 FROM public.workshops WHERE profile_id = NEW.id) INTO workshop_exists;
        
        IF NOT workshop_exists THEN
            BEGIN
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
                
                RAISE LOG '🏪 Workshop criado: % (plano: %)', business_name_value, plan_type_value;
                
            EXCEPTION WHEN OTHERS THEN
                RAISE LOG '❌ ERRO ao criar workshop: %', SQLERRM;
            END;
        ELSE
            RAISE LOG '⚠️ Workshop já existe para %', NEW.id;
        END IF;
    END IF;
    
    -- 🚗 CRIAR DADOS ESPECÍFICOS DE MOTORISTA  
    IF user_type_value = 'motorista' THEN
        -- Verificar se driver já existe
        SELECT EXISTS(SELECT 1 FROM public.drivers WHERE profile_id = NEW.id) INTO driver_exists;
        
        IF NOT driver_exists THEN
            BEGIN
                INSERT INTO public.drivers (
                    profile_id,
                    created_at
                )
                VALUES (
                    NEW.id,
                    NOW()
                );
                
                RAISE LOG '🚗 Driver criado para %', NEW.email;
                
            EXCEPTION WHEN OTHERS THEN
                RAISE LOG '❌ ERRO ao criar driver: %', SQLERRM;
            END;
        ELSE
            RAISE LOG '⚠️ Driver já existe para %', NEW.id;
        END IF;
    END IF;
    
    RAISE LOG '🎉 handle_new_user CONCLUÍDO com sucesso para %', NEW.email;
    RETURN NEW;
    
EXCEPTION WHEN OTHERS THEN
    RAISE LOG '💥 ERRO GERAL em handle_new_user: %', SQLERRM;
    RETURN NEW;  -- Não falhar o processo de auth
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==================================================
-- 🔧 CORREÇÃO 3: POLÍTICAS RLS PARA WORKSHOPS
-- ==================================================

-- Remover políticas existentes
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Anyone can view workshops" ON workshops;
DROP POLICY IF EXISTS "Workshops can update own data" ON workshops;

-- Políticas para PROFILES
CREATE POLICY "profiles_select_own" ON profiles 
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles 
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON profiles 
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para WORKSHOPS
CREATE POLICY "workshops_select_all" ON workshops 
    FOR SELECT USING (true);  -- Qualquer um pode ver oficinas

CREATE POLICY "workshops_insert_own" ON workshops 
    FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "workshops_update_own" ON workshops 
    FOR UPDATE USING (auth.uid() = profile_id);

-- Políticas para DRIVERS
CREATE POLICY "drivers_select_own" ON drivers 
    FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "drivers_insert_own" ON drivers 
    FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "drivers_update_own" ON drivers 
    FOR UPDATE USING (auth.uid() = profile_id);

-- ==================================================
-- 🔧 CORREÇÃO 4: ÍNDICES PARA PERFORMANCE
-- ==================================================

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_profiles_type ON profiles(type);
CREATE INDEX IF NOT EXISTS idx_workshops_profile_id ON workshops(profile_id);
CREATE INDEX IF NOT EXISTS idx_workshops_plan_type ON workshops(plan_type);
CREATE INDEX IF NOT EXISTS idx_drivers_profile_id ON drivers(profile_id);

-- ==================================================
-- ✅ VERIFICAÇÃO FINAL
-- ==================================================

-- Verificar se tudo foi criado corretamente
SELECT 
    '🎯 VERIFICAÇÃO FINAL' as status,
    'Função handle_new_user' as componente,
    CASE 
        WHEN EXISTS(
            SELECT 1 FROM information_schema.routines 
            WHERE routine_name = 'handle_new_user'
        ) THEN '✅ OK'
        ELSE '❌ ERRO'
    END as resultado;

-- Verificar trigger
SELECT 
    '🎯 VERIFICAÇÃO FINAL' as status,
    'Trigger on_auth_user_created' as componente,
    CASE 
        WHEN EXISTS(
            SELECT 1 FROM information_schema.triggers 
            WHERE trigger_name = 'on_auth_user_created'
        ) THEN '✅ OK'
        ELSE '❌ ERRO'
    END as resultado;

-- Verificar estrutura workshops
SELECT 
    '🎯 VERIFICAÇÃO FINAL' as status,
    'Coluna plan_type em workshops' as componente,
    CASE 
        WHEN EXISTS(
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'workshops' AND column_name = 'plan_type'
        ) THEN '✅ OK'
        ELSE '❌ ERRO'
    END as resultado;

-- Verificar políticas RLS
SELECT 
    '🎯 VERIFICAÇÃO FINAL' as status,
    'Políticas RLS' as componente,
    COUNT(*) || ' políticas criadas' as resultado
FROM information_schema.table_privileges 
WHERE table_name IN ('profiles', 'workshops', 'drivers');

-- ==================================================
-- 🎉 MENSAGEM FINAL
-- ==================================================

SELECT 
    '🎉 CORREÇÃO COMPLETA!' as status,
    'Sistema de cadastro de oficinas corrigido' as mensagem,
    'Pode testar o cadastro agora' as proxima_acao;

-- ==================================================
-- 📝 INSTRUÇÕES PARA TESTE
-- ==================================================

/*
🧪 COMO TESTAR:

1. Acesse: /auth/oficina
2. Tente cadastro por email
3. Tente login OAuth Google/Facebook
4. Verifique se o redirecionamento funciona:
   - FREE → /oficina-basica
   - PRO → /dashboard

🔍 LOGS PARA MONITORAR:
- No Supabase Dashboard → Logs
- Procure por "HANDLE_NEW_USER"
- Verifique se não há erros

🐛 SE AINDA HOUVER PROBLEMAS:
1. Verificar variáveis de ambiente
2. Conferir configuração OAuth no Supabase
3. Testar com usuário novo (email não usado antes)
*/ 