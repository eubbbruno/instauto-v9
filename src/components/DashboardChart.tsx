"use client";

import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

type ChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color: string;
  }[];
};

type DashboardChartProps = {
  title: string;
  subtitle?: string;
  data: ChartData;
  type?: 'bar' | 'line';
  period?: 'day' | 'week' | 'month' | 'year';
  comparison?: {
    value: number;
    label: string;
    trend: 'up' | 'down' | 'neutral';
  };
};

export default function DashboardChart({
  title,
  subtitle,
  data,
  type = 'bar',
  period = 'month',
  comparison
}: DashboardChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'year'>(period);
  
  // Encontrar o valor máximo no conjunto de dados
  const maxValue = Math.max(...data.datasets.flatMap(dataset => dataset.data));
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Cabeçalho do gráfico */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h3 className="font-bold text-gray-800 flex items-center">{title}</h3>
            {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          
          {/* Seletor de período */}
          <div className="mt-3 md:mt-0 flex bg-gray-100 rounded-lg p-1">
            <button 
              onClick={() => setSelectedPeriod('day')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                selectedPeriod === 'day' 
                  ? 'bg-[#0047CC] text-white' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Dia
            </button>
            <button 
              onClick={() => setSelectedPeriod('week')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                selectedPeriod === 'week' 
                  ? 'bg-[#0047CC] text-white' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Semana
            </button>
            <button 
              onClick={() => setSelectedPeriod('month')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                selectedPeriod === 'month' 
                  ? 'bg-[#0047CC] text-white' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Mês
            </button>
            <button 
              onClick={() => setSelectedPeriod('year')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                selectedPeriod === 'year' 
                  ? 'bg-[#0047CC] text-white' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Ano
            </button>
          </div>
        </div>
        
        {/* Comparação (se houver) */}
        {comparison && (
          <div className="mt-3 flex items-center">
            <div className={`text-sm font-medium ${
              comparison.trend === 'up' ? 'text-green-600' : 
              comparison.trend === 'down' ? 'text-red-600' : 
              'text-gray-600'
            } flex items-center`}>
              {comparison.trend === 'up' && <ArrowUpIcon className="h-3 w-3 mr-1" />}
              {comparison.trend === 'down' && <ArrowDownIcon className="h-3 w-3 mr-1" />}
              <span>{comparison.value}%</span>
            </div>
            <span className="text-xs text-gray-500 ml-2">{comparison.label}</span>
          </div>
        )}
      </div>
      
      {/* Área do Gráfico */}
      <div className="px-4 pt-4 pb-6">
        {type === 'bar' ? (
          <div className="h-64 flex items-end space-x-1">
            {data.labels.map((label, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-full relative flex justify-center">
                  {data.datasets.map((dataset, datasetIndex) => {
                    const value = dataset.data[i];
                    const height = (value / maxValue) * 100;
                    
                    return (
                      <div 
                        key={datasetIndex}
                        className="relative group flex flex-col items-center"
                        style={{
                          width: datasetIndex === 0 ? '80%' : '60%',
                          zIndex: 10 - datasetIndex
                        }}
                      >
                        <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded py-1 px-2 pointer-events-none">
                          {value.toLocaleString('pt-BR', { 
                            style: 'currency', 
                            currency: 'BRL'
                          })}
                        </div>
                        <div 
                          className={`rounded-t-md w-full transition-all duration-500`}
                          style={{
                            height: `${height}%`,
                            backgroundColor: dataset.color,
                            minHeight: value > 0 ? '4px' : '0'
                          }}
                        ></div>
                      </div>
                    );
                  })}
                </div>
                <div className="text-xs text-gray-500 mt-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-[60px] text-center">
                  {label}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Visualização do gráfico de linha (simplificado)
          <div className="h-64 flex items-end relative">
            <div className="absolute inset-0 flex flex-col justify-between py-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border-b border-gray-100 w-full h-0"></div>
              ))}
            </div>
            
            <div className="relative w-full z-10 pt-4">
              {data.datasets.map((dataset, datasetIndex) => {
                // Criar os pontos para a linha do gráfico
                const points = dataset.data.map((value, i) => {
                  const x = (i / (data.labels.length - 1)) * 100;
                  const y = 100 - (value / maxValue) * 100;
                  return `${x}%,${y}%`;
                }).join(' ');
                
                return (
                  <div key={datasetIndex} className="absolute inset-0">
                    <svg className="w-full h-full">
                      <polyline
                        points={points}
                        fill="none"
                        stroke={dataset.color}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {dataset.data.map((value, i) => {
                        const x = (i / (data.labels.length - 1)) * 100;
                        const y = 100 - (value / maxValue) * 100;
                        return (
                          <g key={i} className="group">
                            <circle
                              cx={`${x}%`}
                              cy={`${y}%`}
                              r="4"
                              fill="white"
                              stroke={dataset.color}
                              strokeWidth="2"
                            />
                            <foreignObject
                              x={`${x}%`}
                              y={`${y}%`}
                              width="1"
                              height="1"
                              className="pointer-events-none"
                              style={{ overflow: 'visible' }}
                            >
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                {value.toLocaleString('pt-BR', { 
                                  style: 'currency', 
                                  currency: 'BRL'
                                })}
                              </div>
                            </foreignObject>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                );
              })}
              
              {/* Rótulos do eixo X */}
              <div className="flex justify-between mt-4">
                {data.labels.map((label, i) => (
                  <div key={i} className="text-xs text-gray-500 text-center">
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Legenda */}
      <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex flex-wrap justify-center gap-4">
        {data.datasets.map((dataset, i) => (
          <div key={i} className="flex items-center">
            <div className="h-3 w-3 rounded-sm mr-2" style={{ backgroundColor: dataset.color }}></div>
            <span className="text-xs text-gray-600">{dataset.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 