"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CalendarDaysIcon, 
  ClipboardDocumentListIcon, 
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XMarkIcon,
  PhoneIcon,
  ChatBubbleLeftIcon,
  ChartBarIcon,
  WrenchScrewdriverIcon,
  BellIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

// Dados mockados para o dashboard
const mockData = {
  stats: {
    ordensHoje: { value: 12, change: +2, percentage: 18.5 },
    agendamentosHoje: { value: 8, change: +1, percentage: 14.3 },
    receitaHoje: { value: 2850, change: +380, percentage: 15.4 },
    clientesAtivos: { value: 156, change: +12, percentage: 8.3 }
  },
  agendamentosHoje: [
    {
      id: '1',
      cliente: 'João Silva',
      servico: 'Troca de óleo + Filtros',
      horario: '09:00',
      veiculo: 'Honda Civic 2020',
      telefone: '(11) 98765-4321',
      status: 'confirmado'
    },
    {
      id: '2',
      cliente: 'Maria Santos',
      servico: 'Revisão completa',
      horario: '10:30',
      veiculo: 'Toyota Corolla 2019',
      telefone: '(11) 91234-5678',
      status: 'pendente'
    },
    {
      id: '3',
      cliente: 'Carlos Ferreira',
      servico: 'Freios + Alinhamento',
      horario: '14:00',
      veiculo: 'Ford Ka 2021',
      telefone: '(11) 99887-6543',
      status: 'confirmado'
    }
  ],
  ordensPendentes: [
    {
      id: '001',
      cliente: 'Ana Costa',
      servico: 'Embreagem + Filtros',
      veiculo: 'Volkswagen Gol 2018',
      valor: 850,
      status: 'Orçamento Enviado',
      dataEnvio: '2024-01-15',
      prazo: '2 dias'
    },
    {
      id: '002',
      cliente: 'Roberto Lima',
      servico: 'Motor - Problema na partida',
      veiculo: 'Fiat Uno 2017',
      valor: 1200,
      status: 'Aguardando Aprovação',
      dataEnvio: '2024-01-14',
      prazo: '1 dia'
    }
  ],
  mensagensRecentes: [
    {
      id: '1',
      cliente: 'João Silva',
      mensagem: 'Bom dia! Meu carro está fazendo um barulho estranho no freio...',
      horario: '08:45',
      naoLida: true
    },
    {
      id: '2',
      cliente: 'Maria Santos',
      mensagem: 'Obrigada pelo excelente atendimento! Recomendo vocês.',
      horario: '08:30',
      naoLida: false
    },
    {
      id: '3',
      cliente: 'Carlos Ferreira',
      mensagem: 'Posso remarcar para 15:00?',
      horario: '08:15',
      naoLida: true
    }
  ]
};

export default function OficinaDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Mobile Optimized */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-3">
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Dashboard da Oficina</h1>
              <p className="text-sm md:text-base text-gray-600 capitalize">{formatDate(currentTime)}</p>
            </div>
            
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="text-center sm:text-right">
                <p className="text-xs md:text-sm text-gray-500">Hora atual</p>
                <p className="text-lg md:text-xl font-bold text-[#0047CC]">{formatTime(currentTime)}</p>
              </div>
              
              <div className="relative">
                <button className="p-3 text-gray-400 hover:text-gray-600 relative min-h-[44px] min-w-[44px] flex items-center justify-center">
                  <BellIcon className="h-5 w-5 md:h-6 md:w-6" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        {/* Cards de Estatísticas - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          {/* Ordens Hoje */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-4 md:p-6 border"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1">
                <p className="text-xs md:text-sm font-medium text-gray-600">Ordens Hoje</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">{mockData.stats.ordensHoje.value}</p>
              </div>
              <div className="h-10 w-10 md:h-12 md:w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <ClipboardDocumentListIcon className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-3 md:mt-4 flex items-center">
              <ArrowUpIcon className="h-3 w-3 md:h-4 md:w-4 text-green-500 mr-1" />
              <span className="text-xs md:text-sm text-green-600 font-medium">
                +{mockData.stats.ordensHoje.percentage}%
              </span>
              <span className="text-xs md:text-sm text-gray-500 ml-1">vs ontem</span>
            </div>
          </motion.div>

          {/* Agendamentos Hoje */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6 border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Agendamentos Hoje</p>
                <p className="text-3xl font-bold text-gray-900">{mockData.stats.agendamentosHoje.value}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CalendarDaysIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">
                +{mockData.stats.agendamentosHoje.percentage}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs ontem</span>
            </div>
          </motion.div>

          {/* Receita Hoje */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Hoje</p>
                <p className="text-3xl font-bold text-gray-900">
                  R$ {mockData.stats.receitaHoje.value.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">
                +{mockData.stats.receitaHoje.percentage}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs ontem</span>
            </div>
          </motion.div>

          {/* Clientes Ativos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-6 border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clientes Ativos</p>
                <p className="text-3xl font-bold text-gray-900">{mockData.stats.clientesAtivos.value}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <UserGroupIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">
                +{mockData.stats.clientesAtivos.percentage}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs ontem</span>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Agendamentos de Hoje - Mobile Responsive */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-sm border"
          >
            <div className="p-4 md:p-6 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <CalendarDaysIcon className="h-5 w-5 text-blue-600 mr-2" />
                  Agendamentos de Hoje
                </h3>
                <Link 
                  href="/oficina-basica/agendamentos"
                  className="text-sm text-[#0047CC] hover:underline font-medium"
                >
                  Ver todos
                </Link>
              </div>
            </div>
            
            <div className="p-4 md:p-6">
              <div className="space-y-3 md:space-y-4">
                {mockData.agendamentosHoje.map((agendamento) => (
                  <div key={agendamento.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-3 touch-manipulation">
                    <div className="flex items-center space-x-3 md:space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 md:h-10 md:w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <ClockIcon className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-gray-900 truncate">{agendamento.cliente}</h4>
                        <p className="text-sm text-gray-600 truncate">{agendamento.servico}</p>
                        <p className="text-xs text-gray-500 truncate">{agendamento.veiculo}</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="text-center sm:text-right">
                        <p className="font-bold text-[#0047CC]">{agendamento.horario}</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          agendamento.status === 'confirmado' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {agendamento.status === 'confirmado' ? 'Confirmado' : 'Pendente'}
                        </span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <button className="text-gray-400 hover:text-blue-600 p-2 min-h-[40px] min-w-[40px] flex items-center justify-center">
                          <PhoneIcon className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-green-600 p-2 min-h-[40px] min-w-[40px] flex items-center justify-center">
                          <ChatBubbleLeftIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Mensagens Recentes - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm border"
          >
            <div className="p-4 md:p-6 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <ChatBubbleLeftIcon className="h-5 w-5 text-green-600 mr-2" />
                  Mensagens
                </h3>
                <Link 
                  href="/oficina-basica/mensagens"
                  className="text-sm text-[#0047CC] hover:underline font-medium"
                >
                  Ver todas
                </Link>
              </div>
            </div>
            
            <div className="p-4 md:p-6">
              <div className="space-y-3 md:space-y-4">
                {mockData.mensagensRecentes.map((mensagem) => (
                  <div key={mensagem.id} className={`p-3 rounded-lg touch-manipulation ${mensagem.naoLida ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${mensagem.naoLida ? 'text-blue-900' : 'text-gray-900'}`}>
                          {mensagem.cliente}
                        </p>
                        <p className={`text-sm mt-1 ${mensagem.naoLida ? 'text-blue-700' : 'text-gray-600'} line-clamp-2`}>
                          {mensagem.mensagem}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">{mensagem.horario}</p>
                      </div>
                      {mensagem.naoLida && (
                        <div className="ml-2 flex-shrink-0">
                          <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Ordens Pendentes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6 bg-white rounded-xl shadow-sm border"
        >
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <WrenchScrewdriverIcon className="h-5 w-5 text-orange-600 mr-2" />
                Ordens Pendentes de Aprovação
              </h3>
              <Link 
                href="/oficina-basica/ordens"
                className="text-sm text-[#0047CC] hover:underline font-medium"
              >
                Ver todas
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockData.ordensPendentes.map((ordem) => (
                <div key={ordem.id} className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">Ordem #{ordem.id}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          ordem.status === 'Orçamento Enviado' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {ordem.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 font-medium">{ordem.cliente}</p>
                      <p className="text-sm text-gray-600">{ordem.servico}</p>
                      <p className="text-xs text-gray-500">{ordem.veiculo}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-lg font-bold text-green-600">
                          R$ {ordem.valor.toLocaleString()}
                        </p>
                        <p className="text-xs text-red-600 font-medium">
                          Prazo: {ordem.prazo}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                      Acompanhar
                    </button>
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                      Contatar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Links Rápidos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Link 
            href="/oficina-basica/ordens"
            className="p-4 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow flex flex-col items-center text-center"
          >
            <ClipboardDocumentListIcon className="h-8 w-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Gerenciar Ordens</span>
          </Link>
          
          <Link 
            href="/oficina-basica/agendamentos"
            className="p-4 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow flex flex-col items-center text-center"
          >
            <CalendarDaysIcon className="h-8 w-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Agendamentos</span>
          </Link>
          
          <Link 
            href="/oficina-basica/mensagens"
            className="p-4 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow flex flex-col items-center text-center"
          >
            <ChatBubbleLeftIcon className="h-8 w-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Mensagens</span>
          </Link>
          
          <Link 
            href="/oficina-basica/relatorios"
            className="p-4 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow flex flex-col items-center text-center"
          >
            <ChartBarIcon className="h-8 w-8 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Relatórios</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 