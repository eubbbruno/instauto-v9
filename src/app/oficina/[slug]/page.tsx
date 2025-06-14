"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  MapPinIcon, 
  PhoneIcon, 
  ClockIcon, 
  StarIcon, 
  CheckCircleIcon, 
  WrenchIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChatBubbleLeftRightIcon,
  PhotoIcon
} from "@heroicons/react/24/outline";
import AvaliacaoOficina from "@/components/AvaliacaoOficina";
import MapView from "@/components/MapView";
import useGeolocation from "@/hooks/useGeolocation";
import { OficinaBase } from "@/types";
import FavoritoButton from "@/components/FavoritoButton";
import AvaliacaoEstatisticas from "@/components/AvaliacaoEstatisticas";

export default function OficinaDetalhesPage({ params }: { params: { slug: string } }) {
  const [activeTab, setActiveTab] = useState<"info" | "servicos" | "avaliacoes">("info");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const { latitude, longitude } = useGeolocation();
  
  // Função para calcular a distância em km entre duas coordenadas
  const calcularDistanciaEmKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    const d = R * c; // Distância em km
    return parseFloat(d.toFixed(1));
  };
  
  // Dados mockados da oficina
  const oficina = {
    id: params.slug,
    nome: "Auto Center Silva",
    endereco: "Av. Paulista, 1500 - São Paulo, SP",
    telefone: "(11) 99999-9999",
    whatsapp: "(11) 99999-9999",
    descricao: "Oficina especializada em serviços automotivos com mais de 15 anos de experiência. Contamos com profissionais qualificados e equipamentos de última geração para oferecer o melhor atendimento.",
    horarios: {
      segunda: { abre: "08:00", fecha: "18:00", fechado: false },
      terca: { abre: "08:00", fecha: "18:00", fechado: false },
      quarta: { abre: "08:00", fecha: "18:00", fechado: false },
      quinta: { abre: "08:00", fecha: "18:00", fechado: false },
      sexta: { abre: "08:00", fecha: "18:00", fechado: false },
      sabado: { abre: "08:00", fecha: "12:00", fechado: false },
      domingo: { abre: "", fecha: "", fechado: true },
    },
    avaliacao: 4.8,
    totalAvaliacoes: 254,
    fotos: [
      "/images/oficina1.jpg",
      "/images/oficina2.jpg",
      "/images/oficina3.jpg",
      "/images/oficina4.jpg",
    ],
    servicos: [
      { nome: "Troca de óleo", descricao: "Inclui óleo e filtro", preco: "A partir de R$ 150,00" },
      { nome: "Alinhamento e balanceamento", descricao: "Serviço completo", preco: "A partir de R$ 180,00" },
      { nome: "Revisão completa", descricao: "Checagem de 50 itens", preco: "A partir de R$ 350,00" },
      { nome: "Freios", descricao: "Troca de pastilhas e discos", preco: "A partir de R$ 250,00" },
      { nome: "Suspensão", descricao: "Verificação e substituição", preco: "A partir de R$ 300,00" },
      { nome: "Diagnóstico eletrônico", descricao: "Escaneamento completo", preco: "A partir de R$ 120,00" },
    ],
    avaliacoes: [
      { 
        nome: "João Silva", 
        data: "15/05/2023", 
        nota: 5, 
        comentario: "Excelente atendimento, serviço rápido e preço justo. Recomendo!" 
      },
      { 
        nome: "Maria Oliveira", 
        data: "03/04/2023", 
        nota: 4, 
        comentario: "Bom serviço, apenas demorou um pouco mais que o esperado." 
      },
      { 
        nome: "Pedro Santos", 
        data: "20/03/2023", 
        nota: 5, 
        comentario: "Muito satisfeito com o serviço. Os mecânicos são muito atenciosos e explicaram tudo detalhadamente." 
      },
    ],
    // Coordenadas da oficina (Av. Paulista)
    latitude: -23.5632,
    longitude: -46.6541,
    distancia: 2.3
  };

  // Mapa da localização da oficina
  const oficinasParaMapa: OficinaBase[] = [{
    id: oficina.id,
    nome: oficina.nome,
    endereco: oficina.endereco,
    latitude: oficina.latitude,
    longitude: oficina.longitude,
    avaliacao: oficina.avaliacao,
    distancia: latitude && longitude ? 
      calcularDistanciaEmKm(latitude, longitude, oficina.latitude, oficina.longitude) : 
      oficina.distancia
  }];
  
  // Informação de distância para exibir
  const distanciaTexto = latitude && longitude ? 
    `${calcularDistanciaEmKm(latitude, longitude, oficina.latitude, oficina.longitude)} km de distância` : 
    oficina.distancia ? `${oficina.distancia} km de distância` : 
    "Distância não disponível";
  
  // Dias disponíveis para agendamento (próximos 7 dias)
  const diasDisponiveis = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });
  
  // Horários disponíveis (a cada 1 hora)
  const horariosDisponiveis = [
    "08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"
  ];
  
  // Função para formatar data em texto legível
  const formatarData = (data: Date) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);
    
    const dataComparacao = new Date(data);
    dataComparacao.setHours(0, 0, 0, 0);
    
    if (dataComparacao.getTime() === hoje.getTime()) {
      return "Hoje";
    } else if (dataComparacao.getTime() === amanha.getTime()) {
      return "Amanhã";
    } else {
      return data.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/oficinas" className="flex items-center text-gray-600 hover:text-[#0047CC]">
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            <span>Voltar para lista de oficinas</span>
          </Link>
        </div>
      </header>
      
      {/* Galeria de imagens */}
      <div className="relative h-64 md:h-96 bg-gray-200">
        <div className="container mx-auto h-full flex">
          {oficina.fotos && oficina.fotos.length > 0 ? (
            <>
              <div className="h-full w-full md:w-2/3 relative">
                <Image 
                  src={oficina.fotos[0]} 
                  alt={oficina.nome}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="hidden md:flex w-1/3 flex-col">
                <div className="h-1/2 relative">
                  <Image 
                    src={oficina.fotos.length > 1 ? oficina.fotos[1] : oficina.fotos[0]} 
                    alt={oficina.nome}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="h-1/2 flex">
                  <div className="w-1/2 relative">
                    <Image 
                      src={oficina.fotos.length > 2 ? oficina.fotos[2] : oficina.fotos[0]} 
                      alt={oficina.nome}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="w-1/2 relative">
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 cursor-pointer">
                      <div className="text-white text-center">
                        <PhotoIcon className="h-8 w-8 mx-auto mb-1" />
                        <span>Ver todas</span>
                      </div>
                    </div>
                    <Image 
                      src={oficina.fotos.length > 3 ? oficina.fotos[3] : oficina.fotos[0]} 
                      alt={oficina.nome}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <PhotoIcon className="h-12 w-12 mx-auto mb-2" />
                <p>Sem imagens disponíveis</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Conteúdo principal */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Coluna principal */}
          <div className="md:w-2/3">
            {/* Header da oficina */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{oficina.nome}</h1>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center">
                      <StarIcon className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      <span className="ml-1 font-medium">{oficina.avaliacao}</span>
                      <span className="ml-1 text-gray-500 text-sm">({oficina.totalAvaliacoes} avaliações)</span>
                    </div>
                    <div className="flex items-center ml-4">
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      <span className="ml-1 text-green-500 text-sm">Verificado</span>
                    </div>
                  </div>
                  <div className="flex items-center mt-2 text-gray-600">
                    <MapPinIcon className="h-5 w-5 text-gray-500 mr-1" />
                    <span>{oficina.endereco}</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500 flex items-center">
                    <span className="ml-6">{distanciaTexto}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <a 
                    href={`tel:${oficina.telefone.replace(/[^0-9]/g, '')}`}
                    className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center"
                  >
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    Ligar
                  </a>
                  <a 
                    href={`https://wa.me/55${oficina.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center"
                  >
                    <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </a>
                  <FavoritoButton 
                    oficina={oficinasParaMapa[0]} 
                    mostrarTexto 
                    className="border-0"
                  />
                  <Link 
                    href={`/agendar/${oficina.id}`}
                    className="bg-[#0047CC] hover:bg-[#0055EB] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center"
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Agendar Serviço
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Tabs de navegação */}
            <div className="bg-white rounded-t-xl shadow-sm p-1 mb-0 flex">
              <button
                onClick={() => setActiveTab("info")}
                className={`flex-1 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === "info"
                    ? "bg-[#0047CC]/10 text-[#0047CC]"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Informações
              </button>
              <button
                onClick={() => setActiveTab("servicos")}
                className={`flex-1 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === "servicos"
                    ? "bg-[#0047CC]/10 text-[#0047CC]"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Serviços
              </button>
              <button
                onClick={() => setActiveTab("avaliacoes")}
                className={`flex-1 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === "avaliacoes"
                    ? "bg-[#0047CC]/10 text-[#0047CC]"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Avaliações
              </button>
            </div>
            
            {/* Conteúdo das tabs */}
            <div className="bg-white rounded-b-xl shadow-sm p-6 mb-6">
              {activeTab === "info" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Sobre a Oficina</h2>
                  <p className="text-gray-600 mb-6">{oficina.descricao}</p>
                  
                  <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                    <ClockIcon className="h-5 w-5 mr-2 text-[#0047CC]" />
                    Horário de Funcionamento
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Segunda-feira</span>
                      {oficina.horarios.segunda.fechado ? (
                        <span className="text-sm text-red-500">Fechado</span>
                      ) : (
                        <span className="text-sm">{oficina.horarios.segunda.abre} - {oficina.horarios.segunda.fecha}</span>
                      )}
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Terça-feira</span>
                      {oficina.horarios.terca.fechado ? (
                        <span className="text-sm text-red-500">Fechado</span>
                      ) : (
                        <span className="text-sm">{oficina.horarios.terca.abre} - {oficina.horarios.terca.fecha}</span>
                      )}
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Quarta-feira</span>
                      {oficina.horarios.quarta.fechado ? (
                        <span className="text-sm text-red-500">Fechado</span>
                      ) : (
                        <span className="text-sm">{oficina.horarios.quarta.abre} - {oficina.horarios.quarta.fecha}</span>
                      )}
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Quinta-feira</span>
                      {oficina.horarios.quinta.fechado ? (
                        <span className="text-sm text-red-500">Fechado</span>
                      ) : (
                        <span className="text-sm">{oficina.horarios.quinta.abre} - {oficina.horarios.quinta.fecha}</span>
                      )}
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Sexta-feira</span>
                      {oficina.horarios.sexta.fechado ? (
                        <span className="text-sm text-red-500">Fechado</span>
                      ) : (
                        <span className="text-sm">{oficina.horarios.sexta.abre} - {oficina.horarios.sexta.fecha}</span>
                      )}
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Sábado</span>
                      {oficina.horarios.sabado.fechado ? (
                        <span className="text-sm text-red-500">Fechado</span>
                      ) : (
                        <span className="text-sm">{oficina.horarios.sabado.abre} - {oficina.horarios.sabado.fecha}</span>
                      )}
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Domingo</span>
                      {oficina.horarios.domingo.fechado ? (
                        <span className="text-sm text-red-500">Fechado</span>
                      ) : (
                        <span className="text-sm">{oficina.horarios.domingo.abre} - {oficina.horarios.domingo.fecha}</span>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                    <MapPinIcon className="h-5 w-5 mr-2 text-[#0047CC]" />
                    Localização
                  </h3>
                  <div className="h-64 bg-gray-100 rounded-lg overflow-hidden">
                    <MapView oficinas={oficinasParaMapa} />
                  </div>
                  <div className="mt-2 text-center">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(oficina.endereco)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0047CC] text-sm mt-2 inline-block"
                    >
                      Ver no Google Maps
                    </a>
                  </div>
                </motion.div>
              )}
              
              {activeTab === "servicos" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Serviços Oferecidos</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {oficina.servicos.map((servico, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <div className="flex items-start">
                          <div className="rounded-full bg-[#0047CC]/10 p-2 mr-3">
                            <WrenchIcon className="h-5 w-5 text-[#0047CC]" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{servico.nome}</h3>
                            <p className="text-sm text-gray-600 mt-1">{servico.descricao}</p>
                            <p className="text-sm font-medium text-[#0047CC] mt-2">{servico.preco}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {activeTab === "avaliacoes" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Avaliações</h2>
                  </div>
                  
                  <AvaliacaoEstatisticas 
                    avaliacaoGeral={oficina.avaliacao}
                    totalAvaliacoes={oficina.totalAvaliacoes}
                    distribuicao={{
                      estrela5: Math.round(oficina.totalAvaliacoes * 0.7),
                      estrela4: Math.round(oficina.totalAvaliacoes * 0.2),
                      estrela3: Math.round(oficina.totalAvaliacoes * 0.05),
                      estrela2: Math.round(oficina.totalAvaliacoes * 0.03),
                      estrela1: Math.round(oficina.totalAvaliacoes * 0.02)
                    }}
                    categorias={[
                      { nome: "Atendimento", avaliacao: 4.9 },
                      { nome: "Qualidade do serviço", avaliacao: 4.8 },
                      { nome: "Preço", avaliacao: 4.6 },
                      { nome: "Pontualidade", avaliacao: 4.7 },
                      { nome: "Limpeza", avaliacao: 4.8 },
                      { nome: "Infraestrutura", avaliacao: 4.5 }
                    ]}
                    className="mb-6"
                  />
                  
                  <AvaliacaoOficina 
                    avaliacao={oficina.avaliacao} 
                    totalAvaliacoes={oficina.totalAvaliacoes}
                    avaliacoes={oficina.avaliacoes.map((av, idx) => ({
                      id: idx + 1,
                      nome: av.nome,
                      data: av.data,
                      nota: av.nota,
                      comentario: av.comentario
                    }))}
                    className="mb-4"
                  />
                  
                  <div className="text-center">
                    <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300">
                      Ver todas as avaliações
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="md:w-1/3">
            {/* Bloco de agendamento */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Agendar Serviço</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de serviço</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                >
                  <option value="">Selecione um serviço</option>
                  {oficina.servicos.map((servico, idx) => (
                    <option key={idx} value={servico.nome}>{servico.nome}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Selecione uma data</label>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {diasDisponiveis.map((data, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(data.toISOString())}
                      className={`p-2 text-center rounded-lg ${
                        selectedDate === data.toISOString()
                          ? 'bg-[#0047CC] text-white'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="text-xs font-medium">{data.toLocaleDateString('pt-BR', { weekday: 'short' }).substring(0, 3)}</div>
                      <div className="font-medium">{formatarData(data)}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              {selectedDate && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Selecione um horário</label>
                  <div className="grid grid-cols-3 gap-2">
                    {horariosDisponiveis.map((horario, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedHour(horario)}
                        className={`p-2 text-center rounded-lg text-sm ${
                          selectedHour === horario
                            ? 'bg-[#0047CC] text-white'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {horario}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Veículo</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                >
                  <option value="">Selecione um veículo</option>
                  <option value="veiculo1">Fiat Argo 2022</option>
                  <option value="veiculo2">Honda City 2020</option>
                  <option value="veiculo3">Jeep Compass 2021</option>
                  <option value="outro">Outro veículo</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Observações (opcional)</label>
                <textarea 
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                  rows={3}
                  placeholder="Descreva detalhes adicionais sobre o serviço..."
                ></textarea>
              </div>
              
              <button
                disabled={!selectedDate || !selectedHour}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  selectedDate && selectedHour
                    ? 'bg-[#0047CC] hover:bg-[#0055EB] text-white'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Solicitar Agendamento
              </button>
            </div>
            
            {/* Bloco de contato */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Entrar em Contato</h2>
              <div className="space-y-3">
                <a
                  href={`tel:${oficina.telefone.replace(/[^0-9]/g, '')}`}
                  className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <PhoneIcon className="h-5 w-5 text-[#0047CC] mr-3" />
                  <span>{oficina.telefone}</span>
                </a>
                <a
                  href={`https://wa.me/55${oficina.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <svg className="h-5 w-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>WhatsApp</span>
                </a>
                <button className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors w-full">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 text-[#0047CC] mr-3" />
                  <span>Enviar mensagem</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 