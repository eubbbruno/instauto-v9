'use client'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import RouteGuard from '@/components/auth/RouteGuard'
import BeautifulSidebar from '@/components/BeautifulSidebar'
import ChatManager from '@/components/chat/ChatManager'
import ChatFloatingButton from '@/components/chat/ChatFloatingButton'
import { SkeletonDashboard } from '@/components/ui/skeleton'
import PushNotificationButton from '@/components/notifications/PushNotificationButton'
import { OnboardingProvider } from '@/components/onboarding/OnboardingManager'
import OnboardingTrigger from '@/components/onboarding/OnboardingTrigger'
import { useToastHelpers } from '@/components/ui/toast'
import { PageTransition, CardTransition, ListTransition, ListItem, ButtonTransition } from '@/components/ui/PageTransition'

export default function MotoristaClient() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { success, error, info } = useToastHelpers()
  
  useEffect(() => {
    checkUser()
  }, [])
  
  async function checkUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (!user) {
        error('Acesso negado', 'Você precisa estar logado')
        window.location.href = '/login'
        return
      }
      
      setUser(user)
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (profile?.type !== 'motorista') {
        error('Acesso negado', 'Esta área é exclusiva para motoristas')
        window.location.href = '/dashboard'
        return
      }
      
      setProfile(profile)
      success('Bem-vindo!', `Olá, ${profile.nome || profile.email}`)
    } catch (error) {
      console.error('Erro:', error)
      error('Erro de conexão', 'Não foi possível carregar seus dados')
    } finally {
      setLoading(false)
    }
  }
  
  const logout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <SkeletonDashboard />
      </div>
    )
  }
  
  return (
    <RouteGuard allowedUserTypes={['motorista']}>
      <OnboardingProvider userType="motorista" userId={user?.id || ''}>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <BeautifulSidebar 
          userType="motorista"
          userName={profile?.name || user?.email?.split('@')[0]}
          userEmail={user?.email}
          onLogout={logout}
        />
        
        {/* Conteúdo Principal */}
        <div className="flex-1 md:ml-64 transition-all duration-300">
        {/* Dashboard Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <PageTransition className="p-4 md:p-6 max-w-7xl">
              {/* Dashboard Home Content */}
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      🚗 Dashboard Motorista
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Bem-vindo de volta, {profile?.name || user?.email?.split('@')[0]}!
                    </p>
                  </div>
                  
                  {/* Push Notification Button */}
                  <div className="flex items-center space-x-3">
                    <OnboardingTrigger 
                      variant="button" 
                      showText={false}
                      className="text-sm"
                    />
                    <PushNotificationButton 
                      userId={user?.id}
                      className="text-sm"
                      showText={false}
                    />
                  </div>
                </div>

                {/* Onboarding Banner */}
                <OnboardingTrigger variant="banner" />

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                  <CardTransition delay={0.1}>
                    <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs md:text-sm font-medium text-gray-600">Veículos</p>
                          <p className="text-xl md:text-3xl font-bold text-gray-900">2</p>
                        </div>
                        <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg md:text-2xl">🚗</span>
                        </div>
                      </div>
                    </div>
                  </CardTransition>

                  <CardTransition delay={0.2}>
                    <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs md:text-sm font-medium text-gray-600">Agendamentos</p>
                          <p className="text-xl md:text-3xl font-bold text-gray-900">3</p>
                        </div>
                        <div className="w-8 h-8 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg md:text-2xl">📅</span>
                        </div>
                      </div>
                    </div>
                  </CardTransition>

                  <CardTransition delay={0.3}>
                    <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs md:text-sm font-medium text-gray-600">Favoritas</p>
                          <p className="text-xl md:text-3xl font-bold text-gray-900">8</p>
                        </div>
                        <div className="w-8 h-8 md:w-12 md:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg md:text-2xl">⭐</span>
                        </div>
                      </div>
                    </div>
                  </CardTransition>

                  <CardTransition delay={0.4}>
                    <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs md:text-sm font-medium text-gray-600">Gastos</p>
                          <p className="text-xl md:text-3xl font-bold text-gray-900">R$ 450</p>
                        </div>
                        <div className="w-8 h-8 md:w-12 md:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg md:text-2xl">💰</span>
                        </div>
                      </div>
                    </div>
                  </CardTransition>
                </div>

                {/* Quick Actions */}
                <CardTransition delay={0.5}>
                  <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Ações Rápidas</h3>
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                      <Link href="/motorista/buscar">
                        <ButtonTransition 
                          variant="lift"
                          className="w-full p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors text-center group"
                        >
                          <div className="text-2xl md:text-3xl mb-1 md:mb-2">🔍</div>
                          <p className="text-sm md:text-base font-medium text-blue-900">Buscar</p>
                          <p className="text-xs md:text-sm text-blue-600 hidden md:block">Encontre oficinas próximas</p>
                        </ButtonTransition>
                      </Link>

                      <Link href="/motorista/garagem">
                        <ButtonTransition 
                          variant="lift"
                          className="w-full p-3 md:p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors text-center group"
                        >
                          <div className="text-2xl md:text-3xl mb-1 md:mb-2">🚗</div>
                          <p className="text-sm md:text-base font-medium text-green-900">Garagem</p>
                          <p className="text-xs md:text-sm text-green-600 hidden md:block">Gerencie seus veículos</p>
                        </ButtonTransition>
                      </Link>

                      <Link href="/motorista/agendamentos">
                        <ButtonTransition 
                          variant="lift"
                          className="w-full p-3 md:p-4 bg-yellow-50 rounded-lg border border-yellow-200 hover:bg-yellow-100 transition-colors text-center group"
                        >
                          <div className="text-2xl md:text-3xl mb-1 md:mb-2">📅</div>
                          <p className="text-sm md:text-base font-medium text-yellow-900">Agenda</p>
                          <p className="text-xs md:text-sm text-yellow-600 hidden md:block">Veja seus serviços</p>
                        </ButtonTransition>
                      </Link>

                      <Link href="/motorista/emergencia">
                        <ButtonTransition 
                          variant="lift"
                          className="w-full p-3 md:p-4 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors text-center group"
                        >
                          <div className="text-2xl md:text-3xl mb-1 md:mb-2">🚨</div>
                          <p className="text-sm md:text-base font-medium text-red-900">Socorro</p>
                          <p className="text-xs md:text-sm text-red-600 hidden md:block">Socorro 24h</p>
                        </ButtonTransition>
                      </Link>
                    </div>
                  </div>
                </CardTransition>

                {/* IA Diagnóstico Rápido */}
                <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    🤖 Diagnóstico com IA
                  </h3>
                  <p className="text-purple-100 mb-4 text-sm">
                    Descreva os sintomas do seu veículo e receba um diagnóstico preliminar instantâneo
                  </p>
                  <Link
                    href="/motorista/diagnostico"
                    className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors text-sm font-medium"
                  >
                    Iniciar Diagnóstico
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Link>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Atividade Recente</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Serviço concluído - Troca de óleo</p>
                        <p className="text-sm text-gray-500">Oficina Central - Hoje às 14:30</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Agendamento confirmado - Revisão</p>
                        <p className="text-sm text-gray-500">AutoCenter Plus - Amanhã às 09:00</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Veículo adicionado - Honda Civic</p>
                        <p className="text-sm text-gray-500">Ontem às 16:45</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </PageTransition>
          </div>
        </div>
        </div>

        {/* Chat Components */}
        <ChatManager 
          userType="motorista"
          currentUserId={user?.id || ''}
        />

        {/* Onboarding & Tips */}
        {user && (
          <>
            <OnboardingTrigger variant="floating" />
          </>
        )}
      </div>
    </OnboardingProvider>
    </RouteGuard>
  )
}