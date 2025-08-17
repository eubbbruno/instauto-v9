'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui'
import { useToast } from '@/components/ui'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { OAuthButtons } from '@/components/auth/OAuthButtons'

export default function OficinaLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [planType, setPlanType] = useState<'free' | 'pro'>('free')
  const [couponCode, setCouponCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { addToast } = useToast()

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
        addToast({
          type: 'error',
          title: 'Erro no login',
          message: authError.message
        })
        return
      }

      // Verificar se é oficina
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('type')
        .eq('id', data.user.id)
        .single()

      if (profileError || !profile || profile.type !== 'oficina') {
        setError('Esta conta não é de uma oficina')
        addToast({
          type: 'error',
          title: 'Acesso negado',
          message: 'Esta conta não é de uma oficina'
        })
        await supabase.auth.signOut()
        return
      }

      // Verificar plano da oficina
      const { data: workshop } = await supabase
        .from('workshops')
        .select('plan_type')
        .eq('profile_id', data.user.id)
        .single()

      addToast({
        type: 'success',
        title: 'Login realizado!',
        message: `Bem-vindo à sua oficina!`
      })

      // Redirecionar baseado no plano
      if (workshop?.plan_type === 'pro') {
        router.push('/oficina-pro')
      } else {
        router.push('/oficina-free')
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
            user_type: 'oficina',
            plan_type: planType,
            workshop_name: 'Minha Oficina',
            coupon_code: couponCode || null
          }
        }
      })

      if (authError) {
        setError(authError.message)
        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          message: authError.message
        })
        return
      }

      if (data.user) {
        addToast({
          type: 'success',
          title: 'Oficina cadastrada!',
          message: 'Agora faça login para acessar seu painel.'
        })
        setIsSignUp(false)
      }

    } catch (error: any) {
      setError('Erro no cadastro: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-6">
              <Image
                src="/images/logo-of.svg"
                alt="InstaAuto"
                width={120}
                height={40}
                className="mx-auto"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isSignUp ? 'Cadastrar Oficina' : 'Oficina Login'}
            </h1>
            <p className="text-gray-600">
              {isSignUp ? 'Crie sua conta de oficina' : 'Acesse o painel da sua oficina'}
            </p>
          </div>

          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-6">
            
            {/* Plano da Oficina (Signup) */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Escolha seu Plano
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPlanType('free')}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      planType === 'free' 
                        ? 'border-green-500 bg-green-50 text-green-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold">💎 FREE</div>
                    <div className="text-sm text-gray-600">Grátis para sempre</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setPlanType('pro')}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      planType === 'pro' 
                        ? 'border-orange-500 bg-orange-50 text-orange-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold">⭐ PRO</div>
                    <div className="text-sm text-gray-600">7 dias grátis</div>
                  </button>
                </div>
              </div>
            )}

            {/* Campo de Cupom (Signup PRO) */}
            {isSignUp && planType === 'pro' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código de Cupom (Opcional)
                </label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="Ex: INFLUENCER20"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Ganhe desconto com cupom de influencer
                </p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email da Oficina
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="oficina@exemplo.com"
                required
              />
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 pr-12"
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

            {/* Erro */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Botão Submit */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg"
            >
              {isSignUp ? '🚀 Criar Oficina' : '🔧 Entrar na Oficina'}
            </Button>
          </form>

          {/* OAuth Buttons */}
          <OAuthButtons 
            userType="oficina" 
            planType={planType}
            couponCode={couponCode}
          />

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              {isSignUp ? '← Já tenho conta de oficina' : '✨ Cadastrar nova oficina'}
            </button>
          </div>

          {/* Links */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              🚗 Sou Motorista
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
