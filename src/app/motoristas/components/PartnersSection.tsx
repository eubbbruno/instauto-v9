"use client";

import { Wrench, Star, Shield, Users } from "lucide-react";
import Image from "next/image";

export default function PartnersSection() {
  return (
    <section id="parceiros" className="py-20 relative overflow-hidden bg-[#F0F8FF]">
      {/* Efeitos de background sutis para fundo claro */}
      <div className="absolute top-0 right-0 w-1/3 h-2/3 bg-blue-100/40 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-blue-200/30 rounded-full blur-[150px]"></div>
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4A89DC_1px,transparent_1px)] bg-[length:20px_20px]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 px-4 py-1 rounded-full text-sm font-medium mb-6 shadow-sm text-blue-700">
            <Wrench className="w-4 h-4 text-blue-600" />
            <span>Rede confiável de oficinas</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 font-syne">
            Mais de 3.000 parceiros em todo o Brasil
          </h2>
          <p className="text-gray-700 text-lg font-jakarta">
            Nossa ampla rede de oficinas parceiras está pronta para atender você com qualidade e confiança.
            Todas são rigorosamente selecionadas e constantemente avaliadas.
          </p>
        </div>
      
        {/* Estatísticas de parceiros */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
          <div className="bg-white rounded-3xl p-8 border border-blue-100 shadow-sm relative overflow-hidden hover:shadow-md transition-all duration-300">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-5xl font-bold text-gray-800 mb-2 font-syne">3.600+</div>
              <div className="text-lg font-medium text-gray-700 mb-2 font-jakarta">Oficinas parceiras</div>
              <p className="text-gray-500 text-sm">Em todo o Brasil, prontas para atender você</p>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-8 border border-blue-100 shadow-sm relative overflow-hidden hover:shadow-md transition-all duration-300">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-5xl font-bold text-gray-800 mb-2 font-syne">98%</div>
              <div className="text-lg font-medium text-gray-700 mb-2 font-jakarta">Taxa de satisfação</div>
              <p className="text-gray-500 text-sm">Avaliações positivas dos nossos usuários</p>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-8 border border-blue-100 shadow-sm relative overflow-hidden hover:shadow-md transition-all duration-300">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-5xl font-bold text-gray-800 mb-2 font-syne">30+</div>
              <div className="text-lg font-medium text-gray-700 mb-2 font-jakarta">Tipos de serviços</div>
              <p className="text-gray-500 text-sm">Para todos os modelos de veículos</p>
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="mt-14 flex justify-center">
          <a 
            href="#" 
            className="bg-[#2563EB] group text-white font-medium rounded-lg px-8 py-3 inline-flex items-center gap-2 hover:bg-[#1D4ED8] transition-all shadow-lg hover:shadow-xl"
          >
            <Wrench className="w-5 h-5 text-white" />
            <span className="font-jakarta font-bold">Torne-se um parceiro</span>
          </a>
        </div>
      </div>
    </section>
  );
} 