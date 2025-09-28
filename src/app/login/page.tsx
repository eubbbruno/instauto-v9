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

export default function MotoristaLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
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

      // Verificar se é motorista
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('type')
        .eq('id', data.user.id)
        .single()

      if (profileError || !profile || profile.type !== 'motorista') {
        setError('Esta conta não é de motorista')
        showError('Esta conta não é de motorista')
        await supabase.auth.signOut()
        return
      }

      // Sucesso no login
      success('Login realizado! Bem-vindo de volta, motorista!')

      // Redirecionar para dashboard motorista
      router.push('/motorista')

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
            user_type: 'motorista'
          }
        }
      })

      if (authError) {
        setError(authError.message)
        return
      }

      if (data.user) {
        success('Motorista cadastrado! Agora faça login para acessar seu painel.')
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
        {/* Desktop Image Side */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 z-10"></div>
          <Image
            src="/images/motorista.png"
            alt="Motorista Feliz"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute bottom-8 left-8 z-20 text-white">
            <h2 className="text-3xl font-bold mb-2">Bem-vindo, Motorista!</h2>
            <p className="text-blue-100 text-lg">Encontre as melhores oficinas da sua região</p>
          </div>
        </div>

        {/* Form Side */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
          <div className="max-w-md w-full">
            {/* Mobile Image */}
            <CardTransition>
              <div className="lg:hidden mb-4 md:mb-6 relative h-28 md:h-32 rounded-xl overflow-hidden">
                <Image
                  src="/images/motorista.png"
                  alt="Motorista"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-indigo-600/30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white font-semibold text-sm md:text-base">Motoristas InstaAuto</p>
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
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 -z-10"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-200/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-200/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
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
                    className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2 md:mb-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {isSignUp ? '🚗 Cadastro Motorista' : '🚀 Motorista Login'}
                  </motion.h1>
                  <motion.p 
                    className="text-gray-600 text-sm md:text-base lg:text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {isSignUp ? 'Crie sua conta e encontre as melhores oficinas' : 'Acesse seu painel personalizado'}
                  </motion.p>
                </div>

                <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4 md:space-y-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                📧 Email do Motorista
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-3 md:px-4 md:py-4 lg:px-5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm md:text-base"
                placeholder="motorista@exemplo.com"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                🔒 Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-3 md:px-4 md:py-4 lg:px-5 pr-12 md:pr-14 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm md:text-base"
                  placeholder="••••••••"
                  required
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors p-1"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </motion.button>
              </div>
            </motion.div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2.5 md:px-4 md:py-3 rounded-lg text-sm md:text-base">
                {error}
              </div>
            )}

            <ButtonTransition>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-200 text-white font-semibold text-base md:text-lg py-3 md:py-4 rounded-xl border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '⏳ Carregando...' : (isSignUp ? '🚗 Criar Conta Motorista' : '🚀 Entrar como Motorista')}
                </button>
              </motion.div>
            </ButtonTransition>
                </form>

                {/* OAuth Buttons */}
                <CardTransition delay={0.2}>
                  <OAuthButtons userType="motorista" />
                </CardTransition>

                <div className="mt-4 md:mt-6 text-center">
                  <ButtonTransition>
                    <button
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm md:text-base"
                    >
                      {isSignUp ? '← Já tenho conta' : '✨ Criar conta de motorista'}
                    </button>
                  </ButtonTransition>
                </div>

                <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200 text-center">
                  <Link
                    href="/oficinas/login"
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                  >
                    🔧 Sou Oficina
                  </Link>
                </div>
              </motion.div>
            </CardTransition>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}