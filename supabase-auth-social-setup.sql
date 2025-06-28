-- 🔐 INSTAUTO V7 - CONFIGURAÇÃO DE AUTENTICAÇÃO SOCIAL
-- Execute APÓS o schema principal

-- 1. CONFIGURAR OAUTH PROVIDERS (via Dashboard)
/*
Para configurar Google e Facebook OAuth:

1. Vá para Authentication > Settings > Auth Providers no Dashboard do Supabase

2. GOOGLE OAUTH:
   - Enabled: ON
   - Client ID: (obter do Google Cloud Console)
   - Client Secret: (obter do Google Cloud Console)
   - Redirect URL: https://seuprojetoid.supabase.co/auth/v1/callback
   - Additional Scopes: profile email

3. FACEBOOK OAUTH:
   - Enabled: ON
   - App ID: (obter do Facebook Developers)
   - App Secret: (obter do Facebook Developers)
   - Redirect URL: https://seuprojetoid.supabase.co/auth/v1/callback

4. CONFIGURAÇÕES GERAIS:
   - Site URL: http://localhost:3000 (dev) / https://seudominio.com (prod)
   - Redirect URLs: 
     * http://localhost:3000/auth/callback
     * https://seudominio.com/auth/callback
*/

-- 2. FUNÇÃO MELHORADA PARA HANDLE NEW USER COM OAUTH
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_name TEXT;
    user_type TEXT;
    provider_name TEXT;
BEGIN
    -- Extrair informações do usuário
    user_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name', 
        NEW.raw_user_meta_data->>'display_name',
        split_part(NEW.email, '@', 1)
    );
    
    -- Determinar tipo de usuário (padrão: motorista para OAuth)
    user_type := COALESCE(NEW.raw_user_meta_data->>'type', 'motorista');
    
    -- Extrair provider
    provider_name := COALESCE(NEW.raw_app_meta_data->>'provider', 'email');
    
    -- Inserir ou atualizar perfil
    INSERT INTO public.profiles (id, email, name, type, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        user_name,
        user_type,
        CASE 
            WHEN provider_name = 'google' THEN NEW.raw_user_meta_data->>'avatar_url'
            WHEN provider_name = 'facebook' THEN NEW.raw_user_meta_data->>'picture'
            ELSE NULL
        END
    )
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        avatar_url = EXCLUDED.avatar_url,
        updated_at = NOW();
    
    -- Se for motorista, criar registro na tabela drivers
    IF user_type = 'motorista' THEN
        INSERT INTO public.drivers (profile_id)
        VALUES (NEW.id)
        ON CONFLICT (profile_id) DO NOTHING;
    END IF;
    
    -- Se for oficina, criar registro na tabela workshops
    IF user_type = 'oficina' THEN
        INSERT INTO public.workshops (profile_id, business_name)
        VALUES (NEW.id, user_name)
        ON CONFLICT (profile_id) DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. FUNÇÃO PARA VERIFICAR SE USUÁRIO É OFICINA
CREATE OR REPLACE FUNCTION public.is_workshop_user(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = user_id AND type = 'oficina'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. FUNÇÃO PARA VERIFICAR SE USUÁRIO É MOTORISTA
CREATE OR REPLACE FUNCTION public.is_driver_user(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = user_id AND type = 'motorista'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. POLÍTICA MELHORADA PARA WORKSHOPS (permitir visualização pública)
DROP POLICY IF EXISTS "Public can view workshops" ON public.workshops;
CREATE POLICY "Public can view workshops" ON public.workshops FOR SELECT TO anon, authenticated USING (true);

-- 6. POLÍTICA PARA APPOINTMENTS (melhorada)
DROP POLICY IF EXISTS "Users can create appointments" ON public.appointments;
CREATE POLICY "Users can create appointments" ON public.appointments FOR INSERT WITH CHECK (
    -- Motoristas podem criar agendamentos
    public.is_driver_user(auth.uid()) AND
    driver_id IN (SELECT id FROM public.drivers WHERE profile_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can update appointments" ON public.appointments;
CREATE POLICY "Users can update appointments" ON public.appointments FOR UPDATE USING (
    -- Motoristas podem editar seus agendamentos
    (public.is_driver_user(auth.uid()) AND driver_id IN (SELECT id FROM public.drivers WHERE profile_id = auth.uid())) OR
    -- Oficinas podem editar agendamentos feitos com elas
    (public.is_workshop_user(auth.uid()) AND workshop_id IN (SELECT id FROM public.workshops WHERE profile_id = auth.uid()))
);

-- 7. POLÍTICAS PARA CONVERSAS E MENSAGENS
DROP POLICY IF EXISTS "Users can view related conversations" ON public.conversations;
CREATE POLICY "Users can view related conversations" ON public.conversations FOR SELECT USING (
    driver_id IN (SELECT id FROM public.drivers WHERE profile_id = auth.uid()) OR
    workshop_id IN (SELECT id FROM public.workshops WHERE profile_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;
CREATE POLICY "Users can create conversations" ON public.conversations FOR INSERT WITH CHECK (
    driver_id IN (SELECT id FROM public.drivers WHERE profile_id = auth.uid()) OR
    workshop_id IN (SELECT id FROM public.workshops WHERE profile_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
CREATE POLICY "Users can view messages in their conversations" ON public.messages FOR SELECT USING (
    conversation_id IN (
        SELECT id FROM public.conversations 
        WHERE driver_id IN (SELECT id FROM public.drivers WHERE profile_id = auth.uid()) OR
              workshop_id IN (SELECT id FROM public.workshops WHERE profile_id = auth.uid())
    )
);

DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    conversation_id IN (
        SELECT id FROM public.conversations 
        WHERE driver_id IN (SELECT id FROM public.drivers WHERE profile_id = auth.uid()) OR
              workshop_id IN (SELECT id FROM public.workshops WHERE profile_id = auth.uid())
    )
);

-- 8. CRIAR ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_profiles_type ON public.profiles(type);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_drivers_profile_id ON public.drivers(profile_id);
CREATE INDEX IF NOT EXISTS idx_workshops_profile_id ON public.workshops(profile_id);
CREATE INDEX IF NOT EXISTS idx_appointments_driver_id ON public.appointments(driver_id);
CREATE INDEX IF NOT EXISTS idx_appointments_workshop_id ON public.appointments(workshop_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversations_driver_id ON public.conversations(driver_id);
CREATE INDEX IF NOT EXISTS idx_conversations_workshop_id ON public.conversations(workshop_id);

-- 9. GRANT PERMISSIONS
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- ✅ CONFIGURAÇÃO DE AUTH SOCIAL CONCLUÍDA!
-- Agora configure os providers OAuth no Dashboard do Supabase 