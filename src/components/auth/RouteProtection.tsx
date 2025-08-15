'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import LoadingSpinner from '@/components/LoadingSpinner'

interface RouteProtectionProps {
  children: React.ReactNode
  allowedUserTypes: ('motorista' | 'oficina' | 'admin')[]
  requiredPlan?: 'free' | 'pro'
  redirectTo?: string
}

export function RouteProtection({ 
  children, 
  allowedUserTypes, 
  requiredPlan,
  redirectTo = '/login' 
}: RouteProtectionProps) {
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    checkAccess()
  }, [])

  async function checkAccess() {
    try {
      // Verificar se usuário está logado
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        console.log('❌ [ROUTE_PROTECTION] Usuário não logado')
        window.location.href = redirectTo
        return
      }

      // Buscar perfil do usuário
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('type')
        .eq('id', user.id)
        .single()

      if (profileError || !profile) {
        console.error('❌ [ROUTE_PROTECTION] Erro ao buscar perfil:', profileError)
        alert('Erro ao verificar permissões. Faça login novamente.')
        window.location.href = '/login'
        return
      }

      // Verificar tipo do usuário
      if (!allowedUserTypes.includes(profile.type as any)) {
        console.log(`❌ [ROUTE_PROTECTION] Tipo ${profile.type} não permitido. Permitidos: ${allowedUserTypes.join(', ')}`)
        
        // Redirecionar para dashboard correto
        if (profile.type === 'motorista') {
          window.location.href = '/motorista'
        } else if (profile.type === 'admin') {
          window.location.href = '/admin'
        } else if (profile.type === 'oficina') {
          // Verificar plano da oficina
          const { data: workshop } = await supabase
            .from('workshops')
            .select('plan_type, is_trial, trial_ends_at')
            .eq('profile_id', user.id)
            .single()

          if (workshop?.plan_type === 'pro') {
            const isTrialActive = workshop.is_trial && workshop.trial_ends_at && 
              new Date(workshop.trial_ends_at) > new Date()
            
            if (isTrialActive || !workshop.is_trial) {
              window.location.href = '/oficina-pro'
            } else {
              window.location.href = '/oficina-free?trial_expired=true'
            }
          } else {
            window.location.href = '/oficina-free'
          }
        } else {
          window.location.href = '/'
        }
        return
      }

      // Se for oficina, verificar plano se necessário
      if (profile.type === 'oficina' && requiredPlan) {
        const { data: workshop } = await supabase
          .from('workshops')
          .select('plan_type, is_trial, trial_ends_at')
          .eq('profile_id', user.id)
          .single()

        if (!workshop) {
          console.log('❌ [ROUTE_PROTECTION] Workshop não encontrado')
          window.location.href = '/oficina-free'
          return
        }

        // Verificar plano específico
        if (requiredPlan === 'pro' && workshop.plan_type !== 'pro') {
          console.log('❌ [ROUTE_PROTECTION] Plano PRO necessário')
          window.location.href = '/oficina-free/upgrade'
          return
        }

        // Verificar se trial PRO ainda está ativo
        if (workshop.plan_type === 'pro' && workshop.is_trial) {
          const isTrialActive = workshop.trial_ends_at && 
            new Date(workshop.trial_ends_at) > new Date()
          
          if (!isTrialActive) {
            console.log('❌ [ROUTE_PROTECTION] Trial PRO expirado')
            window.location.href = '/oficina-free?trial_expired=true'
            return
          }
        }
      }

      console.log('✅ [ROUTE_PROTECTION] Acesso autorizado')
      setAuthorized(true)

    } catch (error) {
      console.error('❌ [ROUTE_PROTECTION] Erro:', error)
      window.location.href = '/login'
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-xl text-gray-600">🔐 Verificando permissões...</p>
        </div>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">❌ Acesso negado</p>
          <p className="text-gray-600 mb-4">Você não tem permissão para acessar esta página.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Voltar ao Login
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
