'use client'

export interface ChatMessage {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  type: 'text' | 'image' | 'file' | 'location'
  status: 'sent' | 'delivered' | 'read'
  metadata?: {
    fileName?: string
    fileSize?: number
    latitude?: number
    longitude?: number
  }
}

export interface UserStatus {
  userId: string
  status: 'online' | 'offline' | 'typing'
  lastSeen: Date
}

export interface ConversationInfo {
  id: string
  participants: string[]
  lastMessage?: ChatMessage
  unreadCount: number
  type: 'direct' | 'group'
  name?: string
  avatar?: string
}

class WebSocketClient {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectTimeout: NodeJS.Timeout | null = null
  private currentUserId: string | null = null
  private messageHandlers: Set<(message: ChatMessage) => void> = new Set()
  private statusHandlers: Set<(status: UserStatus) => void> = new Set()
  private connectionHandlers: Set<(connected: boolean) => void> = new Set()

  connect(userId: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return
    }

    this.currentUserId = userId
    const wsUrl = process.env.NODE_ENV === 'production' 
      ? `wss://${window.location.host}/api/ws`
      : 'ws://localhost:3000/api/ws'

    try {
      this.ws = new WebSocket(`${wsUrl}?userId=${userId}`)
      this.setupEventListeners()
    } catch (error) {
      console.error('❌ WebSocket connection failed:', error)
      this.handleReconnect()
    }
  }

  private setupEventListeners() {
    if (!this.ws) return

    this.ws.onopen = () => {
      console.log('✅ WebSocket conectado!')
      this.reconnectAttempts = 0
      this.notifyConnectionHandlers(true)
    }

    this.ws.onclose = (event) => {
      console.log('🔌 WebSocket desconectado:', event.code, event.reason)
      this.notifyConnectionHandlers(false)
      
      if (event.code !== 1000) { // Não foi fechamento normal
        this.handleReconnect()
      }
    }

    this.ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error)
      this.handleReconnect()
    }

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        this.handleMessage(data)
      } catch (error) {
        console.error('❌ Error parsing WebSocket message:', error)
      }
    }
  }

  private handleMessage(data: any) {
    switch (data.type) {
      case 'chat_message':
        this.notifyMessageHandlers(data.message)
        break
      case 'user_status':
        this.notifyStatusHandlers(data.status)
        break
      case 'typing':
        this.notifyStatusHandlers({
          userId: data.userId,
          status: 'typing',
          lastSeen: new Date()
        })
        break
      default:
        console.log('📨 Mensagem WebSocket desconhecida:', data)
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Máximo de tentativas de reconexão atingido')
      return
    }

    this.reconnectAttempts++
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000)
    
    console.log(`🔄 Tentando reconectar em ${delay}ms (tentativa ${this.reconnectAttempts})`)
    
    this.reconnectTimeout = setTimeout(() => {
      if (this.currentUserId) {
        this.connect(this.currentUserId)
      }
    }, delay)
  }

  sendMessage(message: Omit<ChatMessage, 'id' | 'timestamp' | 'status'>) {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      console.error('❌ WebSocket não conectado')
      return false
    }

    const fullMessage: ChatMessage = {
      ...message,
      id: this.generateMessageId(),
      timestamp: new Date(),
      status: 'sent'
    }

    this.ws.send(JSON.stringify({
      type: 'chat_message',
      message: fullMessage
    }))

    return true
  }

  sendTypingIndicator(receiverId: string) {
    if (this.ws?.readyState !== WebSocket.OPEN) return

    this.ws.send(JSON.stringify({
      type: 'typing',
      receiverId,
      senderId: this.currentUserId
    }))
  }

  markAsRead(messageId: string) {
    if (this.ws?.readyState !== WebSocket.OPEN) return

    this.ws.send(JSON.stringify({
      type: 'mark_read',
      messageId,
      userId: this.currentUserId
    }))
  }

  // Handlers para eventos
  onMessage(handler: (message: ChatMessage) => void) {
    this.messageHandlers.add(handler)
    return () => this.messageHandlers.delete(handler)
  }

  onStatusChange(handler: (status: UserStatus) => void) {
    this.statusHandlers.add(handler)
    return () => this.statusHandlers.delete(handler)
  }

  onConnectionChange(handler: (connected: boolean) => void) {
    this.connectionHandlers.add(handler)
    return () => this.connectionHandlers.delete(handler)
  }

  private notifyMessageHandlers(message: ChatMessage) {
    this.messageHandlers.forEach(handler => handler(message))
  }

  private notifyStatusHandlers(status: UserStatus) {
    this.statusHandlers.forEach(handler => handler(status))
  }

  private notifyConnectionHandlers(connected: boolean) {
    this.connectionHandlers.forEach(handler => handler(connected))
  }

  private generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }

    if (this.ws) {
      this.ws.close(1000, 'User disconnected')
      this.ws = null
    }

    this.currentUserId = null
    this.reconnectAttempts = 0
  }

  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

// Singleton instance
export const wsClient = new WebSocketClient()

// Hook para usar WebSocket em components React
import { useEffect, useState } from 'react'

export const useWebSocket = (userId: string) => {
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [userStatuses, setUserStatuses] = useState<Map<string, UserStatus>>(new Map())

  useEffect(() => {
    if (!userId) return

    // Conectar WebSocket
    wsClient.connect(userId)

    // Configurar handlers
    const unsubscribeMessage = wsClient.onMessage((message) => {
      setMessages(prev => [...prev, message])
    })

    const unsubscribeStatus = wsClient.onStatusChange((status) => {
      setUserStatuses(prev => new Map(prev.set(status.userId, status)))
    })

    const unsubscribeConnection = wsClient.onConnectionChange((connected) => {
      setIsConnected(connected)
    })

    // Cleanup
    return () => {
      unsubscribeMessage()
      unsubscribeStatus()
      unsubscribeConnection()
    }
  }, [userId])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      wsClient.disconnect()
    }
  }, [])

  const sendMessage = (content: string, receiverId: string, type: ChatMessage['type'] = 'text') => {
    return wsClient.sendMessage({
      senderId: userId,
      receiverId,
      content,
      type
    })
  }

  const sendTyping = (receiverId: string) => {
    wsClient.sendTypingIndicator(receiverId)
  }

  const markAsRead = (messageId: string) => {
    wsClient.markAsRead(messageId)
  }

  return {
    isConnected,
    messages,
    userStatuses,
    sendMessage,
    sendTyping,
    markAsRead,
    clearMessages: () => setMessages([])
  }
}
