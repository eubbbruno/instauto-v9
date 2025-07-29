"use client";

import { useState } from "react";
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowUpTrayIcon,
  TagIcon,
  ChartBarIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";

// Tipos seguros para clientes
type ClientStatus = 'ativo' | 'inativo' | 'potencial' | 'vip';

type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  plate: string;
};

type Client = {
  id: string;
  name: string;
  email?: string;
  phone: string;
  photo?: string;
  status: ClientStatus;
  createdAt: string;
  lastVisit?: string;
  vehicles: Vehicle[];
  totalSpent: number;
  totalServices: number;
};

// Dados mock seguros
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
      {
        id: "V-001",
        make: "Honda",
        model: "Civic",
        year: 2019,
        plate: "ABC-1234"
      }
    ],
    totalSpent: 3780.50,
    totalServices: 8
  },
  {
    id: "C-002",
    name: "Maria Oliveira",
    email: "maria.oliveira@email.com",
    phone: "(11) 97654-3210",
    photo: "https://images.unsplash.com/photo-1494790108755-2616b612b55c?w=150",
    status: "vip",
    createdAt: "2020-03-15T09:45:00Z",
    lastVisit: "2023-10-05T14:30:00Z",
    vehicles: [
      {
        id: "V-002",
        make: "Toyota",
        model: "Corolla",
        year: 2020,
        plate: "DEF-5678"
      }
    ],
    totalSpent: 7450.75,
    totalServices: 15
  },
  {
    id: "C-003",
    name: "Carlos Santos",
    email: "carlos.santos@email.com",
    phone: "(11) 96543-2109",
    status: "inativo",
    createdAt: "2022-01-20T11:30:00Z",
    lastVisit: "2023-02-18T09:00:00Z",
    vehicles: [
      {
        id: "V-003",
        make: "Volkswagen",
        model: "Gol",
        year: 2017,
        plate: "JKL-3456"
      }
    ],
    totalSpent: 1250.30,
    totalServices: 3
  }
];

// Estatísticas
const clientStats = {
  totalClients: 124,
  activeClients: 98,
  vipClients: 12,
  newClientsThisMonth: 8
};

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClientStatus | "all">("all");
  const [isLoading] = useState(false);

  // Filtrar clientes com segurança
  const filteredClients = mockClients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Funções auxiliares seguras
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen pb-safe">
      {/* Header responsivo */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Clientes</h1>
            <p className="text-gray-600 text-sm md:text-base mt-1">Gerencie seus clientes e veículos</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="px-5 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors inline-flex items-center justify-center touch-manipulation min-h-[48px] active:bg-blue-800">
              <PlusIcon className="h-5 w-5 mr-2" />
              Adicionar Cliente
            </button>
            
            <button className="px-5 py-3 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors inline-flex items-center justify-center touch-manipulation min-h-[48px] active:bg-gray-400">
              <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
              Importar
            </button>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total</h3>
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <UserCircleIcon className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-800">{clientStats.totalClients}</p>
          <div className="mt-2 text-xs text-green-600 flex items-center">
            <ArrowPathIcon className="h-3 w-3 mr-1" />
            <span>+{clientStats.newClientsThisMonth} este mês</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Ativos</h3>
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <UserCircleIcon className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-800">{clientStats.activeClients}</p>
          <div className="mt-2 text-xs text-gray-500">
            {Math.round((clientStats.activeClients / clientStats.totalClients) * 100)}% do total
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">VIP</h3>
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <TagIcon className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-800">{clientStats.vipClients}</p>
          <div className="mt-2 text-xs text-gray-500">
            {Math.round((clientStats.vipClients / clientStats.totalClients) * 100)}% do total
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Retenção</h3>
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <ChartBarIcon className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-800">89%</p>
          <div className="mt-2 text-xs text-gray-500">
            Taxa de retorno
          </div>
        </div>
      </div>

      {/* Busca e filtros */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nome, email ou telefone..."
                className="w-full pl-10 pr-4 py-3 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent touch-manipulation min-h-[48px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Filtro de status */}
          <div className="md:w-48">
            <select
              className="w-full px-4 py-3 rounded-lg text-sm border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 touch-manipulation min-h-[48px] bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ClientStatus | "all")}
            >
              <option value="all">Todos status</option>
              <option value="ativo">Ativos</option>
              <option value="inativo">Inativos</option>
              <option value="potencial">Potenciais</option>
              <option value="vip">VIP</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de clientes - Tabela responsiva simples */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="animate-pulse flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4 text-lg">
              Nenhum cliente encontrado
            </div>
            <p className="text-gray-500 text-sm mb-6">
              Tente ajustar seus filtros ou adicione um novo cliente
            </p>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <PlusIcon className="h-5 w-5 mr-2" />
              Adicionar Cliente
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Veículos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Gasto
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
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
                                <UserCircleIcon className="h-5 w-5 text-blue-600" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{client.name}</div>
                            <div className="text-sm text-gray-500">Cliente desde {formatDate(client.createdAt)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <PhoneIcon className="h-4 w-4 text-gray-400 mr-1" />
                          {client.phone}
                        </div>
                        {client.email && (
                          <div className="text-sm text-gray-500 flex items-center">
                            <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-1" />
                            {client.email}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {client.vehicles.length > 0 ? (
                          <div>
                            <div>{client.vehicles[0].make} {client.vehicles[0].model}</div>
                            {client.vehicles.length > 1 && (
                              <div className="text-xs text-blue-600">
                                +{client.vehicles.length - 1} veículo(s)
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500">Sem veículos</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusClass(client.status)}`}>
                          {getStatusText(client.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="font-medium">{formatCurrency(client.totalSpent)}</div>
                        <div className="text-xs text-gray-500">{client.totalServices} serviços</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
              {filteredClients.map((client) => (
                <div key={client.id} className="p-4 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {client.photo ? (
                        <img 
                          src={client.photo} 
                          alt={client.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <UserCircleIcon className="h-6 w-6 text-blue-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{client.name}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(client.status)}`}>
                          {getStatusText(client.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{client.phone}</p>
                      {client.email && (
                        <p className="text-sm text-gray-500">{client.email}</p>
                      )}
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {client.vehicles.length > 0 
                            ? `${client.vehicles[0].make} ${client.vehicles[0].model}`
                            : 'Sem veículos'
                          }
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(client.totalSpent)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
} 