-- 📱 SETUP PUSH NOTIFICATIONS - INSTAUTO V7

-- 1. TABELA DE SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Índices para performance
  UNIQUE(user_id, endpoint)
);

-- 2. TABELA DE PREFERÊNCIAS DE NOTIFICAÇÃO
CREATE TABLE IF NOT EXISTS user_notification_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  agendamentos BOOLEAN DEFAULT true,
  promocoes BOOLEAN DEFAULT false,
  mensagens BOOLEAN DEFAULT true,
  lembretes BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- 3. TABELA DE LOGS DE NOTIFICAÇÕES
CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  target_users UUID[] NOT NULL,
  sent_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_active ON push_subscriptions(is_active);
CREATE INDEX IF NOT EXISTS idx_notification_logs_created_at ON notification_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_user_notification_preferences_user_id ON user_notification_preferences(user_id);

-- 5. RLS POLICIES

-- Push Subscriptions
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own subscriptions" ON push_subscriptions;
CREATE POLICY "Users can manage own subscriptions" ON push_subscriptions
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all subscriptions" ON push_subscriptions;
CREATE POLICY "Admins can view all subscriptions" ON push_subscriptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND type = 'admin'
    )
  );

-- User Notification Preferences
ALTER TABLE user_notification_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own preferences" ON user_notification_preferences;
CREATE POLICY "Users can manage own preferences" ON user_notification_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Notification Logs (apenas admin)
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Only admins can access logs" ON notification_logs;
CREATE POLICY "Only admins can access logs" ON notification_logs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND type = 'admin'
    )
  );

-- 6. TRIGGER PARA UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_push_subscriptions_updated_at ON push_subscriptions;
CREATE TRIGGER update_push_subscriptions_updated_at
  BEFORE UPDATE ON push_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_notification_preferences_updated_at ON user_notification_preferences;
CREATE TRIGGER update_user_notification_preferences_updated_at
  BEFORE UPDATE ON user_notification_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. FUNÇÃO PARA ENVIAR NOTIFICAÇÕES (HELPER)
CREATE OR REPLACE FUNCTION send_push_notification(
  p_user_ids UUID[],
  p_title TEXT,
  p_body TEXT,
  p_data JSONB DEFAULT NULL
)
RETURNS TABLE(sent_count INTEGER, failed_count INTEGER) AS $$
DECLARE
  v_subscription RECORD;
  v_sent INTEGER := 0;
  v_failed INTEGER := 0;
  v_payload JSONB;
BEGIN
  -- Preparar payload
  v_payload := jsonb_build_object(
    'title', p_title,
    'body', p_body,
    'icon', '/images/logo-of.svg',
    'badge', '/images/logo-of.svg',
    'data', COALESCE(p_data, '{}'::jsonb),
    'timestamp', extract(epoch from now()) * 1000
  );

  -- Buscar subscriptions ativas dos usuários
  FOR v_subscription IN 
    SELECT * FROM push_subscriptions 
    WHERE user_id = ANY(p_user_ids) 
    AND is_active = true
  LOOP
    -- Aqui você faria a chamada para o serviço de push
    -- Por enquanto, apenas contamos como enviado
    v_sent := v_sent + 1;
  END LOOP;

  -- Salvar log
  INSERT INTO notification_logs (title, body, target_users, sent_count, failed_count, payload)
  VALUES (p_title, p_body, p_user_ids, v_sent, v_failed, v_payload);

  RETURN QUERY SELECT v_sent, v_failed;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. FUNÇÃO PARA NOTIFICAR AGENDAMENTO
CREATE OR REPLACE FUNCTION notify_agendamento_created(
  p_agendamento_id UUID,
  p_motorista_id UUID,
  p_oficina_name TEXT,
  p_service_type TEXT,
  p_datetime TIMESTAMP WITH TIME ZONE
)
RETURNS VOID AS $$
DECLARE
  v_title TEXT;
  v_body TEXT;
  v_data JSONB;
BEGIN
  v_title := 'Agendamento Confirmado';
  v_body := format('Seu %s foi agendado para %s na %s', 
    p_service_type, 
    to_char(p_datetime, 'DD/MM às HH24:MI'),
    p_oficina_name
  );
  
  v_data := jsonb_build_object(
    'type', 'agendamento',
    'agendamento_id', p_agendamento_id,
    'oficina_name', p_oficina_name,
    'url', '/motorista/agendamentos'
  );

  PERFORM send_push_notification(
    ARRAY[p_motorista_id], 
    v_title, 
    v_body, 
    v_data
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. FUNÇÃO PARA NOTIFICAR MENSAGEM
CREATE OR REPLACE FUNCTION notify_new_message(
  p_receiver_id UUID,
  p_sender_name TEXT,
  p_message_preview TEXT,
  p_conversation_id UUID
)
RETURNS VOID AS $$
DECLARE
  v_title TEXT;
  v_body TEXT;
  v_data JSONB;
  v_preferences RECORD;
BEGIN
  -- Verificar se usuário aceita notificações de mensagem
  SELECT * INTO v_preferences 
  FROM user_notification_preferences 
  WHERE user_id = p_receiver_id;

  IF v_preferences.mensagens IS FALSE THEN
    RETURN; -- Usuário não quer notificações de mensagem
  END IF;

  v_title := format('Mensagem de %s', p_sender_name);
  v_body := p_message_preview;
  
  v_data := jsonb_build_object(
    'type', 'mensagem',
    'conversation_id', p_conversation_id,
    'sender_name', p_sender_name,
    'url', '/mensagens'
  );

  PERFORM send_push_notification(
    ARRAY[p_receiver_id], 
    v_title, 
    v_body, 
    v_data
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. CRIAR PREFERÊNCIAS PADRÃO PARA USUÁRIOS EXISTENTES
INSERT INTO user_notification_preferences (user_id, agendamentos, promocoes, mensagens, lembretes)
SELECT 
  id as user_id,
  true as agendamentos,
  false as promocoes, 
  true as mensagens,
  true as lembretes
FROM profiles 
WHERE id NOT IN (SELECT user_id FROM user_notification_preferences)
ON CONFLICT (user_id) DO NOTHING;

-- ✅ SETUP COMPLETO!
-- Execute este script no SQL Editor do Supabase para configurar push notifications

SELECT 'Push Notifications setup completed successfully!' as status;
