'use client'

export interface AnalyticsMetric {
  name: string
  value: number
  previousValue?: number
  change?: number
  changePercent?: number
  trend: 'up' | 'down' | 'stable'
  format: 'number' | 'currency' | 'percentage' | 'time'
  category: 'revenue' | 'customers' | 'orders' | 'performance'
}

export interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string
    borderWidth?: number
    fill?: boolean
    tension?: number
  }>
}

export interface AnalyticsPeriod {
  start: string
  end: string
  period: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom'
}

export interface AnalyticsData {
  period: AnalyticsPeriod
  metrics: AnalyticsMetric[]
  charts: {
    revenue: ChartData
    orders: ChartData
    customers: ChartData
    performance: ChartData
  }
  insights: Array<{
    type: 'positive' | 'negative' | 'neutral' | 'warning'
    title: string
    description: string
    action?: string
    value?: number
  }>
  goals: Array<{
    name: string
    target: number
    current: number
    progress: number
    deadline: string
    status: 'on_track' | 'behind' | 'achieved' | 'at_risk'
  }>
  comparisons: Array<{
    metric: string
    currentPeriod: number
    previousPeriod: number
    change: number
    changePercent: number
  }>
}

export interface RealtimeData {
  activeUsers: number
  onlineOfficinas: number
  activeConversations: number
  pendingOrders: number
  todayRevenue: number
  lastUpdate: string
}

class AnalyticsManager {
  private cache = new Map<string, { data: any; timestamp: number }>()
  private cacheTimeout = 5 * 60 * 1000 // 5 minutes
  private realtimeCallbacks: ((data: RealtimeData) => void)[] = []
  private realtimeInterval: NodeJS.Timeout | null = null

  async getAnalytics(period: AnalyticsPeriod, userType: 'motorista' | 'oficina', userId: string): Promise<AnalyticsData | null> {
    const cacheKey = `analytics_${userType}_${userId}_${period.period}_${period.start}_${period.end}`
    
    // Check cache
    const cached = this.cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    try {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          period,
          userType,
          userId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }

      const data = await response.json()
      
      // Cache the result
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      })

      return data
    } catch (error) {
      console.error('❌ Analytics fetch error:', error)
      
      // Return mock data for development
      return this.generateMockAnalytics(period, userType)
    }
  }

  private generateMockAnalytics(period: AnalyticsPeriod, userType: 'motorista' | 'oficina'): AnalyticsData {
    if (userType === 'oficina') {
      return this.generateOficinaAnalytics(period)
    } else {
      return this.generateMotoristaAnalytics(period)
    }
  }

  private generateOficinaAnalytics(period: AnalyticsPeriod): AnalyticsData {
    const now = new Date()
    const daysInPeriod = this.getDaysInPeriod(period)
    
    // Generate random but realistic data
    const baseRevenue = 15000
    const baseOrders = 45
    const baseCustomers = 120
    
    const metrics: AnalyticsMetric[] = [
      {
        name: 'Faturamento Total',
        value: baseRevenue + Math.random() * 5000,
        previousValue: baseRevenue - 1000,
        change: 3420,
        changePercent: 22.8,
        trend: 'up',
        format: 'currency',
        category: 'revenue'
      },
      {
        name: 'Ordens Concluídas',
        value: baseOrders + Math.floor(Math.random() * 20),
        previousValue: baseOrders - 5,
        change: 8,
        changePercent: 18.2,
        trend: 'up',
        format: 'number',
        category: 'orders'
      },
      {
        name: 'Clientes Ativos',
        value: baseCustomers + Math.floor(Math.random() * 30),
        previousValue: baseCustomers - 10,
        change: 15,
        changePercent: 13.6,
        trend: 'up',
        format: 'number',
        category: 'customers'
      },
      {
        name: 'Ticket Médio',
        value: 340 + Math.random() * 50,
        previousValue: 320,
        change: 28,
        changePercent: 8.75,
        trend: 'up',
        format: 'currency',
        category: 'revenue'
      },
      {
        name: 'Taxa de Conversão',
        value: 78.5,
        previousValue: 72.1,
        change: 6.4,
        changePercent: 8.9,
        trend: 'up',
        format: 'percentage',
        category: 'performance'
      },
      {
        name: 'Tempo Médio de Atendimento',
        value: 2.3,
        previousValue: 2.8,
        change: -0.5,
        changePercent: -17.9,
        trend: 'up',
        format: 'time',
        category: 'performance'
      }
    ]

    // Generate chart data
    const labels = this.generateDateLabels(period)
    
    const revenueData = labels.map(() => 
      baseRevenue / daysInPeriod + Math.random() * 2000
    )
    
    const ordersData = labels.map(() => 
      Math.floor(baseOrders / daysInPeriod + Math.random() * 5)
    )
    
    const customersData = labels.map(() => 
      Math.floor(Math.random() * 15) + 5
    )

    return {
      period,
      metrics,
      charts: {
        revenue: {
          labels,
          datasets: [{
            label: 'Faturamento Diário',
            data: revenueData,
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }]
        },
        orders: {
          labels,
          datasets: [{
            label: 'Ordens por Dia',
            data: ordersData,
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderColor: 'rgb(16, 185, 129)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }]
        },
        customers: {
          labels: ['Novos', 'Recorrentes', 'Inativos'],
          datasets: [{
            label: 'Clientes',
            data: [35, 85, 20],
            backgroundColor: [
              'rgba(34, 197, 94, 0.8)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(156, 163, 175, 0.8)'
            ]
          }]
        },
        performance: {
          labels,
          datasets: [
            {
              label: 'Satisfação (%)',
              data: labels.map(() => 85 + Math.random() * 15),
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              borderColor: 'rgb(245, 158, 11)',
              borderWidth: 2,
              fill: false
            },
            {
              label: 'Pontualidade (%)',
              data: labels.map(() => 90 + Math.random() * 10),
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              borderColor: 'rgb(139, 92, 246)',
              borderWidth: 2,
              fill: false
            }
          ]
        }
      },
      insights: [
        {
          type: 'positive',
          title: 'Crescimento excepcional',
          description: 'Faturamento cresceu 22.8% comparado ao período anterior',
          value: 22.8
        },
        {
          type: 'positive',
          title: 'Eficiência melhorada',
          description: 'Tempo médio de atendimento reduziu 18% este mês',
          action: 'Manter padrão de qualidade'
        },
        {
          type: 'warning',
          title: 'Meta de conversão',
          description: 'Faltam 6.5% para atingir a meta de 85% de conversão',
          action: 'Melhorar follow-up com clientes'
        }
      ],
      goals: [
        {
          name: 'Faturamento Mensal',
          target: 25000,
          current: 18420,
          progress: 73.7,
          deadline: '2025-01-31',
          status: 'on_track'
        },
        {
          name: 'Novos Clientes',
          target: 50,
          current: 35,
          progress: 70,
          deadline: '2025-01-31',
          status: 'behind'
        },
        {
          name: 'Taxa de Satisfação',
          target: 95,
          current: 92.5,
          progress: 97.4,
          deadline: '2025-01-31',
          status: 'on_track'
        }
      ],
      comparisons: [
        {
          metric: 'Faturamento',
          currentPeriod: 18420,
          previousPeriod: 15000,
          change: 3420,
          changePercent: 22.8
        },
        {
          metric: 'Ordens',
          currentPeriod: 53,
          previousPeriod: 45,
          change: 8,
          changePercent: 17.8
        }
      ]
    }
  }

  private generateMotoristaAnalytics(period: AnalyticsPeriod): AnalyticsData {
    const metrics: AnalyticsMetric[] = [
      {
        name: 'Serviços Realizados',
        value: 8,
        previousValue: 5,
        change: 3,
        changePercent: 60,
        trend: 'up',
        format: 'number',
        category: 'orders'
      },
      {
        name: 'Gasto Total',
        value: 2340,
        previousValue: 1890,
        change: 450,
        changePercent: 23.8,
        trend: 'down',
        format: 'currency',
        category: 'revenue'
      },
      {
        name: 'Economia Gerada',
        value: 890,
        previousValue: 650,
        change: 240,
        changePercent: 36.9,
        trend: 'up',
        format: 'currency',
        category: 'revenue'
      },
      {
        name: 'Oficinas Visitadas',
        value: 4,
        previousValue: 3,
        change: 1,
        changePercent: 33.3,
        trend: 'up',
        format: 'number',
        category: 'customers'
      },
      {
        name: 'Satisfação Média',
        value: 4.7,
        previousValue: 4.5,
        change: 0.2,
        changePercent: 4.4,
        trend: 'up',
        format: 'number',
        category: 'performance'
      }
    ]

    const labels = this.generateDateLabels(period)

    return {
      period,
      metrics,
      charts: {
        revenue: {
          labels,
          datasets: [{
            label: 'Gastos com Manutenção',
            data: labels.map(() => Math.random() * 500 + 200),
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgb(239, 68, 68)',
            borderWidth: 2,
            fill: true
          }]
        },
        orders: {
          labels: ['Preventiva', 'Corretiva', 'Emergência'],
          datasets: [{
            label: 'Tipo de Serviço',
            data: [5, 2, 1],
            backgroundColor: [
              'rgba(34, 197, 94, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(239, 68, 68, 0.8)'
            ]
          }]
        },
        customers: {
          labels: ['AutoCenter Premium', 'Oficina do João', 'MegaAuto', 'Outros'],
          datasets: [{
            label: 'Oficinas Utilizadas',
            data: [3, 2, 2, 1],
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(156, 163, 175, 0.8)'
            ]
          }]
        },
        performance: {
          labels,
          datasets: [{
            label: 'Quilometragem',
            data: labels.map(() => Math.random() * 500 + 800),
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            borderColor: 'rgb(139, 92, 246)',
            borderWidth: 2,
            fill: true
          }]
        }
      },
      insights: [
        {
          type: 'positive',
          title: 'Manutenção em dia',
          description: 'Você está mantendo seu veículo bem cuidado',
          action: 'Continue com a manutenção preventiva'
        },
        {
          type: 'neutral',
          title: 'Próxima revisão',
          description: 'Revisão dos 10.000km está se aproximando',
          action: 'Agende com antecedência'
        }
      ],
      goals: [
        {
          name: 'Economia Anual',
          target: 5000,
          current: 890,
          progress: 17.8,
          deadline: '2025-12-31',
          status: 'on_track'
        }
      ],
      comparisons: [
        {
          metric: 'Gastos',
          currentPeriod: 2340,
          previousPeriod: 1890,
          change: 450,
          changePercent: 23.8
        }
      ]
    }
  }

  private getDaysInPeriod(period: AnalyticsPeriod): number {
    const start = new Date(period.start)
    const end = new Date(period.end)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }

  private generateDateLabels(period: AnalyticsPeriod): string[] {
    const labels: string[] = []
    const start = new Date(period.start)
    const end = new Date(period.end)
    const current = new Date(start)

    while (current <= end) {
      labels.push(current.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit' 
      }))
      current.setDate(current.getDate() + 1)
    }

    return labels
  }

  // Real-time data
  async getRealtimeData(): Promise<RealtimeData> {
    try {
      const response = await fetch('/api/analytics/realtime')
      
      if (!response.ok) {
        throw new Error('Failed to fetch realtime data')
      }

      return await response.json()
    } catch (error) {
      console.error('❌ Realtime data error:', error)
      
      // Return mock data
      return {
        activeUsers: Math.floor(Math.random() * 50) + 20,
        onlineOfficinas: Math.floor(Math.random() * 15) + 5,
        activeConversations: Math.floor(Math.random() * 25) + 10,
        pendingOrders: Math.floor(Math.random() * 8) + 2,
        todayRevenue: Math.floor(Math.random() * 5000) + 2000,
        lastUpdate: new Date().toISOString()
      }
    }
  }

  startRealtimeUpdates(interval: number = 30000): void {
    if (this.realtimeInterval) {
      this.stopRealtimeUpdates()
    }

    this.realtimeInterval = setInterval(async () => {
      const data = await this.getRealtimeData()
      this.notifyRealtimeCallbacks(data)
    }, interval)

    console.log('🔄 Started realtime analytics updates')
  }

  stopRealtimeUpdates(): void {
    if (this.realtimeInterval) {
      clearInterval(this.realtimeInterval)
      this.realtimeInterval = null
      console.log('⏹️ Stopped realtime analytics updates')
    }
  }

  private notifyRealtimeCallbacks(data: RealtimeData): void {
    this.realtimeCallbacks.forEach(callback => {
      try {
        callback(data)
      } catch (error) {
        console.error('❌ Error in realtime callback:', error)
      }
    })
  }

  onRealtimeUpdate(callback: (data: RealtimeData) => void): () => void {
    this.realtimeCallbacks.push(callback)
    return () => {
      this.realtimeCallbacks = this.realtimeCallbacks.filter(cb => cb !== callback)
    }
  }

  // Utility methods
  static formatMetricValue(metric: AnalyticsMetric): string {
    switch (metric.format) {
      case 'currency':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(metric.value)
      
      case 'percentage':
        return `${metric.value.toFixed(1)}%`
      
      case 'time':
        return `${metric.value.toFixed(1)}h`
      
      default:
        return metric.value.toLocaleString('pt-BR')
    }
  }

  static getChangeIcon(trend: 'up' | 'down' | 'stable'): string {
    switch (trend) {
      case 'up':
        return '↗️'
      case 'down':
        return '↘️'
      default:
        return '➡️'
    }
  }

  static getChangeColor(trend: 'up' | 'down' | 'stable', category: string): string {
    if (trend === 'stable') return 'text-gray-500'
    
    // For revenue and performance, up is good
    if (category === 'revenue' || category === 'performance' || category === 'customers') {
      return trend === 'up' ? 'text-green-600' : 'text-red-600'
    }
    
    // For costs, down is good
    return trend === 'down' ? 'text-green-600' : 'text-red-600'
  }

  static getInsightIcon(type: 'positive' | 'negative' | 'neutral' | 'warning'): string {
    switch (type) {
      case 'positive':
        return '✅'
      case 'negative':
        return '❌'
      case 'warning':
        return '⚠️'
      default:
        return 'ℹ️'
    }
  }

  static getGoalStatusColor(status: string): string {
    switch (status) {
      case 'achieved':
        return 'text-green-600'
      case 'on_track':
        return 'text-blue-600'
      case 'behind':
        return 'text-yellow-600'
      case 'at_risk':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  clearCache(): void {
    this.cache.clear()
    console.log('🗑️ Analytics cache cleared')
  }
}

// Singleton instance
export const analyticsManager = new AnalyticsManager()

// React hook
export function useAnalytics() {
  return {
    getAnalytics: analyticsManager.getAnalytics.bind(analyticsManager),
    getRealtimeData: analyticsManager.getRealtimeData.bind(analyticsManager),
    startRealtimeUpdates: analyticsManager.startRealtimeUpdates.bind(analyticsManager),
    stopRealtimeUpdates: analyticsManager.stopRealtimeUpdates.bind(analyticsManager),
    onRealtimeUpdate: analyticsManager.onRealtimeUpdate.bind(analyticsManager),
    clearCache: analyticsManager.clearCache.bind(analyticsManager)
  }
}
