-- Criar tabelas para sistema de Chat Tempo Real

-- Tabela de conversas/canais
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('direct', 'group', 'support')),
  title TEXT,
  description TEXT,
  avatar_url TEXT,
  participants UUID[] NOT NULL, -- Array de user IDs
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Tabela de mensagens
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  sender_avatar TEXT,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system', 'voice')),
  reply_to UUID REFERENCES messages(id) ON DELETE SET NULL,
  attachments JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  read_by UUID[] DEFAULT '{}', -- Array de user IDs que leram
  edited_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de status de usuários online
CREATE TABLE IF NOT EXISTS user_status (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'away', 'busy')),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  typing_in UUID REFERENCES conversations(id) ON DELETE SET NULL,
  device_info JSONB DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de participantes das conversas (para controle mais granular)
CREATE TABLE IF NOT EXISTS conversation_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'guest')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  left_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  notifications_enabled BOOLEAN DEFAULT true,
  last_read_message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

-- Tabela de configurações de chat do usuário
CREATE TABLE IF NOT EXISTS chat_settings (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  notifications_enabled BOOLEAN DEFAULT true,
  sound_enabled BOOLEAN DEFAULT true,
  desktop_notifications BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT false,
  auto_read_messages BOOLEAN DEFAULT false,
  typing_indicators BOOLEAN DEFAULT true,
  read_receipts BOOLEAN DEFAULT true,
  theme TEXT DEFAULT 'auto' CHECK (theme IN ('light', 'dark', 'auto')),
  font_size TEXT DEFAULT 'medium' CHECK (font_size IN ('small', 'medium', 'large')),
  language TEXT DEFAULT 'pt-BR',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_conversations_participants ON conversations USING GIN (participants);
CREATE INDEX IF NOT EXISTS idx_conversations_type ON conversations(type);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_active ON conversations(is_active);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_type ON messages(message_type);
CREATE INDEX IF NOT EXISTS idx_messages_read_by ON messages USING GIN (read_by);

CREATE INDEX IF NOT EXISTS idx_user_status_status ON user_status(status);
CREATE INDEX IF NOT EXISTS idx_user_status_last_seen ON user_status(last_seen DESC);
CREATE INDEX IF NOT EXISTS idx_user_status_typing ON user_status(typing_in);

CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation ON conversation_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user ON conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_active ON conversation_participants(is_active);

-- RLS (Row Level Security)
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_settings ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para conversations
CREATE POLICY "Users can see conversations they participate in" ON conversations
  FOR SELECT USING (auth.uid() = ANY(participants));

CREATE POLICY "Users can create conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Participants can update conversations" ON conversations
  FOR UPDATE USING (auth.uid() = ANY(participants));

-- Políticas RLS para messages
CREATE POLICY "Users can see messages in their conversations" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND auth.uid() = ANY(conversations.participants)
    )
  );

CREATE POLICY "Users can send messages to their conversations" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND auth.uid() = ANY(conversations.participants)
    )
  );

CREATE POLICY "Users can update their own messages" ON messages
  FOR UPDATE USING (auth.uid() = sender_id);

-- Políticas RLS para user_status
CREATE POLICY "Users can see all user status" ON user_status
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own status" ON user_status
  FOR ALL USING (auth.uid() = user_id);

-- Políticas RLS para conversation_participants
CREATE POLICY "Users can see participants in their conversations" ON conversation_participants
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = conversation_participants.conversation_id 
      AND auth.uid() = ANY(conversations.participants)
    )
  );

CREATE POLICY "Users can manage their own participation" ON conversation_participants
  FOR ALL USING (auth.uid() = user_id);

-- Políticas RLS para chat_settings
CREATE POLICY "Users can manage their own chat settings" ON chat_settings
  FOR ALL USING (auth.uid() = user_id);

-- Triggers para atualizar updated_at
CREATE OR REPLACE FUNCTION update_conversations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_conversations_updated_at();

CREATE OR REPLACE FUNCTION update_user_status_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_user_status_updated_at
  BEFORE UPDATE ON user_status
  FOR EACH ROW
  EXECUTE FUNCTION update_user_status_updated_at();

CREATE OR REPLACE FUNCTION update_chat_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_chat_settings_updated_at
  BEFORE UPDATE ON chat_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_settings_updated_at();

-- Trigger para atualizar last_message_at na conversation quando nova mensagem
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations 
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_conversation_last_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_last_message();

-- Função para criar configurações padrão do chat
CREATE OR REPLACE FUNCTION create_default_chat_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO chat_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  INSERT INTO user_status (user_id, status, last_seen)
  VALUES (NEW.id, 'offline', NOW())
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_chat_defaults
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_default_chat_settings();

-- Função para criar conversa direta entre dois usuários
CREATE OR REPLACE FUNCTION create_direct_conversation(
  user1_id UUID,
  user2_id UUID
) RETURNS UUID AS $$
DECLARE
  conversation_id UUID;
BEGIN
  -- Verificar se já existe conversa direta entre os usuários
  SELECT id INTO conversation_id
  FROM conversations
  WHERE type = 'direct'
    AND participants @> ARRAY[user1_id, user2_id]
    AND array_length(participants, 1) = 2;
  
  -- Se não existe, criar nova conversa
  IF conversation_id IS NULL THEN
    INSERT INTO conversations (type, participants, created_by)
    VALUES ('direct', ARRAY[user1_id, user2_id], user1_id)
    RETURNING id INTO conversation_id;
    
    -- Adicionar participantes
    INSERT INTO conversation_participants (conversation_id, user_id, role)
    VALUES 
      (conversation_id, user1_id, 'member'),
      (conversation_id, user2_id, 'member');
  END IF;
  
  RETURN conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para marcar mensagens como lidas
CREATE OR REPLACE FUNCTION mark_messages_as_read(
  conversation_id_param UUID,
  user_id_param UUID,
  up_to_message_id UUID DEFAULT NULL
) RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  -- Se up_to_message_id for fornecido, marcar até essa mensagem
  -- Senão, marcar todas as mensagens não lidas da conversa
  IF up_to_message_id IS NOT NULL THEN
    UPDATE messages 
    SET read_by = array_append(read_by, user_id_param)
    WHERE conversation_id = conversation_id_param
      AND id <= up_to_message_id
      AND NOT (read_by @> ARRAY[user_id_param])
      AND sender_id != user_id_param;
  ELSE
    UPDATE messages 
    SET read_by = array_append(read_by, user_id_param)
    WHERE conversation_id = conversation_id_param
      AND NOT (read_by @> ARRAY[user_id_param])
      AND sender_id != user_id_param;
  END IF;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  
  -- Atualizar last_read_at do participante
  UPDATE conversation_participants
  SET last_read_at = NOW(),
      last_read_message_id = COALESCE(up_to_message_id, (
        SELECT id FROM messages 
        WHERE conversation_id = conversation_id_param 
        ORDER BY created_at DESC 
        LIMIT 1
      ))
  WHERE conversation_id = conversation_id_param 
    AND user_id = user_id_param;
  
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para obter conversas do usuário com contagem de não lidas
CREATE OR REPLACE FUNCTION get_user_conversations(user_id_param UUID)
RETURNS TABLE (
  conversation_id UUID,
  conversation_type TEXT,
  title TEXT,
  participants_count INTEGER,
  last_message TEXT,
  last_message_at TIMESTAMP WITH TIME ZONE,
  unread_count BIGINT,
  other_participant_name TEXT,
  other_participant_avatar TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.type,
    COALESCE(c.title, 
      CASE 
        WHEN c.type = 'direct' THEN (
          SELECT p.name 
          FROM profiles p 
          WHERE p.id = ANY(c.participants) 
            AND p.id != user_id_param 
          LIMIT 1
        )
        ELSE c.title
      END
    ) as title,
    array_length(c.participants, 1) as participants_count,
    (
      SELECT m.message 
      FROM messages m 
      WHERE m.conversation_id = c.id 
      ORDER BY m.created_at DESC 
      LIMIT 1
    ) as last_message,
    c.last_message_at,
    (
      SELECT COUNT(*)
      FROM messages m
      WHERE m.conversation_id = c.id
        AND NOT (m.read_by @> ARRAY[user_id_param])
        AND m.sender_id != user_id_param
        AND m.deleted_at IS NULL
    ) as unread_count,
    (
      SELECT p.name 
      FROM profiles p 
      WHERE p.id = ANY(c.participants) 
        AND p.id != user_id_param 
      LIMIT 1
    ) as other_participant_name,
    (
      SELECT p.avatar_url 
      FROM profiles p 
      WHERE p.id = ANY(c.participants) 
        AND p.id != user_id_param 
      LIMIT 1
    ) as other_participant_avatar
  FROM conversations c
  WHERE user_id_param = ANY(c.participants)
    AND c.is_active = true
  ORDER BY c.last_message_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função de limpeza de dados antigos
CREATE OR REPLACE FUNCTION cleanup_old_chat_data()
RETURNS void AS $$
BEGIN
  -- Remover mensagens deletadas há mais de 30 dias
  DELETE FROM messages 
  WHERE deleted_at IS NOT NULL 
    AND deleted_at < NOW() - INTERVAL '30 days';
  
  -- Resetar status de usuários inativos há mais de 7 dias
  UPDATE user_status 
  SET status = 'offline', typing_in = NULL
  WHERE last_seen < NOW() - INTERVAL '7 days'
    AND status != 'offline';
  
  -- Arquivar conversas inativas há mais de 90 dias
  UPDATE conversations
  SET is_active = false
  WHERE last_message_at < NOW() - INTERVAL '90 days'
    AND is_active = true
    AND type != 'support'; -- Manter conversas de suporte sempre ativas
  
  RAISE NOTICE 'Cleanup de dados do chat concluído';
END;
$$ LANGUAGE plpgsql;

-- Comentários
COMMENT ON TABLE conversations IS 'Conversas/canais de chat';
COMMENT ON TABLE messages IS 'Mensagens do chat com suporte a anexos e replies';
COMMENT ON TABLE user_status IS 'Status online/offline dos usuários em tempo real';
COMMENT ON TABLE conversation_participants IS 'Participantes das conversas com roles e controle de leitura';
COMMENT ON TABLE chat_settings IS 'Configurações pessoais de chat de cada usuário';

-- Habilitar Real-time para as tabelas principais
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE user_status;
ALTER PUBLICATION supabase_realtime ADD TABLE conversation_participants;

-- Dados iniciais/exemplo
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM conversations LIMIT 1) THEN
    RAISE NOTICE 'Tabelas de chat tempo real criadas com sucesso!';
    RAISE NOTICE 'Real-time habilitado para: conversations, messages, user_status, conversation_participants';
    RAISE NOTICE 'Configurar WebSocket server em: /api/ws';
  END IF;
END
$$;
