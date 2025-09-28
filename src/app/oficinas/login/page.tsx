'use client'

// Desabilitar prerendering para essa página
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useToastHelpers } from '@/components/ui/toast'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import OAuthButtons from '@/components/auth/OAuthButtons'
import { PageTransition, CardTransition, ButtonTransition } from '@/components/ui/PageTransition'

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
  const { success, error: showError } = useToastHelpers()

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
        showError('Erro no login: ' + authError.message)
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
        showError('Esta conta não é de uma oficina')
        await supabase.auth.signOut()
        return
      }

      // Verificar plano da oficina
      const { data: workshop } = await supabase
        .from('workshops')
        .select('plan_type')
        .eq('profile_id', data.user.id)
        .single()

      success('Login realizado! Bem-vindo à sua oficina!')

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
        showError('Erro no cadastro: ' + authError.message)
        return
      }

      if (data.user) {
        success('Oficina cadastrada! Agora faça login para acessar seu painel.')
        setIsSignUp(false)
      }

    } catch (error: any) {
      setError('Erro no cadastro: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

    return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex">
      {/* Desktop Image Side */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-red-600/20 z-10"></div>
        <Image
          src="/images/oficina.png"
          alt="Oficina Profissional"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-8 left-8 z-20 text-white">
          <h2 className="text-3xl font-bold mb-2">Oficina Profissional!</h2>
          <p className="text-orange-100 text-lg">Gerencie sua oficina com tecnologia</p>
        </div>
      </div>

        {/* Form Side */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
          <div className="max-w-md w-full">
            {/* Mobile Image - Melhorado */}
            <CardTransition>
              <div className="lg:hidden mb-4 md:mb-6 lg:mb-8 relative h-32 md:h-36 lg:h-40 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/images/oficina.png"
                  alt="Oficina Profissional"
                  fill
                  className="object-cover object-center"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 text-white">
                  <h3 className="font-bold text-lg md:text-xl mb-1">Oficina Profissional!</h3>
                  <p className="text-white/90 text-xs md:text-sm">Gerencie sua oficina com tecnologia</p>
                </div>
              </div>
            </CardTransition>

            <CardTransition delay={0.1}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-4 md:p-6 lg:p-8 relative overflow-hidden"
              >
            {/* Glassmorphism Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-red-50/30 -z-10"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-200/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-red-200/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
                {/* Header */}
                <div className="text-center mb-6 md:mb-8 relative z-10">
                  <motion.div 
                    className="mx-auto mb-4 md:mb-6 p-2 md:p-3 bg-white/80 rounded-2xl shadow-lg w-fit"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Image
                      src="/images/logo-of.svg"
                      alt="InstaAuto"
                      width={100}
                      height={32}
                      className="mx-auto md:w-[120px] md:h-[40px]"
                    />
                  </motion.div>
                  <motion.h1 
                    className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2 md:mb-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {isSignUp ? '🔧 Cadastrar Oficina' : '⚙️ Oficina Login'}
                  </motion.h1>
            <motion.p 
              className="text-gray-600 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {isSignUp ? 'Crie sua conta e gerencie sua oficina' : 'Acesse seu painel profissional'}
            </motion.p>
          </div>

          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-6 relative z-10">
            
            {/* Plano da Oficina (Signup) */}
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  🎯 Escolha seu Plano
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    type="button"
                    onClick={() => setPlanType('free')}
                    className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                      planType === 'free' 
                        ? 'border-green-500 bg-green-50/80 text-green-700 shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300 bg-white/60'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="font-semibold">💎 FREE</div>
                    <div className="text-sm text-gray-600">Grátis para sempre</div>
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    onClick={() => setPlanType('pro')}
                    className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                      planType === 'pro' 
                        ? 'border-orange-500 bg-orange-50/80 text-orange-700 shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300 bg-white/60'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="font-semibold">⭐ PRO</div>
                    <div className="text-sm text-gray-600">7 dias grátis</div>
                  </motion.button>
                </div>
              </motion.div>
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
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg text-white font-semibold py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? '⏳ Carregando...' : (isSignUp ? '🚀 Criar Oficina' : '🔧 Entrar na Oficina')}
            </button>
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
    </div>
  )
}
