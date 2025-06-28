"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  StarIcon,
  ClockIcon,
  PhoneIcon,
  ChatBubbleLeftIcon,
  HeartIcon,
  FunnelIcon,
  MapIcon,
  ListBulletIcon,
  CheckBadgeIcon,
  CurrencyDollarIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import Link from 'next/link';

// Dados mockados de oficinas
const mockOficinas = [
  {
    id: '1',
    nome: 'Auto Center Silva',
    endereco: 'Rua das Oficinas, 123 - Vila Madalena, São Paulo',
    distancia: 0.8,
    avaliacao: 4.8,
    totalAvaliacoes: 156,
    telefone: '(11) 99999-0000',
    whatsapp: '(11) 99999-0000',
    verificada: true,
    foto: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=200&fit=crop',
    servicos: [
      'Mecânica Geral',
      'Elétrica Automotiva',
      'Funilaria e Pintura',
      'Troca de Óleo',
      'Alinhamento e Balanceamento',
      'Ar Condicionado'
    ],
    especialidades: ['Honda', 'Toyota', 'Ford', 'Chevrolet'],
    precoMedio: 150,
    tempoMedioServico: '2-4 horas',
    favorita: false,
    promocoes: [
      'Troca de óleo + filtro por R$ 89,90',
      '10% de desconto na primeira visita'
    ]
  },
  {
    id: '2',
    nome: 'Oficina Costa & Cia',
    endereco: 'Av. Principal, 456 - Pinheiros, São Paulo',
    distancia: 1.2,
    avaliacao: 4.5,
    totalAvaliacoes: 89,
    telefone: '(11) 88888-1111',
    whatsapp: '(11) 88888-1111',
    verificada: true,
    foto: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=400&h=200&fit=crop',
    servicos: [
      'Revisão Preventiva',
      'Troca de Óleo',
      'Sistema de Freios',
      'Suspensão',
      'Câmbio'
    ],
    especialidades: ['Volkswagen', 'Fiat', 'Renault'],
    precoMedio: 120,
    tempoMedioServico: '1-3 horas',
    favorita: true,
    promocoes: [
      'Revisão completa por R$ 199,90'
    ]
  }
];

const servicosDisponiveis = [
  'Mecânica Geral',
  'Elétrica Automotiva', 
  'Funilaria e Pintura',
  'Troca de Óleo',
  'Alinhamento e Balanceamento',
  'Ar Condicionado',
  'Diagnóstico Computadorizado',
  'Sistema de Freios',
  'Suspensão'
];

export default function BuscarOficinasPage() {
  const [termoBusca, setTermoBusca] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [visualizacao, setVisualizacao] = useState<'lista' | 'mapa'>('lista');
  const [oficinas, setOficinas] = useState(mockOficinas);
  
  const [filtros, setFiltros] = useState({
    servicos: [] as string[],
    distanciaMaxima: 10,
    avaliacaoMinima: 0,
    precoMaximo: 1000,
    apenasVerificadas: false
  });

  // Função para alternar favorito
  const toggleFavorito = (oficinaId: string) => {
    setOficinas(prev => prev.map(oficina => 
      oficina.id === oficinaId 
        ? { ...oficina, favorita: !oficina.favorita }
        : oficina
    ));
  };

  // Filtrar oficinas
  const oficinasFiltradas = oficinas.filter(oficina => {
    const matchTermoBusca = !termoBusca || 
      oficina.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
      oficina.servicos.some(servico => servico.toLowerCase().includes(termoBusca.toLowerCase()));
    
    const matchLocalizacao = !localizacao || 
      oficina.endereco.toLowerCase().includes(localizacao.toLowerCase());
    
    const matchServicos = filtros.servicos.length === 0 ||
      filtros.servicos.some(servico => oficina.servicos.includes(servico));
    
    const matchDistancia = oficina.distancia <= filtros.distanciaMaxima;
    const matchAvaliacao = oficina.avaliacao >= filtros.avaliacaoMinima;
    const matchPreco = oficina.precoMedio <= filtros.precoMaximo;
    const matchVerificada = !filtros.apenasVerificadas || oficina.verificada;
    
    return matchTermoBusca && matchLocalizacao && matchServicos && 
           matchDistancia && matchAvaliacao && matchPreco && matchVerificada;
  });

  // Função para renderizar estrelas
  const renderEstrelas = (avaliacao: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((estrela) => (
          <StarIcon
            key={estrela}
            className={`h-4 w-4 ${
              estrela <= avaliacao ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com busca */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Buscar Oficinas</h1>
              <p className="text-gray-600">Encontre as melhores oficinas próximas a você</p>
            </div>
            <Link
              href="/motorista"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Voltar ao Dashboard
            </Link>
          </div>

          {/* Barra de busca */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por oficina ou serviço..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Localização..."
                value={localizacao}
                onChange={(e) => setLocalizacao(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filtros
              {mostrarFiltros && <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded-full">Aberto</span>}
            </button>
          </div>

          {/* Controles de visualização */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setVisualizacao('lista')}
                className={`p-2 rounded-lg transition-colors ${
                  visualizacao === 'lista' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <ListBulletIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setVisualizacao('mapa')}
                className={`p-2 rounded-lg transition-colors ${
                  visualizacao === 'mapa' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <MapIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Painel de filtros */}
        {mostrarFiltros && (
          <div className="border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {/* Filtro de Serviços */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Serviços</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {servicosDisponiveis.map(servico => (
                      <label key={servico} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filtros.servicos.includes(servico)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFiltros(prev => ({ ...prev, servicos: [...prev.servicos, servico] }));
                            } else {
                              setFiltros(prev => ({ ...prev, servicos: prev.servicos.filter(s => s !== servico) }));
                            }
                          }}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{servico}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Filtros de Range */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Distância máxima: {filtros.distanciaMaxima} km
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={filtros.distanciaMaxima}
                      onChange={(e) => setFiltros(prev => ({ ...prev, distanciaMaxima: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Avaliação mínima: {filtros.avaliacaoMinima} estrelas
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.5"
                      value={filtros.avaliacaoMinima}
                      onChange={(e) => setFiltros(prev => ({ ...prev, avaliacaoMinima: parseFloat(e.target.value) }))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Preço máximo: R$ {filtros.precoMaximo}
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="1000"
                      step="50"
                      value={filtros.precoMaximo}
                      onChange={(e) => setFiltros(prev => ({ ...prev, precoMaximo: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Outros Filtros */}
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filtros.apenasVerificadas}
                      onChange={(e) => setFiltros(prev => ({ ...prev, apenasVerificadas: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Apenas oficinas verificadas</span>
                  </label>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Resultados */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            {oficinasFiltradas.length} oficina{oficinasFiltradas.length !== 1 ? 's' : ''} encontrada{oficinasFiltradas.length !== 1 ? 's' : ''}
          </p>
          
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Ordenar por distância</option>
            <option>Ordenar por avaliação</option>
            <option>Ordenar por preço</option>
          </select>
        </div>

        {/* Lista de Oficinas */}
        {visualizacao === 'lista' && (
          <div className="space-y-6">
            {oficinasFiltradas.map((oficina) => (
              <motion.div
                key={oficina.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
                  {/* Imagem */}
                  <div className="lg:col-span-3">
                    <div className="relative">
                      <img
                        src={oficina.foto}
                        alt={oficina.nome}
                        className="w-full h-48 lg:h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => toggleFavorito(oficina.id)}
                        className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                      >
                        {oficina.favorita ? (
                          <HeartIconSolid className="h-5 w-5 text-red-500" />
                        ) : (
                          <HeartIcon className="h-5 w-5 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Informações Principais */}
                  <div className="lg:col-span-6 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-xl font-bold text-gray-900">{oficina.nome}</h3>
                          {oficina.verificada && (
                            <CheckBadgeIcon className="h-6 w-6 text-blue-500" />
                          )}
                        </div>
                        <div className="flex items-center space-x-4 mt-1">
                          {renderEstrelas(oficina.avaliacao)}
                          <span className="text-sm text-gray-600">
                            {oficina.avaliacao} ({oficina.totalAvaliacoes} avaliações)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      <span className="text-sm">{oficina.endereco}</span>
                      <span className="ml-4 text-sm font-medium text-blue-600">
                        {oficina.distancia} km
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {oficina.servicos.slice(0, 4).map(servico => (
                        <span
                          key={servico}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                        >
                          {servico}
                        </span>
                      ))}
                      {oficina.servicos.length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{oficina.servicos.length - 4} mais
                        </span>
                      )}
                    </div>

                    {oficina.promocoes.length > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-green-800 text-sm font-medium">🎉 Promoções:</p>
                        {oficina.promocoes.map((promocao, index) => (
                          <p key={index} className="text-green-700 text-sm">• {promocao}</p>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="lg:col-span-3 space-y-3">
                    <div className="text-right">
                      <div className="flex items-center justify-end space-x-2 text-sm text-gray-600">
                        <CurrencyDollarIcon className="h-4 w-4" />
                        <span>A partir de R$ {oficina.precoMedio}</span>
                      </div>
                      <div className="flex items-center justify-end space-x-2 text-sm text-gray-600 mt-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>{oficina.tempoMedioServico}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Link
                        href={`/oficinas/${oficina.id}`}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-center block"
                      >
                        Ver Detalhes
                      </Link>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={`tel:${oficina.telefone}`}
                          className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <PhoneIcon className="h-4 w-4 mr-1" />
                          <span className="text-sm">Ligar</span>
                        </a>
                        
                        <a
                          href={`https://wa.me/${oficina.whatsapp.replace(/\D/g, '')}`}
                          className="flex items-center justify-center px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                        >
                          <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                          <span className="text-sm">WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Visualização Mapa */}
        {visualizacao === 'mapa' && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Mapa em Desenvolvimento</h3>
                <p className="text-gray-600">A visualização em mapa será implementada em breve</p>
              </div>
            </div>
          </div>
        )}

        {/* Estado vazio */}
        {oficinasFiltradas.length === 0 && (
          <div className="text-center py-12">
            <WrenchScrewdriverIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma oficina encontrada</h3>
            <p className="text-gray-600">Tente ajustar os filtros ou buscar por outro termo</p>
          </div>
        )}
      </div>
    </div>
  );
} 