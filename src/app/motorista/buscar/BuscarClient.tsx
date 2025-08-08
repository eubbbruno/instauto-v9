'use client'
import { supabase } from '@/lib/supabase'
import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import BeautifulSidebar from '@/components/BeautifulSidebar'
import { useGoogleMaps } from '@/lib/google-maps'
import { useGeolocationSearch, SearchFilters } from '@/lib/geolocation-search'
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  FunnelIcon,
  StarIcon,
  PhoneIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import Link from 'next/link'

export default function BuscarClient() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  
  const mapRef = useRef<HTMLDivElement>(null)
  const { 
    initializeMap, 
    getCurrentLocation, 
    searchNearbyOficinas, 
    addOficinaMarkers,
    setUserLocationMarker 
  } = useGoogleMaps()
  
  const {
    searchNearby,
    getCurrentPosition,
    state: locationState
  } = useGeolocationSearch()

  const [filters, setFilters] = useState<Partial<SearchFilters>>({
    radius: 10,
    services: [],
    priceRange: 'all',
    rating: 0,
    openNow: false,
    plano: 'all',
    sortBy: 'distance'
  })

  useEffect(() => {
    checkUser()
    loadUserLocation()
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

  async function loadUserLocation() {
    try {
      const position = await getCurrentPosition()
      if (position && mapRef.current) {
        const map = await initializeMap(mapRef.current, {
          center: position,
          zoom: 13
        })
        
        if (map) {
          setUserLocationMarker(position)
          performSearch(position)
        }
      }
    } catch (error) {
      console.error('❌ Erro ao carregar localização:', error)
    }
  }

  async function performSearch(location?: any) {
    setSearchLoading(true)
    try {
      const searchResults = await searchNearby(filters)
      setResults(searchResults)
      
      if (searchResults.length > 0) {
        addOficinaMarkers(searchResults)
      }
    } catch (error) {
      console.error('❌ Erro na busca:', error)
    } finally {
      setSearchLoading(false)
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="hidden md:block w-64 h-screen bg-gradient-to-b from-blue-800 to-blue-600"></div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando busca...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BeautifulSidebar 
        userType="motorista"
        userName={profile?.name || user?.email?.split('@')[0] || 'Motorista'}
        userEmail={user?.email}
        onLogout={logout}
      />
      
      <div className="flex-1 md:ml-64 transition-all duration-300">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                🔍 Buscar Oficinas
              </h1>
              <p className="text-gray-600">Encontre oficinas próximas à sua localização</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-4">
              
              {/* Busca e Filtros */}
              <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  {/* Campo de busca */}
                  <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar por serviço, especialidade..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* Botão de filtros */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FunnelIcon className="h-5 w-5" />
                    Filtros
                  </button>
                  
                  {/* Botão de busca */}
                  <button
                    onClick={() => performSearch()}
                    disabled={searchLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {searchLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <MagnifyingGlassIcon className="h-5 w-5" />
                    )}
                    Buscar
                  </button>
                </div>

                {/* Painel de Filtros */}
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t pt-4 mt-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Raio de busca */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Raio de busca
                        </label>
                        <select
                          value={filters.radius}
                          onChange={(e) => setFilters({...filters, radius: Number(e.target.value)})}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                        >
                          <option value={5}>5 km</option>
                          <option value={10}>10 km</option>
                          <option value={20}>20 km</option>
                          <option value={50}>50 km</option>
                        </select>
                      </div>

                      {/* Faixa de preço */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Faixa de preço
                        </label>
                        <select
                          value={filters.priceRange}
                          onChange={(e) => setFilters({...filters, priceRange: e.target.value as any})}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                        >
                          <option value="all">Todos</option>
                          <option value="budget">Econômico</option>
                          <option value="moderate">Moderado</option>
                          <option value="expensive">Premium</option>
                        </select>
                      </div>

                      {/* Avaliação mínima */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Avaliação mínima
                        </label>
                        <select
                          value={filters.rating}
                          onChange={(e) => setFilters({...filters, rating: Number(e.target.value)})}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                        >
                          <option value={0}>Todas</option>
                          <option value={3}>3+ estrelas</option>
                          <option value={4}>4+ estrelas</option>
                          <option value={4.5}>4.5+ estrelas</option>
                        </select>
                      </div>

                      {/* Plano */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo de oficina
                        </label>
                        <select
                          value={filters.plano}
                          onChange={(e) => setFilters({...filters, plano: e.target.value as any})}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                        >
                          <option value="all">Todas</option>
                          <option value="free">Básicas</option>
                          <option value="pro">Profissionais</option>
                          <option value="premium">Premium</option>
                        </select>
                      </div>
                    </div>

                    {/* Switches */}
                    <div className="flex flex-wrap gap-4 mt-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.openNow}
                          onChange={(e) => setFilters({...filters, openNow: e.target.checked})}
                          className="rounded text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">Abertas agora</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.hasParking}
                          onChange={(e) => setFilters({...filters, hasParking: e.target.checked})}
                          className="rounded text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">Com estacionamento</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.acceptsCards}
                          onChange={(e) => setFilters({...filters, acceptsCards: e.target.checked})}
                          className="rounded text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">Aceita cartão</span>
                      </label>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lista de Resultados */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {results.length} oficinas encontradas
                  </h2>
                  
                  {searchLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                          <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {results.map((oficina) => (
                        <motion.div
                          key={oficina.id}
                          className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-bold text-gray-900">{oficina.name}</h3>
                                {oficina.verified && (
                                  <CheckCircleIcon className="h-5 w-5 text-blue-500" title="Verificada" />
                                )}
                                {oficina.plano === 'pro' && (
                                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">PRO</span>
                                )}
                                {oficina.plano === 'premium' && (
                                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">PREMIUM</span>
                                )}
                              </div>
                              
                              <p className="text-gray-600 text-sm mb-2 flex items-center gap-1">
                                <MapPinIcon className="h-4 w-4" />
                                {oficina.address}
                              </p>
                              
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <StarIconSolid
                                        key={i}
                                        className={`h-4 w-4 ${
                                          i < Math.floor(oficina.rating) 
                                            ? 'text-yellow-400' 
                                            : 'text-gray-200'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span>{oficina.rating} ({oficina.reviews})</span>
                                </div>
                                
                                <span>•</span>
                                <span>{oficina.distance}km</span>
                                <span>•</span>
                                <span>{oficina.estimatedTime}</span>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                                oficina.availability === 'available' 
                                  ? 'bg-green-100 text-green-800'
                                  : oficina.availability === 'busy'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                <div className={`w-2 h-2 rounded-full ${
                                  oficina.availability === 'available' 
                                    ? 'bg-green-500'
                                    : oficina.availability === 'busy'
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                                }`}></div>
                                {oficina.availability === 'available' && 'Disponível'}
                                {oficina.availability === 'busy' && 'Ocupado'}
                                {oficina.availability === 'full' && 'Lotado'}
                              </div>
                              
                              <p className="text-xs text-gray-500 mt-1">
                                Responde em {oficina.responseTime}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {oficina.services.slice(0, 3).map((service: string) => (
                              <span key={service} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                                {service}
                              </span>
                            ))}
                            {oficina.services.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{oficina.services.length - 3} mais
                              </span>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <Link
                              href={`/oficina/${oficina.id}`}
                              className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            >
                              Ver Detalhes
                            </Link>
                            <Link
                              href={`/agendamento/${oficina.id}`}
                              className="flex-1 bg-green-600 text-white text-center py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm"
                            >
                              Agendar
                            </Link>
                            {oficina.contact.phone && (
                              <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                                <PhoneIcon className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mapa */}
                <div className="sticky top-4">
                  <div className="bg-white rounded-xl shadow-sm border p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Localização no Mapa
                    </h3>
                    <div 
                      ref={mapRef}
                      className="w-full h-96 rounded-lg bg-gray-100"
                    ></div>
                    
                    {locationState.error && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm">{locationState.error}</p>
                      </div>
                    )}
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
