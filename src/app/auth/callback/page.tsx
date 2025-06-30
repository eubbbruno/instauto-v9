'use client'

import { useEffect, useState, Suspense } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'

function AuthCallbackContent() {
  const [status, setStatus] = useState('🔄 Processando login...')
  const router = useRouter()
  const searchParams = useSearchParams()

  // Função para redirecionar baseado no tipo de usuário - MELHORADA
  const redirectUserByType = (userType: string, planType?: string, needsProfileCompletion?: boolean) => {
    console.log('🔄 Redirecionando usuário:', { userType, planType, needsProfileCompletion })
    
    // Se precisa completar perfil após OAuth, redireciona para página de perfil
    if (needsProfileCompletion) {
      if (userType === 'motorista') {
        console.log('→ Redirecionando para completar perfil motorista')
        router.push('/auth/motorista?step=profile&oauth=true')
      } else if (userType === 'oficina') {
        console.log('→ Redirecionando para completar perfil oficina')
        router.push('/auth/oficina?step=profile&oauth=true')
      }
      return
    }

    // Fluxo normal após perfil completo
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
              console.warn('Perfil não encontrado, criando baseado nos metadados:', profileError)
              // Pegar tipo dos query params do OAuth ou metadata
              const urlParams = new URLSearchParams(window.location.search)
              const typeFromUrl = urlParams.get('type')
              const userType = typeFromUrl || sessionData.session.user.user_metadata?.type || 'motorista'
              
              console.log('Criando perfil para tipo:', userType)
              
              // Criar perfil básico primeiro
              const { error: createProfileError } = await supabase.from('profiles').upsert({
                id: sessionData.session.user.id,
                email: sessionData.session.user.email,
                name: sessionData.session.user.user_metadata?.name || sessionData.session.user.user_metadata?.full_name || '',
                type: userType,
                updated_at: new Date().toISOString()
              })
              
              if (createProfileError) {
                console.error('Erro ao criar perfil:', createProfileError)
              }
              
              setTimeout(() => {
                redirectUserByType(userType, undefined, true) // needsProfileCompletion = true
              }, 2000)
            } else {
              let planType = undefined
              let isProfileComplete = false
              
              // Verificar se os dados específicos estão completos
              if (profile.type === 'motorista') {
                // Para motorista: verificar se existe registro na tabela drivers com CPF
                const { data: driver } = await supabase
                  .from('drivers')
                  .select('cpf')
                  .eq('profile_id', sessionData.session.user.id)
                  .single()
                
                isProfileComplete = !!(driver && driver.cpf && driver.cpf.trim())
              } else if (profile.type === 'oficina') {
                // Para oficina: verificar se existe registro na tabela workshops completo
                const { data: workshop } = await supabase
                  .from('workshops')
                  .select('plan_type, business_name, cnpj')
                  .eq('profile_id', sessionData.session.user.id)
                  .single()
                
                planType = workshop?.plan_type
                isProfileComplete = !!(workshop && workshop.plan_type && workshop.business_name && workshop.cnpj && workshop.cnpj.trim())
              }
              
              if (!isProfileComplete) {
                setTimeout(() => {
                  redirectUserByType(profile.type, planType, true) // needsProfileCompletion = true
                }, 2000)
              } else {
                setTimeout(() => {
                  redirectUserByType(profile.type, planType, false) // Profile completo
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
            .select('type')
            .eq('id', data.session.user.id)
            .single()

          if (profileError) {
            console.warn('Perfil não encontrado, criando baseado nos metadados (segunda checagem):', profileError)
            // Pegar tipo dos query params do OAuth ou metadata
            const urlParams = new URLSearchParams(window.location.search)
            const typeFromUrl = urlParams.get('type')
            const userType = typeFromUrl || data.session.user.user_metadata?.type || 'motorista'
            
            console.log('Criando perfil para tipo (segunda checagem):', userType)
            
            // Criar perfil básico primeiro
            const { error: createProfileError } = await supabase.from('profiles').upsert({
              id: data.session.user.id,
              email: data.session.user.email,
              name: data.session.user.user_metadata?.name || data.session.user.user_metadata?.full_name || '',
              type: userType,
              updated_at: new Date().toISOString()
            })
            
            if (createProfileError) {
              console.error('Erro ao criar perfil (segunda checagem):', createProfileError)
            }
            
            setTimeout(() => {
              redirectUserByType(userType, undefined, true) // needsProfileCompletion = true
            }, 2000)
          } else {
            let planType = undefined
            let isProfileComplete = false
            
            // Verificar se os dados específicos estão completos
            if (profile.type === 'motorista') {
              // Para motorista: verificar se existe registro na tabela drivers com CPF
              const { data: driver } = await supabase
                .from('drivers')
                .select('cpf')
                .eq('profile_id', data.session.user.id)
                .single()
              
              isProfileComplete = !!(driver && driver.cpf && driver.cpf.trim())
            } else if (profile.type === 'oficina') {
              // Para oficina: verificar se existe registro na tabela workshops completo
              const { data: workshop } = await supabase
                .from('workshops')
                .select('plan_type, business_name, cnpj')
                .eq('profile_id', data.session.user.id)
                .single()
              
              planType = workshop?.plan_type
              isProfileComplete = !!(workshop && workshop.plan_type && workshop.business_name && workshop.cnpj && workshop.cnpj.trim())
            }
            
            if (!isProfileComplete) {
              setTimeout(() => {
                redirectUserByType(profile.type, planType, true) // needsProfileCompletion = true
              }, 2000)
            } else {
              setTimeout(() => {
                redirectUserByType(profile.type, planType, false) // Profile completo
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
