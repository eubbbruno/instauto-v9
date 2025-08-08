'use client'
import { motion } from 'framer-motion'
import { 
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

export interface QuickFilter {
  id: string
  label: string
  value: any
  icon?: any
  color?: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'gray'
}

interface QuickFiltersProps {
  filters: QuickFilter[]
  activeFilters: Set<string>
  onToggle: (filterId: string) => void
  onClear?: () => void
  className?: string
}

export default function QuickFilters({
  filters,
  activeFilters,
  onToggle,
  onClear,
  className = ''
}: QuickFiltersProps) {
  const getColorClasses = (color: string = 'blue', isActive: boolean) => {
    const colors = {
      blue: isActive 
        ? 'bg-blue-100 text-blue-800 border-blue-300' 
        : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50',
      green: isActive 
        ? 'bg-green-100 text-green-800 border-green-300' 
        : 'bg-white text-green-700 border-green-200 hover:bg-green-50',
      purple: isActive 
        ? 'bg-purple-100 text-purple-800 border-purple-300' 
        : 'bg-white text-purple-700 border-purple-200 hover:bg-purple-50',
      yellow: isActive 
        ? 'bg-yellow-100 text-yellow-800 border-yellow-300' 
        : 'bg-white text-yellow-700 border-yellow-200 hover:bg-yellow-50',
      red: isActive 
        ? 'bg-red-100 text-red-800 border-red-300' 
        : 'bg-white text-red-700 border-red-200 hover:bg-red-50',
      gray: isActive 
        ? 'bg-gray-100 text-gray-800 border-gray-300' 
        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {filters.map((filter) => {
        const isActive = activeFilters.has(filter.id)
        const IconComponent = filter.icon

        return (
          <motion.button
            key={filter.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onToggle(filter.id)}
            className={`
              inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium
              transition-all duration-200 ${getColorClasses(filter.color, isActive)}
            `}
          >
            {IconComponent && <IconComponent className="h-4 w-4" />}
            <span>{filter.label}</span>
            {isActive && <CheckIcon className="h-4 w-4" />}
          </motion.button>
        )
      })}

      {/* Clear All Button */}
      {activeFilters.size > 0 && onClear && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={onClear}
          className="inline-flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <XMarkIcon className="h-4 w-4" />
          Limpar ({activeFilters.size})
        </motion.button>
      )}
    </div>
  )
}

// Hook para gerenciar filtros rápidos
export function useQuickFilters(filters: QuickFilter[]) {
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set())

  const toggle = (filterId: string) => {
    const newActive = new Set(activeFilters)
    if (newActive.has(filterId)) {
      newActive.delete(filterId)
    } else {
      newActive.add(filterId)
    }
    setActiveFilters(newActive)
  }

  const clear = () => {
    setActiveFilters(new Set())
  }

  const getActiveValues = () => {
    return filters
      .filter(filter => activeFilters.has(filter.id))
      .map(filter => ({ id: filter.id, value: filter.value }))
  }

  return {
    activeFilters,
    toggle,
    clear,
    getActiveValues
  }
}

// Hook de useState que faltou
import { useState } from 'react'
