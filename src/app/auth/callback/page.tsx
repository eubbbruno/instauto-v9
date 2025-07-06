'use client'

import { useEffect, useState, Suspense } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'

function AuthCallbackContent() {
  const [status, setStatus] = useState('🔄 Processando login...')
  const router = useRouter()
  const searchParams = useSearchParams()

  // Função para redirecionar baseado no tipo de usuário - SIMPLIFICADA
  const redirectUserByType = (userType: string, planType?: string) => {
    console.log('🔄 Redirecionando usuário:', { userType, planType })
    
    if (userType === 'motorista') {
      console.log('→ Redirecionando motorista para dashboard')
      router.push('/motorista')
    } else if (userType === 'oficina') {
      // Se tem plano PRO vai para dashboard completo, senão vai para básico
      if (planType === 'pro') {
        console.log('→ Redirecionando oficina PRO para dashboard')
        router.push('/dashboard')
      } else {
        console.log('→ Redirecionando oficina FREE para oficina-basica')
        router.push('/oficina-basica')
      }
    } else {
      // Fallback: se não conseguir determinar o tipo, vai para página de seleção
      console.log('⚠️ Tipo não identificado, redirecionando para auth')
      router.push('/auth')
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
              .select('type')
              .eq('id', sessionData.session.user.id)
              .single()

            if (profileError) {
              console.warn('Perfil não encontrado, usando tipo dos parâmetros:', profileError)
                          // Pegar tipo e plano dos query params do OAuth
            const urlParams = new URLSearchParams(window.location.search)
            const typeFromUrl = urlParams.get('type')
            const planFromUrl = urlParams.get('plan_type')
            const userType = typeFromUrl || sessionData.session.user.user_metadata?.type || 'motorista'
            const planType = planFromUrl || sessionData.session.user.user_metadata?.plan_type || 'free'
            
            console.log('Redirecionando baseado no tipo e plano:', { userType, planType })
            setTimeout(() => {
              redirectUserByType(userType, planType)
            }, 2000)
            } else {
              let planType = undefined
              
              // Para oficinas, verificar plano
              if (profile.type === 'oficina') {
                const { data: workshop } = await supabase
                  .from('workshops')
                  .select('plan_type')
                  .eq('profile_id', sessionData.session.user.id)
                  .single()
                
                planType = workshop?.plan_type || 'free'
              }
              
              setTimeout(() => {
                redirectUserByType(profile.type, planType)
              }, 2000)
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
            .select('type')
            .eq('id', data.session.user.id)
            .single()

          if (profileError) {
            console.warn('Perfil não encontrado, usando tipo padrão:', profileError)
            const urlParams = new URLSearchParams(window.location.search)
            const typeFromUrl = urlParams.get('type')
            const planFromUrl = urlParams.get('plan_type')
            const userType = typeFromUrl || data.session.user.user_metadata?.type || 'motorista'
            const planType = planFromUrl || data.session.user.user_metadata?.plan_type || 'free'
            
            setTimeout(() => {
              redirectUserByType(userType, planType)
            }, 2000)
          } else {
            let planType = undefined
            
            // Para oficinas, verificar plano
            if (profile.type === 'oficina') {
              const { data: workshop } = await supabase
                .from('workshops')
                .select('plan_type')
                .eq('profile_id', data.session.user.id)
                .single()
              
              planType = workshop?.plan_type || 'free'
            }
            
            setTimeout(() => {
              redirectUserByType(profile.type, planType)
            }, 2000)
          }
        } else {
          setStatus('❌ Nenhuma sessão encontrada')
          setTimeout(() => {
            router.push('/auth')
          }, 3000)
        }
      } catch (error) {
        console.error('Erro geral no callback:', error)
        setStatus(`❌ Erro inesperado: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
        setTimeout(() => {
          router.push('/auth')
        }, 3000)
      }
    }

    handleAuthCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="text-6xl mb-4">
            {status.includes('✅') ? '🎉' : status.includes('❌') ? '😞' : '⏳'}
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {status.includes('✅') ? 'Sucesso!' : status.includes('❌') ? 'Ops!' : 'Aguarde...'}
          </h1>
          
          <p className={`text-lg font-semibold mb-6 ${
            status.includes('✅') ? 'text-green-600' : 
            status.includes('❌') ? 'text-red-600' : 
            'text-blue-600'
          }`}>
            {status}
          </p>
          
          {status.includes('✅') && (
            <div className="space-y-2 text-sm text-gray-600">
              <p>🔄 Redirecionando para seu dashboard...</p>
              <p>Se não for redirecionado automaticamente, <a href="/auth" className="text-blue-600 hover:text-blue-800 font-semibold">clique aqui</a></p>
            </div>
          )}
          
          {status.includes('❌') && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Algo deu errado durante o login. Você será redirecionado para tentar novamente.
              </p>
              <a 
                href="/auth" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Tentar Novamente
              </a>
            </div>
          )}
          
          {status.includes('🔄') && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
        <div className="text-6xl mb-4">⏳</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Carregando...</h1>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
