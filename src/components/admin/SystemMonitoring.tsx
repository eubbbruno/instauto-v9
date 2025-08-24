'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ServerIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  CpuChipIcon,
  CloudIcon,
  DatabaseIcon,
  GlobeAltIcon,
  BoltIcon,
  ShieldCheckIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

interface SystemMetrics {
  server: {
    status: 'online' | 'offline' | 'warning'
    uptime: string
    responseTime: number
    lastChecked: Date
  }
  database: {
    status: 'online' | 'offline' | 'warning'
    connections: number
    performance: number
    lastBackup: Date
  }
  apis: {
    supabase: 'online' | 'offline' | 'warning'
    mercadopago: 'online' | 'offline' | 'warning'
    googlemaps: 'online' | 'offline' | 'warning'
    openai: 'online' | 'offline' | 'warning'
  }
  performance: {
    buildTime: number
    bundleSize: string
    lighthouse: {
      performance: number
      accessibility: number
      bestPractices: number
      seo: number
    }
  }
  security: {
    sslValid: boolean
    securityHeaders: number
    vulnerabilities: number
    lastScan: Date
  }
}

export default function SystemMonitoring() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadSystemMetrics()
    // Atualizar a cada 30 segundos
    const interval = setInterval(loadSystemMetrics, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadSystemMetrics = async () => {
    try {
      if (!metrics) setLoading(true)
      if (metrics) setRefreshing(true)

      // Simular carregamento de métricas reais
      await new Promise(resolve => setTimeout(resolve, 1000))

      const mockMetrics: SystemMetrics = {
        server: {
          status: 'online',
          uptime: '99.98%',
          responseTime: Math.floor(Math.random() * 100) + 50,
          lastChecked: new Date()
        },
        database: {
          status: 'online',
          connections: Math.floor(Math.random() * 50) + 10,
          performance: Math.floor(Math.random() * 20) + 80,
          lastBackup: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 horas atrás
        },
        apis: {
          supabase: 'online',
          mercadopago: 'online',
          googlemaps: 'online',
          openai: Math.random() > 0.1 ? 'online' : 'warning'
        },
        performance: {
          buildTime: 45.2,
          bundleSize: '2.1 MB',
          lighthouse: {
            performance: 92,
            accessibility: 96,
            bestPractices: 88,
            seo: 94
          }
        },
        security: {
          sslValid: true,
          securityHeaders: 8,
          vulnerabilities: 0,
          lastScan: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 horas atrás
        }
      }

      setMetrics(mockMetrics)
    } catch (error) {
      console.error('Erro ao carregar métricas:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'offline': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircleIcon className="w-4 h-4" />
      case 'warning': return <ExclamationTriangleIcon className="w-4 h-4" />
      case 'offline': return <ExclamationTriangleIcon className="w-4 h-4" />
      default: return <ClockIcon className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-48"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-64"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ServerIcon className="w-8 h-8 text-green-600" />
            Monitoramento do Sistema
          </h1>
          <p className="text-gray-600 mt-1">Status em tempo real da infraestrutura InstaAuto</p>
        </div>
        
        <motion.button
          onClick={loadSystemMetrics}
          disabled={refreshing}
          className="mt-4 md:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowPathIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Atualizando...' : 'Atualizar'}
        </motion.button>
      </div>

      {/* Status Geral */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Server Status */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-xl">
                <ServerIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Servidor</h3>
                <p className="text-sm text-gray-600">Vercel Production</p>
              </div>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(metrics?.server.status || 'offline')}`}>
              {getStatusIcon(metrics?.server.status || 'offline')}
              {metrics?.server.status.toUpperCase()}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Uptime</span>
              <span className="font-medium">{metrics?.server.uptime}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tempo de Resposta</span>
              <span className="font-medium">{metrics?.server.responseTime}ms</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Última Verificação</span>
              <span className="font-medium">
                {metrics?.server.lastChecked.toLocaleTimeString('pt-BR')}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Database Status */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <DatabaseIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Database</h3>
                <p className="text-sm text-gray-600">Supabase PostgreSQL</p>
              </div>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(metrics?.database.status || 'offline')}`}>
              {getStatusIcon(metrics?.database.status || 'offline')}
              {metrics?.database.status.toUpperCase()}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Conexões Ativas</span>
              <span className="font-medium">{metrics?.database.connections}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Performance</span>
              <span className="font-medium">{metrics?.database.performance}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Último Backup</span>
              <span className="font-medium">
                {metrics?.database.lastBackup.toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Security Status */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-xl">
                <ShieldCheckIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Segurança</h3>
                <p className="text-sm text-gray-600">SSL & Headers</p>
              </div>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
              metrics?.security.vulnerabilities === 0 ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
            }`}>
              {metrics?.security.vulnerabilities === 0 ? (
                <CheckCircleIcon className="w-4 h-4" />
              ) : (
                <ExclamationTriangleIcon className="w-4 h-4" />
              )}
              {metrics?.security.vulnerabilities === 0 ? 'SEGURO' : 'ATENÇÃO'}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">SSL Válido</span>
              <span className="font-medium">
                {metrics?.security.sslValid ? '✅ Sim' : '❌ Não'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Headers Segurança</span>
              <span className="font-medium">{metrics?.security.securityHeaders}/10</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Vulnerabilidades</span>
              <span className={`font-medium ${
                metrics?.security.vulnerabilities === 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {metrics?.security.vulnerabilities}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* APIs Status */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CloudIcon className="w-5 h-5 text-blue-600" />
          Status das APIs Externas
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(metrics?.apis || {}).map(([api, status]) => (
            <div key={api} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  status === 'online' ? 'bg-green-500' : 
                  status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="font-medium capitalize">{api}</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${getStatusColor(status)}`}>
                {status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Performance & Lighthouse */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BoltIcon className="w-5 h-5 text-yellow-600" />
            Performance
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tempo de Build</span>
              <span className="font-medium">{metrics?.performance.buildTime}s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tamanho do Bundle</span>
              <span className="font-medium">{metrics?.performance.bundleSize}</span>
            </div>
          </div>
        </div>

        {/* Lighthouse Scores */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ChartBarIcon className="w-5 h-5 text-green-600" />
            Lighthouse Scores
          </h3>
          
          <div className="space-y-3">
            {Object.entries(metrics?.performance.lighthouse || {}).map(([metric, score]) => (
              <div key={metric} className="flex items-center justify-between">
                <span className="text-gray-600 capitalize">
                  {metric.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        score >= 90 ? 'bg-green-500' : 
                        score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                  <span className="font-medium text-sm w-8">{score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ExclamationTriangleIcon className="w-5 h-5 text-orange-600" />
          Alertas do Sistema
        </h3>
        
        <div className="space-y-3">
          {metrics?.security.vulnerabilities === 0 && 
           metrics?.server.responseTime < 200 && 
           metrics?.database.performance > 85 ? (
            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Sistema Operacional</p>
                <p className="text-sm text-green-600">Todos os sistemas funcionando normalmente</p>
              </div>
            </div>
          ) : (
            <>
              {metrics?.server.responseTime > 200 && (
                <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-800">Performance Degradada</p>
                    <p className="text-sm text-yellow-600">
                      Tempo de resposta acima do esperado: {metrics?.server.responseTime}ms
                    </p>
                  </div>
                </div>
              )}
              
              {metrics?.database.performance < 85 && (
                <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-800">Database Performance Baixa</p>
                    <p className="text-sm text-red-600">
                      Performance do banco: {metrics?.database.performance}%
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
