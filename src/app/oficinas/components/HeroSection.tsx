"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { ArrowRight, ChevronRight, Star } from "lucide-react";

const HeroSection = () => {
  const ctaButtonRef = useRef<HTMLAnchorElement>(null);
  const particlesContainerRef = useRef<HTMLDivElement>(null);
  
  // Efeito de partículas flutuantes
  useEffect(() => {
    if (!particlesContainerRef.current) return;
    
    const createParticles = () => {
      const container = particlesContainerRef.current;
      if (!container) return;
      
      // Limpar partículas existentes
      container.innerHTML = '';
      
      // Criar novas partículas
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 8 + 2;
        const opacity = Math.random() * 0.15 + 0.05;
        const isYellow = Math.random() > 0.7;
        
        particle.className = 'absolute rounded-full';
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = isYellow 
          ? `rgba(255, 222, 89, ${opacity + 0.1})` 
          : `rgba(10, 42, 218, ${opacity})`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animation = `floatParticle ${Math.random() * 15 + 15}s infinite ease-in-out`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        container.appendChild(particle);
      }
    };
    
    // Adicionar keyframes para animação
    if (!document.getElementById('hero-particle-keyframes')) {
      const style = document.createElement('style');
      style.id = 'hero-particle-keyframes';
      style.textContent = `
        @keyframes floatParticle {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(30px, -20px) rotate(90deg); }
          50% { transform: translate(10px, 30px) rotate(180deg); }
          75% { transform: translate(-20px, 10px) rotate(270deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 0.8; }
        }
        
        @keyframes shine {
          0% { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }
      `;
      document.head.appendChild(style);
    }
    
    createParticles();
    
    return () => {
      const style = document.getElementById('hero-particle-keyframes');
      if (style) style.remove();
    };
  }, []);
  
  // Efeito de brilho no botão CTA
  useEffect(() => {
    if (!ctaButtonRef.current) return;
    
    const shine = ctaButtonRef.current.querySelector('.btn-shine');
    if (shine) {
      shine.classList.add('animate-shine');
    }
  }, []);

  // Variantes de animação para Framer Motion
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <section className="bg-brand-light py-20 md:py-32 relative overflow-hidden" data-contrast="light">
      {/* Partículas de fundo */}
      <div ref={particlesContainerRef} className="absolute inset-0 pointer-events-none"></div>
      
      {/* Gradientes de fundo */}
      <div className="absolute top-0 right-0 w-1/3 h-2/3 bg-brand-blue/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-yellow/10 rounded-full blur-[150px]"></div>
      <div className="absolute top-1/3 left-1/4 w-1/4 h-1/4 bg-blue-500/10 rounded-full blur-[100px]"></div>
      
      {/* Padrão de grade */}
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-repeat opacity-10"></div>
      
      <div className="container-custom relative z-10">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center"
        >
          {/* Hero Text Content */}
          <motion.div variants={fadeInUp} className="relative">
            {/* Badge animada */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
              className="relative"
            >
              <span className="bg-yellow text-text-base px-5 py-1.5 rounded-full text-sm font-medium inline-block mb-6 shadow-lg shadow-yellow/20">
                <span className="flex items-center">
                  <Star className="w-4 h-4 mr-1.5 fill-text-base" />
                  Sistema premium para sua oficina
                </span>
              </span>
              
              {/* Efeito de brilho atrás do badge */}
              <div className="absolute -inset-1 bg-yellow/20 rounded-full blur-md -z-10 animate-pulse"></div>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-base mb-6 font-syne leading-tight"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-text-base to-text-base/90">
                Transforme sua oficina em um 
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-700 relative inline-block">
                negócio digital
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                  <path d="M1 5.5C47.6667 2.16666 154.6 -1.9 199 5.5" stroke="#0A2ADA" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-text-base text-lg mb-8 font-sans max-w-xl leading-relaxed"
            >
              Cadastre sua oficina no Instauto e comece <span className="text-brand-blue font-medium">hoje mesmo</span> a receber orçamentos de motoristas da sua região, aumentando seu faturamento com um sistema completo de gestão.
            </motion.p>
            
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <Link 
                href="/auth/oficina" 
                ref={ctaButtonRef}
                className="group relative bg-yellow hover:bg-yellow-dark text-text-base font-bold py-3.5 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-yellow/30 overflow-hidden"
                style={{backgroundColor: '#FFDE59'}}
              >
                <span className="relative z-10 flex items-center justify-center w-full font-sans">
                  Cadastrar minha oficina
                  <ArrowRight className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </span>
                {/* Efeito de brilho */}
                <span className="btn-shine absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent bg-[length:200%_100%]"></span>
              </Link>
              
              <Link 
                href="#como-funciona" 
                className="group bg-blue hover:bg-blue-dark text-text-light font-medium py-3.5 px-8 rounded-lg transition-all duration-300 flex items-center justify-center"
                style={{backgroundColor: '#0047CC'}}
              >
                <span className="font-sans">Como funciona</span>
                <ChevronRight className="h-5 w-5 ml-1 transform group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-brand-blue/20 flex items-center justify-center mr-3">
                  <CheckCircleIcon className="h-4 w-4 text-brand-blue" />
                </div>
                <p className="font-sans text-text-base">14 dias grátis</p>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-brand-blue/20 flex items-center justify-center mr-3">
                  <CheckCircleIcon className="h-4 w-4 text-brand-blue" />
                </div>
                <p className="font-sans text-text-base">Sem cartão de crédito</p>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-brand-blue/20 flex items-center justify-center mr-3">
                  <CheckCircleIcon className="h-4 w-4 text-brand-blue" />
                </div>
                <p className="font-sans text-text-base">Cancelamento fácil</p>
              </div>
            </motion.div>
            
            {/* Indicador de estatísticas */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-10 bg-white shadow-md border border-gray-200 rounded-lg p-4 max-w-md"
            >
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-white ${
                      i === 1 ? 'bg-yellow' :
                      i === 2 ? 'bg-brand-blue' :
                      i === 3 ? 'bg-green-500' :
                      'bg-red-500'
                    }`}></div>
                  ))}
                </div>
                <div>
                  <div className="text-brand-blue font-medium">+650 oficinas cadastradas</div>
                  <div className="text-text-base text-sm">aumentaram seu faturamento em 35%</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Dashboard Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
            className="hidden md:block relative h-[500px]"
          >
            {/* Efeito de brilho atrás do dashboard */}
            <div className="absolute inset-0 bg-brand-blue/20 rounded-xl blur-xl transform -rotate-3 scale-95 -z-10"></div>
            
            <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-2xl overflow-hidden transform rotate-1 border border-white/80">
              {/* Barra superior do navegador */}
              <div className="bg-gray-100 border-b border-gray-200 p-2 flex items-center">
                <div className="flex items-center space-x-2 ml-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="mx-auto bg-white rounded-md text-xs text-gray-500 px-4 py-1 flex items-center">
                  <span className="mr-1">🔒</span>
                  app.instauto.com.br/dashboard
                </div>
              </div>
              
              <div className="w-full h-full bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center p-6">
                {/* Header do Dashboard */}
                <div className="w-full bg-white rounded-lg shadow-md p-4 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div className="text-sm text-gray-500">Bem-vindo de volta,</div>
                      <div className="font-bold text-blue-900">Oficina AutoMaster</div>
                    </div>
                    <div className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></div>
                      Plano Premium
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-500">Orçamentos</div>
                      <div className="text-blue-600 font-bold text-xl">18</div>
                      <div className="text-xs text-green-600">↑ 24%</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-500">Finalizados</div>
                      <div className="text-green-600 font-bold text-xl">12</div>
                      <div className="text-xs text-green-600">↑ 18%</div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-500">Em Progresso</div>
                      <div className="text-yellow-600 font-bold text-xl">6</div>
                      <div className="text-xs text-blue-600">→ 2</div>
                    </div>
                  </div>
                </div>
                
                {/* Gráfico de Faturamento */}
                <div className="w-full bg-white rounded-lg shadow-md p-4 mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="font-medium text-gray-800">Faturamento Mensal</div>
                    <div className="text-sm text-green-600 font-medium flex items-center">
                      <span className="mr-1">↑</span>35% este mês
                    </div>
                  </div>
                  
                  <div className="h-24 flex items-end space-x-2 mb-1">
                    {[40, 65, 45, 60, 80, 75, 90].map((height, i) => (
                      <div 
                        key={i} 
                        className="flex-1 rounded-t-sm bg-gradient-to-t from-blue-500 to-blue-400"
                        style={{ height: `${height}%` }}
                      ></div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <div>Jan</div>
                    <div>Fev</div>
                    <div>Mar</div>
                    <div>Abr</div>
                    <div>Mai</div>
                    <div>Jun</div>
                    <div>Jul</div>
                  </div>
                </div>
                
                {/* Novos Orçamentos */}
                <div className="w-full bg-white rounded-lg shadow-md p-4 mb-4">
                  <div className="flex justify-between mb-3">
                    <div className="font-medium text-gray-800">Novos Orçamentos</div>
                    <div className="text-sm text-blue-600 cursor-pointer">Ver todos →</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <div>
                        <div className="font-medium">João Silva</div>
                        <div className="text-xs text-gray-500">Troca de óleo - Gol 2020</div>
                      </div>
                      <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Novo</div>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">Maria Souza</div>
                        <div className="text-xs text-gray-500">Freios - Honda Fit 2019</div>
                      </div>
                      <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Responder</div>
                    </div>
                  </div>
                </div>
                
                {/* Estatísticas */}
                <div className="flex w-full justify-between">
                  <div className="bg-white rounded-lg shadow-md p-3 w-[48%]">
                    <div className="text-xs font-medium mb-1">Faturamento</div>
                    <div className="text-green-600 font-bold">R$ 18.750</div>
                    <div className="text-xs text-green-500">↑ 35% este mês</div>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-3 w-[48%]">
                    <div className="text-xs font-medium mb-1">Satisfação</div>
                    <div className="text-blue-600 font-bold">4.9/5.0</div>
                    <div className="text-xs text-yellow-500">★★★★★</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Notificações flutuantes */}
            <motion.div 
              initial={{ opacity: 0, x: 30, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 1.5, duration: 0.6 }}
              className="absolute -right-10 top-20 bg-white rounded-lg shadow-xl p-3 w-56 border border-gray-100 z-20"
            >
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-sm">Novo orçamento</div>
                  <div className="text-xs text-gray-500">Agora mesmo</div>
                </div>
              </div>
              <div className="text-xs text-gray-600">
                Carlos Pereira solicitou orçamento para troca de bateria
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 2, duration: 0.6 }}
              className="absolute -right-5 bottom-20 bg-white rounded-lg shadow-xl p-3 w-48 border border-gray-100 z-20"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="font-medium text-sm">Avaliação</div>
                <div className="flex text-yellow-500 text-xs">★★★★★</div>
              </div>
              <div className="text-xs text-gray-600">
                &ldquo;Ótimo atendimento! Serviço rápido e preço justo.&rdquo;
              </div>
              <div className="text-xs text-gray-500 mt-1">
                - Ana Luiza, há 2h
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection; 