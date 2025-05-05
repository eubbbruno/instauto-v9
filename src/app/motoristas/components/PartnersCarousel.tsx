"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function PartnersCarousel() {
  const partners = [
    "uber-seeklogo.png",
    "mercado-livre-seeklogo.png",
    "correios-seeklogo.png",
    "localiza-seeklogo.png",
    "unidas-rent-a-car-seeklogo.png",
    "rappi-seeklogo.png",
    "volvo-seeklogo.png",
    "mercedes-benz-seeklogo.png",
    "scania-seeklogo.png",
  ];

  return (
    <section className="py-12 bg-gray-50 border-y border-gray-100">
      <div className="container-custom">
        <div className="text-center mb-8">
          <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-2">
            Empresas que confiam no Instauto
          </h3>
          <div className="w-20 h-1 bg-blue/20 rounded-full mx-auto"></div>
        </div>
        
        <div className="relative overflow-hidden mx-auto">
          {/* Gradiente de fade nas bordas */}
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-gray-50 to-transparent"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-gray-50 to-transparent"></div>
          
          <div className="flex items-center justify-center">
            <motion.div
              className="flex items-center space-x-16 py-4"
              animate={{ x: [0, -1920] }}
              transition={{
                x: {
                  duration: 40,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear",
                }
              }}
            >
              {/* Primeira sequência de logos */}
              {partners.map((logo, index) => (
                <div key={index} className="flex-shrink-0 h-12 flex items-center mx-8">
                  <Image
                    src={`/images/${logo}`}
                    alt="Parceiro Corporativo"
                    width={120}
                    height={48}
                    className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              ))}
              
              {/* Segunda sequência (duplicada) para criar loop contínuo */}
              {partners.map((logo, index) => (
                <div key={index + 100} className="flex-shrink-0 h-12 flex items-center mx-8">
                  <Image
                    src={`/images/${logo}`}
                    alt="Parceiro Corporativo"
                    width={120}
                    height={48}
                    className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              ))}
              
              {/* Terceira sequência para garantir o preenchimento durante a animação */}
              {partners.map((logo, index) => (
                <div key={index + 200} className="flex-shrink-0 h-12 flex items-center mx-8">
                  <Image
                    src={`/images/${logo}`}
                    alt="Parceiro Corporativo"
                    width={120}
                    height={48}
                    className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Frotas corporativas de empresas líderes utilizam nossa plataforma diariamente
          </p>
        </div>
      </div>
    </section>
  );
} 