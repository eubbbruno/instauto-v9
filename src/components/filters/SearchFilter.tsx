'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MagnifyingGlassIcon,
  XMarkIcon,
  ClockIcon,
  TagIcon
} from '@heroicons/react/24/outline'

interface SearchSuggestion {
  id: string
  text: string
  type: 'recent' | 'suggestion' | 'category'
  icon?: any
  category?: string
}

interface SearchFilterProps {
  value: string
  onChange: (value: string) => void
  onSearch?: (value: string) => void
  placeholder?: string
  suggestions?: SearchSuggestion[]
  recentSearches?: string[]
  className?: string
  showSuggestions?: boolean
  debounceMs?: number
  maxSuggestions?: number
}

export default function SearchFilter({
  value,
  onChange,
  onSearch,
  placeholder = 'Pesquisar...',
  suggestions = [],
  recentSearches = [],
  className = '',
  showSuggestions = true,
  debounceMs = 300,
  maxSuggestions = 8
}: SearchFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [debouncedValue, setDebouncedValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [value, debounceMs])

  // Trigger search when debounced value changes
  useEffect(() => {
    if (debouncedValue !== value) {
      onSearch?.(debouncedValue)
    }
  }, [debouncedValue])

  // Handle clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    setIsOpen(newValue.length > 0 || showSuggestions)
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onChange(suggestion.text)
    onSearch?.(suggestion.text)
    setIsOpen(false)
    inputRef.current?.blur()
  }

  const handleClear = () => {
    onChange('')
    onSearch?.('')
    inputRef.current?.focus()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(value)
    setIsOpen(false)
    inputRef.current?.blur()
  }

  // Filter and prepare suggestions
  const filteredSuggestions = suggestions
    .filter(suggestion => 
      value === '' || 
      suggestion.text.toLowerCase().includes(value.toLowerCase())
    )
    .slice(0, maxSuggestions)

  const recentSuggestions = recentSearches
    .filter(recent => 
      recent !== value && 
      (value === '' || recent.toLowerCase().includes(value.toLowerCase()))
    )
    .slice(0, 5)
    .map(recent => ({
      id: `recent_${recent}`,
      text: recent,
      type: 'recent' as const,
      icon: ClockIcon
    }))

  const allSuggestions = [
    ...recentSuggestions,
    ...filteredSuggestions
  ].slice(0, maxSuggestions)

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        {/* Search Input */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(showSuggestions || value.length > 0)}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          />
          
          {/* Clear Button */}
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Search Button (hidden but still functional for form submission) */}
        <button type="submit" className="sr-only">
          Search
        </button>
      </form>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {isOpen && showSuggestions && allSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto z-50"
          >
            {/* Recent Searches Header */}
            {recentSuggestions.length > 0 && (
              <div className="px-4 py-2 border-b border-gray-100">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Pesquisas Recentes
                </h4>
              </div>
            )}

            {/* Suggestions List */}
            <div className="py-2">
              {allSuggestions.map((suggestion, index) => {
                const IconComponent = suggestion.icon

                return (
                  <motion.button
                    key={suggestion.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 group"
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      {IconComponent ? (
                        <IconComponent className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                      ) : (
                        <TagIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                      )}
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 truncate">
                        {suggestion.text}
                      </p>
                      {suggestion.category && (
                        <p className="text-xs text-gray-500 truncate">
                          em {suggestion.category}
                        </p>
                      )}
                    </div>

                    {/* Type Badge */}
                    {suggestion.type === 'recent' && (
                      <div className="flex-shrink-0">
                        <span className="text-xs text-gray-400">recente</span>
                      </div>
                    )}
                  </motion.button>
                )
              })}
            </div>

            {/* No Results */}
            {value && allSuggestions.length === 0 && (
              <div className="px-4 py-6 text-center">
                <MagnifyingGlassIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Nenhuma sugestão encontrada</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Hook para gerenciar histórico de pesquisas
export function useSearchHistory(key: string = 'search_history', maxItems: number = 10) {
  const [history, setHistory] = useState<string[]>([])

  useEffect(() => {
    const saved = localStorage.getItem(key)
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch (error) {
        console.error('Error loading search history:', error)
      }
    }
  }, [key])

  const addToHistory = (searchTerm: string) => {
    if (!searchTerm.trim()) return

    const newHistory = [
      searchTerm,
      ...history.filter(item => item !== searchTerm)
    ].slice(0, maxItems)

    setHistory(newHistory)
    localStorage.setItem(key, JSON.stringify(newHistory))
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem(key)
  }

  const removeFromHistory = (searchTerm: string) => {
    const newHistory = history.filter(item => item !== searchTerm)
    setHistory(newHistory)
    localStorage.setItem(key, JSON.stringify(newHistory))
  }

  return {
    history,
    addToHistory,
    clearHistory,
    removeFromHistory
  }
}
