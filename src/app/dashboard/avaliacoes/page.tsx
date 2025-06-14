"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  MagnifyingGlassIcon, 
  StarIcon,
  FunnelIcon,
  ChatBubbleLeftIcon,
  ChevronDownIcon,
  UserCircleIcon,
  ArchiveBoxIcon,
  PencilSquareIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  TruckIcon,
  HandThumbUpIcon,
  ChartBarSquareIcon
} from "@heroicons/react/24/outline";

// Tipos para avaliações
type Rating = 1 | 2 | 3 | 4 | 5;
type ReviewStatus = 'publicado' | 'respondido' | 'arquivado';

type Review = {
  id: string;
  customerId: string;
  customerName: string;
  customerImage?: string;
  rating: Rating;
  comment: string;
  date: string;
  serviceId?: string;
  serviceName?: string;
  vehicle?: {
    make: string;
    model: string;
    year: number;
  };
  reply?: {
    text: string;
    date: string;
    author: string;
  };
  status: ReviewStatus;
  tags?: string[];
};

// Dados mockados para avaliações
const mockReviews: Review[] = [
  {
    id: "REV-001",
    customerId: "C-001",
    customerName: "Paulo Souza",
    rating: 5,
    comment: "Excelente atendimento! Meu carro ficou como novo depois da revisão completa. Equipe super atenciosa e preço justo. Recomendo a todos.",
    date: "2023-10-18T09:15:00Z",
    serviceId: "OS-2023-042",
    serviceName: "Revisão completa",
    vehicle: {
      make: "Toyota",
      model: "Corolla",
      year: 2020
    },
    reply: {
      text: "Obrigado pela sua avaliação, Paulo! Ficamos muito felizes em saber que você gostou do nosso serviço. Estamos sempre à disposição!",
      date: "2023-10-18T11:30:00Z",
      author: "Carlos Oliveira"
    },
    status: "respondido",
    tags: ["cliente recorrente", "revisão", "satisfeito"]
  },
  {
    id: "REV-002",
    customerId: "C-002",
    customerName: "Carla Oliveira",
    rating: 4,
    comment: "Bom serviço e atendimento. A troca de óleo foi rápida e eficiente. Só demorou um pouco para ser atendida inicialmente, mas depois tudo correu bem.",
    date: "2023-10-17T14:30:00Z",
    serviceId: "OS-2023-041",
    serviceName: "Troca de óleo",
    vehicle: {
      make: "Honda",
      model: "Fit",
      year: 2019
    },
    status: "publicado"
  },
  {
    id: "REV-003",
    customerId: "C-003",
    customerName: "Ricardo Mendes",
    rating: 5,
    comment: "Melhor oficina da região! Resolveram um problema no meu carro que outras três oficinas não conseguiram identificar. Preço justo e atendimento nota 10.",
    date: "2023-10-15T16:45:00Z",
    serviceId: "OS-2023-038",
    serviceName: "Diagnóstico elétrico",
    vehicle: {
      make: "Volkswagen",
      model: "Golf",
      year: 2018
    },
    reply: {
      text: "Ricardo, muito obrigado pelo feedback! Nosso time de mecânicos é especializado em diagnósticos complexos, e fico feliz que pudemos resolver seu problema. Conte sempre conosco!",
      date: "2023-10-16T09:20:00Z",
      author: "Carlos Oliveira"
    },
    status: "respondido",
    tags: ["diagnóstico", "satisfeito", "cliente novo"]
  },
  {
    id: "REV-004",
    customerId: "C-004",
    customerName: "Fernanda Costa",
    rating: 3,
    comment: "Serviço OK, mas achei um pouco caro. O prazo de entrega foi cumprido e o problema foi resolvido, mas esperava um orçamento menor.",
    date: "2023-10-14T10:15:00Z",
    serviceId: "OS-2023-037",
    serviceName: "Reparo na suspensão",
    vehicle: {
      make: "Fiat",
      model: "Argo",
      year: 2021
    },
    status: "publicado"
  },
  {
    id: "REV-005",
    customerId: "C-005",
    customerName: "Marcos Santos",
    rating: 2,
    comment: "Demorou mais do que o prometido para entregar meu carro e o problema não foi totalmente resolvido. Tive que retornar para ajustes.",
    date: "2023-10-12T15:30:00Z",
    serviceId: "OS-2023-035",
    serviceName: "Problema no motor",
    vehicle: {
      make: "Chevrolet",
      model: "Onix",
      year: 2017
    },
    reply: {
      text: "Marcos, pedimos desculpas pela experiência negativa. Gostaríamos de conversar melhor sobre o ocorrido e resolver definitivamente o problema do seu veículo. Por favor, entre em contato conosco para agendarmos um retorno sem custo adicional.",
      date: "2023-10-12T17:45:00Z",
      author: "Carlos Oliveira"
    },
    status: "respondido",
    tags: ["insatisfeito", "retorno", "problema complexo"]
  },
  {
    id: "REV-006",
    customerId: "C-006",
    customerName: "Ana Pereira",
    rating: 1,
    comment: "Péssima experiência. Orçamento inicial muito diferente do valor final cobrado. Não recomendo.",
    date: "2023-10-10T09:45:00Z",
    serviceId: "OS-2023-032",
    serviceName: "Troca de embreagem",
    vehicle: {
      make: "Ford",
      model: "Ka",
      year: 2016
    },
    status: "arquivado"
  }
];

// Dados para estatísticas
const reviewStats = {
  averageRating: 3.7,
  totalReviews: 28,
  ratingDistribution: [
    { rating: 5, count: 12, percentage: 43 },
    { rating: 4, count: 8, percentage: 29 },
    { rating: 3, count: 4, percentage: 14 },
    { rating: 2, count: 3, percentage: 11 },
    { rating: 1, count: 1, percentage: 3 }
  ],
  responseRate: 85,
  averageResponseTime: "4 horas"
};

export default function AvaliacoesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<Rating | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filtrar avaliações
  const filteredReviews = reviews
    .filter(review => {
      // Filtro por termo de busca
      if (searchTerm && 
          !review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !review.comment.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filtro por avaliação
      if (ratingFilter !== 'all' && review.rating !== ratingFilter) {
        return false;
      }
      
      // Filtro por status
      if (statusFilter !== 'all' && review.status !== statusFilter) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Funções auxiliares
  const getStatusText = (status: ReviewStatus) => {
    const statuses: Record<ReviewStatus, string> = {
      'publicado': 'Publicado',
      'respondido': 'Respondido',
      'arquivado': 'Arquivado'
    };
    
    return statuses[status] || status;
  };
  
  const getStatusClass = (status: ReviewStatus) => {
    switch (status) {
      case 'publicado':
        return "bg-blue-100 text-blue-700 border-blue-200";
      case 'respondido':
        return "bg-green-100 text-green-700 border-green-200";
      case 'arquivado':
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };
  
  // Renderizar estrelas
  const renderStars = (rating: Rating) => {
    return Array(5).fill(0).map((_, index) => (
      <StarIcon 
        key={index} 
        className={`h-5 w-5 ${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };
  
  // Formatação de data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  // Calcular tempo decorrido
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInHours < 1) {
      return "Há poucos minutos";
    } else if (diffInHours < 24) {
      return `Há ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
    } else {
      return `Há ${diffInDays} ${diffInDays === 1 ? 'dia' : 'dias'}`;
    }
  };
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Avaliações</h1>
            <p className="text-gray-500 text-sm mt-1">Gerencie o feedback dos seus clientes</p>
          </div>
          
          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-[#0047CC] text-white rounded-lg text-sm font-medium hover:bg-[#003CAD] transition-colors inline-flex items-center"
            >
              <ChartBarSquareIcon className="h-5 w-5 mr-2" />
              Análise de Sentimento
            </button>
          </div>
        </div>
      </div>
      
      {/* Resumo das avaliações */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between mb-4">
            <h3 className="font-medium text-gray-800">Avaliação Média</h3>
            <div className="flex">
              {renderStars(Math.round(reviewStats.averageRating) as Rating)}
            </div>
          </div>
          <div className="flex items-end">
            <span className="text-4xl font-bold text-gray-800">{reviewStats.averageRating.toFixed(1)}</span>
            <span className="text-sm text-gray-500 ml-2 mb-1">de 5.0</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Baseado em {reviewStats.totalReviews} avaliações
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-medium text-gray-800 mb-4">Distribuição de Avaliações</h3>
          <div className="space-y-3">
            {reviewStats.ratingDistribution.map((item) => (
              <div key={item.rating} className="flex items-center">
                <div className="flex items-center w-16">
                  <span className="text-sm font-medium text-gray-700">{item.rating}</span>
                  <StarIcon className="h-4 w-4 text-yellow-400 fill-yellow-400 ml-1" />
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 mx-2">
                  <div 
                    className="bg-yellow-400 h-2.5 rounded-full" 
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <div className="w-12 text-right">
                  <span className="text-xs text-gray-500">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-medium text-gray-800 mb-4">Estatísticas de Resposta</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-3xl font-bold text-gray-800">{reviewStats.responseRate}%</div>
              <p className="text-sm text-gray-500">Taxa de Resposta</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-800">{reviewStats.averageResponseTime}</div>
              <p className="text-sm text-gray-500">Tempo Médio</p>
            </div>
          </div>
          <div className="mt-4 bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
            <div className="flex items-start">
              <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <p>Responder avaliações rapidamente pode aumentar a satisfação do cliente em até 15%.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filtros e busca */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Campo de busca */}
          <div className="md:col-span-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por cliente ou conteúdo..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Filtros rápidos */}
          <div className="md:col-span-5 flex flex-wrap gap-2">
            {/* Filtro por avaliação */}
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button 
                className={`px-3 py-2 text-sm ${ratingFilter === 'all' ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setRatingFilter('all')}
              >
                Todas
              </button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <button 
                  key={rating}
                  className={`px-3 py-2 text-sm flex items-center ${ratingFilter === rating ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => setRatingFilter(rating as Rating)}
                >
                  {rating} <StarIcon className="h-3.5 w-3.5 ml-0.5 text-yellow-400" />
                </button>
              ))}
            </div>
            
            {/* Filtro por status */}
            <select
              className="px-3 py-2 rounded-lg text-sm border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0047CC]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">Todos os status</option>
              <option value="publicado">Não respondidas</option>
              <option value="respondido">Respondidas</option>
              <option value="arquivado">Arquivadas</option>
            </select>
          </div>
          
          {/* Botão de filtros avançados */}
          <div className="md:col-span-2 flex justify-end">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 py-2 rounded-lg text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center"
            >
              <FunnelIcon className="h-4 w-4 mr-1" />
              Filtros
              <ChevronDownIcon className={`h-4 w-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
        
        {/* Filtros avançados (expandíveis) */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
              <select className="w-full px-3 py-2 rounded-lg text-sm border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0047CC]">
                <option>Todos os períodos</option>
                <option>Últimos 7 dias</option>
                <option>Últimos 30 dias</option>
                <option>Últimos 3 meses</option>
                <option>Últimos 6 meses</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Serviço</label>
              <select className="w-full px-3 py-2 rounded-lg text-sm border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0047CC]">
                <option>Todos os serviços</option>
                <option>Revisão</option>
                <option>Manutenção</option>
                <option>Reparo</option>
                <option>Troca de óleo</option>
                <option>Diagnóstico</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Possui resposta</label>
              <select className="w-full px-3 py-2 rounded-lg text-sm border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0047CC]">
                <option>Todos</option>
                <option>Com resposta</option>
                <option>Sem resposta</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Lista de avaliações */}
      <div className="space-y-6 mb-6">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="flex">
                  <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          ))
        ) : filteredReviews.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <ChatBubbleLeftIcon className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-1">Nenhuma avaliação encontrada</h3>
              <p className="text-gray-500 mb-4">Tente ajustar seus filtros ou aguarde novas avaliações de clientes</p>
            </div>
          </div>
        ) : (
          filteredReviews.map((review, index) => (
            <motion.div 
              key={review.id} 
              className="bg-white rounded-xl shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                  <div className="flex">
                    <div className="mr-4">
                      {review.customerImage ? (
                        <img 
                          src={review.customerImage} 
                          alt={review.customerName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <UserCircleIcon className="h-8 w-8 text-blue-600" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{review.customerName}</h3>
                      <div className="flex items-center mt-1">
                        <div className="flex mr-2">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(review.date)}
                        </span>
                      </div>
                      {review.vehicle && (
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <TruckIcon className="h-3.5 w-3.5 mr-1" />
                          {review.vehicle.make} {review.vehicle.model} ({review.vehicle.year})
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {review.serviceName && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 mr-2">
                        {review.serviceName}
                      </span>
                    )}
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusClass(review.status)}`}>
                      {getStatusText(review.status)}
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-700">{review.comment}</p>
                </div>
                
                {review.tags && review.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {review.tags.map(tag => (
                      <span key={tag} className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {review.reply ? (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-800">
                        Resposta de {review.reply.author}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {formatDate(review.reply.date)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{review.reply.text}</p>
                  </div>
                ) : (
                  <div className="mb-4">
                    <button className="inline-flex items-center text-sm text-[#0047CC] hover:text-[#003CAD] font-medium">
                      <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                      Responder avaliação
                    </button>
                  </div>
                )}
                
                <div className="flex justify-between mt-2">
                  <div className="flex space-x-4">
                    <button className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
                      <HandThumbUpIcon className="h-4 w-4 mr-1" />
                      Útil
                    </button>
                    <button className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
                      <PencilSquareIcon className="h-4 w-4 mr-1" />
                      Editar resposta
                    </button>
                  </div>
                  
                  <button className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
                    <ArchiveBoxIcon className="h-4 w-4 mr-1" />
                    Arquivar
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