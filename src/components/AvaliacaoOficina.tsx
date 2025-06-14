"use client";

import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

export type AvaliacaoProps = {
  avaliacao: number;
  totalAvaliacoes: number;
  avaliacoes?: AvaliacaoItem[];
  showSummary?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export type AvaliacaoItem = {
  id: number;
  nome: string;
  data: string;
  nota: number;
  comentario: string;
  veiculo?: string;
  servico?: string;
}

const AvaliacaoOficina = ({
  avaliacao,
  totalAvaliacoes,
  avaliacoes = [],
  showSummary = true,
  size = "md",
  className = ""
}: AvaliacaoProps) => {
  const [expanded, setExpanded] = useState(false);
  
  // Define tamanhos das estrelas com base no prop size
  const starSizes = {
    sm: "h-3 w-3",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };
  
  // Calcula a distribuição de avaliações por estrela
  const getDistribuicao = () => {
    const distribuicao = [
      { stars: 5, count: 0, percentage: 0 },
      { stars: 4, count: 0, percentage: 0 },
      { stars: 3, count: 0, percentage: 0 },
      { stars: 2, count: 0, percentage: 0 },
      { stars: 1, count: 0, percentage: 0 }
    ];
    
    if (avaliacoes.length === 0) {
      // Se não houver avaliações, criaremos uma distribuição fictícia baseada na média
      const total = totalAvaliacoes || 1;
      const media = Math.round(avaliacao);
      
      distribuicao.forEach(item => {
        if (item.stars === media) {
          item.count = Math.round(total * 0.6); // 60% na média
        } else if (item.stars === media + 1 || item.stars === media - 1) {
          item.count = Math.round(total * 0.2); // 20% na média +/- 1
        } else {
          item.count = Math.round(total * 0.1); // 10% nas demais
        }
        item.percentage = Math.round((item.count / total) * 100);
      });
    } else {
      // Se houver avaliações, calcular a distribuição real
      avaliacoes.forEach(item => {
        const index = distribuicao.findIndex(d => d.stars === item.nota);
        if (index !== -1) {
          distribuicao[index].count++;
        }
      });
      
      // Calcular percentuais
      distribuicao.forEach(item => {
        item.percentage = Math.round((item.count / avaliacoes.length) * 100);
      });
    }
    
    return distribuicao;
  };
  
  // Renderizar estrelas
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      index < rating ? (
        <StarIconSolid 
          key={index} 
          className={`${starSizes[size]} text-yellow-400`} 
        />
      ) : (
        <StarIcon 
          key={index} 
          className={`${starSizes[size]} text-gray-300`} 
        />
      )
    ));
  };
  
  // Formatar data
  const formatarData = (dataString: string) => {
    // Verifica se a data já está no formato esperado (DD/MM/YYYY)
    if (/^\d{2}\/\d{2}\/\d{4}/.test(dataString)) {
      return dataString;
    }
    
    try {
      const data = new Date(dataString);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(data);
    } catch {
      return dataString;
    }
  };
  
  const distribuicao = getDistribuicao();
  
  return (
    <div className={`${className}`}>
      {/* Cabeçalho com nota média */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-gray-800 mr-2">{avaliacao.toFixed(1)}</span>
          <div className="flex">{renderStars(Math.round(avaliacao))}</div>
        </div>
        <span className="text-sm text-gray-500">
          {totalAvaliacoes} {totalAvaliacoes === 1 ? 'avaliação' : 'avaliações'}
        </span>
      </div>
      
      {/* Resumo com barras de progresso */}
      {showSummary && (
        <div className="space-y-2 mb-4">
          {distribuicao.map((item) => (
            <div key={item.stars} className="flex items-center">
              <div className="flex items-center w-12">
                <span className="text-xs text-gray-600 mr-1">{item.stars}</span>
                <StarIconSolid className="h-3 w-3 text-yellow-400" />
              </div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-600 ml-2 w-8">{item.percentage}%</span>
            </div>
          ))}
        </div>
      )}
      
      {/* Lista de avaliações */}
      {avaliacoes.length > 0 && (
        <div className="space-y-3 mt-4">
          {(expanded ? avaliacoes : avaliacoes.slice(0, 3)).map((item) => (
            <div key={item.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex justify-between mb-1">
                <span className="font-medium text-gray-800">{item.nome}</span>
                <span className="text-xs text-gray-500">{formatarData(item.data)}</span>
              </div>
              <div className="flex items-center mb-2">
                {renderStars(item.nota)}
              </div>
              {item.servico && item.veiculo && (
                <div className="text-xs text-gray-600 mb-1">
                  {item.veiculo} • {item.servico}
                </div>
              )}
              <p className="text-sm text-gray-700">{item.comentario}</p>
            </div>
          ))}
          
          {avaliacoes.length > 3 && (
            <button 
              onClick={() => setExpanded(!expanded)}
              className="text-sm text-[#0047CC] hover:underline mt-2"
            >
              {expanded ? "Ver menos avaliações" : `Ver mais ${avaliacoes.length - 3} avaliações`}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AvaliacaoOficina; 