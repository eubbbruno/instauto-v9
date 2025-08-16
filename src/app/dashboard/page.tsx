'use client'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import RouteProtection from '@/components/auth/RouteProtection'

function DashboardContent() {
  // Prevenir renderização no servidor
  const [isMounted, setIsMounted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    setIsMounted(true)
    checkUser()
  }, [])
  
  async function checkUser() {
    try {
      console.log('🔍 [DASHBOARD] Verificando usuário...')
      
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        console.error('❌ [DASHBOARD] Erro ao buscar usuário:', error)
        window.location.href = '/login'
        return
      }
      
      if (!user) {
        console.log('❌ [DASHBOARD] Nenhum usuário logado')
        window.location.href = '/login'
        return
      }
      
      console.log('✅ [DASHBOARD] Usuário encontrado:', user.email)
      setUser(user)
      
      // Buscar profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (profileError) {
        console.error('❌ [DASHBOARD] Erro ao buscar profile:', profileError)
        alert('Erro ao carregar perfil!')
        return
      }
      
      if (profile) {
        console.log('✅ [DASHBOARD] Profile carregado:', profile)
        
        // REDIRECIONAMENTO INTELIGENTE
        if (profile.type === 'admin') {
          console.log('🚀 [DASHBOARD] Admin detectado, redirecionando para /admin')
          window.location.href = '/admin'
          return
        } else if (profile.type === 'motorista') {
          console.log('🚀 [DASHBOARD] Motorista detectado, redirecionando para /motorista')
          window.location.href = '/motorista'
          return
        } else if (profile.type === 'oficina') {
          console.log('🚀 [DASHBOARD] Oficina detectada, redirecionando para oficina específica')
          // Buscar workshop para determinar plano
          const { data: workshop } = await supabase
            .from('workshops')
            .select('plan_type, is_trial, trial_ends_at')
            .eq('profile_id', profile.id)
            .single()
          
          if (workshop?.plan_type === 'pro') {
            window.location.href = '/oficina-pro'
          } else {
            window.location.href = '/oficina-free'
          }
          return
        }
        
        setProfile(profile)
      } else {
        console.log('⚠️ [DASHBOARD] Profile não encontrado')
        alert('Profile não encontrado!')
      }
      
    } catch (error) {
      console.error('💥 [DASHBOARD] Erro geral:', error)
      alert('Erro inesperado!')
    } finally {
      setLoading(false)
    }
  }
  
  const logout = async () => {
    try {
      console.log('🚪 [DASHBOARD] Fazendo logout...')
      await supabase.auth.signOut()
      window.location.href = '/login'
    } catch (error) {
      console.error('❌ [DASHBOARD] Erro no logout:', error)
    }
  }
  
  // Prevenir renderização no servidor
  if (!isMounted) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-600">🔄 Carregando dashboard...</p>
        </div>
      </div>
    )
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">❌ Erro ao carregar perfil</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Voltar ao Login
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard {profile.type === 'motorista' ? 'Motorista' : 'Oficina'}
              </h1>
              <p className="text-gray-600">Bem-vindo, {user.email}!</p>
            </div>
            <button 
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            
            {/* Debug Info */}
            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <h2 className="text-lg font-semibold text-green-800 mb-2">
                ✅ Dashboard Funcionando!
              </h2>
              <div className="text-sm text-green-700">
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Tipo:</strong> {profile.type}</p>
                <p><strong>Criado em:</strong> {new Date(profile.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Motorista Content */}
            {profile.type === 'motorista' && (
              <div className="bg-blue-50 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-blue-800 mb-4">
                  🚗 Painel do Motorista
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded shadow">
                    <h3 className="font-semibold mb-2">Veículos</h3>
                    <p className="text-gray-600">Gerencie seus veículos</p>
                  </div>
                  <div className="bg-white p-4 rounded shadow">
                    <h3 className="font-semibold mb-2">Agendamentos</h3>
                    <p className="text-gray-600">Seus próximos serviços</p>
                  </div>
                  <div className="bg-white p-4 rounded shadow">
                    <h3 className="font-semibold mb-2">Histórico</h3>
                    <p className="text-gray-600">Serviços realizados</p>
                  </div>
                </div>
              </div>
            )}

            {/* Oficina Content */}
            {profile.type === 'oficina' && (
              <div className="bg-amber-50 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-amber-800 mb-4">
                  🔧 Painel da Oficina
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded shadow">
                    <h3 className="font-semibold mb-2">Clientes</h3>
                    <p className="text-gray-600">Gerencie seus clientes</p>
                  </div>
                  <div className="bg-white p-4 rounded shadow">
                    <h3 className="font-semibold mb-2">Ordens de Serviço</h3>
                    <p className="text-gray-600">Serviços em andamento</p>
                  </div>
                  <div className="bg-white p-4 rounded shadow">
                    <h3 className="font-semibold mb-2">Relatórios</h3>
                    <p className="text-gray-600">Análise de performance</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <RouteProtection allowedTypes={['motorista', 'oficina']}>
      <DashboardContent />
    </RouteProtection>
  )
}