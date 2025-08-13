'use client'
import { motion } from 'framer-motion'

interface SkeletonLoaderProps {
  type?: 'card' | 'table' | 'sidebar' | 'header' | 'dashboard' | 'text' | 'avatar'
  count?: number
  className?: string
  width?: string
  height?: string
}

export default function SkeletonLoader({ 
  type = 'card', 
  count = 1, 
  className = '',
  width,
  height 
}: SkeletonLoaderProps) {
  
  const shimmerAnimation = {
    initial: { x: '-100%' },
    animate: { x: '100%' },
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: 'easeInOut'
    }
  }

  const SkeletonElement = ({ children, customClass }: { children?: React.ReactNode, customClass?: string }) => (
    <div className={`bg-gray-200 rounded-lg relative overflow-hidden ${customClass}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
        {...shimmerAnimation}
      />
      {children}
    </div>
  )

  const renderSkeleton = () => {
    switch (type) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <SkeletonElement customClass="h-8 w-64 mb-2" />
              <SkeletonElement customClass="h-4 w-48" />
            </div>
            
            {/* Welcome Card Skeleton */}
            <div className="px-6">
              <SkeletonElement customClass="h-32 w-full rounded-xl mb-6" />
              
              {/* Stats Cards Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                  <SkeletonElement key={i} customClass="h-32 w-full rounded-xl" />
                ))}
              </div>
              
              {/* Content Cards Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {[...Array(6)].map((_, i) => (
                  <SkeletonElement key={i} customClass="h-48 w-full rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        )

      case 'card':
        return (
          <div className="space-y-4">
            {[...Array(count)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 space-y-4">
                <SkeletonElement customClass="h-6 w-3/4" />
                <SkeletonElement customClass="h-4 w-full" />
                <SkeletonElement customClass="h-4 w-2/3" />
                <div className="flex gap-2">
                  <SkeletonElement customClass="h-8 w-20 rounded-full" />
                  <SkeletonElement customClass="h-8 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )

      case 'table':
        return (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <SkeletonElement customClass="h-6 w-48" />
            </div>
            
            {/* Table Rows */}
            <div className="divide-y divide-gray-200">
              {[...Array(count)].map((_, i) => (
                <div key={i} className="px-6 py-4 flex items-center gap-4">
                  <SkeletonElement customClass="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <SkeletonElement customClass="h-4 w-32" />
                    <SkeletonElement customClass="h-3 w-24" />
                  </div>
                  <SkeletonElement customClass="h-6 w-16 rounded-full" />
                  <SkeletonElement customClass="h-8 w-8 rounded" />
                </div>
              ))}
            </div>
          </div>
        )

      case 'sidebar':
        return (
          <div className="w-60 h-screen bg-gradient-to-b from-blue-800 to-blue-600 p-6 space-y-6">
            {/* Logo */}
            <SkeletonElement customClass="h-16 w-16 rounded-2xl mx-auto bg-white/20" />
            
            {/* Menu Items */}
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <SkeletonElement customClass="h-6 w-6 bg-white/20" />
                  <SkeletonElement customClass="h-4 w-24 bg-white/20" />
                </div>
              ))}
            </div>
          </div>
        )

      case 'header':
        return (
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <SkeletonElement customClass="h-8 w-64" />
                <SkeletonElement customClass="h-4 w-48" />
              </div>
              <div className="flex items-center gap-3">
                <SkeletonElement customClass="h-10 w-10 rounded-full" />
                <SkeletonElement customClass="h-10 w-10 rounded-full" />
              </div>
            </div>
          </div>
        )

      case 'avatar':
        return (
          <SkeletonElement customClass={`rounded-full ${width || 'w-10'} ${height || 'h-10'}`} />
        )

      case 'text':
        return (
          <div className="space-y-2">
            {[...Array(count)].map((_, i) => (
              <SkeletonElement 
                key={i} 
                customClass={`h-4 ${i === count - 1 ? 'w-2/3' : 'w-full'}`} 
              />
            ))}
          </div>
        )

      default:
        return (
          <SkeletonElement 
            customClass={`${width || 'w-full'} ${height || 'h-32'} ${className}`} 
          />
        )
    }
  }

  return (
    <div className={`animate-pulse ${className}`}>
      {renderSkeleton()}
    </div>
  )
}

// Componentes específicos para uso comum
export const DashboardSkeleton = () => (
  <SkeletonLoader type="dashboard" />
)

export const CardSkeleton = ({ count = 3 }: { count?: number }) => (
  <SkeletonLoader type="card" count={count} />
)

export const TableSkeleton = ({ count = 5 }: { count?: number }) => (
  <SkeletonLoader type="table" count={count} />
)

export const SidebarSkeleton = () => (
  <SkeletonLoader type="sidebar" />
)

export const HeaderSkeleton = () => (
  <SkeletonLoader type="header" />
)

export const AvatarSkeleton = ({ size = 'w-10 h-10' }: { size?: string }) => (
  <SkeletonLoader type="avatar" className={size} />
)

export const TextSkeleton = ({ lines = 3 }: { lines?: number }) => (
  <SkeletonLoader type="text" count={lines} />
)
