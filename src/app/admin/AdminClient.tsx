'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import RouteGuard from '@/components/auth/RouteGuard'
import AdminAnalyticsDashboard from '@/components/admin/AdminAnalyticsDashboard'
import UserManagement from '@/components/admin/UserManagement'
import SystemMonitoring from '@/components/admin/SystemMonitoring'
import CouponManager from '@/components/admin/CouponManager'
import { 
  ChartBarIcon,
  UsersIcon,
  ServerIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  TicketIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'

interface AdminUser {
  id: string
  email: string
  name?: string
  type: string
}

export default function AdminClient() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'monitoring' | 'coupons' | 'workshops'>('analytics')

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        window.location.href = '/login?error=admin_access_required'
        return
      }

      // Verificar se é admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!profile || profile.type !== 'admin') {
        window.location.href = '/login?error=admin_access_denied'
        return
      }

      setUser({
        id: user.id,
        email: user.email || '',
        name: profile.name,
        type: profile.type
      })
    } catch (error) {
      console.error('Erro ao verificar acesso admin:', error)
      window.location.href = '/login?error=admin_verification_failed'
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acesso administrativo...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'analytics', label: '📊 Analytics', icon: ChartBarIcon },
    { id: 'users', label: '👥 Usuários', icon: UsersIcon },
    { id: 'workshops', label: '🔧 Oficinas', icon: BuildingOfficeIcon },
    { id: 'coupons', label: '🎫 Cupons', icon: TicketIcon },
    { id: 'monitoring', label: '🖥️ Sistema', icon: ServerIcon }
  ]

  return (
    <RouteGuard allowedUserTypes={['admin']}>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Controle total da plataforma InstaAuto</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <motion.button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                Sair
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1"
      >
        {activeTab === 'analytics' && <AdminAnalyticsDashboard />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'workshops' && <WorkshopsManagement />}
        {activeTab === 'coupons' && <CouponManager />}
        {activeTab === 'monitoring' && <SystemMonitoring />}
      </motion.div>
    </div>
    </RouteGuard>
  )
}

// Component para gerenciamento de oficinas (reutilizar código existente)
function WorkshopsManagement() {
  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold mb-4">🔧 Gerenciamento de Oficinas</h2>
        <p className="text-gray-600 mb-4">
          Funcionalidade de gerenciamento de oficinas será integrada aqui.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            💡 <strong>Próxima implementação:</strong> Interface completa para gerenciar oficinas, 
            verificações, planos e configurações avançadas.
          </p>
        </div>
      </div>
    </div>
  )
}
