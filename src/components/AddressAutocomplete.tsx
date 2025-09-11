"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Search, Navigation, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AddressSuggestion {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string; // cidade
  uf: string;
  ibge: string;
  type?: 'cep' | 'city' | 'district';
  display: string;
}

interface AddressAutocompleteProps {
  placeholder?: string;
  onAddressSelect: (address: AddressSuggestion) => void;
  className?: string;
}

interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  erro?: boolean;
}

export default function AddressAutocomplete({ 
  placeholder = "Digite seu endereço ou CEP",
  onAddressSelect,
  className = ""
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lista de cidades populares como fallback
  const popularCities = [
    "São Paulo, SP",
    "Rio de Janeiro, RJ", 
    "Belo Horizonte, MG",
    "Brasília, DF",
    "Salvador, BA",
    "Fortaleza, CE",
    "Curitiba, PR",
    "Recife, PE",
    "Porto Alegre, RS",
    "Goiânia, GO"
  ];

  // Buscar CEP na API do ViaCEP
  const searchCEP = async (cep: string): Promise<AddressSuggestion | null> => {
    try {
      const cleanCEP = cep.replace(/\D/g, '');
      if (cleanCEP.length !== 8) return null;
      
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const data: ViaCEPResponse = await response.json();
      
      if (data.erro) return null;
      
      return {
        ...data,
        type: 'cep',
        display: `${data.logradouro ? data.logradouro + ', ' : ''}${data.bairro}, ${data.localidade} - ${data.uf}`
      };
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      return null;
    }
  };

  // Buscar endereços por cidade/logradouro
  const searchAddress = async (address: string): Promise<AddressSuggestion[]> => {
    try {
      const parts = address.split(',').map(p => p.trim());
      
      if (parts.length >= 2) {
        const [city, state] = parts.slice(-2);
        const cleanState = state.replace(/[^A-Z]/g, '').slice(0, 2);
        
        if (cleanState.length === 2) {
          const response = await fetch(`https://viacep.com.br/ws/${cleanState}/${city}/json/`);
          const data: ViaCEPResponse[] = await response.json();
          
          if (Array.isArray(data)) {
            return data.slice(0, 8).map((item: ViaCEPResponse) => ({
              ...item,
              type: 'city' as const,
              display: `${item.localidade} - ${item.uf}`
            }));
          }
        }
      }
      
      return [];
    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
      return [];
    }
  };

  // Buscar sugestões baseadas na query
  const fetchSuggestions = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    
    try {
      const cleanQuery = searchQuery.trim();
      let results: AddressSuggestion[] = [];

      // Se parece com CEP (só números)
      if (/^\d{5}-?\d{0,3}$/.test(cleanQuery)) {
        const cepResult = await searchCEP(cleanQuery);
        if (cepResult) {
          results = [cepResult];
        }
      } 
      // Se contém vírgula, buscar como endereço completo
      else if (cleanQuery.includes(',')) {
        results = await searchAddress(cleanQuery);
      }
      // Buscar em cidades populares
      else {
        const filtered = popularCities
          .filter(city => 
            city.toLowerCase().includes(cleanQuery.toLowerCase())
          )
          .slice(0, 5)
          .map(city => {
            const [localidade, uf] = city.split(', ');
            return {
              cep: '',
              logradouro: '',
              bairro: '',
              localidade,
              uf,
              ibge: '',
              type: 'city' as const,
              display: city
            };
          });
        
        results = filtered;
      }

      setSuggestions(results);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Obter localização atual
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (_position) => {
          try {
            // Usar reverse geocoding para obter endereço
            // Aqui você pode integrar com uma API de reverse geocoding
            setQuery("Localização atual detectada");
            onAddressSelect({
              cep: '',
              logradouro: '',
              bairro: '',
              localidade: 'Localização Atual',
              uf: '',
              ibge: '',
              type: 'cep',
              display: 'Localização Atual'
            });
          } catch (error) {
            console.error('Erro ao obter endereço:', error);
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          setIsLoading(false);
        }
      );
    }
  };

  // Debounce para as sugestões
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        fetchSuggestions(query);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Fechar sugestões ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navegação por teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelectSuggestion = (suggestion: AddressSuggestion) => {
    setQuery(suggestion.display);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    onAddressSelect(suggestion);
  };

  const handleSearch = () => {
    if (query.trim()) {
      // Se não há sugestão selecionada, criar uma baseada na query
      const searchSuggestion: AddressSuggestion = {
        cep: '',
        logradouro: '',
        bairro: '',
        localidade: query.trim(),
        uf: '',
        ibge: '',
        type: 'city',
        display: query.trim()
      };
      onAddressSelect(searchSuggestion);
    }
  };

  const clearInput = () => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden shadow-sm bg-white hover:border-[#0047CC]/30 transition-colors">
          <div className="absolute left-3 z-10">
            <MapPin className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query && setShowSuggestions(true)}
            placeholder={placeholder}
            className="block w-full pl-8 md:pl-10 pr-16 md:pr-20 py-2.5 md:py-3 focus:outline-none text-gray-700 bg-transparent text-sm md:text-base"
          />
          
          <div className="absolute right-12 flex items-center">
            {query && (
              <button
                onClick={clearInput}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
          
          <button
            onClick={getCurrentLocation}
            className="absolute right-12 p-1 hover:bg-gray-100 rounded-full transition-colors"
            title="Usar localização atual"
          >
            <Navigation className="h-4 w-4 text-gray-400" />
          </button>
          
          <button 
            onClick={handleSearch}
            className="bg-[#0047CC] hover:bg-[#003DA6] p-3 text-white transition-colors flex items-center justify-center min-w-12 h-12"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            ) : (
              <Search className="h-5 w-5" />
            )}
          </button>
        </div>
        
        <div className="text-sm text-gray-500 mt-2">
          Encontre oficinas próximas a você
        </div>
      </div>

      {/* Sugestões */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="max-h-64 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={`${suggestion.cep}-${index}`}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                    selectedIndex === index ? 'bg-[#0047CC]/5 border-[#0047CC]/20' : ''
                  }`}
                  whileHover={{ backgroundColor: "rgba(0, 71, 204, 0.05)" }}
                >
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {suggestion.display}
                      </div>
                      {suggestion.cep && (
                        <div className="text-sm text-gray-500">
                          CEP: {suggestion.cep}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
            
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
              <div className="text-xs text-gray-500 text-center">
                Use as setas ↑↓ para navegar e Enter para selecionar
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 