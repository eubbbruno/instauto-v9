"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  UserPlusIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  EyeIcon,
  PencilIcon,
  StarIcon,
  TruckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  endereco: string;
  veiculos: number;
  ultimoServico: string;
  valorTotal: number;
  status: 'ativo' | 'inativo' | 'vip';
  avaliacao?: number;
}

export default function ClientesPage() {
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');

  const clientes: Cliente[] = [
    {
      id: '1',
      nome: 'Maria Silva',
      telefone: '(11) 99999-1111',
      email: 'maria.silva@email.com',
      endereco: 'Rua das Flores, 123 - Vila Madalena',
      veiculos: 2,
      ultimoServico: '2024-01-15',
      valorTotal: 2450.00,
      status: 'vip',
      avaliacao: 5
    },
    {
      id: '2',
      nome: 'João Santos',
      telefone: '(11) 99999-2222',
      email: 'joao.santos@email.com',
      endereco: 'Av. Paulista, 456 - Bela Vista',
      veiculos: 1,
      ultimoServico: '2024-01-10',
      valorTotal: 850.00,
      status: 'ativo',
      avaliacao: 4
    },
    {
      id: '3',
      nome: 'Ana Costa',
      telefone: '(11) 99999-3333',
      email: 'ana.costa@email.com',
      endereco: 'Rua Augusta, 789 - Consolação',
      veiculos: 1,
      ultimoServico: '2023-12-20',
      valorTotal: 1200.00,
      status: 'inativo'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'vip': return 'bg-yellow-100 text-yellow-800';
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'inativo': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const clientesFiltrados = clientes.filter(cliente => {
    const matchBusca = cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
                      cliente.telefone.includes(busca);
    const matchStatus = filtroStatus === 'todos' || cliente.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600">Gerencie sua base de clientes</p>
        </div>
        <button className="bg-[#0047CC] text-white px-4 py-2 rounded-lg flex items-center">
          <UserPlusIcon className="h-4 w-4 mr-2" />
          Novo Cliente
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="todos">Todos</option>
            <option value="ativo">Ativos</option>
            <option value="vip">VIP</option>
            <option value="inativo">Inativos</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="divide-y">
          {clientesFiltrados && clientesFiltrados.length > 0 ? (
            clientesFiltrados.map((cliente, index) => (
              <motion.div
                key={cliente.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#0047CC] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{cliente.nome.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{cliente.nome}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <PhoneIcon className="h-4 w-4 mr-1" />
                          {cliente.telefone}
                        </div>
                        <div className="flex items-center">
                          <EnvelopeIcon className="h-4 w-4 mr-1" />
                          {cliente.email}
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {cliente.endereco}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(cliente.status)}`}>
                          {cliente.status.charAt(0).toUpperCase() + cliente.status.slice(1)}
                        </span>
                        {cliente.avaliacao && (
                          <div className="flex items-center">
                            <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">{cliente.avaliacao}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        <div className="flex items-center">
                          <TruckIcon className="h-4 w-4 mr-1" />
                          {cliente.veiculos} veículo{cliente.veiculos !== 1 ? 's' : ''}
                        </div>
                        <div className="flex items-center mt-1">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          Último: {new Date(cliente.ultimoServico).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="font-semibold text-[#0047CC] mt-1">
                        {cliente.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-400 hover:text-[#0047CC] rounded-lg hover:bg-gray-100">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-[#0047CC] rounded-lg hover:bg-gray-100">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-12 text-center">
              <UserPlusIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {busca || filtroStatus !== 'todos' ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
              </h3>
              <p className="text-gray-500">
                {busca || filtroStatus !== 'todos' 
                  ? 'Tente ajustar os filtros ou busca' 
                  : 'Cadastre seu primeiro cliente para começar'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 