'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface UseMotoristaAuthReturn {
  user: any
  profile: any
  loading: boolean
  error: string | null
  logout: () => Promise<void>
}

export function useMotoristaAuth(): UseMotoristaAuthReturn {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      setLoading(true)
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        window.location.href = '/login'
        return
      }

      setUser(user)

      // Buscar perfil do usuário
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError)
        setError('Erro ao carregar perfil do usuário')
      } else {
        setProfile(profile)
      }
    } catch (error) {
      console.error('Erro ao verificar usuário:', error)
      setError('Erro de autenticação')
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      window.location.href = '/login'
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  return {
    user,
    profile,
    loading,
    error,
    logout
  }
}

// Hook para sidebar props
export function useMotoristasidebar() {
  const { user, profile, logout } = useMotoristaAuth()

  return {
    userType: 'motorista' as const,
    userName: profile?.name || user?.email?.split('@')[0] || 'Motorista',
    userEmail: user?.email || 'email@email.com',
    onLogout: logout
  }
}
