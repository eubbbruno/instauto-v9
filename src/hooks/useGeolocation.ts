import { useState, useEffect, useCallback } from 'react'

interface GeolocationState {
  location: {
    lat: number
    lng: number
  } | null
  isLoading: boolean
  error: string | null
  accuracy: number | null
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
  watch?: boolean
}

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 300000, // 5 minutes
    watch = false
  } = options

  const [state, setState] = useState<GeolocationState>({
    location: null,
    isLoading: false,
    error: null,
    accuracy: null
  })

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocalização não é suportada neste navegador',
        isLoading: false
      }))
      return
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    const positionOptions: PositionOptions = {
      enableHighAccuracy,
      timeout,
      maximumAge
    }

    const onSuccess = (position: GeolocationPosition) => {
      setState({
        location: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        },
        isLoading: false,
        error: null,
        accuracy: position.coords.accuracy
      })
    }

    const onError = (error: GeolocationPositionError) => {
      let errorMessage = 'Erro ao obter localização'

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Permissão negada para acessar localização'
          break
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Informação de localização indisponível'
          break
        case error.TIMEOUT:
          errorMessage = 'Tempo esgotado para obter localização'
          break
      }

      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }))
    }

    if (watch) {
      const watchId = navigator.geolocation.watchPosition(
        onSuccess,
        onError,
        positionOptions
      )

      return () => navigator.geolocation.clearWatch(watchId)
    } else {
      navigator.geolocation.getCurrentPosition(
        onSuccess,
        onError,
        positionOptions
      )
    }
  }, [enableHighAccuracy, timeout, maximumAge, watch])

  // Solicitar localização automaticamente
  useEffect(() => {
    getCurrentLocation()
  }, [getCurrentLocation])

  // Calcular distância entre dois pontos
  const calculateDistance = useCallback((
    lat1: number, 
    lng1: number, 
    lat2: number, 
    lng2: number
  ): number => {
    const R = 6371 // Radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1)
    const dLng = deg2rad(lng2 - lng1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c // Distance in kilometers
    return distance
  }, [])

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180)
  }

  // Buscar oficinas próximas com base na localização atual
  const findNearbyWorkshops = useCallback((
    workshops: Array<{ lat: number; lng: number; [key: string]: any }>,
    maxDistance: number = 50 // km
  ) => {
    if (!state.location) return workshops

    return workshops
      .map(workshop => ({
        ...workshop,
        distance: calculateDistance(
          state.location!.lat,
          state.location!.lng,
          workshop.lat,
          workshop.lng
        )
      }))
      .filter(workshop => workshop.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance)
  }, [state.location, calculateDistance])

  // Formatar distância para exibição
  const formatDistance = useCallback((distance: number): string => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`
    } else {
      return `${distance.toFixed(1)}km`
    }
  }, [])

  // Verificar se uma localização está dentro de um raio
  const isWithinRadius = useCallback((
    targetLat: number,
    targetLng: number,
    radius: number // em km
  ): boolean => {
    if (!state.location) return false

    const distance = calculateDistance(
      state.location.lat,
      state.location.lng,
      targetLat,
      targetLng
    )

    return distance <= radius
  }, [state.location, calculateDistance])

  // Solicitar permissão de localização
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!navigator.permissions) {
      // Tentar obter localização diretamente se Permissions API não estiver disponível
      getCurrentLocation()
      return true
    }

    try {
      const result = await navigator.permissions.query({ name: 'geolocation' })
      
      if (result.state === 'granted') {
        getCurrentLocation()
        return true
      } else if (result.state === 'prompt') {
        getCurrentLocation()
        return true
      } else {
        setState(prev => ({
          ...prev,
          error: 'Permissão de localização negada'
        }))
        return false
      }
    } catch (error) {
      console.error('Erro ao verificar permissão de localização:', error)
      getCurrentLocation()
      return true
    }
  }, [getCurrentLocation])

  return {
    // Estado
    ...state,
    
    // Funções
    getCurrentLocation,
    calculateDistance,
    findNearbyWorkshops,
    formatDistance,
    isWithinRadius,
    requestPermission,
    
    // Utilitários
    hasLocation: !!state.location,
    isSupported: !!navigator.geolocation
  }
}
