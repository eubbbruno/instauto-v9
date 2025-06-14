"use client";

import { 
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  SparklesIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  StarIcon,
  WrenchScrewdriverIcon
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { useState } from "react";
import MiniCalendar from "@/components/MiniCalendar";
import DashboardChart from "@/components/DashboardChart";
import QuickDiagnosticAI from "@/components/QuickDiagnosticAI";
import OpportunitiesPanel from "@/components/OpportunitiesPanel";

export default function DashboardPage() {
  const [currentPeriod, setCurrentPeriod] = useState("thisMonth");

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
    <>
      {/* Content */}
      <div className="p-6 bg-gray-50">
        {/* Welcome Card */}
        <motion.div 
          className="bg-gradient-to-r from-[#0047CC] to-[#0055EB] rounded-xl shadow-md p-6 mb-6 text-white relative overflow-hidden"
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
          
          <div className="flex justify-between items-start relative">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center">
                <SparklesIcon className="h-6 w-6 mr-2 text-[#FFDE59]" />
                Olá, Carlos!
              </h2>
              <p className="text-white/80 max-w-lg">
                Bem-vindo ao seu painel de controle. Aqui está o resumo do seu negócio hoje.
              </p>
              <div className="mt-4 flex gap-2">
                <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border border-white/30 backdrop-blur-sm flex items-center">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  Atividade Recente
                </button>
                <button className="bg-[#FFDE59] hover:bg-[#FFD327] text-[#0047CC] px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center shadow-md">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Nova Ordem
                </button>
              </div>
            </div>
            
            <div className="hidden md:block">
              <motion.div 
                className="p-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="text-sm font-medium mb-1 flex items-center">
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1 text-[#FFDE59]" />
                  <span>Desempenho rápido</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-xs text-white/70">Ordens Abertas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#FFDE59]">+15%</div>
                    <div className="text-xs text-white/70">Este mês</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        {/* Filtro de Período */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Resumo do desempenho</h3>
          <div className="bg-white shadow-sm rounded-lg p-1 flex">
            <button 
              onClick={() => setCurrentPeriod("today")}
              className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                currentPeriod === "today" 
                  ? "bg-[#0047CC] text-white" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Hoje
            </button>
            <button 
              onClick={() => setCurrentPeriod("thisWeek")}
              className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                currentPeriod === "thisWeek" 
                  ? "bg-[#0047CC] text-white" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Esta Semana
            </button>
            <button 
              onClick={() => setCurrentPeriod("thisMonth")}
              className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                currentPeriod === "thisMonth" 
                  ? "bg-[#0047CC] text-white" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Este Mês
            </button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {[
            { 
              label: "Ordens Abertas", 
              value: "12", 
              change: "+2 hoje",
              trend: "up",
              color: "from-amber-500 to-amber-400",
              iconColor: "bg-amber-100 text-amber-600",
              icon: <WrenchScrewdriverIcon className="h-5 w-5" />
            },
            { 
              label: "Faturamento do Mês", 
              value: "R$ 25.840", 
              change: "+15% vs. mês anterior",
              trend: "up",
              color: "from-green-500 to-green-400",
              iconColor: "bg-green-100 text-green-600",
              icon: <CurrencyDollarIcon className="h-5 w-5" />
            },
            { 
              label: "Agendamentos", 
              value: "8", 
              change: "para hoje",
              trend: "neutral",
              color: "from-blue-500 to-blue-400",
              iconColor: "bg-blue-100 text-blue-600",
              icon: <CalendarIcon className="h-5 w-5" />
            },
            { 
              label: "Avaliação Média", 
              value: "4.8", 
              change: "-0.1 esta semana",
              trend: "down",
              color: "from-purple-500 to-purple-400",
              iconColor: "bg-purple-100 text-purple-600",
              icon: <StarIcon className="h-5 w-5" />
            },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              variants={fadeInUp}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="px-6 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <h4 className="text-2xl font-bold mt-1 text-gray-800">{stat.value}</h4>
                  </div>
                  <div className={`p-3 rounded-full ${stat.iconColor}`}>
                    {stat.icon}
                  </div>
                </div>
                
                <div className="mt-4 flex items-center text-sm">
                  {stat.trend === "up" && <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />}
                  {stat.trend === "down" && <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />}
                  <span className={`${
                    stat.trend === "up" ? "text-green-600" : 
                    stat.trend === "down" ? "text-red-600" : 
                    "text-gray-600"
                  }`}>
                    {stat.change}
                  </span>
                  </div>
              </div>
              <div className={`h-1 bg-gradient-to-r ${stat.color}`}></div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Layout principal de 3 colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna 1: Gráfico de Faturamento e Diagnóstico AI */}
          <div className="lg:col-span-2 space-y-6">
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
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="h-[420px]"
            >
              <QuickDiagnosticAI />
            </motion.div>
          </div>
          
          {/* Coluna 2: Calendário e Oportunidades */}
          <div className="space-y-6">
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
            
            {/* Ratings Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="px-6 pt-5 pb-3 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800">Avaliações Recentes</h3>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="text-3xl font-bold text-gray-800 mr-4">4.8</div>
                    <div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIconSolid key={i} className={`h-5 w-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Baseado em 48 avaliações</div>
                  </div>
              </div>
                <div className="space-y-2">
                  {[
                    { stars: 5, percentage: 80 },
                    { stars: 4, percentage: 15 },
                    { stars: 3, percentage: 3 },
                    { stars: 2, percentage: 1 },
                    { stars: 1, percentage: 1 }
                  ].map((rating) => (
                    <div key={rating.stars} className="flex items-center">
                      <div className="flex w-20">
                        <span className="text-sm text-gray-600">{rating.stars}</span>
                        <StarIconSolid className="h-4 w-4 text-yellow-400 ml-1" />
            </div>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#0047CC] rounded-full"
                          style={{ width: `${rating.percentage}%` }}
                        ></div>
              </div>
                      <div className="w-12 text-right">
                        <span className="text-sm text-gray-600">{rating.percentage}%</span>
                      </div>
                    </div>
                      ))}
                    </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
} 