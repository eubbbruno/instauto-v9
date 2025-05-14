"use client";

import { motion } from "framer-motion";
import {
  WrenchScrewdriverIcon,
  CogIcon,
  ShieldCheckIcon,
  ClockIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";

// Lista de serviços oferecidos
const services = [
  { 
    title: "Troca de óleo",
    icon: <WrenchScrewdriverIcon className="w-10 h-10 text-blue mb-4" />,
    description: "Manutenção preventiva para garantir a vida útil do motor."
  },
  { 
    title: "Freios e suspensão",
    icon: <CogIcon className="w-10 h-10 text-blue mb-4" />,
    description: "Serviços especializados para segurança e conforto na direção."
  },
  { 
    title: "Alinhamento e balanceamento",
    icon: <CogIcon className="w-10 h-10 text-blue mb-4" />,
    description: "Estabilidade e durabilidade para pneus e suspensão."
  },
  { 
    title: "Revisão geral",
    icon: <ClockIcon className="w-10 h-10 text-blue mb-4" />,
    description: "Manutenção preventiva completa seguindo o manual do fabricante."
  },
  { 
    title: "Injeção eletrônica",
    icon: <CubeIcon className="w-10 h-10 text-blue mb-4" />,
    description: "Diagnóstico e reparo de sistemas eletrônicos do veículo."
  },
  { 
    title: "Elétrica e diagnóstico",
    icon: <ShieldCheckIcon className="w-10 h-10 text-blue mb-4" />,
    description: "Identificação e solução de problemas elétricos e eletrônicos."
  }
];

const ServicesSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4 font-syne text-gray-900"
          >
            Serviços que você pode oferecer
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Conecte-se com motoristas que precisam exatamente dos serviços que sua oficina oferece
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
            >
              {service.icon}
              <h3 className="text-xl font-bold mb-2 font-syne">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection; 