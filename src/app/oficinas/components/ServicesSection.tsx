"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  WrenchScrewdriverIcon,
  CogIcon,
  ShieldCheckIcon,
  ClockIcon,
  CubeIcon,
  SparklesIcon,
  PlusIcon,
  BoltIcon,
  ArrowLongRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PaintBrushIcon,
  SparklesIcon as SparklesIcon2,
  BeakerIcon,
  PhoneIcon,
  WrenchIcon
} from "@heroicons/react/24/outline";

// Lista de serviços oferecidos com cores e categorias
const services = [
  { 
    title: "Troca de óleo e filtros",
    icon: <WrenchScrewdriverIcon className="w-10 h-10" />,
    description: "Manutenção preventiva para garantir a vida útil do motor e sistema de filtragem.",
    benefits: [
      "Prolonga a vida útil do motor",
      "Melhora o desempenho do veículo",
      "Reduz o consumo de combustível"
    ],
    category: "Manutenção",
    color: "blue",
    popular: true
  },
  { 
    title: "Freios e suspensão",
    icon: <CogIcon className="w-10 h-10" />,
    description: "Serviços especializados para segurança e conforto na direção.",
    benefits: [
      "Aumenta a segurança na direção",
      "Reduz desgaste de componentes",
      "Melhora o conforto ao dirigir"
    ],
    category: "Segurança",
    color: "yellow"
  },
  { 
    title: "Alinhamento e balanceamento",
    icon: <SparklesIcon className="w-10 h-10" />,
    description: "Estabilidade e durabilidade para pneus e suspensão.",
    benefits: [
      "Prolonga a vida útil dos pneus",
      "Melhora a dirigibilidade",
      "Evita vibrações no volante"
    ],
    category: "Manutenção",
    color: "blue"
  },
  { 
    title: "Revisão geral",
    icon: <ClockIcon className="w-10 h-10" />,
    description: "Manutenção preventiva completa seguindo o manual do fabricante.",
    benefits: [
      "Identificação antecipada de problemas",
      "Valorização do veículo",
      "Economia a longo prazo"
    ],
    category: "Manutenção",
    color: "yellow",
    popular: true
  },
  { 
    title: "Injeção eletrônica",
    icon: <CubeIcon className="w-10 h-10" />,
    description: "Diagnóstico e reparo de sistemas eletrônicos do veículo.",
    benefits: [
      "Otimização do consumo de combustível",
      "Diagnóstico preciso de falhas",
      "Aumento da potência do motor"
    ],
    category: "Eletrônica",
    color: "blue"
  },
  { 
    title: "Elétrica e diagnóstico",
    icon: <ShieldCheckIcon className="w-10 h-10" />,
    description: "Identificação e solução de problemas elétricos e eletrônicos.",
    benefits: [
      "Solução de curtos-circuitos",
      "Reparo de sistemas de conforto",
      "Diagnóstico computadorizado"
    ],
    category: "Eletrônica",
    color: "yellow"
  },
  { 
    title: "Pneus",
    icon: <WrenchIcon className="w-10 h-10" />,
    description: "Venda, montagem, desmontagem e conserto de pneus para todos os tipos de veículos.",
    benefits: [
      "Maior segurança em todas as condições",
      "Melhor aderência e estabilidade",
      "Redução no consumo de combustível"
    ],
    category: "Rodagem",
    color: "blue",
    popular: true
  },
  { 
    title: "Rodas",
    icon: <CogIcon className="w-10 h-10" />,
    description: "Balanceamento avançado, pintura e reparo de rodas de diversos modelos e materiais.",
    benefits: [
      "Maior durabilidade das rodas",
      "Redução de vibrações ao dirigir",
      "Melhoria na aparência do veículo"
    ],
    category: "Rodagem",
    color: "yellow"
  },
  { 
    title: "Pintura Automotiva",
    icon: <PaintBrushIcon className="w-10 h-10" />,
    description: "Repintura, retoques e envelopamento para renovar o visual do seu veículo.",
    benefits: [
      "Proteção contra corrosão e intempéries",
      "Valorização do veículo na revenda",
      "Personalização conforme preferência"
    ],
    category: "Estética",
    color: "blue"
  },
  { 
    title: "Estética e Polimento",
    icon: <SparklesIcon2 className="w-10 h-10" />,
    description: "Polimento, cristalização e manutenção de pintura para um brilho duradouro.",
    benefits: [
      "Proteção contra raios UV",
      "Remoção de riscos e marcas superficiais",
      "Aparência de carro novo por mais tempo"
    ],
    category: "Estética",
    color: "yellow",
    popular: true
  },
  { 
    title: "Lavagem Rápida",
    icon: <BeakerIcon className="w-10 h-10" />,
    description: "Lavagem externa e interna express para quem tem pressa mas não abre mão da limpeza.",
    benefits: [
      "Economia de tempo no dia a dia",
      "Higienização básica com qualidade",
      "Manutenção da aparência do veículo"
    ],
    category: "Estética",
    color: "blue"
  },
  { 
    title: "Socorro 24h",
    icon: <PhoneIcon className="w-10 h-10" />,
    description: "Chamada automática de guincho/SOS para emergências em qualquer horário.",
    benefits: [
      "Assistência imediata em emergências",
      "Cobertura em diversas regiões",
      "Tranquilidade para viagens longas"
    ],
    category: "Emergência",
    color: "yellow"
  }
];

const ServicesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeService, setActiveService] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [particles, setParticles] = useState<Array<{
    width: number;
    height: number;
    top: number;
    left: number;
    blur: number;
    yOffset: number;
    duration: number;
    isBlue: boolean;
  }>>([]);
  
  // Gerar partículas apenas uma vez no cliente
  useEffect(() => {
    const newParticles = Array(20).fill(null).map(() => ({
      width: Math.random() * 6 + 2,
      height: Math.random() * 6 + 2,
      top: Math.random() * 100,
      left: Math.random() * 100,
      blur: Math.random() * 10 + 5,
      yOffset: Math.random() * 100 - 50,
      duration: Math.random() * 10 + 20,
      isBlue: Math.random() > 0.5
    }));
    
    setParticles(newParticles);
  }, []);
  
  // Para controlar o autoplay
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAutoplay) {
      interval = setInterval(() => {
        setActiveService((prev) => (prev + 1) % services.length);
      }, 5000);
    }
    
    return () => clearInterval(interval);
  }, [isAutoplay]);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [50, 0, 0, -50]);
  
  // Navegar entre serviços
  const nextService = () => {
    setIsAutoplay(false);
    setActiveService((prev) => (prev + 1) % services.length);
  };
  
  const prevService = () => {
    setIsAutoplay(false);
    setActiveService((prev) => (prev - 1 + services.length) % services.length);
  };
  
  // Selecionar um serviço específico
  const selectService = (index: number) => {
    setIsAutoplay(false);
    setActiveService(index);
  };
  
  const service = services[activeService];

  return (
    <section 
      ref={sectionRef}
      className="py-24 relative overflow-hidden"
      data-contrast="light"
    >
      {/* Fundo decorativo e gradiente */}
      <div className="absolute inset-0 bg-white bg-grid-pattern opacity-5 overflow-hidden">
        {/* Elementos decorativos animados */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-full"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]) }}
        >
          {particles.map((particle, i) => (
            <motion.div 
              key={i}
              className={`absolute rounded-full ${
                particle.isBlue ? 'bg-blue/20' : 'bg-yellow/20'
              }`}
              style={{
                top: `${particle.top}%`,
                left: `${particle.left}%`,
                width: `${particle.width}px`,
                height: `${particle.height}px`,
                filter: `blur(${particle.blur}px)`
              }}
              animate={{ 
                y: [0, particle.yOffset, 0],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: particle.duration,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </div>

      <motion.div 
        className="container-custom relative z-10"
        style={{ opacity, y }}
      >
        {/* Cabeçalho da seção */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative h-8 flex items-center justify-center mb-4"
          >
            <span className="bg-blue/10 text-blue px-5 py-1.5 rounded-full text-sm font-medium">
              Serviços automotivos
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-6 font-syne text-text-base relative inline-block"
          >
            Especialidades da sua oficina
            <div className="absolute -bottom-3 left-0 w-full h-1 bg-gradient-to-r from-blue/0 via-blue to-blue/0"></div>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-700 max-w-2xl mx-auto text-lg font-sans"
          >
            Mostre aos clientes exatamente o que você faz de melhor.
            Nossa plataforma conecta motoristas às oficinas com as especialidades que eles precisam.
          </motion.p>
        </div>
        
        {/* Visualizador simplificado de serviços */}
        <div className="relative mb-16 max-w-6xl mx-auto">
          {/* Controles de navegação */}
          <div className="absolute top-1/2 -left-5 md:-left-12 z-20 -translate-y-1/2">
            <motion.button
              onClick={prevService}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white hover:bg-gray-100 text-text-base p-3 rounded-full shadow-lg"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </motion.button>
          </div>
          
          <div className="absolute top-1/2 -right-5 md:-right-12 z-20 -translate-y-1/2">
            <motion.button
              onClick={nextService}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white hover:bg-gray-100 text-text-base p-3 rounded-full shadow-lg"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </motion.button>
          </div>
          
          {/* Carrossel simplificado */}
          <div className="relative overflow-hidden rounded-2xl shadow-lg mx-8 md:mx-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30
                }}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100"
              >
                <div className={`h-28 bg-gradient-to-r ${
                  service.color === 'blue' ? 'from-blue to-blue-dark' : 'from-yellow to-yellow-dark'
                } relative`}>
                  {/* Ícone */}
                  <div className="absolute -bottom-8 left-6 w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg">
                    <div className={`w-14 h-14 rounded-full p-3 ${
                      service.color === 'blue' ? 'text-blue bg-blue/10' : 'text-yellow-800 bg-yellow/10'
                    } flex items-center justify-center`}>
                      {service.icon}
                    </div>
                  </div>
                  
                  {/* Tag de popular */}
                  {service.popular && (
                    <div className="absolute right-4 top-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      Popular
                    </div>
                  )}
                  
                  <div className="absolute bottom-4 right-6 text-white/80 text-sm font-medium">
                    {service.category}
                  </div>
                </div>
                
                {/* Conteúdo do card */}
                <div className="p-6 md:p-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-2xl font-bold font-syne text-text-base mb-3">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 mb-6 font-sans">
                        {service.description}
                      </p>
                      
                      {/* Lista de benefícios com animação */}
                      <div className="space-y-3">
                        {service.benefits.map((benefit, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 * i }}
                            className="flex items-start"
                          >
                            <div className={`mr-3 mt-0.5 p-1 rounded-full ${
                              service.color === 'blue' ? 'bg-blue/10' : 'bg-yellow/10'
                            }`}>
                              <BoltIcon className={`w-3 h-3 ${
                                service.color === 'blue' ? 'text-blue' : 'text-yellow-800'
                              }`} />
                            </div>
                            <span className="text-sm font-sans text-gray-700">{benefit}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                        <h4 className="font-medium text-text-base mb-3 font-sans">Como o Instauto transforma este serviço</h4>
                        
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-50 flex items-center justify-center mr-3">
                              <PlusIcon className="w-4 h-4 text-green-500" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 font-sans">Automatização de agendamentos online para maior eficiência</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-50 flex items-center justify-center mr-3">
                              <PlusIcon className="w-4 h-4 text-green-500" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 font-sans">Histórico completo de serviços do veículo</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-50 flex items-center justify-center mr-3">
                              <PlusIcon className="w-4 h-4 text-green-500" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 font-sans">Orçamentos digitais e aprovação remota</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Indicadores de páginas */}
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              {services.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => selectService(index)}
                  className={`w-12 h-2 rounded-full transition-all duration-300 ${
                    index === activeService 
                      ? services[index].color === 'blue' ? 'bg-blue' : 'bg-yellow' 
                      : 'bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <motion.a 
            href="/cadastro" 
            className="inline-flex items-center justify-center bg-blue hover:bg-blue-dark text-white font-medium py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group"
            whileHover={{ 
              scale: 1.03,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="font-sans text-lg">Transforme sua oficina com o Instauto</span>
            <ArrowLongRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ServicesSection; 