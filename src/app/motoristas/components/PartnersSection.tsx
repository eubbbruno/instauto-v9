"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";

export default function PartnersSection() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const sliderInnerRef = useRef<HTMLDivElement>(null);
  
  // Lista de parceiros (adicione logos reais quando possível)
  const partners = [
    { name: "Auto Center Brasil", logo: "/images/partners/logo1.svg" },
    { name: "Oficina do João", logo: "/images/partners/logo2.svg" },
    { name: "Mecânica Rápida", logo: "/images/partners/logo3.svg" },
    { name: "Express Car", logo: "/images/partners/logo4.svg" },
    { name: "Auto Elite", logo: "/images/partners/logo5.svg" },
    { name: "Pit Stop", logo: "/images/partners/logo6.svg" },
    { name: "Central da Mecânica", logo: "/images/partners/logo7.svg" },
    { name: "Auto Fix", logo: "/images/partners/logo8.svg" },
  ];
  
  // Animação do carrossel infinito
  useEffect(() => {
    if (sliderInnerRef.current && partners.length) {
      // Clone os itens para criar um efeito de carrossel infinito
      const items = sliderInnerRef.current.children;
      const itemWidth = items[0].clientWidth;
      const totalWidth = itemWidth * items.length;
      
      // Configuração da animação
      gsap.to(sliderInnerRef.current, {
        x: `-=${totalWidth / 2}px`,
        duration: 20,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: function(x) {
            // Cria um efeito de loop infinito
            return (parseFloat(x) % (totalWidth / 2)) + "px";
          }
        }
      });
    }
  }, [partners.length]);
  
  return (
    <section id="parceiros" className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block bg-blue-light text-blue px-4 py-1 rounded-full text-sm font-medium mb-4">
            Rede confiável
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Oficinas parceiras
          </h2>
          <p className="text-gray-600 text-lg">
            Contamos com uma ampla rede de oficinas parceiras, todas verificadas e avaliadas para garantir o melhor serviço.
          </p>
        </div>
      </div>
      
      {/* Carrossel infinito */}
      <div 
        ref={sliderRef}
        className="overflow-hidden py-10 w-full"
      >
        <div 
          ref={sliderInnerRef}
          className="flex"
        >
          {/* Duplicamos os parceiros para criar o efeito de carrossel infinito */}
          {[...partners, ...partners].map((partner, index) => (
            <div 
              key={index}
              className="flex-shrink-0 w-[200px] md:w-[250px] mx-4 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-center h-32"
              data-aos="fade-up"
              data-aos-delay={index * 50}
            >
              {/* Placeholder para os logos */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-2">
                  <span className="text-blue font-bold">{partner.name.charAt(0)}</span>
                </div>
                <div className="text-sm font-medium text-gray-700">{partner.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Estatísticas de parceiros */}
      <div className="container-custom mt-16">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div 
            className="p-6 rounded-xl bg-blue-light/30"
            data-aos="fade-up"
          >
            <div className="text-4xl font-bold text-blue mb-2">500+</div>
            <div className="text-lg font-medium">Oficinas parceiras</div>
            <p className="text-gray-600 mt-2">Em todo o Brasil, prontas para atender você</p>
          </div>
          
          <div 
            className="p-6 rounded-xl bg-yellow/20"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="text-4xl font-bold text-yellow-dark mb-2">98%</div>
            <div className="text-lg font-medium">Taxa de satisfação</div>
            <p className="text-gray-600 mt-2">Avaliações positivas dos nossos usuários</p>
          </div>
          
          <div 
            className="p-6 rounded-xl bg-blue-light/30"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="text-4xl font-bold text-blue mb-2">30+</div>
            <div className="text-lg font-medium">Serviços disponíveis</div>
            <p className="text-gray-600 mt-2">Para todos os tipos de veículos</p>
          </div>
        </div>
        
        <div className="text-center mt-16">
          <a 
            href="/oficinas" 
            className="btn-outline inline-block"
          >
            Torne-se um parceiro
          </a>
        </div>
      </div>
    </section>
  );
} 