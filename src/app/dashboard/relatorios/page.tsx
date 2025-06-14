"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  ChevronDownIcon,
  DocumentArrowDownIcon,
  StarIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  BanknotesIcon,
  ClockIcon,
  CheckCircleIcon,
  CpuChipIcon
} from "@heroicons/react/24/outline";
import DashboardChart from "@/components/DashboardChart";

export default function RelatoriosPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  
  // Dados de exemplo para o gráfico de serviços por tipo
  const servicesByTypeData = {
    labels: ["Manutenção", "Reparos", "Diagnóstico", "Pneus", "Troca de Óleo", "Outros"],
    datasets: [
      {
        label: "Serviços Realizados",
        data: [42, 28, 15, 10, 25, 8],
        color: "#0047CC"
      }
    ]
  };
  
  // Dados de exemplo para o gráfico de avaliações
  const ratingsData = {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    datasets: [
      {
        label: "Avaliação Média",
        data: [4.2, 4.3, 4.5, 4.6, 4.7, 4.8],
        color: "#FFDE59"
      }
    ]
  };
  
  // Dados de exemplo para gráfico de tempo médio de serviço
  const serviceTimeData = {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    datasets: [
      {
        label: "Tempo Médio (horas)",
        data: [3.5, 3.2, 3.0, 2.8, 2.5, 2.2],
        color: "#10B981"
      }
    ]
  };
  
  // Dados de exemplo para o ranking de clientes
  const topCustomers = [
    { name: "Ricardo Almeida", services: 8, revenue: 5400, rating: 4.9 },
    { name: "Carla Oliveira", services: 6, revenue: 3800, rating: 4.7 },
    { name: "Paulo Souza", services: 5, revenue: 3200, rating: 5.0 },
    { name: "Marina Ribeiro", services: 4, revenue: 2800, rating: 4.8 },
    { name: "Fernando Costa", services: 4, revenue: 2500, rating: 4.6 }
  ];
  
  // Dados de exemplo para o ranking de serviços
  const topServices = [
    { name: "Revisão Completa", count: 35, revenue: 12500, avgTime: 2.5 },
    { name: "Troca de Óleo", count: 28, revenue: 5600, avgTime: 0.8 },
    { name: "Alinhamento e Balanceamento", count: 22, revenue: 4400, avgTime: 1.2 },
    { name: "Reparo de Suspensão", count: 18, revenue: 9000, avgTime: 3.5 },
    { name: "Troca de Pastilhas de Freio", count: 15, revenue: 3000, avgTime: 1.0 }
  ];
  
  // Métricas principais
  const mainMetrics = [
    { 
      title: "Serviços Realizados", 
      value: "128", 
      change: "+12%", 
      trend: "up",
      color: "bg-blue-100 text-blue-600",
      icon: <WrenchScrewdriverIcon className="h-5 w-5" />
    },
    { 
      title: "Novos Clientes", 
      value: "45", 
      change: "+8%", 
      trend: "up",
      color: "bg-green-100 text-green-600",
      icon: <UserGroupIcon className="h-5 w-5" />
    },
    { 
      title: "Avaliação Média", 
      value: "4.8", 
      change: "+0.2", 
      trend: "up",
      color: "bg-yellow-100 text-yellow-600",
      icon: <StarIcon className="h-5 w-5" />
    },
    { 
      title: "Tempo Médio de Serviço", 
      value: "2.2h", 
      change: "-15%", 
      trend: "up",
      color: "bg-purple-100 text-purple-600",
      icon: <ClockIcon className="h-5 w-5" />
    }
  ];
  
  // Taxa de conversão
  const conversionRates = [
    { stage: "Diagnóstico", value: 95, color: "bg-blue-500" },
    { stage: "Orçamento", value: 75, color: "bg-green-500" },
    { stage: "Aprovação", value: 62, color: "bg-yellow-500" },
    { stage: "Conclusão", value: 58, color: "bg-purple-500" },
    { stage: "Retorno", value: 35, color: "bg-pink-500" }
  ];
  
  // Insights automáticos
  const autoInsights = [
    {
      title: "Aumento de eficiência em troca de óleo",
      description: "O tempo médio para troca de óleo caiu 25% nos últimos 3 meses.",
      type: "positive",
      icon: <CpuChipIcon className="h-6 w-6" />
    },
    {
      title: "Oportunidade em serviços de suspensão",
      description: "Serviços de suspensão geram 35% mais receita que a média de outros serviços.",
      type: "opportunity",
      icon: <ArrowTrendingUpIcon className="h-6 w-6" />
    },
    {
      title: "Clientes novos têm alta conversão",
      description: "85% dos novos clientes retornam para um segundo serviço dentro de 60 dias.",
      type: "positive",
      icon: <UserGroupIcon className="h-6 w-6" />
    }
  ];
  
  // Funções auxiliares
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const formatTimeHours = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (minutes === 0) {
      return `${wholeHours}h`;
    }
    
    return `${wholeHours}h ${minutes}min`;
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Relatórios</h1>
            <p className="text-gray-500 text-sm mt-1">Análise de desempenho da sua oficina</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Período:</span>
              <select 
                className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
              >
                <option value="week">Última semana</option>
                <option value="month">Último mês</option>
                <option value="quarter">Último trimestre</option>
                <option value="year">Último ano</option>
              </select>
            </div>
            
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors inline-flex items-center">
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              Exportar
            </button>
          </div>
        </div>
      </div>
      
      {/* Métricas principais */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {mainMetrics.map((metric, index) => (
          <motion.div 
            key={index} 
            className="bg-white rounded-xl shadow-sm p-6"
            variants={fadeInUp}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${metric.color}`}>
                {metric.icon}
              </div>
              <div className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {timeRange === 'week' ? 'Semanal' : 
                 timeRange === 'month' ? 'Mensal' : 
                 timeRange === 'quarter' ? 'Trimestral' : 'Anual'}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{metric.value}</h3>
            <div className="flex items-center mt-2">
              <p className="text-sm text-gray-500">{metric.title}</p>
              <div className={`ml-auto text-xs font-medium px-1.5 py-0.5 rounded-full ${
                metric.trend === 'up' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {metric.change}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <DashboardChart 
            title="Serviços por Tipo" 
            subtitle="Distribuição de serviços realizados"
            data={servicesByTypeData}
            type="bar"
            period="month"
            comparison={{
              value: 18,
              label: "total de serviços",
              trend: "up"
            }}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <DashboardChart 
            title="Avaliações de Clientes" 
            subtitle="Média de satisfação ao longo do tempo"
            data={ratingsData}
            type="line"
            period="month"
            comparison={{
              value: 5,
              label: "vs. período anterior",
              trend: "up"
            }}
          />
        </motion.div>
      </div>
      
      {/* Taxa de conversão do funil */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden mb-6"
      >
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Funil de Conversão</h3>
          <p className="text-xs text-gray-500 mt-1">Acompanhamento do fluxo de clientes</p>
        </div>
        <div className="p-6">
          <div className="flex items-end h-56 gap-8 mb-4">
            {conversionRates.map((stage, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="w-full relative mb-2">
                  <div 
                    className={`w-full ${stage.color} rounded-t-lg transition-all duration-700 ease-out`} 
                    style={{ height: `${stage.value * 2}px` }}
                  ></div>
                  <div className="absolute top-0 left-0 w-full flex justify-center -mt-8">
                    <span className="text-gray-800 font-bold">{stage.value}%</span>
                  </div>
                </div>
                <span className="text-sm text-gray-600 text-center mt-2">{stage.stage}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-800">Taxa de conclusão: 58%</span>
              <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                +5% vs. período anterior
              </span>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Tempo médio de serviço */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mb-6"
      >
        <DashboardChart 
          title="Tempo Médio de Serviço" 
          subtitle="Evolução da eficiência operacional"
          data={serviceTimeData}
          type="line"
          period="month"
          comparison={{
            value: 15,
            label: "redução vs. período anterior",
            trend: "up"
          }}
        />
      </motion.div>
      
      {/* Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Clientes */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Top Clientes</h3>
            <p className="text-xs text-gray-500 mt-1">Clientes com maior recorrência</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Serviços
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Receita
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avaliação
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topCustomers.map((customer, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-800">
                        {customer.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {customer.services}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-800">
                        {formatCurrency(customer.revenue)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600 mr-1">
                          {customer.rating.toFixed(1)}
                        </span>
                        <StarIcon className="h-4 w-4 text-yellow-400" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        
        {/* Top Serviços */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Top Serviços</h3>
            <p className="text-xs text-gray-500 mt-1">Serviços mais realizados</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Serviço
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qtd.
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Receita
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tempo Médio
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topServices.map((service, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-800">
                        {service.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {service.count}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-800">
                        {formatCurrency(service.revenue)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {formatTimeHours(service.avgTime)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
      
      {/* Insights automáticos */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center">
          <h3 className="font-bold text-gray-800">Insights Automáticos</h3>
          <div className="ml-3 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">IA</div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {autoInsights.map((insight, index) => (
            <div 
              key={index} 
              className={`p-5 rounded-xl ${
                insight.type === 'positive' 
                  ? 'bg-green-50 border border-green-100' 
                  : insight.type === 'opportunity'
                  ? 'bg-blue-50 border border-blue-100'
                  : 'bg-amber-50 border border-amber-100'
              }`}
            >
              <div className={`p-3 rounded-lg mb-3 inline-block ${
                insight.type === 'positive' 
                  ? 'bg-green-100 text-green-600' 
                  : insight.type === 'opportunity'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-amber-100 text-amber-600'
              }`}>
                {insight.icon}
              </div>
              <h4 className={`font-medium mb-2 ${
                insight.type === 'positive' 
                  ? 'text-green-800' 
                  : insight.type === 'opportunity'
                  ? 'text-blue-800'
                  : 'text-amber-800'
              }`}>
                {insight.title}
              </h4>
              <p className={`text-sm ${
                insight.type === 'positive' 
                  ? 'text-green-600' 
                  : insight.type === 'opportunity'
                  ? 'text-blue-600'
                  : 'text-amber-600'
              }`}>
                {insight.description}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
} 