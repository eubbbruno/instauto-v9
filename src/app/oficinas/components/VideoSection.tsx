"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, ExternalLink } from "lucide-react";
import { gsap } from "gsap";

const VideoSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  
  // Efeito de scroll parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.4, 1, 1, 0.4]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);
  
  // Efeito de luz com GSAP
  useEffect(() => {
    if (!videoRef.current) return;
    
    const tl = gsap.timeline({
      repeat: -1,
      yoyo: true,
    });
    
    tl.to(".video-glow", {
      boxShadow: "0 0 30px 5px rgba(0, 71, 204, 0.3)",
      duration: 2,
      ease: "sine.inOut"
    });
    
    return () => {
      tl.kill();
    };
  }, []);
  
  return (
    <section className="py-28 bg-gray-50 relative overflow-hidden" ref={containerRef}>
      {/* Efeitos de fundo */}
      <div className="absolute inset-0 bg-[radial-gradient(#0047CC15_1px,transparent_1px)] bg-[length:20px_20px]"></div>
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue/10 rounded-full blur-[80px]"></div>
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-yellow/10 rounded-full blur-[80px]"></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-12">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block bg-blue text-white px-4 py-1 rounded-full text-sm font-medium mb-4"
          >
            Conheça na prática
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-4 font-syne text-gray-900"
          >
            Veja como o Instauto transforma sua oficina
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Assista ao vídeo e descubra como aumentar seus lucros e reduzir a burocracia com nossa plataforma completa
          </motion.p>
        </div>
        
        <motion.div
          style={{ opacity, scale }}
          ref={videoRef}
          className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl video-glow"
        >
          <div className="aspect-w-16 aspect-h-9 bg-gray-900">
            {/* Player de vídeo - YouTube iframe */}
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-700 relative group">
              {/* Thumbnail overlay com botão de play */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300"></div>
              
              <div className="relative z-10 text-center">
                <motion.div 
                  className="w-20 h-20 bg-yellow text-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 17 
                  }}
                  onClick={() => {
                    // Aqui você poderia implementar a lógica para abrir um modal com o vídeo
                    console.log("Play video");
                  }}
                >
                  <Play className="w-10 h-10 ml-1" />
                </motion.div>
                
                <div className="space-y-2">
                  <p className="text-white text-xl font-bold">Sistema completo ERP + CRM</p>
                  <p className="text-white/80 text-sm">3:45 min</p>
                </div>
              </div>
              
              {/* Link para assistir em tela cheia */}
              <motion.a 
                href="#"
                className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm text-white py-2 px-3 rounded-lg flex items-center gap-2 text-sm hover:bg-white/30 transition-all"
                whileHover={{ y: -2 }}
              >
                <span>Tela cheia</span>
                <ExternalLink className="w-4 h-4" />
              </motion.a>
            </div>
          </div>
        </motion.div>
        
        {/* Features abaixo do vídeo */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="text-lg font-bold mb-2 text-blue">Interface intuitiva</div>
            <p className="text-gray-600">Sistema fácil de usar que não precisa de treinamento extensivo</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="text-lg font-bold mb-2 text-blue">Resultados rápidos</div>
            <p className="text-gray-600">Comece a receber orçamentos já nos primeiros dias de uso</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="text-lg font-bold mb-2 text-blue">Suporte completo</div>
            <p className="text-gray-600">Equipe dedicada para ajudar em todas as etapas da implementação</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection; 