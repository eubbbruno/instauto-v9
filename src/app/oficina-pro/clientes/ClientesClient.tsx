'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import BeautifulSidebar from '@/components/BeautifulSidebar'
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowUpTrayIcon,
  TagIcon,
  ChartBarIcon,
  ArrowPathIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

type ClientStatus = 'ativo' | 'inativo' | 'potencial' | 'vip'

type Vehicle = {
  id: string
  make: string
  model: string
  year: number
  plate: string
}

type Client = {
  id: string
  name: string
  email?: string
  phone: string
  photo?: string
  status: ClientStatus
  createdAt: string
  lastVisit?: string
  vehicles: Vehicle[]
  totalSpent: number
  totalServices: number
}

const mockClients: Client[] = [
  {
    id: "C-001",
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(11) 98765-4321",
    status: "vip",
    createdAt: "2021-05-10T14:30:00Z",
    lastVisit: "2023-10-12T10:15:00Z",
    vehicles: [
      { id: "V-001", make: "Honda", model: "Civic", year: 2020, plate: "ABC-1234" },
      { id: "V-002", make: "BMW", model: "X3", year: 2021, plate: "XYZ-9876" }
    ],
    totalSpent: 5400,
    totalServices: 12
  },
  {
    id: "C-002",
    name: "Maria Santos",
    email: "maria.santos@email.com",
    phone: "(11) 91234-5678",
    status: "ativo",
    createdAt: "2022-08-22T09:45:00Z",
    lastVisit: "2023-10-08T16:30:00Z",
    vehicles: [
      { id: "V-003", make: "Toyota", model: "Corolla", year: 2019, plate: "DEF-5678" }
    ],
    totalSpent: 2800,
    totalServices: 8
  },
  {
    id: "C-003",
    name: "Carlos Oliveira",
    email: "carlos.oliveira@email.com",
    phone: "(11) 95555-1234",
    status: "ativo",
    createdAt: "2023-01-15T11:20:00Z",
    lastVisit: "2023-10-05T14:45:00Z",
    vehicles: [
      { id: "V-004", make: "Ford", model: "Focus", year: 2018, plate: "GHI-9012" }
    ],
    totalSpent: 1900,
    totalServices: 5
  },
  {
    id: "C-004",
    name: "Ana Costa",
    phone: "(11) 97777-8888",
    status: "potencial",
    createdAt: "2023-10-01T13:10:00Z",
    vehicles: [
      { id: "V-005", make: "Volkswagen", model: "Golf", year: 2017, plate: "JKL-3456" }
    ],
    totalSpent: 0,
    totalServices: 0
  },
  {
    id: "C-005",
    name: "Roberto Ferreira",
    email: "roberto.ferreira@email.com",
    phone: "(11) 96666-2222",
    status: "inativo",
    createdAt: "2021-12-03T16:00:00Z",
    lastVisit: "2023-02-20T10:30:00Z",
    vehicles: [
      { id: "V-006", make: "Chevrolet", model: "Cruze", year: 2016, plate: "MNO-7890" }
    ],
    totalSpent: 850,
    totalServices: 3
  }
]

const statusColors = {
  ativo: 'bg-green-100 text-green-800 border-green-200',
  inativo: 'bg-gray-100 text-gray-800 border-gray-200',
  potencial: 'bg-blue-100 text-blue-800 border-blue-200',
  vip: 'bg-purple-100 text-purple-800 border-purple-200'
}

const statusLabels = {
  ativo: 'Ativo',
  inativo: 'Inativo',
  potencial: 'Potencial',
  vip: 'VIP'
}

export default function ClientesClient() {
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<ClientStatus | 'todos'>('todos')
  const [sortBy, setSortBy] = useState<'name' | 'totalSpent' | 'lastVisit'>('name')

  // Filtros e ordenação
  const filteredClients = clients
    .filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.phone.includes(searchTerm) ||
                           (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesStatus = selectedStatus === 'todos' || client.status === selectedStatus
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'totalSpent':
          return b.totalSpent - a.totalSpent
        case 'lastVisit':
          if (!a.lastVisit && !b.lastVisit) return 0
          if (!a.lastVisit) return 1
          if (!b.lastVisit) return -1
          return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()
        default:
          return 0
      }
    })

  // Estatísticas
  const stats = {
    total: clients.length,
    ativos: clients.filter(c => c.status === 'ativo').length,
    vips: clients.filter(c => c.status === 'vip').length,
    totalReceita: clients.reduce((sum, c) => sum + c.totalSpent, 0)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BeautifulSidebar 
        userType="oficina-pro"
        userName="Oficina PRO"
        userEmail="oficina@email.com"
        onLogout={() => {}}
      />
      
      <div className="flex-1 md:ml-64 transition-all duration-300">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">👥 Gestão de Clientes</h1>
              <p className="text-gray-600">Gerencie sua base de clientes e relacionamentos</p>
            </div>
            <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl hover:from-orange-600 hover:to-red-600 flex items-center gap-2 transition-all">
              <PlusIcon className="w-5 h-5" />
              Novo Cliente
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-6 max-w-7xl mx-auto">

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total de Clientes</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                    <UserCircleIcon className="w-12 h-12 text-gray-400 opacity-50" />
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Clientes Ativos</p>
                      <p className="text-3xl font-bold text-green-600">{stats.ativos}</p>
                    </div>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Clientes VIP</p>
                      <p className="text-3xl font-bold text-purple-600">{stats.vips}</p>
                    </div>
                    <StarIconSolid className="w-12 h-12 text-purple-400 opacity-50" />
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Receita Total</p>
                      <p className="text-3xl font-bold text-green-600">{formatCurrency(stats.totalReceita)}</p>
                    </div>
                    <ChartBarIcon className="w-12 h-12 text-green-400 opacity-50" />
                  </div>
                </motion.div>
              </div>

              {/* Filtros e Busca */}
              <motion.div 
                className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Busca */}
                  <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar por nome, telefone ou email..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Filtro por Status */}
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as ClientStatus | 'todos')}
                  >
                    <option value="todos">Todos os Status</option>
                    <option value="ativo">Ativo</option>
                    <option value="vip">VIP</option>
                    <option value="potencial">Potencial</option>
                    <option value="inativo">Inativo</option>
                  </select>

                  {/* Ordenação */}
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'totalSpent' | 'lastVisit')}
                  >
                    <option value="name">Ordenar por Nome</option>
                    <option value="totalSpent">Ordenar por Gasto</option>
                    <option value="lastVisit">Ordenar por Última Visita</option>
                  </select>

                  {/* Botão de Exportar */}
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2">
                    <ArrowUpTrayIcon className="w-5 h-5" />
                    Exportar
                  </button>
                </div>
              </motion.div>

              {/* Lista de Clientes */}
              <motion.div 
                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Cliente</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contato</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Veículos</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Gastos</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Última Visita</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredClients.map((client, index) => (
                        <motion.tr 
                          key={client.id}
                          className="hover:bg-gray-50 transition-colors"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {client.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{client.name}</p>
                                <p className="text-sm text-gray-500">#{client.id}</p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <PhoneIcon className="w-4 h-4 text-gray-400" />
                                <span>{client.phone}</span>
                              </div>
                              {client.email && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                                  <span>{client.email}</span>
                                </div>
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[client.status]}`}>
                                {statusLabels[client.status]}
                              </span>
                              {client.status === 'vip' && (
                                <StarIconSolid className="w-4 h-4 text-purple-500" />
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              {client.vehicles.slice(0, 2).map(vehicle => (
                                <div key={vehicle.id} className="text-sm">
                                  <span className="font-medium">{vehicle.make} {vehicle.model}</span>
                                  <span className="text-gray-500 ml-2">{vehicle.plate}</span>
                                </div>
                              ))}
                              {client.vehicles.length > 2 && (
                                <p className="text-xs text-gray-500">+{client.vehicles.length - 2} mais</p>
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div>
                              <p className="font-semibold text-green-600">{formatCurrency(client.totalSpent)}</p>
                              <p className="text-sm text-gray-500">{client.totalServices} serviços</p>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-900">
                              {client.lastVisit ? formatDate(client.lastVisit) : 'Nunca'}
                            </p>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                <PhoneIcon className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                <EnvelopeIcon className="w-4 h-4" />
                              </button>
                              <button className="px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors">
                                Ver Detalhes
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredClients.length === 0 && (
                  <div className="text-center py-12">
                    <UserCircleIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum cliente encontrado</p>
                    <p className="text-sm text-gray-400">Tente ajustar os filtros de busca</p>
                  </div>
                )}
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}