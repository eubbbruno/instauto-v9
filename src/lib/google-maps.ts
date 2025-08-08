'use client'

// Types
export interface LatLng {
  lat: number
  lng: number
}

export interface MapBounds {
  north: number
  south: number
  east: number
  west: number
}

export interface OficinaLocation {
  id: string
  name: string
  address: string
  position: LatLng
  rating: number
  reviews: number
  phone?: string
  website?: string
  hours?: string
  services: string[]
  priceRange: 'budget' | 'moderate' | 'expensive'
  distance?: number
  estimatedTime?: string
  plano: 'free' | 'pro' | 'premium'
  verified: boolean
  photos?: string[]
}

export interface DirectionsResult {
  routes: google.maps.DirectionsRoute[]
  distance: string
  duration: string
  steps: google.maps.DirectionsStep[]
}

export interface PlaceResult {
  place_id: string
  name: string
  formatted_address: string
  geometry: {
    location: LatLng
  }
  rating?: number
  user_ratings_total?: number
  types: string[]
  business_status?: string
  photos?: google.maps.places.PlacePhoto[]
}

class GoogleMapsManager {
  private map: google.maps.Map | null = null
  private directionsService: google.maps.DirectionsService | null = null
  private directionsRenderer: google.maps.DirectionsRenderer | null = null
  private placesService: google.maps.places.PlacesService | null = null
  private autocompleteService: google.maps.places.AutocompleteService | null = null
  private geocoder: google.maps.Geocoder | null = null
  private markers: google.maps.Marker[] = []
  private userLocationMarker: google.maps.Marker | null = null
  private infoWindow: google.maps.InfoWindow | null = null
  private isLoaded = false

  // API Key - em produção usar variável de ambiente
  private apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'your-google-maps-api-key'

  constructor() {
    this.loadGoogleMapsAPI()
  }

  private async loadGoogleMapsAPI(): Promise<void> {
    if (typeof window === 'undefined') return

    // Check if already loaded
    if (window.google?.maps) {
      this.isLoaded = true
      this.initializeServices()
      return
    }

    try {
      // Load Google Maps API
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places,geometry&callback=initMap`
      script.async = true
      script.defer = true

      // Set up callback
      ;(window as any).initMap = () => {
        this.isLoaded = true
        this.initializeServices()
        console.log('✅ Google Maps API loaded successfully')
      }

      document.head.appendChild(script)
    } catch (error) {
      console.error('❌ Error loading Google Maps API:', error)
    }
  }

  private initializeServices(): void {
    if (!window.google?.maps) return

    this.directionsService = new google.maps.DirectionsService()
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: '#4285F4',
        strokeWeight: 5,
        strokeOpacity: 0.8
      }
    })
    this.autocompleteService = new google.maps.places.AutocompleteService()
    this.geocoder = new google.maps.Geocoder()
    this.infoWindow = new google.maps.InfoWindow()
  }

  async initializeMap(container: HTMLElement, options?: google.maps.MapOptions): Promise<google.maps.Map | null> {
    if (!this.isLoaded) {
      console.warn('⚠️ Google Maps API not loaded yet')
      return null
    }

    const defaultOptions: google.maps.MapOptions = {
      zoom: 13,
      center: { lat: -23.5505, lng: -46.6333 }, // São Paulo
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: this.getMapStyles(),
      ...options
    }

    this.map = new google.maps.Map(container, defaultOptions)
    
    if (this.directionsRenderer) {
      this.directionsRenderer.setMap(this.map)
    }

    if (this.map) {
      this.placesService = new google.maps.places.PlacesService(this.map)
    }

    console.log('🗺️ Google Maps initialized')
    return this.map
  }

  async getCurrentLocation(): Promise<LatLng | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn('⚠️ Geolocation not supported')
        resolve(null)
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          console.log('📍 Current location:', location)
          resolve(location)
        },
        (error) => {
          console.error('❌ Error getting location:', error)
          resolve(null)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      )
    })
  }

  async searchNearbyOficinas(location: LatLng, radius: number = 5000): Promise<OficinaLocation[]> {
    if (!this.placesService || !this.map) {
      console.warn('⚠️ Places service not initialized')
      return []
    }

    return new Promise((resolve) => {
      const request: google.maps.places.PlaceSearchRequest = {
        location: new google.maps.LatLng(location.lat, location.lng),
        radius,
        type: 'car_repair',
        keyword: 'oficina mecanica'
      }

      this.placesService!.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const oficinas = results.map(this.convertPlaceToOficina)
          console.log(`🔍 Found ${oficinas.length} oficinas nearby`)
          resolve(oficinas)
        } else {
          console.error('❌ Places search failed:', status)
          resolve([])
        }
      })
    })
  }

  private convertPlaceToOficina(place: google.maps.places.PlaceResult): OficinaLocation {
    return {
      id: place.place_id || '',
      name: place.name || '',
      address: place.formatted_address || place.vicinity || '',
      position: {
        lat: place.geometry?.location?.lat() || 0,
        lng: place.geometry?.location?.lng() || 0
      },
      rating: place.rating || 0,
      reviews: place.user_ratings_total || 0,
      services: ['Manutenção Geral'], // Default, seria obtido de nossa base
      priceRange: 'moderate',
      plano: 'free', // Default, seria obtido de nossa base
      verified: place.business_status === 'OPERATIONAL',
      photos: place.photos?.map(photo => photo.getUrl({ maxWidth: 400 }))
    }
  }

  async getDirections(origin: LatLng, destination: LatLng): Promise<DirectionsResult | null> {
    if (!this.directionsService) {
      console.warn('⚠️ Directions service not initialized')
      return null
    }

    return new Promise((resolve) => {
      const request: google.maps.DirectionsRequest = {
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination: new google.maps.LatLng(destination.lat, destination.lng),
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
      }

      this.directionsService!.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          const route = result.routes[0]
          const leg = route.legs[0]
          
          const directionsResult: DirectionsResult = {
            routes: result.routes,
            distance: leg.distance?.text || '',
            duration: leg.duration?.text || '',
            steps: leg.steps || []
          }

          console.log('🛣️ Directions calculated:', directionsResult.distance, directionsResult.duration)
          resolve(directionsResult)
        } else {
          console.error('❌ Directions failed:', status)
          resolve(null)
        }
      })
    })
  }

  showDirections(origin: LatLng, destination: LatLng): void {
    if (!this.directionsRenderer || !this.map) return

    this.getDirections(origin, destination).then((result) => {
      if (result && result.routes.length > 0) {
        this.directionsRenderer!.setDirections({
          routes: result.routes,
          request: {
            origin: new google.maps.LatLng(origin.lat, origin.lng),
            destination: new google.maps.LatLng(destination.lat, destination.lng),
            travelMode: google.maps.TravelMode.DRIVING
          } as google.maps.DirectionsRequest
        } as google.maps.DirectionsResult)
      }
    })
  }

  addOficinaMarkers(oficinas: OficinaLocation[]): void {
    if (!this.map) return

    // Clear existing markers
    this.clearMarkers()

    oficinas.forEach((oficina) => {
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(oficina.position.lat, oficina.position.lng),
        map: this.map,
        title: oficina.name,
        icon: this.getOficinaIcon(oficina.plano),
        animation: google.maps.Animation.DROP
      })

      // Add click listener
      marker.addListener('click', () => {
        this.showOficinaInfo(oficina, marker)
      })

      this.markers.push(marker)
    })

    console.log(`📍 Added ${oficinas.length} oficina markers`)
  }

  private getOficinaIcon(plano: string): google.maps.Icon {
    const baseIcon = {
      scaledSize: new google.maps.Size(40, 40),
      anchor: new google.maps.Point(20, 40)
    }

    switch (plano) {
      case 'premium':
        return {
          ...baseIcon,
          url: 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill="#8B5CF6" stroke="#fff" stroke-width="2"/>
              <text x="20" y="26" text-anchor="middle" fill="white" font-size="16">🏆</text>
            </svg>
          `)
        }
      case 'pro':
        return {
          ...baseIcon,
          url: 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill="#F59E0B" stroke="#fff" stroke-width="2"/>
              <text x="20" y="26" text-anchor="middle" fill="white" font-size="16">👑</text>
            </svg>
          `)
        }
      default:
        return {
          ...baseIcon,
          url: 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill="#10B981" stroke="#fff" stroke-width="2"/>
              <text x="20" y="26" text-anchor="middle" fill="white" font-size="16">🔧</text>
            </svg>
          `)
        }
    }
  }

  setUserLocationMarker(location: LatLng): void {
    if (!this.map) return

    // Remove existing user marker
    if (this.userLocationMarker) {
      this.userLocationMarker.setMap(null)
    }

    // Add new user marker
    this.userLocationMarker = new google.maps.Marker({
      position: new google.maps.LatLng(location.lat, location.lng),
      map: this.map,
      title: 'Sua localização',
      icon: {
        url: 'data:image/svg+xml;base64,' + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
            <circle cx="15" cy="15" r="12" fill="#3B82F6" stroke="#fff" stroke-width="3"/>
            <circle cx="15" cy="15" r="5" fill="#fff"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(30, 30),
        anchor: new google.maps.Point(15, 15)
      },
      animation: google.maps.Animation.BOUNCE
    })

    // Center map on user location
    this.map.setCenter(new google.maps.LatLng(location.lat, location.lng))
  }

  private showOficinaInfo(oficina: OficinaLocation, marker: google.maps.Marker): void {
    if (!this.infoWindow) return

    const content = `
      <div class="p-4 max-w-sm">
        <div class="flex items-center gap-2 mb-2">
          <h3 class="font-bold text-lg">${oficina.name}</h3>
          ${oficina.plano === 'pro' ? '<span class="text-xs bg-amber-500 text-white px-2 py-1 rounded">PRO</span>' : ''}
          ${oficina.plano === 'premium' ? '<span class="text-xs bg-purple-500 text-white px-2 py-1 rounded">PREMIUM</span>' : ''}
        </div>
        <p class="text-gray-600 text-sm mb-2">${oficina.address}</p>
        ${oficina.rating > 0 ? `
          <div class="flex items-center gap-1 mb-2">
            <span class="text-yellow-500">★</span>
            <span class="text-sm">${oficina.rating} (${oficina.reviews} avaliações)</span>
          </div>
        ` : ''}
        <div class="flex gap-2 mt-3">
          <button onclick="window.openOficinaDetails('${oficina.id}')" class="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
            Ver Detalhes
          </button>
          <button onclick="window.getDirectionsToOficina('${oficina.position.lat}','${oficina.position.lng}')" class="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
            Como Chegar
          </button>
        </div>
      </div>
    `

    this.infoWindow.setContent(content)
    this.infoWindow.open(this.map, marker)
  }

  clearMarkers(): void {
    this.markers.forEach(marker => marker.setMap(null))
    this.markers = []
  }

  clearDirections(): void {
    if (this.directionsRenderer) {
      this.directionsRenderer.setDirections({
        routes: []
      } as google.maps.DirectionsResult)
    }
  }

  private getMapStyles(): google.maps.MapTypeStyle[] {
    return [
      {
        featureType: 'poi.business',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'transit.station',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  }

  // Autocomplete for address input
  async getAddressSuggestions(input: string): Promise<google.maps.places.AutocompletePrediction[]> {
    if (!this.autocompleteService || input.length < 3) {
      return []
    }

    return new Promise((resolve) => {
      this.autocompleteService!.getPlacePredictions(
        {
          input,
          componentRestrictions: { country: 'br' },
          types: ['geocode']
        },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            resolve(predictions)
          } else {
            resolve([])
          }
        }
      )
    })
  }

  async geocodeAddress(address: string): Promise<LatLng | null> {
    if (!this.geocoder) return null

    return new Promise((resolve) => {
      this.geocoder!.geocode({ address }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          const location = results[0].geometry.location
          resolve({
            lat: location.lat(),
            lng: location.lng()
          })
        } else {
          resolve(null)
        }
      })
    })
  }

  fitBounds(locations: LatLng[]): void {
    if (!this.map || locations.length === 0) return

    const bounds = new google.maps.LatLngBounds()
    locations.forEach(location => {
      bounds.extend(new google.maps.LatLng(location.lat, location.lng))
    })

    this.map.fitBounds(bounds)
  }

  // Utils
  calculateDistance(point1: LatLng, point2: LatLng): number {
    if (!window.google?.maps?.geometry) return 0

    const lat1 = new google.maps.LatLng(point1.lat, point1.lng)
    const lat2 = new google.maps.LatLng(point2.lat, point2.lng)
    
    return google.maps.geometry.spherical.computeDistanceBetween(lat1, lat2)
  }

  get isApiLoaded(): boolean {
    return this.isLoaded
  }

  get mapInstance(): google.maps.Map | null {
    return this.map
  }
}

// Singleton instance
export const googleMapsManager = new GoogleMapsManager()

// Global functions for InfoWindow callbacks
if (typeof window !== 'undefined') {
  ;(window as any).openOficinaDetails = (oficinaId: string) => {
    window.location.href = `/oficina/${oficinaId}`
  }

  ;(window as any).getDirectionsToOficina = (lat: string, lng: string) => {
    googleMapsManager.getCurrentLocation().then(userLocation => {
      if (userLocation) {
        googleMapsManager.showDirections(userLocation, {
          lat: parseFloat(lat),
          lng: parseFloat(lng)
        })
      }
    })
  }
}

// React hook
export function useGoogleMaps() {
  return {
    initializeMap: googleMapsManager.initializeMap.bind(googleMapsManager),
    getCurrentLocation: googleMapsManager.getCurrentLocation.bind(googleMapsManager),
    searchNearbyOficinas: googleMapsManager.searchNearbyOficinas.bind(googleMapsManager),
    getDirections: googleMapsManager.getDirections.bind(googleMapsManager),
    showDirections: googleMapsManager.showDirections.bind(googleMapsManager),
    addOficinaMarkers: googleMapsManager.addOficinaMarkers.bind(googleMapsManager),
    setUserLocationMarker: googleMapsManager.setUserLocationMarker.bind(googleMapsManager),
    clearMarkers: googleMapsManager.clearMarkers.bind(googleMapsManager),
    clearDirections: googleMapsManager.clearDirections.bind(googleMapsManager),
    getAddressSuggestions: googleMapsManager.getAddressSuggestions.bind(googleMapsManager),
    geocodeAddress: googleMapsManager.geocodeAddress.bind(googleMapsManager),
    fitBounds: googleMapsManager.fitBounds.bind(googleMapsManager),
    calculateDistance: googleMapsManager.calculateDistance.bind(googleMapsManager),
    isApiLoaded: googleMapsManager.isApiLoaded,
    mapInstance: googleMapsManager.mapInstance
  }
}
