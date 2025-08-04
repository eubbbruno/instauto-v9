"use client";

import { 
  StarIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { useState } from "react";

export default function AvaliacoesPage() {
  const [filterStars, setFilterStars] = useState("todos");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Dados de exemplo para avaliações
  const avaliacoes = [
    {
      id: 1,
      cliente: "João Silva",
      veiculo: "Honda Civic 2020",
      servico: "Troca de óleo e filtros",
      estrelas: 5,
      comentario: "Excelente atendimento! O serviço foi realizado no prazo e o preço foi justo. Recomendo!",
      data: "22/05/2023 - 10:30",
      respondido: true
    },
    {
      id: 2,
      cliente: "Maria Oliveira",
      veiculo: "Toyota Corolla 2019",
      servico: "Alinhamento e balanceamento",
      estrelas: 4,
      comentario: "Bom serviço. Apenas um pouco de demora na entrega do veículo.",
      data: "20/05/2023 - 14:15",
      respondido: false
    },
    {
      id: 3,
      cliente: "Pedro Santos",
      veiculo: "Volkswagen Golf 2021",
      servico: "Reparo no sistema de freios",
      estrelas: 5,
      comentario: "Ótimo trabalho! Os freios estão funcionando perfeitamente. Equipe muito profissional.",
      data: "18/05/2023 - 09:45",
      respondido: true
    },
    {
      id: 4,
      cliente: "Ana Ferreira",
      veiculo: "Fiat Argo 2022",
      servico: "Revisão completa",
      estrelas: 3,
      comentario: "Serviço bem feito, mas achei o preço um pouco alto comparado a outras oficinas.",
      data: "15/05/2023 - 16:20",
      respondido: false
    }
  ];
  
  // Filtra avaliações por estrelas e busca
  const filteredAvaliacoes = avaliacoes
    .filter(avaliacao => {
      // Filtro por estrelas
      if (filterStars === "todos") return true;
      return avaliacao.estrelas === parseInt(filterStars);
    })
    .filter(avaliacao => {
      // Filtro por busca
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        avaliacao.cliente.toLowerCase().includes(query) ||
        avaliacao.veiculo.toLowerCase().includes(query) ||
        avaliacao.servico.toLowerCase().includes(query) ||
        avaliacao.comentario.toLowerCase().includes(query)
      );
    });
  
  // Componente para renderizar as estrelas
  const RenderStars = ({ count }: { count: number }) => {
    return (
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          i < count ? (
            <StarIconSolid key={i} className="h-4 w-4 text-yellow-400" />
          ) : (
            <StarIcon key={i} className="h-4 w-4 text-gray-300" />
          )
        ))}
      </div>
    );
  };
  
  // Animações
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <StarIcon className="h-6 w-6 mr-2 text-[#0047CC]" />
            Avaliações de Clientes
          </h1>
          <p className="text-gray-600 mt-1">
            Visualize o feedback dos seus clientes sobre os serviços realizados
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 bg-[#0047CC]/10 text-[#0047CC] px-3 py-1.5 rounded-lg text-sm font-medium inline-flex items-center">
          <SparklesIcon className="h-4 w-4 mr-1.5" />
          Versão Básica - Apenas Visualização
        </div>
      </div>
      
      {/* Filtros e Busca */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar avaliações por cliente, veículo ou comentário..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0047CC] focus:border-[#0047CC] text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-48">
            <div className="relative">
              <select
                value={filterStars}
                onChange={(e) => setFilterStars(e.target.value)}
                className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-lg focus:ring-[#0047CC] focus:border-[#0047CC] text-sm"
              >
                <option value="todos">Todas as estrelas</option>
                <option value="5">5 estrelas</option>
                <option value="4">4 estrelas</option>
                <option value="3">3 estrelas</option>
                <option value="2">2 estrelas</option>
                <option value="1">1 estrela</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDownIcon className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Resumo das Avaliações */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Resumo das Avaliações</h3>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Estatísticas */}
          <div className="flex-1">
            <div className="flex items-end space-x-2 mb-3">
              <span className="text-3xl font-bold text-gray-800">4.2</span>
              <span className="text-gray-500 text-sm pb-1">/ 5</span>
              <div className="ml-2 pb-1">
                <RenderStars count={4} />
              </div>
            </div>
            <p className="text-sm text-gray-600">Baseado em 4 avaliações</p>
            
            {/* Barras de Progresso */}
            <div className="mt-4 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = avaliacoes.filter(a => a.estrelas === star).length;
                const percentage = (count / avaliacoes.length) * 100;
                
                return (
                  <div key={star} className="flex items-center">
                    <div className="flex items-center w-12">
                      <span className="text-xs text-gray-600 mr-1">{star}</span>
                      <StarIconSolid className="h-3 w-3 text-yellow-400" />
                    </div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 ml-2 w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Mensagem de Upgrade */}
          <div className="flex-1 md:border-l md:border-gray-200 md:pl-6">
            <h4 className="font-medium text-gray-800 mb-2">Recursos do Plano Pro</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-center">
                <span className="bg-[#0047CC] rounded-full h-1.5 w-1.5 mr-2"></span>
                Responda a avaliações diretamente
              </li>
              <li className="flex items-center">
                <span className="bg-[#0047CC] rounded-full h-1.5 w-1.5 mr-2"></span>
                Solicite avaliações por WhatsApp/e-mail
              </li>
              <li className="flex items-center">
                <span className="bg-[#0047CC] rounded-full h-1.5 w-1.5 mr-2"></span>
                Métricas detalhadas e relatórios
              </li>
              <li className="flex items-center">
                <span className="bg-[#0047CC] rounded-full h-1.5 w-1.5 mr-2"></span>
                Integração com Google/Facebook Reviews
              </li>
            </ul>
            <button className="mt-4 bg-[#0047CC] hover:bg-[#0055EB] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center">
              <SparklesIcon className="h-4 w-4 mr-2" />
              Fazer Upgrade
            </button>
          </div>
        </div>
      </div>
      
      {/* Lista de Avaliações */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {filteredAvaliacoes.length > 0 ? (
          filteredAvaliacoes.map((avaliacao) => (
            <motion.div
              key={avaliacao.id}
              variants={fadeInUp}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-5">
                <div className="flex flex-col md:flex-row justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <h3 className="text-lg font-semibold text-gray-800 mr-3">{avaliacao.cliente}</h3>
                        <RenderStars count={avaliacao.estrelas} />
                      </div>
                      <div className="text-xs text-gray-500 md:hidden">{avaliacao.data}</div>
                    </div>
                    <div className="text-sm text-gray-600">{avaliacao.veiculo} • {avaliacao.servico}</div>
                    <div className="mt-3 text-sm text-gray-700">{avaliacao.comentario}</div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 md:text-right flex flex-col justify-between md:min-w-[150px]">
                    <div className="text-xs text-gray-500 hidden md:block">{avaliacao.data}</div>
                    
                    <div className="mt-2 md:mt-auto">
                      {avaliacao.respondido ? (
                        <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-md inline-flex items-center">
                          <span className="bg-green-800 rounded-full h-1.5 w-1.5 mr-1.5"></span>
                          Respondido
                        </div>
                      ) : (
                        <button className="text-sm px-3 py-1.5 bg-gray-100 text-gray-500 rounded-md inline-flex items-center opacity-50 cursor-not-allowed" disabled>
                          <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1.5" />
                          Responder
                          <span className="ml-1.5 text-[10px] text-white bg-[#0047CC] rounded-sm px-1">Pro</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="inline-block p-3 bg-gray-100 rounded-full mb-4">
              <StarIcon className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">Nenhuma avaliação encontrada</h3>
            <p className="text-gray-500">
              Tente ajustar seus filtros ou aguarde novas avaliações dos clientes.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
} 