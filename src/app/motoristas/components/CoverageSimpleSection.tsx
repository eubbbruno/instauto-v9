"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, ChevronRight, Map } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CoverageSimpleSection() {
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    // Registra o plugin ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    if (sectionRef.current) {
      const ctx = gsap.context(() => {
        // Animação para a seção
        gsap.fromTo(
          ".map-title",
          { opacity: 0, y: -50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none none"
            }
          }
        );
        
        // Animação para o mapa
        gsap.fromTo(
          ".brazil-map-image",
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".brazil-map-image",
              start: "top 90%",
              toggleActions: "play none none none"
            }
          }
        );
      });
      
      return () => ctx.revert();
    }
  }, []);
  
  return (
    <section 
      id="cobertura" 
      ref={sectionRef}
      className="py-24 relative overflow-hidden bg-gradient-to-b from-[#031024] to-[#051630] text-white"
    >
      {/* Efeito de luzes e particles */}
      <div className="absolute top-0 right-0 w-1/3 h-2/3 bg-blue-500/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-[#1a7cc2]/10 rounded-full blur-[150px]"></div>
      
      {/* Padrão de pontos */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[length:20px_20px]"></div>
      
      <div className="container-custom mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 map-title">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0a4d8c] to-[#0e6ac4] px-4 py-1 rounded-full text-sm font-medium mb-6 shadow-lg shadow-blue-500/20">
            <MapPin className="w-4 h-4" />
            <span>Cobertura Nacional</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-[#91c3fd] text-transparent bg-clip-text">
            Presentes em todo o Brasil
          </h2>
          <p className="text-gray-300 text-lg">
            Nossa rede de oficinas parceiras está presente nos principais estados brasileiros, 
            com expansão contínua para oferecer a melhor cobertura para você.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
          {/* Imagem do Mapa do Brasil */}
          <div className="relative brazil-map-image order-2 md:order-1">
            <div className="relative w-full max-w-lg mx-auto aspect-square bg-gradient-to-br from-blue-900/20 to-blue-700/10 rounded-3xl p-6 border border-blue-500/20 shadow-2xl">
              {/* Efeito de brilho */}
              <div className="absolute inset-0 bg-blue-500/5 rounded-3xl filter blur-md"></div>
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-400/10 rounded-full blur-xl"></div>
              
              {/* Imagem do mapa */}
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-4/5 h-4/5 relative">
                  <Image 
                    src="/images/brazil-map.png" 
                    alt="Mapa do Brasil com cobertura Instauto" 
                    width={500} 
                    height={500}
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                  
                  {/* Pontos originais do mapa */}
                  <div className="absolute top-[20%] right-[35%] w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="absolute top-[40%] right-[30%] w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="absolute top-[50%] right-[40%] w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-[25%] right-[45%] w-5 h-5 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-[15%] right-[35%] w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                  
                  {/* Novos pontos - Região Sul e Sudeste (mais para baixo no mapa) */}
                  {/* São Paulo */}
                  <div className="absolute bottom-[33%] right-[34%] w-5 h-5 bg-green-400 rounded-full animate-pulse shadow-md shadow-green-500/50 z-20"></div>
                  
                  {/* Rio de Janeiro */}
                  <div className="absolute bottom-[30%] right-[29%] w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-md shadow-green-500/50 z-20"></div>
                  
                  {/* Minas Gerais */}
                  <div className="absolute bottom-[40%] right-[30%] w-5 h-5 bg-green-400 rounded-full animate-pulse shadow-md shadow-green-500/50 z-20"></div>
                  
                  {/* Espírito Santo */}
                  <div className="absolute bottom-[35%] right-[26%] w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-md shadow-green-500/50 z-20"></div>
                  
                  {/* Paraná */}
                  <div className="absolute bottom-[25%] right-[35%] w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-md shadow-green-500/50 z-20"></div>
                  
                  {/* Santa Catarina */}
                  <div className="absolute bottom-[20%] right-[33%] w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-md shadow-green-500/50 z-20"></div>
                  
                  {/* Rio Grande do Sul */}
                  <div className="absolute bottom-[12%] right-[30%] w-5 h-5 bg-green-400 rounded-full animate-pulse shadow-md shadow-green-500/50 z-20"></div>
                  
                  {/* Mato Grosso do Sul */}
                  <div className="absolute bottom-[37%] right-[40%] w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-md shadow-green-500/50 z-20"></div>
                  
                  {/* Goiás */}
                  <div className="absolute bottom-[45%] right-[35%] w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-md shadow-green-500/50 z-20"></div>
                  
                  {/* Distrito Federal */}
                  <div className="absolute bottom-[47%] right-[33%] w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-md shadow-green-500/50 z-20"></div>
                  
                  {/* Mato Grosso */}
                  <div className="absolute bottom-[55%] right-[40%] w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-md shadow-green-500/50 z-20"></div>
                </div>
              </div>
            </div>
            
            {/* Legenda simples */}
            <div className="mt-6 bg-blue-900/20 rounded-xl p-4 border border-blue-500/10 backdrop-blur-sm max-w-lg mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span className="text-xs text-green-100">Regiões com cobertura ativa</span>
                </div>
                <p className="text-sm text-blue-300 font-medium">27 estados</p>
              </div>
            </div>
          </div>
          
          {/* Estatísticas */}
          <div className="order-1 md:order-2">
            <div className="bg-gradient-to-br from-blue-900/10 to-blue-800/5 backdrop-blur-md rounded-3xl p-8 border border-blue-500/10 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-3xl"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">Cobertura Nacional</h3>
                
                <div className="space-y-4">
                  <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/10">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-blue-300">Oficinas Parceiras</p>
                        <p className="text-2xl font-bold text-white">3.600+</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-800/40 rounded-full flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-blue-300" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/10">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-blue-300">Cidades Atendidas</p>
                        <p className="text-2xl font-bold text-white">600+</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-800/40 rounded-full flex items-center justify-center">
                        <Map className="w-6 h-6 text-blue-300" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/10 text-center">
                      <p className="text-sm text-green-300 mb-1">Estados Ativos</p>
                      <p className="text-xl font-bold text-green-100">14</p>
                    </div>
                    
                    <div className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-500/10 text-center">
                      <p className="text-sm text-yellow-300 mb-1">Em Expansão</p>
                      <p className="text-xl font-bold text-yellow-100">13</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <p className="text-gray-300 text-sm mb-4">
                    O Instauto continua expandindo sua cobertura para atender mais motoristas em todo o Brasil.
                    Consulte a disponibilidade em sua região.
                  </p>
                  
                  <Link 
                    href="/cobertura" 
                    className="btn-primary w-full flex items-center justify-center"
                  >
                    <span>Ver cobertura detalhada</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="mt-24 text-center">
          <div 
            className="max-w-4xl mx-auto bg-gradient-to-r from-[#073366] to-[#0c5da9] rounded-2xl p-10 shadow-2xl shadow-blue-900/30 border border-blue-400/20 relative overflow-hidden"
          >
            {/* Efeitos decorativos */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute top-0 left-0 w-full h-full dot-pattern opacity-5"></div>
            
            {/* Círculos decorativos */}
            <div className="absolute top-8 right-8 w-20 h-20 border border-blue-400/20 rounded-full"></div>
            <div className="absolute bottom-8 left-8 w-12 h-12 border border-blue-400/20 rounded-full"></div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600/30 to-blue-500/20 rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl">
                <MapPin className="w-8 h-8 text-blue-100" />
              </div>
              
              <h3 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                Acesse a plataforma Instauto
              </h3>
              <p className="text-blue-100 mb-8 max-w-md mx-auto">
                Nossa plataforma web já está disponível para motoristas e oficinas em todo o Brasil. Faça seu cadastro e comece a usar hoje mesmo.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/auth/motorista" className="btn-secondary flex items-center">
                  Cadastre-se agora
                </a>
                <Link 
                  href="/cobertura" 
                  className="btn-white flex items-center"
                >
                  <span>Ver mapa detalhado</span>
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 