"use client";

import { useState } from 'react';
import {
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface ChartDataPoint {
  name: string;
  value: number;
}

interface DashboardChartProps {
  title: string;
  data: ChartDataPoint[];
  type?: 'bar' | 'line';
  color?: string;
  showPeriodSelector?: boolean;
  showComparison?: boolean;
  comparisonText?: string;
  comparisonValue?: number;
  height?: string;
}

export default function DashboardChart({
  title,
  data,
  type = 'bar',
  color = '#0047CC',
  showPeriodSelector = false,
  showComparison = false,
  comparisonText = '',
  comparisonValue = 0,
  height = 'h-80'
}: DashboardChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('mes');

  const periods = [
    { value: 'dia', label: 'Dia' },
    { value: 'semana', label: 'Semana' },
    { value: 'mes', label: 'Mês' },
    { value: 'ano', label: 'Ano' }
  ];

  // Encontrar o valor máximo para normalizar os dados
  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));

  // Função para renderizar gráfico de barras
  const renderBarChart = () => (
    <div className="flex items-end justify-between h-full space-x-2 px-4">
      {data.map((item, index) => (
        <motion.div
          key={item.name}
          initial={{ height: 0 }}
          animate={{ height: `${(item.value / maxValue) * 100}%` }}
          transition={{ duration: 0.8, delay: index * 0.1 }}
          className="flex flex-col items-center flex-1 group"
        >
          <div
            className="w-full rounded-t-lg transition-all duration-300 group-hover:opacity-80 relative"
            style={{ 
              backgroundColor: color,
              minHeight: '4px'
            }}
          >
            {/* Tooltip no hover */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              R$ {item.value.toLocaleString()}
            </div>
          </div>
          <span className="text-xs text-gray-600 mt-2 text-center">{item.name}</span>
        </motion.div>
      ))}
    </div>
  );

  // Função para renderizar gráfico de linha
  const renderLineChart = () => {
    const points = data.map((item, index) => ({
      x: (index / (data.length - 1)) * 100,
      y: 100 - ((item.value - minValue) / (maxValue - minValue)) * 100
    }));

    const pathData = points.reduce((path, point, index) => {
      const command = index === 0 ? 'M' : 'L';
      return `${path} ${command} ${point.x} ${point.y}`;
    }, '');

    return (
      <div className="relative h-full p-4">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f3f4f6" strokeWidth="0.2"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
          
          {/* Área sob a linha */}
          <path
            d={`${pathData} L 100 100 L 0 100 Z`}
            fill={`${color}20`}
          />
          
          {/* Linha principal */}
          <motion.path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          
          {/* Pontos */}
          {points.map((point, index) => (
            <motion.circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="1.5"
              fill={color}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 + 1 }}
              className="cursor-pointer hover:r-2 transition-all"
            >
              <title>R$ {data[index].value.toLocaleString()}</title>
            </motion.circle>
          ))}
        </svg>
        
        {/* Labels do eixo X */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 pb-2">
          {data.map((item) => (
            <span key={item.name} className="text-xs text-gray-600">{item.name}</span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <ChartBarIcon className="h-6 w-6 text-[#0047CC] mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        
        {showPeriodSelector && (
          <div className="flex items-center space-x-2">
            <CalendarDaysIcon className="h-4 w-4 text-gray-500" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-[#0047CC] focus:border-[#0047CC]"
            >
              {periods.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Comparação */}
      {showComparison && comparisonValue !== 0 && (
        <div className="mb-4 flex items-center">
          <div className={`flex items-center text-sm font-medium ${
            comparisonValue >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {comparisonValue >= 0 ? (
              <ArrowUpIcon className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 mr-1" />
            )}
            {Math.abs(comparisonValue).toFixed(1)}% {comparisonText}
          </div>
        </div>
      )}

      {/* Gráfico */}
      <div className={`${height} w-full`}>
        {type === 'bar' ? renderBarChart() : renderLineChart()}
      </div>

      {/* Estatísticas do período */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-600">Máximo</p>
            <p className="text-sm font-semibold text-gray-900">R$ {maxValue.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Média</p>
            <p className="text-sm font-semibold text-gray-900">
              R$ {Math.round(data.reduce((acc, item) => acc + item.value, 0) / data.length).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Total</p>
            <p className="text-sm font-semibold text-gray-900">
              R$ {data.reduce((acc, item) => acc + item.value, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 