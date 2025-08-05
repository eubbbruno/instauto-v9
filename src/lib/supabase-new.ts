import { createClient } from '@supabase/supabase-js';

// ✨ NOVA CONEXÃO SUPABASE - USANDO MESMA CONFIG QUE FUNCIONA NO TEST-AUTH
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos básicos para o novo sistema
export interface User {
  id: string;
  email: string;
  name: string;
  type: 'motorista' | 'oficina';
  planType?: 'free' | 'pro';
  avatar?: string;
}

export interface Profile {
  id: string;
  email: string;
  name: string;
  type: 'motorista' | 'oficina';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Workshop {
  id: string;
  profile_id: string;
  plan_type: 'free' | 'pro';
  business_name: string;
  verified: boolean;
}

export interface Driver {
  id: string;
  profile_id: string;
  created_at: string;
}