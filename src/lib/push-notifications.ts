'use client'

export interface PushNotificationOptions {
  title: string
  body: string
  icon?: string
  badge?: string
  image?: string
  tag?: string
  data?: any
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
  requireInteraction?: boolean
  silent?: boolean
  vibrate?: number[]
  timestamp?: number
}

export interface PushSubscriptionData {
  endpoint: string
  keys: {
    auth: string
    p256dh: string
  }
  userAgent: string
  userId: string
  deviceType: 'mobile' | 'desktop' | 'tablet'
}

class PushNotificationManager {
  private registration: ServiceWorkerRegistration | null = null
  private isSupported = false
  private permission: NotificationPermission = 'default'

  constructor() {
    if (typeof window !== 'undefined') {
      this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
      this.permission = Notification.permission
    }
  }

  async initialize(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('🔔 Push notifications não suportadas neste navegador')
      return false
    }

    try {
      // Registrar service worker se necessário
      if (!this.registration) {
        this.registration = await navigator.serviceWorker.ready
      }

      console.log('✅ Push notifications inicializadas')
      return true
    } catch (error) {
      console.error('❌ Erro ao inicializar push notifications:', error)
      return false
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported) {
      console.warn('🔔 Push notifications não suportadas')
      return 'denied'
    }

    try {
      this.permission = await Notification.requestPermission()
      console.log('🔔 Permissão de notificação:', this.permission)
      return this.permission
    } catch (error) {
      console.error('❌ Erro ao solicitar permissão:', error)
      return 'denied'
    }
  }

  async subscribe(userId: string): Promise<PushSubscriptionData | null> {
    if (this.permission !== 'granted') {
      const permission = await this.requestPermission()
      if (permission !== 'granted') {
        throw new Error('Permissão de notificação negada')
      }
    }

    if (!this.registration) {
      await this.initialize()
    }

    if (!this.registration) {
      throw new Error('Service Worker não registrado')
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_KEY || ''
        )
      })

      const subscriptionData: PushSubscriptionData = {
        endpoint: subscription.endpoint,
        keys: {
          auth: this.arrayBufferToBase64(subscription.getKey('auth')!),
          p256dh: this.arrayBufferToBase64(subscription.getKey('p256dh')!)
        },
        userAgent: navigator.userAgent,
        userId,
        deviceType: this.getDeviceType()
      }

      // Salvar no servidor
      await this.saveSubscription(subscriptionData)
      
      console.log('✅ Inscrito nas push notifications:', subscriptionData)
      return subscriptionData

    } catch (error) {
      console.error('❌ Erro ao se inscrever:', error)
      throw error
    }
  }

  async unsubscribe(): Promise<boolean> {
    if (!this.registration) {
      return false
    }

    try {
      const subscription = await this.registration.pushManager.getSubscription()
      if (subscription) {
        const success = await subscription.unsubscribe()
        
        if (success) {
          // Remover do servidor
          await this.removeSubscription(subscription.endpoint)
          console.log('✅ Desinscrito das push notifications')
        }
        
        return success
      }
      return true
    } catch (error) {
      console.error('❌ Erro ao desinscrever:', error)
      return false
    }
  }

  async getSubscription(): Promise<PushSubscription | null> {
    if (!this.registration) {
      await this.initialize()
    }

    if (!this.registration) {
      return null
    }

    return await this.registration.pushManager.getSubscription()
  }

  async sendNotification(options: PushNotificationOptions): Promise<boolean> {
    if (this.permission !== 'granted') {
      console.warn('🔔 Permissão de notificação não concedida')
      return false
    }

    try {
      // Para notificações locais (quando o app está ativo)
      if ('Notification' in window) {
        const notification = new Notification(options.title, {
          body: options.body,
          icon: options.icon || '/images/logo-192.png',
          badge: options.badge || '/images/badge-72.png',
          image: options.image,
          tag: options.tag,
          data: options.data,
          requireInteraction: options.requireInteraction,
          silent: options.silent,
          vibrate: options.vibrate || [200, 100, 200],
          timestamp: options.timestamp || Date.now()
        })

        // Auto-close após 5 segundos se não requer interação
        if (!options.requireInteraction) {
          setTimeout(() => notification.close(), 5000)
        }

        return true
      }

      return false
    } catch (error) {
      console.error('❌ Erro ao enviar notificação local:', error)
      return false
    }
  }

  // Utilitários
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

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return window.btoa(binary)
  }

  private getDeviceType(): 'mobile' | 'desktop' | 'tablet' {
    const userAgent = navigator.userAgent.toLowerCase()
    
    if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
      return /ipad|tablet/i.test(userAgent) ? 'tablet' : 'mobile'
    }
    
    return 'desktop'
  }

  private async saveSubscription(subscription: PushSubscriptionData): Promise<void> {
    try {
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
      })

      if (!response.ok) {
        throw new Error('Falha ao salvar inscrição')
      }
    } catch (error) {
      console.error('❌ Erro ao salvar inscrição:', error)
      throw error
    }
  }

  private async removeSubscription(endpoint: string): Promise<void> {
    try {
      const response = await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ endpoint })
      })

      if (!response.ok) {
        throw new Error('Falha ao remover inscrição')
      }
    } catch (error) {
      console.error('❌ Erro ao remover inscrição:', error)
      throw error
    }
  }

  // Getters
  get isPermissionGranted(): boolean {
    return this.permission === 'granted'
  }

  get isNotificationSupported(): boolean {
    return this.isSupported
  }

  get permissionStatus(): NotificationPermission {
    return this.permission
  }
}

// Singleton instance
export const pushManager = new PushNotificationManager()

// React Hook para gerenciar push notifications
import { useEffect, useState } from 'react'

export const usePushNotifications = (userId?: string) => {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    initializePushNotifications()
  }, [])

  const initializePushNotifications = async () => {
    try {
      await pushManager.initialize()
      setPermission(pushManager.permissionStatus)
      
      const subscription = await pushManager.getSubscription()
      setIsSubscribed(!!subscription)
    } catch (err) {
      setError('Erro ao inicializar notificações')
      console.error(err)
    }
  }

  const subscribe = async () => {
    if (!userId) {
      setError('ID do usuário é obrigatório')
      return false
    }

    setLoading(true)
    setError(null)

    try {
      await pushManager.subscribe(userId)
      setIsSubscribed(true)
      setPermission('granted')
      return true
    } catch (err: any) {
      setError(err.message || 'Erro ao se inscrever')
      return false
    } finally {
      setLoading(false)
    }
  }

  const unsubscribe = async () => {
    setLoading(true)
    setError(null)

    try {
      const success = await pushManager.unsubscribe()
      if (success) {
        setIsSubscribed(false)
      }
      return success
    } catch (err: any) {
      setError(err.message || 'Erro ao desinscrever')
      return false
    } finally {
      setLoading(false)
    }
  }

  const sendLocalNotification = async (options: PushNotificationOptions) => {
    return await pushManager.sendNotification(options)
  }

  return {
    isSubscribed,
    permission,
    loading,
    error,
    subscribe,
    unsubscribe,
    sendLocalNotification,
    isSupported: pushManager.isNotificationSupported
  }
}

// Predefined notification templates
export const NotificationTemplates = {
  newMessage: (senderName: string): PushNotificationOptions => ({
    title: '💬 Nova Mensagem',
    body: `${senderName} enviou uma mensagem`,
    icon: '/images/icons/chat-96.png',
    tag: 'new-message',
    actions: [
      { action: 'view', title: 'Ver Mensagem', icon: '/images/icons/view-16.png' },
      { action: 'reply', title: 'Responder', icon: '/images/icons/reply-16.png' }
    ],
    data: { type: 'message', action: 'view_message' }
  }),

  appointmentReminder: (workshopName: string, time: string): PushNotificationOptions => ({
    title: '⏰ Lembrete de Agendamento',
    body: `Agendamento em ${workshopName} às ${time}`,
    icon: '/images/icons/calendar-96.png',
    tag: 'appointment-reminder',
    requireInteraction: true,
    actions: [
      { action: 'view', title: 'Ver Detalhes', icon: '/images/icons/view-16.png' },
      { action: 'cancel', title: 'Cancelar', icon: '/images/icons/cancel-16.png' }
    ],
    data: { type: 'appointment', action: 'view_appointment' }
  }),

  orderUpdate: (status: string): PushNotificationOptions => ({
    title: '🔧 Atualização da Ordem',
    body: `Status atualizado para: ${status}`,
    icon: '/images/icons/wrench-96.png',
    tag: 'order-update',
    data: { type: 'order', action: 'view_order' }
  }),

  promotionalOffer: (offer: string): PushNotificationOptions => ({
    title: '🎉 Oferta Especial!',
    body: offer,
    icon: '/images/icons/offer-96.png',
    tag: 'promotional',
    requireInteraction: true,
    data: { type: 'promotion', action: 'view_offer' }
  }),

  emergencyAlert: (message: string): PushNotificationOptions => ({
    title: '🚨 Alerta de Emergência',
    body: message,
    icon: '/images/icons/emergency-96.png',
    tag: 'emergency',
    requireInteraction: true,
    vibrate: [300, 200, 300, 200, 300],
    data: { type: 'emergency', action: 'view_emergency' }
  })
}