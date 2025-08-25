'use client'
import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useMotoristasidebar } from '@/hooks/useMotoristaAuth'
import BeautifulSidebar from '@/components/BeautifulSidebar'
import { 
  HeartIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PhoneIcon,
  StarIcon,
  ClockIcon,
  TagIcon,
  CalendarDaysIcon,
  TruckIcon,
  FunnelIcon,
  TrashIcon,
  ShareIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import Link from 'next/link'

interface Oficina {
  id: string
  nome: string
  endereco: string
  distancia: number
  rating: number
  totalAvaliacoes: number
  telefone: string
  whatsapp: string
  especialidades: string[]
  horarioFuncionamento: {
    semana: string
    sabado: string
    domingo: string
  }
  precoMedio: number
  tempoMedioAtendimento: string
  ultimoServico?: string
  dataFavoritado: string
  promocaoAtiva?: {
    descricao: string
    desconto: number
  }
  fotos: string[]
}

const mockFavoritos: Oficina[] = [
  {
    id: '1',
    nome: 'AutoCenter Premium',
    endereco: 'Rua das Flores, 123 - Centro, São Paulo - SP',
    distancia: 2.3,
    rating: 4.8,
    totalAvaliacoes: 342,
    telefone: '(11) 3333-4444',
    whatsapp: '11999994444',
    especialidades: ['Revisão', 'Troca de óleo', 'Freios', 'Suspensão'],
    horarioFuncionamento: {
      semana: '08:00 - 18:00',
      sabado: '08:00 - 14:00',
      domingo: 'Fechado'
    },
    precoMedio: 250,
    tempoMedioAtendimento: '2h 30min',
    ultimoServico: '15/01/2025',
    dataFavoritado: '2024-12-10',
    promocaoAtiva: {
      descricao: 'Troca de óleo + filtro',
      desconto: 20
    },
    fotos: ['foto1.jpg', 'foto2.jpg']
  },
  {
    id: '2',
    nome: 'Mecânica Silva & Filhos',
    endereco: 'Av. Principal, 456 - Vila Nova, São Paulo - SP',
    distancia: 5.7,
    rating: 4.2,
    totalAvaliacoes: 128,
    telefone: '(11) 2222-3333',
    whatsapp: '11999993333',
    especialidades: ['Mecânica geral', 'Elétrica', 'Ar condicionado'],
    horarioFuncionamento: {
      semana: '07:30 - 17:30',
      sabado: '08:00 - 12:00',
      domingo: 'Fechado'
    },
    precoMedio: 180,
    tempoMedioAtendimento: '1h 45min',
    ultimoServico: '28/12/2024',
    dataFavoritado: '2024-11-25',
    fotos: ['foto3.jpg']
  },
  {
    id: '3',
    nome: 'RapidCar Express',
    endereco: 'Rua do Comércio, 789 - Centro, São Paulo - SP',
    distancia: 1.8,
    rating: 4.5,
    totalAvaliacoes: 256,
    telefone: '(11) 1111-2222',
    whatsapp: '11999992222',
    especialidades: ['Troca rápida', 'Revisão express', 'Diagnóstico'],
    horarioFuncionamento: {
      semana: '08:00 - 20:00',
      sabado: '08:00 - 16:00',
      domingo: '09:00 - 15:00'
    },
    precoMedio: 200,
    tempoMedioAtendimento: '1h 15min',
    dataFavoritado: '2024-12-15',
    promocaoAtiva: {
      descricao: 'Revisão completa',
      desconto: 15
    },
    fotos: ['foto4.jpg', 'foto5.jpg', 'foto6.jpg']
  },
  {
    id: '4',
    nome: 'MegaAuto Service',
    endereco: 'Av. dos Mecânicos, 567 - Industrial, São Paulo - SP',
    distancia: 8.2,
    rating: 4.7,
    totalAvaliacoes: 198,
    telefone: '(11) 5555-6666',
    whatsapp: '11999996666',
    especialidades: ['Revisão completa', 'Injeção eletrônica', 'Cambio', 'Motor'],
    horarioFuncionamento: {
      semana: '07:00 - 18:00',
      sabado: '08:00 - 14:00',
      domingo: 'Fechado'
    },
    precoMedio: 320,
    tempoMedioAtendimento: '3h 20min',
    ultimoServico: '18/11/2024',
    dataFavoritado: '2024-10-05',
    fotos: ['foto7.jpg']
  }
]

export default function FavoritosClient() {
  const sidebarProps = useMotoristasidebar()
  const [favoritos, setFavoritos] = useState<Oficina[]>(mockFavoritos)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroEspecialidade, setFiltroEspecialidade] = useState<string>('todas')
  const [filtroDistancia, setFiltroDistancia] = useState<number>(50)
  const [filtroRating, setFiltroRating] = useState<number>(0)
  const [showFilters, setShowFilters] = useState(false)

  // Filtrar favoritos
  const favoritosFiltrados = useMemo(() => {
    return favoritos.filter(oficina => {
      const matchesSearch = 
        oficina.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        oficina.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
        oficina.especialidades.some(esp => esp.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesEspecialidade = filtroEspecialidade === 'todas' || 
        oficina.especialidades.includes(filtroEspecialidade)
      
      const matchesDistancia = oficina.distancia <= filtroDistancia
      const matchesRating = oficina.rating >= filtroRating
      
      return matchesSearch && matchesEspecialidade && matchesDistancia && matchesRating
    })
  }, [favoritos, searchTerm, filtroEspecialidade, filtroDistancia, filtroRating])

  // Remover dos favoritos
  const removeFavorito = (id: string) => {
    setFavoritos(prev => prev.filter(oficina => oficina.id !== id))
  }

  // Especialidades únicas
  const especialidades = [...new Set(favoritos.flatMap(oficina => oficina.especialidades))]

  // Estatísticas
  const stats = {
    total: favoritos.length,
    servicosRealizados: favoritos.filter(o => o.ultimoServico).length,
    promocoesAtivas: favoritos.filter(o => o.promocaoAtiva).length,
    distanciaMedia: (favoritos.reduce((sum, o) => sum + o.distancia, 0) / favoritos.length).toFixed(1)
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
      <BeautifulSidebar {...sidebarProps} />
      
      <div className="flex-1 md:ml-64 transition-all duration-300">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">⭐ Oficinas Favoritas</h1>
              <p className="text-gray-600">Suas oficinas de confiança em um só lugar</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 flex items-center gap-2 transition-all">
                <ShareIcon className="w-5 h-5" />
                Compartilhar Lista
              </button>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-6">

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Favoritas</h3>
                    <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                      <HeartIconSolid className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                  <p className="text-xs text-gray-500 mt-1">Oficinas salvas</p>
                </motion.div>

                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Já Utilizadas</h3>
                    <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                      <TruckIcon className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{stats.servicosRealizados}</p>
                  <p className="text-xs text-gray-500 mt-1">Com histórico</p>
                </motion.div>

                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Promoções</h3>
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                      <TagIcon className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{stats.promocoesAtivas}</p>
                  <p className="text-xs text-gray-500 mt-1">Ativas agora</p>
                </motion.div>

                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Distância Média</h3>
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <MapPinIcon className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{stats.distanciaMedia}</p>
                  <p className="text-xs text-gray-500 mt-1">km de você</p>
                </motion.div>
              </div>

              {/* Filtros */}
              <motion.div 
                className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {/* Busca */}
                <div className="mb-4">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Buscar por nome, endereço ou especialidade..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Filtros avançados */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-wrap">
                    <select
                      value={filtroEspecialidade}
                      onChange={(e) => setFiltroEspecialidade(e.target.value)}
                      className="px-4 py-2 rounded-lg text-sm border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="todas">Todas Especialidades</option>
                      {especialidades.map(esp => (
                        <option key={esp} value={esp}>{esp}</option>
                      ))}
                    </select>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Distância:</span>
                      <input
                        type="range"
                        min="1"
                        max="50"
                        value={filtroDistancia}
                        onChange={(e) => setFiltroDistancia(Number(e.target.value))}
                        className="w-20"
                      />
                      <span className="text-sm font-medium text-gray-700">{filtroDistancia}km</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Rating mín:</span>
                      <select
                        value={filtroRating}
                        onChange={(e) => setFiltroRating(Number(e.target.value))}
                        className="px-3 py-2 rounded-lg text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value={0}>Qualquer</option>
                        <option value={3}>3+ estrelas</option>
                        <option value={4}>4+ estrelas</option>
                        <option value={4.5}>4.5+ estrelas</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FunnelIcon className="h-5 w-5" />
                    Mais Filtros
                  </button>
                </div>
              </motion.div>

              {/* Lista de Favoritos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {favoritosFiltrados.map((oficina, index) => (
                  <motion.div
                    key={oficina.id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100 relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Badge de Promoção */}
                    {oficina.promocaoAtiva && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        -{oficina.promocaoAtiva.desconto}% OFF
                      </div>
                    )}

                    {/* Header do Card */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{oficina.nome}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center">
                              {renderStars(Math.round(oficina.rating))}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{oficina.rating}</span>
                            <span className="text-sm text-gray-500">({oficina.totalAvaliacoes} avaliações)</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            <span>{oficina.distancia}km de você</span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFavorito(oficina.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remover dos favoritos"
                        >
                          <HeartIconSolid className="h-6 w-6" />
                        </button>
                      </div>

                      <p className="text-sm text-gray-600">{oficina.endereco}</p>
                    </div>

                    {/* Conteúdo do Card */}
                    <div className="p-6 space-y-4">
                      {/* Especialidades */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Especialidades:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {oficina.especialidades.map((especialidade, idx) => (
                            <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-100 text-xs text-blue-700">
                              {especialidade}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Promoção Ativa */}
                      {oficina.promocaoAtiva && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <TagIcon className="h-4 w-4 text-orange-600" />
                            <span className="text-sm font-medium text-orange-800">
                              {oficina.promocaoAtiva.descricao} - {oficina.promocaoAtiva.desconto}% OFF
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Informações */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <ClockIcon className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Tempo médio: <span className="font-medium">{oficina.tempoMedioAtendimento}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Preço médio: <span className="font-medium text-green-600">R$ {oficina.precoMedio}</span></span>
                        </div>
                      </div>

                      {/* Último Serviço */}
                      {oficina.ultimoServico && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <CalendarDaysIcon className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-800">
                              Último serviço: {new Date(oficina.ultimoServico).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Horário de Funcionamento */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Funcionamento:</p>
                        <div className="text-xs text-gray-600 space-y-1">
                          <p><span className="font-medium">Seg-Sex:</span> {oficina.horarioFuncionamento.semana}</p>
                          <p><span className="font-medium">Sábado:</span> {oficina.horarioFuncionamento.sabado}</p>
                          <p><span className="font-medium">Domingo:</span> {oficina.horarioFuncionamento.domingo}</p>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex gap-2 pt-4 border-t border-gray-100">
                        <Link href={`/oficina/${oficina.id}`} className="flex-1">
                          <button className="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                            Ver Perfil
                          </button>
                        </Link>
                        
                        <Link href={`/agendar/${oficina.id}`} className="flex-1">
                          <button className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all">
                            Agendar
                          </button>
                        </Link>

                        <a 
                          href={`https://wa.me/55${oficina.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                        >
                          <PhoneIcon className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Empty State */}
              {favoritosFiltrados.length === 0 && (
                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-12 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <HeartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    {searchTerm || filtroEspecialidade !== 'todas' ? 'Nenhuma oficina encontrada' : 'Nenhuma oficina favorita'}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm || filtroEspecialidade !== 'todas' 
                      ? 'Tente ajustar os filtros de busca' 
                      : 'Comece explorando oficinas e adicionando suas favoritas'
                    }
                  </p>
                  <Link href="/buscar-oficinas">
                    <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition-all inline-flex items-center gap-2">
                      <MagnifyingGlassIcon className="h-5 w-5" />
                      Buscar Oficinas
                    </button>
                  </Link>
                </motion.div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
