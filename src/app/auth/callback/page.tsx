'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { SocialAuthManager } from '@/lib/auth-social'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Processando autenticação...')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔄 Processando callback de autenticação...')
        
        // Obter parâmetros da URL
        const userType = searchParams.get('type')
        const oficinaPlano = searchParams.get('plan')
        const returnUrl = searchParams.get('return_url')
        
        // Obter sessão atual
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('❌ Erro ao obter sessão:', sessionError)
          throw sessionError
        }
        
        if (!session?.user) {
          console.error('❌ Nenhuma sessão encontrada')
          throw new Error('Nenhuma sessão de autenticação encontrada')
        }
        
        console.log('✅ Sessão encontrada:', session.user.id)
        setMessage('Criando seu perfil...')
        
        // Processar callback e criar perfil
        const profile = await SocialAuthManager.handleOAuthCallback(
          session.user,
          userType || undefined,
          oficinaPlano || undefined
        )
        
        if (!profile) {
          throw new Error('Erro ao criar perfil do usuário')
        }
        
        console.log('✅ Perfil processado:', profile)
        setStatus('success')
        setMessage('Login realizado com sucesso!')
        
        // Aguardar um momento para mostrar sucesso
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Determinar redirecionamento
        let redirectUrl = returnUrl
        
        if (!redirectUrl) {
          if (profile.type === 'motorista') {
            redirectUrl = '/motorista'
          } else if (profile.type === 'oficina') {
            // Verificar plano da oficina
            const { data: workshop } = await supabase
              .from('workshops')
              .select('plan_type, trial_ends_at')
              .eq('id', profile.id)
              .single()
            
            if (workshop?.plan_type === 'pro') {
              redirectUrl = '/dashboard'
            } else {
              redirectUrl = '/oficina-free'
            }
          } else {
            redirectUrl = '/dashboard'
          }
        }
        
        console.log('🔄 Redirecionando para:', redirectUrl)
        router.push(redirectUrl)
        
      } catch (error) {
        console.error('❌ Erro no callback:', error)
        setStatus('error')
        setMessage(error instanceof Error ? error.message : 'Erro desconhecido')
        
        // Redirecionar para login após erro
        setTimeout(() => {
          router.push('/login?error=auth_callback_failed')
        }, 3000)
      }
    }
    
    handleAuthCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 text-center"
        >
          {/* Logo */}
          <div className="mb-6">
            <Image
              src="/images/logo.svg"
              alt="InstaAuto"
              width={80}
              height={80}
              className="mx-auto"
            />
          </div>
          
          {/* Status Icon */}
          <div className="mb-6">
            {status === 'loading' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-yellow-500 rounded-full flex items-center justify-center text-white text-2xl"
              >
                ⚡
              </motion.div>
            )}
            
            {status === 'success' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center text-white text-2xl"
              >
                ✅
              </motion.div>
            )}
            
            {status === 'error' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-16 h-16 mx-auto bg-red-500 rounded-full flex items-center justify-center text-white text-2xl"
              >
                ❌
              </motion.div>
            )}
          </div>
          
          {/* Message */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {status === 'loading' && 'Processando...'}
            {status === 'success' && 'Sucesso!'}
            {status === 'error' && 'Ops! Algo deu errado'}
          </h2>
          
          <p className="text-gray-600 mb-6">
            {message}
          </p>
          
          {/* Loading Animation */}
          {status === 'loading' && (
            <div className="flex justify-center space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                  className="w-3 h-3 bg-blue-500 rounded-full"
                />
              ))}
            </div>
          )}
          
          {/* Error Actions */}
          {status === 'error' && (
            <div className="space-y-3">
              <button
                onClick={() => router.push('/login')}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all"
              >
                Tentar Novamente
              </button>
              <p className="text-sm text-gray-500">
                Redirecionando automaticamente em alguns segundos...
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
