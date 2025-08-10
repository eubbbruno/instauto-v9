'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface ChatMessage {
  id: string
  conversation_id: string
  sender_id: string
  sender_name: string
  sender_avatar?: string
  message: string
  message_type: 'text' | 'image' | 'file' | 'system'
  timestamp: string
  read_by: string[]
  reply_to?: string
  attachments?: {
    url: string
    type: string
    name: string
    size: number
  }[]
}

export interface UserStatus {
  user_id: string
  status: 'online' | 'offline' | 'away'
  last_seen: string
  typing_in?: string
}

export interface ConversationData {
  id: string
  participants: string[]
  type: 'direct' | 'group'
  title?: string
  last_message?: ChatMessage
  unread_count: number
  created_at: string
  updated_at: string
}

class WebSocketManager {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private pingInterval: NodeJS.Timeout | null = null
  private isConnecting = false
  private listeners: Map<string, Function[]> = new Map()
  private currentUserId: string | null = null
  private isTyping = false
  private typingTimeout: NodeJS.Timeout | null = null

  constructor() {
    this.setupEventListeners()
  }

  async connect(userId: string): Promise<boolean> {
    if (this.isConnecting) return false
    if (this.ws?.readyState === WebSocket.OPEN) return true

    this.currentUserId = userId
    this.isConnecting = true

    try {
      // Obter token de autenticação
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('No authentication session')
      }

      // Construir URL do WebSocket
      const wsUrl = this.getWebSocketUrl()
      const token = session.access_token

      console.log('🔌 Conectando WebSocket...', { userId, wsUrl })

      this.ws = new WebSocket(`${wsUrl}?token=${token}&userId=${userId}`)

      return new Promise((resolve, reject) => {
        if (!this.ws) {
          reject(new Error('WebSocket not initialized'))
          return
        }

        this.ws.onopen = () => {
          console.log('✅ WebSocket conectado!')
          this.isConnecting = false
          this.reconnectAttempts = 0
          this.startHeartbeat()
          this.emit('connected', { userId })
          resolve(true)
        }

        this.ws.onclose = (event) => {
          console.log('🔌 WebSocket desconectado:', event.code, event.reason)
          this.isConnecting = false
          this.stopHeartbeat()
          this.emit('disconnected', { code: event.code, reason: event.reason })
          
          if (event.code !== 1000) { // Não foi fechamento normal
            this.handleReconnect()
          }
        }

        this.ws.onerror = (error) => {
          console.error('❌ WebSocket erro:', error)
          this.isConnecting = false
          this.emit('error', error)
          reject(error)
        }

        this.ws.onmessage = (event) => {
          this.handleMessage(event)
        }

        // Timeout para conexão
        setTimeout(() => {
          if (this.isConnecting) {
            this.isConnecting = false
            reject(new Error('WebSocket connection timeout'))
          }
        }, 10000)
      })

    } catch (error) {
      console.error('❌ Erro ao conectar WebSocket:', error)
      this.isConnecting = false
      return false
    }
  }

  disconnect(): void {
    console.log('🔌 Desconectando WebSocket...')
    
    this.stopHeartbeat()
    this.currentUserId = null
    this.reconnectAttempts = this.maxReconnectAttempts // Impedir reconnect

    if (this.ws) {
      this.ws.close(1000, 'User disconnected')
      this.ws = null
    }
  }

  sendMessage(message: Omit<ChatMessage, 'id' | 'timestamp' | 'read_by'>): boolean {
    if (!this.isConnected()) {
      console.warn('⚠️ WebSocket não conectado - mensagem não enviada')
      return false
    }

    const messageData = {
      type: 'message',
      data: {
        ...message,
        id: this.generateId(),
        timestamp: new Date().toISOString(),
        read_by: [message.sender_id]
      }
    }

    try {
      this.ws!.send(JSON.stringify(messageData))
      console.log('📤 Mensagem enviada:', messageData)
      return true
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error)
      return false
    }
  }

  markAsRead(conversationId: string, messageIds: string[]): void {
    if (!this.isConnected()) return

    this.send({
      type: 'mark_read',
      data: {
        conversation_id: conversationId,
        message_ids: messageIds,
        user_id: this.currentUserId
      }
    })
  }

  startTyping(conversationId: string): void {
    if (!this.isConnected() || this.isTyping) return

    this.isTyping = true
    this.send({
      type: 'typing_start',
      data: {
        conversation_id: conversationId,
        user_id: this.currentUserId
      }
    })

    // Auto-stop após 10 segundos
    if (this.typingTimeout) clearTimeout(this.typingTimeout)
    this.typingTimeout = setTimeout(() => {
      this.stopTyping(conversationId)
    }, 10000)
  }

  stopTyping(conversationId: string): void {
    if (!this.isConnected() || !this.isTyping) return

    this.isTyping = false
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout)
      this.typingTimeout = null
    }

    this.send({
      type: 'typing_stop',
      data: {
        conversation_id: conversationId,
        user_id: this.currentUserId
      }
    })
  }

  updateStatus(status: 'online' | 'away'): void {
    if (!this.isConnected()) return

    this.send({
      type: 'status_update',
      data: {
        user_id: this.currentUserId,
        status,
        timestamp: new Date().toISOString()
      }
    })
  }

  joinConversation(conversationId: string): void {
    if (!this.isConnected()) return

    this.send({
      type: 'join_conversation',
      data: {
        conversation_id: conversationId,
        user_id: this.currentUserId
      }
    })
  }

  leaveConversation(conversationId: string): void {
    if (!this.isConnected()) return

    this.send({
      type: 'leave_conversation',
      data: {
        conversation_id: conversationId,
        user_id: this.currentUserId
      }
    })
  }

  // Event listeners
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)
  }

  off(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index !== -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  private emit(event: string, data?: any): void {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`❌ Erro no callback ${event}:`, error)
        }
      })
    }
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data)
      console.log('📥 WebSocket mensagem recebida:', data)

      switch (data.type) {
        case 'message':
          this.emit('message', data.data)
          break
        case 'message_read':
          this.emit('message_read', data.data)
          break
        case 'typing_start':
          this.emit('typing_start', data.data)
          break
        case 'typing_stop':
          this.emit('typing_stop', data.data)
          break
        case 'user_status':
          this.emit('user_status', data.data)
          break
        case 'conversation_update':
          this.emit('conversation_update', data.data)
          break
        case 'ping':
          this.send({ type: 'pong' })
          break
        case 'error':
          this.emit('error', data.data)
          break
        default:
          console.warn('⚠️ Tipo de mensagem desconhecido:', data.type)
      }
    } catch (error) {
      console.error('❌ Erro ao processar mensagem WebSocket:', error)
    }
  }

  private send(data: any): boolean {
    if (!this.isConnected()) return false

    try {
      this.ws!.send(JSON.stringify(data))
      return true
    } catch (error) {
      console.error('❌ Erro ao enviar dados WebSocket:', error)
      return false
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Máximo de tentativas de reconexão atingido')
      this.emit('max_reconnect_attempts')
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)

    console.log(`🔄 Tentativa de reconexão ${this.reconnectAttempts}/${this.maxReconnectAttempts} em ${delay}ms`)

    setTimeout(() => {
      if (this.currentUserId) {
        this.connect(this.currentUserId)
      }
    }, delay)
  }

  private startHeartbeat(): void {
    this.pingInterval = setInterval(() => {
      if (this.isConnected()) {
        this.send({ type: 'ping' })
      }
    }, 30000) // Ping a cada 30 segundos
  }

  private stopHeartbeat(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval)
      this.pingInterval = null
    }
  }

  private setupEventListeners(): void {
    // Detectar quando a página fica inativa/ativa
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.updateStatus('away')
      } else {
        this.updateStatus('online')
      }
    })

    // Detectar antes da página fechar
    window.addEventListener('beforeunload', () => {
      this.disconnect()
    })
  }

  private getWebSocketUrl(): string {
    // Em produção, usar WSS
    if (typeof window !== 'undefined') {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const host = window.location.host
      return `${protocol}//${host}/api/ws`
    }
    return 'ws://localhost:3000/api/ws'
  }

  private generateId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Getters
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }

  getConnectionState(): string {
    if (!this.ws) return 'disconnected'
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING: return 'connecting'
      case WebSocket.OPEN: return 'connected'
      case WebSocket.CLOSING: return 'closing'
      case WebSocket.CLOSED: return 'disconnected'
      default: return 'unknown'
    }
  }

  getCurrentUserId(): string | null {
    return this.currentUserId
  }
}

// Instância singleton
export const websocketManager = new WebSocketManager()

// Hook React para usar WebSocket
export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false)
  const [connectionState, setConnectionState] = useState<string>('disconnected')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const updateConnectionState = () => {
      const state = websocketManager.getConnectionState()
      setConnectionState(state)
      setIsConnected(state === 'connected')
    }

    // Listeners
    websocketManager.on('connected', () => {
      updateConnectionState()
      setError(null)
    })

    websocketManager.on('disconnected', updateConnectionState)

    websocketManager.on('error', (error: any) => {
      setError(error.message || 'WebSocket error')
      updateConnectionState()
    })

    websocketManager.on('max_reconnect_attempts', () => {
      setError('Falha na conexão. Verifique sua internet.')
    })

    // Estado inicial
    updateConnectionState()

    return () => {
      // Cleanup listeners se necessário
    }
  }, [])

  const connect = async (userId: string) => {
    setError(null)
    return await websocketManager.connect(userId)
  }

  const disconnect = () => {
    websocketManager.disconnect()
  }

  return {
    isConnected,
    connectionState,
    error,
    connect,
    disconnect,
    websocket: websocketManager
  }
}

export default websocketManager

