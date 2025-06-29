"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { EyeIcon, EyeSlashIcon, UserIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export default function AuthMotoristaPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState<'auth' | 'profile'>('auth')
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    cpf: '',
    phone: '',
  })

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setMessage('⚠️ Sistema em manutenção. Tente novamente em instantes.')
    }
  }, [])

  const signInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSupabaseConfigured() || !supabase) {
      setMessage('❌ Sistema temporariamente indisponível')
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
      setTimeout(() => router.push('/motorista'), 1000)
    } catch (error: any) {
      setMessage(`❌ Erro: ${error.message}`)
      setLoading(false)
    }
  }

  const signUpWithEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSupabaseConfigured() || !supabase) {
      setMessage('❌ Sistema temporariamente indisponível')
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
            type: 'motorista'
          }
        }
      })
      if (error) throw error
      if (data.user) {
        setMessage('✅ Conta criada! Complete seu perfil...')
        setStep('profile')
      }
    } catch (error: any) {
      setMessage(`❌ Erro: ${error.message}`)
      setLoading(false)
    }
  }

  const completeProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('🔄 Finalizando cadastro...')
    try {
      if (!supabase) throw new Error('Sistema indisponível')
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { error } = await supabase.from('profiles').upsert({
          id: user.id,
          email: user.email,
          name: formData.fullName,
          type: 'motorista',
          cpf: formData.cpf,
          phone: formData.phone,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        if (error) throw error
      }
      setMessage('✅ Perfil completado com sucesso!')
      setTimeout(() => router.push('/motorista'), 1000)
    } catch (error: any) {
      setMessage(`❌ Erro: ${error.message}`)
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      setMessage('❌ Sistema temporariamente indisponível')
      return
    }
    setLoading(true)
    setMessage('🔄 Redirecionando para Google...')
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { type: 'motorista' }
        }
      })
      if (error) throw error
    } catch (error: any) {
      setMessage(`❌ Erro: ${error.message}`)
      setLoading(false)
    }
  }

  const signInWithFacebook = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      setMessage('❌ Sistema temporariamente indisponível')
      return
    }
    setLoading(true)
    setMessage('🔄 Redirecionando para Facebook...')
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { type: 'motorista' }
        }
      })
      if (error) throw error
    } catch (error: any) {
      setMessage(`❌ Erro: ${error.message}`)
      setLoading(false)
    }
  }

  if (step === 'profile') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-orange-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <UserIcon className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Complete seu perfil</h2>
              <p className="text-gray-600 mt-2">Falta pouco para começar!</p>
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-lg text-sm font-semibold ${
                message.includes('❌') ? 'bg-red-100 text-red-800 border-2 border-red-300' 
                : message.includes('✅') ? 'bg-green-100 text-green-800 border-2 border-green-300'
                : 'bg-red-100 text-red-800 border-2 border-red-300'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={completeProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">CPF</label>
                <input
                  type="text"
                  required
                  value={formData.cpf}
                  onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 bg-white font-medium"
                  placeholder="000.000.000-00"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Telefone</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 bg-white font-medium"
                  placeholder="(11) 99999-9999"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-4 rounded-lg transition-all disabled:opacity-50 text-lg"
              >
                {loading ? '🔄 Finalizando...' : '✅ Finalizar Cadastro'}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-orange-800">
      <div className="p-4">
        <Link href="/" className="inline-flex items-center text-red-200 hover:text-white font-semibold transition-colors">
          ← Voltar para início
        </Link>
      </div>

      <div className="flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-8 bg-gradient-to-br from-red-600 to-orange-800 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-4xl">🚗</div>
                <h1 className="text-3xl font-bold">Motoristas</h1>
              </div>
              <h2 className="text-xl font-semibold mb-4">Gerencie seus veículos com facilidade</h2>
              <p className="text-red-100 mb-8 leading-relaxed">
                Encontre as melhores oficinas, acompanhe manutenções e mantenha seus veículos sempre em perfeito estado.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircleIcon className="w-6 h-6 text-red-300 mt-1 flex-shrink-0" />
                  <span className="text-red-100">Encontre oficinas próximas e confiáveis</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircleIcon className="w-6 h-6 text-red-300 mt-1 flex-shrink-0" />
                  <span className="text-red-100">Histórico completo de manutenções</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircleIcon className="w-6 h-6 text-red-300 mt-1 flex-shrink-0" />
                  <span className="text-red-100">Lembretes inteligentes de revisões</span>
                </div>
              </div>
              <div className="p-4 bg-red-700/60 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Status:</h4>
                <div className="flex items-center gap-2 text-sm">
                  <span>{isSupabaseConfigured() ? '✅' : '❌'}</span>
                  <span className="text-red-200">{isSupabaseConfigured() ? 'Sistema Online' : 'Sistema Offline'}</span>
                </div>
              </div>
            </div>

            <div className="p-8 bg-white">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">👤</div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Área do Motorista</h2>
                    <p className="text-gray-600">Entre ou crie sua conta gratuita</p>
                  </div>
                </div>
              </div>

              {message && (
                <div className={`mb-6 p-4 rounded-lg text-sm font-semibold ${
                  message.includes('❌') ? 'bg-red-100 text-red-800 border-2 border-red-300' 
                  : message.includes('✅') ? 'bg-green-100 text-green-800 border-2 border-green-300'
                  : 'bg-orange-100 text-orange-800 border-2 border-orange-300'
                }`}>
                  {message}
                </div>
              )}

              <div className="flex border-b-2 border-gray-200 mb-6">
                <button
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 py-3 px-4 text-center font-bold transition-colors ${
                    activeTab === 'login' ? 'text-red-600 border-b-2 border-red-600 bg-red-50' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Entrar
                </button>
                <button
                  onClick={() => setActiveTab('register')}
                  className={`flex-1 py-3 px-4 text-center font-bold transition-colors ${
                    activeTab === 'register' ? 'text-red-600 border-b-2 border-red-600 bg-red-50' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Cadastrar
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  onClick={signInWithGoogle}
                  disabled={loading || !isSupabaseConfigured()}
                  className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-400 text-gray-800 font-bold py-4 px-4 rounded-lg hover:bg-gray-50 hover:border-gray-600 transition-all disabled:opacity-50 shadow-md"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continuar com Google</span>
                </button>

                <button
                  onClick={signInWithFacebook}
                  disabled={loading || !isSupabaseConfigured()}
                  className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white font-bold py-4 px-4 rounded-lg hover:bg-[#166FE5] transition-all disabled:opacity-50 shadow-md"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Continuar com Facebook</span>
                </button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-600 font-bold">ou</span>
                </div>
              </div>

              {activeTab === 'login' && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                  <form onSubmit={signInWithEmail} className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-600 bg-white font-medium"
                        placeholder="seu@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Senha</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 text-gray-900 placeholder-gray-600 bg-white font-medium"
                          placeholder="Sua senha"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-600" /> : <EyeIcon className="h-5 w-5 text-gray-600" />}
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <Link href="/auth/recuperar-senha" className="text-sm text-red-600 hover:text-red-800 font-bold">
                        Esqueci minha senha
                      </Link>
                    </div>
                    <button
                      type="submit"
                      disabled={loading || !isSupabaseConfigured()}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-4 rounded-lg transition-all disabled:opacity-50 text-lg"
                    >
                      {loading ? '🔄 Entrando...' : '✅ Entrar'}
                    </button>
                  </form>
                  <div className="mt-6 text-center text-sm text-gray-700">
                    Não tem uma conta? {' '}
                    <button onClick={() => setActiveTab('register')} className="text-red-600 hover:text-red-800 font-bold">
                      Cadastre-se grátis
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'register' && (
                <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={signUpWithEmail} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Nome Completo</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-600 bg-white font-medium"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-600 bg-white font-medium"
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Senha</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 text-gray-900 placeholder-gray-600 bg-white font-medium"
                        placeholder="Mínimo 6 caracteres"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-600" /> : <EyeIcon className="h-5 w-5 text-gray-600" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Confirmar Senha</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-600 bg-white font-medium"
                      placeholder="Confirme sua senha"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !isSupabaseConfigured()}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-4 rounded-lg transition-all disabled:opacity-50 text-lg"
                  >
                    {loading ? '🔄 Criando conta...' : '🚗 Criar conta grátis'}
                  </button>
                  <div className="text-center text-sm text-gray-700">
                    Já tem uma conta? {' '}
                    <button type="button" onClick={() => setActiveTab('login')} className="text-red-600 hover:text-red-800 font-bold">
                      Faça login
                    </button>
                  </div>
                </motion.form>
              )}

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600 mb-2">É uma oficina mecânica?</p>
                <Link href="/auth/oficina" className="text-red-600 hover:text-red-800 font-bold">
                  Clique aqui para cadastrar sua oficina →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 