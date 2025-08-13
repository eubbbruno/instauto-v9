'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PaperAirplaneIcon,
  FaceSmileIcon,
  PaperClipIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  VideoCameraIcon,
  InformationCircleIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline'
import { useWebSocket, ChatMessage, UserStatus } from '@/lib/websocket-client'

interface RealTimeChatInterfaceProps {
  currentUserId: string
  targetUserId: string
  targetUserName: string
  targetUserAvatar?: string
  isOpen: boolean
  onClose: () => void
  className?: string
}

export default function RealTimeChatInterface({
  currentUserId,
  targetUserId,
  targetUserName,
  targetUserAvatar,
  isOpen,
  onClose,
  className = ''
}: RealTimeChatInterfaceProps) {
  const [messageText, setMessageText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversationMessages, setConversationMessages] = useState<ChatMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()
  
  const {
    isConnected,
    messages,
    userStatuses,
    sendMessage,
    sendTyping,
    markAsRead
  } = useWebSocket(currentUserId)

  // Filtrar mensagens da conversa atual
  useEffect(() => {
    const filtered = messages.filter(msg => 
      (msg.senderId === currentUserId && msg.receiverId === targetUserId) ||
      (msg.senderId === targetUserId && msg.receiverId === currentUserId)
    )
    setConversationMessages(filtered)
  }, [messages, currentUserId, targetUserId])

  // Auto scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversationMessages])

  // Verificar se usuário está digitando
  const targetUserStatus = userStatuses.get(targetUserId)
  const isTargetTyping = targetUserStatus?.status === 'typing'

  const handleSendMessage = () => {
    if (!messageText.trim() || !isConnected) return

    const success = sendMessage(messageText.trim(), targetUserId)
    if (success) {
      setMessageText('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleTyping = (text: string) => {
    setMessageText(text)
    
    // Enviar indicador de digitação
    if (text.length > 0 && isConnected) {
      sendTyping(targetUserId)
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      
      // Set new timeout to stop typing
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false)
      }, 3000)
    }
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  const getStatusColor = (status?: UserStatus['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'typing': return 'bg-yellow-500 animate-pulse'
      default: return 'bg-gray-400'
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className={`
        fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-xl shadow-2xl 
        border border-gray-200 flex flex-col z-50 overflow-hidden
        ${className}
      `}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                {targetUserAvatar ? (
                  <img src={targetUserAvatar} alt={targetUserName} className="w-full h-full rounded-full" />
                ) : (
                  <span className="text-sm font-bold">
                    {targetUserName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(targetUserStatus?.status)}`} />
            </div>
            
            <div>
              <h3 className="font-semibold text-sm">{targetUserName}</h3>
              <p className="text-xs text-blue-100">
                {isTargetTyping ? 'digitando...' :
                 targetUserStatus?.status === 'online' ? 'online' :
                 'offline'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <PhoneIcon className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <VideoCameraIcon className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <EllipsisVerticalIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Connection Status */}
        <div className="mt-2 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
          <span className="text-xs text-blue-100">
            {isConnected ? 'Conectado' : 'Reconectando...'}
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        <AnimatePresence>
          {conversationMessages.map((message, index) => {
            const isOwnMessage = message.senderId === currentUserId
            
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`
                  max-w-[80%] rounded-2xl p-3 relative
                  ${isOwnMessage 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white border border-gray-200 text-gray-900'
                  }
                `}>
                  <p className="text-sm">{message.content}</p>
                  
                  <div className={`
                    flex items-center gap-1 mt-1 text-xs
                    ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}
                  `}>
                    <span>{formatTime(message.timestamp)}</span>
                    {isOwnMessage && (
                      <div className="flex">
                        {message.status === 'sent' && <span>✓</span>}
                        {message.status === 'delivered' && <span>✓✓</span>}
                        {message.status === 'read' && <span className="text-blue-200">✓✓</span>}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTargetTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex justify-start"
            >
              <div className="bg-white border border-gray-200 rounded-2xl p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <PaperClipIcon className="w-5 h-5 text-gray-500" />
          </button>
          
          <div className="flex-1 relative">
            <textarea
              value={messageText}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              rows={1}
              className="
                w-full p-3 pr-12 border border-gray-300 rounded-xl resize-none
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                text-sm
              "
              disabled={!isConnected}
            />
            
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors">
              <FaceSmileIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={!messageText.trim() || !isConnected}
            className="
              p-3 bg-blue-600 text-white rounded-xl
              hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
            "
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

// Hook para gerenciar conversas ativas
export const useChatManager = (currentUserId: string) => {
  const [activeChats, setActiveChats] = useState<Map<string, boolean>>(new Map())
  const [unreadCounts, setUnreadCounts] = useState<Map<string, number>>(new Map())

  const openChat = (targetUserId: string) => {
    setActiveChats(prev => new Map(prev.set(targetUserId, true)))
  }

  const closeChat = (targetUserId: string) => {
    setActiveChats(prev => {
      const newMap = new Map(prev)
      newMap.delete(targetUserId)
      return newMap
    })
  }

  const markAsRead = (targetUserId: string) => {
    setUnreadCounts(prev => {
      const newMap = new Map(prev)
      newMap.delete(targetUserId)
      return newMap
    })
  }

  return {
    activeChats,
    unreadCounts,
    openChat,
    closeChat,
    markAsRead
  }
}
