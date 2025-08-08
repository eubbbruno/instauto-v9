import { supabase } from './supabase'

export type MessageType = 'texto' | 'foto' | 'arquivo' | 'agendamento' | 'sistema' | 'voz' | 'typing'

export interface WebSocketMessage {
  id: string
  conversaId: string
  remetente: 'oficina' | 'motorista'
  destinatario: string
  tipo: MessageType
  conteudo: string
  timestamp: string
  status: 'enviando' | 'enviada' | 'entregue' | 'lida'
  anexo?: {
    nome: string
    tipo: string
    url: string
    tamanho?: number
  }
  agendamento?: {
    id: string
    data: string
    servico: string
    valor?: number
    status: 'confirmado' | 'pendente' | 'cancelado' | 'concluido'
  }
  metadata?: {
    userAgent?: string
    location?: {
      lat: number
      lng: number
    }
  }
}

export interface TypingIndicator {
  conversaId: string
  userId: string
  userName: string
  isTyping: boolean
  timestamp: string
}

export interface OnlineStatus {
  userId: string
  isOnline: boolean
  lastSeen: string
}

class WebSocketManager {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectInterval = 1000
  private heartbeatInterval: NodeJS.Timeout | null = null
  private userId: string | null = null
  private userType: 'motorista' | 'oficina' | null = null
  
  // Event handlers
  private messageHandlers: ((message: WebSocketMessage) => void)[] = []
  private typingHandlers: ((typing: TypingIndicator) => void)[] = []
  private statusHandlers: ((status: OnlineStatus) => void)[] = []
  private connectionHandlers: ((connected: boolean) => void)[] = []

  constructor() {
    this.initializeAuth()
  }

  private async initializeAuth() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        this.userId = user.id
        
        // Buscar tipo de usuário
        const { data: profile } = await supabase
          .from('profiles')
          .select('type')
          .eq('id', user.id)
          .single()
        
        this.userType = profile?.type || null
        console.log('🔗 WebSocket Auth initialized:', { userId: this.userId, userType: this.userType })
      }
    } catch (error) {
      console.error('❌ WebSocket Auth error:', error)
    }
  }

  connect() {
    if (!this.userId) {
      console.warn('⚠️ Cannot connect WebSocket: User not authenticated')
      return
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('🔗 WebSocket already connected')
      return
    }

    try {
      // Em produção, usar wss://your-websocket-server.com
      const wsUrl = process.env.NODE_ENV === 'production' 
        ? 'wss://instauto-websocket.herokuapp.com'
        : 'ws://localhost:8080'
      
      this.ws = new WebSocket(`${wsUrl}?userId=${this.userId}&userType=${this.userType}`)
      
      this.ws.onopen = this.handleOpen.bind(this)
      this.ws.onmessage = this.handleMessage.bind(this)
      this.ws.onclose = this.handleClose.bind(this)
      this.ws.onerror = this.handleError.bind(this)
      
      console.log('🔗 Connecting to WebSocket...')
    } catch (error) {
      console.error('❌ WebSocket connection error:', error)
      this.scheduleReconnect()
    }
  }

  private handleOpen() {
    console.log('✅ WebSocket connected')
    this.reconnectAttempts = 0
    this.startHeartbeat()
    this.notifyConnectionHandlers(true)
    
    // Enviar status online
    this.updateOnlineStatus(true)
  }

  private handleMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data)
      
      switch (data.type) {
        case 'message':
          this.notifyMessageHandlers(data.payload as WebSocketMessage)
          break
        case 'typing':
          this.notifyTypingHandlers(data.payload as TypingIndicator)
          break
        case 'status':
          this.notifyStatusHandlers(data.payload as OnlineStatus)
          break
        case 'pong':
          // Heartbeat response
          break
        default:
          console.log('📨 Unknown WebSocket message type:', data.type)
      }
    } catch (error) {
      console.error('❌ Error parsing WebSocket message:', error)
    }
  }

  private handleClose(event: CloseEvent) {
    console.log('🔌 WebSocket disconnected:', event.code, event.reason)
    this.stopHeartbeat()
    this.notifyConnectionHandlers(false)
    
    if (event.code !== 1000) { // Not a normal closure
      this.scheduleReconnect()
    }
  }

  private handleError(error: Event) {
    console.error('❌ WebSocket error:', error)
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached')
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1)
    
    console.log(`🔄 Scheduling reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`)
    
    setTimeout(() => {
      this.connect()
    }, delay)
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }))
      }
    }, 30000) // 30 seconds
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  // Public methods
  sendMessage(message: Omit<WebSocketMessage, 'id' | 'timestamp' | 'status'>) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('⚠️ WebSocket not connected, cannot send message')
      return false
    }

    const fullMessage: WebSocketMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      status: 'enviando'
    }

    this.ws.send(JSON.stringify({
      type: 'message',
      payload: fullMessage
    }))

    return true
  }

  sendTypingIndicator(conversaId: string, isTyping: boolean) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.userId) {
      return
    }

    const typing: TypingIndicator = {
      conversaId,
      userId: this.userId,
      userName: 'Usuário', // Pegar do contexto depois
      isTyping,
      timestamp: new Date().toISOString()
    }

    this.ws.send(JSON.stringify({
      type: 'typing',
      payload: typing
    }))
  }

  updateOnlineStatus(isOnline: boolean) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.userId) {
      return
    }

    const status: OnlineStatus = {
      userId: this.userId,
      isOnline,
      lastSeen: new Date().toISOString()
    }

    this.ws.send(JSON.stringify({
      type: 'status',
      payload: status
    }))
  }

  // Event subscriptions
  onMessage(handler: (message: WebSocketMessage) => void) {
    this.messageHandlers.push(handler)
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler)
    }
  }

  onTyping(handler: (typing: TypingIndicator) => void) {
    this.typingHandlers.push(handler)
    return () => {
      this.typingHandlers = this.typingHandlers.filter(h => h !== handler)
    }
  }

  onStatusChange(handler: (status: OnlineStatus) => void) {
    this.statusHandlers.push(handler)
    return () => {
      this.statusHandlers = this.statusHandlers.filter(h => h !== handler)
    }
  }

  onConnectionChange(handler: (connected: boolean) => void) {
    this.connectionHandlers.push(handler)
    return () => {
      this.connectionHandlers = this.connectionHandlers.filter(h => h !== handler)
    }
  }

  // Notification helpers
  private notifyMessageHandlers(message: WebSocketMessage) {
    this.messageHandlers.forEach(handler => {
      try {
        handler(message)
      } catch (error) {
        console.error('❌ Error in message handler:', error)
      }
    })
  }

  private notifyTypingHandlers(typing: TypingIndicator) {
    this.typingHandlers.forEach(handler => {
      try {
        handler(typing)
      } catch (error) {
        console.error('❌ Error in typing handler:', error)
      }
    })
  }

  private notifyStatusHandlers(status: OnlineStatus) {
    this.statusHandlers.forEach(handler => {
      try {
        handler(status)
      } catch (error) {
        console.error('❌ Error in status handler:', error)
      }
    })
  }

  private notifyConnectionHandlers(connected: boolean) {
    this.connectionHandlers.forEach(handler => {
      try {
        handler(connected)
      } catch (error) {
        console.error('❌ Error in connection handler:', error)
      }
    })
  }

  disconnect() {
    console.log('🔌 Disconnecting WebSocket...')
    this.updateOnlineStatus(false)
    this.stopHeartbeat()
    
    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect')
      this.ws = null
    }
  }

  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

// Singleton instance
export const websocketManager = new WebSocketManager()

// Auto-connect on auth state change
supabase.auth.onAuthStateChange((event) => {
  if (event === 'SIGNED_IN') {
    websocketManager.connect()
  } else if (event === 'SIGNED_OUT') {
    websocketManager.disconnect()
  }
})

// Utility hooks
export function useWebSocket() {
  return {
    sendMessage: websocketManager.sendMessage.bind(websocketManager),
    sendTypingIndicator: websocketManager.sendTypingIndicator.bind(websocketManager),
    updateOnlineStatus: websocketManager.updateOnlineStatus.bind(websocketManager),
    isConnected: websocketManager.isConnected.bind(websocketManager),
    connect: websocketManager.connect.bind(websocketManager),
    disconnect: websocketManager.disconnect.bind(websocketManager),
    onMessage: websocketManager.onMessage.bind(websocketManager),
    onTyping: websocketManager.onTyping.bind(websocketManager),
    onStatusChange: websocketManager.onStatusChange.bind(websocketManager),
    onConnectionChange: websocketManager.onConnectionChange.bind(websocketManager)
  }
}
