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
  StarIcon as CrownIcon,
  LockClosedIcon,
  UserIcon,
  TruckIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid'

interface Conversa {
  id: string
  motorista: {
    nome: string
    avatar: string
    online: boolean
    ultimaVez: string
    veiculo?: string
  }
  ultimaMensagem: {
    texto: string
    horario: string
    naoLida: boolean
    tipo: 'texto' | 'foto' | 'arquivo' | 'agendamento'
  }
  agendamento?: {
    id: string
    data: string
    servico: string
    status: 'confirmado' | 'pendente' | 'cancelado'
  }
  limite?: boolean // Para FREE
}

interface Mensagem {
  id: string
  remetente: 'oficina' | 'motorista'
  texto: string
  horario: string
  status: 'enviando' | 'enviada' | 'entregue' | 'lida'
  tipo: 'texto' | 'foto' | 'arquivo' | 'agendamento' | 'sistema'
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
    status: 'confirmado' | 'pendente' | 'cancelado'
  }
}

const conversasMockFree: Conversa[] = [
  {
    id: '1',
    motorista: {
      nome: 'João Silva',
      avatar: 'JS',
      online: true,
      ultimaVez: 'Online',
      veiculo: 'Honda Civic'
    },
    ultimaMensagem: {
      texto: 'Obrigado pelo excelente serviço!',
      horario: '14:32',
      naoLida: true,
      tipo: 'texto'
    },
    agendamento: {
      id: 'ag1',
      data: '2025-01-08',
      servico: 'Revisão',
      status: 'confirmado'
    }
  },
  {
    id: '2',
    motorista: {
      nome: 'Maria Santos',
      avatar: 'MS',
      online: false,
      ultimaVez: 'há 1h',
      veiculo: 'Toyota Corolla'
    },
    ultimaMensagem: {
      texto: 'Quando posso agendar a troca de óleo?',
      horario: '11:15',
      naoLida: true,
      tipo: 'texto'
    }
  },
  {
    id: '3',
    motorista: {
      nome: 'Pedro Costa',
      avatar: 'PC',
      online: true,
      ultimaVez: 'Online',
      veiculo: 'VW Gol'
    },
    ultimaMensagem: {
      texto: 'Foto',
      horario: 'Ontem',
      naoLida: false,
      tipo: 'foto'
    }
  },
  // Limite FREE - apenas 3 conversas ativas
  {
    id: '4',
    motorista: {
      nome: 'Ana Oliveira',
      avatar: 'AO',
      online: false,
      ultimaVez: 'há 2 dias'
    },
    ultimaMensagem: {
      texto: 'Esta conversa está limitada no plano FREE',
      horario: 'Seg',
      naoLida: false,
      tipo: 'texto'
    },
    limite: true
  }
]

const mensagensMockFree: { [key: string]: Mensagem[] } = {
  '1': [
    {
      id: 'm1',
      remetente: 'motorista',
      texto: 'Oi! Preciso fazer a revisão do meu Civic',
      horario: '09:30',
      status: 'lida',
      tipo: 'texto'
    },
    {
      id: 'm2',
      remetente: 'oficina',
      texto: 'Olá João! Claro, temos disponibilidade. Que tal quinta-feira de manhã?',
      horario: '09:32',
      status: 'lida',
      tipo: 'texto'
    },
    {
      id: 'm3',
      remetente: 'motorista',
      texto: 'Perfeito! Confirmo para quinta às 9h',
      horario: '09:35',
      status: 'lida',
      tipo: 'texto'
    },
    {
      id: 'm4',
      remetente: 'sistema',
      texto: 'Agendamento confirmado para quinta-feira, 08/01 às 09:00',
      horario: '09:36',
      status: 'lida',
      tipo: 'agendamento',
      agendamento: {
        id: 'ag1',
        data: '2025-01-08',
        servico: 'Revisão Completa',
        motorista: 'João Silva',
        status: 'confirmado'
      }
    },
    {
      id: 'm5',
      remetente: 'motorista',
      texto: 'Obrigado pelo excelente serviço! Muito profissionais! 👏',
      horario: '14:32',
      status: 'entregue',
      tipo: 'texto'
    }
  ],
  '4': [
    {
      id: 'm6',
      remetente: 'sistema',
      texto: 'Esta conversa está limitada no plano FREE. Upgrade para PRO para conversas ilimitadas!',
      horario: 'Seg',
      status: 'lida',
      tipo: 'sistema'
    }
  ]
}

export default function MensagensClient() {
  const [conversaSelecionada, setConversaSelecionada] = useState<string>('1')
  const [novaMensagem, setNovaMensagem] = useState('')
  const [busca, setBusca] = useState('')
  const [typing, setTyping] = useState(false)
  const [showEmojis, setShowEmojis] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const conversaAtual = conversasMockFree.find(c => c.id === conversaSelecionada)
  const mensagensAtual = mensagensMockFree[conversaSelecionada] || []

  // Limite FREE - máximo 3 conversas ativas
  const conversasAtivas = conversasMockFree.filter(c => !c.limite).length
  const limiteAtingido = conversasAtivas >= 3

  useEffect(() => {
    scrollToBottom()
  }, [mensagensAtual])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const enviarMensagem = () => {
    if (!novaMensagem.trim()) return
    
    if (conversaAtual?.limite) {
      setShowUpgrade(true)
      return
    }
    
    // Simular envio
    setNovaMensagem('')
    // Aqui seria a integração com o backend
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

  const renderMensagem = (mensagem: Mensagem) => {
    const isOficina = mensagem.remetente === 'oficina'
    const isSistema = mensagem.tipo === 'sistema'

    if (isSistema) {
      return (
        <div className="flex justify-center my-4">
          <div className={`${
            mensagem.texto.includes('limitada') 
              ? 'bg-red-100 text-red-800 border border-red-200' 
              : 'bg-blue-100 text-blue-800'
          } px-4 py-2 rounded-lg text-sm max-w-xs text-center`}>
            {mensagem.agendamento && (
              <div className="space-y-2">
                <p className="font-medium">✅ Agendamento Confirmado</p>
                <div className="bg-white rounded p-3 text-left">
                  <p className="font-semibold text-gray-900">{mensagem.agendamento.servico}</p>
                  <p className="text-sm text-gray-600">📅 {new Date(mensagem.agendamento.data).toLocaleDateString('pt-BR')}</p>
                  <p className="text-sm text-gray-600">👤 {mensagem.agendamento.motorista}</p>
                  <div className="mt-2 flex gap-2">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition-colors">
                      Ver Detalhes
                    </button>
                    <button className="bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600 transition-colors">
                      Reagendar
                    </button>
                  </div>
                </div>
              </div>
            )}
            {!mensagem.agendamento && (
              <div>
                <p>{mensagem.texto}</p>
                {mensagem.texto.includes('limitada') && (
                  <button 
                    onClick={() => setShowUpgrade(true)}
                    className="mt-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded text-xs hover:from-amber-600 hover:to-orange-600 transition-all"
                  >
                    Upgrade PRO
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )
    }

    return (
      <div className={`flex ${isOficina ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-xs lg:max-w-md ${isOficina ? 'order-1' : 'order-2'}`}>
          <div
            className={`px-4 py-2 rounded-lg ${
              isOficina
                ? 'bg-green-500 text-white rounded-br-sm'
                : 'bg-gray-100 text-gray-900 rounded-bl-sm'
            }`}
          >
            <p className="text-sm">{mensagem.texto}</p>
          </div>
          <div className={`flex items-center gap-1 mt-1 ${isOficina ? 'justify-end' : 'justify-start'}`}>
            <span className="text-xs text-gray-500">{mensagem.horario}</span>
            {isOficina && renderStatusMensagem(mensagem.status)}
          </div>
        </div>
        
        {!isOficina && (
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 order-1">
            {conversaAtual?.motorista.avatar}
          </div>
        )}
      </div>
    )
  }

  const conversasFiltradas = conversasMockFree.filter(conversa =>
    conversa.motorista.nome.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BeautifulSidebar 
        userType="oficina-free"
        userName="Oficina Básica"
        userEmail="oficina@email.com"
        onLogout={() => {}}
      />
      
      <div className="flex-1 md:ml-64 transition-all duration-300">
        {/* Modal Upgrade */}
        <AnimatePresence>
          {showUpgrade && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setShowUpgrade(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-8 max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <CrownIcon className="h-16 w-16 text-amber-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Limite FREE Atingido</h3>
                  <p className="text-gray-600 mb-6">
                    No plano FREE você pode ter apenas 3 conversas ativas. 
                    Upgrade para PRO e tenha conversas ilimitadas!
                  </p>
                  
                  <div className="space-y-3">
                    <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-lg font-bold hover:from-amber-600 hover:to-orange-600 transition-all">
                      🚀 Upgrade para PRO - R$ 89/mês
                    </button>
                    <button 
                      onClick={() => setShowUpgrade(false)}
                      className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Continuar FREE
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex h-screen">
          {/* Lista de Conversas */}
          <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
            {/* Header Lista */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  💬 Mensagens
                  <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded">
                    FREE
                  </span>
                </h1>
                <button 
                  onClick={() => limiteAtingido && setShowUpgrade(true)}
                  className={`p-2 rounded-lg transition-colors ${
                    limiteAtingido 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-green-500 hover:bg-green-50'
                  }`}
                  title={limiteAtingido ? 'Limite FREE atingido' : 'Nova conversa'}
                >
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                </button>
              </div>
              
              {/* Limite Indicator */}
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-amber-800">
                    Conversas: {conversasAtivas}/3
                  </span>
                  <span className="text-xs text-amber-600">Plano FREE</span>
                </div>
                <div className="w-full bg-amber-200 rounded-full h-2">
                  <div 
                    className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(conversasAtivas / 3) * 100}%` }}
                  />
                </div>
                {limiteAtingido && (
                  <button 
                    onClick={() => setShowUpgrade(true)}
                    className="mt-2 text-xs bg-amber-500 text-white px-3 py-1 rounded hover:bg-amber-600 transition-colors"
                  >
                    Upgrade para Conversas Ilimitadas
                  </button>
                )}
              </div>
              
              {/* Busca */}
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar clientes..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Lista */}
            <div className="flex-1 overflow-y-auto">
              {conversasFiltradas.map((conversa) => (
                <motion.div
                  key={conversa.id}
                  onClick={() => !conversa.limite && setConversaSelecionada(conversa.id)}
                  className={`p-4 border-b border-gray-100 transition-colors relative ${
                    conversa.limite 
                      ? 'opacity-60 cursor-not-allowed' 
                      : `cursor-pointer hover:bg-gray-50 ${
                          conversaSelecionada === conversa.id ? 'bg-green-50 border-r-2 border-r-green-500' : ''
                        }`
                  }`}
                  whileHover={!conversa.limite ? { scale: 1.01 } : {}}
                  whileTap={!conversa.limite ? { scale: 0.99 } : {}}
                >
                  {conversa.limite && (
                    <div className="absolute top-2 right-2">
                      <LockClosedIcon className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                        {conversa.motorista.avatar}
                      </div>
                      {conversa.motorista.online && !conversa.limite && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate">{conversa.motorista.nome}</h3>
                        <span className="text-xs text-gray-500">{conversa.ultimaMensagem.horario}</span>
                      </div>
                      
                      {conversa.motorista.veiculo && (
                        <div className="flex items-center gap-1 mt-1">
                          <TruckIcon className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{conversa.motorista.veiculo}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-1">
                        <p className={`text-sm truncate ${
                          conversa.ultimaMensagem.naoLida && !conversa.limite 
                            ? 'font-medium text-gray-900' 
                            : 'text-gray-600'
                        }`}>
                          {conversa.ultimaMensagem.tipo === 'foto' ? '📷 Foto' : 
                           conversa.ultimaMensagem.tipo === 'agendamento' ? '📅 Agendamento' :
                           conversa.ultimaMensagem.texto}
                        </p>
                        {conversa.ultimaMensagem.naoLida && !conversa.limite && (
                          <div className="w-2 h-2 bg-green-500 rounded-full ml-2 flex-shrink-0"></div>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-1">{conversa.motorista.ultimaVez}</p>
                      
                      {conversa.agendamento && !conversa.limite && (
                        <div className="mt-2 p-2 bg-green-50 rounded text-xs">
                          <p className="font-medium text-green-800">📅 {conversa.agendamento.servico}</p>
                          <p className="text-green-600">{new Date(conversa.agendamento.data).toLocaleDateString('pt-BR')}</p>
                        </div>
                      )}
                      
                      {conversa.limite && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
                          <p className="font-medium text-red-800">🔒 Limite FREE</p>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowUpgrade(true)
                            }}
                            className="text-amber-600 hover:text-amber-800 underline"
                          >
                            Upgrade PRO
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Área de Chat */}
          <div className="flex-1 flex flex-col">
            {conversaAtual ? (
              <>
                {/* Header do Chat */}
                <div className="bg-white border-b border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                          {conversaAtual.motorista.avatar}
                        </div>
                        {conversaAtual.motorista.online && !conversaAtual.limite && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                          {conversaAtual.motorista.nome}
                          {conversaAtual.limite && (
                            <LockClosedIcon className="h-4 w-4 text-red-500" />
                          )}
                        </h2>
                        <div className="flex items-center gap-2">
                          {conversaAtual.motorista.veiculo && (
                            <span className="text-sm text-gray-500">🚗 {conversaAtual.motorista.veiculo}</span>
                          )}
                          <span className="text-sm text-gray-500">
                            {conversaAtual.motorista.online && !conversaAtual.limite ? (
                              <span className="text-green-600">● Online</span>
                            ) : (
                              `Visto ${conversaAtual.motorista.ultimaVez}`
                            )}
                            {typing && !conversaAtual.limite && (
                              <span className="text-green-500 ml-2">digitando...</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        className={`p-2 rounded-lg transition-colors ${
                          conversaAtual.limite 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}
                        disabled={conversaAtual.limite}
                      >
                        <PhoneIcon className="h-5 w-5" />
                      </button>
                      <button 
                        className={`p-2 rounded-lg transition-colors ${
                          conversaAtual.limite 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}
                        disabled={conversaAtual.limite}
                      >
                        <VideoCameraIcon className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                        <EllipsisVerticalIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  {conversaAtual.agendamento && !conversaAtual.limite && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-green-900">📅 Agendamento Ativo</p>
                          <p className="text-sm text-green-700">{conversaAtual.agendamento.servico}</p>
                          <p className="text-sm text-green-600">{new Date(conversaAtual.agendamento.data).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          conversaAtual.agendamento.status === 'confirmado' ? 'bg-green-100 text-green-800' :
                          conversaAtual.agendamento.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {conversaAtual.agendamento.status === 'confirmado' ? 'Confirmado' :
                           conversaAtual.agendamento.status === 'pendente' ? 'Pendente' : 'Cancelado'}
                        </div>
                      </div>
                    </div>
                  )}

                  {conversaAtual.limite && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-red-900">🔒 Conversa Limitada</p>
                          <p className="text-sm text-red-700">Upgrade para PRO para conversas ilimitadas</p>
                        </div>
                        <button 
                          onClick={() => setShowUpgrade(true)}
                          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
                        >
                          Upgrade
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mensagens */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
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

                {/* Input de Mensagem */}
                <div className="bg-white border-t border-gray-200 p-4">
                  {conversaAtual.limite ? (
                    <div className="text-center py-4">
                      <LockClosedIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-3">Esta conversa está limitada no plano FREE</p>
                      <button 
                        onClick={() => setShowUpgrade(true)}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
                      >
                        🚀 Upgrade para PRO
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-end gap-2">
                      <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                        <PaperClipIcon className="h-5 w-5" />
                      </button>
                      
                      <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                        <PhotoIcon className="h-5 w-5" />
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
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
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
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        <PaperAirplaneIcon className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                  
                  {/* Emojis */}
                  {showEmojis && !conversaAtual.limite && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex flex-wrap gap-2">
                        {['😊', '👍', '❤️', '😢', '😡', '🚗', '🔧', '✅', '❌', '📅', '⏰', '💰'].map(emoji => (
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
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione uma conversa</h3>
                  <p className="text-gray-500">Escolha um cliente para começar a conversar</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
