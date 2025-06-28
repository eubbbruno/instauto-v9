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

// Tipos para o banco de dados - Baseado nos scripts SQL
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
      drivers: {
        Row: {
          id: string
          profile_id: string
          cpf?: string
          birth_date?: string
          license_number?: string
          license_expiry?: string
          address?: Record<string, unknown>
          created_at: string
          updated_at: string
        }
        Insert: {
          profile_id: string
          cpf?: string
          birth_date?: string
          license_number?: string
          license_expiry?: string
          address?: Record<string, unknown>
        }
        Update: {
          cpf?: string
          birth_date?: string
          license_number?: string
          license_expiry?: string
          address?: any
        }
      }
      workshops: {
        Row: {
          id: string
          profile_id: string
          business_name: string
          cnpj?: string
          address?: any
          services: string[]
          specialties: string[]
          rating: number
          total_reviews: number
          verified: boolean
          opening_hours?: any
          price_range?: '$' | '$$' | '$$$'
          photos: string[]
          plan_type?: 'free' | 'pro'
          created_at: string
          updated_at: string
        }
        Insert: {
          profile_id: string
          business_name: string
          cnpj?: string
          address?: any
          services?: string[]
          specialties?: string[]
          opening_hours?: any
          price_range?: '$' | '$$' | '$$$'
          photos?: string[]
          plan_type?: 'free' | 'pro'
        }
        Update: {
          business_name?: string
          cnpj?: string
          address?: any
          services?: string[]
          specialties?: string[]
          opening_hours?: any
          price_range?: '$' | '$$' | '$$$'
          photos?: string[]
          plan_type?: 'free' | 'pro'
        }
      }
      vehicles: {
        Row: {
          id: string
          driver_id: string
          brand: string
          model: string
          year: number
          plate: string
          color?: string
          fuel_type?: string
          transmission?: string
          mileage?: number
          created_at: string
          updated_at: string
        }
        Insert: {
          driver_id: string
          brand: string
          model: string
          year: number
          plate: string
          color?: string
          fuel_type?: string
          transmission?: string
          mileage?: number
        }
        Update: {
          brand?: string
          model?: string
          year?: number
          plate?: string
          color?: string
          fuel_type?: string
          transmission?: string
          mileage?: number
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
          notes?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          driver_id: string
          workshop_id: string
          vehicle_id: string
          service_type: string
          description?: string
          scheduled_date: string
          scheduled_time: string
          status?: 'agendado' | 'confirmado' | 'em_andamento' | 'finalizado' | 'cancelado'
          price?: number
          notes?: string
        }
        Update: {
          service_type?: string
          description?: string
          scheduled_date?: string
          scheduled_time?: string
          status?: 'agendado' | 'confirmado' | 'em_andamento' | 'finalizado' | 'cancelado'
          price?: number
          notes?: string
        }
      }
      service_orders: {
        Row: {
          id: string
          appointment_id: string
          workshop_id: string
          driver_id: string
          vehicle_id: string
          services: Record<string, unknown>
          parts: Record<string, unknown>[]
          labor_cost: number
          parts_cost: number
          total_cost: number
          status: 'criada' | 'em_andamento' | 'aguardando_pecas' | 'finalizada' | 'cancelada'
          start_date?: string
          end_date?: string
          notes?: string
          created_at: string
          updated_at: string
        }
      }
      conversations: {
        Row: {
          id: string
          driver_id: string
          workshop_id: string
          appointment_id?: string
          last_message_at: string
          created_at: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string
          message_type: 'text' | 'image' | 'file' | 'system'
          read_at?: string
          created_at: string
        }
      }
      reviews: {
        Row: {
          id: string
          driver_id: string
          workshop_id: string
          appointment_id: string
          rating: number
          comment?: string
          response?: string
          response_date?: string
          created_at: string
        }
      }
      payments: {
        Row: {
          id: string
          appointment_id: string
          driver_id: string
          workshop_id: string
          amount: number
          payment_method: string
          payment_provider: string
          external_payment_id?: string
          status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'refunded'
          paid_at?: string
          created_at: string
        }
      }
    }
  }
}

// Tipos auxiliares para facilitar o uso
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Driver = Database['public']['Tables']['drivers']['Row']
export type Workshop = Database['public']['Tables']['workshops']['Row']
export type Vehicle = Database['public']['Tables']['vehicles']['Row']
export type Appointment = Database['public']['Tables']['appointments']['Row']
export type ServiceOrder = Database['public']['Tables']['service_orders']['Row']
export type Conversation = Database['public']['Tables']['conversations']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Payment = Database['public']['Tables']['payments']['Row']
