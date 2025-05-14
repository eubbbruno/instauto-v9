"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRightIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

const HeroSection = () => {
  // Variantes de animação para Framer Motion
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="bg-blue py-16 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute top-0 right-0 w-1/3 h-2/3 bg-blue-600/30 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-yellow/20 rounded-full blur-[150px]"></div>
      
      <div className="container-custom relative z-10">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          {/* Hero Text Content */}
          <motion.div variants={fadeInUp}>
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-yellow text-gray-900 px-4 py-1 rounded-full text-sm font-medium inline-block mb-4"
            >
              Sistema completo para sua oficina
            </motion.span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-syne leading-tight">
              Receba orçamentos todos os dias e gerencie sua oficina com um sistema simples e completo
            </h1>
            
            <p className="text-white/90 text-lg mb-8 font-sans max-w-xl">
              Cadastre sua oficina no Instauto e comece hoje mesmo a atrair motoristas da sua região prontos para fechar serviço, sem complicação e com gestão completa.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/cadastro" className="bg-yellow hover:bg-yellow-400 text-gray-900 font-medium py-3 px-6 rounded-md transition-all duration-300 shadow-lg hover:shadow-xl">
                <span className="flex items-center justify-center w-full font-sans">
                  Cadastrar minha oficina
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </span>
              </Link>
              
              <Link href="#como-funciona" className="bg-white hover:bg-gray-100 text-blue font-medium py-3 px-6 rounded-md transition-all duration-300">
                <span className="font-sans">Como funciona</span>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center text-white">
                <CheckCircleIcon className="h-5 w-5 text-yellow mr-2 flex-shrink-0" />
                <p className="font-sans">14 dias grátis</p>
              </div>
              <div className="flex items-center text-white">
                <CheckCircleIcon className="h-5 w-5 text-yellow mr-2 flex-shrink-0" />
                <p className="font-sans">Sem cartão de crédito</p>
              </div>
              <div className="flex items-center text-white">
                <CheckCircleIcon className="h-5 w-5 text-yellow mr-2 flex-shrink-0" />
                <p className="font-sans">Cancelamento fácil</p>
              </div>
            </div>
          </motion.div>

          {/* Hero Dashboard Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
            className="hidden md:block relative h-[500px]"
          >
            <div className="absolute inset-0 bg-white rounded-xl shadow-xl overflow-hidden transform rotate-1">
              <div className="w-full h-full bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center p-6">
                <div className="w-full bg-white rounded-lg shadow-md p-4 mb-4">
                  <div className="flex items-center mb-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="flex justify-between mb-3">
                    <div className="text-sm font-medium">Dashboard Oficina</div>
                    <div className="text-sm text-blue">65% mais clientes</div>
                  </div>
                  <div className="flex space-x-2 mb-4">
                    <div className="h-2 bg-blue-100 rounded-full w-1/3"></div>
                    <div className="h-2 bg-blue-200 rounded-full w-1/4"></div>
                    <div className="h-2 bg-blue-300 rounded-full w-1/5"></div>
                    <div className="h-2 bg-blue-400 rounded-full w-1/6"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-blue-50 rounded-lg p-2 text-center">
                      <div className="text-xs text-gray-500">Orçamentos</div>
                      <div className="text-blue font-bold">12</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-2 text-center">
                      <div className="text-xs text-gray-500">Finalizados</div>
                      <div className="text-green-600 font-bold">8</div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-2 text-center">
                      <div className="text-xs text-gray-500">Em Progresso</div>
                      <div className="text-yellow-600 font-bold">4</div>
                    </div>
                  </div>
                </div>
                
                <div className="w-full bg-white rounded-lg shadow-md p-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <div className="font-medium">Novos Orçamentos</div>
                    <div className="text-sm text-blue">Ver todos</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
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
                
                <div className="flex w-full justify-between">
                  <div className="bg-white rounded-lg shadow-md p-2 w-[48%]">
                    <div className="text-xs font-medium mb-1">Faturamento</div>
                    <div className="text-green-600 font-bold">R$ 12.450</div>
                    <div className="text-xs text-green-500">↑ 23% mês</div>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-2 w-[48%]">
                    <div className="text-xs font-medium mb-1">Satisfação</div>
                    <div className="text-blue font-bold">4.8/5.0</div>
                    <div className="text-xs text-blue">★★★★★</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection; 