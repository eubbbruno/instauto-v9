-- ============================================================================
-- 🎓 SISTEMA DE ONBOARDING - INSTAUTO V7
-- ============================================================================
-- Este script cria a infraestrutura para o sistema de onboarding
-- Execute no Supabase SQL Editor

-- ============================================================================
-- 1. TABELA DE PROGRESSO DO ONBOARDING
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.onboarding_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    user_type TEXT CHECK (user_type IN ('motorista', 'oficina-free', 'oficina-pro')) NOT NULL,
    current_step INTEGER DEFAULT 0 NOT NULL,
    completed_steps TEXT[] DEFAULT '{}' NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    is_completed BOOLEAN DEFAULT FALSE NOT NULL,
    skip_optional BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Constraints
    UNIQUE(user_id),
    CHECK (current_step >= 0),
    CHECK (completed_at IS NULL OR completed_at >= started_at)
);

-- ============================================================================
-- 2. TABELA DE TIPS CONTEXTUAIS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.onboarding_tips (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tip_id TEXT UNIQUE NOT NULL,
    user_type TEXT CHECK (user_type IN ('motorista', 'oficina-free', 'oficina-pro', 'all')) NOT NULL,
    page_path TEXT NOT NULL,
    element_selector TEXT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    position TEXT CHECK (position IN ('top', 'bottom', 'left', 'right', 'center')) DEFAULT 'bottom',
    priority INTEGER DEFAULT 1 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Constraints
    CHECK (priority >= 1 AND priority <= 10)
);

-- ============================================================================
-- 3. TABELA DE TIPS VISUALIZADOS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_tips_seen (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    tip_id UUID REFERENCES public.onboarding_tips(id) ON DELETE CASCADE NOT NULL,
    seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    dismissed_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    UNIQUE(user_id, tip_id)
);

-- ============================================================================
-- 4. RLS POLICIES
-- ============================================================================

-- Onboarding Progress
ALTER TABLE public.onboarding_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own onboarding progress" ON public.onboarding_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding progress" ON public.onboarding_progress
    FOR ALL USING (auth.uid() = user_id);

-- Onboarding Tips
ALTER TABLE public.onboarding_tips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active tips" ON public.onboarding_tips
    FOR SELECT USING (is_active = true);

-- User Tips Seen
ALTER TABLE public.user_tips_seen ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own tips seen" ON public.user_tips_seen
    FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- 5. ÍNDICES PARA PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_onboarding_progress_user_id ON public.onboarding_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_progress_user_type ON public.onboarding_progress(user_type);
CREATE INDEX IF NOT EXISTS idx_onboarding_progress_completed ON public.onboarding_progress(is_completed);

CREATE INDEX IF NOT EXISTS idx_onboarding_tips_user_type ON public.onboarding_tips(user_type);
CREATE INDEX IF NOT EXISTS idx_onboarding_tips_page_path ON public.onboarding_tips(page_path);
CREATE INDEX IF NOT EXISTS idx_onboarding_tips_active ON public.onboarding_tips(is_active);

CREATE INDEX IF NOT EXISTS idx_user_tips_seen_user_id ON public.user_tips_seen(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tips_seen_tip_id ON public.user_tips_seen(tip_id);

-- ============================================================================
-- 6. FUNÇÃO PARA AUTO-UPDATE DO updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_onboarding_progress_updated_at
    BEFORE UPDATE ON public.onboarding_progress
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 7. TIPS INICIAIS PARA MOTORISTAS
-- ============================================================================
INSERT INTO public.onboarding_tips (tip_id, user_type, page_path, title, description, position, priority) VALUES
('motorista-dashboard-welcome', 'motorista', '/motorista', 'Bem-vindo ao seu Dashboard!', 'Aqui você encontra um resumo de todos os seus veículos, agendamentos e atividades recentes.', 'center', 1),
('motorista-garagem-add-vehicle', 'motorista', '/motorista/garagem', 'Adicione seu primeiro veículo', 'Clique no botão "Adicionar Veículo" para começar a gerenciar sua frota.', 'bottom', 2),
('motorista-buscar-workshops', 'motorista', '/motorista/buscar', 'Encontre oficinas próximas', 'Use os filtros para encontrar oficinas especializadas no seu tipo de veículo.', 'top', 1),
('motorista-notifications-enable', 'motorista', '/motorista', 'Ative as notificações', 'Receba alertas sobre agendamentos, promoções e manutenções preventivas.', 'right', 2)
ON CONFLICT (tip_id) DO NOTHING;

-- ============================================================================
-- 8. TIPS INICIAIS PARA OFICINAS
-- ============================================================================
INSERT INTO public.onboarding_tips (tip_id, user_type, page_path, title, description, position, priority) VALUES
('oficina-dashboard-welcome', 'all', '/oficina-free,/oficina-pro', 'Painel da sua Oficina', 'Monitore agendamentos, receita e performance da sua oficina em tempo real.', 'center', 1),
('oficina-ia-diagnostic', 'all', '/oficina-free,/oficina-pro', 'IA Diagnóstico', 'Use o botão roxo para testar nossa IA de diagnóstico - seu diferencial competitivo!', 'bottom', 1),
('oficina-profile-complete', 'all', '/oficina-free,/oficina-pro', 'Complete seu perfil', 'Adicione fotos, serviços e horários para atrair mais clientes.', 'top', 2),
('oficina-analytics-track', 'oficina-pro', '/oficina-pro', 'Analytics PRO', 'Acompanhe métricas avançadas de performance e receita da sua oficina.', 'left', 1)
ON CONFLICT (tip_id) DO NOTHING;

-- ============================================================================
-- 9. FUNÇÃO PARA RESETAR ONBOARDING (DESENVOLVIMENTO)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.reset_user_onboarding(target_user_id UUID)
RETURNS TEXT AS $$
BEGIN
    -- Deletar progresso atual
    DELETE FROM public.onboarding_progress WHERE user_id = target_user_id;
    
    -- Deletar tips vistos
    DELETE FROM public.user_tips_seen WHERE user_id = target_user_id;
    
    RETURN 'Onboarding resetado para usuário: ' || target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 10. VERIFICAÇÃO E LOGS
-- ============================================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Sistema de Onboarding criado com sucesso!';
    RAISE NOTICE '📊 Tabelas: onboarding_progress, onboarding_tips, user_tips_seen';
    RAISE NOTICE '🔒 RLS: Habilitado em todas as tabelas';
    RAISE NOTICE '⚡ Índices: Criados para performance otimizada';
    RAISE NOTICE '💡 Tips: % inseridos para motoristas e oficinas', (SELECT COUNT(*) FROM public.onboarding_tips);
END $$;

-- Verificar estrutura criada
SELECT 
    'onboarding_progress' as tabela,
    COUNT(*) as registros
FROM public.onboarding_progress
UNION ALL
SELECT 
    'onboarding_tips' as tabela,
    COUNT(*) as registros  
FROM public.onboarding_tips;

-- ============================================================================
-- 🎯 PRONTO! SISTEMA DE ONBOARDING COMPLETO
-- ============================================================================
-- Para usar em desenvolvimento, execute:
-- SELECT public.reset_user_onboarding('USER_ID_AQUI');
-- ============================================================================
