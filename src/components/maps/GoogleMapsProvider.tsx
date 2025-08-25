'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

interface GoogleMapsContextType {
  isLoaded: boolean
  loadError: string | null
  google: typeof window.google | null
  maps: typeof window.google.maps | null
}

const GoogleMapsContext = createContext<GoogleMapsContextType | null>(null)

export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext)
  if (!context) {
    throw new Error('useGoogleMaps must be used within GoogleMapsProvider')
  }
  return context
}

interface GoogleMapsProviderProps {
  children: ReactNode
  apiKey: string
}

export default function GoogleMapsProvider({ children, apiKey }: GoogleMapsProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [google, setGoogle] = useState<typeof window.google | null>(null)

  useEffect(() => {
    if (!apiKey) {
      setLoadError('Google Maps API key is required')
      return
    }

    const loader = new Loader({
      apiKey: apiKey,
      version: 'weekly',
      libraries: ['places', 'geometry', 'geocoding'],
      language: 'pt-BR',
      region: 'BR'
    })

    loader
      .load()
      .then((google) => {
        setGoogle(google)
        setIsLoaded(true)
        console.log('✅ Google Maps API loaded successfully')
      })
      .catch((error) => {
        console.error('❌ Error loading Google Maps API:', error)
        setLoadError(error.message || 'Failed to load Google Maps API')
      })
  }, [apiKey])

  const value: GoogleMapsContextType = {
    isLoaded,
    loadError,
    google,
    maps: google?.maps || null
  }

  return (
    <GoogleMapsContext.Provider value={value}>
      {children}
    </GoogleMapsContext.Provider>
  )
}
