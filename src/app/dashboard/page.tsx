'use client'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import RouteProtection from '@/components/auth/RouteProtection'
import { useToastHelpers } from '@/components/ui/toast'
import { SkeletonDashboard } from '@/components/ui/skeleton'
import { PageTransition, CardTransition, ButtonTransition } from '@/components/ui/PageTransition'

function DashboardContent() {
  // Prevenir renderização no servidor
  const [isMounted, setIsMounted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { success, error } = useToastHelpers()
  
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
        error('Erro ao verificar autenticação')
        window.location.href = '/login'
        return
      }
      
      if (!user) {
        console.log('❌ [DASHBOARD] Nenhum usuário logado')
        error('Usuário não autenticado')
        window.location.href = '/login'
        return
      }
      
      console.log('✅ [DASHBOARD] Usuário encontrado:', user.email)
      success(`Bem-vindo, ${user.email}!`)
      setUser(user)
      
      // Buscar profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (profileError) {
        console.error('❌ [DASHBOARD] Erro ao buscar profile:', profileError)
        error('Erro ao carregar perfil!')
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
    return <SkeletonDashboard />
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
    <PageTransition>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <CardTransition>
          <div className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4 md:py-6">
                <div>
                  <h1 className="text-xl md:text-3xl font-bold text-gray-900">
                    Dashboard {profile.type === 'motorista' ? 'Motorista' : 'Oficina'}
                  </h1>
                  <p className="text-sm md:text-base text-gray-600">Bem-vindo, {user.email}!</p>
                </div>
                <ButtonTransition>
                  <button 
                    onClick={logout}
                    className="bg-red-500 text-white px-3 py-2 md:px-4 md:py-2 rounded text-sm md:text-base hover:bg-red-600 transition-colors"
                  >
                    Sair
                  </button>
                </ButtonTransition>
              </div>
            </div>
          </div>
        </CardTransition>

        {/* Content */}
        <div className="max-w-7xl mx-auto py-4 md:py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-4 md:py-6 sm:px-0">
            <CardTransition>
              <div className="border-4 border-dashed border-gray-200 rounded-lg p-4 md:p-8">
                
                {/* Debug Info */}
                <CardTransition delay={0.1}>
                  <div className="bg-green-50 p-3 md:p-4 rounded-lg mb-4 md:mb-6">
                    <h2 className="text-base md:text-lg font-semibold text-green-800 mb-2">
                      ✅ Dashboard Funcionando!
                    </h2>
                    <div className="text-xs md:text-sm text-green-700">
                      <p><strong>User ID:</strong> {user.id}</p>
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Tipo:</strong> {profile.type}</p>
                      <p><strong>Criado em:</strong> {new Date(profile.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardTransition>

                {/* Motorista Content */}
                {profile.type === 'motorista' && (
                  <CardTransition delay={0.2}>
                    <div className="bg-blue-50 p-4 md:p-6 rounded-lg">
                      <h2 className="text-lg md:text-2xl font-bold text-blue-800 mb-3 md:mb-4">
                        🚗 Painel do Motorista
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                        <CardTransition delay={0.3}>
                          <div className="bg-white p-3 md:p-4 rounded shadow hover:shadow-md transition-shadow">
                            <h3 className="font-semibold mb-2 text-sm md:text-base">Veículos</h3>
                            <p className="text-gray-600 text-xs md:text-sm">Gerencie seus veículos</p>
                          </div>
                        </CardTransition>
                        <CardTransition delay={0.4}>
                          <div className="bg-white p-3 md:p-4 rounded shadow hover:shadow-md transition-shadow">
                            <h3 className="font-semibold mb-2 text-sm md:text-base">Agendamentos</h3>
                            <p className="text-gray-600 text-xs md:text-sm">Seus próximos serviços</p>
                          </div>
                        </CardTransition>
                        <CardTransition delay={0.5}>
                          <div className="bg-white p-3 md:p-4 rounded shadow hover:shadow-md transition-shadow">
                            <h3 className="font-semibold mb-2 text-sm md:text-base">Histórico</h3>
                            <p className="text-gray-600 text-xs md:text-sm">Serviços realizados</p>
                          </div>
                        </CardTransition>
                      </div>
                    </div>
                  </CardTransition>
                )}

                {/* Oficina Content */}
                {profile.type === 'oficina' && (
                  <CardTransition delay={0.2}>
                    <div className="bg-amber-50 p-4 md:p-6 rounded-lg">
                      <h2 className="text-lg md:text-2xl font-bold text-amber-800 mb-3 md:mb-4">
                        🔧 Painel da Oficina
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                        <CardTransition delay={0.3}>
                          <div className="bg-white p-3 md:p-4 rounded shadow hover:shadow-md transition-shadow">
                            <h3 className="font-semibold mb-2 text-sm md:text-base">Clientes</h3>
                            <p className="text-gray-600 text-xs md:text-sm">Gerencie seus clientes</p>
                          </div>
                        </CardTransition>
                        <CardTransition delay={0.4}>
                          <div className="bg-white p-3 md:p-4 rounded shadow hover:shadow-md transition-shadow">
                            <h3 className="font-semibold mb-2 text-sm md:text-base">Ordens de Serviço</h3>
                            <p className="text-gray-600 text-xs md:text-sm">Serviços em andamento</p>
                          </div>
                        </CardTransition>
                        <CardTransition delay={0.5}>
                          <div className="bg-white p-3 md:p-4 rounded shadow hover:shadow-md transition-shadow">
                            <h3 className="font-semibold mb-2 text-sm md:text-base">Relatórios</h3>
                            <p className="text-gray-600 text-xs md:text-sm">Análise de performance</p>
                          </div>
                        </CardTransition>
                      </div>
                    </div>
                  </CardTransition>
                )}

              </div>
            </CardTransition>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default function Dashboard() {
  return (
    <RouteProtection allowedTypes={['motorista', 'oficina']}>
      <DashboardContent />
    </RouteProtection>
  )
}