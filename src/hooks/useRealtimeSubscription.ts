import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

interface UseRealtimeSubscriptionProps {
  table: string
  filters?: Array<{
    column: string
    operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'in'
    value: any
  }>
  onInsert?: (payload: any) => void
  onUpdate?: (payload: any) => void
  onDelete?: (payload: any) => void
  enabled?: boolean
}

export function useRealtimeSubscription({
  table,
  filters = [],
  onInsert,
  onUpdate,
  onDelete,
  enabled = true
}: UseRealtimeSubscriptionProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!enabled) return

    // Create unique channel name
    const channelName = `${table}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    console.log(`📡 [REALTIME] Conectando ao canal: ${channelName}`)

    // Create channel
    const channel = supabase.channel(channelName)

    // Build filter string for Supabase
    let filterString = ''
    if (filters.length > 0) {
      const filterParts = filters.map(filter => `${filter.column}=${filter.operator}.${filter.value}`)
      filterString = filterParts.join(',')
    }

    // Setup subscription with filters
    let subscription = channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table,
        filter: filterString || undefined
      },
      (payload) => {
        console.log(`🔔 [REALTIME] Evento recebido:`, payload)

        switch (payload.eventType) {
          case 'INSERT':
            onInsert?.(payload)
            break
          case 'UPDATE':
            onUpdate?.(payload)
            break
          case 'DELETE':
            onDelete?.(payload)
            break
        }
      }
    )

    // Subscribe and handle connection
    channel
      .subscribe((status) => {
        console.log(`🔗 [REALTIME] Status da conexão: ${status}`)
        setIsConnected(status === 'SUBSCRIBED')
        
        if (status === 'CHANNEL_ERROR') {
          setError('Erro ao conectar com servidor real-time')
        } else if (status === 'TIMED_OUT') {
          setError('Timeout na conexão real-time')
        } else if (status === 'CLOSED') {
          setError('Conexão real-time fechada')
        } else {
          setError(null)
        }
      })

    channelRef.current = channel

    // Cleanup function
    return () => {
      console.log(`📡 [REALTIME] Desconectando do canal: ${channelName}`)
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
      setIsConnected(false)
    }
  }, [table, enabled, JSON.stringify(filters)])

  const reconnect = () => {
    console.log('🔄 [REALTIME] Tentando reconectar...')
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
    }
    setError(null)
    // The useEffect will handle reconnection
  }

  return {
    isConnected,
    error,
    reconnect
  }
}

// Hook específico para mensagens
export function useRealtimeMessages(conversationId: string, onNewMessage?: (message: any) => void) {
  return useRealtimeSubscription({
    table: 'messages',
    filters: [
      { column: 'conversation_id', operator: 'eq', value: conversationId }
    ],
    onInsert: onNewMessage,
    enabled: !!conversationId
  })
}

// Hook específico para agendamentos
export function useRealtimeAppointments(userId: string, userType: 'motorista' | 'oficina', onUpdate?: (appointment: any) => void) {
  const filterColumn = userType === 'motorista' ? 'user_id' : 'workshop_id'
  
  return useRealtimeSubscription({
    table: 'appointments',
    filters: [
      { column: filterColumn, operator: 'eq', value: userId }
    ],
    onUpdate,
    enabled: !!userId
  })
}

// Hook específico para notificações
export function useRealtimeNotifications(userId: string, onNewNotification?: (notification: any) => void) {
  return useRealtimeSubscription({
    table: 'notifications',
    filters: [
      { column: 'user_id', operator: 'eq', value: userId }
    ],
    onInsert: onNewNotification,
    enabled: !!userId
  })
}

// Hook específico para status de oficinas
export function useRealtimeWorkshopStatus(workshopId: string, onStatusChange?: (status: any) => void) {
  return useRealtimeSubscription({
    table: 'workshops',
    filters: [
      { column: 'id', operator: 'eq', value: workshopId }
    ],
    onUpdate: onStatusChange,
    enabled: !!workshopId
  })
}
