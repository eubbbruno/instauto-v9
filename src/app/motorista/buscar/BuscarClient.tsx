'use client'
import { supabase } from '@/lib/supabase'
import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import BeautifulSidebar from '@/components/BeautifulSidebar'
import { useGoogleMaps } from '@/lib/google-maps'
import { useGeolocationSearch, SearchFilters } from '@/lib/geolocation-search'
import AdvancedMapInterface from '@/components/maps/AdvancedMapInterface'
import { OfficinaMarker } from '@/lib/google-maps-advanced'
import { Workshop, RouteData } from '@/lib/google-maps'
import AdvancedFilters, { FilterConfig, useAdvancedFilters } from '@/components/filters/AdvancedFilters'
import QuickFilters, { QuickFilter, useQuickFilters } from '@/components/filters/QuickFilters'
import SearchFilter, { useSearchHistory } from '@/components/filters/SearchFilter'
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
  const searchParams = useSearchParams()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null)
  const [selectedOficina, setSelectedOficina] = useState<OfficinaMarker | null>(null)
  const [currentRoute, setCurrentRoute] = useState<RouteData | null>(null)
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')
  
  const mapRef = useRef<HTMLDivElement>(null)

  // Advanced Filters Configuration
  const filterConfigs: FilterConfig[] = [
    {
      id: 'radius',
      label: 'Raio de busca',
      type: 'range',
      min: 5,
      max: 50,
      step: 5,
      icon: MapPinIcon,
      category: 'Localização'
    },
    {
      id: 'rating',
      label: 'Avaliação mínima',
      type: 'rating',
      icon: StarIcon,
      category: 'Qualidade'
    },
    {
      id: 'priceRange',
      label: 'Faixa de preço',
      type: 'select',
      options: [
        { value: 'budget', label: 'Econômico' },
        { value: 'moderate', label: 'Moderado' },
        { value: 'expensive', label: 'Premium' }
      ],
      category: 'Preço'
    },
    {
      id: 'services',
      label: 'Serviços',
      type: 'multiselect',
      options: [
        { value: 'oil_change', label: 'Troca de óleo' },
        { value: 'brakes', label: 'Freios' },
        { value: 'tires', label: 'Pneus' },
        { value: 'engine', label: 'Motor' },
        { value: 'electrical', label: 'Elétrica' },
        { value: 'transmission', label: 'Transmissão' }
      ],
      category: 'Serviços'
    },
    {
      id: 'openNow',
      label: 'Abertas agora',
      type: 'checkbox',
      category: 'Disponibilidade'
    },
    {
      id: 'hasParking',
      label: 'Com estacionamento',
      type: 'checkbox',
      category: 'Comodidades'
    }
  ]

  // Quick Filters Configuration
  const quickFilterConfigs: QuickFilter[] = [
    { id: 'open24h', label: '24 horas', value: { available24h: true }, color: 'blue' },
    { id: 'verified', label: 'Verificadas', value: { verified: true }, color: 'green' },
    { id: 'nearby', label: 'Próximas', value: { radius: 5 }, color: 'purple' },
    { id: 'topRated', label: 'Bem avaliadas', value: { rating: 4.5 }, color: 'yellow' }
  ]

  // Filter hooks
  const advancedFilters = useAdvancedFilters({
    radius: 10,
    rating: 0,
    priceRange: '',
    services: [],
    openNow: false,
    hasParking: false
  })

  const quickFilters = useQuickFilters(quickFilterConfigs)
  const searchHistory = useSearchHistory('oficina_search_history')
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

  // Processar parâmetros da URL
  useEffect(() => {
    const urlQuery = searchParams.get('q')
    const cidade = searchParams.get('cidade')
    const estado = searchParams.get('estado')
    const cep = searchParams.get('cep')
    const bairro = searchParams.get('bairro')
    
    if (urlQuery) {
      setSearchTerm(urlQuery)
      console.log('🔍 Busca iniciada pela URL:', { urlQuery, cidade, estado, cep, bairro })
      
      // Executar busca automaticamente após carregar
      setTimeout(() => {
        handleSearch()
      }, 1000)
    }
  }, [searchParams])

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
              
              {/* Nova Interface de Busca */}
              <div className="space-y-4 mb-6">
                {/* Campo de busca principal */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <SearchFilter
                    value={searchTerm}
                    onChange={(value) => {
                      setSearchTerm(value)
                      searchHistory.addToHistory(value)
                    }}
                    onSearch={(value) => {
                      searchHistory.addToHistory(value)
                      performSearch()
                    }}
                    placeholder="Buscar oficinas, serviços, especialidades..."
                    recentSearches={searchHistory.history}
                    suggestions={[
                      { id: 'oil', text: 'Troca de óleo', type: 'suggestion', category: 'Serviços' },
                      { id: 'brakes', text: 'Freios', type: 'suggestion', category: 'Serviços' },
                      { id: 'tires', text: 'Pneus', type: 'suggestion', category: 'Serviços' }
                    ]}
                  />
                </div>

                {/* Filtros Rápidos */}
                <div className="bg-white rounded-xl shadow-sm border p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-700">Filtros Rápidos</h3>
                    <button
                      onClick={() => performSearch()}
                      disabled={searchLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
                    >
                      {searchLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <MagnifyingGlassIcon className="h-4 w-4" />
                      )}
                      Buscar
                    </button>
                  </div>
                  
                  <QuickFilters
                    filters={quickFilterConfigs}
                    activeFilters={quickFilters.activeFilters}
                    onToggle={quickFilters.toggle}
                    onClear={quickFilters.clear}
                  />
                </div>

                {/* Filtros Avançados */}
                <AdvancedFilters
                  filters={filterConfigs}
                  values={advancedFilters.values}
                  onChange={advancedFilters.updateValues}
                  onReset={advancedFilters.resetValues}
                  isOpen={advancedFilters.isOpen}
                  onToggle={advancedFilters.toggleOpen}
                  showActiveCount={true}
                  layout="grid"
                />
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
                    
                    <AdvancedMapInterface
                      onOficinaSelect={(oficina) => {
                        setSelectedOficina(oficina)
                        // Converter OfficinaMarker para Workshop se necessário
                        const workshop: Workshop = {
                          id: oficina.id,
                          name: oficina.name,
                          lat: oficina.lat,
                          lng: oficina.lng,
                          rating: oficina.rating,
                          reviewCount: oficina.reviewCount,
                          address: oficina.address || '',
                          distance: oficina.distance || 0,
                          isOpen: oficina.isOpen,
                          phone: oficina.phone,
                          website: oficina.website,
                          services: oficina.services,
                          priceLevel: oficina.priceLevel || 1
                        }
                        setSelectedWorkshop(workshop)
                        console.log('🏪 Oficina selecionada:', workshop)
                      }}
                      className="w-full rounded-lg overflow-hidden"
                    />

                    {/* Info da oficina selecionada */}
                    {selectedWorkshop && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4"
                      >
                        <h4 className="font-semibold text-blue-900 mb-2">
                          📍 {selectedWorkshop.name}
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-blue-700">
                              ⭐ {selectedWorkshop.rating.toFixed(1)} ({selectedWorkshop.reviewCount} avaliações)
                            </p>
                            <p className="text-blue-700">
                              📏 {selectedWorkshop.distance}km de distância
                            </p>
                          </div>
                          <div>
                            <p className="text-blue-700">
                              {selectedWorkshop.isOpen ? '🟢 Aberto' : '🔴 Fechado'}
                            </p>
                            {selectedWorkshop.phone && (
                              <p className="text-blue-700">
                                📞 {selectedWorkshop.phone}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {currentRoute && (
                          <div className="mt-3 pt-3 border-t border-blue-300">
                            <p className="text-blue-800 font-medium">
                              🛣️ Rota: {currentRoute.distance} • {currentRoute.duration}
                            </p>
                          </div>
                        )}
                        
                        <div className="flex gap-2 mt-4">
                          <Link href={`/oficina/${selectedWorkshop.id}`}>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                              Ver Detalhes
                            </button>
                          </Link>
                          <Link href={`/agendar/${selectedWorkshop.id}`}>
                            <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
                              Agendar Serviço
                            </button>
                          </Link>
                        </div>
                      </motion.div>
                    )}
                    
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
