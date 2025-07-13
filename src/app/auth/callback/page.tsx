'use client'

import { useEffect, useState, Suspense } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'

function AuthCallbackContent() {
  const [status, setStatus] = useState('🔄 Processando login...')
  const router = useRouter()
  const searchParams = useSearchParams()

  // Função para redirecionar baseado no tipo de usuário - SUPER ROBUSTA
  const redirectUserByType = (userType: string, planType?: string) => {
    console.log('🔄 [CALLBACK] Redirecionando usuário:', { userType, planType })
    
    if (userType === 'motorista') {
      console.log('→ [CALLBACK] Redirecionando motorista para /motorista')
      router.push('/motorista')
    } else if (userType === 'oficina') {
      // Para oficinas, verificar o plano
      if (planType === 'pro') {
        console.log('→ [CALLBACK] Redirecionando oficina PRO para /dashboard')
        router.push('/dashboard')
      } else {
        console.log('→ [CALLBACK] Redirecionando oficina FREE para /oficina-basica')
        router.push('/oficina-basica')
      }
    } else {
      // Fallback: se não conseguir determinar o tipo, vai para página de seleção
      console.log('⚠️ [CALLBACK] Tipo não identificado, redirecionando para /auth')
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

        // PRIORIDADE 1: Verificar query params da URL PRIMEIRO
        const urlParams = new URLSearchParams(window.location.search)
        const typeFromUrl = urlParams.get('type')
        const planFromUrl = urlParams.get('plan_type')
        
        console.log('🔍 [CALLBACK] Query params da URL:', { typeFromUrl, planFromUrl })

        // Verificar se há um código de autorização na URL
        const code = searchParams.get('code')
        if (code) {
          setStatus('🔄 Processando código de autorização...')
          
          const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (sessionError) {
            console.error('❌ [CALLBACK] Erro ao trocar código por sessão:', sessionError)
            setStatus(`❌ Erro: ${sessionError.message}`)
            setTimeout(() => {
              router.push('/auth')
            }, 3000)
            return
          }

          if (sessionData.session && sessionData.session.user) {
            setStatus('✅ Login realizado com sucesso!')
            console.log('✅ [CALLBACK] Sessão criada para usuário:', sessionData.session.user.id)
            
            // ESTRATÉGIA SUPER ROBUSTA: Priorizar query params da URL
            let userType = typeFromUrl || 'motorista' // URL tem prioridade
            let planType = planFromUrl || 'free' // URL tem prioridade
            
            console.log('🎯 [CALLBACK] Tipos iniciais (da URL):', { userType, planType })
            
            // Se não veio da URL, tentar buscar do banco
            if (!typeFromUrl) {
              console.log('🔍 [CALLBACK] Buscando tipo no banco...')
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('type')
                .eq('id', sessionData.session.user.id)
                .single()

              if (profile && !profileError) {
                userType = profile.type
                console.log('✅ [CALLBACK] Tipo encontrado no perfil:', userType)
                
                // Se é oficina, buscar o plano
                if (userType === 'oficina' && !planFromUrl) {
                  const { data: workshop, error: workshopError } = await supabase
                    .from('workshops')
                    .select('plan_type')
                    .eq('profile_id', sessionData.session.user.id)
                    .single()
                  
                  if (workshop && !workshopError) {
                    planType = workshop.plan_type || 'free'
                    console.log('✅ [CALLBACK] Plano encontrado na oficina:', planType)
                  }
                }
              } else {
                console.warn('⚠️ [CALLBACK] Perfil não encontrado, usando metadados')
                
                // Fallback final: usar metadados do usuário
                const metadata = sessionData.session.user.user_metadata || {}
                userType = metadata.type || 'motorista'
                planType = metadata.plan_type || 'free'
                
                console.log('⚠️ [CALLBACK] Usando metadados:', { userType, planType, metadata })
              }
            }
            
            console.log('🎯 [CALLBACK] Tipos finais para redirecionamento:', { userType, planType })
            
            // Aguardar um pouco para o banco processar e redirecionar
            setTimeout(() => {
              redirectUserByType(userType, planType)
            }, 1000) // Reduzido de 1500ms para 1000ms
            return
          }
        }

        // Se não há código, verificar se já há uma sessão ativa
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ [CALLBACK] Erro ao obter sessão:', error)
          setStatus(`❌ Erro: ${error.message}`)
          setTimeout(() => {
            router.push('/auth')
          }, 3000)
          return
        }

        if (data.session && data.session.user) {
          setStatus('✅ Login realizado com sucesso!')
          console.log('✅ [CALLBACK] Sessão ativa encontrada:', data.session.user.id)
          
          // Para sessão existente, usar a mesma lógica robusta
          let userType = typeFromUrl || 'motorista'
          let planType = planFromUrl || 'free'
          
          if (!typeFromUrl) {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('type')
              .eq('id', data.session.user.id)
              .single()

            if (profile && !profileError) {
              userType = profile.type
              
              if (userType === 'oficina' && !planFromUrl) {
                const { data: workshop } = await supabase
                  .from('workshops')
                  .select('plan_type')
                  .eq('profile_id', data.session.user.id)
                  .single()
                
                planType = workshop?.plan_type || 'free'
              }
            } else {
              const metadata = data.session.user.user_metadata || {}
              userType = metadata.type || 'motorista'
              planType = metadata.plan_type || 'free'
            }
          }
          
          setTimeout(() => {
            redirectUserByType(userType, planType)
          }, 1000)
        } else {
          setStatus('❌ Nenhuma sessão encontrada')
          setTimeout(() => {
            router.push('/auth')
          }, 3000)
        }
      } catch (error) {
        console.error('❌ [CALLBACK] Erro geral:', error)
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
