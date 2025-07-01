"use client";

import { 
  Car,
  Bike,
  Truck,
  Building,
  Shield,
  Clock,
  Map,
  BadgeCheck,
  Sparkles,
  Gauge,
  Users
} from "lucide-react";
import Image from "next/image";
import AuroraBackground from "@/components/AuroraBackground";

export default function VehiclesSection() {
  // Tipos de veículos
  const vehicleTypes = [
    {
      icon: <Car className="w-10 h-10" />,
      title: "Carros",
      image: "/images/car-3d.png",
      description: "Cuidamos de todas as manutenções do seu automóvel, desde a troca de óleo até revisões completas.",
      features: [
        "Manutenções preventivas",
        "Troca de peças",
        "Diagnóstico eletrônico",
        "Alinhamento e balanceamento"
      ]
    },
    {
      icon: <Bike className="w-10 h-10" />,
      title: "Motos",
      image: "/images/moto-3d.png",
      description: "Serviços especializados para motocicletas de todos os modelos e cilindradas.",
      features: [
        "Revisões completas",
        "Troca de fluidos",
        "Ajuste de corrente",
        "Manutenção do sistema de freios"
      ]
    },
    {
      icon: <Truck className="w-10 h-10" />,
      title: "Caminhões",
      image: "/images/truck-3d.png",
      description: "Soluções de manutenção para veículos pesados que não podem ficar parados.",
      features: [
        "Manutenção preventiva",
        "Diagnóstico avançado",
        "Reparo de motor e câmbio",
        "Serviços para sistema de freios"
      ]
    }
  ];

  // Benefícios para frotas
  const fleetBenefits = [
    {
      icon: <Building className="w-6 h-6" />,
      title: "Gestão centralizada",
      description: "Administre todos os veículos da sua empresa em uma única plataforma."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Segurança garantida",
      description: "Controle de acesso por níveis de permissão e histórico completo de manutenções."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Manutenções programadas",
      description: "Agende serviços em lote e receba lembretes automáticos para revisões."
    },
    {
      icon: <Map className="w-6 h-6" />,
      title: "Cobertura nacional",
      description: "Atendimento em todo o Brasil com oficinas parceiras selecionadas."
    },
    {
      icon: <BadgeCheck className="w-6 h-6" />,
      title: "Relatórios detalhados",
      description: "Análise de custos, desempenho e histórico completo da sua frota."
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Descontos exclusivos",
      description: "Tarifas especiais para empresas com grande volume de serviços."
    }
  ];

  return (
    <section id="veiculos" className="py-24 relative overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0">
        <AuroraBackground particleColor="#0047CC" className="!absolute" />
      </div>
      
      <div className="container-custom relative z-10">
        {/* Cabeçalho da seção */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div 
            className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium mb-4"
            data-aos="fade-up"
          >
            Todos os veículos
          </div>
          <h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Soluções para qualquer tipo de veículo
          </h2>
          <p 
            className="text-gray-600 text-lg"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            O Instauto conecta você a oficinas especializadas para todos os tipos de veículos, garantindo o melhor serviço para cada necessidade.
          </p>
        </div>

        {/* Tipos de veículos */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {vehicleTypes.map((vehicle, index) => (
            <div 
              key={index}
              data-aos="fade-up"
              data-aos-delay={100 * index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 group hover:-translate-y-2 transition-all duration-300"
            >
              {/* Parte superior com imagem */}
              <div className="bg-gradient-to-br from-blue-light/30 to-blue-light/10 pt-8 pb-4 px-6 relative">
                <div className="absolute top-4 left-4 bg-white w-14 h-14 rounded-lg flex items-center justify-center text-blue-600 shadow-md">
                  {vehicle.icon}
                </div>
                <div className="flex justify-center h-48 relative">
                  <Image
                    src={vehicle.image}
                    alt={vehicle.title}
                    width={300}
                    height={200}
                    className="object-contain transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute -bottom-6 right-4 bg-white px-4 py-2 rounded-full shadow-md border border-gray-100">
                    <span className="font-bold text-blue-600">{vehicle.title}</span>
                  </div>
                </div>
              </div>
              
              {/* Parte inferior com descrição */}
              <div className="p-6">
                <p className="text-gray-600 mb-6">
                  {vehicle.description}
                </p>
                <ul className="space-y-2">
                  {vehicle.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Seção de frotas para empresas */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mt-16 relative">
          {/* Elementos decorativos na borda do card */}
          <div className="absolute -top-5 -right-5 w-14 h-14 bg-blue-600/10 rounded-full blur-md"></div>
          <div className="absolute -bottom-5 -left-5 w-14 h-14 bg-yellow-400/10 rounded-full blur-md"></div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Coluna de conteúdo */}
            <div className="p-10 md:p-12">
              <div 
                className="inline-block bg-yellow-400/20 text-gray-800 px-4 py-1 rounded-full text-sm font-medium mb-4"
                data-aos="fade-right"
              >
                Solução para empresas
              </div>
              <h3 
                className="text-2xl md:text-3xl font-bold mb-6 text-gray-900"
                data-aos="fade-right"
                data-aos-delay="100"
              >
                Gerenciamento de frotas para sua empresa
              </h3>
              <p 
                className="text-gray-600 mb-8"
                data-aos="fade-right"
                data-aos-delay="200"
              >
                O Instauto Enterprise oferece uma solução completa para gerenciar a manutenção da frota da sua empresa, reduzindo custos e aumentando a produtividade.
              </p>
              
              {/* Grid de benefícios */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {fleetBenefits.map((benefit, index) => (
                  <div 
                    key={index}
                    data-aos="fade-up"
                    data-aos-delay={100 * index}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                      {benefit.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">{benefit.title}</h4>
                      <p className="text-gray-600 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* CTA */}
              <div className="mt-10" data-aos="fade-up">
                <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Fale com um consultor
                </button>
              </div>
            </div>
            
            {/* Coluna da imagem */}
            <div className="relative hidden md:block">
              {/* Imagem principal */}
              <div className="absolute inset-0 z-0">
                <Image
                  src="/images/img-03.png"
                  alt="Gestão de frotas"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent"></div>
              </div>
              
              {/* Badge de estatísticas */}
              <div className="absolute bottom-10 right-10 z-10" data-aos="fade-up">
                <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <Gauge className="w-6 h-6 text-blue-600" />
                    <h4 className="font-bold text-gray-800">Estatísticas da frota</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Redução de custos:</span>
                      <span className="font-medium text-gray-800">Até 30%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tempo de manutenção:</span>
                      <span className="font-medium text-gray-800">-45%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Disponibilidade:</span>
                      <span className="font-medium text-gray-800">+28%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 