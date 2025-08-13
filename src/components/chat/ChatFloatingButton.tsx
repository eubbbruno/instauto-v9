'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  UserIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import RealTimeChatInterface, { useChatManager } from './RealTimeChatInterface'

interface ChatContact {
  id: string
  name: string
  avatar?: string
  status: 'online' | 'offline' | 'typing'
  lastMessage?: string
  unreadCount: number
  userType: 'motorista' | 'oficina'
}

interface ChatFloatingButtonProps {
  currentUserId: string
  userType: 'motorista' | 'oficina-free' | 'oficina-pro'
  className?: string
}

export default function ChatFloatingButton({
  currentUserId,
  userType,
  className = ''
}: ChatFloatingButtonProps) {
  const [isContactsOpen, setIsContactsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  
  const { activeChats, unreadCounts, openChat, closeChat } = useChatManager(currentUserId)

  // Mock contacts - em produção viria do Supabase
  const mockContacts: ChatContact[] = [
    {
      id: 'user1',
      name: userType === 'motorista' ? 'Auto Center Silva' : 'João Silva',
      status: 'online',
      lastMessage: 'Oi, tudo bem? Quando você pode trazer o carro?',
      unreadCount: 2,
      userType: userType === 'motorista' ? 'oficina' : 'motorista'
    },
    {
      id: 'user2', 
      name: userType === 'motorista' ? 'MegaMotors' : 'Maria Santos',
      status: 'offline',
      lastMessage: 'Obrigado pelo atendimento!',
      unreadCount: 0,
      userType: userType === 'motorista' ? 'oficina' : 'motorista'
    },
    {
      id: 'user3',
      name: userType === 'motorista' ? 'Pneus & Rodas' : 'Carlos Costa',
      status: 'typing',
      lastMessage: 'Está digitando...',
      unreadCount: 1,
      userType: userType === 'motorista' ? 'oficina' : 'motorista'
    }
  ]

  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalUnreadCount = mockContacts.reduce((total, contact) => total + contact.unreadCount, 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'typing': return 'bg-yellow-500 animate-pulse'
      default: return 'bg-gray-400'
    }
  }

  const getThemeColors = () => {
    switch (userType) {
      case 'motorista':
        return {
          primary: 'bg-blue-600 hover:bg-blue-700',
          secondary: 'bg-blue-50 text-blue-600'
        }
      case 'oficina-free':
        return {
          primary: 'bg-blue-600 hover:bg-blue-700',
          secondary: 'bg-blue-50 text-blue-600'
        }
      case 'oficina-pro':
        return {
          primary: 'bg-blue-600 hover:bg-blue-700',
          secondary: 'bg-blue-50 text-blue-600'
        }
      default:
        return {
          primary: 'bg-blue-600 hover:bg-blue-700',
          secondary: 'bg-blue-50 text-blue-600'
        }
    }
  }

  const theme = getThemeColors()

  return (
    <div className={`fixed bottom-6 right-6 z-40 ${className}`}>
      {/* Chat Interfaces */}
      <AnimatePresence>
        {Array.from(activeChats.entries()).map(([targetUserId, isOpen]) => {
          const contact = mockContacts.find(c => c.id === targetUserId)
          if (!contact || !isOpen) return null

          return (
            <RealTimeChatInterface
              key={targetUserId}
              currentUserId={currentUserId}
              targetUserId={targetUserId}
              targetUserName={contact.name}
              targetUserAvatar={contact.avatar}
              isOpen={isOpen}
              onClose={() => closeChat(targetUserId)}
              className="mb-4 mr-20"
            />
          )
        })}
      </AnimatePresence>

      {/* Contacts List */}
      <AnimatePresence>
        {isContactsOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-80 h-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            {/* Header */}
            <div className={`${theme.primary} p-4 text-white`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Conversas</h3>
                <button 
                  onClick={() => setIsContactsOpen(false)}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" />
                <input
                  type="text"
                  placeholder="Buscar conversas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-white/20 rounded-lg text-white placeholder-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
            </div>

            {/* Contacts List */}
            <div className="flex-1 overflow-y-auto">
              {filteredContacts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                  <UserIcon className="w-8 h-8 mb-2" />
                  <p className="text-sm">Nenhuma conversa encontrada</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredContacts.map((contact) => (
                    <motion.div
                      key={contact.id}
                      whileHover={{ backgroundColor: '#f9fafb' }}
                      onClick={() => {
                        openChat(contact.id)
                        setIsContactsOpen(false)
                      }}
                      className="p-4 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            {contact.avatar ? (
                              <img src={contact.avatar} alt={contact.name} className="w-full h-full rounded-full" />
                            ) : (
                              <span className="text-sm font-bold text-gray-600">
                                {contact.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(contact.status)}`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900 truncate">{contact.name}</h4>
                            {contact.unreadCount > 0 && (
                              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                {contact.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {contact.status === 'typing' ? (
                              <span className="text-blue-600 italic">digitando...</span>
                            ) : (
                              contact.lastMessage
                            )}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsContactsOpen(!isContactsOpen)}
        className={`
          w-16 h-16 ${theme.primary} text-white rounded-full shadow-lg
          flex items-center justify-center relative
          transition-all duration-200
        `}
      >
        <AnimatePresence mode="wait">
          {isContactsOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <XMarkIcon className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChatBubbleLeftRightIcon className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unread Badge */}
        <AnimatePresence>
          {totalUnreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold"
            >
              {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
