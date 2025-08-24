-- ============================================================================
-- 💬 SISTEMA DE CHAT TEMPO REAL - INSTAUTO V7
-- ============================================================================
-- Este script cria toda a infraestrutura para chat tempo real
-- Execute no Supabase SQL Editor

-- ============================================================================
-- 1. TABELA DE CONVERSAS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Participantes
    motorista_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    oficina_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- Metadados da conversa
    subject TEXT, -- Assunto principal (ex: "Manutenção preventiva Honda Civic")
    status TEXT CHECK (status IN ('active', 'closed', 'archived')) DEFAULT 'active',
    priority TEXT CHECK (priority IN ('low', 'normal', 'high', 'urgent')) DEFAULT 'normal',
    
    -- Contexto do agendamento (opcional)
    agendamento_id UUID, -- Pode referenciar um agendamento futuro
    vehicle_info JSONB, -- Informações do veículo relacionado
    
    -- Metadados de controle
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Constraints
    UNIQUE(motorista_id, oficina_id, agendamento_id),
    CHECK (motorista_id != oficina_id)
);

-- ============================================================================
-- 2. TABELA DE MENSAGENS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    
    -- Remetente
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    sender_type TEXT CHECK (sender_type IN ('motorista', 'oficina')) NOT NULL,
    
    -- Conteúdo da mensagem
    content TEXT NOT NULL,
    message_type TEXT CHECK (message_type IN (
        'text', 'image', 'document', 'audio', 'video', 
        'location', 'quote', 'appointment', 'system'
    )) DEFAULT 'text',
    
    -- Metadados
    attachments JSONB DEFAULT '[]', -- URLs de arquivos anexados
    metadata JSONB DEFAULT '{}', -- Dados extras (localização, cotação, etc)
    
    -- Status da mensagem
    is_read BOOLEAN DEFAULT FALSE,
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP WITH TIME ZONE,
    
    -- Controle temporal
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Índices para performance
    CONSTRAINT valid_content CHECK (LENGTH(TRIM(content)) > 0)
);

-- ============================================================================
-- 3. TABELA DE STATUS DE LEITURA
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.message_reads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE NOT NULL,
    reader_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Constraints
    UNIQUE(message_id, reader_id)
);

-- ============================================================================
-- 4. TABELA DE PRESENÇA ONLINE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_presence (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    status TEXT CHECK (status IN ('online', 'offline', 'away', 'busy')) DEFAULT 'offline',
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    current_conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL,
    
    -- Metadados de sessão
    device_info JSONB DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- 5. ÍNDICES PARA PERFORMANCE OTIMIZADA
-- ============================================================================

-- Conversas
CREATE INDEX IF NOT EXISTS idx_conversations_motorista ON public.conversations(motorista_id);
CREATE INDEX IF NOT EXISTS idx_conversations_oficina ON public.conversations(oficina_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON public.conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON public.conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_updated ON public.conversations(updated_at DESC);

-- Mensagens  
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON public.messages(conversation_id, is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_messages_type ON public.messages(message_type);

-- Leituras
CREATE INDEX IF NOT EXISTS idx_message_reads_message ON public.message_reads(message_id);
CREATE INDEX IF NOT EXISTS idx_message_reads_reader ON public.message_reads(reader_id);

-- Presença
CREATE INDEX IF NOT EXISTS idx_user_presence_status ON public.user_presence(status);
CREATE INDEX IF NOT EXISTS idx_user_presence_last_seen ON public.user_presence(last_seen DESC);

-- ============================================================================
-- 6. RLS (ROW LEVEL SECURITY) POLICIES
-- ============================================================================

-- Conversas
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations" ON public.conversations
    FOR SELECT USING (
        auth.uid() = motorista_id OR 
        auth.uid() = oficina_id
    );

CREATE POLICY "Users can create conversations" ON public.conversations
    FOR INSERT WITH CHECK (
        auth.uid() = motorista_id OR 
        auth.uid() = oficina_id
    );

CREATE POLICY "Users can update own conversations" ON public.conversations
    FOR UPDATE USING (
        auth.uid() = motorista_id OR 
        auth.uid() = oficina_id
    );

-- Mensagens
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages from own conversations" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.conversations 
            WHERE id = conversation_id 
            AND (motorista_id = auth.uid() OR oficina_id = auth.uid())
        )
    );

CREATE POLICY "Users can send messages to own conversations" ON public.messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM public.conversations 
            WHERE id = conversation_id 
            AND (motorista_id = auth.uid() OR oficina_id = auth.uid())
        )
    );

CREATE POLICY "Users can update own messages" ON public.messages
    FOR UPDATE USING (auth.uid() = sender_id);

-- Leituras
ALTER TABLE public.message_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own message reads" ON public.message_reads
    FOR ALL USING (auth.uid() = reader_id);

-- Presença
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all presence" ON public.user_presence
    FOR SELECT USING (true);

CREATE POLICY "Users can update own presence" ON public.user_presence
    FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- 7. TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA
-- ============================================================================

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers
CREATE TRIGGER update_conversations_updated_at
    BEFORE UPDATE ON public.conversations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_messages_updated_at
    BEFORE UPDATE ON public.messages
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_presence_updated_at
    BEFORE UPDATE ON public.user_presence
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para atualizar last_message_at na conversa
CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.conversations 
    SET 
        last_message_at = NEW.created_at,
        updated_at = NEW.created_at
    WHERE id = NEW.conversation_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_on_new_message
    AFTER INSERT ON public.messages
    FOR EACH ROW EXECUTE FUNCTION public.update_conversation_last_message();

-- ============================================================================
-- 8. FUNÇÕES UTILITÁRIAS
-- ============================================================================

-- Função para buscar conversas do usuário
CREATE OR REPLACE FUNCTION public.get_user_conversations(user_id UUID)
RETURNS TABLE (
    conversation_id UUID,
    other_user_id UUID,
    other_user_name TEXT,
    other_user_type TEXT,
    last_message TEXT,
    last_message_at TIMESTAMP WITH TIME ZONE,
    unread_count BIGINT,
    status TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id as conversation_id,
        CASE 
            WHEN c.motorista_id = user_id THEN c.oficina_id
            ELSE c.motorista_id
        END as other_user_id,
        CASE 
            WHEN c.motorista_id = user_id THEN op.name
            ELSE mp.name
        END as other_user_name,
        CASE 
            WHEN c.motorista_id = user_id THEN 'oficina'
            ELSE 'motorista'
        END as other_user_type,
        lm.content as last_message,
        c.last_message_at,
        COALESCE(unread.count, 0) as unread_count,
        c.status
    FROM public.conversations c
    LEFT JOIN public.profiles mp ON mp.id = c.motorista_id
    LEFT JOIN public.profiles op ON op.id = c.oficina_id
    LEFT JOIN public.messages lm ON lm.conversation_id = c.id 
        AND lm.created_at = c.last_message_at
    LEFT JOIN (
        SELECT 
            conversation_id, 
            COUNT(*) as count 
        FROM public.messages m
        WHERE NOT EXISTS (
            SELECT 1 FROM public.message_reads mr 
            WHERE mr.message_id = m.id AND mr.reader_id = user_id
        )
        AND m.sender_id != user_id
        GROUP BY conversation_id
    ) unread ON unread.conversation_id = c.id
    WHERE c.motorista_id = user_id OR c.oficina_id = user_id
    ORDER BY c.last_message_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para marcar mensagens como lidas
CREATE OR REPLACE FUNCTION public.mark_messages_as_read(
    conversation_id UUID, 
    reader_id UUID
)
RETURNS INTEGER AS $$
DECLARE
    marked_count INTEGER;
BEGIN
    -- Marcar como lidas
    INSERT INTO public.message_reads (message_id, reader_id)
    SELECT m.id, reader_id
    FROM public.messages m
    WHERE m.conversation_id = mark_messages_as_read.conversation_id
        AND m.sender_id != reader_id
        AND NOT EXISTS (
            SELECT 1 FROM public.message_reads mr 
            WHERE mr.message_id = m.id AND mr.reader_id = mark_messages_as_read.reader_id
        );
    
    GET DIAGNOSTICS marked_count = ROW_COUNT;
    RETURN marked_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 9. DADOS INICIAIS E EXEMPLO
-- ============================================================================

-- Inserir presença inicial para usuários existentes
INSERT INTO public.user_presence (user_id, status, last_seen)
SELECT id, 'offline', NOW()
FROM public.profiles
WHERE NOT EXISTS (
    SELECT 1 FROM public.user_presence WHERE user_id = profiles.id
);

-- ============================================================================
-- 10. VERIFICAÇÃO E LOGS
-- ============================================================================
DO $$
BEGIN
    RAISE NOTICE '🎉 Sistema de Chat Tempo Real configurado com sucesso!';
    RAISE NOTICE '📊 Tabelas criadas: conversations, messages, message_reads, user_presence';
    RAISE NOTICE '🔒 RLS ativado em todas as tabelas';
    RAISE NOTICE '⚡ Índices otimizados para performance';
    RAISE NOTICE '🔧 Triggers e funções utilitárias instalados';
    RAISE NOTICE '📱 Pronto para integração com WebSocket!';
END $$;

-- Estatísticas finais
SELECT 
    'conversations' as tabela,
    COUNT(*) as registros
FROM public.conversations
UNION ALL
SELECT 
    'messages' as tabela,
    COUNT(*) as registros  
FROM public.messages
UNION ALL
SELECT 
    'user_presence' as tabela,
    COUNT(*) as registros
FROM public.user_presence;

-- ============================================================================
-- 🚀 SISTEMA DE CHAT TEMPO REAL PRONTO!
-- ============================================================================
-- Próximos passos:
-- 1. Executar este SQL no Supabase
-- 2. Integrar WebSocket no frontend
-- 3. Implementar componentes de chat
-- 4. Configurar notificações em tempo real
-- ============================================================================
