'use client'

import { useState, useEffect, useCallback } from 'react'
import pushNotificationManager, { PushNotificationPayload } from '@/lib/push-notifications'
import { supabase } from '@/lib/supabase'

export interface NotificationConfig {
  agendamentos: boolean
  promocoes: boolean
  mensagens: boolean
  lembretes: boolean
}

export function usePushNotifications(userId?: string) {
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isLoading, setIsLoading] = useState(false)
  const [config, setConfig] = useState<NotificationConfig>({
    agendamentos: true,
    promocoes: false,
    mensagens: true,
    lembretes: true
  })

  useEffect(() => {
    initializeNotifications()
    loadUserConfig()
  }, [userId])

  const initializeNotifications = useCallback(async () => {
    const supported = pushNotificationManager.isSupported()
    setIsSupported(supported)

    if (!supported) return

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
  }, [])

  const loadUserConfig = useCallback(async () => {
    if (!userId) return

    try {
      const { data } = await supabase
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (data) {
        setConfig({
          agendamentos: data.agendamentos ?? true,
          promocoes: data.promocoes ?? false,
          mensagens: data.mensagens ?? true,
          lembretes: data.lembretes ?? true
        })
      }
    } catch (error) {
      console.error('❌ Erro ao carregar configurações:', error)
    }
  }, [userId])

  const subscribe = useCallback(async () => {
    if (!userId || !isSupported) return false

    setIsLoading(true)
    try {
      const subscriptionData = await pushNotificationManager.subscribe(userId)
      if (subscriptionData) {
        setIsSubscribed(true)
        setPermission('granted')
        
        // Salvar configurações padrão
        await saveUserConfig(config)
        
        // Notificação de boas-vindas
        await showLocalNotification({
          title: '🎉 Notificações Ativadas!',
          body: 'Você receberá avisos importantes sobre seus agendamentos',
          tag: 'welcome'
        })

        return true
      }
      return false
    } catch (error) {
      console.error('❌ Erro ao subscrever:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [userId, isSupported, config])

  const unsubscribe = useCallback(async () => {
    if (!userId || !isSupported) return false

    setIsLoading(true)
    try {
      const success = await pushNotificationManager.unsubscribe(userId)
      if (success) {
        setIsSubscribed(false)
        return true
      }
      return false
    } catch (error) {
      console.error('❌ Erro ao cancelar subscrição:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [userId, isSupported])

  const showLocalNotification = useCallback(async (payload: PushNotificationPayload) => {
    if (!isSupported || permission !== 'granted') return false

    try {
      await pushNotificationManager.showLocalNotification(payload)
      return true
    } catch (error) {
      console.error('❌ Erro ao exibir notificação:', error)
      return false
    }
  }, [isSupported, permission])

  const updateConfig = useCallback(async (newConfig: Partial<NotificationConfig>) => {
    const updatedConfig = { ...config, ...newConfig }
    setConfig(updatedConfig)
    
    if (userId && isSubscribed) {
      await saveUserConfig(updatedConfig)
    }
  }, [config, userId, isSubscribed])

  const saveUserConfig = useCallback(async (configToSave: NotificationConfig) => {
    if (!userId) return

    try {
      const { error } = await supabase
        .from('user_notification_preferences')
        .upsert({
          user_id: userId,
          agendamentos: configToSave.agendamentos,
          promocoes: configToSave.promocoes,
          mensagens: configToSave.mensagens,
          lembretes: configToSave.lembretes,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
      console.log('✅ Configurações de notificação salvas')
    } catch (error) {
      console.error('❌ Erro ao salvar configurações:', error)
    }
  }, [userId])

  // Métodos de conveniência para tipos específicos de notificação
  const notifyAgendamento = useCallback(async (data: {
    title: string
    body: string
    agendamentoId: string
    oficinaName: string
    dateTime: string
  }) => {
    if (!config.agendamentos || !isSubscribed) return false

    return await showLocalNotification({
      title: `📅 ${data.title}`,
      body: data.body,
      tag: `agendamento-${data.agendamentoId}`,
      data: {
        type: 'agendamento',
        agendamento_id: data.agendamentoId,
        oficina_name: data.oficinaName
      },
      actions: [
        { action: 'view', title: 'Ver Detalhes' },
        { action: 'cancel', title: 'Cancelar' }
      ],
      requireInteraction: true
    })
  }, [config.agendamentos, isSubscribed, showLocalNotification])

  const notifyMensagem = useCallback(async (data: {
    senderName: string
    message: string
    conversationId: string
  }) => {
    if (!config.mensagens || !isSubscribed) return false

    return await showLocalNotification({
      title: `💬 Mensagem de ${data.senderName}`,
      body: data.message,
      tag: `message-${data.conversationId}`,
      data: {
        type: 'mensagem',
        conversation_id: data.conversationId,
        sender: data.senderName
      },
      actions: [
        { action: 'reply', title: 'Responder' },
        { action: 'view', title: 'Ver Conversa' }
      ]
    })
  }, [config.mensagens, isSubscribed, showLocalNotification])

  const notifyPromocao = useCallback(async (data: {
    title: string
    description: string
    discount: number
    validUntil: string
  }) => {
    if (!config.promocoes || !isSubscribed) return false

    return await showLocalNotification({
      title: `🎉 ${data.title}`,
      body: `${data.description} - ${data.discount}% de desconto`,
      tag: 'promocao',
      data: {
        type: 'promocao',
        discount: data.discount,
        valid_until: data.validUntil
      },
      actions: [
        { action: 'view', title: 'Ver Oferta' }
      ],
      requireInteraction: true
    })
  }, [config.promocoes, isSubscribed, showLocalNotification])

  return {
    // Estado
    isSupported,
    isSubscribed,
    permission,
    isLoading,
    config,

    // Ações principais
    subscribe,
    unsubscribe,
    updateConfig,
    showLocalNotification,

    // Notificações específicas
    notifyAgendamento,
    notifyMensagem,
    notifyPromocao
  }
}
