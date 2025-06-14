"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCardIcon,
  BanknotesIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface CartaoCredito {
  id: string;
  numero: string;
  nome: string;
  validade: string;
  bandeira: 'visa' | 'mastercard' | 'amex';
  principal: boolean;
}

interface Transacao {
  id: string;
  valor: number;
  descricao: string;
  data: string;
  status: 'concluido' | 'pendente' | 'cancelado';
  metodo: string;
  oficina: string;
}

export default function PagamentosPage() {
  const [mostrarNumeros, setMostrarNumeros] = useState<{[key: string]: boolean}>({});
  const [abaSelecionada, setAbaSelecionada] = useState<'cartoes' | 'historico'>('cartoes');

  const [cartoes, setCartoes] = useState<CartaoCredito[]>([
    {
      id: '1',
      numero: '4532 **** **** 1234',
      nome: 'João Silva',
      validade: '12/26',
      bandeira: 'visa',
      principal: true
    },
    {
      id: '2',
      numero: '5555 **** **** 9876',
      nome: 'João Silva',
      validade: '08/25',
      bandeira: 'mastercard',
      principal: false
    }
  ]);

  const transacoes: Transacao[] = [
    {
      id: '1',
      valor: 250.00,
      descricao: 'Troca de óleo - Honda Civic',
      data: '2024-01-20',
      status: 'concluido',
      metodo: 'Visa **** 1234',
      oficina: 'Auto Center Silva'
    },
    {
      id: '2',
      valor: 180.00,
      descricao: 'Alinhamento e balanceamento - Fiat Uno',
      data: '2024-01-18',
      status: 'concluido',
      metodo: 'Mastercard **** 9876',
      oficina: 'Oficina Costa'
    },
    {
      id: '3',
      valor: 450.00,
      descricao: 'Revisão completa - Honda Civic',
      data: '2024-01-15',
      status: 'pendente',
      metodo: 'Pix',
      oficina: 'Centro Automotivo Garcia'
    },
    {
      id: '4',
      valor: 320.00,
      descricao: 'Troca de pastilhas de freio',
      data: '2024-01-10',
      status: 'cancelado',
      metodo: 'Visa **** 1234',
      oficina: 'Mecânica Express'
    }
  ];

  const toggleMostrarNumero = (cartaoId: string) => {
    setMostrarNumeros(prev => ({
      ...prev,
      [cartaoId]: !prev[cartaoId]
    }));
  };

  const definirComoPrincipal = (cartaoId: string) => {
    setCartoes(prev => 
      prev.map(cartao => ({
        ...cartao,
        principal: cartao.id === cartaoId
      }))
    );
  };

  const removerCartao = (cartaoId: string) => {
    setCartoes(prev => prev.filter(cartao => cartao.id !== cartaoId));
  };

  const getBandeiraIcon = (bandeira: string) => {
    switch (bandeira) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'amex':
        return '💳';
      default:
        return '💳';
    }
  };

  const getBandeiraColor = (bandeira: string) => {
    switch (bandeira) {
      case 'visa':
        return 'from-blue-500 to-blue-600';
      case 'mastercard':
        return 'from-red-500 to-red-600';
      case 'amex':
        return 'from-green-500 to-green-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluido':
        return 'text-green-600 bg-green-50';
      case 'pendente':
        return 'text-yellow-600 bg-yellow-50';
      case 'cancelado':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'concluido':
        return 'Concluído';
      case 'pendente':
        return 'Pendente';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const totalGasto = transacoes
    .filter(t => t.status === 'concluido')
    .reduce((total, t) => total + t.valor, 0);

  const transacoesPendentes = transacoes.filter(t => t.status === 'pendente').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pagamentos</h1>
          <p className="text-gray-600">
            Gerencie seus métodos de pagamento e acompanhe o histórico de transações.
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="bg-green-50 text-green-700 px-3 py-2 rounded-lg">
            <span className="font-medium">Total gasto: R$ {totalGasto.toFixed(2)}</span>
          </div>
          
          {transacoesPendentes > 0 && (
            <div className="bg-yellow-50 text-yellow-700 px-3 py-2 rounded-lg">
              <span className="font-medium">{transacoesPendentes} pagamento(s) pendente(s)</span>
            </div>
          )}
        </div>
      </div>

      {/* Abas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setAbaSelecionada('cartoes')}
            className={`px-6 py-4 font-medium transition-colors ${
              abaSelecionada === 'cartoes'
                ? 'text-[#0047CC] border-b-2 border-[#0047CC] bg-blue-50/50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Métodos de Pagamento
          </button>
          <button
            onClick={() => setAbaSelecionada('historico')}
            className={`px-6 py-4 font-medium transition-colors ${
              abaSelecionada === 'historico'
                ? 'text-[#0047CC] border-b-2 border-[#0047CC] bg-blue-50/50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Histórico de Pagamentos
          </button>
        </div>

        <div className="p-6">
          {abaSelecionada === 'cartoes' ? (
            <div className="space-y-6">
              {/* Botão Adicionar Cartão */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Cartões de Crédito</h3>
                <button className="bg-[#0047CC] hover:bg-[#0055EB] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Adicionar Cartão
                </button>
              </div>

              {/* Lista de Cartões */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {cartoes.map((cartao, index) => (
                  <motion.div
                    key={cartao.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative p-6 rounded-xl text-white bg-gradient-to-br ${getBandeiraColor(cartao.bandeira)} shadow-lg`}
                  >
                    {cartao.principal && (
                      <div className="absolute top-4 right-4 bg-white/20 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Principal
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-2xl">{getBandeiraIcon(cartao.bandeira)}</div>
                      <div className="text-right">
                        <div className="text-xs font-medium uppercase">{cartao.bandeira}</div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-lg font-mono tracking-wider">
                        {mostrarNumeros[cartao.id] ? cartao.numero : cartao.numero}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-xs text-white/80">Nome</div>
                        <div className="font-medium">{cartao.nome}</div>
                      </div>
                      <div>
                        <div className="text-xs text-white/80">Validade</div>
                        <div className="font-medium">{cartao.validade}</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/20">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleMostrarNumero(cartao.id)}
                          className="p-1 hover:bg-white/20 rounded transition-colors"
                          title={mostrarNumeros[cartao.id] ? "Ocultar número" : "Mostrar número"}
                        >
                          {mostrarNumeros[cartao.id] ? (
                            <EyeSlashIcon className="h-4 w-4" />
                          ) : (
                            <EyeIcon className="h-4 w-4" />
                          )}
                        </button>
                        
                        {!cartao.principal && (
                          <button
                            onClick={() => definirComoPrincipal(cartao.id)}
                            className="p-1 hover:bg-white/20 rounded transition-colors"
                            title="Definir como principal"
                          >
                            <CheckCircleIcon className="h-4 w-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => removerCartao(cartao.id)}
                          className="p-1 hover:bg-white/20 rounded transition-colors"
                          title="Remover cartão"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Métodos Alternativos */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Outros Métodos</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="text-2xl mb-2">📱</div>
                    <h4 className="font-medium text-gray-900">Pix</h4>
                    <p className="text-sm text-gray-600">Pagamento instantâneo</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="text-2xl mb-2">💰</div>
                    <h4 className="font-medium text-gray-900">Dinheiro</h4>
                    <p className="text-sm text-gray-600">Pagamento em espécie</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="text-2xl mb-2">💳</div>
                    <h4 className="font-medium text-gray-900">Débito</h4>
                    <p className="text-sm text-gray-600">Cartão de débito</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Histórico de Transações</h3>
              
              {transacoes.map((transacao, index) => (
                <motion.div
                  key={transacao.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{transacao.descricao}</h4>
                        <span className="text-xl font-bold text-gray-900">
                          R$ {transacao.valor.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {new Date(transacao.data).toLocaleDateString('pt-BR')}
                        </div>
                        
                        <div className="flex items-center">
                          <CreditCardIcon className="h-4 w-4 mr-1" />
                          {transacao.metodo}
                        </div>
                        
                        <span>{transacao.oficina}</span>
                        
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transacao.status)}`}>
                          {getStatusLabel(transacao.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 