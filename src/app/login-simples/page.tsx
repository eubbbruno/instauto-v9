'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

export default function LoginSimples() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [userType, setUserType] = useState<'motorista' | 'oficina'>('motorista')
  const [planType, setPlanType] = useState<'free' | 'pro'>('free')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) {
        setError(authError.message)
        return
      }

      // Buscar profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('type')
        .eq('id', data.user.id)
        .single()

      if (profileError || !profile) {
        setError('Erro ao buscar perfil')
        return
      }

      // Redirecionar baseado no tipo
      switch (profile.type) {
        case 'motorista':
          router.push('/motorista')
          break
        case 'oficina':
          // Verificar plano da oficina
          const { data: workshop } = await supabase
            .from('workshops')
            .select('plan_type')
            .eq('profile_id', data.user.id)
            .single()
          
          if (workshop?.plan_type === 'pro') {
            router.push('/oficina-pro')
          } else {
            router.push('/oficina-free')
          }
          break
        default:
          setError('Tipo de usuário não suportado')
      }

    } catch (error: any) {
      setError('Erro inesperado: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: userType,
            plan_type: userType === 'oficina' ? planType : null,
            workshop_name: userType === 'oficina' ? 'Minha Oficina' : null
          }
        }
      })

      if (authError) {
        setError(authError.message)
        return
      }

      if (data.user) {
        alert('Cadastro realizado! Faça login.')
        setIsSignUp(false)
      }

    } catch (error: any) {
      setError('Erro no cadastro: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isSignUp ? 'Criar Conta' : 'Entrar'}
            </h1>
            <p className="text-gray-600">
              {isSignUp ? 'Cadastre-se na plataforma' : 'Acesse sua conta'}
            </p>
          </div>

          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-6">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Usuário
                </label>
                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value as 'motorista' | 'oficina')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="motorista">🚗 Motorista</option>
                  <option value="oficina">🔧 Oficina</option>
                </select>
              </div>
            )}

            {isSignUp && userType === 'oficina' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plano da Oficina
                </label>
                <select
                  value={planType}
                  onChange={(e) => setPlanType(e.target.value as 'free' | 'pro')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="free">💎 Grátis</option>
                  <option value="pro">⭐ PRO (7 dias grátis)</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 font-medium"
            >
              {loading ? '⏳ Processando...' : (isSignUp ? '✨ Criar Conta' : '🚀 Entrar')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {isSignUp ? '← Já tenho conta' : '✨ Criar nova conta'}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <a
              href="/admin/login"
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              🔐 Login Admin
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
