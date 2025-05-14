"use client";

import { motion } from "framer-motion";
import {
  UserGroupIcon,
  ChartBarIcon,
  DevicePhoneMobileIcon,
  ChatBubbleLeftRightIcon,
  CogIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

const benefits = [
  {
    icon: <UserGroupIcon className="h-12 w-12 text-blue mb-4" />,
    title: "Mais clientes, menos esforço",
    description: "Receba orçamentos diretos de motoristas da sua região que já estão procurando os serviços que você oferece."
  },
  {
    icon: <ChartBarIcon className="h-12 w-12 text-blue mb-4" />,
    title: "ERP e CRM completo",
    description: "Gerencie seu estoque, ordens de serviço, faturamento e relacionamento com clientes em um único sistema."
  },
  {
    icon: <DevicePhoneMobileIcon className="h-12 w-12 text-blue mb-4" />,
    title: "Acesso via celular",
    description: "Sistema 100% responsivo que funciona no navegador do seu celular ou tablet, sem precisar instalar apps."
  },
  {
    icon: <ChatBubbleLeftRightIcon className="h-12 w-12 text-blue mb-4" />,
    title: "Integração com WhatsApp",
    description: "Envie notificações automáticas para seus clientes sobre status do serviço, orçamentos e lembretes."
  },
  {
    icon: <CogIcon className="h-12 w-12 text-blue mb-4" />,
    title: "Suporte com IA",
    description: "Assistente virtual que ajuda a gerenciar sua agenda, responder dúvidas comuns e otimizar seus processos."
  },
  {
    icon: <CurrencyDollarIcon className="h-12 w-12 text-blue mb-4" />,
    title: "Aumente seu faturamento",
    description: "Oficinas que usam o Instauto relatam aumento médio de 30% no faturamento após 3 meses de uso."
  },
];

const BenefitsSection = () => {
  return (
    <section id="beneficios" className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4 font-syne text-gray-900"
          >
            Benefícios para sua oficina
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            O Instauto oferece uma solução completa para digitalizar e potencializar o crescimento da sua oficina
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300"
            >
              {benefit.icon}
              <h3 className="text-xl font-bold mb-2 font-syne">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection; 