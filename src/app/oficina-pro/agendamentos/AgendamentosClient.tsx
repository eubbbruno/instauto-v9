'use client'
import { useState, useMemo } from 'react'
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
  StarIcon,
  EyeIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  BellIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

interface Agendamento {
  id: string
  cliente: {
    nome: string
    telefone: string
    email: string
    isVIP: boolean
  }
  veiculo: {
    marca: string
    modelo: string
    ano: number
    placa: string
  }
  servicos: {
    nome: string
    valor: number
    duracao: string
  }[]
  dataHora: string
  status: 'agendado' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado'
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente'
  valorTotal: number
  observacoes?: string
  duracaoTotal: string
  tecnico?: string
}

const mockAgendamentos: Agendamento[] = [
  {
    id: 'AGD-PRO-001',
    cliente: {
      nome: 'Ricardo Almeida',
      telefone: '(11) 99999-9999',
      email: 'ricardo@email.com',
      isVIP: true
    },
    veiculo: {
      marca: 'BMW',
      modelo: 'X3',
      ano: 2021,
      placa: 'ABC-1234'
    },
    servicos: [
      { nome: 'Revisão completa', valor: 800, duracao: '2h' },
      { nome: 'Troca de filtros', valor: 200, duracao: '30min' },
      { nome: 'Diagnóstico eletrônico', valor: 300, duracao: '1h' }
    ],
    dataHora: '2025-01-17T09:00:00',
    status: 'confirmado',
    prioridade: 'alta',
    valorTotal: 1300,
    duracaoTotal: '3h30',
    tecnico: 'Carlos Silva',
    observacoes: 'Cliente VIP - atendimento prioritário'
  },
  {
    id: 'AGD-PRO-002',
    cliente: {
      nome: 'Maria Fernanda Santos',
      telefone: '(11) 88888-8888',
      email: 'maria@email.com',
      isVIP: false
    },
    veiculo: {
      marca: 'Mercedes',
      modelo: 'C180',
      ano: 2020,
      placa: 'DEF-5678'
    },
    servicos: [
      { nome: 'Manutenção preventiva', valor: 650, duracao: '2h' }
    ],
    dataHora: '2025-01-17T14:00:00',
    status: 'agendado',
    prioridade: 'media',
    valorTotal: 650,
    duracaoTotal: '2h',
    tecnico: 'João Pereira'
  },
  {
    id: 'AGD-PRO-003',
    cliente: {
      nome: 'Pedro Costa Neto',
      telefone: '(11) 77777-7777',
      email: 'pedro@email.com',
      isVIP: true
    },
    veiculo: {
      marca: 'Audi',
      modelo: 'A4',
      ano: 2019,
      placa: 'GHI-9012'
    },
    servicos: [
      { nome: 'Reparo sistema de freios', valor: 1200, duracao: '4h' },
      { nome: 'Alinhamento', valor: 150, duracao: '1h' }
    ],
    dataHora: '2025-01-18T08:00:00',
    status: 'em_andamento',
    prioridade: 'urgente',
    valorTotal: 1350,
    duracaoTotal: '5h',
    tecnico: 'Roberto Santos',
    observacoes: 'Urgente - cliente viaja hoje à noite'
  },
  {
    id: 'AGD-PRO-004',
    cliente: {
      nome: 'Ana Costa',
      telefone: '(11) 66666-6666',
      email: 'ana@email.com',
      isVIP: false
    },
    veiculo: {
      marca: 'Volvo',
      modelo: 'XC60',
      ano: 2022,
      placa: 'JKL-3456'
    },
    servicos: [
      { nome: 'Revisão 10.000km', valor: 450, duracao: '1h30' }
    ],
    dataHora: '2025-01-16T16:00:00',
    status: 'concluido',
    prioridade: 'baixa',
    valorTotal: 450,
    duracaoTotal: '1h30',
    tecnico: 'Marcos Lima'
  },
  {
    id: 'AGD-PRO-005',
    cliente: {
      nome: 'Fernando Silva',
      telefone: '(11) 55555-5555',
      email: 'fernando@email.com',
      isVIP: true
    },
    veiculo: {
      marca: 'Porsche',
      modelo: 'Cayenne',
      ano: 2020,
      placa: 'MNO-7890'
    },
    servicos: [
      { nome: 'Manutenção premium', valor: 2500, duracao: '6h' }
    ],
    dataHora: '2025-01-19T08:00:00',
    status: 'agendado',
    prioridade: 'alta',
    valorTotal: 2500,
    duracaoTotal: '6h',
    tecnico: 'Especialista Premium',
    observacoes: 'Veículo de luxo - usar peças originais'
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
    icon: ArrowPathIcon 
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

const prioridadeConfig = {
  baixa: { label: 'Baixa', color: 'bg-gray-500' },
  media: { label: 'Média', color: 'bg-yellow-500' },
  alta: { label: 'Alta', color: 'bg-orange-500' },
  urgente: { label: 'Urgente', color: 'bg-red-500' }
}

export default function AgendamentosClient() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(mockAgendamentos)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroStatus, setFiltroStatus] = useState<string>('todos')
  const [filtroPrioridade, setFiltroPrioridade] = useState<string>('todos')
  const [filtroTecnico, setFiltroTecnico] = useState<string>('todos')
  const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  // Filtrar agendamentos
  const agendamentosFiltrados = useMemo(() => {
    return agendamentos.filter(agendamento => {
      const matchesSearch = 
        agendamento.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agendamento.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agendamento.veiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agendamento.veiculo.marca.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = filtroStatus === 'todos' || agendamento.status === filtroStatus
      const matchesPrioridade = filtroPrioridade === 'todos' || agendamento.prioridade === filtroPrioridade
      const matchesTecnico = filtroTecnico === 'todos' || agendamento.tecnico === filtroTecnico
      
      return matchesSearch && matchesStatus && matchesPrioridade && matchesTecnico
    })
  }, [agendamentos, searchTerm, filtroStatus, filtroPrioridade, filtroTecnico])

  // Estatísticas avançadas
  const stats = {
    total: agendamentos.length,
    hoje: agendamentos.filter(a => {
      const hoje = new Date().toDateString()
      const agendamento = new Date(a.dataHora).toDateString()
      return agendamento === hoje
    }).length,
    confirmados: agendamentos.filter(a => a.status === 'confirmado').length,
    vips: agendamentos.filter(a => a.cliente.isVIP).length,
    faturamento: agendamentos
      .filter(a => a.status === 'concluido')
      .reduce((sum, a) => sum + a.valorTotal, 0),
    urgentes: agendamentos.filter(a => a.prioridade === 'urgente').length
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

  // Técnicos únicos para filtro
  const tecnicos = [...new Set(agendamentos.map(a => a.tecnico).filter(Boolean))]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BeautifulSidebar 
        userType="oficina-pro"
        userName="Oficina PRO"
        userEmail="oficina@email.com"
        onLogout={() => {}}
      />
      
      <div className="flex-1 md:ml-64 transition-all duration-300">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📅 Agendamentos PRO</h1>
              <p className="text-gray-600">Sistema avançado de gestão de agendamentos</p>
            </div>
            <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl hover:from-orange-600 hover:to-red-600 flex items-center gap-2 transition-all">
              <PlusIcon className="w-5 h-5" />
              Novo Agendamento
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-6">

              {/* Stats Cards Avançadas */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-6 mb-8">
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
                  <p className="text-xs text-gray-500 mt-1">Agendamentos</p>
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
                    <h3 className="text-sm font-medium text-gray-600">Clientes VIP</h3>
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                      <StarIconSolid className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{stats.vips}</p>
                  <p className="text-xs text-gray-500 mt-1">Clientes VIP</p>
                </motion.div>

                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Urgentes</h3>
                    <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                      <ExclamationTriangleIcon className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{stats.urgentes}</p>
                  <p className="text-xs text-gray-500 mt-1">Alta prioridade</p>
                </motion.div>

                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Faturamento</h3>
                    <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                      <CurrencyDollarIcon className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">R$ {stats.faturamento.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">Este mês</p>
                </motion.div>
              </div>

              {/* Filtros Avançados */}
              <motion.div 
                className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                {/* Busca */}
                <div className="mb-4">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Buscar por ID, cliente, placa ou marca..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Filtros Rápidos */}
                <div className="flex flex-wrap gap-2 mb-4">
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
                          ? 'bg-orange-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {filtro.label}
                    </button>
                  ))}
                </div>

                {/* Filtros Avançados */}
                <div className="flex flex-col md:flex-row gap-3">
                  <select
                    value={filtroPrioridade}
                    onChange={(e) => setFiltroPrioridade(e.target.value)}
                    className="px-4 py-3 rounded-lg text-sm border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    <option value="todos">Todas Prioridades</option>
                    <option value="urgente">Urgente</option>
                    <option value="alta">Alta</option>
                    <option value="media">Média</option>
                    <option value="baixa">Baixa</option>
                  </select>

                  <select
                    value={filtroTecnico}
                    onChange={(e) => setFiltroTecnico(e.target.value)}
                    className="px-4 py-3 rounded-lg text-sm border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    <option value="todos">Todos Técnicos</option>
                    {tecnicos.map(tecnico => (
                      <option key={tecnico} value={tecnico}>{tecnico}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center justify-center px-4 py-3 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FunnelIcon className="h-5 w-5 mr-2" />
                    Mais Filtros
                  </button>
                </div>
              </motion.div>

              {/* Lista de Agendamentos */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {agendamentosFiltrados.map((agendamento, index) => {
                  const statusInfo = statusConfig[agendamento.status]
                  const StatusIcon = statusInfo.icon
                  const prioridadeInfo = prioridadeConfig[agendamento.prioridade]
                  const dateTime = formatDateTime(agendamento.dataHora)

                  return (
                    <motion.div
                      key={agendamento.id}
                      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100 relative"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {/* Badge VIP */}
                      {agendamento.cliente.isVIP && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                          <StarIconSolid className="h-3 w-3" />
                          VIP
                        </div>
                      )}

                      {/* Header do Card */}
                      <div className="p-6 border-b border-gray-100">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{agendamento.id}</h3>
                            <p className="text-sm text-gray-600">{agendamento.cliente.nome}</p>
                            {agendamento.tecnico && (
                              <p className="text-xs text-blue-600 font-medium">👨‍🔧 {agendamento.tecnico}</p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                              <StatusIcon className="h-4 w-4 mr-1.5" />
                              {statusInfo.label}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white ${prioridadeInfo.color}`}>
                              {prioridadeInfo.label}
                            </span>
                          </div>
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
                          <span className="text-orange-600 font-medium">({agendamento.duracaoTotal})</span>
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
                          <div className="space-y-2">
                            {agendamento.servicos.map((servico, idx) => (
                              <div key={idx} className="flex justify-between items-center bg-orange-50 p-2 rounded-lg">
                                <div>
                                  <span className="text-sm font-medium text-gray-800">{servico.nome}</span>
                                  <span className="text-xs text-gray-500 ml-2">({servico.duracao})</span>
                                </div>
                                <span className="text-sm font-semibold text-orange-600">R$ {servico.valor}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Valor Total e Contato */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <PhoneIcon className="h-4 w-4 text-gray-600" />
                            <span className="text-sm text-gray-600">{agendamento.cliente.telefone}</span>
                          </div>
                          <span className="font-bold text-orange-600 text-xl">
                            R$ {agendamento.valorTotal.toFixed(2).replace('.', ',')}
                          </span>
                        </div>

                        {/* Observações */}
                        {agendamento.observacoes && (
                          <div className="bg-blue-50 rounded-lg p-3">
                            <p className="text-sm text-blue-800">{agendamento.observacoes}</p>
                          </div>
                        )}

                        {/* Ações PRO */}
                        <div className="flex gap-2 pt-2">
                          <button 
                            onClick={() => {
                              setSelectedAgendamento(agendamento)
                              setShowModal(true)
                            }}
                            className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                          >
                            <EyeIcon className="h-4 w-4" />
                            Ver
                          </button>
                          
                          <button className="px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                            <ChatBubbleLeftRightIcon className="h-4 w-4" />
                            WhatsApp
                          </button>
                          
                          {agendamento.status === 'agendado' && (
                            <button 
                              onClick={() => updateStatus(agendamento.id, 'confirmado')}
                              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all"
                            >
                              Confirmar
                            </button>
                          )}
                          
                          {agendamento.status === 'confirmado' && (
                            <button 
                              onClick={() => updateStatus(agendamento.id, 'em_andamento')}
                              className="flex-1 px-4 py-2.5 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-colors"
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
                  <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all inline-flex items-center gap-2">
                    <PlusIcon className="h-5 w-5" />
                    Novo Agendamento
                  </button>
                </motion.div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes PRO */}
      {showModal && selectedAgendamento && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div 
            className="bg-white max-w-4xl w-full rounded-xl shadow-xl max-h-[90vh] overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedAgendamento.id}</h2>
                  <p className="text-orange-100 mt-1">Agendamento PRO - Sistema Avançado</p>
                </div>
                <div className="flex items-center gap-3">
                  {selectedAgendamento.cliente.isVIP && (
                    <div className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-1">
                      <StarIconSolid className="h-4 w-4" />
                      <span className="text-sm font-medium">VIP</span>
                    </div>
                  )}
                  <button 
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6 space-y-6 max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cliente */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <UserIcon className="h-5 w-5 mr-2 text-gray-600" />
                    Cliente {selectedAgendamento.cliente.isVIP && <StarIconSolid className="h-4 w-4 ml-2 text-purple-500" />}
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
                      <p className="font-medium">{selectedAgendamento.duracaoTotal}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Técnico</p>
                      <p className="font-medium text-blue-600">{selectedAgendamento.tecnico}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Serviços Detalhados */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Serviços Detalhados</h3>
                <div className="space-y-3">
                  {selectedAgendamento.servicos.map((servico, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{servico.nome}</p>
                        <p className="text-sm text-gray-600">Duração: {servico.duracao}</p>
                      </div>
                      <p className="font-bold text-orange-600">R$ {servico.valor}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-gray-200 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">Total:</span>
                    <span className="text-3xl font-bold text-orange-600">
                      R$ {selectedAgendamento.valorTotal.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
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
                <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                  WhatsApp
                </button>
                <button className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center gap-2">
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
