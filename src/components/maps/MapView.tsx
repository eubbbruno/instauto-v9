'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MapPinIcon, 
  MagnifyingGlassIcon,
  NavigationIcon,
  PhoneIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { useGoogleMaps, MapLocation, Oficina } from '@/lib/google-maps'
import { useToastHelpers } from '@/components/ui/toast'

interface MapViewProps {
  center?: MapLocation
  zoom?: number
  showSearch?: boolean
  showNearbyOficinas?: boolean
  onOficinaSelect?: (oficina: Oficina) => void
  className?: string
}

export default function MapView({
  center,
  zoom = 13,
  showSearch = true,
  showNearbyOficinas = true,
  onOficinaSelect,
  className = ''
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [currentLocation, setCurrentLocation] = useState<MapLocation | null>(center || null)
  const [oficinas, setOficinas] = useState<Oficina[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOficina, setSelectedOficina] = useState<Oficina | null>(null)
  
  const googleMaps = useGoogleMaps()
  const { success, error: showError } = useToastHelpers()

  // Inicializar mapa
  useEffect(() => {
    if (mapRef.current && !map) {
      initializeMap()
    }
  }, [mapRef.current])

  // Buscar oficinas quando localização mudar
  useEffect(() => {
    if (currentLocation && showNearbyOficinas) {
      searchNearbyOficinas()
    }
  }, [currentLocation, showNearbyOficinas])

  const initializeMap = async () => {
    if (!mapRef.current) return

    try {
      // Usar localização atual se não fornecida
      let mapCenter = currentLocation
      if (!mapCenter) {
        try {
          mapCenter = await googleMaps.getCurrentLocation()
          setCurrentLocation(mapCenter)
          success('Localização obtida com sucesso!')
        } catch (error) {
          // Fallback para São Paulo
          mapCenter = { lat: -23.5505, lng: -46.6333 }
          setCurrentLocation(mapCenter)
        }
      }

      // Criar mapa
      const newMap = await googleMaps.createMap(mapRef.current, mapCenter, zoom)
      setMap(newMap)

      // Adicionar marcador da localização atual
      if (newMap && mapCenter) {
        new google.maps.Marker({
          position: { lat: mapCenter.lat, lng: mapCenter.lng },
          map: newMap,
          title: 'Sua localização',
          icon: {
            url: '/images/markers/user-marker.png',
            scaledSize: new google.maps.Size(30, 30)
          }
        })
      }
    } catch (error) {
      console.error('Erro ao inicializar mapa:', error)
      showError('Erro ao carregar mapa')
    }
  }

  const searchNearbyOficinas = async () => {
    if (!currentLocation) return

    setLoading(true)
    try {
      const nearbyOficinas = await googleMaps.findNearbyOficinas(
        currentLocation,
        5000, // 5km
        searchQuery || 'oficina mecânica'
      )
      
      setOficinas(nearbyOficinas)
      
      // Adicionar marcadores no mapa
      if (map) {
        googleMaps.addMarkers(nearbyOficinas, map)
      }

      success(`${nearbyOficinas.length} oficinas encontradas`)
    } catch (error) {
      console.error('Erro ao buscar oficinas:', error)
      showError('Erro ao buscar oficinas próximas')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      // Se for um endereço, geocodificar primeiro
      if (searchQuery.includes(',') || searchQuery.includes('rua') || searchQuery.includes('av')) {
        const location = await googleMaps.geocodeAddress(searchQuery)
        setCurrentLocation(location)
        
        if (map) {
          map.setCenter({ lat: location.lat, lng: location.lng })
        }
      } else {
        // Buscar oficinas com a query
        await searchNearbyOficinas()
      }
    } catch (error) {
      console.error('Erro na busca:', error)
      showError('Erro na busca. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const selectOficina = (oficina: Oficina) => {
    setSelectedOficina(oficina)
    onOficinaSelect?.(oficina)
    
    // Centralizar mapa na oficina
    if (map) {
      map.setCenter({ lat: oficina.lat, lng: oficina.lng })
      map.setZoom(16)
    }
  }

  const showRoute = async (oficina: Oficina) => {
    if (!currentLocation || !map) return

    try {
      await googleMaps.showRoute(currentLocation, {
        lat: oficina.lat,
        lng: oficina.lng
      }, map)
      
      const routeInfo = await googleMaps.calculateRoute(currentLocation, {
        lat: oficina.lat,
        lng: oficina.lng
      })
      
      success(`Rota calculada: ${routeInfo.distance} - ${routeInfo.duration}`)
    } catch (error) {
      console.error('Erro ao calcular rota:', error)
      showError('Erro ao calcular rota')
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Search Bar */}
      {showSearch && (
        <div className="absolute top-4 left-4 right-4 z-10">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar oficinas ou endereço..."
                className="w-full pl-10 pr-4 py-3 bg-white rounded-xl shadow-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? '...' : 'Buscar'}
            </button>
          </form>
        </div>
      )}

      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full min-h-[400px] rounded-xl" />

      {/* Oficinas List */}
      {oficinas.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="bg-white rounded-xl shadow-lg max-h-48 overflow-y-auto">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-gray-900">
                Oficinas Próximas ({oficinas.length})
              </h3>
            </div>
            <div className="divide-y">
              {oficinas.slice(0, 5).map((oficina) => (
                <motion.button
                  key={oficina.id}
                  onClick={() => selectOficina(oficina)}
                  className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 truncate">
                        {oficina.name}
                      </h4>
                      <p className="text-sm text-gray-600 truncate">
                        {oficina.address}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        {oficina.rating && (
                          <div className="flex items-center gap-1">
                            <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{oficina.rating}</span>
                          </div>
                        )}
                        {oficina.distance && (
                          <span className="text-sm text-blue-600">
                            {oficina.distance.toFixed(1)} km
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          showRoute(oficina)
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver rota"
                      >
                        <NavigationIcon className="w-4 h-4" />
                      </button>
                      {oficina.phone && (
                        <a
                          href={`tel:${oficina.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Ligar"
                        >
                          <PhoneIcon className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-20 rounded-xl">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700">Carregando...</span>
          </div>
        </div>
      )}
    </div>
  )
}
