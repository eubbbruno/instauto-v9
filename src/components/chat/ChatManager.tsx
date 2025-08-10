'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  FaceSmileIcon,
  PaperClipIcon,
  XMarkIcon,
  UserIcon,
  ClockIcon,
  CheckIcon,
  CheckBadgeIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline'
import { ChatBubbleLeftRightIcon as ChatSolidIcon } from '@heroicons/react/24/solid'
import { useWebSocket, ChatMessage, ConversationData } from '@/lib/websocket'
import { supabase } from '@/lib/supabase'

interface ChatManagerProps {
  userType: 'motorista' | 'oficina-free' | 'oficina-pro'
  currentUserId: string
  className?: string
}

export default function ChatManager({ 
  userType, 
  currentUserId, 
  className = '' 
}: ChatManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [conversations, setConversations] = useState<ConversationData[]>([])
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState<{[key: string]: boolean}>({})
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())
  const [unreadTotal, setUnreadTotal] = useState(0)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messageInputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()
  
  const { isConnected, connect, websocket } = useWebSocket()

  // Conectar WebSocket ao inicializar
  useEffect(() => {
    if (currentUserId && !isConnected) {
      connect(currentUserId)
    }
  }, [currentUserId, isConnected, connect])

  // Carregar conversas
  useEffect(() => {
    if (isConnected && currentUserId) {
      loadConversations()
    }
  }, [isConnected, currentUserId])

  // Listeners do WebSocket
  useEffect(() => {
    if (!websocket || !isConnected) return

    const handleNewMessage = (message: ChatMessage) => {
      setMessages(prev => {
        // Evitar duplicatas
        if (prev.find(m => m.id === message.id)) return prev
        return [...prev, message].sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        )
      })

      // Se não é a conversa ativa, incrementar unread
      if (message.conversation_id !== activeConversation && 
          message.sender_id !== currentUserId) {
        setUnreadTotal(prev => prev + 1)
      }

      // Auto-scroll para nova mensagem
      scrollToBottom()
    }

    const handleTypingStart = (data: any) => {
      if (data.user_id !== currentUserId) {
        setIsTyping(prev => ({ ...prev, [data.user_id]: true }))
      }
    }

    const handleTypingStop = (data: any) => {
      setIsTyping(prev => {
        const newState = { ...prev }
        delete newState[data.user_id]
        return newState
      })
    }

    const handleUserStatus = (data: any) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev)
        if (data.status === 'online') {
          newSet.add(data.user_id)
        } else {
          newSet.delete(data.user_id)
        }
        return newSet
      })
    }

    websocket.on('message', handleNewMessage)
    websocket.on('typing_start', handleTypingStart)
    websocket.on('typing_stop', handleTypingStop)
    websocket.on('user_status', handleUserStatus)

    return () => {
      websocket.off('message', handleNewMessage)
      websocket.off('typing_start', handleTypingStart)
      websocket.off('typing_stop', handleTypingStop)
      websocket.off('user_status', handleUserStatus)
    }
  }, [websocket, isConnected, activeConversation, currentUserId])

  // Auto-scroll para o fim das mensagens
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadConversations = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_user_conversations', { user_id_param: currentUserId })

      if (error) throw error

      const formattedConversations: ConversationData[] = data.map((conv: any) => ({
        id: conv.conversation_id,
        participants: [], // Será preenchido conforme necessário
        type: conv.conversation_type,
        title: conv.title || conv.other_participant_name,
        last_message: conv.last_message ? {
          id: '',
          conversation_id: conv.conversation_id,
          sender_id: '',
          sender_name: '',
          message: conv.last_message,
          message_type: 'text',
          timestamp: conv.last_message_at,
          read_by: []
        } : undefined,
        unread_count: conv.unread_count || 0,
        created_at: '',
        updated_at: conv.last_message_at
      }))

      setConversations(formattedConversations)
      
      // Calcular total de não lidas
      const total = formattedConversations.reduce((sum, conv) => sum + conv.unread_count, 0)
      setUnreadTotal(total)

    } catch (error) {
      console.error('❌ Erro ao carregar conversas:', error)
    }
  }

  const loadMessages = async (conversationId: string) => {
    setIsLoadingMessages(true)
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          conversation_id,
          sender_id,
          sender_name,
          sender_avatar,
          message,
          message_type,
          reply_to,
          attachments,
          read_by,
          created_at
        `)
        .eq('conversation_id', conversationId)
        .is('deleted_at', null)
        .order('created_at', { ascending: true })
        .limit(50)

      if (error) throw error

      const formattedMessages: ChatMessage[] = data.map(msg => ({
        ...msg,
        timestamp: msg.created_at
      }))

      setMessages(formattedMessages)

      // Marcar mensagens como lidas
      await markAsRead(conversationId)

    } catch (error) {
      console.error('❌ Erro ao carregar mensagens:', error)
    } finally {
      setIsLoadingMessages(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConversation || !isConnected) return

    const message: Omit<ChatMessage, 'id' | 'timestamp' | 'read_by'> = {
      conversation_id: activeConversation,
      sender_id: currentUserId,
      sender_name: 'Você', // Será atualizado pelo servidor
      message: newMessage.trim(),
      message_type: 'text'
    }

    const success = websocket.sendMessage(message)
    
    if (success) {
      setNewMessage('')
      stopTyping()
    }
  }

  const markAsRead = async (conversationId: string) => {
    if (!isConnected) return

    websocket.markAsRead(conversationId, messages.map(m => m.id))
    
    // Atualizar contador local
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, unread_count: 0 }
        : conv
    ))
    
    setUnreadTotal(prev => {
      const conversation = conversations.find(c => c.id === conversationId)
      return prev - (conversation?.unread_count || 0)
    })
  }

  const startTyping = () => {
    if (!activeConversation || !isConnected) return

    websocket.startTyping(activeConversation)
    
    // Reset do timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping()
    }, 3000)
  }

  const stopTyping = () => {
    if (!activeConversation || !isConnected) return

    websocket.stopTyping(activeConversation)
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
  }

  const selectConversation = (conversationId: string) => {
    setActiveConversation(conversationId)
    loadMessages(conversationId)
    
    if (isConnected) {
      websocket.joinConversation(conversationId)
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)
    
    if (diffHours < 24) {
      return date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    } else {
      return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit' 
      })
    }
  }

  const getMessageStatus = (message: ChatMessage) => {
    if (message.sender_id !== currentUserId) return null
    
    if (message.read_by.length > 1) {
      return <CheckBadgeIcon className="w-4 h-4 text-blue-500" />
    } else {
      return <CheckIcon className="w-4 h-4 text-gray-400" />
    }
  }

  const getConnectionStatusColor = () => {
    if (isConnected) return 'bg-green-500'
    return 'bg-red-500'
  }

  const activeConversationData = conversations.find(c => c.id === activeConversation)
  const typingUsers = Object.keys(isTyping).filter(userId => 
    userId !== currentUserId && isTyping[userId]
  )

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Botão principal do chat */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChatBubbleLeftRightIcon className="w-6 h-6" />
        
        {/* Badge de não lidas */}
        {unreadTotal > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            {unreadTotal > 99 ? '99+' : unreadTotal}
          </span>
        )}
        
        {/* Indicador de conexão */}
        <div className={`absolute bottom-0 right-0 w-3 h-3 ${getConnectionStatusColor()} rounded-full border-2 border-white`}></div>
      </motion.button>

      {/* Janela do chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-16 right-0 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ChatSolidIcon className="w-5 h-5" />
                <span className="font-medium">
                  {activeConversationData?.title || 'Mensagens'}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo */}
            {!activeConversation ? (
              /* Lista de conversas */
              <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <ChatBubbleLeftRightIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Nenhuma conversa ainda</p>
                    </div>
                  </div>
                ) : (
                  conversations.map(conv => (
                    <motion.div
                      key={conv.id}
                      onClick={() => selectConversation(conv.id)}
                      className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                      whileHover={{ backgroundColor: '#f9fafb' }}
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 truncate">
                            {conv.title}
                          </h4>
                          {conv.last_message && (
                            <span className="text-xs text-gray-500">
                              {formatTime(conv.last_message.timestamp)}
                            </span>
                          )}
                        </div>
                        {conv.last_message && (
                          <p className="text-sm text-gray-600 truncate">
                            {conv.last_message.message}
                          </p>
                        )}
                      </div>
                      {conv.unread_count > 0 && (
                        <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conv.unread_count}
                        </span>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            ) : (
              /* Chat ativo */
              <>
                {/* Voltar para lista */}
                <div className="p-2 border-b border-gray-200">
                  <button
                    onClick={() => setActiveConversation(null)}
                    className="text-blue-600 text-sm hover:text-blue-700"
                  >
                    ← Voltar para conversas
                  </button>
                </div>

                {/* Mensagens */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {isLoadingMessages ? (
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    messages.map(message => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-3 py-2 ${
                            message.sender_id === currentUserId
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          {message.sender_id !== currentUserId && (
                            <p className="text-xs opacity-70 mb-1">
                              {message.sender_name}
                            </p>
                          )}
                          <p className="text-sm">{message.message}</p>
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <span className="text-xs opacity-70">
                              {formatTime(message.timestamp)}
                            </span>
                            {getMessageStatus(message)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  
                  {/* Indicador de digitação */}
                  {typingUsers.length > 0 && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-1">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-xs text-gray-500 ml-1">digitando...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input de mensagem */}
                <div className="border-t border-gray-200 p-3">
                  <div className="flex items-center gap-2">
                    <input
                      ref={messageInputRef}
                      type="text"
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value)
                        if (e.target.value.trim()) {
                          startTyping()
                        } else {
                          stopTyping()
                        }
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          sendMessage()
                        }
                      }}
                      placeholder="Digite sua mensagem..."
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={!isConnected}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || !isConnected}
                      className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <PaperAirplaneIcon className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {!isConnected && (
                    <p className="text-xs text-red-500 mt-1">
                      Conectando... Aguarde.
                    </p>
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
