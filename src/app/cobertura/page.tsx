"use client";

import { useState } from "react";
import BrazilMapComponent from "@/components/BrazilMap";
import MapStatistics from "@/components/MapStatistics";
import { ChevronRight, Map, MapPin, Search, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CoverturePage() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  const regionCoverage = [
    { name: 'Norte', totalStates: 7, activeCoverage: 15 },
    { name: 'Nordeste', totalStates: 9, activeCoverage: 55 },
    { name: 'Centro-Oeste', totalStates: 4, activeCoverage: 50 },
    { name: 'Sudeste', totalStates: 4, activeCoverage: 100 },
    { name: 'Sul', totalStates: 3, activeCoverage: 100 }
  ];
  
  // Calcular o número total de oficinas em estados ativos
  const totalOfficinas = 3600;
  const totalCities = 600;
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#031024] to-[#051630] text-white">
      {/* Navegação e Cabeçalho */}
      <div className="container-custom py-6">
        <Link href="/" className="inline-flex items-center text-blue-300 hover:text-blue-100 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span>Voltar para a Home</span>
        </Link>
        
        <div className="text-center max-w-2xl mx-auto my-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0a4d8c] to-[#0e6ac4] px-4 py-1 rounded-full text-sm font-medium mb-6 shadow-lg shadow-blue-500/20">
            <MapPin className="w-4 h-4" />
            <span>Cobertura Nacional</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-[#91c3fd] text-transparent bg-clip-text">
            Mapa de Cobertura Detalhado
          </h1>
          <p className="text-gray-300 text-lg mb-6">
            Explore nossa rede de oficinas parceiras em todo Brasil e 
            descubra as localidades atendidas pelo Instauto.
          </p>
          
          {/* Barra de pesquisa */}
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-blue-300" />
            </div>
            <input
              type="text"
              className="bg-blue-900/20 border border-blue-500/30 text-white placeholder-blue-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 backdrop-blur-md"
              placeholder="Pesquisar por estado ou cidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* Mapa e Estatísticas */}
      <div className="container-custom relative mb-20 z-10">
        {/* Efeito de luzes e particles */}
        <div className="absolute top-0 right-0 w-1/3 h-2/3 bg-blue-500/10 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-[#1a7cc2]/10 rounded-full blur-[150px] -z-10"></div>
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[length:20px_20px] -z-10"></div>
        
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Mapa Maior */}
          <div className="lg:col-span-3">
            <div className="relative w-full aspect-square lg:aspect-[4/3] bg-gradient-to-br from-blue-900/20 to-blue-700/10 rounded-3xl p-6 border border-blue-500/20 shadow-2xl">
              {/* Efeito de brilho */}
              <div className="absolute inset-0 bg-blue-500/5 rounded-3xl filter blur-md"></div>
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-400/10 rounded-full blur-xl"></div>
              
              {/* Componente BrazilMapComponent */}
              <BrazilMapComponent 
                className="w-full h-full" 
                onRegionClick={setSelectedRegion}
                selectedRegion={selectedRegion}
                showStateDetails={true}
              />
            </div>
            
            {/* Legenda */}
            <div className="mt-6 bg-blue-900/20 rounded-xl p-4 border border-blue-500/10 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-medium text-blue-100">Status de Cobertura</h4>
                <span className="text-xs text-blue-300">Atualizado em: Julho 2023</span>
              </div>
              <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span className="text-xs text-green-100">Ativo</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span className="text-xs text-yellow-100">Em breve</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gray-500"></span>
                  <span className="text-xs text-gray-300">Planejado</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  <span className="text-xs text-blue-100">Norte</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                  <span className="text-xs text-orange-100">Nordeste</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="text-xs text-red-100">Sudeste</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Estatísticas e Informações */}
          <div className="lg:col-span-2">
            <MapStatistics 
              totalOfficinas={totalOfficinas}
              totalCities={totalCities}
              stateStatusCounts={{ active: 14, coming: 8, planned: 5 }}
              regionCoverage={regionCoverage}
            />
            
            {/* Projeção de Crescimento */}
            <div className="mt-6 bg-gradient-to-br from-blue-900/10 to-blue-800/5 backdrop-blur-md rounded-3xl p-6 border border-blue-500/10 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-3xl"></div>
              
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                  Previsão de Expansão
                </h3>
                <p className="text-blue-100 text-sm mb-4">
                  Nosso plano de crescimento para os próximos 12 meses
                </p>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-blue-300">Dezembro 2023</span>
                      <span className="text-xs font-medium text-blue-200">5000+ oficinas</span>
                    </div>
                    <div className="w-full h-2 bg-blue-900/30 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 w-[70%]"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-blue-300">Junho 2024</span>
                      <span className="text-xs font-medium text-blue-200">7500+ oficinas</span>
                    </div>
                    <div className="w-full h-2 bg-blue-900/30 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 w-[50%]"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-blue-300">Dezembro 2024</span>
                      <span className="text-xs font-medium text-blue-200">10000+ oficinas</span>
                    </div>
                    <div className="w-full h-2 bg-blue-900/30 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 w-[30%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* CTA */}
            <div className="mt-6 bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-6 border border-blue-600/20 shadow-lg">
              <div className="flex gap-4 items-center">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-lg shadow-lg">
                  <Map className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-blue-100">Quer ver oficinas perto de você?</h3>
                  <p className="text-xs text-blue-300">Acesse a plataforma e encontre serviços próximos</p>
                </div>
              </div>
              <Link 
                href="/login" 
                className="mt-4 w-full flex items-center justify-center gap-2 bg-white text-blue-700 font-medium rounded-lg py-3 hover:bg-blue-50 transition-colors"
              >
                <span>Acessar Plataforma</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQ */}
      <div className="container-custom py-12 mb-20">
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-white to-[#91c3fd] text-transparent bg-clip-text">
          Perguntas Frequentes
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-blue-900/20 border border-blue-500/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2 text-blue-100">Como posso encontrar oficinas na minha cidade?</h3>
            <p className="text-sm text-blue-300">
              Você pode acessar nossa plataforma, cadastrar-se e buscar por oficinas próximas a você. 
              Basta informar sua localização ou utilizar o filtro de cidades disponíveis.
            </p>
          </div>
          
          <div className="bg-blue-900/20 border border-blue-500/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2 text-blue-100">Minha cidade não tem cobertura, e agora?</h3>
            <p className="text-sm text-blue-300">
              Estamos em constante expansão. Se sua cidade ainda não tem cobertura, você pode nos 
              informar através do formulário de contato e priorizaremos sua região.
            </p>
          </div>
          
          <div className="bg-blue-900/20 border border-blue-500/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2 text-blue-100">Sou proprietário de uma oficina, como fazer parte?</h3>
            <p className="text-sm text-blue-300">
              Proprietários de oficinas podem se cadastrar na plataforma através da área específica 
              para parceiros. Após a verificação dos dados, sua oficina estará disponível no mapa.
            </p>
          </div>
          
          <div className="bg-blue-900/20 border border-blue-500/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2 text-blue-100">Com que frequência o mapa é atualizado?</h3>
            <p className="text-sm text-blue-300">
              Nosso mapa de cobertura é atualizado mensalmente, à medida que novas oficinas 
              parceiras são adicionadas à rede e novas regiões são atendidas.
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-blue-950 text-gray-400 py-12">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-white mb-2">Instauto</h2>
              <p className="text-sm">Conectando motoristas a oficinas desde 2022</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <Link href="/" className="text-blue-300 hover:text-white transition-colors">Home</Link>
              <Link href="/sobre" className="text-blue-300 hover:text-white transition-colors">Sobre</Link>
              <Link href="/contato" className="text-blue-300 hover:text-white transition-colors">Contato</Link>
              <Link href="/cobertura" className="text-white font-bold">Cobertura</Link>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-blue-900/50 text-center text-sm">
            <p>&copy; 2023 Instauto. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  );
} 