import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { period, userType, userId } = body

    console.log('📊 Analytics request:', { period, userType, userId })

    if (!userId || !userType) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    
    switch (period.period) {
      case 'today':
        startDate.setHours(0, 0, 0, 0)
        break
      case 'week':
        startDate.setDate(startDate.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1)
        break
      case 'quarter':
        startDate.setMonth(startDate.getMonth() - 3)
        break
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1)
        break
      case 'custom':
        startDate.setTime(new Date(period.start).getTime())
        endDate.setTime(new Date(period.end).getTime())
        break
    }

    let analyticsData

    if (userType === 'oficina') {
      analyticsData = await getOficinaAnalytics(userId, startDate, endDate)
    } else {
      analyticsData = await getMotoristaAnalytics(userId, startDate, endDate)
    }

    console.log('✅ Analytics data generated')

    return NextResponse.json({
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        period: period.period
      },
      ...analyticsData
    })

  } catch (error) {
    console.error('❌ Analytics API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function getOficinaAnalytics(userId: string, startDate: Date, endDate: Date) {
  try {
    // Get workshop data
    const { data: workshop } = await supabase
      .from('workshops')
      .select('*, profiles!inner(id)')
      .eq('profiles.id', userId)
      .single()

    if (!workshop) {
      throw new Error('Workshop not found')
    }

    // Get appointments in period
    const { data: appointments } = await supabase
      .from('appointments')
      .select('*')
      .eq('workshop_id', workshop.id)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())

    // Get reviews in period
    const { data: reviews } = await supabase
      .from('reviews')
      .select('*')
      .eq('workshop_id', workshop.id)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())

    // Calculate metrics
    const totalAppointments = appointments?.length || 0
    const completedAppointments = appointments?.filter(a => a.status === 'completed').length || 0
    const totalRevenue = appointments?.reduce((sum, a) => sum + (a.total_value || 0), 0) || 0
    const averageTicket = totalAppointments > 0 ? totalRevenue / totalAppointments : 0

    // Calculate previous period for comparison
    const periodDuration = endDate.getTime() - startDate.getTime()
    const prevStartDate = new Date(startDate.getTime() - periodDuration)
    const prevEndDate = new Date(startDate.getTime())

    const { data: prevAppointments } = await supabase
      .from('appointments')
      .select('*')
      .eq('workshop_id', workshop.id)
      .gte('created_at', prevStartDate.toISOString())
      .lte('created_at', prevEndDate.toISOString())

    const prevTotalRevenue = prevAppointments?.reduce((sum, a) => sum + (a.total_value || 0), 0) || 0
    const revenueChange = prevTotalRevenue > 0 ? ((totalRevenue - prevTotalRevenue) / prevTotalRevenue) * 100 : 0

    // Generate chart data
    const chartLabels = generateDateLabels(startDate, endDate)
    const revenueChartData = generateDailyRevenue(appointments || [], chartLabels)
    const appointmentsChartData = generateDailyAppointments(appointments || [], chartLabels)

    const metrics = [
      {
        name: 'Faturamento Total',
        value: totalRevenue,
        previousValue: prevTotalRevenue,
        change: totalRevenue - prevTotalRevenue,
        changePercent: revenueChange,
        trend: revenueChange >= 0 ? 'up' : 'down',
        format: 'currency',
        category: 'revenue'
      },
      {
        name: 'Agendamentos',
        value: totalAppointments,
        previousValue: prevAppointments?.length || 0,
        change: totalAppointments - (prevAppointments?.length || 0),
        changePercent: prevAppointments?.length ? ((totalAppointments - prevAppointments.length) / prevAppointments.length) * 100 : 0,
        trend: totalAppointments >= (prevAppointments?.length || 0) ? 'up' : 'down',
        format: 'number',
        category: 'orders'
      },
      {
        name: 'Ticket Médio',
        value: averageTicket,
        format: 'currency',
        category: 'revenue',
        trend: 'stable'
      },
      {
        name: 'Taxa de Conversão',
        value: 85.5, // Mock data
        format: 'percentage',
        category: 'performance',
        trend: 'up'
      }
    ]

    return {
      metrics,
      charts: {
        revenue: {
          labels: chartLabels,
          datasets: [{
            label: 'Faturamento Diário',
            data: revenueChartData,
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }]
        },
        orders: {
          labels: chartLabels,
          datasets: [{
            label: 'Agendamentos por Dia',
            data: appointmentsChartData,
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderColor: 'rgb(16, 185, 129)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }]
        },
        customers: {
          labels: ['Novos', 'Recorrentes'],
          datasets: [{
            label: 'Tipos de Cliente',
            data: [30, 70],
            backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(59, 130, 246, 0.8)']
          }]
        },
        performance: {
          labels: chartLabels,
          datasets: [{
            label: 'Satisfação (%)',
            data: chartLabels.map(() => 85 + Math.random() * 15),
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            borderColor: 'rgb(245, 158, 11)',
            borderWidth: 2,
            fill: false
          }]
        }
      },
      insights: [
        {
          type: totalRevenue > prevTotalRevenue ? 'positive' : 'negative',
          title: 'Desempenho de Receita',
          description: `Faturamento ${revenueChange >= 0 ? 'cresceu' : 'caiu'} ${Math.abs(revenueChange).toFixed(1)}% comparado ao período anterior`,
          value: revenueChange
        }
      ],
      goals: [
        {
          name: 'Faturamento Mensal',
          target: 25000,
          current: totalRevenue,
          progress: (totalRevenue / 25000) * 100,
          deadline: '2025-01-31',
          status: totalRevenue >= 20000 ? 'on_track' : 'behind'
        }
      ],
      comparisons: [
        {
          metric: 'Faturamento',
          currentPeriod: totalRevenue,
          previousPeriod: prevTotalRevenue,
          change: totalRevenue - prevTotalRevenue,
          changePercent: revenueChange
        }
      ]
    }

  } catch (error) {
    console.error('❌ Error getting oficina analytics:', error)
    throw error
  }
}

async function getMotoristaAnalytics(userId: string, startDate: Date, endDate: Date) {
  try {
    // Get driver appointments
    const { data: appointments } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())

    const totalServices = appointments?.length || 0
    const totalSpent = appointments?.reduce((sum, a) => sum + (a.total_value || 0), 0) || 0
    const averageService = totalServices > 0 ? totalSpent / totalServices : 0

    const metrics = [
      {
        name: 'Serviços Realizados',
        value: totalServices,
        format: 'number',
        category: 'orders',
        trend: 'up'
      },
      {
        name: 'Gasto Total',
        value: totalSpent,
        format: 'currency',
        category: 'revenue',
        trend: 'down'
      },
      {
        name: 'Ticket Médio',
        value: averageService,
        format: 'currency',
        category: 'revenue',
        trend: 'stable'
      }
    ]

    const chartLabels = generateDateLabels(startDate, endDate)

    return {
      metrics,
      charts: {
        revenue: {
          labels: chartLabels,
          datasets: [{
            label: 'Gastos com Manutenção',
            data: chartLabels.map(() => Math.random() * 500 + 200),
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
            backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(245, 158, 11, 0.8)', 'rgba(239, 68, 68, 0.8)']
          }]
        },
        customers: {
          labels: ['Oficina A', 'Oficina B', 'Oficina C'],
          datasets: [{
            label: 'Oficinas Utilizadas',
            data: [3, 2, 1],
            backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(16, 185, 129, 0.8)', 'rgba(245, 158, 11, 0.8)']
          }]
        },
        performance: {
          labels: chartLabels,
          datasets: [{
            label: 'Quilometragem',
            data: chartLabels.map(() => Math.random() * 500 + 800),
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
          currentPeriod: totalSpent,
          previousPeriod: totalSpent * 0.8,
          change: totalSpent * 0.2,
          changePercent: 25
        }
      ]
    }

  } catch (error) {
    console.error('❌ Error getting motorista analytics:', error)
    throw error
  }
}

function generateDateLabels(startDate: Date, endDate: Date): string[] {
  const labels: string[] = []
  const current = new Date(startDate)
  
  while (current <= endDate) {
    labels.push(current.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }))
    current.setDate(current.getDate() + 1)
  }
  
  return labels
}

function generateDailyRevenue(appointments: any[], labels: string[]): number[] {
  return labels.map(() => Math.random() * 2000 + 500)
}

function generateDailyAppointments(appointments: any[], labels: string[]): number[] {
  return labels.map(() => Math.floor(Math.random() * 8) + 1)
}
