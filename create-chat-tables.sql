-- Criar tabelas para sistema de chat em tempo real

-- Tabela de mensagens
CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    type TEXT DEFAULT 'text' CHECK (type IN ('text', 'image', 'file', 'location')),
    status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read')),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de conversas
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_1 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    participant_2 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    last_message_id TEXT REFERENCES messages(id),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(participant_1, participant_2)
);

-- Tabela de status dos usuários
CREATE TABLE IF NOT EXISTS user_status (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'away', 'busy')),
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_typing_to UUID REFERENCES auth.users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de configurações de chat
CREATE TABLE IF NOT EXISTS chat_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    notifications_enabled BOOLEAN DEFAULT true,
    sound_enabled BOOLEAN DEFAULT true,
    read_receipts_enabled BOOLEAN DEFAULT true,
    typing_indicators_enabled BOOLEAN DEFAULT true,
    online_status_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver ON messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_participants ON conversations(participant_1, participant_2);
CREATE INDEX IF NOT EXISTS idx_conversations_last_activity ON conversations(last_activity DESC);
CREATE INDEX IF NOT EXISTS idx_user_status_updated_at ON user_status(updated_at DESC);

-- Políticas RLS (Row Level Security)

-- Messages: usuários podem ver apenas suas próprias mensagens
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own messages" ON messages
    FOR ALL 
    USING (
        auth.uid() = sender_id OR 
        auth.uid() = receiver_id
    );

CREATE POLICY "Users can insert their own messages" ON messages
    FOR INSERT 
    WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own sent messages" ON messages
    FOR UPDATE 
    USING (auth.uid() = sender_id);

-- Conversations: usuários podem ver apenas conversas que participam
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their conversations" ON conversations
    FOR ALL 
    USING (
        auth.uid() = participant_1 OR 
        auth.uid() = participant_2
    );

CREATE POLICY "Users can create conversations" ON conversations
    FOR INSERT 
    WITH CHECK (
        auth.uid() = participant_1 OR 
        auth.uid() = participant_2
    );

-- User Status: usuários podem ver status de outros, mas só podem alterar o próprio
ALTER TABLE user_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all user status" ON user_status
    FOR SELECT 
    USING (true);

CREATE POLICY "Users can update their own status" ON user_status
    FOR ALL 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Chat Settings: usuários podem ver/alterar apenas suas próprias configurações
ALTER TABLE chat_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own chat settings" ON chat_settings
    FOR ALL 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Funções para atualizar timestamps automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_messages_updated_at 
    BEFORE UPDATE ON messages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_status_updated_at 
    BEFORE UPDATE ON user_status 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_settings_updated_at 
    BEFORE UPDATE ON chat_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Função para atualizar última atividade da conversa
CREATE OR REPLACE FUNCTION update_conversation_activity()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualizar conversa quando nova mensagem é inserida
    UPDATE conversations 
    SET 
        last_message_id = NEW.id,
        last_activity = NEW.created_at
    WHERE 
        (participant_1 = NEW.sender_id AND participant_2 = NEW.receiver_id) OR
        (participant_1 = NEW.receiver_id AND participant_2 = NEW.sender_id);
    
    -- Se conversa não existe, criar uma nova
    IF NOT FOUND THEN
        INSERT INTO conversations (participant_1, participant_2, last_message_id, last_activity)
        VALUES (
            LEAST(NEW.sender_id, NEW.receiver_id),
            GREATEST(NEW.sender_id, NEW.receiver_id),
            NEW.id,
            NEW.created_at
        );
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar conversa automaticamente
CREATE TRIGGER update_conversation_on_message 
    AFTER INSERT ON messages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_conversation_activity();

-- Função para buscar mensagens de uma conversa
CREATE OR REPLACE FUNCTION get_conversation_messages(
    user_id_1 UUID, 
    user_id_2 UUID, 
    limit_count INT DEFAULT 50,
    offset_count INT DEFAULT 0
)
RETURNS TABLE (
    id TEXT,
    sender_id UUID,
    receiver_id UUID,
    content TEXT,
    type TEXT,
    status TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.id,
        m.sender_id,
        m.receiver_id,
        m.content,
        m.type,
        m.status,
        m.metadata,
        m.created_at
    FROM messages m
    WHERE 
        (m.sender_id = user_id_1 AND m.receiver_id = user_id_2) OR
        (m.sender_id = user_id_2 AND m.receiver_id = user_id_1)
    ORDER BY m.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ language 'plpgsql';

-- Função para buscar conversas de um usuário
CREATE OR REPLACE FUNCTION get_user_conversations(user_uuid UUID)
RETURNS TABLE (
    conversation_id UUID,
    other_user_id UUID,
    last_message_content TEXT,
    last_message_time TIMESTAMP WITH TIME ZONE,
    unread_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id as conversation_id,
        CASE 
            WHEN c.participant_1 = user_uuid THEN c.participant_2
            ELSE c.participant_1
        END as other_user_id,
        m.content as last_message_content,
        c.last_activity as last_message_time,
        (
            SELECT COUNT(*)
            FROM messages m2
            WHERE m2.receiver_id = user_uuid 
            AND m2.status != 'read'
            AND (
                (m2.sender_id = c.participant_1 AND c.participant_2 = user_uuid) OR
                (m2.sender_id = c.participant_2 AND c.participant_1 = user_uuid)
            )
        ) as unread_count
    FROM conversations c
    LEFT JOIN messages m ON c.last_message_id = m.id
    WHERE c.participant_1 = user_uuid OR c.participant_2 = user_uuid
    ORDER BY c.last_activity DESC;
END;
$$ language 'plpgsql';

-- Inserir configurações padrão para usuários existentes
INSERT INTO chat_settings (user_id)
SELECT id FROM auth.users
WHERE id NOT IN (SELECT user_id FROM chat_settings)
ON CONFLICT (user_id) DO NOTHING;

-- Inserir status padrão para usuários existentes  
INSERT INTO user_status (user_id)
SELECT id FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_status)
ON CONFLICT (user_id) DO NOTHING;
