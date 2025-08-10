'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  TrendingDownIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  LightBulbIcon,
  EyeIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

interface AnalyticsData {
  revenue: {
    current: number
    previous: number
    trend: 'up' | 'down'
    percentage: number
  }
  customers: {
    total: number
    new: number
    returning: number
    trend: 'up' | 'down'
    percentage: number
  }
  services: {
    completed: number
    pending: number
    cancelled: number
    trend: 'up' | 'down'
    percentage: number
  }
  satisfaction: {
    rating: number
    reviews: number
    trend: 'up' | 'down'
    percentage: number
  }
}

interface Insight {
  id: string
  type: 'revenue' | 'customer' | 'service' | 'prediction'
  title: string
  description: string
  impact: 'positive' | 'negative' | 'neutral'
  priority: 'high' | 'medium' | 'low'
  actionable: boolean
  recommendation?: string
}

interface AnalyticsDashboardProps {
  className?: string
  userType: 'oficina-free' | 'oficina-pro'
}

export default function AnalyticsDashboard({ className = '', userType }: AnalyticsDashboardProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d')

  useEffect(() => {
    // Simular carregamento de dados analytics
    const loadAnalytics = async () => {
      setLoading(true)
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Dados simulados baseados no tipo de usuário
      const mockData: AnalyticsData = {
        revenue: {
          current: userType === 'oficina-pro' ? 15420 : 3850,
          previous: userType === 'oficina-pro' ? 12300 : 3200,
          trend: 'up',
          percentage: userType === 'oficina-pro' ? 25.4 : 20.3
        },
        customers: {
          total: userType === 'oficina-pro' ? 156 : 42,
          new: userType === 'oficina-pro' ? 28 : 8,
          returning: userType === 'oficina-pro' ? 128 : 34,
          trend: 'up',
          percentage: userType === 'oficina-pro' ? 18.2 : 14.7
        },
        services: {
          completed: userType === 'oficina-pro' ? 89 : 24,
          pending: userType === 'oficina-pro' ? 12 : 3,
          cancelled: userType === 'oficina-pro' ? 5 : 1,
          trend: 'up',
          percentage: userType === 'oficina-pro' ? 15.8 : 12.1
        },
        satisfaction: {
          rating: userType === 'oficina-pro' ? 4.7 : 4.5,
          reviews: userType === 'oficina-pro' ? 134 : 38,
          trend: 'up',
          percentage: userType === 'oficina-pro' ? 8.3 : 6.2
        }
      }

      const mockInsights: Insight[] = [
        {
          id: '1',
          type: 'revenue',
          title: '💰 Receita em Alta',
          description: `Sua receita cresceu ${mockData.revenue.percentage}% no último mês`,
          impact: 'positive',
          priority: 'high',
          actionable: true,
          recommendation: 'Continue investindo nos serviços que mais geram resultado'
        },
        {
          id: '2',
          type: 'customer',
          title: '🎯 Novos Clientes',
          description: `${mockData.customers.new} novos clientes este mês`,
          impact: 'positive',
          priority: 'medium',
          actionable: true,
          recommendation: 'Implemente um programa de fidelização para reter esses clientes'
        },
        {
          id: '3',
          type: 'prediction',
          title: '📈 Previsão IA',
          description: 'Baseado no padrão atual, esperamos 35% mais demanda na próxima semana',
          impact: 'positive',
          priority: 'high',
          actionable: true,
          recommendation: 'Prepare o estoque e agende mais técnicos'
        }
      ]

      if (userType === 'oficina-pro') {
        mockInsights.push({
          id: '4',
          type: 'service',
          title: '⚡ Oportunidade PRO',
          description: 'Serviços de suspensão têm alta demanda na sua região',
          impact: 'positive',
          priority: 'high',
          actionable: true,
          recommendation: 'Considere especialização em suspensão para aumentar receita'
        })
      }

      setAnalyticsData(mockData)
      setInsights(mockInsights)
      setLoading(false)
    }

    loadAnalytics()
  }, [userType, selectedPeriod])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getTrendIcon = (trend: 'up' | 'down') => {
    return trend === 'up' 
      ? <ArrowUpIcon className="w-4 h-4 text-green-600" />
      : <ArrowDownIcon className="w-4 h-4 text-red-600" />
  }

  const getTrendColor = (trend: 'up' | 'down') => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600'
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'border-l-green-500 bg-green-50'
      case 'negative': return 'border-l-red-500 bg-red-50'
      default: return 'border-l-blue-500 bg-blue-50'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              🤖 IA Analisando Dados...
            </h3>
            <p className="text-gray-500 text-sm">
              Processando analytics da sua oficina
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!analyticsData) return null

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SparklesIcon className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">📊 Analytics Inteligente</h2>
              <p className="text-blue-100">Insights baseados em IA para sua oficina</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {(['7d', '30d', '90d'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-white text-blue-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {period === '7d' ? '7 dias' : period === '30d' ? '30 dias' : '90 dias'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Receita */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className={`flex items-center gap-1 ${getTrendColor(analyticsData.revenue.trend)}`}>
              {getTrendIcon(analyticsData.revenue.trend)}
              <span className="text-sm font-medium">
                {analyticsData.revenue.percentage}%
              </span>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Receita</h3>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(analyticsData.revenue.current)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            vs {formatCurrency(analyticsData.revenue.previous)} mês anterior
          </p>
        </motion.div>

        {/* Clientes */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserGroupIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className={`flex items-center gap-1 ${getTrendColor(analyticsData.customers.trend)}`}>
              {getTrendIcon(analyticsData.customers.trend)}
              <span className="text-sm font-medium">
                {analyticsData.customers.percentage}%
              </span>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Clientes</h3>
          <p className="text-2xl font-bold text-gray-900">
            {analyticsData.customers.total}
          </p>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Novos: {analyticsData.customers.new}</span>
            <span>Recorrentes: {analyticsData.customers.returning}</span>
          </div>
        </motion.div>

        {/* Serviços */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className={`flex items-center gap-1 ${getTrendColor(analyticsData.services.trend)}`}>
              {getTrendIcon(analyticsData.services.trend)}
              <span className="text-sm font-medium">
                {analyticsData.services.percentage}%
              </span>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Serviços</h3>
          <p className="text-2xl font-bold text-gray-900">
            {analyticsData.services.completed}
          </p>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Pendentes: {analyticsData.services.pending}</span>
            <span>Cancelados: {analyticsData.services.cancelled}</span>
          </div>
        </motion.div>

        {/* Satisfação */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ArrowTrendingUpIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className={`flex items-center gap-1 ${getTrendColor(analyticsData.satisfaction.trend)}`}>
              {getTrendIcon(analyticsData.satisfaction.trend)}
              <span className="text-sm font-medium">
                {analyticsData.satisfaction.percentage}%
              </span>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Satisfação</h3>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-2xl font-bold text-gray-900">
              {analyticsData.satisfaction.rating}
            </p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-lg ${
                    i < Math.floor(analyticsData.satisfaction.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-500">
            {analyticsData.satisfaction.reviews} avaliações
          </p>
        </motion.div>
      </div>

      {/* Insights da IA */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <LightBulbIcon className="w-6 h-6 text-yellow-600" />
          <h3 className="text-xl font-bold text-gray-800">
            🤖 Insights Inteligentes
          </h3>
          <span className="text-sm text-gray-500">
            IA encontrou {insights.length} oportunidades
          </span>
        </div>

        <div className="space-y-4">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border-l-4 rounded-lg p-4 ${getImpactColor(insight.impact)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-gray-800">{insight.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(insight.priority)}`}>
                      {insight.priority === 'high' ? 'Alta' : 
                       insight.priority === 'medium' ? 'Média' : 'Baixa'} Prioridade
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    {insight.description}
                  </p>
                </div>
                {insight.actionable && (
                  <EyeIcon className="w-5 h-5 text-gray-400 flex-shrink-0 ml-3" />
                )}
              </div>

              {insight.recommendation && (
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="text-sm font-medium text-gray-800 mb-1">
                    💡 Recomendação:
                  </p>
                  <p className="text-sm text-gray-600">
                    {insight.recommendation}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {userType === 'oficina-free' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-orange-800 mb-1">
                  🚀 Desbloqueie Analytics Avançados
                </h4>
                <p className="text-sm text-orange-700">
                  Upgrade para PRO e tenha insights preditivos, análise de concorrência e muito mais!
                </p>
              </div>
              <button className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors">
                Upgrade PRO
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
