'use client'

export interface NotificationData {
  title: string
  body: string
  icon?: string
  badge?: string
  image?: string
  data?: any
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
  tag?: string
  renotify?: boolean
  requireInteraction?: boolean
  silent?: boolean
  vibrate?: number[]
  timestamp?: number
  dir?: 'auto' | 'ltr' | 'rtl'
  lang?: string
}

export interface PushSubscriptionData {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

class NotificationManager {
  private vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'your-vapid-public-key'
  private registration: ServiceWorkerRegistration | null = null
  private permission: NotificationPermission = 'default'

  constructor() {
    this.checkSupport()
    this.updatePermission()
  }

  private checkSupport(): boolean {
    if (typeof window === 'undefined') return false
    
    return (
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    )
  }

  private updatePermission() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.permission = Notification.permission
    }
  }

  async initialize(): Promise<boolean> {
    if (!this.checkSupport()) {
      console.warn('⚠️ Push notifications not supported')
      return false
    }

    try {
      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js')
      console.log('✅ Service Worker registered for notifications')
      
      // Wait for service worker to be ready
      await navigator.serviceWorker.ready
      
      return true
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error)
      return false
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!this.checkSupport()) {
      return 'denied'
    }

    if (this.permission === 'granted') {
      return 'granted'
    }

    try {
      this.permission = await Notification.requestPermission()
      console.log('🔔 Notification permission:', this.permission)
      
      return this.permission
    } catch (error) {
      console.error('❌ Error requesting notification permission:', error)
      return 'denied'
    }
  }

  async subscribeToPush(): Promise<PushSubscriptionData | null> {
    if (!this.registration || this.permission !== 'granted') {
      console.warn('⚠️ Cannot subscribe to push: registration or permission missing')
      return null
    }

    try {
      // Check if already subscribed
      let subscription = await this.registration.pushManager.getSubscription()
      
      if (!subscription) {
        // Create new subscription
        subscription = await this.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
        })
      }

      const subscriptionData: PushSubscriptionData = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: this.arrayBufferToBase64(subscription.getKey('p256dh')!),
          auth: this.arrayBufferToBase64(subscription.getKey('auth')!)
        }
      }

      console.log('✅ Push subscription created')
      
      // Send subscription to server
      await this.sendSubscriptionToServer(subscriptionData)
      
      return subscriptionData
    } catch (error) {
      console.error('❌ Error subscribing to push:', error)
      return null
    }
  }

  async unsubscribeFromPush(): Promise<boolean> {
    if (!this.registration) {
      return false
    }

    try {
      const subscription = await this.registration.pushManager.getSubscription()
      
      if (subscription) {
        await subscription.unsubscribe()
        
        // Remove subscription from server
        await this.removeSubscriptionFromServer(subscription.endpoint)
        
        console.log('✅ Push subscription removed')
        return true
      }
      
      return false
    } catch (error) {
      console.error('❌ Error unsubscribing from push:', error)
      return false
    }
  }

  async showNotification(data: NotificationData): Promise<void> {
    if (!this.registration || this.permission !== 'granted') {
      console.warn('⚠️ Cannot show notification: registration or permission missing')
      return
    }

    try {
      const options: NotificationOptions = {
        body: data.body,
        icon: data.icon || '/images/logo.svg',
        badge: data.badge || '/icons/icon-72x72.png',
        image: data.image,
        data: data.data,
        actions: data.actions,
        tag: data.tag,
        renotify: data.renotify,
        requireInteraction: data.requireInteraction,
        silent: data.silent,
        vibrate: data.vibrate || [200, 100, 200],
        timestamp: data.timestamp || Date.now(),
        dir: data.dir,
        lang: data.lang
      }

      await this.registration.showNotification(data.title, options)
      console.log('🔔 Notification shown:', data.title)
    } catch (error) {
      console.error('❌ Error showing notification:', error)
    }
  }

  // Pre-defined notification types
  async showMessageNotification(senderName: string, message: string, conversationId: string) {
    await this.showNotification({
      title: `💬 Nova mensagem de ${senderName}`,
      body: message,
      icon: '/icons/message-icon.png',
      tag: `message-${conversationId}`,
      requireInteraction: true,
      data: {
        type: 'message',
        conversationId,
        url: `/motorista/mensagens?conversa=${conversationId}`
      },
      actions: [
        {
          action: 'reply',
          title: 'Responder',
          icon: '/icons/reply-icon.png'
        },
        {
          action: 'view',
          title: 'Ver conversa',
          icon: '/icons/view-icon.png'
        }
      ]
    })
  }

  async showAppointmentNotification(officeName: string, date: string, service: string) {
    await this.showNotification({
      title: `📅 Agendamento confirmado`,
      body: `${service} na ${officeName} em ${date}`,
      icon: '/icons/appointment-icon.png',
      tag: 'appointment',
      requireInteraction: true,
      data: {
        type: 'appointment',
        url: '/motorista/agendamentos'
      },
      actions: [
        {
          action: 'view',
          title: 'Ver detalhes',
          icon: '/icons/view-icon.png'
        },
        {
          action: 'directions',
          title: 'Ver rota',
          icon: '/icons/directions-icon.png'
        }
      ]
    })
  }

  async showEmergencyNotification(message: string) {
    await this.showNotification({
      title: '🚨 Solicitação de Emergência',
      body: message,
      icon: '/icons/emergency-icon.png',
      tag: 'emergency',
      requireInteraction: true,
      vibrate: [200, 100, 200, 100, 200],
      data: {
        type: 'emergency',
        urgent: true,
        url: '/motorista/emergencia'
      },
      actions: [
        {
          action: 'respond',
          title: 'Responder',
          icon: '/icons/respond-icon.png'
        },
        {
          action: 'call',
          title: 'Ligar',
          icon: '/icons/call-icon.png'
        }
      ]
    })
  }

  async showPromotionNotification(title: string, description: string, discount?: string) {
    await this.showNotification({
      title: `🎉 ${title}`,
      body: discount ? `${description} - ${discount} de desconto!` : description,
      icon: '/icons/promotion-icon.png',
      image: '/images/promotion-banner.png',
      tag: 'promotion',
      data: {
        type: 'promotion',
        url: '/motorista/promocoes'
      },
      actions: [
        {
          action: 'view',
          title: 'Ver oferta',
          icon: '/icons/view-icon.png'
        }
      ]
    })
  }

  async showSystemNotification(title: string, message: string) {
    await this.showNotification({
      title: `⚙️ ${title}`,
      body: message,
      icon: '/icons/system-icon.png',
      tag: 'system',
      data: {
        type: 'system',
        url: '/motorista'
      }
    })
  }

  // Utility methods
  private async sendSubscriptionToServer(subscription: PushSubscriptionData): Promise<void> {
    try {
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription)
      })

      if (!response.ok) {
        throw new Error('Failed to send subscription to server')
      }

      console.log('✅ Subscription sent to server')
    } catch (error) {
      console.error('❌ Error sending subscription to server:', error)
    }
  }

  private async removeSubscriptionFromServer(endpoint: string): Promise<void> {
    try {
      const response = await fetch('/api/notifications/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ endpoint })
      })

      if (!response.ok) {
        throw new Error('Failed to remove subscription from server')
      }

      console.log('✅ Subscription removed from server')
    } catch (error) {
      console.error('❌ Error removing subscription from server:', error)
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

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    
    return window.btoa(binary)
  }

  // Getters
  get isSupported(): boolean {
    return this.checkSupport()
  }

  get hasPermission(): boolean {
    return this.permission === 'granted'
  }

  get permissionStatus(): NotificationPermission {
    return this.permission
  }
}

// Singleton instance
export const notificationManager = new NotificationManager()

// Utility hook
export function useNotifications() {
  return {
    isSupported: notificationManager.isSupported,
    hasPermission: notificationManager.hasPermission,
    permissionStatus: notificationManager.permissionStatus,
    initialize: notificationManager.initialize.bind(notificationManager),
    requestPermission: notificationManager.requestPermission.bind(notificationManager),
    subscribeToPush: notificationManager.subscribeToPush.bind(notificationManager),
    unsubscribeFromPush: notificationManager.unsubscribeFromPush.bind(notificationManager),
    showNotification: notificationManager.showNotification.bind(notificationManager),
    showMessageNotification: notificationManager.showMessageNotification.bind(notificationManager),
    showAppointmentNotification: notificationManager.showAppointmentNotification.bind(notificationManager),
    showEmergencyNotification: notificationManager.showEmergencyNotification.bind(notificationManager),
    showPromotionNotification: notificationManager.showPromotionNotification.bind(notificationManager),
    showSystemNotification: notificationManager.showSystemNotification.bind(notificationManager)
  }
}

// Auto-initialize
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    notificationManager.initialize()
  })
}
