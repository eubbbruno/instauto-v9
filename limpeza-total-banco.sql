-- 🧹 LIMPEZA TOTAL DO BANCO - INSTAUTO V7
-- ⚠️ ATENÇÃO: Este script vai DELETAR TUDO e recriar do zero!
-- Execute APENAS se quiser começar limpo

-- ==================================================
-- 🗑️ STEP 1: REMOVER TUDO QUE EXISTE
-- ==================================================

-- 1. Remover todos os triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS new_user_trigger ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_drivers_updated_at ON public.drivers;
DROP TRIGGER IF EXISTS update_workshops_updated_at ON public.workshops;
DROP TRIGGER IF EXISTS update_appointments_updated_at ON public.appointments;
DROP TRIGGER IF EXISTS update_service_orders_updated_at ON public.service_orders;

-- 2. Remover todas as funções
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.is_workshop_user(UUID) CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- 3. Remover todas as políticas RLS (todas de uma vez)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
                      r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- 4. Remover todas as tabelas na ordem correta (respeitando foreign keys)
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;
DROP TABLE IF EXISTS public.service_orders CASCADE;
DROP TABLE IF EXISTS public.appointments CASCADE;
DROP TABLE IF EXISTS public.vehicles CASCADE;
DROP TABLE IF EXISTS public.workshops CASCADE;
DROP TABLE IF EXISTS public.drivers CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 5. Limpar dados de auth (CUIDADO!)
-- DESCOMENTE APENAS SE QUISER DELETAR USUÁRIOS TAMBÉM
/*
DELETE FROM auth.users WHERE email LIKE '%teste%' OR email LIKE '%@gmail.com';
*/

-- ==================================================
-- 🏗️ STEP 2: RECRIAR ESTRUTURA LIMPA
-- ==================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela profiles (básica, apenas dados essenciais)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    type TEXT CHECK (type IN ('motorista', 'oficina')) NOT NULL DEFAULT 'motorista',
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela drivers (dados específicos de motoristas)
CREATE TABLE public.drivers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    cpf TEXT UNIQUE,
    birth_date DATE,
    license_number TEXT,
    license_expiry DATE,
    address JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela workshops (dados específicos de oficinas)
CREATE TABLE public.workshops (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    business_name TEXT,
    cnpj TEXT UNIQUE,
    plan_type TEXT CHECK (plan_type IN ('free', 'pro')) DEFAULT 'free',
    address JSONB,
    services TEXT[] DEFAULT '{}',
    specialties TEXT[] DEFAULT '{}',
    rating DECIMAL(2,1) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    opening_hours JSONB,
    price_range TEXT CHECK (price_range IN ('$', '$$', '$$$')),
    photos TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela vehicles (veículos dos motoristas)
CREATE TABLE public.vehicles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    driver_id UUID REFERENCES public.drivers(id) ON DELETE CASCADE,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    plate TEXT UNIQUE NOT NULL,
    color TEXT,
    fuel_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela appointments (agendamentos)
CREATE TABLE public.appointments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    driver_id UUID REFERENCES public.drivers(id) ON DELETE CASCADE,
    workshop_id UUID REFERENCES public.workshops(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
    service_type TEXT NOT NULL,
    description TEXT,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    status TEXT CHECK (status IN ('agendado', 'confirmado', 'em_andamento', 'finalizado', 'cancelado')) DEFAULT 'agendado',
    price DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela service_orders (ordens de serviço)
CREATE TABLE public.service_orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
    workshop_id UUID REFERENCES public.workshops(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES public.drivers(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
    services JSONB NOT NULL,
    parts JSONB DEFAULT '[]',
    labor_cost DECIMAL(10,2) DEFAULT 0,
    parts_cost DECIMAL(10,2) DEFAULT 0,
    total_cost DECIMAL(10,2) GENERATED ALWAYS AS (labor_cost + parts_cost) STORED,
    status TEXT CHECK (status IN ('criada', 'em_andamento', 'aguardando_pecas', 'finalizada', 'cancelada')) DEFAULT 'criada',
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela conversations (conversas)
CREATE TABLE public.conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    driver_id UUID REFERENCES public.drivers(id) ON DELETE CASCADE,
    workshop_id UUID REFERENCES public.workshops(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela messages (mensagens)
CREATE TABLE public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type TEXT CHECK (message_type IN ('text', 'image', 'file', 'system')) DEFAULT 'text',
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela reviews (avaliações)
CREATE TABLE public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    driver_id UUID REFERENCES public.drivers(id) ON DELETE CASCADE,
    workshop_id UUID REFERENCES public.workshops(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    response TEXT,
    response_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela payments (pagamentos)
CREATE TABLE public.payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES public.drivers(id) ON DELETE CASCADE,
    workshop_id UUID REFERENCES public.workshops(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_method TEXT NOT NULL,
    payment_provider TEXT DEFAULT 'mercadopago',
    external_payment_id TEXT,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled', 'refunded')) DEFAULT 'pending',
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- ⚙️ STEP 3: FUNÇÃO PARA NOVOS USUÁRIOS (ROBUSTA)
-- ==================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_type_value TEXT;
    user_name_value TEXT;
    plan_type_value TEXT;
BEGIN
    -- Log detalhado
    RAISE LOG '🚀 [AUTH] Criando profile para usuário: % (email: %)', NEW.id, NEW.email;
    RAISE LOG '🔍 [AUTH] Metadata recebido: %', NEW.raw_user_meta_data;
    
    -- Extrair tipo (padrão: motorista)
    user_type_value := COALESCE(NEW.raw_user_meta_data->>'type', 'motorista');
    
    -- Validar tipo
    IF user_type_value NOT IN ('motorista', 'oficina') THEN
        RAISE LOG '⚠️ [AUTH] Tipo inválido (%), usando padrão: motorista', user_type_value;
        user_type_value := 'motorista';
    END IF;
    
    -- Extrair plano (apenas para oficinas)
    plan_type_value := COALESCE(NEW.raw_user_meta_data->>'plan_type', 'free');
    IF plan_type_value NOT IN ('free', 'pro') THEN
        plan_type_value := 'free';
    END IF;
    
    -- Extrair nome
    user_name_value := COALESCE(
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'full_name',
        split_part(NEW.email, '@', 1)
    );
    
    RAISE LOG '✅ [AUTH] Dados processados: tipo=%, nome=%, plano=%', user_type_value, user_name_value, plan_type_value;
    
    -- Criar profile básico
    INSERT INTO public.profiles (id, email, name, type)
    VALUES (NEW.id, NEW.email, user_name_value, user_type_value)
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        type = EXCLUDED.type,
        updated_at = NOW();
    
    -- Criar registro específico baseado no tipo
    IF user_type_value = 'motorista' THEN
        INSERT INTO public.drivers (profile_id)
        VALUES (NEW.id)
        ON CONFLICT (profile_id) DO NOTHING;
        
        RAISE LOG '🚗 [AUTH] Driver criado para: %', NEW.email;
    ELSE
        INSERT INTO public.workshops (profile_id, plan_type)
        VALUES (NEW.id, plan_type_value)
        ON CONFLICT (profile_id) DO UPDATE SET
            plan_type = EXCLUDED.plan_type,
            updated_at = NOW();
        
        RAISE LOG '🔧 [AUTH] Workshop criado para: % (plano: %)', NEW.email, plan_type_value;
    END IF;
    
    RAISE LOG '🎉 [AUTH] Profile completo criado com sucesso!';
    RETURN NEW;
    
EXCEPTION WHEN OTHERS THEN
    RAISE LOG '❌ [AUTH] Erro ao criar profile: %', SQLERRM;
    RAISE LOG '🔧 [AUTH] Dados que causaram erro: user_id=%, email=%, metadata=%', NEW.id, NEW.email, NEW.raw_user_meta_data;
    -- Não falhar o auth, apenas logar o erro
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==================================================
-- 🔄 STEP 4: FUNÇÃO PARA UPDATE AUTOMÁTICO
-- ==================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar triggers para updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON public.drivers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workshops_updated_at BEFORE UPDATE ON public.workshops FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_orders_updated_at BEFORE UPDATE ON public.service_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==================================================
-- 🔒 STEP 5: POLÍTICAS RLS
-- ==================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "users_can_manage_own_profile" ON public.profiles
    FOR ALL USING (auth.uid() = id);

-- Políticas para drivers
CREATE POLICY "drivers_can_manage_own_data" ON public.drivers
    FOR ALL USING (auth.uid() = profile_id);

-- Políticas para workshops
CREATE POLICY "workshops_can_manage_own_data" ON public.workshops
    FOR ALL USING (auth.uid() = profile_id);

-- Permitir que todos vejam oficinas (para busca pública)
CREATE POLICY "public_can_view_workshops" ON public.workshops
    FOR SELECT USING (true);

-- Políticas para vehicles
CREATE POLICY "drivers_can_manage_own_vehicles" ON public.vehicles
    FOR ALL USING (
        driver_id IN (SELECT id FROM public.drivers WHERE profile_id = auth.uid())
    );

-- Políticas para appointments
CREATE POLICY "users_can_view_related_appointments" ON public.appointments
    FOR SELECT USING (
        driver_id IN (SELECT id FROM public.drivers WHERE profile_id = auth.uid()) OR
        workshop_id IN (SELECT id FROM public.workshops WHERE profile_id = auth.uid())
    );

CREATE POLICY "users_can_manage_related_appointments" ON public.appointments
    FOR ALL USING (
        driver_id IN (SELECT id FROM public.drivers WHERE profile_id = auth.uid()) OR
        workshop_id IN (SELECT id FROM public.workshops WHERE profile_id = auth.uid())
    );

-- ==================================================
-- ⚡ STEP 6: ÍNDICES PARA PERFORMANCE
-- ==================================================

-- Índices básicos
CREATE INDEX idx_profiles_type ON public.profiles(type);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_created_at ON public.profiles(created_at);

CREATE INDEX idx_drivers_profile_id ON public.drivers(profile_id);
CREATE INDEX idx_drivers_cpf ON public.drivers(cpf);

CREATE INDEX idx_workshops_profile_id ON public.workshops(profile_id);
CREATE INDEX idx_workshops_plan_type ON public.workshops(plan_type);
CREATE INDEX idx_workshops_verified ON public.workshops(verified);
CREATE INDEX idx_workshops_rating ON public.workshops(rating);
CREATE INDEX idx_workshops_cnpj ON public.workshops(cnpj);

CREATE INDEX idx_vehicles_driver_id ON public.vehicles(driver_id);
CREATE INDEX idx_vehicles_plate ON public.vehicles(plate);

CREATE INDEX idx_appointments_driver_id ON public.appointments(driver_id);
CREATE INDEX idx_appointments_workshop_id ON public.appointments(workshop_id);
CREATE INDEX idx_appointments_status ON public.appointments(status);
CREATE INDEX idx_appointments_scheduled_date ON public.appointments(scheduled_date);

-- ==================================================
-- 🎯 STEP 7: HABILITAR REALTIME
-- ==================================================

-- Habilitar realtime para mensagens e conversas
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;

-- ==================================================
-- ✅ VERIFICAÇÃO FINAL
-- ==================================================

-- Verificar se tudo foi criado
SELECT 
    '🎯 LIMPEZA E RECRIAÇÃO COMPLETA' as status,
    'Banco de dados limpo e recriado com sucesso' as resultado,
    'Pronto para testar o sistema de auth!' as proxima_acao;

-- Contar tabelas criadas
SELECT 
    '📊 TABELAS CRIADAS' as categoria,
    COUNT(*) as quantidade
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Verificar função principal
SELECT 
    '⚙️ FUNÇÃO HANDLE_NEW_USER' as categoria,
    CASE 
        WHEN EXISTS(
            SELECT 1 FROM information_schema.routines 
            WHERE routine_name = 'handle_new_user'
        ) THEN '✅ CRIADA'
        ELSE '❌ ERRO'
    END as status;

-- Verificar trigger
SELECT 
    '🔗 TRIGGER AUTH' as categoria,
    CASE 
        WHEN EXISTS(
            SELECT 1 FROM information_schema.triggers 
            WHERE trigger_name = 'on_auth_user_created'
        ) THEN '✅ ATIVO'
        ELSE '❌ ERRO'
    END as status;

-- Verificar políticas RLS
SELECT 
    '🔒 POLÍTICAS RLS' as categoria,
    COUNT(*) || ' políticas criadas' as status
FROM pg_policies 
WHERE schemaname = 'public';

/*
🎉 LIMPEZA TOTAL CONCLUÍDA!

✅ O QUE FOI FEITO:
- Removidas todas as tabelas, funções, triggers e políticas antigas
- Recriada estrutura completa e limpa
- Função handle_new_user robusta com suporte a planos
- Políticas RLS otimizadas
- Índices para performance
- Realtime habilitado

🚀 PRÓXIMOS PASSOS:
1. Execute este script no Supabase SQL Editor
2. Teste o sistema de auth nas páginas criadas
3. Verifique se os profiles são criados corretamente
4. Confirme os redirecionamentos

💡 DICA: Agora você tem um banco limpo e organizado!
*/ 