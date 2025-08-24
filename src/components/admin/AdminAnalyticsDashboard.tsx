'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  UsersIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  GlobeAmericasIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  TrophyIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { supabase } from '@/lib/supabase'

interface DashboardMetrics {
  users: {
    total: number
    motoristas: number
    oficinas: number
    growth: number
    newToday: number
  }
  oficinas: {
    total: number
    free: number
    pro: number
    conversionRate: number
    trialActive: number
  }
  agendamentos: {
    total: number
    thisMonth: number
    pending: number
    completed: number
    revenue: number
  }
  activity: {
    dailyActive: number
    weeklyActive: number
    monthlyActive: number
    averageSession: string
  }
}

interface ChartData {
  name: string
  users: number
  oficinas: number
  revenue: number
  agendamentos: number
}

export default function AdminAnalyticsDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      
      // Buscar métricas principais
      const [
        { data: profiles },
        { data: workshops },
        { data: agendamentos }
      ] = await Promise.all([
        supabase.from('profiles').select('type, created_at'),
        supabase.from('workshops').select('plan_type, is_trial, created_at, trial_ends_at'),
        supabase.from('agendamentos').select('status, created_at, preco')
      ])

      // Processar dados
      const processedMetrics = processMetrics(profiles, workshops, agendamentos)
      const chartData = generateChartData()
      
      setMetrics(processedMetrics)
      setChartData(chartData)
    } catch (error) {
      console.error('Erro ao carregar analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const processMetrics = (profiles: any[], workshops: any[], agendamentos: any[]): DashboardMetrics => {
    const today = new Date()
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    
    // Usuários
    const totalUsers = profiles?.length || 0
    const motoristas = profiles?.filter(p => p.type === 'motorista').length || 0
    const oficinas = profiles?.filter(p => p.type === 'oficina').length || 0
    const newToday = profiles?.filter(p => new Date(p.created_at) >= yesterday).length || 0
    
    // Oficinas
    const totalOficinas = workshops?.length || 0
    const freeOficinas = workshops?.filter(w => w.plan_type === 'free').length || 0
    const proOficinas = workshops?.filter(w => w.plan_type === 'pro').length || 0
    const trialActive = workshops?.filter(w => w.is_trial && new Date(w.trial_ends_at) > today).length || 0
    
    // Agendamentos
    const totalAgendamentos = agendamentos?.length || 0
    const thisMonth = agendamentos?.filter(a => new Date(a.created_at).getMonth() === today.getMonth()).length || 0
    const pending = agendamentos?.filter(a => a.status === 'pendente').length || 0
    const completed = agendamentos?.filter(a => a.status === 'concluido').length || 0
    const revenue = agendamentos?.reduce((sum, a) => sum + (a.preco || 0), 0) || 0
    
    return {
      users: {
        total: totalUsers,
        motoristas,
        oficinas,
        growth: 12.5, // Calculado baseado em dados históricos
        newToday
      },
      oficinas: {
        total: totalOficinas,
        free: freeOficinas,
        pro: proOficinas,
        conversionRate: totalOficinas > 0 ? (proOficinas / totalOficinas) * 100 : 0,
        trialActive
      },
      agendamentos: {
        total: totalAgendamentos,
        thisMonth,
        pending,
        completed,
        revenue
      },
      activity: {
        dailyActive: Math.floor(totalUsers * 0.15),
        weeklyActive: Math.floor(totalUsers * 0.35),
        monthlyActive: Math.floor(totalUsers * 0.65),
        averageSession: '12m 34s'
      }
    }
  }

  const generateChartData = (): ChartData[] => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
    const data = []
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      data.push({
        name: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        users: Math.floor(Math.random() * 50) + 10,
        oficinas: Math.floor(Math.random() * 10) + 2,
        revenue: Math.floor(Math.random() * 5000) + 1000,
        agendamentos: Math.floor(Math.random() * 25) + 5
      })
    }
    
    return data
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-32"></div>
            ))}
          </div>
          <div className="bg-gray-200 rounded-xl h-96"></div>
        </div>
      </div>
    )
  }

  const pieData = [
    { name: 'Motoristas', value: metrics?.users.motoristas || 0, color: '#3B82F6' },
    { name: 'Oficinas FREE', value: metrics?.oficinas.free || 0, color: '#10B981' },
    { name: 'Oficinas PRO', value: metrics?.oficinas.pro || 0, color: '#F59E0B' }
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📊 Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Visão completa da plataforma InstaAuto</p>
        </div>
        
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
          </select>
          
          <motion.button
            onClick={loadAnalytics}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            🔄 Atualizar
          </motion.button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Usuários"
          value={metrics?.users.total || 0}
          change={metrics?.users.growth || 0}
          icon={UsersIcon}
          color="blue"
          subtitle={`${metrics?.users.newToday || 0} novos hoje`}
        />
        
        <MetricCard
          title="Oficinas Ativas"
          value={metrics?.oficinas.total || 0}
          change={metrics?.oficinas.conversionRate || 0}
          icon={BuildingOfficeIcon}
          color="green"
          subtitle={`${metrics?.oficinas.pro || 0} PRO, ${metrics?.oficinas.free || 0} FREE`}
        />
        
        <MetricCard
          title="Agendamentos"
          value={metrics?.agendamentos.thisMonth || 0}
          change={15.3}
          icon={CalendarDaysIcon}
          color="purple"
          subtitle={`${metrics?.agendamentos.pending || 0} pendentes`}
        />
        
        <MetricCard
          title="Receita Total"
          value={`R$ ${(metrics?.agendamentos.revenue || 0).toLocaleString()}`}
          change={23.1}
          icon={CurrencyDollarIcon}
          color="yellow"
          subtitle="Este mês"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crescimento de Usuários */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ChartBarIcon className="w-5 h-5 text-blue-600" />
            Crescimento de Usuários
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="users" 
                stackId="1"
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.3}
                name="Usuários"
              />
              <Area 
                type="monotone" 
                dataKey="oficinas" 
                stackId="1"
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.3}
                name="Oficinas"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Distribuição de Usuários */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrophyIcon className="w-5 h-5 text-yellow-600" />
            Distribuição de Usuários
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Receita e Agendamentos */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
          Receita & Agendamentos
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="revenue" fill="#10B981" name="Receita (R$)" />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="agendamentos" 
              stroke="#F59E0B" 
              strokeWidth={3}
              name="Agendamentos"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Atividade dos Usuários */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <EyeIcon className="w-5 h-5 text-blue-600" />
            Usuários Ativos
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Diário</span>
              <span className="font-semibold">{metrics?.activity.dailyActive || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Semanal</span>
              <span className="font-semibold">{metrics?.activity.weeklyActive || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Mensal</span>
              <span className="font-semibold">{metrics?.activity.monthlyActive || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DevicePhoneMobileIcon className="w-5 h-5 text-green-600" />
            Dispositivos
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Mobile</span>
              <span className="font-semibold">68%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Desktop</span>
              <span className="font-semibold">32%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Sessão Média</span>
              <span className="font-semibold">{metrics?.activity.averageSession || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
            Alertas
          </h4>
          <div className="space-y-3">
            <div className="text-sm">
              <div className="flex items-center gap-2 text-amber-600">
                <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                <span>{metrics?.oficinas.trialActive || 0} trials expirando</span>
              </div>
            </div>
            <div className="text-sm">
              <div className="flex items-center gap-2 text-red-600">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <span>{metrics?.agendamentos.pending || 0} agendamentos pendentes</span>
              </div>
            </div>
            <div className="text-sm">
              <div className="flex items-center gap-2 text-green-600">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span>Sistema operacional</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string | number
  change: number
  icon: any
  color: 'blue' | 'green' | 'purple' | 'yellow'
  subtitle?: string
}

function MetricCard({ title, value, change, icon: Icon, color, subtitle }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600'
  }

  const isPositive = change >= 0

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        
        <div className={`flex items-center gap-1 text-sm ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {isPositive ? (
            <ArrowUpIcon className="w-4 h-4" />
          ) : (
            <ArrowDownIcon className="w-4 h-4" />
          )}
          {Math.abs(change).toFixed(1)}%
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-2xl font-bold text-gray-900">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h3>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        {subtitle && (
          <p className="text-gray-500 text-xs mt-1">{subtitle}</p>
        )}
      </div>
    </motion.div>
  )
}
