'use client'

import { lazy, Suspense, ComponentType } from 'react'
import { motion } from 'framer-motion'

// Lazy loading wrapper com loading state
export function withLazyLoading<T extends object>(
  importFunc: () => Promise<{ default: ComponentType<T> }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFunc)
  
  return function LazyWrapper(props: T) {
    return (
      <Suspense fallback={fallback || <LazyLoadingSpinner />}>
        <LazyComponent {...props} />
      </Suspense>
    )
  }
}

// Spinner de loading otimizado
export function LazyLoadingSpinner() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center p-8"
    >
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-blue-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </motion.div>
  )
}

// Skeleton loader para componentes pesados
export function ComponentSkeleton({ 
  lines = 3, 
  height = 'h-4',
  className = '' 
}: { 
  lines?: number
  height?: string
  className?: string 
}) {
  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`bg-gray-200 rounded ${height} ${
            i === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  )
}

// Lazy components principais
export const LazyDiagnosticChat = withLazyLoading(
  () => import('@/components/ai/DiagnosticChat'),
  <ComponentSkeleton lines={5} className="p-6" />
)

export const LazyMapView = withLazyLoading(
  () => import('@/components/maps/MapView'),
  <div className="w-full h-96 bg-gray-100 rounded-xl flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 animate-pulse"></div>
      <p className="text-gray-500">Carregando mapa...</p>
    </div>
  </div>
)

export const LazyCheckoutForm = withLazyLoading(
  () => import('@/components/payments/CheckoutForm'),
  <ComponentSkeleton lines={8} className="p-6" />
)

export const LazyChatInterface = withLazyLoading(
  () => import('@/components/chat/ChatInterface'),
  <div className="h-96 bg-gray-50 rounded-xl flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 bg-blue-200 rounded-full mx-auto mb-4 animate-pulse"></div>
      <p className="text-gray-500">Carregando chat...</p>
    </div>
  </div>
)

// Hook para lazy loading condicional
export function useLazyLoad(condition: boolean) {
  return condition
}

// Preload de componentes críticos
export function preloadCriticalComponents() {
  // Preload componentes que serão usados logo após login
  import('@/components/ai/DiagnosticChat')
  import('@/components/maps/MapView')
  import('@/components/chat/ChatInterface')
}