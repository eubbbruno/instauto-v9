"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

const CtaSection = () => {
  const ctaButtonRef = useRef<HTMLAnchorElement>(null);
  
  return (
    <section className="py-20 bg-blue-900 relative overflow-hidden">
      {/* Background simples e efetivo */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-800 to-blue-900"></div>
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFFFFF_1px,transparent_1px)] bg-[length:20px_20px]"></div>
      
      {/* Elementos decorativos simplificados */}
      <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-yellow/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-blue-400/10 rounded-full blur-[100px]"></div>
      
      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            {/* Tag/Badge */}
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium mb-6">
              <span>Vamos transformar sua oficina juntos</span>
            </div>
            
            {/* Título */}
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white font-syne">
              Dê o próximo passo e <span className="text-yellow">conquiste mais clientes</span> para sua oficina
            </h2>
            
            {/* Descrição */}
            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
              Cadastre-se hoje e comece a receber orçamentos de motoristas da sua região enquanto gerencia todo o seu negócio com nosso sistema profissional
            </p>
            
            {/* Benefícios */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-10">
              <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 rounded-full bg-yellow/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-yellow" />
                </div>
                <span>14 dias grátis</span>
              </div>
              
              <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 rounded-full bg-yellow/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-yellow" />
                </div>
                <span>Sem cartão de crédito</span>
              </div>
              
              <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 rounded-full bg-yellow/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-yellow" />
                </div>
                <span>Cancele quando quiser</span>
              </div>
            </div>
            
            {/* Botão CTA - Simplificado, mas efetivo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Link 
                href="/cadastro" 
                ref={ctaButtonRef}
                className="bg-yellow hover:bg-yellow-400 text-gray-900 font-bold py-5 px-10 rounded-xl transition-all duration-300 shadow-lg inline-flex items-center text-xl"
              >
                <span>QUERO AUMENTAR MEU FATURAMENTO</span>
                <ArrowRight className="h-6 w-6 ml-3" />
              </Link>
              
              <p className="text-white/70 mt-6 text-sm">
                Não é necessário cartão de crédito • Teste grátis por 14 dias
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection; 