'use client'
import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }
    setToasts(prev => [...prev, newToast])

    // Auto remove after duration
    const duration = toast.duration || 5000
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  // Helper functions
  const success = (title: string, message?: string) => 
    addToast({ type: 'success', title, message })
  
  const error = (title: string, message?: string) => 
    addToast({ type: 'error', title, message })
  
  const warning = (title: string, message?: string) => 
    addToast({ type: 'warning', title, message })
  
  const info = (title: string, message?: string) => 
    addToast({ type: 'info', title, message })

  return (
    <ToastContext.Provider value={{
      toasts,
      addToast,
      removeToast,
      success,
      error,
      warning,
      info
    }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem 
            key={toast.id} 
            toast={toast} 
            onRemove={() => onRemove(toast.id)} 
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

interface ToastItemProps {
  toast: Toast
  onRemove: () => void
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [progress, setProgress] = useState(100)
  const duration = toast.duration || 5000

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - (100 / (duration / 100))
        return newProgress <= 0 ? 0 : newProgress
      })
    }, 100)

    return () => clearInterval(interval)
  }, [duration])

  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-white',
          border: 'border-green-200',
          icon: CheckCircleIcon,
          iconColor: 'text-green-600',
          progressColor: 'bg-green-500'
        }
      case 'error':
        return {
          bg: 'bg-white',
          border: 'border-red-200',
          icon: XCircleIcon,
          iconColor: 'text-red-600',
          progressColor: 'bg-red-500'
        }
      case 'warning':
        return {
          bg: 'bg-white',
          border: 'border-yellow-200',
          icon: ExclamationTriangleIcon,
          iconColor: 'text-yellow-600',
          progressColor: 'bg-yellow-500'
        }
      case 'info':
        return {
          bg: 'bg-white',
          border: 'border-blue-200',
          icon: InformationCircleIcon,
          iconColor: 'text-blue-600',
          progressColor: 'bg-blue-500'
        }
    }
  }

  const styles = getToastStyles()
  const Icon = styles.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.3 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.3 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`
        ${styles.bg} ${styles.border}
        border-2 rounded-xl shadow-lg p-4 min-w-80 max-w-md
        backdrop-blur-sm relative overflow-hidden
      `}
    >
      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
        <motion.div
          className={`h-full ${styles.progressColor}`}
          initial={{ width: '100%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: 'linear' }}
        />
      </div>

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 ${styles.iconColor}`}>
          <Icon className="w-6 h-6" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 mb-1">
            {toast.title}
          </h4>
          {toast.message && (
            <p className="text-sm text-gray-600 mb-2">
              {toast.message}
            </p>
          )}
          
          {/* Action Button */}
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className={`
                text-sm font-medium hover:underline
                ${toast.type === 'success' ? 'text-green-600' :
                  toast.type === 'error' ? 'text-red-600' :
                  toast.type === 'warning' ? 'text-yellow-600' :
                  'text-blue-600'}
              `}
            >
              {toast.action.label}
            </button>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onRemove}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  )
}

// Hook específico para operações comuns
export const useToastActions = () => {
  const toast = useToast()

  const handleSave = () => {
    toast.success('Salvo com sucesso!', 'Suas alterações foram aplicadas.')
  }

  const handleDelete = () => {
    toast.success('Excluído com sucesso!', 'Item removido permanentemente.')
  }

  const handleError = (error: any) => {
    toast.error('Ops! Algo deu errado', error?.message || 'Tente novamente em alguns instantes.')
  }

  const handleOffline = () => {
    toast.warning('Você está offline', 'Algumas funcionalidades podem estar limitadas.')
  }

  const handleUpdate = () => {
    toast.info('Atualização disponível', 'Recarregue a página para obter a versão mais recente.')
  }

  const handleLogin = () => {
    toast.success('Login realizado!', 'Bem-vindo de volta!')
  }

  const handleLogout = () => {
    toast.info('Logout realizado', 'Até logo!')
  }

  const handleNotification = (title: string, message?: string) => {
    toast.info(title, message)
  }

  return {
    handleSave,
    handleDelete,
    handleError,
    handleOffline,
    handleUpdate,
    handleLogin,
    handleLogout,
    handleNotification
  }
}
