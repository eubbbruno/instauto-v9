"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const VideoSection = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [particles, setParticles] = useState<React.ReactNode[]>([]);
  
  // Efeito para detectar quando a seção está visível
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  // Gera partículas apenas do lado cliente para evitar erros de hidratação
  useEffect(() => {
    // Gerar partículas
    const newParticles = Array.from({ length: 20 }).map((_, i) => {
      const width = Math.random() * 3 + 1;
      const height = Math.random() * 3 + 1;
      const xPos = Math.random() * 100;
      const yPos = Math.random() * 100;
      const opacity = Math.random() * 0.3 + 0.1;
      const scale = Math.random() * 0.4 + 0.2;
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 5;
      
      // Usar azul claro ou amarelo claro para as partículas
      const particleClass = Math.random() > 0.5 ? "bg-blue-300/60" : "bg-yellow-200/60";
      
      return (
        <motion.div
          key={i}
          className={`absolute rounded-full ${particleClass}`}
          initial={{ 
            x: `${xPos}%`, 
            y: `${yPos}%`, 
            opacity: opacity,
            scale: scale,
          }}
          animate={isInView ? {
            y: [null, "-30%"],
            opacity: [null, 0],
          } : {}}
          transition={{ 
            duration: duration,
            repeat: Infinity,
            delay: delay,
            ease: "linear"
          }}
          style={{ 
            width: `${width}px`, 
            height: `${height}px` 
          }}
        />
      );
    });
    
    setParticles(newParticles);
  }, [isInView]);
  
  // Atualiza a posição do mouse para o efeito de destaque
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    
    const rect = sectionRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };
  
  // Pontos de destaque sobre o vídeo
  const videoHighlights = [
    { x: "15%", y: "30%", label: "Dashboard intuitivo", delay: 0.2 },
    { x: "70%", y: "25%", label: "Relatórios em tempo real", delay: 0.4 },
    { x: "30%", y: "75%", label: "Gestão completa", delay: 0.6 },
    { x: "85%", y: "65%", label: "Área do cliente", delay: 0.8 },
  ];
  
  return (
    <section 
      ref={sectionRef} 
      className="py-24 relative overflow-hidden bg-white"
      onMouseMove={handleMouseMove}
      data-contrast="light"
    >
      {/* Fundo dinâmico com gradientes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-repeat opacity-5"></div>
        
        {/* Círculos de destaque */}
        <motion.div
          className="absolute rounded-full bg-yellow-100/30 blur-[100px]"
          animate={isInView ? {
            x: ["-5%", "10%", "-5%"],
            y: ["10%", "15%", "10%"],
            scale: [0.8, 1.1, 0.8],
          } : {}}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: "40%", height: "40%", top: "10%", left: "60%" }}
        />
        
        <motion.div
          className="absolute rounded-full bg-blue-100/30 blur-[120px]"
          animate={isInView ? {
            x: ["5%", "-10%", "5%"],
            y: ["-5%", "5%", "-5%"],
            scale: [1, 0.9, 1],
          } : {}}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: "45%", height: "45%", bottom: "5%", left: "15%" }}
        />
        
        {/* Partículas renderizadas pelo useEffect */}
        {particles}
      </div>
      
      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Cabeçalho com animação */}
          <motion.div 
            className="text-center mb-14"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-1.5 rounded-full text-sm font-medium mb-5 shadow-sm"
            >
              Conheça a plataforma
            </motion.div>
            
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 font-syne"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Veja o <span className="text-blue-600">Instauto</span> em ação
            </motion.h2>
            
            <motion.p 
              className="text-gray-600 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Descubra como nossa plataforma completa pode transformar a gestão da sua oficina
              e trazer mais resultados para o seu negócio
            </motion.p>
          </motion.div>
          
          {/* Área do vídeo com design 3D */}
          <motion.div 
            className="relative rounded-2xl overflow-hidden shadow-lg aspect-video bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-100/5"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover="hover"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Efeito de brilho ao passar o mouse */}
            {isHovered && (
              <motion.div 
                className="absolute inset-0 bg-gradient-radial pointer-events-none"
                style={{
                  background: `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, rgba(37, 99, 235, 0.2), transparent)`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
            
            {/* Thumbnail com overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center brightness-[0.8] transition-all duration-500"
              style={{ 
                backgroundImage: 'url(/images/dashboard-preview.jpg)',
                filter: isHovered ? 'brightness(0.9)' : 'brightness(0.8)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
            </div>
            
            {/* Pontos de destaque interativos */}
            <AnimatePresence>
              {!isVideoPlaying && videoHighlights.map((point, index) => (
                <motion.div
                  key={index}
                  className="absolute z-10"
                  style={{ left: point.x, top: point.y }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.5, delay: point.delay }}
                >
                  <motion.div 
                    className="relative"
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.2, 1] }} 
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-3 h-3 rounded-full bg-yellow-400 animate-ping absolute"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 relative"></div>
                    <div className="absolute left-5 top-0 bg-gray-900/80 backdrop-blur-sm text-white text-xs py-1 px-3 rounded-full whitespace-nowrap shadow-sm">
                      {point.label}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Botão de play com animação */}
            <button 
              className="absolute inset-0 flex items-center justify-center group"
              onClick={() => setIsVideoPlaying(true)}
              aria-label="Reproduzir vídeo"
            >
              <motion.div 
                className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center shadow-lg relative text-white z-10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div 
                  className="w-20 h-20 rounded-full bg-blue-600 absolute"
                  animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.div 
                  className="w-20 h-20 rounded-full bg-blue-700 absolute"
                  animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 ml-1">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                </svg>
              </motion.div>
            </button>
            
            {/* Informações do vídeo */}
            <div className="absolute bottom-6 left-6 z-10">
              <h3 className="text-white text-xl font-bold font-syne drop-shadow-md mb-2">
                Instauto: Sistema completo para Oficinas
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-gray-900/60 backdrop-blur-sm rounded-full px-3 py-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-yellow-400 mr-1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-white text-xs">Vídeo oficial</span>
                </div>
                <div className="flex items-center bg-gray-900/60 backdrop-blur-sm rounded-full px-3 py-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-yellow-400 mr-1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-white text-xs">Demonstração completa</span>
                </div>
              </div>
            </div>
            
            {/* Modal de vídeo */}
            <AnimatePresence>
              {isVideoPlaying && (
                <motion.div 
                  className="absolute inset-0 bg-gray-900/95 flex items-center justify-center z-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.button 
                    className="absolute top-4 right-4 text-white hover:text-yellow-400 z-10 bg-gray-800/70 backdrop-blur-sm p-2 rounded-full"
                    onClick={() => setIsVideoPlaying(false)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                  <div className="w-full h-full max-w-5xl mx-auto p-2 sm:p-4">
                    <div className="relative pb-[56.25%] h-0 w-full overflow-hidden rounded-xl shadow-2xl border border-white/5">
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src="https://www.youtube.com/embed/9GCOl9dXm6I?autoplay=1&rel=0"
                        title="Instauto - Sistema Completo para Oficinas"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          {/* Recursos em design 3D */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z" clipRule="evenodd" />
                  </svg>
                ),
                title: "Dashboard intuitivo",
                description: "Visualize todos os indicadores da sua oficina em tempo real, com gráficos interativos",
                delay: 0.5
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
                  </svg>
                ),
                title: "Relatórios detalhados",
                description: "Entenda sua lucratividade, produtividade e vendas com relatórios completos",
                delay: 0.6
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                  </svg>
                ),
                title: "Gestão de clientes",
                description: "Mantenha os dados de seus clientes organizados, com histórico completo de serviços",
                delay: 0.7
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: feature.delay }}
              >
                <div className="h-full bg-white shadow-sm rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white mb-4 shadow-sm">
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-800 mb-2 font-syne">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* CTA para demonstração */}
          <motion.div
            className="mt-14 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <a 
                href="/demonstracao" 
                className="btn-secondary inline-flex items-center group"
              >
                <span className="font-sans">Agendar uma demonstração</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection; 