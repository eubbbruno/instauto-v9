'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BeautifulSidebar from '@/components/BeautifulSidebar'
import { 
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  PhotoIcon,
  PaperClipIcon,
  PhoneIcon,
  VideoCameraIcon,
  EllipsisVerticalIcon,
  CheckIcon,
  CheckCircleIcon,
  ClockIcon,
  StarIcon,
  ExclamationTriangleIcon,
  FaceSmileIcon,
  MapPinIcon,
  CrownIcon,
  UserIcon,
  TruckIcon,
  FunnelIcon,
  TagIcon,
  ChartBarIcon,
  BoltIcon,
  HeartIcon,
  DocumentTextIcon,
  CameraIcon,
  MicrophoneIcon,
  FireIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid'

interface Conversa {
  id: string
  motorista: {
    nome: string
    avatar: string
    online: boolean
    ultimaVez: string
    veiculo?: string
    vip: boolean
    rating: number
    telefone?: string
  }
  ultimaMensagem: {
    texto: string
    horario: string
    naoLida: boolean
    tipo: 'texto' | 'foto' | 'arquivo' | 'agendamento' | 'voz'
  }
  agendamento?: {
    id: string
    data: string
    servico: string
    valor: number
    status: 'confirmado' | 'pendente' | 'cancelado' | 'concluido'
  }
  tags: string[]
  categoria: 'urgente' | 'normal' | 'vip' | 'follow-up'
  historico: number // número de serviços realizados
}

interface Mensagem {
  id: string
  remetente: 'oficina' | 'motorista'
  texto: string
  horario: string
  status: 'enviando' | 'enviada' | 'entregue' | 'lida'
  tipo: 'texto' | 'foto' | 'arquivo' | 'agendamento' | 'sistema' | 'voz'
  anexo?: {
    nome: string
    tipo: string
    url: string
  }
  agendamento?: {
    id: string
    data: string
    servico: string
    motorista: string
    valor: number
    status: 'confirmado' | 'pendente' | 'cancelado' | 'concluido'
  }
  reacao?: string
}

const conversasMockPro: Conversa[] = [
  {
    id: '1',
    motorista: {
      nome: 'Roberto Silva',
      avatar: 'RS',
      online: true,
      ultimaVez: 'Online',
      veiculo: 'BMW X5 2023',
      vip: true,
      rating: 5.0,
      telefone: '(11) 99999-0001'
    },
    ultimaMensagem: {
      texto: 'Mensagem de voz',
      horario: '15:45',
      naoLida: true,
      tipo: 'voz'
    },
    agendamento: {
      id: 'ag1',
      data: '2025-01-09',
      servico: 'Manutenção Premium',
      valor: 1200,
      status: 'confirmado'
    },
    tags: ['VIP', 'Premium'],
    categoria: 'vip',
    historico: 15
  },
  {
    id: '2',
    motorista: {
      nome: 'Ana Carolina',
      avatar: 'AC',
      online: false,
      ultimaVez: 'há 30min',
      veiculo: 'Mercedes C180',
      vip: true,
      rating: 4.9,
      telefone: '(11) 99999-0002'
    },
    ultimaMensagem: {
      texto: 'Preciso de atendimento urgente!',
      horario: '14:20',
      naoLida: true,
      tipo: 'texto'
    },
    tags: ['Urgente', 'VIP'],
    categoria: 'urgente',
    historico: 8
  },
  {
    id: '3',
    motorista: {
      nome: 'Carlos Eduardo',
      avatar: 'CE',
      online: true,
      ultimaVez: 'Online',
      veiculo: 'Honda Civic',
      vip: false,
      rating: 4.5,
      telefone: '(11) 99999-0003'
    },
    ultimaMensagem: {
      texto: 'Obrigado pelo excelente serviço!',
      horario: '12:30',
      naoLida: false,
      tipo: 'texto'
    },
    tags: ['Satisfeito'],
    categoria: 'normal',
    historico: 3
  },
  {
    id: '4',
    motorista: {
      nome: 'Mariana Costa',
      avatar: 'MC',
      online: false,
      ultimaVez: 'há 2h',
      veiculo: 'Toyota Corolla',
      vip: false,
      rating: 4.7,
      telefone: '(11) 99999-0004'
    },
    ultimaMensagem: {
      texto: 'Foto',
      horario: '10:15',
      naoLida: false,
      tipo: 'foto'
    },
    tags: ['Follow-up'],
    categoria: 'follow-up',
    historico: 5
  },
  {
    id: '5',
    motorista: {
      nome: 'João Santos',
      avatar: 'JS',
      online: true,
      ultimaVez: 'Online',
      veiculo: 'Volkswagen Golf',
      vip: false,
      rating: 4.3,
      telefone: '(11) 99999-0005'
    },
    ultimaMensagem: {
      texto: 'Quanto fica a revisão?',
      horario: 'Ontem',
      naoLida: false,
      tipo: 'texto'
    },
    tags: ['Orçamento'],
    categoria: 'normal',
    historico: 2
  }
]

const mensagensMockPro: { [key: string]: Mensagem[] } = {
  '1': [
    {
      id: 'm1',
      remetente: 'motorista',
      texto: 'Boa tarde! Meu BMW está fazendo um ruído estranho no motor',
      horario: '14:30',
      status: 'lida',
      tipo: 'texto'
    },
    {
      id: 'm2',
      remetente: 'oficina',
      texto: 'Boa tarde, Sr. Roberto! Vamos verificar isso imediatamente. Pode trazer hoje?',
      horario: '14:32',
      status: 'lida',
      tipo: 'texto'
    },
    {
      id: 'm3',
      remetente: 'motorista',
      texto: 'Mensagem de voz (45s)',
      horario: '15:45',
      status: 'entregue',
      tipo: 'voz'
    }
  ]
}

export default function MensagensClient() {
  const [conversaSelecionada, setConversaSelecionada] = useState<string>('1')
  const [novaMensagem, setNovaMensagem] = useState('')
  const [busca, setBusca] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas')
  const [typing, setTyping] = useState(false)
  const [showEmojis, setShowEmojis] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const conversaAtual = conversasMockPro.find(c => c.id === conversaSelecionada)
  const mensagensAtual = mensagensMockPro[conversaSelecionada] || []

  // Templates PRO
  const templates = [
    '✅ Seu veículo está pronto para retirada!',
    '📅 Lembrete: seu agendamento é amanhã às {{hora}}',
    '💰 Orçamento aprovado! Iniciando serviço.',
    '🔧 Serviço concluído com sucesso!',
    '⏰ Estimativa de conclusão: {{tempo}}',
    '📞 Ligaremos em breve para confirmar detalhes'
  ]

  useEffect(() => {
    scrollToBottom()
  }, [mensagensAtual])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const enviarMensagem = () => {
    if (!novaMensagem.trim()) return
    setNovaMensagem('')
  }

  const enviarTemplate = (template: string) => {
    setNovaMensagem(template)
    setShowTemplates(false)
  }

  const renderStatusMensagem = (status: string) => {
    switch (status) {
      case 'enviando':
        return <ClockIcon className="h-4 w-4 text-gray-400" />
      case 'enviada':
        return <CheckIcon className="h-4 w-4 text-gray-400" />
      case 'entregue':
        return <CheckCircleIcon className="h-4 w-4 text-gray-400" />
      case 'lida':
        return <CheckCircleSolid className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'urgente':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'vip':
        return 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200'
      case 'follow-up':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const renderMensagem = (mensagem: Mensagem) => {
    const isOficina = mensagem.remetente === 'oficina'
    const isSistema = mensagem.tipo === 'sistema'

    if (isSistema) {
      return (
        <div className="flex justify-center my-4">
          <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg text-sm max-w-xs text-center border border-purple-200">
            {mensagem.agendamento && (
              <div className="space-y-2">
                <p className="font-medium">✅ Agendamento Premium</p>
                <div className="bg-white rounded p-3 text-left">
                  <p className="font-semibold text-gray-900">{mensagem.agendamento.servico}</p>
                  <p className="text-sm text-gray-600">📅 {new Date(mensagem.agendamento.data).toLocaleDateString('pt-BR')}</p>
                  <p className="text-sm text-gray-600">👤 {mensagem.agendamento.motorista}</p>
                  <p className="text-sm text-green-600 font-medium">💰 R$ {mensagem.agendamento.valor.toLocaleString()}</p>
                  <div className="mt-2 flex gap-2">
                    <button className="bg-purple-500 text-white px-3 py-1 rounded text-xs hover:bg-purple-600 transition-colors">
                      Confirmar
                    </button>
                    <button className="bg-amber-500 text-white px-3 py-1 rounded text-xs hover:bg-amber-600 transition-colors">
                      Reagendar
                    </button>
                  </div>
                </div>
              </div>
            )}
            {!mensagem.agendamento && mensagem.texto}
          </div>
        </div>
      )
    }

    return (
      <div className={`flex ${isOficina ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-xs lg:max-w-md ${isOficina ? 'order-1' : 'order-2'}`}>
          <div
            className={`px-4 py-2 rounded-lg relative ${
              isOficina
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-br-sm'
                : 'bg-white border border-gray-200 text-gray-900 rounded-bl-sm shadow-sm'
            }`}
          >
            {mensagem.tipo === 'voz' ? (
              <div className="flex items-center gap-2">
                <MicrophoneIcon className="h-4 w-4" />
                <span className="text-sm">{mensagem.texto}</span>
                <button className="ml-2 w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  ▶️
                </button>
              </div>
            ) : (
              <p className="text-sm">{mensagem.texto}</p>
            )}
            
            {mensagem.reacao && (
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-lg">
                <span className="text-xs">{mensagem.reacao}</span>
              </div>
            )}
          </div>
          <div className={`flex items-center gap-1 mt-1 ${isOficina ? 'justify-end' : 'justify-start'}`}>
            <span className="text-xs text-gray-500">{mensagem.horario}</span>
            {isOficina && renderStatusMensagem(mensagem.status)}
          </div>
        </div>
        
        {!isOficina && (
          <div className="relative mr-3 order-1">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {conversaAtual?.motorista.avatar}
            </div>
            {conversaAtual?.motorista.vip && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full flex items-center justify-center">
                <CrownIcon className="h-2.5 w-2.5 text-amber-800" />
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  const conversasFiltradas = conversasMockPro.filter(conversa => {
    const matchBusca = conversa.motorista.nome.toLowerCase().includes(busca.toLowerCase()) ||
                      conversa.motorista.veiculo?.toLowerCase().includes(busca.toLowerCase()) ||
                      conversa.tags.some(tag => tag.toLowerCase().includes(busca.toLowerCase()))
    
    const matchCategoria = filtroCategoria === 'todas' || conversa.categoria === filtroCategoria
    
    return matchBusca && matchCategoria
  })

  const stats = {
    total: conversasMockPro.length,
    naoLidas: conversasMockPro.filter(c => c.ultimaMensagem.naoLida).length,
    vip: conversasMockPro.filter(c => c.motorista.vip).length,
    urgentes: conversasMockPro.filter(c => c.categoria === 'urgente').length
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BeautifulSidebar 
        userType="oficina-pro"
        userName="AutoCenter PRO"
        userEmail="oficina@email.com"
        onLogout={() => {}}
      />
      
      <div className="flex-1 md:ml-64 transition-all duration-300">
        <div className="flex h-screen">
          {/* Lista de Conversas - PRO */}
          <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
            {/* Header Lista */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  💬 Mensagens
                  <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                    PRO
                  </span>
                </h1>
                <button className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors">
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                </button>
              </div>
              
              {/* Stats PRO */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="text-center p-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded">
                  <p className="text-xs text-amber-600 font-medium">Total</p>
                  <p className="text-lg font-bold text-amber-700">{stats.total}</p>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded">
                  <p className="text-xs text-blue-600 font-medium">Não lidas</p>
                  <p className="text-lg font-bold text-blue-700">{stats.naoLidas}</p>
                </div>
                <div className="text-center p-2 bg-yellow-50 rounded">
                  <p className="text-xs text-yellow-600 font-medium">VIP</p>
                  <p className="text-lg font-bold text-yellow-700">{stats.vip}</p>
                </div>
                <div className="text-center p-2 bg-red-50 rounded">
                  <p className="text-xs text-red-600 font-medium">Urgente</p>
                  <p className="text-lg font-bold text-red-700">{stats.urgentes}</p>
                </div>
              </div>
              
              {/* Filtros PRO */}
              <div className="flex items-center gap-2 mb-3">
                <FunnelIcon className="h-4 w-4 text-gray-500" />
                <select
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                  className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="todas">Todas</option>
                  <option value="vip">VIP</option>
                  <option value="urgente">Urgente</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="normal">Normal</option>
                </select>
              </div>
              
              {/* Busca Avançada */}
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome, veículo, tags..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Lista */}
            <div className="flex-1 overflow-y-auto">
              {conversasFiltradas.map((conversa) => (
                <motion.div
                  key={conversa.id}
                  onClick={() => setConversaSelecionada(conversa.id)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                    conversaSelecionada === conversa.id ? 'bg-amber-50 border-r-2 border-r-amber-500' : ''
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                        {conversa.motorista.avatar}
                      </div>
                      {conversa.motorista.online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                      {conversa.motorista.vip && (
                        <div className="absolute -top-1 -left-1 w-5 h-5 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full flex items-center justify-center">
                          <CrownIcon className="h-3 w-3 text-amber-800" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 truncate">{conversa.motorista.nome}</h3>
                          {conversa.motorista.vip && (
                            <span className="text-xs bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                              VIP
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">{conversa.ultimaMensagem.horario}</span>
                      </div>
                      
                      {/* Rating e veículo */}
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <StarSolid className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs text-gray-600">{conversa.motorista.rating}</span>
                        </div>
                        {conversa.motorista.veiculo && (
                          <>
                            <span className="text-xs text-gray-400">•</span>
                            <div className="flex items-center gap-1">
                              <TruckIcon className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500 truncate">{conversa.motorista.veiculo}</span>
                            </div>
                          </>
                        )}
                      </div>
                      
                      {/* Categoria e tags */}
                      <div className="flex items-center gap-1 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded border ${getCategoriaColor(conversa.categoria)}`}>
                          {conversa.categoria === 'urgente' ? '🚨 Urgente' :
                           conversa.categoria === 'vip' ? '👑 VIP' :
                           conversa.categoria === 'follow-up' ? '📞 Follow-up' : '📝 Normal'}
                        </span>
                        {conversa.tags.slice(0, 1).map((tag, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <p className={`text-sm truncate ${conversa.ultimaMensagem.naoLida ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                          {conversa.ultimaMensagem.tipo === 'foto' ? '📷 Foto' : 
                           conversa.ultimaMensagem.tipo === 'voz' ? '🎵 Áudio' :
                           conversa.ultimaMensagem.tipo === 'agendamento' ? '📅 Agendamento' :
                           conversa.ultimaMensagem.texto}
                        </p>
                        <div className="flex items-center gap-1">
                          {conversa.ultimaMensagem.naoLida && (
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          )}
                          <span className="text-xs text-gray-500">{conversa.historico}x</span>
                        </div>
                      </div>
                      
                      {conversa.agendamento && (
                        <div className="mt-2 p-2 bg-purple-50 border border-purple-200 rounded text-xs">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-purple-800">📅 {conversa.agendamento.servico}</p>
                              <p className="text-purple-600">{new Date(conversa.agendamento.data).toLocaleDateString('pt-BR')}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-green-600">R$ {conversa.agendamento.valor.toLocaleString()}</p>
                              <div className={`text-xs px-1.5 py-0.5 rounded ${
                                conversa.agendamento.status === 'confirmado' ? 'bg-green-100 text-green-700' :
                                conversa.agendamento.status === 'pendente' ? 'bg-yellow-100 text-yellow-700' :
                                conversa.agendamento.status === 'concluido' ? 'bg-blue-100 text-blue-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {conversa.agendamento.status}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Área de Chat PRO */}
          <div className="flex-1 flex flex-col">
            {conversaAtual ? (
              <>
                {/* Header do Chat PRO */}
                <div className="bg-white border-b border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                          {conversaAtual.motorista.avatar}
                        </div>
                        {conversaAtual.motorista.online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                        {conversaAtual.motorista.vip && (
                          <div className="absolute -top-1 -left-1 w-4 h-4 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full flex items-center justify-center">
                            <CrownIcon className="h-2.5 w-2.5 text-amber-800" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="font-semibold text-gray-900">{conversaAtual.motorista.nome}</h2>
                          <div className="flex items-center gap-1">
                            <StarSolid className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm text-gray-600">{conversaAtual.motorista.rating}</span>
                          </div>
                          {conversaAtual.motorista.vip && (
                            <span className="bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-800 text-xs font-bold px-2 py-0.5 rounded">
                              VIP
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {conversaAtual.motorista.veiculo && (
                            <span className="text-gray-600">🚗 {conversaAtual.motorista.veiculo}</span>
                          )}
                          <span className="text-gray-500">
                            {conversaAtual.motorista.online ? (
                              <span className="text-green-600">● Online</span>
                            ) : (
                              `Visto ${conversaAtual.motorista.ultimaVez}`
                            )}
                          </span>
                          <span className="text-amber-600">• {conversaAtual.historico} serviços</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors" title="Ligar">
                        <PhoneIcon className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-purple-500 hover:bg-purple-50 rounded-lg transition-colors" title="Videochamada">
                        <VideoCameraIcon className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Histórico">
                        <ChartBarIcon className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                        <EllipsisVerticalIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Tags e categoria */}
                  <div className="flex items-center gap-2 mt-3">
                    <span className={`text-xs px-2 py-1 rounded border ${getCategoriaColor(conversaAtual.categoria)}`}>
                      {conversaAtual.categoria === 'urgente' ? '🚨 Urgente' :
                       conversaAtual.categoria === 'vip' ? '👑 VIP' :
                       conversaAtual.categoria === 'follow-up' ? '📞 Follow-up' : '📝 Normal'}
                    </span>
                    {conversaAtual.tags.map((tag, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {conversaAtual.agendamento && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-purple-900">📅 Agendamento Premium</p>
                          <p className="text-sm text-purple-700">{conversaAtual.agendamento.servico}</p>
                          <p className="text-sm text-purple-600">{new Date(conversaAtual.agendamento.data).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600 text-lg">R$ {conversaAtual.agendamento.valor.toLocaleString()}</p>
                          <div className={`text-xs px-2 py-1 rounded font-medium ${
                            conversaAtual.agendamento.status === 'confirmado' ? 'bg-green-100 text-green-800' :
                            conversaAtual.agendamento.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                            conversaAtual.agendamento.status === 'concluido' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {conversaAtual.agendamento.status === 'confirmado' ? 'Confirmado' :
                             conversaAtual.agendamento.status === 'pendente' ? 'Pendente' :
                             conversaAtual.agendamento.status === 'concluido' ? 'Concluído' : 'Cancelado'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mensagens */}
                <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
                  <AnimatePresence>
                    {mensagensAtual.map((mensagem) => (
                      <motion.div
                        key={mensagem.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        {renderMensagem(mensagem)}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                {/* Input de Mensagem PRO */}
                <div className="bg-white border-t border-gray-200 p-4">
                  {/* Templates PRO */}
                  {showTemplates && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg"
                    >
                      <h4 className="text-sm font-medium text-amber-800 mb-2">📝 Templates PRO:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {templates.map((template, idx) => (
                          <button
                            key={idx}
                            onClick={() => enviarTemplate(template)}
                            className="text-left p-2 text-xs bg-white hover:bg-amber-50 border border-amber-200 rounded transition-colors"
                          >
                            {template}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  
                  <div className="flex items-end gap-2">
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                      <PaperClipIcon className="h-5 w-5" />
                    </button>
                    
                    <button className="p-2 text-purple-500 hover:bg-purple-50 rounded-lg transition-colors">
                      <CameraIcon className="h-5 w-5" />
                    </button>
                    
                    <button className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors">
                      <MicrophoneIcon className="h-5 w-5" />
                    </button>
                    
                    <button
                      onClick={() => setShowTemplates(!showTemplates)}
                      className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                    >
                      <DocumentTextIcon className="h-5 w-5" />
                    </button>
                    
                    <div className="flex-1 relative">
                      <textarea
                        value={novaMensagem}
                        onChange={(e) => setNovaMensagem(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            enviarMensagem()
                          }
                        }}
                        placeholder="Digite sua mensagem..."
                        rows={1}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                      />
                      <button
                        onClick={() => setShowEmojis(!showEmojis)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        <FaceSmileIcon className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <button
                      onClick={enviarMensagem}
                      disabled={!novaMensagem.trim()}
                      className={`p-2 rounded-lg transition-colors ${
                        novaMensagem.trim()
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      <PaperAirplaneIcon className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {/* Emojis PRO */}
                  {showEmojis && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200"
                    >
                      <div className="flex flex-wrap gap-2">
                        {['😊', '👍', '❤️', '😢', '😡', '🚗', '🔧', '✅', '❌', '📅', '⏰', '💰', '🎉', '👑', '🔥', '💎', '⭐', '🚀'].map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => setNovaMensagem(prev => prev + emoji)}
                            className="text-lg hover:bg-white rounded p-1 transition-colors"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </>
            ) : (
              /* Estado vazio */
              <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
                <div className="text-center">
                  <ChatBubbleLeftRightIcon className="h-16 w-16 text-amber-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione uma conversa</h3>
                  <p className="text-gray-500">Escolha um cliente para começar a conversar</p>
                  <p className="text-amber-600 text-sm mt-2">💎 Recursos PRO: Templates, áudio, vídeo e muito mais!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
