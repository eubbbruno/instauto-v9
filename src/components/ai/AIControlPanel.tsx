'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  SparklesIcon,
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  WrenchScrewdriverIcon,
  TrophyIcon,
  BoltIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface AIMetrics {
  diagnosticsToday: number
  averageAccuracy: number
  servicesGenerated: number
  revenueGenerated: number
  timesSaved: string
  popularCategories: string[]
}

interface AIControlPanelProps {
  workshopId: string
  className?: string
}

export default function AIControlPanel({ workshopId, className = '' }: AIControlPanelProps) {
  const [metrics, setMetrics] = useState<AIMetrics>({
    diagnosticsToday: 0,
    averageAccuracy: 0,
    servicesGenerated: 0,
    revenueGenerated: 0,
    timesSaved: '0h',
    popularCategories: []
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular carregamento de métricas
    setTimeout(() => {
      setMetrics({
        diagnosticsToday: 23,
        averageAccuracy: 87,
        servicesGenerated: 156,
        revenueGenerated: 12450,
        timesSaved: '4.2h',
        popularCategories: ['Freios', 'Suspensão', 'Motor', 'Elétrica']
      })
      setIsLoading(false)
    }, 1500)
  }, [workshopId])

  if (isLoading) {
    return (
      <div className={`bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-purple-200 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-12"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      className={`bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-600 rounded-lg">
          <SparklesIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">🤖 Central IA Diagnóstico</h3>
          <p className="text-sm text-gray-600">Métricas em tempo real do assistente</p>
        </div>
        <div className="ml-auto">
          <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Ativo
          </div>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div 
          className="bg-white rounded-xl p-4 shadow-sm border"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 font-medium">Diagnósticos Hoje</p>
              <p className="text-2xl font-bold text-purple-600">{metrics.diagnosticsToday}</p>
            </div>
            <EyeIcon className="w-8 h-8 text-purple-400" />
          </div>
          <div className="mt-2 text-xs text-green-600">
            +15% vs. ontem
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-xl p-4 shadow-sm border"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 font-medium">Precisão Média</p>
              <p className="text-2xl font-bold text-blue-600">{metrics.averageAccuracy}%</p>
            </div>
            <TrophyIcon className="w-8 h-8 text-blue-400" />
          </div>
          <div className="mt-2 text-xs text-green-600">
            +3% esta semana
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-xl p-4 shadow-sm border"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 font-medium">Serviços Gerados</p>
              <p className="text-2xl font-bold text-green-600">{metrics.servicesGenerated}</p>
            </div>
            <WrenchScrewdriverIcon className="w-8 h-8 text-green-400" />
          </div>
          <div className="mt-2 text-xs text-green-600">
            Este mês
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-xl p-4 shadow-sm border"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 font-medium">Receita Gerada</p>
              <p className="text-2xl font-bold text-orange-600">R$ {metrics.revenueGenerated.toLocaleString()}</p>
            </div>
            <CurrencyDollarIcon className="w-8 h-8 text-orange-400" />
          </div>
          <div className="mt-2 text-xs text-green-600">
            +28% este mês
          </div>
        </motion.div>
      </div>

      {/* Benefícios da IA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tempo Economizado */}
        <motion.div 
          className="bg-white rounded-xl p-4 shadow-sm border"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <ClockIcon className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-gray-900">Tempo Economizado</h4>
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">{metrics.timesSaved}</div>
          <p className="text-sm text-gray-600">
            por dia em diagnósticos manuais
          </p>
          <div className="mt-3 text-xs text-green-600 font-medium">
            ⚡ 65% mais eficiente que diagnóstico tradicional
          </div>
        </motion.div>

        {/* Categorias Populares */}
        <motion.div 
          className="bg-white rounded-xl p-4 shadow-sm border"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <ChartBarIcon className="w-5 h-5 text-purple-600" />
            <h4 className="font-semibold text-gray-900">Categorias Populares</h4>
          </div>
          <div className="space-y-2">
            {metrics.popularCategories.map((category, index) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{category}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${(4 - index) * 25}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">{(4 - index) * 25}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Call to Action */}
      <motion.div 
        className="mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold mb-1">🚀 Potencialize sua oficina!</h4>
            <p className="text-sm opacity-90">
              A IA está analisando problemas e gerando mais receita para você
            </p>
          </div>
          <BoltIcon className="w-8 h-8 opacity-80" />
        </div>
      </motion.div>
    </motion.div>
  )
}
