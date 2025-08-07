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
  ExclamationTriangleIcon,
  StarIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

type ClientStatus = 'ativo' | 'inativo' | 'potencial'

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
    status: "ativo",
    createdAt: "2021-05-10T14:30:00Z",
    lastVisit: "2023-10-12T10:15:00Z",
    vehicles: [
      { id: "V-001", make: "Honda", model: "Civic", year: 2020, plate: "ABC-1234" }
    ],
    totalSpent: 1200,
    totalServices: 5
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
    totalSpent: 800,
    totalServices: 3
  },
  {
    id: "C-003",
    name: "Carlos Oliveira",
    phone: "(11) 95555-1234",
    status: "potencial",
    createdAt: "2023-10-01T13:10:00Z",
    vehicles: [
      { id: "V-004", make: "Ford", model: "Focus", year: 2018, plate: "GHI-9012" }
    ],
    totalSpent: 0,
    totalServices: 0
  }
]

const statusColors = {
  ativo: 'bg-green-100 text-green-800 border-green-200',
  inativo: 'bg-gray-100 text-gray-800 border-gray-200',
  potencial: 'bg-blue-100 text-blue-800 border-blue-200'
}

const statusLabels = {
  ativo: 'Ativo',
  inativo: 'Inativo',
  potencial: 'Potencial'
}

export default function ClientesClient() {
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<ClientStatus | 'todos'>('todos')

  // Limite FREE
  const maxClients = 10
  const currentClients = clients.length

  // Filtros e ordenação
  const filteredClients = clients
    .filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.phone.includes(searchTerm) ||
                           (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesStatus = selectedStatus === 'todos' || client.status === selectedStatus
      return matchesSearch && matchesStatus
    })

  // Estatísticas
  const stats = {
    total: clients.length,
    ativos: clients.filter(c => c.status === 'ativo').length,
    potenciais: clients.filter(c => c.status === 'potencial').length,
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

  // Verificar se está próximo do limite
  const isNearLimit = currentClients >= maxClients * 0.8
  const isAtLimit = currentClients >= maxClients

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BeautifulSidebar 
        userType="oficina-free"
        userName="Oficina FREE"
        userEmail="oficina@email.com"
        onLogout={() => {}}
      />
      
      <div className="flex-1 md:ml-64 transition-all duration-300">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">👥 Gestão de Clientes</h1>
              <p className="text-gray-600">Gerencie sua base de clientes (Plano FREE)</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Contador de limite */}
              <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
                isAtLimit ? 'bg-red-100 text-red-800' : 
                isNearLimit ? 'bg-yellow-100 text-yellow-800' : 
                'bg-green-100 text-green-800'
              }`}>
                {currentClients}/{maxClients} clientes
              </div>
              
              <button 
                disabled={isAtLimit}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                  isAtLimit 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                }`}
              >
                <PlusIcon className="w-5 h-5" />
                {isAtLimit ? 'Limite Atingido' : 'Novo Cliente'}
              </button>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-6">

              {/* Alerta de Limite */}
              {(isNearLimit || isAtLimit) && (
                <motion.div 
                  className={`mb-6 p-4 rounded-xl border-l-4 ${
                    isAtLimit 
                      ? 'bg-red-50 border-red-500' 
                      : 'bg-yellow-50 border-yellow-500'
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-3">
                    <ExclamationTriangleIcon className={`w-6 h-6 ${
                      isAtLimit ? 'text-red-600' : 'text-yellow-600'
                    }`} />
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        isAtLimit ? 'text-red-800' : 'text-yellow-800'
                      }`}>
                        {isAtLimit 
                          ? 'Limite de clientes atingido!' 
                          : 'Você está próximo do limite de clientes'
                        }
                      </h3>
                      <p className={`text-sm ${
                        isAtLimit ? 'text-red-700' : 'text-yellow-700'
                      }`}>
                        {isAtLimit 
                          ? `Faça upgrade para o plano PRO para ter clientes ilimitados.`
                          : `Você tem ${maxClients - currentClients} slots restantes. Considere fazer upgrade.`
                        }
                      </p>
                    </div>
                    <Link href="/oficina-free/upgrade">
                      <button className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        isAtLimit 
                          ? 'bg-red-600 text-white hover:bg-red-700' 
                          : 'bg-yellow-600 text-white hover:bg-yellow-700'
                      }`}>
                        Fazer Upgrade
                      </button>
                    </Link>
                  </div>
                </motion.div>
              )}

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
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: `${(currentClients/maxClients)*100}%`}}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{currentClients}/{maxClients} limite FREE</p>
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
                      <p className="text-gray-600 text-sm">Potenciais</p>
                      <p className="text-3xl font-bold text-blue-600">{stats.potenciais}</p>
                    </div>
                    <StarIcon className="w-12 h-12 text-blue-400 opacity-50" />
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
                    <div className="text-green-500 text-2xl">💰</div>
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
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Filtro por Status */}
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as ClientStatus | 'todos')}
                  >
                    <option value="todos">Todos os Status</option>
                    <option value="ativo">Ativo</option>
                    <option value="potencial">Potencial</option>
                    <option value="inativo">Inativo</option>
                  </select>

                  {/* Funcionalidades PRO */}
                  <div className="relative">
                    <button 
                      disabled
                      className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed flex items-center gap-2"
                      title="Disponível no plano PRO"
                    >
                      <ArrowUpTrayIcon className="w-5 h-5" />
                      Exportar
                      <LockClosedIcon className="w-4 h-4" />
                    </button>
                  </div>
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
                              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold">
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
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[client.status]}`}>
                              {statusLabels[client.status]}
                            </span>
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
                              <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
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

              {/* Banner de Upgrade */}
              <motion.div 
                className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Upgrade para PRO</h3>
                    <p className="text-green-100">Clientes ilimitados, relatórios avançados e muito mais!</p>
                  </div>
                  <Link href="/oficina-free/upgrade">
                    <button className="bg-white text-green-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all">
                      Ver Planos
                    </button>
                  </Link>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
