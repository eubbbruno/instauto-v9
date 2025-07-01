"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Car, MessageCircle, Send } from "lucide-react";
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
      className="py-24 relative bg-gradient-to-b from-[#0047CC] to-[#003CAD] text-white overflow-hidden"
    >
      {/* Elementos decorativos */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFDE59]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0047CC]/10 rounded-full blur-3xl" />
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
              Pronto para <span className="text-[#FFDE59]">revolucionar</span> a manutenção do seu veículo?
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-white/80 text-lg max-w-2xl mx-auto mb-10"
            >
              Cadastre-se agora no Instauto e adicione seus veículos na "Garagem" do site. Tenha acesso às melhores oficinas da sua região, preços transparentes e acompanhamento em tempo real.
            </motion.p>
            
            <div className="flex flex-col md:flex-row justify-center gap-4 mb-16">
              <motion.a 
                href="/motorista"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-[#FFDE59] hover:bg-[#E6C850] text-[#0047CC] px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center"
              >
                <Car className="mr-2 h-5 w-5" />
                Cadastrar Veículos
              </motion.a>
              
              <motion.a 
                href="#como-funciona"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="border border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center"
              >
                Saiba Mais
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.a>
            </div>
          </div>
          
          {/* Card de Contato */}
          <div 
            ref={ctaRef}
            className="bg-white rounded-2xl p-8 md:p-12 shadow-xl text-gray-800 relative z-10 border border-[#0047CC]/20"
          >
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
              <div className="md:w-1/2">
                <h3 className="text-2xl md:text-3xl font-bold text-[#0047CC] mb-4">
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
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent transition-all"
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
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent transition-all"
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
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent transition-all"
                      placeholder="Sua mensagem ou dúvida"
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="bg-[#0047CC] hover:bg-[#003CAD] text-white px-6 py-3 rounded-lg font-medium transition-all w-full flex items-center justify-center group"
                  >
                    Enviar Mensagem
                    <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </div>
              
              <div className="hidden md:block md:w-1/2 relative">
                <div className="relative h-80 w-full">
                  <div className="absolute inset-0 bg-[#0047CC]/10 rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 pattern-dots opacity-50" />
                  </div>
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <MessageCircle size={48} className="text-[#0047CC] mb-4" />
                    <h4 className="text-xl font-bold text-[#0047CC] mb-2">Atendimento Rápido</h4>
                    <p className="text-gray-600 mb-6">
                      Nossa equipe responderá sua mensagem em até 24 horas. Estamos aqui para ajudar!
                    </p>
                    
                    <div className="flex space-x-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className="text-[#FFDE59]">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Badges e estatísticas */}
          <div className="flex flex-wrap justify-center gap-6 mt-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-5 py-2 border border-white/20"
            >
              <span className="text-white/80 text-sm">+30.000 Serviços realizados</span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-5 py-2 border border-white/20"
            >
              <span className="text-white/80 text-sm">+3.600 Oficinas parceiras</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
} 