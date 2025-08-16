'use client'
import { supabase } from '@/lib/supabase'
import { SocialAuthManager, SOCIAL_PROVIDERS } from '@/lib/auth-social'
import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

function LoginContent() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [userType, setUserType] = useState<'motorista' | 'oficina'>('motorista')
  const [oficinaPlano, setOficinaPlano] = useState<'free' | 'pro'>('free')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // Para multi-step signup
  const [returnUrl, setReturnUrl] = useState<string | null>(null)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)

  useEffect(() => {
    // Pegar parâmetros da URL
    const urlType = searchParams.get('type')
    const urlPlan = searchParams.get('plan')
    const urlReturnUrl = searchParams.get('return_url')
    
    if (urlType === 'oficina') setUserType('oficina')
    if (urlPlan === 'free' || urlPlan === 'pro') setOficinaPlano(urlPlan)
    if (urlReturnUrl) setReturnUrl(urlReturnUrl)
    
    // Se veio com parâmetros, já ativar signup
    if (urlType || urlPlan) setIsSignUp(true)
  }, [searchParams])
  
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
              name: email.split('@')[0] // Nome padrão baseado no email
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
          
          console.log('🎯 Usuário criado com metadados:', {
            user_type: userType,
            plan_type: userType === 'oficina' ? oficinaPlano : undefined,
            email: data.user.email
          })
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

        // Aguardar para garantir que profile foi criado
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Redirecionamento inteligente após login
        if (returnUrl) {
          window.location.href = returnUrl
        } else {
          // Buscar profile COMPLETO
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*, workshops(*)')
            .eq('id', data.user.id)
            .single()

          if (profileError || !profile) {
            console.error('Erro ao buscar profile:', profileError)
            alert('Profile não encontrado. Aguarde um momento e tente novamente.')
            return
          }

          console.log('Profile encontrado:', profile)

          if (profile?.type === 'motorista') {
            window.location.href = '/motorista'
          } else if (profile?.type === 'admin') {
            window.location.href = '/admin'
          } else if (profile.type === 'oficina') {
            // Verificar plano da oficina
            const workshop = profile.workshops?.[0]
            
            console.log('🔍 Workshop encontrado:', workshop)
            
            if (workshop?.plan_type === 'pro') {
              // Verificar se ainda está no trial
              const isTrialActive = workshop.is_trial && workshop.trial_ends_at && 
                new Date(workshop.trial_ends_at) > new Date()
              
              console.log('🎯 Trial status:', {
                is_trial: workshop.is_trial,
                trial_ends_at: workshop.trial_ends_at,
                isTrialActive,
                now: new Date().toISOString()
              })
              
              if (isTrialActive || !workshop.is_trial) {
                console.log('✅ Redirecionando para oficina-pro')
                window.location.href = '/oficina-pro'
              } else {
                console.log('⚠️ Trial expirado, redirecionando para oficina-free')
                window.location.href = '/oficina-free?trial_expired=true'
              }
            } else {
              console.log('📋 Plano free, redirecionando para oficina-free')
              window.location.href = '/oficina-free'
            }
          } else {
            console.error('Tipo de usuário inválido:', profile.type)
            alert(`Erro: Tipo "${profile.type}" não reconhecido. Entre em contato com o suporte.`)
          }
        }
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro inesperado!')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialAuth = async (provider: 'google' | 'facebook') => {
    setSocialLoading(provider)
    
    try {
      await SocialAuthManager.signInWithProvider({
        provider,
        userType: isSignUp ? userType : undefined,
        oficinaPlano: isSignUp && userType === 'oficina' ? oficinaPlano : undefined,
        returnUrl: returnUrl || undefined
      })
      
      // O redirecionamento será feito automaticamente pelo OAuth
      
    } catch (error) {
      console.error('Erro no login social:', error)
      alert('Erro ao fazer login com ' + SOCIAL_PROVIDERS[provider].name)
    } finally {
      setSocialLoading(null)
    }
  }

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fundo Claro com Glassmorphism */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-yellow-50"></div>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230ea5e9' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Elementos flutuantes decorativos */}
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-yellow-400/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-yellow-400/10 to-blue-400/10 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-64 h-64 bg-gradient-to-r from-blue-300/8 to-yellow-300/8 rounded-full blur-2xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -80, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Conteúdo Principal */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Lado Esquerdo - Imagens e Informações */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block"
          >
            <div className="text-center space-y-8">
              {/* Logo Principal */}
              <div className="mb-8">
                <Image
                  src="/images/logo.svg"
                  alt="InstaAuto"
                  width={120}
                  height={120}
                  className="mx-auto"
                />
                <h1 className="text-4xl font-bold text-gray-800 mt-4">
                  InstaAuto
                </h1>
                <p className="text-gray-600 text-lg">
                  Conectando motoristas e oficinas
                </p>
              </div>

              {/* Imagem Contextual */}
              <div className="relative">
                <AnimatePresence mode="wait">
                  {userType === 'motorista' ? (
                    <motion.div
                      key="motorista"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20"
                    >
                      <div className="text-center space-y-4">
                        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                          <Image
                            src="/images/car-3d.png"
                            alt="Motorista"
                            width={80}
                            height={80}
                            className="object-contain"
                          />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">
                          Para Motoristas
                        </h3>
                        <p className="text-gray-600">
                          Encontre as melhores oficinas, agende serviços e gerencie seus veículos
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            Busca inteligente
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            Agendamento fácil
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            Diagnóstico IA
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            Chat direto
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="oficina"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20"
                    >
                      <div className="text-center space-y-4">
                        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center overflow-hidden">
                          <Image
                            src="/images/mechanic-illustration.png"
                            alt="Oficina"
                            width={80}
                            height={80}
                            className="object-contain"
                          />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">
                          Para Oficinas
                        </h3>
                        <p className="text-gray-600">
                          Gerencie clientes, ordens de serviço e aumente sua receita
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                            Analytics IA
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                            Gestão completa
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                            Planos flexíveis
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                            Pagamentos online
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Lado Direito - Formulário */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md mx-auto"
          >
            {/* Card do Formulário com Glassmorphism */}
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="lg:hidden mb-4">
                  <Image
                    src="/images/logo.svg"
                    alt="InstaAuto"
                    width={80}
                    height={80}
                    className="mx-auto"
                  />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {isSignUp ? 'Criar Conta' : 'Entrar'}
                </h2>
                <p className="text-gray-600">
                  {isSignUp ? 'Junte-se à nossa plataforma' : 'Bem-vindo de volta!'}
                </p>
              </div>

              <AnimatePresence mode="wait">
                {/* Formulário Multi-Step para Signup */}
                {isSignUp && step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Usuário
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setUserType('motorista')}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            userType === 'motorista'
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-center">
                            <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                              <Image
                                src="/images/car-3d.png"
                                alt="Motorista"
                                width={24}
                                height={24}
                                className="object-contain"
                              />
                            </div>
                            <div className="font-medium">Motorista</div>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setUserType('oficina')}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            userType === 'oficina'
                              ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-center">
                            <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center overflow-hidden">
                              <Image
                                src="/images/mechanic-illustration.png"
                                alt="Oficina"
                                width={24}
                                height={24}
                                className="object-contain"
                              />
                            </div>
                            <div className="font-medium">Oficina</div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Seleção de Plano para Oficina */}
                    {userType === 'oficina' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Escolha seu Plano
                        </label>
                        <div className="grid grid-cols-1 gap-3">
                          <button
                            type="button"
                            onClick={() => setOficinaPlano('free')}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                              oficinaPlano === 'free'
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-bold text-gray-800">FREE</div>
                                <div className="text-sm text-gray-600">Recursos básicos</div>
                              </div>
                              <div className="text-2xl font-bold text-green-600">R$ 0</div>
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={() => setOficinaPlano('pro')}
                            className={`p-4 rounded-xl border-2 text-left transition-all relative ${
                              oficinaPlano === 'pro'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            {/* Badge de Trial */}
                            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                              7 DIAS GRÁTIS
                            </div>
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-bold text-gray-800">PRO</div>
                                <div className="text-sm text-gray-600">Recursos avançados + IA</div>
                                <div className="text-xs text-green-600 font-medium mt-1">
                                  Trial gratuito por 7 dias
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-blue-600">R$ 89</div>
                                <div className="text-xs text-gray-500">/mês após trial</div>
                              </div>
                            </div>
                          </button>
                        </div>
                      </motion.div>
                    )}

                    <button
                      onClick={nextStep}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-medium text-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg"
                    >
                      Continuar
                    </button>

                    {/* Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500">ou continue com</span>
                      </div>
                    </div>

                    {/* Social Auth Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleSocialAuth('google')}
                        disabled={socialLoading !== null}
                        className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {socialLoading === 'google' ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-gray-300 border-t-red-500 rounded-full"
                          />
                        ) : (
                          <>
                            <span className="text-xl mr-2">🔍</span>
                            <span className="font-medium text-gray-700">Google</span>
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleSocialAuth('facebook')}
                        disabled={socialLoading !== null}
                        className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {socialLoading === 'facebook' ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full"
                          />
                        ) : (
                          <>
                            <span className="text-xl mr-2">📘</span>
                            <span className="font-medium text-gray-700">Facebook</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2 - Dados */}
                {isSignUp && step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                          placeholder="seu@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Senha
                        </label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={prevStep}
                        className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-all"
                      >
                        Voltar
                      </button>
                      <button
                        onClick={handleAuth}
                        disabled={loading}
                        className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg ${
                          userType === 'motorista'
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                            : 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white hover:from-yellow-700 hover:to-yellow-800'
                        }`}
                      >
                        {loading ? 'Criando...' : 'Criar Conta'}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Formulário de Login */}
                {!isSignUp && (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                          placeholder="seu@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Senha
                        </label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleAuth}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-medium text-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg"
                    >
                      {loading ? 'Entrando...' : 'Entrar'}
                    </button>

                    {/* Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500">ou entre com</span>
                      </div>
                    </div>

                    {/* Social Auth Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleSocialAuth('google')}
                        disabled={socialLoading !== null}
                        className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {socialLoading === 'google' ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-gray-300 border-t-red-500 rounded-full"
                          />
                        ) : (
                          <>
                            <span className="text-xl mr-2">🔍</span>
                            <span className="font-medium text-gray-700">Google</span>
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleSocialAuth('facebook')}
                        disabled={socialLoading !== null}
                        className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {socialLoading === 'facebook' ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full"
                          />
                        ) : (
                          <>
                            <span className="text-xl mr-2">📘</span>
                            <span className="font-medium text-gray-700">Facebook</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Toggle Login/Signup */}
              <div className="text-center mt-8 pt-6 border-t border-gray-200">
                <p className="text-gray-600">
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
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LoginContent />
    </Suspense>
  )
}