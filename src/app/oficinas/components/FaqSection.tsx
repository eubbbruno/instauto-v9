"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

// Tipos para FAQ
type FaqItem = {
  question: string;
  answer: string;
};

const FaqSection = () => {
  // Estado para controlar o FAQ
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

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

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4 font-syne text-gray-900"
          >
            Perguntas frequentes
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Tire suas dúvidas sobre como o Instauto pode ajudar sua oficina
          </motion.p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="mb-4"
            >
              <div
                className={`bg-gray-50 rounded-lg overflow-hidden border ${
                  activeFaqIndex === index ? "border-blue" : "border-gray-200"
                }`}
              >
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => setActiveFaqIndex(activeFaqIndex === index ? null : index)}
                >
                  <span className="font-bold text-gray-900">{item.question}</span>
                  {activeFaqIndex === index ? (
                    <ChevronUpIcon className="h-5 w-5 text-blue" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                
                <div
                  className={`px-6 overflow-hidden transition-all duration-300 ${
                    activeFaqIndex === index ? "max-h-96 pb-4" : "max-h-0"
                  }`}
                >
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection; 