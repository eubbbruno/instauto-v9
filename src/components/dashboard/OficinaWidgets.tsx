'use client';

import { Users, Calendar, Wrench, DollarSign, BarChart, Crown, Star, Package } from 'lucide-react';

interface OficinaWidgetsProps {
  planType: 'free' | 'pro';
}

export function OficinaWidgets({ planType }: OficinaWidgetsProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className={`rounded-lg p-6 text-white ${
        planType === 'pro' 
          ? 'bg-gradient-to-r from-amber-600 to-amber-800' 
          : 'bg-gradient-to-r from-green-600 to-green-800'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Dashboard Oficina {planType === 'pro' ? 'PRO' : 'FREE'}
            </h2>
            <p className={planType === 'pro' ? 'text-amber-100' : 'text-green-100'}>
              {planType === 'pro' 
                ? 'Todas as ferramentas profissionais ao seu alcance'
                : 'Gerencie sua oficina com ferramentas essenciais'
              }
            </p>
          </div>
          {planType === 'pro' && (
            <Crown className="h-12 w-12 text-yellow-300" />
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Clientes</p>
              <p className="text-2xl font-bold text-gray-900">127</p>
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
              <p className="text-2xl font-bold text-gray-900">23</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Wrench className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Serviços</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Receita</p>
              <p className="text-2xl font-bold text-gray-900">R$ 15.2k</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Banner (só para FREE) */}
      {planType === 'free' && (
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg p-6 text-yellow-900">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-2">🚀 Upgrade para PRO</h3>
              <p className="text-yellow-800">
                Desbloqueie relatórios avançados, IA para diagnóstico, gestão de estoque e muito mais!
              </p>
            </div>
            <button className="bg-yellow-900 text-yellow-100 px-6 py-3 rounded-lg hover:bg-yellow-800 transition-colors">
              Upgrade Agora
            </button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center mb-4">
            <Users className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg font-semibold">Gerenciar Clientes</h3>
          </div>
          <p className="text-gray-600 mb-4">Visualize e gerencie seus clientes</p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            Ver Clientes
          </button>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center mb-4">
            <Calendar className="h-6 w-6 text-green-600 mr-3" />
            <h3 className="text-lg font-semibold">Agendamentos</h3>
          </div>
          <p className="text-gray-600 mb-4">Gerencie sua agenda de serviços</p>
          <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
            Ver Agenda
          </button>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center mb-4">
            <Wrench className="h-6 w-6 text-purple-600 mr-3" />
            <h3 className="text-lg font-semibold">Ordens de Serviço</h3>
          </div>
          <p className="text-gray-600 mb-4">Controle suas ordens de serviço</p>
          <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
            Ver Ordens
          </button>
        </div>

        {/* Widgets exclusivos PRO */}
        {planType === 'pro' && (
          <>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center mb-4">
                <Package className="h-6 w-6 text-indigo-600 mr-3" />
                <h3 className="text-lg font-semibold">Estoque</h3>
              </div>
              <p className="text-gray-600 mb-4">Controle seu estoque de peças</p>
              <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                Ver Estoque
              </button>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center mb-4">
                <BarChart className="h-6 w-6 text-emerald-600 mr-3" />
                <h3 className="text-lg font-semibold">Relatórios</h3>
              </div>
              <p className="text-gray-600 mb-4">Análises detalhadas do negócio</p>
              <button className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors">
                Ver Relatórios
              </button>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center mb-4">
                <Star className="h-6 w-6 text-pink-600 mr-3" />
                <h3 className="text-lg font-semibold">IA Diagnóstico</h3>
              </div>
              <p className="text-gray-600 mb-4">Diagnóstico inteligente</p>
              <button className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors">
                Usar IA
              </button>
            </div>
          </>
        )}
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
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="font-medium">Novo cliente cadastrado</p>
                <p className="text-sm text-gray-600">João Silva • Hoje às 15h30</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-4 w-4 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="font-medium">Agendamento confirmado</p>
                <p className="text-sm text-gray-600">Maria Santos - Troca de óleo • Amanhã às 9h</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Wrench className="h-4 w-4 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="font-medium">Serviço concluído</p>
                <p className="text-sm text-gray-600">OS #1234 - Revisão completa • Ontem</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}