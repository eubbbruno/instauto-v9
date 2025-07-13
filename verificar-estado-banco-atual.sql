-- 🔍 VERIFICAÇÃO COMPLETA DO ESTADO DO BANCO
-- Execute este script para diagnosticar problemas de redirecionamento

-- ==================================================
-- 📊 STEP 1: VERIFICAR ESTRUTURA BÁSICA
-- ==================================================

-- Verificar se as tabelas existem
SELECT 
    '📋 TABELAS EXISTENTES' as categoria,
    table_name,
    CASE 
        WHEN table_name IN ('profiles', 'drivers', 'workshops') THEN '✅ ESSENCIAL'
        ELSE '📦 ADICIONAL'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Verificar se a função handle_new_user existe
SELECT 
    '⚙️ FUNÇÃO HANDLE_NEW_USER' as categoria,
    CASE 
        WHEN EXISTS(
            SELECT 1 FROM information_schema.routines 
            WHERE routine_name = 'handle_new_user' AND routine_schema = 'public'
        ) THEN '✅ EXISTE'
        ELSE '❌ NÃO EXISTE'
    END as status;

-- Verificar se o trigger existe
SELECT 
    '🔗 TRIGGER AUTH' as categoria,
    CASE 
        WHEN EXISTS(
            SELECT 1 FROM information_schema.triggers 
            WHERE trigger_name = 'on_auth_user_created'
        ) THEN '✅ ATIVO'
        ELSE '❌ INATIVO'
    END as status;

-- ==================================================
-- 👥 STEP 2: VERIFICAR USUÁRIOS EXISTENTES
-- ==================================================

-- Contar usuários por tipo
SELECT 
    '👥 USUÁRIOS POR TIPO' as categoria,
    COALESCE(p.type, 'SEM_PROFILE') as tipo,
    COUNT(*) as quantidade
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
GROUP BY p.type
ORDER BY quantidade DESC;

-- Verificar usuários com problemas (sem profile)
SELECT 
    '⚠️ USUÁRIOS SEM PROFILE' as categoria,
    u.id,
    u.email,
    u.created_at,
    u.raw_user_meta_data
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ORDER BY u.created_at DESC;

-- Verificar oficinas sem workshop
SELECT 
    '⚠️ OFICINAS SEM WORKSHOP' as categoria,
    p.id,
    p.email,
    p.name,
    p.type
FROM public.profiles p
LEFT JOIN public.workshops w ON p.id = w.profile_id
WHERE p.type = 'oficina' AND w.id IS NULL
ORDER BY p.created_at DESC;

-- Verificar motoristas sem driver
SELECT 
    '⚠️ MOTORISTAS SEM DRIVER' as categoria,
    p.id,
    p.email,
    p.name,
    p.type
FROM public.profiles p
LEFT JOIN public.drivers d ON p.id = d.profile_id
WHERE p.type = 'motorista' AND d.id IS NULL
ORDER BY p.created_at DESC;

-- ==================================================
-- 🎯 STEP 3: VERIFICAR PLANOS DE OFICINAS
-- ==================================================

-- Verificar planos das oficinas
SELECT 
    '📊 PLANOS DAS OFICINAS' as categoria,
    COALESCE(w.plan_type, 'SEM_PLANO') as plano,
    COUNT(*) as quantidade
FROM public.profiles p
LEFT JOIN public.workshops w ON p.id = w.profile_id
WHERE p.type = 'oficina'
GROUP BY w.plan_type
ORDER BY quantidade DESC;

-- Listar oficinas com seus planos
SELECT 
    '🏢 OFICINAS E PLANOS' as categoria,
    p.email,
    p.name,
    COALESCE(w.plan_type, 'SEM_PLANO') as plano,
    w.created_at
FROM public.profiles p
LEFT JOIN public.workshops w ON p.id = w.profile_id
WHERE p.type = 'oficina'
ORDER BY w.created_at DESC;

-- ==================================================
-- 🔒 STEP 4: VERIFICAR POLÍTICAS RLS
-- ==================================================

-- Contar políticas RLS
SELECT 
    '🔒 POLÍTICAS RLS' as categoria,
    schemaname,
    tablename,
    COUNT(*) as quantidade_politicas
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY schemaname, tablename
ORDER BY tablename;

-- Listar todas as políticas
SELECT 
    '📋 LISTA DE POLÍTICAS' as categoria,
    schemaname || '.' || tablename as tabela,
    policyname as politica,
    cmd as comando
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ==================================================
-- 🚨 STEP 5: IDENTIFICAR PROBLEMAS ESPECÍFICOS
-- ==================================================

-- Verificar se há usuários com metadata incorreto
SELECT 
    '🔍 METADATA INCORRETO' as categoria,
    u.id,
    u.email,
    u.raw_user_meta_data->>'type' as metadata_type,
    p.type as profile_type,
    CASE 
        WHEN u.raw_user_meta_data->>'type' != p.type THEN '❌ INCONSISTENTE'
        WHEN u.raw_user_meta_data->>'type' IS NULL THEN '⚠️ SEM METADATA'
        ELSE '✅ OK'
    END as status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NOT NULL
ORDER BY u.created_at DESC;

-- Verificar oficinas sem plan_type
SELECT 
    '🏢 OFICINAS SEM PLAN_TYPE' as categoria,
    p.id,
    p.email,
    p.name,
    w.plan_type
FROM public.profiles p
JOIN public.workshops w ON p.id = w.profile_id
WHERE p.type = 'oficina' AND (w.plan_type IS NULL OR w.plan_type = '')
ORDER BY p.created_at DESC;

-- ==================================================
-- 💡 STEP 6: RECOMENDAÇÕES DE CORREÇÃO
-- ==================================================

-- Gerar relatório final
SELECT 
    '📋 RELATÓRIO FINAL' as categoria,
    'Verifique os resultados acima para identificar problemas' as instrucao,
    'Execute as correções necessárias baseadas nos achados' as proxima_acao;

-- Verificar se precisa executar limpeza total
SELECT 
    '🧹 RECOMENDAÇÃO' as categoria,
    CASE 
        WHEN EXISTS(
            SELECT 1 FROM auth.users u
            LEFT JOIN public.profiles p ON u.id = p.id
            WHERE p.id IS NULL
        ) THEN '❌ EXECUTE: limpeza-total-banco.sql'
        ELSE '✅ BANCO PARECE OK'
    END as acao_recomendada;

-- ==================================================
-- 🔧 STEP 7: QUERIES PARA CORREÇÃO MANUAL
-- ==================================================

-- Template para corrigir usuários sem profile
/*
-- EXECUTE APENAS SE NECESSÁRIO:
INSERT INTO public.profiles (id, email, name, type)
SELECT 
    u.id,
    u.email,
    COALESCE(u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)),
    COALESCE(u.raw_user_meta_data->>'type', 'motorista')
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;
*/

-- Template para corrigir oficinas sem workshop
/*
-- EXECUTE APENAS SE NECESSÁRIO:
INSERT INTO public.workshops (profile_id, plan_type)
SELECT 
    p.id,
    'free'
FROM public.profiles p
LEFT JOIN public.workshops w ON p.id = w.profile_id
WHERE p.type = 'oficina' AND w.id IS NULL;
*/

-- Template para corrigir motoristas sem driver
/*
-- EXECUTE APENAS SE NECESSÁRIO:
INSERT INTO public.drivers (profile_id)
SELECT 
    p.id
FROM public.profiles p
LEFT JOIN public.drivers d ON p.id = d.profile_id
WHERE p.type = 'motorista' AND d.id IS NULL;
*/

/*
🎯 COMO USAR ESTE SCRIPT:

1. Execute no Supabase SQL Editor
2. Analise os resultados de cada seção
3. Identifique problemas específicos
4. Use as queries de correção se necessário
5. Ou execute limpeza-total-banco.sql se muitos problemas

🚨 PROBLEMAS COMUNS:
- Usuários sem profile → Função handle_new_user não funcionou
- Oficinas sem workshop → Lógica de criação com erro
- Motoristas sem driver → Mesmo problema acima
- Planos incorretos → Metadata não foi processado corretamente
*/ 