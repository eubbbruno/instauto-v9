'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function RouteProtection({ 
  children, 
  allowedTypes 
}: { 
  children: React.ReactNode
  allowedTypes: string[]
}) {
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      console.log('🔍 [RouteProtection] Verificando auth...')
      
      // 1. Verificar sessão
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        console.log('❌ [RouteProtection] Sem sessão válida:', sessionError)
        router.push('/login')
        return
      }

      console.log('✅ [RouteProtection] Sessão encontrada:', session.user.email)

      // 2. Buscar profile COM RETRY (solução do Claude Web)
      let profile = null
      let attempts = 0
      
      while (!profile && attempts < 3) {
        console.log(`🔄 [RouteProtection] Tentativa ${attempts + 1} de buscar profile...`)
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (error) {
          console.error(`❌ [RouteProtection] Erro tentativa ${attempts + 1}:`, error)
        } else {
          profile = data
          console.log('✅ [RouteProtection] Profile encontrado:', profile)
        }
        
        attempts++
        
        if (!profile && attempts < 3) {
          console.log('⏳ [RouteProtection] Aguardando 1s antes da próxima tentativa...')
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }

      if (!profile) {
        console.error('❌ [RouteProtection] Profile não encontrado após 3 tentativas')
        alert('Erro: Profile não encontrado. Faça login novamente.')
        router.push('/login')
        return
      }

      // 3. Verificar permissão
      console.log(`🔐 [RouteProtection] Verificando permissão. Tipo: ${profile.type}, Permitidos: [${allowedTypes.join(', ')}]`)
      
      if (allowedTypes.includes(profile.type)) {
        console.log('✅ [RouteProtection] Acesso autorizado!')
        setAuthorized(true)
      } else {
        console.error('❌ [RouteProtection] Tipo não autorizado:', profile.type)
        alert(`Acesso negado. Tipo "${profile.type}" não permitido nesta página.`)
        
        // Redirecionar para dashboard correto
        if (profile.type === 'motorista') {
          router.push('/motorista')
        } else if (profile.type === 'admin') {
          router.push('/admin')
        } else if (profile.type === 'oficina') {
          router.push('/oficina-free')
        } else {
          router.push('/login')
        }
      }
    } catch (error) {
      console.error('💥 [RouteProtection] Erro geral:', error)
      alert('Erro inesperado na verificação de permissões.')
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">🔐 Verificando permissões...</p>
        </div>
      </div>
    )
  }

  if (!authorized) {
    return null
  }

  return <>{children}</>
}