"use client";

import { useState, useMemo } from 'react';
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  FunnelIcon,
  ClockIcon,
  WrenchIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  UserIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  TruckIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';

interface ServiceOrder {
  id: string;
  orderNumber: string;
  status: 'pending' | 'in-progress' | 'waiting-parts' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  vehicle: {
    brand: string;
    model: string;
    year: number;
    plate: string;
    color: string;
  };
  services: string[];
  estimatedCost: number;
  createdAt: string;
  estimatedCompletion: string;
  progress: number;
  timeline: {
    step: string;
    completed: boolean;
    date?: string;
  }[];
}

const mockOrders: ServiceOrder[] = [
  {
    id: '1',
    orderNumber: 'OS-2025-001',
    status: 'in-progress',
    priority: 'high',
    customer: {
      name: 'João Silva',
      phone: '(11) 99999-9999',
      email: 'joao@email.com'
    },
    vehicle: {
      brand: 'Toyota',
      model: 'Corolla',
      year: 2020,
      plate: 'ABC-1234',
      color: 'Prata'
    },
    services: ['Troca de óleo', 'Revisão geral', 'Alinhamento'],
    estimatedCost: 450.00,
    createdAt: '2025-01-15',
    estimatedCompletion: '2025-01-17',
    progress: 65,
    timeline: [
      { step: 'Recebimento', completed: true, date: '15/01 09:00' },
      { step: 'Diagnóstico', completed: true, date: '15/01 10:30' },
      { step: 'Execução', completed: false },
      { step: 'Finalização', completed: false },
      { step: 'Entrega', completed: false }
    ]
  },
  {
    id: '2',
    orderNumber: 'OS-2025-002',
    status: 'pending',
    priority: 'medium',
    customer: {
      name: 'Maria Santos',
      phone: '(11) 88888-8888',
      email: 'maria@email.com'
    },
    vehicle: {
      brand: 'Honda',
      model: 'Civic',
      year: 2019,
      plate: 'DEF-5678',
      color: 'Preto'
    },
    services: ['Troca de pastilhas de freio', 'Verificação do sistema ABS'],
    estimatedCost: 380.00,
    createdAt: '2025-01-16',
    estimatedCompletion: '2025-01-18',
    progress: 0,
    timeline: [
      { step: 'Recebimento', completed: false },
      { step: 'Diagnóstico', completed: false },
      { step: 'Execução', completed: false },
      { step: 'Finalização', completed: false },
      { step: 'Entrega', completed: false }
    ]
  },
  {
    id: '3',
    orderNumber: 'OS-2025-003',
    status: 'completed',
    priority: 'low',
    customer: {
      name: 'Pedro Costa',
      phone: '(11) 77777-7777',
      email: 'pedro@email.com'
    },
    vehicle: {
      brand: 'Volkswagen',
      model: 'Golf',
      year: 2021,
      plate: 'GHI-9012',
      color: 'Branco'
    },
    services: ['Troca de pneus', 'Balanceamento', 'Geometria'],
    estimatedCost: 1200.00,
    createdAt: '2025-01-10',
    estimatedCompletion: '2025-01-12',
    progress: 100,
    timeline: [
      { step: 'Recebimento', completed: true, date: '10/01 08:00' },
      { step: 'Diagnóstico', completed: true, date: '10/01 09:00' },
      { step: 'Execução', completed: true, date: '11/01 14:00' },
      { step: 'Finalização', completed: true, date: '12/01 10:00' },
      { step: 'Entrega', completed: true, date: '12/01 16:00' }
    ]
  },
  {
    id: '4',
    orderNumber: 'OS-2025-004',
    status: 'waiting-parts',
    priority: 'high',
    customer: {
      name: 'Ana Costa',
      phone: '(11) 66666-6666',
      email: 'ana@email.com'
    },
    vehicle: {
      brand: 'Fiat',
      model: 'Argo',
      year: 2022,
      plate: 'JKL-3456',
      color: 'Vermelho'
    },
    services: ['Troca da correia dentada', 'Troca do tensor'],
    estimatedCost: 680.00,
    createdAt: '2025-01-14',
    estimatedCompletion: '2025-01-20',
    progress: 35,
    timeline: [
      { step: 'Recebimento', completed: true, date: '14/01 11:00' },
      { step: 'Diagnóstico', completed: true, date: '14/01 14:00' },
      { step: 'Execução', completed: false },
      { step: 'Finalização', completed: false },
      { step: 'Entrega', completed: false }
    ]
  }
];

const statusConfig = {
  pending: { 
    label: 'Pendente', 
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    bgColor: 'bg-yellow-50',
    icon: ClockIcon 
  },
  'in-progress': { 
    label: 'Em Andamento', 
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    bgColor: 'bg-blue-50',
    icon: WrenchIcon 
  },
  'waiting-parts': { 
    label: 'Aguardando Peças', 
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    bgColor: 'bg-orange-50',
    icon: ExclamationTriangleIcon 
  },
  completed: { 
    label: 'Concluído', 
    color: 'bg-green-100 text-green-700 border-green-200',
    bgColor: 'bg-green-50',
    icon: CheckCircleIcon 
  },
  cancelled: { 
    label: 'Cancelado', 
    color: 'bg-red-100 text-red-700 border-red-200',
    bgColor: 'bg-red-50',
    icon: XCircleIcon 
  }
};

const priorityConfig = {
  low: { label: 'Baixa', color: 'bg-gray-500' },
  medium: { label: 'Média', color: 'bg-yellow-500' },
  high: { label: 'Alta', color: 'bg-red-500' }
};

export default function OrdensPage() {
  const [orders, setOrders] = useState<ServiceOrder[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [orders, searchTerm, statusFilter, priorityFilter]);

  const updateOrderStatus = (orderId: string, newStatus: ServiceOrder['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, progress: newStatus === 'completed' ? 100 : order.progress }
        : order
    ));
  };

  const openOrderDetails = (order: ServiceOrder) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    inProgress: orders.filter(o => o.status === 'in-progress').length,
    completed: orders.filter(o => o.status === 'completed').length
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 pb-safe">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Ordens de Serviço</h1>
            <p className="text-gray-600 text-sm md:text-base mt-1">Gerencie todas as ordens da oficina</p>
          </div>
          <button className="px-5 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center justify-center touch-manipulation min-h-[48px] active:bg-blue-800">
            <PlusIcon className="h-5 w-5 mr-2" />
            Nova Ordem
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total</h3>
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <ClockIcon className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-xs text-gray-500 mt-1">Ordens ativas</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Pendentes</h3>
            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
              <ClockIcon className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-800">{stats.pending}</p>
          <p className="text-xs text-gray-500 mt-1">Aguardando início</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Em Andamento</h3>
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <WrenchIcon className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-800">{stats.inProgress}</p>
          <p className="text-xs text-gray-500 mt-1">Em execução</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Concluídas</h3>
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <CheckCircleIcon className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-800">{stats.completed}</p>
          <p className="text-xs text-gray-500 mt-1">Este mês</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar por número, cliente ou placa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent touch-manipulation min-h-[48px]"
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-shrink-0 px-4 py-3 rounded-lg text-sm border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 min-w-[160px] touch-manipulation min-h-[48px] bg-white"
            >
              <option value="all">Todos os Status</option>
              <option value="pending">Pendente</option>
              <option value="in-progress">Em Andamento</option>
              <option value="waiting-parts">Aguardando Peças</option>
              <option value="completed">Concluído</option>
              <option value="cancelled">Cancelado</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="flex-shrink-0 px-4 py-3 rounded-lg text-sm border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 min-w-[140px] touch-manipulation min-h-[48px] bg-white"
            >
              <option value="all">Todas Prioridades</option>
              <option value="high">Alta</option>
              <option value="medium">Média</option>
              <option value="low">Baixa</option>
            </select>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center px-4 py-3 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation md:flex-shrink-0 min-h-[48px] active:bg-gray-100"
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Mais Filtros</span>
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
              <select className="w-full px-4 py-3 rounded-lg text-sm border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 touch-manipulation min-h-[48px] bg-white">
                <option>Hoje</option>
                <option>Esta semana</option>
                <option>Este mês</option>
                <option>Últimos 3 meses</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Serviço</label>
              <select className="w-full px-4 py-3 rounded-lg text-sm border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 touch-manipulation min-h-[48px] bg-white">
                <option>Todos os serviços</option>
                <option>Troca de óleo</option>
                <option>Revisão</option>
                <option>Freios</option>
                <option>Suspensão</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valor</label>
              <select className="w-full px-4 py-3 rounded-lg text-sm border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 touch-manipulation min-h-[48px] bg-white">
                <option>Qualquer valor</option>
                <option>Até R$ 500</option>
                <option>R$ 500 - R$ 1.000</option>
                <option>Acima de R$ 1.000</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {filteredOrders.map((order) => {
          const statusInfo = statusConfig[order.status];
          const StatusIcon = statusInfo.icon;
          const priorityInfo = priorityConfig[order.priority];

          return (
            <div key={order.id} className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all ${statusInfo.bgColor}`}>
              {/* Card Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{order.orderNumber}</h3>
                    <p className="text-sm text-gray-600 mt-1">{order.customer.name}</p>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center">
                    <EllipsisVerticalIcon className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                
                {/* Status and Priority */}
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                    <StatusIcon className="h-4 w-4 mr-1.5" />
                    {statusInfo.label}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white ${priorityInfo.color}`}>
                    {priorityInfo.label}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-4">
                {/* Vehicle Info */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center text-sm text-gray-700">
                    <div className="flex-1">
                      <p className="font-medium">{order.vehicle.brand} {order.vehicle.model} {order.vehicle.year}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{order.vehicle.color} • {order.vehicle.plate}</p>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progresso</span>
                    <span className="font-medium text-gray-900">{order.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${order.progress}%` }}
                    />
                  </div>
                </div>

                {/* Services */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Serviços:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {order.services.map((service, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-xs text-gray-700">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Cost and Date */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-1.5" />
                    <span>{new Date(order.estimatedCompletion).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    R$ {order.estimatedCost.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => openOrderDetails(order)}
                    className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors touch-manipulation min-h-[44px] active:bg-gray-100"
                  >
                    Ver Detalhes
                  </button>
                  {order.status !== 'completed' && order.status !== 'cancelled' && (
                    <button 
                      onClick={() => {
                        const nextStatus = order.status === 'pending' ? 'in-progress' : 
                                         order.status === 'in-progress' ? 'completed' : 'completed';
                        updateOrderStatus(order.id, nextStatus);
                      }}
                      className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors touch-manipulation min-h-[44px] active:bg-blue-800"
                    >
                      {order.status === 'pending' ? 'Iniciar' : 'Finalizar'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <WrenchIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma ordem encontrada</h3>
          <p className="text-gray-500 mb-6">Tente ajustar seus filtros ou criar uma nova ordem de serviço</p>
          <button className="px-5 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center justify-center touch-manipulation min-h-[48px]">
            <PlusIcon className="h-5 w-5 mr-2" />
            Nova Ordem
          </button>
        </div>
      )}

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-white w-full md:max-w-4xl md:rounded-xl shadow-xl max-h-[90vh] overflow-hidden animate-slide-up md:animate-none">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">{selectedOrder.orderNumber}</h2>
                  <p className="text-sm text-gray-600 mt-1">Detalhes da ordem de serviço</p>
                </div>
                <button 
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <XCircleIcon className="h-6 w-6 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-4 md:p-6 space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2 text-gray-600" />
                  Informações do Cliente
                </h3>
                <div className="space-y-2">
                  <p className="text-sm"><span className="text-gray-600">Nome:</span> <span className="font-medium">{selectedOrder.customer.name}</span></p>
                  <div className="flex items-center gap-4">
                    <p className="text-sm">
                      <span className="text-gray-600">Telefone:</span> 
                      <span className="font-medium ml-1">{selectedOrder.customer.phone}</span>
                    </p>
                    <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors touch-manipulation min-w-[36px] min-h-[36px] flex items-center justify-center">
                      <PhoneIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm">
                    <span className="text-gray-600">Email:</span> 
                    <span className="font-medium ml-1">{selectedOrder.customer.email}</span>
                  </p>
                </div>
              </div>

              {/* Vehicle Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <TruckIcon className="h-5 w-5 mr-2 text-gray-600" />
                  Informações do Veículo
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-600">Marca/Modelo</p>
                    <p className="font-medium">{selectedOrder.vehicle.brand} {selectedOrder.vehicle.model}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ano</p>
                    <p className="font-medium">{selectedOrder.vehicle.year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Placa</p>
                    <p className="font-medium">{selectedOrder.vehicle.plate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cor</p>
                    <p className="font-medium">{selectedOrder.vehicle.color}</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Timeline do Serviço</h3>
                <div className="space-y-4">
                  {selectedOrder.timeline.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        step.completed 
                          ? 'bg-green-500 border-green-500' 
                          : 'bg-white border-gray-300'
                      }`}>
                        {step.completed && <CheckCircleIconSolid className="h-3 w-3 text-white" />}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                          {step.step}
                        </p>
                        {step.date && (
                          <p className="text-sm text-gray-500 mt-0.5">{step.date}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Services and Cost */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <WrenchScrewdriverIcon className="h-5 w-5 mr-2 text-gray-600" />
                  Serviços e Valores
                </h3>
                <div className="space-y-2 mb-4">
                  {selectedOrder.services.map((service, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-gray-700">{service}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">Valor Total:</span>
                    <span className="text-xl font-bold text-gray-900">
                      R$ {selectedOrder.estimatedCost.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 md:p-6">
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowDetails(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors touch-manipulation min-h-[48px] active:bg-gray-400"
                >
                  Fechar
                </button>
                <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors touch-manipulation min-h-[48px] active:bg-blue-800 flex items-center justify-center">
                  <PencilIcon className="h-5 w-5 mr-2" />
                  Editar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 