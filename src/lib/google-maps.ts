'use client'

import { Loader } from '@googlemaps/js-api-loader'

// Configuração do Google Maps
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

export interface MapLocation {
  lat: number
  lng: number
  address?: string
  name?: string
}

export interface Oficina {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  rating?: number
  distance?: number
  phone?: string
  services?: string[]
  price_range?: 'low' | 'medium' | 'high'
}

export interface RouteInfo {
  distance: string
  duration: string
  steps: google.maps.DirectionsStep[]
}

class GoogleMapsService {
  private loader: Loader
  private map: google.maps.Map | null = null
  private geocoder: google.maps.Geocoder | null = null
  private directionsService: google.maps.DirectionsService | null = null
  private directionsRenderer: google.maps.DirectionsRenderer | null = null
  private placesService: google.maps.places.PlacesService | null = null

  constructor() {
    this.loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places', 'geometry']
    })
  }

  // Inicializar Google Maps
  async initialize() {
    try {
      await this.loader.load()
      this.geocoder = new google.maps.Geocoder()
      this.directionsService = new google.maps.DirectionsService()
      this.directionsRenderer = new google.maps.DirectionsRenderer()
      return true
    } catch (error) {
      console.error('Erro ao inicializar Google Maps:', error)
      return false
    }
  }

  // Criar mapa
  async createMap(element: HTMLElement, center: MapLocation, zoom: number = 13) {
    await this.initialize()
    
    this.map = new google.maps.Map(element, {
      center: { lat: center.lat, lng: center.lng },
      zoom,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    })

    if (this.map) {
      this.placesService = new google.maps.places.PlacesService(this.map)
    }

    return this.map
  }

  // Obter localização atual do usuário
  async getCurrentLocation(): Promise<MapLocation> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalização não suportada'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutos
        }
      )
    })
  }

  // Geocodificar endereço
  async geocodeAddress(address: string): Promise<MapLocation> {
    if (!this.geocoder) {
      await this.initialize()
    }

    return new Promise((resolve, reject) => {
      this.geocoder!.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location
          resolve({
            lat: location.lat(),
            lng: location.lng(),
            address: results[0].formatted_address
          })
        } else {
          reject(new Error(`Erro na geocodificação: ${status}`))
        }
      })
    })
  }

  // Buscar oficinas próximas
  async findNearbyOficinas(
    center: MapLocation, 
    radius: number = 5000, // 5km
    keyword: string = 'oficina mecânica'
  ): Promise<Oficina[]> {
    if (!this.placesService) {
      await this.initialize()
    }

    return new Promise((resolve, reject) => {
      const request: google.maps.places.PlaceSearchRequest = {
        location: new google.maps.LatLng(center.lat, center.lng),
        radius,
        keyword,
        type: 'car_repair'
      }

      this.placesService!.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const oficinas: Oficina[] = results.map((place, index) => ({
            id: place.place_id || `oficina_${index}`,
            name: place.name || 'Oficina',
            address: place.vicinity || 'Endereço não disponível',
            lat: place.geometry?.location?.lat() || 0,
            lng: place.geometry?.location?.lng() || 0,
            rating: place.rating,
            phone: place.formatted_phone_number,
            price_range: this.getPriceRange(place.price_level)
          }))

          // Calcular distâncias
          const oficinasWithDistance = oficinas.map(oficina => ({
            ...oficina,
            distance: this.calculateDistance(center, {
              lat: oficina.lat,
              lng: oficina.lng
            })
          }))

          // Ordenar por distância
          oficinasWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0))

          resolve(oficinasWithDistance)
        } else {
          reject(new Error(`Erro na busca: ${status}`))
        }
      })
    })
  }

  // Calcular rota entre dois pontos
  async calculateRoute(
    origin: MapLocation,
    destination: MapLocation,
    travelMode: google.maps.TravelMode = google.maps.TravelMode.DRIVING
  ): Promise<RouteInfo> {
    if (!this.directionsService) {
      await this.initialize()
    }

    return new Promise((resolve, reject) => {
      const request: google.maps.DirectionsRequest = {
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination: new google.maps.LatLng(destination.lat, destination.lng),
        travelMode,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
      }

      this.directionsService!.route(request, (result, status) => {
        if (status === 'OK' && result) {
          const route = result.routes[0]
          const leg = route.legs[0]

          resolve({
            distance: leg.distance?.text || '',
            duration: leg.duration?.text || '',
            steps: leg.steps || []
          })
        } else {
          reject(new Error(`Erro no cálculo da rota: ${status}`))
        }
      })
    })
  }

  // Mostrar rota no mapa
  async showRoute(
    origin: MapLocation,
    destination: MapLocation,
    map?: google.maps.Map
  ) {
    const targetMap = map || this.map
    if (!targetMap || !this.directionsService || !this.directionsRenderer) {
      await this.initialize()
    }

    const request: google.maps.DirectionsRequest = {
      origin: new google.maps.LatLng(origin.lat, origin.lng),
      destination: new google.maps.LatLng(destination.lat, destination.lng),
      travelMode: google.maps.TravelMode.DRIVING
    }

    this.directionsService!.route(request, (result, status) => {
      if (status === 'OK' && result) {
        this.directionsRenderer!.setDirections(result)
        this.directionsRenderer!.setMap(targetMap!)
      }
    })
  }

  // Adicionar marcadores no mapa
  addMarkers(oficinas: Oficina[], map?: google.maps.Map) {
    const targetMap = map || this.map
    if (!targetMap) return []

    return oficinas.map(oficina => {
      const marker = new google.maps.Marker({
        position: { lat: oficina.lat, lng: oficina.lng },
        map: targetMap,
        title: oficina.name,
        icon: {
          url: '/images/markers/oficina-marker.png',
          scaledSize: new google.maps.Size(40, 40)
        }
      })

      // Info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-3">
            <h3 class="font-bold text-lg">${oficina.name}</h3>
            <p class="text-gray-600 text-sm">${oficina.address}</p>
            ${oficina.rating ? `<p class="text-yellow-500">⭐ ${oficina.rating}</p>` : ''}
            ${oficina.distance ? `<p class="text-blue-600">${oficina.distance.toFixed(1)} km</p>` : ''}
          </div>
        `
      })

      marker.addListener('click', () => {
        infoWindow.open(targetMap, marker)
      })

      return marker
    })
  }

  // Calcular distância entre dois pontos (em km)
  private calculateDistance(point1: MapLocation, point2: MapLocation): number {
    const R = 6371 // Raio da Terra em km
    const dLat = this.deg2rad(point2.lat - point1.lat)
    const dLng = this.deg2rad(point2.lng - point1.lng)
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(point1.lat)) * Math.cos(this.deg2rad(point2.lat)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180)
  }

  private getPriceRange(priceLevel?: number): 'low' | 'medium' | 'high' {
    if (!priceLevel) return 'medium'
    if (priceLevel <= 1) return 'low'
    if (priceLevel <= 3) return 'medium'
    return 'high'
  }

  // Limpar mapa
  clearMap() {
    if (this.directionsRenderer) {
      this.directionsRenderer.setMap(null)
    }
  }
}

// Instância singleton
export const googleMapsService = new GoogleMapsService()

// Hook para usar Google Maps
export const useGoogleMaps = () => {
  return googleMapsService
}