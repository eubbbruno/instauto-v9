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
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  MapIcon,
  ListBulletIcon,
  CheckBadgeIcon,
  CurrencyDollarIcon,
  TruckIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
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
    horarioFuncionamento: {
      segunda: '08:00 - 18:00',
      sabado: '08:00 - 14:00',
      domingo: 'Fechado'
    },
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
    ],
    ultimas_avaliacoes: [
      {
        cliente: 'João Silva',
        estrelas: 5,
        comentario: 'Excelente atendimento! Resolveram tudo rapidamente.',
        data: '2024-01-10'
      },
      {
        cliente: 'Maria Santos',
        estrelas: 5,
        comentario: 'Preço justo e serviço de qualidade. Recomendo!',
        data: '2024-01-08'
      }
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
    horarioFuncionamento: {
      segunda: '07:00 - 17:00',
      sabado: '07:00 - 12:00',
      domingo: 'Fechado'
    },
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
    ],
    ultimas_avaliacoes: [
      {
        cliente: 'Carlos Ferreira',
        estrelas: 4,
        comentario: 'Bom atendimento, preço ok.',
        data: '2024-01-09'
      }
    ]
  },
  {
    id: '3',
    nome: 'MegaAuto Especializada',
    endereco: 'Rua dos Mecânicos, 789 - Moema, São Paulo',
    distancia: 2.1,
    avaliacao: 4.9,
    totalAvaliacoes: 203,
    telefone: '(11) 77777-2222',
    whatsapp: '(11) 77777-2222',
    horarioFuncionamento: {
      segunda: '08:00 - 19:00',
      sabado: '08:00 - 16:00',
      domingo: '09:00 - 14:00'
    },
    verificada: true,
    foto: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400&h=200&fit=crop',
    servicos: [
      'Mecânica Geral',
      'Diagnóstico Computadorizado',
      'Injeção Eletrônica',
      'Motor',
      'Transmissão',
      'Ar Condicionado',
      'Som Automotivo'
    ],
    especialidades: ['BMW', 'Audi', 'Mercedes', 'Carros Importados'],
    precoMedio: 250,
    tempoMedioServico: '3-6 horas',
    favorita: false,
    promocoes: [],
    ultimas_avaliacoes: [
      {
        cliente: 'Ana Costa',
        estrelas: 5,
        comentario: 'Especialistas em carros importados. Vale cada centavo!',
        data: '2024-01-12'
      }
    ]
  },
  {
    id: '4',
    nome: 'Express Auto Service',
    endereco: 'Rua Rápida, 321 - Itaim Bibi, São Paulo',
    distancia: 1.8,
    avaliacao: 4.3,
    totalAvaliacoes: 67,
    telefone: '(11) 66666-3333',
    whatsapp: '(11) 66666-3333',
    horarioFuncionamento: {
      segunda: '06:00 - 20:00',
      sabado: '06:00 - 18:00',
      domingo: 'Fechado'
    },
    verificada: false,
    foto: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=200&fit=crop',
    servicos: [
      'Troca de Óleo Expressa',
      'Lavagem Completa',
      'Pneus e Rodas',
      'Bateria',
      'Filtros'
    ],
    especialidades: ['Atendimento Rápido', 'Todos os Veículos'],
    precoMedio: 80,
    tempoMedioServico: '30-60 min',
    favorita: false,
    promocoes: [
      'Troca de óleo em 15 minutos',
      'Lavagem grátis na troca de óleo'
    ],
    ultimas_avaliacoes: [
      {
        cliente: 'Roberto Lima',
        estrelas: 4,
        comentario: 'Rápido e eficiente. Preço bom.',
        data: '2024-01-11'
      }
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
  'Sistema de Freios',
  'Suspensão',
  'Câmbio',
  'Revisão Preventiva',
  'Diagnóstico Computadorizado',
  'Injeção Eletrônica',
  'Motor',
  'Transmissão',
  'Som Automotivo',
  'Pneus e Rodas',
  'Bateria'
];

export default function OficinasPage() {
  const [oficinas, setOficinas] = useState(mockOficinas);
  const [busca, setBusca] = useState('');
  const [localidade, setLocalidade] = useState('São Paulo, SP');
  const [visualizacao, setVisualizacao] = useState<'lista' | 'mapa'>('lista');
  const [filtros, setFiltros] = useState({
    servicos: [] as string[],
    avaliacao: 0,
    distancia: 5,
    preco: [0, 500] as [number, number],
    apenasVerificadas: false,
    funcionandoAgora: false
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const toggleFavorito = (oficinaId: string) => {
    setOficinas(prev => prev.map(oficina => 
      oficina.id === oficinaId 
        ? { ...oficina, favorita: !oficina.favorita }
        : oficina
    ));
  };

  const oficinasFiltradas = oficinas.filter(oficina => {
    // Busca por nome, endereço ou serviços
    const termoBusca = busca.toLowerCase();
    const matchBusca = !busca || 
      oficina.nome.toLowerCase().includes(termoBusca) ||
      oficina.endereco.toLowerCase().includes(termoBusca) ||
      oficina.servicos.some(servico => servico.toLowerCase().includes(termoBusca));

    // Filtro de serviços
    const matchServicos = filtros.servicos.length === 0 ||
      filtros.servicos.some(servico => oficina.servicos.includes(servico));

    // Filtro de avaliação
    const matchAvaliacao = oficina.avaliacao >= filtros.avaliacao;

    // Filtro de distância
    const matchDistancia = oficina.distancia <= filtros.distancia;

    // Filtro de preço
    const matchPreco = oficina.precoMedio >= filtros.preco[0] && 
                      oficina.precoMedio <= filtros.preco[1];

    // Filtro de verificadas
    const matchVerificada = !filtros.apenasVerificadas || oficina.verificada;

    return matchBusca && matchServicos && matchAvaliacao && 
           matchDistancia && matchPreco && matchVerificada;
  });

  const renderEstrelas = (avaliacao: number, tamanho: string = 'h-4 w-4') => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((estrela) => (
          <StarIconSolid
            key={estrela}
            className={`${tamanho} ${
              estrela <= avaliacao ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Encontre a Oficina Ideal</h1>
              <p className="text-gray-600 mt-1">Oficinas próximas a você com os melhores preços e avaliações</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setVisualizacao('lista')}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  visualizacao === 'lista' 
                    ? 'bg-[#0047CC] text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <ListBulletIcon className="h-4 w-4 mr-1 inline" />
                Lista
              </button>
              <button
                onClick={() => setVisualizacao('mapa')}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  visualizacao === 'mapa' 
                    ? 'bg-[#0047CC] text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <MapIcon className="h-4 w-4 mr-1 inline" />
                Mapa
              </button>
            </div>
          </div>

          {/* Barra de Busca */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar oficinas, serviços..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
              />
            </div>
            
            <div className="md:col-span-4 relative">
              <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={localidade}
                onChange={(e) => setLocalidade(e.target.value)}
                placeholder="Digite sua localização"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
              />
            </div>
            
            <div className="md:col-span-2">
              <button
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filtros
              </button>
            </div>
          </div>

          {/* Painel de Filtros */}
          {mostrarFiltros && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-gray-50 rounded-lg border"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Serviços */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Serviços</label>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {servicosDisponiveis.slice(0, 8).map(servico => (
                      <label key={servico} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filtros.servicos.includes(servico)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFiltros(prev => ({
                                ...prev,
                                servicos: [...prev.servicos, servico]
                              }));
                            } else {
                              setFiltros(prev => ({
                                ...prev,
                                servicos: prev.servicos.filter(s => s !== servico)
                              }));
                            }
                          }}
                          className="h-4 w-4 text-[#0047CC] border-gray-300 rounded focus:ring-[#0047CC]"
                        />
                        <span className="ml-2 text-sm text-gray-700">{servico}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Avaliação e Distância */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Avaliação mínima: {filtros.avaliacao} estrelas
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.5"
                      value={filtros.avaliacao}
                      onChange={(e) => setFiltros(prev => ({ ...prev, avaliacao: parseFloat(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Distância máxima: {filtros.distancia} km
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={filtros.distancia}
                      onChange={(e) => setFiltros(prev => ({ ...prev, distancia: parseInt(e.target.value) }))}
                      className="w-full"
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
                      className="h-4 w-4 text-[#0047CC] border-gray-300 rounded focus:ring-[#0047CC]"
                    />
                    <span className="ml-2 text-sm text-gray-700">Apenas oficinas verificadas</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox" 
                      checked={filtros.funcionandoAgora}
                      onChange={(e) => setFiltros(prev => ({ ...prev, funcionandoAgora: e.target.checked }))}
                      className="h-4 w-4 text-[#0047CC] border-gray-300 rounded focus:ring-[#0047CC]"
                    />
                    <span className="ml-2 text-sm text-gray-700">Funcionando agora</span>
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Resultados */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            {oficinasFiltradas.length} oficina{oficinasFiltradas.length !== 1 ? 's' : ''} encontrada{oficinasFiltradas.length !== 1 ? 's' : ''}
          </p>
          
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0047CC] focus:border-transparent">
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
                      <span className="ml-4 text-sm font-medium text-[#0047CC]">
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
                        className="w-full bg-[#0047CC] hover:bg-[#0055EB] text-white px-4 py-2 rounded-lg font-medium transition-colors text-center block"
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