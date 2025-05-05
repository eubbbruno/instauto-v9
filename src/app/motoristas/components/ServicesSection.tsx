"use client";

import { 
  Wrench,
  SprayCan, 
  BarChart4, 
  Battery, 
  ThermometerSnowflake, 
  Component, 
  Flame,
  Fuel,
  Lightbulb,
  Headphones,
  Check,
  ArrowRight,
  BadgePercent,
  Shield
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function ServicesSection() {
  // Categorias de serviços
  const serviceCategories = [
    {
      id: "manutencao",
      name: "Manutenção Regular",
      description: "Serviços essenciais para manter seu veículo funcionando perfeitamente no dia a dia.",
      icon: <Wrench className="w-6 h-6" />
    },
    {
      id: "estetica",
      name: "Estética e Limpeza",
      description: "Serviços para manter a aparência e conservação do seu veículo.",
      icon: <SprayCan className="w-6 h-6" />
    },
    {
      id: "diagnostico",
      name: "Diagnóstico",
      description: "Análise completa do estado do seu veículo com equipamentos modernos.",
      icon: <BarChart4 className="w-6 h-6" />
    },
    {
      id: "eletrica",
      name: "Sistema Elétrico",
      description: "Soluções para problemas elétricos e eletrônicos do seu veículo.",
      icon: <Battery className="w-6 h-6" />
    },
    {
      id: "ar",
      name: "Ar Condicionado",
      description: "Manutenção e reparo do sistema de climatização do seu veículo.",
      icon: <ThermometerSnowflake className="w-6 h-6" />
    },
    {
      id: "suspensao",
      name: "Suspensão e Direção",
      description: "Serviços para garantir estabilidade, conforto e segurança.",
      icon: <Component className="w-6 h-6" />
    },
    {
      id: "motor",
      name: "Motor e Transmissão",
      description: "Reparos e revisões dos componentes principais do seu veículo.",
      icon: <Flame className="w-6 h-6" />
    },
    {
      id: "combustivel",
      name: "Sistema de Combustível",
      description: "Limpeza e manutenção do sistema de alimentação do motor.",
      icon: <Fuel className="w-6 h-6" />
    }
  ];

  // Detalhes dos serviços para cada categoria
  const servicesDetails = {
    manutencao: [
      "Troca de óleo e filtros",
      "Troca de pastilhas e discos de freio",
      "Alinhamento e balanceamento",
      "Troca de correia dentada",
      "Revisão programada",
      "Troca de fluidos (freio, direção, arrefecimento)",
      "Revisão preventiva"
    ],
    estetica: [
      "Lavagem completa",
      "Polimento e cristalização",
      "Higienização interna",
      "Revitalização de plásticos",
      "Limpeza técnica do motor",
      "Impermeabilização de estofados",
      "Aplicação de película"
    ],
    diagnostico: [
      "Escaneamento computadorizado",
      "Análise de falhas",
      "Teste de bateria",
      "Diagnóstico de injeção eletrônica",
      "Verificação de sensores",
      "Análise de emissão de gases",
      "Diagnóstico de sistema ABS"
    ],
    eletrica: [
      "Reparo na central eletrônica",
      "Substituição de bateria",
      "Reparo no sistema de iluminação",
      "Instalação de acessórios",
      "Reparo no sistema de partida",
      "Diagnóstico de curto-circuito",
      "Reparos no alternador"
    ],
    ar: [
      "Recarga de gás",
      "Limpeza do sistema",
      "Troca do filtro de cabine",
      "Reparo de vazamentos",
      "Substituição do compressor",
      "Higienização do sistema",
      "Verificação do condensador"
    ],
    suspensao: [
      "Troca de amortecedores",
      "Substituição de molas",
      "Reparo da caixa de direção",
      "Troca de pivôs e terminais",
      "Alinhamento computadorizado",
      "Troca de buchas da suspensão",
      "Geometria completa"
    ],
    motor: [
      "Retífica do motor",
      "Reparo de cabeçote",
      "Troca de junta do cabeçote",
      "Regulagem de válvulas",
      "Reparo de câmbio",
      "Troca da embreagem",
      "Troca de correias e tensores"
    ],
    combustivel: [
      "Limpeza de bicos injetores",
      "Troca do filtro de combustível",
      "Regulagem do sistema de injeção",
      "Limpeza do tanque",
      "Verificação de bomba de combustível",
      "Reparo em vazamentos",
      "Calibração eletrônica da injeção"
    ]
  };

  // Estado para rastrear a categoria ativa
  const [activeCategory, setActiveCategory] = useState('manutencao');

  return (
    <section id="servicos" className="py-24 relative overflow-hidden">
      {/* Fundo com gradiente e padrão */}
      <div className="absolute inset-0 bg-white"></div>
      <div className="absolute inset-0 pattern-dots opacity-25"></div>
      
      {/* Elementos decorativos */}
      <div className="absolute top-0 right-0 w-full h-40 bg-gradient-to-b from-blue/5 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-blue/5 to-transparent"></div>
      
      {/* Elementos de destaque */}
      <div className="absolute top-1/3 left-10 w-24 h-24 bg-blue/10 rounded-full blur-xl"></div>
      <div className="absolute top-2/3 right-10 w-32 h-32 bg-yellow/10 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue/5 transform rotate-45 rounded-xl blur-lg"></div>
      <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-yellow/5 transform -rotate-12 rounded-xl blur-lg"></div>
      
      <div className="container-custom relative z-10">
        {/* Cabeçalho da seção */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div 
            className="inline-block bg-blue-light text-blue px-4 py-1 rounded-full text-sm font-medium mb-4"
            data-aos="fade-up"
          >
            Serviços Completos
          </div>
          <h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Todos os serviços para o seu veículo
          </h2>
          <p 
            className="text-gray-600 text-lg"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Encontre oficinas especializadas em todos os tipos de serviços automotivos, com qualidade garantida e preços transparentes.
          </p>
        </div>

        {/* Navegação de categorias */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12">
          {serviceCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                activeCategory === category.id
                  ? "border-blue bg-blue-light/30 shadow-md"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
              data-aos="fade-up"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${
                activeCategory === category.id
                  ? "bg-blue text-white"
                  : "bg-gray-100 text-gray-600"
              }`}>
                {category.icon}
              </div>
              <h3 className={`font-bold mb-1 ${
                activeCategory === category.id ? "text-blue" : "text-gray-800"
              }`}>
                {category.name}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2">
                {category.description}
              </p>
            </button>
          ))}
        </div>

        {/* Detalhes dos serviços */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative">
          {/* Elementos decorativos no card principal */}
          <div className="absolute -top-3 -right-3 w-12 h-12 bg-yellow/10 rounded-full blur-md"></div>
          <div className="absolute -bottom-3 -left-3 w-12 h-12 bg-blue/10 rounded-full blur-md"></div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Coluna da esquerda - Lista de serviços */}
            <div data-aos="fade-right">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                {serviceCategories.find(cat => cat.id === activeCategory)?.name}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {servicesDetails[activeCategory as keyof typeof servicesDetails].map((service, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-2 p-3 rounded-lg hover:bg-blue-light/10 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex-shrink-0 bg-blue-light text-blue rounded-full p-1">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-8">
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue text-white rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-md group">
                  Encontrar oficinas
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Coluna da direita - Destaque e benefícios */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm" data-aos="fade-left">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-lg bg-blue flex items-center justify-center text-white">
                  {serviceCategories.find(cat => cat.id === activeCategory)?.icon}
                </div>
                <div>
                  <h4 className="font-bold text-xl text-gray-800">
                    {serviceCategories.find(cat => cat.id === activeCategory)?.name}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Serviços realizados por profissionais certificados
                  </p>
                </div>
              </div>

              <hr className="my-5" />

              {/* Benefícios dos serviços */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                    <BadgePercent className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-800">Preços transparentes</h5>
                    <p className="text-gray-600 text-sm">Compare orçamentos de várias oficinas sem compromisso.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-light flex items-center justify-center text-blue">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-800">Diagnóstico preciso</h5>
                    <p className="text-gray-600 text-sm">Equipamentos modernos para identificar problemas com precisão.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-yellow/20 flex items-center justify-center text-yellow-800">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-800">Suporte especializado</h5>
                    <p className="text-gray-600 text-sm">Acompanhamento do serviço do início ao fim com atendimento personalizado.</p>
                  </div>
                </div>
              </div>

              {/* Badge de garantia */}
              <div className="mt-6 bg-white border border-gray-100 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue/10 flex items-center justify-center text-blue">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-800">Garantia de serviço</h5>
                    <p className="text-gray-600 text-sm">Todos os serviços possuem garantia mínima de 90 dias.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          {[
            { label: "Oficinas parceiras", value: "2.500+" },
            { label: "Serviços realizados", value: "85.000+" },
            { label: "Clientes satisfeitos", value: "93%" },
            { label: "Tempo médio de serviço", value: "-35%" }
          ].map((stat, index) => (
            <div 
              key={index}
              data-aos="fade-up"
              data-aos-delay={100 * index}
              className="bg-white border border-gray-100 rounded-xl p-6 text-center hover:bg-blue-light/10 hover:shadow-md transition-all duration-300"
            >
              <div className="text-3xl font-bold text-blue mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
        
        {/* Seção de Socorro de Emergência - Versão Sutil */}
        <div className="mt-20 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden" data-aos="fade-up">
          <div className="grid md:grid-cols-1 gap-8">
            {/* Conteúdo */}
            <div className="p-8 md:p-10">
              <div className="inline-block bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-medium mb-4">
                Assistência 24h
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-800">
                Assistência em caso de necessidade
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Imprevistos acontecem. Conte com nossa assistência 24 horas para ajudar quando você mais precisar.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-light/30 flex items-center justify-center text-blue">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Central de atendimento</p>
                    <p className="text-gray-800 font-medium">0800 123 4567</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-light/30 flex items-center justify-center text-blue">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">WhatsApp</p>
                    <p className="text-gray-800 font-medium">(11) 98765-4321</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <button className="px-4 py-2 bg-blue text-white text-sm rounded-lg hover:bg-blue-600 transition-colors shadow-sm flex items-center gap-2">
                  Solicitar assistência
                </button>
                <a href="#" className="px-4 py-2 text-blue text-sm hover:underline flex items-center gap-1">
                  Saiba mais
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
              </div>
              
              <div className="mt-6 bg-white/80 backdrop-blur-sm py-2 px-3 rounded-lg shadow-sm text-center sm:hidden w-fit">
                <p className="text-gray-800 text-xs">Tempo médio de atendimento</p>
                <p className="text-blue font-bold">30 minutos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 