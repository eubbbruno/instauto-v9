-- CHAT REALTIME - CONFIGURAÇÃO COMPLETA NO SUPABASE
-- Execute este SQL no Supabase SQL Editor

-- 1. CRIAR TABELAS
-- =================

-- Tabela de conversas
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
  last_message TEXT,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(driver_id, workshop_id)
);

-- Tabela de mensagens
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT,
  type VARCHAR(20) DEFAULT 'text' CHECK (type IN ('text', 'image', 'document')),
  attachment_url TEXT,
  status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- 2. CRIAR ÍNDICES
-- ================

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversations_driver_id ON conversations(driver_id);
CREATE INDEX IF NOT EXISTS idx_conversations_workshop_id ON conversations(workshop_id);

-- 3. HABILITAR RLS
-- ================

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 4. CRIAR POLICIES
-- =================

-- Policies para conversations
CREATE POLICY "Users can see their conversations" ON conversations
  FOR SELECT USING (
    auth.uid() = driver_id OR 
    auth.uid() IN (SELECT owner_id FROM workshops WHERE id = workshop_id)
  );

CREATE POLICY "Users can create conversations" ON conversations
  FOR INSERT WITH CHECK (
    auth.uid() = driver_id OR 
    auth.uid() IN (SELECT owner_id FROM workshops WHERE id = workshop_id)
  );

CREATE POLICY "Users can update their conversations" ON conversations
  FOR UPDATE USING (
    auth.uid() = driver_id OR 
    auth.uid() IN (SELECT owner_id FROM workshops WHERE id = workshop_id)
  );

-- Policies para messages
CREATE POLICY "Users can see messages in their conversations" ON messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM conversations 
      WHERE driver_id = auth.uid() OR 
      workshop_id IN (SELECT id FROM workshops WHERE owner_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    conversation_id IN (
      SELECT id FROM conversations 
      WHERE driver_id = auth.uid() OR 
      workshop_id IN (SELECT id FROM workshops WHERE owner_id = auth.uid())
    )
  );

CREATE POLICY "Users can update their own messages" ON messages
  FOR UPDATE USING (
    sender_id = auth.uid() OR
    conversation_id IN (
      SELECT id FROM conversations 
      WHERE driver_id = auth.uid() OR 
      workshop_id IN (SELECT id FROM workshops WHERE owner_id = auth.uid())
    )
  );

-- 5. CRIAR FUNÇÃO PARA ATUALIZAR ÚLTIMA MENSAGEM
-- ===============================================

CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations 
  SET 
    last_message = NEW.message,
    last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. CRIAR TRIGGER
-- ================

DROP TRIGGER IF EXISTS update_conversation_on_new_message ON messages;
CREATE TRIGGER update_conversation_on_new_message
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_last_message();

-- 7. CRIAR FUNÇÃO PARA CRIAR CONVERSA
-- ====================================

CREATE OR REPLACE FUNCTION create_or_get_conversation(
  p_driver_id UUID,
  p_workshop_id UUID
)
RETURNS UUID AS $$
DECLARE
  v_conversation_id UUID;
BEGIN
  -- Tentar encontrar conversa existente
  SELECT id INTO v_conversation_id
  FROM conversations
  WHERE driver_id = p_driver_id AND workshop_id = p_workshop_id;
  
  -- Se não existir, criar nova
  IF v_conversation_id IS NULL THEN
    INSERT INTO conversations (driver_id, workshop_id)
    VALUES (p_driver_id, p_workshop_id)
    RETURNING id INTO v_conversation_id;
  END IF;
  
  RETURN v_conversation_id;
END;
$$ LANGUAGE plpgsql;

-- 8. CRIAR STORAGE BUCKET PARA ANEXOS
-- ===================================
-- Execute isso no Dashboard do Supabase:
-- 1. Vá para Storage
-- 2. Crie um novo bucket chamado "chat-attachments"
-- 3. Torne o bucket público
-- 4. Configure as políticas:

-- Política para upload
-- Nome: Users can upload their attachments
-- Operação: INSERT
-- Condição: auth.uid() IS NOT NULL

-- Política para visualizar
-- Nome: Anyone can view attachments
-- Operação: SELECT
-- Condição: true

-- Política para deletar
-- Nome: Users can delete their attachments
-- Operação: DELETE
-- Condição: auth.uid() IS NOT NULL

-- 9. DADOS DE TESTE (OPCIONAL)
-- ============================

-- Criar uma conversa de teste (substitua os IDs pelos reais)
-- INSERT INTO conversations (driver_id, workshop_id)
-- VALUES ('seu-driver-id', 'sua-workshop-id');

-- Criar mensagem de teste
-- INSERT INTO messages (conversation_id, sender_id, message)
-- VALUES ('id-da-conversa', 'seu-user-id', 'Olá! Esta é uma mensagem de teste.');

-- PRONTO! O CHAT ESTÁ CONFIGURADO NO SUPABASE
