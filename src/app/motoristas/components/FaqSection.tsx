"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useInView } from "framer-motion";
import { useRef } from "react";

const faqs = [
  {
    pergunta: "Como funciona o Instauto para motoristas?",
    resposta: "O Instauto conecta você diretamente às melhores oficinas da sua região. Basta descrever o problema do seu veículo, receber orçamentos das oficinas próximas, escolher a melhor oferta e agendar o serviço. Todo o processo é feito pelo aplicativo, sem necessidade de ligações telefônicas."
  },
  {
    pergunta: "Preciso pagar para usar o aplicativo?",
    resposta: "Não! O download e uso do aplicativo Instauto são totalmente gratuitos para motoristas. Você só paga pelos serviços que contratar com as oficinas parceiras, com preços transparentes e sem taxas adicionais."
  },
  {
    pergunta: "Como sei se posso confiar nas oficinas parceiras?",
    resposta: "Todas as oficinas parceiras do Instauto passam por um rigoroso processo de verificação antes de entrar na plataforma. Além disso, você pode consultar avaliações de outros motoristas, ver fotos da oficina e conhecer os serviços oferecidos antes de escolher."
  },
  {
    pergunta: "É possível acompanhar o status do meu veículo durante o serviço?",
    resposta: "Sim! Através do aplicativo Instauto, você recebe atualizações em tempo real sobre o status do seu veículo, incluindo fotos do serviço em andamento. Você também pode conversar diretamente com a oficina para esclarecer dúvidas."
  },
  {
    pergunta: "O que acontece se eu não ficar satisfeito com o serviço?",
    resposta: "No Instauto, você pode avaliar o serviço após a conclusão. Se houver algum problema, nossa equipe de suporte está disponível para mediar a situação e garantir que você tenha a melhor experiência possível."
  },
  {
    pergunta: "Preciso levar meu veículo até a oficina ou existe serviço de reboque?",
    resposta: "Algumas oficinas parceiras oferecem serviço de reboque ou atendimento móvel. Você pode verificar quais oficinas oferecem esse serviço diretamente no aplicativo ao solicitar orçamentos."
  }
];

export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section 
      id="faq" 
      ref={ref}
      className="py-20 bg-gray-100 relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue/5 rounded-full -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow/10 rounded-full translate-y-1/3 -translate-x-1/4" />
      <div className="absolute inset-0 pattern-dots opacity-30" />
      
      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative inline-block">
            Perguntas Frequentes
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-yellow rounded-full"></div>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tire suas dúvidas sobre o Instauto e descubra como podemos facilitar a manutenção do seu veículo.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="mb-4"
            >
              <div 
                onClick={() => toggleFaq(index)}
                className={`flex justify-between items-center p-5 rounded-xl cursor-pointer transition-all ${
                  activeIndex === index 
                    ? "bg-blue text-white shadow-lg" 
                    : "bg-white text-gray-800 hover:bg-blue-light"
                }`}
              >
                <h3 className="font-medium text-lg">{faq.pergunta}</h3>
                <div className={`transition-all duration-300 ${activeIndex === index ? "bg-white text-blue" : "bg-blue-light text-blue"} p-2 rounded-full`}>
                  {activeIndex === index ? (
                    <Minus size={20} />
                  ) : (
                    <Plus size={20} />
                  )}
                </div>
              </div>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 bg-white rounded-b-xl border border-t-0 border-gray-200 text-gray-600">
                      {faq.resposta}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="mb-4 text-gray-600">
            Ainda tem dúvidas?
          </p>
          <a 
            href="#contato" 
            className="btn-primary inline-flex items-center"
          >
            Entre em contato
          </a>
        </motion.div>
      </div>
    </section>
  );
} 