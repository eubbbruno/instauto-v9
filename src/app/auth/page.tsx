"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

// *** LOGIN ADMIN FIXO PARA TESTES ***
const ADMIN_CREDENTIALS = {
  'admin@instauto.com': { password: 'admin123', type: 'oficina', name: 'Admin Instauto' },
  'motorista@instauto.com': { password: 'motorista123', type: 'motorista', name: 'Motorista Teste' },
  'oficina@instauto.com': { password: 'oficina123', type: 'oficina', name: 'Oficina Teste' },
  'bruno@instauto.com': { password: 'bruno123', type: 'oficina', name: 'Bruno Admin' }
}

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  
  // Estados para login/cadastro com email
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    userType: 'motorista' as 'motorista' | 'oficina'
  })

  // *** SISTEMA DE LOGIN FIXO ***
  const loginWithFixedCredentials = (email: string, password: string) => {
    const user = ADMIN_CREDENTIALS[email as keyof typeof ADMIN_CREDENTIALS]
    
    if (user && user.password === password) {
      // Simular sessão local
      localStorage.setItem('instauto_user', JSON.stringify({
        email: email,
        name: user.name,
        type: user.type,
        authenticated: true
      }))
      
      return { success: true, user: user }
    }
    
    return { success: false, error: 'Credenciais inválidas' }
  }

  // Função para login com email (com fallback para admin fixo)
  const signInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('🔄 Fazendo login...')

    // *** TENTAR LOGIN FIXO PRIMEIRO ***
    const fixedLogin = loginWithFixedCredentials(formData.email, formData.password)
    
    if (fixedLogin.success) {
      setMessage('✅ Login admin realizado com sucesso!')
      
      setTimeout(() => {
        if (fixedLogin.user?.type === 'motorista') {
          router.push('/motorista')
        } else {
          router.push('/dashboard')
        }
      }, 1000)
      return
    }

    // *** FALLBACK PARA SUPABASE ***
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) throw error

      setMessage('✅ Login Supabase realizado com sucesso!')
      
      setTimeout(() => {
        if (formData.userType === 'motorista') {
          router.push('/motorista')
        } else {
          router.push('/dashboard')
        }
      }, 1500)

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      setMessage(`❌ Erro no Supabase: ${errorMessage}`)
      setLoading(false)
    }
  }

  // Função para cadastro com email
  const signUpWithEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    
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
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            user_type: formData.userType,
          }
        }
      })

      if (error) throw error

      setMessage('✅ Conta criada! Verifique seu email para confirmar.')
      
      setTimeout(() => {
        setActiveTab('login')
        setMessage('📧 Conta criada! Faça login agora.')
      }, 3000)

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      setMessage(`❌ Erro: ${errorMessage}`)
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    setLoading(true)
    setMessage('🔄 Redirecionando para Google...')

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })

      if (error) throw error
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      setMessage(`❌ Erro: ${errorMessage}`)
      setLoading(false)
    }
  }

  const signInWithFacebook = async () => {
    setLoading(true)
    setMessage('🔄 Redirecionando para Facebook...')

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      setMessage(`❌ Erro: ${errorMessage}`)
      setLoading(false)
    }
  }

  const checkUser = async () => {
    // Verificar login local primeiro
    const localUser = localStorage.getItem('instauto_user')
    if (localUser) {
      const user = JSON.parse(localUser)
      setMessage(`✅ Logado como: ${user.email} (${user.name})`)
      return
    }

    // Verificar Supabase
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setMessage(`✅ Logado como: ${user.email}`)
      setTimeout(() => router.push('/dashboard'), 1500)
    } else {
      setMessage('❌ Não logado')
    }
  }

  const signOut = async () => {
    // Limpar sessão local
    localStorage.removeItem('instauto_user')
    
    // Logout do Supabase
    await supabase.auth.signOut()
    setMessage('👋 Logout realizado!')
  }

  // Auto-completar dados de teste
  const fillTestData = (type: 'admin' | 'motorista' | 'oficina') => {
    const credentials = {
      admin: { email: 'admin@instauto.com', password: 'admin123' },
      motorista: { email: 'motorista@instauto.com', password: 'motorista123' },
      oficina: { email: 'oficina@instauto.com', password: 'oficina123' }
    }
    
    setFormData({
      ...formData,
      email: credentials[type].email,
      password: credentials[type].password
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header com Logo */}
        <div className="text-center p-6 border-b">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🚗 Instauto</h1>
          <p className="text-gray-600">Sua plataforma automotiva</p>
          
          {/* Credenciais de Teste */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800 font-medium mb-2">🧪 CREDENCIAIS DE TESTE:</p>
            <div className="space-y-1 text-xs text-blue-700">
              <div className="flex gap-2">
                <button 
                  onClick={() => fillTestData('admin')}
                  className="px-2 py-1 bg-blue-200 rounded text-blue-800 hover:bg-blue-300"
                >
                  Admin
                </button>
                <span>admin@instauto.com / admin123</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => fillTestData('motorista')}
                  className="px-2 py-1 bg-green-200 rounded text-green-800 hover:bg-green-300"
                >
                  Motorista
                </button>
                <span>motorista@instauto.com / motorista123</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => fillTestData('oficina')}
                  className="px-2 py-1 bg-purple-200 rounded text-purple-800 hover:bg-purple-300"
                >
                  Oficina
                </button>
                <span>oficina@instauto.com / oficina123</span>
              </div>
            </div>
          </div>
        </div>

        {/* Abas Login/Cadastro */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'login' 
                ? 'text-[#0047CC] border-b-2 border-[#0047CC] bg-blue-50' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'register' 
                ? 'text-[#0047CC] border-b-2 border-[#0047CC] bg-blue-50' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Cadastrar
          </button>
        </div>

        <div className="p-6">
          {/* Formulário de Login */}
          {activeTab === 'login' && (
            <motion.form
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={signInWithEmail}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047CC] focus:border-transparent pr-10"
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0047CC] hover:bg-[#0055EB] text-white font-medium py-3 px-4 rounded-lg transition-all disabled:opacity-50"
              >
                {loading ? '⏳ Entrando...' : '🚀 Entrar'}
              </button>
            </motion.form>
          )}

          {/* Formulário de Cadastro */}
          {activeTab === 'register' && (
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={signUpWithEmail}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047CC] focus:border-transparent pr-10"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Senha
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                  placeholder="Confirme sua senha"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Usuário
                </label>
                <select
                  value={formData.userType}
                  onChange={(e) => setFormData({...formData, userType: e.target.value as 'motorista' | 'oficina'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                >
                  <option value="motorista">🚗 Motorista</option>
                  <option value="oficina">🔧 Oficina</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0047CC] hover:bg-[#0055EB] text-white font-medium py-3 px-4 rounded-lg transition-all disabled:opacity-50"
              >
                {loading ? '⏳ Criando conta...' : '✨ Criar Conta'}
              </button>
            </motion.form>
          )}

          {/* Divisor */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">ou continue com</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Login Social */}
          <div className="space-y-3">
            <button
              onClick={signInWithGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition-all disabled:opacity-50 hover:shadow-md"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>

            <button
              onClick={signInWithFacebook}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166FE5] text-white font-medium py-3 px-4 rounded-lg transition-all disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>

          {/* Utilitários */}
          <div className="mt-6 border-t pt-4">
            <div className="flex gap-2">
              <button
                onClick={checkUser}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm"
              >
                🔍 Status
              </button>
              
              <button
                onClick={signOut}
                className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 px-4 rounded-lg text-sm"
              >
                🚪 Sair
              </button>
            </div>
          </div>
        </div>

        {/* Mensagem de Status */}
        {message && (
          <div className="mx-6 mb-6 p-4 bg-gray-50 rounded-lg text-center text-sm">
            {message}
          </div>
        )}

        {/* Footer */}
        <div className="text-center p-4 border-t">
          <p className="text-xs text-gray-500">
            🔒 Seus dados estão seguros e protegidos
          </p>
        </div>
      </div>
    </div>
  );
} 