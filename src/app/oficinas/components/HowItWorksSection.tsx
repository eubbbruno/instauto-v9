"use client";

import { motion } from "framer-motion";

const HowItWorksSection = () => {
  return (
    <section id="como-funciona" className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4 font-syne text-gray-900"
          >
            Como funciona
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Apenas 3 passos simples para começar a receber orçamentos e gerenciar sua oficina
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Passo 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gray-50 rounded-lg p-6 text-center relative overflow-hidden group hover:shadow-lg transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue/10 rounded-bl-full -mr-8 -mt-8 transition-all duration-300 group-hover:bg-blue/20"></div>
            <div className="bg-blue/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-blue-600 group-hover:bg-blue/20 transition-all duration-300">
              <span className="text-3xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-bold mb-2 font-syne">Crie sua conta</h3>
            <p className="text-gray-600">
              Cadastre-se gratuitamente, informe os dados da sua oficina e os serviços que você oferece.
            </p>
          </motion.div>

          {/* Passo 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-50 rounded-lg p-6 text-center relative overflow-hidden group hover:shadow-lg transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue/10 rounded-bl-full -mr-8 -mt-8 transition-all duration-300 group-hover:bg-blue/20"></div>
            <div className="bg-blue/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-blue-600 group-hover:bg-blue/20 transition-all duration-300">
              <span className="text-3xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-bold mb-2 font-syne">Receba orçamentos</h3>
            <p className="text-gray-600">
              Motoristas da sua região enviam solicitações de orçamentos para os serviços que você oferece.
            </p>
          </motion.div>

          {/* Passo 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gray-50 rounded-lg p-6 text-center relative overflow-hidden group hover:shadow-lg transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue/10 rounded-bl-full -mr-8 -mt-8 transition-all duration-300 group-hover:bg-blue/20"></div>
            <div className="bg-blue/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-blue-600 group-hover:bg-blue/20 transition-all duration-300">
              <span className="text-3xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-bold mb-2 font-syne">Gerencie tudo</h3>
            <p className="text-gray-600">
              Controle ordens de serviço, estoque, financeiro e fidelização de clientes no painel.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection; 