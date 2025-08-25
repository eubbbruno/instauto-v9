'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BeautifulSidebar from '@/components/BeautifulSidebar'
import { 
  BellIcon,
  CheckIcon,
  TrashIcon,
  FunnelIcon,
  Cog6ToothIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  StarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  GiftIcon,
  TruckIcon,
  WrenchIcon,
  ChatBubbleLeftIcon,
  HeartIcon,
  FireIcon,
  DocumentTextIcon,
  MapPinIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline'
import { BellIcon as BellSolid } from '@heroicons/react/24/solid'

interface Notificacao {
  id: string
  tipo: 'agendamento' | 'promocao' | 'sistema' | 'pagamento' | 'avaliacao' | 'mensagem' | 'lembrete'
  titulo: string
  descricao: string
  horario: string
  lida: boolean
  importante: boolean
  icone: any
  cor: string
  acao?: {
    texto: string
    tipo: 'primary' | 'secondary'
  }
  meta?: {
    oficinaId?: string
    agendamentoId?: string
    valor?: number
  }
}

const notificacoesMock: Notificacao[] = [
  {
    id: '1',
    tipo: 'agendamento',
    titulo: 'Serviço Concluído! 🎉',
    descricao: 'Seu Honda Civic está pronto na AutoCenter Premium. Pode retirar a qualquer momento!',
    horario: 'há 15 min',
    lida: false,
    importante: true,
    icone: CheckIcon,
    cor: 'green',
    acao: {
      texto: 'Ver Detalhes',
      tipo: 'primary'
    },
    meta: {
      oficinaId: '1',
      agendamentoId: 'ag123'
    }
  },
  {
    id: '2',
    tipo: 'promocao',
    titulo: 'Oferta Especial! 🔥',
    descricao: '30% OFF em revisão completa na Oficina São José. Válido até sexta-feira!',
    horario: 'há 1h',
    lida: false,
    importante: false,
    icone: GiftIcon,
    cor: 'orange',
    acao: {
      texto: 'Aproveitar',
      tipo: 'primary'
    },
    meta: {
      oficinaId: '2',
      valor: 150
    }
  },
  {
    id: '3',
    tipo: 'lembrete',
    titulo: 'Lembrete de Manutenção',
    descricao: 'Seu veículo está com 9.850 km. Recomendamos uma revisão em breve.',
    horario: 'há 2h',
    lida: true,
    importante: false,
    icone: ClockIcon,
    cor: 'blue',
    acao: {
      texto: 'Agendar',
      tipo: 'secondary'
    }
  },
  {
    id: '4',
    tipo: 'mensagem',
    titulo: 'Nova Mensagem',
    descricao: 'MecânicaExpress enviou uma mensagem sobre seu agendamento.',
    horario: 'há 3h',
    lida: true,
    importante: false,
    icone: ChatBubbleLeftIcon,
    cor: 'purple'
  },
  {
    id: '5',
    tipo: 'avaliacao',
    titulo: 'Avalie seu Atendimento',
    descricao: 'Como foi o serviço na Central Auto? Sua opinião é importante!',
    horario: 'há 4h',
    lida: true,
    importante: false,
    icone: StarIcon,
    cor: 'yellow',
    acao: {
      texto: 'Avaliar',
      tipo: 'secondary'
    }
  },
  {
    id: '6',
    tipo: 'pagamento',
    titulo: 'Pagamento Aprovado ✅',
    descricao: 'Seu pagamento de R$ 350,00 foi processado com sucesso.',
    horario: 'há 6h',
    lida: true,
    importante: false,
    icone: CreditCardIcon,
    cor: 'green'
  },
  {
    id: '7',
    tipo: 'sistema',
    titulo: 'Atualização do App',
    descricao: 'Nova versão disponível com melhorias de performance e novos recursos.',
    horario: 'há 1 dia',
    lida: true,
    importante: false,
    icone: InformationCircleIcon,
    cor: 'blue'
  },
  {
    id: '8',
    tipo: 'promocao',
    titulo: 'Oficina Favorita com Desconto',
    descricao: 'AutoCenter Premium oferece 20% de desconto para clientes VIP como você!',
    horario: 'há 2 dias',
    lida: true,
    importante: false,
    icone: HeartIcon,
    cor: 'pink'
  }
]

export default function NotificacoesClient() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(notificacoesMock)
  const [filtroSelecionado, setFiltroSelecionado] = useState<string>('todas')
  const [showConfiguracao, setShowConfiguracao] = useState(false)

  const naoLidas = notificacoes.filter(n => !n.lida).length
  const importantes = notificacoes.filter(n => n.importante).length

  const marcarComoLida = (id: string) => {
    setNotificacoes(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, lida: true } : notif
      )
    )
  }

  const marcarTodasComoLidas = () => {
    setNotificacoes(prev => 
      prev.map(notif => ({ ...notif, lida: true }))
    )
  }

  const excluirNotificacao = (id: string) => {
    setNotificacoes(prev => prev.filter(notif => notif.id !== id))
  }

  const filtros = [
    { id: 'todas', label: 'Todas', count: notificacoes.length },
    { id: 'nao-lidas', label: 'Não lidas', count: naoLidas },
    { id: 'importantes', label: 'Importantes', count: importantes },
    { id: 'agendamento', label: 'Agendamentos', count: notificacoes.filter(n => n.tipo === 'agendamento').length },
    { id: 'promocao', label: 'Promoções', count: notificacoes.filter(n => n.tipo === 'promocao').length }
  ]

  const notificacoesFiltradas = notificacoes.filter(notif => {
    switch (filtroSelecionado) {
      case 'nao-lidas':
        return !notif.lida
      case 'importantes':
        return notif.importante
      case 'agendamento':
      case 'promocao':
      case 'sistema':
      case 'pagamento':
      case 'avaliacao':
      case 'mensagem':
      case 'lembrete':
        return notif.tipo === filtroSelecionado
      default:
        return true
    }
  })

  const getCorNotificacao = (cor: string) => {
    const cores = {
      green: 'bg-green-100 text-green-600 border-green-200',
      orange: 'bg-orange-100 text-orange-600 border-orange-200',
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
      yellow: 'bg-yellow-100 text-yellow-600 border-yellow-200',
      pink: 'bg-pink-100 text-pink-600 border-pink-200',
      red: 'bg-red-100 text-red-600 border-red-200'
    }
    return cores[cor as keyof typeof cores] || cores.blue
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
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <BellSolid className="h-8 w-8 text-blue-500" />
                Notificações
                {naoLidas > 0 && (
                  <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded-full">
                    {naoLidas}
                  </span>
                )}
              </h1>
              <p className="text-gray-600">Mantenha-se atualizado sobre seus agendamentos e promoções</p>
            </div>
            <div className="flex items-center gap-3">
              {naoLidas > 0 && (
                <button
                  onClick={marcarTodasComoLidas}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 flex items-center gap-2 transition-all"
                >
                  <CheckIcon className="w-5 h-5" />
                  Marcar todas como lidas
                </button>
              )}
              
              <button
                onClick={() => setShowConfiguracao(!showConfiguracao)}
                className="bg-gray-600 text-white px-4 py-2 rounded-xl hover:bg-gray-700 flex items-center gap-2 transition-all"
              >
                <Cog6ToothIcon className="w-5 h-5" />
                Configurações
              </button>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-6">

              {/* Configurações (Modal/Drawer) */}
              <AnimatePresence>
                {showConfiguracao && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">⚙️ Configurações de Notificação</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-800">Tipos de Notificação</h4>
                        
                        {[
                          { id: 'agendamentos', label: 'Agendamentos e Serviços', icon: CalendarDaysIcon },
                          { id: 'promocoes', label: 'Promoções e Ofertas', icon: GiftIcon },
                          { id: 'mensagens', label: 'Mensagens das Oficinas', icon: ChatBubbleLeftIcon },
                          { id: 'lembretes', label: 'Lembretes de Manutenção', icon: ClockIcon },
                          { id: 'pagamentos', label: 'Confirmações de Pagamento', icon: CreditCardIcon }
                        ].map((item) => {
                          const IconComponent = item.icon
                          return (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <IconComponent className="h-5 w-5 text-blue-500" />
                                <span className="text-gray-700">{item.label}</span>
                              </div>
                              <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-blue-600 transition-colors duration-200 ease-in-out">
                                <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5" />
                              </button>
                            </div>
                          )
                        })}
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-800">Canais de Notificação</h4>
                        
                        <div className="space-y-3">
                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-blue-900">📱 Push Notifications</span>
                              <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-blue-600 transition-colors duration-200 ease-in-out">
                                <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5" />
                              </button>
                            </div>
                            <p className="text-sm text-blue-700">Receba notificações no seu dispositivo</p>
                          </div>
                          
                          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-green-900">📧 Email</span>
                              <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-green-600 transition-colors duration-200 ease-in-out">
                                <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5" />
                              </button>
                            </div>
                            <p className="text-sm text-green-700">Resumo diário por email</p>
                          </div>
                          
                          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-purple-900">💬 WhatsApp</span>
                              <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out">
                                <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                              </button>
                            </div>
                            <p className="text-sm text-purple-700">Notificações importantes via WhatsApp</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end gap-3">
                      <button
                        onClick={() => setShowConfiguracao(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => setShowConfiguracao(false)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Salvar
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Filtros */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <FunnelIcon className="h-5 w-5 text-gray-500" />
                  <h3 className="font-semibold text-gray-900">Filtros</h3>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {filtros.map((filtro) => (
                    <button
                      key={filtro.id}
                      onClick={() => setFiltroSelecionado(filtro.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filtroSelecionado === filtro.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {filtro.label}
                      {filtro.count > 0 && (
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                          filtroSelecionado === filtro.id
                            ? 'bg-white text-blue-600'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {filtro.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lista de Notificações */}
              <div className="space-y-4">
                <AnimatePresence>
                  {notificacoesFiltradas.map((notificacao, index) => {
                    const IconComponent = notificacao.icone
                    return (
                      <motion.div
                        key={notificacao.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -300 }}
                        transition={{ delay: index * 0.05 }}
                        className={`bg-white rounded-xl shadow-lg border-l-4 ${
                          notificacao.importante ? 'border-l-red-500' : 'border-l-blue-500'
                        } ${!notificacao.lida ? 'border border-blue-200' : 'border border-gray-100'}`}
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              <div className={`p-3 rounded-xl ${getCorNotificacao(notificacao.cor)}`}>
                                <IconComponent className="h-6 w-6" />
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className={`text-lg font-semibold ${!notificacao.lida ? 'text-gray-900' : 'text-gray-700'}`}>
                                    {notificacao.titulo}
                                  </h3>
                                  {notificacao.importante && (
                                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                                  )}
                                  {!notificacao.lida && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  )}
                                </div>
                                
                                <p className={`text-sm mb-3 ${!notificacao.lida ? 'text-gray-700' : 'text-gray-600'}`}>
                                  {notificacao.descricao}
                                </p>
                                
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-500">{notificacao.horario}</span>
                                  
                                  {notificacao.acao && (
                                    <button
                                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        notificacao.acao.tipo === 'primary'
                                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                      }`}
                                    >
                                      {notificacao.acao.texto}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 ml-4">
                              {!notificacao.lida && (
                                <button
                                  onClick={() => marcarComoLida(notificacao.id)}
                                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Marcar como lida"
                                >
                                  <CheckIcon className="h-5 w-5" />
                                </button>
                              )}
                              
                              <button
                                onClick={() => excluirNotificacao(notificacao.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Excluir notificação"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
                
                {notificacoesFiltradas.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <BellIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma notificação encontrada</h3>
                    <p className="text-gray-500">
                      {filtroSelecionado === 'todas' 
                        ? 'Você está em dia! Não há notificações no momento.'
                        : `Não há notificações do tipo "${filtros.find(f => f.id === filtroSelecionado)?.label}".`
                      }
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Estatísticas */}
              {notificacoes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white mt-8"
                >
                  <h3 className="text-xl font-bold mb-4">📊 Resumo de Notificações</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold">{notificacoes.length}</p>
                      <p className="text-blue-100">Total</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold">{naoLidas}</p>
                      <p className="text-blue-100">Não lidas</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold">{importantes}</p>
                      <p className="text-blue-100">Importantes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold">{notificacoes.filter(n => n.tipo === 'promocao').length}</p>
                      <p className="text-blue-100">Promoções</p>
                    </div>
                  </div>
                </motion.div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
