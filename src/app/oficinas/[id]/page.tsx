"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPinIcon, 
  PhoneIcon, 
  ClockIcon, 
  StarIcon, 
  CheckCircleIcon, 
  WrenchIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  PhotoIcon,
  HeartIcon,
  ShareIcon,
  CameraIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
  TruckIcon
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import GlobalHeader from "@/components/GlobalHeader";
import Footer from "@/components/Footer";
import MapaInterativo from "@/components/MapaInterativo";

interface Oficina {
  id: string;
  nome: string;
  endereco: string;
  telefone: string;
  whatsapp: string;
  descricao: string;
  distancia: number;
  avaliacao: number;
  totalAvaliacoes: number;
  fotos: string[];
  servicos: {
    nome: string;
    descricao: string;
    preco: string;
  }[];
  avaliacoes: {
    nome: string;
    data: string;
    nota: number;
    comentario: string;
    foto?: string;
  }[];
  horarios: {
    [key: string]: {
      abre: string;
      fecha: string;
      fechado: boolean;
    };
  };
  especialidades: string[];
  certificacoes: string[];
  garantia: boolean;
  promocao?: string;
  latitude: number;
  longitude: number;
}

export default function OficinaDetalhes({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<"info" | "servicos" | "avaliacoes" | "fotos">("info");
  const [fotoAtiva, setFotoAtiva] = useState(0);
  const [isFavorito, setIsFavorito] = useState(false);
  const [mostrarGaleria, setMostrarGaleria] = useState(false);

  // Mock da oficina (em produção viria da API)
  const oficina: Oficina = {
    id: params.id,
    nome: "Auto Center Silva Premium",
    endereco: "Av. Paulista, 1500 - Bela Vista, São Paulo - SP",
    telefone: "(11) 3333-4444",
    whatsapp: "(11) 99999-8888",
    descricao: "Oficina especializada em serviços automotivos com mais de 20 anos de experiência no mercado. Contamos com profissionais certificados e equipamentos de última geração para oferecer o melhor atendimento aos nossos clientes.",
    distancia: 2.3,
    avaliacao: 4.8,
    totalAvaliacoes: 254,
    fotos: [
      "/images/oficina1.jpg",
      "/images/oficina2.jpg", 
      "/images/oficina3.jpg",
      "/images/oficina4.jpg",
      "/images/oficina1.jpg",
      "/images/oficina2.jpg"
    ],
    servicos: [
      { nome: "Troca de óleo", descricao: "Inclui óleo sintético e filtro original", preco: "A partir de R$ 149,90" },
      { nome: "Freios", descricao: "Troca de pastilhas e discos", preco: "A partir de R$ 249,90" },
      { nome: "Alinhamento", descricao: "Alinhamento e balanceamento completo", preco: "A partir de R$ 179,90" },
      { nome: "Revisão completa", descricao: "Checagem de 60+ itens", preco: "A partir de R$ 349,90" },
      { nome: "Diagnóstico", descricao: "Escaneamento eletrônico completo", preco: "A partir de R$ 119,90" },
      { nome: "Ar condicionado", descricao: "Limpeza e recarga do sistema", preco: "A partir de R$ 199,90" }
    ],
    avaliacoes: [
      { 
        nome: "João Silva", 
        data: "20/11/2024", 
        nota: 5, 
        comentario: "Excelente atendimento! Pessoal muito profissional e honesto. Recomendo demais!",
        foto: "/images/avatar1.jpg"
      },
      { 
        nome: "Maria Santos", 
        data: "18/11/2024", 
        nota: 5, 
        comentario: "Muito satisfeita com o serviço. Preço justo e trabalho bem feito." 
      },
      { 
        nome: "Pedro Costa", 
        data: "15/11/2024", 
        nota: 4, 
        comentario: "Bom atendimento, apenas demorou um pouco mais que o combinado." 
      }
    ],
    horarios: {
      segunda: { abre: "08:00", fecha: "18:00", fechado: false },
      terca: { abre: "08:00", fecha: "18:00", fechado: false },
      quarta: { abre: "08:00", fecha: "18:00", fechado: false },
      quinta: { abre: "08:00", fecha: "18:00", fechado: false },
      sexta: { abre: "08:00", fecha: "18:00", fechado: false },
      sabado: { abre: "08:00", fecha: "14:00", fechado: false },
      domingo: { abre: "", fecha: "", fechado: true }
    },
    especialidades: ["Veículos nacionais", "Carros japoneses", "Manutenção preventiva"],
    certificacoes: ["ISO 9001", "Bosch Car Service"],
    garantia: true,
    promocao: "15% OFF primeira visita",
    latitude: -23.5632,
    longitude: -46.6541
  };

  const tabs = [
    { id: "info", label: "Informações", icon: WrenchIcon },
    { id: "servicos", label: "Serviços", icon: CheckCircleIcon },
    { id: "avaliacoes", label: "Avaliações", icon: StarIcon },
    { id: "fotos", label: "Fotos", icon: PhotoIcon }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getDiaAtual = () => {
    const dias = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
    return dias[new Date().getDay()];
  };

  const horarioAtual = oficina.horarios[getDiaAtual()];
  const estaAberto = !horarioAtual.fechado && new Date().getHours() >= parseInt(horarioAtual.abre) && new Date().getHours() < parseInt(horarioAtual.fecha);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Global */}
      <GlobalHeader 
        title="Detalhes da Oficina"
        showSearch={false}
        customActions={
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsFavorito(!isFavorito)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isFavorito ? (
                <HeartSolidIcon className="h-5 w-5 text-red-500" />
              ) : (
                <HeartIcon className="h-5 w-5 text-gray-600" />
              )}
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <ShareIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        }
      />

      {/* Header de Navegação */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Link 
            href="/oficinas/busca" 
            className="flex items-center text-[#0047CC] hover:text-[#003DA6] text-sm font-medium"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Voltar para resultados
          </Link>
        </div>
      </div>

      {/* Galeria de Fotos */}
      <div className="relative">
        <div className="h-64 md:h-96 bg-gray-200 relative overflow-hidden">
          <Image
            src={oficina.fotos[fotoAtiva]}
            alt={oficina.nome}
            fill
            className="object-cover"
          />
          
          {/* Overlay com ações */}
          <div className="absolute inset-0 bg-black/20">
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <div className="text-white">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{oficina.nome}</h1>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <MapPinIcon className="h-4 w-4" />
                    <span>{oficina.distancia}km de distância</span>
                  </div>
                  <div className={`flex items-center space-x-1 ${estaAberto ? 'text-green-400' : 'text-red-400'}`}>
                    <ClockIcon className="h-4 w-4" />
                    <span>{estaAberto ? 'Aberto agora' : 'Fechado'}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setMostrarGaleria(true)}
                className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
              >
                <CameraIcon className="h-4 w-4" />
                <span>{oficina.fotos.length} fotos</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navegação de fotos */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {oficina.fotos.map((_, index) => (
            <button
              key={index}
              onClick={() => setFotoAtiva(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === fotoAtiva ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card de Informações Rápidas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {renderStars(Math.floor(oficina.avaliacao))}
                    <span className="font-semibold text-gray-900">{oficina.avaliacao}</span>
                    <span className="text-gray-500">({oficina.totalAvaliacoes} avaliações)</span>
                  </div>
                </div>
                {oficina.promocao && (
                  <div className="bg-[#FFDE59] text-[#0047CC] px-3 py-1 rounded-lg text-sm font-medium">
                    {oficina.promocao}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2 text-sm">
                  <ShieldCheckIcon className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Garantia</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <TruckIcon className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Emergência</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircleIcon className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-700">Agendamento</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <WrenchIcon className="h-5 w-5 text-orange-600" />
                  <span className="text-gray-700">Especializada</span>
                </div>
              </div>
            </div>

            {/* Navegação por Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as "info" | "servicos" | "avaliacoes" | "fotos")}
                        className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === tab.id
                            ? 'border-[#0047CC] text-[#0047CC]'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === "info" && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Sobre a oficina</h3>
                          <p className="text-gray-600 leading-relaxed">{oficina.descricao}</p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Especialidades</h3>
                          <div className="flex flex-wrap gap-2">
                            {oficina.especialidades.map((especialidade, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                              >
                                {especialidade}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Certificações</h3>
                          <div className="flex flex-wrap gap-2">
                            {oficina.certificacoes.map((cert, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full"
                              >
                                {cert}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Horários de funcionamento</h3>
                          <div className="space-y-2">
                            {Object.entries(oficina.horarios).map(([dia, horario]) => (
                              <div key={dia} className="flex justify-between items-center py-2">
                                <span className="text-gray-700 capitalize font-medium">{dia.replace('terca', 'terça').replace('sabado', 'sábado')}</span>
                                <span className="text-gray-600">
                                  {horario.fechado ? 'Fechado' : `${horario.abre} - ${horario.fecha}`}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "servicos" && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Serviços oferecidos</h3>
                        <div className="grid gap-4">
                          {oficina.servicos.map((servico, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900">{servico.nome}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{servico.descricao}</p>
                                </div>
                                <div className="text-right ml-4">
                                  <p className="font-semibold text-[#0047CC]">{servico.preco}</p>
                                  <button className="text-sm text-[#0047CC] hover:text-[#003DA6] mt-1">
                                    Solicitar orçamento
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === "avaliacoes" && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Avaliações dos clientes ({oficina.totalAvaliacoes})
                        </h3>
                        <div className="space-y-4">
                          {oficina.avaliacoes.map((avaliacao, index) => (
                            <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                              <div className="flex items-start space-x-3">
                                {avaliacao.foto ? (
                                  <Image
                                    src={avaliacao.foto}
                                    alt={avaliacao.nome}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                    <span className="text-gray-600 font-medium text-sm">
                                      {avaliacao.nome.charAt(0)}
                                    </span>
                                  </div>
                                )}
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-medium text-gray-900">{avaliacao.nome}</h4>
                                    <span className="text-sm text-gray-500">{avaliacao.data}</span>
                                  </div>
                                  <div className="flex items-center space-x-1 mt-1">
                                    {renderStars(avaliacao.nota)}
                                  </div>
                                  <p className="text-gray-600 mt-2">{avaliacao.comentario}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === "fotos" && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Galeria de fotos</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {oficina.fotos.map((foto, index) => (
                            <div
                              key={index}
                              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => {
                                setFotoAtiva(index);
                                setMostrarGaleria(true);
                              }}
                            >
                              <Image
                                src={foto}
                                alt={`Foto ${index + 1} da ${oficina.nome}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Sidebar com Ações */}
          <div className="space-y-6">
            {/* Card de Contato */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Entrar em contato</h3>
              
              <div className="space-y-3">
                <a
                  href={`tel:${oficina.telefone}`}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <PhoneIcon className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-900">{oficina.telefone}</span>
                </a>
                
                <a
                  href={`https://wa.me/${oficina.whatsapp.replace(/\D/g, '')}`}
                  className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <ChatBubbleLeftRightIcon className="h-5 w-5 text-green-600" />
                  <span className="text-gray-900">WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Card de Agendamento */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Agendar serviço</h3>
              
              <Link 
                href={`/agendamento/${oficina.id}`}
                className="w-full bg-[#0047CC] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#003DA6] transition-colors flex items-center justify-center space-x-2"
              >
                <CalendarIcon className="h-5 w-5" />
                <span>Agendar agora</span>
              </Link>
              
              <p className="text-sm text-gray-600 mt-3 text-center">
                Resposta em até 2 horas
              </p>
            </div>

            {/* Card de Localização */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Localização</h3>
              
              <div className="flex items-start space-x-3 mb-4">
                <MapPinIcon className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700 text-sm">{oficina.endereco}</p>
              </div>
              
              {/* Mapa Real */}
              <div className="mb-4 rounded-lg overflow-hidden">
                <MapaInterativo
                  oficinas={[{
                    id: oficina.id,
                    nome: oficina.nome,
                    endereco: oficina.endereco,
                    latitude: oficina.latitude,
                    longitude: oficina.longitude,
                    avaliacao: oficina.avaliacao,
                    totalAvaliacoes: oficina.totalAvaliacoes,
                    foto: oficina.fotos[0],
                    telefone: oficina.telefone,
                    horarios: {
                      aberto: estaAberto,
                      fechaAs: horarioAtual.fecha
                    },
                    promocao: oficina.promocao
                  }]}
                  center={[oficina.latitude, oficina.longitude]}
                  zoom={16}
                  height="200px"
                  mostrarLocalizacaoUsuario={false}
                />
              </div>
              
              <button className="w-full bg-gray-100 text-gray-900 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                Ver no Google Maps
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal da Galeria */}
      <AnimatePresence>
        {mostrarGaleria && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
            onClick={() => setMostrarGaleria(false)}
          >
            <div className="relative max-w-4xl w-full h-full flex items-center justify-center p-4">
              <Image
                src={oficina.fotos[fotoAtiva]}
                alt={oficina.nome}
                width={800}
                height={600}
                className="max-w-full max-h-full object-contain"
              />
              
              <button
                onClick={() => setMostrarGaleria(false)}
                className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full"
              >
                ✕
              </button>
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {oficina.fotos.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFotoAtiva(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === fotoAtiva ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Global */}
      <Footer />
    </div>
  );
} 