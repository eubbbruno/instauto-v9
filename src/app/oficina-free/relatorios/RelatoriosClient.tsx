'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import BeautifulSidebar from '@/components/BeautifulSidebar'
import { 
  ChartBarIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  LockClosedIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CrownIcon,
  EyeIcon,
  StarIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

export default function RelatoriosClient() {
  const [selectedPeriod, setSelectedPeriod] = useState('mes')

  // Dados limitados para FREE
  const metricasFree = {
    faturamento: {
      atual: 12840,
      anterior: 11230,
      crescimento: 14.3,
      limite: 15000 // Limite FREE
    },
    agendamentos: {
      atual: 42,
      anterior: 38,
      crescimento: 10.5,
      limite: 50 // Limite FREE
    },
    clientes: {
      atual: 23,
      anterior: 19,
      crescimento: 21.1,
      limite: 25 // Limite FREE
    },
    avaliacoes: {
      atual: 4.3,
      anterior: 4.1,
      crescimento: 4.9,
      limite: 5.0
    }
  }

  const clientesTopFree = [
    { nome: 'Carlos Silva', valor: 850, servicos: 3, vip: false },
    { nome: 'Ana Costa', valor: 620, servicos: 2, vip: false },
    { nome: 'João Santos', valor: 450, servicos: 2, vip: false }
    // Apenas 3 clientes no FREE
  ]

  const servicosTopFree = [
    { servico: 'Troca de óleo', quantidade: 18, valor: 1800 },
    { servico: 'Freios', quantidade: 8, valor: 1600 },
    { servico: 'Revisão', quantidade: 6, valor: 1800 }
    // Apenas 3 serviços no FREE
  ]

  const renderMetricCardFree = (title: string, value: any, growth: number, limite: any, icon: any, format: string = 'currency', blocked: boolean = false) => {
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
        className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 relative ${blocked ? 'opacity-60' : ''}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {blocked && (
          <div className="absolute inset-0 bg-gray-50 bg-opacity-90 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <LockClosedIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 font-medium">Recurso PRO</p>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <div className="p-2 bg-green-100 text-green-600 rounded-lg">
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
            <span className="text-sm text-gray-500">vs anterior</span>
          </div>
          
          {!blocked && (
            <div className="mt-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Limite FREE: {formatValue(limite)}</span>
                <span>{((value / limite) * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    (value / limite) > 0.8 ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((value / limite) * 100, 100)}%` }}
                />
              </div>
              {(value / limite) > 0.8 && (
                <p className="text-xs text-red-600 mt-1">⚠️ Próximo do limite FREE</p>
              )}
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BeautifulSidebar 
        userType="oficina-free"
        userName="Oficina Básica"
        userEmail="oficina@email.com"
        onLogout={() => {}}
      />
      
      <div className="flex-1 md:ml-64 transition-all duration-300">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📊 Relatórios Básicos</h1>
              <p className="text-gray-600">Métricas essenciais do seu negócio (Plano FREE)</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 rounded-lg text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                <option value="semana">Esta Semana</option>
                <option value="mes">Este Mês</option>
              </select>
              
              <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-xl hover:from-amber-600 hover:to-orange-600 flex items-center gap-2 transition-all">
                <CrownIcon className="w-5 h-5" />
                Upgrade PRO
              </button>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-6">

              {/* Banner Upgrade */}
              <motion.div 
                className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-6 text-white mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">🚀 Destrave Relatórios Avançados!</h3>
                    <p className="text-amber-100">
                      No plano PRO você tem acesso a gráficos detalhados, insights de IA, NPS score e muito mais!
                    </p>
                  </div>
                  <button className="bg-white text-amber-600 px-6 py-3 rounded-xl font-bold hover:bg-amber-50 transition-all">
                    Ver Recursos PRO
                  </button>
                </div>
              </motion.div>

              {/* Métricas Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {renderMetricCardFree(
                  "Faturamento",
                  metricasFree.faturamento.atual,
                  metricasFree.faturamento.crescimento,
                  metricasFree.faturamento.limite,
                  CurrencyDollarIcon,
                  "currency"
                )}
                
                {renderMetricCardFree(
                  "Agendamentos",
                  metricasFree.agendamentos.atual,
                  metricasFree.agendamentos.crescimento,
                  metricasFree.agendamentos.limite,
                  CalendarDaysIcon,
                  "number"
                )}
                
                {renderMetricCardFree(
                  "Clientes Ativos",
                  metricasFree.clientes.atual,
                  metricasFree.clientes.crescimento,
                  metricasFree.clientes.limite,
                  UserGroupIcon,
                  "number"
                )}
                
                {renderMetricCardFree(
                  "Avaliação",
                  metricasFree.avaliacoes.atual,
                  metricasFree.avaliacoes.crescimento,
                  metricasFree.avaliacoes.limite,
                  StarIcon,
                  "rating"
                )}
              </div>

              {/* Seção com Limitações */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Top Clientes - Limitado */}
                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">👥 Top Clientes</h3>
                    <div className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded">
                      Máx 3 no FREE
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {clientesTopFree.map((cliente, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{cliente.nome}</p>
                            <p className="text-sm text-gray-600">{cliente.servicos} serviços</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">R$ {cliente.valor}</p>
                        </div>
                      </div>
                    ))}
                    
                    {/* Placeholder para mostrar limitação */}
                    <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                      <LockClosedIcon className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Mais clientes no plano PRO</p>
                      <button className="text-xs bg-amber-500 text-white px-3 py-1 rounded mt-2 hover:bg-amber-600 transition-colors">
                        Upgrade
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Top Serviços - Limitado */}
                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">🔧 Top Serviços</h3>
                    <div className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded">
                      Máx 3 no FREE
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {servicosTopFree.map((servico, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {index + 1}
                            </div>
                            <span className="font-medium text-gray-900">{servico.servico}</span>
                          </div>
                          <span className="font-bold text-green-600">R$ {servico.valor.toLocaleString()}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span>{servico.quantidade} serviços realizados</span>
                        </div>
                      </div>
                    ))}
                    
                    {/* Placeholder para mostrar limitação */}
                    <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                      <LockClosedIcon className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Análise completa no PRO</p>
                      <button className="text-xs bg-amber-500 text-white px-3 py-1 rounded mt-2 hover:bg-amber-600 transition-colors">
                        Upgrade
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Recursos Bloqueados */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Gráficos Bloqueados */}
                <motion.div 
                  className="bg-white rounded-xl shadow-lg border border-gray-100 relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Gráficos Avançados</h3>
                    <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-gray-50 bg-opacity-90 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <LockClosedIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-lg font-semibold text-gray-600 mb-2">Recursos PRO</p>
                          <p className="text-sm text-gray-500 mb-4">Gráficos interativos, tendências e projeções</p>
                          <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all">
                            Desbloquear
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Insights IA Bloqueados */}
                <motion.div 
                  className="bg-white rounded-xl shadow-lg border border-gray-100 relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🤖 Insights de IA</h3>
                    <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-gray-50 bg-opacity-90 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <LockClosedIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-lg font-semibold text-gray-600 mb-2">Recursos PRO</p>
                          <p className="text-sm text-gray-500 mb-4">Recomendações inteligentes e análises preditivas</p>
                          <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all">
                            Desbloquear
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Comparação de Planos */}
              <motion.div 
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-6">🆚 FREE vs PRO - Relatórios</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium text-green-600 mb-4 text-center">✅ Plano FREE (Atual)</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Métricas básicas (4 principais)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Top 3 clientes</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Top 3 serviços</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Período: semana/mês apenas</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-amber-600 mb-4 text-center">🚀 Plano PRO</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span>Métricas ilimitadas + NPS Score</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span>Rankings completos (clientes/serviços)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span>Gráficos interativos e tendências</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span>Insights de IA e recomendações</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span>Exportação PDF e Excel</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span>Análise de performance detalhada</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:from-amber-600 hover:to-orange-600 transition-all text-lg">
                    🚀 Upgrade para PRO - R$ 89/mês
                  </button>
                  <p className="text-sm text-gray-500 mt-2">
                    Primeiros 7 dias grátis • Cancele quando quiser
                  </p>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
