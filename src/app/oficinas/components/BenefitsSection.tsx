"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import {
  UserGroupIcon,
  ChartBarIcon,
  DevicePhoneMobileIcon,
  ChatBubbleLeftRightIcon,
  CogIcon,
  CurrencyDollarIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const benefits = [
  {
    icon: <UserGroupIcon className="h-10 w-10 text-white" />,
    title: "Mais clientes, menos esforço",
    description: "Receba orçamentos diretos de motoristas da sua região que já estão procurando os serviços que você oferece.",
    color: "from-blue via-blue-dark to-blue",
    category: "crescimento"
  },
  {
    icon: <ChartBarIcon className="h-10 w-10 text-text-base" />,
    title: "ERP e CRM completo",
    description: "Gerencie seu estoque, ordens de serviço, faturamento e relacionamento com clientes em um único sistema.",
    color: "from-yellow to-yellow-dark",
    category: "gestão"
  },
  {
    icon: <DevicePhoneMobileIcon className="h-10 w-10 text-white" />,
    title: "Acesso via celular",
    description: "Sistema 100% responsivo que funciona no navegador do seu celular ou tablet, sem precisar instalar apps.",
    color: "from-blue via-blue-dark to-blue",
    category: "praticidade"
  },
  {
    icon: <ChatBubbleLeftRightIcon className="h-10 w-10 text-text-base" />,
    title: "Integração com WhatsApp",
    description: "Envie notificações automáticas para seus clientes sobre status do serviço, orçamentos e lembretes.",
    color: "from-yellow to-yellow-dark",
    category: "comunicação"
  },
  {
    icon: <CogIcon className="h-10 w-10 text-white" />,
    title: "Suporte com IA",
    description: "Assistente virtual que ajuda a gerenciar sua agenda, responder dúvidas comuns e otimizar seus processos.",
    color: "from-blue via-blue-dark to-blue",
    category: "tecnologia"
  },
  {
    icon: <CurrencyDollarIcon className="h-10 w-10 text-text-base" />,
    title: "Aumente seu faturamento",
    description: "Oficinas que usam o Instauto relatam aumento médio de 30% no faturamento após 3 meses de uso.",
    color: "from-yellow to-yellow-dark",
    category: "resultados"
  },
];

const BenefitsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  // Categorias únicas para filtro
  const categories = [...new Set(benefits.map(item => item.category))];
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [50, 0, 0, 50]);
  
  // Filtrar benefícios se um filtro estiver ativo
  const filteredBenefits = activeFilter 
    ? benefits.filter(benefit => benefit.category === activeFilter)
    : benefits;

  return (
    <section 
      id="beneficios" 
      ref={sectionRef} 
      className="py-24 relative overflow-hidden"
      data-contrast="light"
    >
      {/* Background com efeito gradiente e padrão */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-light via-white to-brand-light overflow-hidden">
        <div className="absolute w-full h-full bg-grid-pattern opacity-5"></div>
        
        {/* Elementos decorativos */}
        <motion.div 
          className="absolute right-0 top-[10%] w-96 h-96 rounded-full bg-blue-600/5 blur-3xl"
          style={{ 
            y: useTransform(scrollYProgress, [0, 1], [0, -50]),
            opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.6, 0.3])
          }}
        />
        <motion.div 
          className="absolute left-0 bottom-[10%] w-96 h-96 rounded-full bg-yellow-400/5 blur-3xl"
          style={{ 
            y: useTransform(scrollYProgress, [0, 1], [0, 50]),
            opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.6, 0.3])
          }}
        />
        
        {/* Partículas decorativas */}
        <motion.div 
          className="absolute top-40 left-[10%] w-3 h-3 rounded-full bg-blue-600"
          style={{ 
            y: useTransform(scrollYProgress, [0, 1], [0, -30]),
            opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3])
          }}
        />
        <motion.div 
          className="absolute top-[30%] right-[15%] w-2 h-2 rounded-full bg-yellow-400"
          style={{ 
            y: useTransform(scrollYProgress, [0, 1], [0, 40]),
            opacity: useTransform(scrollYProgress, [0, 0.6, 1], [0.3, 1, 0.3])
          }}
        />
        <motion.div 
          className="absolute bottom-[25%] left-[20%] w-2 h-2 rounded-full bg-blue-600"
          style={{ 
            y: useTransform(scrollYProgress, [0, 1], [0, -20]),
            opacity: useTransform(scrollYProgress, [0, 0.4, 1], [0.3, 1, 0.3])
          }}
        />
      </div>

      <motion.div 
        className="container-custom relative z-10"
        style={{ opacity, y }}
      >
        {/* Cabeçalho da seção */}
        <div className="text-center mb-16">
          <div className="relative h-8 flex items-center justify-center mb-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="bg-blue-600/10 text-blue-600 px-5 py-1.5 rounded-full text-sm font-medium">
                Potencialize seu negócio
              </span>
            </motion.div>
          </div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-6 font-syne text-text-base relative inline-block"
          >
            Benefícios para sua oficina
            <div className="absolute -bottom-3 left-0 w-full h-1 bg-gradient-to-r from-blue/0 via-blue to-blue/0"></div>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-700 max-w-2xl mx-auto text-lg font-sans"
          >
            O Instauto oferece uma solução completa para digitalizar e potencializar 
            o crescimento da sua oficina
          </motion.p>
        </div>
        
        {/* Filtros de categoria (opcional) */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveFilter(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
              activeFilter === null 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todos
          </motion.button>
          
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors duration-300 ${
                activeFilter === category 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Grid de benefícios */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredBenefits.map((benefit, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1]
                }}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
                }}
                className="group flex flex-col h-full"
              >
                <div className="flex flex-col h-full rounded-2xl bg-white overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  {/* Cabeçalho com ícone */}
                  <div className={`p-6 bg-gradient-to-r ${benefit.color}`}>
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/20 backdrop-blur-sm">
                      {benefit.icon}
                    </div>
                    <div className="absolute top-2 right-2 text-xs font-medium uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-full">
                      {benefit.category}
                    </div>
                  </div>
                  
                  {/* Conteúdo */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-3 font-syne text-text-base">{benefit.title}</h3>
                    <p className="text-gray-700 font-sans mb-6 flex-grow">{benefit.description}</p>
                    
                    {/* Botão/Indicador */}
                    <div className="mt-auto">
                      <div className="inline-flex items-center text-blue-600 font-medium text-sm transition-transform group-hover:translate-x-1">
                        <span>Saiba mais</span>
                        <ArrowRightIcon className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* CTA secundário */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <a 
            href="#planos" 
            className="btn-outline"
          >
            <span className="font-sans">Ver todos os recursos</span>
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default BenefitsSection; 