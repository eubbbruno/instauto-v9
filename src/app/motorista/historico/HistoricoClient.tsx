'use client'
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import BeautifulSidebar from '@/components/BeautifulSidebar'
import { 
  ClockIcon,
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  WrenchScrewdriverIcon,
  MapPinIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
  CurrencyDollarIcon,
  EyeIcon,
  DocumentArrowDownIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

interface HistoricoServico {
  id: string
  numeroOS: string
  oficina: {
    nome: string
    endereco: string
    telefone: string
    avaliacao: number
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
  }[]
  dataServico: string
  status: 'concluido' | 'cancelado'
  valorTotal: number
  formaPagamento: string
  tempoServico: string
  observacoes?: string
  avaliacaoCliente?: number
  fotos?: string[]
}

const mockHistorico: HistoricoServico[] = [
  {
    id: 'HIST-001',
    numeroOS: 'OS-2024-1234',
    oficina: {
      nome: 'AutoCenter Premium',
      endereco: 'Rua das Flores, 123 - Centro',
      telefone: '(11) 3333-4444',
      avaliacao: 4.8
    },
    veiculo: {
      marca: 'Honda',
      modelo: 'Civic',
      ano: 2020,
      placa: 'ABC-1234'
    },
    servicos: [
      { nome: 'Troca de óleo', valor: 80 },
      { nome: 'Filtro de ar', valor: 45 },
      { nome: 'Revisão geral', valor: 200 }
    ],
    dataServico: '2025-01-10T14:30:00',
    status: 'concluido',
    valorTotal: 325,
    formaPagamento: 'Cartão de Crédito',
    tempoServico: '2h 30min',
    avaliacaoCliente: 5,
    observacoes: 'Serviço excelente, oficina muito organizada'
  },
  {
    id: 'HIST-002',
    numeroOS: 'OS-2024-1156',
    oficina: {
      nome: 'Mecânica Silva',
      endereco: 'Av. Principal, 456 - Vila Nova',
      telefone: '(11) 2222-3333',
      avaliacao: 4.2
    },
    veiculo: {
      marca: 'Toyota',
      modelo: 'Corolla',
      ano: 2019,
      placa: 'DEF-5678'
    },
    servicos: [
      { nome: 'Alinhamento', valor: 80 },
      { nome: 'Balanceamento', valor: 60 }
    ],
    dataServico: '2024-12-28T10:00:00',
    status: 'concluido',
    valorTotal: 140,
    formaPagamento: 'PIX',
    tempoServico: '1h 15min',
    avaliacaoCliente: 4
  },
  {
    id: 'HIST-003',
    numeroOS: 'OS-2024-1089',
    oficina: {
      nome: 'Super Mecânica',
      endereco: 'Rua do Comércio, 789 - Centro',
      telefone: '(11) 1111-2222',
      avaliacao: 3.9
    },
    veiculo: {
      marca: 'Volkswagen',
      modelo: 'Gol',
      ano: 2018,
      placa: 'GHI-9012'
    },
    servicos: [
      { nome: 'Troca de pastilhas de freio', valor: 180 },
      { nome: 'Fluido de freio', valor: 35 }
    ],
    dataServico: '2024-12-15T16:45:00',
    status: 'concluido',
    valorTotal: 215,
    formaPagamento: 'Dinheiro',
    tempoServico: '1h 45min',
    avaliacaoCliente: 3,
    observacoes: 'Demorou mais que o esperado'
  },
  {
    id: 'HIST-004',
    numeroOS: 'OS-2024-0987',
    oficina: {
      nome: 'Oficina Rápida',
      endereco: 'Rua da Pressa, 321 - Bairro Novo',
      telefone: '(11) 4444-5555',
      avaliacao: 4.5
    },
    veiculo: {
      marca: 'Fiat',
      modelo: 'Uno',
      ano: 2017,
      placa: 'JKL-3456'
    },
    servicos: [
      { nome: 'Diagnóstico eletrônico', valor: 120 }
    ],
    dataServico: '2024-11-30T09:15:00',
    status: 'cancelado',
    valorTotal: 120,
    formaPagamento: '-',
    tempoServico: '-',
    observacoes: 'Cancelado pelo cliente - problema resolvido em casa'
  },
  {
    id: 'HIST-005',
    numeroOS: 'OS-2024-0856',
    oficina: {
      nome: 'MegaAuto Service',
      endereco: 'Av. dos Mecânicos, 567 - Industrial',
      telefone: '(11) 5555-6666',
      avaliacao: 4.7
    },
    veiculo: {
      marca: 'Chevrolet',
      modelo: 'Onix',
      ano: 2021,
      placa: 'MNO-7890'
    },
    servicos: [
      { nome: 'Revisão 10.000km', valor: 350 },
      { nome: 'Troca de velas', valor: 120 },
      { nome: 'Filtro de combustível', valor: 85 }
    ],
    dataServico: '2024-11-18T13:00:00',
    status: 'concluido',
    valorTotal: 555,
    formaPagamento: 'Cartão de Débito',
    tempoServico: '3h 20min',
    avaliacaoCliente: 5,
    observacoes: 'Revisão completa, tudo ok'
  }
]

export default function HistoricoClient() {
  const [historico, setHistorico] = useState<HistoricoServico[]>(mockHistorico)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('todos')
  const [selectedItem, setSelectedItem] = useState<HistoricoServico | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [dateFilter, setDateFilter] = useState<string>('todos')

  // Filtrar histórico
  const historicoFiltrado = useMemo(() => {
    return historico.filter(item => {
      const matchesSearch = 
        item.numeroOS.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.oficina.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.veiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.veiculo.marca.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'todos' || item.status === statusFilter
      
      let matchesDate = true
      if (dateFilter !== 'todos') {
        const itemDate = new Date(item.dataServico)
        const now = new Date()
        
        switch (dateFilter) {
          case 'mes':
            matchesDate = itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear()
            break
          case 'trimestre':
            const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
            matchesDate = itemDate >= quarterStart
            break
          case 'ano':
            matchesDate = itemDate.getFullYear() === now.getFullYear()
            break
        }
      }
      
      return matchesSearch && matchesStatus && matchesDate
    })
  }, [historico, searchTerm, statusFilter, dateFilter])

  // Estatísticas
  const stats = {
    total: historico.filter(h => h.status === 'concluido').length,
    valorTotal: historico.filter(h => h.status === 'concluido').reduce((sum, h) => sum + h.valorTotal, 0),
    avaliacaoMedia: historico.filter(h => h.avaliacaoCliente).reduce((sum, h) => sum + (h.avaliacaoCliente || 0), 0) / historico.filter(h => h.avaliacaoCliente).length || 0,
    tempoMedio: '2h 15min', // Calculado dinamicamente em uma implementação real
    oficinasUnicas: new Set(historico.map(h => h.oficina.nome)).size
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      data: date.toLocaleDateString('pt-BR'),
      hora: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BeautifulSidebar 
        userType="motorista"
        userName="Motorista"
        userEmail="motorista@email.com"
        onLogout={() => {}}
      />
      
      <div className="flex-1 md:ml-64 transition-all duration-300">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📚 Histórico de Serviços</h1>
              <p className="text-gray-600">Acompanhe todos os seus serviços realizados</p>
            </div>
            <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-indigo-700 flex items-center gap-2 transition-all">
              <DocumentArrowDownIcon className="w-5 h-5" />
              Exportar PDF
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-6">

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Serviços</h3>
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <WrenchScrewdriverIcon className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                  <p className="text-xs text-gray-500 mt-1">Concluídos</p>
                </motion.div>

                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Gasto Total</h3>
                    <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                      <CurrencyDollarIcon className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">R$ {stats.valorTotal.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">Em serviços</p>
                </motion.div>

                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Avaliação</h3>
                    <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                      <StarIconSolid className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{stats.avaliacaoMedia.toFixed(1)}</p>
                  <div className="flex items-center mt-1">
                    {renderStars(Math.round(stats.avaliacaoMedia))}
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Tempo Médio</h3>
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                      <ClockIcon className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{stats.tempoMedio}</p>
                  <p className="text-xs text-gray-500 mt-1">Por serviço</p>
                </motion.div>

                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Oficinas</h3>
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                      <MapPinIcon className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{stats.oficinasUnicas}</p>
                  <p className="text-xs text-gray-500 mt-1">Diferentes</p>
                </motion.div>
              </div>

              {/* Filtros */}
              <motion.div 
                className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Busca */}
                  <div className="md:col-span-2">
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        placeholder="Buscar por OS, oficina, placa..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Filtro Status */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 rounded-lg text-sm border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="todos">Todos os Status</option>
                    <option value="concluido">Concluídos</option>
                    <option value="cancelado">Cancelados</option>
                  </select>

                  {/* Filtro Data */}
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-4 py-3 rounded-lg text-sm border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="todos">Todo Período</option>
                    <option value="mes">Este Mês</option>
                    <option value="trimestre">Este Trimestre</option>
                    <option value="ano">Este Ano</option>
                  </select>
                </div>
              </motion.div>

              {/* Lista do Histórico */}
              <div className="space-y-6">
                {historicoFiltrado.map((item, index) => {
                  const dateTime = formatDateTime(item.dataServico)

                  return (
                    <motion.div
                      key={item.id}
                      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="p-6">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                          <div className="flex items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-gray-900">{item.numeroOS}</h3>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                  item.status === 'concluido' 
                                    ? 'bg-green-100 text-green-700 border border-green-200' 
                                    : 'bg-red-100 text-red-700 border border-red-200'
                                }`}>
                                  {item.status === 'concluido' ? (
                                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                                  ) : (
                                    <XCircleIcon className="h-4 w-4 mr-1" />
                                  )}
                                  {item.status === 'concluido' ? 'Concluído' : 'Cancelado'}
                                </span>
                              </div>
                              <p className="text-gray-600 font-medium">{item.oficina.nome}</p>
                              <p className="text-sm text-gray-500">{item.oficina.endereco}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">
                            <div className="text-right">
                              <p className="text-sm text-gray-600">{dateTime.data}</p>
                              <p className="text-sm text-gray-500">{dateTime.hora}</p>
                            </div>
                            {item.status === 'concluido' && (
                              <span className="text-2xl font-bold text-blue-600">
                                R$ {item.valorTotal.toFixed(2).replace('.', ',')}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Detalhes do Serviço */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          {/* Veículo */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <TruckIcon className="h-5 w-5 text-gray-600" />
                              <span className="font-medium text-gray-700">Veículo</span>
                            </div>
                            <p className="font-medium">{item.veiculo.marca} {item.veiculo.modelo} {item.veiculo.ano}</p>
                            <p className="text-sm text-gray-600">{item.veiculo.placa}</p>
                          </div>

                          {/* Oficina */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <MapPinIcon className="h-5 w-5 text-gray-600" />
                              <span className="font-medium text-gray-700">Oficina</span>
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{item.oficina.nome}</span>
                              <div className="flex items-center">
                                {renderStars(Math.round(item.oficina.avaliacao))}
                                <span className="text-sm text-gray-600 ml-1">({item.oficina.avaliacao})</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">{item.oficina.telefone}</p>
                          </div>
                        </div>

                        {/* Serviços Realizados */}
                        <div className="mb-6">
                          <h4 className="font-medium text-gray-700 mb-3">Serviços Realizados:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {item.servicos.map((servico, idx) => (
                              <div key={idx} className="flex justify-between items-center bg-blue-50 p-3 rounded-lg">
                                <span className="text-sm font-medium text-gray-800">{servico.nome}</span>
                                <span className="text-sm font-semibold text-blue-600">R$ {servico.valor}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Informações Adicionais */}
                        {item.status === 'concluido' && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
                            <div className="flex items-center gap-2">
                              <ClockIcon className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-600">Tempo: <span className="font-medium">{item.tempoServico}</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CurrencyDollarIcon className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-600">Pagamento: <span className="font-medium">{item.formaPagamento}</span></span>
                            </div>
                            {item.avaliacaoCliente && (
                              <div className="flex items-center gap-2">
                                <StarIconSolid className="h-4 w-4 text-yellow-500" />
                                <span className="text-gray-600">Sua avaliação: <span className="font-medium">{item.avaliacaoCliente}/5</span></span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Observações */}
                        {item.observacoes && (
                          <div className="bg-blue-50 rounded-lg p-3 mb-4">
                            <p className="text-sm text-blue-800">{item.observacoes}</p>
                          </div>
                        )}

                        {/* Ações */}
                        <div className="flex gap-3 pt-4 border-t border-gray-100">
                          <button 
                            onClick={() => {
                              setSelectedItem(item)
                              setShowModal(true)
                            }}
                            className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                          >
                            <EyeIcon className="h-4 w-4" />
                            Ver Detalhes
                          </button>
                          <button className="px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                            <DocumentArrowDownIcon className="h-4 w-4" />
                            Download PDF
                          </button>
                          {item.status === 'concluido' && !item.avaliacaoCliente && (
                            <button className="px-4 py-2.5 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2">
                              <StarIcon className="h-4 w-4" />
                              Avaliar
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Empty State */}
              {historicoFiltrado.length === 0 && (
                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-12 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <ClockIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Nenhum histórico encontrado</h3>
                  <p className="text-gray-500 mb-6">Tente ajustar os filtros de busca</p>
                </motion.div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div 
            className="bg-white max-w-4xl w-full rounded-xl shadow-xl max-h-[90vh] overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedItem.numeroOS}</h2>
                  <p className="text-blue-100 mt-1">Detalhes do Serviço</p>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6 space-y-6 max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Oficina */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <MapPinIcon className="h-5 w-5 mr-2 text-gray-600" />
                    Oficina
                  </h3>
                  <div className="space-y-2">
                    <p className="font-medium">{selectedItem.oficina.nome}</p>
                    <p className="text-sm text-gray-600">{selectedItem.oficina.endereco}</p>
                    <p className="text-sm text-gray-600">{selectedItem.oficina.telefone}</p>
                    <div className="flex items-center gap-2">
                      {renderStars(Math.round(selectedItem.oficina.avaliacao))}
                      <span className="text-sm text-gray-600">({selectedItem.oficina.avaliacao})</span>
                    </div>
                  </div>
                </div>

                {/* Serviço */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <WrenchScrewdriverIcon className="h-5 w-5 mr-2 text-gray-600" />
                    Serviço
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm"><span className="text-gray-600">Data:</span> <span className="font-medium">{formatDateTime(selectedItem.dataServico).data}</span></p>
                    <p className="text-sm"><span className="text-gray-600">Horário:</span> <span className="font-medium">{formatDateTime(selectedItem.dataServico).hora}</span></p>
                    {selectedItem.status === 'concluido' && (
                      <>
                        <p className="text-sm"><span className="text-gray-600">Duração:</span> <span className="font-medium">{selectedItem.tempoServico}</span></p>
                        <p className="text-sm"><span className="text-gray-600">Pagamento:</span> <span className="font-medium">{selectedItem.formaPagamento}</span></p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Serviços Detalhados */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Serviços Realizados</h3>
                <div className="space-y-3">
                  {selectedItem.servicos.map((servico, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium text-gray-900">{servico.nome}</span>
                      <span className="font-bold text-blue-600">R$ {servico.valor}</span>
                    </div>
                  ))}
                </div>
                {selectedItem.status === 'concluido' && (
                  <div className="pt-3 border-t border-gray-200 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Total:</span>
                      <span className="text-3xl font-bold text-blue-600">
                        R$ {selectedItem.valorTotal.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-white border-t border-gray-200 p-6">
              <button 
                onClick={() => setShowModal(false)}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
