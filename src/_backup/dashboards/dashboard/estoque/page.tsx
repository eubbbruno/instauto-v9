"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  MagnifyingGlassIcon, 
  PlusIcon,
  ArrowDownOnSquareIcon,
  ArrowUpOnSquareIcon,
  TruckIcon,
  TagIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  ExclamationTriangleIcon,
  DocumentArrowDownIcon,
  CalendarDaysIcon
} from "@heroicons/react/24/outline";

// Tipos para estoque
type StockMovementType = 'entrada' | 'saída' | 'ajuste' | 'transferência';

type StockMovement = {
  id: string;
  date: string;
  productId: string;
  productName: string;
  productSku: string;
  type: StockMovementType;
  quantity: number;
  previousStock: number;
  currentStock: number;
  reason?: string;
  orderId?: string;
  supplier?: string;
  user: string;
  notes?: string;
};

// Dados mockados para movimento de estoque
const mockStockMovements: StockMovement[] = [
  {
    id: "MOV-001",
    date: "2023-10-19T14:30:00Z",
    productId: "P-001",
    productName: "Filtro de Óleo Premium",
    productSku: "FLT-OL-001",
    type: "entrada",
    quantity: 15,
    previousStock: 17,
    currentStock: 32,
    supplier: "Auto Peças Brasil",
    user: "Carlos Oliveira",
    notes: "Reposição de estoque mensal"
  },
  {
    id: "MOV-002",
    date: "2023-10-18T10:15:00Z",
    productId: "P-002",
    productName: "Óleo Motor Sintético 5W30",
    productSku: "OL-5W30-001",
    type: "saída",
    quantity: 2,
    previousStock: 47,
    currentStock: 45,
    orderId: "OS-2023-042",
    user: "André Silva",
    notes: "Usado na troca de óleo do Corolla placa ABC-1234"
  },
  {
    id: "MOV-003",
    date: "2023-10-17T16:45:00Z",
    productId: "P-003",
    productName: "Pastilha de Freio Dianteira",
    productSku: "FRE-PST-001",
    type: "saída",
    quantity: 1,
    previousStock: 19,
    currentStock: 18,
    orderId: "OS-2023-041",
    user: "Lucas Ferreira",
    notes: "Substituição de pastilhas do Gol placa DEF-5678"
  },
  {
    id: "MOV-004",
    date: "2023-10-16T09:30:00Z",
    productId: "P-006",
    productName: "Correia Dentada",
    productSku: "COR-DNT-001",
    type: "ajuste",
    quantity: -1,
    previousStock: 13,
    currentStock: 12,
    user: "Carlos Oliveira",
    reason: "Inventário físico",
    notes: "Ajuste após contagem física do estoque"
  },
  {
    id: "MOV-005",
    date: "2023-10-15T11:20:00Z",
    productId: "P-004",
    productName: "Fluido de Freio DOT 4",
    productSku: "FL-FRE-001",
    type: "entrada",
    quantity: 10,
    previousStock: 15,
    currentStock: 25,
    supplier: "Distribuidora Fluidos",
    user: "Carlos Oliveira",
    notes: "Reposição de estoque"
  },
  {
    id: "MOV-006",
    date: "2023-10-14T15:10:00Z",
    productId: "P-005",
    productName: "Vela de Ignição Iridium",
    productSku: "IGN-VL-001",
    type: "transferência",
    quantity: 5,
    previousStock: 35,
    currentStock: 40,
    user: "Carlos Oliveira",
    notes: "Transferência da filial zona sul"
  }
];

// Dados para o resumo de estoque
const stockSummary = {
  totalItems: 6,
  totalValue: 11570,
  lowStockItems: 2,
  outOfStockItems: 0,
  lastInventory: "2023-10-01"
};

// Dados para estoque crítico
const criticalStock = [
  {
    id: "P-003",
    name: "Pastilha de Freio Dianteira",
    sku: "FRE-PST-001",
    currentStock: 18,
    minimumStock: 8,
    status: "low"
  },
  {
    id: "P-006",
    name: "Correia Dentada",
    sku: "COR-DNT-001",
    currentStock: 12,
    minimumStock: 5,
    status: "low"
  }
];

export default function EstoquePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<StockMovementType | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(mockStockMovements);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filtrar movimentos de estoque
  const filteredMovements = stockMovements
    .filter(movement => {
      // Filtro por termo de busca
      if (searchTerm && 
          !movement.productName.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !movement.productSku.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !movement.id.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filtro por tipo
      if (typeFilter !== 'all' && movement.type !== typeFilter) {
        return false;
      }
      
      // Filtro por data
      if (dateFilter !== 'all') {
        const movementDate = new Date(movement.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (dateFilter === 'today') {
          const movementDay = new Date(movementDate);
          movementDay.setHours(0, 0, 0, 0);
          return movementDay.getTime() === today.getTime();
        }
        
        if (dateFilter === 'week') {
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return movementDate >= weekAgo;
        }
        
        if (dateFilter === 'month') {
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return movementDate >= monthAgo;
        }
      }
      
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Funções auxiliares
  const getMovementTypeText = (type: StockMovementType) => {
    const types: Record<StockMovementType, string> = {
      'entrada': 'Entrada',
      'saída': 'Saída',
      'ajuste': 'Ajuste',
      'transferência': 'Transferência'
    };
    
    return types[type] || type;
  };
  
  const getMovementTypeIcon = (type: StockMovementType) => {
    switch (type) {
      case 'entrada':
        return <ArrowDownOnSquareIcon className="h-5 w-5 text-green-600" />;
      case 'saída':
        return <ArrowUpOnSquareIcon className="h-5 w-5 text-red-600" />;
      case 'ajuste':
        return <ArrowPathIcon className="h-5 w-5 text-amber-600" />;
      case 'transferência':
        return <TruckIcon className="h-5 w-5 text-blue-600" />;
      default:
        return null;
    }
  };
  
  const getMovementTypeClass = (type: StockMovementType) => {
    switch (type) {
      case 'entrada':
        return "bg-green-100 text-green-700 border-green-200";
      case 'saída':
        return "bg-red-100 text-red-700 border-red-200";
      case 'ajuste':
        return "bg-amber-100 text-amber-700 border-amber-200";
      case 'transferência':
        return "bg-blue-100 text-blue-700 border-blue-200";
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
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Estoque</h1>
            <p className="text-gray-500 text-sm mt-1">Gerenciamento de entrada e saída de produtos</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              className="px-4 py-2 bg-[#0047CC] text-white rounded-lg text-sm font-medium hover:bg-[#003CAD] transition-colors inline-flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Registrar Movimento
            </button>
            
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors inline-flex items-center"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Inventário
            </button>
          </div>
        </div>
      </div>
      
      {/* Resumo do estoque */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Total de Produtos</h3>
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <TagIcon className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stockSummary.totalItems}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Valor em Estoque</h3>
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{formatCurrency(stockSummary.totalValue)}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Estoque Baixo</h3>
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <ExclamationTriangleIcon className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stockSummary.lowStockItems}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Sem Estoque</h3>
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <ExclamationTriangleIcon className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stockSummary.outOfStockItems}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Último Inventário</h3>
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <CalendarDaysIcon className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{formatDate(stockSummary.lastInventory)}</p>
        </div>
      </div>
      
      {/* Alerta de estoque crítico */}
      {criticalStock.length > 0 && (
        <motion.div 
          className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start">
            <div className="p-2 bg-amber-100 rounded-lg mr-4">
              <ExclamationTriangleIcon className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-medium text-amber-800 mb-1">Atenção: {criticalStock.length} produtos com estoque crítico</h3>
              <p className="text-sm text-amber-700 mb-2">Os seguintes produtos estão com estoque abaixo do mínimo recomendado:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {criticalStock.map(item => (
                  <div key={item.id} className="bg-white rounded-lg p-2 text-sm border border-amber-100 flex justify-between">
                    <span className="font-medium text-gray-800">{item.name}</span>
                    <span className="text-amber-700">Estoque: {item.currentStock} / Min: {item.minimumStock}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
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
                placeholder="Buscar por produto, código ou movimento..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Filtros rápidos */}
          <div className="md:col-span-5 flex flex-wrap gap-2">
            {/* Filtro por tipo */}
            <select
              className="px-3 py-2 rounded-lg text-sm border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0047CC]"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
            >
              <option value="all">Todos os tipos</option>
              <option value="entrada">Entradas</option>
              <option value="saída">Saídas</option>
              <option value="ajuste">Ajustes</option>
              <option value="transferência">Transferências</option>
            </select>
            
            {/* Filtro por período */}
            <select
              className="px-3 py-2 rounded-lg text-sm border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0047CC]"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
            >
              <option value="all">Todos os períodos</option>
              <option value="today">Hoje</option>
              <option value="week">Últimos 7 dias</option>
              <option value="month">Últimos 30 dias</option>
            </select>
          </div>
          
          {/* Botões de ação */}
          <div className="md:col-span-2 flex justify-end gap-2">
            <button className="px-3 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg inline-flex items-center">
              <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
              Exportar
            </button>
          </div>
        </div>
      </div>
      
      {/* Lista de movimentos de estoque */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data/Hora
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Movimento
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produto
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantidade
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estoque Atual
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detalhes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </td>
                  </tr>
                ))
              ) : filteredMovements.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-gray-100 p-4 rounded-full mb-4">
                        <TagIcon className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-1">Nenhum movimento encontrado</h3>
                      <p className="text-gray-500 mb-4">Tente ajustar seus filtros ou registre um novo movimento</p>
                      <button
                        className="px-4 py-2 bg-[#0047CC] text-white rounded-lg text-sm font-medium hover:bg-[#003CAD] transition-colors inline-flex items-center"
                      >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Registrar Movimento
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMovements.map((movement, index) => (
                  <motion.tr 
                    key={movement.id} 
                    className="hover:bg-gray-50 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">
                        {formatDateTime(movement.date)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getMovementTypeClass(movement.type)}`}>
                          {getMovementTypeIcon(movement.type)}
                          <span className="ml-1">{getMovementTypeText(movement.type)}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-800">{movement.productName}</div>
                        <div className="text-xs text-gray-500">{movement.productSku}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        movement.type === 'entrada' || movement.type === 'transferência' 
                          ? 'text-green-600' 
                          : movement.type === 'saída' 
                          ? 'text-red-600' 
                          : 'text-amber-600'
                      }`}>
                        {movement.type === 'entrada' || movement.type === 'transferência' ? '+' : ''}
                        {movement.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">
                        {movement.currentStock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">
                        {movement.user}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-sm text-[#0047CC] hover:text-[#003CAD] font-medium">
                        Detalhes
                      </button>
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