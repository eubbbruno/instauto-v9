'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import BeautifulSidebar from '@/components/BeautifulSidebar'
import { 
  ChartBarIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  TruckIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  DocumentArrowDownIcon,
  PrinterIcon,
  ShareIcon,
  FunnelIcon,
  ChartPieIcon,
  PresentationChartLineIcon,
  EyeIcon,
  StarIcon,
  PhoneIcon,
  ArrowTrendingUpIcon as TrendingUpIcon,
  ArrowTrendingDownIcon as TrendingDownIcon
} from '@heroicons/react/24/outline'

export default function RelatoriosClient() {
  const [selectedPeriod, setSelectedPeriod] = useState('mes')
  const [selectedMetric, setSelectedMetric] = useState('faturamento')

  // Dados mockados para relatórios
  const metricas = {
    faturamento: {
      atual: 45680,
      anterior: 38420,
      crescimento: 18.9,
      meta: 50000
    },
    agendamentos: {
      atual: 156,
      anterior: 142,
      crescimento: 9.8,
      meta: 180
    },
    clientes: {
      atual: 89,
      anterior: 76,
      crescimento: 17.1,
      meta: 100
    },
    avaliacoes: {
      atual: 4.8,
      anterior: 4.6,
      crescimento: 4.3,
      meta: 4.9
    }
  }

  const clientesTop = [
    { nome: 'João Silva', servicos: 12, valor: 3420, ultimoServico: '2025-01-15' },
    { nome: 'Maria Santos', servicos: 8, valor: 2850, ultimoServico: '2025-01-14' },
    { nome: 'Pedro Costa', servicos: 6, valor: 2140, ultimoServico: '2025-01-12' },
    { nome: 'Ana Oliveira', servicos: 5, valor: 1890, ultimoServico: '2025-01-10' },
    { nome: 'Carlos Lima', servicos: 4, valor: 1650, ultimoServico: '2025-01-08' }
  ]

  const servicosTop = [
    { servico: 'Troca de óleo', quantidade: 89, valor: 8900, ticket: 100 },
    { servico: 'Revisão completa', quantidade: 34, valor: 10200, ticket: 300 },
    { servico: 'Freios', quantidade: 28, valor: 8400, ticket: 300 },
    { servico: 'Ar condicionado', quantidade: 22, valor: 4400, ticket: 200 },
    { servico: 'Suspensão', quantidade: 18, valor: 7200, ticket: 400 }
  ]

  const faturamentoDiario = [
    { dia: '01', valor: 1200 },
    { dia: '02', valor: 1580 },
    { dia: '03', valor: 890 },
    { dia: '04', valor: 2340 },
    { dia: '05', valor: 1960 },
    { dia: '06', valor: 2100 },
    { dia: '07', valor: 980 },
    { dia: '08', valor: 1750 },
    { dia: '09', valor: 2280 },
    { dia: '10', valor: 1420 },
    { dia: '11', valor: 1890 },
    { dia: '12', valor: 2560 },
    { dia: '13', valor: 1640 },
    { dia: '14', valor: 2180 },
    { dia: '15', valor: 1980 }
  ]

  const npsData = {
    promotores: 78,
    neutros: 18,
    detratores: 4,
    score: 74
  }

  const renderMetricCard = (title: string, value: any, growth: number, meta: any, icon: any, format: string = 'currency') => {
    const IconComponent = icon
    const isPositive = growth > 0
    const formatValue = (val: any) => {
      if (format === 'currency') return `R$ ${val.toLocaleString()}`
      if (format === 'number') return val.toLocaleString()
      if (format === 'rating') return val.toFixed(1)
      return val
    }

    return (
      <motion.div 
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
            <IconComponent className="h-5 w-5" />
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-3xl font-bold text-gray-900">{formatValue(value)}</p>
          
          <div className="flex items-center gap-2">
            {isPositive ? (
              <ArrowUpIcon className="h-4 w-4 text-green-600" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-red-600" />
            )}
            <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(growth)}%
            </span>
            <span className="text-sm text-gray-500">vs período anterior</span>
          </div>
          
          <div className="mt-3">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Meta: {formatValue(meta)}</span>
              <span>{((value / meta) * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((value / meta) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BeautifulSidebar 
        userType="oficina-pro"
        userName="AutoCenter PRO"
        userEmail="oficina@email.com"
        onLogout={() => {}}
      />
      
      <div className="flex-1 md:ml-64 transition-all duration-300">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📊 Relatórios PRO</h1>
              <p className="text-gray-600">Análises avançadas e insights de performance</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 rounded-lg text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              >
                <option value="semana">Esta Semana</option>
                <option value="mes">Este Mês</option>
                <option value="trimestre">Este Trimestre</option>
                <option value="ano">Este Ano</option>
              </select>
              
              <button className="bg-amber-600 text-white px-4 py-2 rounded-xl hover:bg-amber-700 flex items-center gap-2 transition-all">
                <DocumentArrowDownIcon className="w-5 h-5" />
                Exportar PDF
              </button>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-6">

              {/* Métricas Principais */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {renderMetricCard(
                  "Faturamento",
                  metricas.faturamento.atual,
                  metricas.faturamento.crescimento,
                  metricas.faturamento.meta,
                  CurrencyDollarIcon,
                  "currency"
                )}
                
                {renderMetricCard(
                  "Agendamentos",
                  metricas.agendamentos.atual,
                  metricas.agendamentos.crescimento,
                  metricas.agendamentos.meta,
                  CalendarDaysIcon,
                  "number"
                )}
                
                {renderMetricCard(
                  "Novos Clientes",
                  metricas.clientes.atual,
                  metricas.clientes.crescimento,
                  metricas.clientes.meta,
                  UserGroupIcon,
                  "number"
                )}
                
                {renderMetricCard(
                  "Avaliação Média",
                  metricas.avaliacoes.atual,
                  metricas.avaliacoes.crescimento,
                  metricas.avaliacoes.meta,
                  StarIcon,
                  "rating"
                )}
              </div>

              {/* Gráficos e Análises */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Faturamento Diário */}
                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">📈 Faturamento Diário</h3>
                    <div className="flex items-center gap-2">
                      <select className="text-sm border border-gray-200 rounded px-2 py-1">
                        <option>Últimos 15 dias</option>
                        <option>Últimos 30 dias</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Gráfico simulado */}
                  <div className="space-y-2">
                    {faturamentoDiario.slice(-7).map((item, index) => (
                      <div key={item.dia} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 w-8">{item.dia}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                          <div 
                            className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${(item.valor / 2500) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-20">R$ {item.valor}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                    <p className="text-sm text-amber-800">
                      <strong>Melhor dia:</strong> 12/01 com R$ 2.560 | 
                      <strong> Média:</strong> R$ 1.756/dia
                    </p>
                  </div>
                </motion.div>

                {/* NPS Score */}
                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">😊 NPS - Satisfação</h3>
                    <div className="text-2xl font-bold text-green-600">{npsData.score}</div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-green-600">Promotores</span>
                        <span className="font-medium">{npsData.promotores}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${npsData.promotores}%` }} />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-yellow-600">Neutros</span>
                        <span className="font-medium">{npsData.neutros}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${npsData.neutros}%` }} />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-red-600">Detratores</span>
                        <span className="font-medium">{npsData.detratores}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: `${npsData.detratores}%` }} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Excelente!</strong> Sua oficina está entre as melhores avaliadas da região.
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Rankings e Listas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Top Clientes */}
                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">👑 Top Clientes</h3>
                    <span className="text-sm text-gray-500">Por valor gasto</span>
                  </div>
                  
                  <div className="space-y-4">
                    {clientesTop.map((cliente, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{cliente.nome}</p>
                            <p className="text-sm text-gray-600">{cliente.servicos} serviços</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">R$ {cliente.valor.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{new Date(cliente.ultimoServico).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Top Serviços */}
                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">🔧 Top Serviços</h3>
                    <span className="text-sm text-gray-500">Por faturamento</span>
                  </div>
                  
                  <div className="space-y-4">
                    {servicosTop.map((servico, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {index + 1}
                            </div>
                            <span className="font-medium text-gray-900">{servico.servico}</span>
                          </div>
                          <span className="font-bold text-green-600">R$ {servico.valor.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{servico.quantidade} serviços</span>
                          <span>Ticket médio: R$ {servico.ticket}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Insights e Recomendações */}
              <motion.div 
                className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-6 text-white mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-xl font-bold mb-4">💡 Insights & Recomendações IA</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <TrendingUpIcon className="h-5 w-5" />
                      Oportunidades
                    </h4>
                    <ul className="space-y-1 text-amber-100 text-sm">
                      <li>• Serviços de ar condicionado têm alta demanda</li>
                      <li>• Terças-feiras têm menor movimento</li>
                      <li>• Cliente João Silva pode virar premium</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <TrendingDownIcon className="h-5 w-5" />
                      Atenção
                    </h4>
                    <ul className="space-y-1 text-amber-100 text-sm">
                      <li>• Meta de agendamentos 13% abaixo</li>
                      <li>• 2 clientes sem retorno há 3 meses</li>
                      <li>• Revisar preço da revisão completa</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Análise de Performance */}
              <motion.div 
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-6">📋 Resumo Executivo</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-800">Performance Financeira</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Faturamento médio/dia:</span>
                        <span className="font-medium">R$ 1.756</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ticket médio:</span>
                        <span className="font-medium">R$ 293</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Crescimento mensal:</span>
                        <span className="font-medium text-green-600">+18.9%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-800">Operacional</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Serviços/dia:</span>
                        <span className="font-medium">6.2</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taxa ocupação:</span>
                        <span className="font-medium">78%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tempo médio:</span>
                        <span className="font-medium">2h 15min</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-800">Qualidade</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">NPS Score:</span>
                        <span className="font-medium text-green-600">74</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Avaliação média:</span>
                        <span className="font-medium">4.8/5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taxa retorno:</span>
                        <span className="font-medium">89%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
