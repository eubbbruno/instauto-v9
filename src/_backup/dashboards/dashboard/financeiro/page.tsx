"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  PlusIcon,
  FunnelIcon,
  CalendarDaysIcon
} from "@heroicons/react/24/outline";
import DashboardChart from "@/components/DashboardChart";

export default function FinanceiroPage() {
  const [currentPeriod, setCurrentPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [showExpenseCategories, setShowExpenseCategories] = useState(true);
  
  // Dados de exemplo para o gráfico de receitas
  const revenueData = {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    datasets: [
      {
        label: "Receitas",
        data: [12000, 19000, 15000, 22000, 18000, 25000],
        color: "#0047CC"
      }
    ]
  };
  
  // Dados de exemplo para o gráfico de despesas
  const expenseData = {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    datasets: [
      {
        label: "Despesas",
        data: [8000, 10000, 9500, 12000, 11000, 13500],
        color: "#FF4D4F"
      }
    ]
  };
  
  // Dados de receitas por categoria
  const revenueByCategory = [
    { category: "Manutenção", value: 14500, percent: 58, trend: "up", change: 12 },
    { category: "Peças e Produtos", value: 6800, percent: 27.2, trend: "up", change: 5 },
    { category: "Serviços de Diagnóstico", value: 2300, percent: 9.2, trend: "down", change: 3 },
    { category: "Outros Serviços", value: 1400, percent: 5.6, trend: "neutral", change: 0 }
  ];
  
  // Dados de despesas por categoria
  const expenseByCategory = [
    { category: "Fornecedores", value: 7500, percent: 55.6, trend: "up", change: 8 },
    { category: "Salários", value: 3600, percent: 26.7, trend: "neutral", change: 0 },
    { category: "Aluguel e Utilidades", value: 1200, percent: 8.9, trend: "neutral", change: 0 },
    { category: "Marketing", value: 650, percent: 4.8, trend: "down", change: 15 },
    { category: "Outros", value: 550, percent: 4.0, trend: "up", change: 2 }
  ];
  
  // Transações recentes
  const recentTransactions = [
    { 
      id: "T-2023-001", 
      type: "revenue", 
      description: "OS-2023-015 - Ricardo Almeida", 
      amount: 750, 
      date: "2023-10-19", 
      status: "completed",
      category: "Manutenção"
    },
    { 
      id: "T-2023-002", 
      type: "expense", 
      description: "Fornecedor AutoPeças Ltda", 
      amount: 1250, 
      date: "2023-10-18", 
      status: "completed",
      category: "Fornecedores"
    },
    { 
      id: "T-2023-003", 
      type: "revenue", 
      description: "OS-2023-014 - Juliana Pereira", 
      amount: 320, 
      date: "2023-10-18", 
      status: "completed",
      category: "Manutenção"
    },
    { 
      id: "T-2023-004", 
      type: "expense", 
      description: "Pagamento de Água", 
      amount: 180, 
      date: "2023-10-17", 
      status: "completed",
      category: "Aluguel e Utilidades"
    },
    { 
      id: "T-2023-005", 
      type: "revenue", 
      description: "OS-2023-013 - Fernando Costa", 
      amount: 450, 
      date: "2023-10-17", 
      status: "pending",
      category: "Manutenção"
    }
  ];
  
  // Indicadores financeiros
  const financialMetrics = [
    { 
      title: "Receita Mensal", 
      value: "R$ 25.000", 
      change: "+15%", 
      trend: "up",
      color: "from-green-500 to-green-400",
      icon: <BanknotesIcon className="h-5 w-5" />
    },
    { 
      title: "Despesas", 
      value: "R$ 13.500", 
      change: "+8%", 
      trend: "down",
      color: "from-red-500 to-red-400",
      icon: <ArrowTrendingUpIcon className="h-5 w-5" />
    },
    { 
      title: "Lucro Líquido", 
      value: "R$ 11.500", 
      change: "+23%", 
      trend: "up",
      color: "from-blue-500 to-blue-400",
      icon: <CurrencyDollarIcon className="h-5 w-5" />
    },
    { 
      title: "Contas a Receber", 
      value: "R$ 8.200", 
      change: "-5%", 
      trend: "down",
      color: "from-amber-500 to-amber-400",
      icon: <DocumentTextIcon className="h-5 w-5" />
    }
  ];
  
  // Formatação de valores
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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
            <h1 className="text-2xl font-bold text-gray-800">Financeiro</h1>
            <p className="text-gray-500 text-sm mt-1">Gestão financeira da sua oficina</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="px-3 py-1.5 rounded-lg text-sm border border-gray-300 hover:bg-gray-50 flex items-center gap-1.5 bg-white">
              <CalendarDaysIcon className="h-4 w-4 text-gray-600" />
              <span>Out 2023</span>
              <ChevronDownIcon className="h-4 w-4 text-gray-600" />
            </button>
            
            <button className="px-4 py-2 bg-[#0047CC] text-white rounded-lg text-sm font-medium hover:bg-[#003CAD] transition-colors inline-flex items-center">
              <PlusIcon className="h-5 w-5 mr-2" />
              Nova Transação
            </button>
          </div>
        </div>
      </div>
      
      {/* Métricas financeiras */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {financialMetrics.map((metric, index) => (
          <motion.div 
            key={index} 
            className="bg-white rounded-xl shadow-sm overflow-hidden"
            variants={fadeInUp}
          >
            <div className={`h-1 bg-gradient-to-r ${metric.color}`}></div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{metric.title}</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">{metric.value}</h3>
                </div>
                <div className={`p-2 rounded-full ${
                  metric.trend === 'up' ? 'bg-green-100 text-green-600' : 
                  metric.trend === 'down' ? 'bg-red-100 text-red-600' : 
                  'bg-gray-100 text-gray-600'
                }`}>
                  {metric.icon}
                </div>
              </div>
              <div className="mt-3 flex items-center text-sm">
                <div className={`flex items-center font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : 
                  metric.trend === 'down' ? 'text-red-600' : 
                  'text-gray-600'
                }`}>
                  {metric.trend === 'up' && <ArrowUpIcon className="h-3 w-3 mr-1" />}
                  {metric.trend === 'down' && <ArrowDownIcon className="h-3 w-3 mr-1" />}
                  <span>{metric.change}</span>
                </div>
                <span className="text-gray-500 ml-2">vs. mês anterior</span>
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
            title="Receitas" 
            subtitle="Análise de receitas nos últimos meses"
            data={revenueData}
            type="bar"
            period={currentPeriod}
            comparison={{
              value: 15,
              label: "vs. mês anterior",
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
            title="Despesas" 
            subtitle="Análise de despesas nos últimos meses"
            data={expenseData}
            type="bar"
            period={currentPeriod}
            comparison={{
              value: 8,
              label: "vs. mês anterior",
              trend: "down"
            }}
          />
        </motion.div>
      </div>
      
      {/* Detalhamento por categorias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Receitas por categoria */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-800">Receitas por Categoria</h3>
              <p className="text-xs text-gray-500 mt-1">Outubro 2023</p>
            </div>
            <div className="text-sm text-[#0047CC] font-medium">
              Total: {formatCurrency(revenueByCategory.reduce((acc, item) => acc + item.value, 0))}
            </div>
          </div>
          <div className="p-6">
            {revenueByCategory.map((item, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm font-medium text-gray-800">{item.category}</div>
                  <div className="text-sm font-medium">{formatCurrency(item.value)}</div>
                </div>
                <div className="flex items-center">
                  <div className="w-full bg-gray-100 rounded-full h-2.5 mr-3">
                    <div 
                      className="bg-[#0047CC] h-2.5 rounded-full" 
                      style={{ width: `${item.percent}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 w-12 flex items-center whitespace-nowrap">
                    {item.trend === 'up' && <ArrowUpIcon className="h-3 w-3 mr-0.5 text-green-600" />}
                    {item.trend === 'down' && <ArrowDownIcon className="h-3 w-3 mr-0.5 text-red-600" />}
                    <span className={`${
                      item.trend === 'up' ? 'text-green-600' : 
                      item.trend === 'down' ? 'text-red-600' : 
                      'text-gray-600'
                    }`}>
                      {item.change > 0 ? '+' : ''}{item.change}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Despesas por categoria */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-800">Despesas por Categoria</h3>
              <p className="text-xs text-gray-500 mt-1">Outubro 2023</p>
            </div>
            <div className="text-sm text-red-600 font-medium">
              Total: {formatCurrency(expenseByCategory.reduce((acc, item) => acc + item.value, 0))}
            </div>
          </div>
          <div className="p-6">
            {showExpenseCategories ? (
              expenseByCategory.map((item, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-sm font-medium text-gray-800">{item.category}</div>
                    <div className="text-sm font-medium">{formatCurrency(item.value)}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-100 rounded-full h-2.5 mr-3">
                      <div 
                        className="bg-red-500 h-2.5 rounded-full" 
                        style={{ width: `${item.percent}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 w-12 flex items-center whitespace-nowrap">
                      {item.trend === 'up' && <ArrowUpIcon className="h-3 w-3 mr-0.5 text-red-600" />}
                      {item.trend === 'down' && <ArrowDownIcon className="h-3 w-3 mr-0.5 text-green-600" />}
                      <span className={`${
                        item.trend === 'up' ? 'text-red-600' : 
                        item.trend === 'down' ? 'text-green-600' : 
                        'text-gray-600'
                      }`}>
                        {item.change > 0 ? '+' : ''}{item.change}%
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 flex flex-col items-center justify-center">
                <button 
                  onClick={() => setShowExpenseCategories(true)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  Mostrar Categorias
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Transações Recentes */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden mb-6"
      >
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-gray-800">Transações Recentes</h3>
            <p className="text-xs text-gray-500 mt-1">Últimas 5 transações</p>
          </div>
          <button className="text-sm text-[#0047CC] font-medium hover:underline">
            Ver todas
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transação
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentTransactions.map((transaction, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-800">
                      {transaction.id}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {transaction.description}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {new Date(transaction.date).toLocaleDateString('pt-BR')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      transaction.type === 'revenue' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'revenue' ? '+' : '-'} 
                      {formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      transaction.status === 'completed' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {transaction.status === 'completed' ? 'Concluída' : 'Pendente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
      
      {/* Relatórios disponíveis */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Relatórios Financeiros</h3>
          <p className="text-xs text-gray-500 mt-1">Exporte relatórios detalhados</p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex flex-col items-center justify-center text-center">
            <DocumentTextIcon className="h-8 w-8 text-[#0047CC] mb-2" />
            <h4 className="font-medium text-gray-800">Demonstrativo de Resultados</h4>
            <p className="text-xs text-gray-500 mt-1">Receitas, despesas e lucro</p>
          </button>
          
          <button className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex flex-col items-center justify-center text-center">
            <DocumentTextIcon className="h-8 w-8 text-[#0047CC] mb-2" />
            <h4 className="font-medium text-gray-800">Fluxo de Caixa</h4>
            <p className="text-xs text-gray-500 mt-1">Entradas e saídas detalhadas</p>
          </button>
          
          <button className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex flex-col items-center justify-center text-center">
            <DocumentTextIcon className="h-8 w-8 text-[#0047CC] mb-2" />
            <h4 className="font-medium text-gray-800">Contas a Receber</h4>
            <p className="text-xs text-gray-500 mt-1">Pendências e prazos</p>
          </button>
        </div>
      </motion.div>
    </div>
  );
} 