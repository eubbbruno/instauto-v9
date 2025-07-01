"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { SparklesIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/solid";

// Tipos para FAQ
type FaqItem = {
  question: string;
  answer: string;
};

const FaqSection = () => {
  // Estado para controlar o FAQ
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);
  const faqRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Função para lidar com cliques nos itens
  const toggleFaq = (index: number) => {
    // Fechar o FAQ ativo, ou abrir o clicado
    setActiveFaqIndex(activeFaqIndex === index ? null : index);
    
    // Scroll suave até o item selecionado se estiver em dispositivo móvel
    if (activeFaqIndex !== index && window.innerWidth < 768) {
      setTimeout(() => {
        faqRefs.current[index]?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
      }, 100);
    }
  };

  // Dados para a seção de FAQ
  const faqItems: FaqItem[] = [
    {
      question: "É gratuito se cadastrar?",
      answer: "Sim, o cadastro no Instauto é 100% gratuito. Você pode começar a receber orçamentos sem pagar nada. Oferecemos um plano gratuito com recursos básicos e um plano profissional com mais funcionalidades."
    },
    {
      question: "Como recebo orçamentos?",
      answer: "Os motoristas utilizam o Instauto para solicitar serviços. Quando alguém próximo à sua região precisa de um serviço que sua oficina oferece, você recebe uma notificação e pode enviar um orçamento. O sistema é automático e conecta você diretamente com novos clientes."
    },
    {
      question: "Preciso instalar algum app?",
      answer: "Não é necessário instalar nenhum aplicativo. O Instauto funciona 100% via navegador, tanto em computadores quanto em dispositivos móveis. Basta acessar com seu login e senha."
    },
    {
      question: "Posso acessar pelo celular?",
      answer: "Sim, o painel do Instauto é totalmente responsivo e pode ser acessado pelo navegador do seu celular ou tablet. Você pode gerenciar sua oficina de qualquer lugar, sem precisar instalar aplicativos."
    },
    {
      question: "Como funciona a integração com WhatsApp?",
      answer: "O Instauto permite enviar notificações automáticas via WhatsApp para seus clientes. Você pode comunicar orçamentos aprovados, status de serviços e lembretes de manutenção, tudo integrado com sua agenda."
    }
  ];

  // Variantes de animação para os elementos
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-24 relative overflow-hidden" data-contrast="light">
      {/* Background com padrão sutil */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-white/80"></div>
      
      {/* Círculos decorativos */}
      <div className="absolute top-20 right-10 w-24 h-24 bg-yellow-400/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-10 w-32 h-32 bg-blue-600/10 rounded-full blur-xl"></div>
      
      {/* Formas flutuantes */}
      <motion.div 
        className="absolute top-1/4 right-[5%] w-12 h-12 rounded-full border-2 border-blue-600/20 hidden md:block"
        animate={{ 
          y: [0, -15, 0],
          rotate: [0, 10, 0],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      />
      
      <motion.div 
        className="absolute bottom-1/4 left-[10%] w-8 h-8 rounded-lg border-2 border-yellow-400/40 hidden md:block"
        animate={{ 
          y: [0, 15, 0],
          rotate: [0, -15, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 7, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1 
        }}
      />
      
      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Cabeçalho com badge */}
          <div className="text-center mb-16 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block bg-blue-600/10 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <span className="flex items-center justify-center">
                <QuestionMarkCircleIcon className="w-4 h-4 mr-2" />
                Dúvidas frequentes
              </span>
            </motion.div>
            
            <div className="flex flex-col items-center">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl font-bold mb-6 font-syne text-text-base relative inline-block"
              >
                Perguntas frequentes
                <motion.div 
                  className="absolute -right-8 -top-2"
                  initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <SparklesIcon className="w-6 h-6 text-yellow-400" />
                </motion.div>
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-gray-600 max-w-2xl mx-auto text-lg"
              >
                Tire suas dúvidas sobre como o Instauto pode ajudar sua oficina a crescer
              </motion.p>
            </div>
            
            {/* Linha decorativa */}
            <motion.div 
              className="w-24 h-1 bg-yellow-400 mx-auto mt-8"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            ></motion.div>
          </div>
          
          {/* Lista de FAQs */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="relative space-y-4"
          >
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                ref={el => {
                  faqRefs.current[index] = el;
                  return undefined;
                }}
                variants={itemVariants}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative"
              >
                <div
                  className={`
                    bg-white rounded-xl overflow-hidden shadow-sm border border-neutral-100
                    transition-all duration-300 ease-in-out transform
                    ${activeFaqIndex === index ? 'shadow-md border-blue-600/30 scale-[1.01] relative z-10' : 'hover:shadow-md'}
                  `}
                >
                  <button
                    className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={activeFaqIndex === index}
                  >
                    <span className={`font-bold transition-colors duration-300 ${activeFaqIndex === index ? 'text-blue-600' : 'text-text-base'}`}>
                      {item.question}
                    </span>
                    <motion.div
                      animate={{ rotate: activeFaqIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex-shrink-0 ml-4 rounded-full p-1 ${activeFaqIndex === index ? 'bg-blue-600/10 text-blue-600' : 'text-gray-500'}`}
                    >
                      <ChevronDownIcon className="h-5 w-5" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {activeFaqIndex === index && (
                      <motion.div
                        key={`content-${index}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-1">
                          <div className="h-px bg-neutral-100 w-full mb-4"></div>
                          <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Nota de rodapé com CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center mt-12 bg-blue-600/5 py-6 px-8 rounded-xl border border-blue-600/10"
          >
            <p className="text-gray-600">
              Não encontrou o que procurava? Fale diretamente com nossa equipe.
            </p>
            <motion.a
              href="/contato"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary inline-block mt-4"
            >
              Entre em contato
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection; 