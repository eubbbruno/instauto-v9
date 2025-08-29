import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface User {
  id: string
  email: string
}

interface Profile {
  id: string
  name: string
  email: string
  type: string
  avatar_url?: string
}

export function useMotoristaAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      setLoading(true)
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session?.user) {
        setLoading(false)
        return
      }

      setUser({
        id: session.user.id,
        email: session.user.email || ''
      })

      // Buscar perfil
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (profileData && !profileError) {
        setProfile(profileData)
      }

    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      window.location.href = '/login'
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const refreshProfile = async () => {
    if (!user) return

    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileData && !error) {
        setProfile(profileData)
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
    }
  }

  return {
    user,
    profile,
    loading,
    logout,
    refreshProfile
  }
}