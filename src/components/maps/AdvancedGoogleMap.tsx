'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPinIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  StarIcon,
  ClockIcon,
  PhoneIcon,
  ArrowTrendingUpIcon,
  AdjustmentsHorizontalIcon,
  ListBulletIcon,
  MapIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import { useGoogleMaps, Workshop, MapFilters, MapLocation, RouteData } from '@/lib/google-maps'

interface AdvancedGoogleMapProps {
  className?: string
  initialCenter?: MapLocation
  onWorkshopSelect?: (workshop: Workshop) => void
  onRouteCalculated?: (route: RouteData) => void
  showFilters?: boolean
  showSearch?: boolean
  height?: string
}

export default function AdvancedGoogleMap({
  className = '',
  initialCenter,
  onWorkshopSelect,
  onRouteCalculated,
  showFilters = true,
  showSearch = true,
  height = '500px'
}: AdvancedGoogleMapProps) {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [filteredWorkshops, setFilteredWorkshops] = useState<Workshop[]>([])
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [showWorkshopList, setShowWorkshopList] = useState(false)
  const [currentRoute, setCurrentRoute] = useState<RouteData | null>(null)
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')
  
  const [filters, setFilters] = useState<MapFilters>({
    services: [],
    priceRange: 'all',
    rating: 0,
    distance: 50,
    openNow: false
  })

  const {
    isLoaded,
    error,
    userLocation,
    mapRef,
    createMap,
    getCurrentLocation,
    searchWorkshops,
    calculateRoute,
    addWorkshopMarkers,
    addUserLocationMarker,
    clearRoute,
    calculateDistance,
    geocodeAddress
  } = useGoogleMaps()

  const mapContainerRef = useRef<HTMLDivElement>(null)

  // Inicializar mapa
  useEffect(() => {
    const initMap = async () => {
      if (!isLoaded || !mapContainerRef.current) return

      const center = initialCenter || userLocation || {
        lat: -23.5505,
        lng: -46.6333
      }

      const map = await createMap(center, 12)
      if (map) {
        console.log('🗺️ Mapa criado com sucesso')
        
        // Obter localização do usuário se não tiver
        if (!userLocation) {
          await getCurrentLocation()
        }
      }
    }

    initMap()
  }, [isLoaded, initialCenter, userLocation, createMap, getCurrentLocation])

  // Adicionar marcador de localização do usuário
  useEffect(() => {
    if (userLocation && isLoaded) {
      addUserLocationMarker(userLocation)
    }
  }, [userLocation, isLoaded, addUserLocationMarker])

  // Buscar oficinas quando localização mudar
  useEffect(() => {
    const searchNearbyWorkshops = async () => {
      if (!userLocation || !isLoaded) return

      setIsSearching(true)
      try {
        const foundWorkshops = await searchWorkshops(userLocation, filters.distance * 1000, filters)
        setWorkshops(foundWorkshops)
        setFilteredWorkshops(foundWorkshops)
        
        // Adicionar marcadores
        addWorkshopMarkers(foundWorkshops, handleWorkshopClick)

      } catch (error) {
        console.error('❌ Erro ao buscar oficinas:', error)
      } finally {
        setIsSearching(false)
      }
    }

    searchNearbyWorkshops()
  }, [userLocation, isLoaded, filters, searchWorkshops, addWorkshopMarkers])

  // Filtrar oficinas localmente
  useEffect(() => {
    let filtered = workshops

    // Filtro de busca por texto
    if (searchQuery) {
      filtered = filtered.filter(workshop =>
        workshop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workshop.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workshop.services.some(service => 
          service.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }

    setFilteredWorkshops(filtered)
    
    // Atualizar marcadores
    if (isLoaded) {
      addWorkshopMarkers(filtered, handleWorkshopClick)
    }
  }, [searchQuery, workshops, isLoaded, addWorkshopMarkers])

  const handleWorkshopClick = useCallback((workshop: Workshop) => {
    setSelectedWorkshop(workshop)
    if (onWorkshopSelect) {
      onWorkshopSelect(workshop)
    }
  }, [onWorkshopSelect])

  const handleCalculateRoute = useCallback(async (workshop: Workshop) => {
    if (!userLocation) {
      alert('Localização não disponível')
      return
    }

    setIsSearching(true)
    try {
      const route = await calculateRoute(userLocation, workshop.location)
      if (route) {
        setCurrentRoute(route)
        if (onRouteCalculated) {
          onRouteCalculated(route)
        }
        console.log(`🛣️ Rota calculada: ${route.distance} - ${route.duration}`)
      }
    } catch (error) {
      console.error('❌ Erro ao calcular rota:', error)
    } finally {
      setIsSearching(false)
    }
  }, [userLocation, calculateRoute, onRouteCalculated])

  const handleClearRoute = useCallback(() => {
    clearRoute()
    setCurrentRoute(null)
    setSelectedWorkshop(null)
  }, [clearRoute])

  const handleSearchByAddress = useCallback(async (address: string) => {
    if (!address.trim()) return

    setIsSearching(true)
    try {
      const location = await geocodeAddress(address)
      if (location) {
        const foundWorkshops = await searchWorkshops(location, filters.distance * 1000, filters)
        setWorkshops(foundWorkshops)
        setFilteredWorkshops(foundWorkshops)
        addWorkshopMarkers(foundWorkshops, handleWorkshopClick)
      }
    } catch (error) {
      console.error('❌ Erro na busca por endereço:', error)
    } finally {
      setIsSearching(false)
    }
  }, [filters, searchWorkshops, addWorkshopMarkers, geocodeAddress, handleWorkshopClick])

  const applyFilters = useCallback((newFilters: MapFilters) => {
    setFilters(newFilters)
    setShowFilterPanel(false)
  }, [])

  const availableServices = [
    'Manutenção Geral',
    'Troca de Óleo',
    'Pneus',
    'Freios',
    'Suspensão',
    'Ar Condicionado',
    'Elétrica',
    'Motor',
    'Transmissão',
    'Alinhamento'
  ]

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} style={{ height }}>
        <div className="text-center p-8">
          <MapPinIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Erro ao Carregar Mapa
          </h3>
          <p className="text-gray-500 text-sm">
            {error}
          </p>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando Google Maps...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative bg-white rounded-lg overflow-hidden shadow-lg ${className}`}>
      {/* Header com controles */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-col gap-3">
        {/* Barra de busca */}
        {showSearch && (
          <div className="bg-white rounded-lg shadow-lg p-3 flex items-center gap-2">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar oficinas ou endereço..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearchByAddress(searchQuery)
                }
              }}
              className="flex-1 outline-none text-sm"
            />
            {isSearching && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            )}
          </div>
        )}

        {/* Controles */}
        <div className="flex items-center gap-2">
          {/* Filtros */}
          {showFilters && (
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className="bg-white rounded-lg shadow-lg p-2 hover:bg-gray-50 transition-colors"
            >
              <FunnelIcon className="w-5 h-5 text-gray-600" />
            </button>
          )}

          {/* Toggle view */}
          <div className="bg-white rounded-lg shadow-lg p-1 flex">
            <button
              onClick={() => setViewMode('map')}
              className={`p-1 rounded transition-colors ${
                viewMode === 'map' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <MapIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded transition-colors ${
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ListBulletIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Lista de oficinas */}
          <button
            onClick={() => setShowWorkshopList(!showWorkshopList)}
            className="bg-white rounded-lg shadow-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {filteredWorkshops.length} oficinas
          </button>

          {/* Limpar rota */}
          {currentRoute && (
            <button
              onClick={handleClearRoute}
              className="bg-red-600 text-white rounded-lg shadow-lg p-2 hover:bg-red-700 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Info da rota atual */}
      {currentRoute && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 max-w-xs z-10">
          <div className="flex items-center gap-2 mb-2">
            <ArrowTrendingUpIcon className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-sm">Rota Calculada</span>
          </div>
          <div className="text-sm text-gray-600">
            <p>📏 Distância: {currentRoute.distance}</p>
            <p>⏱️ Tempo: {currentRoute.duration}</p>
          </div>
        </div>
      )}

      {/* Container do mapa */}
      <div className="relative">
        {viewMode === 'map' ? (
          <div 
            ref={mapContainerRef}
            style={{ height }}
            className="w-full"
          />
        ) : (
          <WorkshopListView 
            workshops={filteredWorkshops}
            onWorkshopSelect={handleWorkshopClick}
            onCalculateRoute={handleCalculateRoute}
            userLocation={userLocation}
            height={height}
          />
        )}
      </div>

      {/* Panel de filtros */}
      <AnimatePresence>
        {showFilterPanel && (
          <FilterPanel
            filters={filters}
            availableServices={availableServices}
            onApply={applyFilters}
            onClose={() => setShowFilterPanel(false)}
          />
        )}
      </AnimatePresence>

      {/* Lista lateral de oficinas */}
      <AnimatePresence>
        {showWorkshopList && viewMode === 'map' && (
          <WorkshopSidebar
            workshops={filteredWorkshops}
            selectedWorkshop={selectedWorkshop}
            onWorkshopSelect={handleWorkshopClick}
            onCalculateRoute={handleCalculateRoute}
            onClose={() => setShowWorkshopList(false)}
            userLocation={userLocation}
          />
        )}
      </AnimatePresence>

      {/* Configurar callbacks globais para info windows */}
      {typeof window !== 'undefined' && (
        <>
          {(window as any).showWorkshopDetails = (workshopId: string) => {
            const workshop = workshops.find(w => w.id === workshopId)
            if (workshop) {
              handleWorkshopClick(workshop)
            }
          }}
          {(window as any).calculateRoute = (workshopId: string) => {
            const workshop = workshops.find(w => w.id === workshopId)
            if (workshop) {
              handleCalculateRoute(workshop)
            }
          }}
        </>
      )}
    </div>
  )
}

// Componente de filtros
function FilterPanel({ 
  filters, 
  availableServices, 
  onApply, 
  onClose 
}: {
  filters: MapFilters
  availableServices: string[]
  onApply: (filters: MapFilters) => void
  onClose: () => void
}) {
  const [localFilters, setLocalFilters] = useState(filters)

  return (
    <motion.div
      initial={{ opacity: 0, x: -300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      className="absolute left-4 top-20 bottom-4 bg-white rounded-lg shadow-xl z-20 w-80 overflow-hidden"
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Filtros</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100% - 120px)' }}>
        {/* Serviços */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Serviços
          </label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {availableServices.map(service => (
              <label key={service} className="flex items-center">
                <input
                  type="checkbox"
                  checked={localFilters.services.includes(service)}
                  onChange={(e) => {
                    const services = e.target.checked
                      ? [...localFilters.services, service]
                      : localFilters.services.filter(s => s !== service)
                    setLocalFilters({ ...localFilters, services })
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{service}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Faixa de preço */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Faixa de Preço
          </label>
          <select
            value={localFilters.priceRange}
            onChange={(e) => setLocalFilters({
              ...localFilters,
              priceRange: e.target.value as any
            })}
            className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">Todas</option>
            <option value="low">Econômico ($)</option>
            <option value="medium">Médio ($$)</option>
            <option value="high">Premium ($$$)</option>
          </select>
        </div>

        {/* Avaliação mínima */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Avaliação Mínima: {localFilters.rating} ⭐
          </label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={localFilters.rating}
            onChange={(e) => setLocalFilters({
              ...localFilters,
              rating: parseFloat(e.target.value)
            })}
            className="w-full"
          />
        </div>

        {/* Distância máxima */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Distância Máxima: {localFilters.distance}km
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={localFilters.distance}
            onChange={(e) => setLocalFilters({
              ...localFilters,
              distance: parseInt(e.target.value)
            })}
            className="w-full"
          />
        </div>

        {/* Aberto agora */}
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={localFilters.openNow}
              onChange={(e) => setLocalFilters({
                ...localFilters,
                openNow: e.target.checked
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Apenas abertas agora</span>
          </label>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 flex gap-2">
        <button
          onClick={() => onApply(localFilters)}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Aplicar Filtros
        </button>
        <button
          onClick={() => {
            const resetFilters: MapFilters = {
              services: [],
              priceRange: 'all',
              rating: 0,
              distance: 50,
              openNow: false
            }
            setLocalFilters(resetFilters)
            onApply(resetFilters)
          }}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Limpar
        </button>
      </div>
    </motion.div>
  )
}

// Componente da lista lateral
function WorkshopSidebar({ 
  workshops, 
  selectedWorkshop, 
  onWorkshopSelect, 
  onCalculateRoute, 
  onClose,
  userLocation
}: {
  workshops: Workshop[]
  selectedWorkshop: Workshop | null
  onWorkshopSelect: (workshop: Workshop) => void
  onCalculateRoute: (workshop: Workshop) => void
  onClose: () => void
  userLocation: MapLocation | null
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 400 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 400 }}
      className="absolute right-4 top-20 bottom-4 bg-white rounded-lg shadow-xl z-20 w-96 overflow-hidden"
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">
          Oficinas Próximas ({workshops.length})
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="overflow-y-auto" style={{ maxHeight: 'calc(100% - 60px)' }}>
        {workshops.map(workshop => (
          <WorkshopCard
            key={workshop.id}
            workshop={workshop}
            isSelected={selectedWorkshop?.id === workshop.id}
            onSelect={() => onWorkshopSelect(workshop)}
            onCalculateRoute={() => onCalculateRoute(workshop)}
            userLocation={userLocation}
          />
        ))}
      </div>
    </motion.div>
  )
}

// Componente da visualização em lista
function WorkshopListView({
  workshops,
  onWorkshopSelect,
  onCalculateRoute,
  userLocation,
  height
}: {
  workshops: Workshop[]
  onWorkshopSelect: (workshop: Workshop) => void
  onCalculateRoute: (workshop: Workshop) => void
  userLocation: MapLocation | null
  height: string
}) {
  return (
    <div className="overflow-y-auto bg-gray-50" style={{ height }}>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workshops.map(workshop => (
          <WorkshopCard
            key={workshop.id}
            workshop={workshop}
            onSelect={() => onWorkshopSelect(workshop)}
            onCalculateRoute={() => onCalculateRoute(workshop)}
            userLocation={userLocation}
            showFullDetails
          />
        ))}
      </div>
    </div>
  )
}

// Componente do card da oficina
function WorkshopCard({
  workshop,
  isSelected = false,
  onSelect,
  onCalculateRoute,
  userLocation,
  showFullDetails = false
}: {
  workshop: Workshop
  isSelected?: boolean
  onSelect: () => void
  onCalculateRoute: () => void
  userLocation: MapLocation | null
  showFullDetails?: boolean
}) {
  return (
    <div
      className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors ${
        isSelected ? 'bg-blue-50 border-blue-200' : ''
      } ${showFullDetails ? 'bg-white rounded-lg shadow border-0 border-gray-200' : ''}`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-800 line-clamp-1">
          {workshop.name}
        </h4>
        {workshop.verified && (
          <span className="text-green-600 text-xs">✓</span>
        )}
      </div>

      <div className="flex items-center gap-1 mb-2">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <StarSolidIcon
              key={i}
              className={`w-3 h-3 ${
                i < Math.floor(workshop.rating) ? 'text-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-medium">{workshop.rating.toFixed(1)}</span>
        <span className="text-xs text-gray-500">({workshop.reviewCount})</span>
      </div>

      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
        📍 {workshop.address}
      </p>

      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <span>📏 {workshop.distance}km</span>
        <span className={workshop.isOpen ? 'text-green-600' : 'text-red-600'}>
          {workshop.isOpen ? 'Aberto' : 'Fechado'}
        </span>
      </div>

      {showFullDetails && workshop.services.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-700 mb-1">Serviços:</p>
          <div className="flex flex-wrap gap-1">
            {workshop.services.slice(0, 3).map(service => (
              <span
                key={service}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
              >
                {service}
              </span>
            ))}
            {workshop.services.length > 3 && (
              <span className="text-xs text-gray-500">
                +{workshop.services.length - 3} mais
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
          className="flex-1 text-xs bg-blue-600 text-white py-2 px-3 rounded hover:bg-blue-700 transition-colors"
        >
          Ver Detalhes
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onCalculateRoute()
          }}
          className="text-xs bg-green-600 text-white py-2 px-3 rounded hover:bg-green-700 transition-colors"
        >
          Rota
        </button>
      </div>
    </div>
  )
}
