"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  MagnifyingGlassIcon, 
  ChevronDownIcon,
  PlusIcon,
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EllipsisHorizontalIcon,
  UserIcon,
  PhoneIcon,
  TruckIcon,
  FunnelIcon
} from "@heroicons/react/24/outline";
import DashboardFilters from "@/components/DashboardFilters";

// Tipos para agendamentos
type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
type ServiceType = 'maintenance' | 'repair' | 'inspection' | 'tire_change' | 'oil_change' | 'other';

type Appointment = {
  id: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  vehicle: {
    make: string;
    model: string;
    year: number;
    plate: string;
  };
  service: {
    type: ServiceType;
    description: string;
    estimatedTime: number; // em minutos
    estimatedValue?: number;
  };
  status: AppointmentStatus;
  scheduledFor: string;
  createdAt: string;
  notes?: string;
  mechanic?: string;
};

// Dados mockados de agendamentos
const mockAppointments: Appointment[] = [
  {
    id: "AGD-2023-001",
    customer: {
      name: "Paulo Souza",
      phone: "(11) 98765-4321",
      email: "paulo.souza@email.com"
    },
    vehicle: {
      make: "Fiat",
      model: "Uno",
      year: 2019,
      plate: "ABC-1234"
    },
    service: {
      type: "maintenance",
      description: "Revisão completa 20.000km",
      estimatedTime: 120,
      estimatedValue: 450
    },
    status: "confirmed",
    scheduledFor: "2023-10-20T10:00:00Z",
    createdAt: "2023-10-15T14:30:00Z",
    mechanic: "André Silva"
  },
  {
    id: "AGD-2023-002",
    customer: {
      name: "Carla Oliveira",
      phone: "(11) 91234-5678"
    },
    vehicle: {
      make: "Volkswagen",
      model: "Gol",
      year: 2018,
      plate: "DEF-5678"
    },
    service: {
      type: "oil_change",
      description: "Troca de óleo e filtros",
      estimatedTime: 45,
      estimatedValue: 220
    },
    status: "scheduled",
    scheduledFor: "2023-10-21T14:30:00Z",
    createdAt: "2023-10-16T09:15:00Z"
  },
  {
    id: "AGD-2023-003",
    customer: {
      name: "Ricardo Mendes",
      phone: "(11) 99876-5432"
    },
    vehicle: {
      make: "Honda",
      model: "Civic",
      year: 2020,
      plate: "GHI-9012"
    },
    service: {
      type: "repair",
      description: "Verificação de barulho na suspensão",
      estimatedTime: 60,
      estimatedValue: 320
    },
    status: "completed",
    scheduledFor: "2023-10-18T09:00:00Z",
    createdAt: "2023-10-15T16:45:00Z",
    mechanic: "Lucas Ferreira",
    notes: "Cliente relatou barulho ao passar em lombadas."
  },
  {
    id: "AGD-2023-004",
    customer: {
      name: "Fernanda Costa",
      phone: "(11) 95678-1234"
    },
    vehicle: {
      make: "Chevrolet",
      model: "Onix",
      year: 2021,
      plate: "JKL-3456"
    },
    service: {
      type: "inspection",
      description: "Inspeção pré-viagem",
      estimatedTime: 90,
      estimatedValue: 180
    },
    status: "cancelled",
    scheduledFor: "2023-10-19T16:00:00Z",
    createdAt: "2023-10-17T11:20:00Z",
    notes: "Cliente cancelou por motivos pessoais."
  },
  {
    id: "AGD-2023-005",
    customer: {
      name: "Marcos Santos",
      phone: "(11) 93456-7890"
    },
    vehicle: {
      make: "Toyota",
      model: "Corolla",
      year: 2022,
      plate: "MNO-7890"
    },
    service: {
      type: "tire_change",
      description: "Troca de pneus dianteiros",
      estimatedTime: 60,
      estimatedValue: 650
    },
    status: "scheduled",
    scheduledFor: "2023-10-22T11:00:00Z",
    createdAt: "2023-10-18T10:30:00Z"
  },
  {
    id: "AGD-2023-006",
    customer: {
      name: "Juliana Pereira",
      phone: "(11) 97890-1234"
    },
    vehicle: {
      make: "Hyundai",
      model: "HB20",
      year: 2019,
      plate: "PQR-1234"
    },
    service: {
      type: "maintenance",
      description: "Revisão de 30.000km",
      estimatedTime: 150,
      estimatedValue: 520
    },
    status: "no_show",
    scheduledFor: "2023-10-17T13:30:00Z",
    createdAt: "2023-10-14T18:15:00Z",
    notes: "Cliente não compareceu e não avisou."
  }
];

// Tipo para o componente DashboardFilters
type FilterValue = string | boolean | number;

export default function AgendamentosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<'today' | 'tomorrow' | 'week' | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Simulação de carregamento de dados
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppointments(mockAppointments);
      setFilteredAppointments(mockAppointments);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filtrar agendamentos quando os filtros mudarem
  useEffect(() => {
    let filtered = [...appointments];
    
    // Filtro de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(appointment => 
        appointment.customer.name.toLowerCase().includes(term) ||
        appointment.vehicle.plate.toLowerCase().includes(term) ||
        appointment.service.description.toLowerCase().includes(term) ||
        appointment.id.toLowerCase().includes(term)
      );
    }
    
    // Filtro de status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(appointment => appointment.status === statusFilter);
    }
    
    // Filtro de data
    if (dateFilter !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      filtered = filtered.filter(appointment => {
        const appointmentDate = new Date(appointment.scheduledFor);
        
        if (dateFilter === 'today') {
          return appointmentDate.getDate() === today.getDate() &&
                 appointmentDate.getMonth() === today.getMonth() &&
                 appointmentDate.getFullYear() === today.getFullYear();
        }
        
        if (dateFilter === 'tomorrow') {
          return appointmentDate.getDate() === tomorrow.getDate() &&
                 appointmentDate.getMonth() === tomorrow.getMonth() &&
                 appointmentDate.getFullYear() === tomorrow.getFullYear();
        }
        
        if (dateFilter === 'week') {
          return appointmentDate >= today && appointmentDate <= nextWeek;
        }
        
        return true;
      });
    }
    
    setFilteredAppointments(filtered);
  }, [searchTerm, statusFilter, dateFilter, appointments]);
  
  const handleFilterApply = (filters: Record<string, FilterValue>) => {
    // Implementar filtros avançados aqui
    console.log("Aplicando filtros:", filters);
  };
  
  // Funções auxiliares
  const getStatusText = (status: AppointmentStatus) => {
    switch (status) {
      case "scheduled":
        return "Agendado";
      case "confirmed":
        return "Confirmado";
      case "completed":
        return "Concluído";
      case "cancelled":
        return "Cancelado";
      case "no_show":
        return "Não Compareceu";
      default:
        return "";
    }
  };
  
  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-200";
      case "completed":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      case "no_show":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };
  
  const getStatusIcon = (status: AppointmentStatus) => {
    switch (status) {
      case "scheduled":
        return <ClockIcon className="h-4 w-4" />;
      case "confirmed":
        return <CheckCircleIcon className="h-4 w-4" />;
      case "completed":
        return <CheckCircleIcon className="h-4 w-4" />;
      case "cancelled":
        return <XCircleIcon className="h-4 w-4" />;
      case "no_show":
        return <XCircleIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  const getServiceTypeText = (type: ServiceType) => {
    switch (type) {
      case "maintenance":
        return "Manutenção";
      case "repair":
        return "Reparo";
      case "inspection":
        return "Inspeção";
      case "tire_change":
        return "Troca de Pneus";
      case "oil_change":
        return "Troca de Óleo";
      case "other":
        return "Outro";
      default:
        return "";
    }
  };
  
  // Formata a data para o formato DD/MM/YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  // Formata a hora para o formato HH:MM
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Formata o tempo estimado (de minutos para horas e minutos)
  const formatEstimatedTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours}h`;
    }
    
    return `${hours}h ${remainingMinutes}min`;
  };
  
  const formatCurrency = (value?: number) => {
    if (value === undefined) return '-';
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  
  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Agendamentos</h1>
            <p className="text-gray-500 text-sm mt-1">Gerencie os agendamentos da sua oficina</p>
          </div>
          
          <button
            className="px-6 py-3 bg-[#0047CC] text-white rounded-lg text-sm font-medium hover:bg-[#003CAD] transition-colors flex items-center justify-center min-h-[48px] w-full sm:w-auto"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Novo Agendamento
          </button>
        </div>
      </div>
      
      {/* Filtros e busca - Mobile Optimized */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 md:mb-6">
        <div className="space-y-4">
          {/* Barra de busca */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por cliente, placa, serviço..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent text-sm md:text-base min-h-[48px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filtros rápidos - Mobile Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setDateFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap min-h-[40px] ${
                dateFilter === "all"
                  ? "bg-[#0047CC] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setDateFilter('today')}
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap min-h-[40px] ${
                dateFilter === "today"
                  ? "bg-green-500 text-white"
                  : "bg-green-50 text-green-600 hover:bg-green-100"
              }`}
            >
              Hoje
            </button>
            <button
              onClick={() => setDateFilter('tomorrow')}
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap min-h-[40px] ${
                dateFilter === "tomorrow"
                  ? "bg-blue-500 text-white"
                  : "bg-blue-50 text-blue-600 hover:bg-blue-100"
              }`}
            >
              Amanhã
            </button>
            <button
              onClick={() => setDateFilter('week')}
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap min-h-[40px] ${
                dateFilter === "week"
                  ? "bg-purple-500 text-white"
                  : "bg-purple-50 text-purple-600 hover:bg-purple-100"
              }`}
            >
              Esta Semana
            </button>
          </div>
          
          {/* Botão de filtros avançados */}
          <div className="flex justify-center sm:justify-end">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 rounded-lg text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center min-h-[44px]"
            >
              <FunnelIcon className="h-4 w-4 mr-1" />
              Filtros Avançados
              <ChevronDownIcon className={`h-4 w-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
        
        {showFilters && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <DashboardFilters
              filterOptions={[
                {
                  id: 'status',
                  label: 'Status',
                  type: 'select',
                  options: ['all', 'scheduled', 'confirmed', 'completed', 'cancelled', 'no_show']
                },
                {
                  id: 'serviceType',
                  label: 'Tipo de Serviço',
                  type: 'select',
                  options: ['all', 'maintenance', 'repair', 'inspection', 'tire_change', 'oil_change', 'other']
                },
                {
                  id: 'dateRange',
                  label: 'Período',
                  type: 'date',
                  icon: <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                }
              ]}
              onFilter={handleFilterApply}
              onClearFilters={() => console.log("Limpar filtros")}
            />
          </div>
        )}
      </div>
      
      {/* Lista de agendamentos - Mobile Responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {isLoading ? (
          // Skeleton loading
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))
        ) : filteredAppointments.length === 0 ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <CalendarDaysIcon className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">Nenhum agendamento encontrado</h3>
            <p className="text-gray-500 mb-4">Tente ajustar seus filtros ou criar um novo agendamento</p>
            <button
              className="px-4 py-2 bg-[#0047CC] text-white rounded-lg text-sm font-medium hover:bg-[#003CAD] transition-colors inline-flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Novo Agendamento
            </button>
          </div>
        ) : (
          filteredAppointments.map((appointment, index) => (
            <motion.div
              key={appointment.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="p-4 md:p-5">
                {/* Header do card - Mobile Optimized */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 text-base md:text-lg mb-1">{appointment.customer.name}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <TruckIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="truncate">
                        {appointment.vehicle.make} {appointment.vehicle.model} ({appointment.vehicle.year})
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Placa: {appointment.vehicle.plate}
                    </div>
                  </div>
                  <div className={`px-2.5 py-1.5 rounded-full text-xs font-medium border flex items-center self-start flex-shrink-0 ${getStatusColor(appointment.status)}`}>
                    {getStatusIcon(appointment.status)}
                    <span className="ml-1">{getStatusText(appointment.status)}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-medium text-gray-800">
                      {getServiceTypeText(appointment.service.type)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatEstimatedTime(appointment.service.estimatedTime)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {appointment.service.description}
                  </p>
                  {appointment.service.estimatedValue && (
                    <div className="text-sm text-gray-800 font-medium">
                      Valor estimado: {formatCurrency(appointment.service.estimatedValue)}
                    </div>
                  )}
                </div>
                
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center">
                      <CalendarDaysIcon className="h-4 w-4 text-gray-500 mr-1 flex-shrink-0" />
                      <span className="text-sm font-medium">
                        {formatDate(appointment.scheduledFor)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm">
                        {formatTime(appointment.scheduledFor)}
                      </span>
                    </div>
                  </div>
                  
                  {appointment.mechanic && (
                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                      <UserIcon className="h-3 w-3 mr-1" />
                      Mecânico: {appointment.mechanic}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 flex justify-between">
                <button className="text-sm text-gray-600 hover:text-gray-800 flex items-center">
                  <PhoneIcon className="h-4 w-4 mr-1" />
                  Contato
                </button>
                <button className="text-sm text-[#0047CC] hover:text-[#003CAD] flex items-center">
                  Detalhes
                </button>
                <button className="text-sm text-gray-600 hover:text-gray-800">
                  <EllipsisHorizontalIcon className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
} 