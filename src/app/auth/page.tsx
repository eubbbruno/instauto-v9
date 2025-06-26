"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// *** CREDENCIAIS DE TESTE ATUALIZADAS ***
const TEST_CREDENTIALS = {
  'joao@email.com': { password: '123456', type: 'motorista', name: 'João Silva' },
  'carlos@autocenter.com': { password: '123456', type: 'oficina', name: 'Auto Center Silva' }
}

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState<'motorista' | 'oficina'>('motorista')
  const router = useRouter()
  
  // Estados para login/cadastro
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    userType: 'motorista' as 'motorista' | 'oficina'
  })

  // Login usando as novas API routes
  const signInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('🔄 Fazendo login...')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro no login')
      }

      setMessage('✅ Login realizado com sucesso!')
      
      setTimeout(() => {
        if (data.usuario.tipo === 'motorista') {
          router.push('/motorista')
        } else {
          router.push('/dashboard')
        }
      }, 1000)

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      setMessage(`❌ Erro: ${errorMessage}`)
      setLoading(false)
    }
  }

  // Cadastro usando as novas API routes
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
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          nome: formData.fullName,
          tipo: formData.userType
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro no cadastro')
      }

      setMessage('✅ Conta criada com sucesso!')
      
      setTimeout(() => {
        setActiveTab('login')
        setMessage('📧 Conta criada! Faça login agora.')
      }, 2000)

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      setMessage(`❌ Erro: ${errorMessage}`)
      setLoading(false)
    }
  }

  // Preencher dados de demonstração
  const fillDemoData = () => {
    if (userType === 'motorista') {
      setFormData({
        ...formData,
        email: 'joao@email.com',
        password: '123456'
      })
    } else {
      setFormData({
        ...formData,
        email: 'carlos@autocenter.com',
        password: '123456'
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header com logo e voltar */}
      <div className="p-4">
        <Link 
          href="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Voltar para a página inicial
        </Link>
      </div>

      <div className="flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Coluna da esquerda - Informações */}
            <div className="p-8 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-l-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-3xl">🚗</div>
                <h1 className="text-2xl font-bold">Instauto</h1>
              </div>
              
              <h2 className="text-xl font-semibold mb-4">
                Bem-vindo ao Instauto
              </h2>
              
              <p className="text-blue-100 mb-8">
                Conectando motoristas às melhores oficinas mecânicas. 
                Gerencie seus veículos e encontre os melhores serviços.
              </p>

              {/* Credenciais de teste */}
              <div className="bg-blue-700/50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-blue-100 mb-3 flex items-center gap-2">
                  🔑 Credenciais para Teste
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-1 flex items-center gap-2">
                      👤 Motorista - João Silva
                    </h4>
                    <p className="text-blue-200 text-sm">
                      <strong>Email:</strong> joao@email.com<br/>
                      <strong>Senha:</strong> 123456
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-1 flex items-center gap-2">
                      🏢 Oficina - Auto Center Silva
                    </h4>
                    <p className="text-blue-200 text-sm">
                      <strong>Email:</strong> carlos@autocenter.com<br/>
                      <strong>Senha:</strong> 123456
                    </p>
                  </div>
                </div>
                
                <p className="text-blue-200 text-xs mt-3">
                  💡 Use o botão "Entrar com dados de demonstração" no formulário
                </p>
              </div>

              {/* Funcionalidades */}
              <div>
                <h3 className="font-medium mb-3">O que você pode fazer no Instauto:</h3>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li className="flex items-start gap-2">
                    <span>•</span> Encontrar oficinas próximas para o serviço que você precisa
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span> Gerenciar todos os seus veículos em um só lugar
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span> Acompanhar histórico completo de manutenções
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span> Receber lembretes para as próximas revisões
                  </li>
                </ul>
              </div>
            </div>

            {/* Coluna da direita - Formulário */}
            <div className="p-8">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl">🚗</div>
                  <h2 className="text-xl font-bold text-gray-800">Instauto</h2>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Entrar na sua conta
                </h3>
              </div>

              {/* Abas Login/Cadastro */}
              <div className="flex border-b mb-6">
                <button
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                    activeTab === 'login' 
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setActiveTab('register')}
                  className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                    activeTab === 'register' 
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Cadastre-se
                </button>
              </div>

              {activeTab === 'login' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {/* Seletor de tipo de usuário */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Você é:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setUserType('motorista')}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                          userType === 'motorista'
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        Motorista
                      </button>
                      <button
                        type="button"
                        onClick={() => setUserType('oficina')}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                          userType === 'oficina'
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        Oficina
                      </button>
                    </div>
                  </div>

                  {/* Demo credentials */}
                  <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800 font-medium mb-2">
                      🚀 Acesso para demonstração - {userType === 'motorista' ? 'Motorista' : 'Oficina'}
                    </p>
                    <p className="text-sm text-green-700 mb-2">
                      <strong>Email:</strong> {userType === 'motorista' ? 'joao@email.com' : 'carlos@autocenter.com'}<br/>
                      <strong>Senha:</strong> 123456
                    </p>
                    <button
                      type="button"
                      onClick={fillDemoData}
                      className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-3 rounded transition-all"
                    >
                      ⚡Entrar com dados de demonstração
                    </button>
                  </div>

                  <form onSubmit={signInWithEmail} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
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
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Esqueci minha senha
                      </Link>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all disabled:opacity-50"
                    >
                      {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                  </form>

                  <div className="mt-4 text-center text-sm text-gray-600">
                    Não tem uma conta? {' '}
                    <button
                      onClick={() => setActiveTab('register')}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Cadastre-se
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="motorista">🚗 Motorista</option>
                      <option value="oficina">🔧 Oficina</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all disabled:opacity-50"
                  >
                    {loading ? 'Criando conta...' : 'Criar Conta'}
                  </button>
                </motion.form>
              )}

              {/* Mensagem de Status */}
              {message && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center text-sm text-blue-800">
                  {message}
                </div>
              )}

              {/* Footer */}
              <div className="mt-6 text-center text-xs text-gray-500">
                Ao continuar, você concorda com os{' '}
                <Link href="/termos" className="text-blue-600 hover:text-blue-800">
                  Termos de Serviço
                </Link>
                {' '}e{' '}
                <Link href="/privacidade" className="text-blue-600 hover:text-blue-800">
                  Política de Privacidade
                </Link>
                .
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}