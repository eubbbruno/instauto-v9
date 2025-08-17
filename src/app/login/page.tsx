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

export default function MotoristaLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
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

      // Verificar se é motorista
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('type')
        .eq('id', data.user.id)
        .single()

      if (profileError || !profile || profile.type !== 'motorista') {
        setError('Esta conta não é de motorista')
        addToast({
          type: 'error',
          title: 'Acesso negado',
          message: 'Esta conta não é de motorista'
        })
        await supabase.auth.signOut()
        return
      }

      // Sucesso no login
      addToast({
        type: 'success',
        title: 'Login realizado!',
        message: `Bem-vindo de volta, motorista!`
      })

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
        addToast({
          type: 'success',
          title: 'Motorista cadastrado!',
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <div className="mx-auto mb-6">
              <Image
                src="/logo.svg"
                alt="InstaAuto"
                width={120}
                height={40}
                className="mx-auto"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isSignUp ? 'Cadastro Motorista' : 'Motorista Login'}
            </h1>
            <p className="text-gray-600">
              {isSignUp ? 'Crie sua conta de motorista' : 'Acesse o painel do motorista'}
            </p>
          </div>

          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email do Motorista
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="motorista@exemplo.com"
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

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
            >
              {isSignUp ? '🚗 Criar Conta Motorista' : '🚀 Entrar como Motorista'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {isSignUp ? '← Já tenho conta' : '✨ Criar conta de motorista'}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <Link
              href="/oficinas/login"
              className="text-orange-600 hover:text-orange-700 text-sm font-medium"
            >
              🔧 Sou Oficina
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}