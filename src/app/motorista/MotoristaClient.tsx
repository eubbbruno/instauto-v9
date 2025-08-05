'use client'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

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
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-blue-600">Carregando painel do motorista...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header Motorista */}
      <div className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">🚗 Painel do Motorista</h1>
              <p className="text-blue-100">Bem-vindo, {user?.email}!</p>
            </div>
            <button 
              onClick={logout}
              className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded"
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
            <div className="text-3xl mb-2">🚙</div>
            <h3 className="text-lg font-semibold text-gray-700">Veículos</h3>
            <p className="text-3xl font-bold text-blue-600">2</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl mb-2">📅</div>
            <h3 className="text-lg font-semibold text-gray-700">Agendamentos</h3>
            <p className="text-3xl font-bold text-green-600">1</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl mb-2">🔧</div>
            <h3 className="text-lg font-semibold text-gray-700">Serviços</h3>
            <p className="text-3xl font-bold text-orange-600">5</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl mb-2">💰</div>
            <h3 className="text-lg font-semibold text-gray-700">Gasto Total</h3>
            <p className="text-3xl font-bold text-purple-600">R$ 850</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">🔍 Buscar Oficinas</h3>
            <p className="text-gray-600 mb-4">Encontre oficinas próximas para seus serviços</p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
              Buscar Agora
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">🚗 Meus Veículos</h3>
            <p className="text-gray-600 mb-4">Gerencie seus veículos e histórico</p>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
              Ver Veículos
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">📱 Emergência</h3>
            <p className="text-gray-600 mb-4">Precisa de ajuda urgente?</p>
            <button className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700">
              SOS Mecânico
            </button>
          </div>
          
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold text-gray-800">📋 Atividades Recentes</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              
              <div className="flex items-center p-4 bg-blue-50 rounded">
                <div className="text-2xl mr-4">✅</div>
                <div>
                  <p className="font-semibold">Revisão Completa - Honda Civic</p>
                  <p className="text-sm text-gray-600">Oficina Auto Center - Há 2 dias</p>
                </div>
                <div className="ml-auto text-green-600 font-bold">R$ 380</div>
              </div>
              
              <div className="flex items-center p-4 bg-yellow-50 rounded">
                <div className="text-2xl mr-4">⏰</div>
                <div>
                  <p className="font-semibold">Troca de Óleo Agendada</p>
                  <p className="text-sm text-gray-600">MegaMotors - Amanhã às 14h</p>
                </div>
                <div className="ml-auto text-blue-600 font-bold">R$ 120</div>
              </div>
              
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}