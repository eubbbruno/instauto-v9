"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { 
  Search, 
  ListChecks, 
  Calendar, 
  Star,
  ArrowRight,
  CheckCircle,
  Clock,
  ThumbsUp,
  Wallet
} from "lucide-react";

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Registra o plugin ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    const steps = document.querySelectorAll('.step-item');
    
    // Inicializa as animações quando o componente montar
    if (sectionRef.current && timelineRef.current && steps.length) {
      // Anima a linha do timeline
      gsap.fromTo(
        timelineRef.current,
        { height: 0 },
        { 
          height: '100%', 
          duration: 1.5,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'bottom 60%',
            toggleActions: 'play none none reverse',
          }
        }
      );
      
      // Anima cada etapa
      steps.forEach((step, index) => {
        gsap.fromTo(
          step,
          { 
            opacity: 0,
            x: index % 2 === 0 ? -50 : 50
          },
          { 
            opacity: 1, 
            x: 0,
            duration: 0.8,
            delay: index * 0.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      });
    }
    
    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  const steps = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "Descreva seu problema",
      description: "Conte-nos o que seu veículo precisa: manutenção, reparo ou emergência. Nosso sistema inteligente identifica o serviço adequado.",
      color: "bg-yellow-400/20",
      textColor: "text-blue-600",
      illustration: "/images/passo-01.png",
      benefits: ["Solicite qualquer tipo de serviço", "Diagnóstico preliminar inteligente", "Especifique detalhes do veículo"]
    },
    {
      icon: <ListChecks className="w-8 h-8" />,
      title: "Compare orçamentos",
      description: "Receba propostas personalizadas de oficinas verificadas próximas a você, com valores transparentes, prazos e avaliações.",
      color: "bg-yellow-400/20",
      textColor: "text-blue-600",
      illustration: "/images/passo-02.png",
      benefits: ["Até 5 orçamentos em minutos", "Preços sem surpresas", "Filtros por proximidade e avaliações"]
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Agende com facilidade",
      description: "Escolha a melhor proposta e agende com apenas alguns cliques. Receba confirmação imediata e lembretes automáticos.",
      color: "bg-yellow-400/20",
      textColor: "text-blue-600",
      illustration: "/images/passo-03.png",
      benefits: ["Confirmação em tempo real", "Escolha data e horário", "Serviço de leva e traz opcional"]
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Acompanhe todo o processo",
      description: "Monitore o progresso do serviço, receba fotos e atualizações em tempo real, e avalie a qualidade ao finalizar.",
      color: "bg-yellow-400/20",
      textColor: "text-blue-600",
      illustration: "/images/passo-04.png",
      benefits: ["Notificações em tempo real", "Fotos do antes e depois", "Histórico completo no seu perfil"]
    },
  ];

  return (
    <section 
      id="como-funciona" 
      ref={sectionRef} 
      className="py-24 relative overflow-hidden"
      style={{
        backgroundImage: "linear-gradient(120deg, #f0f8ff 0%, #f5f7fa 100%)",
      }}
    >
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-full h-full bg-grid-pattern"></div>
      </div>
      
      {/* Círculos decorativos */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-1/3 left-1/4 w-40 h-40 bg-blue-600/10 rounded-full blur-2xl"></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-block bg-blue-100 text-blue-600 px-5 py-2 rounded-full text-sm font-medium mb-4">
            Processo simples em 4 passos
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Como o Instauto facilita sua vida
          </h2>
          <p className="text-gray-600 text-lg">
            Esqueça as ligações infinitas e orçamentos imprecisos. Nosso processo digital conecta você às melhores oficinas com total transparência e praticidade.
          </p>
        </div>
        
        <div className="relative mt-20">
          {/* Linha central */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 transform -translate-x-1/2 md:block hidden">
            <div 
              ref={timelineRef} 
              className="absolute left-0 top-0 w-full bg-blue-600 origin-top"
              style={{ height: '0%' }}
            ></div>
          </div>
          
          <div className="relative z-10">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`step-item relative mb-24 grid md:grid-cols-2 gap-10 items-center ${
                  index % 2 === 0 ? '' : 'md:flex-row-reverse'
                }`}
              >
                <div 
                  className={`order-1 ${index % 2 === 0 ? 'md:text-right md:pr-16' : 'md:order-2 md:pl-16'}`}
                >
                  <div className="mb-8">
                    <div className="relative">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${step.color} ${step.textColor} mb-4 shadow-md`}>
                        {step.icon}
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-blue-dark font-bold text-lg">
                        {index + 1}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-lg">
                      {step.description}
                    </p>
                  </div>
                  
                  {/* Lista de benefícios */}
                  <ul className={`space-y-2 text-sm ${index % 2 === 0 ? 'md:ml-auto' : ''}`}>
                    {step.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="flex-shrink-0 w-5 h-5 text-blue-600" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div 
                  className={`relative flex justify-center ${
                    index % 2 === 0 ? 'md:order-2' : 'md:order-1'
                  }`}
                >
                  {/* Círculo indicador na linha do tempo - visível apenas em desktop */}
                  <div className="absolute left-1/2 md:top-1/2 transform -translate-x-1/2 md:-translate-y-1/2 hidden md:block">
                    <div className="w-12 h-12 rounded-full bg-white border-4 border-blue-600 flex items-center justify-center shadow-lg">
                      <span className="font-bold text-blue-600 text-xl">{index + 1}</span>
                    </div>
                  </div>
                  
                  {/* Card para ilustração */}
                  <div className={`relative w-full max-w-md rounded-2xl shadow-xl overflow-hidden group ${
                    index % 2 === 0 ? 'md:ml-16' : 'md:mr-16'
                  }`}>
                    <div className="p-1">
                      <div className="rounded-xl overflow-hidden bg-white">
                        {/* Container quadrado para a imagem */}
                        <div className="relative w-full aspect-square">
                          <Image
                            src={step.illustration}
                            alt={step.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 500px"
                          />
                        </div>
                        
                        <div className="p-5 bg-gray-50 rounded-b-xl">
                          <div className={`flex items-center mb-2 text-lg font-medium ${step.textColor}`}>
                            {step.icon}
                            <span className="ml-2">Passo {index + 1}</span>
                          </div>
                          <div className="text-gray-800 font-medium">
                            {step.title}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Efeito de brilho no hover */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-yellow-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Estatísticas de satisfação */}
        <div className="bg-white rounded-2xl p-8 mt-12 shadow-lg border border-gray-100">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Por que motoristas escolhem o Instauto</h3>
            <p className="text-gray-600">Nossa plataforma conecta motoristas e oficinas de forma rápida e transparente</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-3">
                <Clock className="w-7 h-7" />
              </div>
              <div className="text-3xl font-bold text-gray-800">80%</div>
              <div className="text-gray-600 text-sm">Economia de tempo</div>
            </div>
            
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-3">
                <ThumbsUp className="w-7 h-7" />
              </div>
              <div className="text-3xl font-bold text-gray-800">95%</div>
              <div className="text-gray-600 text-sm">Satisfação dos clientes</div>
            </div>
            
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-3">
                <Wallet className="w-7 h-7" />
              </div>
              <div className="text-3xl font-bold text-gray-800">30%</div>
              <div className="text-gray-600 text-sm">Economia média</div>
            </div>
            
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-3">
                <Star className="w-7 h-7" />
              </div>
              <div className="text-3xl font-bold text-gray-800">4.8/5</div>
              <div className="text-gray-600 text-sm">Avaliação média</div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <a 
            href="#beneficios" 
            className="btn-primary inline-flex items-center px-8 py-4 text-lg"
          >
            Começar agora
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </div>
      
      {/* Círculos decorativos na parte inferior */}
      <div className="absolute -bottom-12 left-0 right-0 flex justify-around">
        <div className="w-24 h-24 bg-blue-600/5 rounded-full"></div>
        <div className="w-16 h-16 bg-yellow-400/5 rounded-full"></div>
        <div className="w-32 h-32 bg-blue-600/5 rounded-full"></div>
        <div className="w-20 h-20 bg-yellow-400/5 rounded-full"></div>
        <div className="w-28 h-28 bg-blue-600/5 rounded-full"></div>
      </div>
    </section>
  );
} 