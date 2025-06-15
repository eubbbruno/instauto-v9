"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  StarIcon,
  ClockIcon,
  PhoneIcon,
  ChatBubbleLeftIcon,
  HeartIcon,
  CheckBadgeIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useWorkshops } from '@/hooks/useSupabase';
import toast from 'react-hot-toast';

export default function OficinasSupabasePage() {
  const { workshops, loading, error } = useWorkshops();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredWorkshops, setFilteredWorkshops] = useState<any[]>([]);

  // Filtrar oficinas baseado na busca
  useEffect(() => {
    if (!workshops) return;

    const filtered = workshops.filter(workshop => 
      workshop.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workshop.services.some((service: string) => 
        service.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      workshop.specialties.some((specialty: string) => 
        specialty.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    setFilteredWorkshops(filtered);
  }, [workshops, searchTerm]);

  const renderEstrelas = (avaliacao: number, tamanho: string = 'h-4 w-4') => {
    const estrelas = [];
    const estrelasCompletas = Math.floor(avaliacao);
    const temMeiaEstrela = avaliacao % 1 !== 0;

    for (let i = 0; i < estrelasCompletas; i++) {
      estrelas.push(
        <StarIconSolid key={i} className={`${tamanho} text-yellow-400`} />
      );
    }

    if (temMeiaEstrela) {
      estrelas.push(
        <div key="meia" className="relative">
          <StarIcon className={`${tamanho} text-gray-300`} />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <StarIconSolid className={`${tamanho} text-yellow-400`} />
          </div>
        </div>
      );
    }

    const estrelasVazias = 5 - Math.ceil(avaliacao);
    for (let i = 0; i < estrelasVazias; i++) {
      estrelas.push(
        <StarIcon key={`vazia-${i}`} className={`${tamanho} text-gray-300`} />
      );
    }

    return estrelas;
  };

  const formatarEndereco = (address: any) => {
    if (typeof address === 'string') return address;
    return `${address.rua} - ${address.bairro}, ${address.cidade}`;
  };

  const formatarPreco = (priceRange: string) => {
    const precos = {
      '$': 'Econômico',
      '$$': 'Moderado', 
      '$$$': 'Premium'
    };
    return precos[priceRange as keyof typeof precos] || 'Consulte';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando oficinas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro ao carregar oficinas</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Oficinas Próximas
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredWorkshops.length} oficinas encontradas
              </p>
            </div>

            {/* Busca */}
            <div className="relative max-w-md w-full">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por oficina ou serviço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Oficinas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {filteredWorkshops.map((workshop, index) => (
            <motion.div
              key={workshop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Foto da Oficina */}
                  <div className="lg:w-64 h-48 bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={`https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=200&fit=crop&sig=${workshop.id}`}
                      alt={workshop.business_name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Informações */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {workshop.business_name}
                          </h3>
                          {workshop.verified && (
                            <CheckBadgeIcon className="h-5 w-5 text-blue-500" />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 mb-2">
                          {renderEstrelas(workshop.rating)}
                          <span className="text-sm text-gray-600 ml-1">
                            {workshop.rating} ({workshop.total_reviews} avaliações)
                          </span>
                        </div>

                        <div className="flex items-center text-gray-600 text-sm mb-2">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          {formatarEndereco(workshop.address)}
                        </div>

                        <div className="flex items-center text-gray-600 text-sm">
                          <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                          Faixa de preço: {formatarPreco(workshop.price_range)}
                        </div>
                      </div>

                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <HeartIcon className="h-5 w-5 text-gray-400" />
                      </button>
                    </div>

                    {/* Serviços */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Serviços:</h4>
                      <div className="flex flex-wrap gap-2">
                        {workshop.services.slice(0, 4).map((servico: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                          >
                            {servico}
                          </span>
                        ))}
                        {workshop.services.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{workshop.services.length - 4} mais
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Especialidades */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Especialidades:</h4>
                      <div className="flex flex-wrap gap-2">
                        {workshop.specialties.map((especialidade: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full"
                          >
                            {especialidade}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/oficinas/${workshop.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Ver Detalhes
                      </Link>
                      
                      <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                        <ChatBubbleLeftIcon className="h-4 w-4" />
                        WhatsApp
                      </button>
                      
                      <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                        <PhoneIcon className="h-4 w-4" />
                        {workshop.profiles?.phone || 'Ligar'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredWorkshops.length === 0 && !loading && (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma oficina encontrada
            </h3>
            <p className="text-gray-600">
              Tente ajustar sua busca ou filtros
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 