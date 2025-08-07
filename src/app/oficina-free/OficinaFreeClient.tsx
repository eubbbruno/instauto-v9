'use client'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import BeautifulSidebar from '@/components/BeautifulSidebar'
import { 
  CalendarDaysIcon, 
  ClipboardDocumentListIcon, 
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  PhoneIcon,
  ChatBubbleLeftIcon,
  ChartBarIcon,
  WrenchScrewdriverIcon,
  BellIcon,
  ArrowUpIcon,
  SparklesIcon,
  LockClosedIcon,
  GiftIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

// Dados mockados para o dashboard FREE
const mockData = {
  stats: {
    ordensHoje: { value: 8, change: +2, percentage: 18.5 },
    agendamentosHoje: { value: 5, change: +1, percentage: 14.3 },
    receitaHoje: { value: 1850, change: +280, percentage: 15.4 },
    clientesAtivos: { value: 8, change: +2, percentage: 8.3 }
  },
  agendamentosHoje: [
    {
      id: '1',
      cliente: 'João Silva',
      servico: 'Troca de óleo',
      horario: '09:00',
      veiculo: 'Honda Civic 2020',
      telefone: '(11) 98765-4321',
      status: 'confirmado'
    },
    {
      id: '2',
      cliente: 'Maria Santos',
      servico: 'Revisão básica',
      horario: '10:30',
      veiculo: 'Toyota Corolla 2019',
      telefone: '(11) 91234-5678',
      status: 'confirmado'
    }
  ],
  limitesPlano: {
    clientesMax: 10,
    clientesAtual: 8,
    ordensMax: 30,
    ordensAtual: 22
  }
}

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
      
      setProfile(profile)
      
      // Verificar se é realmente oficina
      if (profile?.type === 'motorista') {
        console.log('🚗 [OFICINA-FREE] Motorista detectado, redirecionando...')
        window.location.href = '/motorista'
        return
      }
      
      console.log('✅ [OFICINA-FREE] Oficina FREE carregada:', profile)
      
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
  
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="hidden md:block w-64 h-screen bg-gradient-to-b from-emerald-800 to-green-600"></div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dashboard...</p>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Beautiful Sidebar */}
      <BeautifulSidebar 
        userType="oficina-free"
        userName={profile?.name || user?.email?.split('@')[0] || 'Oficina'}
        userEmail={user?.email}
        onLogout={logout}
      />
      
      {/* Main Content */}
      <div className="flex-1 md:ml-64 transition-all duration-300">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🆓 Dashboard Oficina FREE</h1>
              <p className="text-gray-600">Bem-vindo, {profile?.name || user?.email}!</p>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-6">
          
          {/* Upgrade Banner */}
          <motion.div 
            className="mb-6 p-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg text-white relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-[30px]"></div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    🎯 Plano FREE Ativo
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                      {mockData.limitesPlano.clientesAtual}/{mockData.limitesPlano.clientesMax} clientes
                    </span>
                  </h2>
                  <p className="text-green-100">Aproveite todas as funcionalidades básicas!</p>
                </div>
                <Link href="/oficina-free/upgrade">
                  <button className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-300 transition-all transform hover:scale-105 flex items-center gap-2">
                    <SparklesIcon className="w-5 h-5" />
                    Upgrade PRO
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div 
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all border border-gray-100"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-4xl mb-3">👥</div>
              <h3 className="text-lg font-semibold text-gray-700">Clientes Ativos</h3>
              <p className="text-3xl font-bold text-green-600">{mockData.stats.clientesAtivos.value}</p>
              <div className="flex items-center justify-center mt-2 text-sm">
                <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600">+{mockData.stats.clientesAtivos.change} hoje</span>
              </div>
              <div className="mt-2 bg-green-100 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: `${(mockData.limitesPlano.clientesAtual/mockData.limitesPlano.clientesMax)*100}%`}}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{mockData.limitesPlano.clientesAtual}/{mockData.limitesPlano.clientesMax} limite FREE</p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all border border-gray-100"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-4xl mb-3">📋</div>
              <h3 className="text-lg font-semibold text-gray-700">Ordens Hoje</h3>
              <p className="text-3xl font-bold text-blue-600">{mockData.stats.ordensHoje.value}</p>
              <div className="flex items-center justify-center mt-2 text-sm">
                <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600">+{mockData.stats.ordensHoje.change} hoje</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all border border-gray-100"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-4xl mb-3">📅</div>
              <h3 className="text-lg font-semibold text-gray-700">Agendamentos</h3>
              <p className="text-3xl font-bold text-orange-600">{mockData.stats.agendamentosHoje.value}</p>
              <div className="flex items-center justify-center mt-2 text-sm">
                <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600">+{mockData.stats.agendamentosHoje.change} hoje</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all border border-gray-100 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-4xl mb-3">💰</div>
              <h3 className="text-lg font-semibold text-gray-700">Receita Hoje</h3>
              <p className="text-3xl font-bold text-purple-600">R$ {mockData.stats.receitaHoje.value.toLocaleString()}</p>
              <div className="flex items-center justify-center mt-2 text-sm">
                <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600">+R$ {mockData.stats.receitaHoje.change}</span>
              </div>
              <div className="absolute top-3 right-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Ações Rápidas */}
            <motion.div 
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <WrenchScrewdriverIcon className="w-6 h-6 text-green-600" />
                Ações Rápidas
              </h3>
              <div className="space-y-3">
                <Link href="/oficina-free/ordens">
                  <button className="w-full p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 text-left font-medium transition-all transform hover:scale-[1.02]">
                    📝 Nova Ordem de Serviço
                  </button>
                </Link>
                <Link href="/oficina-free/clientes">
                  <button className="w-full p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 text-left font-medium transition-all transform hover:scale-[1.02]">
                    👤 Cadastrar Cliente
                  </button>
                </Link>
                <Link href="/oficina-free/agendamentos">
                  <button className="w-full p-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 text-left font-medium transition-all transform hover:scale-[1.02]">
                    📅 Ver Agendamentos
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Agendamentos Hoje */}
            <motion.div 
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <CalendarDaysIcon className="w-6 h-6 text-blue-600" />
                Agendamentos Hoje
              </h3>
              <div className="space-y-4">
                {mockData.agendamentosHoje.map((agendamento, index) => (
                  <div key={agendamento.id} className="p-4 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">{agendamento.cliente}</p>
                        <p className="text-sm text-gray-600">{agendamento.servico}</p>
                        <p className="text-xs text-gray-500">{agendamento.veiculo}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{agendamento.horario}</p>
                        <p className="text-xs text-green-600">✓ Confirmado</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Link href="/oficina-free/agendamentos">
                  <button className="w-full p-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-green-500 hover:text-green-600 transition-all">
                    + Ver todos agendamentos
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Upgrade PRO Card */}
            <motion.div 
              className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-xl shadow-lg p-6 text-white relative overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/5 rounded-full"></div>
              
              <div className="relative">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <StarIcon className="w-6 h-6" />
                  Upgrade PRO
                </h3>
                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4" />
                    <span>Clientes ilimitados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4" />
                    <span>Relatórios avançados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4" />
                    <span>WhatsApp Business</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4" />
                    <span>Controle financeiro</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4" />
                    <span>Suporte prioritário</span>
                  </div>
                </div>
                <Link href="/oficina-free/upgrade">
                  <button className="w-full bg-white text-orange-600 py-3 px-4 rounded-xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                    <SparklesIcon className="w-5 h-5" />
                    Ver Planos - R$ 99/mês
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}