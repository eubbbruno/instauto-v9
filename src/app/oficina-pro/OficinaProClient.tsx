'use client'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import RouteGuard from '@/components/auth/RouteGuard'
import BeautifulSidebar from '@/components/BeautifulSidebar'
import ChatManager from '@/components/chat/ChatManager'
import AnalyticsDashboard from '@/components/ai/AnalyticsDashboard'
import AIDiagnosticSystem from '@/components/ai/AIDiagnosticSystem'
import AIControlPanel from '@/components/ai/AIControlPanel'
import { OnboardingProvider } from '@/components/onboarding/OnboardingManager'
import ChatFloatingButton from '@/components/chat/ChatFloatingButton'
import TrialBanner from '@/components/TrialBanner'
import { 
  ArrowUpIcon,
  PlusIcon,
  SparklesIcon,
  ClockIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  StarIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  ChartBarIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  BellIcon,
  ShieldCheckIcon,
  TrophyIcon,
  FireIcon,
  BoltIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import Link from 'next/link'

// Dados mockados para dashboard PRO
const mockDataPro = {
  stats: {
    faturamentoMes: { value: 45280, change: +8420, percentage: 22.8 },
    ordensCompletas: { value: 127, change: +23, percentage: 18.1 },
    clientesAtivos: { value: 342, change: +45, percentage: 15.1 },
    ticketMedio: { value: 356, change: +28, percentage: 8.5 }
  },
  agendamentosHoje: [
    {
      id: '1',
      cliente: 'João Silva',
      servico: 'Revisão Completa + Troca de Freios',
      horario: '09:00',
      veiculo: 'BMW X3 2021',
      valor: 1200,
      status: 'confirmado',
      prioridade: 'alta'
    },
    {
      id: '2',
      cliente: 'Maria Fernanda Santos',
      servico: 'Diagnóstico Eletrônico + Reparo',
      horario: '10:30',
      veiculo: 'Mercedes C180 2020',
      valor: 850,
      status: 'confirmado',
      prioridade: 'normal'
    },
    {
      id: '3',
      cliente: 'Carlos Alberto Costa',
      servico: 'Manutenção Preventiva',
      horario: '14:00',
      veiculo: 'Audi A4 2019',
      valor: 650,
      status: 'pendente',
      prioridade: 'baixa'
    }
  ],
  topClientes: [
    { nome: 'João Silva', gastoMes: 2400, ordens: 3, fidelidade: 24 },
    { nome: 'Maria Santos', gastoMes: 1800, ordens: 2, fidelidade: 18 },
    { nome: 'Carlos Costa', gastoMes: 1200, ordens: 2, fidelidade: 12 }
  ],
  performanceEquipe: [
    { tecnico: 'Roberto Lima', ordens: 23, rating: 4.9, eficiencia: 94 },
    { tecnico: 'Ana Paula', ordens: 18, rating: 4.8, eficiencia: 91 },
    { tecnico: 'Fernando Souza', ordens: 15, rating: 4.7, eficiencia: 88 }
  ],
  alertas: [
    { tipo: 'estoque', mensagem: 'Pastilhas de freio em baixo estoque (5 unidades)', urgencia: 'alta' },
    { tipo: 'agendamento', mensagem: '3 clientes aguardando confirmação', urgencia: 'media' },
    { tipo: 'pagamento', mensagem: '2 faturas vencendo hoje', urgencia: 'alta' }
  ]
}

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
      
      setProfile(profile)
      
      // Verificar se é realmente oficina
      if (profile?.type === 'motorista') {
        console.log('🚗 [OFICINA-PRO] Motorista detectado, redirecionando...')
        window.location.href = '/motorista'
        return
      }
      
      console.log('✅ [OFICINA-PRO] Oficina PRO carregada:', profile)
      
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
      <div className="flex min-h-screen bg-gray-50">
        <div className="hidden md:block w-64 h-screen bg-gradient-to-b from-blue-800 to-blue-600"></div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-yellow-200 border-t-yellow-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dashboard PRO...</p>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <RouteGuard allowedUserTypes={['oficina-pro']}>
      <OnboardingProvider userType="oficina-pro" userId={user?.id || ''}>
      <div className="flex min-h-screen bg-gray-50">
        {/* Beautiful Sidebar PRO */}
        <BeautifulSidebar 
        userType="oficina-pro"
        userName={profile?.name || user?.email?.split('@')[0] || 'Oficina PRO'}
        userEmail={user?.email}
        onLogout={logout}
      />
      
      {/* Main Content */}
      <div className="flex-1 transition-all duration-300 ml-0 md:ml-60">
        {/* Trial Banner */}
        {user && (
          <div className="px-4 md:px-6 pt-4">
            <TrialBanner 
              userId={user.id} 
              className="mb-4"
            />
          </div>
        )}

        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                💎 Dashboard Oficina PRO 
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  PREMIUM
                </span>
              </h1>
              <p className="text-gray-600">Bem-vindo, {profile?.name || user?.email}!</p>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-4 md:p-6 max-w-7xl">
          
          {/* Welcome Card PRO */}
          <motion.div 
            className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 mb-6 text-white relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Elementos decorativos */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-[30px]"></div>
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-[30px]"></div>
            <div className="absolute bottom-0 right-0 opacity-10">
              <svg width="180" height="100" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M169 47C169 73.5097 147.51 95 121 95C94.4903 95 73 73.5097 73 47C73 20.4903 94.4903 -1 121 -1C147.51 -1 169 20.4903 169 47Z" stroke="white" strokeWidth="2"/>
                <path d="M142 141C142 167.51 120.51 189 94 189C67.4903 189 46 167.51 46 141C46 114.49 67.4903 93 94 93C120.51 93 142 114.49 142 141Z" stroke="white" strokeWidth="2"/>
                <path d="M118 93C91.4903 93 70 71.5097 70 45L94 45C94 58.2548 104.745 69 118 69V93Z" fill="white"/>
                <path d="M94 141C94 114.49 72.5097 93 46 93L46 117C59.2548 117 70 127.745 70 141H94Z" fill="white"/>
              </svg>
            </div>
            
            <div className="flex flex-col lg:flex-row justify-between items-start gap-4 relative">
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold mb-2 flex items-center">
                  <TrophyIcon className="w-8 h-8 mr-3" />
                  Plano PRO Ativo
                  <ShieldCheckIcon className="w-6 h-6 ml-2 text-yellow-300" />
                </h2>
                <p className="text-blue-100 mb-4">
                  Acesso completo a todas as funcionalidades premium. Você está no controle total da sua oficina!
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">✨ Clientes Ilimitados</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">📊 Analytics Avançado</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">💰 Gestão Financeira</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Link href="/oficina-pro/relatorios">
                  <button className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/30 transition-all flex items-center gap-2">
                    <ChartBarIcon className="w-5 h-5" />
                    <span className="hidden md:inline">Ver Relatórios</span>
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        
          {/* Analytics IA PRO */}
          <div className="mb-8">
            <AnalyticsDashboard userType="oficina-pro" />
          </div>

          {/* IA Control Panel PRO */}
          <div className="mb-8">
            <AIControlPanel workshopId={user?.id || ''} />
          </div>

          {/* Stats Cards PRO */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            <motion.div 
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-bl-3xl"></div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <CurrencyDollarIcon className="w-8 h-8 text-green-600" />
                </div>
                <div className="flex items-center text-green-600 text-sm font-semibold">
                  <ArrowUpIcon className="w-4 h-4 mr-1" />
                  +{mockDataPro.stats.faturamentoMes.percentage}%
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-700">Faturamento Mês</h3>
              <p className="text-3xl font-bold text-gray-900">R$ {mockDataPro.stats.faturamentoMes.value.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">+R$ {mockDataPro.stats.faturamentoMes.change.toLocaleString()} vs mês anterior</p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-bl-3xl"></div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <CheckCircleIcon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex items-center text-blue-600 text-sm font-semibold">
                  <ArrowUpIcon className="w-4 h-4 mr-1" />
                  +{mockDataPro.stats.ordensCompletas.percentage}%
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-700">Ordens Completas</h3>
              <p className="text-3xl font-bold text-gray-900">{mockDataPro.stats.ordensCompletas.value}</p>
              <p className="text-sm text-blue-600 mt-1">+{mockDataPro.stats.ordensCompletas.change} este mês</p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-bl-3xl"></div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <UserGroupIcon className="w-8 h-8 text-purple-600" />
                </div>
                <div className="flex items-center text-purple-600 text-sm font-semibold">
                  <ArrowUpIcon className="w-4 h-4 mr-1" />
                  +{mockDataPro.stats.clientesAtivos.percentage}%
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-700">Clientes Ativos</h3>
              <p className="text-3xl font-bold text-gray-900">{mockDataPro.stats.clientesAtivos.value}</p>
              <p className="text-sm text-purple-600 mt-1">+{mockDataPro.stats.clientesAtivos.change} novos este mês</p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 rounded-bl-3xl"></div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <FireIcon className="w-8 h-8 text-yellow-600" />
                </div>
                <div className="flex items-center text-yellow-600 text-sm font-semibold">
                  <ArrowUpIcon className="w-4 h-4 mr-1" />
                  +{mockDataPro.stats.ticketMedio.percentage}%
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-700">Ticket Médio</h3>
              <p className="text-3xl font-bold text-gray-900">R$ {mockDataPro.stats.ticketMedio.value}</p>
              <p className="text-sm text-yellow-600 mt-1">+R$ {mockDataPro.stats.ticketMedio.change} vs mês anterior</p>
            </motion.div>
          </div>

          {/* Advanced Analytics Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            
            {/* Agendamentos Premium */}
            <motion.div 
              className="xl:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-100"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <CalendarIcon className="w-6 h-6 text-blue-600" />
                  Agendamentos Hoje
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-bold">
                    {mockDataPro.agendamentosHoje.length}
                  </span>
                </h3>
                <Link href="/oficina-pro/agendamentos">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Ver todos →</button>
                </Link>
              </div>
              
              <div className="space-y-4">
                {mockDataPro.agendamentosHoje.map((agendamento, index) => (
                  <div key={agendamento.id} className={`p-4 rounded-xl border-l-4 ${
                    agendamento.prioridade === 'alta' ? 'border-red-500 bg-red-50' :
                    agendamento.prioridade === 'normal' ? 'border-yellow-500 bg-yellow-50' :
                    'border-green-500 bg-green-50'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-800">{agendamento.cliente}</p>
                          <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                            agendamento.status === 'confirmado' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {agendamento.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{agendamento.servico}</p>
                        <p className="text-xs text-gray-500">{agendamento.veiculo}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900">{agendamento.horario}</p>
                        <p className="text-sm font-semibold text-green-600">R$ {agendamento.valor}</p>
                        <div className={`w-2 h-2 rounded-full mt-1 ml-auto ${
                          agendamento.prioridade === 'alta' ? 'bg-red-500' :
                          agendamento.prioridade === 'normal' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Alertas Inteligentes */}
            <motion.div 
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <BellIcon className="w-6 h-6 text-yellow-600" />
                Alertas Inteligentes
              </h3>
              <div className="space-y-3">
                {mockDataPro.alertas.map((alerta, index) => (
                  <div key={index} className={`p-3 rounded-lg border-l-4 ${
                    alerta.urgencia === 'alta' ? 'border-red-500 bg-red-50' :
                    'border-yellow-500 bg-yellow-50'
                  }`}>
                    <div className="flex items-start gap-2">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        alerta.urgencia === 'alta' ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{alerta.mensagem}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {alerta.tipo === 'estoque' ? '📦 Estoque' :
                           alerta.tipo === 'agendamento' ? '📅 Agendamento' :
                           '💰 Financeiro'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link href="/oficina-pro/alertas">
                <button className="w-full mt-4 p-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-yellow-500 hover:text-yellow-600 transition-all">
                  + Ver todos alertas
                </button>
              </Link>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Top Clientes */}
            <motion.div 
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <StarIconSolid className="w-6 h-6 text-yellow-500" />
                Top Clientes do Mês
              </h3>
              <div className="space-y-4">
                {mockDataPro.topClientes.map((cliente, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        'bg-yellow-400'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{cliente.nome}</p>
                        <p className="text-sm text-gray-500">{cliente.ordens} ordens • {cliente.fidelidade} meses</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">R$ {cliente.gastoMes.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">este mês</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Performance da Equipe */}
            <motion.div 
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <BoltIcon className="w-6 h-6 text-purple-600" />
                Performance da Equipe
              </h3>
              <div className="space-y-4">
                {mockDataPro.performanceEquipe.map((tecnico, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-800">{tecnico.tecnico}</p>
                      <div className="flex items-center gap-1">
                        <StarIconSolid className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">{tecnico.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>{tecnico.ordens} ordens</span>
                      <span>{tecnico.eficiencia}% eficiência</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${tecnico.eficiencia}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Components */}
      {user && (
        <ChatManager 
          userType="oficina-pro"
          currentUserId={user.id}
        />
      )}

      {/* IA Diagnostic System - EXCLUSIVO PRO */}
      {user && (
        <AIDiagnosticSystem 
          workshopId={user.id}
          onServiceSuggested={(suggestion) => {
            console.log('Serviço sugerido pela IA:', suggestion)
            // Integração avançada com sistema de orçamentos
          }}
        />
      )}

      {/* Realtime Chat */}
      {user && (
        <ChatFloatingButton
          currentUserId={user.id}
          currentUserType="oficina"
          position="bottom-left"
        />
      )}

      </div>
    </OnboardingProvider>
    </RouteGuard>
  )
}