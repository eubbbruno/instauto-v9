'use client'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import BeautifulSidebar from '@/components/BeautifulSidebar'
import { 
  StarIcon,
  ChartBarIcon,
  TrophyIcon,
  ArrowUpIcon,
  FunnelIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

interface AvaliacaoPro {
  id: string
  clienteNome: string
  clienteAvatar?: string
  rating: number
  comentario: string
  servico: string
  data: string
  respondida: boolean
  resposta?: string
  helpful: number
  sentiment: 'positive' | 'neutral' | 'negative'
  keywords: string[]
  clienteFrequente: boolean
  valorServico: number
}

const mockAvaliacoesPro: AvaliacaoPro[] = [
  {
    id: '1',
    clienteNome: 'João Silva',
    rating: 5,
    comentario: 'Excelente atendimento! Resolveram o problema do meu carro rapidamente e com preço justo. A equipe é muito profissional e o ambiente é limpo e organizado. Recomendo!',
    servico: 'Troca de óleo + Filtros',
    data: '2025-01-15',
    respondida: true,
    resposta: 'Muito obrigado João! Foi um prazer te atender. Volte sempre!',
    helpful: 12,
    sentiment: 'positive',
    keywords: ['atendimento', 'rapidez', 'preço justo', 'profissional'],
    clienteFrequente: true,
    valorServico: 280
  },
  {
    id: '2',
    clienteNome: 'Maria Santos',
    rating: 4,
    comentario: 'Bom serviço, mas demorou um pouco mais do que esperado. A qualidade do trabalho é excelente, só achei que poderia ter sido mais rápido.',
    servico: 'Freios completos',
    data: '2025-01-12',
    respondida: false,
    helpful: 5,
    sentiment: 'neutral',
    keywords: ['qualidade', 'demora', 'trabalho excelente'],
    clienteFrequente: false,
    valorServico: 890
  },
  {
    id: '3',
    clienteNome: 'Carlos Oliveira',
    rating: 5,
    comentario: 'Profissionais muito competentes. Explicaram tudo que estava sendo feito e o porquê. Preço honesto e serviço de primeira qualidade.',
    servico: 'Revisão completa + Diagnóstico',
    data: '2025-01-10',
    respondida: true,
    resposta: 'Obrigado Carlos! Transparência é fundamental para nós.',
    helpful: 18,
    sentiment: 'positive',
    keywords: ['competência', 'transparência', 'qualidade', 'honestidade'],
    clienteFrequente: true,
    valorServico: 650
  },
  {
    id: '4',
    clienteNome: 'Ana Costa',
    rating: 3,
    comentario: 'O serviço ficou bom, mas tive que voltar porque um problema não foi resolvido completamente na primeira vez.',
    servico: 'Sistema elétrico',
    data: '2025-01-08',
    respondida: true,
    resposta: 'Olá Ana, pedimos desculpas pelo inconveniente. Já corrigimos o problema e oferecemos garantia estendida.',
    helpful: 3,
    sentiment: 'negative',
    keywords: ['problema', 'retorno', 'incompleto'],
    clienteFrequente: false,
    valorServico: 420
  }
]

export default function AvaliacoesProClient() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [avaliacoes] = useState<AvaliacaoPro[]>(mockAvaliacoesPro)
  const [filtroRating, setFiltroRating] = useState('all')
  const [filtroSentiment, setFiltroSentiment] = useState('all')
  const [filtroPeriodo, setFiltroPeriodo] = useState('30')

  // Estatísticas avançadas
  const stats = {
    total: avaliacoes.length,
    media: avaliacoes.reduce((acc, av) => acc + av.rating, 0) / avaliacoes.length,
    respondidas: avaliacoes.filter(av => av.respondida).length,
    naoRespondidas: avaliacoes.filter(av => !av.respondida).length,
    positive: avaliacoes.filter(av => av.sentiment === 'positive').length,
    negative: avaliacoes.filter(av => av.sentiment === 'negative').length,
    clientesFrequentes: avaliacoes.filter(av => av.clienteFrequente).length,
    ticketMedio: avaliacoes.reduce((acc, av) => acc + av.valorServico, 0) / avaliacoes.length
  }

  const distribuicaoRating = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: avaliacoes.filter(av => av.rating === rating).length,
    percentage: (avaliacoes.filter(av => av.rating === rating).length / avaliacoes.length) * 100
  }))

  // Keywords mais mencionadas
  const topKeywords = avaliacoes
    .flatMap(av => av.keywords)
    .reduce((acc: any, keyword) => {
      acc[keyword] = (acc[keyword] || 0) + 1
      return acc
    }, {})

  const sortedKeywords = Object.entries(topKeywords)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 6)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    try {
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
      
    } catch (error) {
      console.error('❌ Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100'
      case 'negative': return 'text-red-600 bg-red-100'
      default: return 'text-yellow-600 bg-yellow-100'
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '😊'
      case 'negative': return '😞'
      default: return '😐'
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="hidden md:block w-64 h-screen bg-gradient-to-b from-amber-800 to-orange-600"></div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando avaliações PRO...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BeautifulSidebar 
        userType="oficina-pro"
        userName={profile?.name || user?.email?.split('@')[0] || 'Oficina PRO'}
        userEmail={user?.email}
        onLogout={logout}
      />
      
      <div className="flex-1 md:ml-64 transition-all duration-300">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                💎 Avaliações Avançadas
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-normal">
                  PRO
                </span>
              </h1>
              <p className="text-gray-600">Analytics completas de satisfação do cliente</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-4">
              
              {/* Estatísticas Avançadas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 rounded-lg p-3">
                      <StarIconSolid className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Avaliação Média</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.media.toFixed(1)} ⭐
                      </p>
                      <p className="text-xs text-green-600">+0.3 vs mês passado</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 rounded-lg p-3">
                      <ChartBarIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Sentiment Positivo</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {Math.round((stats.positive / stats.total) * 100)}%
                      </p>
                      <p className="text-xs text-green-600">+12% vs mês passado</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 rounded-lg p-3">
                      <TrophyIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Clientes Frequentes</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.clientesFrequentes}</p>
                      <p className="text-xs text-purple-600">65% do total</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 rounded-lg p-3">
                      <ArrowUpIcon className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Ticket Médio</p>
                      <p className="text-2xl font-bold text-gray-900">
                        R$ {stats.ticketMedio.toFixed(0)}
                      </p>
                      <p className="text-xs text-amber-600">+8% vs mês passado</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Distribuição de Ratings */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Distribuição de Ratings</h3>
                  <div className="space-y-3">
                    {distribuicaoRating.map((item) => (
                      <div key={item.rating} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-16">
                          <span className="text-sm text-gray-600">{item.rating}</span>
                          <StarIconSolid className="h-4 w-4 text-yellow-400" />
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-400 h-2 rounded-full transition-all"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-8">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Keywords Mais Mencionadas */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <SparklesIcon className="h-5 w-5 text-purple-600" />
                    Top Keywords
                  </h3>
                  <div className="space-y-3">
                    {sortedKeywords.map(([keyword, count], index) => (
                      <div key={keyword} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 capitalize">{keyword}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-500 h-2 rounded-full"
                              style={{ width: `${((count as number) / avaliacoes.length) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 w-6">{count as number}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Filtros Avançados */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FunnelIcon className="h-5 w-5 text-blue-600" />
                    Filtros PRO
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
                      <select 
                        value={filtroPeriodo}
                        onChange={(e) => setFiltroPeriodo(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="7">Últimos 7 dias</option>
                        <option value="30">Últimos 30 dias</option>
                        <option value="90">Últimos 3 meses</option>
                        <option value="365">Último ano</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                      <select 
                        value={filtroRating}
                        onChange={(e) => setFiltroRating(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="all">Todos</option>
                        <option value="5">5 estrelas</option>
                        <option value="4">4 estrelas</option>
                        <option value="3">3 estrelas</option>
                        <option value="2">2 estrelas</option>
                        <option value="1">1 estrela</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sentiment</label>
                      <select 
                        value={filtroSentiment}
                        onChange={(e) => setFiltroSentiment(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="all">Todos</option>
                        <option value="positive">Positivo</option>
                        <option value="neutral">Neutro</option>
                        <option value="negative">Negativo</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lista de Avaliações com Analytics */}
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Avaliações com IA Analytics</h3>
                    <span className="text-sm text-gray-500">{stats.naoRespondidas} pendentes</span>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {avaliacoes.map((avaliacao) => (
                    <motion.div
                      key={avaliacao.id}
                      className="p-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {avaliacao.clienteNome.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-gray-900">{avaliacao.clienteNome}</h4>
                              {avaliacao.clienteFrequente && (
                                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                                  Cliente Frequente
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              {avaliacao.servico} • R$ {avaliacao.valorServico} • {avaliacao.data}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getSentimentColor(avaliacao.sentiment)}`}>
                            {getSentimentIcon(avaliacao.sentiment)} {avaliacao.sentiment}
                          </span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <StarIconSolid
                                key={i}
                                className={`h-4 w-4 ${
                                  i < avaliacao.rating ? 'text-yellow-400' : 'text-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3">{avaliacao.comentario}</p>

                      {/* Keywords extraídas por IA */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {avaliacao.keywords.map((keyword) => (
                          <span key={keyword} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                            #{keyword}
                          </span>
                        ))}
                      </div>

                      {avaliacao.respondida ? (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <ChatBubbleLeftRightIcon className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">Sua resposta:</span>
                          </div>
                          <p className="text-blue-700 text-sm">{avaliacao.resposta}</p>
                        </div>
                      ) : (
                        <div className="flex gap-2 mb-3">
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                            Responder com IA
                          </button>
                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                            Resposta Rápida
                          </button>
                          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                            Marcar como lida
                          </button>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{avaliacao.helpful} pessoas acharam útil</span>
                          <span>Impact Score: {(avaliacao.rating * avaliacao.valorServico / 100).toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            avaliacao.respondida 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {avaliacao.respondida ? 'Respondida' : 'Pendente'}
                          </span>
                          <button className="text-gray-400 hover:text-gray-600">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Footer PRO */}
                <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TrophyIcon className="h-5 w-5 text-amber-600" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">Plano PRO Ativo</p>
                        <p className="text-xs text-amber-700">Analytics avançadas, IA e insights em tempo real</p>
                      </div>
                    </div>
                    <button className="text-sm text-amber-700 hover:text-amber-800 font-medium">
                      Exportar Relatório →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
