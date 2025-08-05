'use client'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function OficinaClient() {
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
      
      if (profile?.type !== 'oficina') {
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
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-orange-600">Carregando painel da oficina...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header Oficina */}
      <div className="bg-orange-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">🔧 Painel da Oficina</h1>
              <p className="text-orange-100">Bem-vindo, {user?.email}!</p>
            </div>
            <button 
              onClick={logout}
              className="bg-orange-700 hover:bg-orange-800 px-4 py-2 rounded"
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-8 px-4">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl mb-2">👥</div>
            <h3 className="text-lg font-semibold text-gray-700">Clientes</h3>
            <p className="text-3xl font-bold text-blue-600">48</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl mb-2">📋</div>
            <h3 className="text-lg font-semibold text-gray-700">Ordens Ativas</h3>
            <p className="text-3xl font-bold text-green-600">12</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl mb-2">📅</div>
            <h3 className="text-lg font-semibold text-gray-700">Agendamentos</h3>
            <p className="text-3xl font-bold text-orange-600">8</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl mb-2">💰</div>
            <h3 className="text-lg font-semibold text-gray-700">Faturamento</h3>
            <p className="text-3xl font-bold text-purple-600">R$ 15.2k</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">📝 Nova Ordem</h3>
            <p className="text-gray-600 mb-4">Criar nova ordem de serviço</p>
            <button className="w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700">
              Criar Ordem
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">👥 Clientes</h3>
            <p className="text-gray-600 mb-4">Gerenciar base de clientes</p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
              Ver Clientes
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">📊 Relatórios</h3>
            <p className="text-gray-600 mb-4">Análises e performance</p>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
              Ver Relatórios
            </button>
          </div>
          
        </div>

        {/* Recent Orders */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold text-gray-800">🔧 Ordens em Andamento</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              
              <div className="flex items-center p-4 bg-green-50 rounded">
                <div className="text-2xl mr-4">🔧</div>
                <div>
                  <p className="font-semibold">Revisão Geral - Honda Civic</p>
                  <p className="text-sm text-gray-600">Cliente: João Silva - Iniciado hoje</p>
                </div>
                <div className="ml-auto">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Em Andamento</span>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-yellow-50 rounded">
                <div className="text-2xl mr-4">⏰</div>
                <div>
                  <p className="font-semibold">Troca de Pastilhas - Corolla</p>
                  <p className="text-sm text-gray-600">Cliente: Maria Santos - Agendado para 15h</p>
                </div>
                <div className="ml-auto">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">Agendado</span>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-blue-50 rounded">
                <div className="text-2xl mr-4">🛠️</div>
                <div>
                  <p className="font-semibold">Motor - Diagnóstico</p>
                  <p className="text-sm text-gray-600">Cliente: Pedro Costa - Aguardando peças</p>
                </div>
                <div className="ml-auto">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Aguardando</span>
                </div>
              </div>
              
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}