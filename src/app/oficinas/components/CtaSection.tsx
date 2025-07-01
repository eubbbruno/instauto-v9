"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion, useAnimation, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CheckCircle, ChevronRight, TrendingUp, Star, Clock, ShieldCheck } from "lucide-react";

// Array de posições fixas para evitar erro de hidratação
const particlePositions = [
  { x: 10, y: 20 }, { x: 25, y: 50 }, { x: 40, y: 80 }, { x: 65, y: 20 },
  { x: 80, y: 40 }, { x: 15, y: 70 }, { x: 90, y: 30 }, { x: 50, y: 90 },
  { x: 20, y: 30 }, { x: 70, y: 60 }, { x: 30, y: 10 }, { x: 85, y: 75 },
  { x: 45, y: 25 }, { x: 60, y: 55 }, { x: 75, y: 85 }, { x: 35, y: 45 },
  { x: 55, y: 15 }, { x: 95, y: 65 }, { x: 5, y: 35 }, { x: 40, y: 95 }
];

const CtaSection = () => {
  const ctaButtonRef = useRef<HTMLAnchorElement>(null);
  const ctaSectionRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const [particles, setParticles] = useState<Array<{
    x: number;
    y: number;
    animX: number;
    animY: number;
    duration: number;
    delay: number;
    initialDelay: number;
  }>>([]);
  
  // Efeito de scroll para animações
  const { scrollYProgress } = useScroll({
    target: ctaSectionRef,
    offset: ["start end", "end start"]
  });
  
  // Valores transformados baseados no scroll
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.98]);
  
  // Efeito para inicializar as partículas do lado do cliente
  useEffect(() => {
    const newParticles = particlePositions.map(pos => ({
      x: pos.x,
      y: pos.y,
      animX: (Math.random() - 0.5) * 40,
      animY: Math.random() * -30 - 10,
      duration: Math.random() * 5 + 6,
      delay: Math.random() * 5,
      initialDelay: Math.random() * 2
    }));
    
    setParticles(newParticles);
  }, []);
  
  // Efeito de brilho para o botão CTA
  useEffect(() => {
    // Inicia a sequência de animações quando o componente for montado
    controls.start("visible");
  }, [controls]);
  
  // Configurações de animação
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };
  
  const benefits = [
    {
      icon: <Clock className="w-5 h-5 text-blue-900" />,
      text: "14 dias grátis"
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-blue-900" />,
      text: "Sem cartão de crédito"
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-blue-900" />,
      text: "Cancele quando quiser"
    }
  ];
  
  return (
    <section 
      id="cta"
      className="py-24 relative overflow-hidden"
      data-contrast="dark"
    >
      {/* Retângulo de fundo com efeito de gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0047CC] to-[#031023] -z-10"></div>
      
      {/* Efeito de grade */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] -z-10"></div>
      
      {/* Círculos decorativos */}
      <motion.div 
        className="absolute -top-20 -right-20 w-96 h-96 bg-[#FFDE59]/10 rounded-full blur-[100px] -z-10"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          repeatType: "reverse", 
          ease: "easeInOut" 
        }}
      />
      <motion.div 
        className="absolute -bottom-32 -left-20 w-96 h-96 bg-[#0047CC]/10 rounded-full blur-[120px] -z-10"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          repeatType: "reverse", 
          ease: "easeInOut",
          delay: 1 
        }}
      />
      
      {/* Partículas decorativas */}
      <div className="absolute inset-0 overflow-hidden -z-5">
        {particles.map((particle, index) => (
          <motion.div
            key={index}
            className="absolute w-1 h-1 rounded-full bg-white/20"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: 0
            }}
            animate={{
              y: [0, particle.animY],
              x: [0, particle.animX],
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      {/* Conteúdo principal */}
      <div className="container-custom relative z-10">
        <motion.div 
          ref={ctaSectionRef}
          style={{ opacity, scale }}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="max-w-5xl mx-auto"
        >
          <div className="relative bg-gradient-to-br from-[#0047CC]/90 to-[#031023]/90 p-8 sm:p-12 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/10 overflow-hidden">
            {/* Linha decorativa superior */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFDE59]/0 via-[#FFDE59] to-[#FFDE59]/0"></div>
            
            {/* Linhas diagonais decorativas */}
            <div className="absolute top-0 right-0 w-64 h-64 opacity-20">
              <motion.div 
                className="absolute top-0 right-0 w-full h-0.5 bg-white origin-right"
                animate={{ rotate: 45, width: [0, 200] }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
              <motion.div 
                className="absolute top-0 right-0 w-0.5 h-full bg-white origin-top"
                animate={{ rotate: 45, height: [0, 200] }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            </div>
            
            <div className="absolute bottom-0 left-0 w-64 h-64 opacity-20">
              <motion.div 
                className="absolute bottom-0 left-0 w-full h-0.5 bg-white origin-left"
                animate={{ rotate: 45, width: [0, 200] }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
              <motion.div 
                className="absolute bottom-0 left-0 w-0.5 h-full bg-white origin-bottom"
                animate={{ rotate: 45, height: [0, 200] }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            </div>
            
            {/* Tag/Badge */}
            <div className="flex justify-center mb-6">
              <motion.div 
                variants={itemVariants}
                className="relative"
              >
                <div className="inline-flex items-center bg-gradient-to-r from-[#FFDE59] to-[#FFDE59]/90 px-5 py-2 rounded-full text-[#031023] text-sm font-medium shadow-lg">
                  <Star className="w-4 h-4 mr-2 fill-[#031023]" />
                  <span>Vamos transformar sua oficina juntos</span>
                </div>
                <div className="absolute -inset-1.5 bg-[#FFDE59]/20 rounded-full blur-md -z-10"></div>
              </motion.div>
            </div>
            
            {/* Título */}
            <motion.h2 
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white font-syne leading-tight text-center"
            >
              Dê o próximo passo e{" "}
              <span className="relative inline-block">
                <span className="text-[#FFDE59]">conquiste mais clientes</span>
                <motion.svg 
                  className="absolute -bottom-1 left-0 w-full" 
                  viewBox="0 0 300 8" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg" 
                  preserveAspectRatio="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 1.2 }}
                >
                  <path d="M1 5.5C71.5 2.16666 232 -1.9 299 5.5" stroke="#FFDE59" strokeWidth="2" strokeLinecap="round"/>
                </motion.svg>
              </span>{" "}
              para sua oficina
            </motion.h2>
            
            {/* Descrição */}
            <motion.p 
              variants={itemVariants}
              className="text-base sm:text-lg text-white/90 mb-10 max-w-3xl mx-auto text-center leading-relaxed"
            >
              Cadastre-se hoje e comece a receber orçamentos de motoristas da sua região enquanto gerencia todo o seu negócio com nosso sistema profissional
            </motion.p>
            
            {/* Benefícios */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mb-10 max-w-3xl mx-auto"
            >
              {benefits.map((benefit, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="flex items-center gap-3 text-white justify-center bg-[#0047CC]/40 p-4 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <motion.div 
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FFDE59] to-[#FFDE59]/90 flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {benefit.icon}
                  </motion.div>
                  <span className="font-medium">{benefit.text}</span>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Estatísticas */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center mb-10"
            >
              <div className="bg-[#0047CC]/30 backdrop-blur-sm rounded-lg px-6 py-4 inline-flex items-center space-x-4 border border-white/5 hover:border-white/10 transition-all duration-300">
                <div className="flex -space-x-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ scale: 0, x: -10 }}
                      animate={{ scale: 1, x: 0 }}
                      transition={{ 
                        delay: 1.5 + i * 0.15,
                        type: "spring", 
                        stiffness: 200, 
                        damping: 10 
                      }}
                      className={`w-8 h-8 rounded-full border-2 border-[#0047CC] ${
                        i === 0 ? 'bg-[#FFDE59]' :
                        i === 1 ? 'bg-[#0047CC]' :
                        'bg-green-500'
                      }`}
                    />
                  ))}
                </div>
                <div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8, duration: 0.5 }}
                    className="text-[#FFDE59] font-medium"
                  >
                    +650 oficinas cadastradas
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2, duration: 0.5 }}
                    className="text-white/90 text-sm"
                  >
                    aumentaram seu faturamento em 35%
                  </motion.div>
                </div>
              </div>
            </motion.div>
            
            {/* Botão CTA */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link 
                  href="/auth/oficina"
                  ref={ctaButtonRef}
                  className="btn-secondary relative overflow-hidden py-4 px-8 text-lg shadow-xl flex items-center justify-center group"
                >
                  <span className="relative z-10 font-sans flex items-center">
                    Cadastrar minha oficina 
                    <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                  
                  {/* Efeito de brilho */}
                  <motion.div 
                    className="absolute inset-0 -translate-x-full"
                    animate={{
                      x: ["0%", "200%"],
                    }}
                    transition={{
                      duration: 1.5,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatDelay: 5
                    }}
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                    }}
                  />
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="#como-funciona"
                  className="btn-white flex items-center"
                >
                  <span>Veja como funciona</span>
                  <ChevronRight className="ml-1 h-5 w-5" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Selo de segurança */}
            <motion.div 
              variants={itemVariants}
              className="mt-8 text-center"
            >
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 text-white/80 text-sm py-1.5 px-3.5 border border-white/10 rounded-full hover:border-white/20 transition-all duration-300"
              >
                <ShieldCheck size={16} className="text-green-500" />
                <span>Seus dados estão seguros conosco</span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection; 