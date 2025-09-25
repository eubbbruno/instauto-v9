'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'rectangular' | 'circular' | 'rounded'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4 rounded'
      case 'circular':
        return 'rounded-full'
      case 'rounded':
        return 'rounded-lg'
      case 'rectangular':
      default:
        return 'rounded'
    }
  }

  const getAnimationClasses = () => {
    switch (animation) {
      case 'pulse':
        return 'animate-pulse'
      case 'wave':
        return 'animate-shimmer'
      case 'none':
      default:
        return ''
    }
  }

  const style: React.CSSProperties = {}
  if (width) style.width = typeof width === 'number' ? `${width}px` : width
  if (height) style.height = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      className={`
        bg-gray-200 dark:bg-gray-700
        ${getVariantClasses()}
        ${getAnimationClasses()}
        ${className}
      `}
      style={style}
    />
  )
}

// Skeleton para Card
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${className}`}>
    <div className="space-y-4">
      <Skeleton variant="text" className="w-3/4" />
      <Skeleton variant="text" className="w-1/2" />
      <Skeleton variant="rectangular" height={120} />
      <div className="flex space-x-2">
        <Skeleton variant="rounded" className="w-20 h-8" />
        <Skeleton variant="rounded" className="w-16 h-8" />
      </div>
    </div>
  </div>
)

// Skeleton para Lista
export const SkeletonList: React.FC<{ items?: number; className?: string }> = ({ 
  items = 3, 
  className = '' 
}) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center space-x-4">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="w-3/4" />
            <Skeleton variant="text" className="w-1/2" />
          </div>
          <Skeleton variant="rounded" className="w-16 h-6" />
        </div>
      </div>
    ))}
  </div>
)

// Skeleton para Tabela
export const SkeletonTable: React.FC<{ 
  rows?: number
  columns?: number
  className?: string 
}> = ({ rows = 5, columns = 4, className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden ${className}`}>
    {/* Header */}
    <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 border-b border-gray-200 dark:border-gray-600">
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant="text" className="flex-1" />
        ))}
      </div>
    </div>
    
    {/* Rows */}
    <div className="divide-y divide-gray-200 dark:divide-gray-600">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="px-6 py-4">
          <div className="flex space-x-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="flex-1">
                <Skeleton 
                  variant="text" 
                  className={colIndex === 0 ? "w-3/4" : "w-full"} 
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
)

// Skeleton para Dashboard
export const SkeletonDashboard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`space-y-6 ${className}`}>
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton variant="text" className="w-20" />
              <Skeleton variant="text" className="w-16 h-8" />
            </div>
            <Skeleton variant="circular" width={48} height={48} />
          </div>
        </div>
      ))}
    </div>
    
    {/* Chart Area */}
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <Skeleton variant="text" className="w-48 mb-4" />
      <Skeleton variant="rectangular" height={300} />
    </div>
    
    {/* Recent Activity */}
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <Skeleton variant="text" className="w-40 mb-4" />
      <SkeletonList items={5} className="space-y-3" />
    </div>
  </div>
)

// Skeleton para Profile
export const SkeletonProfile: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${className}`}>
    <div className="flex items-center space-x-6 mb-6">
      <Skeleton variant="circular" width={80} height={80} />
      <div className="space-y-2 flex-1">
        <Skeleton variant="text" className="w-48" />
        <Skeleton variant="text" className="w-32" />
        <Skeleton variant="text" className="w-40" />
      </div>
    </div>
    
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton variant="text" className="w-24" />
            <Skeleton variant="rounded" className="w-full h-10" />
          </div>
        ))}
      </div>
    </div>
  </div>
)

// Skeleton para Loading Screen
export const SkeletonLoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-4">
        <div className="flex items-center justify-between">
          <Skeleton variant="text" className="w-48" />
          <div className="flex space-x-2">
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="rounded" className="w-24 h-10" />
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <SkeletonDashboard />
    </div>
  </div>
)