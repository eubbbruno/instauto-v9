'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  StarIcon,
  HeartIcon,
  ShareIcon,
  CameraIcon,
  ChatBubbleLeftIcon,
  CalendarIcon,
  CheckCircleIcon,
  WrenchScrewdriverIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  TruckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import Link from 'next/link';

interface OficinaDetails {
  id: string;
  slug: string;
  name: string;
  description: string;
  rating: number;
  totalReviews: number;
  priceRange: string;
  category: string;
  images: string[];
  phone: string;
  whatsapp: string;
  email: string;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  businessHours: {
    [key: string]: { open: string; close: string } | null;
  };
  services: {
    name: string;
    description: string;
    price: string;
    duration: string;
  }[];
  amenities: string[];
  specialties: string[];
  reviews: {
    id: string;
    author: string;
    avatar?: string;
    rating: number;
    date: string;
    comment: string;
    photos?: string[];
  }[];
}

// Mock data
const mockOficina: OficinaDetails = {
  id: '1',
  slug: 'auto-center-silva',
  name: 'Auto Center Silva',
  description: 'Oficina completa com mais de 20 anos de experiência. Especializada em mecânica geral, elétrica automotiva e diagnóstico computadorizado.',
  rating: 4.5,
  totalReviews: 127,
  priceRange: '$$',
  category: 'Mecânica Geral',
  images: [
    'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&h=600&fit=crop',
  ],
  phone: '(11) 3456-7890',
  whatsapp: '(11) 98765-4321',
  email: 'contato@autocentersiva.com.br',
  address: {
    street: 'Av. Paulista',
    number: '1000',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
    cep: '01310-100'
  },
  coordinates: {
    lat: -23.5629,
    lng: -46.6544
  },
  businessHours: {
    'segunda': { open: '08:00', close: '18:00' },
    'terça': { open: '08:00', close: '18:00' },
    'quarta': { open: '08:00', close: '18:00' },
    'quinta': { open: '08:00', close: '18:00' },
    'sexta': { open: '08:00', close: '18:00' },
    'sábado': { open: '08:00', close: '14:00' },
    'domingo': null
  },
  services: [
    {
      name: 'Revisão Completa',
      description: 'Revisão completa com 30 itens verificados',
      price: 'R$ 189,90',
      duration: '2 horas'
    },
    {
      name: 'Troca de Óleo',
      description: 'Troca de óleo e filtro com produtos de qualidade',
      price: 'R$ 89,90',
      duration: '30 min'
    },
    {
      name: 'Alinhamento e Balanceamento',
      description: 'Alinhamento 3D e balanceamento computadorizado',
      price: 'R$ 120,00',
      duration: '1 hora'
    },
    {
      name: 'Diagnóstico Eletrônico',
      description: 'Diagnóstico completo com scanner automotivo',
      price: 'R$ 80,00',
      duration: '45 min'
    }
  ],
  amenities: [
    'Wi-Fi gratuito',
    'Sala de espera climatizada',
    'Café e água',
    'TV na sala de espera',
    'Estacionamento gratuito',
    'Pagamento com cartão'
  ],
  specialties: [
    'Mecânica geral',
    'Elétrica automotiva',
    'Injeção eletrônica',
    'Ar condicionado',
    'Suspensão',
    'Freios'
  ],
  reviews: [
    {
      id: '1',
      author: 'João Silva',
      rating: 5,
      date: '2025-01-10',
      comment: 'Excelente atendimento! Equipe muito profissional e preço justo. Recomendo!'
    },
    {
      id: '2',
      author: 'Maria Santos',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      rating: 4,
      date: '2025-01-05',
      comment: 'Ótima oficina, resolveram meu problema rapidamente. Só achei o preço um pouco alto.',
      photos: [
        'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400&h=300&fit=crop'
      ]
    },
    {
      id: '3',
      author: 'Pedro Costa',
      rating: 5,
      date: '2024-12-28',
      comment: 'Sempre levo meu carro aqui. Confiança total no trabalho deles!'
    }
  ]
};

export default function OficinaDetailsPage() {
  const params = useParams();
  const [oficina] = useState<OficinaDetails>(mockOficina);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [activeTab, setActiveTab] = useState<'services' | 'reviews' | 'info'>('services');

  const getDayOfWeek = () => {
    const days = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
    return days[new Date().getDay()];
  };

  const isOpen = () => {
    const today = getDayOfWeek();
    const hours = oficina.businessHours[today];
    if (!hours) return false;
    
    const now = new Date();
    const [openHour, openMin] = hours.open.split(':').map(Number);
    const [closeHour, closeMin] = hours.close.split(':').map(Number);
    
    const openTime = new Date();
    openTime.setHours(openHour, openMin, 0);
    
    const closeTime = new Date();
    closeTime.setHours(closeHour, closeMin, 0);
    
    return now >= openTime && now <= closeTime;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      i < Math.floor(rating) ? (
        <StarIconSolid key={i} className="h-4 w-4 text-yellow-500" />
      ) : (
        <StarIcon key={i} className="h-4 w-4 text-gray-300" />
      )
    ));
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % oficina.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + oficina.images.length) % oficina.images.length);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-safe">
      {/* Header Mobile */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 lg:hidden">
        <div className="flex items-center justify-between p-4">
          <Link href="/motorista/buscar" className="p-2 -ml-2">
            <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
          </Link>
          <h1 className="font-semibold text-gray-900 truncate flex-1 mx-2">{oficina.name}</h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 touch-manipulation"
            >
              {isFavorite ? (
                <HeartIconSolid className="h-6 w-6 text-red-500" />
              ) : (
                <HeartIcon className="h-6 w-6 text-gray-600" />
              )}
            </button>
            <button className="p-2 touch-manipulation">
              <ShareIcon className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Image Gallery */}
        <div className="relative">
          <div 
            className="aspect-[16/9] md:aspect-[21/9] bg-gray-200 cursor-pointer"
            onClick={() => setShowGallery(true)}
          >
            <img 
              src={oficina.images[selectedImage]} 
              alt={oficina.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm">
              <CameraIcon className="h-4 w-4" />
              {oficina.images.length} fotos
            </div>
          </div>
          
          {/* Thumbnail Strip - Desktop */}
          <div className="hidden md:flex gap-2 p-4 overflow-x-auto">
            {oficina.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${oficina.name} - ${index + 1}`}
                className={`h-20 w-32 object-cover rounded-lg cursor-pointer transition-all ${
                  selectedImage === index ? 'ring-2 ring-blue-600' : 'opacity-70 hover:opacity-100'
                }`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 md:p-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{oficina.name}</h1>
                  <p className="text-gray-600 mt-1">{oficina.category} • {oficina.priceRange}</p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center">
                      {renderStars(oficina.rating)}
                    </div>
                    <span className="font-medium text-gray-900">{oficina.rating}</span>
                    <span className="text-gray-500">({oficina.totalReviews} avaliações)</span>
                  </div>
                </div>
                
                {/* Desktop Actions */}
                <div className="hidden lg:flex items-center gap-2">
                  <button 
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {isFavorite ? (
                      <HeartIconSolid className="h-5 w-5 text-red-500" />
                    ) : (
                      <HeartIcon className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                  <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <ShareIcon className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">{oficina.description}</p>

              {/* Specialties */}
              <div className="mt-4">
                <h3 className="font-semibold text-gray-900 mb-2">Especialidades</h3>
                <div className="flex flex-wrap gap-2">
                  {oficina.specialties.map((specialty, index) => (
                    <span key={index} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('services')}
                  className={`flex-1 px-4 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'services' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Serviços
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`flex-1 px-4 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'reviews' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Avaliações
                </button>
                <button
                  onClick={() => setActiveTab('info')}
                  className={`flex-1 px-4 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'info' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Informações
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-4 md:p-6">
                {/* Services Tab */}
                {activeTab === 'services' && (
                  <div className="space-y-4">
                    {oficina.services.map((service, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{service.name}</h4>
                          <span className="font-bold text-blue-600">{service.price}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <ClockIcon className="h-4 w-4" />
                            {service.duration}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {/* Rating Summary */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-3xl font-bold text-gray-900">{oficina.rating}</span>
                            <div className="flex items-center">
                              {renderStars(oficina.rating)}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{oficina.totalReviews} avaliações</p>
                        </div>
                        <Link 
                          href={`/oficina/${params.slug}/avaliar`}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                          Avaliar
                        </Link>
                      </div>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-4">
                      {oficina.reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 pb-4 last:border-0">
                          <div className="flex items-start gap-3">
                            {review.avatar ? (
                              <img 
                                src={review.avatar} 
                                alt={review.author}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-600 font-medium">
                                  {review.author.charAt(0)}
                                </span>
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h5 className="font-medium text-gray-900">{review.author}</h5>
                                <span className="text-sm text-gray-500">
                                  {new Date(review.date).toLocaleDateString('pt-BR')}
                                </span>
                              </div>
                              <div className="flex items-center mb-2">
                                {renderStars(review.rating)}
                              </div>
                              <p className="text-gray-700">{review.comment}</p>
                              {review.photos && review.photos.length > 0 && (
                                <div className="flex gap-2 mt-3">
                                  {review.photos.map((photo, idx) => (
                                    <img
                                      key={idx}
                                      src={photo}
                                      alt={`Review photo ${idx + 1}`}
                                      className="h-16 w-20 object-cover rounded-lg cursor-pointer hover:opacity-90"
                                      onClick={() => setShowGallery(true)}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Info Tab */}
                {activeTab === 'info' && (
                  <div className="space-y-6">
                    {/* Amenities */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Comodidades</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {oficina.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Garantia</p>
                          <p className="text-xs text-gray-600">6 meses em todos os serviços</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <TruckIcon className="h-6 w-6 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Busca e Entrega</p>
                          <p className="text-xs text-gray-600">Serviço disponível</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Contato e Localização</h3>
              
              {/* Business Hours */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Horário</span>
                  </div>
                  {isOpen() ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Aberto agora
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                      Fechado
                    </span>
                  )}
                </div>
                <div className="space-y-1 text-sm">
                  {Object.entries(oficina.businessHours).map(([day, hours]) => (
                    <div key={day} className={`flex justify-between ${getDayOfWeek() === day ? 'font-medium text-blue-600' : 'text-gray-600'}`}>
                      <span className="capitalize">{day}</span>
                      <span>{hours ? `${hours.open} - ${hours.close}` : 'Fechado'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address */}
              <div className="mb-6">
                <div className="flex items-start gap-3">
                  <MapPinIcon className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Endereço</p>
                    <p className="text-sm text-gray-600">
                      {oficina.address.street}, {oficina.address.number}<br />
                      {oficina.address.neighborhood}<br />
                      {oficina.address.city} - {oficina.address.state}<br />
                      CEP: {oficina.address.cep}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="space-y-3">
                <a 
                  href={`tel:${oficina.phone}`}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 touch-manipulation min-h-[48px]"
                >
                  <PhoneIcon className="h-5 w-5" />
                  Ligar
                </a>
                <a 
                  href={`https://wa.me/${oficina.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2 touch-manipulation min-h-[48px]"
                >
                  <ChatBubbleLeftIcon className="h-5 w-5" />
                  WhatsApp
                </a>
                <Link 
                  href={`/agendar/${oficina.id}`}
                  className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 touch-manipulation min-h-[48px]"
                >
                  <CalendarIcon className="h-5 w-5" />
                  Agendar Serviço
                </Link>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="aspect-[4/3] bg-gray-200">
                <img 
                  src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-l+0047cc(${oficina.coordinates.lng},${oficina.coordinates.lat})/${oficina.coordinates.lng},${oficina.coordinates.lat},15,0/400x300@2x?access_token=YOUR_MAPBOX_TOKEN`}
                  alt="Mapa"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${oficina.coordinates.lat},${oficina.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center justify-center gap-1"
                >
                  <MapPinIcon className="h-4 w-4" />
                  Ver rotas no Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            onClick={() => setShowGallery(false)}
            className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 z-10"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
          
          <button
            onClick={prevImage}
            className="absolute left-4 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          
          <img 
            src={oficina.images[selectedImage]} 
            alt={oficina.name}
            className="max-w-full max-h-full object-contain"
          />
          
          <button
            onClick={nextImage}
            className="absolute right-4 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
            {selectedImage + 1} / {oficina.images.length}
          </div>
        </div>
      )}
    </div>
  );
} 