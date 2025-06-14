"use client";

import { useState, useMemo } from 'react';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  UserIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  DocumentArrowDownIcon,
  CalendarDaysIcon,
  WrenchScrewdriverIcon,
  StarIcon,
  PrinterIcon,
  ShareIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import DashboardChart from '@/components/dashboard/DashboardChart';
import DashboardFilters, { type FilterValue } from '@/components/dashboard/DashboardFilters';

interface RelatorioData {
  periodo: string;
  receita: number;
  ordens: number;
  clientes: number;
  avaliacaoMedia: number;
  tempoMedioServico: number;
  servicosPopulares: { nome: string; quantidade: number; receita: number }[];
  receitaPorMes: { mes: string; valor: number }[];
  ordensPorStatus: { status: string; quantidade: number; percentual: number }[];
}

export default function RelatoriosPage() {
  const [periodoSelecionado, setPeriodoSelecionado] = useState('este-mes');
  const [filtros, setFiltros] = useState<Record<string, FilterValue>>({
    dataInicio: '',
    dataFim: '',
    tipoServico: '',
    statusOrdem: ''
  });

  // Dados mockados para relatórios
  const dadosRelatorio: RelatorioData = {
    periodo: 'Novembro 2024',
    receita: 15750,
    ordens: 68,
    clientes: 45,
    avaliacaoMedia: 4.8,
    tempoMedioServico: 2.5,
    servicosPopulares: [
      { nome: 'Troca de óleo', quantidade: 18, receita: 1440 },
      { nome: 'Alinhamento', quantidade: 12, receita: 1800 },
      { nome: 'Freios', quantidade: 8, receita: 2400 },
      { nome: 'Suspensão', quantidade: 6, receita: 2100 },
      { nome: 'Diagnóstico', quantidade: 15, receita: 750 }
    ],
    receitaPorMes: [
      { mes: 'Jan', valor: 12500 },
      { mes: 'Fev', valor: 13200 },
      { mes: 'Mar', valor: 14100 },
      { mes: 'Abr', valor: 13800 },
      { mes: 'Mai', valor: 15200 },
      { mes: 'Jun', valor: 16100 },
      { mes: 'Jul', valor: 15800 },
      { mes: 'Ago', valor: 17200 },
      { mes: 'Set', valor: 16500 },
      { mes: 'Out', valor: 18100 },
      { mes: 'Nov', valor: 15750 },
      { mes: 'Dez', valor: 0 }
    ],
    ordensPorStatus: [
      { status: 'Concluídas', quantidade: 45, percentual: 66.2 },
      { status: 'Em andamento', quantidade: 15, percentual: 22.1 },
      { status: 'Aguardando', quantidade: 8, percentual: 11.7 }
    ]
  };

  const periodos = [
    { value: 'hoje', label: 'Hoje' },
    { value: 'esta-semana', label: 'Esta Semana' },
    { value: 'este-mes', label: 'Este Mês' },
    { value: 'ultimo-mes', label: 'Último Mês' },
    { value: 'ultimos-3-meses', label: 'Últimos 3 Meses' },
    { value: 'este-ano', label: 'Este Ano' },
    { value: 'personalizado', label: 'Período Personalizado' }
  ];

  const filtrosConfig = [
    {
      id: 'dataInicio',
      label: 'Data Início',
      type: 'date' as const
    },
    {
      id: 'dataFim',
      label: 'Data Fim',
      type: 'date' as const
    },
    {
      id: 'tipoServico',
      label: 'Tipo de Serviço',
      type: 'select' as const,
      options: [
        { value: '', label: 'Todos os serviços' },
        { value: 'oleo', label: 'Troca de óleo' },
        { value: 'freios', label: 'Sistema de freios' },
        { value: 'suspensao', label: 'Suspensão' },
        { value: 'alinhamento', label: 'Alinhamento' },
        { value: 'eletrica', label: 'Parte elétrica' }
      ]
    },
    {
      id: 'statusOrdem',
      label: 'Status da Ordem',
      type: 'select' as const,
      options: [
        { value: '', label: 'Todos os status' },
        { value: 'concluida', label: 'Concluída' },
        { value: 'andamento', label: 'Em andamento' },
        { value: 'aguardando', label: 'Aguardando' },
        { value: 'cancelada', label: 'Cancelada' }
      ]
    }
  ];

  // Métricas principais com comparação
  const metricas = [
    {
      titulo: 'Receita Total',
      valor: `R$ ${dadosRelatorio.receita.toLocaleString()}`,
      variacao: 12.5,
      icon: CurrencyDollarIcon,
      cor: 'from-emerald-500 via-emerald-600 to-emerald-700',
      bgCor: 'bg-emerald-50',
      iconCor: 'text-emerald-700'
    },
    {
      titulo: 'Ordens de Serviço',
      valor: dadosRelatorio.ordens.toString(),
      variacao: -5.2,
      icon: WrenchScrewdriverIcon,
      cor: 'from-blue-500 via-blue-600 to-blue-700',
      bgCor: 'bg-blue-50',
      iconCor: 'text-blue-700'
    },
    {
      titulo: 'Clientes Atendidos',
      valor: dadosRelatorio.clientes.toString(),
      variacao: 8.1,
      icon: UserIcon,
      cor: 'from-violet-500 via-purple-600 to-purple-700',
      bgCor: 'bg-purple-50',
      iconCor: 'text-purple-700'
    },
    {
      titulo: 'Avaliação Média',
      valor: `${dadosRelatorio.avaliacaoMedia.toFixed(1)} ⭐`,
      variacao: 2.1,
      icon: StarIcon,
      cor: 'from-amber-400 via-orange-500 to-orange-600',
      bgCor: 'bg-orange-50',
      iconCor: 'text-orange-700'
    }
  ];

  const chartData = useMemo(() => {
    return dadosRelatorio.receitaPorMes.map(item => ({
      name: item.mes,
      value: item.valor
    }));
  }, [dadosRelatorio]);

  const exportarRelatorio = (formato: 'pdf' | 'excel') => {
    console.log(`Exportando relatório em ${formato}`);
    // Aqui integraria com bibliotecas de export
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <ChartBarIcon className="h-8 w-8 text-[#0047CC] mr-3" />
                Relatórios e Analytics
              </h1>
              <p className="text-gray-600 mt-1">
                Análise completa do desempenho da sua oficina - {dadosRelatorio.periodo}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => exportarRelatorio('excel')}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center transform hover:-translate-y-0.5 shadow-lg"
              >
                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                Excel
              </button>
              
              <button
                onClick={() => exportarRelatorio('pdf')}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center transform hover:-translate-y-0.5 shadow-lg"
              >
                <PrinterIcon className="h-5 w-5 mr-2" />
                PDF
              </button>
              
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center transform hover:-translate-y-0.5 shadow-lg">
                <ShareIcon className="h-5 w-5 mr-2" />
                Compartilhar
              </button>
            </div>
          </div>

          {/* Seletor de Período */}
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="text-sm text-slate-600 flex items-center mr-4 font-medium">
              <CalendarDaysIcon className="h-4 w-4 mr-1" />
              Período:
            </span>
            {periodos.map((periodo) => (
              <button
                key={periodo.value}
                onClick={() => setPeriodoSelecionado(periodo.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  periodoSelecionado === periodo.value
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                {periodo.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Filtros Avançados */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2 text-[#0047CC]" />
            Filtros Avançados
          </h2>
          <DashboardFilters
            searchPlaceholder="Buscar por cliente, serviço ou ordem..."
            searchValue=""
            onSearchChange={() => {}}
            filters={filtrosConfig}
            filterValues={filtros}
            onFilterChange={setFiltros}
            showFilters={false}
          />
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricas.map((metrica, index) => (
            <motion.div
              key={metrica.titulo}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-200"
            >
              <div className={`h-2 bg-gradient-to-r ${metrica.cor}`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${metrica.bgCor} shadow-sm`}>
                    <metrica.icon className={`h-6 w-6 ${metrica.iconCor}`} />
                  </div>
                  <div className={`flex items-center text-sm font-semibold px-2 py-1 rounded-full ${
                    metrica.variacao >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'
                  }`}>
                    {metrica.variacao >= 0 ? (
                      <ArrowUpIcon className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(metrica.variacao).toFixed(1)}%
                  </div>
                </div>
                
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{metrica.valor}</p>
                  <p className="text-sm text-gray-600 font-medium">{metrica.titulo}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Gráficos e Análises */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Gráfico de Receita */}
          <div className="xl:col-span-2">
            <DashboardChart
              title="Evolução da Receita"
              data={chartData}
              type="line"
              color="#0047CC"
              showPeriodSelector={true}
              showComparison={true}
              comparisonText="vs mês anterior"
              comparisonValue={12.5}
            />
          </div>

          {/* Status das Ordens */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Status das Ordens</h3>
            <div className="space-y-4">
              {dadosRelatorio.ordensPorStatus.map((item, index) => (
                <motion.div
                  key={item.status}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      item.status === 'Concluídas' ? 'bg-green-500' :
                      item.status === 'Em andamento' ? 'bg-blue-500' : 'bg-yellow-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-900">{item.status}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{item.quantidade}</span>
                    <span className="text-sm font-bold text-gray-900">{item.percentual}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Barras de progresso */}
            <div className="mt-6 space-y-3">
              {dadosRelatorio.ordensPorStatus.map((item) => (
                <div key={item.status} className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{item.status}</span>
                    <span>{item.percentual}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentual}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-2 rounded-full ${
                        item.status === 'Concluídas' ? 'bg-green-500' :
                        item.status === 'Em andamento' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Serviços Mais Populares */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Serviços Mais Populares</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 rounded-lg">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 rounded-l-lg">Serviço</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Quantidade</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Receita</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 rounded-r-lg">Ticket Médio</th>
                </tr>
              </thead>
              <tbody>
                {dadosRelatorio.servicosPopulares.map((servico, index) => (
                  <motion.tr
                    key={servico.nome}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">{servico.nome}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="text-gray-900 font-medium mr-2">{servico.quantidade}</div>
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-[#0047CC] h-1.5 rounded-full transition-all duration-1000"
                            style={{ width: `${(servico.quantidade / 20) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-gray-900 font-medium">R$ {servico.receita.toLocaleString()}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-gray-900 font-medium">
                        R$ {(servico.receita / servico.quantidade).toFixed(0)}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights e Recomendações */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Performance da Oficina */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ChartBarIcon className="h-5 w-5 mr-2 text-blue-600" />
              Performance da Oficina
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Tempo médio de serviço</p>
                  <p className="text-lg font-bold text-gray-900">{dadosRelatorio.tempoMedioServico}h</p>
                </div>
                <ClockIcon className="h-8 w-8 text-blue-600" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Taxa de conclusão</p>
                  <p className="text-lg font-bold text-gray-900">94.1%</p>
                </div>
                <div className="text-green-600">
                  <ArrowUpIcon className="h-8 w-8" />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Satisfação do cliente</p>
                  <p className="text-lg font-bold text-gray-900">{dadosRelatorio.avaliacaoMedia}/5.0</p>
                </div>
                <StarIcon className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Recomendações */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Insights e Recomendações</h3>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border-l-4 border-green-500">
                <h4 className="font-medium text-gray-900 mb-1">🎯 Oportunidade de Crescimento</h4>
                <p className="text-sm text-gray-600">
                  Serviços de freios têm maior ticket médio (R$ 300). Promova mais esse tipo de serviço.
                </p>
              </div>
              
              <div className="p-4 bg-white rounded-lg border-l-4 border-blue-500">
                <h4 className="font-medium text-gray-900 mb-1">⏰ Otimização de Tempo</h4>
                <p className="text-sm text-gray-600">
                  Trocas de óleo são rápidas e frequentes. Considere criar pacotes promocionais.
                </p>
              </div>
              
              <div className="p-4 bg-white rounded-lg border-l-4 border-yellow-500">
                <h4 className="font-medium text-gray-900 mb-1">📈 Meta do Mês</h4>
                <p className="text-sm text-gray-600">
                  Você está a R$ 2.250 da meta de R$ 18.000. Faltam apenas 3 serviços médios!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 