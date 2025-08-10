'use client'
import { useState, useEffect } from 'react'

export interface PushNotificationData {
  title: string
  body: string
  icon?: string
  badge?: string
  image?: string
  data?: any
  actions?: NotificationAction[]
  tag?: string
  urgent?: boolean
  url?: string
}

export interface NotificationAction {
  action: string
  title: string
  icon?: string
}

class PushNotificationManager {
  private vapidKey = process.env.NEXT_PUBLIC_VAPID_KEY || ''
  private isSupported = false
  private registration: ServiceWorkerRegistration | null = null

  constructor() {
    this.isSupported = typeof window !== 'undefined' && 
      'serviceWorker' in navigator && 
      'PushManager' in window && 
      'Notification' in window
  }

  async initialize(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('📱 Push notifications não suportadas neste browser')
      return false
    }

    try {
      // Registrar service worker
      this.registration = await navigator.serviceWorker.register('/sw.js')
      console.log('✅ Service Worker registrado para push notifications')

      // Aguardar service worker estar pronto
      await navigator.serviceWorker.ready
      
      return true
    } catch (error) {
      console.error('❌ Erro ao inicializar push notifications:', error)
      return false
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported) {
      return 'denied'
    }

    // Verificar permissão atual
    if (Notification.permission === 'granted') {
      return 'granted'
    }

    if (Notification.permission === 'denied') {
      return 'denied'
    }

    // Solicitar permissão
    try {
      const permission = await Notification.requestPermission()
      console.log('🔔 Permissão de notificação:', permission)
      
      if (permission === 'granted') {
        await this.subscribeUser()
      }
      
      return permission
    } catch (error) {
      console.error('❌ Erro ao solicitar permissão:', error)
      return 'denied'
    }
  }

  async subscribeUser(): Promise<PushSubscription | null> {
    if (!this.registration || !this.vapidKey) {
      console.error('❌ Service Worker ou VAPID key não disponível')
      return null
    }

    try {
      // Verificar se já existe subscription
      let subscription = await this.registration.pushManager.getSubscription()
      
      if (!subscription) {
        // Criar nova subscription
        subscription = await this.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(this.vapidKey)
        })
        
        console.log('✅ Nova subscription criada')
      }

      // Enviar subscription para o servidor
      await this.sendSubscriptionToServer(subscription)
      
      return subscription
    } catch (error) {
      console.error('❌ Erro ao criar subscription:', error)
      return null
    }
  }

  async unsubscribeUser(): Promise<boolean> {
    if (!this.registration) {
      return false
    }

    try {
      const subscription = await this.registration.pushManager.getSubscription()
      
      if (subscription) {
        await subscription.unsubscribe()
        await this.removeSubscriptionFromServer(subscription)
        console.log('✅ Subscription removida')
        return true
      }
      
      return false
    } catch (error) {
      console.error('❌ Erro ao remover subscription:', error)
      return false
    }
  }

  async sendLocalNotification(data: PushNotificationData): Promise<void> {
    if (!this.isSupported || Notification.permission !== 'granted') {
      return
    }

    try {
      if (this.registration) {
        // Usar service worker para notificação
        await this.registration.showNotification(data.title, {
          body: data.body,
          icon: data.icon || '/images/logo.svg',
          badge: data.badge || '/icons/icon-72x72.png',
          image: data.image,
          data: {
            url: data.url,
            ...data.data
          },
          actions: data.actions,
          tag: data.tag || 'instauto-local',
          renotify: true,
          requireInteraction: data.urgent || false,
          vibrate: data.urgent ? [200, 100, 200] : [100],
          timestamp: Date.now()
        })
      } else {
        // Fallback para notificação simples
        new Notification(data.title, {
          body: data.body,
          icon: data.icon || '/images/logo.svg',
          tag: data.tag || 'instauto-fallback'
        })
      }
      
      console.log('🔔 Notificação local enviada:', data.title)
    } catch (error) {
      console.error('❌ Erro ao enviar notificação local:', error)
    }
  }

  async getSubscriptionStatus(): Promise<{
    isSubscribed: boolean
    subscription: PushSubscription | null
  }> {
    if (!this.registration) {
      return { isSubscribed: false, subscription: null }
    }

    try {
      const subscription = await this.registration.pushManager.getSubscription()
      return {
        isSubscribed: !!subscription,
        subscription
      }
    } catch (error) {
      console.error('❌ Erro ao verificar subscription:', error)
      return { isSubscribed: false, subscription: null }
    }
  }

  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    try {
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          userAgent: navigator.userAgent,
          timestamp: Date.now()
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      console.log('✅ Subscription enviada para o servidor')
    } catch (error) {
      console.error('❌ Erro ao enviar subscription:', error)
    }
  }

  private async removeSubscriptionFromServer(subscription: PushSubscription): Promise<void> {
    try {
      const response = await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: subscription.toJSON()
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      console.log('✅ Subscription removida do servidor')
    } catch (error) {
      console.error('❌ Erro ao remover subscription:', error)
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  // Notificações pré-definidas para diferentes contextos
  static readonly TEMPLATES = {
    NEW_MESSAGE: (senderName: string): PushNotificationData => ({
      title: '💬 Nova Mensagem',
      body: `${senderName} enviou uma mensagem`,
      icon: '/icons/message-notification.png',
      tag: 'new-message',
      url: '/motorista/mensagens',
      actions: [
        { action: 'reply', title: 'Responder', icon: '/icons/reply-action.png' },
        { action: 'view', title: 'Ver', icon: '/icons/view-action.png' }
      ]
    }),

    APPOINTMENT_REMINDER: (time: string, workshop: string): PushNotificationData => ({
      title: '📅 Lembrete de Agendamento',
      body: `Seu agendamento com ${workshop} é em ${time}`,
      icon: '/icons/calendar-notification.png',
      tag: 'appointment-reminder',
      url: '/motorista/agendamentos',
      urgent: true,
      actions: [
        { action: 'directions', title: 'Como Chegar', icon: '/icons/directions-action.png' },
        { action: 'contact', title: 'Ligar', icon: '/icons/phone-action.png' }
      ]
    }),

    SERVICE_COMPLETE: (workshop: string, total: string): PushNotificationData => ({
      title: '✅ Serviço Concluído',
      body: `${workshop} finalizou seu serviço. Total: ${total}`,
      icon: '/icons/complete-notification.png',
      tag: 'service-complete',
      url: '/motorista/historico',
      actions: [
        { action: 'rate', title: 'Avaliar', icon: '/icons/star-action.png' },
        { action: 'receipt', title: 'Recibo', icon: '/icons/receipt-action.png' }
      ]
    }),

    NEW_QUOTE: (workshop: string): PushNotificationData => ({
      title: '💰 Novo Orçamento',
      body: `${workshop} enviou um orçamento para você`,
      icon: '/icons/quote-notification.png',
      tag: 'new-quote',
      url: '/motorista/agendamentos',
      actions: [
        { action: 'accept', title: 'Aceitar', icon: '/icons/check-action.png' },
        { action: 'view', title: 'Ver Detalhes', icon: '/icons/view-action.png' }
      ]
    }),

    MAINTENANCE_DUE: (vehicle: string, days: number): PushNotificationData => ({
      title: '🔧 Manutenção Preventiva',
      body: `${vehicle} - Revisão vence em ${days} dias`,
      icon: '/icons/maintenance-notification.png',
      tag: 'maintenance-due',
      url: '/motorista/garagem',
      actions: [
        { action: 'schedule', title: 'Agendar', icon: '/icons/calendar-action.png' },
        { action: 'remind-later', title: 'Lembrar Depois', icon: '/icons/clock-action.png' }
      ]
    }),

    EMERGENCY_RESPONSE: (eta: string): PushNotificationData => ({
      title: '🚨 SOS Ativado',
      body: `Mecânico a caminho! Chegada prevista: ${eta}`,
      icon: '/icons/emergency-notification.png',
      tag: 'emergency-response',
      url: '/motorista/emergencia',
      urgent: true,
      actions: [
        { action: 'track', title: 'Rastrear', icon: '/icons/location-action.png' },
        { action: 'call', title: 'Ligar', icon: '/icons/phone-action.png' }
      ]
    })
  }
}

// Instância singleton
export const pushNotifications = new PushNotificationManager()

// Hook React para usar push notifications
export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    const init = async () => {
      const supported = await pushNotifications.initialize()
      setIsSupported(supported)
      
      if (supported) {
        setPermission(Notification.permission)
        
        const status = await pushNotifications.getSubscriptionStatus()
        setIsSubscribed(status.isSubscribed)
      }
    }
    
    init()
  }, [])

  const requestPermission = async () => {
    const result = await pushNotifications.requestPermission()
    setPermission(result)
    
    if (result === 'granted') {
      const status = await pushNotifications.getSubscriptionStatus()
      setIsSubscribed(status.isSubscribed)
    }
    
    return result
  }

  const subscribe = async () => {
    const subscription = await pushNotifications.subscribeUser()
    setIsSubscribed(!!subscription)
    return subscription
  }

  const unsubscribe = async () => {
    const result = await pushNotifications.unsubscribeUser()
    setIsSubscribed(!result)
    return result
  }

  const sendLocalNotification = (data: PushNotificationData) => {
    return pushNotifications.sendLocalNotification(data)
  }

  return {
    isSupported,
    permission,
    isSubscribed,
    requestPermission,
    subscribe,
    unsubscribe,
    sendLocalNotification
  }
}

export default pushNotifications
