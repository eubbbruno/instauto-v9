"use client";

import { useRef, useEffect, useState } from "react";
import { 
  Bell, 
  Clock, 
  CreditCard, 
  Map, 
  MessageCircle, 
  Calendar,
  ChevronRight,
  Star,
  Zap
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  
  // Dados das funcionalidades
  const features = [
    {
      icon: <Map className="w-12 h-12" />,
      title: "Encontre oficinas próximas",
      description: "Localize as melhores oficinas próximas a você com base na sua localização atual ou endereço.",
      color: "from-blue-500 to-blue-400",
      textColor: "text-blue-900",
      iconBg: "bg-blue-100",
      btnBg: "bg-blue-600/90",
      highlight: "Raio de 50km"
    },
    {
      icon: <CreditCard className="w-12 h-12" />,
      title: "Compare orçamentos",
      description: "Receba e compare diferentes orçamentos para escolher a melhor opção de custo-benefício.",
      color: "from-yellow-400 to-amber-300",
      textColor: "text-amber-900",
      iconBg: "bg-amber-100",
      btnBg: "bg-amber-500/90",
      highlight: "Economize até 30%"
    },
    {
      icon: <Calendar className="w-12 h-12" />,
      title: "Agendamento simplificado",
      description: "Agende serviços diretamente pela plataforma, escolhendo data e horário que melhor se adequam a você.",
      color: "from-blue-500 to-blue-400",
      textColor: "text-blue-900",
      iconBg: "bg-blue-100",
      btnBg: "bg-blue-600/90",
      highlight: "Em 2 minutos"
    },
    {
      icon: <Clock className="w-12 h-12" />,
      title: "Acompanhamento em tempo real",
      description: "Acompanhe o status do serviço em tempo real, com atualizações e fotos do processo.",
      color: "from-yellow-400 to-amber-300",
      textColor: "text-amber-900",
      iconBg: "bg-amber-100",
      btnBg: "bg-amber-500/90",
      highlight: "Notificações automáticas"
    },
    {
      icon: <MessageCircle className="w-12 h-12" />,
      title: "Chat integrado",
      description: "Comunique-se diretamente com a oficina através do chat integrado na plataforma.",
      color: "from-blue-500 to-blue-400",
      textColor: "text-blue-900",
      iconBg: "bg-blue-100",
      btnBg: "bg-blue-600/90",
      highlight: "Resposta rápida"
    },
    {
      icon: <Bell className="w-12 h-12" />,
      title: "Lembretes de manutenção",
      description: "Receba lembretes automáticos sobre as próximas manutenções preventivas do seu veículo.",
      color: "from-yellow-400 to-amber-300",
      textColor: "text-amber-900",
      iconBg: "bg-amber-100",
      btnBg: "bg-amber-500/90",
      highlight: "Nunca mais esqueça"
    }
  ];
  
  // Função para lidar com o hover do mouse
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (!cardRefs.current[index]) return;
    
    const card = cardRefs.current[index];
    const rect = card?.getBoundingClientRect();
    
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      if (card) {
        gsap.to(card, {
          rotationX: rotateX,
          rotationY: rotateY,
          duration: 0.5,
          ease: "power2.out"
        });
      }
    }
  };
  
  // Reseta a rotação ao tirar o mouse
  const handleMouseLeave = (index: number) => {
    if (cardRefs.current[index]) {
      gsap.to(cardRefs.current[index], {
        rotationX: 0,
        rotationY: 0,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  };
  
  useEffect(() => {
    // Registra o plugin ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    if (sectionRef.current && cardRefs.current.length) {
      const ctx = gsap.context(() => {
        // Animação para os cards
        cardRefs.current.forEach((card, index) => {
          if (card) {
            gsap.fromTo(
              card,
              { 
                opacity: 0,
                y: 50,
                scale: 0.9
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 85%",
                  end: "bottom 20%",
                  toggleActions: "play none none none"
                },
                delay: index * 0.15
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
      className="py-24 relative overflow-hidden bg-[#FFF8E1] text-blue-900"
    >
      {/* Efeito de luzes e particles */}
      <div className="absolute top-0 right-0 w-1/3 h-2/3 bg-amber-200/30 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-amber-100/30 rounded-full blur-[120px]"></div>
      <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-yellow-200/20 rounded-full blur-[50px]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-yellow-300/15 rounded-full blur-[80px]"></div>
      
      {/* Padrão de pontos */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E5AB00_1px,transparent_1px)] bg-[length:20px_20px]"></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-300 px-4 py-1 rounded-full text-sm font-medium mb-6 shadow-sm text-blue-700">
            <Star className="w-4 h-4 text-blue-500" />
            <span className="font-semibold text-blue-500">Funcionalidades Premium</span>

          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-blue-700 font-syne">
            Recursos avançados para você
          </h2>
          <p className="text-blue-800 text-lg font-jakarta">
            Conheça as funcionalidades exclusivas do Instauto que transformam a maneira como você cuida do seu veículo.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={el => { cardRefs.current[index] = el; }}
              className="group relative perspective-1000"
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={() => handleMouseLeave(index)}
              onMouseEnter={() => setActiveCard(index)}
              onMouseOut={() => setActiveCard(null)}
            >
              <div 
                className={`bg-white relative preserve-3d rounded-2xl overflow-hidden transition-all duration-500 h-full ${
                  activeCard === index 
                    ? 'shadow-xl shadow-blue-300/30 translate-y-[-10px]' 
                    : 'shadow-lg hover:shadow-xl hover:translate-y-[-5px]'
                }`}
              >
                {/* Borda decorativa colorida */}
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${feature.color}`}></div>
                
                {/* Camada de brilho */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent_80%)]"></div>
                
                {/* Conteúdo */}
                <div className="relative p-8 h-full flex flex-col">
                  <div className={`${feature.iconBg} w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-md transform transition-transform group-hover:rotate-3 ${feature.textColor}`}>
                    {feature.icon}
                  </div>
                  
                  <div className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full w-fit mb-4 shadow-sm ${
                    feature.color.includes('blue') 
                      ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                      : 'bg-amber-100 text-amber-700 border border-amber-200'
                  }`}>
                    <Zap className={feature.color.includes('blue') ? "w-3 h-3 text-blue-600" : "w-3 h-3 text-amber-600"} />
                    {feature.highlight}
                  </div>
                  
                  <h3 className={`text-2xl font-bold mb-3 ${feature.textColor} font-syne`}>
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 flex-grow font-jakarta">
                    {feature.description}
                  </p>
                  
                  <div className="mt-auto">
                    <button 
                      className={`inline-flex items-center gap-1 font-bold text-sm rounded-lg px-4 py-2 transition-all shadow-sm group-hover:shadow ${
                        feature.color.includes('blue') 
                          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200' 
                          : 'bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200'
                      }`}
                    >
                      <span>Saiba mais</span>
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* CTA */}
        <div className="mt-20 text-center">
          <div 
            className="max-w-2xl mx-auto bg-white rounded-2xl p-10 shadow-xl border border-amber-200/50 relative overflow-hidden"
          >
            {/* Efeitos decorativos */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-100/40 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-200/40 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4 text-blue-700 font-syne">
                Pronto para experimentar?
              </h3>
              <p className="text-blue-800 mb-8 max-w-lg mx-auto font-jakarta">
                Acesse a plataforma web Instauto e tenha todas essas funcionalidades em um só lugar.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="/auth/motorista" 
                  className="btn-primary inline-flex items-center gap-2 group"
                >
                  <span>Acessar plataforma</span>
                  <ChevronRight className="w-5 h-5" />
                </a>
                <a 
                  href="#como-funciona" 
                  className="btn-outline inline-flex items-center gap-2"
                >
                  <span>Saiba mais</span>
                  <ChevronRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 