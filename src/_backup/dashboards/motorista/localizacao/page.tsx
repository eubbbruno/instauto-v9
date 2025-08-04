"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPinIcon,
  MagnifyingGlassIcon,
  StarIcon,
  ClockIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Oficina {
  id: string;
  nome: string;
  endereco: string;
  distancia: string;
  rating: number;
  reviews: number;
  telefone: string;
  horarioFuncionamento: string;
  especialidades: string[];
  preco: 'baixo' | 'medio' | 'alto';
  tempoEstimado: string;
}

export default function LocalizacaoPage() {
  const [filtroEspecialidade, setFiltroEspecialidade] = useState<string>('todos');
  const [filtroPreco, setFiltroPreco] = useState<string>('todos');
  const [busca, setBusca] = useState('');

  const oficinas: Oficina[] = [
    {
      id: 'auto-center-silva',
      nome: 'Auto Center Silva',
      endereco: 'Rua das Palmeiras, 123 - Vila Madalena',
      distancia: '0.8 km',
      rating: 4.8,
      reviews: 127,
      telefone: '(11) 3456-7890',
      horarioFuncionamento: '8h às 18h',
      especialidades: ['Mecânica Geral', 'Elétrica', 'Ar Condicionado'],
      preco: 'medio',
      tempoEstimado: '2-3 horas'
    },
    {
      id: 'oficina-costa',
      nome: 'Oficina Costa',
      endereco: 'Av. Paulista, 456 - Bela Vista',
      distancia: '1.2 km',
      rating: 4.6,
      reviews: 89,
      telefone: '(11) 2345-6789',
      horarioFuncionamento: '7h às 17h',
      especialidades: ['Freios', 'Suspensão', 'Alinhamento'],
      preco: 'alto',
      tempoEstimado: '1-2 horas'
    },
    {
      id: 'mecanica-express',
      nome: 'Mecânica Express',
      endereco: 'Rua Augusta, 789 - Consolação',
      distancia: '1.5 km',
      rating: 4.3,
      reviews: 156,
      telefone: '(11) 4567-8901',
      horarioFuncionamento: '8h às 19h',
      especialidades: ['Troca de Óleo', 'Filtros', 'Revisão'],
      preco: 'baixo',
      tempoEstimado: '30min - 1h'
    },
    {
      id: 'centro-automotivo-garcia',
      nome: 'Centro Automotivo Garcia',
      endereco: 'Rua Oscar Freire, 321 - Jardins',
      distancia: '2.1 km',
      rating: 4.9,
      reviews: 203,
      telefone: '(11) 5678-9012',
      horarioFuncionamento: '7h às 18h',
      especialidades: ['Câmbio', 'Motor', 'Injeção Eletrônica'],
      preco: 'alto',
      tempoEstimado: '4-6 horas'
    }
  ];

  const especialidades = ['Mecânica Geral', 'Elétrica', 'Freios', 'Suspensão', 'Troca de Óleo', 'Ar Condicionado'];

  const oficinasFiltradas = oficinas.filter(oficina => {
    const matchBusca = oficina.nome.toLowerCase().includes(busca.toLowerCase()) ||
                      oficina.endereco.toLowerCase().includes(busca.toLowerCase());
    
    const matchEspecialidade = filtroEspecialidade === 'todos' || 
                              oficina.especialidades.some(esp => esp.includes(filtroEspecialidade));
    
    const matchPreco = filtroPreco === 'todos' || oficina.preco === filtroPreco;
    
    return matchBusca && matchEspecialidade && matchPreco;
  });

  const getPrecoColor = (preco: string) => {
    switch (preco) {
      case 'baixo':
        return 'text-green-600 bg-green-50';
      case 'medio':
        return 'text-yellow-600 bg-yellow-50';
      case 'alto':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPrecoLabel = (preco: string) => {
    switch (preco) {
      case 'baixo':
        return '$';
      case 'medio':
        return '$$';
      case 'alto':
        return '$$$';
      default:
        return '-';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Oficinas Próximas</h1>
          <p className="text-gray-600">
            Encontre oficinas especializadas perto de você com base na sua localização atual.
          </p>
        </div>
        
        <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-2 rounded-lg">
          <MapPinIcon className="h-5 w-5 mr-2" />
          <span className="font-medium">Vila Madalena, São Paulo</span>
        </div>
      </div>

      {/* Busca e Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4">
        {/* Barra de busca */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou endereço..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
          />
        </div>

        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Especialidade</label>
            <select
              value={filtroEspecialidade}
              onChange={(e) => setFiltroEspecialidade(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC]"
            >
              <option value="todos">Todas as especialidades</option>
              {especialidades.map(esp => (
                <option key={esp} value={esp}>{esp}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Faixa de Preço</label>
            <select
              value={filtroPreco}
              onChange={(e) => setFiltroPreco(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC]"
            >
              <option value="todos">Todas as faixas</option>
              <option value="baixo">$ - Econômico</option>
              <option value="medio">$$ - Intermediário</option>
              <option value="alto">$$$ - Premium</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Oficinas */}
      <div className="space-y-4">
        {oficinasFiltradas.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma oficina encontrada</h3>
            <p className="text-gray-600">Tente ajustar os filtros ou buscar por outros termos.</p>
          </div>
        ) : (
          oficinasFiltradas.map((oficina, index) => (
            <motion.div
              key={oficina.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{oficina.nome}</h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm">{oficina.endereco}</span>
                        <span className="mx-2">•</span>
                        <span className="text-sm font-medium text-[#0047CC]">{oficina.distancia}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-bold ${getPrecoColor(oficina.preco)}`}>
                        {getPrecoLabel(oficina.preco)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium">{oficina.rating}</span>
                      <span className="ml-1 text-sm text-gray-500">({oficina.reviews} avaliações)</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      <span className="text-sm">{oficina.horarioFuncionamento}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <PhoneIcon className="h-4 w-4 mr-1" />
                      <span className="text-sm">{oficina.telefone}</span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-700">Especialidades: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {oficina.especialidades.map(esp => (
                        <span key={esp} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                          {esp}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Tempo estimado:</span> {oficina.tempoEstimado}
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 lg:ml-6">
                  <Link href={`/oficinas/${oficina.id}`}>
                    <button className="bg-[#0047CC] hover:bg-[#0055EB] text-white px-6 py-3 rounded-lg font-medium transition-colors text-center w-full">
                      Ver Detalhes
                    </button>
                  </Link>
                  
                  <Link href={`/agendar/${oficina.id}`}>
                    <button className="bg-[#FFDE59] hover:bg-[#FFDE59]/90 text-[#0047CC] px-6 py-3 rounded-lg font-medium transition-colors text-center w-full">
                      Agendar Serviço
                    </button>
                  </Link>
                  
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors text-center w-full">
                    ❤️ Favoritar
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
} 