import React from 'react'
import { motion } from 'framer-motion'

interface SkeletonProps {
  className?: string
  width?: string
  height?: string
  animation?: 'pulse' | 'wave' | 'shimmer'
}

export function SkeletonAdvanced({ 
  className = '', 
  width = 'w-full', 
  height = 'h-4',
  animation = 'shimmer'
}: SkeletonProps) {
  const getAnimationClass = () => {
    switch (animation) {
      case 'pulse':
        return 'animate-pulse'
      case 'wave':
        return 'animate-pulse'
      case 'shimmer':
        return 'relative overflow-hidden bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite]'
      default:
        return 'animate-pulse'
    }
  }

  return (
    <div className={`${width} ${height} bg-gray-200 rounded-lg ${getAnimationClass()} ${className}`}>
      {animation === 'shimmer' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" />
      )}
    </div>
  )
}

export function SkeletonCardAdvanced({ animated = true }: { animated?: boolean }) {
  const MotionDiv = animated ? motion.div : 'div'
  
  return (
    <MotionDiv 
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 relative overflow-hidden"
      {...(animated && {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
      })}
    >
      {/* Shimmer Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 -z-10"></div>
      
      <div className="flex items-center space-x-4 mb-6">
        <SkeletonAdvanced width="w-14" height="h-14" className="rounded-full" animation="shimmer" />
        <div className="space-y-3 flex-1">
          <SkeletonAdvanced width="w-40" height="h-5" animation="shimmer" />
          <SkeletonAdvanced width="w-32" height="h-4" animation="shimmer" />
        </div>
      </div>
      
      <div className="space-y-3">
        <SkeletonAdvanced width="w-full" height="h-4" animation="shimmer" />
        <SkeletonAdvanced width="w-5/6" height="h-4" animation="shimmer" />
        <SkeletonAdvanced width="w-3/4" height="h-4" animation="shimmer" />
      </div>
      
      <div className="mt-6 flex space-x-3">
        <SkeletonAdvanced width="w-24" height="h-8" className="rounded-lg" animation="shimmer" />
        <SkeletonAdvanced width="w-20" height="h-8" className="rounded-lg" animation="shimmer" />
      </div>
    </MotionDiv>
  )
}

export function SkeletonDashboardAdvanced() {
  return (
    <motion.div 
      className="space-y-8 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <SkeletonAdvanced width="w-64" height="h-8" animation="shimmer" />
          <SkeletonAdvanced width="w-48" height="h-5" animation="shimmer" />
        </div>
        <SkeletonAdvanced width="w-36" height="h-10" className="rounded-xl" animation="shimmer" />
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <motion.div 
            key={i} 
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/20 -z-10"></div>
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <SkeletonAdvanced width="w-20" height="h-4" animation="shimmer" />
                <SkeletonAdvanced width="w-16" height="h-8" animation="shimmer" />
                <SkeletonAdvanced width="w-24" height="h-3" animation="shimmer" />
              </div>
              <SkeletonAdvanced width="w-12" height="h-12" className="rounded-full" animation="shimmer" />
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <SkeletonAdvanced width="w-48" height="h-6" className="mb-6" animation="shimmer" />
          <SkeletonAdvanced width="w-full" height="h-64" className="rounded-xl" animation="shimmer" />
        </motion.div>
        
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <SkeletonAdvanced width="w-40" height="h-6" className="mb-6" animation="shimmer" />
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <SkeletonAdvanced width="w-32" height="h-4" animation="shimmer" />
                <SkeletonAdvanced width="w-16" height="h-4" animation="shimmer" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
