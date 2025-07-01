"use client";

import { 
  Clock, 
  Wallet, 
  Shield, 
  Star, 
  MessageSquare, 
  Bell, 
  Car,
  Gauge,
  BarChart
} from "lucide-react";
import Image from "next/image";

export default function BenefitsSection() {
  const benefits = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Economize tempo",
      description: "Encontre oficinas próximas e agende serviços em poucos minutos, sem telefonemas ou deslocamentos desnecessários."
    },
    {
      icon: <Wallet className="w-8 h-8" />,
      title: "Economize dinheiro",
      description: "Compare orçamentos de diferentes oficinas e escolha a melhor opção de custo-benefício para o seu veículo."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Maior segurança",
      description: "Todas as oficinas são verificadas e avaliadas por outros motoristas, garantindo um serviço de qualidade."
    },
    {
      icon: <Car className="w-8 h-8" />,
      title: "Garagem virtual",
      description: "Adicione todos os seus veículos e mantenha um histórico completo de manutenções, gastos e documentos em um só lugar."
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Comunicação direta",
      description: "Chat integrado com a oficina para tirar dúvidas e receber informações sobre o serviço."
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Lembretes de manutenção",
      description: "Receba notificações sobre as próximas manutenções preventivas do seu veículo."
    }
  ];

  return (
    <section id="beneficios" className="py-24 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div 
            className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium mb-4"
            data-aos="fade-up"
          >
            Vantagens exclusivas
          </div>
          <h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Por que escolher o Instauto?
          </h2>
          <p 
            className="text-gray-600 text-lg"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Oferecemos uma solução completa para cuidar do seu veículo com praticidade, transparência e economia.
          </p>
        </div>

        {/* Linha principal com imagem e benefícios */}
        <div className="grid md:grid-cols-2 gap-10 mb-16 items-center">
          {/* Coluna da imagem */}
          <div className="order-2 md:order-1" data-aos="fade-right">
            <div className="relative">
              {/* Decoração de fundo */}
              <div className="absolute -inset-4 bg-gradient-to-br from-blue/5 to-blue/10 rounded-3xl blur-sm"></div>
              
              {/* Container da imagem */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl relative p-3 border border-gray-100">
                <div className="rounded-2xl overflow-hidden">
                  <Image
                    src="/images/img-06.png"
                    alt="Interface do Instauto"
                    width={600}
                    height={450}
                    className="w-full h-auto object-cover rounded-2xl"
                  />
                </div>
              </div>
              
              {/* Badge de avaliação - flutuante e animada */}
              <div className="absolute right-4 -top-8 z-10" data-aos="fade-down" data-aos-delay="300">
                <div className="bg-white px-5 py-3 rounded-xl shadow-xl border border-gray-100 flex items-center gap-2 transform hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < 4 ? 'text-yellow-400' : i === 4 ? 'text-yellow-400/80' : 'text-gray-300'}`} 
                        fill={i < 4 ? '#FFDE59' : i === 4 ? '#FFDE59' : 'none'}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-gray-800 text-lg">4.8/5</span>
                </div>
              </div>
              
              {/* Elementos decorativos */}
              <div className="absolute -bottom-6 -right-6 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg" data-aos="fade-up" data-aos-delay="400">
                <Shield className="w-7 h-7 text-blue-600" />
              </div>
              <div className="absolute -top-6 -left-6 w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg" data-aos="fade-down" data-aos-delay="400">
                <Wallet className="w-7 h-7 text-gray-800" />
              </div>
              
              {/* Elementos adicionais para a garagem virtual */}
              <div className="absolute -bottom-4 left-10 bg-white p-2 rounded-lg shadow-md border border-gray-100" data-aos="fade-up" data-aos-delay="500">
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-blue-600" />
                  <Gauge className="h-5 w-5 text-yellow-400" />
                  <BarChart className="h-5 w-5 text-blue-dark" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Coluna dos benefícios */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 order-1 md:order-2">
            {benefits.slice(0, 4).map((benefit, index) => (
              <div 
                key={index}
                data-aos="fade-up"
                data-aos-delay={100 * index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-1"
              >
                <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <div className="text-blue-600 group-hover:text-white transition-colors duration-300">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Segunda linha de benefícios */}
        <div className="grid md:grid-cols-2 gap-6">
          {benefits.slice(4, 6).map((benefit, index) => (
            <div 
              key={index}
              data-aos="fade-up"
              data-aos-delay={100 * (index + 4)}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-1"
            >
              <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <div className="text-blue-600 group-hover:text-white transition-colors duration-300">
                  {benefit.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors duration-300">
                {benefit.title}
              </h3>
              <p className="text-gray-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>        
      </div>
    </section>
  );
} 