'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { useRealtimeChat, ChatRoom } from '@/lib/realtime'
import { useAuth } from '@/hooks/useAuth'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import ChatInterface from './ChatInterface'

interface ChatListProps {
  className?: string
}

export default function ChatList({ className = '' }: ChatListProps) {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedChat, setSelectedChat] = useState<{
    roomId: string
    otherUserId: string
    otherUserName: string
    otherUserType: 'motorista' | 'oficina'
  } | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)

  const { user } = useAuth()
  const realtimeChat = useRealtimeChat()

  useEffect(() => {
    if (user) {
      loadChatRooms()
      loadUnreadCount()
    }
  }, [user])

  const loadChatRooms = async () => {
    if (!user) return

    try {
      setLoading(true)
      const rooms = await realtimeChat.getUserChatRooms(user.id, user.type as 'motorista' | 'oficina')
      setChatRooms(rooms)
    } catch (error) {
      console.error('Erro ao carregar salas de chat:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUnreadCount = async () => {
    if (!user) return

    try {
      const count = await realtimeChat.getUnreadCount(user.id)
      setUnreadCount(count)
    } catch (error) {
      console.error('Erro ao carregar contagem de não lidas:', error)
    }
  }

  const openChat = (room: ChatRoom) => {
    const isMotorista = user?.type === 'motorista'
    const otherUserId = isMotorista ? room.oficina_id : room.motorista_id
    const otherUserType = isMotorista ? 'oficina' : 'motorista'
    
    setSelectedChat({
      roomId: room.id,
      otherUserId,
      otherUserName: room.other_user?.name || 'Usuário',
      otherUserType
    })
  }

  const filteredRooms = chatRooms.filter(room =>
    room.other_user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatLastMessageTime = (timestamp?: string) => {
    if (!timestamp) return ''
    return formatDistanceToNow(new Date(timestamp), {
      addSuffix: true,
      locale: ptBR
    })
  }

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={`bg-white rounded-xl shadow-sm ${className}`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-600" />
              Mensagens
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h2>
          </div>

          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar conversas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredRooms.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">Nenhuma conversa ainda</p>
              <p className="text-sm">Suas conversas aparecerão aqui</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredRooms.map((room) => (
                <motion.button
                  key={room.id}
                  onClick={() => openChat(room)}
                  className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                        <UserCircleIcon className="w-8 h-8 text-white" />
                      </div>
                      {room.unread_count && room.unread_count > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {room.unread_count > 9 ? '9+' : room.unread_count}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {room.other_user?.name || 'Usuário'}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatLastMessageTime(room.last_message_at)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate">
                          {room.last_message || 'Nenhuma mensagem ainda'}
                        </p>
                        <span className="text-xs text-gray-400 capitalize">
                          {user?.type === 'motorista' ? '🔧' : '🚗'}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Interface Modal */}
      {selectedChat && (
        <ChatInterface
          roomId={selectedChat.roomId}
          otherUserId={selectedChat.otherUserId}
          otherUserName={selectedChat.otherUserName}
          otherUserType={selectedChat.otherUserType}
          isOpen={!!selectedChat}
          onClose={() => {
            setSelectedChat(null)
            loadChatRooms() // Recarregar para atualizar contadores
            loadUnreadCount()
          }}
        />
      )}
    </>
  )
}
