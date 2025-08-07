'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import BeautifulSidebar from '@/components/BeautifulSidebar'
import { 
  CalendarDaysIcon,
  ClockIcon,
  PhoneIcon,
  UserIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  LockClosedIcon,
  StarIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

interface Agendamento {
  id: string
  cliente: {
    nome: string
    telefone: string
    email: string
  }
  veiculo: {
    marca: string
    modelo: string
    ano: number
    placa: string
  }
  servicos: string[]
  dataHora: string
  status: 'agendado' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado'
  valorEstimado: number
  observacoes?: string
  duracao: string
}

const mockAgendamentos: Agendamento[] = [
  {
    id: 'AGD-001',
    cliente: {
      nome: 'João Silva',
      telefone: '(11) 99999-9999',
      email: 'joao@email.com'
    },
    veiculo: {
      marca: 'Honda',
      modelo: 'Civic',
      ano: 2020,
      placa: 'ABC-1234'
    },
    servicos: ['Troca de óleo', 'Filtro de ar'],
    dataHora: '2025-01-17T09:00:00',
    status: 'confirmado',
    valorEstimado: 150,
    duracao: '1h',
    observacoes: 'Cliente prefere atendimento pela manhã'
  },
  {
    id: 'AGD-002',
    cliente: {
      nome: 'Maria Santos',
      telefone: '(11) 88888-8888',
      email: 'maria@email.com'
    },
    veiculo: {
      marca: 'Toyota',
      modelo: 'Corolla',
      ano: 2019,
      placa: 'DEF-5678'
    },
    servicos: ['Revisão básica'],
    dataHora: '2025-01-17T14:00:00',
    status: 'agendado',
    valorEstimado: 120,
    duracao: '45min'
  },
  {
    id: 'AGD-003',
    cliente: {
      nome: 'Pedro Costa',
      telefone: '(11) 77777-7777',
      email: 'pedro@email.com'
    },
    veiculo: {
      marca: 'Volkswagen',
      modelo: 'Gol',
      ano: 2018,
      placa: 'GHI-9012'
    },
    servicos: ['Troca de pastilhas', 'Verificação freios'],
    dataHora: '2025-01-18T10:30:00',
    status: 'agendado',
    valorEstimado: 280,
    duracao: '2h'
  },
  {
    id: 'AGD-004',
    cliente: {
      nome: 'Ana Oliveira',
      telefone: '(11) 66666-6666',
      email: 'ana@email.com'
    },
    veiculo: {
      marca: 'Fiat',
      modelo: 'Uno',
      ano: 2017,
      placa: 'JKL-3456'
    },
    servicos: ['Alinhamento', 'Balanceamento'],
    dataHora: '2025-01-16T16:00:00',
    status: 'concluido',
    valorEstimado: 180,
    duracao: '1h30'
  }
]

const statusConfig = {
  agendado: { 
    label: 'Agendado', 
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: CalendarDaysIcon 
  },
  confirmado: { 
    label: 'Confirmado', 
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: CheckCircleIcon 
  },
  em_andamento: { 
    label: 'Em Andamento', 
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: ClockIcon 
  },
  concluido: { 
    label: 'Concluído', 
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: CheckCircleIcon 
  },
  cancelado: { 
    label: 'Cancelado', 
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: XCircleIcon 
  }
}

export default function AgendamentosClient() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(mockAgendamentos)
  const [filtroStatus, setFiltroStatus] = useState<string>('todos')
  const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Limite FREE
  const maxAgendamentos = 50
  const currentAgendamentos = agendamentos.length

  // Filtrar agendamentos
  const agendamentosFiltrados = agendamentos.filter(agendamento => {
    if (filtroStatus === 'todos') return true
    return agendamento.status === filtroStatus
  })

  // Estatísticas
  const stats = {
    total: agendamentos.length,
    hoje: agendamentos.filter(a => {
      const hoje = new Date().toDateString()
      const agendamento = new Date(a.dataHora).toDateString()
      return agendamento === hoje
    }).length,
    confirmados: agendamentos.filter(a => a.status === 'confirmado').length,
    concluidos: agendamentos.filter(a => a.status === 'concluido').length,
    faturamento: agendamentos
      .filter(a => a.status === 'concluido')
      .reduce((sum, a) => sum + a.valorEstimado, 0)
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      data: date.toLocaleDateString('pt-BR'),
      hora: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
  }

  const updateStatus = (id: string, newStatus: Agendamento['status']) => {
    setAgendamentos(prev => 
      prev.map(agendamento => 
        agendamento.id === id 
          ? { ...agendamento, status: newStatus }
          : agendamento
      )
    )
  }

  // Verificar se está próximo do limite
  const isNearLimit = currentAgendamentos >= maxAgendamentos * 0.8
  const isAtLimit = currentAgendamentos >= maxAgendamentos

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BeautifulSidebar 
        userType="oficina-free"
        userName="Oficina FREE"
        userEmail="oficina@email.com"
        onLogout={() => {}}
      />
      
      <div className="flex-1 md:ml-64 transition-all duration-300">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📅 Agendamentos</h1>
              <p className="text-gray-600">Gerencie seus agendamentos (Plano FREE)</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Contador de limite */}
              <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
                isAtLimit ? 'bg-red-100 text-red-800' : 
                isNearLimit ? 'bg-yellow-100 text-yellow-800' : 
                'bg-green-100 text-green-800'
              }`}>
                {currentAgendamentos}/{maxAgendamentos} agendamentos
              </div>
              
              <button 
                disabled={isAtLimit}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                  isAtLimit 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                }`}
              >
                <PlusIcon className="w-5 h-5" />
                {isAtLimit ? 'Limite Atingido' : 'Novo Agendamento'}
              </button>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-6">

              {/* Alerta de Limite */}
              {(isNearLimit || isAtLimit) && (
                <motion.div 
                  className={`mb-6 p-4 rounded-xl border-l-4 ${
                    isAtLimit 
                      ? 'bg-red-50 border-red-500' 
                      : 'bg-yellow-50 border-yellow-500'
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-3">
                    <ExclamationTriangleIcon className={`w-6 h-6 ${
                      isAtLimit ? 'text-red-600' : 'text-yellow-600'
                    }`} />
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        isAtLimit ? 'text-red-800' : 'text-yellow-800'
                      }`}>
                        {isAtLimit 
                          ? 'Limite de agendamentos atingido!' 
                          : 'Você está próximo do limite de agendamentos'
                        }
                      </h3>
                      <p className={`text-sm ${
                        isAtLimit ? 'text-red-700' : 'text-yellow-700'
                      }`}>
                        {isAtLimit 
                          ? `Faça upgrade para o plano PRO para ter agendamentos ilimitados.`
                          : `Você tem ${maxAgendamentos - currentAgendamentos} slots restantes.`
                        }
                      </p>
                    </div>
                    <Link href="/oficina-free/upgrade">
                      <button className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        isAtLimit 
                          ? 'bg-red-600 text-white hover:bg-red-700' 
                          : 'bg-yellow-600 text-white hover:bg-yellow-700'
                      }`}>
                        Fazer Upgrade
                      </button>
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Total</h3>
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <CalendarDaysIcon className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: `${(currentAgendamentos/maxAgendamentos)*100}%`}}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{currentAgendamentos}/{maxAgendamentos} limite FREE</p>
                </motion.div>

                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Hoje</h3>
                    <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                      <ClockIcon className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{stats.hoje}</p>
                  <p className="text-xs text-gray-500 mt-1">Agendamentos hoje</p>
                </motion.div>

                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Confirmados</h3>
                    <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                      <CheckCircleIcon className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{stats.confirmados}</p>
                  <p className="text-xs text-gray-500 mt-1">Confirmados</p>
                </motion.div>

                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Concluídos</h3>
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                      <CheckCircleIcon className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{stats.concluidos}</p>
                  <p className="text-xs text-gray-500 mt-1">Este mês</p>
                </motion.div>

                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 relative"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Faturamento</h3>
                    <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                      <CalendarDaysIcon className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">R$ {stats.faturamento}</p>
                  <p className="text-xs text-gray-500 mt-1">Este mês</p>

                  {/* Funcionalidade PRO */}
                  <div className="absolute inset-0 bg-gray-100/80 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <LockClosedIcon className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">PRO</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Filtros */}
              <motion.div 
                className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Filtros</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'todos', label: 'Todos' },
                    { key: 'agendado', label: 'Agendados' },
                    { key: 'confirmado', label: 'Confirmados' },
                    { key: 'em_andamento', label: 'Em Andamento' },
                    { key: 'concluido', label: 'Concluídos' }
                  ].map((filtro) => (
                    <button
                      key={filtro.key}
                      onClick={() => setFiltroStatus(filtro.key)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        filtroStatus === filtro.key
                          ? 'bg-green-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {filtro.label}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Lista de Agendamentos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {agendamentosFiltrados.map((agendamento, index) => {
                  const statusInfo = statusConfig[agendamento.status]
                  const StatusIcon = statusInfo.icon
                  const dateTime = formatDateTime(agendamento.dataHora)

                  return (
                    <motion.div
                      key={agendamento.id}
                      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {/* Header do Card */}
                      <div className="p-6 border-b border-gray-100">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{agendamento.id}</h3>
                            <p className="text-sm text-gray-600">{agendamento.cliente.nome}</p>
                          </div>
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                            <StatusIcon className="h-4 w-4 mr-1.5" />
                            {statusInfo.label}
                          </span>
                        </div>
                        
                        {/* Data e Hora */}
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <CalendarDaysIcon className="h-4 w-4" />
                            <span>{dateTime.data}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ClockIcon className="h-4 w-4" />
                            <span>{dateTime.hora}</span>
                          </div>
                          <span className="text-blue-600 font-medium">({agendamento.duracao})</span>
                        </div>
                      </div>

                      {/* Conteúdo do Card */}
                      <div className="p-6 space-y-4">
                        {/* Veículo */}
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <TruckIcon className="h-4 w-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">Veículo</span>
                          </div>
                          <p className="font-medium">{agendamento.veiculo.marca} {agendamento.veiculo.modelo} {agendamento.veiculo.ano}</p>
                          <p className="text-sm text-gray-600">{agendamento.veiculo.placa}</p>
                        </div>

                        {/* Serviços */}
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Serviços:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {agendamento.servicos.map((servico, idx) => (
                              <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md bg-green-100 text-xs text-green-700">
                                {servico}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Valor e Contato */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <PhoneIcon className="h-4 w-4 text-gray-600" />
                            <span className="text-sm text-gray-600">{agendamento.cliente.telefone}</span>
                          </div>
                          <span className="font-bold text-green-600 text-lg">
                            R$ {agendamento.valorEstimado.toFixed(2).replace('.', ',')}
                          </span>
                        </div>

                        {/* Observações */}
                        {agendamento.observacoes && (
                          <div className="bg-blue-50 rounded-lg p-3">
                            <p className="text-sm text-blue-800">{agendamento.observacoes}</p>
                          </div>
                        )}

                        {/* Ações */}
                        <div className="flex gap-2 pt-2">
                          <button 
                            onClick={() => {
                              setSelectedAgendamento(agendamento)
                              setShowModal(true)
                            }}
                            className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                          >
                            <EyeIcon className="h-4 w-4" />
                            Ver Detalhes
                          </button>
                          
                          {agendamento.status === 'agendado' && (
                            <button 
                              onClick={() => updateStatus(agendamento.id, 'confirmado')}
                              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all"
                            >
                              Confirmar
                            </button>
                          )}
                          
                          {agendamento.status === 'confirmado' && (
                            <button 
                              onClick={() => updateStatus(agendamento.id, 'em_andamento')}
                              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                              Iniciar
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Empty State */}
              {agendamentosFiltrados.length === 0 && (
                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-12 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <CalendarDaysIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Nenhum agendamento encontrado</h3>
                  <p className="text-gray-500 mb-6">Tente ajustar os filtros ou criar um novo agendamento</p>
                  <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all inline-flex items-center gap-2">
                    <PlusIcon className="h-5 w-5" />
                    Novo Agendamento
                  </button>
                </motion.div>
              )}

              {/* Banner de Upgrade */}
              <motion.div 
                className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                      <StarIcon className="w-6 h-6" />
                      Upgrade para PRO
                    </h3>
                    <p className="text-green-100">Agendamentos ilimitados, calendário avançado, relatórios de faturamento e muito mais!</p>
                  </div>
                  <Link href="/oficina-free/upgrade">
                    <button className="bg-white text-green-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all">
                      Ver Planos
                    </button>
                  </Link>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes */}
      {showModal && selectedAgendamento && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div 
            className="bg-white max-w-2xl w-full rounded-xl shadow-xl max-h-[90vh] overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {/* Modal Header */}
            <div className="bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedAgendamento.id}</h2>
                  <p className="text-sm text-gray-600 mt-1">Detalhes do agendamento</p>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircleIcon className="h-6 w-6 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6 space-y-6 max-h-[70vh]">
              {/* Cliente */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2 text-gray-600" />
                  Cliente
                </h3>
                <div className="space-y-2">
                  <p className="text-sm"><span className="text-gray-600">Nome:</span> <span className="font-medium">{selectedAgendamento.cliente.nome}</span></p>
                  <p className="text-sm"><span className="text-gray-600">Telefone:</span> <span className="font-medium">{selectedAgendamento.cliente.telefone}</span></p>
                  <p className="text-sm"><span className="text-gray-600">Email:</span> <span className="font-medium">{selectedAgendamento.cliente.email}</span></p>
                </div>
              </div>

              {/* Agendamento */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <CalendarDaysIcon className="h-5 w-5 mr-2 text-gray-600" />
                  Agendamento
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-600">Data</p>
                    <p className="font-medium">{formatDateTime(selectedAgendamento.dataHora).data}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Horário</p>
                    <p className="font-medium">{formatDateTime(selectedAgendamento.dataHora).hora}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duração</p>
                    <p className="font-medium">{selectedAgendamento.duracao}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Valor</p>
                    <p className="font-medium text-green-600">R$ {selectedAgendamento.valorEstimado}</p>
                  </div>
                </div>
              </div>

              {/* Serviços */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Serviços</h3>
                <div className="space-y-2">
                  {selectedAgendamento.servicos.map((servico, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-gray-700">{servico}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-white border-t border-gray-200 p-6">
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Fechar
                </button>
                <button className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                  <PencilIcon className="h-5 w-5" />
                  Editar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
