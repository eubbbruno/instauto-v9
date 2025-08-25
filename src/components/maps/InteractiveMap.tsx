'use client'
import { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useGoogleMaps } from './GoogleMapsProvider'
import { 
  MapPinIcon, 
  MagnifyingGlassIcon,
  ListBulletIcon,
  MapIcon,
  AdjustmentsHorizontalIcon,
  StarIcon,
  PhoneIcon,
  ClockIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline'

interface Workshop {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  rating: number
  reviews: number
  services: string[]
  distance?: string
  isOpen: boolean
  phone: string
  photo?: string
  priceRange: 'low' | 'medium' | 'high'
  specialties: string[]
}

interface InteractiveMapProps {
  workshops: Workshop[]
  selectedWorkshop?: Workshop | null
  onWorkshopSelect?: (workshop: Workshop) => void
  onLocationChange?: (lat: number, lng: number) => void
  className?: string
  showSearch?: boolean
  showFilters?: boolean
  currentLocation?: { lat: number; lng: number } | null
}

export default function InteractiveMap({
  workshops,
  selectedWorkshop,
  onWorkshopSelect,
  onLocationChange,
  className = '',
  showSearch = true,
  showFilters = true,
  currentLocation
}: InteractiveMapProps) {
  const { isLoaded, maps, google } = useGoogleMaps()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap')
  const [showList, setShowList] = useState(false)
  const [filteredWorkshops, setFilteredWorkshops] = useState(workshops)
  const [filters, setFilters] = useState({
    rating: 0,
    priceRange: 'all',
    isOpen: false,
    services: [] as string[]
  })

  // Inicializar mapa
  useEffect(() => {
    if (!isLoaded || !maps || !mapRef.current) return

    const defaultCenter = currentLocation || { lat: -23.5505, lng: -46.6333 } // São Paulo

    const map = new google!.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 13,
      mapTypeId: mapType,
      styles: [
        {
          featureType: 'poi.business',
          stylers: [{ visibility: 'off' }]
        }
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
      gestureHandling: 'cooperative'
    })

    mapInstanceRef.current = map

    // InfoWindow para detalhes das oficinas
    infoWindowRef.current = new google!.maps.InfoWindow()

    // Listener para mudanças de localização
    map.addListener('center_changed', () => {
      const center = map.getCenter()
      if (center) {
        onLocationChange?.(center.lat(), center.lng())
      }
    })

    return () => {
      if (mapInstanceRef.current) {
        google!.maps.event.clearInstanceListeners(mapInstanceRef.current)
      }
    }
  }, [isLoaded, maps, google, mapType, currentLocation, onLocationChange])

  // Atualizar marcadores quando workshops mudam
  useEffect(() => {
    if (!mapInstanceRef.current || !maps) return

    // Limpar marcadores existentes
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

    // Adicionar marcadores das oficinas
    filteredWorkshops.forEach(workshop => {
      const marker = new google!.maps.Marker({
        position: { lat: workshop.lat, lng: workshop.lng },
        map: mapInstanceRef.current,
        title: workshop.name,
        icon: {
          url: workshop.isOpen ? '/icons/workshop-marker.svg' : '/icons/workshop-closed.svg',
          scaledSize: new google!.maps.Size(40, 40),
          anchor: new google!.maps.Point(20, 40)
        }
      })

      marker.addListener('click', () => {
        onWorkshopSelect?.(workshop)
        showInfoWindow(marker, workshop)
      })

      markersRef.current.push(marker)
    })

    // Adicionar marcador da localização atual
    if (currentLocation) {
      const userMarker = new google!.maps.Marker({
        position: currentLocation,
        map: mapInstanceRef.current,
        title: 'Sua localização',
        icon: {
          url: '/icons/user-location.svg',
          scaledSize: new google!.maps.Size(30, 30),
          anchor: new google!.maps.Point(15, 30)
        }
      })
      markersRef.current.push(userMarker)
    }

    // Ajustar zoom para mostrar todas as oficinas
    if (filteredWorkshops.length > 0) {
      const bounds = new google!.maps.LatLngBounds()
      filteredWorkshops.forEach(workshop => {
        bounds.extend({ lat: workshop.lat, lng: workshop.lng })
      })
      if (currentLocation) {
        bounds.extend(currentLocation)
      }
      mapInstanceRef.current!.fitBounds(bounds)
    }
  }, [filteredWorkshops, maps, currentLocation, onWorkshopSelect])

  // Destacar oficina selecionada
  useEffect(() => {
    if (!selectedWorkshop || !mapInstanceRef.current) return

    const workshop = selectedWorkshop
    const marker = markersRef.current.find(m => 
      m.getTitle() === workshop.name
    )

    if (marker) {
      showInfoWindow(marker, workshop)
      mapInstanceRef.current.panTo({ lat: workshop.lat, lng: workshop.lng })
    }
  }, [selectedWorkshop])

  const showInfoWindow = useCallback((marker: google.maps.Marker, workshop: Workshop) => {
    if (!infoWindowRef.current) return

    const content = `
      <div style="padding: 12px; max-width: 300px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #1f2937;">
          ${workshop.name}
        </h3>
        <div style="display: flex; align-items: center; margin-bottom: 6px;">
          <span style="color: #f59e0b; margin-right: 4px;">⭐</span>
          <span style="font-weight: 500;">${workshop.rating}</span>
          <span style="color: #6b7280; margin-left: 4px;">(${workshop.reviews} avaliações)</span>
        </div>
        <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
          ${workshop.address}
        </p>
        <div style="margin-bottom: 8px;">
          <span style="color: ${workshop.isOpen ? '#10b981' : '#ef4444'}; font-weight: 500; font-size: 12px;">
            ${workshop.isOpen ? '🟢 Aberto' : '🔴 Fechado'}
          </span>
        </div>
        <div style="display: flex; gap: 8px; margin-top: 12px;">
          <button onclick="window.open('tel:${workshop.phone}', '_self')" 
                  style="background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">
            📞 Ligar
          </button>
          <button onclick="window.open('https://maps.google.com/maps?daddr=${workshop.lat},${workshop.lng}', '_blank')" 
                  style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">
            🗺️ Navegar
          </button>
        </div>
      </div>
    `

    infoWindowRef.current.setContent(content)
    infoWindowRef.current.open(mapInstanceRef.current, marker)
  }, [])

  // Filtrar oficinas
  useEffect(() => {
    let filtered = workshops

    // Filtro por busca
    if (searchQuery) {
      filtered = filtered.filter(workshop =>
        workshop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workshop.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workshop.services.some(service => 
          service.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }

    // Filtro por avaliação
    if (filters.rating > 0) {
      filtered = filtered.filter(workshop => workshop.rating >= filters.rating)
    }

    // Filtro por preço
    if (filters.priceRange !== 'all') {
      filtered = filtered.filter(workshop => workshop.priceRange === filters.priceRange)
    }

    // Filtro por status (aberto/fechado)
    if (filters.isOpen) {
      filtered = filtered.filter(workshop => workshop.isOpen)
    }

    // Filtro por serviços
    if (filters.services.length > 0) {
      filtered = filtered.filter(workshop =>
        filters.services.some(service =>
          workshop.services.includes(service)
        )
      )
    }

    setFilteredWorkshops(filtered)
  }, [workshops, searchQuery, filters])

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          
          if (mapInstanceRef.current) {
            mapInstanceRef.current.panTo(location)
            mapInstanceRef.current.setZoom(15)
          }
          
          onLocationChange?.(location.lat, location.lng)
        },
        (error) => {
          console.error('Erro ao obter localização:', error)
        }
      )
    }
  }

  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando mapa...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Controles do Mapa */}
      <div className="absolute top-4 left-4 right-4 z-10 space-y-3">
        {/* Busca */}
        {showSearch && (
          <div className="bg-white rounded-xl shadow-lg p-3">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar oficinas, serviços..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* Controles */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={getUserLocation}
              className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
              title="Minha localização"
            >
              <MapPinIcon className="w-5 h-5 text-blue-600" />
            </button>
            
            <button
              onClick={() => setMapType(mapType === 'roadmap' ? 'satellite' : 'roadmap')}
              className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
              title="Alternar vista"
            >
              <MapIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {showFilters && (
              <button
                onClick={() => setShowList(!showList)}
                className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
                title="Lista de oficinas"
              >
                <ListBulletIcon className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mapa */}
      <div ref={mapRef} className="w-full h-full rounded-xl" />

      {/* Lista de Oficinas */}
      {showList && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="absolute top-0 right-0 w-80 h-full bg-white shadow-2xl z-20 overflow-hidden"
        >
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Oficinas próximas</h3>
              <button
                onClick={() => setShowList(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-gray-600">{filteredWorkshops.length} encontradas</p>
          </div>

          <div className="overflow-y-auto h-full pb-20">
            {filteredWorkshops.map((workshop) => (
              <div
                key={workshop.id}
                onClick={() => onWorkshopSelect?.(workshop)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedWorkshop?.id === workshop.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{workshop.name}</h4>
                  <div className="flex items-center space-x-1">
                    <StarIcon className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium">{workshop.rating}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{workshop.address}</p>
                
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-medium ${workshop.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                    {workshop.isOpen ? 'Aberto' : 'Fechado'}
                  </span>
                  {workshop.distance && (
                    <span className="text-gray-500">{workshop.distance}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Informações da oficina selecionada */}
      {selectedWorkshop && !showList && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 right-4 bg-white rounded-xl shadow-2xl p-4 z-10"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">{selectedWorkshop.name}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                <div className="flex items-center space-x-1">
                  <StarIcon className="w-4 h-4 text-yellow-400" />
                  <span>{selectedWorkshop.rating}</span>
                </div>
                <span className={selectedWorkshop.isOpen ? 'text-green-600' : 'text-red-600'}>
                  {selectedWorkshop.isOpen ? 'Aberto' : 'Fechado'}
                </span>
                {selectedWorkshop.distance && (
                  <span>{selectedWorkshop.distance}</span>
                )}
              </div>
              <p className="text-sm text-gray-600">{selectedWorkshop.address}</p>
            </div>
            
            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => window.open(`tel:${selectedWorkshop.phone}`, '_self')}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PhoneIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => window.open(`https://maps.google.com/maps?daddr=${selectedWorkshop.lat},${selectedWorkshop.lng}`, '_blank')}
                className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
