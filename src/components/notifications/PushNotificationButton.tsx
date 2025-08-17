'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BellIcon, BellSlashIcon } from '@heroicons/react/24/outline'
import pushNotificationManager from '@/lib/push-notifications'
import { supabase } from '@/lib/supabase'

interface PushNotificationButtonProps {
  userId?: string
  className?: string
  showText?: boolean
}

export default function PushNotificationButton({ 
  userId, 
  className = '', 
  showText = true 
}: PushNotificationButtonProps) {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [currentUserId, setCurrentUserId] = useState<string | null>(userId || null)

  useEffect(() => {
    initializeNotifications()
  }, [currentUserId])

  useEffect(() => {
    if (!currentUserId) {
      getCurrentUser()
    }
  }, [])

  const getCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setCurrentUserId(user.id)
      }
    } catch (error) {
      console.error('❌ Erro ao obter usuário:', error)
    }
  }

  const initializeNotifications = async () => {
    if (!pushNotificationManager.isSupported()) {
      console.warn('🚫 Push notifications não suportadas')
      return
    }

    try {
      const currentPermission = await pushNotificationManager.getPermission()
      setPermission(currentPermission)

      if (currentPermission === 'granted') {
        const subscribed = await pushNotificationManager.isSubscribed()
        setIsSubscribed(subscribed)
      }
    } catch (error) {
      console.error('❌ Erro ao inicializar notificações:', error)
    }
  }

  const handleToggleNotifications = async () => {
    if (!currentUserId) {
      alert('É necessário estar logado para gerenciar notificações')
      return
    }

    setIsLoading(true)

    try {
      if (isSubscribed) {
        // Cancelar notificações
        const success = await pushNotificationManager.unsubscribe(currentUserId)
        if (success) {
          setIsSubscribed(false)
          showSuccessMessage('Notificações desativadas com sucesso!')
        } else {
          throw new Error('Falha ao cancelar notificações')
        }
      } else {
        // Ativar notificações
        const subscriptionData = await pushNotificationManager.subscribe(currentUserId)
        if (subscriptionData) {
          setIsSubscribed(true)
          setPermission('granted')
          
          // Enviar notificação de boas-vindas
          await pushNotificationManager.showLocalNotification({
            title: '🎉 Notificações Ativadas!',
            body: 'Você receberá avisos sobre agendamentos e promoções',
            tag: 'welcome',
            requireInteraction: false
          })

          showSuccessMessage('Notificações ativadas com sucesso!')
        } else {
          throw new Error('Falha ao ativar notificações')
        }
      }
    } catch (error: any) {
      console.error('❌ Erro ao gerenciar notificações:', error)
      
      if (error.message.includes('Permission denied')) {
        alert('⚠️ Permissão negada. Habilite as notificações nas configurações do navegador.')
      } else {
        alert('⚠️ Erro ao gerenciar notificações. Tente novamente.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const showSuccessMessage = (message: string) => {
    // Você pode implementar um toast aqui se tiver
    console.log('✅', message)
  }

  const getButtonText = () => {
    if (isLoading) return 'Processando...'
    if (permission === 'denied') return 'Bloqueadas'
    if (isSubscribed) return 'Notificações ON'
    return 'Ativar Notificações'
  }

  const getButtonColor = () => {
    if (permission === 'denied') return 'bg-red-500 hover:bg-red-600'
    if (isSubscribed) return 'bg-green-500 hover:bg-green-600'
    return 'bg-blue-500 hover:bg-blue-600'
  }

  const getIcon = () => {
    if (permission === 'denied' || !isSubscribed) {
      return <BellSlashIcon className="w-5 h-5" />
    }
    return <BellIcon className="w-5 h-5" />
  }

  if (!pushNotificationManager.isSupported()) {
    return null
  }

  return (
    <motion.button
      onClick={handleToggleNotifications}
      disabled={isLoading || permission === 'denied'}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-medium
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${getButtonColor()}
        ${className}
      `}
    >
      {getIcon()}
      {showText && <span>{getButtonText()}</span>}
    </motion.button>
  )
}
