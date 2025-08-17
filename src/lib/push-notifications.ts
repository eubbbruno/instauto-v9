'use client'

export interface PushNotificationPayload {
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
  timestamp?: number
  vibrate?: number[]
}

export interface PushSubscriptionData {
  user_id: string
  endpoint: string
  p256dh: string
  auth: string
  user_agent: string
  created_at?: string
}

class PushNotificationManager {
  private vapidPublicKey: string
  
  constructor() {
    this.vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
  }

  // Verificar se notificações são suportadas
  isSupported(): boolean {
    if (typeof window === 'undefined') return false
    return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
  }

  // Verificar permissão atual
  async getPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) return 'denied'
    return Notification.permission
  }

  // Solicitar permissão para notificações
  async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) {
      console.warn('🚫 Push notifications não suportadas')
      return false
    }

    const permission = await Notification.requestPermission()
    console.log(`🔔 Permission status: ${permission}`)
    
    return permission === 'granted'
  }

  // Registrar Service Worker
  private async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) return null

    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('✅ SW registrado:', registration.scope)
      return registration
    } catch (error) {
      console.error('❌ Erro ao registrar SW:', error)
      return null
    }
  }

  // Subscrever para push notifications
  async subscribe(userId: string): Promise<PushSubscriptionData | null> {
    if (!this.isSupported()) return null

    try {
      // 1. Verificar permissão
      const hasPermission = await this.requestPermission()
      if (!hasPermission) {
        throw new Error('Permission denied')
      }

      // 2. Registrar Service Worker
      const registration = await this.registerServiceWorker()
      if (!registration) {
        throw new Error('Service Worker registration failed')
      }

      // 3. Verificar se já existe subscription
      let subscription = await registration.pushManager.getSubscription()
      
      // 4. Se não existe, criar nova subscription
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
        })
      }

      // 5. Extrair dados da subscription
      const subscriptionData: PushSubscriptionData = {
        user_id: userId,
        endpoint: subscription.endpoint,
        p256dh: this.arrayBufferToBase64(subscription.getKey('p256dh')!),
        auth: this.arrayBufferToBase64(subscription.getKey('auth')!),
        user_agent: navigator.userAgent
      }

      // 6. Salvar no backend
      await this.saveSubscription(subscriptionData)

      console.log('✅ Push subscription criada:', subscriptionData)
      return subscriptionData

    } catch (error) {
      console.error('❌ Erro ao criar subscription:', error)
      return null
    }
  }

  // Cancelar subscription
  async unsubscribe(userId: string): Promise<boolean> {
    try {
      const registration = await navigator.serviceWorker.getRegistration()
      if (!registration) return false

      const subscription = await registration.pushManager.getSubscription()
      if (!subscription) return false

      const success = await subscription.unsubscribe()
      if (success) {
        await this.removeSubscription(userId)
        console.log('✅ Push subscription cancelada')
      }

      return success
    } catch (error) {
      console.error('❌ Erro ao cancelar subscription:', error)
      return false
    }
  }

  // Verificar se usuário está subscrito
  async isSubscribed(): Promise<boolean> {
    if (!this.isSupported()) return false

    try {
      const registration = await navigator.serviceWorker.getRegistration()
      if (!registration) return false

      const subscription = await registration.pushManager.getSubscription()
      return !!subscription
    } catch (error) {
      console.error('❌ Erro ao verificar subscription:', error)
      return false
    }
  }

  // Mostrar notificação local
  async showLocalNotification(payload: PushNotificationPayload): Promise<void> {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      console.warn('🚫 Não é possível mostrar notificação')
      return
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration()
      if (!registration) {
        throw new Error('Service Worker não encontrado')
      }

      await registration.showNotification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/images/logo-of.svg',
        badge: payload.badge || '/images/logo-of.svg',
        image: payload.image,
        tag: payload.tag,
        data: payload.data,
        actions: payload.actions,
        requireInteraction: payload.requireInteraction || false,
        silent: payload.silent || false,
        timestamp: payload.timestamp || Date.now(),
        vibrate: payload.vibrate || [200, 100, 200]
      })

      console.log('✅ Notificação local exibida:', payload.title)
    } catch (error) {
      console.error('❌ Erro ao exibir notificação:', error)
    }
  }

  // Salvar subscription no backend
  private async saveSubscription(data: PushSubscriptionData): Promise<void> {
    try {
      const response = await fetch('/api/push-notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      console.log('✅ Subscription salva no backend')
    } catch (error) {
      console.error('❌ Erro ao salvar subscription:', error)
      throw error
    }
  }

  // Remover subscription do backend
  private async removeSubscription(userId: string): Promise<void> {
    try {
      const response = await fetch('/api/push-notifications/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      console.log('✅ Subscription removida do backend')
    } catch (error) {
      console.error('❌ Erro ao remover subscription:', error)
    }
  }

  // Utilitários
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
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
}

// Singleton
const pushNotificationManager = new PushNotificationManager()
export default pushNotificationManager