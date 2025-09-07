'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useToastAdvanced } from '@/components/ui/ToastAdvanced'
import { 
  PlusIcon, 
  TagIcon, 
  CalendarDaysIcon, 
  UserGroupIcon,
  ChartBarIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline'

interface Coupon {
  id: string
  code: string
  discount_percentage: number
  influencer_commission_percentage: number
  max_uses: number
  current_uses: number
  expires_at: string
  is_active: boolean
  created_at: string
  description?: string
  influencer_name?: string
  influencer_email?: string
}

export default function CouponManager() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [stats, setStats] = useState({
    totalCoupons: 0,
    activeCoupons: 0,
    totalUses: 0,
    totalRevenue: 0
  })
  
  const { toast } = useToastAdvanced()

  useEffect(() => {
    loadCoupons()
    loadStats()
  }, [])

  const loadCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCoupons(data || [])
    } catch (error) {
      console.error('Erro ao carregar cupons:', error)
      toast.error('Erro ao carregar cupons', 'Tente novamente')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const { data: couponsData } = await supabase
        .from('coupons')
        .select('*')

      if (couponsData) {
        const totalCoupons = couponsData.length
        const activeCoupons = couponsData.filter(c => c.is_active && new Date(c.expires_at) > new Date()).length
        const totalUses = couponsData.reduce((sum, c) => sum + c.current_uses, 0)
        const totalRevenue = totalUses * 89 // Assumindo R$ 89 por uso PRO

        setStats({ totalCoupons, activeCoupons, totalUses, totalRevenue })
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    }
  }

  const deleteCoupon = async (couponId: string) => {
    if (!confirm('Tem certeza que deseja excluir este cupom?')) return

    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', couponId)

      if (error) throw error

      setCoupons(prev => prev.filter(c => c.id !== couponId))
      loadStats()
      toast.success('Cupom excluído', 'Cupom removido com sucesso')
    } catch (error) {
      console.error('Erro ao excluir cupom:', error)
      toast.error('Erro ao excluir cupom', 'Tente novamente')
    }
  }

  const toggleCouponStatus = async (couponId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .update({ is_active: !currentStatus })
        .eq('id', couponId)

      if (error) throw error

      setCoupons(prev => prev.map(c => 
        c.id === couponId ? { ...c, is_active: !currentStatus } : c
      ))
      loadStats()
      toast.success(
        !currentStatus ? 'Cupom ativado' : 'Cupom desativado',
        'Status atualizado com sucesso'
      )
    } catch (error) {
      console.error('Erro ao alterar status do cupom:', error)
      toast.error('Erro ao alterar status', 'Tente novamente')
    }
  }

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success('Código copiado!', 'Cole onde desejar')
  }

  const getStatusColor = (coupon: Coupon) => {
    if (!coupon.is_active) return 'gray'
    if (new Date(coupon.expires_at) < new Date()) return 'red'
    if (coupon.current_uses >= coupon.max_uses) return 'yellow'
    return 'green'
  }

  const getStatusText = (coupon: Coupon) => {
    if (!coupon.is_active) return 'Inativo'
    if (new Date(coupon.expires_at) < new Date()) return 'Expirado'
    if (coupon.current_uses >= coupon.max_uses) return 'Esgotado'
    return 'Ativo'
  }

  if (loading) {
    return <CouponManagerSkeleton />
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">💰 Gerenciar Cupons</h1>
          <p className="text-gray-600 mt-1">Crie e gerencie cupons para influenciadores</p>
        </div>
        
        <motion.button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <PlusIcon className="w-5 h-5" />
          <span>Criar Cupom</span>
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total de Cupons', value: stats.totalCoupons, icon: TagIcon, color: 'blue' },
          { label: 'Cupons Ativos', value: stats.activeCoupons, icon: CalendarDaysIcon, color: 'green' },
          { label: 'Total de Usos', value: stats.totalUses, icon: UserGroupIcon, color: 'purple' },
          { label: 'Receita Gerada', value: `R$ ${stats.totalRevenue.toFixed(2)}`, icon: ChartBarIcon, color: 'yellow' }
        ].map((stat, index) => {
          const Icon = stat.icon
          const colors = {
            blue: 'from-blue-500 to-blue-600',
            green: 'from-green-500 to-green-600',
            purple: 'from-purple-500 to-purple-600',
            yellow: 'from-yellow-500 to-yellow-600'
          }
          
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 bg-gradient-to-r ${colors[stat.color as keyof typeof colors]} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Coupons Table */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Lista de Cupons</h2>
        </div>
        
        {coupons.length === 0 ? (
          <div className="p-12 text-center">
            <TagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum cupom criado</h3>
            <p className="text-gray-600 mb-6">Crie seu primeiro cupom para começar</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Criar Primeiro Cupom
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Influencer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Desconto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comissão</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {coupons.map((coupon, index) => (
                  <motion.tr
                    key={coupon.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{coupon.code}</span>
                        <button
                          onClick={() => copyCouponCode(coupon.code)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <DocumentDuplicateIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{coupon.influencer_name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{coupon.influencer_email || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{coupon.discount_percentage}%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{coupon.influencer_commission_percentage}%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{coupon.current_uses}/{coupon.max_uses}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        getStatusColor(coupon) === 'green' ? 'bg-green-100 text-green-800' :
                        getStatusColor(coupon) === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                        getStatusColor(coupon) === 'red' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {getStatusText(coupon)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingCoupon(coupon)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleCouponStatus(coupon.id, coupon.is_active)}
                          className={`${coupon.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteCoupon(coupon.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <CouponModal
        isOpen={showCreateModal || !!editingCoupon}
        onClose={() => {
          setShowCreateModal(false)
          setEditingCoupon(null)
        }}
        coupon={editingCoupon}
        onSave={() => {
          loadCoupons()
          loadStats()
          setShowCreateModal(false)
          setEditingCoupon(null)
        }}
      />
    </div>
  )
}

// Modal Component
function CouponModal({ isOpen, onClose, coupon, onSave }: any) {
  const [formData, setFormData] = useState({
    code: '',
    discount_percentage: 10,
    influencer_commission_percentage: 5,
    max_uses: 50,
    expires_at: '',
    description: '',
    influencer_name: '',
    influencer_email: ''
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToastAdvanced()

  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code,
        discount_percentage: coupon.discount_percentage,
        influencer_commission_percentage: coupon.influencer_commission_percentage,
        max_uses: coupon.max_uses,
        expires_at: coupon.expires_at.split('T')[0],
        description: coupon.description || '',
        influencer_name: coupon.influencer_name || '',
        influencer_email: coupon.influencer_email || ''
      })
    } else {
      // Generate random code for new coupon
      const randomCode = 'CUPOM' + Math.random().toString(36).substring(2, 8).toUpperCase()
      setFormData(prev => ({
        ...prev,
        code: randomCode,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
      }))
    }
  }, [coupon, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (coupon) {
        // Update existing coupon
        const { error } = await supabase
          .from('coupons')
          .update(formData)
          .eq('id', coupon.id)

        if (error) throw error
        toast.success('Cupom atualizado!', 'Alterações salvas com sucesso')
      } else {
        // Create new coupon
        const { error } = await supabase
          .from('coupons')
          .insert([{ ...formData, is_active: true, current_uses: 0 }])

        if (error) throw error
        toast.success('Cupom criado!', 'Novo cupom adicionado com sucesso')
      }

      onSave()
    } catch (error: any) {
      console.error('Erro ao salvar cupom:', error)
      toast.error('Erro ao salvar cupom', error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {coupon ? 'Editar Cupom' : 'Criar Novo Cupom'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Código do Cupom</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data de Expiração</label>
              <input
                type="date"
                value={formData.expires_at}
                onChange={(e) => setFormData(prev => ({ ...prev, expires_at: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Desconto (%)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.discount_percentage}
                onChange={(e) => setFormData(prev => ({ ...prev, discount_percentage: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Comissão Influencer (%)</label>
              <input
                type="number"
                min="1"
                max="50"
                value={formData.influencer_commission_percentage}
                onChange={(e) => setFormData(prev => ({ ...prev, influencer_commission_percentage: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Máximo de Usos</label>
              <input
                type="number"
                min="1"
                value={formData.max_uses}
                onChange={(e) => setFormData(prev => ({ ...prev, max_uses: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Influencer</label>
              <input
                type="text"
                value={formData.influencer_name}
                onChange={(e) => setFormData(prev => ({ ...prev, influencer_name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Nome do influenciador"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email do Influencer</label>
            <input
              type="email"
              value={formData.influencer_email}
              onChange={(e) => setFormData(prev => ({ ...prev, influencer_email: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="email@influencer.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Descrição opcional do cupom"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Salvando...' : coupon ? 'Atualizar' : 'Criar Cupom'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// Skeleton Component
function CouponManagerSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>
        <div className="h-12 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-14 w-14 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
