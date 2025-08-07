'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import BeautifulSidebar from '@/components/BeautifulSidebar'
import { 
  CalendarIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  ArrowPathIcon, 
  XCircleIcon,
  MapPinIcon,
  WrenchScrewdriverIcon,
  TruckIcon,
  StarIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

interface Agendamento {
  id: string
  oficina: {
    id: string
    nome: string
    endereco: string
    avaliacao: number
    foto?: string
    telefone: string
    distancia: string
  }
  veiculo: {
    id: string
    marca: string
    modelo: string
    ano: number
    placa: string
  }
  servicos: {
    nome: string
    preco: number
    tempo: string
  }[]
  data: string
  horario: string
  status: "agendado" | "confirmado" | "em_andamento" | "concluido" | "cancelado"
  observacoes?: string
  avaliado: boolean
  notificacoes: number
  prioridade: "normal" | "alta" | "urgente"
  metodoPagamento?: string
  feedback?: string
}

export default function AgendamentosClient() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [filtroStatus, setFiltroStatus] = useState<string>("todos")
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const carregarAgendamentos = async () => {
      setCarregando(true)
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const dataAtual = new Date()
        const agendamentosMock: Agendamento[] = [
          {
            id: "agd001",
            oficina: {
              id: "of001",
              nome: "Auto Center Silva",
              endereco: "Av. Paulista, 1500 - São Paulo, SP",
              avaliacao: 4.8,
              foto: "https://images.unsplash.com/photo-1597762470488-3877b1f538c6?q=80&w=600&auto=format&fit=crop",
              telefone: "(11) 99999-1111",
              distancia: "2,5 km"
            },
            veiculo: {
              id: "veh001",
              marca: "Honda",
              modelo: "Civic",
              ano: 2019,
              placa: "ABC-1234"
            },
            servicos: [
              { nome: "Troca de óleo", preco: 120, tempo: "30min" },
              { nome: "Alinhamento", preco: 100, tempo: "45min" }
            ],
            data: new Date(dataAtual.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            horario: "14:30",
            status: "agendado",
            observacoes: "Favor verificar também os níveis de fluidos.",
            avaliado: false,
            notificacoes: 2,
            prioridade: "normal",
            metodoPagamento: "Cartão de Crédito"
          },
          {
            id: "agd002",
            oficina: {
              id: "of002",
              nome: "Mecânica Express 24h",
              endereco: "Rua Augusta, 800 - São Paulo, SP",
              avaliacao: 4.5,
              foto: "https://images.unsplash.com/photo-1629784565254-c54a7963d697?q=80&w=600&auto=format&fit=crop",
              telefone: "(11) 99999-2222",
              distancia: "3,8 km"
            },
            veiculo: {
              id: "veh002",
              marca: "Toyota",
              modelo: "Corolla",
              ano: 2020,
              placa: "DEF-5678"
            },
            servicos: [
              { nome: "Revisão completa", preco: 350, tempo: "2h" }
            ],
            data: new Date().toISOString().split('T')[0],
            horario: "09:00",
            status: "em_andamento",
            observacoes: "Veículo será utilizado para viagem longa.",
            avaliado: false,
            notificacoes: 1,
            prioridade: "alta",
            metodoPagamento: "PIX"
          },
          {
            id: "agd003",
            oficina: {
              id: "of003",
              nome: "Oficina do João",
              endereco: "Rua Vergueiro, 1200 - São Paulo, SP",
              avaliacao: 4.2,
              telefone: "(11) 99999-3333",
              distancia: "1,2 km"
            },
            veiculo: {
              id: "veh001",
              marca: "Honda",
              modelo: "Civic",
              ano: 2019,
              placa: "ABC-1234"
            },
            servicos: [
              { nome: "Troca de pastilhas de freio", preco: 180, tempo: "1h" },
              { nome: "Verificação de suspensão", preco: 90, tempo: "30min" }
            ],
            data: new Date(dataAtual.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            horario: "11:00",
            status: "concluido",
            avaliado: true,
            notificacoes: 0,
            prioridade: "normal",
            metodoPagamento: "Dinheiro",
            feedback: "Excelente atendimento!"
          }
        ]
        
        setAgendamentos(agendamentosMock)
      } catch (error) {
        console.error("Erro ao carregar agendamentos:", error)
      } finally {
        setCarregando(false)
      }
    }
    
    carregarAgendamentos()
  }, [])

  // Calcular estatísticas dos agendamentos
  const stats = {
    total: agendamentos.length,
    hoje: agendamentos.filter(a => a.data === new Date().toISOString().split('T')[0]).length,
    proximos: agendamentos.filter(a => {
      const hoje = new Date().toISOString().split('T')[0]
      return a.data > hoje && (a.status === "agendado" || a.status === "confirmado")
    }).length,
    concluidos: agendamentos.filter(a => a.status === "concluido").length,
    gastoTotal: agendamentos
      .filter(a => a.status === "concluido")
      .reduce((total, a) => total + a.servicos.reduce((sum, s) => sum + s.preco, 0), 0)
  }

  // Filtrar agendamentos
  const agendamentosFiltrados = () => {
    let resultado = [...agendamentos]
    
    if (filtroStatus !== "todos") {
      resultado = resultado.filter(agendamento => agendamento.status === filtroStatus)
    }
    
    return resultado.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
  }

  // Funções auxiliares
  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO)
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const calcularTotal = (servicos: {nome: string, preco: number}[]) => {
    return servicos.reduce((total, servico) => total + servico.preco, 0)
  }

  const getStatusColor = (status: Agendamento['status']) => {
    switch (status) {
      case "agendado": return "bg-blue-50 text-blue-700 border-blue-200"
      case "confirmado": return "bg-green-50 text-green-700 border-green-200"
      case "em_andamento": return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "concluido": return "bg-purple-50 text-purple-700 border-purple-200"
      case "cancelado": return "bg-red-50 text-red-700 border-red-200"
      default: return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getStatusIcon = (status: Agendamento['status']) => {
    switch (status) {
      case "agendado": return ClockIcon
      case "confirmado": return CheckCircleIcon
      case "em_andamento": return ArrowPathIcon
      case "concluido": return StarIcon
      case "cancelado": return XCircleIcon
      default: return ClockIcon
    }
  }

  const getStatusText = (status: Agendamento['status']) => {
    switch (status) {
      case "agendado": return "Agendado"
      case "confirmado": return "Confirmado"
      case "em_andamento": return "Em Andamento"
      case "concluido": return "Concluído"
      case "cancelado": return "Cancelado"
      default: return "Desconhecido"
    }
  }

  if (carregando) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="hidden md:block w-64 h-screen bg-gradient-to-b from-blue-800 to-indigo-600"></div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando agendamentos...</p>
          </div>
        </div>
      </div>
    )
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
              <h1 className="text-2xl font-bold text-gray-900">📅 Meus Agendamentos</h1>
              <p className="text-gray-600">Acompanhe seus serviços agendados</p>
            </div>
            <Link 
              href="/motorista/buscar"
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 flex items-center gap-2 transition-all"
            >
              <PlusIcon className="w-5 h-5" />
              Novo Agendamento
            </Link>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-6 max-w-7xl mx-auto">

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total</p>
                      <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                    </div>
                    <CalendarIcon className="w-12 h-12 text-blue-600 opacity-20" />
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Hoje</p>
                      <p className="text-3xl font-bold text-green-600">{stats.hoje}</p>
                    </div>
                    <ClockIcon className="w-12 h-12 text-green-600 opacity-20" />
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Próximos</p>
                      <p className="text-3xl font-bold text-orange-600">{stats.proximos}</p>
                    </div>
                    <ArrowPathIcon className="w-12 h-12 text-orange-600 opacity-20" />
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Gasto Total</p>
                      <p className="text-3xl font-bold text-purple-600">R$ {stats.gastoTotal}</p>
                    </div>
                    <StarIcon className="w-12 h-12 text-purple-600 opacity-20" />
                  </div>
                </motion.div>
              </div>

              {/* Filtros */}
              <motion.div 
                className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Filtrar por Status</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "todos", label: "Todos" },
                    { key: "agendado", label: "Agendados" },
                    { key: "confirmado", label: "Confirmados" },
                    { key: "em_andamento", label: "Em andamento" },
                    { key: "concluido", label: "Concluídos" }
                  ].map((filtro) => (
                    <button
                      key={filtro.key}
                      onClick={() => setFiltroStatus(filtro.key)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        filtroStatus === filtro.key
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {filtro.label}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Lista de Agendamentos */}
              <div className="space-y-6">
                {agendamentosFiltrados().length === 0 ? (
                  <motion.div 
                    className="bg-white rounded-xl border border-gray-200 p-12 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <WrenchScrewdriverIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                      Nenhum agendamento encontrado
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {filtroStatus === "todos" 
                        ? "Você ainda não tem agendamentos."
                        : `Não há agendamentos com status "${getStatusText(filtroStatus as Agendamento['status']).toLowerCase()}".`
                      }
                    </p>
                    <Link 
                      href="/motorista/buscar"
                      className="bg-blue-600 text-white px-8 py-4 rounded-xl font-medium hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                    >
                      <PlusIcon className="w-5 h-5" />
                      Agendar serviço
                    </Link>
                  </motion.div>
                ) : (
                  agendamentosFiltrados().map((agendamento, index) => {
                    const StatusIcon = getStatusIcon(agendamento.status)
                    
                    return (
                      <motion.div
                        key={agendamento.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all"
                      >
                        <div className="p-6">
                          {/* Header do agendamento */}
                          <div className="flex flex-col md:flex-row md:items-start justify-between mb-6">
                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:items-center mb-3">
                                <h3 className="text-xl font-semibold text-gray-900 mr-4">
                                  {agendamento.oficina.nome}
                                </h3>
                                <div className={`inline-flex items-center space-x-2 px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(agendamento.status)}`}>
                                  <StatusIcon className="h-4 w-4" />
                                  <span>{getStatusText(agendamento.status)}</span>
                                </div>
                              </div>
                              
                              {/* Info do agendamento */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                  <CalendarIcon className="h-4 w-4 flex-shrink-0" />
                                  <span>{formatarData(agendamento.data)}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <ClockIcon className="h-4 w-4 flex-shrink-0" />
                                  <span>{agendamento.horario}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <TruckIcon className="h-4 w-4 flex-shrink-0" />
                                  <span>{agendamento.veiculo.marca} {agendamento.veiculo.modelo}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <MapPinIcon className="h-4 w-4 flex-shrink-0" />
                                  <span>{agendamento.oficina.distancia}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Serviços */}
                          <div className="border-t pt-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Serviços:</h4>
                            <div className="space-y-2">
                              {agendamento.servicos.map((servico, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded-lg">
                                  <div className="flex-1">
                                    <span className="text-gray-800 font-medium">{servico.nome}</span>
                                    <span className="text-gray-500 ml-2">({servico.tempo})</span>
                                  </div>
                                  <span className="font-semibold text-blue-600">R$ {servico.preco}</span>
                                </div>
                              ))}
                            </div>
                            
                            {/* Total */}
                            <div className="border-t mt-4 pt-4 flex justify-between items-center">
                              <span className="text-lg font-semibold text-gray-900">Total:</span>
                              <span className="text-2xl font-bold text-blue-600">
                                R$ {calcularTotal(agendamento.servicos).toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {/* Observações */}
                          {agendamento.observacoes && (
                            <div className="border-t pt-4 mt-4">
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Observações:</h4>
                              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg italic">
                                {agendamento.observacoes}
                              </p>
                            </div>
                          )}

                          {/* Ações */}
                          <div className="border-t pt-4 mt-4 flex flex-wrap gap-3">
                            {agendamento.status === "agendado" && (
                              <>
                                <button className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200">
                                  Cancelar
                                </button>
                                <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200">
                                  Remarcar
                                </button>
                              </>
                            )}
                            {agendamento.status === "confirmado" && (
                              <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200">
                                Acompanhar
                              </button>
                            )}
                            {agendamento.status === "concluido" && !agendamento.avaliado && (
                              <button className="px-4 py-2 text-sm font-medium text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded-lg transition-colors border border-yellow-200">
                                Avaliar Serviço
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
