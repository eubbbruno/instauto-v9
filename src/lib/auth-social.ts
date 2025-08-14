import { supabase } from './supabase'
import type { Provider } from '@supabase/supabase-js'

export interface SocialAuthOptions {
  provider: Provider
  userType?: 'motorista' | 'oficina'
  oficinaPlano?: 'free' | 'pro'
  returnUrl?: string
}

export class SocialAuthManager {
  /**
   * Inicia o processo de autenticação social
   */
  static async signInWithProvider(options: SocialAuthOptions) {
    const { provider, userType, oficinaPlano, returnUrl } = options
    
    try {
      // Construir URL de redirecionamento com parâmetros
      const redirectTo = new URL(`${window.location.origin}/auth/callback`)
      
      if (userType) redirectTo.searchParams.set('type', userType)
      if (oficinaPlano) redirectTo.searchParams.set('plan', oficinaPlano)
      if (returnUrl) redirectTo.searchParams.set('return_url', returnUrl)
      
      console.log('🔐 Iniciando OAuth:', { provider, redirectTo: redirectTo.toString() })
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectTo.toString(),
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })
      
      if (error) {
        console.error('❌ Erro OAuth:', error)
        throw error
      }
      
      return data
      
    } catch (error) {
      console.error('❌ Erro ao iniciar OAuth:', error)
      throw error
    }
  }
  
  /**
   * Processa o callback do OAuth e cria o perfil do usuário
   */
  static async handleOAuthCallback(
    user: any,
    userType?: string,
    oficinaPlano?: string
  ) {
    if (!user) return null
    
    try {
      console.log('👤 Processando callback OAuth:', { userId: user.id, userType, oficinaPlano })
      
      // Verificar se já existe profile
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (existingProfile) {
        console.log('✅ Profile já existe:', existingProfile)
        return existingProfile
      }
      
      // Criar novo profile
      const profileData = {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
        avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
        type: userType || 'motorista',
        provider: user.app_metadata?.provider || 'email',
        created_at: new Date().toISOString()
      }
      
      const { data: newProfile, error: profileError } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single()
      
      if (profileError) {
        console.error('❌ Erro ao criar profile:', profileError)
        throw profileError
      }
      
      console.log('✅ Profile criado:', newProfile)
      
      // Se for oficina, criar workshop
      if (userType === 'oficina') {
        const workshopData: any = {
          id: user.id,
          name: profileData.name + ' - Oficina',
          plan_type: oficinaPlano || 'free',
          created_at: new Date().toISOString()
        }

        // Se for plano PRO, adicionar trial de 7 dias
        if (oficinaPlano === 'pro') {
          const trialEndDate = new Date()
          trialEndDate.setDate(trialEndDate.getDate() + 7)
          workshopData.trial_ends_at = trialEndDate.toISOString()
          workshopData.is_trial = true
        }
        
        const { error: workshopError } = await supabase
          .from('workshops')
          .insert(workshopData)
        
        if (workshopError) {
          console.error('❌ Erro ao criar workshop:', workshopError)
          // Não falhar se der erro no workshop, profile já foi criado
        } else {
          console.log('✅ Workshop criado para oficina')
        }
      }
      
      return newProfile
      
    } catch (error) {
      console.error('❌ Erro ao processar callback:', error)
      throw error
    }
  }
  
  /**
   * Determina o redirecionamento após login social
   */
  static getRedirectUrl(profile: any, returnUrl?: string): string {
    if (returnUrl) {
      return returnUrl
    }
    
    if (profile.type === 'motorista') {
      return '/motorista'
    }
    
    if (profile.type === 'oficina') {
      // Buscar plano da oficina seria ideal, mas por simplicidade:
      return '/oficina-free' // Padrão, depois ajustamos no callback
    }
    
    return '/dashboard'
  }
}

// Configurações dos providers
export const SOCIAL_PROVIDERS = {
  google: {
    name: 'Google',
    icon: '🔍',
    color: 'bg-red-500 hover:bg-red-600',
    textColor: 'text-white'
  },
  facebook: {
    name: 'Facebook', 
    icon: '📘',
    color: 'bg-blue-600 hover:bg-blue-700',
    textColor: 'text-white'
  }
} as const
