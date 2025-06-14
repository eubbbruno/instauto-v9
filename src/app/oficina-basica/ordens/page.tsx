"use client";

import { 
  WrenchScrewdriverIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ClockIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon,
  PhoneIcon,
  TruckIcon,
  CurrencyDollarIcon
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// Tipos
interface Ordem {
  id: string;
  cliente: string;
  veiculo: string;
  problema: string;
  status: 'Pendente' | 'Orçamento Enviado' | 'Aprovado' | 'Em Andamento' | 'Finalizado' | 'Recusado';
  data: string;
  telefone: string;
  mensagens: number;
  valor?: number;
  observacoes?: string;
  dataCriacao: string;
  dataUltimaAtualizacao: string;
}

export default function OrdensPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [ordens, setOrdens] = useState<Ordem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedOrdem, setSelectedOrdem] = useState<Ordem | null>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Dados iniciais
  useEffect(() => {
    const ordensIniciais: Ordem[] = [
      {
        id: "OS-2023-001",
        cliente: "João Silva",
        veiculo: "Honda Civic 2020",
        problema: "Troca de óleo e filtros",
        status: "Pendente",
        data: "22/05/2023 - 10:30",
        telefone: "(11) 98765-4321",
        mensagens: 2,
        valor: 150,
        observacoes: "Cliente solicitou óleo sintético",
        dataCriacao: new Date().toISOString(),
        dataUltimaAtualizacao: new Date().toISOString()
      },
      {
        id: "OS-2023-002",
        cliente: "Maria Oliveira",
        veiculo: "Toyota Corolla 2019",
        problema: "Alinhamento e balanceamento",
        status: "Orçamento Enviado",
        data: "22/05/2023 - 09:15",
        telefone: "(11) 91234-5678",
        mensagens: 0,
        valor: 280,
        dataCriacao: new Date().toISOString(),
        dataUltimaAtualizacao: new Date().toISOString()
      },
      {
        id: "OS-2023-003",
        cliente: "Pedro Santos",
        veiculo: "Volkswagen Golf 2021",
        problema: "Reparo no sistema de freios",
        status: "Aprovado",
        data: "21/05/2023 - 15:45",
        telefone: "(11) 99876-5432",
        mensagens: 1,
        valor: 450,
        dataCriacao: new Date().toISOString(),
        dataUltimaAtualizacao: new Date().toISOString()
      }
    ];
    setOrdens(ordensIniciais);
  }, []);

  // Formulário
  const [formData, setFormData] = useState({
    cliente: '',
    veiculo: '',
    problema: '',
    telefone: '',
    valor: '',
    observacoes: ''
  });

  // Função para gerar ID único
  const generateId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `OS-${timestamp}-${random}`;
  };

  // Criar nova ordem
  const criarOrdem = () => {
    if (!formData.cliente || !formData.veiculo || !formData.problema || !formData.telefone) {
      showNotification('error', 'Preencha todos os campos obrigatórios!');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const novaOrdem: Ordem = {
        id: generateId(),
        cliente: formData.cliente,
        veiculo: formData.veiculo,
        problema: formData.problema,
        telefone: formData.telefone,
        status: 'Pendente',
        data: new Date().toLocaleString('pt-BR'),
        mensagens: 0,
        valor: formData.valor ? parseFloat(formData.valor) : undefined,
        observacoes: formData.observacoes,
        dataCriacao: new Date().toISOString(),
        dataUltimaAtualizacao: new Date().toISOString()
      };

      setOrdens(prev => [novaOrdem, ...prev]);
      setShowModal(false);
      resetForm();
      setLoading(false);
      showNotification('success', 'Ordem criada com sucesso!');
    }, 1000);
  };

  // Atualizar ordem
  const atualizarOrdem = () => {
    if (!selectedOrdem) return;

    setLoading(true);
    
    setTimeout(() => {
      const ordemAtualizada: Ordem = {
        ...selectedOrdem,
        cliente: formData.cliente,
        veiculo: formData.veiculo,
        problema: formData.problema,
        telefone: formData.telefone,
        valor: formData.valor ? parseFloat(formData.valor) : undefined,
        observacoes: formData.observacoes,
        dataUltimaAtualizacao: new Date().toISOString()
      };

      setOrdens(prev => prev.map(ordem => 
        ordem.id === selectedOrdem.id ? ordemAtualizada : ordem
      ));
      
      setShowModal(false);
      resetForm();
      setLoading(false);
      showNotification('success', 'Ordem atualizada com sucesso!');
    }, 1000);
  };

  // Deletar ordem
  const deletarOrdem = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta ordem?')) {
      setOrdens(prev => prev.filter(ordem => ordem.id !== id));
      showNotification('success', 'Ordem excluída com sucesso!');
    }
  };

  // Atualizar status
  const atualizarStatus = (id: string, novoStatus: Ordem['status']) => {
    setOrdens(prev => prev.map(ordem => 
      ordem.id === id 
        ? { ...ordem, status: novoStatus, dataUltimaAtualizacao: new Date().toISOString() }
        : ordem
    ));
    showNotification('success', `Status atualizado para: ${novoStatus}`);
  };

  // Funções auxiliares
  const resetForm = () => {
    setFormData({
      cliente: '',
      veiculo: '',
      problema: '',
      telefone: '',
      valor: '',
      observacoes: ''
    });
    setSelectedOrdem(null);
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const openModal = (mode: 'create' | 'edit' | 'view', ordem?: Ordem) => {
    setModalMode(mode);
    if (ordem) {
      setSelectedOrdem(ordem);
      setFormData({
        cliente: ordem.cliente,
        veiculo: ordem.veiculo,
        problema: ordem.problema,
        telefone: ordem.telefone,
        valor: ordem.valor?.toString() || '',
        observacoes: ordem.observacoes || ''
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  // Filtros
  const ordensFilteredByStatus = filterStatus === "todos" 
    ? ordens 
    : ordens.filter(ordem => ordem.status === filterStatus);
    
  const filteredOrdens = searchQuery 
    ? ordensFilteredByStatus.filter(ordem => 
        ordem.cliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ordem.veiculo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ordem.problema.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ordem.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : ordensFilteredByStatus;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendente": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Orçamento Enviado": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Aprovado": return "bg-green-100 text-green-800 border-green-200";
      case "Em Andamento": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Finalizado": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Recusado": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getNextStatus = (currentStatus: Ordem['status']): Ordem['status'] | null => {
    const workflow: Record<Ordem['status'], Ordem['status'] | null> = {
      'Pendente': 'Orçamento Enviado',
      'Orçamento Enviado': 'Aprovado',
      'Aprovado': 'Em Andamento',
      'Em Andamento': 'Finalizado',
      'Finalizado': null,
      'Recusado': null
    };
    return workflow[currentStatus];
  };

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <WrenchScrewdriverIcon className="h-8 w-8 mr-3 text-[#0047CC]" />
            Ordens de Serviço
          </h1>
          <p className="text-gray-600 mt-2">
            Gerencie todas as solicitações de serviço • {ordens.length} total
          </p>
        </div>
        
        <button 
          onClick={() => openModal('create')}
          className="mt-4 md:mt-0 bg-[#0047CC] hover:bg-[#0055EB] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center shadow-lg hover:shadow-blue-200/50 transform hover:scale-105"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nova Ordem
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total', value: ordens.length, color: 'bg-blue-500', icon: WrenchScrewdriverIcon },
          { label: 'Pendentes', value: ordens.filter(o => o.status === 'Pendente').length, color: 'bg-yellow-500', icon: ClockIcon },
          { label: 'Em Andamento', value: ordens.filter(o => ['Aprovado', 'Em Andamento'].includes(o.status)).length, color: 'bg-purple-500', icon: TruckIcon },
          { label: 'Finalizadas', value: ordens.filter(o => o.status === 'Finalizado').length, color: 'bg-green-500', icon: CheckCircleIcon }
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
      
      {/* Filtros */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por cliente, veículo, problema ou ID..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC] transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-64">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC] transition-colors"
            >
              <option value="todos">Todos os status</option>
              <option value="Pendente">Pendente</option>
              <option value="Orçamento Enviado">Orçamento Enviado</option>
              <option value="Aprovado">Aprovado</option>
              <option value="Em Andamento">Em Andamento</option>
              <option value="Finalizado">Finalizado</option>
              <option value="Recusado">Recusado</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Lista de Ordens */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredOrdens.length > 0 ? (
            filteredOrdens.map((ordem, index) => (
              <motion.div
                key={ordem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between gap-4">
                    {/* Info Principal */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">{ordem.id}</span>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(ordem.status)}`}>
                          {ordem.status}
                        </span>
                        {ordem.mensagens > 0 && (
                          <span className="bg-[#0047CC] text-white text-xs rounded-full h-6 min-w-6 flex items-center justify-center px-2">
                            {ordem.mensagens}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{ordem.cliente}</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <TruckIcon className="h-4 w-4 mr-2 text-gray-400" />
                          {ordem.veiculo}
                        </div>
                        <div className="flex items-center">
                          <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                          {ordem.telefone}
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                          {ordem.data}
                        </div>
                        {ordem.valor && (
                          <div className="flex items-center">
                            <CurrencyDollarIcon className="h-4 w-4 mr-2 text-gray-400" />
                            R$ {ordem.valor.toLocaleString()}
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{ordem.problema}</p>
                      </div>
                    </div>
                    
                    {/* Ações */}
                    <div className="flex flex-row lg:flex-col gap-2">
                      <button 
                        onClick={() => openModal('view', ordem)}
                        className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      
                      <button 
                        onClick={() => openModal('edit', ordem)}
                        className="flex items-center justify-center px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      
                      <button 
                        onClick={() => deletarOrdem(ordem.id)}
                        className="flex items-center justify-center px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                      
                      {getNextStatus(ordem.status) && (
                        <button 
                          onClick={() => atualizarStatus(ordem.id, getNextStatus(ordem.status)!)}
                          className="flex items-center justify-center px-4 py-2 bg-[#0047CC] hover:bg-[#0055EB] text-white rounded-lg transition-colors text-sm font-medium"
                        >
                          Avançar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center"
            >
              <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma ordem encontrada</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || filterStatus !== 'todos' 
                  ? 'Tente ajustar seus filtros de busca'
                  : 'Comece criando sua primeira ordem de serviço'
                }
              </p>
              <button 
                onClick={() => openModal('create')}
                className="bg-[#0047CC] hover:bg-[#0055EB] text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Criar Primeira Ordem
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
                    {modalMode === 'create' && 'Nova Ordem de Serviço'}
                    {modalMode === 'edit' && 'Editar Ordem'}
                    {modalMode === 'view' && 'Detalhes da Ordem'}
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
                {modalMode === 'view' && selectedOrdem ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                        <p className="text-gray-900">{selectedOrdem.id}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedOrdem.status)}`}>
                          {selectedOrdem.status}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                      <p className="text-gray-900">{selectedOrdem.cliente}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Veículo</label>
                      <p className="text-gray-900">{selectedOrdem.veiculo}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Problema/Serviço</label>
                      <p className="text-gray-900">{selectedOrdem.problema}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                        <p className="text-gray-900">{selectedOrdem.telefone}</p>
                      </div>
                      {selectedOrdem.valor && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                          <p className="text-gray-900">R$ {selectedOrdem.valor.toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                    
                    {selectedOrdem.observacoes && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                        <p className="text-gray-900">{selectedOrdem.observacoes}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); modalMode === 'create' ? criarOrdem() : atualizarOrdem(); }}>
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
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Problema/Serviço *</label>
                        <textarea
                          value={formData.problema}
                          onChange={(e) => setFormData({...formData, problema: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC]"
                          rows={3}
                          placeholder="Descreva o problema ou serviço solicitado..."
                          required
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
                        {modalMode === 'create' ? 'Criar Ordem' : 'Salvar Alterações'}
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