"use client"

import { useEffect, useState, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { useSearchParams } from 'next/navigation'

function NewCallbackContent() {
  const [status, setStatus] = useState('🔄 Processando login...')
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('🚀 [NEW_CALLBACK] Iniciando...')
        
        // Capturar parâmetros da URL
        const userType = searchParams.get('type') || 'motorista'
        const planType = searchParams.get('plan_type') || 'free'
        
        console.log('🎯 [NEW_CALLBACK] Parâmetros:', { userType, planType })
        
        // Verificar se temos uma sessão válida
        const { data: { session }, error: sessionError } = await supabase!.auth.getSession()
        
        if (sessionError) {
          console.error('❌ [NEW_CALLBACK] Erro na sessão:', sessionError)
          setStatus('❌ Erro ao processar login')
          setTimeout(() => window.location.href = '/auth', 3000)
          return
        }

        if (!session?.user) {
          console.log('⚠️ [NEW_CALLBACK] Sem sessão, redirecionando...')
          setStatus('⚠️ Redirecionando...')
          setTimeout(() => window.location.href = '/auth', 2000)
          return
        }

        console.log('✅ [NEW_CALLBACK] Sessão válida:', session.user.id)
        setStatus('✅ Login realizado com sucesso!')

        // Se é oficina, converter o profile (que foi criado como motorista por padrão)
        if (userType === 'oficina') {
          console.log('🔧 [NEW_CALLBACK] Convertendo para oficina...')
          setStatus('🔧 Configurando sua oficina...')
          
          const { error: convertError } = await supabase!.rpc('convert_to_workshop', {
            user_id: session.user.id,
            plan_type: planType
          })

          if (convertError) {
            console.error('❌ [NEW_CALLBACK] Erro ao converter para oficina:', convertError)
            setStatus('❌ Erro ao configurar oficina')
            setTimeout(() => window.location.href = '/auth', 3000)
            return
          }

          console.log('✅ [NEW_CALLBACK] Oficina configurada com sucesso!')
          setStatus('✅ Oficina configurada com sucesso!')
        }

        // Aguardar um pouco para sincronização
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Redirecionar baseado no tipo
        let redirectUrl = '/motorista' // padrão
        
        if (userType === 'oficina') {
          redirectUrl = planType === 'pro' ? '/dashboard' : '/oficina-basica'
        }

        console.log('🎯 [NEW_CALLBACK] Redirecionando para:', redirectUrl)
        setStatus(`🎯 Redirecionando para ${userType === 'oficina' ? 'sua oficina' : 'seu dashboard'}...`)
        
        // Redirecionar
        window.location.href = redirectUrl

      } catch (error) {
        console.error('❌ [NEW_CALLBACK] Erro geral:', error)
        setStatus('❌ Erro inesperado')
        setTimeout(() => window.location.href = '/auth', 3000)
      }
    }

    handleCallback()
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Quase lá!
          </h1>
          <p className="text-gray-600">
            {status}
          </p>
        </div>
        
        <div className="text-sm text-gray-500">
          Você será redirecionado automaticamente...
        </div>
      </div>
    </div>
  )
}

export default function NewCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    }>
      <NewCallbackContent />
    </Suspense>
  )
} 