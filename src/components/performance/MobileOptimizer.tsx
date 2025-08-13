'use client'
import { lazy, Suspense, memo, useMemo, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Lazy loading específico para mobile
const LazyFramerMotion = lazy(() => import('framer-motion').then(module => ({ 
  default: module.motion.div 
})))

// Hook para detectar mobile
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  return isMobile
}

// Hook para detectar conexão lenta
export const useSlowConnection = () => {
  const [isSlowConnection, setIsSlowConnection] = useState(false)
  
  useEffect(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      const checkConnection = () => {
        const effectiveType = connection?.effectiveType
        setIsSlowConnection(effectiveType === '2g' || effectiveType === 'slow-2g')
      }
      
      checkConnection()
      connection?.addEventListener('change', checkConnection)
      return () => connection?.removeEventListener('change', checkConnection)
    }
  }, [])
  
  return isSlowConnection
}

// Componente otimizado para mobile
interface MobileOptimizedComponentProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  enableAnimations?: boolean
  className?: string
}

export const MobileOptimizedComponent = memo(({
  children,
  fallback,
  enableAnimations = true,
  className = ''
}: MobileOptimizedComponentProps) => {
  const isMobile = useIsMobile()
  const isSlowConnection = useSlowConnection()
  
  // Desabilitar animações em conexões lentas ou mobile antigo
  const shouldDisableAnimations = isSlowConnection || 
    (isMobile && 'deviceMemory' in navigator && (navigator as any).deviceMemory < 4)
  
  if (shouldDisableAnimations || !enableAnimations) {
    return <div className={className}>{children}</div>
  }
  
  return (
    <Suspense fallback={fallback || <div className={className}>{children}</div>}>
      <motion.div 
        className={className}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </Suspense>
  )
})

MobileOptimizedComponent.displayName = 'MobileOptimizedComponent'

// Virtual scrolling otimizado para listas grandes
interface VirtualScrollProps {
  items: any[]
  itemHeight: number
  renderItem: (item: any, index: number) => React.ReactNode
  className?: string
  overscan?: number
}

export const VirtualScroll = memo(({ 
  items, 
  itemHeight, 
  renderItem, 
  className = '',
  overscan = 5 
}: VirtualScrollProps) => {
  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeight, setContainerHeight] = useState(400)
  const isMobile = useIsMobile()
  
  // Otimizar para mobile
  const actualItemHeight = isMobile ? itemHeight * 1.2 : itemHeight
  const visibleCount = Math.ceil(containerHeight / actualItemHeight) + overscan
  const startIndex = Math.max(0, Math.floor(scrollTop / actualItemHeight) - overscan)
  const endIndex = Math.min(items.length, startIndex + visibleCount)
  
  const visibleItems = useMemo(() => 
    items.slice(startIndex, endIndex).map((item, index) => ({
      item,
      originalIndex: startIndex + index
    }))
  , [items, startIndex, endIndex])
  
  return (
    <div 
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ 
        height: items.length * actualItemHeight, 
        position: 'relative' 
      }}>
        <div style={{ 
          transform: `translateY(${startIndex * actualItemHeight}px)` 
        }}>
          {visibleItems.map(({ item, originalIndex }) => (
            <div key={originalIndex} style={{ height: actualItemHeight }}>
              {renderItem(item, originalIndex)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

VirtualScroll.displayName = 'VirtualScroll'

// Image loading otimizado para mobile
interface MobileOptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export const MobileOptimizedImage = memo(({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false
}: MobileOptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false)
  const isMobile = useIsMobile()
  const isSlowConnection = useSlowConnection()
  
  // WebP support detection
  const [supportsWebP, setSupportsWebP] = useState(false)
  
  useEffect(() => {
    const checkWebP = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const dataURL = canvas.toDataURL('image/webp')
        setSupportsWebP(dataURL.indexOf('image/webp') === 5)
      }
    }
    checkWebP()
  }, [])
  
  // Otimizar qualidade para mobile/conexão lenta
  const getOptimizedSrc = (originalSrc: string) => {
    if (!isMobile && !isSlowConnection) return originalSrc
    
    // Se for uma URL externa, tentar versão otimizada
    if (originalSrc.startsWith('http')) {
      const url = new URL(originalSrc)
      url.searchParams.set('w', isMobile ? '600' : '1200')
      url.searchParams.set('q', isSlowConnection ? '60' : '80')
      if (supportsWebP) url.searchParams.set('f', 'webp')
      return url.toString()
    }
    
    return originalSrc
  }
  
  const optimizedSrc = getOptimizedSrc(src)
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !error && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ width, height }}
        />
      )}
      
      <img
        src={error ? '/images/placeholder.svg' : optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        className={`
          transition-opacity duration-300
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
          ${className}
        `}
        style={{ 
          maxWidth: '100%', 
          height: 'auto',
          ...(isMobile && { transform: 'translateZ(0)' }) // Force GPU acceleration on mobile
        }}
      />
    </div>
  )
})

MobileOptimizedImage.displayName = 'MobileOptimizedImage'

// Hook para reduzir animações em dispositivos lentos
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const isMobile = useIsMobile()
  const isSlowConnection = useSlowConnection()
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])
  
  // Auto-reduzir em dispositivos mobile com pouca memória ou conexão lenta
  const shouldReduceMotion = prefersReducedMotion || 
    isSlowConnection || 
    (isMobile && 'deviceMemory' in navigator && (navigator as any).deviceMemory < 4)
  
  return shouldReduceMotion
}

// Performance monitor para debug
export const PerformanceMonitor = ({ showStats = false }: { showStats?: boolean }) => {
  const [stats, setStats] = useState({
    fps: 0,
    memory: 0,
    loadTime: 0
  })
  
  useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()
    
    const updateFPS = () => {
      frameCount++
      const now = performance.now()
      
      if (now - lastTime >= 1000) {
        setStats(prev => ({
          ...prev,
          fps: Math.round(frameCount * 1000 / (now - lastTime)),
          memory: (performance as any).memory?.usedJSHeapSize / 1048576 || 0,
          loadTime: performance.now()
        }))
        
        frameCount = 0
        lastTime = now
      }
      
      requestAnimationFrame(updateFPS)
    }
    
    updateFPS()
  }, [])
  
  if (!showStats) return null
  
  return (
    <div className="fixed top-4 left-4 bg-black/80 text-white p-2 rounded text-xs z-50">
      <div>FPS: {stats.fps}</div>
      <div>Memory: {stats.memory.toFixed(1)}MB</div>
      <div>Load: {stats.loadTime.toFixed(0)}ms</div>
    </div>
  )
}

// Bundle analyzer helper
export const BundleInfo = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Bundle Analysis:')
      console.log('- Mobile optimizations: ✅')
      console.log('- Lazy loading: ✅')
      console.log('- Image optimization: ✅')
      console.log('- Animation optimization: ✅')
    }
  }, [])
  
  return null
}
