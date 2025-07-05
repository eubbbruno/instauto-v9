"use client";

import { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface MetricaBase {
  id: string;
  nome: string;
  valor: number;
  unidade: string;
  variacao: number; // percentual de variação
  icon: string;
  color: string;
}

interface DadosGrafico {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill?: boolean;
  }[];
}

type TipoGrafico = 'vendas' | 'servicos' | 'clientes' | 'financeiro' | 'performance';

interface DashboardChartProps {
  tipo?: TipoGrafico;
  periodo?: 'semana' | 'mes' | 'trimestre' | 'ano';
  className?: string;
}

const metricas: Record<TipoGrafico, MetricaBase[]> = {
  vendas: [
    { id: 'total_vendas', nome: 'Total de Vendas', valor: 127500, unidade: 'R$', variacao: 12.5, icon: '💰', color: 'bg-green-500' },
    { id: 'pedidos', nome: 'Pedidos', valor: 324, unidade: '', variacao: 8.2, icon: '📦', color: 'bg-blue-500' },
    { id: 'ticket_medio', nome: 'Ticket Médio', valor: 394, unidade: 'R$', variacao: 3.8, icon: '🎯', color: 'bg-purple-500' },
    { id: 'conversao', nome: 'Taxa de Conversão', valor: 23.5, unidade: '%', variacao: -2.1, icon: '📈', color: 'bg-orange-500' }
  ],
  servicos: [
    { id: 'total_servicos', nome: 'Serviços Realizados', valor: 186, unidade: '', variacao: 15.3, icon: '🔧', color: 'bg-blue-600' },
    { id: 'horas_trabalhadas', nome: 'Horas Trabalhadas', valor: 1240, unidade: 'h', variacao: 7.8, icon: '⏰', color: 'bg-indigo-500' },
    { id: 'satisfacao', nome: 'Satisfação Cliente', valor: 4.8, unidade: '/5', variacao: 2.1, icon: '⭐', color: 'bg-yellow-500' },
    { id: 'tempo_medio', nome: 'Tempo Médio Serviço', valor: 6.7, unidade: 'h', variacao: -5.2, icon: '⚡', color: 'bg-green-600' }
  ],
  clientes: [
    { id: 'total_clientes', nome: 'Total de Clientes', valor: 1284, unidade: '', variacao: 18.7, icon: '👥', color: 'bg-blue-500' },
    { id: 'novos_clientes', nome: 'Novos Clientes', valor: 67, unidade: '', variacao: 22.4, icon: '🆕', color: 'bg-green-500' },
    { id: 'recorrencia', nome: 'Taxa de Recorrência', valor: 68.3, unidade: '%', variacao: 4.2, icon: '🔄', color: 'bg-purple-500' },
    { id: 'lifetime_value', nome: 'LTV Médio', valor: 2847, unidade: 'R$', variacao: 11.6, icon: '💎', color: 'bg-pink-500' }
  ],
  financeiro: [
    { id: 'receita', nome: 'Receita Total', valor: 189750, unidade: 'R$', variacao: 14.2, icon: '💵', color: 'bg-green-600' },
    { id: 'despesas', nome: 'Despesas', valor: 67200, unidade: 'R$', variacao: -3.8, icon: '💸', color: 'bg-red-500' },
    { id: 'margem', nome: 'Margem de Lucro', valor: 64.6, unidade: '%', variacao: 5.7, icon: '📊', color: 'bg-blue-600' },
    { id: 'fluxo_caixa', nome: 'Fluxo de Caixa', valor: 122550, unidade: 'R$', variacao: 28.4, icon: '🏦', color: 'bg-teal-500' }
  ],
  performance: [
    { id: 'produtividade', nome: 'Produtividade', valor: 94.2, unidade: '%', variacao: 6.3, icon: '⚡', color: 'bg-yellow-500' },
    { id: 'eficiencia', nome: 'Eficiência', valor: 87.8, unidade: '%', variacao: 3.1, icon: '🎯', color: 'bg-green-500' },
    { id: 'qualidade', nome: 'Índice de Qualidade', valor: 9.2, unidade: '/10', variacao: 1.8, icon: '✨', color: 'bg-purple-500' },
    { id: 'tempo_resposta', nome: 'Tempo de Resposta', valor: 2.3, unidade: 'h', variacao: -12.7, icon: '⏱️', color: 'bg-blue-500' }
  ]
};

const dadosGraficos: Record<TipoGrafico, DadosGrafico> = {
  vendas: {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Vendas (R$)',
        data: [95000, 102000, 98000, 115000, 121000, 127500],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true
      }
    ]
  },
  servicos: {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Serviços Realizados',
        data: [145, 162, 156, 173, 178, 186],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true
      },
      {
        label: 'Satisfação (x10)',
        data: [42, 44, 46, 47, 48, 48],
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: false
      }
    ]
  },
  clientes: {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Total de Clientes',
        data: [1050, 1089, 1134, 1186, 1238, 1284],
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true
      },
      {
        label: 'Novos Clientes',
        data: [39, 44, 45, 52, 52, 67],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: false
      }
    ]
  },
  financeiro: {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Receita (R$)',
        data: [145000, 156000, 161000, 174000, 182000, 189750],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true
      },
      {
        label: 'Despesas (R$)',
        data: [72000, 69500, 71200, 68900, 66800, 67200],
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: false
      }
    ]
  },
  performance: {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Produtividade (%)',
        data: [88, 91, 89, 92, 93, 94],
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true
      },
      {
        label: 'Eficiência (%)',
        data: [84, 85, 86, 87, 87, 88],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: false
      }
    ]
  }
};

export default function DashboardChart({ tipo = 'vendas', periodo = 'mes', className = "" }: DashboardChartProps) {
  const [tipoAtual, setTipoAtual] = useState<TipoGrafico>(tipo);
  const [periodoAtual, setPeriodoAtual] = useState(periodo);
  const [metricasAtuais, setMetricasAtuais] = useState(metricas[tipo]);
  const [isLoading, setIsLoading] = useState(false);

  const tipos: { id: TipoGrafico; nome: string; icon: string }[] = [
    { id: 'vendas', nome: 'Vendas', icon: '💰' },
    { id: 'servicos', nome: 'Serviços', icon: '🔧' },
    { id: 'clientes', nome: 'Clientes', icon: '👥' },
    { id: 'financeiro', nome: 'Financeiro', icon: '📊' },
    { id: 'performance', nome: 'Performance', icon: '⚡' }
  ];

  const periodos = [
    { id: 'semana', nome: 'Última Semana' },
    { id: 'mes', nome: 'Último Mês' },
    { id: 'trimestre', nome: 'Último Trimestre' },
    { id: 'ano', nome: 'Último Ano' }
  ];

  const handleTipoChange = async (novoTipo: TipoGrafico) => {
    if (novoTipo === tipoAtual) return;
    
    setIsLoading(true);
    setTipoAtual(novoTipo);
    
    // Simular carregamento de dados
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setMetricasAtuais(metricas[novoTipo]);
    setIsLoading(false);
  };

  const formatarValor = (valor: number, unidade: string) => {
    if (unidade === 'R$') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(valor);
    }
    
    if (valor >= 1000 && unidade === '') {
      return `${(valor / 1000).toFixed(1)}k`;
    }
    
    return `${valor.toLocaleString('pt-BR')}${unidade}`;
  };

  const formatarVariacao = (variacao: number) => {
    const sinal = variacao >= 0 ? '+' : '';
    const cor = variacao >= 0 ? 'text-green-600' : 'text-red-600';
    const icone = variacao >= 0 ? '↗️' : '↘️';
    
    return (
      <span className={`${cor} text-xs font-medium flex items-center`}>
        {icone} {sinal}{variacao.toFixed(1)}%
      </span>
    );
  };

  // Gerar insights automáticos
  const gerarInsights = () => {
    const insights = [];
    
    metricasAtuais.forEach(metrica => {
      if (metrica.variacao > 10) {
        insights.push({
          tipo: 'positivo',
          texto: `${metrica.nome} teve crescimento excelente de ${metrica.variacao.toFixed(1)}%`
        });
      } else if (metrica.variacao < -5) {
        insights.push({
          tipo: 'atencao',
          texto: `${metrica.nome} apresentou queda de ${Math.abs(metrica.variacao).toFixed(1)}%`
        });
      }
    });

    return insights.slice(0, 3);
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">📊 Analytics Avançado</h2>
          <p className="text-gray-600">Métricas detalhadas e insights inteligentes do seu negócio</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <select
            value={periodoAtual}
            onChange={(e) => setPeriodoAtual(e.target.value as typeof periodo)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            {periodos.map(p => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Seletores de Tipo */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tipos.map((t) => (
          <motion.button
            key={t.id}
            onClick={() => handleTipoChange(t.id)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              tipoAtual === t.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            <span className="mr-1">{t.icon}</span>
            {t.nome}
          </motion.button>
        ))}
      </div>

      {/* Métricas Principais */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-100 rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-16"></div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key={tipoAtual}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {metricasAtuais.map((metrica, index) => (
              <motion.div
                key={metrica.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-lg p-6 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-lg ${metrica.color} flex items-center justify-center text-white text-lg`}>
                    {metrica.icon}
                  </div>
                  {formatarVariacao(metrica.variacao)}
                </div>
                
                <h3 className="text-sm font-medium text-gray-600 mb-1">{metrica.nome}</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {formatarValor(metrica.valor, metrica.unidade)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gráfico (Placeholder) */}
      <div className="bg-gray-50 rounded-lg p-8 mb-8">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-4">📈</div>
          <h3 className="text-lg font-semibold mb-2">Gráfico {tipos.find(t => t.id === tipoAtual)?.nome}</h3>
          <p className="text-sm">Visualização detalhada dos dados do período selecionado</p>
          <div className="mt-4 text-xs text-gray-400">
            {dadosGraficos[tipoAtual].datasets.map(dataset => dataset.label).join(' • ')}
          </div>
        </div>
      </div>

      {/* Insights Automáticos */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          🧠 Insights Automáticos
        </h3>
        
        <div className="space-y-3">
          {gerarInsights().map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-start p-3 rounded-lg ${
                insight.tipo === 'positivo' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-yellow-50 border border-yellow-200'
              }`}
            >
              <span className="text-lg mr-3">
                {insight.tipo === 'positivo' ? '🎉' : '⚠️'}
              </span>
              <p className={`text-sm ${
                insight.tipo === 'positivo' ? 'text-green-800' : 'text-yellow-800'
              }`}>
                {insight.texto}
              </p>
            </motion.div>
          ))}
          
          {gerarInsights().length === 0 && (
            <p className="text-sm text-gray-600">
              📋 Todas as métricas estão dentro do esperado para o período.
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 