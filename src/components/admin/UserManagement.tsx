'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  UsersIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  UserPlusIcon,
  BuildingOfficeIcon,
  TruckIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { supabase } from '@/lib/supabase'

interface User {
  id: string
  email: string
  name?: string
  type: 'motorista' | 'oficina' | 'admin'
  created_at: string
  last_sign_in_at?: string
  email_confirmed_at?: string
  phone?: string
  avatar_url?: string
  is_active: boolean
  plan_type?: 'free' | 'pro'
  trial_ends_at?: string
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'motorista' | 'oficina' | 'admin'>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, filterType])

  const loadUsers = async () => {
    try {
      setLoading(true)
      
      // Buscar perfis com informações das oficinas se aplicável
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          *,
          workshops(plan_type, trial_ends_at, is_trial)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao carregar usuários:', error)
        return
      }

      // Processar dados
      const processedUsers: User[] = profiles?.map(profile => ({
        id: profile.id,
        email: profile.email,
        name: profile.name,
        type: profile.type,
        created_at: profile.created_at,
        phone: profile.phone,
        avatar_url: profile.avatar_url,
        is_active: true, // Assumindo que todos estão ativos
        plan_type: profile.workshops?.[0]?.plan_type,
        trial_ends_at: profile.workshops?.[0]?.trial_ends_at
      })) || []

      setUsers(processedUsers)
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    // Filtro por tipo
    if (filterType !== 'all') {
      filtered = filtered.filter(user => user.type === filterType)
    }

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredUsers(filtered)
  }

  const handleUserAction = async (userId: string, action: 'activate' | 'deactivate' | 'delete') => {
    try {
      switch (action) {
        case 'delete':
          // Confirm deletion
          if (!confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
            return
          }
          
          const { error } = await supabase.auth.admin.deleteUser(userId)
          if (error) throw error
          
          // Atualizar lista local
          setUsers(users.filter(u => u.id !== userId))
          break

        case 'activate':
        case 'deactivate':
          // Aqui você implementaria a lógica de ativar/desativar
          // Por enquanto, apenas atualizar o estado local
          setUsers(users.map(u => 
            u.id === userId ? { ...u, is_active: action === 'activate' } : u
          ))
          break
      }
    } catch (error) {
      console.error(`Erro ao ${action} usuário:`, error)
      alert(`Erro ao ${action} usuário. Tente novamente.`)
    }
  }

  const getStatusBadge = (user: User) => {
    if (user.type === 'oficina' && user.plan_type === 'pro') {
      const trialEndsAt = user.trial_ends_at ? new Date(user.trial_ends_at) : null
      const isTrialActive = trialEndsAt && trialEndsAt > new Date()
      
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          isTrialActive ? 'bg-yellow-100 text-yellow-800' : 'bg-purple-100 text-purple-800'
        }`}>
          {isTrialActive ? '⏰ Trial PRO' : '👑 PRO'}
        </span>
      )
    }
    
    if (user.type === 'oficina') {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          🆓 FREE
        </span>
      )
    }
    
    if (user.type === 'admin') {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          👨‍💼 Admin
        </span>
      )
    }
    
    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        🚗 Motorista
      </span>
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'motorista': return <TruckIcon className="w-4 h-4 text-blue-600" />
      case 'oficina': return <BuildingOfficeIcon className="w-4 h-4 text-green-600" />
      case 'admin': return <UsersIcon className="w-4 h-4 text-red-600" />
      default: return <UsersIcon className="w-4 h-4 text-gray-600" />
    }
  }

  const stats = {
    total: users.length,
    motoristas: users.filter(u => u.type === 'motorista').length,
    oficinas: users.filter(u => u.type === 'oficina').length,
    admins: users.filter(u => u.type === 'admin').length,
    proUsers: users.filter(u => u.plan_type === 'pro').length
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-24"></div>
            ))}
          </div>
          <div className="bg-gray-200 rounded-xl h-96"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <UsersIcon className="w-8 h-8 text-blue-600" />
            Gerenciamento de Usuários
          </h1>
          <p className="text-gray-600 mt-1">Controle total dos usuários da plataforma</p>
        </div>
        
        <motion.button
          onClick={() => setShowUserModal(true)}
          className="mt-4 md:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <UserPlusIcon className="w-4 h-4" />
          Novo Usuário
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total" value={stats.total} icon={UsersIcon} color="bg-gray-100 text-gray-600" />
        <StatCard title="Motoristas" value={stats.motoristas} icon={TruckIcon} color="bg-blue-100 text-blue-600" />
        <StatCard title="Oficinas" value={stats.oficinas} icon={BuildingOfficeIcon} color="bg-green-100 text-green-600" />
        <StatCard title="Usuários PRO" value={stats.proUsers} icon={UsersIcon} color="bg-purple-100 text-purple-600" />
        <StatCard title="Admins" value={stats.admins} icon={UsersIcon} color="bg-red-100 text-red-600" />
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por email ou nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <FunnelIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="pl-10 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos os tipos</option>
              <option value="motorista">Motoristas</option>
              <option value="oficina">Oficinas</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Criado em
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {filteredUsers.map((user) => (
                  <motion.tr 
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name || 'Nome não informado'}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(user.type)}
                        <span className="text-sm text-gray-900 capitalize">{user.type}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user)
                            setShowUserModal(true)
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Ver detalhes"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => {
                            setSelectedUser(user)
                            setShowUserModal(true)
                          }}
                          className="text-green-600 hover:text-green-900 p-1 rounded"
                          title="Editar"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        
                        {user.type !== 'admin' && (
                          <button
                            onClick={() => handleUserAction(user.id, 'delete')}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Excluir"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum usuário encontrado</h3>
            <p className="text-gray-500">Ajuste os filtros ou adicione novos usuários.</p>
          </div>
        )}
      </div>

      {/* User Modal */}
      <UserModal 
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false)
          setSelectedUser(null)
        }}
        user={selectedUser}
        onSave={loadUsers}
      />
    </div>
  )
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )
}

function UserModal({ isOpen, onClose, user, onSave }: any) {
  if (!isOpen) return null

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">
            {user ? 'Detalhes do Usuário' : 'Novo Usuário'}
          </h2>
          
          {user && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome</label>
                  <p className="mt-1 text-sm text-gray-900">{user.name || 'Não informado'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tipo</label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{user.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefone</label>
                  <p className="mt-1 text-sm text-gray-900">{user.phone || 'Não informado'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Criado em</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(user.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
                {user.plan_type && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Plano</label>
                    <p className="mt-1 text-sm text-gray-900 uppercase">{user.plan_type}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Fechar
            </button>
            <button
              onClick={() => {
                onSave()
                onClose()
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Salvar
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
