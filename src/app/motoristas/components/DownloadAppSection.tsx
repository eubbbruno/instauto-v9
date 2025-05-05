"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { Apple, Smartphone, ChevronRight } from "lucide-react";

export default function DownloadAppSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const screenshotRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (sectionRef.current && phoneRef.current && screenshotRef.current) {
      // Animação do dispositivo flutuante
      gsap.to(phoneRef.current, {
        y: -15,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
      
      // Animação paralaxe para screenshot
      gsap.to(screenshotRef.current, {
        y: -25,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }
  }, []);
  
  // Variantes para animações
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const childVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };
  
  const appFeatures = [
    "Interface intuitiva e fácil de usar",
    "Notificações em tempo real",
    "Pagamento integrado e seguro",
    "Histórico completo de serviços",
    "Chat direto com as oficinas",
    "Agendamento simplificado",
  ];

  return (
    <section id="app" ref={sectionRef} className="py-24 bg-gradient-to-br from-blue-700 to-blue-900 text-white overflow-hidden">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={childVariants}>
              <div className="inline-block bg-white/20 backdrop-blur-md text-white px-4 py-1 rounded-full text-sm font-medium mb-6">
                Disponível para iOS e Android
              </div>
            </motion.div>
            
            <motion.h2 
              variants={childVariants}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Instauto na palma da sua mão
            </motion.h2>
            
            <motion.p 
              variants={childVariants}
              className="text-white/90 mb-8 text-lg"
            >
              Baixe nosso aplicativo e tenha acesso a todas as funcionalidades do Instauto onde quer que você esteja. Encontre oficinas, agende serviços e acompanhe tudo em tempo real.
            </motion.p>
            
            <motion.ul 
              variants={containerVariants}
              className="space-y-3 mb-8"
            >
              {appFeatures.map((feature, index) => (
                <motion.li 
                  key={index} 
                  variants={childVariants}
                  className="flex items-center"
                >
                  <ChevronRight className="h-5 w-5 text-yellow mr-2" />
                  <span>{feature}</span>
                </motion.li>
              ))}
            </motion.ul>
            
            <motion.div 
              variants={childVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a 
                href="#" 
                className="flex items-center justify-center gap-2 bg-white text-blue font-medium py-3 px-6 rounded-md hover:bg-blue-50 transition-colors"
              >
                <Apple className="h-6 w-6" />
                <span>
                  <span className="block text-xs">Download na</span>
                  <span className="block font-bold">App Store</span>
                </span>
              </a>
              
              <a 
                href="#" 
                className="flex items-center justify-center gap-2 bg-white text-blue font-medium py-3 px-6 rounded-md hover:bg-blue-50 transition-colors"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.9 5c-.9-.7-1.7-1-2.6-1.1v7.4l2.4 2.4c.2-.3.3-.7.3-1.1v-7c-.4-.2-.2-.4.1-.6zm0 11.5v.5H6v-.5c0-.7.4-1.2 1-1.5 1 .7 2.6 1.1 4.5 1.1 1.8 0 3.4-.4 4.5-1.1.6.3.9.8.9 1.5zm2.2-15.5l-2 2c-1.3-1-2.9-1.6-4.6-1.6-1.7 0-3.2.6-4.6 1.6l-2-2C8.2.8 10.6 0 13.5 0s5.3.8 6.6 2zm-6.3 13c-1 .3-2.1.5-3.3.5-1.2 0-2.3-.2-3.3-.5L5 16.5c1.1.7 2.7 1.1 4.5 1.1 1.8 0 3.4-.4 4.5-1.1l-2.2-2zm-3.3-13c-2.2 0-4.2.9-5.6 2.4l1.9 1.9c1-1 2.3-1.6 3.7-1.6 1.4 0 2.8.7 3.7 1.6l1.9-1.9C15.7 1.9 13.7 1 11.5 1z" />
                </svg>
                <span>
                  <span className="block text-xs">Download no</span>
                  <span className="block font-bold">Google Play</span>
                </span>
              </a>
            </motion.div>
          </motion.div>
          
          <div className="relative hidden md:block h-[600px]">
            {/* Dispositivo mockup */}
            <div 
              ref={phoneRef}
              className="absolute z-10 w-[280px] h-[550px] bg-black rounded-[40px] p-3 left-1/2 -translate-x-1/2 shadow-2xl"
            >
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20"></div>
              
              {/* Tela do dispositivo */}
              <div className="w-full h-full bg-white rounded-[32px] overflow-hidden relative">
                {/* Screenshot do app */}
                <div 
                  ref={screenshotRef}
                  className="absolute inset-0 bg-gradient-to-b from-blue-500 to-blue-700"
                >
                  {/* Aqui você pode adicionar um screenshot real do aplicativo */}
                  <div className="p-4 text-white">
                    <div className="text-xl font-bold mb-2">Instauto</div>
                    <div className="bg-blue-600/50 backdrop-blur-md rounded-xl p-3 mb-3">
                      <div className="text-sm mb-1">Encontre Oficinas</div>
                      <div className="w-full bg-white/20 h-8 rounded-md mb-2"></div>
                      <div className="w-full bg-white/20 h-8 rounded-md"></div>
                    </div>
                    
                    <div className="bg-blue-600/50 backdrop-blur-md rounded-xl p-3">
                      <div className="text-sm mb-1">Oficinas Próximas</div>
                      <div className="w-full bg-white/20 h-16 rounded-md mb-2"></div>
                      <div className="w-full bg-white/20 h-16 rounded-md mb-2"></div>
                      <div className="w-full bg-white/20 h-16 rounded-md"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Elementos decorativos */}
            <div className="absolute bottom-20 -right-10 w-40 h-40 bg-yellow/30 rounded-full blur-3xl"></div>
            <div className="absolute top-20 -left-5 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
      
      {/* Separador de ondas */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="w-full">
          <path 
            fill="#ffffff" 
            fillOpacity="1" 
            d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"
          ></path>
        </svg>
      </div>
    </section>
  );
} 