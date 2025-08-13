'use client'
import { lazy, Suspense, memo, useMemo, useState, useEffect } from 'react'
import { DashboardSkeleton, CardSkeleton } from './SkeletonLoader'

// Lazy loading de componentes pesados
export const LazyDashboardChart = lazy(() => import('@/components/dashboard/DashboardChart'))
export const LazyAnalyticsDashboard = lazy(() => import('@/components/ai/AnalyticsDashboard'))
export const LazyAdvancedGoogleMap = lazy(() => import('@/components/maps/AdvancedGoogleMap'))
export const LazyQuickDiagnosticAI = lazy(() => import('@/components/ai/QuickDiagnosticAI'))
export const LazyChatManager = lazy(() => import('@/components/chat/ChatManager'))

// Wrapper para componentes lazy com skeleton
interface LazyWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  type?: 'dashboard' | 'card' | 'chart' | 'map'
}

export const LazyWrapper = ({ 
  children, 
  fallback, 
  type = 'card' 
}: LazyWrapperProps) => {
  const defaultFallbacks = {
    dashboard: <DashboardSkeleton />,
    card: <CardSkeleton count={1} />,
    chart: <div className="h-80 bg-gray-200 animate-pulse rounded-xl" />,
    map: <div className="h-96 bg-gray-200 animate-pulse rounded-xl" />
  }

  return (
    <Suspense fallback={fallback || defaultFallbacks[type]}>
      {children}
    </Suspense>
  )
}

// Hook para lazy loading baseado em intersecção
export const useIntersectionObserver = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false)
  const [element, setElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [element, threshold])

  return [setElement, isVisible] as const
}

// Componente para lazy loading visual
interface LazyLoadProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  threshold?: number
  className?: string
}

export const LazyLoad = ({ 
  children, 
  fallback, 
  threshold = 0.1,
  className = '' 
}: LazyLoadProps) => {
  const [setRef, isVisible] = useIntersectionObserver(threshold)

  return (
    <div ref={setRef} className={className}>
      {isVisible ? children : (fallback || <CardSkeleton count={1} />)}
    </div>
  )
}

// Componente de imagem com lazy loading
interface LazyImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  placeholder?: string
}

export const LazyImage = memo(({ 
  src, 
  alt, 
  width, 
  height, 
  className = '',
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23f3f4f6"/%3E%3C/svg%3E'
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !error && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ width, height }}
        />
      )}
      
      <img
        src={error ? placeholder : src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        className={`
          transition-opacity duration-300
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
          ${className}
        `}
      />
    </div>
  )
})

LazyImage.displayName = 'LazyImage'

// Cache em memória para dados
class MemoryCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

  set(key: string, data: any, ttl = 300000) { // 5 minutos default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get(key: string) {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  clear() {
    this.cache.clear()
  }

  delete(key: string) {
    this.cache.delete(key)
  }
}

export const memoryCache = new MemoryCache()

// Hook para cache de dados
export const useCachedData = <T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl = 300000
) => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Verificar cache primeiro
        const cached = memoryCache.get(key)
        if (cached) {
          setData(cached)
          setLoading(false)
          return
        }

        // Buscar dados
        setLoading(true)
        const result = await fetcher()
        
        // Salvar no cache
        memoryCache.set(key, result, ttl)
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [key, ttl])

  const refetch = async () => {
    memoryCache.delete(key)
    setLoading(true)
    setError(null)
    
    try {
      const result = await fetcher()
      memoryCache.set(key, result, ttl)
      setData(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, refetch }
}

// Debounce hook para otimizar buscas
export const useDebounce = <T>(value: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

// Virtual scrolling para listas grandes
interface VirtualListProps {
  items: any[]
  itemHeight: number
  containerHeight: number
  renderItem: (item: any, index: number) => React.ReactNode
  className?: string
}

export const VirtualList = ({ 
  items, 
  itemHeight, 
  containerHeight, 
  renderItem,
  className = ''
}: VirtualListProps) => {
  const [scrollTop, setScrollTop] = useState(0)
  
  const visibleCount = Math.ceil(containerHeight / itemHeight)
  const startIndex = Math.floor(scrollTop / itemHeight)
  const endIndex = Math.min(startIndex + visibleCount + 1, items.length)
  
  const visibleItems = items.slice(startIndex, endIndex)
  
  return (
    <div 
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${startIndex * itemHeight}px)` }}>
          {visibleItems.map((item, index) => 
            renderItem(item, startIndex + index)
          )}
        </div>
      </div>
    </div>
  )
}

// Componente para preload de rotas críticas
export const RoutePreloader = () => {
  useEffect(() => {
    const criticalRoutes = [
      '/motorista',
      '/motorista/garagem',
      '/motorista/agendamentos',
      '/oficina-free',
      '/oficina-pro',
      '/oficina-free/clientes',
      '/oficina-pro/clientes'
    ]

    // Preload apenas se a conexão for boa
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      if (connection?.effectiveType === '4g' || connection?.downlink > 10) {
        criticalRoutes.forEach(route => {
          const link = document.createElement('link')
          link.rel = 'preload'
          link.href = route
          link.as = 'document'
          document.head.appendChild(link)
        })
      }
    }
  }, [])

  return null
}

export default {
  LazyWrapper,
  LazyLoad,
  LazyImage,
  useIntersectionObserver,
  useCachedData,
  useDebounce,
  VirtualList,
  RoutePreloader,
  memoryCache
}
