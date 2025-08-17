'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
// import { useToastAdvanced } from '@/components/ui/ToastAdvanced'
import { SkeletonDashboardAdvanced } from '@/components/ui/SkeletonAdvanced'
import { 
  ChartBarIcon, 
  CogIcon, 
  BellIcon, 
  UserGroupIcon,
  WrenchScrewdriverIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  TruckIcon
} from '@heroicons/react/24/outline'

interface DashboardProps {
  userType: 'motorista' | 'oficina'
  profile: any
  user: any
}

export function ModernDashboard({ userType, profile, user }: DashboardProps) {
  const [stats, setStats] = useState<any>(null)
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  // const { toast } = useToastAdvanced()

  useEffect(() => {
    loadDashboardData()
  }, [profile.id])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      if (userType === 'motorista') {
        await loadMotoristaData()
      } else {
        await loadOficinaData()
      }

      console.log('Dashboard atualizado - Dados carregados com sucesso!')
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error)
      console.error('Erro ao carregar dados - Tente novamente em alguns instantes')
    } finally {
      setLoading(false)
    }
  }

  const loadMotoristaData = async () => {
    // Simular dados para motorista
    setStats({
      totalVehicles: 2,
      pendingServices: 1,
      completedServices: 15,
      totalSpent: 2450.00
    })

    setRecentActivity([
      { type: 'service', title: 'Troca de óleo agendada', date: '2024-01-15', status: 'pending' },
      { type: 'service', title: 'Alinhamento concluído', date: '2024-01-10', status: 'completed' },
      { type: 'payment', title: 'Pagamento processado', date: '2024-01-10', status: 'completed' }
    ])
  }

  const loadOficinaData = async () => {
    // Simular dados para oficina
    setStats({
      totalClients: 48,
      pendingOrders: 12,
      completedOrders: 234,
      monthlyRevenue: 15600.00
    })

    setRecentActivity([
      { type: 'order', title: 'Nova ordem de serviço', date: '2024-01-15', status: 'pending' },
      { type: 'client', title: 'Novo cliente cadastrado', date: '2024-01-14', status: 'new' },
      { type: 'payment', title: 'Pagamento recebido', date: '2024-01-14', status: 'completed' }
    ])
  }

  if (loading) {
    return <SkeletonDashboardAdvanced />
  }

  const getStatsConfig = () => {
    if (userType === 'motorista') {
      return [
        { key: 'totalVehicles', label: 'Veículos', icon: TruckIcon, color: 'blue', value: stats.totalVehicles },
        { key: 'pendingServices', label: 'Serviços Pendentes', icon: CalendarDaysIcon, color: 'yellow', value: stats.pendingServices },
        { key: 'completedServices', label: 'Serviços Concluídos', icon: WrenchScrewdriverIcon, color: 'green', value: stats.completedServices },
        { key: 'totalSpent', label: 'Total Gasto', icon: CurrencyDollarIcon, color: 'purple', value: `R$ ${stats.totalSpent.toFixed(2)}` }
      ]
    } else {
      return [
        { key: 'totalClients', label: 'Clientes', icon: UserGroupIcon, color: 'blue', value: stats.totalClients },
        { key: 'pendingOrders', label: 'Ordens Pendentes', icon: CalendarDaysIcon, color: 'yellow', value: stats.pendingOrders },
        { key: 'completedOrders', label: 'Ordens Concluídas', icon: WrenchScrewdriverIcon, color: 'green', value: stats.completedOrders },
        { key: 'monthlyRevenue', label: 'Receita Mensal', icon: CurrencyDollarIcon, color: 'purple', value: `R$ ${stats.monthlyRevenue.toFixed(2)}` }
      ]
    }
  }

  const getColorConfig = (color: string) => {
    const configs = {
      blue: { bg: 'from-blue-500 to-blue-600', icon: 'text-blue-600', card: 'bg-blue-50' },
      yellow: { bg: 'from-yellow-500 to-yellow-600', icon: 'text-yellow-600', card: 'bg-yellow-50' },
      green: { bg: 'from-green-500 to-green-600', icon: 'text-green-600', card: 'bg-green-50' },
      purple: { bg: 'from-purple-500 to-purple-600', icon: 'text-purple-600', card: 'bg-purple-50' }
    }
    return configs[color as keyof typeof configs] || configs.blue
  }

  const statsConfig = getStatsConfig()

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {userType === 'motorista' ? '🚗 Dashboard Motorista' : '🔧 Dashboard Oficina'}
          </h1>
          <p className="text-gray-600 mt-1">
            Bem-vindo de volta, {profile?.name || user?.email?.split('@')[0]}!
          </p>
        </div>
        
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all"
          >
            <BellIcon className="w-6 h-6 text-gray-600" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all"
          >
            <CogIcon className="w-6 h-6 text-gray-600" />
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat, index) => {
          const colorConfig = getColorConfig(stat.color)
          const Icon = stat.icon
          
          return (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 relative overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${colorConfig.card} opacity-50`}></div>
              
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {userType === 'motorista' ? 'Este mês' : 'Últimos 30 dias'}
                  </p>
                </div>
                
                <div className={`w-16 h-16 bg-gradient-to-r ${colorConfig.bg} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Hover Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-2xl opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1 */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {userType === 'motorista' ? '📊 Gastos por Mês' : '📈 Receita por Mês'}
            </h3>
            <ChartBarIcon className="w-6 h-6 text-gray-400" />
          </div>
          
          {/* Placeholder Chart */}
          <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center">
            <p className="text-gray-500 text-lg">Gráfico em desenvolvimento</p>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">🕒 Atividade Recente</h3>
            <span className="text-sm text-gray-500">{recentActivity.length} itens</span>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className={`w-3 h-3 rounded-full ${
                  activity.status === 'completed' ? 'bg-green-500' :
                  activity.status === 'pending' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`}></div>
                
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.date}</p>
                </div>
                
                <span className={`text-xs px-2 py-1 rounded-full ${
                  activity.status === 'completed' ? 'bg-green-100 text-green-700' :
                  activity.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {activity.status === 'completed' ? 'Concluído' :
                   activity.status === 'pending' ? 'Pendente' : 'Novo'}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-6">⚡ Ações Rápidas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {userType === 'motorista' ? [
            { label: 'Buscar Oficinas', icon: '🔍', color: 'blue' },
            { label: 'Agendar Serviço', icon: '📅', color: 'green' },
            { label: 'Meus Veículos', icon: '🚗', color: 'purple' },
            { label: 'Histórico', icon: '📋', color: 'gray' },
            { label: 'Suporte', icon: '💬', color: 'orange' }
          ] : [
            { label: 'Nova Ordem', icon: '➕', color: 'blue' },
            { label: 'Clientes', icon: '👥', color: 'green' },
            { label: 'Relatórios', icon: '📊', color: 'purple' },
            { label: 'Estoque', icon: '📦', color: 'gray' },
            { label: 'Configurações', icon: '⚙️', color: 'orange' }
          ].map((action, index) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-lg transition-all text-center group"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                {action.icon}
              </div>
              <p className="text-sm font-medium text-gray-700">{action.label}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
