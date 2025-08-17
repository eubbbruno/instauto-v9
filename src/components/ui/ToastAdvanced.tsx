'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  duration?: number
}

interface ToastContextType {
  toast: {
    success: (message: string, title?: string) => void
    error: (message: string, title?: string) => void
    warning: (message: string, title?: string) => void
    info: (message: string, title?: string) => void
  }
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToastAdvanced() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToastAdvanced must be used within a ToastAdvancedProvider')
  }
  return context
}

export function ToastAdvancedProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const addToast = useCallback((message: string, type: Toast['type'], title?: string, duration = 5000) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { id, message, type, title, duration }
    
    setToasts(prev => [...prev, newToast])
    
    // Auto remove
    setTimeout(() => removeToast(id), duration)
  }, [removeToast])

  const toast = {
    success: (message: string, title?: string) => addToast(message, 'success', title),
    error: (message: string, title?: string) => addToast(message, 'error', title, 7000),
    warning: (message: string, title?: string) => addToast(message, 'warning', title, 6000),
    info: (message: string, title?: string) => addToast(message, 'info', title),
  }

  const getToastConfig = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-gradient-to-r from-green-500 to-emerald-600',
          icon: CheckCircleIcon,
          iconColor: 'text-white',
          borderColor: 'border-green-400'
        }
      case 'error':
        return {
          bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
          icon: XCircleIcon,
          iconColor: 'text-white',
          borderColor: 'border-red-400'
        }
      case 'warning':
        return {
          bgColor: 'bg-gradient-to-r from-yellow-500 to-orange-500',
          icon: ExclamationTriangleIcon,
          iconColor: 'text-white',
          borderColor: 'border-yellow-400'
        }
      case 'info':
        return {
          bgColor: 'bg-gradient-to-r from-blue-500 to-indigo-600',
          icon: InformationCircleIcon,
          iconColor: 'text-white',
          borderColor: 'border-blue-400'
        }
      default:
        return {
          bgColor: 'bg-gray-500',
          icon: InformationCircleIcon,
          iconColor: 'text-white',
          borderColor: 'border-gray-400'
        }
    }
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
        <AnimatePresence>
          {toasts.map((toastItem) => {
            const config = getToastConfig(toastItem.type)
            const Icon = config.icon
            
            return (
              <motion.div
                key={toastItem.id}
                initial={{ opacity: 0, x: 300, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 300, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`${config.bgColor} text-white px-6 py-4 rounded-2xl shadow-2xl border ${config.borderColor} backdrop-blur-sm relative overflow-hidden`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-white/10 opacity-20"></div>
                
                {/* Content */}
                <div className="relative flex items-start space-x-3">
                  <Icon className={`h-6 w-6 ${config.iconColor} flex-shrink-0 mt-0.5`} />
                  <div className="flex-1 min-w-0">
                    {toastItem.title && (
                      <p className="font-semibold text-white mb-1">
                        {toastItem.title}
                      </p>
                    )}
                    <p className="text-white/90 text-sm leading-relaxed">
                      {toastItem.message}
                    </p>
                  </div>
                  <button
                    onClick={() => removeToast(toastItem.id)}
                    className="text-white/80 hover:text-white transition-colors ml-2"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Progress Bar */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-full"
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: (toastItem.duration || 5000) / 1000, ease: "linear" }}
                />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
