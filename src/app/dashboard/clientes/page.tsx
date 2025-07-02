"use client";

import { useState } from "react";
import { 
  MagnifyingGlassIcon, 
  PlusIcon,
  FunnelIcon,
  UserCircleIcon,
  ChevronDownIcon,
  PhoneIcon,
  EnvelopeIcon,
  TagIcon,
  DocumentDuplicateIcon,
  ArrowUpTrayIcon,
  ChatBubbleLeftIcon,
  ChartBarIcon,
  ArrowPathIcon,
  CalendarDaysIcon
} from "@heroicons/react/24/outline";
import MobileResponsiveTable from "@/components/MobileResponsiveTable";

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
  vipClients: 12,
  newClientsThisMonth: 8,
  retentionRate: 89
};

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClientStatus | "all">("all");
  const [sortBy, setSortBy] = useState<"name" | "lastVisit" | "totalSpent">("name");
  const [isLoading] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Filtrar clientes baseado na busca e filtros
  const filteredClients = mockClients
    .filter(client => {
      const matchesSearch = 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm);
      
      const matchesStatus = statusFilter === "all" || client.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
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

  // Configuração da tabela mobile-responsive
  const tableColumns = [
    {
      key: 'cliente' as keyof Client,
      label: 'Cliente',
      render: (client: Client) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-12 w-12 md:h-10 md:w-10">
            {client.photo ? (
              <img 
                src={client.photo} 
                alt={client.name}
                className="h-12 w-12 md:h-10 md:w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-12 w-12 md:h-10 md:w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <UserCircleIcon className="h-6 w-6 md:h-5 md:w-5 text-blue-600" />
              </div>
            )}
          </div>
          <div className="ml-3">
            <div className="text-base md:text-sm font-medium text-gray-900">{client.name}</div>
            <div className="text-xs text-gray-500">Cliente desde {formatDate(client.createdAt)}</div>
          </div>
        </div>
      )
    },
    {
      key: 'contato' as keyof Client,
      label: 'Contato',
      render: (client: Client) => (
        <div>
          <div className="text-sm text-gray-900 flex items-center">
            <PhoneIcon className="h-4 w-4 text-gray-400 mr-1" />
            {client.phone}
          </div>
          {client.email && (
            <div className="text-xs text-gray-500 flex items-center mt-1">
              <EnvelopeIcon className="h-3 w-3 text-gray-400 mr-1" />
              {client.email}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'vehicles' as keyof Client,
      label: 'Veículos',
      render: (client: Client) => (
        client.vehicles.length > 0 ? (
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
        )
      )
    },
    {
      key: 'status' as keyof Client,
      label: 'Status',
      render: (client: Client) => (
        <span className={`inline-flex items-center px-3 py-1.5 md:px-2.5 md:py-0.5 rounded-full text-xs font-medium border ${getStatusClass(client.status)}`}>
          {getStatusText(client.status)}
        </span>
      )
    },
    {
      key: 'lastVisit' as keyof Client,
      label: 'Última Visita',
      render: (client: Client) => (
        client.lastVisit ? (
          <div>
            <div className="text-sm text-gray-900">{formatDate(client.lastVisit)}</div>
            <div className="text-xs text-gray-500">{getTimeAgo(client.lastVisit)}</div>
          </div>
        ) : (
          <span className="text-xs text-gray-500">Nunca visitou</span>
        )
      )
    },
    {
      key: 'totalSpent' as keyof Client,
      label: 'Total Gasto',
      render: (client: Client) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{formatCurrency(client.totalSpent)}</div>
          <div className="text-xs text-gray-500">{client.totalServices} serviços</div>
        </div>
      )
    }
  ];

  const tableActions = () => (
    <div className="flex flex-col md:flex-row gap-2 md:gap-1 md:space-x-2">
      <button 
        className="flex items-center justify-center md:justify-start px-4 py-3 md:px-3 md:py-2 text-gray-700 hover:text-gray-900 bg-gray-100 md:bg-transparent rounded-lg md:rounded-none transition-colors touch-manipulation min-h-[44px] md:min-h-0 active:bg-gray-200" 
        title="Ver detalhes"
      >
        <DocumentDuplicateIcon className="h-5 w-5 md:h-4 md:w-4" />
        <span className="ml-2 md:hidden text-sm font-medium">Ver detalhes</span>
      </button>
      <button 
        className="flex items-center justify-center md:justify-start px-4 py-3 md:px-3 md:py-2 text-blue-600 hover:text-blue-700 bg-blue-50 md:bg-transparent rounded-lg md:rounded-none transition-colors touch-manipulation min-h-[44px] md:min-h-0 active:bg-blue-100" 
        title="Enviar mensagem"
      >
        <ChatBubbleLeftIcon className="h-5 w-5 md:h-4 md:w-4" />
        <span className="ml-2 md:hidden text-sm font-medium">Mensagem</span>
      </button>
      <button 
        className="flex items-center justify-center md:justify-start px-4 py-3 md:px-3 md:py-2 text-green-600 hover:text-green-700 bg-green-50 md:bg-transparent rounded-lg md:rounded-none transition-colors touch-manipulation min-h-[44px] md:min-h-0 active:bg-green-100" 
        title="Agendar serviço"
      >
        <CalendarDaysIcon className="h-5 w-5 md:h-4 md:w-4" />
        <span className="ml-2 md:hidden text-sm font-medium">Agendar</span>
      </button>
    </div>
  );
  
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
      
      {/* Estatísticas de clientes - responsivas */}
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
          <p className="text-2xl md:text-3xl font-bold text-gray-800">{clientStats.retentionRate}%</p>
          <div className="mt-2 text-xs text-gray-500">
            Taxa de retorno
          </div>
        </div>
      </div>
      
      {/* Filtros e busca - mobile-first */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
        {/* Busca principal */}
        <div className="mb-4">
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
        
        {/* Filtros rápidos - scroll horizontal no mobile */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
            <select
              className="flex-shrink-0 px-4 py-3 rounded-lg text-sm border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 min-w-[140px] touch-manipulation min-h-[48px] bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ClientStatus | "all")}
            >
              <option value="all">Todos status</option>
              <option value="ativo">Ativos</option>
              <option value="inativo">Inativos</option>
              <option value="potencial">Potenciais</option>
              <option value="vip">VIP</option>
            </select>

            <select
              className="flex-shrink-0 px-4 py-3 rounded-lg text-sm border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 min-w-[140px] touch-manipulation min-h-[48px] bg-white"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "name" | "lastVisit" | "totalSpent")}
            >
              <option value="name">Nome</option>
              <option value="lastVisit">Última visita</option>
              <option value="totalSpent">Valor gasto</option>
            </select>
          </div>

          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center justify-center px-4 py-3 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation md:flex-shrink-0 min-h-[48px] active:bg-gray-100"
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Mais Filtros</span>
            <ChevronDownIcon className={`h-4 w-4 ml-2 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filtros avançados */}
        {showAdvancedFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de veículo</label>
                <select className="w-full px-4 py-3 rounded-lg text-sm border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 touch-manipulation min-h-[48px] bg-white">
                  <option>Todos os veículos</option>
                  <option>Carros</option>
                  <option>Motos</option>
                  <option>Caminhões</option>
                  <option>Utilitários</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Localização</label>
                <select className="w-full px-4 py-3 rounded-lg text-sm border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 touch-manipulation min-h-[48px] bg-white">
                  <option>Todas as localidades</option>
                  <option>São Paulo - SP</option>
                  <option>Campinas - SP</option>
                  <option>Rio de Janeiro - RJ</option>
                  <option>Outras localidades</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
                <select className="w-full px-4 py-3 rounded-lg text-sm border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 touch-manipulation min-h-[48px] bg-white">
                  <option>Último mês</option>
                  <option>Últimos 3 meses</option>
                  <option>Último ano</option>
                  <option>Todos os períodos</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Lista de clientes - usando MobileResponsiveTable */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <MobileResponsiveTable
          data={filteredClients}
          columns={tableColumns}
          actions={tableActions}
          isLoading={isLoading}
          emptyMessage={{
            title: "Nenhum cliente encontrado",
            description: "Tente ajustar seus filtros ou adicione um novo cliente",
            action: {
              label: "Adicionar Cliente",
              icon: <PlusIcon className="h-5 w-5 mr-2" />,
              onClick: () => console.log('Adicionar cliente')
            }
          }}
          loadingRows={5}
        />
      </div>
    </div>
  );
} 