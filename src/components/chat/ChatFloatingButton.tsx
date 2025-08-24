'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChatBubbleLeftRightIcon,
  BellIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useRealtimeChat } from '@/hooks/useRealtimeChat'
import RealtimeChat from './RealtimeChat'

interface ChatFloatingButtonProps {
  currentUserId: string
  currentUserType: 'motorista' | 'oficina'
  className?: string
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

export default function ChatFloatingButton({
  currentUserId,
  currentUserType,
  className = '',
  position = 'bottom-right'
}: ChatFloatingButtonProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [lastNotificationCount, setLastNotificationCount] = useState(0)

  const {
    totalUnreadCount,
    isConnected,
    hasUnreadMessages
  } = useRealtimeChat({
    currentUserId,
    currentUserType,
    onNewMessage: (message) => {
      // Mostrar notificação para novas mensagens se o chat estiver fechado
      if (!isChatOpen && message.sender_id !== currentUserId) {
        setShowNotification(true)
        setTimeout(() => setShowNotification(false), 3000)
      }
    }
  })

  // Efeito para animar quando há novas mensagens
  useEffect(() => {
    if (totalUnreadCount > lastNotificationCount && totalUnreadCount > 0) {
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 2000)
    }
    setLastNotificationCount(totalUnreadCount)
  }, [totalUnreadCount, lastNotificationCount])

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  }

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
    setShowNotification(false)
  }

  return (
    <>
      {/* Botão Flutuante */}
      <motion.div
        className={`fixed z-40 ${positionClasses[position]} ${className}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        {/* Notificação de nova mensagem */}
        <AnimatePresence>
          {showNotification && (
            <motion.div
              className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg border p-3 max-w-xs mb-2"
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center space-x-2">
                <BellIcon className="w-4 h-4 text-blue-600" />
                <p className="text-sm text-gray-800 font-medium">
                  {totalUnreadCount > 0 
                    ? `${totalUnreadCount} nova${totalUnreadCount > 1 ? 's' : ''} mensagem${totalUnreadCount > 1 ? 'ns' : ''}`
                    : 'Nova mensagem!'
                  }
                </p>
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className="absolute top-1 right-1 p-1 hover:bg-gray-100 rounded"
              >
                <XMarkIcon className="w-3 h-3 text-gray-400" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botão Principal */}
        <motion.button
          onClick={toggleChat}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
            isChatOpen 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            boxShadow: hasUnreadMessages 
              ? '0 0 20px rgba(59, 130, 246, 0.5)' 
              : '0 10px 25px rgba(0, 0, 0, 0.15)'
          }}
        >
          <AnimatePresence mode="wait">
            {isChatOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <XMarkIcon className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <ChatBubbleLeftRightIcon className="w-6 h-6" />
                
                {/* Badge de mensagens não lidas */}
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
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Indicador de Conexão */}
        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
          isConnected ? 'bg-green-500' : 'bg-red-500'
        }`} />

        {/* Pulse animation para mensagens não lidas */}
        {hasUnreadMessages && !isChatOpen && (
          <motion.div
            className="absolute inset-0 rounded-full bg-blue-400"
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 1.4, opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        )}
      </motion.div>

      {/* Chat Modal */}
      <AnimatePresence>
        {isChatOpen && (
          <RealtimeChat
            currentUserId={currentUserId}
            currentUserType={currentUserType}
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// Componente alternativo compacto para integrar em sidebars
export function ChatIconButton({
  currentUserId,
  currentUserType,
  onClick,
  className = ''
}: {
  currentUserId: string
  currentUserType: 'motorista' | 'oficina'
  onClick?: () => void
  className?: string
}) {
  const { totalUnreadCount, hasUnreadMessages } = useRealtimeChat({
    currentUserId,
    currentUserType
  })

  return (
    <motion.button
      onClick={onClick}
      className={`relative p-2 rounded-lg hover:bg-gray-100 transition-colors ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <ChatBubbleLeftRightIcon className="w-6 h-6 text-gray-600" />
      
      {/* Badge de notificação */}
      <AnimatePresence>
        {totalUnreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
          >
            {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Pulse para novas mensagens */}
      {hasUnreadMessages && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-blue-400"
          initial={{ scale: 1, opacity: 0.3 }}
          animate={{ scale: 1.2, opacity: 0 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      )}
    </motion.button>
  )
}