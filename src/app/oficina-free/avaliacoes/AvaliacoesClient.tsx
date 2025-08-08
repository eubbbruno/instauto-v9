'use client'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import BeautifulSidebar from '@/components/BeautifulSidebar'
import { 
  StarIcon,
  ChartBarIcon,
  TrophyIcon,
  LockClosedIcon,
  ArrowUpIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

interface Avaliacao {
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
}

const mockAvaliacoes: Avaliacao[] = [
  {
    id: '1',
    clienteNome: 'João Silva',
    rating: 5,
    comentario: 'Excelente atendimento! Resolveram o problema do meu carro rapidamente e com preço justo. Recomendo!',
    servico: 'Troca de óleo',
    data: '2025-01-15',
    respondida: true,
    resposta: 'Muito obrigado João! Foi um prazer te atender. Volte sempre!',
    helpful: 8
  },
  {
    id: '2', 
    clienteNome: 'Maria Santos',
    rating: 4,
    comentario: 'Bom serviço, mas demorou um pouco mais do que esperado. No geral, satisfeita com o resultado.',
    servico: 'Freios',
    data: '2025-01-12',
    respondida: false,
    helpful: 3
  },
  {
    id: '3',
    clienteNome: 'Carlos Oliveira', 
    rating: 5,
    comentario: 'Profissionais muito competentes. Explicaram tudo que estava sendo feito. Preço honesto.',
    servico: 'Revisão geral',
    data: '2025-01-10',
    respondida: true,
    resposta: 'Obrigado Carlos! Transparência é fundamental para nós.',
    helpful: 12
  }
]

export default function AvaliacoesClient() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [avaliacoes] = useState<Avaliacao[]>(mockAvaliacoes)
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(true)

  // Estatísticas das avaliações
  const stats = {
    total: avaliacoes.length,
    media: avaliacoes.reduce((acc, av) => acc + av.rating, 0) / avaliacoes.length,
    respondidas: avaliacoes.filter(av => av.respondida).length,
    naoRespondidas: avaliacoes.filter(av => !av.respondida).length
  }

  const distribuicaoRating = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: avaliacoes.filter(av => av.rating === rating).length,
    percentage: (avaliacoes.filter(av => av.rating === rating).length / avaliacoes.length) * 100
  }))

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

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="hidden md:block w-64 h-screen bg-gradient-to-b from-green-800 to-green-600"></div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando avaliações...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BeautifulSidebar 
        userType="oficina-free"
        userName={profile?.name || user?.email?.split('@')[0] || 'Oficina'}
        userEmail={user?.email}
        onLogout={logout}
      />
      
      <div className="flex-1 md:ml-64 transition-all duration-300">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                ⭐ Avaliações dos Clientes
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-normal">
                  FREE
                </span>
              </h1>
              <p className="text-gray-600">Acompanhe o feedback dos seus clientes</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-4">
              
              {/* Upgrade Banner */}
              {showUpgradeBanner && (
                <motion.div
                  className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl p-6 mb-6 relative overflow-hidden"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <button
                    onClick={() => setShowUpgradeBanner(false)}
                    className="absolute top-4 right-4 text-white/80 hover:text-white"
                  >
                    ×
                  </button>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl">
                      <TrophyIcon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">Upgrade para PRO e Destaque-se!</h3>
                      <p className="text-white/90 text-sm mb-3">
                        Com o plano PRO você tem recursos avançados de avaliações:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>• Respostas automáticas com IA</div>
                        <div>• Analytics detalhadas de satisfação</div>
                        <div>• Filtros avançados por período</div>
                        <div>• Relatórios de desempenho</div>
                      </div>
                    </div>
                    <button className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                      Fazer Upgrade
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Estatísticas Gerais */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 rounded-lg p-3">
                      <StarIconSolid className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Avaliação Média</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.media.toFixed(1)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 rounded-lg p-3">
                      <ChartBarIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Total de Avaliações</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 rounded-lg p-3">
                      <ArrowUpIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Respondidas</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.respondidas}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6 relative">
                  <div className="absolute top-2 right-2">
                    <LockClosedIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <TrophyIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Analytics PRO</p>
                      <p className="text-2xl font-bold text-gray-400">+15</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs text-gray-400">Upgrade para desbloquear</span>
                  </div>
                </div>
              </div>

              {/* Distribuição de Ratings */}
              <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Distribuição de Avaliações</h3>
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

              {/* Lista de Avaliações */}
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Avaliações Recentes</h3>
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
                            <h4 className="font-semibold text-gray-900">{avaliacao.clienteNome}</h4>
                            <p className="text-sm text-gray-500">{avaliacao.servico} • {avaliacao.data}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
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
                          <span className="text-sm text-gray-600">({avaliacao.rating}.0)</span>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4">{avaliacao.comentario}</p>

                      {avaliacao.respondida ? (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-blue-800">Sua resposta:</span>
                          </div>
                          <p className="text-blue-700 text-sm">{avaliacao.resposta}</p>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                            Responder
                          </button>
                          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                            Marcar como lida
                          </button>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <span className="text-xs text-gray-500">
                          {avaliacao.helpful} pessoas acharam útil
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          avaliacao.respondida 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {avaliacao.respondida ? 'Respondida' : 'Pendente'}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Footer com limitação FREE */}
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Mostrando {avaliacoes.length} avaliações • Plano FREE
                    </p>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Ver todas as funcionalidades PRO →
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
