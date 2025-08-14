'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  StarIcon,
  CheckBadgeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import WorkshopModal from './components/WorkshopModal'

interface Workshop {
  id: string
  business_name: string
  address: any
  phone?: string
  email?: string
  services: string[]
  specialties: string[]
  rating: number
  total_reviews: number
  verified: boolean
  plan_type: 'free' | 'pro'
  is_trial: boolean
  trial_ends_at?: string
  created_at: string
  updated_at: string
}

interface AdminUser {
  id: string
  email: string
  name?: string
  type: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [filteredWorkshops, setFilteredWorkshops] = useState<Workshop[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPlan, setFilterPlan] = useState<'all' | 'free' | 'pro'>('all')
  const [filterVerified, setFilterVerified] = useState<'all' | 'verified' | 'unverified'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view')
  const itemsPerPage = 10

  useEffect(() => {
    checkAdminAccess()
  }, [])

  useEffect(() => {
    if (user) {
      fetchWorkshops()
    }
  }, [user])

  useEffect(() => {
    filterWorkshops()
  }, [workshops, searchTerm, filterPlan, filterVerified])

  const checkAdminAccess = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        router.push('/login?error=admin_access_required')
        return
      }

      // Verificar se é admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!profile || profile.type !== 'admin') {
        router.push('/login?error=admin_access_denied')
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
      router.push('/login?error=admin_verification_failed')
    } finally {
      setLoading(false)
    }
  }

  const fetchWorkshops = async () => {
    try {
      const { data, error } = await supabase
        .from('workshops')
        .select(`
          *,
          profiles!inner(
            name,
            email
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      const workshopsWithProfile = data.map(workshop => ({
        ...workshop,
        email: workshop.profiles?.email || '',
        owner_name: workshop.profiles?.name || ''
      }))

      setWorkshops(workshopsWithProfile)
    } catch (error) {
      console.error('Erro ao buscar oficinas:', error)
    }
  }

  const filterWorkshops = () => {
    let filtered = workshops

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(workshop =>
        workshop.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workshop.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workshop.address?.cidade?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por plano
    if (filterPlan !== 'all') {
      filtered = filtered.filter(workshop => workshop.plan_type === filterPlan)
    }

    // Filtro por verificação
    if (filterVerified !== 'all') {
      filtered = filtered.filter(workshop => 
        filterVerified === 'verified' ? workshop.verified : !workshop.verified
      )
    }

    setFilteredWorkshops(filtered)
    setCurrentPage(1)
  }

  const handleCreateWorkshop = () => {
    setSelectedWorkshop(null)
    setModalMode('create')
    setShowModal(true)
  }

  const handleEditWorkshop = (workshop: Workshop) => {
    setSelectedWorkshop(workshop)
    setModalMode('edit')
    setShowModal(true)
  }

  const handleViewWorkshop = (workshop: Workshop) => {
    setSelectedWorkshop(workshop)
    setModalMode('view')
    setShowModal(true)
  }

  const handleDeleteWorkshop = async (workshopId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta oficina? Esta ação não pode ser desfeita.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('workshops')
        .delete()
        .eq('id', workshopId)

      if (error) throw error

      await fetchWorkshops()
      alert('Oficina excluída com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir oficina:', error)
      alert('Erro ao excluir oficina')
    }
  }

  const toggleVerification = async (workshopId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('workshops')
        .update({ verified: !currentStatus })
        .eq('id', workshopId)

      if (error) throw error

      await fetchWorkshops()
    } catch (error) {
      console.error('Erro ao alterar verificação:', error)
    }
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

  // Paginação
  const totalPages = Math.ceil(filteredWorkshops.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentWorkshops = filteredWorkshops.slice(startIndex, endIndex)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Image
                src="/images/logo.svg"
                alt="InstaAuto"
                width={40}
                height={40}
                className="mr-3"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
                <p className="text-sm text-gray-500">Bem-vindo, {user?.name || user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => supabase.auth.signOut()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <BuildingStorefrontIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Oficinas</p>
                <p className="text-2xl font-bold text-gray-900">{workshops.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckBadgeIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Verificadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {workshops.filter(w => w.verified).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <StarIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Plano PRO</p>
                <p className="text-2xl font-bold text-gray-900">
                  {workshops.filter(w => w.plan_type === 'pro').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <MapPinIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Em Trial</p>
                <p className="text-2xl font-bold text-gray-900">
                  {workshops.filter(w => w.is_trial).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome, email ou cidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                <select
                  value={filterPlan}
                  onChange={(e) => setFilterPlan(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos os Planos</option>
                  <option value="free">FREE</option>
                  <option value="pro">PRO</option>
                </select>

                <select
                  value={filterVerified}
                  onChange={(e) => setFilterVerified(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todas</option>
                  <option value="verified">Verificadas</option>
                  <option value="unverified">Não Verificadas</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <Link
                href="/admin/demo-users"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 text-sm"
              >
                👥 Usuários Demo
              </Link>
              <Link
                href="/admin/seed"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
              >
                📋 Importar Oficinas
              </Link>
              <button
                onClick={handleCreateWorkshop}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <PlusIcon className="h-5 w-5" />
                Nova Oficina
              </button>
            </div>
          </div>
        </div>

        {/* Workshops Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Oficina
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Localização
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plano
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Criada em
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentWorkshops.map((workshop) => (
                  <tr key={workshop.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          {workshop.business_name}
                          {workshop.verified && (
                            <CheckBadgeIcon className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{workshop.email}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <StarIcon className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600">
                            {workshop.rating} ({workshop.total_reviews} avaliações)
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {workshop.address?.cidade || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {workshop.address?.bairro || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        workshop.plan_type === 'pro'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {workshop.plan_type.toUpperCase()}
                      </span>
                      {workshop.is_trial && (
                        <span className="ml-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                          TRIAL
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleVerification(workshop.id, workshop.verified)}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer ${
                          workshop.verified
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {workshop.verified ? 'Verificada' : 'Pendente'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(workshop.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewWorkshop(workshop)}
                          className="text-gray-600 hover:text-gray-900 p-1"
                          title="Visualizar"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditWorkshop(workshop)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Editar"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteWorkshop(workshop.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Excluir"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredWorkshops.length)} de {filteredWorkshops.length} oficinas
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </button>
                <span className="px-3 py-1 text-sm">
                  {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <WorkshopModal
        workshop={selectedWorkshop}
        mode={modalMode}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={fetchWorkshops}
      />
    </div>
  )
}
