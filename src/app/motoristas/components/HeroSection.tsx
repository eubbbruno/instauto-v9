"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import Image from "next/image";
import { Variants } from "framer-motion";
import AddressAutocomplete from "@/components/AddressAutocomplete";
// useState removido pois não está sendo usado

interface AddressSuggestion {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  type?: 'cep' | 'city' | 'district';
  display: string;
}

export default function HeroSection() {
  // Removido selectedAddress por não estar sendo usado

  // Variantes para animações
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100 
      } 
    }
  };
  
  const heroFeatures = [
    { text: "Economize até 30% em manutenções e reparos" },
    { text: "Receba orçamentos detalhados sem compromisso" },
    { text: "Acompanhe o serviço do início ao fim pelo app" },
    { text: "Atendimento prioritário nas oficinas parceiras" }
  ];

  const handleAddressSelect = (address: AddressSuggestion) => {
    console.log('Endereço selecionado:', address);
    // Aqui você pode redirecionar para a página de resultados ou fazer a busca
  };

  return (
    <section className="relative min-h-screen flex items-center bg-white overflow-hidden">
      {/* Background com padrão de pontos */}
      <div className="absolute inset-0 pattern-dots opacity-5"></div>
      
      {/* Elementos decorativos */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-blue/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-yellow/10 rounded-full blur-3xl"></div>
      
      {/* Conteúdo do Hero */}
      <div className="container-custom relative z-10 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10"
          >
            {/* Card principal com conteúdo */}
            <div className="bg-white p-8 rounded-3xl shadow-lg">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-block bg-[#0047CC]/10 text-[#0047CC] px-5 py-2 rounded-full text-sm font-medium mb-6"
              >
                Conseguir um orçamento nunca ficou tão fácil
              </motion.span>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
              >
                Conectando o seu{" "}
                <span className="relative inline-block min-w-32">
                  <span className="text-blue opacity-0">automóvel</span>
                  <motion.span
                    className="text-[#0047CC] absolute left-0 w-full"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: [0, 1, 0], y: [10, 0, -10] }}
                    transition={{
                      duration: 2.5,
                      times: [0, 0.1, 0.9],
                      repeat: Infinity,
                      repeatDelay: 12.5
                    }}
                  >
                    automóvel
                  </motion.span>
                  <motion.span
                    className="text-[#0047CC] absolute left-0 w-full"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: [0, 1, 0], y: [10, 0, -10] }}
                    transition={{
                      duration: 2.5,
                      times: [0, 0.1, 0.9],
                      repeat: Infinity,
                      repeatDelay: 12.5,
                      delay: 3
                    }}
                  >
                    carro
                  </motion.span>
                  <motion.span
                    className="text-[#0047CC] absolute left-0 w-full"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: [0, 1, 0], y: [10, 0, -10] }}
                    transition={{
                      duration: 2.5,
                      times: [0, 0.1, 0.9],
                      repeat: Infinity,
                      repeatDelay: 12.5,
                      delay: 6
                    }}
                  >
                    moto
                  </motion.span>
                  <motion.span
                    className="text-[#0047CC] absolute left-0 w-full"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: [0, 1, 0], y: [10, 0, -10] }}
                    transition={{
                      duration: 2.5,
                      times: [0, 0.1, 0.9],
                      repeat: Infinity,
                      repeatDelay: 12.5,
                      delay: 9
                    }}
                  >
                    caminhão
                  </motion.span>
                  <motion.span
                    className="text-[#0047CC] absolute left-0 w-full"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: [0, 1, 0], y: [10, 0, -10] }}
                    transition={{
                      duration: 2.5,
                      times: [0, 0.1, 0.9],
                      repeat: Infinity,
                      repeatDelay: 12.5,
                      delay: 12
                    }}
                  >
                    van
                  </motion.span>
                </span>
                {" "}com<br /> <span className="text-[#FFDE59]">oficinas mecânicas</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-gray-600 text-lg mb-8 max-w-lg"
              >
                Conecte-se instantaneamente com as melhores oficinas credenciadas perto de você. Compare preços, leia avaliações e agende serviços diretamente pelo app.
              </motion.p>

              {/* Campo para inserir endereço */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="mb-8"
              >
                <AddressAutocomplete
                  placeholder="Digite seu endereço ou CEP"
                  onAddressSelect={handleAddressSelect}
                  className=""
                />
              </motion.div>

              {/* Lista de features */}
              <motion.ul 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="mb-10 space-y-3"
              >
                {heroFeatures.map((feature, index) => (
                  <motion.li 
                    key={index} 
                    variants={itemVariants}
                    className="flex items-center text-gray-700"
                  >
                    <CheckCircle className="h-5 w-5 text-yellow mr-3 flex-shrink-0" />
                    <span>{feature.text}</span>
                  </motion.li>
                ))}
              </motion.ul>
              
              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <a 
                  href="/oficinas/busca" 
                  className="btn-primary flex items-center justify-center py-2.5"
                >
                  Encontrar Oficinas
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
                <a 
                  href="#beneficios" 
                  className="btn-outline flex items-center justify-center py-2.5"
                >
                  Saiba Mais
                </a>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Imagem do App */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: 0.6, 
              duration: 0.8, 
              ease: [0.16, 1, 0.3, 1]
            }}
            className="relative hidden md:flex justify-center items-center h-[600px]"
          >
            {/* Imagem do app */}
            <div className="relative w-[60%] max-w-[300px] rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-blue/20 to-transparent rounded-2xl z-[-1]"></div>
              <motion.div
                animate={{ 
                  y: [0, -10, 0] 
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut"
                }}
              >
                <Image
                  src="/images/img-01.png"
                  alt="Instauto App Interface"
                  width={300}
                  height={600}
                  className="w-full h-auto object-contain rounded-2xl"
                  priority
                />
              </motion.div>
              
              {/* Halo de luz */}
              <div className="absolute -inset-6 bg-blue/10 opacity-50 blur-xl rounded-full z-[-1]"></div>
            </div>

            {/* Elementos decorativos */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-yellow/20 rounded-full blur-3xl" />
            <div className="absolute top-20 -left-10 w-32 h-32 bg-blue/20 rounded-full blur-2xl" />
          </motion.div>
        </div>
        
        {/* Estatísticas - parte inferior */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-12 md:mt-24 bg-white backdrop-blur-md rounded-2xl p-6 border border-gray-200 shadow-lg"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "10.000+", label: "Motoristas ativos" },
              { value: "3.000+", label: "Oficinas credenciadas" },
              { value: "30.000+", label: "Serviços realizados" },
              { value: "4.8/5", label: "Avaliação dos clientes" }
            ].map((stat, i) => (
              <div key={i} className="text-gray-800">
                <div className="text-3xl md:text-4xl font-bold mb-2 text-blue">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
} 