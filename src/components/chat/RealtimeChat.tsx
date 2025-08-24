'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { 
  PaperAirplaneIcon,
  PhotoIcon,
  DocumentIcon,
  MapPinIcon,
  PhoneIcon,
  VideoCameraIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
  CheckIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { useToast } from '@/components/ui/ToastManager'

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

interface RealtimeChatProps {
  currentUserId: string
  currentUserType: 'motorista' | 'oficina'
  isOpen: boolean
  onClose: () => void
  initialConversationId?: string
  className?: string
}

export default function RealtimeChat({
  currentUserId,
  currentUserType,
  isOpen,
  onClose,
  initialConversationId,
  className = ''
}: RealtimeChatProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [userTyping, setUserTyping] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { showToast } = useToast()

  // Estados para features avançadas
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showAttachments, setShowAttachments] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadConversations()
      setupRealtimeSubscriptions()
      updateUserPresence('online')
    } else {
      updateUserPresence('offline')
    }

    return () => {
      updateUserPresence('offline')
    }
  }, [isOpen, currentUserId])

  useEffect(() => {
    if (initialConversationId && conversations.length > 0) {
      const conv = conversations.find(c => c.id === initialConversationId)
      if (conv) {
        setActiveConversation(conv)
        loadMessages(conv.id)
      }
    }
  }, [initialConversationId, conversations])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadConversations = async () => {
    try {
      setLoading(true)
      
      // Chamar função do banco para buscar conversas
      const { data, error } = await supabase
        .rpc('get_user_conversations', { user_id: currentUserId })

      if (error) throw error

      setConversations(data || [])
    } catch (error) {
      console.error('Erro ao carregar conversas:', error)
      showToast('Erro ao carregar conversas', 'error')
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles:sender_id(name)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error

      const messagesWithSender = data?.map(msg => ({
        ...msg,
        sender_name: msg.profiles?.name || 'Usuário'
      })) || []

      setMessages(messagesWithSender)
      
      // Marcar como lidas
      await markMessagesAsRead(conversationId)
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error)
      showToast('Erro ao carregar mensagens', 'error')
    }
  }

  const markMessagesAsRead = async (conversationId: string) => {
    try {
      await supabase
        .rpc('mark_messages_as_read', {
          conversation_id: conversationId,
          reader_id: currentUserId
        })
    } catch (error) {
      console.error('Erro ao marcar como lidas:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConversation || sending) return

    try {
      setSending(true)
      
      const messageData = {
        conversation_id: activeConversation.id,
        sender_id: currentUserId,
        sender_type: currentUserType,
        content: newMessage.trim(),
        message_type: 'text'
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

      const newMsg = {
        ...data,
        sender_name: data.profiles?.name || 'Você'
      }

      setMessages(prev => [...prev, newMsg])
      setNewMessage('')
      
      showToast('Mensagem enviada!', 'success')
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      showToast('Erro ao enviar mensagem', 'error')
    } finally {
      setSending(false)
    }
  }

  const updateUserPresence = async (status: 'online' | 'offline' | 'away') => {
    try {
      await supabase
        .from('user_presence')
        .upsert({
          user_id: currentUserId,
          status,
          last_seen: new Date().toISOString(),
          current_conversation_id: activeConversation?.id || null
        })
    } catch (error) {
      console.error('Erro ao atualizar presença:', error)
    }
  }

  const setupRealtimeSubscriptions = () => {
    // Subscription para novas mensagens
    const messagesSubscription = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        const newMessage = payload.new as Message
        
        // Se é da conversa ativa, adicionar à lista
        if (newMessage.conversation_id === activeConversation?.id) {
          setMessages(prev => [...prev, newMessage])
          
          // Se não é mensagem própria, marcar como lida
          if (newMessage.sender_id !== currentUserId) {
            markMessagesAsRead(newMessage.conversation_id)
          }
        }
        
        // Atualizar lista de conversas
        loadConversations()
      })
      .subscribe()

    // Subscription para presença de usuários
    const presenceSubscription = supabase
      .channel('user_presence')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_presence'
      }, (payload) => {
        // Atualizar status de presença na UI se necessário
        console.log('Presença atualizada:', payload)
      })
      .subscribe()

    return () => {
      messagesSubscription.unsubscribe()
      presenceSubscription.unsubscribe()
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Hoje'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem'
    } else {
      return date.toLocaleDateString('pt-BR')
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      className={`fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] overflow-hidden flex"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
      >
        {/* Sidebar - Lista de Conversas */}
        <div className="w-1/3 border-r bg-gray-50 flex flex-col">
          {/* Header da sidebar */}
          <div className="p-4 border-b bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">💬 Conversas</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Lista de conversas */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Carregando...</p>
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-gray-500">Nenhuma conversa encontrada</p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  onClick={() => {
                    setActiveConversation(conversation)
                    loadMessages(conversation.id)
                  }}
                  className={`p-4 border-b cursor-pointer transition-colors ${
                    activeConversation?.id === conversation.id
                      ? 'bg-blue-50 border-blue-200'
                      : 'hover:bg-gray-100'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {conversation.other_user_name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {conversation.other_user_name}
                        </p>
                        {conversation.unread_count > 0 && (
                          <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {conversation.unread_count}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {conversation.last_message || 'Sem mensagens'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(conversation.last_message_at)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Área do Chat */}
        <div className="flex-1 flex flex-col">
          {activeConversation ? (
            <>
              {/* Header do chat */}
              <div className="p-4 border-b bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {activeConversation.other_user_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {activeConversation.other_user_name}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize">
                        {activeConversation.other_user_type}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <PhoneIcon className="w-5 h-5 text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <VideoCameraIcon className="w-5 h-5 text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <EllipsisVerticalIcon className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Mensagens */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        message.sender_id === currentUserId ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          message.sender_id === currentUserId
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className={`text-xs ${
                            message.sender_id === currentUserId ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {formatTime(message.created_at)}
                          </p>
                          {message.sender_id === currentUserId && (
                            <CheckCircleIcon className="w-4 h-4 text-blue-200" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Input de mensagem */}
              <div className="p-4 border-t bg-white">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowAttachments(!showAttachments)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <PhotoIcon className="w-5 h-5 text-gray-500" />
                  </button>
                  
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Digite sua mensagem..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      disabled={sending}
                    />
                  </div>
                  
                  <motion.button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sending}
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                  </motion.button>
                </div>
                
                {userTyping && (
                  <p className="text-xs text-gray-500 mt-2">
                    {userTyping} está digitando...
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Selecione uma conversa
                </h3>
                <p className="text-gray-500">
                  Escolha uma conversa para começar a enviar mensagens
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
