'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion'

// Hook para detectar gestos de swipe
export function useSwipeGesture(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  onSwipeUp?: () => void,
  onSwipeDown?: () => void,
  threshold: number = 50
) {
  const handlePan = (event: any, info: PanInfo) => {
    const { offset } = info
    
    if (Math.abs(offset.x) > Math.abs(offset.y)) {
      // Swipe horizontal
      if (offset.x > threshold && onSwipeRight) {
        onSwipeRight()
      } else if (offset.x < -threshold && onSwipeLeft) {
        onSwipeLeft()
      }
    } else {
      // Swipe vertical
      if (offset.y > threshold && onSwipeDown) {
        onSwipeDown()
      } else if (offset.y < -threshold && onSwipeUp) {
        onSwipeUp()
      }
    }
  }

  return { onPan: handlePan }
}

// Componente de Pull to Refresh
interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
  threshold?: number
}

export function PullToRefresh({ 
  onRefresh, 
  children, 
  threshold = 80 
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const y = useMotionValue(0)
  const rotate = useTransform(y, [0, threshold], [0, 180])
  const opacity = useTransform(y, [0, threshold], [0, 1])

  const handleDragEnd = async (event: any, info: PanInfo) => {
    if (info.offset.y > threshold && !isRefreshing) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
        y.set(0)
      }
    } else {
      y.set(0)
    }
  }

  return (
    <div className="relative overflow-hidden">
      {/* Pull to refresh indicator */}
      <motion.div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full z-10"
        style={{ opacity }}
      >
        <div className="bg-white rounded-full p-3 shadow-lg">
          <motion.div
            style={{ rotate }}
            className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"
          />
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.5, bottom: 0 }}
        onDragEnd={handleDragEnd}
        style={{ y }}
        className="touch-pan-y"
      >
        {children}
      </motion.div>

      {/* Loading overlay */}
      {isRefreshing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-white/80 flex items-center justify-center z-20"
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </motion.div>
      )}
    </div>
  )
}

// Componente de Bottom Sheet
interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  snapPoints?: number[]
}

export function BottomSheet({ 
  isOpen, 
  onClose, 
  children, 
  snapPoints = [0.3, 0.7, 0.9] 
}: BottomSheetProps) {
  const y = useMotionValue(0)
  const [currentSnap, setCurrentSnap] = useState(0)

  const handleDragEnd = (event: any, info: PanInfo) => {
    const windowHeight = window.innerHeight
    const currentY = info.point.y
    const velocity = info.velocity.y

    // Encontrar snap point mais próximo
    let closestSnap = 0
    let closestDistance = Infinity

    snapPoints.forEach((snap, index) => {
      const snapY = windowHeight * (1 - snap)
      const distance = Math.abs(currentY - snapY)
      
      if (distance < closestDistance) {
        closestDistance = distance
        closestSnap = index
      }
    })

    // Considerar velocidade para snap
    if (velocity > 500) {
      onClose()
    } else if (velocity < -500 && closestSnap < snapPoints.length - 1) {
      closestSnap = snapPoints.length - 1
    }

    setCurrentSnap(closestSnap)
    y.set(windowHeight * (1 - snapPoints[closestSnap]))
  }

  useEffect(() => {
    if (isOpen) {
      const windowHeight = window.innerHeight
      y.set(windowHeight * (1 - snapPoints[0]))
      setCurrentSnap(0)
    } else {
      y.set(window.innerHeight)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: window.innerHeight }}
        dragElastic={{ top: 0, bottom: 0.2 }}
        onDragEnd={handleDragEnd}
        style={{ y }}
        className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl z-50 touch-pan-y"
      >
        {/* Handle */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        {/* Content */}
        <div className="px-4 pb-8 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </motion.div>
    </>
  )
}

// Hook para detectar dispositivo móvel
export function useIsMobile() {
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

// Hook para vibração háptica
export function useHapticFeedback() {
  const vibrate = (pattern: number | number[] = 10) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern)
    }
  }

  return {
    light: () => vibrate(10),
    medium: () => vibrate(50),
    heavy: () => vibrate(100),
    pattern: (pattern: number[]) => vibrate(pattern),
    success: () => vibrate([50, 50, 50]),
    error: () => vibrate([100, 50, 100, 50, 100]),
    notification: () => vibrate([200, 100, 200])
  }
}

// Componente de Floating Action Button
interface FABProps {
  onClick: () => void
  icon: React.ReactNode
  className?: string
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center'
}

export function FloatingActionButton({ 
  onClick, 
  icon, 
  className = '',
  position = 'bottom-right'
}: FABProps) {
  const haptic = useHapticFeedback()

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 transform -translate-x-1/2'
  }

  const handleClick = () => {
    haptic.light()
    onClick()
  }

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      className={`
        fixed ${positionClasses[position]} z-50
        w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg
        flex items-center justify-center
        hover:bg-blue-700 transition-colors
        ${className}
      `}
    >
      {icon}
    </motion.button>
  )
}

// Hook para scroll infinito
export function useInfiniteScroll(
  callback: () => void,
  threshold: number = 100
) {
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      
      if (scrollTop + clientHeight >= scrollHeight - threshold && !isFetching) {
        setIsFetching(true)
        callback()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [callback, threshold, isFetching])

  const resetFetching = () => setIsFetching(false)

  return { isFetching, resetFetching }
}
