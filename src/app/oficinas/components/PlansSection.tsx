"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircleIcon as CheckCircleSolidIcon, XCircleIcon, SparklesIcon } from "@heroicons/react/24/solid";
import { useState, useEffect, useRef } from "react";

// Tipos para os planos
type PlanFeature = {
  name: string;
  freeIncluded: boolean;
  proIncluded: boolean;
};

const PlansSection = () => {
  const [isProHovered, setIsProHovered] = useState(false);
  const proCardRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  
  // Efeito para detectar quando a seção está visível
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    
    if (proCardRef.current) {
      observer.observe(proCardRef.current);
    }
    
    return () => {
      if (proCardRef.current) {
        observer.unobserve(proCardRef.current);
      }
    };
  }, []);

  // Recursos dos planos
  const planFeatures: PlanFeature[] = [
    { name: "Receber e responder orçamentos", freeIncluded: true, proIncluded: true },
    { name: "ERP + CRM completo", freeIncluded: false, proIncluded: true },
    { name: "Ordens de Serviço", freeIncluded: false, proIncluded: true },
    { name: "Estoque, financeiro, relatórios", freeIncluded: false, proIncluded: true },
    { name: "Suporte com IA + WhatsApp", freeIncluded: false, proIncluded: true },
    { name: "Acesso via celular", freeIncluded: true, proIncluded: true }
  ];

  return (
    <section id="planos" className="pt-20 pb-24 relative overflow-hidden" data-contrast="light">
      {/* Divisor de ondas animado */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none" style={{ transform: 'translateY(-99%)' }}>
        <motion.svg 
          className="relative block w-full h-[70px] sm:h-[100px]" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
          initial={{ opacity: 0.8 }}
          animate={{ 
            opacity: [0.8, 0.9, 0.8],
            y: [0, 5, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            repeatType: "mirror", 
            ease: "easeInOut" 
          }}
        >
          <motion.path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            fill="#ffffff"
            initial={{ pathLength: 0 }}
            animate={{ 
              pathLength: 1,
              x: [0, -10, 0, 10, 0],
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity,
              repeatType: "loop", 
              ease: "easeInOut" 
            }}
          />
          <motion.path 
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" 
            fill="#fcf7df"
            initial={{ pathLength: 0 }}
            animate={{ 
              pathLength: 1,
              x: [0, 10, 0, -10, 0],
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity, 
              repeatType: "loop", 
              ease: "easeInOut",
              delay: 0.2
            }}
          />
        </motion.svg>
      </div>

      {/* Ondas menores se movendo */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-[1]" style={{ transform: 'translateY(-98%)' }}>
        <motion.svg 
          className="relative block w-full h-[40px] sm:h-[60px]" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
          animate={{ 
            y: [0, 3, 0],
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity, 
            repeatType: "mirror", 
            ease: "easeInOut" 
          }}
        >
          <motion.path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            fill="#fcf7df"
            opacity="0.3"
            animate={{ 
              x: [0, -20, 0, 20, 0],
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity,
              repeatType: "loop", 
              ease: "easeInOut" 
            }}
          />
          <motion.path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            fill="#ffffff"
            opacity="0.5"
            animate={{ 
              x: [0, 20, 0, -20, 0],
            }}
            transition={{ 
              duration: 12, 
              repeat: Infinity,
              repeatType: "loop", 
              ease: "easeInOut",
              delay: 0.5
            }}
          />
        </motion.svg>
      </div>
      
      {/* Background com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50"></div>
      
      {/* Círculos decorativos */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-yellow/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-4 font-syne text-text-base"
          >
            Escolha o plano ideal para sua oficina
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-700 max-w-2xl mx-auto text-lg"
          >
            Comece gratuitamente e evolua para o plano completo quando precisar de mais recursos
          </motion.p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Plano Gratuito */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.3 } }}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-200 hover:shadow-md transition-all duration-300"
          >
            <div className="p-8">
              <div className="text-lg font-medium text-gray-600 mb-1">Plano Gratuito</div>
              <div className="flex items-end mb-4">
                <span className="text-4xl font-bold mr-2 font-syne text-text-base">R$ 0</span>
                <span className="text-gray-600 pb-1">/mês</span>
              </div>
              <p className="text-gray-700 mb-6">
                Ideal para começar a receber orçamentos sem custo inicial
              </p>
              
              <motion.div 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/cadastro" className="btn-light-blue block w-full text-center">
                  Começar grátis
                </Link>
              </motion.div>
            </div>
            
            <div className="border-t border-neutral-100 p-8">
              <ul className="space-y-5">
                {planFeatures.map((feature, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  >
                    {feature.freeIncluded ? (
                      <CheckCircleSolidIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    ) : (
                      <XCircleIcon className="h-6 w-6 text-gray-300 mr-3 flex-shrink-0" />
                    )}
                    <span className={feature.freeIncluded ? 'text-text-base' : 'text-gray-400'}>
                      {feature.name}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
          
          {/* Plano Profissional */}
          <motion.div
            ref={proCardRef}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -5, transition: { duration: 0.3 } }}
            onHoverStart={() => setIsProHovered(true)}
            onHoverEnd={() => setIsProHovered(false)}
            className="bg-white rounded-2xl overflow-hidden shadow-lg relative"
            style={{
              background: "linear-gradient(white, white) padding-box, linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%) border-box",
              border: "2px solid transparent",
            }}
          >
            {/* Badge Recomendado */}
            <motion.div 
              className="absolute -top-1 -right-1"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="bg-blue px-4 py-1.5 text-white text-sm font-bold rounded-bl-lg rounded-tr-xl shadow-sm flex items-center">
                <SparklesIcon className="w-4 h-4 mr-1.5" />
                Recomendado
              </div>
            </motion.div>
            
            {/* Efeito de brilho */}
            {isInView && (
              <motion.div 
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 0.3, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatType: "reverse",
                  ease: "easeInOut",
                  delay: 1 
                }}
                style={{
                  background: "linear-gradient(45deg, transparent 20%, rgba(59, 130, 246, 0.1) 50%, transparent 80%)",
                }}
              />
            )}
            
            <div className="p-8">
              <div className="text-lg font-medium text-gray-600 mb-1">Plano Profissional</div>
              <div className="flex items-end mb-4">
                <span className="text-4xl font-bold mr-2 font-syne text-blue">R$ 149</span>
                <span className="text-gray-600 pb-1">/mês</span>
              </div>
              <p className="text-gray-700 mb-6">
                Acesso completo a todas as funcionalidades para otimizar sua oficina
              </p>
              
              <motion.div 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                animate={isProHovered ? { y: [0, -3, 0], transition: { repeat: 0 } } : {}}
              >
                <Link href="/cadastro-pro" className="btn-primary block w-full text-center">
                  Testar grátis por 14 dias
                </Link>
              </motion.div>
            </div>
            
            <div className="border-t border-neutral-100 p-8">
              <ul className="space-y-5">
                {planFeatures.map((feature, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                  >
                    <CheckCircleSolidIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-text-base">
                      {feature.name}
                    </span>
                  </motion.li>
                ))}
                
                <motion.li 
                  className="flex items-start"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.2 + planFeatures.length * 0.05 }}
                >
                  <CheckCircleSolidIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-text-base">
                    Atendimento prioritário
                  </span>
                </motion.li>
                
                <motion.li 
                  className="flex items-start"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.2 + (planFeatures.length + 1) * 0.05 }}
                >
                  <CheckCircleSolidIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-text-base">
                    Relatórios avançados
                  </span>
                </motion.li>
              </ul>
            </div>
            
            {/* Selo de garantia */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-yellow/95 text-gray-800 text-[10px] sm:text-xs font-medium px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border border-yellow-400/30 shadow-sm whitespace-nowrap"
            >
              Sem compromisso • Cancele quando quiser
            </motion.div>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-16 bg-blue/5 py-6 px-8 rounded-xl max-w-3xl mx-auto border border-blue/10"
        >
          <p className="text-gray-700">
            Todos os planos incluem atualizações gratuitas e suporte por e-mail.
            <br />Não exigimos contrato de fidelidade. Cancele quando quiser.
          </p>
          
          <div className="mt-4 flex justify-center gap-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="text-blue hover:text-blue-dark"
            >
              <Link href="/termos" className="text-sm underline">
                Termos de serviço
              </Link>
            </motion.div>
            
            <span className="text-gray-400">•</span>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="text-blue hover:text-blue-dark"
            >
              <Link href="/perguntas" className="text-sm underline">
                Perguntas frequentes
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PlansSection; 