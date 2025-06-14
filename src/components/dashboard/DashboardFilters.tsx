"use client";

import { useState } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterConfig {
  id: string;
  label: string;
  type: 'select' | 'date' | 'search' | 'checkbox';
  options?: FilterOption[];
  placeholder?: string;
}

export type FilterValue = string | string[] | number | boolean | null | undefined;

interface DashboardFiltersProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: FilterConfig[];
  filterValues: Record<string, FilterValue>;
  onFilterChange: (filters: Record<string, FilterValue>) => void;
  showFilters?: boolean;
}

export default function DashboardFilters({
  searchPlaceholder = "Buscar...",
  searchValue,
  onSearchChange,
  filters = [],
  filterValues,
  onFilterChange,
  showFilters = true
}: DashboardFiltersProps) {
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const updateFilter = (filterId: string, value: FilterValue) => {
    onFilterChange({
      ...filterValues,
      [filterId]: value
    });
  };

  const clearFilters = () => {
    const clearedFilters = Object.keys(filterValues).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {} as Record<string, FilterValue>);
    onFilterChange(clearedFilters);
  };

  const activeFiltersCount = Object.values(filterValues).filter(value => 
    value !== '' && value !== null && value !== undefined
  ).length;

  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <div className="space-y-4">
      {/* Barra de Busca e Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Campo de Busca */}
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047CC] focus:border-[#0047CC] bg-white"
          />
        </div>

        {/* Botão de Filtros */}
        {showFilters && filters.length > 0 && (
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`relative flex items-center px-4 py-3 rounded-lg border transition-colors ${
                showFilterPanel || hasActiveFilters
                  ? 'bg-[#0047CC] text-white border-[#0047CC]'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filtros
              {activeFiltersCount > 0 && (
                <span className="ml-2 bg-white text-[#0047CC] text-xs font-bold px-2 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-3 text-gray-600 hover:text-gray-900 transition-colors"
                title="Limpar filtros"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Painel de Filtros */}
      <AnimatePresence>
        {showFilterPanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-lg border border-gray-200 p-4 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filters.map((filter) => (
                <div key={filter.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {filter.label}
                  </label>
                  
                  {filter.type === 'select' && (
                    <div className="relative">
                      <select
                        value={String(filterValues[filter.id] || '')}
                        onChange={(e) => updateFilter(filter.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047CC] focus:border-[#0047CC] appearance-none bg-white"
                      >
                        {filter.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDownIcon className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  )}

                  {filter.type === 'date' && (
                    <input
                      type="date"
                      value={String(filterValues[filter.id] || '')}
                      onChange={(e) => updateFilter(filter.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047CC] focus:border-[#0047CC]"
                    />
                  )}

                  {filter.type === 'search' && (
                    <input
                      type="text"
                      placeholder={filter.placeholder || 'Buscar...'}
                      value={String(filterValues[filter.id] || '')}
                      onChange={(e) => updateFilter(filter.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047CC] focus:border-[#0047CC]"
                    />
                  )}

                  {filter.type === 'checkbox' && filter.options && (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {filter.options.map((option) => (
                        <label key={option.value} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={Array.isArray(filterValues[filter.id]) && (filterValues[filter.id] as string[]).includes(option.value)}
                            onChange={(e) => {
                              const currentValues = Array.isArray(filterValues[filter.id]) ? filterValues[filter.id] as string[] : [];
                              const newValues = e.target.checked
                                ? [...currentValues, option.value]
                                : currentValues.filter((v: string) => v !== option.value);
                              updateFilter(filter.id, newValues);
                            }}
                            className="rounded border-gray-300 text-[#0047CC] focus:ring-[#0047CC]"
                          />
                          <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Chips de Filtros Ativos */}
            {hasActiveFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-600 mr-2">Filtros ativos:</span>
                  {Object.entries(filterValues).map(([key, value]) => {
                    if (!value || value === '') return null;
                    
                    const filter = filters.find(f => f.id === key);
                    if (!filter) return null;

                    let displayValue: string = String(value);
                    if (filter.type === 'select' && filter.options) {
                      const option = filter.options.find(opt => opt.value === value);
                      displayValue = option?.label || String(value);
                    }
                    if (Array.isArray(value)) {
                      displayValue = value.join(', ');
                    }

                    return (
                      <motion.span
                        key={key}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#0047CC] text-white"
                      >
                        {filter.label}: {displayValue}
                        <button
                          onClick={() => updateFilter(key, filter.type === 'checkbox' ? [] : '')}
                          className="ml-2 hover:bg-white/20 rounded-full p-0.5"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </motion.span>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 