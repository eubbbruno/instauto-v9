"use client";

import { Laptop, Globe, CheckCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function PlatformAccessSection() {
  const platformFeatures = [
    "Design responsivo para todos os dispositivos",
    "Acesso rápido através do navegador",
    "Pagamento integrado e seguro",
    "Histórico completo de serviços",
    "Chat direto com as oficinas",
    "Agendamento simplificado",
  ];

  return (
    <section id="plataforma" className="py-20 relative overflow-hidden bg-[#FFFBEA]">
      {/* Efeitos de background sutis */}
      <div className="absolute top-0 right-0 w-1/3 h-2/3 bg-yellow-100/40 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-blue-200/30 rounded-full blur-[150px]"></div>
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E5AB00_1px,transparent_1px)] bg-[length:20px_20px]"></div>
      
      <div className="container-custom relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 px-4 py-1 rounded-full text-sm font-medium mb-6 shadow-sm text-blue-700">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>Plataforma 100% Web</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 font-syne">
              Acesse o Instauto de qualquer lugar
            </h2>
            
            <p className="text-gray-700 text-lg font-jakarta mb-8">
              Use nossa plataforma web otimizada para todos os dispositivos. Encontre oficinas, agende serviços e acompanhe tudo em tempo real, diretamente do seu navegador.
            </p>
            
            <ul className="space-y-4 mb-10">
              {platformFeatures.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                  <span className="font-jakarta">{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="#" 
                className="bg-[#2563EB] text-white font-medium rounded-lg px-8 py-3 inline-flex items-center gap-2 hover:bg-[#1D4ED8] transition-all shadow-lg hover:shadow-xl"
              >
                <Laptop className="h-5 w-5" />
                <span className="font-jakarta font-bold">Acessar Plataforma</span>
              </Link>
              
              <Link 
                href="#" 
                className="bg-blue-50 text-blue-700 border border-blue-200 font-medium rounded-lg px-8 py-3 inline-flex items-center gap-2 hover:bg-blue-100 transition-all shadow-md hover:shadow-lg"
              >
                <ExternalLink className="h-5 w-5" />
                <span className="font-jakarta font-bold">Conhecer Recursos</span>
              </Link>
            </div>
          </div>
          
          <div className="relative hidden md:block">
            {/* Dispositivo mockup simplificado */}
            <div className="relative w-full max-w-[500px] mx-auto">
              {/* Efeito de sombra/brilho */}
              <div className="absolute -inset-4 bg-yellow-400/20 rounded-full blur-3xl"></div>
              
              {/* Dispositivo */}
              <div className="relative bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
                {/* Barra de navegador */}
                <div className="h-10 bg-gray-100 border-b border-gray-200 flex items-center px-4">
                  <div className="flex space-x-1.5 mr-4">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1 bg-white h-6 rounded-full border border-gray-200"></div>
                </div>
                
                {/* Conteúdo da plataforma */}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-xl font-bold text-blue-700">Instauto</div>
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-xl p-4 col-span-2 border border-gray-200">
                      <div className="text-sm mb-2 font-medium text-gray-600">Localizar Oficinas</div>
                      <div className="w-full bg-white h-10 rounded-md border border-gray-200"></div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="text-sm mb-2 font-medium text-gray-600">Filtros</div>
                      <div className="w-full bg-white h-10 rounded-md border border-gray-200"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {[1, 2].map((item) => (
                      <div key={item} className="bg-white rounded-xl p-4 border border-gray-200 flex">
                        <div className="w-14 h-14 bg-blue-100 rounded-lg mr-4 flex items-center justify-center flex-shrink-0">
                          <Laptop className="text-blue-600 w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="w-full h-4 bg-gray-100 rounded-md mb-2"></div>
                          <div className="w-3/4 h-3 bg-gray-100 rounded-md mb-2"></div>
                          <div className="w-1/2 h-3 bg-gray-100 rounded-md"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 