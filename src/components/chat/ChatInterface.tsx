'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PaperAirplaneIcon, 
  FaceSmileIcon, 
  PhotoIcon,
  XMarkIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'
import { useRealtimeChat, ChatMessage, ChatRoom } from '@/lib/realtime'
import { useAuthSimple } from '@/hooks/useAuthSimple'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ChatInterfaceProps {
  roomId?: string
  otherUserId?: string
  otherUserName?: string
  otherUserType?: 'motorista' | 'oficina'
  isOpen: boolean
  onClose: () => void
}

export default function ChatInterface({
  roomId,
  otherUserId,
  otherUserName,
  otherUserType,
  isOpen,
  onClose
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const { user } = useAuthSimple()
  const realtimeChat = useRealtimeChat()

  // Scroll para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Inicializar chat quando abrir
  useEffect(() => {
    if (isOpen && user && otherUserId) {
      initializeChat()
    }

    return () => {
      if (currentRoom) {
        realtimeChat.leaveChatRoom(currentRoom.id)
      }
    }
  }, [isOpen, user, otherUserId])

  // Auto-scroll quando novas mensagens chegam
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Focar no input quando abrir
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const initializeChat = async () => {
    if (!user || !otherUserId) return

    try {
      setLoading(true)

      // Determinar IDs baseado no tipo de usuário
      const motoristaId = user.type === 'motorista' ? user.id : otherUserId
      const oficinaId = user.type === 'oficina' ? user.id : otherUserId

      // Criar ou buscar sala de chat
      const room = await realtimeChat.getOrCreateChatRoom(motoristaId, oficinaId)
      setCurrentRoom(room)

      // Buscar mensagens existentes
      const existingMessages = await realtimeChat.getChatMessages(room.id)
      setMessages(existingMessages)

      // Entrar na sala em tempo real
      await realtimeChat.joinChatRoom(room.id, user.id, (message) => {
        setMessages(prev => [...prev, message])
      })

      // Marcar mensagens como lidas
      await realtimeChat.markMessagesAsRead(room.id, user.id)

    } catch (error) {
      console.error('Erro ao inicializar chat:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim() || !currentRoom || !user || !otherUserId) return

    try {
      await realtimeChat.sendMessage(
        currentRoom.id,
        user.id,
        otherUserId,
        newMessage.trim()
      )
      
      setNewMessage('')
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
    }
  }

  const formatMessageTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), {
      addSuffix: true,
      locale: ptBR
    })
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          exit={{ y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-[600px] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <UserCircleIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">{otherUserName || 'Usuário'}</h3>
                <p className="text-blue-100 text-sm capitalize">
                  {otherUserType === 'motorista' ? '🚗 Motorista' : '🔧 Oficina'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <FaceSmileIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma mensagem ainda</p>
                  <p className="text-sm">Envie a primeira mensagem!</p>
                </div>
              </div>
            ) : (
              messages.map((message) => {
                const isOwn = message.sender_id === user?.id
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        isOwn
                          ? 'bg-blue-600 text-white rounded-br-md'
                          : 'bg-gray-100 text-gray-900 rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isOwn ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {formatMessageTime(message.created_at)}
                      </p>
                    </div>
                  </motion.div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-4 border-t">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <PhotoIcon className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaceSmileIcon className="w-5 h-5" />
              </button>
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
