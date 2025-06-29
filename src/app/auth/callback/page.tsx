'use client'

import { useEffect, useState, Suspense } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'

function AuthCallbackContent() {
  const [status, setStatus] = useState('🔄 Processando login...')
  const router = useRouter()
  const searchParams = useSearchParams()

  // Função para redirecionar baseado no tipo de usuário - igual à página de auth
  const redirectUserByType = (userType: string, planType?: string, needsProfileCompletion?: boolean) => {
    // Se precisa completar perfil após OAuth, redireciona para página de perfil
    if (needsProfileCompletion) {
      if (userType === 'motorista') {
        router.push('/auth/motorista?step=profile&oauth=true')
      } else if (userType === 'oficina') {
        router.push('/auth/oficina?step=profile&oauth=true')
      }
      return
    }

    // Fluxo normal após perfil completo
    if (userType === 'motorista') {
      router.push('/motorista')
    } else if (userType === 'oficina') {
      // Se tem plano PRO vai para dashboard completo, senão vai para básico
      if (planType === 'pro') {
        router.push('/dashboard')
      } else {
        router.push('/oficina-basica')
      }
    } else {
      // Fallback: se não conseguir determinar o tipo, vai para motorista
      router.push('/motorista')
    }
  }

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        if (!isSupabaseConfigured() || !supabase) {
          setStatus('❌ Supabase não configurado')
          setTimeout(() => {
            router.push('/auth')
          }, 3000)
          return
        }

        // Verificar se há um código de autorização na URL
        const code = searchParams.get('code')
        if (code) {
          setStatus('🔄 Processando código de autorização...')
          
          const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (sessionError) {
            console.error('Erro ao trocar código por sessão:', sessionError)
            setStatus(`❌ Erro: ${sessionError.message}`)
            setTimeout(() => {
              router.push('/auth')
            }, 3000)
            return
          }

          if (sessionData.session && sessionData.session.user) {
            setStatus('✅ Login realizado com sucesso!')
            
            // Buscar perfil do usuário para redirecionamento correto
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('type, plan_type')
              .eq('id', sessionData.session.user.id)
              .single()

            if (profileError) {
              console.warn('Perfil não encontrado, precisa completar:', profileError)
              const userType = sessionData.session.user.user_metadata?.type || 'motorista'
              
              setTimeout(() => {
                redirectUserByType(userType, undefined, true) // needsProfileCompletion = true
              }, 2000)
            } else {
              // Verificar se perfil está completo
              const isProfileComplete = profile.type && (
                profile.type === 'motorista' ? true : // Motorista: só precisa de type
                (profile.type === 'oficina' && profile.plan_type) // Oficina: precisa de type e plan_type
              )
              
              if (!isProfileComplete) {
                setTimeout(() => {
                  redirectUserByType(profile.type, profile.plan_type, true) // needsProfileCompletion = true
                }, 2000)
              } else {
                setTimeout(() => {
                  redirectUserByType(profile.type, profile.plan_type, false) // Profile completo
                }, 2000)
              }
            }
            return
          }
        }

        // Se não há código, verificar se já há uma sessão ativa
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Erro ao obter sessão:', error)
          setStatus(`❌ Erro: ${error.message}`)
          setTimeout(() => {
            router.push('/auth')
          }, 3000)
          return
        }

        if (data.session && data.session.user) {
          setStatus('✅ Login realizado com sucesso!')
          
          // Buscar perfil do usuário
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('type, plan_type')
            .eq('id', data.session.user.id)
            .single()

          if (profileError) {
            console.warn('Perfil não encontrado, precisa completar:', profileError)
            const userType = data.session.user.user_metadata?.type || 'motorista'
            
            setTimeout(() => {
              redirectUserByType(userType, undefined, true) // needsProfileCompletion = true
            }, 2000)
          } else {
            // Verificar se perfil está completo
            const isProfileComplete = profile.type && (
              profile.type === 'motorista' ? true : // Motorista: só precisa de type
              (profile.type === 'oficina' && profile.plan_type) // Oficina: precisa de type e plan_type
            )
            
            if (!isProfileComplete) {
              setTimeout(() => {
                redirectUserByType(profile.type, profile.plan_type, true) // needsProfileCompletion = true
              }, 2000)
            } else {
              setTimeout(() => {
                redirectUserByType(profile.type, profile.plan_type, false) // Profile completo
              }, 2000)
            }
          }
          return
        }
        
        // Se chegou até aqui, não há sessão válida
        setStatus('❌ Nenhuma sessão válida encontrada')
        setTimeout(() => {
          router.push('/auth')
        }, 3000)

      } catch (error) {
        console.error('Erro no callback:', error)
        setStatus(`❌ Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
        
        setTimeout(() => {
          router.push('/auth')
        }, 3000)
      }
    }

    handleAuthCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
        <div className="text-6xl mb-4">🚗</div>
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Instauto</h1>
        <div className="text-lg mb-4 text-gray-700">{status}</div>
        
        {status.includes('sucesso') && (
          <div className="text-sm text-gray-600">
            Redirecionando para seu dashboard...
          </div>
        )}
        
        {status.includes('❌') && (
          <div className="text-sm text-gray-600">
            Redirecionando para login...
          </div>
        )}

        {status.includes('🔄') && (
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
        <div className="text-6xl mb-4">🚗</div>
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Instauto</h1>
        <div className="text-lg mb-4 text-gray-700">🔄 Carregando...</div>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthCallbackContent />
    </Suspense>
  )
}
