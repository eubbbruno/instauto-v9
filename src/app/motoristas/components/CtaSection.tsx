"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Download, MessageCircle, Send } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function CtaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  // Registrar plugins do GSAP
  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
      
      const section = sectionRef.current;
      const ctaElement = ctaRef.current;
      
      if (section && ctaElement) {
        // Animação do elemento CTA com ScrollTrigger
        gsap.fromTo(
          ctaElement,
          { 
            y: 50, 
            opacity: 0 
          },
          { 
            y: 0, 
            opacity: 1, 
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "top 40%",
              scrub: 1,
            }
          }
        );
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria a lógica de envio do formulário
    console.log("Formulário enviado");
    // Reset do formulário após envio
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  return (
    <section 
      id="contato" 
      ref={sectionRef}
      className="py-24 relative bg-gradient-to-b from-blue to-blue-dark text-white overflow-hidden"
    >
      {/* Elementos decorativos */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-light/10 rounded-full blur-3xl" />
      <div className="absolute inset-0 pattern-dots opacity-10" />
      
      <div className="container-custom relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold mb-6"
            >
              Pronto para <span className="text-yellow">revolucionar</span> a manutenção do seu veículo?
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-white/80 text-lg max-w-2xl mx-auto mb-10"
            >
              Baixe agora o aplicativo Instauto e tenha acesso às melhores oficinas da sua região, preços transparentes e acompanhamento em tempo real.
            </motion.p>
            
            <div className="flex flex-col md:flex-row justify-center gap-4 mb-16">
              <motion.a 
                href="#download"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="btn-secondary flex items-center justify-center"
              >
                <Download className="mr-2 h-5 w-5" />
                Baixar Aplicativo
              </motion.a>
              
              <motion.a 
                href="#como-funciona"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="btn-outline border-white text-white hover:bg-white/10 flex items-center justify-center"
              >
                Saiba Mais
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.a>
            </div>
          </div>
          
          {/* Card de Contato */}
          <div 
            ref={ctaRef}
            className="bg-white rounded-2xl p-8 md:p-12 shadow-xl text-gray-800 relative z-10 border border-blue-light"
          >
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
              <div className="md:w-1/2">
                <h3 className="text-2xl md:text-3xl font-bold text-blue mb-4">
                  Fale conosco
                </h3>
                <p className="text-gray-600 mb-6">
                  Tem alguma dúvida ou sugestão? Nossa equipe está pronta para te ajudar!
                </p>
                
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome completo
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent transition-all"
                      placeholder="Seu nome"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent transition-all"
                      placeholder="seuemail@exemplo.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Mensagem
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent transition-all"
                      placeholder="Sua mensagem ou dúvida"
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="btn-primary w-full flex items-center justify-center group"
                  >
                    Enviar Mensagem
                    <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </div>
              
              <div className="hidden md:block md:w-1/2 relative">
                <div className="relative h-80 w-full">
                  <div className="absolute inset-0 bg-blue-light/50 rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 pattern-dots opacity-50" />
                  </div>
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <MessageCircle size={48} className="text-blue mb-4" />
                    <h4 className="text-xl font-bold text-blue mb-2">Atendimento Rápido</h4>
                    <p className="text-gray-600 mb-6">
                      Nossa equipe responderá sua mensagem em até 24 horas. Estamos aqui para ajudar!
                    </p>
                    
                    <div className="flex space-x-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className="text-yellow-dark">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      ))}
                    </div>
                    <p className="text-gray-600 mt-2">
                      4.9/5 - Mais de 10.000 avaliações
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Badges e avaliações */}
          <div className="flex flex-wrap justify-center gap-6 mt-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-5 py-2 border border-white/20"
            >
              <span className="text-yellow mr-2">★★★★★</span>
              <span className="text-white/80 text-sm">4.9 na App Store</span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-5 py-2 border border-white/20"
            >
              <span className="text-yellow mr-2">★★★★★</span>
              <span className="text-white/80 text-sm">4.8 no Google Play</span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-5 py-2 border border-white/20"
            >
              <span className="text-white/80 text-sm">+30.000 Serviços realizados</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
} 