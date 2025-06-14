"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  MagnifyingGlassIcon, 
  PlusIcon,
  FunnelIcon,
  UserCircleIcon,
  ChevronDownIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  TagIcon,
  DocumentDuplicateIcon,
  ArrowUpTrayIcon,
  ChatBubbleLeftIcon,
  ChartBarIcon,
  ArrowPathIcon,
  CalendarDaysIcon
} from "@heroicons/react/24/outline";

// Tipos para clientes
type ClientStatus = 'ativo' | 'inativo' | 'potencial' | 'vip';
type VehicleStatus = 'ativo' | 'inativo' | 'vendido';

type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  plate: string;
  color: string;
  vin?: string;
  lastService?: string;
  status: VehicleStatus;
};

type Client = {
  id: string;
  name: string;
  email?: string;
  phone: string;
  photo?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  status: ClientStatus;
  createdAt: string;
  lastVisit?: string;
  vehicles: Vehicle[];
  tags?: string[];
  totalSpent: number;
  totalServices: number;
};

// Dados mockados para clientes
const mockClients: Client[] = [
  {
    id: "C-001",
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(11) 98765-4321",
    address: "Av. Paulista, 1000",
    city: "São Paulo",
    state: "SP",
    postalCode: "01310-100",
    status: "ativo",
    createdAt: "2021-05-10T14:30:00Z",
    lastVisit: "2023-10-12T10:15:00Z",
    vehicles: [
      {
        id: "V-001",
        make: "Honda",
        model: "Civic",
        year: 2019,
        plate: "ABC-1234",
        color: "Prata",
        vin: "1HGCM82633A123456",
        lastService: "2023-10-12T10:15:00Z",
        status: "ativo"
      }
    ],
    tags: ["cliente recorrente", "pontual"],
    totalSpent: 3780.50,
    totalServices: 8
  },
  {
    id: "C-002",
    name: "Maria Oliveira",
    email: "maria.oliveira@email.com",
    phone: "(11) 97654-3210",
    photo: "https://randomuser.me/api/portraits/women/1.jpg",
    address: "Rua Augusta, 500",
    city: "São Paulo",
    state: "SP",
    postalCode: "01305-000",
    status: "vip",
    createdAt: "2020-03-15T09:45:00Z",
    lastVisit: "2023-10-05T14:30:00Z",
    vehicles: [
      {
        id: "V-002",
        make: "Toyota",
        model: "Corolla",
        year: 2020,
        plate: "DEF-5678",
        color: "Branco",
        vin: "5TFDZ5BN8KX123456",
        lastService: "2023-10-05T14:30:00Z",
        status: "ativo"
      },
      {
        id: "V-003",
        make: "Hyundai",
        model: "HB20",
        year: 2018,
        plate: "GHI-9012",
        color: "Azul",
        status: "vendido"
      }
    ],
    tags: ["cliente vip", "plano de manutenção"],
    totalSpent: 7450.75,
    totalServices: 15
  },
  {
    id: "C-003",
    name: "Carlos Santos",
    email: "carlos.santos@email.com",
    phone: "(11) 96543-2109",
    address: "Rua Oscar Freire, 200",
    city: "São Paulo",
    state: "SP",
    postalCode: "01426-000",
    status: "inativo",
    createdAt: "2022-01-20T11:30:00Z",
    lastVisit: "2023-02-18T09:00:00Z",
    vehicles: [
      {
        id: "V-004",
        make: "Volkswagen",
        model: "Gol",
        year: 2017,
        plate: "JKL-3456",
        color: "Vermelho",
        status: "inativo"
      }
    ],
    totalSpent: 1250.30,
    totalServices: 3
  },
  {
    id: "C-004",
    name: "Ana Costa",
    email: "ana.costa@email.com",
    phone: "(11) 95432-1098",
    photo: "https://randomuser.me/api/portraits/women/2.jpg",
    address: "Alameda Santos, 800",
    city: "São Paulo",
    state: "SP",
    postalCode: "01418-100",
    status: "ativo",
    createdAt: "2021-08-05T16:20:00Z",
    lastVisit: "2023-09-27T15:45:00Z",
    vehicles: [
      {
        id: "V-005",
        make: "Fiat",
        model: "Uno",
        year: 2016,
        plate: "MNO-7890",
        color: "Preto",
        lastService: "2023-09-27T15:45:00Z",
        status: "ativo"
      }
    ],
    tags: ["pontual"],
    totalSpent: 2180.90,
    totalServices: 5
  },
  {
    id: "C-005",
    name: "Pedro Almeida",
    email: "pedro.almeida@email.com",
    phone: "(11) 94321-0987",
    photo: "https://randomuser.me/api/portraits/men/2.jpg",
    status: "potencial",
    createdAt: "2023-09-10T10:00:00Z",
    vehicles: [],
    totalSpent: 0,
    totalServices: 0
  }
];

// Estatísticas de clientes
const clientStats = {
  totalClients: 124,
  activeClients: 98,
  inactiveClients: 18,
  potentialClients: 8,
  vipClients: 12,
  newClientsThisMonth: 4,
  retentionRate: 87
};

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClientStatus | 'all'>('all');
  const [vehicleFilter, setVehicleFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // Filtrar clientes
  const filteredClients = clients
    .filter(client => {
      // Filtro por termo de busca
      if (searchTerm && 
          !client.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !client.email?.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !client.phone.includes(searchTerm)) {
        return false;
      }
      
      // Filtro por status
      if (statusFilter !== 'all' && client.status !== statusFilter) {
        return false;
      }
      
      // Filtro por veículo
      if (vehicleFilter) {
        const hasMatchingVehicle = client.vehicles.some(vehicle => 
          vehicle.make.toLowerCase().includes(vehicleFilter.toLowerCase()) ||
          vehicle.model.toLowerCase().includes(vehicleFilter.toLowerCase()) ||
          vehicle.plate.toLowerCase().includes(vehicleFilter.toLowerCase())
        );
        
        if (!hasMatchingVehicle) return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Ordenação
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'lastVisit':
          if (!a.lastVisit) return 1;
          if (!b.lastVisit) return -1;
          return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
        case 'totalSpent':
          return b.totalSpent - a.totalSpent;
        default:
          return 0;
      }
    });
  
  // Funções auxiliares
  const getStatusText = (status: ClientStatus) => {
    const statuses: Record<ClientStatus, string> = {
      'ativo': 'Ativo',
      'inativo': 'Inativo',
      'potencial': 'Potencial',
      'vip': 'VIP'
    };
    
    return statuses[status] || status;
  };
  
  const getStatusClass = (status: ClientStatus) => {
    switch (status) {
      case 'ativo':
        return "bg-green-100 text-green-700 border-green-200";
      case 'inativo':
        return "bg-gray-100 text-gray-700 border-gray-200";
      case 'potencial':
        return "bg-blue-100 text-blue-700 border-blue-200";
      case 'vip':
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };
  
  // Formatação de valores
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  // Formatação de data
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  // Calcular tempo decorrido
  const getTimeAgo = (dateString?: string) => {
    if (!dateString) return 'Nunca';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return "Hoje";
    } else if (diffInDays === 1) {
      return "Ontem";
    } else if (diffInDays < 30) {
      return `${diffInDays} dias atrás`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return `${months} ${months === 1 ? 'mês' : 'meses'} atrás`;
    } else {
      const years = Math.floor(diffInDays / 365);
      return `${years} ${years === 1 ? 'ano' : 'anos'} atrás`;
    }
  };
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
            <p className="text-gray-500 text-sm mt-1">Gerencie seus clientes e veículos</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              className="px-4 py-2 bg-[#0047CC] text-white rounded-lg text-sm font-medium hover:bg-[#003CAD] transition-colors inline-flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Adicionar Cliente
            </button>
            
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors inline-flex items-center"
            >
              <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
              Importar
            </button>
          </div>
        </div>
      </div>
      
      {/* Estatísticas de clientes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Total de Clientes</h3>
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <UserCircleIcon className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{clientStats.totalClients}</p>
          <div className="mt-2 text-xs text-green-600 flex items-center">
            <ArrowPathIcon className="h-3 w-3 mr-1" />
            <span>+{clientStats.newClientsThisMonth} este mês</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Clientes Ativos</h3>
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <UserCircleIcon className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{clientStats.activeClients}</p>
          <div className="mt-2 text-xs text-gray-500">
            {Math.round((clientStats.activeClients / clientStats.totalClients) * 100)}% do total
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Clientes VIP</h3>
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <TagIcon className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{clientStats.vipClients}</p>
          <div className="mt-2 text-xs text-gray-500">
            {Math.round((clientStats.vipClients / clientStats.totalClients) * 100)}% do total
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Taxa de Retenção</h3>
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <ChartBarIcon className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{clientStats.retentionRate}%</p>
          <div className="mt-2 text-xs text-gray-500">
            Clientes que retornam
          </div>
        </div>
      </div>
      
      {/* Filtros e busca */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Campo de busca */}
          <div className="md:col-span-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nome, email ou telefone..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Filtros rápidos */}
          <div className="md:col-span-5 flex flex-wrap gap-2">
            {/* Filtro por status */}
            <select
              className="px-3 py-2 rounded-lg text-sm border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0047CC]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">Todos os status</option>
              <option value="ativo">Ativos</option>
              <option value="inativo">Inativos</option>
              <option value="potencial">Potenciais</option>
              <option value="vip">VIP</option>
            </select>
            
            {/* Filtro por veículo */}
            <div className="relative">
              <input
                type="text"
                placeholder="Filtrar por veículo..."
                className="px-3 py-2 rounded-lg text-sm border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0047CC]"
                value={vehicleFilter}
                onChange={(e) => setVehicleFilter(e.target.value)}
              />
            </div>
          </div>
          
          {/* Ordenação e filtros avançados */}
          <div className="md:col-span-2 flex justify-end gap-2">
            <select
              className="px-3 py-2 rounded-lg text-sm border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0047CC]"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Nome</option>
              <option value="lastVisit">Última visita</option>
              <option value="totalSpent">Valor gasto</option>
            </select>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 py-2 rounded-lg text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center"
            >
              <FunnelIcon className="h-4 w-4 mr-1" />
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
        
        {/* Filtros avançados (expandíveis) */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Período de cadastro</label>
              <select className="w-full px-3 py-2 rounded-lg text-sm border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0047CC]">
                <option>Todos os períodos</option>
                <option>Últimos 7 dias</option>
                <option>Últimos 30 dias</option>
                <option>Últimos 3 meses</option>
                <option>Últimos 6 meses</option>
                <option>Este ano</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de veículo</label>
              <select className="w-full px-3 py-2 rounded-lg text-sm border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0047CC]">
                <option>Todos os veículos</option>
                <option>Carros</option>
                <option>Motos</option>
                <option>Caminhões</option>
                <option>Utilitários</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Localização</label>
              <select className="w-full px-3 py-2 rounded-lg text-sm border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0047CC]">
                <option>Todas as localidades</option>
                <option>São Paulo - SP</option>
                <option>Campinas - SP</option>
                <option>Rio de Janeiro - RJ</option>
                <option>Outras localidades</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Lista de clientes */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Veículos
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Visita
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Gasto
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                        <div className="ml-4">
                          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                          <div className="h-3 bg-gray-200 rounded w-16 mt-2 animate-pulse"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
                    </td>
                  </tr>
                ))
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-gray-100 p-4 rounded-full mb-4">
                        <UserCircleIcon className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-1">Nenhum cliente encontrado</h3>
                      <p className="text-gray-500 mb-4">Tente ajustar seus filtros ou adicione um novo cliente</p>
                      <button
                        className="px-4 py-2 bg-[#0047CC] text-white rounded-lg text-sm font-medium hover:bg-[#003CAD] transition-colors inline-flex items-center"
                      >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Adicionar Cliente
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredClients.map((client, index) => (
                  <motion.tr 
                    key={client.id} 
                    className="hover:bg-gray-50 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {client.photo ? (
                            <img 
                              src={client.photo} 
                              alt={client.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <UserCircleIcon className="h-6 w-6 text-blue-600" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{client.name}</div>
                          <div className="text-xs text-gray-500">Cliente desde {formatDate(client.createdAt)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <PhoneIcon className="h-4 w-4 text-gray-400 mr-1" />
                        {client.phone}
                      </div>
                      {client.email && (
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-1" />
                          {client.email}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {client.vehicles.length > 0 ? (
                        <div>
                          <div className="text-sm text-gray-900">
                            {client.vehicles[0].make} {client.vehicles[0].model} ({client.vehicles[0].year})
                          </div>
                          {client.vehicles.length > 1 && (
                            <div className="text-xs text-blue-600 mt-1">
                              +{client.vehicles.length - 1} veículo(s)
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">Sem veículos</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusClass(client.status)}`}>
                        {getStatusText(client.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {client.lastVisit ? (
                        <div>
                          <div className="text-sm text-gray-900">{formatDate(client.lastVisit)}</div>
                          <div className="text-xs text-gray-500">{getTimeAgo(client.lastVisit)}</div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">Nunca visitou</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(client.totalSpent)}</div>
                      <div className="text-xs text-gray-500">{client.totalServices} serviços</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button className="text-gray-500 hover:text-gray-700" title="Ver detalhes">
                          <DocumentDuplicateIcon className="h-5 w-5" />
                        </button>
                        <button className="text-blue-500 hover:text-blue-700" title="Enviar mensagem">
                          <ChatBubbleLeftIcon className="h-5 w-5" />
                        </button>
                        <button className="text-green-500 hover:text-green-700" title="Agendar serviço">
                          <CalendarDaysIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 