"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircleIcon as CheckCircleSolidIcon, XCircleIcon, SparklesIcon } from "@heroicons/react/24/solid";
import { useState, useEffect, useRef } from "react";
import MercadoPagoCheckout from "@/components/payments/MercadoPagoCheckout";
import { supabase } from "@/lib/supabase";

// Tipos para os planos
type PlanFeature = {
  name: string;
  freeIncluded: boolean;
  proIncluded: boolean;
};

export default function PlanosPage() {
  const [isProHovered, setIsProHovered] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
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

  // Recursos dos planos seguindo exatamente a PlansSection
  const planFeatures: PlanFeature[] = [
    { name: "Receber e responder orçamentos", freeIncluded: true, proIncluded: true },
    { name: "ERP + CRM completo", freeIncluded: false, proIncluded: true },
    { name: "Ordens de Serviço", freeIncluded: false, proIncluded: true },
    { name: "Estoque, financeiro, relatórios", freeIncluded: false, proIncluded: true },
    { name: "Suporte com IA + WhatsApp", freeIncluded: false, proIncluded: true },
    { name: "Acesso via celular", freeIncluded: true, proIncluded: true }
  ];

  const handlePlanSelect = async (plan: 'free' | 'pro') => {
    if (plan === 'pro') {
      // Verificar se o usuário está logado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Redirecionar para login com query parameter
        window.location.href = '/oficinas/login?return_url=/oficinas/planos&plan=pro';
        return;
      }
      
      setShowCheckout(true);
    } else {
      // Para plano gratuito, redirecionar para login/cadastro
      window.location.href = '/oficinas/login?plan=free&type=oficina';
    }
  };

  if (showCheckout) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Finalizar Assinatura - Plano Profissional
              </h1>
              <p className="text-gray-600">
                Complete o pagamento para ativar todas as funcionalidades
              </p>
            </div>
            
            <MercadoPagoCheckout 
              planType="pro"
              onSuccess={() => {
                window.location.href = '/oficina-pro?plan=pro&status=success';
              }}
              onError={() => {
                setShowCheckout(false);
              }}
            />
            
            <div className="text-center mt-6">
              <button 
                onClick={() => setShowCheckout(false)}
                className="text-gray-600 hover:text-gray-800 underline"
              >
                Voltar aos planos
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header simples */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <img src="/logo-instauto.svg" alt="Instauto" className="h-8" />
            </Link>
            <Link href="/auth" className="text-blue-600 hover:text-blue-700 font-medium">
              Já tenho conta
            </Link>
          </div>
        </div>
      </header>

      {/* Seção de Planos - Copiada exatamente da PlansSection */}
      <section className="pt-20 pb-24 relative overflow-hidden">
        {/* Background com gradiente */}
        <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50"></div>
        
        {/* Círculos decorativos */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-yellow-400/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-600/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-4 font-syne text-gray-900"
            >
              Escolha o plano ideal para sua oficina
            </motion.h1>
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
                  <span className="text-4xl font-bold mr-2 font-syne text-gray-900">R$ 0</span>
                  <span className="text-gray-600 pb-1">/mês</span>
                </div>
                <p className="text-gray-700 mb-6">
                  Ideal para começar a receber orçamentos sem custo inicial
                </p>
                
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePlanSelect('free')}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Começar grátis
                </motion.button>
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
                      <span className={feature.freeIncluded ? 'text-gray-900' : 'text-gray-400'}>
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
                <div className="bg-blue-600 px-4 py-1.5 text-white text-sm font-bold rounded-bl-lg rounded-tr-xl shadow-sm flex items-center">
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
                  <span className="text-4xl font-bold mr-2 font-syne text-blue-600">R$ 89</span>
                  <span className="text-gray-600 pb-1">/mês</span>
                </div>
                <p className="text-gray-700 mb-6">
                  Acesso completo a todas as funcionalidades para otimizar sua oficina
                </p>
                
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  animate={isProHovered ? { y: [0, -3, 0], transition: { repeat: 0 } } : {}}
                  onClick={() => handlePlanSelect('pro')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Testar grátis por 14 dias
                </motion.button>
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
                      <span className="text-gray-900">
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
                    <span className="text-gray-900">
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
                    <span className="text-gray-900">
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
                className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-yellow-400/95 text-gray-800 text-[10px] sm:text-xs font-medium px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border border-yellow-400/30 shadow-sm whitespace-nowrap"
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
            className="text-center mt-16 bg-blue-600/5 py-6 px-8 rounded-xl max-w-3xl mx-auto border border-blue-600/10"
          >
            <p className="text-gray-700">
              Todos os planos incluem atualizações gratuitas e suporte por e-mail.
              <br />Não exigimos contrato de fidelidade. Cancele quando quiser.
            </p>
            
            <div className="mt-4 flex justify-center gap-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="text-blue-600 hover:text-blue-700"
              >
                <Link href="/termos" className="text-sm underline">
                  Termos de serviço
                </Link>
              </motion.div>
              
              <span className="text-gray-400">•</span>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="text-blue-600 hover:text-blue-700"
              >
                <Link href="/contato" className="text-sm underline">
                  Perguntas frequentes
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 