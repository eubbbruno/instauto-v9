"use client";

import { 
  SparklesIcon, 
  ArrowUpIcon, 
  ChevronRightIcon,
  ReceiptPercentIcon,
  WrenchScrewdriverIcon, 
  ClipboardDocumentListIcon
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import QuickDiagnosticAI from "@/components/ai/QuickDiagnosticAI";
import Link from "next/link";

export default function DiagnosticoPage() {
  // Animation variants
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
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Diagnóstico Inteligente</h1>
        <p className="text-gray-500 text-sm mt-1">
          Utilize nossos assistentes de IA para diagnosticar problemas e gerar orçamentos
        </p>
        </div>
      
      {/* Layout principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna de IA e Diagnóstico */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ferramenta de diagnóstico rápido */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <QuickDiagnosticAI 
              className="h-[500px]"
              onDiagnosisComplete={(results) => {
                console.log('Diagnóstico concluído:', results);
                // Aqui poderia redirecionar para criar OS ou salvar resultado
              }}
            />
          </div>
          
          {/* Histórico de diagnósticos recentes */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm overflow-hidden"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Histórico de Diagnósticos</h3>
              <Link href="#" className="text-[#0047CC] text-sm hover:underline">Ver todos</Link>
            </div>
            
            <div className="p-4 divide-y divide-gray-100">
              {[
                {
                  client: "Márcia Oliveira",
                  vehicle: "Honda Fit 2018",
                  problem: "Barulho na suspensão",
                  date: "Hoje, 14:35",
                  status: "Convertido em OS"
                },
                {
                  client: "Fernando Costa",
                  vehicle: "Toyota Corolla 2020",
                  problem: "Luz do motor acesa",
                  date: "Ontem, 10:20",
                  status: "Pendente"
                },
                {
                  client: "Carlos Eduardo",
                  vehicle: "VW Golf 2019",
                  problem: "Freios com ruído",
                  date: "22/10/2023",
                  status: "Arquivado"
                }
              ].map((item, i) => (
                <div key={i} className="py-3 px-1 flex items-center justify-between hover:bg-gray-50 rounded-lg transition-colors">
                  <div>
                    <div className="font-medium text-gray-800">{item.client} - {item.vehicle}</div>
                    <div className="text-sm text-gray-500">{item.problem}</div>
                    <div className="text-xs text-gray-400 mt-1">{item.date}</div>
                  </div>
                  <div className="flex items-center">
                    <span className={`mr-3 px-2 py-1 text-xs rounded-full ${
                      item.status === "Convertido em OS" 
                        ? "bg-green-100 text-green-700" 
                        : item.status === "Pendente"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {item.status}
                    </span>
                    <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          </div>
          
        {/* Coluna lateral */}
        <motion.div 
          className="space-y-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Box de dicas */}
          <motion.div 
            className="bg-gradient-to-br from-[#0047CC] to-[#0055EB] rounded-xl shadow-md overflow-hidden text-white relative"
            variants={fadeInUp}
          >
            <div className="absolute bottom-0 right-0 opacity-10">
              <SparklesIcon className="h-32 w-32" />
            </div>
            <div className="p-6 relative">
              <h3 className="text-xl font-bold mb-3 flex items-center">
                <SparklesIcon className="h-6 w-6 mr-2 text-[#FFDE59]" />
                Diagnóstico com IA
              </h3>
              <p className="text-white/80 mb-4">
                Descreva os sintomas do veículo para obter um diagnóstico preliminar 
                e recomendações baseadas em nossa base de conhecimento.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <div className="rounded-full bg-white/20 p-1 mr-2 mt-0.5">
                    <span className="block h-1.5 w-1.5 rounded-full bg-white"></span>
                  </div>
                  <span className="text-sm text-white/90">Análise dos sintomas com base em padrões conhecidos</span>
                </li>
                <li className="flex items-start">
                  <div className="rounded-full bg-white/20 p-1 mr-2 mt-0.5">
                    <span className="block h-1.5 w-1.5 rounded-full bg-white"></span>
                  </div>
                  <span className="text-sm text-white/90">Identificação de possíveis causas e componentes afetados</span>
                </li>
                <li className="flex items-start">
                  <div className="rounded-full bg-white/20 p-1 mr-2 mt-0.5">
                    <span className="block h-1.5 w-1.5 rounded-full bg-white"></span>
                  </div>
                  <span className="text-sm text-white/90">Conversão fácil para ordens de serviço</span>
                </li>
                    </ul>
            </div>
          </motion.div>
          
          {/* Ferramentas adicionais */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm overflow-hidden"
            variants={fadeInUp}
          >
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">Ferramentas de Diagnóstico</h3>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    title: "Gerador de Orçamentos",
                    description: "Crie orçamentos com base no diagnóstico da IA",
                    icon: <ReceiptPercentIcon className="h-6 w-6 text-blue-600" />,
                    link: "#"
                  },
                  {
                    title: "Biblioteca Técnica",
                    description: "Acesse informações técnicas e diagramas específicos",
                    icon: <ClipboardDocumentListIcon className="h-6 w-6 text-purple-600" />,
                    link: "#"
                  },
                  { 
                    title: "Scanner Avançado",
                    description: "Integração com equipamentos de diagnóstico",
                    icon: <WrenchScrewdriverIcon className="h-6 w-6 text-teal-600" />,
                    link: "#"
                  }
                ].map((tool, i) => (
                  <Link 
                    key={i} 
                    href={tool.link}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                  >
                    <div className="bg-gray-100 p-3 rounded-full mr-4">
                      {tool.icon}
                      </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-1">{tool.title}</h4>
                      <p className="text-sm text-gray-500">{tool.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Estatísticas */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm overflow-hidden"
            variants={fadeInUp}
          >
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">Estatísticas de Diagnóstico</h3>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[#0047CC]">87%</div>
                  <div className="text-sm text-gray-500 mt-1">Precisão</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 flex items-center justify-center">
                    <span>+23%</span>
                    <ArrowUpIcon className="h-4 w-4 ml-1" />
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Conversão</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-amber-600">5min</div>
                  <div className="text-sm text-gray-500 mt-1">Tempo médio</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-800">46</div>
                  <div className="text-sm text-gray-500 mt-1">Diagnósticos</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        </div>
    </div>
  );
} 