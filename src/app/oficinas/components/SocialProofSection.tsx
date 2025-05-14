"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const SocialProofSection = () => {
  // Estado para contador animado
  const [count, setCount] = useState(0);
  
  // Animação do contador ao carregar
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => {
        const newCount = prevCount + 50;
        if (newCount >= 3000) {
          clearInterval(interval);
          return 3000;
        }
        return newCount;
      });
    }, 20);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 bg-blue text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/30 rounded-full blur-[120px]"></div>
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-syne">
            <span className="text-yellow">+{count.toLocaleString()}</span> oficinas já usam o Instauto
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-12">
            Junte-se às milhares de oficinas que aumentaram seu faturamento e reduziram custos operacionais com o Instauto
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <div className="text-4xl font-bold text-yellow mb-2">+35%</div>
              <p className="text-white/90">Aumento médio no faturamento após 3 meses</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <div className="text-4xl font-bold text-yellow mb-2">-40%</div>
              <p className="text-white/90">Redução no tempo gasto com administração</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <div className="text-4xl font-bold text-yellow mb-2">4.8/5</div>
              <p className="text-white/90">Índice de satisfação dos nossos clientes</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProofSection; 