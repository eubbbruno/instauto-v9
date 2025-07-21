'use client'

import { useEffect, useState, Suspense } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'

function AuthCallbackContent() {
  const [status, setStatus] = useState('🔄 Processando login...')
  const router = useRouter()
  const searchParams = useSearchParams()

  // Função para redirecionar - ULTRA SIMPLES
  const redirectUserByType = async (userType: string, planType?: string) => {
    console.log('🔵 [CALLBACK] Callback iniciado');
    console.log('Session check iniciando...');
    console.log('User type:', userType);
    console.log('Plan type:', planType);
    
    // Verificar se a sessão está sendo salva no cliente
    if (supabase) {
      const { data: { session: clientSession } } = await supabase.auth.getSession();
      console.log('🟢 Session no cliente após callback:', clientSession);
    }
    
    // Force um delay para ver se é race condition
    console.log('⏳ Aguardando 1 segundo para debug...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('🔄 [CALLBACK] Redirecionando usuário:', { userType, planType })
    
    let redirectUrl = '/auth'; // fallback
    
    if (userType === 'motorista') {
      redirectUrl = '/motorista';
      console.log('→ [CALLBACK] Redirecionando motorista para /motorista')
    } else if (userType === 'oficina') {
      // CORREÇÃO CLAUDE WEB: Redirecionamento baseado no plano
      if (planType === 'pro') {
        redirectUrl = '/dashboard';
        console.log('→ [CALLBACK] Redirecionando oficina PRO para /dashboard')
      } else {
        redirectUrl = '/oficina-basica';
        console.log('→ [CALLBACK] Redirecionando oficina FREE para /oficina-basica')
      }
    } else {
      console.log('⚠️ [CALLBACK] Tipo não identificado, redirecionando para /auth')
    }
    
    console.log('Redirect URL:', redirectUrl);
    
    // ✅ Use window.location.href em vez de router.push()
    window.location.href = redirectUrl;
  }

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🚀 [CALLBACK] Iniciando processo...')
        
        if (!isSupabaseConfigured() || !supabase) {
          setStatus('❌ Supabase não configurado')
          setTimeout(() => window.location.href = '/auth', 3000)
          return
        }

        // PRIMEIRA COISA: Capturar query params da URL
        const urlParams = new URLSearchParams(window.location.search)
        const typeFromUrl = urlParams.get('type')
        const planFromUrl = urlParams.get('plan_type')
        
        console.log('🔍 [CALLBACK] Query params capturados:', { 
          typeFromUrl, 
          planFromUrl,
          fullUrl: window.location.href 
        })

        // Verificar se há código de autorização
        const code = searchParams.get('code')
        
        if (code) {
          console.log('🔑 [CALLBACK] Código OAuth encontrado, processando...')
          setStatus('🔄 Processando código de autorização...')
          
          const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (sessionError) {
            console.error('❌ [CALLBACK] Erro ao trocar código por sessão:', sessionError)
            setStatus(`❌ Erro: ${sessionError.message}`)
            setTimeout(() => window.location.href = '/auth', 3000)
            return
          }

          if (sessionData.session && sessionData.session.user) {
            console.log('✅ [CALLBACK] Sessão criada com sucesso!')
            setStatus('✅ Login realizado com sucesso!')
            
            // SOLUÇÃO CLAUDE WEB: CRIAR PROFILE AQUI COM TIPO CORRETO
            if (typeFromUrl) {
              console.log('🎯 [CALLBACK] Usando type da URL:', typeFromUrl)
              const userType = typeFromUrl
              const planType = planFromUrl || 'free'
              
              // Verificar se profile já existe
              const { data: existingProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', sessionData.session.user.id)
                .single();
              
              if (!existingProfile) {
                console.log('🔧 [CALLBACK] Criando profile com tipo correto:', userType);
                
                // Criar profile com tipo correto
                const { error: profileError } = await supabase.from('profiles').insert({
                  id: sessionData.session.user.id,
                  email: sessionData.session.user.email,
                  name: sessionData.session.user.user_metadata?.full_name || 
                        sessionData.session.user.user_metadata?.name || 'Usuário',
                  type: userType,
                  avatar_url: sessionData.session.user.user_metadata?.avatar_url ||
                             sessionData.session.user.user_metadata?.picture,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                });
                
                if (profileError) {
                  console.error('❌ [CALLBACK] Erro ao criar profile:', profileError);
                } else {
                  console.log('✅ [CALLBACK] Profile criado com sucesso!');
                }
                
                // Criar registro específico
                if (userType === 'motorista') {
                  console.log('🚗 [CALLBACK] Criando registro de motorista');
                  await supabase.from('drivers').insert({ 
                    profile_id: sessionData.session.user.id,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  });
                } else                 if (userType === 'oficina') {
                  console.log('🔧 [CALLBACK] Criando registro de oficina com plano:', planType);
                  
                  // ADICIONE um delay aqui antes de criar workshop:
                  await new Promise(resolve => setTimeout(resolve, 500));
                  
                  // E garanta que o planType está sendo passado corretamente:
                  const workshopData = {
                    profile_id: sessionData.session.user.id,
                    plan_type: planType || 'free', // IMPORTANTE: fallback para 'free'
                    business_name: sessionData.session.user.user_metadata?.full_name || 
                                  sessionData.session.user.user_metadata?.name || 'Oficina',
                    verified: false,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  };
                  
                  console.log('🔧 Criando workshop com:', workshopData);
                  
                  const { error: workshopError } = await supabase
                    .from('workshops')
                    .insert(workshopData);
                    
                  if (workshopError) {
                    console.error('❌ Erro ao criar workshop:', workshopError);
                  }
                }
              } else {
                console.log('✅ [CALLBACK] Profile já existe:', existingProfile.type);
              }
              
              console.log('🚀 [CALLBACK] Redirecionando com dados da URL...')
              
              // Aguarde para sincronização
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              await redirectUserByType(userType, planType)
              return
            }
            
            // Se não tem type na URL, buscar no banco
            console.log('🔍 [CALLBACK] Type não encontrado na URL, buscando no banco...')
            const { data: profile } = await supabase
              .from('profiles')
              .select('type')
              .eq('id', sessionData.session.user.id)
              .single()

            if (profile) {
              console.log('✅ [CALLBACK] Profile encontrado:', profile.type)
              const userType = profile.type
              let planType = 'free'
              
              if (userType === 'oficina') {
                const { data: workshop } = await supabase
                  .from('workshops')
                  .select('plan_type')
                  .eq('profile_id', sessionData.session.user.id)
                  .single()
                
                planType = workshop?.plan_type || 'free'
                console.log('✅ [CALLBACK] Plano da oficina:', planType)
              }
              
              setTimeout(() => {
                redirectUserByType(userType, planType)
              }, 500)
            } else {
              console.warn('⚠️ [CALLBACK] Profile não encontrado, usando fallback')
              setTimeout(() => {
                redirectUserByType('motorista', 'free')
              }, 500)
            }
          }
        } else {
          // Sem código, verificar sessão existente
          console.log('🔍 [CALLBACK] Sem código OAuth, verificando sessão existente...')
          const { data, error } = await supabase.auth.getSession()
          
          if (error) {
            console.error('❌ [CALLBACK] Erro ao obter sessão:', error)
            setTimeout(() => window.location.href = '/auth', 3000)
            return
          }

          if (data.session && data.session.user) {
            console.log('✅ [CALLBACK] Sessão existente encontrada')
            setStatus('✅ Login realizado com sucesso!')
            
            // Mesmo processo: priorizar URL e criar profile se necessário
            if (typeFromUrl) {
              const userType = typeFromUrl
              const planType = planFromUrl || 'free'
              
              // Verificar se profile já existe
              const { data: existingProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.session.user.id)
                .single();
              
              if (!existingProfile) {
                console.log('🔧 [CALLBACK] Criando profile para sessão existente:', userType);
                
                // Criar profile com tipo correto
                await supabase.from('profiles').insert({
                  id: data.session.user.id,
                  email: data.session.user.email,
                  name: data.session.user.user_metadata?.full_name || 
                        data.session.user.user_metadata?.name || 'Usuário',
                  type: userType,
                  avatar_url: data.session.user.user_metadata?.avatar_url ||
                             data.session.user.user_metadata?.picture,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                });
                
                // Criar registro específico
                if (userType === 'motorista') {
                  await supabase.from('drivers').insert({ 
                    profile_id: data.session.user.id,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  });
                } else if (userType === 'oficina') {
                  await supabase.from('workshops').insert({ 
                    profile_id: data.session.user.id,
                    plan_type: planType,
                    business_name: data.session.user.user_metadata?.full_name || 
                                  data.session.user.user_metadata?.name || 'Oficina',
                    verified: false,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  });
                }
              }
              
              await new Promise(resolve => setTimeout(resolve, 1000));
              await redirectUserByType(userType, planType)
            } else {
              // Buscar no banco
              const { data: profile } = await supabase
                .from('profiles')
                .select('type')
                .eq('id', data.session.user.id)
                .single()

              if (profile) {
                const userType = profile.type
                let planType = 'free'
                
                if (userType === 'oficina') {
                  const { data: workshop } = await supabase
                    .from('workshops')
                    .select('plan_type')
                    .eq('profile_id', data.session.user.id)
                    .single()
                  
                  planType = workshop?.plan_type || 'free'
                }
                
                await new Promise(resolve => setTimeout(resolve, 1000));
                await redirectUserByType(userType, planType)
                              } else {
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  await redirectUserByType('motorista', 'free')
                }
            }
          } else {
            console.log('❌ [CALLBACK] Nenhuma sessão encontrada')
            setStatus('❌ Nenhuma sessão encontrada')
            setTimeout(() => window.location.href = '/auth', 3000)
          }
        }
      } catch (error) {
        console.error('❌ [CALLBACK] Erro geral:', error)
        setStatus(`❌ Erro inesperado: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
        setTimeout(() => window.location.href = '/auth', 3000)
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
              <p className="text-xs text-gray-500">
                Se não for redirecionado, verifique o console do navegador
              </p>
            </div>
          )}
          
          {status.includes('❌') && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Algo deu errado durante o login. Você será redirecionado para tentar novamente.
              </p>
              <button 
                onClick={() => window.location.href = '/auth'}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Tentar Novamente
              </button>
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
