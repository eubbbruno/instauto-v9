'use client'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function OficinaProClient() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    checkUser()
  }, [])
  
  async function checkUser() {
    try {
      console.log('🔍 [OFICINA-PRO] Verificando usuário...')
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
      
      if (!profile) {
        console.error('❌ [OFICINA-PRO] Profile não encontrado!')
        window.location.href = '/login'
        return
      }
      
      if (profile.type !== 'oficina') {
        console.log('🔄 [OFICINA-PRO] Redirecionando motorista')
        window.location.href = '/motorista'
        return
      }
      
      console.log('✅ [OFICINA-PRO] Profile carregado:', profile)
      setProfile(profile)
    } catch (error) {
      console.error('❌ [OFICINA-PRO] Erro:', error)
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
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-yellow-600">Carregando painel PRO...</p>
        </div>
      </div>
    )
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">❌ Erro ao carregar perfil</div>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            Fazer Login Novamente
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      {/* Header Oficina PRO */}
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">💎 Oficina PRO</h1>
                <span className="bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">PREMIUM</span>
              </div>
              <p className="text-yellow-100">Bem-vindo, {user?.email}!</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-yellow-200 text-sm">Plano PRO Ativo</p>
                <p className="text-white font-bold">R$ 99/mês</p>
              </div>
              <button 
                onClick={logout}
                className="bg-yellow-700 hover:bg-yellow-800 px-4 py-2 rounded"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-8 px-4">
        
        {/* Pro Features Banner */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-6 mb-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">🚀 Recursos PRO Desbloqueados!</h2>
          <p className="text-green-100">Relatórios avançados, clientes ilimitados, WhatsApp integrado e suporte prioritário!</p>
        </div>

        {/* Stats Cards - PRO Ilimitado */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center border-l-4 border-yellow-500">
            <div className="text-3xl mb-2">👥</div>
            <h3 className="text-lg font-semibold text-gray-700">Clientes</h3>
            <p className="text-3xl font-bold text-blue-600">127</p>
            <p className="text-sm text-green-600">✨ Ilimitado (PRO)</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center border-l-4 border-green-500">
            <div className="text-3xl mb-2">📋</div>
            <h3 className="text-lg font-semibold text-gray-700">Ordens/Mês</h3>
            <p className="text-3xl font-bold text-green-600">89</p>
            <p className="text-sm text-green-600">✨ Ilimitado (PRO)</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center border-l-4 border-purple-500">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="text-lg font-semibold text-gray-700">Relatórios</h3>
            <p className="text-3xl font-bold text-purple-600">15</p>
            <p className="text-sm text-green-600">✨ Avançados (PRO)</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center border-l-4 border-green-500">
            <div className="text-3xl mb-2">💰</div>
            <h3 className="text-lg font-semibold text-gray-700">Faturamento</h3>
            <p className="text-3xl font-bold text-green-600">R$ 47.2k</p>
            <p className="text-sm text-green-600">✨ Este mês (PRO)</p>
          </div>
        </div>

        {/* Quick Actions - PRO */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <h3 className="text-xl font-bold mb-4 text-gray-800">📝 Nova Ordem</h3>
            <p className="text-gray-600 mb-4">Criar ordem com templates</p>
            <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700">
              Criar Ordem PRO
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <h3 className="text-xl font-bold mb-4 text-gray-800">👥 Clientes PRO</h3>
            <p className="text-gray-600 mb-4">Gestão avançada de clientes</p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
              Gerenciar Clientes
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <h3 className="text-xl font-bold mb-4 text-gray-800">📊 Relatórios</h3>
            <p className="text-gray-600 mb-4">Analytics e dashboards</p>
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700">
              Ver Relatórios
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <h3 className="text-xl font-bold mb-4 text-gray-800">📱 WhatsApp</h3>
            <p className="text-gray-600 mb-4">Integração WhatsApp Business</p>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
              Abrir WhatsApp
            </button>
          </div>
          
        </div>

        {/* Advanced Analytics - PRO Only */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="bg-white rounded-lg shadow border-l-4 border-yellow-500">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">📈 Performance Mensal</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Receita</span>
                  <span className="font-bold text-green-600">R$ 47.200</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ordens Concluídas</span>
                  <span className="font-bold text-blue-600">89</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Clientes Novos</span>
                  <span className="font-bold text-purple-600">23</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ticket Médio</span>
                  <span className="font-bold text-orange-600">R$ 530</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border-l-4 border-green-500">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">🔧 Ordens em Andamento</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                
                <div className="flex items-center p-4 bg-yellow-50 rounded">
                  <div className="text-2xl mr-4">🔧</div>
                  <div>
                    <p className="font-semibold">Motor Completo - BMW X3</p>
                    <p className="text-sm text-gray-600">Cliente VIP: Carlos Empresa - Urgente</p>
                  </div>
                  <div className="ml-auto text-right">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">Alta Prioridade</span>
                    <p className="text-sm font-bold text-green-600 mt-1">R$ 3.500</p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-blue-50 rounded">
                  <div className="text-2xl mr-4">⚡</div>
                  <div>
                    <p className="font-semibold">Diagnóstico Eletrônico</p>
                    <p className="text-sm text-gray-600">Audi A4 - Sistema ABS</p>
                  </div>
                  <div className="ml-auto text-right">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Em Progresso</span>
                    <p className="text-sm font-bold text-green-600 mt-1">R$ 800</p>
                  </div>
                </div>
                
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}