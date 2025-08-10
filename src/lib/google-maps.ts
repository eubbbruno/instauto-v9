'use client'
import { useState, useEffect, useCallback, useRef } from 'react'

export interface MapLocation {
  lat: number
  lng: number
  address?: string
  placeId?: string
}

export interface Workshop {
  id: string
  name: string
  address: string
  location: MapLocation
  rating: number
  reviewCount: number
  distance?: number
  isOpen: boolean
  openingHours?: string[]
  phone: string
  services: string[]
  priceRange: 'low' | 'medium' | 'high'
  photos?: string[]
  verified: boolean
}

export interface MapFilters {
  services: string[]
  priceRange: 'low' | 'medium' | 'high' | 'all'
  rating: number
  distance: number
  openNow: boolean
}

export interface RouteData {
  distance: string
  duration: string
  steps: google.maps.DirectionsStep[]
  polyline: string
}

class GoogleMapsManager {
  private map: google.maps.Map | null = null
  private directionsService: google.maps.DirectionsService | null = null
  private directionsRenderer: google.maps.DirectionsRenderer | null = null
  private placesService: google.maps.places.PlacesService | null = null
  private geocoder: google.maps.Geocoder | null = null
  private markers: google.maps.Marker[] = []
  private infoWindow: google.maps.InfoWindow | null = null
  private userLocationMarker: google.maps.Marker | null = null
  private currentRoute: google.maps.DirectionsRoute | null = null
  private isLoaded = false

  async initialize(): Promise<boolean> {
    if (this.isLoaded) return true

    try {
      // Verificar se Google Maps já está carregado
      if (typeof google !== 'undefined' && google.maps) {
        this.isLoaded = true
        this.initializeServices()
        return true
      }

      // Carregar Google Maps dinamicamente
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      if (!apiKey) {
        console.error('❌ Google Maps API Key não encontrada')
        return false
      }

      await this.loadGoogleMapsScript(apiKey)
      this.isLoaded = true
      this.initializeServices()
      
      console.log('✅ Google Maps carregado com sucesso')
      return true

    } catch (error) {
      console.error('❌ Erro ao carregar Google Maps:', error)
      return false
    }
  }

  private async loadGoogleMapsScript(apiKey: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById('google-maps-script')) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.id = 'google-maps-script'
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&callback=initGoogleMaps`
      script.async = true
      script.defer = true

      // Callback global
      (window as any).initGoogleMaps = () => {
        resolve()
      }

      script.onerror = () => {
        reject(new Error('Falha ao carregar Google Maps'))
      }

      document.head.appendChild(script)
    })
  }

  private initializeServices(): void {
    if (!google?.maps) return

    this.directionsService = new google.maps.DirectionsService()
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: '#2563eb',
        strokeWeight: 4,
        strokeOpacity: 0.8
      }
    })
    this.geocoder = new google.maps.Geocoder()
    this.infoWindow = new google.maps.InfoWindow()
  }

  async createMap(container: HTMLElement, center: MapLocation, zoom = 12): Promise<google.maps.Map | null> {
    if (!this.isLoaded) {
      const loaded = await this.initialize()
      if (!loaded) return null
    }

    try {
      this.map = new google.maps.Map(container, {
        center: { lat: center.lat, lng: center.lng },
        zoom,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: this.getMapStyles(),
        gestureHandling: 'cooperative'
      })

      if (this.directionsRenderer) {
        this.directionsRenderer.setMap(this.map)
      }

      if (this.map) {
        this.placesService = new google.maps.places.PlacesService(this.map)
      }

      console.log('✅ Mapa criado com sucesso')
      return this.map

    } catch (error) {
      console.error('❌ Erro ao criar mapa:', error)
      return null
    }
  }

  async getCurrentLocation(): Promise<MapLocation | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn('⚠️ Geolocalização não suportada')
        resolve(null)
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: MapLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          resolve(location)
        },
        (error) => {
          console.warn('⚠️ Erro ao obter localização:', error.message)
          // Fallback para São Paulo
          resolve({
            lat: -23.5505,
            lng: -46.6333,
            address: 'São Paulo, SP'
          })
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutos
        }
      )
    })
  }

  async geocodeAddress(address: string): Promise<MapLocation | null> {
    if (!this.geocoder) return null

    return new Promise((resolve) => {
      this.geocoder!.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location
          resolve({
            lat: location.lat(),
            lng: location.lng(),
            address: results[0].formatted_address,
            placeId: results[0].place_id
          })
        } else {
          console.warn('⚠️ Erro no geocoding:', status)
          resolve(null)
        }
      })
    })
  }

  async searchWorkshops(
    location: MapLocation, 
    radius: number = 10000, 
    filters?: Partial<MapFilters>
  ): Promise<Workshop[]> {
    if (!this.placesService) return []

    try {
      // Buscar oficinas usando Places API
      const request: google.maps.places.PlaceSearchRequest = {
        location: new google.maps.LatLng(location.lat, location.lng),
        radius,
        type: 'car_repair',
        keyword: 'oficina mecanica auto center'
      }

      const places = await this.searchPlaces(request)
      const workshops: Workshop[] = []

      for (const place of places) {
        if (!place.geometry?.location) continue

        const workshop = await this.placeToWorkshop(place, location)
        if (workshop && this.matchesFilters(workshop, filters)) {
          workshops.push(workshop)
        }
      }

      // Ordenar por distância
      workshops.sort((a, b) => (a.distance || 0) - (b.distance || 0))

      console.log(`✅ Encontradas ${workshops.length} oficinas`)
      return workshops

    } catch (error) {
      console.error('❌ Erro ao buscar oficinas:', error)
      return []
    }
  }

  private async searchPlaces(request: google.maps.places.PlaceSearchRequest): Promise<google.maps.places.PlaceResult[]> {
    return new Promise((resolve) => {
      this.placesService!.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          resolve(results)
        } else {
          console.warn('⚠️ Erro na busca de lugares:', status)
          resolve([])
        }
      })
    })
  }

  private async placeToWorkshop(place: google.maps.places.PlaceResult, userLocation: MapLocation): Promise<Workshop | null> {
    if (!place.geometry?.location || !place.place_id) return null

    const placeLocation = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    }

    const distance = this.calculateDistance(userLocation, placeLocation)

    // Buscar detalhes do lugar
    const details = await this.getPlaceDetails(place.place_id)

    return {
      id: place.place_id,
      name: place.name || 'Oficina',
      address: place.vicinity || place.formatted_address || '',
      location: placeLocation,
      rating: place.rating || 0,
      reviewCount: place.user_ratings_total || 0,
      distance: Math.round(distance * 100) / 100,
      isOpen: this.isPlaceOpen(place),
      openingHours: details?.opening_hours?.weekday_text,
      phone: details?.formatted_phone_number || '',
      services: this.extractServices(place),
      priceRange: this.extractPriceRange(place),
      photos: place.photos?.slice(0, 3).map(photo => 
        photo.getUrl({ maxWidth: 400, maxHeight: 300 })
      ) || [],
      verified: place.business_status === 'OPERATIONAL'
    }
  }

  private async getPlaceDetails(placeId: string): Promise<google.maps.places.PlaceResult | null> {
    if (!this.placesService) return null

    return new Promise((resolve) => {
      this.placesService!.getDetails({
        placeId,
        fields: ['opening_hours', 'formatted_phone_number', 'website', 'price_level']
      }, (result, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && result) {
          resolve(result)
        } else {
          resolve(null)
        }
      })
    })
  }

  calculateDistance(from: MapLocation, to: MapLocation): number {
    if (!google?.maps?.geometry) return 0

    const fromLatLng = new google.maps.LatLng(from.lat, from.lng)
    const toLatLng = new google.maps.LatLng(to.lat, to.lng)
    
    return google.maps.geometry.spherical.computeDistanceBetween(fromLatLng, toLatLng) / 1000 // em km
  }

  addWorkshopMarkers(workshops: Workshop[], onMarkerClick?: (workshop: Workshop) => void): void {
    if (!this.map) return

    // Limpar marcadores existentes
    this.clearMarkers()

    workshops.forEach(workshop => {
      const marker = new google.maps.Marker({
        position: { lat: workshop.location.lat, lng: workshop.location.lng },
        map: this.map,
        title: workshop.name,
        icon: {
          url: '/icons/workshop-marker.png',
          scaledSize: new google.maps.Size(40, 40),
          anchor: new google.maps.Point(20, 40)
        },
        animation: google.maps.Animation.DROP
      })

      // Info window
      marker.addListener('click', () => {
        if (onMarkerClick) {
          onMarkerClick(workshop)
        }
        this.showWorkshopInfo(workshop, marker)
      })

      this.markers.push(marker)
    })

    // Ajustar zoom para mostrar todos os marcadores
    if (workshops.length > 0) {
      this.fitBounds(workshops.map(w => w.location))
    }
  }

  addUserLocationMarker(location: MapLocation): void {
    if (!this.map) return

    // Remover marcador anterior
    if (this.userLocationMarker) {
      this.userLocationMarker.setMap(null)
    }

    this.userLocationMarker = new google.maps.Marker({
      position: { lat: location.lat, lng: location.lng },
      map: this.map,
      title: 'Sua localização',
      icon: {
        url: '/icons/user-location.png',
        scaledSize: new google.maps.Size(30, 30),
        anchor: new google.maps.Point(15, 15)
      }
    })

    // Círculo de precisão
    new google.maps.Circle({
      center: { lat: location.lat, lng: location.lng },
      radius: 100,
      map: this.map,
      fillColor: '#2563eb',
      fillOpacity: 0.2,
      strokeColor: '#2563eb',
      strokeOpacity: 0.6,
      strokeWeight: 2
    })
  }

  async calculateRoute(from: MapLocation, to: MapLocation, travelMode = 'DRIVING'): Promise<RouteData | null> {
    if (!this.directionsService || !this.directionsRenderer) return null

    const request: google.maps.DirectionsRequest = {
      origin: new google.maps.LatLng(from.lat, from.lng),
      destination: new google.maps.LatLng(to.lat, to.lng),
      travelMode: google.maps.TravelMode[travelMode as keyof typeof google.maps.TravelMode],
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    }

    return new Promise((resolve) => {
      this.directionsService!.route(request, (result, status) => {
        if (status === 'OK' && result && result.routes[0]) {
          const route = result.routes[0]
          const leg = route.legs[0]

          this.directionsRenderer!.setDirections(result)
          this.currentRoute = route

          const routeData: RouteData = {
            distance: leg.distance?.text || '',
            duration: leg.duration?.text || '',
            steps: leg.steps || [],
            polyline: route.overview_polyline || ''
          }

          resolve(routeData)
        } else {
          console.warn('⚠️ Erro ao calcular rota:', status)
          resolve(null)
        }
      })
    })
  }

  clearRoute(): void {
    if (this.directionsRenderer) {
      this.directionsRenderer.setDirections({ routes: [] } as any)
    }
    this.currentRoute = null
  }

  private showWorkshopInfo(workshop: Workshop, marker: google.maps.Marker): void {
    if (!this.infoWindow) return

    const content = `
      <div style="max-width: 300px; padding: 8px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">
          ${workshop.name}
        </h3>
        <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 8px;">
          <span style="color: #f59e0b;">★</span>
          <span style="font-weight: bold;">${workshop.rating.toFixed(1)}</span>
          <span style="color: #6b7280; font-size: 14px;">(${workshop.reviewCount})</span>
          ${workshop.verified ? '<span style="color: #10b981; font-size: 12px;">✓ Verificada</span>' : ''}
        </div>
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #4b5563;">
          📍 ${workshop.address}
        </p>
        <div style="margin-bottom: 8px;">
          <span style="font-size: 14px; color: #6b7280;">
            📏 ${workshop.distance}km • 
            ${workshop.isOpen ? 
              '<span style="color: #10b981;">Aberto</span>' : 
              '<span style="color: #ef4444;">Fechado</span>'
            }
          </span>
        </div>
        ${workshop.services.length > 0 ? `
          <div style="margin-bottom: 8px;">
            <strong style="font-size: 12px; color: #4b5563;">SERVIÇOS:</strong>
            <div style="font-size: 12px; color: #6b7280;">
              ${workshop.services.slice(0, 3).join(' • ')}
            </div>
          </div>
        ` : ''}
        <div style="display: flex; gap: 8px; margin-top: 12px;">
          <button onclick="window.showWorkshopDetails?.('${workshop.id}')" 
                  style="background: #2563eb; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">
            Ver Detalhes
          </button>
          <button onclick="window.calculateRoute?.('${workshop.id}')" 
                  style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">
            Como Chegar
          </button>
        </div>
      </div>
    `

    this.infoWindow.setContent(content)
    this.infoWindow.open(this.map, marker)
  }

  private clearMarkers(): void {
    this.markers.forEach(marker => marker.setMap(null))
    this.markers = []
  }

  private fitBounds(locations: MapLocation[]): void {
    if (!this.map || locations.length === 0) return

    const bounds = new google.maps.LatLngBounds()
    locations.forEach(location => {
      bounds.extend(new google.maps.LatLng(location.lat, location.lng))
    })

    this.map.fitBounds(bounds)
    
    // Garantir zoom mínimo
    google.maps.event.addListenerOnce(this.map, 'bounds_changed', () => {
      if (this.map!.getZoom()! > 15) {
        this.map!.setZoom(15)
      }
    })
  }

  private matchesFilters(workshop: Workshop, filters?: Partial<MapFilters>): boolean {
    if (!filters) return true

    // Filtro de serviços
    if (filters.services && filters.services.length > 0) {
      const hasService = filters.services.some(service => 
        workshop.services.some(ws => ws.toLowerCase().includes(service.toLowerCase()))
      )
      if (!hasService) return false
    }

    // Filtro de preço
    if (filters.priceRange && filters.priceRange !== 'all') {
      if (workshop.priceRange !== filters.priceRange) return false
    }

    // Filtro de avaliação
    if (filters.rating && workshop.rating < filters.rating) return false

    // Filtro de distância
    if (filters.distance && workshop.distance && workshop.distance > filters.distance) return false

    // Filtro de aberto agora
    if (filters.openNow && !workshop.isOpen) return false

    return true
  }

  private isPlaceOpen(place: google.maps.places.PlaceResult): boolean {
    return place.opening_hours?.isOpen() || true // Default para aberto se não tiver info
  }

  private extractServices(place: google.maps.places.PlaceResult): string[] {
    const services = ['Manutenção Geral']
    
    const name = place.name?.toLowerCase() || ''
    const types = place.types || []

    if (name.includes('pneu') || types.includes('tire_service')) {
      services.push('Pneus')
    }
    if (name.includes('óleo') || name.includes('lubrificante')) {
      services.push('Troca de Óleo')
    }
    if (name.includes('freio') || name.includes('brake')) {
      services.push('Freios')
    }
    if (name.includes('suspensão') || name.includes('amortecedor')) {
      services.push('Suspensão')
    }
    if (name.includes('ar condicionado') || name.includes('climatização')) {
      services.push('Ar Condicionado')
    }

    return services
  }

  private extractPriceRange(place: google.maps.places.PlaceResult): 'low' | 'medium' | 'high' {
    const priceLevel = place.price_level
    if (priceLevel === undefined || priceLevel <= 1) return 'low'
    if (priceLevel >= 3) return 'high'
    return 'medium'
  }

  private getMapStyles(): google.maps.MapTypeStyle[] {
    return [
      {
        featureType: 'poi.business',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'poi.medical',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'transit',
        elementType: 'labels.icon',
        stylers: [{ visibility: 'off' }]
      }
    ]
  }

  // Getters
  getMap(): google.maps.Map | null {
    return this.map
  }

  getCurrentRoute(): google.maps.DirectionsRoute | null {
    return this.currentRoute
  }

  isMapLoaded(): boolean {
    return this.isLoaded && this.map !== null
  }
}

// Instância singleton
export const googleMapsManager = new GoogleMapsManager()

// Hook React para usar Google Maps
export function useGoogleMaps() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<MapLocation | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  const initialize = useCallback(async () => {
    try {
      const loaded = await googleMapsManager.initialize()
      setIsLoaded(loaded)
      if (!loaded) {
        setError('Falha ao carregar Google Maps')
      }
    } catch (err) {
      setError('Erro ao inicializar Google Maps')
      console.error(err)
    }
  }, [])

  const createMap = useCallback(async (center?: MapLocation, zoom?: number) => {
    if (!mapRef.current || !isLoaded) return null

    const mapCenter = center || userLocation || {
      lat: -23.5505, 
      lng: -46.6333 // São Paulo
    }

    return await googleMapsManager.createMap(mapRef.current, mapCenter, zoom)
  }, [isLoaded, userLocation])

  const getCurrentLocation = useCallback(async () => {
    const location = await googleMapsManager.getCurrentLocation()
    setUserLocation(location)
    return location
  }, [])

  useEffect(() => {
    initialize()
  }, [initialize])

  return {
    isLoaded,
    error,
    userLocation,
    mapRef,
    createMap,
    getCurrentLocation,
    searchWorkshops: googleMapsManager.searchWorkshops.bind(googleMapsManager),
    calculateRoute: googleMapsManager.calculateRoute.bind(googleMapsManager),
    addWorkshopMarkers: googleMapsManager.addWorkshopMarkers.bind(googleMapsManager),
    addUserLocationMarker: googleMapsManager.addUserLocationMarker.bind(googleMapsManager),
    clearRoute: googleMapsManager.clearRoute.bind(googleMapsManager),
    calculateDistance: googleMapsManager.calculateDistance.bind(googleMapsManager),
    geocodeAddress: googleMapsManager.geocodeAddress.bind(googleMapsManager)
  }
}

export default googleMapsManager