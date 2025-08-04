"use client";

import { useState } from 'react';
import {
  TruckIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  WrenchScrewdriverIcon,
  CalendarDaysIcon,
  XMarkIcon,
  PhoneIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardFilters, { type FilterValue } from '@/components/dashboard/DashboardFilters';

type CombustivelType = 'Gasolina' | 'Etanol' | 'Diesel' | 'Flex' | 'Híbrido' | 'Elétrico';

interface Veiculo {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  ano: number;
  cor: string;
  combustivel: CombustivelType;
  quilometragem: number;
  cliente: {
    nome: string;
    telefone: string;
    email: string;
    endereco: string;
  };
  historico: {
    totalServicos: number;
    ultimoServico: string;
    proximaRevisao: string;
    valorGasto: number;
  };
  status: 'Ativo' | 'Em manutenção' | 'Aguardando peças' | 'Concluído';
  prioridade: 'normal' | 'alta' | 'urgente';
  observacoes?: string;
  fotos?: string[];
  documentos?: string[];
}

export default function VeiculosPage() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([
    {
      id: 'VEI-001',
      placa: 'ABC-1234',
      marca: 'Honda',
      modelo: 'Civic',
      ano: 2020,
      cor: 'Prata',
      combustivel: 'Flex',
      quilometragem: 45000,
      cliente: {
        nome: 'João Silva',
        telefone: '(11) 98765-4321',
        email: 'joao@email.com',
        endereco: 'Rua das Flores, 123 - São Paulo/SP'
      },
      historico: {
        totalServicos: 8,
        ultimoServico: '15/11/2024',
        proximaRevisao: '15/05/2025',
        valorGasto: 2450
      },
      status: 'Ativo',
      prioridade: 'normal',
      observacoes: 'Cliente fiel, sempre em dia com manutenções'
    },
    {
      id: 'VEI-002',
      placa: 'XYZ-9876',
      marca: 'Toyota',
      modelo: 'Corolla',
      ano: 2019,
      cor: 'Branco',
      combustivel: 'Flex',
      quilometragem: 38000,
      cliente: {
        nome: 'Maria Santos',
        telefone: '(11) 91234-5678',
        email: 'maria@email.com',
        endereco: 'Av. Paulista, 456 - São Paulo/SP'
      },
      historico: {
        totalServicos: 5,
        ultimoServico: '10/11/2024',
        proximaRevisao: '10/02/2025',
        valorGasto: 1850
      },
      status: 'Em manutenção',
      prioridade: 'alta',
      observacoes: 'Problemas recorrentes no sistema elétrico'
    },
    {
      id: 'VEI-003',
      placa: 'DEF-5678',
      marca: 'Volkswagen',
      modelo: 'Golf',
      ano: 2021,
      cor: 'Preto',
      combustivel: 'Gasolina',
      quilometragem: 25000,
      cliente: {
        nome: 'Pedro Costa',
        telefone: '(11) 99876-5432',
        email: 'pedro@email.com',
        endereco: 'Rua da Consolação, 789 - São Paulo/SP'
      },
      historico: {
        totalServicos: 3,
        ultimoServico: '05/11/2024',
        proximaRevisao: '05/08/2025',
        valorGasto: 950
      },
      status: 'Concluído',
      prioridade: 'normal'
    }
  ]);

  const [busca, setBusca] = useState('');
  const [filtros, setFiltros] = useState<Record<string, FilterValue>>({
    status: '',
    marca: '',
    combustivel: '',
    prioridade: ''
  });
  const [showNovoVeiculo, setShowNovoVeiculo] = useState(false);
  const [veiculoSelecionado, setVeiculoSelecionado] = useState<Veiculo | null>(null);
  const [showDetalhes, setShowDetalhes] = useState(false);
  
  const [novoVeiculo, setNovoVeiculo] = useState<{
    placa: string;
    marca: string;
    modelo: string;
    ano: number;
    cor: string;
    combustivel: CombustivelType;
    quilometragem: number;
    cliente: {
      nome: string;
      telefone: string;
      email: string;
      endereco: string;
    };
    observacoes: string;
  }>({
    placa: '',
    marca: '',
    modelo: '',
    ano: new Date().getFullYear(),
    cor: '',
    combustivel: 'Flex',
    quilometragem: 0,
    cliente: {
      nome: '',
      telefone: '',
      email: '',
      endereco: ''
    },
    observacoes: ''
  });

  // Filtros disponíveis
  const filtrosConfig = [
    {
      id: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: '', label: 'Todos os status' },
        { value: 'Ativo', label: 'Ativo' },
        { value: 'Em manutenção', label: 'Em manutenção' },
        { value: 'Aguardando peças', label: 'Aguardando peças' },
        { value: 'Concluído', label: 'Concluído' }
      ]
    },
    {
      id: 'marca',
      label: 'Marca',
      type: 'select' as const,
      options: [
        { value: '', label: 'Todas as marcas' },
        { value: 'Honda', label: 'Honda' },
        { value: 'Toyota', label: 'Toyota' },
        { value: 'Volkswagen', label: 'Volkswagen' },
        { value: 'Ford', label: 'Ford' },
        { value: 'Chevrolet', label: 'Chevrolet' },
        { value: 'Fiat', label: 'Fiat' }
      ]
    },
    {
      id: 'combustivel',
      label: 'Combustível',
      type: 'select' as const,
      options: [
        { value: '', label: 'Todos os combustíveis' },
        { value: 'Gasolina', label: 'Gasolina' },
        { value: 'Etanol', label: 'Etanol' },
        { value: 'Diesel', label: 'Diesel' },
        { value: 'Flex', label: 'Flex' },
        { value: 'Híbrido', label: 'Híbrido' },
        { value: 'Elétrico', label: 'Elétrico' }
      ]
    }
  ];

  const veiculosFiltrados = veiculos.filter(veiculo => {
    const matchBusca = 
      veiculo.placa.toLowerCase().includes(busca.toLowerCase()) ||
      veiculo.marca.toLowerCase().includes(busca.toLowerCase()) ||
      veiculo.modelo.toLowerCase().includes(busca.toLowerCase()) ||
      veiculo.cliente.nome.toLowerCase().includes(busca.toLowerCase());
    
    const matchStatus = !filtros.status || veiculo.status === filtros.status;
    const matchMarca = !filtros.marca || veiculo.marca === filtros.marca;
    const matchCombustivel = !filtros.combustivel || veiculo.combustivel === filtros.combustivel;
    
    return matchBusca && matchStatus && matchMarca && matchCombustivel;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'bg-green-100 text-green-800 border-green-200';
      case 'Em manutenção': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Aguardando peças': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Concluído': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'urgente': return 'border-l-red-500';
      case 'alta': return 'border-l-orange-500';
      case 'normal': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const adicionarVeiculo = () => {
    if (!novoVeiculo.placa || !novoVeiculo.marca || !novoVeiculo.modelo || !novoVeiculo.cliente.nome) {
      return;
    }

    const veiculo: Veiculo = {
      id: `VEI-${String(veiculos.length + 1).padStart(3, '0')}`,
      ...novoVeiculo,
      historico: {
        totalServicos: 0,
        ultimoServico: '-',
        proximaRevisao: '-',
        valorGasto: 0
      },
      status: 'Ativo',
      prioridade: 'normal'
    };

    setVeiculos([...veiculos, veiculo]);
    setNovoVeiculo({
      placa: '',
      marca: '',
      modelo: '',
      ano: new Date().getFullYear(),
      cor: '',
      combustivel: 'Flex',
      quilometragem: 0,
      cliente: {
        nome: '',
        telefone: '',
        email: '',
        endereco: ''
      },
      observacoes: ''
    });
    setShowNovoVeiculo(false);
  };

  const estatisticas = {
    total: veiculos.length,
    ativos: veiculos.filter(v => v.status === 'Ativo').length,
    emManutencao: veiculos.filter(v => v.status === 'Em manutenção').length,
    proximasRevisoes: veiculos.filter(v => v.historico.proximaRevisao !== '-' && new Date(v.historico.proximaRevisao.split('/').reverse().join('-')) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <TruckIcon className="h-8 w-8 text-[#0047CC] mr-3" />
                Gerenciar Veículos
              </h1>
              <p className="text-gray-600 mt-1">
                Controle completo dos veículos dos seus clientes
              </p>
            </div>
            
            <button
              onClick={() => setShowNovoVeiculo(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Novo Veículo
            </button>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-xl p-4 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total de Veículos</p>
                  <p className="text-2xl font-bold">{estatisticas.total}</p>
                </div>
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <TruckIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 rounded-xl p-4 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Veículos Ativos</p>
                  <p className="text-2xl font-bold">{estatisticas.ativos}</p>
                </div>
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <CheckCircleIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 rounded-xl p-4 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Em Manutenção</p>
                  <p className="text-2xl font-bold">{estatisticas.emManutencao}</p>
                </div>
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <WrenchScrewdriverIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-violet-500 via-purple-600 to-purple-700 rounded-xl p-4 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Próximas Revisões</p>
                  <p className="text-2xl font-bold">{estatisticas.proximasRevisoes}</p>
                </div>
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <CalendarDaysIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="p-6">
        <DashboardFilters
          searchPlaceholder="Buscar por placa, marca, modelo ou cliente..."
          searchValue={busca}
          onSearchChange={setBusca}
          filters={filtrosConfig}
          filterValues={filtros}
          onFilterChange={setFiltros}
        />

        {/* Lista de Veículos */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Veículo</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Cliente</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Histórico</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Próxima Revisão</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {veiculosFiltrados.map((veiculo, index) => (
                    <motion.tr
                      key={veiculo.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors border-l-4 ${getPrioridadeColor(veiculo.prioridade)}`}
                    >
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-semibold text-gray-900">
                            {veiculo.marca} {veiculo.modelo}
                          </div>
                          <div className="text-sm text-gray-600">
                            {veiculo.placa} • {veiculo.ano} • {veiculo.cor}
                          </div>
                          <div className="text-xs text-gray-500">
                            {veiculo.quilometragem.toLocaleString()} km • {veiculo.combustivel}
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-semibold text-gray-900">{veiculo.cliente.nome}</div>
                          <div className="text-sm text-gray-600">{veiculo.cliente.telefone}</div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(veiculo.status)}`}>
                          {veiculo.status}
                        </span>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="text-sm">
                          <div className="text-gray-900 font-medium">{veiculo.historico.totalServicos} serviços</div>
                          <div className="text-gray-600">R$ {veiculo.historico.valorGasto.toLocaleString()}</div>
                          <div className="text-gray-500">Último: {veiculo.historico.ultimoServico}</div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900">{veiculo.historico.proximaRevisao}</div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setVeiculoSelecionado(veiculo);
                              setShowDetalhes(true);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900 transition-colors"
                            title="Ver detalhes"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900 transition-colors"
                            title="Editar"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {veiculosFiltrados.length === 0 && (
            <div className="text-center py-12">
              <TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum veículo encontrado</h3>
              <p className="text-gray-600">Tente ajustar os filtros ou adicione um novo veículo</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Novo Veículo */}
      <AnimatePresence>
        {showNovoVeiculo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowNovoVeiculo(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Cadastrar Novo Veículo</h2>
                  <button 
                    onClick={() => setShowNovoVeiculo(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <XMarkIcon className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Dados do Veículo */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados do Veículo</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Placa *</label>
                      <input
                        type="text"
                        value={novoVeiculo.placa}
                        onChange={(e) => setNovoVeiculo({...novoVeiculo, placa: e.target.value.toUpperCase()})}
                        placeholder="ABC-1234"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047CC] focus:border-[#0047CC]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Marca *</label>
                      <select
                        value={novoVeiculo.marca}
                        onChange={(e) => setNovoVeiculo({...novoVeiculo, marca: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047CC] focus:border-[#0047CC]"
                      >
                        <option value="">Selecione a marca</option>
                        <option value="Honda">Honda</option>
                        <option value="Toyota">Toyota</option>
                        <option value="Volkswagen">Volkswagen</option>
                        <option value="Ford">Ford</option>
                        <option value="Chevrolet">Chevrolet</option>
                        <option value="Fiat">Fiat</option>
                        <option value="Hyundai">Hyundai</option>
                        <option value="Nissan">Nissan</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Modelo *</label>
                      <input
                        type="text"
                        value={novoVeiculo.modelo}
                        onChange={(e) => setNovoVeiculo({...novoVeiculo, modelo: e.target.value})}
                        placeholder="Ex: Civic, Corolla, Golf"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047CC] focus:border-[#0047CC]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ano</label>
                      <input
                        type="number"
                        value={novoVeiculo.ano}
                        onChange={(e) => setNovoVeiculo({...novoVeiculo, ano: parseInt(e.target.value)})}
                        min="1950"
                        max={new Date().getFullYear() + 1}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047CC] focus:border-[#0047CC]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cor</label>
                      <input
                        type="text"
                        value={novoVeiculo.cor}
                        onChange={(e) => setNovoVeiculo({...novoVeiculo, cor: e.target.value})}
                        placeholder="Ex: Branco, Prata, Preto"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047CC] focus:border-[#0047CC]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Combustível</label>
                      <select
                        value={novoVeiculo.combustivel}
                        onChange={(e) => setNovoVeiculo({...novoVeiculo, combustivel: e.target.value as CombustivelType})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047CC] focus:border-[#0047CC]"
                      >
                        <option value="Flex">Flex</option>
                        <option value="Gasolina">Gasolina</option>
                        <option value="Etanol">Etanol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Híbrido">Híbrido</option>
                        <option value="Elétrico">Elétrico</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quilometragem</label>
                      <input
                        type="number"
                        value={novoVeiculo.quilometragem}
                        onChange={(e) => setNovoVeiculo({...novoVeiculo, quilometragem: parseInt(e.target.value) || 0})}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047CC] focus:border-[#0047CC]"
                      />
                    </div>
                  </div>
                </div>

                {/* Dados do Cliente */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados do Cliente</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Cliente *</label>
                      <input
                        type="text"
                        value={novoVeiculo.cliente.nome}
                        onChange={(e) => setNovoVeiculo({
                          ...novoVeiculo,
                          cliente: {...novoVeiculo.cliente, nome: e.target.value}
                        })}
                        placeholder="Nome completo"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047CC] focus:border-[#0047CC]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                      <input
                        type="tel"
                        value={novoVeiculo.cliente.telefone}
                        onChange={(e) => setNovoVeiculo({
                          ...novoVeiculo,
                          cliente: {...novoVeiculo.cliente, telefone: e.target.value}
                        })}
                        placeholder="(11) 99999-9999"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047CC] focus:border-[#0047CC]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                      <input
                        type="email"
                        value={novoVeiculo.cliente.email}
                        onChange={(e) => setNovoVeiculo({
                          ...novoVeiculo,
                          cliente: {...novoVeiculo.cliente, email: e.target.value}
                        })}
                        placeholder="cliente@email.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047CC] focus:border-[#0047CC]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                      <input
                        type="text"
                        value={novoVeiculo.cliente.endereco}
                        onChange={(e) => setNovoVeiculo({
                          ...novoVeiculo,
                          cliente: {...novoVeiculo.cliente, endereco: e.target.value}
                        })}
                        placeholder="Endereço completo"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047CC] focus:border-[#0047CC]"
                      />
                    </div>
                  </div>
                </div>

                {/* Observações */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                  <textarea
                    value={novoVeiculo.observacoes}
                    onChange={(e) => setNovoVeiculo({...novoVeiculo, observacoes: e.target.value})}
                    placeholder="Informações adicionais sobre o veículo ou cliente..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047CC] focus:border-[#0047CC]"
                  />
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
                <button 
                  onClick={() => setShowNovoVeiculo(false)}
                  className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={adicionarVeiculo}
                  disabled={!novoVeiculo.placa || !novoVeiculo.marca || !novoVeiculo.modelo || !novoVeiculo.cliente.nome}
                  className="bg-[#0047CC] hover:bg-[#0055EB] disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Cadastrar Veículo
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Detalhes do Veículo */}
      <AnimatePresence>
        {showDetalhes && veiculoSelecionado && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetalhes(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {veiculoSelecionado.marca} {veiculoSelecionado.modelo} ({veiculoSelecionado.placa})
                    </h2>
                    <p className="text-gray-600">Detalhes completos do veículo</p>
                  </div>
                  <button 
                    onClick={() => setShowDetalhes(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <XMarkIcon className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Informações do Veículo */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <TruckIcon className="h-5 w-5 mr-2 text-[#0047CC]" />
                      Informações do Veículo
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Placa:</span>
                        <span className="font-medium">{veiculoSelecionado.placa}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Marca/Modelo:</span>
                        <span className="font-medium">{veiculoSelecionado.marca} {veiculoSelecionado.modelo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ano:</span>
                        <span className="font-medium">{veiculoSelecionado.ano}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cor:</span>
                        <span className="font-medium">{veiculoSelecionado.cor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Combustível:</span>
                        <span className="font-medium">{veiculoSelecionado.combustivel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quilometragem:</span>
                        <span className="font-medium">{veiculoSelecionado.quilometragem.toLocaleString()} km</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <UserIcon className="h-5 w-5 mr-2 text-[#0047CC]" />
                      Dados do Cliente
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nome:</span>
                        <span className="font-medium">{veiculoSelecionado.cliente.nome}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Telefone:</span>
                        <span className="font-medium">{veiculoSelecionado.cliente.telefone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">E-mail:</span>
                        <span className="font-medium">{veiculoSelecionado.cliente.email}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-600 mb-1">Endereço:</span>
                        <span className="font-medium text-xs">{veiculoSelecionado.cliente.endereco}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Histórico de Serviços */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <WrenchScrewdriverIcon className="h-5 w-5 mr-2 text-[#0047CC]" />
                    Histórico de Serviços
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#0047CC]">{veiculoSelecionado.historico.totalServicos}</div>
                      <div className="text-gray-600">Total de Serviços</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">R$ {veiculoSelecionado.historico.valorGasto.toLocaleString()}</div>
                      <div className="text-gray-600">Valor Total Gasto</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{veiculoSelecionado.historico.ultimoServico}</div>
                      <div className="text-gray-600">Último Serviço</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">{veiculoSelecionado.historico.proximaRevisao}</div>
                      <div className="text-gray-600">Próxima Revisão</div>
                    </div>
                  </div>
                </div>

                {/* Observações */}
                {veiculoSelecionado.observacoes && (
                  <div className="bg-yellow-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <DocumentTextIcon className="h-5 w-5 mr-2 text-[#0047CC]" />
                      Observações
                    </h3>
                    <p className="text-gray-700 text-sm">{veiculoSelecionado.observacoes}</p>
                  </div>
                )}

                {/* Ações Rápidas */}
                <div className="flex flex-wrap gap-3">
                  <button className="bg-[#0047CC] hover:bg-[#0055EB] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
                    <WrenchScrewdriverIcon className="h-4 w-4 mr-2" />
                    Nova Ordem de Serviço
                  </button>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
                    <CalendarDaysIcon className="h-4 w-4 mr-2" />
                    Agendar Revisão
                  </button>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    Entrar em Contato
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 