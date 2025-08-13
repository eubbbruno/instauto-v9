'use client'

export interface MapLocation {
  lat: number
  lng: number
  address?: string
  placeId?: string
}

export interface OfficinaMarker extends MapLocation {
  id: string
  name: string
  rating: number
  reviewCount: number
  distance?: number
  isOpen: boolean
  phone?: string
  website?: string
  types: string[]
  priceLevel?: number
  photos?: string[]
  openingHours?: {
    periods: Array<{
      open: { day: number; time: string }
      close: { day: number; time: string }
    }>
    weekdayText: string[]
  }
  services: string[]
  planType: 'free' | 'pro' | 'premium'
}

export interface RouteInfo {
  distance: string
  duration: string
  steps: Array<{
    instruction: string
    distance: string
    duration: string
    polyline: string
  }>
  polyline: string
}

export interface SearchFilters {
  maxDistance: number // km
  minRating: number
  serviceTypes: string[]
  priceRange: [number, number]
  isOpenNow: boolean
  planTypes: string[]
  sortBy: 'distance' | 'rating' | 'price' | 'popularity'
}

class GoogleMapsManager {
  private map: google.maps.Map | null = null
  private directionsService: google.maps.DirectionsService | null = null
  private directionsRenderer: google.maps.DirectionsRenderer | null = null
  private placesService: google.maps.places.PlacesService | null = null
  private geocoder: google.maps.Geocoder | null = null
  private markers: google.maps.Marker[] = []
  private userLocation: MapLocation | null = null
  private infoWindow: google.maps.InfoWindow | null = null
  
  async initialize(mapContainer: HTMLElement, options?: google.maps.MapOptions): Promise<boolean> {
    try {
      // Verificar se Google Maps API está carregada
      if (!window.google?.maps) {
        await this.loadGoogleMapsAPI()
      }

      // Configurações padrão do mapa
      const defaultOptions: google.maps.MapOptions = {
        zoom: 12,
        center: { lat: -23.5505, lng: -46.6333 }, // São Paulo
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        gestureHandling: 'greedy',
        styles: this.getMapStyles(),
        ...options
      }

      // Criar o mapa
      this.map = new google.maps.Map(mapContainer, defaultOptions)

      // Inicializar serviços
      this.directionsService = new google.maps.DirectionsService()
      this.directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: '#1e40af',
          strokeWeight: 6,
          strokeOpacity: 0.8
        }
      })
      this.directionsRenderer.setMap(this.map)

      this.placesService = new google.maps.places.PlacesService(this.map)
      this.geocoder = new google.maps.Geocoder()
      this.infoWindow = new google.maps.InfoWindow()

      // Obter localização do usuário
      await this.getCurrentLocation()

      console.log('✅ Google Maps inicializado com sucesso')
      return true

    } catch (error) {
      console.error('❌ Erro ao inicializar Google Maps:', error)
      return false
    }
  }

  private async loadGoogleMapsAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.google?.maps) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,geometry`
      script.async = true
      script.defer = true
      
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Falha ao carregar Google Maps API'))
      
      document.head.appendChild(script)
    })
  }

  private getMapStyles(): google.maps.MapTypeStyle[] {
    return [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'transit',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'road',
        elementType: 'labels.icon',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#e3f2fd' }]
      },
      {
        featureType: 'landscape',
        elementType: 'geometry',
        stylers: [{ color: '#f5f5f5' }]
      }
    ]
  }

  async getCurrentLocation(): Promise<MapLocation | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn('🌍 Geolocalização não suportada')
        resolve(null)
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: MapLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          
          this.userLocation = location
          
          if (this.map) {
            this.map.setCenter(location)
            
            // Adicionar marker do usuário
            new google.maps.Marker({
              position: location,
              map: this.map,
              title: 'Sua localização',
              icon: {
                url: '/images/markers/user-location.png',
                scaledSize: new google.maps.Size(40, 40),
                anchor: new google.maps.Point(20, 40)
              }
            })
          }
          
          console.log('📍 Localização obtida:', location)
          resolve(location)
        },
        (error) => {
          console.warn('❌ Erro ao obter localização:', error.message)
          resolve(null)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutos
        }
      )
    })
  }

  async searchOfficinasNearby(
    location: MapLocation, 
    radius: number = 5000, 
    filters?: Partial<SearchFilters>
  ): Promise<OfficinaMarker[]> {
    if (!this.placesService) {
      throw new Error('Places Service não inicializado')
    }

    return new Promise((resolve, reject) => {
      const request: google.maps.places.PlaceSearchRequest = {
        location: new google.maps.LatLng(location.lat, location.lng),
        radius,
        type: 'car_repair',
        openNow: filters?.isOpenNow
      }

      this.placesService!.nearbySearch(request, async (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          try {
            const oficinas = await this.processPlaceResults(results, location, filters)
            resolve(oficinas)
          } catch (error) {
            reject(error)
          }
        } else {
          reject(new Error(`Erro na busca: ${status}`))
        }
      })
    })
  }

  private async processPlaceResults(
    results: google.maps.places.PlaceResult[], 
    userLocation: MapLocation,
    filters?: Partial<SearchFilters>
  ): Promise<OfficinaMarker[]> {
    const oficinas: OfficinaMarker[] = []

    for (const place of results) {
      if (!place.geometry?.location || !place.place_id) continue

      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng()
      
      // Calcular distância
      const distance = this.calculateDistance(
        userLocation.lat, userLocation.lng,
        lat, lng
      )

      // Aplicar filtros
      if (filters?.maxDistance && distance > filters.maxDistance) continue
      if (filters?.minRating && (place.rating || 0) < filters.minRating) continue

      // Obter detalhes adicionais
      const details = await this.getPlaceDetails(place.place_id)

      const oficina: OfficinaMarker = {
        id: place.place_id,
        name: place.name || 'Oficina',
        lat,
        lng,
        rating: place.rating || 0,
        reviewCount: place.user_ratings_total || 0,
        distance,
        isOpen: place.opening_hours?.open_now || false,
        phone: details?.formatted_phone_number,
        website: details?.website,
        address: place.vicinity,
        types: place.types || [],
        priceLevel: place.price_level,
        photos: place.photos?.map(photo => 
          photo.getUrl({ maxWidth: 400, maxHeight: 300 })
        ),
        openingHours: details?.opening_hours ? {
          periods: details.opening_hours.periods || [],
          weekdayText: details.opening_hours.weekday_text || []
        } : undefined,
        services: this.extractServices(details?.types || []),
        planType: this.determinePlanType(place.rating || 0, place.user_ratings_total || 0)
      }

      oficinas.push(oficina)
    }

    // Aplicar ordenação
    return this.sortOfficinas(oficinas, filters?.sortBy || 'distance')
  }

  private async getPlaceDetails(placeId: string): Promise<google.maps.places.PlaceResult | null> {
    return new Promise((resolve) => {
      if (!this.placesService) {
        resolve(null)
        return
      }

      this.placesService.getDetails(
        {
          placeId,
          fields: [
            'formatted_phone_number',
            'website', 
            'opening_hours',
            'types',
            'reviews'
          ]
        },
        (result, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            resolve(result)
          } else {
            resolve(null)
          }
        }
      )
    })
  }

  private extractServices(types: string[]): string[] {
    const serviceMap: { [key: string]: string } = {
      'car_wash': 'Lavagem',
      'gas_station': 'Combustível',
      'tire_repair': 'Pneus',
      'auto_parts_store': 'Peças',
      'locksmith': 'Chaveiro',
      'towing_service': 'Guincho'
    }

    return types
      .map(type => serviceMap[type])
      .filter(Boolean)
      .concat(['Mecânica Geral', 'Diagnóstico']) // Serviços padrão
  }

  private determinePlanType(rating: number, reviewCount: number): 'free' | 'pro' | 'premium' {
    if (rating >= 4.5 && reviewCount >= 100) return 'premium'
    if (rating >= 4.0 && reviewCount >= 50) return 'pro'
    return 'free'
  }

  private sortOfficinas(oficinas: OfficinaMarker[], sortBy: string): OfficinaMarker[] {
    return oficinas.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'price':
          return (a.priceLevel || 0) - (b.priceLevel || 0)
        case 'popularity':
          return b.reviewCount - a.reviewCount
        case 'distance':
        default:
          return (a.distance || 0) - (b.distance || 0)
      }
    })
  }

  addOficinaMarkers(oficinas: OfficinaMarker[], onMarkerClick?: (oficina: OfficinaMarker) => void): void {
    if (!this.map) return

    // Limpar markers existentes
    this.clearMarkers()

    oficinas.forEach((oficina) => {
      const marker = new google.maps.Marker({
        position: { lat: oficina.lat, lng: oficina.lng },
        map: this.map,
        title: oficina.name,
        icon: this.getMarkerIcon(oficina.planType, oficina.rating),
        animation: google.maps.Animation.DROP
      })

      // Click listener
      marker.addListener('click', () => {
        this.showInfoWindow(marker, oficina)
        onMarkerClick?.(oficina)
      })

      this.markers.push(marker)
    })

    // Ajustar zoom para mostrar todos os markers
    this.fitMarkersInView()
  }

  private getMarkerIcon(planType: string, rating: number): google.maps.Icon {
    const iconMap = {
      'free': '/images/markers/oficina-free.png',
      'pro': '/images/markers/oficina-pro.png',
      'premium': '/images/markers/oficina-premium.png'
    }

    return {
      url: iconMap[planType as keyof typeof iconMap] || iconMap.free,
      scaledSize: new google.maps.Size(40, 50),
      anchor: new google.maps.Point(20, 50)
    }
  }

  private showInfoWindow(marker: google.maps.Marker, oficina: OfficinaMarker): void {
    if (!this.infoWindow) return

    const content = `
      <div class="p-3 max-w-xs">
        <h3 class="font-bold text-lg mb-2">${oficina.name}</h3>
        <div class="flex items-center gap-2 mb-2">
          <span class="text-yellow-500">${'★'.repeat(Math.floor(oficina.rating))}</span>
          <span class="text-sm text-gray-600">${oficina.rating} (${oficina.reviewCount} avaliações)</span>
        </div>
        <p class="text-sm text-gray-600 mb-2">${oficina.address}</p>
        <p class="text-sm text-blue-600 mb-2">${oficina.distance?.toFixed(1)} km de distância</p>
        <div class="flex items-center gap-2 mb-3">
          <span class="text-xs px-2 py-1 rounded ${oficina.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
            ${oficina.isOpen ? 'Aberto' : 'Fechado'}
          </span>
          <span class="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
            ${oficina.planType.toUpperCase()}
          </span>
        </div>
        <div class="flex gap-2">
          <button onclick="window.openOficinaDetails('${oficina.id}')" 
                  class="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
            Ver Detalhes
          </button>
          <button onclick="window.getDirections(${oficina.lat}, ${oficina.lng})" 
                  class="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
            Como Chegar
          </button>
        </div>
      </div>
    `

    this.infoWindow.setContent(content)
    this.infoWindow.open(this.map, marker)
  }

  async getDirections(destination: MapLocation): Promise<RouteInfo | null> {
    if (!this.directionsService || !this.userLocation) {
      throw new Error('Serviço de direções não disponível ou localização não obtida')
    }

    return new Promise((resolve, reject) => {
      this.directionsService!.route(
        {
          origin: new google.maps.LatLng(this.userLocation!.lat, this.userLocation!.lng),
          destination: new google.maps.LatLng(destination.lat, destination.lng),
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            const route = result.routes[0]
            const leg = route.legs[0]

            const routeInfo: RouteInfo = {
              distance: leg.distance?.text || '',
              duration: leg.duration?.text || '',
              steps: leg.steps?.map(step => ({
                instruction: step.instructions,
                distance: step.distance?.text || '',
                duration: step.duration?.text || '',
                polyline: step.polyline?.points || ''
              })) || [],
              polyline: route.overview_polyline?.points || ''
            }

            // Mostrar rota no mapa
            this.directionsRenderer!.setDirections(result)
            
            resolve(routeInfo)
          } else {
            reject(new Error(`Erro ao calcular rota: ${status}`))
          }
        }
      )
    })
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371 // Raio da Terra em km
    const dLat = this.toRadian(lat2 - lat1)
    const dLng = this.toRadian(lng2 - lng1)
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadian(lat1)) * Math.cos(this.toRadian(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  private toRadian(degree: number): number {
    return degree * (Math.PI / 180)
  }

  private clearMarkers(): void {
    this.markers.forEach(marker => marker.setMap(null))
    this.markers = []
  }

  private fitMarkersInView(): void {
    if (!this.map || this.markers.length === 0) return

    const bounds = new google.maps.LatLngBounds()
    
    // Incluir localização do usuário
    if (this.userLocation) {
      bounds.extend(new google.maps.LatLng(this.userLocation.lat, this.userLocation.lng))
    }
    
    // Incluir todos os markers
    this.markers.forEach(marker => {
      const position = marker.getPosition()
      if (position) bounds.extend(position)
    })

    this.map.fitBounds(bounds)
  }

  // Métodos utilitários
  centerOnLocation(location: MapLocation, zoom: number = 15): void {
    if (!this.map) return
    this.map.setCenter(location)
    this.map.setZoom(zoom)
  }

  clearDirections(): void {
    if (this.directionsRenderer) {
      this.directionsRenderer.setDirections({ routes: [] } as google.maps.DirectionsResult)
    }
  }

  setMapStyle(isDark: boolean): void {
    if (!this.map) return
    
    const styles = isDark ? this.getDarkMapStyles() : this.getMapStyles()
    this.map.setOptions({ styles })
  }

  private getDarkMapStyles(): google.maps.MapTypeStyle[] {
    return [
      { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#263c3f' }]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#6b9a76' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#38414e' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#212a37' }]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#9ca5b3' }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#746855' }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#1f2835' }]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#f3d19c' }]
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{ color: '#2f3948' }]
      },
      {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#17263c' }]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#515c6d' }]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#17263c' }]
      }
    ]
  }
}

// Singleton instance
export const googleMapsManager = new GoogleMapsManager()

// React Hook para Google Maps
import { useEffect, useRef, useState } from 'react'

export const useGoogleMaps = () => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<MapLocation | null>(null)

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current) return

      try {
        const success = await googleMapsManager.initialize(mapRef.current)
        if (success) {
          setIsLoaded(true)
          const location = await googleMapsManager.getCurrentLocation()
          setUserLocation(location)
        } else {
          setError('Falha ao inicializar Google Maps')
        }
      } catch (err: any) {
        setError(err.message || 'Erro desconhecido')
      }
    }

    initializeMap()
  }, [])

  const searchOfficinas = async (filters?: Partial<SearchFilters>) => {
    if (!userLocation) {
      throw new Error('Localização do usuário não disponível')
    }

    return await googleMapsManager.searchOfficinasNearby(
      userLocation,
      (filters?.maxDistance || 5) * 1000, // converter para metros
      filters
    )
  }

  const showDirections = async (destination: MapLocation) => {
    return await googleMapsManager.getDirections(destination)
  }

  const addMarkers = (oficinas: OfficinaMarker[], onMarkerClick?: (oficina: OfficinaMarker) => void) => {
    googleMapsManager.addOficinaMarkers(oficinas, onMarkerClick)
  }

  const clearDirections = () => {
    googleMapsManager.clearDirections()
  }

  const centerOnLocation = (location: MapLocation, zoom?: number) => {
    googleMapsManager.centerOnLocation(location, zoom)
  }

  return {
    mapRef,
    isLoaded,
    error,
    userLocation,
    searchOfficinas,
    showDirections,
    addMarkers,
    clearDirections,
    centerOnLocation
  }
}
