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
  MapPinIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid'

interface Conversa {
  id: string
  oficina: {
    nome: string
    avatar: string
    online: boolean
    ultimaVez: string
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
}

interface Mensagem {
  id: string
  remetente: 'motorista' | 'oficina'
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
    oficina: string
    status: 'confirmado' | 'pendente' | 'cancelado'
  }
}

const conversasMock: Conversa[] = [
  {
    id: '1',
    oficina: {
      nome: 'AutoCenter Premium',
      avatar: 'AC',
      online: true,
      ultimaVez: 'Online'
    },
    ultimaMensagem: {
      texto: 'Seu veículo está pronto para retirada!',
      horario: '14:32',
      naoLida: true,
      tipo: 'texto'
    },
    agendamento: {
      id: 'ag1',
      data: '2025-01-08',
      servico: 'Revisão Completa',
      status: 'confirmado'
    }
  },
  {
    id: '2',
    oficina: {
      nome: 'Oficina São José',
      avatar: 'SJ',
      online: false,
      ultimaVez: 'há 2h'
    },
    ultimaMensagem: {
      texto: 'Foto',
      horario: '11:15',
      naoLida: true,
      tipo: 'foto'
    }
  },
  {
    id: '3',
    oficina: {
      nome: 'MecânicaExpress',
      avatar: 'ME',
      online: true,
      ultimaVez: 'Online'
    },
    ultimaMensagem: {
      texto: 'Obrigado pela avaliação!',
      horario: 'Ontem',
      naoLida: false,
      tipo: 'texto'
    }
  },
  {
    id: '4',
    oficina: {
      nome: 'Central Auto',
      avatar: 'CA',
      online: false,
      ultimaVez: 'há 1 dia'
    },
    ultimaMensagem: {
      texto: 'Agendamento confirmado para amanhã às 9h',
      horario: 'Ter',
      naoLida: false,
      tipo: 'agendamento'
    }
  }
]

const mensagensMock: { [key: string]: Mensagem[] } = {
  '1': [
    {
      id: 'm1',
      remetente: 'motorista',
      texto: 'Oi! Gostaria de agendar uma revisão para meu Civic',
      horario: '09:30',
      status: 'lida',
      tipo: 'texto'
    },
    {
      id: 'm2',
      remetente: 'oficina',
      texto: 'Olá! Claro, temos disponibilidade. Qual seria o melhor dia para você?',
      horario: '09:32',
      status: 'lida',
      tipo: 'texto'
    },
    {
      id: 'm3',
      remetente: 'motorista',
      texto: 'Quinta-feira de manhã seria ideal',
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
        oficina: 'AutoCenter Premium',
        status: 'confirmado'
      }
    },
    {
      id: 'm5',
      remetente: 'oficina',
      texto: 'Perfeito! Seu veículo está pronto para retirada! 🚗✨',
      horario: '14:32',
      status: 'entregue',
      tipo: 'texto'
    }
  ]
}

export default function MensagensClient() {
  const [conversaSelecionada, setConversaSelecionada] = useState<string>('1')
  const [novaMensagem, setNovaMensagem] = useState('')
  const [busca, setBusca] = useState('')
  const [typing, setTyping] = useState(false)
  const [showEmojis, setShowEmojis] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const conversaAtual = conversasMock.find(c => c.id === conversaSelecionada)
  const mensagensAtual = mensagensMock[conversaSelecionada] || []

  useEffect(() => {
    scrollToBottom()
  }, [mensagensAtual])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const enviarMensagem = () => {
    if (!novaMensagem.trim()) return
    
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
    const isUsuario = mensagem.remetente === 'motorista'
    const isSistema = mensagem.tipo === 'sistema'

    if (isSistema) {
      return (
        <div className="flex justify-center my-4">
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm max-w-xs text-center">
            {mensagem.agendamento && (
              <div className="space-y-2">
                <p className="font-medium">✅ Agendamento Confirmado</p>
                <div className="bg-white rounded p-3 text-left">
                  <p className="font-semibold text-gray-900">{mensagem.agendamento.servico}</p>
                  <p className="text-sm text-gray-600">📅 {new Date(mensagem.agendamento.data).toLocaleDateString('pt-BR')}</p>
                  <p className="text-sm text-gray-600">🏢 {mensagem.agendamento.oficina}</p>
                  <div className="mt-2 flex gap-2">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition-colors">
                      Ver Detalhes
                    </button>
                    <button className="bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600 transition-colors">
                      Cancelar
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
      <div className={`flex ${isUsuario ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-xs lg:max-w-md ${isUsuario ? 'order-1' : 'order-2'}`}>
          <div
            className={`px-4 py-2 rounded-lg ${
              isUsuario
                ? 'bg-blue-500 text-white rounded-br-sm'
                : 'bg-gray-100 text-gray-900 rounded-bl-sm'
            }`}
          >
            <p className="text-sm">{mensagem.texto}</p>
          </div>
          <div className={`flex items-center gap-1 mt-1 ${isUsuario ? 'justify-end' : 'justify-start'}`}>
            <span className="text-xs text-gray-500">{mensagem.horario}</span>
            {isUsuario && renderStatusMensagem(mensagem.status)}
          </div>
        </div>
        
        {!isUsuario && (
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 order-1">
            {conversaAtual?.oficina.avatar}
          </div>
        )}
      </div>
    )
  }

  const conversasFiltradas = conversasMock.filter(conversa =>
    conversa.oficina.nome.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BeautifulSidebar 
        userType="motorista"
        userName="João Silva"
        userEmail="joao@email.com"
        onLogout={() => {}}
      />
      
      <div className="flex-1 md:ml-64 transition-all duration-300">
        <div className="flex h-screen">
          {/* Lista de Conversas */}
          <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
            {/* Header Lista */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-gray-900">💬 Mensagens</h1>
                <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                </button>
              </div>
              
              {/* Busca */}
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar conversas..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    conversaSelecionada === conversa.id ? 'bg-blue-50 border-r-2 border-r-blue-500' : ''
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {conversa.oficina.avatar}
                      </div>
                      {conversa.oficina.online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate">{conversa.oficina.nome}</h3>
                        <span className="text-xs text-gray-500">{conversa.ultimaMensagem.horario}</span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-1">
                        <p className={`text-sm truncate ${conversa.ultimaMensagem.naoLida ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                          {conversa.ultimaMensagem.tipo === 'foto' ? '📷 Foto' : 
                           conversa.ultimaMensagem.tipo === 'agendamento' ? '📅 Agendamento' :
                           conversa.ultimaMensagem.texto}
                        </p>
                        {conversa.ultimaMensagem.naoLida && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 flex-shrink-0"></div>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-1">{conversa.oficina.ultimaVez}</p>
                      
                      {conversa.agendamento && (
                        <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                          <p className="font-medium text-blue-800">📅 {conversa.agendamento.servico}</p>
                          <p className="text-blue-600">{new Date(conversa.agendamento.data).toLocaleDateString('pt-BR')}</p>
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
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {conversaAtual.oficina.avatar}
                        </div>
                        {conversaAtual.oficina.online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <h2 className="font-semibold text-gray-900">{conversaAtual.oficina.nome}</h2>
                        <p className="text-sm text-gray-500">
                          {conversaAtual.oficina.online ? (
                            <span className="text-green-600">● Online</span>
                          ) : (
                            `Visto ${conversaAtual.oficina.ultimaVez}`
                          )}
                          {typing && (
                            <span className="text-blue-500 ml-2">digitando...</span>
                          )}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                        <PhoneIcon className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                        <VideoCameraIcon className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                        <EllipsisVerticalIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  {conversaAtual.agendamento && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-blue-900">📅 Agendamento Ativo</p>
                          <p className="text-sm text-blue-700">{conversaAtual.agendamento.servico}</p>
                          <p className="text-sm text-blue-600">{new Date(conversaAtual.agendamento.data).toLocaleDateString('pt-BR')}</p>
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
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      <PaperAirplaneIcon className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {/* Emojis */}
                  {showEmojis && (
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
                  <p className="text-gray-500">Escolha uma oficina para começar a conversar</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
