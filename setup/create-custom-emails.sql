-- 📧 CRIAR CONTAS COM SEUS EMAILS PERSONALIZADOS
-- Execute no Supabase Dashboard > SQL Editor

-- ============================================================================
-- INSTRUÇÕES PARA EMAILS PERSONALIZADOS
-- ============================================================================

/*
📧 SEUS EMAILS SUGERIDOS:

🔐 ADMIN (Principal):
   Email: bruno@instauto.com.br
   Senha: SuaSenhaSegura123!
   Tipo: admin

📋 EMAILS CORPORATIVOS:
   contato@instauto.com.br (atendimento)
   suporte@instauto.com.br (suporte técnico)
   vendas@instauto.com.br (comercial)
   admin@instauto.com.br (atual, manter)

🧪 EMAILS DEMO (Para testes):
   motorista@demo.com / demo123
   oficina.free@demo.com / demo123
   oficina.pro@demo.com / demo123

IMPORTANTE:
- Use APENAS emails que você controla
- Para criar via SQL, primeiro crie no Auth Dashboard
- Depois execute este script para ajustar o profile
*/

-- ============================================================================
-- ATUALIZAR ADMIN PARA SEU EMAIL (OPCIONAL)
-- ============================================================================

-- Se quiser trocar o admin atual para seu email:
-- 1. Primeiro crie o usuário bruno@instauto.com.br no Dashboard
-- 2. Depois execute este UPDATE:

/*
UPDATE public.profiles 
SET 
    email = 'bruno@instauto.com.br',
    name = 'Bruno - Admin InstaAuto',
    type = 'admin',
    updated_at = NOW()
WHERE email = 'admin@instauto.com.br';
*/

-- ============================================================================
-- CRIAR PROFILES PARA EMAILS CORPORATIVOS
-- ============================================================================

-- Função para criar profile após criar usuário no Dashboard
CREATE OR REPLACE FUNCTION create_corporate_profile(
    user_id UUID,
    user_email TEXT,
    user_name TEXT,
    user_type TEXT
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, type, created_at, updated_at)
    VALUES (user_id, user_email, user_name, user_type, NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        type = EXCLUDED.type,
        updated_at = NOW();
        
    -- Se for oficina, criar workshop
    IF user_type = 'oficina' THEN
        INSERT INTO public.workshops (profile_id, name, plan_type, created_at, updated_at)
        VALUES (user_id, user_name, 'free', NOW(), NOW())
        ON CONFLICT (profile_id) DO NOTHING;
    END IF;
    
    -- Se for motorista, criar driver
    IF user_type = 'motorista' THEN
        INSERT INTO public.drivers (profile_id, created_at, updated_at)
        VALUES (user_id, NOW(), NOW())
        ON CONFLICT (profile_id) DO NOTHING;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- EXEMPLOS DE USO (DESCOMENTE APÓS CRIAR NO DASHBOARD)
-- ============================================================================

/*
-- Após criar bruno@instauto.com.br no Dashboard, execute:
SELECT create_corporate_profile(
    'SEU_USER_ID_AQUI',
    'bruno@instauto.com.br', 
    'Bruno - Fundador InstaAuto',
    'admin'
);

-- Após criar contato@instauto.com.br no Dashboard, execute:
SELECT create_corporate_profile(
    'USER_ID_CONTATO',
    'contato@instauto.com.br',
    'Contato InstaAuto', 
    'admin'
);
*/

-- ============================================================================
-- VERIFICAR USUÁRIOS EXISTENTES
-- ============================================================================

-- Ver todos os usuários criados
SELECT 
    u.id,
    u.email,
    u.created_at,
    p.type,
    p.name,
    CASE 
        WHEN p.type = 'oficina' THEN w.plan_type
        ELSE NULL
    END as plano_oficina
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
LEFT JOIN public.workshops w ON w.profile_id = u.id
ORDER BY u.created_at DESC;

-- ============================================================================
-- LIMPAR USUÁRIOS DE TESTE (SE NECESSÁRIO)
-- ============================================================================

-- CUIDADO! Só execute se quiser apagar usuários de teste:
/*
DELETE FROM public.drivers WHERE profile_id IN (
    SELECT id FROM public.profiles WHERE email LIKE '%demo.com'
);

DELETE FROM public.workshops WHERE profile_id IN (
    SELECT id FROM public.profiles WHERE email LIKE '%demo.com'
);

DELETE FROM public.profiles WHERE email LIKE '%demo.com';
*/

-- ============================================================================
-- STATUS FINAL
-- ============================================================================

SELECT '📧 SISTEMA DE EMAILS CONFIGURADO!' as status;
SELECT 'Crie os usuários no Dashboard e use a função create_corporate_profile' as next_step;
