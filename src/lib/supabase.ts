import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente para server-side
export const createServerClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
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