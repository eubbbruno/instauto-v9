'use client'

import { LatLng } from './google-maps'

export interface SearchFilters {
  radius: number // in kilometers
  services: string[]
  priceRange: 'budget' | 'moderate' | 'expensive' | 'all'
  rating: number // minimum rating
  openNow: boolean
  plano: 'free' | 'pro' | 'premium' | 'all'
  hasParking: boolean
  hasWifi: boolean
  acceptsCards: boolean
  emergencyService: boolean
  sortBy: 'distance' | 'rating' | 'price' | 'availability'
}

export interface SearchResult {
  id: string
  name: string
  address: string
  position: LatLng
  distance: number
  estimatedTime: string
  rating: number
  reviews: number
  priceRange: 'budget' | 'moderate' | 'expensive'
  plano: 'free' | 'pro' | 'premium'
  services: string[]
  specializations: string[]
  isOpen: boolean
  openingHours: {
    [key: string]: { open: string; close: string; closed: boolean }
  }
  contact: {
    phone?: string
    whatsapp?: string
    email?: string
    website?: string
  }
  amenities: {
    parking: boolean
    wifi: boolean
    waitingArea: boolean
    cards: boolean
    emergency: boolean
  }
  photos: string[]
  lastUpdate: string
  verified: boolean
  responseTime: string
  availability: 'available' | 'busy' | 'full' | 'closed'
}

export interface GeolocationState {
  isSupported: boolean
  isLoading: boolean
  position: LatLng | null
  error: string | null
  accuracy: number | null
  timestamp: number | null
}

class GeolocationSearchManager {
  private geolocationState: GeolocationState = {
    isSupported: typeof navigator !== 'undefined' && 'geolocation' in navigator,
    isLoading: false,
    position: null,
    error: null,
    accuracy: null,
    timestamp: null
  }

  private watchId: number | null = null
  private locationUpdateCallbacks: ((state: GeolocationState) => void)[] = []
  private lastKnownPosition: LatLng | null = null
  private searchCache = new Map<string, { results: SearchResult[]; timestamp: number }>()
  private cacheTimeout = 5 * 60 * 1000 // 5 minutes

  constructor() {
    this.loadLastKnownPosition()
  }

  // Geolocation methods
  async getCurrentPosition(options?: PositionOptions): Promise<LatLng | null> {
    if (!this.geolocationState.isSupported) {
      this.updateState({ error: 'Geolocalização não suportada neste dispositivo' })
      return null
    }

    this.updateState({ isLoading: true, error: null })

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000, // 1 minute
      ...options
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, defaultOptions)
      })

      const location: LatLng = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }

      this.updateState({
        isLoading: false,
        position: location,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
        error: null
      })

      this.lastKnownPosition = location
      this.saveLastKnownPosition(location)

      console.log('📍 Current position obtained:', location)
      return location
    } catch (error: any) {
      let errorMessage = 'Erro ao obter localização'

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Permissão de localização negada'
          break
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Localização indisponível'
          break
        case error.TIMEOUT:
          errorMessage = 'Tempo limite para obter localização'
          break
      }

      this.updateState({ 
        isLoading: false, 
        error: errorMessage 
      })

      console.error('❌ Geolocation error:', error)
      return null
    }
  }

  startWatchingPosition(options?: PositionOptions): void {
    if (!this.geolocationState.isSupported || this.watchId !== null) {
      return
    }

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 60000,
      ...options
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location: LatLng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }

        this.updateState({
          position: location,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
          error: null
        })

        this.lastKnownPosition = location
        this.saveLastKnownPosition(location)
      },
      (error) => {
        console.error('❌ Watch position error:', error)
      },
      defaultOptions
    )

    console.log('👀 Started watching position')
  }

  stopWatchingPosition(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId)
      this.watchId = null
      console.log('⏹️ Stopped watching position')
    }
  }

  // Search methods
  async searchNearby(filters: Partial<SearchFilters> = {}): Promise<SearchResult[]> {
    const position = this.geolocationState.position || this.lastKnownPosition

    if (!position) {
      console.warn('⚠️ No position available for search')
      return []
    }

    return this.searchByLocation(position, filters)
  }

  async searchByLocation(location: LatLng, filters: Partial<SearchFilters> = {}): Promise<SearchResult[]> {
    const defaultFilters: SearchFilters = {
      radius: 10, // 10km
      services: [],
      priceRange: 'all',
      rating: 0,
      openNow: false,
      plano: 'all',
      hasParking: false,
      hasWifi: false,
      acceptsCards: false,
      emergencyService: false,
      sortBy: 'distance'
    }

    const searchFilters = { ...defaultFilters, ...filters }
    const cacheKey = this.getCacheKey(location, searchFilters)

    // Check cache
    const cached = this.searchCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      console.log('📦 Using cached search results')
      return cached.results
    }

    try {
      console.log('🔍 Searching oficinas near:', location, 'with filters:', searchFilters)

      // In production, this would call your API
      const results = await this.performSearch(location, searchFilters)

      // Cache results
      this.searchCache.set(cacheKey, {
        results,
        timestamp: Date.now()
      })

      return results
    } catch (error) {
      console.error('❌ Search error:', error)
      return []
    }
  }

  private async performSearch(location: LatLng, filters: SearchFilters): Promise<SearchResult[]> {
    // Mock implementation - in production, replace with actual API call
    const mockResults: SearchResult[] = [
      {
        id: '1',
        name: 'AutoCenter Premium',
        address: 'Rua das Oficinas, 123 - Vila Madalena',
        position: { lat: location.lat + 0.01, lng: location.lng + 0.01 },
        distance: 1.2,
        estimatedTime: '5 min',
        rating: 4.8,
        reviews: 156,
        priceRange: 'moderate',
        plano: 'pro',
        services: ['Freios', 'Suspensão', 'Motor'],
        specializations: ['BMW', 'Mercedes', 'Audi'],
        isOpen: true,
        openingHours: {
          monday: { open: '08:00', close: '18:00', closed: false },
          tuesday: { open: '08:00', close: '18:00', closed: false },
          wednesday: { open: '08:00', close: '18:00', closed: false },
          thursday: { open: '08:00', close: '18:00', closed: false },
          friday: { open: '08:00', close: '18:00', closed: false },
          saturday: { open: '08:00', close: '16:00', closed: false },
          sunday: { open: '09:00', close: '15:00', closed: false }
        },
        contact: {
          phone: '(11) 3333-4444',
          whatsapp: '11999994444',
          email: 'contato@autocenterpremium.com'
        },
        amenities: {
          parking: true,
          wifi: true,
          waitingArea: true,
          cards: true,
          emergency: true
        },
        photos: ['/images/oficina-1.jpg', '/images/oficina-2.jpg'],
        lastUpdate: new Date().toISOString(),
        verified: true,
        responseTime: '< 1h',
        availability: 'available'
      },
      {
        id: '2',
        name: 'Oficina do João',
        address: 'Av. Paulista, 456 - Bela Vista',
        position: { lat: location.lat - 0.005, lng: location.lng + 0.015 },
        distance: 2.1,
        estimatedTime: '8 min',
        rating: 4.2,
        reviews: 89,
        priceRange: 'budget',
        plano: 'free',
        services: ['Troca de óleo', 'Pneus', 'Bateria'],
        specializations: ['Volkswagen', 'Fiat', 'Chevrolet'],
        isOpen: true,
        openingHours: {
          monday: { open: '07:00', close: '17:00', closed: false },
          tuesday: { open: '07:00', close: '17:00', closed: false },
          wednesday: { open: '07:00', close: '17:00', closed: false },
          thursday: { open: '07:00', close: '17:00', closed: false },
          friday: { open: '07:00', close: '17:00', closed: false },
          saturday: { open: '07:00', close: '12:00', closed: false },
          sunday: { open: '00:00', close: '00:00', closed: true }
        },
        contact: {
          phone: '(11) 2222-3333',
          whatsapp: '11888883333'
        },
        amenities: {
          parking: false,
          wifi: false,
          waitingArea: false,
          cards: false,
          emergency: false
        },
        photos: ['/images/oficina-3.jpg'],
        lastUpdate: new Date().toISOString(),
        verified: false,
        responseTime: '2-4h',
        availability: 'busy'
      },
      {
        id: '3',
        name: 'MegaAuto Service',
        address: 'Rua dos Mecânicos, 789 - Liberdade',
        position: { lat: location.lat + 0.02, lng: location.lng - 0.01 },
        distance: 3.5,
        estimatedTime: '12 min',
        rating: 4.9,
        reviews: 234,
        priceRange: 'expensive',
        plano: 'premium',
        services: ['Todas as especialidades', 'Diagnóstico IA', 'Pintura'],
        specializations: ['Todos os veículos', 'Carros importados', 'Elétricos'],
        isOpen: true,
        openingHours: {
          monday: { open: '06:00', close: '22:00', closed: false },
          tuesday: { open: '06:00', close: '22:00', closed: false },
          wednesday: { open: '06:00', close: '22:00', closed: false },
          thursday: { open: '06:00', close: '22:00', closed: false },
          friday: { open: '06:00', close: '22:00', closed: false },
          saturday: { open: '06:00', close: '20:00', closed: false },
          sunday: { open: '08:00', close: '18:00', closed: false }
        },
        contact: {
          phone: '(11) 4444-5555',
          whatsapp: '11777774444',
          email: 'contato@megaauto.com',
          website: 'www.megaauto.com'
        },
        amenities: {
          parking: true,
          wifi: true,
          waitingArea: true,
          cards: true,
          emergency: true
        },
        photos: ['/images/oficina-4.jpg', '/images/oficina-5.jpg', '/images/oficina-6.jpg'],
        lastUpdate: new Date().toISOString(),
        verified: true,
        responseTime: '< 30min',
        availability: 'available'
      }
    ]

    // Apply filters
    let filteredResults = mockResults.filter(result => {
      // Distance filter
      if (result.distance > filters.radius) return false

      // Rating filter
      if (result.rating < filters.rating) return false

      // Open now filter
      if (filters.openNow && !result.isOpen) return false

      // Price range filter
      if (filters.priceRange !== 'all' && result.priceRange !== filters.priceRange) return false

      // Plano filter
      if (filters.plano !== 'all' && result.plano !== filters.plano) return false

      // Services filter
      if (filters.services.length > 0) {
        const hasRequiredService = filters.services.some(service =>
          result.services.some(resultService =>
            resultService.toLowerCase().includes(service.toLowerCase())
          )
        )
        if (!hasRequiredService) return false
      }

      // Amenities filters
      if (filters.hasParking && !result.amenities.parking) return false
      if (filters.hasWifi && !result.amenities.wifi) return false
      if (filters.acceptsCards && !result.amenities.cards) return false
      if (filters.emergencyService && !result.amenities.emergency) return false

      return true
    })

    // Sort results
    filteredResults = this.sortResults(filteredResults, filters.sortBy)

    return filteredResults
  }

  private sortResults(results: SearchResult[], sortBy: SearchFilters['sortBy']): SearchResult[] {
    return results.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return a.distance - b.distance
        case 'rating':
          return b.rating - a.rating
        case 'price':
          const priceOrder = { budget: 1, moderate: 2, expensive: 3 }
          return priceOrder[a.priceRange] - priceOrder[b.priceRange]
        case 'availability':
          const availabilityOrder = { available: 1, busy: 2, full: 3, closed: 4 }
          return availabilityOrder[a.availability] - availabilityOrder[b.availability]
        default:
          return 0
      }
    })
  }

  // Utility methods
  private updateState(updates: Partial<GeolocationState>): void {
    this.geolocationState = { ...this.geolocationState, ...updates }
    this.locationUpdateCallbacks.forEach(callback => {
      try {
        callback(this.geolocationState)
      } catch (error) {
        console.error('❌ Error in location update callback:', error)
      }
    })
  }

  private getCacheKey(location: LatLng, filters: SearchFilters): string {
    const roundedLat = Math.round(location.lat * 1000) / 1000
    const roundedLng = Math.round(location.lng * 1000) / 1000
    return `${roundedLat},${roundedLng}_${JSON.stringify(filters)}`
  }

  private saveLastKnownPosition(position: LatLng): void {
    try {
      localStorage.setItem('instauto_last_position', JSON.stringify({
        position,
        timestamp: Date.now()
      }))
    } catch (error) {
      console.warn('⚠️ Could not save position to localStorage:', error)
    }
  }

  private loadLastKnownPosition(): void {
    try {
      const saved = localStorage.getItem('instauto_last_position')
      if (saved) {
        const { position, timestamp } = JSON.parse(saved)
        // Only use if less than 1 hour old
        if (Date.now() - timestamp < 60 * 60 * 1000) {
          this.lastKnownPosition = position
          this.updateState({ position })
        }
      }
    } catch (error) {
      console.warn('⚠️ Could not load position from localStorage:', error)
    }
  }

  clearCache(): void {
    this.searchCache.clear()
    console.log('🗑️ Search cache cleared')
  }

  // Event subscriptions
  onLocationUpdate(callback: (state: GeolocationState) => void): () => void {
    this.locationUpdateCallbacks.push(callback)
    return () => {
      this.locationUpdateCallbacks = this.locationUpdateCallbacks.filter(cb => cb !== callback)
    }
  }

  // Getters
  get state(): GeolocationState {
    return { ...this.geolocationState }
  }

  get hasPosition(): boolean {
    return this.geolocationState.position !== null || this.lastKnownPosition !== null
  }

  get currentPosition(): LatLng | null {
    return this.geolocationState.position || this.lastKnownPosition
  }

  // Static utilities
  static calculateDistance(point1: LatLng, point2: LatLng): number {
    const R = 6371 // Earth's radius in kilometers
    const dLat = this.toRadians(point2.lat - point1.lat)
    const dLng = this.toRadians(point2.lng - point1.lng)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(point1.lat)) *
      Math.cos(this.toRadians(point2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  static formatDistance(distance: number): string {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`
    }
    return `${distance.toFixed(1)}km`
  }

  static estimateTime(distance: number, avgSpeed: number = 30): string {
    const timeInHours = distance / avgSpeed
    const minutes = Math.round(timeInHours * 60)
    
    if (minutes < 60) {
      return `${minutes} min`
    }
    
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    
    if (remainingMinutes === 0) {
      return `${hours}h`
    }
    
    return `${hours}h ${remainingMinutes}min`
  }
}

// Singleton instance
export const geolocationSearchManager = new GeolocationSearchManager()

// React hook
export function useGeolocationSearch() {
  return {
    getCurrentPosition: geolocationSearchManager.getCurrentPosition.bind(geolocationSearchManager),
    startWatchingPosition: geolocationSearchManager.startWatchingPosition.bind(geolocationSearchManager),
    stopWatchingPosition: geolocationSearchManager.stopWatchingPosition.bind(geolocationSearchManager),
    searchNearby: geolocationSearchManager.searchNearby.bind(geolocationSearchManager),
    searchByLocation: geolocationSearchManager.searchByLocation.bind(geolocationSearchManager),
    clearCache: geolocationSearchManager.clearCache.bind(geolocationSearchManager),
    onLocationUpdate: geolocationSearchManager.onLocationUpdate.bind(geolocationSearchManager),
    state: geolocationSearchManager.state,
    hasPosition: geolocationSearchManager.hasPosition,
    currentPosition: geolocationSearchManager.currentPosition
  }
}
