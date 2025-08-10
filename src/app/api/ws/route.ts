import { NextRequest } from 'next/server'
import { WebSocketServer, WebSocket } from 'ws'
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'

// Configuração do Supabase para servidor
const supabase = process.env.SUPABASE_SERVICE_KEY 
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  : null

interface ClientConnection {
  ws: WebSocket
  userId: string
  conversationIds: Set<string>
  isAlive: boolean
  lastPing: number
}

class WebSocketManager {
  private wss: WebSocketServer | null = null
  private clients: Map<string, ClientConnection> = new Map()
  private userConnections: Map<string, Set<string>> = new Map() // userId -> Set of connectionIds
  private conversations: Map<string, Set<string>> = new Map() // conversationId -> Set of userIds
  private pingInterval: NodeJS.Timeout | null = null

  constructor() {
    // Só inicializar se as variáveis de ambiente estiverem disponíveis
    if (typeof window === 'undefined' && supabase) {
      this.setupWebSocketServer()
      this.startHeartbeat()
    }
  }

  private setupWebSocketServer() {
    try {
      this.wss = new WebSocketServer({ 
        port: 8080,
        perMessageDeflate: false,
        clientTracking: true
      })

      console.log('🌐 WebSocket Server iniciado na porta 8080')

      this.wss.on('connection', (ws: WebSocket, request) => {
        this.handleConnection(ws, request)
      })

      this.wss.on('error', (error) => {
        console.error('❌ WebSocket Server error:', error)
      })

    } catch (error) {
      console.error('❌ Erro ao iniciar WebSocket Server:', error)
    }
  }

  private async handleConnection(ws: WebSocket, request: any) {
    const url = new URL(request.url!, `http://${request.headers.host}`)
    const token = url.searchParams.get('token')
    const userId = url.searchParams.get('userId')

    if (!token || !userId) {
      console.warn('⚠️ Conexão rejeitada: token ou userId ausente')
      ws.close(1008, 'Token ou userId ausente')
      return
    }

    try {
      if (!supabase) {
        ws.close(1011, 'WebSocket service não configurado')
        return
      }

      // Verificar token JWT
      const { data: { user }, error } = await supabase.auth.getUser(token)
      
      if (error || !user || user.id !== userId) {
        console.warn('⚠️ Conexão rejeitada: token inválido')
        ws.close(1008, 'Token inválido')
        return
      }

      // Criar conexão
      const connectionId = this.generateConnectionId()
      const client: ClientConnection = {
        ws,
        userId,
        conversationIds: new Set(),
        isAlive: true,
        lastPing: Date.now()
      }

      this.clients.set(connectionId, client)

      // Mapear usuário para conexões
      if (!this.userConnections.has(userId)) {
        this.userConnections.set(userId, new Set())
      }
      this.userConnections.get(userId)!.add(connectionId)

      console.log(`✅ WebSocket conectado: ${userId} (${connectionId})`)

      // Atualizar status do usuário para online
      await this.updateUserStatus(userId, 'online')

      // Notificar outros usuários sobre status online
      this.broadcastUserStatus(userId, 'online')

      // Configurar handlers da conexão
      ws.on('message', (data) => {
        this.handleMessage(connectionId, data)
      })

      ws.on('close', () => {
        this.handleDisconnection(connectionId)
      })

      ws.on('error', (error) => {
        console.error(`❌ WebSocket error for ${userId}:`, error)
        this.handleDisconnection(connectionId)
      })

      ws.on('pong', () => {
        client.isAlive = true
        client.lastPing = Date.now()
      })

      // Enviar confirmação de conexão
      this.sendToClient(connectionId, {
        type: 'connected',
        data: { userId, connectionId }
      })

    } catch (error) {
      console.error('❌ Erro ao processar conexão WebSocket:', error)
      ws.close(1011, 'Erro interno do servidor')
    }
  }

  private async handleMessage(connectionId: string, data: any) {
    const client = this.clients.get(connectionId)
    if (!client) return

    try {
      const message = JSON.parse(data.toString())
      console.log(`📥 Mensagem recebida de ${client.userId}:`, message.type)

      switch (message.type) {
        case 'message':
          await this.handleChatMessage(client, message.data)
          break
        case 'join_conversation':
          await this.handleJoinConversation(client, message.data)
          break
        case 'leave_conversation':
          await this.handleLeaveConversation(client, message.data)
          break
        case 'typing_start':
          await this.handleTypingStart(client, message.data)
          break
        case 'typing_stop':
          await this.handleTypingStop(client, message.data)
          break
        case 'mark_read':
          await this.handleMarkRead(client, message.data)
          break
        case 'status_update':
          await this.handleStatusUpdate(client, message.data)
          break
        case 'ping':
          this.sendToClient(connectionId, { type: 'pong' })
          break
        case 'pong':
          client.isAlive = true
          client.lastPing = Date.now()
          break
        default:
          console.warn(`⚠️ Tipo de mensagem desconhecido: ${message.type}`)
      }
    } catch (error) {
      console.error('❌ Erro ao processar mensagem:', error)
      this.sendToClient(connectionId, {
        type: 'error',
        data: { message: 'Erro ao processar mensagem' }
      })
    }
  }

  private async handleChatMessage(client: ClientConnection, data: any) {
    try {
      // Salvar mensagem no banco
      const { data: savedMessage, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: data.conversation_id,
          sender_id: client.userId,
          sender_name: data.sender_name,
          sender_avatar: data.sender_avatar,
          message: data.message,
          message_type: data.message_type || 'text',
          reply_to: data.reply_to,
          attachments: data.attachments || []
        })
        .select()
        .single()

      if (error) throw error

      // Buscar participantes da conversa
      const { data: conversation } = await supabase
        .from('conversations')
        .select('participants')
        .eq('id', data.conversation_id)
        .single()

      if (conversation) {
        // Broadcast para todos os participantes da conversa
        const messageData = {
          type: 'message',
          data: {
            ...savedMessage,
            timestamp: savedMessage.created_at
          }
        }

        conversation.participants.forEach((participantId: string) => {
          this.sendToUser(participantId, messageData)
        })
      }

    } catch (error) {
      console.error('❌ Erro ao salvar mensagem:', error)
      this.sendToClient(this.getConnectionId(client), {
        type: 'error',
        data: { message: 'Erro ao enviar mensagem' }
      })
    }
  }

  private async handleJoinConversation(client: ClientConnection, data: any) {
    const conversationId = data.conversation_id
    client.conversationIds.add(conversationId)

    // Adicionar à lista de usuários na conversa
    if (!this.conversations.has(conversationId)) {
      this.conversations.set(conversationId, new Set())
    }
    this.conversations.get(conversationId)!.add(client.userId)

    console.log(`👥 ${client.userId} entrou na conversa ${conversationId}`)
  }

  private async handleLeaveConversation(client: ClientConnection, data: any) {
    const conversationId = data.conversation_id
    client.conversationIds.delete(conversationId)

    // Remover da lista de usuários na conversa
    this.conversations.get(conversationId)?.delete(client.userId)

    console.log(`👋 ${client.userId} saiu da conversa ${conversationId}`)
  }

  private async handleTypingStart(client: ClientConnection, data: any) {
    const conversationId = data.conversation_id

    // Atualizar status no banco
    await supabase
      .from('user_status')
      .upsert({
        user_id: client.userId,
        typing_in: conversationId,
        updated_at: new Date().toISOString()
      })

    // Broadcast para outros participantes da conversa
    this.broadcastToConversation(conversationId, {
      type: 'typing_start',
      data: {
        user_id: client.userId,
        conversation_id: conversationId
      }
    }, client.userId)
  }

  private async handleTypingStop(client: ClientConnection, data: any) {
    const conversationId = data.conversation_id

    // Atualizar status no banco
    await supabase
      .from('user_status')
      .upsert({
        user_id: client.userId,
        typing_in: null,
        updated_at: new Date().toISOString()
      })

    // Broadcast para outros participantes da conversa
    this.broadcastToConversation(conversationId, {
      type: 'typing_stop',
      data: {
        user_id: client.userId,
        conversation_id: conversationId
      }
    }, client.userId)
  }

  private async handleMarkRead(client: ClientConnection, data: any) {
    try {
      // Chamar função do banco para marcar como lidas
      await supabase
        .rpc('mark_messages_as_read', {
          conversation_id_param: data.conversation_id,
          user_id_param: client.userId
        })

      // Broadcast para outros participantes
      this.broadcastToConversation(data.conversation_id, {
        type: 'message_read',
        data: {
          conversation_id: data.conversation_id,
          user_id: client.userId,
          message_ids: data.message_ids
        }
      }, client.userId)

    } catch (error) {
      console.error('❌ Erro ao marcar mensagens como lidas:', error)
    }
  }

  private async handleStatusUpdate(client: ClientConnection, data: any) {
    const status = data.status
    
    await this.updateUserStatus(client.userId, status)
    this.broadcastUserStatus(client.userId, status)
  }

  private async handleDisconnection(connectionId: string) {
    const client = this.clients.get(connectionId)
    if (!client) return

    console.log(`🔌 WebSocket desconectado: ${client.userId} (${connectionId})`)

    // Remover da lista de conexões
    this.clients.delete(connectionId)
    this.userConnections.get(client.userId)?.delete(connectionId)

    // Se não há mais conexões do usuário, marcar como offline
    if (!this.userConnections.get(client.userId)?.size) {
      await this.updateUserStatus(client.userId, 'offline')
      this.broadcastUserStatus(client.userId, 'offline')
      this.userConnections.delete(client.userId)
    }

    // Remover das conversas
    client.conversationIds.forEach(conversationId => {
      this.conversations.get(conversationId)?.delete(client.userId)
    })
  }

  private async updateUserStatus(userId: string, status: string) {
    try {
      await supabase
        .from('user_status')
        .upsert({
          user_id: userId,
          status,
          last_seen: new Date().toISOString(),
          typing_in: status === 'offline' ? null : undefined
        })
    } catch (error) {
      console.error('❌ Erro ao atualizar status do usuário:', error)
    }
  }

  private broadcastUserStatus(userId: string, status: string) {
    // Broadcast para todos os usuários conectados
    this.broadcast({
      type: 'user_status',
      data: {
        user_id: userId,
        status,
        timestamp: new Date().toISOString()
      }
    })
  }

  private broadcastToConversation(conversationId: string, message: any, excludeUserId?: string) {
    const participants = this.conversations.get(conversationId)
    if (!participants) return

    participants.forEach(userId => {
      if (userId !== excludeUserId) {
        this.sendToUser(userId, message)
      }
    })
  }

  private sendToUser(userId: string, message: any) {
    const connections = this.userConnections.get(userId)
    if (!connections) return

    connections.forEach(connectionId => {
      this.sendToClient(connectionId, message)
    })
  }

  private sendToClient(connectionId: string, message: any) {
    const client = this.clients.get(connectionId)
    if (!client || client.ws.readyState !== WebSocket.OPEN) return

    try {
      client.ws.send(JSON.stringify(message))
    } catch (error) {
      console.error(`❌ Erro ao enviar mensagem para ${connectionId}:`, error)
    }
  }

  private broadcast(message: any, excludeConnectionId?: string) {
    this.clients.forEach((client, connectionId) => {
      if (connectionId !== excludeConnectionId && client.ws.readyState === WebSocket.OPEN) {
        this.sendToClient(connectionId, message)
      }
    })
  }

  private startHeartbeat() {
    this.pingInterval = setInterval(() => {
      this.clients.forEach((client, connectionId) => {
        if (!client.isAlive) {
          console.log(`💔 Conexão morta detectada: ${connectionId}`)
          client.ws.terminate()
          this.handleDisconnection(connectionId)
          return
        }

        client.isAlive = false
        if (client.ws.readyState === WebSocket.OPEN) {
          client.ws.ping()
        }
      })
    }, 30000) // A cada 30 segundos
  }

  private generateConnectionId(): string {
    return `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getConnectionId(client: ClientConnection): string {
    for (const [connectionId, c] of this.clients.entries()) {
      if (c === client) return connectionId
    }
    return ''
  }

  // Métodos públicos para gerenciamento
  getStats() {
    return {
      totalConnections: this.clients.size,
      totalUsers: this.userConnections.size,
      totalConversations: this.conversations.size,
      serverUptime: process.uptime()
    }
  }

  shutdown() {
    console.log('🔌 Encerrando WebSocket Server...')
    
    if (this.pingInterval) {
      clearInterval(this.pingInterval)
    }

    this.clients.forEach((client) => {
      client.ws.close(1001, 'Server shutdown')
    })

    this.wss?.close()
  }
}

// Instância singleton do WebSocket Manager
let wsManager: WebSocketManager | null = null

// Inicializar o WebSocket Server apenas uma vez (só em runtime, não no build)
if (!wsManager && process.env.NODE_ENV !== 'production') {
  wsManager = new WebSocketManager()
}

// API Routes para status e controle
export async function GET() {
  if (!supabase) {
    return Response.json({ 
      error: 'WebSocket service not configured',
      message: 'SUPABASE_SERVICE_KEY não encontrada'
    }, { status: 503 })
  }

  if (!wsManager) {
    return Response.json({ error: 'WebSocket server not initialized' }, { status: 503 })
  }

  const stats = wsManager.getStats()
  return Response.json({
    status: 'running',
    ...stats
  })
}

export async function POST(request: NextRequest) {
  const { action } = await request.json()

  if (action === 'shutdown' && wsManager) {
    wsManager.shutdown()
    wsManager = null
    return Response.json({ message: 'WebSocket server stopped' })
  }

  return Response.json({ error: 'Invalid action' }, { status: 400 })
}

// Graceful shutdown
process.on('SIGTERM', () => {
  wsManager?.shutdown()
})

process.on('SIGINT', () => {
  wsManager?.shutdown()
})
