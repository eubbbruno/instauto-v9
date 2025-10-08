-- =============================================
-- SETUP NOTIFICAÇÕES PUSH - INSTAUTO V7
-- =============================================

-- 1. TABELA DE TOKENS DE NOTIFICAÇÃO
CREATE TABLE IF NOT EXISTS notification_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('motorista', 'oficina')),
  platform VARCHAR(50) NOT NULL DEFAULT 'web' CHECK (platform IN ('web', 'android', 'ios')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Índices únicos para evitar tokens duplicados
  UNIQUE(user_id, platform),
  INDEX idx_notification_tokens_user_id (user_id),
  INDEX idx_notification_tokens_platform (platform)
);

-- 2. TABELA DE HISTÓRICO DE NOTIFICAÇÕES
CREATE TABLE IF NOT EXISTS notification_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  data JSONB,
  status VARCHAR(50) NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'clicked', 'failed')),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivered_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  
  -- Índices para performance
  INDEX idx_notification_history_user_id (user_id),
  INDEX idx_notification_history_sent_at (sent_at DESC),
  INDEX idx_notification_history_status (status)
);

-- 3. TABELA DE PREFERÊNCIAS DE NOTIFICAÇÃO
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Tipos de notificação
  new_messages BOOLEAN DEFAULT true,
  appointment_reminders BOOLEAN DEFAULT true,
  payment_updates BOOLEAN DEFAULT true,
  service_updates BOOLEAN DEFAULT true,
  marketing BOOLEAN DEFAULT false,
  
  -- Configurações de horário
  quiet_hours_start TIME DEFAULT '22:00',
  quiet_hours_end TIME DEFAULT '08:00',
  weekend_notifications BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- =============================================
-- RLS POLICIES - SEGURANÇA
-- =============================================

-- Habilitar RLS
ALTER TABLE notification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- POLICIES PARA NOTIFICATION_TOKENS
-- Usuários podem ver apenas seus próprios tokens
CREATE POLICY "Users can view their own tokens" ON notification_tokens
  FOR SELECT USING (user_id = auth.uid());

-- Usuários podem inserir seus próprios tokens
CREATE POLICY "Users can insert their own tokens" ON notification_tokens
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Usuários podem atualizar seus próprios tokens
CREATE POLICY "Users can update their own tokens" ON notification_tokens
  FOR UPDATE USING (user_id = auth.uid());

-- POLICIES PARA NOTIFICATION_HISTORY
-- Usuários podem ver seu próprio histórico
CREATE POLICY "Users can view their own notification history" ON notification_history
  FOR SELECT USING (user_id = auth.uid());

-- Sistema pode inserir notificações
CREATE POLICY "System can insert notifications" ON notification_history
  FOR INSERT WITH CHECK (true);

-- POLICIES PARA NOTIFICATION_PREFERENCES
-- Usuários podem ver suas próprias preferências
CREATE POLICY "Users can view their own preferences" ON notification_preferences
  FOR SELECT USING (user_id = auth.uid());

-- Usuários podem inserir suas próprias preferências
CREATE POLICY "Users can insert their own preferences" ON notification_preferences
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Usuários podem atualizar suas próprias preferências
CREATE POLICY "Users can update their own preferences" ON notification_preferences
  FOR UPDATE USING (user_id = auth.uid());

-- =============================================
-- FUNÇÕES ÚTEIS
-- =============================================

-- Função para criar preferências padrão
CREATE OR REPLACE FUNCTION create_default_notification_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar preferências ao criar usuário
CREATE TRIGGER trigger_create_notification_preferences
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_default_notification_preferences();

-- Função para verificar se usuário aceita notificações
CREATE OR REPLACE FUNCTION should_send_notification(
  user_id UUID,
  notification_type TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  preferences RECORD;
  current_time TIME;
  current_day INTEGER;
BEGIN
  -- Buscar preferências do usuário
  SELECT * INTO preferences
  FROM notification_preferences
  WHERE notification_preferences.user_id = should_send_notification.user_id;
  
  -- Se não tem preferências, usar padrão (aceitar)
  IF preferences IS NULL THEN
    RETURN TRUE;
  END IF;
  
  -- Verificar tipo específico de notificação
  CASE notification_type
    WHEN 'new_messages' THEN
      IF NOT preferences.new_messages THEN RETURN FALSE; END IF;
    WHEN 'appointment_reminders' THEN
      IF NOT preferences.appointment_reminders THEN RETURN FALSE; END IF;
    WHEN 'payment_updates' THEN
      IF NOT preferences.payment_updates THEN RETURN FALSE; END IF;
    WHEN 'service_updates' THEN
      IF NOT preferences.service_updates THEN RETURN FALSE; END IF;
    WHEN 'marketing' THEN
      IF NOT preferences.marketing THEN RETURN FALSE; END IF;
  END CASE;
  
  -- Verificar horário silencioso
  current_time := CURRENT_TIME;
  IF current_time >= preferences.quiet_hours_start OR current_time <= preferences.quiet_hours_end THEN
    RETURN FALSE;
  END IF;
  
  -- Verificar fim de semana
  current_day := EXTRACT(DOW FROM CURRENT_DATE);
  IF (current_day = 0 OR current_day = 6) AND NOT preferences.weekend_notifications THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para registrar notificação enviada
CREATE OR REPLACE FUNCTION log_notification(
  user_id UUID,
  title TEXT,
  body TEXT,
  data JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO notification_history (user_id, title, body, data)
  VALUES (user_id, title, body, data)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- TRIGGERS
-- =============================================

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_notification_tokens_updated_at
  BEFORE UPDATE ON notification_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- VIEWS ÚTEIS
-- =============================================

-- View para estatísticas de notificações
CREATE OR REPLACE VIEW notification_stats AS
SELECT 
  DATE_TRUNC('day', sent_at) as date,
  COUNT(*) as total_sent,
  COUNT(*) FILTER (WHERE status = 'delivered') as delivered,
  COUNT(*) FILTER (WHERE status = 'clicked') as clicked,
  COUNT(*) FILTER (WHERE status = 'failed') as failed,
  ROUND(
    COUNT(*) FILTER (WHERE status = 'clicked')::DECIMAL / 
    NULLIF(COUNT(*) FILTER (WHERE status = 'delivered'), 0) * 100, 
    2
  ) as click_rate
FROM notification_history
GROUP BY DATE_TRUNC('day', sent_at)
ORDER BY date DESC;

-- =============================================
-- DADOS INICIAIS
-- =============================================

-- Criar preferências para usuários existentes
INSERT INTO notification_preferences (user_id)
SELECT id FROM profiles
WHERE id NOT IN (SELECT user_id FROM notification_preferences);

-- =============================================
-- VERIFICAÇÃO FINAL
-- =============================================

-- Verificar se tudo foi criado corretamente
SELECT 
  'notification_tokens' as table_name,
  COUNT(*) as row_count
FROM notification_tokens
UNION ALL
SELECT 
  'notification_history' as table_name,
  COUNT(*) as row_count
FROM notification_history
UNION ALL
SELECT 
  'notification_preferences' as table_name,
  COUNT(*) as row_count
FROM notification_preferences;

COMMIT;
