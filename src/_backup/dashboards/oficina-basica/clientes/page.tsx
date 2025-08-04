"use client";

import { useState } from "react";
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  PhoneIcon,
  EnvelopeIcon
} from "@heroicons/react/24/outline";

// Tipos seguros
type ClientStatus = 'ativo' | 'inativo' | 'potencial';

type Client = {
  id: string;
  name: string;
  email?: string;
  phone: string;
  status: ClientStatus;
  totalServices: number;
};

// Dados mock simples
const mockClients: Client[] = [
  {
    id: "C-001",
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(11) 98765-4321",
    status: "ativo",
    totalServices: 3
  },
  {
    id: "C-002", 
    name: "Maria Oliveira",
    email: "maria.oliveira@email.com",
    phone: "(11) 97654-3210",
    status: "ativo",
    totalServices: 5
  }
];

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading] = useState(false);

  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  const getStatusClass = (status: ClientStatus) => {
    switch (status) {
      case 'ativo': return "bg-green-100 text-green-700";
      case 'inativo': return "bg-gray-100 text-gray-700";
      case 'potencial': return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Clientes</h1>
            <p className="text-gray-600 text-sm md:text-base mt-1">Gerencie seus clientes</p>
          </div>
          
          <button className="px-5 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors inline-flex items-center justify-center touch-manipulation min-h-[48px]">
            <PlusIcon className="h-5 w-5 mr-2" />
            Adicionar Cliente
          </button>
        </div>
      </div>

      {/* Busca */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar cliente..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Lista de clientes */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse flex items-center space-x-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">Nenhum cliente encontrado</div>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <PlusIcon className="h-5 w-5 mr-2" />
              Adicionar Cliente
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredClients.map((client) => (
              <div key={client.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <UserCircleIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{client.name}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <PhoneIcon className="h-4 w-4 mr-1" />
                        {client.phone}
                      </div>
                      {client.email && (
                        <div className="flex items-center text-sm text-gray-500">
                          <EnvelopeIcon className="h-4 w-4 mr-1" />
                          {client.email}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(client.status)}`}>
                      {client.status}
                    </span>
                    <div className="text-sm text-gray-500 mt-1">
                      {client.totalServices} serviços
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 