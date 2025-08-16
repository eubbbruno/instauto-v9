-- 🔐 CRIAR ADMIN NA TABELA AUTH.USERS
-- Execute APÓS o script CRIAR-ESTRUTURA-COMPLETA.sql

-- ============================================================================
-- CRIAR ADMIN NA TABELA AUTH.USERS (MÉTODO MANUAL)
-- ============================================================================

-- IMPORTANTE: Execute este bloco com CUIDADO!
DO $$
DECLARE
    admin_uuid UUID;
BEGIN
    -- Verificar se admin já existe
    SELECT id INTO admin_uuid 
    FROM auth.users 
    WHERE email = 'admin@instauto.com.br';
    
    IF admin_uuid IS NULL THEN
        -- Gerar UUID para o admin
        admin_uuid := gen_random_uuid();
        
        -- Inserir na tabela auth.users
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            raw_user_meta_data,
            is_super_admin,
            confirmation_token,
            recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            admin_uuid,
            'authenticated',
            'authenticated',
            'admin@instauto.com.br',
            crypt('admin123', gen_salt('bf')), -- SENHA: admin123
            NOW(),
            NOW(),
            NOW(),
            '{"user_type": "admin", "name": "Administrador"}'::jsonb,
            false,
            '',
            ''
        );
        
        -- Inserir/atualizar na tabela profiles
        INSERT INTO profiles (id, email, name, type)
        VALUES (admin_uuid, 'admin@instauto.com.br', 'Administrador InstaAuto', 'admin')
        ON CONFLICT (id) DO UPDATE SET
            type = 'admin',
            name = 'Administrador InstaAuto';
            
        RAISE NOTICE 'Admin criado com UUID: %', admin_uuid;
        
    ELSE
        RAISE NOTICE 'Admin já existe com UUID: %', admin_uuid;
        
        -- Atualizar profile se necessário
        UPDATE profiles 
        SET type = 'admin', name = 'Administrador InstaAuto'
        WHERE id = admin_uuid;
    END IF;
END $$;

-- ============================================================================
-- VERIFICAÇÕES FINAIS
-- ============================================================================

-- Verificar admin na tabela auth
SELECT 'ADMIN AUTH.USERS:' as status, id, email, email_confirmed_at
FROM auth.users 
WHERE email = 'admin@instauto.com.br';

-- Verificar admin na tabela profiles
SELECT 'ADMIN PROFILES:' as status, id, email, name, type
FROM profiles 
WHERE email = 'admin@instauto.com.br';

SELECT '✅ ADMIN CRIADO NO AUTH E PROFILES!' as status;

-- ============================================================================
-- INSTRUÇÕES PARA LOGIN
-- ============================================================================

/*
🔐 CREDENCIAIS DE LOGIN:
Email: admin@instauto.com.br
Senha: admin123

🎯 PRÓXIMOS PASSOS:
1. Execute este script
2. Acesse /login
3. Faça login com as credenciais acima
4. Deve redirecionar para /admin

Se ainda der erro de credenciais inválidas, significa que há problema
na autenticação do Supabase. Neste caso, crie o usuário manualmente
no Dashboard do Supabase > Authentication > Add User.
*/
