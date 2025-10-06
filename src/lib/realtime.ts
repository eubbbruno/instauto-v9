'use client'

import { supabase } from '@/lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

export interface ChatMessage {
  id: string
  sender_id: string
  receiver_id: string
  message: string
  message_type: 'text' | 'image' | 'file'
  created_at: string
  read_at?: string
  sender_name?: string
  sender_type?: 'motorista' | 'oficina'
}

export interface ChatRoom {
  id: string
  motorista_id: string
  oficina_id: string
  created_at: string
  last_message?: string
  last_message_at?: string
  unread_count?: number
}

class RealtimeChat {
  private channels: Map<string, RealtimeChannel> = new Map()
  private messageCallbacks: Map<string, (message: ChatMessage) => void> = new Map()
  private statusCallbacks: Map<string, (status: 'online' | 'offline') => void> = new Map()

  // Entrar em uma sala de chat
  async joinChatRoom(roomId: string, userId: string, onMessage: (message: ChatMessage) => void) {
    // Sair da sala anterior se existir
    this.leaveChatRoom(roomId)

    // Criar canal para a sala
    const channel = supabase.channel(`chat_room_${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          const message = payload.new as ChatMessage
          onMessage(message)
        }
      )
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        console.log('Usuários online:', state)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Marcar presença online
          await channel.track({
            user_id: userId,
            online_at: new Date().toISOString(),
          })
        }
      })

    this.channels.set(roomId, channel)
    this.messageCallbacks.set(roomId, onMessage)

    return channel
  }

  // Sair de uma sala de chat
  leaveChatRoom(roomId: string) {
    const channel = this.channels.get(roomId)
    if (channel) {
      channel.unsubscribe()
      this.channels.delete(roomId)
      this.messageCallbacks.delete(roomId)
    }
  }

  // Enviar mensagem
  async sendMessage(roomId: string, senderId: string, receiverId: string, message: string, messageType: 'text' | 'image' | 'file' = 'text') {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          room_id: roomId,
          sender_id: senderId,
          receiver_id: receiverId,
          message,
          message_type: messageType,
        })
        .select()
        .single()

      if (error) throw error

      return data
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      throw error
    }
  }

  // Buscar mensagens de uma sala
  async getChatMessages(roomId: string, limit: number = 50) {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          sender:profiles!sender_id(name, type)
        `)
        .eq('room_id', roomId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return data.reverse() // Reverter para ordem cronológica
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error)
      throw error
    }
  }

  // Criar ou buscar sala de chat entre motorista e oficina
  async getOrCreateChatRoom(motoristaId: string, oficinaId: string) {
    try {
      // Primeiro, tentar encontrar sala existente
      let { data: existingRoom, error: searchError } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('motorista_id', motoristaId)
        .eq('oficina_id', oficinaId)
        .single()

      if (searchError && searchError.code !== 'PGRST116') {
        throw searchError
      }

      if (existingRoom) {
        return existingRoom
      }

      // Se não existir, criar nova sala
      const { data: newRoom, error: createError } = await supabase
        .from('chat_rooms')
        .insert({
          motorista_id: motoristaId,
          oficina_id: oficinaId,
        })
        .select()
        .single()

      if (createError) throw createError

      return newRoom
    } catch (error) {
      console.error('Erro ao criar/buscar sala de chat:', error)
      throw error
    }
  }

  // Marcar mensagens como lidas
  async markMessagesAsRead(roomId: string, userId: string) {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .update({ read_at: new Date().toISOString() })
        .eq('room_id', roomId)
        .eq('receiver_id', userId)
        .is('read_at', null)

      if (error) throw error
    } catch (error) {
      console.error('Erro ao marcar mensagens como lidas:', error)
      throw error
    }
  }

  // Buscar salas de chat do usuário
  async getUserChatRooms(userId: string, userType: 'motorista' | 'oficina') {
    try {
      const column = userType === 'motorista' ? 'motorista_id' : 'oficina_id'
      const otherColumn = userType === 'motorista' ? 'oficina_id' : 'motorista_id'
      const otherTable = userType === 'motorista' ? 'workshops' : 'profiles'

      const { data, error } = await supabase
        .from('chat_rooms')
        .select(`
          *,
          other_user:${otherTable}!${otherColumn}(id, name),
          last_message:chat_messages(message, created_at, sender_id)
        `)
        .eq(column, userId)
        .order('updated_at', { ascending: false })

      if (error) throw error

      return data
    } catch (error) {
      console.error('Erro ao buscar salas de chat:', error)
      throw error
    }
  }

  // Contar mensagens não lidas
  async getUnreadCount(userId: string) {
    try {
      const { count, error } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', userId)
        .is('read_at', null)

      if (error) throw error

      return count || 0
    } catch (error) {
      console.error('Erro ao contar mensagens não lidas:', error)
      return 0
    }
  }

  // Limpar todos os canais
  cleanup() {
    this.channels.forEach((channel) => {
      channel.unsubscribe()
    })
    this.channels.clear()
    this.messageCallbacks.clear()
    this.statusCallbacks.clear()
  }
}

// Instância singleton
export const realtimeChat = new RealtimeChat()

// Hook para usar o chat
export const useRealtimeChat = () => {
  return realtimeChat
}
