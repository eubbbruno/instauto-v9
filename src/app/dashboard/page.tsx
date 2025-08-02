"use client";

import { 
  ArrowUpIcon,
  PlusIcon,
  SparklesIcon,
  ClockIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  StarIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/SupabaseAuthContext";

import MiniCalendar from "@/components/MiniCalendar";
import DashboardChart from "@/components/DashboardChart";
import QuickDiagnosticAI from "@/components/QuickDiagnosticAI";
import OpportunitiesPanel from "@/components/OpportunitiesPanel";

export default function DashboardPage() {
  const [currentPeriod, setCurrentPeriod] = useState("thisMonth");
  const { user } = useAuth();
  
  // Verificar se o usuário é uma oficina PRO
  const [isProPlan, setIsProPlan] = useState(true); // Assumindo PRO por estar nesta página
  
  useEffect(() => {
    // Lógica para verificar plano PRO
    setIsProPlan(true);
  }, [user]);

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

  // Dados de exemplo para o gráfico
  const chartData = {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    datasets: [
      {
        label: "Faturamento",
        data: [12000, 19000, 15000, 22000, 18000, 25000],
        color: "#0047CC"
      }
    ]
  };
  
  // Dados de exemplo para eventos do calendário
  const calendarEvents = [
    { date: "2023-10-20", count: 3 },
    { date: "2023-10-21", count: 1 },
    { date: "2023-10-25", count: 2 },
    { date: "2023-10-28", count: 4 }
  ];

  return (
    <div className="p-6 bg-gray-50">
        {/* Welcome Card PRO */}
        <motion.div 
          className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl shadow-lg p-6 mb-6 text-white relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Elementos decorativos */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-[30px]"></div>
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-[#FFDE59]/20 rounded-full blur-[30px]"></div>
          <div className="absolute bottom-0 right-0 opacity-10">
            <svg width="180" height="100" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M169 47C169 73.5097 147.51 95 121 95C94.4903 95 73 73.5097 73 47C73 20.4903 94.4903 -1 121 -1C147.51 -1 169 20.4903 169 47Z" stroke="white" strokeWidth="2"/>
              <path d="M142 141C142 167.51 120.51 189 94 189C67.4903 189 46 167.51 46 141C46 114.49 67.4903 93 94 93C120.51 93 142 114.49 142 141Z" stroke="white" strokeWidth="2"/>
              <path d="M118 93C91.4903 93 70 71.5097 70 45L94 45C94 58.2548 104.745 69 118 69V93Z" fill="white"/>
              <path d="M94 141C94 114.49 72.5097 93 46 93L46 117C59.2548 117 70 127.745 70 141H94Z" fill="white"/>
            </svg>
          </div>
          
          <div className="flex flex-col lg:flex-row justify-between items-start gap-4 relative">
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold mb-2 flex items-center">
                <StarIconSolid className="h-6 w-6 mr-2 text-[#FFDE59]" />
                Dashboard PRO - {user?.name || 'Oficina'}
              </h2>
              <p className="text-white/90 mb-4">
                Você está no <strong>Plano PRO</strong>! Aproveite todas as funcionalidades avançadas para maximizar seus resultados.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 border border-white/30 backdrop-blur-sm flex items-center justify-center min-h-[44px]">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  Atividade Recente
                </button>
                <button className="bg-[#FFDE59] hover:bg-[#FFD327] text-[#0047CC] px-6 py-3 rounded-lg text-sm font-bold transition-all duration-300 flex items-center justify-center shadow-lg min-h-[44px]">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Nova Ordem
                </button>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg p-4 min-w-[220px]">
              <h3 className="text-sm font-bold mb-3 flex items-center">
                <StarIconSolid className="h-4 w-4 mr-1 text-[#FFDE59]" />
                Plano PRO Ativo
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 mr-2 text-green-400" />
                  <span>Agendamentos ilimitados</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 mr-2 text-green-400" />
                  <span>IA para diagnósticos</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 mr-2 text-green-400" />
                  <span>Analytics avançados</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 mr-2 text-green-400" />
                  <span>Chat premium</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 mr-2 text-green-400" />
                  <span>Suporte prioritário</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Filtro de Período - Mobile Responsive */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <h3 className="text-lg font-bold text-gray-800">Resumo do desempenho</h3>
          <div className="bg-white shadow-sm rounded-lg p-1 flex w-full sm:w-auto">
            <button 
              onClick={() => setCurrentPeriod("today")}
              className={`px-3 py-2 text-sm rounded-md transition-all flex-1 sm:flex-none min-h-[40px] ${
                currentPeriod === "today" 
                  ? "bg-[#0047CC] text-white" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Hoje
            </button>
            <button 
              onClick={() => setCurrentPeriod("thisWeek")}
              className={`px-3 py-2 text-sm rounded-md transition-all flex-1 sm:flex-none min-h-[40px] ${
                currentPeriod === "thisWeek" 
                  ? "bg-[#0047CC] text-white" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Esta Semana
            </button>
            <button 
              onClick={() => setCurrentPeriod("thisMonth")}
              className={`px-3 py-2 text-sm rounded-md transition-all flex-1 sm:flex-none min-h-[40px] ${
                currentPeriod === "thisMonth" 
                  ? "bg-[#0047CC] text-white" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Este Mês
            </button>
          </div>
        </div>
        
        {/* Stats Cards - Mobile Optimized */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="bg-white rounded-xl shadow-sm p-6 border"
            variants={fadeInUp}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Faturamento Hoje</p>
                <p className="text-3xl font-bold text-gray-900">R$ 4.250</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">+12.5%</span>
              <span className="text-sm text-gray-500 ml-1">vs ontem</span>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white rounded-xl shadow-sm p-6 border"
            variants={fadeInUp}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ordens Ativas</p>
                <p className="text-3xl font-bold text-gray-900">18</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <WrenchScrewdriverIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">+3</span>
              <span className="text-sm text-gray-500 ml-1">novas hoje</span>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white rounded-xl shadow-sm p-6 border"
            variants={fadeInUp}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Agendamentos</p>
                <p className="text-3xl font-bold text-gray-900">24</p>
                <p className="text-xs text-green-600 font-medium">✨ Ilimitado no PRO</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CalendarIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">+8.2%</span>
              <span className="text-sm text-gray-500 ml-1">vs semana passada</span>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white rounded-xl shadow-sm p-6 border"
            variants={fadeInUp}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avaliação</p>
                <div className="flex items-center">
                  <p className="text-3xl font-bold text-gray-900">4.8</p>
                  <div className="flex ml-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIconSolid key={i} className="h-5 w-5 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <StarIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-500">Baseado em 156 avaliações</span>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Layout principal de 3 colunas - Mobile Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Coluna 1: Gráfico de Faturamento e Diagnóstico AI */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <DashboardChart 
                title="Faturamento Mensal" 
                subtitle="Análise comparativa de faturamento por mês"
                data={chartData}
                type="bar"
                comparison={{
                  value: 15,
                  label: "vs. mês anterior",
                  trend: "up"
                }}
              />
            </motion.div>
            
            {/* Mostrar o Diagnóstico IA apenas para oficinas PRO */}
            {isProPlan && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="h-[420px]"
              >
                <QuickDiagnosticAI />
              </motion.div>
            )}
            
            {/* Mensagem para oficinas FREE */}
            {!isProPlan && user?.type === 'oficina' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm border p-6 flex flex-col items-center justify-center h-[420px]"
              >
                <div className="bg-gray-100 rounded-full p-4 mb-4">
                  <SparklesIcon className="h-8 w-8 text-[#0047CC]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Diagnóstico com IA</h3>
                <p className="text-gray-600 text-center mb-4 max-w-md">
                  Desbloqueie o poder da Inteligência Artificial para diagnósticos rápidos e precisos com o plano PRO.
                </p>
                <button className="bg-[#0047CC] hover:bg-[#0055EB] text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Fazer upgrade para PRO
                </button>
              </motion.div>
            )}
          </div>
          
          {/* Coluna 2: Calendário e Oportunidades */}
          <div className="space-y-4 md:space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <MiniCalendar 
                events={calendarEvents}
                onSelectDate={(date) => console.log("Data selecionada:", date)}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <OpportunitiesPanel limit={3} />
            </motion.div>
            
            {/* Ratings Summary - Mobile Optimized */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="px-4 md:px-6 pt-4 md:pt-5 pb-3 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800">Avaliações Recentes</h3>
              </div>
              <div className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-3">
                  <div className="text-2xl md:text-3xl font-bold text-gray-800 text-center sm:text-left">4.8</div>
                    <div className="text-center sm:text-left">
                    <div className="flex justify-center sm:justify-start">
                      {[...Array(5)].map((_, i) => (
                        <StarIconSolid key={i} className={`h-4 w-4 md:h-5 md:w-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <div className="text-xs md:text-sm text-gray-500 mt-1">Baseado em 48 avaliações</div>
                  </div>
              </div>
                <div className="space-y-2 md:space-y-3">
                  {[
                    { stars: 5, percentage: 80 },
                    { stars: 4, percentage: 15 },
                    { stars: 3, percentage: 3 },
                    { stars: 2, percentage: 1 },
                    { stars: 1, percentage: 1 }
                  ].map((rating) => (
                    <div key={rating.stars} className="flex items-center gap-2 md:gap-3">
                      <div className="flex w-16 md:w-20 items-center">
                        <span className="text-xs md:text-sm text-gray-600">{rating.stars}</span>
                        <StarIconSolid className="h-3 w-3 md:h-4 md:w-4 text-yellow-400 ml-1" />
                      </div>
                      <div className="flex-1 h-1.5 md:h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#0047CC] rounded-full"
                          style={{ width: `${rating.percentage}%` }}
                        ></div>
                      </div>
                      <div className="w-10 md:w-12 text-right">
                        <span className="text-xs md:text-sm text-gray-600">{rating.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
    </div>
  );
} 