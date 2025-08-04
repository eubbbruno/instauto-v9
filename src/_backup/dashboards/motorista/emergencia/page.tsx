"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PhoneIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  ClockIcon,
  StarIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

interface ServicoEmergencia {
  id: string;
  tipo: 'guincho' | 'mecanico' | 'eletricista' | 'chaveiro';
  nome: string;
  descricao: string;
  telefone: string;
  tempoChegada: string;
  preco: string;
  disponivel: boolean;
  rating: number;
  atendimentos: number;
}

export default function EmergenciaPage() {
  const [tipoSelecionado, setTipoSelecionado] = useState<string>('todos');
  const [emergenciaAtiva, setEmergenciaAtiva] = useState(false);

  const servicosEmergencia: ServicoEmergencia[] = [
    {
      id: '1',
      tipo: 'guincho',
      nome: 'Guincho Express 24h',
      descricao: 'Remoção de veículos, transporte para oficinas',
      telefone: '(11) 99999-1111',
      tempoChegada: '15-30 min',
      preco: 'A partir de R$ 150',
      disponivel: true,
      rating: 4.8,
      atendimentos: 1250
    },
    {
      id: '2',
      tipo: 'mecanico',
      nome: 'SOS Mecânico 24h',
      descricao: 'Atendimento mecânico no local, reparos de emergência',
      telefone: '(11) 99999-2222',
      tempoChegada: '20-40 min',
      preco: 'A partir de R$ 120',
      disponivel: true,
      rating: 4.6,
      atendimentos: 980
    },
    {
      id: '3',
      tipo: 'eletricista',
      nome: 'Auto Elétrica Express',
      descricao: 'Problemas elétricos, bateria, alternador',
      telefone: '(11) 99999-3333',
      tempoChegada: '25-45 min',
      preco: 'A partir de R$ 100',
      disponivel: true,
      rating: 4.7,
      atendimentos: 756
    },
    {
      id: '4',
      tipo: 'chaveiro',
      nome: 'Chaveiro 24h Automotivo',
      descricao: 'Abertura de veículos, cópias de chaves',
      telefone: '(11) 99999-4444',
      tempoChegada: '10-25 min',
      preco: 'A partir de R$ 80',
      disponivel: false,
      rating: 4.5,
      atendimentos: 423
    }
  ];

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'guincho':
        return TruckIcon;
      case 'mecanico':
        return WrenchScrewdriverIcon;
      case 'eletricista':
        return ExclamationTriangleIcon;
      case 'chaveiro':
        return '🔑';
      default:
        return PhoneIcon;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'guincho':
        return 'bg-blue-500';
      case 'mecanico':
        return 'bg-green-500';
      case 'eletricista':
        return 'bg-yellow-500';
      case 'chaveiro':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'guincho':
        return 'Guincho';
      case 'mecanico':
        return 'Mecânico';
      case 'eletricista':
        return 'Eletricista';
      case 'chaveiro':
        return 'Chaveiro';
      default:
        return tipo;
    }
  };

  const servicosFiltrados = servicosEmergencia.filter(servico => {
    if (tipoSelecionado === 'todos') return true;
    return servico.tipo === tipoSelecionado;
  });

  const iniciarEmergencia = (servico: ServicoEmergencia) => {
    setEmergenciaAtiva(true);
    // Aqui seria feita a chamada para o serviço
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header de Emergência */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-center">
          <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-red-900">Emergência 24h</h1>
            <p className="text-red-700">
              Precisa de ajuda urgente? Nossa rede de parceiros está disponível 24 horas por dia.
            </p>
          </div>
        </div>
      </div>

      {/* Botão de Emergência Rápida */}
      {!emergenciaAtiva ? (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white text-center"
        >
          <div className="mb-4">
            <PhoneIcon className="h-12 w-12 mx-auto mb-2" />
            <h2 className="text-2xl font-bold">Emergência Imediata</h2>
            <p className="text-red-100">Ligue agora para atendimento prioritário</p>
          </div>
          
          <a href="tel:190" className="inline-block">
            <button className="bg-white text-red-600 px-8 py-4 rounded-xl font-bold text-xl hover:bg-red-50 transition-colors">
              📞 (11) 0800-SOCORRO
            </button>
          </a>
          
          <p className="text-sm text-red-200 mt-3">
            Disponível 24h • Tempo médio de chegada: 20 min
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-green-50 border border-green-200 rounded-xl p-6"
        >
          <div className="text-center">
            <div className="animate-pulse">
              <TruckIcon className="h-12 w-12 text-green-600 mx-auto mb-3" />
            </div>
            <h3 className="text-xl font-bold text-green-900 mb-2">Emergência Ativada!</h3>
            <p className="text-green-700 mb-4">
              Nosso parceiro está a caminho. Tempo estimado: 15-20 minutos
            </p>
            <div className="flex items-center justify-center space-x-4">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center">
                <PhoneIcon className="h-4 w-4 mr-2" />
                Ligar para o técnico
              </button>
              <button 
                onClick={() => setEmergenciaAtiva(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Tipo de Serviço</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'todos', label: 'Todos' },
            { value: 'guincho', label: 'Guincho' },
            { value: 'mecanico', label: 'Mecânico' },
            { value: 'eletricista', label: 'Eletricista' },
            { value: 'chaveiro', label: 'Chaveiro' }
          ].map(tipo => (
            <button
              key={tipo.value}
              onClick={() => setTipoSelecionado(tipo.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                tipoSelecionado === tipo.value
                  ? 'bg-[#0047CC] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tipo.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Serviços */}
      <div className="space-y-4">
        {servicosFiltrados.map((servico, index) => {
          const IconComponent = getTipoIcon(servico.tipo);
          
          return (
            <motion.div
              key={servico.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${
                !servico.disponivel ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${getTipoColor(servico.tipo)} text-white`}>
                    {typeof IconComponent === 'string' ? (
                      <span className="text-2xl">{IconComponent}</span>
                    ) : (
                      <IconComponent className="h-6 w-6" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{servico.nome}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        servico.disponivel 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {servico.disponivel ? 'Disponível' : 'Indisponível'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-2">{servico.descricao}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        <span>Chegada: {servico.tempoChegada}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                        <span>{servico.rating} ({servico.atendimentos} atendimentos)</span>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="font-medium text-gray-700">{servico.preco}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <a href={`tel:${servico.telefone}`}>
                    <button 
                      className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center ${
                        servico.disponivel
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!servico.disponivel}
                    >
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      Ligar Agora
                    </button>
                  </a>
                  
                  <button 
                    onClick={() => servico.disponivel && iniciarEmergencia(servico)}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors text-center ${
                      servico.disponivel
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!servico.disponivel}
                  >
                    Solicitar
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Dicas de Emergência */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-4">💡 Dicas para Emergências</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Antes do atendimento:</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• Mantenha-se em local seguro</li>
              <li>• Ligue o pisca-alerta</li>
              <li>• Tenha documentos em mãos</li>
              <li>• Informe sua localização exata</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Durante o atendimento:</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• Acompanhe o serviço</li>
              <li>• Peça orçamento antes</li>
              <li>• Solicite nota fiscal</li>
              <li>• Avalie o atendimento</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 