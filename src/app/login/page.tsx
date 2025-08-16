'use client'
import { supabase } from '@/lib/supabase'
import { SocialAuthManager, SOCIAL_PROVIDERS } from '@/lib/auth-social'
import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import SocialLoginButtons from '@/components/auth/SocialLoginButtons'
import QuickAccessButtons from '@/components/auth/QuickAccessButtons'
import LoginFormAdvanced from '@/components/auth/LoginFormAdvanced'

function LoginContent() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [userType, setUserType] = useState<'motorista' | 'oficina'>('motorista')
  const [oficinaPlano, setOficinaPlano] = useState<'free' | 'pro'>('free')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [returnUrl, setReturnUrl] = useState<string | null>(null)

  useEffect(() => {
    // Pegar parâmetros da URL
    const urlType = searchParams.get('type')
    const urlPlan = searchParams.get('plan')
    const urlReturnUrl = searchParams.get('return_url')
    const urlEmail = searchParams.get('email')
    const urlPassword = searchParams.get('password')
    
    if (urlType === 'oficina') setUserType('oficina')
    if (urlPlan === 'free' || urlPlan === 'pro') setOficinaPlano(urlPlan)
    if (urlReturnUrl) setReturnUrl(urlReturnUrl)
    if (urlEmail) setEmail(urlEmail)
    if (urlPassword) setPassword(urlPassword)
    
    // Se veio com parâmetros, já ativar signup
    if (urlType || urlPlan) setIsSignUp(true)
    
    // Auto-fill mas não auto-login
    // Removido auto-login problemático
  }, [searchParams])

  const handleQuickLogin = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        alert('Erro no login: ' + error.message)
        return
      }

      // Redirecionamento inteligente
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*, workshops(*)')
        .eq('id', data.user.id)
        .single()

      if (profile?.type === 'motorista') {
        window.location.href = '/motorista'
      } else if (profile?.type === 'admin') {
        window.location.href = '/admin'
      } else if (profile.type === 'oficina') {
        const workshop = profile.workshops?.[0]
        if (workshop?.plan_type === 'pro') {
          window.location.href = '/oficina-pro'
        } else {
          window.location.href = '/oficina-free'
        }
      }
      
    } catch (error) {
      console.error('Erro no quick login:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleAuth = async () => {
    setLoading(true)
    
    try {
      if (isSignUp) {
        // Criar conta
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { 
              user_type: userType,
              plan_type: userType === 'oficina' ? oficinaPlano : undefined,
              name: email.split('@')[0]
            }
          }
        })
        
        if (error) {
          alert('Erro ao criar conta: ' + error.message)
          return
        }

        if (data.user) {
          if (oficinaPlano === 'pro') {
            alert(`🎉 Conta PRO criada! Você tem 7 dias de trial GRÁTIS. Verifique seu email para confirmar.`)
          } else {
            alert('✅ Conta criada! Verifique seu email para confirmar.')
          }
        }
        
      } else {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        
        if (error) {
          alert('Erro no login: ' + error.message)
          return
        }

        // Redirecionamento inteligente após login
        if (returnUrl) {
          window.location.href = returnUrl
        } else {
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('*, workshops(*)')
            .eq('id', data.user.id)
            .single()

          if (profile?.type === 'motorista') {
            window.location.href = '/motorista'
          } else if (profile?.type === 'admin') {
            window.location.href = '/admin'
          } else if (profile.type === 'oficina') {
            const workshop = profile.workshops?.[0]
            
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
            console.error('Tipo de usuário inválido:', profile.type)
            alert(`Erro: Tipo "${profile.type}" não reconhecido. Entre em contato com o suporte.`)
          }
        }
      }
      
    } catch (error) {
      console.error('Erro na autenticação:', error)
      alert('Erro inesperado na autenticação')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Lado Esquerdo - Apresentação */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="hidden lg:block"
            >
              <div className="text-center lg:text-left">
                <Image
                  src="/images/logo-of.svg"
                  alt="InstaAuto"
                  width={120}
                  height={120}
                  className="mx-auto lg:mx-0 mb-8"
                />
                
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
                  {userType === 'motorista' ? (
                    <>
                      Encontre a <span className="text-blue-600">oficina perfeita</span> para seu veículo
                    </>
                  ) : (
                    <>
                      Gerencie sua oficina com <span className="text-yellow-600">inteligência</span>
                    </>
                  )}
                </h1>
                
                <p className="text-xl text-gray-600 mb-8">
                  {userType === 'motorista' 
                    ? 'Conecte-se com oficinas confiáveis na sua região e agende serviços com facilidade.'
                    : 'Sistema completo de gestão para oficinas modernas e conectadas.'
                  }
                </p>

                <AnimatePresence mode="wait">
                  {userType === 'motorista' ? (
                    <motion.div
                      key="motorista"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Busca inteligente de oficinas
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Agendamento online
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Avaliações e reviews
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="oficina"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                        CRM + ERP integrado
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                        Gestão de estoque
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                        Relatórios inteligentes
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Lado Direito - Formulário */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full max-w-md mx-auto"
            >
              {/* Card do Formulário */}
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
                
                {/* Logo Mobile */}
                <div className="lg:hidden mb-6 text-center">
                  <Image
                    src="/images/logo.svg"
                    alt="InstaAuto"
                    width={60}
                    height={60}
                    className="mx-auto mb-4"
                  />
                </div>

                {/* Formulário Avançado */}
                <LoginFormAdvanced
                  isSignUp={isSignUp}
                  userType={userType}
                  oficinaPlano={oficinaPlano}
                  onSubmit={async (email, password) => {
                    setEmail(email)
                    setPassword(password)
                    await handleAuth()
                  }}
                  loading={loading}
                  returnUrl={returnUrl}
                />

                {/* Toggle Login/Signup */}
                <div className="text-center mt-6 pt-4 border-t border-gray-200">
                  <p className="text-gray-600 text-sm mb-2">
                    {isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?'}
                  </p>
                  <button
                    onClick={() => {
                      setIsSignUp(!isSignUp)
                      setStep(1)
                    }}
                    className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
                  >
                    {isSignUp ? 'Fazer Login' : 'Criar Conta'}
                  </button>
                </div>

                {/* Atalhos Rápidos */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <QuickAccessButtons
                    currentUserType={userType}
                    onUserTypeChange={setUserType}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
