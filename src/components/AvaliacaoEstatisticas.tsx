"use client";

import { StarIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

interface AvaliacaoEstatisticasProps {
  avaliacaoGeral: number;
  totalAvaliacoes: number;
  distribuicao?: {
    estrela5: number;
    estrela4: number;
    estrela3: number;
    estrela2: number;
    estrela1: number;
  };
  categorias?: {
    nome: string;
    avaliacao: number;
  }[];
  className?: string;
}

const AvaliacaoEstatisticas = ({
  avaliacaoGeral,
  totalAvaliacoes,
  distribuicao = {
    estrela5: 0,
    estrela4: 0,
    estrela3: 0,
    estrela2: 0,
    estrela1: 0
  },
  categorias = [],
  className = ''
}: AvaliacaoEstatisticasProps) => {
  const [mostrarMais, setMostrarMais] = useState(false);
  
  // Calcular percentuais para distribuição de estrelas
  const calcularPercentual = (valor: number): number => {
    if (totalAvaliacoes === 0) return 0;
    return Math.round((valor / totalAvaliacoes) * 100);
  };
  
  // Criar array com distribuição formatada
  const distribuicaoArray = [
    { estrelas: 5, quantidade: distribuicao.estrela5, percentual: calcularPercentual(distribuicao.estrela5) },
    { estrelas: 4, quantidade: distribuicao.estrela4, percentual: calcularPercentual(distribuicao.estrela4) },
    { estrelas: 3, quantidade: distribuicao.estrela3, percentual: calcularPercentual(distribuicao.estrela3) },
    { estrelas: 2, quantidade: distribuicao.estrela2, percentual: calcularPercentual(distribuicao.estrela2) },
    { estrelas: 1, quantidade: distribuicao.estrela1, percentual: calcularPercentual(distribuicao.estrela1) }
  ];

  return (
    <div className={`bg-white rounded-lg p-5 ${className}`}>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Avaliação geral */}
        <div className="flex flex-col items-center justify-center md:w-1/4">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{avaliacaoGeral.toFixed(1)}</h3>
          <div className="flex mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`h-5 w-5 ${
                  star <= Math.round(avaliacaoGeral)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500">{totalAvaliacoes} avaliações</p>
        </div>
        
        {/* Distribuição das avaliações */}
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Distribuição das avaliações</h4>
          <div className="space-y-2">
            {distribuicaoArray.map((item) => (
              <div key={item.estrelas} className="flex items-center">
                <div className="w-16 flex items-center">
                  <span className="text-sm font-medium text-gray-600 mr-1">{item.estrelas}</span>
                  <StarIcon className="h-4 w-4 text-yellow-400" />
                </div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${item.percentual}%` }}
                  ></div>
                </div>
                <div className="w-16 text-right">
                  <span className="text-xs text-gray-500">{item.percentual}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Avaliação por categoria */}
      {categorias.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-medium text-gray-700">Avaliação por categoria</h4>
            {categorias.length > 3 && (
              <button
                onClick={() => setMostrarMais(!mostrarMais)}
                className="text-xs text-[#0047CC] hover:underline"
              >
                {mostrarMais ? 'Mostrar menos' : 'Mostrar mais'}
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {categorias
              .slice(0, mostrarMais ? categorias.length : 4)
              .map((categoria, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{categoria.nome}</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">{categoria.avaliacao.toFixed(1)}</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`h-4 w-4 ${
                            star <= Math.round(categoria.avaliacao)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AvaliacaoEstatisticas; 