"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { EyeIcon, EyeSlashIcon, UserIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState<'auth' | 'profile'>('auth')
  const router = useRouter()
  
  // Estados para login/cadastro
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    userType: 'motorista' as 'motorista' | 'oficina',
    // Dados do motorista
    cpf: '',
    phone: '',
    // Dados da oficina
    businessName: '',
    cnpj: '',
    planType: 'free' as 'free' | 'pro'
  })

  // Verificar se Supabase está configurado
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setMessage('⚠️ Supabase não configurado. Configure as variáveis de ambiente.')
    }
  }, [])

  // Login com Email/Senha
  const signInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isSupabaseConfigured() || !supabase) {
      setMessage('❌ Supabase não configurado')
      return
    }

    setLoading(true)
    setMessage('🔄 Fazendo login...')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) throw error

      setMessage('✅ Login realizado com sucesso!')
      
      // Buscar perfil do usuário para redirecionamento correto
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('type, plan_type')
        .eq('id', data.user.id)
        .single()

      if (profileError) {
        console.warn('Erro ao buscar perfil:', profileError)
        // Se não encontrar perfil, usar dados do metadata do usuário
        const userType = data.user.user_metadata?.type || 'motorista'
        redirectUserByType(userType)
      } else {
        redirectUserByType(profile.type, profile.plan_type)
      }

    } catch (error: any) {
      console.error('Erro no login:', error)
      setMessage(`❌ Erro: ${error.message}`)
      setLoading(false)
    }
  }

  // Função para redirecionar baseado no tipo de usuário - CORRIGIDA
  const redirectUserByType = (userType: string, planType?: string) => {
    setLoading(false)
    
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

  // Cadastro com Email/Senha
  const signUpWithEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isSupabaseConfigured() || !supabase) {
      setMessage('❌ Supabase não configurado')
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      setMessage('❌ As senhas não coincidem!')
      return
    }
    
    if (formData.password.length < 6) {
      setMessage('❌ A senha deve ter pelo menos 6 caracteres!')
      return
    }

    setLoading(true)
    setMessage('🔄 Criando conta...')

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.fullName,
            type: formData.userType
          }
        }
      })

      if (error) throw error

      if (data.user) {
        setMessage('✅ Conta criada! Complete seu perfil...')
        setStep('profile')
      }

    } catch (error: any) {
      console.error('Erro no cadastro:', error)
      setMessage(`❌ Erro: ${error.message}`)
      setLoading(false)
    }
  }

  // Completar perfil após cadastro
  const completeProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('🔄 Finalizando cadastro...')

    try {
      if (!supabase) {
        throw new Error('Supabase não configurado')
      }
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Inserir dados no perfil
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            email: user.email,
            name: formData.fullName,
            type: formData.userType,
            plan_type: formData.userType === 'oficina' ? formData.planType : null,
            // Dados específicos baseado no tipo
            ...(formData.userType === 'motorista' ? {
              cpf: formData.cpf,
              phone: formData.phone
            } : {
              business_name: formData.businessName,
              cnpj: formData.cnpj,
              phone: formData.phone
            })
          })

        if (profileError) throw profileError
      }

      setMessage('✅ Perfil completado com sucesso!')
      
      setTimeout(() => {
        redirectUserByType(formData.userType, formData.planType)
      }, 1000)

    } catch (error: any) {
      console.error('Erro ao completar perfil:', error)
      setMessage(`❌ Erro: ${error.message}`)
      setLoading(false)
    }
  }

  // Login com Google
  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      setMessage('❌ Supabase não configurado')
      return
    }

    setLoading(true)
    setMessage('🔄 Redirecionando para Google...')

    try {
      const redirectUrl = `${window.location.origin}/auth/callback`
      
      // DEBUG: Mostrar URLs sendo usadas
      console.log('🔍 DEBUG AUTH:')
      console.log('- window.location.origin:', window.location.origin)
      console.log('- redirectTo:', redirectUrl)
      console.log('- Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      })

      if (error) throw error

    } catch (error: any) {
      console.error('Erro no login Google:', error)
      setMessage(`❌ Erro: ${error.message}`)
      setLoading(false)
    }
  }

  // Login com Facebook
  const signInWithFacebook = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      setMessage('❌ Supabase não configurado')
      return
    }

    setLoading(true)
    setMessage('🔄 Redirecionando para Facebook...')

    try {
      const redirectUrl = `${window.location.origin}/auth/callback`
      
      // DEBUG: Mostrar URLs sendo usadas
      console.log('🔍 DEBUG AUTH FACEBOOK:')
      console.log('- window.location.origin:', window.location.origin)
      console.log('- redirectTo:', redirectUrl)
      console.log('- Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: redirectUrl,
        }
      })

      if (error) throw error

    } catch (error: any) {
      console.error('Erro no login Facebook:', error)
      setMessage(`❌ Erro: ${error.message}`)
      setLoading(false)
    }
  }

  // Se estiver na etapa de completar perfil
  if (step === 'profile') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
        <div className="p-4">
          <Link href="/" className="text-blue-300 hover:text-blue-100 font-medium">
            ← Voltar
          </Link>
        </div>

        <div className="flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">
                {formData.userType === 'motorista' ? '🚗' : '🔧'}
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Complete seu perfil</h1>
              <p className="text-gray-600 mt-2">
                {formData.userType === 'motorista' ? 'Dados do motorista' : 'Dados da oficina'}
              </p>
            </div>

            {message && (
              <div className={`mb-6 p-3 rounded-lg text-sm font-medium ${
                message.includes('❌') 
                  ? 'bg-red-50 text-red-700 border border-red-200' 
                  : message.includes('✅') 
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={completeProfile} className="space-y-4">
              {formData.userType === 'motorista' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      CPF
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.cpf}
                      onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      placeholder="000.000.000-00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Nome da Oficina
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.businessName}
                      onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      placeholder="Auto Center Silva"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      CNPJ
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.cnpj}
                      onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      placeholder="00.000.000/0001-00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Plano
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, planType: 'free'})}
                        className={`p-4 rounded-lg border-2 text-sm font-medium transition-all ${
                          formData.planType === 'free'
                            ? 'bg-green-50 border-green-500 text-green-700'
                            : 'bg-gray-50 border-gray-200 text-gray-900 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-lg mb-1">🆓</div>
                        <div className="font-semibold">Grátis</div>
                        <div className="text-xs opacity-75">Funcionalidades básicas</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, planType: 'pro'})}
                        className={`p-4 rounded-lg border-2 text-sm font-medium transition-all ${
                          formData.planType === 'pro'
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'bg-gray-50 border-gray-200 text-gray-900 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-lg mb-1">⭐</div>
                        <div className="font-semibold">Pro</div>
                        <div className="text-xs opacity-75">Recursos completos</div>
                      </button>
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Finalizando...' : 'Finalizar Cadastro'}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      {/* Header com logo e voltar */}
      <div className="p-4">
        <Link 
          href="/" 
          className="inline-flex items-center text-blue-300 hover:text-blue-100 font-medium transition-colors"
        >
          ← Voltar para a página inicial
        </Link>
      </div>

      <div className="flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Coluna da esquerda - Informações */}
            <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-4xl">🚗</div>
                <h1 className="text-3xl font-bold text-white">Instauto</h1>
              </div>
              
              <h2 className="text-xl font-semibold mb-4 text-white">
                Bem-vindo ao Instauto
              </h2>
              
              <p className="text-blue-100 mb-8 leading-relaxed">
                A plataforma que conecta motoristas às melhores oficinas mecânicas. 
                Gerencie seus veículos e encontre os melhores serviços automotivos.
              </p>

              {/* Funcionalidades */}
              <div className="mb-8">
                <h3 className="font-semibold mb-4 text-lg text-white">O que você pode fazer:</h3>
                <ul className="space-y-3 text-blue-100">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-300 mt-1 font-bold">✓</span>
                    <span>Encontrar oficinas próximas e confiáveis</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-300 mt-1 font-bold">✓</span>
                    <span>Gerenciar todos os seus veículos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-300 mt-1 font-bold">✓</span>
                    <span>Histórico completo de manutenções</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-300 mt-1 font-bold">✓</span>
                    <span>Lembretes inteligentes de revisões</span>
                  </li>
                </ul>
              </div>

              {/* Status da configuração */}
              <div className="p-4 bg-blue-800/50 rounded-lg">
                <h4 className="font-medium text-sm mb-2 text-white">Status do Sistema:</h4>
                <div className="text-xs text-blue-200">
                  <div className="flex items-center gap-2">
                    <span>{isSupabaseConfigured() ? '✅' : '❌'}</span>
                    <span>Banco de dados: {isSupabaseConfigured() ? 'Conectado' : 'Desconectado'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna da direita - Formulário */}
            <div className="p-8 bg-white">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">🔐</div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Entre ou Cadastre-se</h2>
                    <p className="text-gray-600">Acesse sua conta ou crie uma nova</p>
                  </div>
                </div>
              </div>

              {/* Mensagem de status */}
              {message && (
                <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${
                  message.includes('❌') 
                    ? 'bg-red-50 text-red-700 border border-red-200' 
                    : message.includes('✅') 
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {message}
                </div>
              )}

              {/* Abas Login/Cadastro */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                    activeTab === 'login' 
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setActiveTab('register')}
                  className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                    activeTab === 'register' 
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Cadastrar
                </button>
              </div>

              {/* Botões de Login Social */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={signInWithGoogle}
                  disabled={loading || !isSupabaseConfigured()}
                  className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-gray-700">Continuar com Google</span>
                </button>

                <button
                  onClick={signInWithFacebook}
                  disabled={loading || !isSupabaseConfigured()}
                  className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white font-medium py-3 px-4 rounded-lg hover:bg-[#166FE5] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="text-white">Continuar com Facebook</span>
                </button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500 font-medium">ou</span>
                </div>
              </div>

              {activeTab === 'login' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <form onSubmit={signInWithEmail} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                        placeholder="seu@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Senha
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 text-gray-900 placeholder-gray-500 bg-white"
                          placeholder="Sua senha"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? 
                            <EyeSlashIcon className="h-5 w-5 text-gray-400" /> : 
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                          }
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <Link 
                        href="/auth/recuperar-senha" 
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Esqueci minha senha
                      </Link>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !isSupabaseConfigured()}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                  </form>

                  <div className="mt-6 text-center text-sm text-gray-700">
                    Não tem uma conta? {' '}
                    <button
                      onClick={() => setActiveTab('register')}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Cadastre-se grátis
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'register' && (
                <motion.form
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onSubmit={signUpWithEmail}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Tipo de Conta
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, userType: 'motorista'})}
                        className={`p-4 rounded-lg border-2 text-sm font-medium transition-all ${
                          formData.userType === 'motorista'
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <UserIcon className="w-6 h-6 mx-auto mb-2" />
                        <div className="font-semibold">Motorista</div>
                        <div className="text-xs text-gray-500">Grátis</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, userType: 'oficina'})}
                        className={`p-4 rounded-lg border-2 text-sm font-medium transition-all ${
                          formData.userType === 'oficina'
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <BuildingOfficeIcon className="w-6 h-6 mx-auto mb-2" />
                        <div className="font-semibold">Oficina</div>
                        <div className="text-xs text-gray-500">Planos disponíveis</div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Senha
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 text-gray-900 placeholder-gray-500 bg-white"
                        placeholder="Mínimo 6 caracteres"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? 
                          <EyeSlashIcon className="h-5 w-5 text-gray-400" /> : 
                          <EyeIcon className="h-5 w-5 text-gray-400" />
                        }
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Confirmar Senha
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                      placeholder="Confirme sua senha"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !isSupabaseConfigured()}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Criando conta...' : 'Criar conta grátis'}
                  </button>

                  <div className="text-center text-sm text-gray-700">
                    Já tem uma conta? {' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Faça login
                    </button>
                  </div>
                </motion.form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
