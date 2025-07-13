"use client";

import { useState, useEffect } from "react";
import { EyeIcon, EyeSlashIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export default function OficinaAuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro'>('free')
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
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
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })
      
      if (error) throw error
      
      setMessage('✅ Login realizado com sucesso!')
      
      // Buscar tipo de plano da oficina para redirecionamento correto
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: workshop } = await supabase
          .from('workshops')
          .select('plan_type')
          .eq('profile_id', user.id)
          .single()
        
        const redirectPath = workshop?.plan_type === 'pro' ? '/dashboard' : '/oficina-basica'
        setTimeout(() => router.push(redirectPath), 1000)
      }
      
    } catch (error: unknown) {
      setMessage(`❌ Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
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
            type: 'oficina',
            plan_type: selectedPlan
          }
        }
      })
      
      if (error) throw error
      
      if (data.user) {
        setMessage('✅ Conta criada com sucesso! Redirecionando...')
        
        // Redirecionamento baseado no plano selecionado
        const redirectPath = selectedPlan === 'pro' ? '/dashboard' : '/oficina-basica'
        setTimeout(() => {
          router.push(redirectPath)
        }, 2000)
      }
      
    } catch (error: unknown) {
      setMessage(`❌ Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
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
          redirectTo: `${window.location.origin}/auth/callback?type=oficina&plan_type=${selectedPlan}`,
          queryParams: { 
            type: 'oficina',
            plan_type: selectedPlan
          }
        }
      })
      
      if (error) throw error
      
    } catch (error: unknown) {
      setMessage(`❌ Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
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
          redirectTo: `${window.location.origin}/auth/callback?type=oficina&plan_type=${selectedPlan}`,
          queryParams: { 
            type: 'oficina',
            plan_type: selectedPlan
          }
        }
      })
      
      if (error) throw error
      
    } catch (error: unknown) {
      setMessage(`❌ Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-600 to-pink-700">
      <div className="p-4">
        <Link href="/" className="inline-flex items-center text-orange-200 hover:text-white font-semibold transition-colors">
          ← Voltar para início
        </Link>
      </div>

      <div className="flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            
            {/* Coluna da esquerda - Informações da Oficina */}
            <div className="p-8 bg-gradient-to-br from-orange-600 to-red-700 text-white">
              <div className="flex items-center gap-3 mb-6">
                <BuildingOfficeIcon className="w-10 h-10 text-orange-200" />
                <div>
                  <h1 className="text-3xl font-bold">Área da Oficina</h1>
                  <p className="text-orange-200">Instauto</p>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold mb-4">
                Bem-vinda, Oficina!
              </h2>
              
              <p className="text-orange-100 mb-8 leading-relaxed">
                Conecte-se com milhares de motoristas, gerencie seus serviços e expanda seu negócio. 
                Plataforma completa para oficinas modernas.
              </p>
              
              {/* Seleção de Plano */}
              {activeTab === "register" && (
                <div className="mb-8">
                  <h3 className="font-semibold mb-4 text-lg">Escolha seu plano:</h3>
                  <div className="grid grid-cols-1 gap-4">
                    
                    {/* Plano Grátis */}
                    <button
                      type="button"
                      onClick={() => setSelectedPlan('free')}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selectedPlan === 'free'
                          ? 'bg-orange-500 border-orange-300 text-white'
                          : 'bg-orange-700/60 border-orange-500 text-orange-200 hover:border-orange-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">🆓</span>
                        <div>
                          <h4 className="font-bold text-lg">Plano Grátis</h4>
                          <p className="text-sm opacity-90">Ideal para começar</p>
                        </div>
                      </div>
                      <ul className="text-sm space-y-1 ml-10">
                        <li>• Cadastro básico da oficina</li>
                        <li>• Receber solicitações de orçamento</li>
                        <li>• Chat com clientes</li>
                        <li>• Até 10 ordens por mês</li>
                      </ul>
                    </button>

                    {/* Plano Pro */}
                    <button
                      type="button"
                      onClick={() => setSelectedPlan('pro')}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selectedPlan === 'pro'
                          ? 'bg-orange-500 border-orange-300 text-white'
                          : 'bg-orange-700/60 border-orange-500 text-orange-200 hover:border-orange-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">⭐</span>
                        <div>
                          <h4 className="font-bold text-lg">Plano Pro</h4>
                          <p className="text-sm opacity-90">Recursos completos</p>
                        </div>
                      </div>
                      <ul className="text-sm space-y-1 ml-10">
                        <li>• Tudo do plano grátis</li>
                        <li>• Ordens ilimitadas</li>
                        <li>• Dashboard completo</li>
                        <li>• Relatórios avançados</li>
                        <li>• Gestão de estoque</li>
                        <li>• Suporte prioritário</li>
                      </ul>
                    </button>
                  </div>
                  
                  <div className="mt-4 p-3 bg-orange-700/60 rounded-lg text-sm">
                    <p className="text-orange-200">
                      💡 <strong>Dica:</strong> Você pode mudar de plano a qualquer momento nas configurações.
                    </p>
                  </div>
                </div>
              )}
              
              {/* Benefícios gerais */}
              <div className="mb-8">
                <h3 className="font-semibold mb-4 text-lg">Benefícios da plataforma:</h3>
                <ul className="space-y-3 text-orange-100">
                  <li className="flex items-start gap-3">
                    <span className="text-orange-300 mt-1 font-bold">🎯</span>
                    <span>Clientes qualificados na sua região</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-orange-300 mt-1 font-bold">💼</span>
                    <span>Sistema completo de gestão</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-orange-300 mt-1 font-bold">📊</span>
                    <span>Relatórios e analytics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-orange-300 mt-1 font-bold">💬</span>
                    <span>Chat integrado com clientes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-orange-300 mt-1 font-bold">🔧</span>
                    <span>Ferramentas profissionais</span>
                  </li>
                </ul>
              </div>
              
              <div className="p-4 bg-orange-700/60 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Status do Sistema:</h4>
                <div className="flex items-center gap-2 text-sm">
                  <span>{isSupabaseConfigured() ? '✅' : '❌'}</span>
                  <span className="text-orange-200">
                    {isSupabaseConfigured() ? 'Sistema Online' : 'Sistema Offline'}
                  </span>
                </div>
              </div>
            </div>

            {/* Coluna da direita - Formulário */}
            <div className="p-8 bg-white">
              <div className="mb-6">
                <div className="flex rounded-lg bg-gray-100 p-1">
                  <button
                    onClick={() => setActiveTab("login")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${
                      activeTab === "login"
                        ? "bg-white text-orange-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Entrar
                  </button>
                  <button
                    onClick={() => setActiveTab("register")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${
                      activeTab === "register"
                        ? "bg-white text-orange-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Cadastrar
                  </button>
                </div>
              </div>

              {message && (
                <div className={`mb-6 p-4 rounded-lg text-sm font-semibold ${
                  message.includes('❌') ? 'bg-red-100 text-red-800 border-2 border-red-300' 
                  : message.includes('✅') ? 'bg-green-100 text-green-800 border-2 border-green-300'
                  : 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                }`}>
                  {message}
                </div>
              )}

              <form onSubmit={activeTab === "login" ? signInWithEmail : signUpWithEmail} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white font-medium"
                    placeholder="oficina@email.com"
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
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white font-medium pr-12"
                      placeholder="Sua senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {activeTab === "register" && (
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Confirmar Senha</label>
                    <input
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white font-medium"
                      placeholder="Confirme sua senha"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-4 rounded-lg transition-all disabled:opacity-50 text-lg"
                >
                  {loading ? '🔄 Processando...' : (activeTab === "login" ? '🔑 Entrar' : '✨ Criar Conta')}
                </button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">ou continue com</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    onClick={signInWithGoogle}
                    disabled={loading}
                    className="w-full inline-flex justify-center py-3 px-4 rounded-lg border-2 border-gray-300 bg-white text-sm font-semibold text-gray-900 hover:bg-gray-50 disabled:opacity-50 transition-all"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="ml-2">Google</span>
                  </button>

                  <button
                    onClick={signInWithFacebook}
                    disabled={loading}
                    className="w-full inline-flex justify-center py-3 px-4 rounded-lg border-2 border-gray-300 bg-white text-sm font-semibold text-gray-900 hover:bg-gray-50 disabled:opacity-50 transition-all"
                  >
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="ml-2">Facebook</span>
                  </button>
                </div>
              </div>

              {activeTab === "login" && (
                <div className="mt-6 text-center">
                  <Link href="/auth/recuperar-senha" className="text-sm text-orange-600 hover:text-orange-800 font-semibold">
                    Esqueceu sua senha?
                  </Link>
                </div>
              )}

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Você é um motorista?
                </p>
                <Link href="/auth/motorista" className="text-orange-600 hover:text-orange-800 font-semibold">
                  Clique aqui para acessar a área do motorista →
                </Link>
              </div>
              
              <div className="mt-6 text-center text-xs text-gray-500">
                <p>
                  {activeTab === "register" ? 'Ao se cadastrar, você concorda com nossos ' : 'Ao entrar, você concorda com nossos '}
                  <Link href="/termos" className="text-orange-600 hover:text-orange-800">Termos de Serviço</Link>
                  {' e '}
                  <Link href="/politicas" className="text-orange-600 hover:text-orange-800">Política de Privacidade</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 