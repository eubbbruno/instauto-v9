"use client";

import { 
  CalendarIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  TruckIcon,
  PlusIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// Tipos
interface Agendamento {
  id: string;
  cliente: string;
  telefone: string;
  veiculo: string;
  servico: string;
  data: string;
  horario: string;
  status: 'Agendado' | 'Confirmado' | 'Em Andamento' | 'Finalizado' | 'Cancelado';
  valor?: number;
  observacoes?: string;
  dataCriacao: string;
}

interface Slot {
  time: string;
  available: boolean;
  agendamento?: Agendamento;
}

export default function AgendamentosPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'view' | 'edit'>('create');
  const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('week');

  // Horários disponíveis
  const horarios = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  // Formulário
  const [formData, setFormData] = useState({
    cliente: '',
    telefone: '',
    veiculo: '',
    servico: '',
    data: '',
    horario: '',
    valor: '',
    observacoes: ''
  });

  // Dados iniciais
  useEffect(() => {
    const agendamentosIniciais: Agendamento[] = [
      {
        id: 'AG-001',
        cliente: 'João Silva',
        telefone: '(11) 98765-4321',
        veiculo: 'Honda Civic 2020',
        servico: 'Revisão completa',
        data: '2024-01-15',
        horario: '09:00',
        status: 'Confirmado',
        valor: 300,
        dataCriacao: new Date().toISOString()
      },
      {
        id: 'AG-002',
        cliente: 'Maria Santos',
        telefone: '(11) 91234-5678',
        veiculo: 'Toyota Corolla 2019',
        servico: 'Troca de óleo',
        data: '2024-01-15',
        horario: '14:00',
        status: 'Agendado',
        valor: 120,
        dataCriacao: new Date().toISOString()
      },
      {
        id: 'AG-003',
        cliente: 'Pedro Costa',
        telefone: '(11) 99876-5432',
        veiculo: 'VW Golf 2021',
        servico: 'Alinhamento',
        data: '2024-01-16',
        horario: '10:30',
        status: 'Em Andamento',
        valor: 180,
        dataCriacao: new Date().toISOString()
      }
    ];
    setAgendamentos(agendamentosIniciais);
  }, []);

  // Funções auxiliares
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDateBR = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getWeekDays = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const getAgendamentosForDate = (date: string) => {
    return agendamentos.filter(ag => ag.data === date);
  };

  const getSlotsForDate = (date: string): Slot[] => {
    const agendamentosData = getAgendamentosForDate(date);
    return horarios.map(time => ({
      time,
      available: !agendamentosData.some(ag => ag.horario === time),
      agendamento: agendamentosData.find(ag => ag.horario === time)
    }));
  };

  // CRUD Functions
  const criarAgendamento = () => {
    if (!formData.cliente || !formData.telefone || !formData.veiculo || !formData.servico || !formData.data || !formData.horario) {
      showNotification('error', 'Preencha todos os campos obrigatórios!');
      return;
    }

    // Verificar se horário está disponível
    const agendamentosData = getAgendamentosForDate(formData.data);
    if (agendamentosData.some(ag => ag.horario === formData.horario)) {
      showNotification('error', 'Este horário já está ocupado!');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const novoAgendamento: Agendamento = {
        id: `AG-${Date.now()}`,
        cliente: formData.cliente,
        telefone: formData.telefone,
        veiculo: formData.veiculo,
        servico: formData.servico,
        data: formData.data,
        horario: formData.horario,
        status: 'Agendado',
        valor: formData.valor ? parseFloat(formData.valor) : undefined,
        observacoes: formData.observacoes,
        dataCriacao: new Date().toISOString()
      };

      setAgendamentos(prev => [...prev, novoAgendamento]);
      setShowModal(false);
      resetForm();
      setLoading(false);
      showNotification('success', 'Agendamento criado com sucesso!');
    }, 1000);
  };

  const atualizarStatus = (id: string, novoStatus: Agendamento['status']) => {
    setAgendamentos(prev => prev.map(ag => 
      ag.id === id ? { ...ag, status: novoStatus } : ag
    ));
    showNotification('success', `Status atualizado para: ${novoStatus}`);
  };

  const deletarAgendamento = (id: string) => {
    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
      setAgendamentos(prev => prev.filter(ag => ag.id !== id));
      showNotification('success', 'Agendamento cancelado com sucesso!');
    }
  };

  // Modal functions
  const openModal = (mode: 'create' | 'view' | 'edit', agendamento?: Agendamento) => {
    setModalMode(mode);
    if (agendamento) {
      setSelectedAgendamento(agendamento);
      setFormData({
        cliente: agendamento.cliente,
        telefone: agendamento.telefone,
        veiculo: agendamento.veiculo,
        servico: agendamento.servico,
        data: agendamento.data,
        horario: agendamento.horario,
        valor: agendamento.valor?.toString() || '',
        observacoes: agendamento.observacoes || ''
      });
    } else {
      resetForm();
      setFormData(prev => ({ ...prev, data: formatDate(selectedDate) }));
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      cliente: '',
      telefone: '',
      veiculo: '',
      servico: '',
      data: '',
      horario: '',
      valor: '',
      observacoes: ''
    });
    setSelectedAgendamento(null);
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Agendado': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Confirmado': return 'bg-green-100 text-green-800 border-green-200';
      case 'Em Andamento': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Finalizado': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Cancelado': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Navigation
  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToPreviousWeek = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() - 7);
      return newDate;
    });
  };

  const goToNextWeek = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + 7);
      return newDate;
    });
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Estatísticas
  const hoje = formatDate(new Date());
  const agendamentosHoje = getAgendamentosForDate(hoje);
  const agendamentosConfirmados = agendamentos.filter(ag => ag.status === 'Confirmado').length;
  const receitaTotal = agendamentos.reduce((total, ag) => total + (ag.valor || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40 p-6">
      {/* Notificação */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
              notification.type === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <CalendarIcon className="h-8 w-8 mr-3 text-[#0047CC]" />
            Agendamentos
          </h1>
          <p className="text-gray-600 mt-2">
            Gerencie todos os agendamentos • {agendamentos.length} total
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">
          <div className="flex bg-white rounded-xl border border-gray-200 p-1">
            {['month', 'week', 'day'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === mode
                    ? 'bg-[#0047CC] text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {mode === 'month' && 'Mês'}
                {mode === 'week' && 'Semana'}
                {mode === 'day' && 'Dia'}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => openModal('create')}
            className="bg-[#0047CC] hover:bg-[#0055EB] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center shadow-lg hover:shadow-blue-200/50 transform hover:scale-105"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Novo Agendamento
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Hoje', value: agendamentosHoje.length, color: 'bg-blue-500', icon: CalendarIcon },
          { label: 'Confirmados', value: agendamentosConfirmados, color: 'bg-green-500', icon: CheckCircleIcon },
          { label: 'Total', value: agendamentos.length, color: 'bg-purple-500', icon: ClockIcon },
          { label: 'Receita', value: `R$ ${receitaTotal.toLocaleString()}`, color: 'bg-emerald-500', icon: TruckIcon }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.color}/10`}>
                <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Calendar Navigation */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {viewMode === 'month' && `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
              {viewMode === 'week' && `Semana de ${formatDateBR(formatDate(getWeekDays(currentDate)[0]))}`}
              {viewMode === 'day' && formatDateBR(formatDate(selectedDate))}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={viewMode === 'month' ? goToPreviousMonth : goToPreviousWeek}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  setCurrentDate(new Date());
                  setSelectedDate(new Date());
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
              >
                Hoje
              </button>
              <button
                onClick={viewMode === 'month' ? goToNextMonth : goToNextWeek}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Content */}
        <div className="p-6">
          {viewMode === 'month' && (
            <div className="grid grid-cols-7 gap-2">
              {/* Headers */}
              {dayNames.map(day => (
                <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
              
              {/* Days */}
              {getDaysInMonth(currentDate).map((day, index) => {
                const dateStr = formatDate(day);
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                const isToday = dateStr === hoje;
                const isSelected = dateStr === formatDate(selectedDate);
                const agendamentosDay = getAgendamentosForDate(dateStr);
                
                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedDate(day)}
                    className={`p-3 min-h-[80px] border border-gray-100 rounded-lg cursor-pointer transition-all ${
                      isSelected ? 'bg-[#0047CC] text-white' :
                      isToday ? 'bg-blue-50 border-blue-200' :
                      isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 text-gray-400'
                    }`}
                  >
                    <div className={`text-sm font-medium mb-1 ${!isCurrentMonth ? 'text-gray-400' : ''}`}>
                      {day.getDate()}
                    </div>
                    {agendamentosDay.slice(0, 2).map(ag => (
                      <div
                        key={ag.id}
                        className={`text-xs px-2 py-1 rounded mb-1 truncate ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {ag.horario} - {ag.cliente}
                      </div>
                    ))}
                    {agendamentosDay.length > 2 && (
                      <div className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                        +{agendamentosDay.length - 2} mais
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

          {viewMode === 'week' && (
            <div className="grid grid-cols-8 gap-2">
              {/* Time column header */}
              <div className="p-3"></div>
              
              {/* Day headers */}
              {getWeekDays(currentDate).map(day => {
                const dateStr = formatDate(day);
                const isToday = dateStr === hoje;
                const agendamentosDay = getAgendamentosForDate(dateStr);
                
                return (
                  <div
                    key={dateStr}
                    className={`p-3 text-center border border-gray-100 rounded-lg ${
                      isToday ? 'bg-blue-50 border-blue-200' : 'bg-white'
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-900">
                      {dayNames[day.getDay()]}
                    </div>
                    <div className={`text-lg font-bold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                      {day.getDate()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {agendamentosDay.length} agend.
                    </div>
                  </div>
                );
              })}

              {/* Time slots */}
              {horarios.map(time => (
                <div key={time} className="contents">
                  {/* Time label */}
                  <div className="p-3 text-sm font-medium text-gray-500 bg-gray-50 rounded-lg">
                    {time}
                  </div>
                  
                  {/* Day slots */}
                  {getWeekDays(currentDate).map(day => {
                    const dateStr = formatDate(day);
                    const agendamento = agendamentos.find(ag => ag.data === dateStr && ag.horario === time);
                    
                    return (
                      <div
                        key={`${dateStr}-${time}`}
                        onClick={() => {
                          if (agendamento) {
                            openModal('view', agendamento);
                          } else {
                            setSelectedDate(day);
                            setFormData(prev => ({ ...prev, data: dateStr, horario: time }));
                            openModal('create');
                          }
                        }}
                        className={`p-2 min-h-[60px] border border-gray-100 rounded-lg cursor-pointer transition-all ${
                          agendamento 
                            ? 'bg-[#0047CC] text-white hover:bg-[#0055EB]' 
                            : 'bg-white hover:bg-gray-50'
                        }`}
                      >
                        {agendamento && (
                          <div className="text-xs">
                            <div className="font-medium truncate">{agendamento.cliente}</div>
                            <div className="opacity-80 truncate">{agendamento.servico}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {viewMode === 'day' && (
            <div className="space-y-2">
              <div className="text-lg font-semibold text-gray-900 mb-4">
                Horários do dia {formatDateBR(formatDate(selectedDate))}
              </div>
              
              {getSlotsForDate(formatDate(selectedDate)).map(slot => (
                <motion.div
                  key={slot.time}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => {
                    if (slot.agendamento) {
                      openModal('view', slot.agendamento);
                    } else {
                      setFormData(prev => ({ ...prev, data: formatDate(selectedDate), horario: slot.time }));
                      openModal('create');
                    }
                  }}
                  className={`p-4 border border-gray-200 rounded-xl cursor-pointer transition-all ${
                    slot.agendamento 
                      ? 'bg-[#0047CC] text-white hover:bg-[#0055EB]' 
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ClockIcon className="h-5 w-5 mr-3 opacity-70" />
                      <span className="font-medium">{slot.time}</span>
                    </div>
                    
                    {slot.agendamento ? (
                      <div className="flex-1 ml-6">
                        <div className="font-semibold">{slot.agendamento.cliente}</div>
                        <div className="text-sm opacity-80">{slot.agendamento.servico}</div>
                        <div className="text-xs opacity-70">{slot.agendamento.veiculo}</div>
                      </div>
                    ) : (
                      <div className="text-green-600 text-sm font-medium">Disponível</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lista de Agendamentos do Dia Selecionado */}
      {viewMode !== 'day' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              Agendamentos de {formatDateBR(formatDate(selectedDate))}
            </h3>
          </div>
          
          <div className="p-6">
            {getAgendamentosForDate(formatDate(selectedDate)).length > 0 ? (
              <div className="space-y-4">
                {getAgendamentosForDate(formatDate(selectedDate)).map(agendamento => (
                  <motion.div
                    key={agendamento.id}
                    whileHover={{ scale: 1.01 }}
                    className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all cursor-pointer"
                    onClick={() => openModal('view', agendamento)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-[#0047CC] rounded-full flex items-center justify-center text-white font-bold">
                          {agendamento.cliente.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{agendamento.cliente}</h4>
                          <p className="text-sm text-gray-600">{agendamento.servico}</p>
                          <p className="text-xs text-gray-500">{agendamento.veiculo}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{agendamento.horario}</div>
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(agendamento.status)}`}>
                          {agendamento.status}
                        </span>
                        {agendamento.valor && (
                          <p className="text-sm text-gray-600 mt-1">R$ {agendamento.valor.toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum agendamento</h3>
                <p className="text-gray-600 mb-4">
                  Não há agendamentos para este dia.
                </p>
                <button 
                  onClick={() => openModal('create')}
                  className="bg-[#0047CC] hover:bg-[#0055EB] text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  Criar Agendamento
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {modalMode === 'create' && 'Novo Agendamento'}
                    {modalMode === 'edit' && 'Editar Agendamento'}
                    {modalMode === 'view' && 'Detalhes do Agendamento'}
                  </h2>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {modalMode === 'view' && selectedAgendamento ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                        <p className="text-gray-900">{selectedAgendamento.cliente}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedAgendamento.status)}`}>
                          {selectedAgendamento.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                        <p className="text-gray-900">{formatDateBR(selectedAgendamento.data)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
                        <p className="text-gray-900">{selectedAgendamento.horario}</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Serviço</label>
                      <p className="text-gray-900">{selectedAgendamento.servico}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Veículo</label>
                        <p className="text-gray-900">{selectedAgendamento.veiculo}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                        <p className="text-gray-900">{selectedAgendamento.telefone}</p>
                      </div>
                    </div>
                    
                    {selectedAgendamento.valor && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                        <p className="text-gray-900">R$ {selectedAgendamento.valor.toLocaleString()}</p>
                      </div>
                    )}
                    
                    {selectedAgendamento.observacoes && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                        <p className="text-gray-900">{selectedAgendamento.observacoes}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                      {selectedAgendamento.status === 'Agendado' && (
                        <button 
                          onClick={() => atualizarStatus(selectedAgendamento.id, 'Confirmado')}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Confirmar
                        </button>
                      )}
                      {selectedAgendamento.status === 'Confirmado' && (
                        <button 
                          onClick={() => atualizarStatus(selectedAgendamento.id, 'Em Andamento')}
                          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Iniciar
                        </button>
                      )}
                      {selectedAgendamento.status === 'Em Andamento' && (
                        <button 
                          onClick={() => atualizarStatus(selectedAgendamento.id, 'Finalizado')}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Finalizar
                        </button>
                      )}
                      <button 
                        onClick={() => deletarAgendamento(selectedAgendamento.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); criarAgendamento(); }}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
                          <input
                            type="text"
                            value={formData.cliente}
                            onChange={(e) => setFormData({...formData, cliente: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC]"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
                          <input
                            type="tel"
                            value={formData.telefone}
                            onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC]"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
                          <input
                            type="date"
                            value={formData.data}
                            onChange={(e) => setFormData({...formData, data: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC]"
                            min={hoje}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Horário *</label>
                          <select
                            value={formData.horario}
                            onChange={(e) => setFormData({...formData, horario: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC]"
                            required
                          >
                            <option value="">Selecione um horário</option>
                            {horarios.map(time => {
                              const isAvailable = formData.data ? getSlotsForDate(formData.data).find(s => s.time === time)?.available : true;
                              return (
                                <option key={time} value={time} disabled={!isAvailable}>
                                  {time} {!isAvailable ? '(Ocupado)' : ''}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Veículo *</label>
                        <input
                          type="text"
                          value={formData.veiculo}
                          onChange={(e) => setFormData({...formData, veiculo: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC]"
                          placeholder="Ex: Honda Civic 2020"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Serviço *</label>
                        <input
                          type="text"
                          value={formData.servico}
                          onChange={(e) => setFormData({...formData, servico: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC]"
                          placeholder="Ex: Revisão completa"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Valor Estimado</label>
                        <input
                          type="number"
                          value={formData.valor}
                          onChange={(e) => setFormData({...formData, valor: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC]"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                        <textarea
                          value={formData.observacoes}
                          onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC]"
                          rows={2}
                          placeholder="Informações adicionais..."
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
                      <button 
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-[#0047CC] hover:bg-[#0055EB] text-white rounded-lg transition-colors disabled:opacity-50 flex items-center"
                      >
                        {loading && (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        )}
                        Criar Agendamento
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 