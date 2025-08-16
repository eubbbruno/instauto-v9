-- 🔐 CONFIGURAÇÃO OAUTH GOOGLE/FACEBOOK
-- Execute no Supabase Dashboard > SQL Editor

-- ============================================================================
-- VERIFICAR CONFIGURAÇÕES ATUAIS
-- ============================================================================

-- Verificar se OAuth já está configurado
SELECT 'VERIFICANDO CONFIGURAÇÃO OAUTH...' as status;

-- ============================================================================
-- INSTRUÇÕES PARA CONFIGURAR OAUTH (VIA DASHBOARD)
-- ============================================================================

/*
📋 CONFIGURAÇÃO OAUTH NO SUPABASE DASHBOARD:

🔗 1. GOOGLE OAUTH:
   - Vá em: Authentication > Settings > Auth Providers
   - Ative: Google
   - Client ID: (criar no Google Cloud Console)
   - Client Secret: (criar no Google Cloud Console)
   - Redirect URL: https://seu-projeto.supabase.co/auth/v1/callback

🔗 2. FACEBOOK OAUTH:
   - Vá em: Authentication > Settings > Auth Providers  
   - Ative: Facebook
   - App ID: (criar no Facebook Developers)
   - App Secret: (criar no Facebook Developers)
   - Redirect URL: https://seu-projeto.supabase.co/auth/v1/callback

🔗 3. CONFIGURAR REDIRECT URLs:
   - Site URL: https://www.instauto.com.br
   - Redirect URLs:
     * https://www.instauto.com.br/**
     * http://localhost:3000/**
     * https://seu-dominio.vercel.app/**

🔗 4. TESTAR:
   - Email: bruno@instauto.com.br (seu email real)
   - Via Google ou Facebook
   - Deve criar profile automaticamente
*/

-- ============================================================================
-- VERIFICAR SE TRIGGER ESTÁ FUNCIONANDO
-- ============================================================================

-- Verificar se trigger handle_new_user está ativo
SELECT 
    tgname as trigger_name,
    tgenabled as enabled
FROM pg_trigger 
WHERE tgrelid = 'auth.users'::regclass 
AND tgname = 'on_auth_user_created';

-- ============================================================================
-- VERIFICAR ESTRUTURA DAS TABELAS
-- ============================================================================

-- Verificar se colunas necessárias existem
SELECT 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('type', 'name', 'email')
ORDER BY ordinal_position;

SELECT 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'workshops' 
AND column_name IN ('plan_type', 'is_trial', 'trial_starts_at', 'trial_ends_at')
ORDER BY ordinal_position;

-- ============================================================================
-- EXEMPLO DE TESTE (APENAS CONSULTA)
-- ============================================================================

-- Ver usuários OAuth (se existirem)
SELECT 
    u.email,
    u.created_at,
    u.raw_user_meta_data->>'provider' as provider,
    p.type,
    p.name
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE u.raw_user_meta_data->>'provider' IN ('google', 'facebook')
ORDER BY u.created_at DESC
LIMIT 5;

-- ============================================================================
-- STATUS FINAL
-- ============================================================================

SELECT '✅ VERIFICAÇÃO OAUTH CONCLUÍDA!' as status;
SELECT 'Configure OAuth providers no Dashboard!' as next_step;
