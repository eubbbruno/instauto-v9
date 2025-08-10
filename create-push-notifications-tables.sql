-- Criar tabelas para sistema de Push Notifications

-- Tabela para armazenar subscriptions de push
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para logs de notificações enviadas
CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user_type TEXT NOT NULL,
  notification_data JSONB NOT NULL,
  sent_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para configurações de notificação do usuário
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  messages BOOLEAN DEFAULT true,
  appointments BOOLEAN DEFAULT true,
  quotes BOOLEAN DEFAULT true,
  maintenance_reminders BOOLEAN DEFAULT true,
  service_updates BOOLEAN DEFAULT true,
  emergency_alerts BOOLEAN DEFAULT true,
  marketing BOOLEAN DEFAULT false,
  sound BOOLEAN DEFAULT true,
  vibration BOOLEAN DEFAULT true,
  quiet_hours_start TIME DEFAULT '22:00',
  quiet_hours_end TIME DEFAULT '08:00',
  quiet_hours_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_active ON push_subscriptions(active);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);
CREATE INDEX IF NOT EXISTS idx_notification_logs_user_id ON notification_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_created_at ON notification_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON notification_preferences(user_id);

-- RLS (Row Level Security)
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para push_subscriptions
CREATE POLICY "Users can manage own push subscriptions" ON push_subscriptions
  FOR ALL USING (auth.uid() = user_id);

-- Políticas RLS para notification_logs
CREATE POLICY "Users can read own notification logs" ON notification_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Sistema pode inserir logs
CREATE POLICY "System can insert notification logs" ON notification_logs
  FOR INSERT WITH CHECK (true);

-- Políticas RLS para notification_preferences
CREATE POLICY "Users can manage own notification preferences" ON notification_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Triggers para atualizar updated_at
CREATE OR REPLACE FUNCTION update_push_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_push_subscriptions_updated_at
  BEFORE UPDATE ON push_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_push_subscriptions_updated_at();

CREATE OR REPLACE FUNCTION update_notification_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_notification_preferences_updated_at();

-- Função para criar preferências padrão ao criar usuário
CREATE OR REPLACE FUNCTION create_default_notification_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_notification_preferences
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_default_notification_preferences();

-- Função para limpar subscriptions antigas/inativas
CREATE OR REPLACE FUNCTION cleanup_inactive_subscriptions()
RETURNS void AS $$
BEGIN
  -- Remover subscriptions inativas há mais de 30 dias
  DELETE FROM push_subscriptions 
  WHERE active = false 
    AND updated_at < NOW() - INTERVAL '30 days';
  
  -- Remover logs antigos (mais de 90 dias)
  DELETE FROM notification_logs 
  WHERE created_at < NOW() - INTERVAL '90 days';
  
  RAISE NOTICE 'Cleanup de subscriptions e logs concluído';
END;
$$ LANGUAGE plpgsql;

-- Comentários
COMMENT ON TABLE push_subscriptions IS 'Armazena subscriptions de push notifications dos usuários';
COMMENT ON TABLE notification_logs IS 'Log de notificações enviadas para auditoria';
COMMENT ON TABLE notification_preferences IS 'Preferências de notificação de cada usuário';

COMMENT ON COLUMN push_subscriptions.endpoint IS 'URL endpoint do browser para push';
COMMENT ON COLUMN push_subscriptions.p256dh IS 'Chave pública para criptografia';
COMMENT ON COLUMN push_subscriptions.auth IS 'Chave de autenticação';
COMMENT ON COLUMN push_subscriptions.active IS 'Se a subscription ainda está válida';

COMMENT ON COLUMN notification_preferences.quiet_hours_start IS 'Horário de início do modo silencioso';
COMMENT ON COLUMN notification_preferences.quiet_hours_end IS 'Horário de fim do modo silencioso';

-- Dados iniciais/exemplo
DO $$
BEGIN
  -- Criar algumas preferências de exemplo se não existirem usuários
  IF NOT EXISTS (SELECT 1 FROM notification_preferences LIMIT 1) THEN
    RAISE NOTICE 'Tabelas de push notifications criadas com sucesso!';
    RAISE NOTICE 'Configure as VAPID keys no .env.local:';
    RAISE NOTICE 'NEXT_PUBLIC_VAPID_KEY=sua_vapid_public_key';
    RAISE NOTICE 'VAPID_PRIVATE_KEY=sua_vapid_private_key';
    RAISE NOTICE 'INTERNAL_API_TOKEN=token_seguro_para_apis_internas';
  END IF;
END
$$;
