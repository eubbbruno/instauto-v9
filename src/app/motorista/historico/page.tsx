"use client";

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  CalendarIcon,
  MapPinIcon,
  StarIcon,
  ClockIcon,
  DocumentTextIcon,
  EyeIcon,
  ReceiptPercentIcon,
  WrenchIcon,
  FunnelIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon as PendingIcon
} from '@heroicons/react/24/outline';
import GlobalHeader from '@/components/GlobalHeader';
import Footer from '@/components/Footer';

interface ServicoHistorico {
  id: string;
  agendamentoId: string;
  oficina: {
    id: string;
    nome: string;
    endereco: string;
    foto?: string;
    avaliacao: number;
  };
  veiculo: {
    marca: string;
    modelo: string;
    ano: number;
    placa: string;
  };
  servicos: string[];
  dataServico: string;
  status: 'concluido' | 'cancelado' | 'em_andamento';
  valorTotal: number;
  tempoServico: string; // duração
  avaliacaoCliente?: {
    nota: number;
    comentario: string;
    data: string;
  };
  garantia?: {
    temGarantia: boolean;
    validadeGarantia?: string;
    tipoGarantia?: string;
  };
  observacoes?: string;
  proximaRevisao?: string;
}

export default function HistoricoPage() {
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'concluido' | 'cancelado' | 'em_andamento'>('todos');
  const [filtroPeriodo, setFiltroPeriodo] = useState<'todos' | '30dias' | '6meses' | '1ano'>('todos');
  const [filtroOficina, setFiltroOficina] = useState('todas');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [ordenacao, setOrdenacao] = useState<'recente' | 'antigo' | 'valor' | 'avaliacao'>('recente');

  // Mock de dados do histórico
  const historico: ServicoHistorico[] = [
    {
      id: 'serv-001',
      agendamentoId: 'ag-001',
      oficina: {
        id: 'of-001',
        nome: 'Auto Center Silva Premium',
        endereco: 'Av. Paulista, 1500 - Bela Vista',
        foto: '/images/oficina1.jpg',
        avaliacao: 4.8
      },
      veiculo: {
        marca: 'Honda',
        modelo: 'Civic',
        ano: 2020,
        placa: 'ABC-1234'
      },
      servicos: ['Revisão completa', 'Troca de óleo', 'Filtros'],
      dataServico: '2024-01-10T14:00:00Z',
      status: 'concluido',
      valorTotal: 450.00,
      tempoServico: '3h 30min',
      avaliacaoCliente: {
        nota: 5,
        comentario: 'Excelente atendimento e serviço de qualidade!',
        data: '2024-01-10T18:00:00Z'
      },
      garantia: {
        temGarantia: true,
        validadeGarantia: '2024-07-10',
        tipoGarantia: '6 meses ou 10.000 km'
      },
      proximaRevisao: '2024-07-10'
    },
    {
      id: 'serv-002',
      agendamentoId: 'ag-002',
      oficina: {
        id: 'of-002',
        nome: 'Mecânica Express 24h',
        endereco: 'Rua Augusta, 800 - Consolação',
        foto: '/images/oficina2.jpg',
        avaliacao: 4.5
      },
      veiculo: {
        marca: 'Honda',
        modelo: 'Civic',
        ano: 2020,
        placa: 'ABC-1234'
      },
      servicos: ['Diagnóstico elétrico', 'Reparo do alternador'],
      dataServico: '2023-12-15T09:00:00Z',
      status: 'concluido',
      valorTotal: 280.00,
      tempoServico: '2h 15min',
      avaliacaoCliente: {
        nota: 4,
        comentario: 'Bom serviço, resolveu o problema rapidamente.',
        data: '2023-12-15T12:00:00Z'
      },
      garantia: {
        temGarantia: true,
        validadeGarantia: '2024-06-15',
        tipoGarantia: '6 meses'
      }
    },
    {
      id: 'serv-003',
      agendamentoId: 'ag-003',
      oficina: {
        id: 'of-003',
        nome: 'Oficina do João',
        endereco: 'Rua Vergueiro, 1200 - Liberdade',
        foto: '/images/oficina3.jpg',
        avaliacao: 4.2
      },
      veiculo: {
        marca: 'Honda',
        modelo: 'Civic',
        ano: 2020,
        placa: 'ABC-1234'
      },
      servicos: ['Funilaria', 'Pintura'],
      dataServico: '2023-11-20T08:00:00Z',
      status: 'cancelado',
      valorTotal: 0,
      tempoServico: '0min',
      observacoes: 'Cancelado pelo cliente - mudança de planos'
    },
    {
      id: 'serv-004',
      agendamentoId: 'ag-004',
      oficina: {
        id: 'of-001',
        nome: 'Auto Center Silva Premium',
        endereco: 'Av. Paulista, 1500 - Bela Vista',
        foto: '/images/oficina1.jpg',
        avaliacao: 4.8
      },
      veiculo: {
        marca: 'Honda',
        modelo: 'Civic',
        ano: 2020,
        placa: 'ABC-1234'
      },
      servicos: ['Alinhamento', 'Balanceamento'],
      dataServico: '2024-01-20T10:00:00Z',
      status: 'em_andamento',
      valorTotal: 150.00,
      tempoServico: '1h 30min estimado'
    }
  ];

  // Filtrar histórico
  const historicoFiltrado = useMemo(() => {
    let resultado = [...historico];

    // Filtro por busca
    if (busca) {
      const termoBusca = busca.toLowerCase();
      resultado = resultado.filter(item =>
        item.oficina.nome.toLowerCase().includes(termoBusca) ||
        item.servicos.some(s => s.toLowerCase().includes(termoBusca)) ||
        item.veiculo.marca.toLowerCase().includes(termoBusca) ||
        item.veiculo.modelo.toLowerCase().includes(termoBusca)
      );
    }

    // Filtro por status
    if (filtroStatus !== 'todos') {
      resultado = resultado.filter(item => item.status === filtroStatus);
    }

    // Filtro por período
    if (filtroPeriodo !== 'todos') {
      const agora = new Date();
      const dataLimite = new Date();
      
      switch (filtroPeriodo) {
        case '30dias':
          dataLimite.setDate(agora.getDate() - 30);
          break;
        case '6meses':
          dataLimite.setMonth(agora.getMonth() - 6);
          break;
        case '1ano':
          dataLimite.setFullYear(agora.getFullYear() - 1);
          break;
      }
      
      resultado = resultado.filter(item => 
        new Date(item.dataServico) >= dataLimite
      );
    }

    // Filtro por oficina
    if (filtroOficina !== 'todas') {
      resultado = resultado.filter(item => item.oficina.id === filtroOficina);
    }

    // Ordenação
    resultado.sort((a, b) => {
      switch (ordenacao) {
        case 'recente':
          return new Date(b.dataServico).getTime() - new Date(a.dataServico).getTime();
        case 'antigo':
          return new Date(a.dataServico).getTime() - new Date(b.dataServico).getTime();
        case 'valor':
          return b.valorTotal - a.valorTotal;
        case 'avaliacao':
          return (b.avaliacaoCliente?.nota || 0) - (a.avaliacaoCliente?.nota || 0);
        default:
          return 0;
      }
    });

    return resultado;
  }, [busca, filtroStatus, filtroPeriodo, filtroOficina, ordenacao]);

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatarDataCompleta = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluido':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'cancelado':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'em_andamento':
        return <PendingIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'concluido':
        return 'Concluído';
      case 'cancelado':
        return 'Cancelado';
      case 'em_andamento':
        return 'Em andamento';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluido':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      case 'em_andamento':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  // Estatísticas
  const stats = {
    total: historico.length,
    concluidos: historico.filter(h => h.status === 'concluido').length,
    valorTotal: historico.filter(h => h.status === 'concluido').reduce((sum, h) => sum + h.valorTotal, 0),
    avaliacaoMedia: historico.filter(h => h.avaliacaoCliente).reduce((sum, h) => sum + (h.avaliacaoCliente?.nota || 0), 0) / historico.filter(h => h.avaliacaoCliente).length || 0
  };

  const oficinasUnicas = Array.from(new Set(historico.map(h => h.oficina.id)))
    .map(id => historico.find(h => h.oficina.id === id)?.oficina)
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalHeader title="Histórico de Serviços" />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <WrenchIcon className="h-8 w-8 text-[#0047CC] mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600">Total de serviços</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.concluidos}</p>
                <p className="text-sm text-gray-600">Concluídos</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <ReceiptPercentIcon className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  R$ {stats.valorTotal.toFixed(2).replace('.', ',')}
                </p>
                <p className="text-sm text-gray-600">Valor total gasto</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <StarIcon className="h-8 w-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.avaliacaoMedia.toFixed(1)}
                </p>
                <p className="text-sm text-gray-600">Avaliação média</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros e busca */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Busca */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por oficina, serviço ou veículo..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC]"
              />
            </div>

            {/* Filtros rápidos */}
            <div className="flex flex-wrap gap-2">
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC] bg-white"
              >
                <option value="todos">Todos os status</option>
                <option value="concluido">Concluídos</option>
                <option value="em_andamento">Em andamento</option>
                <option value="cancelado">Cancelados</option>
              </select>

              <select
                value={filtroPeriodo}
                onChange={(e) => setFiltroPeriodo(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC] bg-white"
              >
                <option value="todos">Todo o período</option>
                <option value="30dias">Últimos 30 dias</option>
                <option value="6meses">Últimos 6 meses</option>
                <option value="1ano">Último ano</option>
              </select>

              <select
                value={ordenacao}
                onChange={(e) => setOrdenacao(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC] bg-white"
              >
                <option value="recente">Mais recentes</option>
                <option value="antigo">Mais antigos</option>
                <option value="valor">Maior valor</option>
                <option value="avaliacao">Melhor avaliação</option>
              </select>

              <button
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
              >
                <FunnelIcon className="h-4 w-4 mr-2" />
                Filtros
                <ChevronDownIcon className={`h-4 w-4 ml-2 transition-transform ${mostrarFiltros ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Filtros avançados */}
          <AnimatePresence>
            {mostrarFiltros && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Oficina
                    </label>
                    <select
                      value={filtroOficina}
                      onChange={(e) => setFiltroOficina(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC] bg-white"
                    >
                      <option value="todas">Todas as oficinas</option>
                      {oficinasUnicas.map((oficina) => (
                        <option key={oficina?.id} value={oficina?.id}>
                          {oficina?.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Lista do histórico */}
        {historicoFiltrado.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {busca ? 'Nenhum serviço encontrado' : 'Nenhum serviço realizado'}
            </h3>
            <p className="text-gray-500 mb-6">
              {busca 
                ? 'Tente ajustar os filtros ou termo de busca' 
                : 'Quando você realizar serviços, eles aparecerão aqui'
              }
            </p>
            {!busca && (
              <Link 
                href="/oficinas/busca"
                className="inline-flex items-center px-6 py-3 bg-[#0047CC] text-white font-medium rounded-xl hover:bg-[#003DA6] transition-colors"
              >
                <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                Buscar Oficinas
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {historicoFiltrado.map((servico, index) => (
              <motion.div
                key={servico.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      {/* Foto da oficina */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={servico.oficina.foto || '/images/oficina-placeholder.jpg'}
                          alt={servico.oficina.nome}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Informações principais */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {servico.oficina.nome}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(servico.status)}`}>
                            {getStatusText(servico.status)}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          <span>{servico.oficina.endereco}</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          <span>{formatarDataCompleta(servico.dataServico)}</span>
                          <span className="mx-2">•</span>
                          <ClockIcon className="h-4 w-4 mr-1" />
                          <span>{servico.tempoServico}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status e valor */}
                    <div className="text-right">
                      <div className="flex items-center justify-end mb-2">
                        {getStatusIcon(servico.status)}
                      </div>
                      {servico.status === 'concluido' && (
                        <p className="text-lg font-semibold text-[#0047CC]">
                          R$ {servico.valorTotal.toFixed(2).replace('.', ',')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Veículo e serviços */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Veículo</h4>
                      <p className="text-sm text-gray-900">
                        {servico.veiculo.marca} {servico.veiculo.modelo} {servico.veiculo.ano}
                      </p>
                      <p className="text-sm text-gray-600">Placa: {servico.veiculo.placa}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Serviços realizados</h4>
                      <div className="flex flex-wrap gap-1">
                        {servico.servicos.map((servico_item, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {servico_item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Avaliação */}
                  {servico.avaliacaoCliente && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-700">Sua avaliação</h4>
                        <div className="flex items-center space-x-1">
                          {renderStars(servico.avaliacaoCliente.nota)}
                        </div>
                      </div>
                      {servico.avaliacaoCliente.comentario && (
                        <p className="text-sm text-gray-600">
                          "{servico.avaliacaoCliente.comentario}"
                        </p>
                      )}
                    </div>
                  )}

                  {/* Garantia */}
                  {servico.garantia?.temGarantia && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-green-800">
                            Serviço com garantia
                          </p>
                          <p className="text-sm text-green-600">
                            {servico.garantia.tipoGarantia} - Válida até {formatarData(servico.garantia.validadeGarantia!)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Próxima revisão */}
                  {servico.proximaRevisao && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center">
                        <CalendarIcon className="h-5 w-5 text-blue-500 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-blue-800">
                            Próxima revisão recomendada
                          </p>
                          <p className="text-sm text-blue-600">
                            {formatarData(servico.proximaRevisao)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Observações */}
                  {servico.observacoes && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-yellow-800">
                        <strong>Observações:</strong> {servico.observacoes}
                      </p>
                    </div>
                  )}

                  {/* Ações */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      <Link
                        href={`/agendamentos/${servico.agendamentoId}`}
                        className="text-sm text-[#0047CC] hover:text-[#003DA6] font-medium flex items-center"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        Ver detalhes
                      </Link>
                      
                      {servico.status === 'concluido' && !servico.avaliacaoCliente && (
                        <button className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center">
                          <StarIcon className="h-4 w-4 mr-1" />
                          Avaliar serviço
                        </button>
                      )}
                    </div>

                    {servico.status === 'concluido' && (
                      <Link
                        href={`/agendar/${servico.oficina.id}`}
                        className="px-4 py-2 bg-[#0047CC] text-white text-sm font-medium rounded-lg hover:bg-[#003DA6] transition-colors"
                      >
                        Agendar novamente
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
} 