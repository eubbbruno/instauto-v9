'use client';

import { Car, Calendar, Search, FileText, MapPin, Star } from 'lucide-react';

export function MotoristaWidgets() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Bem-vindo ao seu Dashboard!</h2>
        <p className="text-blue-100">Gerencie seus veículos e encontre as melhores oficinas</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Car className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Veículos</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Agendamentos</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Serviços</p>
              <p className="text-2xl font-bold text-gray-900">15</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Favoritos</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center mb-4">
            <Search className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg font-semibold">Buscar Oficinas</h3>
          </div>
          <p className="text-gray-600 mb-4">Encontre oficinas próximas a você</p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            Buscar Agora
          </button>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center mb-4">
            <Car className="h-6 w-6 text-green-600 mr-3" />
            <h3 className="text-lg font-semibold">Minha Garagem</h3>
          </div>
          <p className="text-gray-600 mb-4">Gerencie seus veículos</p>
          <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
            Ver Veículos
          </button>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center mb-4">
            <Calendar className="h-6 w-6 text-purple-600 mr-3" />
            <h3 className="text-lg font-semibold">Agendar Serviço</h3>
          </div>
          <p className="text-gray-600 mb-4">Agende um novo serviço</p>
          <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
            Agendar
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Atividade Recente</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="font-medium">Agendamento confirmado</p>
                <p className="text-sm text-gray-600">Oficina Silva - Troca de óleo • Hoje às 14h</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-4 w-4 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="font-medium">Serviço concluído</p>
                <p className="text-sm text-gray-600">AutoCenter - Revisão • Ontem</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="font-medium">Nova oficina favorita</p>
                <p className="text-sm text-gray-600">Mecânica Brasil • 2 dias atrás</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}