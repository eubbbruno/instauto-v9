'use client'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function OficinaFreeClient() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    checkUser()
  }, [])
  
  async function checkUser() {
    try {
      console.log('🔍 [OFICINA-FREE] Verificando usuário...')
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
        console.error('❌ [OFICINA-FREE] Profile não encontrado!')
        window.location.href = '/login'
        return
      }
      
      if (profile.type !== 'oficina') {
        console.log('🔄 [OFICINA-FREE] Redirecionando motorista')
        window.location.href = '/motorista'
        return
      }
      
      console.log('✅ [OFICINA-FREE] Profile carregado:', profile)
      setProfile(profile)
    } catch (error) {
      console.error('❌ [OFICINA-FREE] Erro:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const logout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }
  
  const upgradeToProDemo = () => {
    alert('🚀 Demo: Upgrade para PRO!\n\nEm breve: Integração com pagamento real.\nPor enquanto, isso seria um redirecionamento para página de pagamento.')
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-green-600">Carregando painel da oficina...</p>
        </div>
      </div>
    )
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">❌ Erro ao carregar perfil</div>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Fazer Login Novamente
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-green-50">
      {/* Header Oficina FREE */}
      <div className="bg-green-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">🔧 Oficina FREE</h1>
                <span className="bg-green-700 px-3 py-1 rounded-full text-sm font-semibold">GRATUITO</span>
              </div>
              <p className="text-green-100">Bem-vindo, {user?.email}!</p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={upgradeToProDemo}
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded font-bold"
              >
                ⭐ UPGRADE PRO
              </button>
              <button 
                onClick={logout}
                className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-8 px-4">
        
        {/* Upgrade Banner */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-6 mb-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">💎 Desbloqueie Recursos PRO!</h2>
          <p className="text-yellow-100 mb-4">Relatórios avançados, mais clientes, WhatsApp integrado e muito mais!</p>
          <button 
            onClick={upgradeToProDemo}
            className="bg-white text-orange-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100"
          >
            🚀 Assinar PRO - R$ 99/mês
          </button>
        </div>

        {/* Stats Cards - Limitado FREE */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl mb-2">👥</div>
            <h3 className="text-lg font-semibold text-gray-700">Clientes</h3>
            <p className="text-3xl font-bold text-green-600">8</p>
            <p className="text-sm text-gray-500">Máx: 10 (FREE)</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl mb-2">📋</div>
            <h3 className="text-lg font-semibold text-gray-700">Ordens/Mês</h3>
            <p className="text-3xl font-bold text-orange-600">23</p>
            <p className="text-sm text-gray-500">Máx: 30 (FREE)</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center relative">
            <div className="absolute top-2 right-2">🔒</div>
            <div className="text-3xl mb-2 opacity-50">📊</div>
            <h3 className="text-lg font-semibold text-gray-400">Relatórios</h3>
            <p className="text-2xl font-bold text-gray-400">PRO</p>
            <p className="text-sm text-yellow-600">Upgrade p/ desbloquear</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center relative">
            <div className="absolute top-2 right-2">🔒</div>
            <div className="text-3xl mb-2 opacity-50">📱</div>
            <h3 className="text-lg font-semibold text-gray-400">WhatsApp</h3>
            <p className="text-2xl font-bold text-gray-400">PRO</p>
            <p className="text-sm text-yellow-600">Upgrade p/ desbloquear</p>
          </div>
        </div>

        {/* Quick Actions - FREE */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">📝 Nova Ordem</h3>
            <p className="text-gray-600 mb-4">Criar nova ordem de serviço</p>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
              Criar Ordem
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">👥 Clientes</h3>
            <p className="text-gray-600 mb-4">Gerenciar clientes (até 10)</p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
              Ver Clientes
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 relative">
            <div className="absolute top-4 right-4">🔒</div>
            <h3 className="text-xl font-bold mb-4 text-gray-400">📊 Relatórios PRO</h3>
            <p className="text-gray-400 mb-4">Análises avançadas (PRO)</p>
            <button 
              onClick={upgradeToProDemo}
              className="w-full bg-yellow-500 text-black py-2 px-4 rounded hover:bg-yellow-600 font-bold"
            >
              🚀 Desbloquear PRO
            </button>
          </div>
          
        </div>

        {/* Recent Orders */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold text-gray-800">🔧 Ordens Recentes</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              
              <div className="flex items-center p-4 bg-green-50 rounded">
                <div className="text-2xl mr-4">🔧</div>
                <div>
                  <p className="font-semibold">Revisão Geral - Honda Civic</p>
                  <p className="text-sm text-gray-600">Cliente: João Silva - Hoje</p>
                </div>
                <div className="ml-auto">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Concluído</span>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-blue-50 rounded">
                <div className="text-2xl mr-4">⏰</div>
                <div>
                  <p className="font-semibold">Troca de Óleo - Corolla</p>
                  <p className="text-sm text-gray-600">Cliente: Maria - Amanhã 14h</p>
                </div>
                <div className="ml-auto">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Agendado</span>
                </div>
              </div>
              
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}