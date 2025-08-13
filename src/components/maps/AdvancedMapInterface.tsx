'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
  StarIcon,
  PhoneIcon,
  GlobeAltIcon,
  ClockIcon,
  ArrowPathIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  ArrowTrendingUpIcon as NavigationIcon,
  ListBulletIcon,
  MapIcon
} from '@heroicons/react/24/outline'
import { useGoogleMaps, OfficinaMarker, SearchFilters } from '@/lib/google-maps-advanced'

interface AdvancedMapInterfaceProps {
  onOficinaSelect?: (oficina: OfficinaMarker) => void
  className?: string
}

export default function AdvancedMapInterface({
  onOficinaSelect,
  className = ''
}: AdvancedMapInterfaceProps) {
  const { mapRef, isLoaded, error, userLocation, searchOfficinas, showDirections, addMarkers, clearDirections } = useGoogleMaps()
  
  const [oficinas, setOficinas] = useState<OfficinaMarker[]>([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showList, setShowList] = useState(false)
  const [selectedOficina, setSelectedOficina] = useState<OfficinaMarker | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  
  const [filters, setFilters] = useState<SearchFilters>({
    maxDistance: 10,
    minRating: 0,
    serviceTypes: [],
    priceRange: [1, 4],
    isOpenNow: false,
    planTypes: ['free', 'pro', 'premium'],
    sortBy: 'distance'
  })

  const serviceTypes = [
    'Mecânica Geral',
    'Elétrica',
    'Suspensão',
    'Freios',
    'Pneus',
    'Ar Condicionado',
    'Diagnóstico',
    'Pintura',
    'Funilaria',
    'Lavagem'
  ]

  useEffect(() => {
    if (isLoaded && userLocation) {
      handleSearch()
    }
  }, [isLoaded, userLocation])

  const handleSearch = async () => {
    if (!userLocation) return

    setLoading(true)
    try {
      const results = await searchOfficinas(filters)
      setOficinas(results)
      addMarkers(results, handleMarkerClick)
    } catch (err: any) {
      console.error('Erro na busca:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkerClick = (oficina: OfficinaMarker) => {
    setSelectedOficina(oficina)
    onOficinaSelect?.(oficina)
  }

  const handleDirections = async (oficina: OfficinaMarker) => {
    try {
      setLoading(true)
      const route = await showDirections({ lat: oficina.lat, lng: oficina.lng })
      console.log('📍 Rota calculada:', route)
    } catch (err: any) {
      console.error('Erro ao calcular rota:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredOficinas = oficinas.filter(oficina =>
    oficina.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    oficina.address?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const resetFilters = () => {
    setFilters({
      maxDistance: 10,
      minRating: 0,
      serviceTypes: [],
      priceRange: [1, 4],
      isOpenNow: false,
      planTypes: ['free', 'pro', 'premium'],
      sortBy: 'distance'
    })
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-xl p-6 text-center ${className}`}>
        <div className="text-red-600 mb-4">
          <MapPinIcon className="w-12 h-12 mx-auto mb-2" />
          <h3 className="font-semibold text-lg">Erro no Google Maps</h3>
          <p className="text-sm">{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    )
  }

  return (
    <div className={`relative bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      {/* Header de Busca */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="bg-white rounded-lg shadow-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar oficinas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${
                showFilters ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FunnelIcon className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setShowList(!showList)}
              className={`p-2 rounded-lg transition-colors ${
                showList ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {showList ? <MapIcon className="w-5 h-5" /> : <ListBulletIcon className="w-5 h-5" />}
            </button>
          </div>

          {/* Filtros */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-gray-200 pt-3"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Distância */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Distância: {filters.maxDistance}km
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={filters.maxDistance}
                      onChange={(e) => updateFilters({ maxDistance: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  {/* Avaliação */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Avaliação mín: {filters.minRating}★
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.5"
                      value={filters.minRating}
                      onChange={(e) => updateFilters({ minRating: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  {/* Abertas agora */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="openNow"
                      checked={filters.isOpenNow}
                      onChange={(e) => updateFilters({ isOpenNow: e.target.checked })}
                      className="mr-2"
                    />
                    <label htmlFor="openNow" className="text-xs font-medium text-gray-700">
                      Abertas agora
                    </label>
                  </div>

                  {/* Ordenação */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Ordenar por
                    </label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => updateFilters({ sortBy: e.target.value as any })}
                      className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="distance">Distância</option>
                      <option value="rating">Avaliação</option>
                      <option value="popularity">Popularidade</option>
                      <option value="price">Preço</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <button
                    onClick={resetFilters}
                    className="text-xs text-gray-600 hover:text-gray-800"
                  >
                    Limpar Filtros
                  </button>
                  
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
                  >
                    {loading ? (
                      <ArrowPathIcon className="w-4 h-4 animate-spin" />
                    ) : (
                      <MagnifyingGlassIcon className="w-4 h-4" />
                    )}
                    Buscar
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mapa */}
      <div className="relative">
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-20">
            <div className="text-center">
              <ArrowPathIcon className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-2" />
              <p className="text-gray-600">Carregando mapa...</p>
            </div>
          </div>
        )}
        
        <div
          ref={mapRef}
          className="w-full h-96 lg:h-[500px]"
          style={{ minHeight: '400px' }}
        />
      </div>

      {/* Lista de Resultados */}
      <AnimatePresence>
        {showList && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute top-0 right-0 bottom-0 w-80 bg-white shadow-xl border-l border-gray-200 z-30 overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">
                {filteredOficinas.length} oficinas encontradas
              </h3>
              <button
                onClick={() => setShowList(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto h-full">
              {filteredOficinas.map((oficina) => (
                <motion.div
                  key={oficina.id}
                  whileHover={{ backgroundColor: '#f9fafb' }}
                  onClick={() => handleMarkerClick(oficina)}
                  className="p-4 border-b border-gray-100 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">{oficina.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${
                      oficina.planType === 'premium' ? 'bg-yellow-100 text-yellow-800' :
                      oficina.planType === 'pro' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {oficina.planType.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mb-2">
                    <StarIcon className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">
                      {oficina.rating} ({oficina.reviewCount})
                    </span>
                    <span className="text-sm text-gray-400 ml-auto">
                      {oficina.distance?.toFixed(1)}km
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 mb-2">{oficina.address}</p>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      oficina.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {oficina.isOpen ? 'Aberto' : 'Fechado'}
                    </span>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDirections(oficina)
                      }}
                      className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 flex items-center gap-1"
                    >
                      <NavigationIcon className="w-3 h-3" />
                      Rota
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Informações da Oficina Selecionada */}
      <AnimatePresence>
        {selectedOficina && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-xl p-4 z-20"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg">{selectedOficina.name}</h3>
                <div className="flex items-center gap-2">
                  <StarIcon className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">
                    {selectedOficina.rating} ({selectedOficina.reviewCount} avaliações)
                  </span>
                  <span className="text-sm text-blue-600">
                    {selectedOficina.distance?.toFixed(1)}km
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => setSelectedOficina(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-3">{selectedOficina.address}</p>

            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs px-2 py-1 rounded ${
                selectedOficina.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {selectedOficina.isOpen ? 'Aberto agora' : 'Fechado'}
              </span>
              <span className={`text-xs px-2 py-1 rounded ${
                selectedOficina.planType === 'premium' ? 'bg-yellow-100 text-yellow-800' :
                selectedOficina.planType === 'pro' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {selectedOficina.planType.toUpperCase()}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleDirections(selectedOficina)}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <NavigationIcon className="w-4 h-4" />
                Como Chegar
              </button>
              
              {selectedOficina.phone && (
                <button
                  onClick={() => window.open(`tel:${selectedOficina.phone}`)}
                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                >
                  <PhoneIcon className="w-4 h-4" />
                </button>
              )}
              
              {selectedOficina.website && (
                <button
                  onClick={() => window.open(selectedOficina.website, '_blank')}
                  className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
                >
                  <GlobeAltIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-4 shadow-xl">
            <ArrowPathIcon className="w-6 h-6 text-blue-600 animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-600">Processando...</p>
          </div>
        </div>
      )}
    </div>
  )
}
