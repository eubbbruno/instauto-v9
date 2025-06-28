'use client'

import { useEffect, useState, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'

function AuthCallbackContent() {
  const [status, setStatus] = useState(' Processando login...')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Erro ao obter sessão:', error)
          setStatus(` Erro: ${error.message}`)
          return
        }

        if (!data.session) {
          const code = searchParams.get('code')
          if (code) {
            setStatus(' Processando código de autorização...')
            
            const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
            
            if (sessionError) {
              console.error('Erro ao trocar código por sessão:', sessionError)
              setStatus(` Erro: ${sessionError.message}`)
              return
            }

            if (sessionData.session) {
              setStatus(' Login realizado com sucesso!')
              console.log('Usuário logado:', sessionData.session.user)
              
              setTimeout(() => {
                router.push('/oficinas')
              }, 2000)
              return
            }
          }
          
          setStatus(' Nenhuma sessão ou código encontrado')
          setTimeout(() => {
            router.push('/auth')
          }, 3000)
          return
        }

        setStatus(' Login realizado com sucesso!')
        console.log('Usuário logado:', data.session.user)
        
        setTimeout(() => {
          router.push('/oficinas')
        }, 2000)

      } catch (error: any) {
        console.error('Erro no callback:', error)
        setStatus(` Erro: ${error.message}`)
        
        setTimeout(() => {
          router.push('/auth')
        }, 3000)
      }
    }

    handleAuthCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
        <div className="text-6xl mb-4"></div>
        <h1 className="text-2xl font-bold mb-4">InstaAuto</h1>
        <div className="text-lg mb-4">{status}</div>
        
        {status.includes('sucesso') && (
          <div className="text-sm text-gray-600">
            Redirecionando para as oficinas...
          </div>
        )}
        
        {status.includes('') && (
          <div className="text-sm text-gray-600">
            Redirecionando para login...
          </div>
        )}
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
        <div className="text-6xl mb-4"></div>
        <h1 className="text-2xl font-bold mb-4">InstaAuto</h1>
        <div className="text-lg mb-4"> Carregando...</div>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthCallbackContent />
    </Suspense>
  )
}
