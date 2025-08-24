import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface Message {
  id: string
  conversation_id: string
  sender_id: string
  sender_type: 'motorista' | 'oficina'
  content: string
  message_type: 'text' | 'image' | 'document' | 'location' | 'quote' | 'appointment'
  attachments: any[]
  metadata: any
  is_read: boolean
  created_at: string
  sender_name?: string
}

interface Conversation {
  id: string
  motorista_id: string
  oficina_id: string
  subject?: string
  status: 'active' | 'closed' | 'archived'
  other_user_id: string
  other_user_name: string
  other_user_type: 'motorista' | 'oficina'
  last_message: string
  last_message_at: string
  unread_count: number
}

interface UseRealtimeChatProps {
  currentUserId: string
  currentUserType: 'motorista' | 'oficina'
  onNewMessage?: (message: Message) => void
  onConversationUpdate?: (conversations: Conversation[]) => void
}

export function useRealtimeChat({
  currentUserId,
  currentUserType,
  onNewMessage,
  onConversationUpdate
}: UseRealtimeChatProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [totalUnreadCount, setTotalUnreadCount] = useState(0)
  const [isConnected, setIsConnected] = useState(false)
  const [userPresence, setUserPresence] = useState<'online' | 'offline' | 'away'>('offline')
  
  const subscriptionsRef = useRef<any[]>([])

  // Carregar conversas
  const loadConversations = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_user_conversations', { user_id: currentUserId })

      if (error) throw error

      const conversationsList = data || []
      setConversations(conversationsList)
      
      // Calcular total de mensagens não lidas
      const totalUnread = conversationsList.reduce(
        (sum: number, conv: Conversation) => sum + conv.unread_count, 
        0
      )
      setTotalUnreadCount(totalUnread)
      
      // Callback opcional
      onConversationUpdate?.(conversationsList)
    } catch (error) {
      console.error('Erro ao carregar conversas:', error)
    }
  }, [currentUserId, onConversationUpdate])

  // Criar nova conversa
  const createConversation = useCallback(async (
    otherUserId: string,
    subject?: string,
    agendamentoId?: string
  ) => {
    try {
      const conversationData = {
        motorista_id: currentUserType === 'motorista' ? currentUserId : otherUserId,
        oficina_id: currentUserType === 'oficina' ? currentUserId : otherUserId,
        subject,
        agendamento_id: agendamentoId,
        status: 'active'
      }

      const { data, error } = await supabase
        .from('conversations')
        .insert(conversationData)
        .select()
        .single()

      if (error) throw error

      // Recarregar conversas
      await loadConversations()
      
      return data
    } catch (error) {
      console.error('Erro ao criar conversa:', error)
      throw error
    }
  }, [currentUserId, currentUserType, loadConversations])

  // Enviar mensagem
  const sendMessage = useCallback(async (
    conversationId: string,
    content: string,
    messageType: string = 'text',
    attachments: any[] = [],
    metadata: any = {}
  ) => {
    try {
      const messageData = {
        conversation_id: conversationId,
        sender_id: currentUserId,
        sender_type: currentUserType,
        content: content.trim(),
        message_type: messageType,
        attachments,
        metadata
      }

      const { data, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select(`
          *,
          profiles:sender_id(name)
        `)
        .single()

      if (error) throw error

      return {
        ...data,
        sender_name: data.profiles?.name || 'Você'
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      throw error
    }
  }, [currentUserId, currentUserType])

  // Marcar mensagens como lidas
  const markAsRead = useCallback(async (conversationId: string) => {
    try {
      await supabase
        .rpc('mark_messages_as_read', {
          conversation_id: conversationId,
          reader_id: currentUserId
        })
      
      // Recarregar conversas para atualizar contadores
      await loadConversations()
    } catch (error) {
      console.error('Erro ao marcar como lidas:', error)
    }
  }, [currentUserId, loadConversations])

  // Atualizar presença do usuário
  const updatePresence = useCallback(async (
    status: 'online' | 'offline' | 'away',
    currentConversationId?: string
  ) => {
    try {
      setUserPresence(status)
      
      await supabase
        .from('user_presence')
        .upsert({
          user_id: currentUserId,
          status,
          last_seen: new Date().toISOString(),
          current_conversation_id: currentConversationId || null,
          device_info: {
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString()
          }
        })
    } catch (error) {
      console.error('Erro ao atualizar presença:', error)
    }
  }, [currentUserId])

  // Configurar subscriptions em tempo real
  const setupRealtimeSubscriptions = useCallback(() => {
    // Limpar subscriptions anteriores
    subscriptionsRef.current.forEach(sub => sub.unsubscribe())
    subscriptionsRef.current = []

    // Subscription para mensagens
    const messagesChannel = supabase
      .channel('realtime-messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, async (payload) => {
        const newMessage = payload.new as Message
        
        // Buscar nome do remetente
        const { data: senderProfile } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', newMessage.sender_id)
          .single()

        const messageWithSender = {
          ...newMessage,
          sender_name: senderProfile?.name || 'Usuário'
        }
        
        // Callback para nova mensagem
        onNewMessage?.(messageWithSender)
        
        // Recarregar conversas
        await loadConversations()
      })
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
      })

    // Subscription para atualizações de conversa
    const conversationsChannel = supabase
      .channel('realtime-conversations')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'conversations'
      }, () => {
        // Recarregar conversas quando houver mudanças
        loadConversations()
      })
      .subscribe()

    // Subscription para presença de usuários
    const presenceChannel = supabase
      .channel('realtime-presence')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_presence'
      }, (payload) => {
        // Atualizar presença na UI se necessário
        console.log('Presença atualizada:', payload)
      })
      .subscribe()

    subscriptionsRef.current = [
      messagesChannel,
      conversationsChannel,
      presenceChannel
    ]
  }, [loadConversations, onNewMessage])

  // Buscar conversa existente entre dois usuários
  const findExistingConversation = useCallback(async (otherUserId: string) => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`and(motorista_id.eq.${currentUserId},oficina_id.eq.${otherUserId}),and(motorista_id.eq.${otherUserId},oficina_id.eq.${currentUserId})`)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      return data
    } catch (error) {
      console.error('Erro ao buscar conversa:', error)
      return null
    }
  }, [currentUserId])

  // Inicializar chat
  useEffect(() => {
    if (currentUserId) {
      loadConversations()
      setupRealtimeSubscriptions()
      updatePresence('online')

      // Cleanup function
      return () => {
        subscriptionsRef.current.forEach(sub => sub.unsubscribe())
        updatePresence('offline')
      }
    }
  }, [currentUserId, setupRealtimeSubscriptions, loadConversations, updatePresence])

  // Auto-away quando a aba não está ativa
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        updatePresence('away')
      } else {
        updatePresence('online')
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [updatePresence])

  return {
    // Estados
    conversations,
    totalUnreadCount,
    isConnected,
    userPresence,
    
    // Funções
    loadConversations,
    createConversation,
    sendMessage,
    markAsRead,
    updatePresence,
    findExistingConversation,
    
    // Utilitários
    hasUnreadMessages: totalUnreadCount > 0
  }
}
