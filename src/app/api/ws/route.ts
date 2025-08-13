import { NextRequest } from 'next/server'
import { WebSocketServer, WebSocket } from 'ws'
import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase para o servidor
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!

let supabase: any = null
if (supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey)
}

interface ConnectedClient {
  ws: WebSocket
  userId: string
  lastActivity: Date
}

class WebSocketManager {
  private wss: WebSocketServer | null = null
  private clients: Map<string, ConnectedClient> = new Map()
  private conversations: Map<string, Set<string>> = new Map()

  constructor() {
    // Apenas inicializar em ambiente Node.js
    if (typeof window === 'undefined' && supabase) {
      this.initializeWebSocketServer()
    }
  }

  private initializeWebSocketServer() {
    if (this.wss) return

    this.wss = new WebSocketServer({ 
      port: 0, // Let the system assign a port
      perMessageDeflate: false
    })

    this.wss.on('connection', (ws: WebSocket, request) => {
      this.handleConnection(ws, request)
    })

    console.log('🚀 WebSocket Server initialized')
  }

  private handleConnection(ws: WebSocket, request: any) {
    const url = new URL(request.url || '', 'http://localhost')
    const userId = url.searchParams.get('userId')

    if (!userId) {
      ws.close(1008, 'User ID required')
      return
    }

    console.log(`✅ User ${userId} connected`)

    // Armazenar cliente
    this.clients.set(userId, {
      ws,
      userId,
      lastActivity: new Date()
    })

    // Enviar status de conexão
    this.broadcastUserStatus(userId, 'online')

    // Configurar handlers
    ws.on('message', (data) => {
      this.handleMessage(userId, data.toString())
    })

    ws.on('close', () => {
      this.handleDisconnection(userId)
    })

    ws.on('error', (error) => {
      console.error(`❌ WebSocket error for user ${userId}:`, error)
      this.handleDisconnection(userId)
    })

    // Ping/Pong para manter conexão viva
    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping()
      } else {
        clearInterval(pingInterval)
      }
    }, 30000)

    ws.on('pong', () => {
      const client = this.clients.get(userId)
      if (client) {
        client.lastActivity = new Date()
      }
    })
  }

  private async handleMessage(senderId: string, data: string) {
    try {
      const message = JSON.parse(data)
      
      switch (message.type) {
        case 'chat_message':
          await this.handleChatMessage(senderId, message.message)
          break
        case 'typing':
          this.handleTypingIndicator(senderId, message.receiverId)
          break
        case 'mark_read':
          await this.handleMarkAsRead(senderId, message.messageId)
          break
        default:
          console.log('Unknown message type:', message.type)
      }
    } catch (error) {
      console.error('Error handling message:', error)
    }
  }

  private async handleChatMessage(senderId: string, message: any) {
    try {
      // Salvar mensagem no Supabase (se configurado)
      if (supabase) {
        const { error } = await supabase
          .from('messages')
          .insert({
            id: message.id,
            sender_id: senderId,
            receiver_id: message.receiverId,
            content: message.content,
            type: message.type,
            created_at: message.timestamp
          })

        if (error) {
          console.error('Error saving message:', error)
        }
      }

      // Enviar para o destinatário
      const receiverClient = this.clients.get(message.receiverId)
      if (receiverClient && receiverClient.ws.readyState === WebSocket.OPEN) {
        receiverClient.ws.send(JSON.stringify({
          type: 'chat_message',
          message: {
            ...message,
            status: 'delivered'
          }
        }))

        // Confirmar entrega para o remetente
        const senderClient = this.clients.get(senderId)
        if (senderClient && senderClient.ws.readyState === WebSocket.OPEN) {
          senderClient.ws.send(JSON.stringify({
            type: 'message_status',
            messageId: message.id,
            status: 'delivered'
          }))
        }
      }

      // Adicionar participantes à conversa
      const conversationKey = this.getConversationKey(senderId, message.receiverId)
      if (!this.conversations.has(conversationKey)) {
        this.conversations.set(conversationKey, new Set([senderId, message.receiverId]))
      }

    } catch (error) {
      console.error('Error handling chat message:', error)
    }
  }

  private handleTypingIndicator(senderId: string, receiverId: string) {
    const receiverClient = this.clients.get(receiverId)
    if (receiverClient && receiverClient.ws.readyState === WebSocket.OPEN) {
      receiverClient.ws.send(JSON.stringify({
        type: 'typing',
        userId: senderId
      }))
    }
  }

  private async handleMarkAsRead(userId: string, messageId: string) {
    try {
      if (supabase) {
        const { error } = await supabase
          .from('messages')
          .update({ status: 'read' })
          .eq('id', messageId)
          .eq('receiver_id', userId)

        if (error) {
          console.error('Error marking message as read:', error)
        }
      }
    } catch (error) {
      console.error('Error in markAsRead:', error)
    }
  }

  private handleDisconnection(userId: string) {
    console.log(`❌ User ${userId} disconnected`)
    this.clients.delete(userId)
    this.broadcastUserStatus(userId, 'offline')
  }

  private broadcastUserStatus(userId: string, status: 'online' | 'offline') {
    const statusMessage = JSON.stringify({
      type: 'user_status',
      status: {
        userId,
        status,
        lastSeen: new Date()
      }
    })

    // Enviar para todos os clientes conectados (pode ser otimizado para enviar apenas para contatos)
    this.clients.forEach((client, clientId) => {
      if (clientId !== userId && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(statusMessage)
      }
    })
  }

  private getConversationKey(userId1: string, userId2: string) {
    return [userId1, userId2].sort().join('_')
  }

  // Método para obter estatísticas
  getStats() {
    return {
      connectedClients: this.clients.size,
      activeConversations: this.conversations.size,
      serverUptime: process.uptime()
    }
  }
}

// Singleton instance
const wsManager = new WebSocketManager()

// Endpoint para upgrade HTTP para WebSocket
export async function GET(request: NextRequest) {
  const upgradeHeader = request.headers.get('upgrade')
  
  if (upgradeHeader !== 'websocket') {
    return new Response(JSON.stringify({
      message: 'WebSocket upgrade required',
      stats: wsManager.getStats()
    }), {
      status: 426,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // Em um ambiente real, você precisaria implementar o upgrade aqui
  // Por enquanto, retornamos as estatísticas
  return new Response(JSON.stringify({
    message: 'WebSocket endpoint ready',
    stats: wsManager.getStats()
  }), {
    headers: { 'Content-Type': 'application/json' }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Endpoint para enviar mensagem via HTTP (fallback)
    if (body.type === 'send_message') {
      // Implementar envio de mensagem via HTTP se WebSocket não estiver disponível
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export const dynamic = 'force-dynamic'