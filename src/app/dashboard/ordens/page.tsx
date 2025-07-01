"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  MagnifyingGlassIcon, 
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarDaysIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  WrenchScrewdriverIcon,
  FunnelIcon,
  PlusIcon,
  EllipsisHorizontalIcon,
  ClockIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import DashboardFilters from "@/components/DashboardFilters";

// Tipos para ordens de serviço
type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

type Order = {
  id: string;
  customer: {
    name: string;
    phone: string;
    rating: number;
  };
  vehicle: {
    make: string;
    model: string;
    year: number;
    plate: string;
  };
  service: {
    type: string;
    description: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
  };
  total: number;
  status: OrderStatus;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  scheduledFor?: string;
  mechanic?: string;
  completedAt?: string;
};

// Dados de exemplo
const mockOrders: Order[] = [
  {
    id: "OS-2023-001",
    customer: {
      name: "João Silva",
      phone: "(11) 98765-4321",
      rating: 4.8
    },
    vehicle: {
      make: "Toyota",
      model: "Corolla",
      year: 2020,
      plate: "ABC-1234"
    },
    service: {
      type: "Revisão",
      description: "Revisão completa 30.000km",
      items: [
        { name: "Óleo de motor", quantity: 1, price: 120 },
        { name: "Filtro de óleo", quantity: 1, price: 50 },
        { name: "Filtro de ar", quantity: 1, price: 65 },
        { name: "Mão de obra", quantity: 1, price: 200 }
      ]
    },
    total: 435,
    status: "completed",
    priority: "medium",
    createdAt: "2023-10-15T14:30:00Z",
    scheduledFor: "2023-10-17T10:00:00Z",
    mechanic: "Carlos Ferreira",
    completedAt: "2023-10-17T12:30:00Z"
  },
  {
    id: "OS-2023-002",
    customer: {
      name: "Maria Santos",
      phone: "(11) 98765-1234",
      rating: 4.5
    },
    vehicle: {
      make: "Honda",
      model: "Civic",
      year: 2019,
      plate: "DEF-5678"
    },
    service: {
      type: "Reparo",
      description: "Troca de pastilhas de freio",
      items: [
        { name: "Pastilhas de freio dianteiras", quantity: 1, price: 180 },
        { name: "Mão de obra", quantity: 1, price: 150 }
      ]
    },
    total: 330,
    status: "in_progress",
    priority: "high",
    createdAt: "2023-10-16T09:15:00Z",
    scheduledFor: "2023-10-16T14:00:00Z",
    mechanic: "Pedro Souza"
  },
  {
    id: "OS-2023-003",
    customer: {
      name: "Lucas Oliveira",
      phone: "(11) 97654-3210",
      rating: 4.2
    },
    vehicle: {
      make: "Volkswagen",
      model: "Golf",
      year: 2018,
      plate: "GHI-9012"
    },
    service: {
      type: "Diagnóstico",
      description: "Luz do motor acesa",
      items: [
        { name: "Diagnóstico eletrônico", quantity: 1, price: 120 }
      ]
    },
    total: 120,
    status: "pending",
    priority: "medium",
    createdAt: "2023-10-16T16:30:00Z",
    scheduledFor: "2023-10-18T09:00:00Z"
  },
  {
    id: "OS-2023-004",
    customer: {
      name: "Ana Pereira",
      phone: "(11) 91234-5678",
      rating: 5.0
    },
    vehicle: {
      make: "Fiat",
      model: "Pulse",
      year: 2022,
      plate: "JKL-3456"
    },
    service: {
      type: "Manutenção",
      description: "Alinhamento e balanceamento",
      items: [
        { name: "Alinhamento", quantity: 1, price: 100 },
        { name: "Balanceamento", quantity: 4, price: 20 }
      ]
    },
    total: 180,
    status: "cancelled",
    priority: "low",
    createdAt: "2023-10-15T11:45:00Z",
    scheduledFor: "2023-10-16T11:00:00Z"
  },
  {
    id: "OS-2023-005",
    customer: {
      name: "Roberto Almeida",
      phone: "(11) 98877-6655",
      rating: 4.7
    },
    vehicle: {
      make: "Chevrolet",
      model: "Onix",
      year: 2021,
      plate: "MNO-7890"
    },
    service: {
      type: "Revisão",
      description: "Revisão completa 10.000km",
      items: [
        { name: "Óleo de motor", quantity: 1, price: 120 },
        { name: "Filtro de óleo", quantity: 1, price: 50 },
        { name: "Mão de obra", quantity: 1, price: 150 }
      ]
    },
    total: 320,
    status: "completed",
    priority: "medium",
    createdAt: "2023-10-14T13:20:00Z",
    scheduledFor: "2023-10-15T13:00:00Z",
    mechanic: "Carlos Ferreira",
    completedAt: "2023-10-15T15:30:00Z"
  },
  {
    id: "OS-2023-006",
    customer: {
      name: "Camila Rodrigues",
      phone: "(11) 92233-4455",
      rating: 4.0
    },
    vehicle: {
      make: "Hyundai",
      model: "HB20",
      year: 2020,
      plate: "PQR-1234"
    },
    service: {
      type: "Reparo",
      description: "Troca de bateria",
      items: [
        { name: "Bateria 60ah", quantity: 1, price: 450 },
        { name: "Mão de obra", quantity: 1, price: 50 }
      ]
    },
    total: 500,
    status: "in_progress",
    priority: "high",
    createdAt: "2023-10-16T10:05:00Z",
    scheduledFor: "2023-10-16T16:00:00Z",
    mechanic: "Pedro Souza"
  }
];

// Tipo para o componente DashboardFilters


export default function OrdensPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockOrders);
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulação de carregamento
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filtragem e ordenação
  useEffect(() => {
    let result = [...mockOrders];
    
    // Filtro por termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.id.toLowerCase().includes(term) ||
        order.customer.name.toLowerCase().includes(term) ||
        order.vehicle.plate.toLowerCase().includes(term) ||
        order.service.type.toLowerCase().includes(term) ||
        order.service.description.toLowerCase().includes(term)
      );
    }
    
    // Filtro por status
    if (statusFilter !== "all") {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Ordenação
    result.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortField) {
        case "createdAt":
          valueA = new Date(a.createdAt).getTime();
          valueB = new Date(b.createdAt).getTime();
          break;
        case "total":
          valueA = a.total;
          valueB = b.total;
          break;
        case "priority":
          const priorityValues = { "low": 1, "medium": 2, "high": 3 };
          valueA = priorityValues[a.priority];
          valueB = priorityValues[b.priority];
          break;
        default:
          valueA = new Date(a.createdAt).getTime();
          valueB = new Date(b.createdAt).getTime();
      }
      
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    });
    
    setFilteredOrders(result);
  }, [searchTerm, statusFilter, sortField, sortDirection]);
  
  // Toggle sort direction
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };
  
  // Retorna a cor do status
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "in_progress":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "completed":
        return "text-green-600 bg-green-50 border-green-200";
      case "cancelled":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };
  
  // Retorna o texto do status
  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "in_progress":
        return "Em Andamento";
      case "completed":
        return "Concluída";
      case "cancelled":
        return "Cancelada";
      default:
        return "";
    }
  };
  
  // Retorna o ícone do status
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <ClockIcon className="h-4 w-4" />;
      case "in_progress":
        return <ArrowPathIcon className="h-4 w-4" />;
      case "completed":
        return <CheckCircleIcon className="h-4 w-4" />;
      case "cancelled":
        return <XCircleIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  // Retorna a cor da prioridade
  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      case "medium":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };
  
  // Retorna o texto da prioridade
  const getPriorityText = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case "low":
        return "Baixa";
      case "medium":
        return "Média";
      case "high":
        return "Alta";
      default:
        return "";
    }
  };
  
  // Formata a data para o formato DD/MM/YYYY HH:MM
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Formata a data para o formato relativo (há X horas/minutos)
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 60) {
      return `Há ${diffMins} min`;
    } else if (diffMins < 1440) {
      const diffHours = Math.floor(diffMins / 60);
      return `Há ${diffHours} h`;
    } else {
      const diffDays = Math.floor(diffMins / 1440);
      return `Há ${diffDays} d`;
    }
  };
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Ordens de Serviço</h1>
            <p className="text-gray-500 text-sm mt-1">Gerencie as ordens de serviço da sua oficina</p>
          </div>
          
          <button
            className="px-4 py-2 bg-[#0047CC] text-white rounded-lg text-sm font-medium hover:bg-[#003CAD] transition-colors inline-flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nova Ordem
          </button>
        </div>
      </div>
      
      {/* Filtros e busca */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          {/* Busca */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por OS, cliente, placa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0047CC] focus:border-[#0047CC] text-sm"
            />
          </div>
          
          {/* Filtros de status */}
          <div className="flex space-x-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-2 rounded-lg text-sm ${
                statusFilter === "all"
                  ? "bg-[#0047CC] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-3 py-2 rounded-lg text-sm ${
                statusFilter === "pending"
                  ? "bg-amber-500 text-white"
                  : "bg-amber-50 text-amber-600 hover:bg-amber-100"
              }`}
            >
              Pendentes
            </button>
            <button
              onClick={() => setStatusFilter("in_progress")}
              className={`px-3 py-2 rounded-lg text-sm ${
                statusFilter === "in_progress"
                  ? "bg-blue-500 text-white"
                  : "bg-blue-50 text-blue-600 hover:bg-blue-100"
              }`}
            >
              Em Andamento
            </button>
            <button
              onClick={() => setStatusFilter("completed")}
              className={`px-3 py-2 rounded-lg text-sm ${
                statusFilter === "completed"
                  ? "bg-green-500 text-white"
                  : "bg-green-50 text-green-600 hover:bg-green-100"
              }`}
            >
              Concluídas
            </button>
          </div>
          
          {/* Botão de filtros avançados */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-3 py-2 rounded-lg text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 inline-flex items-center"
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filtros 
            {showFilters ? (
              <ChevronUpIcon className="h-4 w-4 ml-1" />
            ) : (
              <ChevronDownIcon className="h-4 w-4 ml-1" />
            )}
          </button>
        </div>
        
        {/* Filtros avançados (expansível) */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-gray-200"
          >
            <DashboardFilters
              filterOptions={[
                { id: "date", label: "Data", type: "date" },
                { id: "customer", label: "Cliente", type: "select", options: ["Todos", "João Silva", "Maria Santos", "Lucas Oliveira"] },
                { id: "vehicle", label: "Veículo", type: "select", options: ["Todos", "Toyota Corolla", "Honda Civic", "Volkswagen Golf"] },
                { id: "service", label: "Tipo de Serviço", type: "select", options: ["Todos", "Revisão", "Reparo", "Diagnóstico", "Manutenção"] },
                { id: "mechanic", label: "Mecânico", type: "select", options: ["Todos", "Carlos Ferreira", "Pedro Souza"] },
              ]}
              onSearch={(query) => console.log("Busca:", query)}
              onFilter={(filters) => console.log("Filtros aplicados:", filters)}
              onClearFilters={() => console.log("Filtros limpos")}
            />
          </motion.div>
        )}
      </div>
      
      {/* Tabela de ordens */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <ArrowPathIcon className="h-10 w-10 text-[#0047CC] animate-spin mb-4" />
            <p className="text-gray-500">Carregando ordens de serviço...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <WrenchScrewdriverIcon className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">Nenhuma ordem encontrada</h3>
            <p className="text-gray-500 mb-4">Tente ajustar seus filtros ou criar uma nova ordem</p>
            <button
              className="px-4 py-2 bg-[#0047CC] text-white rounded-lg text-sm font-medium hover:bg-[#003CAD] transition-colors inline-flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Nova Ordem
            </button>
          </div>
        ) : (
          <div>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      OS
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente/Veículo
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Serviço
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("total")}>
                      <div className="flex items-center">
                        Valor
                        {sortField === "total" && (
                          sortDirection === "asc" ? (
                            <ArrowUpIcon className="h-4 w-4 ml-1" />
                          ) : (
                            <ArrowDownIcon className="h-4 w-4 ml-1" />
                          )
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("priority")}>
                      <div className="flex items-center">
                        Prioridade
                        {sortField === "priority" && (
                          sortDirection === "asc" ? (
                            <ArrowUpIcon className="h-4 w-4 ml-1" />
                          ) : (
                            <ArrowDownIcon className="h-4 w-4 ml-1" />
                          )
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("createdAt")}>
                      <div className="flex items-center">
                        Data
                        {sortField === "createdAt" && (
                          sortDirection === "asc" ? (
                            <ArrowUpIcon className="h-4 w-4 ml-1" />
                          ) : (
                            <ArrowDownIcon className="h-4 w-4 ml-1" />
                          )
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order, index) => (
                    <motion.tr 
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-[#0047CC]">{order.id}</div>
                        <div className="text-xs text-gray-500">{formatRelativeTime(order.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-800">{order.customer.name}</div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <TruckIcon className="h-3 w-3 mr-1" />
                          {order.vehicle.make} {order.vehicle.model} | {order.vehicle.plate}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-800">{order.service.type}</div>
                        <div className="text-xs text-gray-500">{order.service.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-800">
                          {order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </div>
                        <div className="text-xs text-gray-500">{order.service.items.length} itens</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{getStatusText(order.status)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityColor(order.priority)}`}>
                          {getPriorityText(order.priority)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-800">
                          {formatDate(order.createdAt).split(' ')[0]}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <CalendarDaysIcon className="h-3 w-3 mr-1" />
                          {order.scheduledFor ? formatDate(order.scheduledFor).split(' ')[1] : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex space-x-2 justify-end">
                          <Link href={`/dashboard/ordens/${order.id}`} className="text-[#0047CC] hover:text-[#003CAD]">
                            Detalhes
                          </Link>
                          <button className="text-gray-400 hover:text-gray-500">
                            <EllipsisHorizontalIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {filteredOrders.map((order, index) => (
                <motion.div 
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-lg border border-gray-200 p-4"
                >
                  {/* Header do card */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="text-base font-medium text-[#0047CC]">{order.id}</div>
                      <div className={`ml-3 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{getStatusText(order.status)}</span>
                      </div>
                    </div>
                    <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityColor(order.priority)}`}>
                      {getPriorityText(order.priority)}
                    </div>
                  </div>

                  {/* Cliente e Veículo */}
                  <div className="mb-3">
                    <div className="text-sm font-medium text-gray-800 mb-1">{order.customer.name}</div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <TruckIcon className="h-3 w-3 mr-1" />
                      {order.vehicle.make} {order.vehicle.model} | {order.vehicle.plate}
                    </div>
                  </div>

                  {/* Serviço */}
                  <div className="mb-3">
                    <div className="text-sm font-medium text-gray-800">{order.service.type}</div>
                    <div className="text-xs text-gray-500">{order.service.description}</div>
                  </div>

                  {/* Valor e Data */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-sm font-medium text-gray-800">
                        {order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </div>
                      <div className="text-xs text-gray-500">{order.service.items.length} itens</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-800">
                        {formatDate(order.createdAt).split(' ')[0]}
                      </div>
                      <div className="text-xs text-gray-500">{formatRelativeTime(order.createdAt)}</div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <Link 
                      href={`/dashboard/ordens/${order.id}`} 
                      className="flex-1 px-3 py-2 bg-[#0047CC] text-white text-center rounded-lg text-sm font-medium hover:bg-[#003CAD] transition-colors touch-manipulation"
                    >
                      Ver Detalhes
                    </Link>
                    <button className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors touch-manipulation">
                      <EllipsisHorizontalIcon className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Paginação */}
      {!isLoading && filteredOrders.length > 0 && (
        <div className="flex justify-between items-center bg-white rounded-xl shadow-sm p-4">
          <div className="text-sm text-gray-500">
            Exibindo <span className="font-medium text-gray-800">{filteredOrders.length}</span> de <span className="font-medium text-gray-800">{mockOrders.length}</span> ordens
          </div>
          
          <div className="flex space-x-2">
            <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              Anterior
            </button>
            <button className="px-3 py-1 rounded-md bg-[#0047CC] text-white hover:bg-[#003CAD] text-sm font-medium">
              1
            </button>
            <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm">
              2
            </button>
            <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm">
              3
            </button>
            <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm">
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 