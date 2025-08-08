'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
  CalendarDaysIcon,
  MapPinIcon,
  StarIcon,
  CurrencyDollarIcon,
  TagIcon,
  ClockIcon,
  CheckIcon
} from '@heroicons/react/24/outline'

export interface FilterConfig {
  id: string
  label: string
  type: 'select' | 'multiselect' | 'range' | 'date' | 'search' | 'checkbox' | 'rating'
  options?: Array<{ value: string | number, label: string }>
  placeholder?: string
  min?: number
  max?: number
  step?: number
  icon?: any
  category?: string
}

export interface FilterValue {
  [key: string]: any
}

interface AdvancedFiltersProps {
  filters: FilterConfig[]
  values: FilterValue
  onChange: (values: FilterValue) => void
  onReset?: () => void
  isOpen?: boolean
  onToggle?: () => void
  className?: string
  showActiveCount?: boolean
  layout?: 'horizontal' | 'vertical' | 'grid'
}

export default function AdvancedFilters({
  filters,
  values,
  onChange,
  onReset,
  isOpen = false,
  onToggle,
  className = '',
  showActiveCount = true,
  layout = 'grid'
}: AdvancedFiltersProps) {
  const [localValues, setLocalValues] = useState<FilterValue>(values)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  useEffect(() => {
    setLocalValues(values)
  }, [values])

  const handleValueChange = (filterId: string, value: any) => {
    const newValues = { ...localValues, [filterId]: value }
    setLocalValues(newValues)
    onChange(newValues)
  }

  const handleReset = () => {
    const resetValues: FilterValue = {}
    filters.forEach(filter => {
      resetValues[filter.id] = filter.type === 'multiselect' ? [] : filter.type === 'rating' ? 0 : ''
    })
    setLocalValues(resetValues)
    onChange(resetValues)
    onReset?.()
  }

  const getActiveFiltersCount = () => {
    return Object.entries(localValues).filter(([key, value]) => {
      if (Array.isArray(value)) return value.length > 0
      if (typeof value === 'number') return value > 0
      return value !== '' && value !== null && value !== undefined
    }).length
  }

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const groupedFilters = filters.reduce((acc, filter) => {
    const category = filter.category || 'Geral'
    if (!acc[category]) acc[category] = []
    acc[category].push(filter)
    return acc
  }, {} as Record<string, FilterConfig[]>)

  const renderFilter = (filter: FilterConfig) => {
    const IconComponent = filter.icon

    switch (filter.type) {
      case 'select':
        return (
          <div key={filter.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              {IconComponent && <IconComponent className="h-4 w-4" />}
              {filter.label}
            </label>
            <select
              value={localValues[filter.id] || ''}
              onChange={(e) => handleValueChange(filter.id, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">{filter.placeholder || 'Selecione...'}</option>
              {filter.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )

      case 'multiselect':
        const selectedValues = localValues[filter.id] || []
        return (
          <div key={filter.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              {IconComponent && <IconComponent className="h-4 w-4" />}
              {filter.label}
              {selectedValues.length > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {selectedValues.length}
                </span>
              )}
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {filter.options?.map((option) => (
                <label key={option.value} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option.value)}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...selectedValues, option.value]
                        : selectedValues.filter((v: any) => v !== option.value)
                      handleValueChange(filter.id, newValues)
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        )

      case 'range':
        return (
          <div key={filter.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              {IconComponent && <IconComponent className="h-4 w-4" />}
              {filter.label}
              {localValues[filter.id] && (
                <span className="text-blue-600 text-xs">
                  {localValues[filter.id]}
                </span>
              )}
            </label>
            <input
              type="range"
              min={filter.min || 0}
              max={filter.max || 100}
              step={filter.step || 1}
              value={localValues[filter.id] || filter.min || 0}
              onChange={(e) => handleValueChange(filter.id, Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{filter.min || 0}</span>
              <span>{filter.max || 100}</span>
            </div>
          </div>
        )

      case 'date':
        return (
          <div key={filter.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              {IconComponent && <IconComponent className="h-4 w-4" />}
              {filter.label}
            </label>
            <input
              type="date"
              value={localValues[filter.id] || ''}
              onChange={(e) => handleValueChange(filter.id, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        )

      case 'search':
        return (
          <div key={filter.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              {IconComponent && <IconComponent className="h-4 w-4" />}
              {filter.label}
            </label>
            <input
              type="text"
              value={localValues[filter.id] || ''}
              onChange={(e) => handleValueChange(filter.id, e.target.value)}
              placeholder={filter.placeholder}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        )

      case 'checkbox':
        return (
          <div key={filter.id} className="space-y-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={localValues[filter.id] || false}
                onChange={(e) => handleValueChange(filter.id, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              {IconComponent && <IconComponent className="h-4 w-4" />}
              <span className="text-gray-700">{filter.label}</span>
            </label>
          </div>
        )

      case 'rating':
        return (
          <div key={filter.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              {IconComponent && <IconComponent className="h-4 w-4" />}
              {filter.label}
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleValueChange(filter.id, star === localValues[filter.id] ? 0 : star)}
                  className="p-1"
                >
                  <StarIcon 
                    className={`h-5 w-5 ${
                      star <= (localValues[filter.id] || 0) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              {localValues[filter.id] > 0 && (
                <span className="ml-2 text-sm text-gray-600">
                  {localValues[filter.id]}+ estrelas
                </span>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const getLayoutClasses = () => {
    switch (layout) {
      case 'horizontal':
        return 'flex flex-wrap gap-4'
      case 'vertical':
        return 'space-y-4'
      case 'grid':
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
    }
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <FunnelIcon className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
          {showActiveCount && getActiveFiltersCount() > 0 && (
            <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
              {getActiveFiltersCount()} ativos
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {getActiveFiltersCount() > 0 && (
            <button
              onClick={handleReset}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Limpar
            </button>
          )}
          
          {onToggle && (
            <button
              onClick={onToggle}
              className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {isOpen ? <XMarkIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4">
              {Object.keys(groupedFilters).length > 1 ? (
                // Grouped by categories
                <div className="space-y-6">
                  {Object.entries(groupedFilters).map(([category, categoryFilters]) => (
                    <div key={category}>
                      <button
                        onClick={() => toggleCategory(category)}
                        className="flex items-center justify-between w-full mb-3 text-left"
                      >
                        <h4 className="text-md font-semibold text-gray-800">{category}</h4>
                        <ChevronDownIcon 
                          className={`h-4 w-4 text-gray-600 transition-transform ${
                            expandedCategories.has(category) ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      
                      <AnimatePresence>
                        {(expandedCategories.has(category) || expandedCategories.size === 0) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={getLayoutClasses()}
                          >
                            {categoryFilters.map(renderFilter)}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              ) : (
                // Single group
                <div className={getLayoutClasses()}>
                  {filters.map(renderFilter)}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Hook para gerenciar filtros
export function useAdvancedFilters(initialValues: FilterValue = {}) {
  const [values, setValues] = useState<FilterValue>(initialValues)
  const [isOpen, setIsOpen] = useState(false)

  const updateValues = (newValues: FilterValue) => {
    setValues(newValues)
  }

  const resetValues = () => {
    setValues(initialValues)
  }

  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  const getActiveCount = () => {
    return Object.entries(values).filter(([key, value]) => {
      if (Array.isArray(value)) return value.length > 0
      if (typeof value === 'number') return value > 0
      return value !== '' && value !== null && value !== undefined
    }).length
  }

  return {
    values,
    isOpen,
    updateValues,
    resetValues,
    toggleOpen,
    getActiveCount
  }
}
