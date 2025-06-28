import { createClient } from '@supabase/supabase-js'

// Verificar se as variáveis de ambiente estão disponíveis
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Criar cliente apenas se as variáveis estiverem disponíveis
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Cliente para server-side
export const createServerClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  
  if (!supabaseUrl || !serviceRoleKey) {
    return null
  }
  
  return createClient(supabaseUrl, serviceRoleKey)
}

// Função para verificar se o Supabase está configurado
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Tipos para o banco de dados
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          type: 'motorista' | 'oficina'
          phone?: string
          avatar_url?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          type: 'motorista' | 'oficina'
          phone?: string
          avatar_url?: string
        }
        Update: {
          name?: string
          phone?: string
          avatar_url?: string
        }
      }
      workshops: {
        Row: {
          id: string
          profile_id: string
          business_name: string
          cnpj?: string
          address: any
          services: string[]
          specialties: string[]
          rating: number
          total_reviews: number
          verified: boolean
          opening_hours?: any
          price_range?: '$' | '$$' | '$$$'
          created_at: string
        }
      }
      appointments: {
        Row: {
          id: string
          driver_id: string
          workshop_id: string
          vehicle_id: string
          service_type: string
          description?: string
          scheduled_date: string
          scheduled_time: string
          status: 'agendado' | 'confirmado' | 'em_andamento' | 'finalizado' | 'cancelado'
          price?: number
          created_at: string
        }
      }
    }
  }
}
