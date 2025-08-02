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
  PhoneIcon,
  ChatBubbleLeftIcon,
  ChartBarIcon,
  WrenchScrewdriverIcon,
  BellIcon,
  ArrowUpIcon,
  SparklesIcon,
  LockClosedIcon,
  GiftIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useAuth } from '@/contexts/SupabaseAuthContext';

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
      status: 'confirmado'
    }
  ],
  orcamentosRecentes: [
    {
      id: '001',
      cliente: 'Ana Costa',
      servico: 'Freios - Pastilhas + Discos',
      veiculo: 'Volkswagen Golf 2018',
      valor: 800,
      status: 'Aprovado',
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
  const { user } = useAuth();

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
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Welcome Card para Plano Gratuito */}
      <motion.div 
        className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 mb-6 text-white relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-[30px]"></div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-[30px]"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 relative">
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold mb-2 flex items-center">
              <SparklesIcon className="h-6 w-6 mr-2 text-yellow-400" />
              Bem-vindo, {user?.name || 'Oficina'}!
            </h2>
            <p className="text-white/90 mb-4">
              Você está no <strong>Plano Gratuito</strong>. Gerencie seus agendamentos básicos e comece a crescer seu negócio.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/oficina-basica/agendamentos" className="flex-1 sm:flex-none">
                <button className="w-full sm:w-auto bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  <CalendarDaysIcon className="h-5 w-5 mr-2 inline" />
                  Agendamentos
                </button>
              </Link>
              <Link href="/oficina-basica/upgrade" className="flex-1 sm:flex-none">
                <button className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-6 py-3 rounded-lg font-bold transition-colors">
                  <SparklesIcon className="h-5 w-5 mr-2 inline" />
                  Upgrade PRO
                </button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { 
            title: 'Ordens Hoje', 
            value: mockData.stats.ordensHoje.value, 
            change: mockData.stats.ordensHoje.change,
            icon: WrenchScrewdriverIcon,
            color: 'bg-blue-500'
          },
          { 
            title: 'Agendamentos', 
            value: mockData.stats.agendamentosHoje.value, 
            change: mockData.stats.agendamentosHoje.change,
            icon: CalendarDaysIcon,
            color: 'bg-green-500'
          },
          { 
            title: 'Receita Hoje', 
            value: `R$ ${mockData.stats.receitaHoje.value}`, 
            change: mockData.stats.receitaHoje.change,
            icon: CurrencyDollarIcon,
            color: 'bg-yellow-500'
          },
          { 
            title: 'Clientes Ativos', 
            value: mockData.stats.clientesAtivos.value, 
            change: mockData.stats.clientesAtivos.change,
            icon: UserGroupIcon,
            color: 'bg-purple-500'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-1">
                  <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{stat.change}</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agendamentos Hoje */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Agendamentos Hoje</h3>
            <Link href="/oficina-basica/agendamentos" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Ver todos
            </Link>
          </div>
          
          <div className="space-y-3">
            {mockData.agendamentosHoje.map((agendamento) => (
              <div key={agendamento.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{agendamento.cliente}</p>
                    <p className="text-sm text-gray-600">{agendamento.servico}</p>
                    <p className="text-xs text-gray-500">{agendamento.veiculo}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-600">{agendamento.horario}</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Confirmado
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Mensagens Recentes */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Mensagens Recentes</h3>
            <Link href="/oficina-basica/mensagens" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Ver todas
            </Link>
          </div>
          
          <div className="space-y-3">
            {mockData.mensagensRecentes.map((mensagem) => (
              <div key={mensagem.id} className={`p-3 rounded-lg border-l-4 ${mensagem.naoLida ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}>
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium text-gray-900">{mensagem.cliente}</p>
                  <span className="text-xs text-gray-500">{mensagem.horario}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{mensagem.mensagem}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Ações Rápidas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: CalendarDaysIcon, label: 'Agendamentos', href: '/oficina-basica/agendamentos' },
            { icon: UserGroupIcon, label: 'Clientes', href: '/oficina-basica/clientes' },
            { icon: ClipboardDocumentListIcon, label: 'Orçamentos', href: '/oficina-basica/orcamentos' },
            { icon: ChartBarIcon, label: 'Relatórios', href: '/oficina-basica/relatorios' }
          ].map((action) => (
            <Link key={action.label} href={action.href}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <action.icon className="h-8 w-8 text-gray-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">{action.label}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}