'use client'

import { initializeApp, getApps } from 'firebase/app'
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging'

// Configuração do Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

// VAPID Key para Web Push
const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY

// Inicializar Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export interface NotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  image?: string
  data?: Record<string, any>
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
}

class NotificationService {
  private messaging: Messaging | null = null
  private isSupported = false

  constructor() {
    this.checkSupport()
  }

  private checkSupport() {
    this.isSupported = 
      typeof window !== 'undefined' && 
      'serviceWorker' in navigator && 
      'Notification' in window &&
      'PushManager' in window
  }

  // Inicializar serviço de mensagens
  async initialize() {
    if (!this.isSupported) {
      console.warn('Push notifications não suportadas neste navegador')
      return false
    }

    try {
      // Registrar service worker
      await this.registerServiceWorker()
      
      // Inicializar messaging
      this.messaging = getMessaging(app)
      
      // Configurar listener para mensagens em foreground
      this.setupForegroundListener()
      
      return true
    } catch (error) {
      console.error('Erro ao inicializar notificações:', error)
      return false
    }
  }

  // Registrar service worker
  private async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
        console.log('Service Worker registrado:', registration)
        return registration
      } catch (error) {
        console.error('Erro ao registrar Service Worker:', error)
        throw error
      }
    }
  }

  // Solicitar permissão para notificações
  async requestPermission(): Promise<boolean> {
    if (!this.isSupported) return false

    try {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error)
      return false
    }
  }

  // Obter token FCM
  async getToken(): Promise<string | null> {
    if (!this.messaging || !VAPID_KEY) return null

    try {
      const token = await getToken(this.messaging, {
        vapidKey: VAPID_KEY
      })
      
      if (token) {
        console.log('Token FCM obtido:', token)
        return token
      } else {
        console.log('Nenhum token disponível')
        return null
      }
    } catch (error) {
      console.error('Erro ao obter token:', error)
      return null
    }
  }

  // Configurar listener para mensagens em foreground
  private setupForegroundListener() {
    if (!this.messaging) return

    onMessage(this.messaging, (payload) => {
      console.log('Mensagem recebida em foreground:', payload)
      
      // Mostrar notificação customizada
      this.showNotification({
        title: payload.notification?.title || 'Nova mensagem',
        body: payload.notification?.body || '',
        icon: payload.notification?.icon || '/images/logo-of.svg',
        data: payload.data
      })
    })
  }

  // Mostrar notificação local
  async showNotification(notification: NotificationPayload) {
    if (!this.isSupported) return

    try {
      const registration = await navigator.serviceWorker.ready
      
      await registration.showNotification(notification.title, {
        body: notification.body,
        icon: notification.icon || '/images/logo-of.svg',
        badge: notification.badge || '/images/logo-of.svg',
        image: notification.image,
        data: notification.data,
        actions: notification.actions,
        requireInteraction: true,
        vibrate: [200, 100, 200],
        tag: 'instauto-notification'
      })
    } catch (error) {
      console.error('Erro ao mostrar notificação:', error)
    }
  }

  // Salvar token no servidor
  async saveTokenToServer(token: string, userId: string, userType: 'motorista' | 'oficina') {
    try {
      const response = await fetch('/api/notifications/save-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          userId,
          userType,
          platform: 'web'
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar token')
      }

      console.log('Token salvo no servidor')
    } catch (error) {
      console.error('Erro ao salvar token no servidor:', error)
    }
  }

  // Enviar notificação via API
  async sendNotification(data: {
    to: string // userId ou token
    title: string
    body: string
    data?: Record<string, any>
    image?: string
  }) {
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Erro ao enviar notificação')
      }

      const result = await response.json()
      console.log('Notificação enviada:', result)
      return result
    } catch (error) {
      console.error('Erro ao enviar notificação:', error)
      throw error
    }
  }

  // Verificar se notificações estão habilitadas
  isNotificationEnabled(): boolean {
    return this.isSupported && Notification.permission === 'granted'
  }

  // Obter status da permissão
  getPermissionStatus(): NotificationPermission {
    return Notification.permission
  }
}

// Instância singleton
export const notificationService = new NotificationService()

// Hook para usar notificações
export const useNotifications = () => {
  return notificationService
}

// Tipos de notificação predefinidos
export const NotificationTypes = {
  NEW_MESSAGE: {
    title: 'Nova Mensagem',
    icon: '/images/icons/message.png',
    actions: [
      { action: 'reply', title: 'Responder' },
      { action: 'view', title: 'Ver' }
    ]
  },
  APPOINTMENT_REMINDER: {
    title: 'Lembrete de Agendamento',
    icon: '/images/icons/calendar.png',
    actions: [
      { action: 'confirm', title: 'Confirmar' },
      { action: 'reschedule', title: 'Reagendar' }
    ]
  },
  PAYMENT_SUCCESS: {
    title: 'Pagamento Aprovado',
    icon: '/images/icons/success.png',
    actions: [
      { action: 'view', title: 'Ver Detalhes' }
    ]
  },
  SERVICE_UPDATE: {
    title: 'Atualização do Serviço',
    icon: '/images/icons/wrench.png',
    actions: [
      { action: 'view', title: 'Ver Status' }
    ]
  }
}
