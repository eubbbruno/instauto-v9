"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, Check, Wrench, BarChart3, Car, Calendar, Users, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { gsap } from "gsap";

const HowItWorksSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const ctaButtonRef = useRef<HTMLAnchorElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const isDesktop = windowWidth >= 768;
  
  // Detectar largura da janela para responsividade
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize(); // Inicializar
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Efeito de pulsação no botão CTA
  useEffect(() => {
    if (ctaButtonRef.current) {
      const tl = gsap.timeline({ repeat: -1, yoyo: true });
      tl.to(ctaButtonRef.current, { 
        scale: 1.03,
        duration: 1.5, 
        ease: "sine.inOut" 
      });
    }
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95]);
  
  // Controles do carrossel
  const nextStep = () => setActiveStep((prev) => (prev === 2 ? 0 : prev + 1));
  const prevStep = () => setActiveStep((prev) => (prev === 0 ? 2 : prev - 1));
  
  // Auto-avanço do carrossel (opcional)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDesktop) {
        nextStep();
      }
    }, 7000);
    return () => clearInterval(interval);
  }, [isDesktop]);
  
  // Animações para os cards
  const cardVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.5
      }
    })
  };
  
  // Animação para indicadores de progresso
  const dotVariants = {
    inactive: { scale: 1, opacity: 0.5 },
    active: { 
      scale: 1.2, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  // Benefícios para cada etapa
  const stepFeatures = [
    [
      {icon: <Calendar className="w-4 h-4" />, text: "2 minutos para registrar"},
      {icon: <Check className="w-4 h-4" />, text: "Sem documentos complexos"},
      {icon: <Users className="w-4 h-4" />, text: "Suporte na configuração"}
    ],
    [
      {icon: <Car className="w-4 h-4" />, text: "Conexão com motoristas locais"},
      {icon: <Check className="w-4 h-4" />, text: "Notificações em tempo real"},
      {icon: <Wrench className="w-4 h-4" />, text: "Filtro por especialidade"}
    ],
    [
      {icon: <BarChart3 className="w-4 h-4" />, text: "Analytics detalhados"},
      {icon: <Heart className="w-4 h-4" />, text: "Fidelização de clientes"},
      {icon: <Check className="w-4 h-4" />, text: "Sistema financeiro completo"}
    ]
  ];

  // Dados dos passos
  const steps = [
    {
      title: "Cadastre-se",
      description: "Crie sua conta gratuitamente, configure os serviços que sua oficina oferece e personalize seu perfil em poucos minutos.",
      features: stepFeatures[0],
      image: "/images/passo-01.png"
    },
    {
      title: "Receba solicitações",
      description: "Motoristas próximos à sua oficina enviam solicitações de orçamentos para seus serviços com todos os detalhes necessários.",
      features: stepFeatures[1],
      image: "/images/passo-02.png"
    },
    {
      title: "Gerencie tudo",
      description: "Administre ordens de serviço, finanças, estoque e relacionamento com clientes em um único painel intuitivo.",
      features: stepFeatures[2],
      image: "/images/passo-03.png"
    }
  ];

  // Trilha de conexão SVG para versão desktop
  const ConnectionPath = () => (
    <svg className="absolute top-1/2 left-0 w-full h-8 -mt-4 z-0 hidden md:block" viewBox="0 0 1000 50">
      <path 
        d="M0,25 C150,25 150,25 300,25 C450,25 450,25 600,25 C750,25 750,25 900,25 L1000,25" 
        fill="none" 
        stroke="url(#gradient-line)" 
        strokeWidth="2" 
        strokeDasharray="6 3"
        className="path-animation"
      />
      <defs>
        <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0047CC" />
          <stop offset="50%" stopColor="#FFDE59" />
          <stop offset="100%" stopColor="#0047CC" />
        </linearGradient>
      </defs>
    </svg>
  );

  // Componente de cartão de passo
  const StepCard = ({ step, index, isActive }: { step: typeof steps[0], index: number, isActive: boolean }) => {
    const bgClass = isActive ? "bg-brand-yellow" : "bg-white";
    const borderClass = isActive ? "border-yellow-400/50" : "border-brand-light";

    return (
      <motion.div
        className={`relative rounded-2xl p-6 md:p-8 ${bgClass} border ${borderClass} 
          shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden
          w-full max-w-md mx-auto md:mx-0`}
        whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
        initial="inactive"
        animate={isActive ? "active" : "inactive"}
        aria-label={`Passo ${index + 1}: ${step.title}`}
      >
        <div className="mb-5">
          <div className="flex items-center mb-3">
            <motion.div 
              className="flex-shrink-0 mr-3"
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
            >
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${isActive ? "bg-yellow-400" : "bg-white"} shadow-md text-xl font-bold font-syne text-blue-600 border-2 ${isActive ? "border-yellow-500" : "border-blue-100"}`}>
                {index + 1}
              </div>
            </motion.div>
            <h3 className="text-2xl font-bold font-syne text-text-base">{step.title}</h3>
          </div>
          <p className="text-gray-700 font-sans">{step.description}</p>
        </div>
      
        {/* Lista de benefícios */}
        <div className="space-y-2 mb-4">
          {step.features.map((feature, j) => (
            <div key={j} className="flex items-center">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600/10 flex items-center justify-center mr-3 text-blue-600">
                {feature.icon}
              </div>
              <span className="text-sm text-gray-700 font-sans">{feature.text}</span>
            </div>
          ))}
        </div>
      
        {/* Imagem ilustrativa */}
        <div className="h-48 md:h-52 relative rounded-lg overflow-hidden bg-white/80 shadow-inner">
          <Image 
            src={step.image}
            alt={`Ilustração de ${step.title}`} 
            fill
            style={{objectFit: "contain"}}
            className="p-2"
          />
        </div>
      </motion.div>
    );
  };

  return (
    <section 
      id="como-funciona" 
      ref={sectionRef}
      className="py-24 bg-white relative overflow-hidden"
      data-contrast="light"
    >
      {/* Elementos decorativos de fundo com efeito parallax */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-20 -right-20 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl"
          style={{ 
            y: useTransform(scrollYProgress, [0, 1], [0, -50]),
            x: useTransform(scrollYProgress, [0, 1], [0, 20])
          }}
        />
        <motion.div 
          className="absolute top-1/3 -left-20 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl"
          style={{ 
            y: useTransform(scrollYProgress, [0, 1], [0, 50]),
            x: useTransform(scrollYProgress, [0, 1], [0, -20])
          }}
        />
        <div className="absolute -bottom-40 left-1/2 transform -translate-x-1/2 w-[120%] h-96 bg-gradient-to-b from-blue-50/80 to-white"></div>
        
        <motion.div 
          className="absolute top-40 left-10 w-2 h-2 bg-blue-600 rounded-full shadow-lg shadow-blue-600/30"
          animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-60 right-[10%] w-3 h-3 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/30"
          animate={{ y: [0, -15, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div 
          className="absolute bottom-20 left-[20%] w-2 h-2 bg-blue-600 rounded-full shadow-lg shadow-blue-600/30"
          animate={{ y: [0, 12, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.div 
          className="absolute bottom-40 right-20 w-2 h-2 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/30"
          animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
        
        <div className="absolute w-full h-full bg-grid-pattern opacity-5"></div>
      </div>
      
      <motion.div 
        className="container-custom relative z-10"
        style={{ opacity, scale }}
      >
        {/* Cabeçalho da seção */}
        <div className="text-center mb-16 md:mb-20 relative">
          <div className="relative h-8 flex items-center justify-center mb-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block"
            >
              <span className="bg-blue-600/10 text-blue-600 px-5 py-1.5 rounded-full text-sm font-medium">
                Processo simplificado
              </span>
            </motion.div>
          </div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-6 font-syne text-text-base relative inline-block"
          >
            Como funciona a plataforma
            <div className="absolute -bottom-3 left-0 w-full h-1 bg-gradient-to-r from-blue/0 via-blue to-blue/0"></div>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-700 max-w-2xl mx-auto text-lg font-sans"
          >
            Três etapas simples para transformar sua oficina em um negócio digital 
            e começar a atrair mais clientes hoje mesmo.
          </motion.p>
        </div>

        {/* Carrossel responsivo e conexões */}
        <div className="relative">
          {/* Conexões entre passos (apenas desktop) */}
          <ConnectionPath />
          
          {/* Versão Desktop: Grid fluido com todos os cartões */}
          <div className="hidden md:grid md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, i) => (
              <StepCard 
                key={i} 
                step={step} 
                index={i} 
                isActive={i === activeStep}
              />
            ))}
          </div>
          
          {/* Versão Mobile: Carrossel interativo */}
          <div className="md:hidden relative">
            {/* Controles do carrossel */}
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 z-20 flex justify-between w-full px-2">
              <button 
                onClick={prevStep}
                className="btn-white w-10 h-10 rounded-full flex items-center justify-center border border-blue-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={nextStep}
                className="btn-white w-10 h-10 rounded-full flex items-center justify-center border border-blue-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            {/* Cartão ativo no carrossel */}
            <AnimatePresence initial={false} custom={1}>
              <motion.div
                key={activeStep}
                custom={1}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full"
              >
                <StepCard 
                  step={steps[activeStep]} 
                  index={activeStep} 
                  isActive={true}
                />
              </motion.div>
            </AnimatePresence>
            
            {/* Indicadores de página do carrossel */}
            <div className="flex justify-center space-x-2 mt-6">
              {[0, 1, 2].map((i) => (
                <motion.button
                  key={i}
                  className={`w-3 h-3 rounded-full ${i === activeStep ? 'bg-blue-600' : 'bg-gray-300'}`}
                  variants={dotVariants}
                  initial="inactive"
                  animate={i === activeStep ? "active" : "inactive"}
                  onClick={() => setActiveStep(i)}
                  aria-label={`Ver passo ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* CTA no final da seção */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Link 
            href="/cadastro" 
            ref={ctaButtonRef}
            className="btn-primary"
          >
            <span className="font-sans">Começar agora</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <p className="mt-4 text-sm text-gray-500 font-sans">Sem cartão de crédito • 14 dias grátis • Cancelamento a qualquer momento</p>
        </motion.div>
      </motion.div>
      
      {/* Estilos adicionais para animações */}
      <style jsx global>{`
        .path-animation {
          stroke-dashoffset: 0;
          animation: pathAnimate 15s linear infinite;
        }
        
        @keyframes pathAnimate {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -30;
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .path-animation {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};

export default HowItWorksSection; 