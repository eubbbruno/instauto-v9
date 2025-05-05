"use client";

import { useRef, useEffect } from "react";
import { 
  Bell, 
  Clock, 
  CreditCard, 
  Shield, 
  Smartphone, 
  Map, 
  MessageCircle, 
  Calendar
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Dados das funcionalidades
  const features = [
    {
      icon: <Map className="w-8 h-8" />,
      title: "Encontre oficinas próximas",
      description: "Localize as melhores oficinas próximas a você com base na sua localização atual ou endereço.",
      color: "bg-blue-light",
      textColor: "text-blue"
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Compare orçamentos",
      description: "Receba e compare diferentes orçamentos para escolher a melhor opção de custo-benefício.",
      color: "bg-yellow/20",
      textColor: "text-yellow-dark"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Agendamento simplificado",
      description: "Agende serviços diretamente pelo aplicativo, escolhendo data e horário que melhor se adequam a você.",
      color: "bg-blue-light",
      textColor: "text-blue"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Acompanhamento em tempo real",
      description: "Acompanhe o status do serviço em tempo real, com atualizações e fotos do processo.",
      color: "bg-yellow/20",
      textColor: "text-yellow-dark"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Chat integrado",
      description: "Comunique-se diretamente com a oficina através do chat integrado no aplicativo.",
      color: "bg-blue-light",
      textColor: "text-blue"
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Lembretes de manutenção",
      description: "Receba lembretes automáticos sobre as próximas manutenções preventivas do seu veículo.",
      color: "bg-yellow/20",
      textColor: "text-yellow-dark"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Avaliações e garantias",
      description: "Veja avaliações de outros usuários e tenha acesso às garantias oferecidas pelas oficinas.",
      color: "bg-blue-light",
      textColor: "text-blue"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Histórico completo",
      description: "Mantenha todo o histórico de manutenção do seu veículo organizado e acessível a qualquer momento.",
      color: "bg-yellow/20",
      textColor: "text-yellow-dark"
    }
  ];
  
  useEffect(() => {
    // Registra o plugin ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    if (sectionRef.current && featureRefs.current.length) {
      const ctx = gsap.context(() => {
        // Animação para cada funcionalidade
        featureRefs.current.forEach((feature, index) => {
          if (feature) {
            gsap.fromTo(
              feature,
              { 
                opacity: 0,
                y: 50
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: feature,
                  start: "top 80%",
                  toggleActions: "play none none none"
                },
                delay: index * 0.1
              }
            );
          }
        });
      }, sectionRef);
      
      // Cleanup
      return () => ctx.revert();
    }
  }, []);
  
  return (
    <section 
      id="funcionalidades" 
      ref={sectionRef}
      className="py-24 bg-white relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-light rounded-full opacity-20 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow/30 rounded-full opacity-30 blur-3xl translate-x-1/3 translate-y-1/3"></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block bg-blue-light text-blue px-4 py-1 rounded-full text-sm font-medium mb-4">
            Funcionalidades exclusivas
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Tudo o que você precisa em um só lugar
          </h2>
          <p className="text-gray-600 text-lg">
            O Instauto oferece uma série de funcionalidades para tornar a manutenção do seu veículo mais simples, transparente e econômica.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              ref={el => featureRefs.current[index] = el}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 h-full flex flex-col"
            >
              <div className={`w-16 h-16 rounded-xl ${feature.color} flex items-center justify-center mb-6`}>
                <div className={feature.textColor}>
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 flex-grow">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Call to action */}
        <div className="mt-16 text-center">
          <a 
            href="#app" 
            className="btn-primary inline-flex items-center"
          >
            Baixe o aplicativo agora
            <Smartphone className="ml-2 h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
} 