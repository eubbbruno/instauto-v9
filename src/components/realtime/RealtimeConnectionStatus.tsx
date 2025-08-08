'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  WifiIcon, 
  ExclamationTriangleIcon,
  ArrowPathIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline'

interface RealtimeConnectionStatusProps {
  isConnected: boolean
  error?: string | null
  onReconnect?: () => void
  showWhenConnected?: boolean
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

export default function RealtimeConnectionStatus({
  isConnected,
  error,
  onReconnect,
  showWhenConnected = false,
  position = 'top-right'
}: RealtimeConnectionStatusProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [autoHideTimer, setAutoHideTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Show when there's an error or when explicitly requested to show when connected
    const shouldShow = !!error || (isConnected && showWhenConnected) || (!isConnected && !error)
    setIsVisible(shouldShow)

    // Auto-hide after 3 seconds when connected
    if (isConnected && !error && showWhenConnected) {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 3000)
      setAutoHideTimer(timer)
    }

    return () => {
      if (autoHideTimer) {
        clearTimeout(autoHideTimer)
      }
    }
  }, [isConnected, error, showWhenConnected])

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4'
      case 'top-right':
        return 'top-4 right-4'
      case 'bottom-left':
        return 'bottom-4 left-4'
      case 'bottom-right':
        return 'bottom-4 right-4'
      default:
        return 'top-4 right-4'
    }
  }

  const getStatusConfig = () => {
    if (error) {
      return {
        icon: ExclamationTriangleIcon,
        color: 'bg-red-500',
        text: 'Erro na conexão tempo real',
        detail: error,
        showReconnect: true
      }
    }

    if (!isConnected) {
      return {
        icon: WifiIcon,
        color: 'bg-yellow-500',
        text: 'Conectando...',
        detail: 'Estabelecendo conexão em tempo real',
        showReconnect: false
      }
    }

    return {
      icon: CheckCircleIcon,
      color: 'bg-green-500',
      text: 'Conectado',
      detail: 'Tempo real ativo',
      showReconnect: false
    }
  }

  const config = getStatusConfig()
  const IconComponent = config.icon

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`fixed ${getPositionClasses()} z-50 max-w-sm`}
        >
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[280px]">
            <div className="flex items-start gap-3">
              {/* Status Icon */}
              <div className={`p-2 rounded-full ${config.color} text-white flex-shrink-0`}>
                <IconComponent className="h-4 w-4" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-900">{config.text}</h4>
                  {isConnected && !error && (
                    <button
                      onClick={() => setIsVisible(false)}
                      className="text-gray-400 hover:text-gray-600 text-sm"
                    >
                      ×
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-1">{config.detail}</p>

                {/* Reconnect Button */}
                {config.showReconnect && onReconnect && (
                  <button
                    onClick={onReconnect}
                    className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <ArrowPathIcon className="h-3 w-3" />
                    Tentar novamente
                  </button>
                )}
              </div>
            </div>

            {/* Connection Indicator */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-1">
                <motion.div
                  className={`h-1 rounded-full ${isConnected ? 'bg-green-500' : error ? 'bg-red-500' : 'bg-yellow-500'}`}
                  initial={{ width: '0%' }}
                  animate={{ 
                    width: isConnected ? '100%' : error ? '100%' : '60%'
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-xs text-gray-500">
                {isConnected ? 'Online' : error ? 'Offline' : 'Conectando'}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook para usar o status de conexão
export function useRealtimeStatus() {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // This would be connected to your actual realtime implementation
  // For now, we'll simulate the connection status

  useEffect(() => {
    // Simulate connection
    const timer = setTimeout(() => {
      setIsConnected(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const reconnect = () => {
    setError(null)
    setIsConnected(false)
    
    // Simulate reconnection
    setTimeout(() => {
      setIsConnected(true)
    }, 1000)
  }

  return {
    isConnected,
    error,
    reconnect
  }
}
