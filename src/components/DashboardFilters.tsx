"use client";

import { 
  FunnelIcon, 
  XMarkIcon, 
  ChevronDownIcon,
  CalendarIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type FilterOption = {
  id: string;
  label: string;
  options?: string[];
  type: 'select' | 'date' | 'search' | 'checkbox' | 'range';
  icon?: React.ReactNode;
};

type FilterValue = string | boolean | number;

type DashboardFiltersProps = {
  title?: string;
  filterOptions: FilterOption[];
  onSearch?: (query: string) => void;
  onFilter?: (filters: Record<string, FilterValue>) => void;
  onClearFilters?: () => void;
  fields?: Array<{
    label: string;
    type: string;
    icon?: React.ReactNode;
  }>;
};

export default function DashboardFilters({
  title = "Filtros",
  filterOptions,
  onSearch,
  onFilter,
  onClearFilters
}: DashboardFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, FilterValue>>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };
  
  const handleFilterChange = (id: string, value: FilterValue) => {
    const newFilters = { ...activeFilters, [id]: value };
    setActiveFilters(newFilters);
    if (onFilter) {
      onFilter(newFilters);
    }
  };
  
  const clearFilters = () => {
    setActiveFilters({});
    if (onClearFilters) {
      onClearFilters();
    }
  };
  
  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };
  
  const hasActiveFilters = Object.keys(activeFilters).length > 0;
  
  return (
    <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
      {/* Cabeçalho com título e toggle de filtros */}
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="font-bold text-gray-800">{title}</h2>
        <div className="flex space-x-2">
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors ${
              hasActiveFilters ? 'bg-[#0047CC]/10 text-[#0047CC]' : 'hover:bg-gray-100 text-gray-600'
            }`}
            onClick={toggleFilters}
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filtros
            {hasActiveFilters && (
              <span className="ml-2 bg-[#0047CC] text-white rounded-full h-5 min-w-5 flex items-center justify-center text-xs">
                {Object.keys(activeFilters).length}
              </span>
            )}
          </button>
          
          {hasActiveFilters && (
            <button 
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 flex items-center transition-colors"
              onClick={clearFilters}
            >
              <XMarkIcon className="h-4 w-4 mr-2" />
              Limpar
            </button>
          )}
        </div>
      </div>
      
      {/* Barra de pesquisa sempre visível */}
      <div className="px-6 py-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
          </div>
          <input 
            type="text"
            placeholder="Buscar..." 
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC]"
          />
        </div>
        
        {/* Chips de filtros ativos */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([key, value]) => {
              const filterOption = filterOptions.find(option => option.id === key);
              if (!filterOption) return null;
              
              return (
                <div 
                  key={key}
                  className="flex items-center bg-[#0047CC]/10 text-[#0047CC] rounded-lg px-3 py-1.5 text-sm"
                >
                  <span>{filterOption.label}: {value.toString()}</span>
                  <button 
                    onClick={() => {
                      const newFilters = { ...activeFilters };
                      delete newFilters[key];
                      setActiveFilters(newFilters);
                      if (onFilter) onFilter(newFilters);
                    }}
                    className="ml-2 text-[#0047CC] hover:text-[#00399f]"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Painel de filtros expandido/colapsado */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filterOptions.map((filter) => (
                  <div key={filter.id} className="relative">
                    {filter.type === 'select' && (
                      <div className="relative">
                        <button
                          onClick={() => toggleDropdown(filter.id)}
                          className="w-full flex justify-between items-center bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:border-[#0047CC]/30 focus:outline-none focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC]"
                        >
                          <span>{filter.label}</span>
                          <ChevronDownIcon className={`h-4 w-4 transition-transform ${openDropdown === filter.id ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {openDropdown === filter.id && filter.options && (
                          <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto py-1">
                            {filter.options.map((option) => (
                              <button
                                key={option}
                                onClick={() => {
                                  handleFilterChange(filter.id, option);
                                  setOpenDropdown(null);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                                  activeFilters[filter.id] === option ? 'bg-[#0047CC]/10 text-[#0047CC] font-medium' : 'text-gray-700'
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {filter.type === 'date' && (
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <CalendarIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-700 hover:border-[#0047CC]/30 focus:outline-none focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC]"
                          placeholder={filter.label}
                          onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                          value={(activeFilters[filter.id] as string) || ''}
                        />
                      </div>
                    )}
                    
                    {filter.type === 'checkbox' && (
                      <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!activeFilters[filter.id]}
                            onChange={(e) => handleFilterChange(filter.id, e.target.checked)}
                            className="w-4 h-4 rounded text-[#0047CC] focus:ring-[#0047CC]/20"
                          />
                          <span className="text-sm text-gray-700">{filter.label}</span>
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors mr-2"
                >
                  Limpar Filtros
                </button>
                <button
                  onClick={toggleFilters}
                  className="px-4 py-2 bg-[#0047CC] text-white rounded-lg text-sm font-medium hover:bg-[#003CAD] transition-colors"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 