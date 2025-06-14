"use client";

import { useState } from 'react';
import {
  DocumentTextIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  PaperAirplaneIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
  CurrencyDollarIcon,
  UserIcon,
  TruckIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardFilters, { type FilterValue } from '@/components/dashboard/DashboardFilters';

interface Orcamento {
  id: string;
  numero: string;
  cliente: {
    nome: string;
    telefone: string;
    email: string;
  };
  veiculo: {
    placa: string;
    marca: string;
    modelo: string;
    ano: number;
  };
  servicos: {
    descricao: string;
    valor: number;
    tempo: string;
  }[];
  valorTotal: number;
  status: 'Rascunho' | 'Enviado' | 'Aprovado' | 'Rejeitado' | 'Expirado';
  dataEnvio?: string;
  dataResposta?: string;
  observacoes?: string;
  validadeAte: string;
}

export default function OrcamentosPage() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([
    {
      id: 'ORC-001',
      numero: '2024-001',
      cliente: {
        nome: 'João Silva',
        telefone: '(11) 98765-4321',
        email: 'joao@email.com'
      },
      veiculo: {
        placa: 'ABC-1234',
        marca: 'Honda',
        modelo: 'Civic',
        ano: 2020
      },
      servicos: [
        { descricao: 'Troca de óleo e filtro', valor: 80, tempo: '1h' },
        { descricao: 'Alinhamento e balanceamento', valor: 120, tempo: '1.5h' }
      ],
      valorTotal: 200,
      status: 'Aprovado',
      dataEnvio: '15/11/2024',
      dataResposta: '16/11/2024',
      validadeAte: '30/11/2024'
    },
    {
      id: 'ORC-002',
      numero: '2024-002',
      cliente: {
        nome: 'Maria Santos',
        telefone: '(11) 91234-5678',
        email: 'maria@email.com'
      },
      veiculo: {
        placa: 'XYZ-9876',
        marca: 'Toyota',
        modelo: 'Corolla',
        ano: 2019
      },
      servicos: [
        { descricao: 'Troca de pastilhas de freio', valor: 180, tempo: '2h' },
        { descricao: 'Revisão do sistema de freios', valor: 80, tempo: '1h' }
      ],
      valorTotal: 260,
      status: 'Enviado',
      dataEnvio: '18/11/2024',
      validadeAte: '03/12/2024'
    }
  ]);

  const [busca, setBusca] = useState('');
  const [filtros, setFiltros] = useState<Record<string, FilterValue>>({
    status: '',
    dataInicio: '',
    dataFim: ''
  });
  const [showNovoOrcamento, setShowNovoOrcamento] = useState(false);
  const [orcamentoSelecionado, setOrcamentoSelecionado] = useState<Orcamento | null>(null);
  const [showDetalhes, setShowDetalhes] = useState(false);

  const filtrosConfig = [
    {
      id: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: '', label: 'Todos os status' },
        { value: 'Rascunho', label: 'Rascunho' },
        { value: 'Enviado', label: 'Enviado' },
        { value: 'Aprovado', label: 'Aprovado' },
        { value: 'Rejeitado', label: 'Rejeitado' },
        { value: 'Expirado', label: 'Expirado' }
      ]
    },
    {
      id: 'dataInicio',
      label: 'Data Início',
      type: 'date' as const
    },
    {
      id: 'dataFim',
      label: 'Data Fim',
      type: 'date' as const
    }
  ];

  const orcamentosFiltrados = orcamentos.filter(orcamento => {
    const matchBusca = 
      orcamento.numero.toLowerCase().includes(busca.toLowerCase()) ||
      orcamento.cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
      orcamento.veiculo.placa.toLowerCase().includes(busca.toLowerCase());
    
    const matchStatus = !filtros.status || orcamento.status === filtros.status;
    
    return matchBusca && matchStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Rascunho': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Enviado': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Aprovado': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejeitado': return 'bg-red-100 text-red-800 border-red-200';
      case 'Expirado': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const estatisticas = {
    total: orcamentos.length,
    enviados: orcamentos.filter(o => o.status === 'Enviado').length,
    aprovados: orcamentos.filter(o => o.status === 'Aprovado').length,
    valorTotal: orcamentos.filter(o => o.status === 'Aprovado').reduce((acc, o) => acc + o.valorTotal, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <DocumentTextIcon className="h-8 w-8 text-[#0047CC] mr-3" />
                Gerenciar Orçamentos
              </h1>
              <p className="text-gray-600 mt-1">
                Crie, envie e acompanhe orçamentos para seus clientes
              </p>
            </div>
            
            <button
              onClick={() => setShowNovoOrcamento(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Novo Orçamento
            </button>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-xl p-4 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total de Orçamentos</p>
                  <p className="text-2xl font-bold">{estatisticas.total}</p>
                </div>
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <DocumentTextIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 rounded-xl p-4 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Aguardando Resposta</p>
                  <p className="text-2xl font-bold">{estatisticas.enviados}</p>
                </div>
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <ClockIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 rounded-xl p-4 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Aprovados</p>
                  <p className="text-2xl font-bold">{estatisticas.aprovados}</p>
                </div>
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <CheckCircleIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-violet-500 via-purple-600 to-purple-700 rounded-xl p-4 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Valor Aprovado</p>
                  <p className="text-2xl font-bold">R$ {estatisticas.valorTotal.toLocaleString()}</p>
                </div>
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <CurrencyDollarIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="p-6">
        <DashboardFilters
          searchPlaceholder="Buscar por número, cliente ou placa do veículo..."
          searchValue={busca}
          onSearchChange={setBusca}
          filters={filtrosConfig}
          filterValues={filtros}
          onFilterChange={setFiltros}
        />

        {/* Lista de Orçamentos */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Orçamento</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Cliente</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Veículo</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Valor Total</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Validade</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {orcamentosFiltrados.map((orcamento, index) => (
                    <motion.tr
                      key={orcamento.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-semibold text-gray-900">#{orcamento.numero}</div>
                          <div className="text-sm text-gray-600">
                            {orcamento.dataEnvio && `Enviado em ${orcamento.dataEnvio}`}
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-semibold text-gray-900">{orcamento.cliente.nome}</div>
                          <div className="text-sm text-gray-600">{orcamento.cliente.telefone}</div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-semibold text-gray-900">
                            {orcamento.veiculo.marca} {orcamento.veiculo.modelo}
                          </div>
                          <div className="text-sm text-gray-600">
                            {orcamento.veiculo.placa} • {orcamento.veiculo.ano}
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="font-semibold text-gray-900">
                          R$ {orcamento.valorTotal.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          {orcamento.servicos.length} serviço{orcamento.servicos.length > 1 ? 's' : ''}
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(orcamento.status)}`}>
                          {orcamento.status}
                        </span>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900">{orcamento.validadeAte}</div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setOrcamentoSelecionado(orcamento);
                              setShowDetalhes(true);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900 transition-colors"
                            title="Ver detalhes"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          
                          {orcamento.status === 'Rascunho' && (
                            <button
                              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900 transition-colors"
                              title="Editar"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                          )}
                          
                          {(orcamento.status === 'Rascunho' || orcamento.status === 'Enviado') && (
                            <button
                              className="p-2 hover:bg-gray-100 rounded-lg text-blue-600 hover:text-blue-900 transition-colors"
                              title="Enviar"
                            >
                              <PaperAirplaneIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {orcamentosFiltrados.length === 0 && (
            <div className="text-center py-12">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum orçamento encontrado</h3>
              <p className="text-gray-600">Tente ajustar os filtros ou crie um novo orçamento</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Detalhes do Orçamento */}
      <AnimatePresence>
        {showDetalhes && orcamentoSelecionado && (
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
                      Orçamento #{orcamentoSelecionado.numero}
                    </h2>
                    <p className="text-gray-600">Detalhes completos do orçamento</p>
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
                {/* Informações do Cliente e Veículo */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <UserIcon className="h-5 w-5 mr-2 text-[#0047CC]" />
                      Cliente
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nome:</span>
                        <span className="font-medium">{orcamentoSelecionado.cliente.nome}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Telefone:</span>
                        <span className="font-medium">{orcamentoSelecionado.cliente.telefone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">E-mail:</span>
                        <span className="font-medium">{orcamentoSelecionado.cliente.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <TruckIcon className="h-5 w-5 mr-2 text-[#0047CC]" />
                      Veículo
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Placa:</span>
                        <span className="font-medium">{orcamentoSelecionado.veiculo.placa}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Marca/Modelo:</span>
                        <span className="font-medium">
                          {orcamentoSelecionado.veiculo.marca} {orcamentoSelecionado.veiculo.modelo}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ano:</span>
                        <span className="font-medium">{orcamentoSelecionado.veiculo.ano}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Serviços */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <DocumentTextIcon className="h-5 w-5 mr-2 text-[#0047CC]" />
                    Serviços Orçados
                  </h3>
                  <div className="space-y-3">
                    {orcamentoSelecionado.servicos.map((servico, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-gray-900">{servico.descricao}</h4>
                          <p className="text-sm text-gray-600">Tempo estimado: {servico.tempo}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">R$ {servico.valor.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                    
                    <div className="bg-[#0047CC] rounded-lg p-3 flex justify-between items-center text-white">
                      <h4 className="font-bold">TOTAL</h4>
                      <p className="font-bold text-lg">R$ {orcamentoSelecionado.valorTotal.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Status e Datas */}
                <div className="bg-yellow-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <CalendarDaysIcon className="h-5 w-5 mr-2 text-[#0047CC]" />
                    Status e Prazos
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 block">Status atual:</span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(orcamentoSelecionado.status)} mt-1`}>
                        {orcamentoSelecionado.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 block">Válido até:</span>
                      <span className="font-medium">{orcamentoSelecionado.validadeAte}</span>
                    </div>
                    {orcamentoSelecionado.dataEnvio && (
                      <div>
                        <span className="text-gray-600 block">Data de envio:</span>
                        <span className="font-medium">{orcamentoSelecionado.dataEnvio}</span>
                      </div>
                    )}
                    {orcamentoSelecionado.dataResposta && (
                      <div>
                        <span className="text-gray-600 block">Data da resposta:</span>
                        <span className="font-medium">{orcamentoSelecionado.dataResposta}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Observações */}
                {orcamentoSelecionado.observacoes && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Observações</h3>
                    <p className="text-gray-700 text-sm">{orcamentoSelecionado.observacoes}</p>
                  </div>
                )}

                {/* Ações */}
                <div className="flex flex-wrap gap-3">
                  <button className="bg-[#0047CC] hover:bg-[#0055EB] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
                    <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                    Reenviar por WhatsApp
                  </button>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Imprimir PDF
                  </button>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Duplicar Orçamento
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