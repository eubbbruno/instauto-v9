'use client'
import { useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { SkeletonDashboard } from '@/components/ui/SkeletonLoader'

interface RouteGuardProps {
  children: ReactNode
  allowedUserTypes: ('motorista' | 'oficina' | 'admin')[]
  redirectTo?: string
  showLoading?: boolean
}

interface User {
  id: string
  email: string
  type: 'motorista' | 'oficina' | 'admin'
  plan_type?: 'free' | 'pro'
}

export default function RouteGuard({ 
  children, 
  allowedUserTypes, 
  redirectTo = '/login',
  showLoading = true 
}: RouteGuardProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAccess()
  }, [])

  const checkAccess = async () => {
    try {
      setLoading(true)
      
      // 1. Verificar se há usuário autenticado
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session?.user) {
        console.log('❌ [RouteGuard] Sem sessão válida')
        router.push(redirectTo)
        return
      }

      // 2. Buscar perfil do usuário
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (profileError || !profile) {
        console.log('❌ [RouteGuard] Perfil não encontrado')
        router.push(redirectTo)
        return
      }

      // 3. Para oficinas, buscar dados adicionais
      let planType = undefined
      if (profile.type === 'oficina') {
        const { data: workshop } = await supabase
          .from('workshops')
          .select('plan_type')
          .eq('profile_id', profile.id)
          .single()
        
        planType = workshop?.plan_type || 'free'
      }

      const userData: User = {
        id: profile.id,
        email: profile.email,
        type: profile.type,
        plan_type: planType
      }

      setUser(userData)

      // 4. Verificar autorização
      const hasAccess = checkUserAccess(userData, allowedUserTypes)
      
      if (!hasAccess) {
        console.log('❌ [RouteGuard] Acesso negado para tipo:', profile.type)
        redirectToCorrectDashboard(userData)
        return
      }

      console.log('✅ [RouteGuard] Acesso autorizado para:', profile.type)
      setIsAuthorized(true)

    } catch (error) {
      console.error('❌ [RouteGuard] Erro na verificação:', error)
      router.push(redirectTo)
    } finally {
      setLoading(false)
    }
  }

  const checkUserAccess = (user: User, allowedTypes: string[]): boolean => {
    // Verificar tipo básico
    if (allowedTypes.includes(user.type)) {
      return true
    }

    // Verificar tipos específicos de oficina
    if (user.type === 'oficina') {
      if (allowedTypes.includes('oficina-free') && user.plan_type === 'free') {
        return true
      }
      if (allowedTypes.includes('oficina-pro') && user.plan_type === 'pro') {
        return true
      }
    }

    return false
  }

  const redirectToCorrectDashboard = (user: User) => {
    switch (user.type) {
      case 'admin':
        router.push('/admin')
        break
      case 'motorista':
        router.push('/motorista')
        break
      case 'oficina':
        if (user.plan_type === 'pro') {
          router.push('/oficina-pro')
        } else {
          router.push('/oficina-free')
        }
        break
      default:
        router.push('/login')
    }
  }

  if (loading && showLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}

// Hook para verificar permissões em componentes
export function useRouteAccess() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.user) {
        setLoading(false)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (profile) {
        let planType = undefined
        if (profile.type === 'oficina') {
          const { data: workshop } = await supabase
            .from('workshops')
            .select('plan_type')
            .eq('profile_id', profile.id)
            .single()
          
          planType = workshop?.plan_type || 'free'
        }

        setUser({
          id: profile.id,
          email: profile.email,
          type: profile.type,
          plan_type: planType
        })
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error)
    } finally {
      setLoading(false)
    }
  }

  const hasAccess = (allowedTypes: string[]): boolean => {
    if (!user) return false
    
    if (allowedTypes.includes(user.type)) {
      return true
    }

    if (user.type === 'oficina') {
      if (allowedTypes.includes('oficina-free') && user.plan_type === 'free') {
        return true
      }
      if (allowedTypes.includes('oficina-pro') && user.plan_type === 'pro') {
        return true
      }
    }

    return false
  }

  const isAdmin = user?.type === 'admin'
  const isMotorista = user?.type === 'motorista'
  const isOficinaFree = user?.type === 'oficina' && user?.plan_type === 'free'
  const isOficinaPro = user?.type === 'oficina' && user?.plan_type === 'pro'

  return {
    user,
    loading,
    hasAccess,
    isAdmin,
    isMotorista,
    isOficinaFree,
    isOficinaPro
  }
}
