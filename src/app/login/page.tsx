'use client'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [userType, setUserType] = useState<'motorista' | 'oficina'>('motorista')
  const [oficinaPlano, setOficinaPlano] = useState<'free' | 'pro'>('free')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // Para multi-step signup
  
  const handleAuth = async () => {
    setLoading(true)
    
    try {
      if (isSignUp) {
        // Criar conta
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { user_type: userType }
          }
        })
        
        if (error) {
          alert('Erro ao criar conta: ' + error.message)
          return
        }
        
        if (data?.user) {
          // Criar profile
          const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            email: data.user.email,
            type: userType
          })
          
          if (profileError) {
            alert('Erro ao criar profile: ' + profileError.message)
            return
          }
          
          if (userType === 'oficina') {
            alert(`🎉 Conta OFICINA criada!\nPlano: ${oficinaPlano.toUpperCase()}\n\nFaça login para acessar!`)
          } else {
            alert('🚗 Conta MOTORISTA criada! Faça login.')
          }
          setIsSignUp(false)
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
        
        if (data?.user) {
          console.log('✅ Login realizado:', data.user.email)
          
          // Buscar profile para redirecionamento inteligente
          const { data: profile } = await supabase
            .from('profiles')
            .select('type')
            .eq('id', data.user.id)
            .single()
          
          if (profile?.type === 'motorista') {
            window.location.href = '/motorista'
          } else if (profile?.type === 'oficina') {
            // Por enquanto sempre FREE, depois implementar lógica de plano
            window.location.href = '/oficina-free'
          } else {
            window.location.href = '/dashboard'
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

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fundo Animado */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"></div>
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Elementos flutuantes decorativos */}
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
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
          className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
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
          className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, 120, 0],
            y: [0, -80, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Carros flutuantes decorativos */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 -left-20 text-6xl opacity-10"
          animate={{
            x: [0, 1200],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          🚗
        </motion.div>
        <motion.div
          className="absolute top-2/3 right-0 text-4xl opacity-10"
          animate={{
            x: [0, -1200],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
            delay: 5
          }}
        >
          🔧
        </motion.div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mb-4 flex justify-center">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-lg rounded-2xl p-3 border border-white/20">
                <Image
                  src="/images/logo.svg"
                  alt="InstaAuto"
                  width={56}
                  height={56}
                  className="w-full h-full object-contain filter brightness-0 invert"
                />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              InstaAuto
            </h1>
            <p className="text-blue-200/80 text-lg">Conectando motoristas e oficinas</p>
          </motion.div>
          
          {/* Card Principal */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Glassmorphism Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl relative overflow-hidden">
              {/* Decoração interna */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/20 to-transparent rounded-full blur-xl"></div>
              
              <div className="relative z-10">
                <AnimatePresence mode="wait">
                  {!isSignUp || step === 1 ? (
                    /* LOGIN / STEP 1 */
                    <motion.div
                      key="login"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2">
                          {isSignUp ? 'Criar Conta' : '👋 Bem-vindo de volta!'}
                        </h2>
                        {!isSignUp && (
                          <p className="text-white/70">Entre na sua conta para continuar</p>
                        )}
                      </div>

                      {/* Seleção de tipo (apenas no cadastro) */}
                      {isSignUp && (
                        <div className="mb-6">
                          <label className="block text-white text-sm font-medium mb-4">
                            🎯 Qual é o seu perfil?
                          </label>
                          <div className="grid grid-cols-1 gap-3">
                            <motion.button
                              type="button"
                              onClick={() => setUserType('motorista')}
                              className={`p-4 rounded-xl border-2 transition-all relative overflow-hidden ${
                                userType === 'motorista'
                                  ? 'border-blue-400 bg-blue-500/30'
                                  : 'border-white/30 hover:border-white/50'
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="text-2xl">🚗</div>
                                <div className="text-left">
                                  <div className="text-white font-medium">Sou Motorista</div>
                                  <div className="text-white/70 text-sm">Preciso de serviços para meu veículo</div>
                                </div>
                              </div>
                            </motion.button>
                            
                            <motion.button
                              type="button"
                              onClick={() => setUserType('oficina')}
                              className={`p-4 rounded-xl border-2 transition-all relative overflow-hidden ${
                                userType === 'oficina'
                                  ? 'border-amber-400 bg-amber-500/30'
                                  : 'border-white/30 hover:border-white/50'
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="text-2xl">🔧</div>
                                <div className="text-left">
                                  <div className="text-white font-medium">Tenho uma Oficina</div>
                                  <div className="text-white/70 text-sm">Quero oferecer meus serviços</div>
                                </div>
                              </div>
                            </motion.button>
                          </div>
                        </div>
                      )}

                      {/* Campos */}
                      <div className="space-y-4 mb-6">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <div className="relative">
                            <input
                              type="email"
                              placeholder="📧 Seu melhor email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full px-4 py-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all backdrop-blur-sm"
                            />
                          </div>
                        </motion.div>
                        
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <div className="relative">
                            <input
                              type="password"
                              placeholder="🔒 Sua senha secreta"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full px-4 py-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all backdrop-blur-sm"
                            />
                          </div>
                        </motion.div>
                      </div>

                      {/* Botão principal */}
                      <motion.button
                        onClick={isSignUp && userType === 'oficina' ? nextStep : handleAuth}
                        disabled={loading || !email || !password}
                        className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] relative overflow-hidden"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
                        <span className="relative z-10 flex items-center justify-center space-x-2">
                          {loading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              <span>Carregando...</span>
                            </>
                          ) : (
                            <>
                              <span>{isSignUp ? (userType === 'oficina' ? 'Continuar →' : 'Criar Conta 🚀') : 'Entrar ✨'}</span>
                            </>
                          )}
                        </span>
                      </motion.button>
                    </motion.div>
                  ) : (
                    /* STEP 2 - PLANO OFICINA */
                    <motion.div
                      key="plan-selection"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2">
                          🎯 Escolha seu Plano
                        </h2>
                        <p className="text-white/70">Qual plano se adequa ao seu negócio?</p>
                      </div>

                      <div className="space-y-4 mb-6">
                        <motion.button
                          type="button"
                          onClick={() => setOficinaPlano('free')}
                          className={`w-full p-6 rounded-xl border-2 transition-all relative overflow-hidden ${
                            oficinaPlano === 'free'
                              ? 'border-green-400 bg-green-500/30'
                              : 'border-white/30 hover:border-white/50'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="text-left">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="text-3xl">💚</div>
                              <div>
                                <div className="text-white font-bold text-xl">PLANO FREE</div>
                                <div className="text-green-300 font-medium">R$ 0,00/mês</div>
                              </div>
                            </div>
                            <div className="text-white/80 text-sm space-y-1">
                              <div>✅ Até 3 conversas ativas</div>
                              <div>✅ Relatórios básicos</div>
                              <div>✅ Perfil público</div>
                              <div>✅ Suporte por email</div>
                            </div>
                          </div>
                        </motion.button>
                        
                        <motion.button
                          type="button"
                          onClick={() => setOficinaPlano('pro')}
                          className={`w-full p-6 rounded-xl border-2 transition-all relative overflow-hidden ${
                            oficinaPlano === 'pro'
                              ? 'border-amber-400 bg-gradient-to-r from-amber-500/30 to-orange-500/30'
                              : 'border-white/30 hover:border-white/50'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-400 to-orange-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-full">
                            RECOMENDADO
                          </div>
                          <div className="text-left">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="text-3xl">👑</div>
                              <div>
                                <div className="text-white font-bold text-xl">PLANO PRO</div>
                                <div className="text-amber-300 font-medium">R$ 89,00/mês</div>
                              </div>
                            </div>
                            <div className="text-white/80 text-sm space-y-1">
                              <div>🚀 Conversas ilimitadas</div>
                              <div>📊 Relatórios avançados + IA</div>
                              <div>💎 Recursos premium</div>
                              <div>⚡ Suporte prioritário</div>
                              <div>🎯 Marketing e SEO</div>
                            </div>
                          </div>
                        </motion.button>
                      </div>

                      <div className="flex space-x-3">
                        <motion.button
                          onClick={prevStep}
                          className="flex-1 bg-white/20 text-white py-4 rounded-xl font-semibold hover:bg-white/30 transition-all"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          ← Voltar
                        </motion.button>
                        
                        <motion.button
                          onClick={handleAuth}
                          disabled={loading}
                          className="flex-2 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-amber-600 hover:via-orange-600 hover:to-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] relative overflow-hidden"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="relative z-10 flex items-center justify-center space-x-2">
                            {loading ? (
                              <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Criando...</span>
                              </>
                            ) : (
                              <>
                                <span>Criar Oficina 🚀</span>
                              </>
                            )}
                          </span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Toggle Login/Signup */}
                {(!isSignUp || step === 1) && (
                  <motion.div
                    className="text-center mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <button
                      onClick={() => {
                        setIsSignUp(!isSignUp)
                        setStep(1)
                      }}
                      className="text-blue-300 hover:text-blue-200 transition-colors font-medium text-sm hover:underline"
                    >
                      {isSignUp ? '← Já tenho conta' : '✨ Criar nova conta'}
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            className="text-center mt-8 text-white/60 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p>Transformando a experiência automotiva 🚗✨</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}