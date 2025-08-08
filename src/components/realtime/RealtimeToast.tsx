'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
  BellIcon
} from '@heroicons/react/24/outline'

interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info' | 'notification'
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface RealtimeToastProps {
  messages: ToastMessage[]
  onDismiss: (id: string) => void
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

export default function RealtimeToast({ 
  messages, 
  onDismiss, 
  position = 'top-right' 
}: RealtimeToastProps) {
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
        return 'top-right'
    }
  }

  const getToastConfig = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircleIcon,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-600',
          titleColor: 'text-green-800',
          messageColor: 'text-green-700'
        }
      case 'error':
        return {
          icon: ExclamationTriangleIcon,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-600',
          titleColor: 'text-red-800',
          messageColor: 'text-red-700'
        }
      case 'notification':
        return {
          icon: BellIcon,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-600',
          titleColor: 'text-blue-800',
          messageColor: 'text-blue-700'
        }
      default:
        return {
          icon: InformationCircleIcon,
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          iconColor: 'text-gray-600',
          titleColor: 'text-gray-800',
          messageColor: 'text-gray-700'
        }
    }
  }

  return (
    <div className={`fixed ${getPositionClasses()} z-50 space-y-2 max-w-sm w-full`}>
      <AnimatePresence>
        {messages.map((toast) => {
          const config = getToastConfig(toast.type)
          const IconComponent = config.icon

          return (
            <ToastItem
              key={toast.id}
              toast={toast}
              config={config}
              IconComponent={IconComponent}
              onDismiss={onDismiss}
            />
          )
        })}
      </AnimatePresence>
    </div>
  )
}

interface ToastItemProps {
  toast: ToastMessage
  config: any
  IconComponent: any
  onDismiss: (id: string) => void
}

function ToastItem({ toast, config, IconComponent, onDismiss }: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onDismiss(toast.id), 300)
      }, toast.duration)

      return () => clearTimeout(timer)
    }
  }, [toast.duration, toast.id, onDismiss])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => onDismiss(toast.id), 300)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        x: isVisible ? 0 : 300, 
        scale: isVisible ? 1 : 0.8 
      }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`
        ${config.bgColor} ${config.borderColor} 
        border rounded-lg shadow-lg p-4 relative overflow-hidden
      `}
    >
      {/* Background Animation */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="absolute inset-0 bg-white/20 transform origin-left"
      />

      <div className="relative flex gap-3">
        {/* Icon */}
        <div className="flex-shrink-0">
          <IconComponent className={`h-5 w-5 ${config.iconColor}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${config.titleColor}`}>
            {toast.title}
          </p>
          <p className={`text-sm ${config.messageColor} mt-1`}>
            {toast.message}
          </p>

          {/* Action Button */}
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className={`text-sm font-medium ${config.iconColor} hover:underline mt-2 block`}
            >
              {toast.action.label}
            </button>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className={`flex-shrink-0 ${config.iconColor} hover:opacity-70 transition-opacity`}
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Progress Bar (if duration is set) */}
      {toast.duration && (
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: toast.duration / 1000, ease: 'linear' }}
          className={`absolute bottom-0 left-0 h-1 ${config.iconColor.replace('text-', 'bg-')}`}
        />
      )}
    </motion.div>
  )
}

// Hook para gerenciar toasts
export function useRealtimeToasts() {
  const [messages, setMessages] = useState<ToastMessage[]>([])

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newToast: ToastMessage = {
      id,
      duration: 5000, // Default 5 seconds
      ...toast
    }
    
    setMessages(prev => [...prev, newToast])
    
    console.log('🍞 [TOAST] Adicionando:', newToast)
    
    return id
  }

  const dismissToast = (id: string) => {
    setMessages(prev => prev.filter(toast => toast.id !== id))
    console.log('🍞 [TOAST] Removendo:', id)
  }

  const clearAll = () => {
    setMessages([])
    console.log('🍞 [TOAST] Limpando todos')
  }

  // Convenience methods
  const showSuccess = (title: string, message: string, options?: Partial<ToastMessage>) => {
    return addToast({ type: 'success', title, message, ...options })
  }

  const showError = (title: string, message: string, options?: Partial<ToastMessage>) => {
    return addToast({ type: 'error', title, message, duration: 8000, ...options })
  }

  const showInfo = (title: string, message: string, options?: Partial<ToastMessage>) => {
    return addToast({ type: 'info', title, message, ...options })
  }

  const showNotification = (title: string, message: string, options?: Partial<ToastMessage>) => {
    return addToast({ type: 'notification', title, message, ...options })
  }

  return {
    messages,
    addToast,
    dismissToast,
    clearAll,
    showSuccess,
    showError,
    showInfo,
    showNotification
  }
}
