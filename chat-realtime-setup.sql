-- =============================================
-- SETUP CHAT TEMPO REAL - INSTAUTO V7
-- =============================================

-- 1. TABELA DE SALAS DE CHAT
CREATE TABLE IF NOT EXISTS chat_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  motorista_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  oficina_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Índices únicos para evitar salas duplicadas
  UNIQUE(motorista_id, oficina_id)
);

-- 2. TABELA DE MENSAGENS
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  
  -- Índices para performance
  INDEX idx_chat_messages_room_id (room_id),
  INDEX idx_chat_messages_sender_id (sender_id),
  INDEX idx_chat_messages_receiver_id (receiver_id),
  INDEX idx_chat_messages_created_at (created_at DESC)
);

-- 3. FUNÇÃO PARA ATUALIZAR updated_at
CREATE OR REPLACE FUNCTION update_chat_room_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chat_rooms 
  SET updated_at = NOW() 
  WHERE id = NEW.room_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. TRIGGER PARA ATUALIZAR TIMESTAMP DA SALA
CREATE TRIGGER trigger_update_chat_room_timestamp
  AFTER INSERT ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_room_timestamp();

-- =============================================
-- RLS POLICIES - SEGURANÇA
-- =============================================

-- Habilitar RLS
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- POLICIES PARA CHAT_ROOMS
-- Usuários podem ver salas onde participam
CREATE POLICY "Users can view their own chat rooms" ON chat_rooms
  FOR SELECT USING (
    auth.uid() = motorista_id OR auth.uid() = oficina_id
  );

-- Usuários podem criar salas onde participam
CREATE POLICY "Users can create chat rooms" ON chat_rooms
  FOR INSERT WITH CHECK (
    auth.uid() = motorista_id OR auth.uid() = oficina_id
  );

-- POLICIES PARA CHAT_MESSAGES
-- Usuários podem ver mensagens das suas salas
CREATE POLICY "Users can view messages from their rooms" ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_rooms 
      WHERE chat_rooms.id = chat_messages.room_id 
      AND (chat_rooms.motorista_id = auth.uid() OR chat_rooms.oficina_id = auth.uid())
    )
  );

-- Usuários podem enviar mensagens nas suas salas
CREATE POLICY "Users can send messages in their rooms" ON chat_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM chat_rooms 
      WHERE chat_rooms.id = chat_messages.room_id 
      AND (chat_rooms.motorista_id = auth.uid() OR chat_rooms.oficina_id = auth.uid())
    )
  );

-- Usuários podem atualizar suas próprias mensagens (marcar como lida)
CREATE POLICY "Users can update their received messages" ON chat_messages
  FOR UPDATE USING (
    auth.uid() = receiver_id
  );

-- =============================================
-- VIEWS ÚTEIS
-- =============================================

-- View para listar salas com última mensagem
CREATE OR REPLACE VIEW chat_rooms_with_last_message AS
SELECT 
  cr.*,
  lm.message as last_message,
  lm.created_at as last_message_at,
  lm.sender_id as last_message_sender_id,
  -- Contar mensagens não lidas
  (
    SELECT COUNT(*) 
    FROM chat_messages cm 
    WHERE cm.room_id = cr.id 
    AND cm.receiver_id = auth.uid() 
    AND cm.read_at IS NULL
  ) as unread_count
FROM chat_rooms cr
LEFT JOIN LATERAL (
  SELECT message, created_at, sender_id
  FROM chat_messages 
  WHERE room_id = cr.id 
  ORDER BY created_at DESC 
  LIMIT 1
) lm ON true
WHERE cr.motorista_id = auth.uid() OR cr.oficina_id = auth.uid()
ORDER BY COALESCE(lm.created_at, cr.created_at) DESC;

-- =============================================
-- FUNÇÕES ÚTEIS
-- =============================================

-- Função para buscar ou criar sala de chat
CREATE OR REPLACE FUNCTION get_or_create_chat_room(
  p_motorista_id UUID,
  p_oficina_id UUID
)
RETURNS UUID AS $$
DECLARE
  room_id UUID;
BEGIN
  -- Tentar encontrar sala existente
  SELECT id INTO room_id
  FROM chat_rooms
  WHERE motorista_id = p_motorista_id AND oficina_id = p_oficina_id;
  
  -- Se não encontrar, criar nova
  IF room_id IS NULL THEN
    INSERT INTO chat_rooms (motorista_id, oficina_id)
    VALUES (p_motorista_id, p_oficina_id)
    RETURNING id INTO room_id;
  END IF;
  
  RETURN room_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para contar mensagens não lidas
CREATE OR REPLACE FUNCTION get_unread_messages_count(user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM chat_messages
    WHERE receiver_id = user_id AND read_at IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- REALTIME SUBSCRIPTIONS
-- =============================================

-- Habilitar realtime para as tabelas
ALTER PUBLICATION supabase_realtime ADD TABLE chat_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;

-- =============================================
-- ÍNDICES PARA PERFORMANCE
-- =============================================

-- Índices compostos para queries comuns
CREATE INDEX IF NOT EXISTS idx_chat_rooms_participants ON chat_rooms(motorista_id, oficina_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_created ON chat_messages(room_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_unread ON chat_messages(receiver_id, read_at) WHERE read_at IS NULL;

-- =============================================
-- DADOS DE TESTE (OPCIONAL)
-- =============================================

-- Inserir algumas salas de teste (descomente se necessário)
/*
INSERT INTO chat_rooms (motorista_id, oficina_id) 
SELECT 
  (SELECT id FROM profiles WHERE type = 'motorista' LIMIT 1),
  (SELECT id FROM profiles WHERE type = 'oficina' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM chat_rooms LIMIT 1);

-- Inserir algumas mensagens de teste
INSERT INTO chat_messages (room_id, sender_id, receiver_id, message)
SELECT 
  (SELECT id FROM chat_rooms LIMIT 1),
  (SELECT id FROM profiles WHERE type = 'motorista' LIMIT 1),
  (SELECT id FROM profiles WHERE type = 'oficina' LIMIT 1),
  'Olá! Gostaria de agendar um serviço.'
WHERE NOT EXISTS (SELECT 1 FROM chat_messages LIMIT 1);
*/

-- =============================================
-- VERIFICAÇÃO FINAL
-- =============================================

-- Verificar se tudo foi criado corretamente
SELECT 
  'chat_rooms' as table_name,
  COUNT(*) as row_count
FROM chat_rooms
UNION ALL
SELECT 
  'chat_messages' as table_name,
  COUNT(*) as row_count
FROM chat_messages;

-- Verificar policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('chat_rooms', 'chat_messages');

COMMIT;
