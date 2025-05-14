"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircleIcon as CheckCircleSolidIcon, XCircleIcon } from "@heroicons/react/24/solid";

// Tipos para os planos
type PlanFeature = {
  name: string;
  freeIncluded: boolean;
  proIncluded: boolean;
};

const PlansSection = () => {
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
    <section id="planos" className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4 font-syne text-gray-900"
          >
            Escolha o plano ideal para sua oficina
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-600 max-w-2xl mx-auto"
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
            className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200"
          >
            <div className="p-6">
              <div className="text-lg font-medium text-gray-500 mb-1">Plano Gratuito</div>
              <div className="flex items-end mb-4">
                <span className="text-4xl font-bold mr-2 font-syne">R$ 0</span>
                <span className="text-gray-500 pb-1">/mês</span>
              </div>
              <p className="text-gray-600 mb-6">
                Ideal para começar a receber orçamentos sem custo inicial
              </p>
              
              <Link href="/cadastro" className="block w-full py-3 px-4 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-md text-center transition-all duration-300">
                Começar grátis
              </Link>
            </div>
            
            <div className="border-t border-gray-200 p-6">
              <ul className="space-y-4">
                {planFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    {feature.freeIncluded ? (
                      <CheckCircleSolidIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    ) : (
                      <XCircleIcon className="h-6 w-6 text-gray-300 mr-3 flex-shrink-0" />
                    )}
                    <span className={feature.freeIncluded ? 'text-gray-800' : 'text-gray-400'}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
          
          {/* Plano Profissional */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg overflow-hidden shadow-lg border-2 border-blue relative"
          >
            <div className="absolute top-0 right-0 bg-blue text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              Recomendado
            </div>
            
            <div className="p-6">
              <div className="text-lg font-medium text-gray-500 mb-1">Plano Profissional</div>
              <div className="flex items-end mb-4">
                <span className="text-4xl font-bold mr-2 font-syne text-blue">R$ 149</span>
                <span className="text-gray-500 pb-1">/mês</span>
              </div>
              <p className="text-gray-600 mb-6">
                Acesso completo a todas as funcionalidades para otimizar sua oficina
              </p>
              
              <Link href="/cadastro-pro" className="block w-full py-3 px-4 bg-blue hover:bg-blue-600 text-white font-medium rounded-md text-center transition-all duration-300">
                Testar grátis por 14 dias
              </Link>
            </div>
            
            <div className="border-t border-gray-200 p-6">
              <ul className="space-y-4">
                {planFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircleSolidIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-800">
                      {feature.name}
                    </span>
                  </li>
                ))}
                
                <li className="flex items-start">
                  <CheckCircleSolidIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-800">
                    Atendimento prioritário
                  </span>
                </li>
                
                <li className="flex items-start">
                  <CheckCircleSolidIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-800">
                    Relatórios avançados
                  </span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
        
        <div className="text-center mt-10">
          <p className="text-gray-500 text-sm">
            Todos os planos incluem atualizações gratuitas e suporte por e-mail.
            <br />Não exigimos contrato de fidelidade. Cancele quando quiser.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PlansSection; 