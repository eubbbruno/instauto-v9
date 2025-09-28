'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import RouteGuard from '@/components/auth/RouteGuard'
import AdminAnalyticsDashboard from '@/components/admin/AdminAnalyticsDashboard'
import UserManagement from '@/components/admin/UserManagement'
import SystemMonitoring from '@/components/admin/SystemMonitoring'
import CouponManager from '@/components/admin/CouponManager'
import { useToastHelpers } from '@/components/ui/toast'
import { SkeletonDashboard } from '@/components/ui/skeleton'
import { PageTransition, CardTransition, ButtonTransition } from '@/components/ui/PageTransition'
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
  const { success, error: showError } = useToastHelpers()

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        showError('Acesso de admin necessário')
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
        showError('Acesso negado - Apenas administradores')
        window.location.href = '/login?error=admin_access_denied'
        return
      }

      setUser({
        id: user.id,
        email: user.email || '',
        name: profile.name,
        type: profile.type
      })
      success('Bem-vindo ao painel administrativo!')
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
    return <SkeletonDashboard />
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
      <PageTransition>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <CardTransition>
            <div className="bg-white shadow-sm border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-3 md:py-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-2 md:mr-3">
                      <span className="text-white font-bold text-sm md:text-lg">A</span>
                    </div>
                    <div>
                      <h1 className="text-lg md:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                      <p className="text-xs md:text-sm text-gray-500 hidden sm:block">Controle total da plataforma InstaAuto</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 md:gap-4">
                    <div className="text-right hidden md:block">
                      <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin'}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <ButtonTransition>
                      <motion.button
                        onClick={handleLogout}
                        className="bg-red-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-red-700 transition-all flex items-center gap-1 md:gap-2 text-sm md:text-base"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Sair</span>
                      </motion.button>
                    </ButtonTransition>
                  </div>
                </div>
              </div>
            </div>
          </CardTransition>

          {/* Navigation Tabs */}
          <CardTransition delay={0.1}>
            <div className="bg-white shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex space-x-4 md:space-x-8 overflow-x-auto">
                  {tabs.map((tab, index) => (
                    <ButtonTransition key={tab.id} delay={index * 0.05}>
                      <button
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`py-3 md:py-4 px-1 border-b-2 font-medium text-xs md:text-sm transition-all whitespace-nowrap ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-1 md:gap-2">
                          <tab.icon className="w-4 h-4 md:w-5 md:h-5" />
                          <span className="hidden sm:inline">{tab.label}</span>
                        </div>
                      </button>
                    </ButtonTransition>
                  ))}
                </nav>
              </div>
            </div>
          </CardTransition>

          {/* Content */}
          <CardTransition delay={0.2}>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 p-4 md:p-6"
            >
              {activeTab === 'analytics' && <AdminAnalyticsDashboard />}
              {activeTab === 'users' && <UserManagement />}
              {activeTab === 'workshops' && <WorkshopsManagement />}
              {activeTab === 'coupons' && <CouponManager />}
              {activeTab === 'monitoring' && <SystemMonitoring />}
            </motion.div>
          </CardTransition>
        </div>
      </PageTransition>
    </RouteGuard>
  )
}

// Component para gerenciamento de oficinas (reutilizar código existente)
function WorkshopsManagement() {
  return (
    <CardTransition>
      <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-bold mb-4">🔧 Gerenciamento de Oficinas</h2>
        <p className="text-gray-600 mb-4 text-sm md:text-base">
          Funcionalidade de gerenciamento de oficinas será integrada aqui.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
          <p className="text-blue-800 text-xs md:text-sm">
            💡 <strong>Próxima implementação:</strong> Interface completa para gerenciar oficinas, 
            verificações, planos e configurações avançadas.
          </p>
        </div>
      </div>
    </CardTransition>
  )
}
