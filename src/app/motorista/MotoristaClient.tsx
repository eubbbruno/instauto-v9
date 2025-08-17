'use client'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import BeautifulSidebar from '@/components/BeautifulSidebar'
import ChatManager from '@/components/chat/ChatManager'
import ChatFloatingButton from '@/components/chat/ChatFloatingButton'
import { SkeletonDashboardAdvanced } from '@/components/ui/SkeletonAdvanced'
import PushNotificationButton from '@/components/notifications/PushNotificationButton'

export default function MotoristaClient() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    checkUser()
  }, [])
  
  async function checkUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (!user) {
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
        window.location.href = '/dashboard'
        return
      }
      
      setProfile(profile)
    } catch (error) {
      console.error('Erro:', error)
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
        <SkeletonDashboardAdvanced />
      </div>
    )
  }
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <BeautifulSidebar 
        userType="motorista"
        userName={profile?.name || user?.email?.split('@')[0]}
        userEmail={user?.email}
        onLogout={logout}
      />
      
      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col">
        {/* Dashboard Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-4 md:p-6 max-w-7xl">
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
                    <PushNotificationButton 
                      userId={user?.id}
                      className="text-sm"
                      showText={false}
                    />
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Veículos</p>
                        <p className="text-3xl font-bold text-gray-900">2</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🚗</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Agendamentos</p>
                        <p className="text-3xl font-bold text-gray-900">3</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">📅</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Oficinas Favoritas</p>
                        <p className="text-3xl font-bold text-gray-900">8</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">⭐</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Gastos (Mês)</p>
                        <p className="text-3xl font-bold text-gray-900">R$ 450</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">💰</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Ações Rápidas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <a
                      href="/motorista/buscar"
                      className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors text-center group"
                    >
                      <div className="text-3xl mb-2">🔍</div>
                      <p className="font-medium text-blue-900">Buscar Oficinas</p>
                      <p className="text-sm text-blue-600">Encontre oficinas próximas</p>
                    </a>

                    <a
                      href="/motorista/garagem"
                      className="p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors text-center group"
                    >
                      <div className="text-3xl mb-2">🚗</div>
                      <p className="font-medium text-green-900">Minha Garagem</p>
                      <p className="text-sm text-green-600">Gerencie seus veículos</p>
                    </a>

                    <a
                      href="/motorista/agendamentos"
                      className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 hover:bg-yellow-100 transition-colors text-center group"
                    >
                      <div className="text-3xl mb-2">📅</div>
                      <p className="font-medium text-yellow-900">Agendamentos</p>
                      <p className="text-sm text-yellow-600">Veja seus serviços</p>
                    </a>

                    <a
                      href="/motorista/emergencia"
                      className="p-4 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors text-center group"
                    >
                      <div className="text-3xl mb-2">🚨</div>
                      <p className="font-medium text-red-900">Emergência</p>
                      <p className="text-sm text-red-600">Socorro 24h</p>
                    </a>
                  </div>
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
            </div>
          </div>
        </div>
      </div>

      {/* Chat Components */}
      <ChatManager />
      <ChatFloatingButton />
    </div>
  )
}