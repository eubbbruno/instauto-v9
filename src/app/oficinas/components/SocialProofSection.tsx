"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { StarIcon, CheckBadgeIcon, ArrowLongRightIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

// Depoimentos de clientes reais
const testimonials = [
  {
    id: 1,
    name: "André Souza",
    role: "Proprietário - Oficina Mecânica SouzaCar",
    city: "São Paulo - SP",
    image: "/images/testimonial-1.jpg", // Adicione imagens reais ou use placeholders
    content: "O Instauto transformou completamente minha oficina. Onde antes perdíamos horas com agendamentos por telefone, agora tudo é automatizado. Nossa agenda está sempre cheia e o faturamento aumentou 42% em apenas 4 meses.",
    rating: 5,
    highlight: "Aumento de 42% no faturamento"
  },
  {
    id: 2,
    name: "Carla Mendes",
    role: "Gerente - Auto Center Mendes",
    city: "Belo Horizonte - MG",
    image: "/images/testimonial-2.jpg",
    content: "Antes do Instauto, era impossível acompanhar o histórico dos clientes de forma organizada. Agora temos tudo digitalizado, o que nos permite oferecer um serviço muito mais personalizado. Os clientes adoram quando lembramos exatamente o que foi feito na última visita.",
    rating: 5,
    highlight: "Gestão completa do histórico de clientes"
  },
  {
    id: 3,
    name: "Roberto Almeida",
    role: "Proprietário - Almeida Motors",
    city: "Rio de Janeiro - RJ",
    image: "/images/testimonial-3.jpg",
    content: "Com o Instauto, conseguimos reduzir o tempo de atendimento inicial em 65%. Os clientes chegam com o serviço já pré-agendado, o que facilita o fluxo de trabalho. Além disso, as notificações automáticas reduziram drasticamente as faltas.",
    rating: 5,
    highlight: "Redução de 65% no tempo de atendimento"
  },
  {
    id: 4,
    name: "Juliana Costa",
    role: "Gerente Administrativo - JC Auto Center",
    city: "Salvador - BA",
    image: "/images/testimonial-4.jpg",
    content: "A gestão financeira do Instauto é excepcional. Consigo ver exatamente quanto estamos faturando por tipo de serviço, o que nos ajudou a identificar e focar nos serviços mais rentáveis. Nosso lucro líquido aumentou 28% desde que implementamos.",
    rating: 5,
    highlight: "Aumento de 28% no lucro líquido"
  }
];

// Função para gerar pontos do mapa
const generateMapPoints = () => {
  return Array(30).fill(null).map((_, index) => {
    // Gerar ponto aleatório
    let x, y;
    
    // Estas coordenadas são aproximadas para o formato do Brasil
    // Região Norte e Centro-Oeste
    if (index < 10) {
      x = 40 + Math.random() * 20; // 40% a 60% (ajustado para direita)
      y = 25 + Math.random() * 25; // 25% a 50% (ajustado para baixo)
    }
    // Região Nordeste
    else if (index < 18) {
      x = 60 + Math.random() * 15; // 60% a 75% (ajustado para direita)
      y = 30 + Math.random() * 20; // 30% a 50% (ajustado para baixo)
    }
    // Região Sudeste
    else if (index < 25) {
      x = 50 + Math.random() * 15; // 50% a 65% (ajustado para direita)
      y = 50 + Math.random() * 15; // 50% a 65% (ajustado para baixo)
    }
    // Região Sul
    else {
      x = 45 + Math.random() * 15; // 45% a 60% (ajustado para direita)
      y = 65 + Math.random() * 15; // 65% a 80% (ajustado para baixo)
    }
    
    return {
      id: index,
      x,
      y,
      size: Math.random() * 0.8 + 0.5,
      delay: Math.random() * 4,
      duration: Math.random() * 3 + 1,
      color: Math.random() > 0.5 ? "rgba(59, 130, 246, 0.8)" : "rgba(234, 179, 8, 0.8)"
    };
  });
};

const SocialProofSection = () => {
  // Remover estados não utilizados
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Array<{
    size: number;
    x: number;
    y: number;
    opacity: number;
    delay: number;
  }>>([]);
  
  // Estado para armazenar os pontos do mapa
  const [mapPoints, setMapPoints] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    delay: number;
    duration: number;
    color: string;
  }>>([]);
  
  // Gerar pontos do mapa apenas no lado do cliente
  useEffect(() => {
    setMapPoints(generateMapPoints());
  }, []);
  
  // Criar partículas para efeito visual
  useEffect(() => {
    const newParticles = Array(50).fill(null).map(() => ({
      size: Math.random() * 4 + 2,
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: Math.random() * 0.5 + 0.3,
      delay: Math.random() * 5
    }));
    
    setParticles(newParticles);
  }, []);
  
  // Valor fixo para evitar problema de hidratação
  const totalFormatted = "3.000";
  
  // Autoplay para testemunhos
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAutoplay) {
      interval = setInterval(() => {
        setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 6000);
    }
    
    return () => clearInterval(interval);
  }, [isAutoplay]);
  
  // Navegar entre testemunhos
  const nextTestimonial = () => {
    setIsAutoplay(false);
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setIsAutoplay(false);
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  
  // Animação para as estatísticas
  const counterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  return (
    <section className="py-24 relative overflow-hidden" data-contrast="dark">
      {/* Fundo gradiente personalizado */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-dark via-blue to-blue-dark">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Partículas de fundo */}
        {particles.map((particle, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full bg-white"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity
            }}
            animate={{ 
              y: [0, -20, 0],
              opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 10 + particle.delay,
              ease: "easeInOut",
              delay: particle.delay
            }}
          />
        ))}
        
        {/* Efeitos de luz */}
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-blue-light/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-blue/20 rounded-full blur-[100px]"></div>
      </div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative h-8 flex items-center justify-center mb-4"
          >
            <span className="bg-yellow/20 text-yellow px-5 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
              Comunidade em crescimento
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-6 font-syne text-white"
          >
            Oficinas por todo o <span className="text-yellow">Brasil</span> confiam no Instauto
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center items-center space-x-2 mb-16"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <div 
                  key={num} 
                  className="w-10 h-10 rounded-full border-2 border-blue bg-gradient-to-br from-blue-light to-blue flex items-center justify-center text-xs font-bold text-white"
                >
                  {num}
                </div>
              ))}
            </div>
            <span className="text-xl text-white">+{totalFormatted} oficinas em todo o país</span>
          </motion.div>
          
          {/* Mapa interativo do Brasil estilizado */}
          <motion.div 
            ref={mapRef}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[400px] w-full max-w-2xl mx-auto mb-20 bg-blue/50 rounded-lg backdrop-blur-md border border-blue/50 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('/images/brazil-map.png')] bg-no-repeat bg-center bg-contain opacity-30"></div>
            
            {/* Pontos piscando no mapa - renderizados apenas do lado do cliente */}
            {mapPoints.map((point) => (
              <motion.div
                key={point.id}
                className="absolute"
                style={{ 
                  left: `${point.x}%`, 
                  top: `${point.y}%`,
                  zIndex: 5
                }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: point.duration,
                    delay: point.delay,
                    ease: "easeInOut"
                  }}
                  className="relative"
                >
                  <div 
                    className="absolute rounded-full"
                    style={{ 
                      backgroundColor: point.color,
                      width: `${12 * point.size}px`,
                      height: `${12 * point.size}px`,
                      filter: `blur(${5 * point.size}px)`,
                      opacity: 0.8,
                      transform: 'translate(-50%, -50%)'
                    }}
                  ></div>
                  <div 
                    className="rounded-full bg-white"
                    style={{ 
                      width: `${5 * point.size}px`,
                      height: `${5 * point.size}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  ></div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Estatísticas em design inovador */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            <motion.div
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={counterVariants}
              className="p-8 rounded-2xl bg-gradient-to-br from-blue/30 to-blue-dark/30 backdrop-blur-sm border border-blue/20 overflow-hidden relative"
            >
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-yellow/40 to-yellow-dark/20 rounded-full blur-xl"></div>
              <h3 className="text-5xl font-bold font-syne text-white mb-2">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  +35%
                </motion.span>
              </h3>
              <p className="text-white/90 mb-4">Aumento médio no faturamento após 3 meses</p>
              <div className="h-2 bg-blue-dark/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "75%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.7 }}
                  className="h-full bg-gradient-to-r from-yellow to-yellow-dark"
                ></motion.div>
              </div>
            </motion.div>
            
            <motion.div
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={counterVariants}
              className="p-8 rounded-2xl bg-gradient-to-br from-blue/30 to-blue-dark/30 backdrop-blur-sm border border-blue/20 overflow-hidden relative"
            >
              <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-gradient-to-tr from-blue-light/40 to-blue/20 rounded-full blur-xl"></div>
              <h3 className="text-5xl font-bold font-syne text-white mb-2">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.6 }}
                >
                  -40%
                </motion.span>
              </h3>
              <p className="text-white/90 mb-4">Redução no tempo gasto com administração</p>
              <div className="h-2 bg-blue-dark/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "85%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.8 }}
                  className="h-full bg-gradient-to-r from-blue-light to-blue"
                ></motion.div>
              </div>
            </motion.div>
            
            <motion.div
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={counterVariants}
              className="p-8 rounded-2xl bg-gradient-to-br from-blue/30 to-blue-dark/30 backdrop-blur-sm border border-blue/20 overflow-hidden relative"
            >
              <div className="absolute -left-4 -top-4 w-20 h-20 bg-gradient-to-br from-yellow/40 to-yellow-dark/20 rounded-full blur-xl"></div>
              <h3 className="text-5xl font-bold font-syne text-white mb-2 flex items-center">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.7 }}
                >
                  4.8
                </motion.span>
                <span className="text-lg text-white/80 ml-1">/5</span>
              </h3>
              <p className="text-white/90 mb-4">Índice de satisfação dos nossos clientes</p>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.div
                    key={star}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ 
                      opacity: star === 5 ? 0.7 : 1, 
                      scale: 1 
                    }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.4, 
                      delay: 0.9 + (star * 0.1) 
                    }}
                  >
                    <StarIcon 
                      className={`w-5 h-5 ${
                        star <= 4 ? 'text-yellow' : 'text-yellow/50'
                      }`} 
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Carrossel de depoimentos */}
          <div className="relative max-w-5xl mx-auto mb-16">
            <h3 className="text-2xl md:text-3xl font-bold font-syne text-white mb-8 text-center">
              O que nossos clientes dizem
            </h3>
            
            {/* Controles de navegação */}
            <div className="absolute top-1/2 -left-4 md:-left-8 z-10 -translate-y-1/2">
              <motion.button
                onClick={prevTestimonial}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </motion.button>
            </div>
            
            <div className="absolute top-1/2 -right-4 md:-right-8 z-10 -translate-y-1/2">
              <motion.button
                onClick={nextTestimonial}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </motion.button>
            </div>
            
            {/* Depoimentos */}
            <div className="relative overflow-hidden rounded-2xl h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden"
                >
                  <div className="p-8 md:p-10">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-white/20 relative bg-gradient-to-br from-blue-light to-blue">
                          {/* Placeholder para a imagem real */}
                          <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
                            {testimonials[activeTestimonial].name.charAt(0)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex mb-3">
                          {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                            <StarIcon key={i} className="w-5 h-5 text-yellow" />
                          ))}
                        </div>
                        
                        <div className="relative mb-6 pl-6 border-l-2 border-yellow/50">
                          <p className="text-white/90 text-lg italic mb-5">
                            &ldquo;{testimonials[activeTestimonial].content}&rdquo;
                          </p>
                          <div className="text-yellow font-bold flex items-center text-sm mb-1">
                            <CheckBadgeIcon className="w-5 h-5 mr-2" />
                            {testimonials[activeTestimonial].highlight}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-white font-bold text-lg">
                            {testimonials[activeTestimonial].name}
                          </p>
                          <p className="text-white/70 text-sm">
                            {testimonials[activeTestimonial].role}
                          </p>
                          <p className="text-white/60 text-sm">
                            {testimonials[activeTestimonial].city}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Indicadores */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoplay(false);
                    setActiveTestimonial(index);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeTestimonial ? 'bg-yellow scale-110' : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Visualizar depoimento ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          {/* CTA final */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto bg-gradient-to-r from-blue/40 to-blue-dark/40 backdrop-blur-sm p-8 rounded-xl border border-blue/30"
          >
            <h3 className="text-2xl font-bold font-syne text-white mb-3">
              Junte-se a milhares de oficinas de sucesso
            </h3>
            <p className="text-white/80 mb-6">
              Comece agora mesmo e descubra como o Instauto pode transformar sua oficina com automação, organização e mais clientes.
            </p>
            <motion.a 
              href="/cadastro" 
              className="inline-flex items-center justify-center bg-yellow hover:bg-yellow-dark text-text-dark font-medium py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="font-sans text-lg">Cadastrar minha oficina</span>
              <ArrowLongRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection; 