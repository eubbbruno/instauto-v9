'use client'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import BeautifulSidebar from '@/components/BeautifulSidebar'

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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <BeautifulSidebar 
        userType="motorista"
        userName={profile?.name || user?.email?.split('@')[0] || 'Motorista'}
        userEmail={user?.email}
        onLogout={logout}
      />
      
      {/* Main Content */}
      <div className="flex-1 md:ml-64 transition-all duration-300">

        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🚗 Dashboard Motorista</h1>
              <p className="text-gray-600">Bem-vindo, {profile?.name || user?.email}!</p>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-6">
          
          {/* Welcome Card */}
          <motion.div 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 mb-6 text-white relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-[30px]"></div>
            <div className="relative">
              <h2 className="text-2xl font-bold mb-2">Bem-vindo ao seu painel!</h2>
              <p className="text-blue-100">Gerencie seus veículos e encontre as melhores oficinas</p>
            </div>
          </motion.div>
        
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div 
              className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition-all"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-3xl mb-2">🚙</div>
              <h3 className="text-lg font-semibold text-gray-700">Veículos</h3>
              <p className="text-3xl font-bold text-blue-600">2</p>
            </motion.div>
          
            <motion.div 
              className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition-all"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-3xl mb-2">📅</div>
              <h3 className="text-lg font-semibold text-gray-700">Agendamentos</h3>
              <p className="text-3xl font-bold text-green-600">1</p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition-all"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-3xl mb-2">🔧</div>
              <h3 className="text-lg font-semibold text-gray-700">Serviços</h3>
              <p className="text-3xl font-bold text-orange-600">5</p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition-all"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-3xl mb-2">💰</div>
              <h3 className="text-lg font-semibold text-gray-700">Gasto Total</h3>
              <p className="text-3xl font-bold text-purple-600">R$ 850</p>
            </motion.div>
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
        </div>
      </div>
    </div>
  )
}