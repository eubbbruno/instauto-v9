"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Loader } from '@googlemaps/js-api-loader';
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

// Componentes de layout
import Header from "../motoristas/components/Header";
import Footer from "../motoristas/components/Footer";

// Componente Google Maps inline
function GoogleMapComponent({ oficinas }: { oficinas: typeof mockOficinas }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Hook de geolocalização
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.log('Geolocalização não disponível:', error);
          // Usar localização padrão (São Paulo)
          setUserLocation({ latitude: -23.5505, longitude: -46.6333 });
        }
      );
    } else {
      // Usar localização padrão (São Paulo)
      setUserLocation({ latitude: -23.5505, longitude: -46.6333 });
    }
  }, []);

  useEffect(() => {
    if (!userLocation) return; // Aguardar geolocalização

    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
          version: 'weekly',
        });

        await loader.load();

        if (!mapRef.current) return;

        const mapInstance = new google.maps.Map(mapRef.current, {
          center: { lat: userLocation.latitude, lng: userLocation.longitude },
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
        });

        // Adicionar marcador da localização do usuário
        new google.maps.Marker({
          position: { lat: userLocation.latitude, lng: userLocation.longitude },
          map: mapInstance,
          title: 'Sua localização',
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                <circle cx="15" cy="15" r="15" fill="#FFDE59" stroke="#0047CC" stroke-width="3"/>
                <circle cx="15" cy="15" r="8" fill="#0047CC"/>
                <circle cx="15" cy="15" r="3" fill="white"/>
              </svg>
            `)}`,
            scaledSize: new google.maps.Size(30, 30),
            anchor: new google.maps.Point(15, 15)
          }
        });

        // Adicionar círculo de busca de 10km
        new google.maps.Circle({
          center: { lat: userLocation.latitude, lng: userLocation.longitude },
          radius: 10000, // 10km
          strokeColor: '#0047CC',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#0047CC',
          fillOpacity: 0.1,
          map: mapInstance
        });

        setIsLoading(false);

        // Adicionar marcadores das oficinas
        oficinas.forEach((oficina) => {
          if (oficina.latitude && oficina.longitude) {
            const marker = new google.maps.Marker({
              position: { lat: oficina.latitude, lng: oficina.longitude },
              map: mapInstance,
              title: oficina.nome,
              icon: {
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                  <svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 0C8.954 0 0 8.954 0 20c0 20 20 30 20 30s20-10 20-30C40 8.954 31.046 0 20 0z" fill="#0047CC"/>
                    <circle cx="20" cy="20" r="12" fill="white"/>
                    <path d="M15 15h2v5h3v2h-5v-7zm0-3h5v2h-5v-2z" fill="#0047CC"/>
                  </svg>
                `)}`,
                scaledSize: new google.maps.Size(40, 50),
                anchor: new google.maps.Point(20, 50)
              }
            });

            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div class="p-3 max-w-xs">
                  <h3 class="font-bold text-gray-900 mb-1">${oficina.nome}</h3>
                  <div class="flex items-center mb-2">
                    ${Array.from({length: 5}, (_, i) => 
                      `<svg class="w-4 h-4 ${i < Math.floor(oficina.avaliacao) ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>`
                    ).join('')}
                    <span class="ml-1 text-sm text-gray-600">${oficina.avaliacao.toFixed(1)}</span>
                  </div>
                  <p class="text-sm text-gray-600 mb-2">${oficina.endereco}</p>
                  <p class="text-xs text-blue-600 font-medium mb-3">${oficina.distancia}km de distância</p>
                  <div class="flex space-x-2">
                    <a href="tel:${oficina.telefone}" class="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center">
                      📞 Ligar
                    </a>
                    <a href="/oficinas/${oficina.id}" class="flex-1 bg-yellow-500 text-gray-900 px-3 py-2 rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors text-center">
                      👁️ Ver
                    </a>
                  </div>
                </div>
              `,
            });

            marker.addListener('click', () => {
              infoWindow.open(mapInstance, marker);
            });
          }
        });

        // Ajustar bounds para mostrar usuário e oficinas
        if (oficinas.length > 0) {
          const bounds = new google.maps.LatLngBounds();
          
          // Incluir localização do usuário
          bounds.extend({ lat: userLocation.latitude, lng: userLocation.longitude });
          
          // Incluir oficinas
          oficinas.forEach(oficina => {
            if (oficina.latitude && oficina.longitude) {
              bounds.extend({ lat: oficina.latitude, lng: oficina.longitude });
            }
          });

          mapInstance.fitBounds(bounds);

          // Garantir zoom máximo
          google.maps.event.addListenerOnce(mapInstance, 'bounds_changed', () => {
            if (mapInstance.getZoom()! > 15) {
              mapInstance.setZoom(15);
            }
          });
        }
      } catch (err) {
        console.error('Erro ao carregar Google Maps:', err);
        setIsLoading(false);
      }
    };

    initMap();
  }, [oficinas, userLocation]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0047CC] mx-auto mb-2"></div>
            <p className="text-gray-600">Carregando mapa...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="h-96 rounded-lg overflow-hidden">
        <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
}

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
    latitude: -23.5505,
    longitude: -46.6333,
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
    latitude: -23.5489,
    longitude: -46.6388,
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
  const searchParams = useSearchParams();
  const [termoBusca, setTermoBusca] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [visualizacao, setVisualizacao] = useState<'lista' | 'mapa'>('lista');
  const [oficinas, setOficinas] = useState(mockOficinas);
  
  // Estados do modal de agendamento
  const [mostrarModalAgendamento, setMostrarModalAgendamento] = useState(false);
  const [oficinaParaAgendar, setOficinaParaAgendar] = useState<typeof mockOficinas[0] | null>(null);
  
  const [filtros, setFiltros] = useState({
    servicos: [] as string[],
    distanciaMaxima: 10,
    avaliacaoMinima: 0,
    precoMaximo: 1000,
    apenasVerificadas: false
  });

  // Inicializar com parâmetros da URL
  useEffect(() => {
    const endereco = searchParams.get('endereco');
    const cidade = searchParams.get('cidade');
    
    if (endereco) {
      setLocalizacao(endereco);
    } else if (cidade) {
      setLocalizacao(cidade);
    }
  }, [searchParams]);

  // Função para alternar favorito
  const toggleFavorito = (oficinaId: string) => {
    setOficinas(prev => prev.map(oficina => 
      oficina.id === oficinaId 
        ? { ...oficina, favorita: !oficina.favorita }
        : oficina
    ));
  };

  // Função para abrir modal de agendamento
  const abrirModalAgendamento = (oficina: typeof mockOficinas[0]) => {
    setOficinaParaAgendar(oficina);
    setMostrarModalAgendamento(true);
  };

  // Função para fechar modal de agendamento
  const fecharModalAgendamento = () => {
    setMostrarModalAgendamento(false);
    setOficinaParaAgendar(null);
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
    <div className="min-h-screen">
      <Header />
      
      {/* Seção de Busca */}
      <div className="bg-white shadow-sm border-b pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Encontre a Oficina Ideal</h1>
            <p className="text-gray-600">Conecte-se com as melhores oficinas próximas a você</p>
          </div>

          {/* Barra de busca */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
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
            
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Voltar à Página Inicial
            </Link>
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
      <div className="bg-gray-50 pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                        
                        <button
                          onClick={() => abrirModalAgendamento(oficina)}
                          className="w-full bg-[#FFDE59] hover:bg-[#FFD429] text-[#0047CC] px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          ⚡ Agendar Agora
                        </button>
                        
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
            <GoogleMapComponent oficinas={oficinasFiltradas} />
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
      
      {/* Modal de Agendamento Rápido */}
      {mostrarModalAgendamento && oficinaParaAgendar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Agendar Serviço</h3>
                  <p className="text-sm text-gray-600">{oficinaParaAgendar.nome}</p>
                </div>
                <button
                  onClick={fecharModalAgendamento}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Serviços */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecione o serviço
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Escolha um serviço...</option>
                    {oficinaParaAgendar.servicos.map(servico => (
                      <option key={servico} value={servico}>{servico}</option>
                    ))}
                  </select>
                </div>

                {/* Data */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data preferida
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Horário */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horário preferido
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Escolha um horário...</option>
                    <option value="08:00">08:00</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="13:00">13:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                  </select>
                </div>

                {/* Descrição do problema */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descreva o problema (opcional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Ex: Freios fazendo barulho, carro não liga..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Preço estimado */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <CurrencyDollarIcon className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">
                      Preço médio: R$ {oficinaParaAgendar.precoMedio}
                    </span>
                  </div>
                  <p className="text-xs text-yellow-700 mt-1">
                    *Valor pode variar conforme diagnóstico
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <div className="flex space-x-3">
                <button
                  onClick={fecharModalAgendamento}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button className="flex-1 px-4 py-2 bg-[#0047CC] text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Confirmar Agendamento
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                A oficina entrará em contato para confirmar
              </p>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Widget de Chat Flutuante */}
      <div className="fixed bottom-6 right-6 z-40">
        <Link
          href="/mensagens"
          className="group bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
        >
          <ChatBubbleLeftIcon className="h-6 w-6" />
          <span className="hidden group-hover:block text-sm font-medium pr-2 transition-all duration-300">
            Chat
          </span>
        </Link>
      </div>
      
      {/* Widget de Chat Flutuante */}
      <div className="fixed bottom-6 right-6 z-40">
        <Link
          href="/mensagens"
          className="group bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
        >
          <ChatBubbleLeftIcon className="h-6 w-6" />
          <span className="hidden group-hover:block text-sm font-medium pr-2 transition-all duration-300">
            Chat
          </span>
        </Link>
      </div>
      
      <Footer />
    </div>
  );
} 