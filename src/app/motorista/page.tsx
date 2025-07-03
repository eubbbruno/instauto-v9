"use client";

import { useAuth } from '@/contexts/SupabaseAuthContext';
import { 
  TruckIcon,
  CalendarIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
  PlusIcon,
  BellIcon,
  MapPinIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function MotoristaDashboard() {
  const { user } = useAuth();

  const stats = [
    { label: 'Veículos', value: user?.vehicles?.length || 0, color: 'bg-[#0047CC]', icon: TruckIcon },
    { label: 'Agendamentos', value: '3', color: 'bg-green-600', icon: CalendarIcon },
    { label: 'Próxima Revisão', value: '12 dias', color: 'bg-[#FFDE59]', icon: ClockIcon },
    { label: 'Serviços', value: '8', color: 'bg-purple-600', icon: WrenchScrewdriverIcon }
  ];

  const recentActivities = [
    { type: 'service', title: 'Troca de óleo realizada', date: '15/01/2024', oficina: 'Auto Center Silva' },
    { type: 'appointment', title: 'Agendamento confirmado', date: '12/01/2024', oficina: 'Oficina Costa' },
    { type: 'reminder', title: 'Lembrete: Revisão em 30 dias', date: '10/01/2024', oficina: '-' }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#0047CC] to-[#0055EB] rounded-2xl p-6 text-white"
      >
        <h2 className="text-xl md:text-2xl font-bold mb-2">Olá, {user?.name?.split(' ')[0]}! 👋</h2>
        <p className="text-blue-100 mb-4 text-sm md:text-base">Gerencie seus veículos e acompanhe seus serviços em um só lugar.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/motorista/garagem" className="flex-1 sm:flex-none">
            <button className="w-full sm:w-auto bg-white/20 hover:bg-white/30 text-white px-6 py-4 rounded-lg font-medium transition-colors flex items-center justify-center min-h-[48px]">
              <PlusIcon className="h-5 w-5 mr-2" />
              Novo Veículo
            </button>
          </Link>
          <Link href="/oficinas/busca" className="flex-1 sm:flex-none">
            <button className="w-full sm:w-auto bg-[#FFDE59] hover:bg-[#FFDE59]/90 text-[#0047CC] px-6 py-4 rounded-lg font-medium transition-colors flex items-center justify-center min-h-[48px]">
              <CalendarIcon className="h-5 w-5 mr-2" />
              Agendar Serviço
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid - Mobile Responsive */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-2 md:mb-0">
                <p className="text-xl md:text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs md:text-sm text-gray-600">{stat.label}</p>
              </div>
              <div className={`p-2 md:p-3 rounded-lg md:rounded-xl ${stat.color}/10 w-fit`}>
                <stat.icon className={`h-5 w-5 md:h-6 md:w-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <Link href="/motorista/notificacoes" className="group">
            <div className="flex items-center p-4 md:p-4 bg-[#0047CC]/10 rounded-xl hover:bg-[#0047CC]/20 transition-colors min-h-[72px] touch-manipulation">
              <div className="p-2 bg-[#0047CC]/20 rounded-lg group-hover:bg-[#0047CC]/30 transition-colors">
                <BellIcon className="h-5 w-5 text-[#0047CC]" />
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900">Notificações</p>
                <p className="text-sm text-gray-600">3 novas</p>
              </div>
            </div>
          </Link>

          <Link href="/motorista/localizacao" className="group">
            <div className="flex items-center p-4 md:p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors min-h-[72px] touch-manipulation">
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <MapPinIcon className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900">Oficinas Próximas</p>
                <p className="text-sm text-gray-600">Encontrar serviços</p>
              </div>
            </div>
          </Link>

          <Link href="/motorista/pagamentos" className="group">
            <div className="flex items-center p-4 md:p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors min-h-[72px] touch-manipulation">
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <CreditCardIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900">Pagamentos</p>
                <p className="text-sm text-gray-600">Gerenciar métodos</p>
              </div>
            </div>
          </Link>
        </div>
      </motion.div>

      {/* Content Grid */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {/* Veículos */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100">
            <div className="p-4 md:p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-gray-900">Meus Veículos</h3>
                <Link href="/motorista/garagem">
                  <button className="bg-[#0047CC] hover:bg-[#0055EB] text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center min-h-[44px] w-full sm:w-auto">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Adicionar
                  </button>
                </Link>
              </div>
            </div>
            
            <div className="p-4 md:p-6">
              {user?.vehicles && user.vehicles.length > 0 ? (
                <div className="space-y-3 md:space-y-4">
                  {user.vehicles.map(vehicle => (
                    <motion.div
                      key={vehicle.id}
                      whileHover={{ scale: 1.01 }}
                      className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all cursor-pointer touch-manipulation"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center space-x-3 md:space-x-4">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <TruckIcon className="h-5 w-5 md:h-6 md:w-6 text-gray-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-gray-900 truncate">{vehicle.brand} {vehicle.model}</h4>
                            <p className="text-sm text-gray-600">{vehicle.year} • {vehicle.plate}</p>
                            <p className="text-xs text-gray-500">{vehicle.color}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Em dia
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 md:py-12">
                  <TruckIcon className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum veículo cadastrado</h3>
                  <p className="text-gray-600 mb-4 text-sm md:text-base px-4">Adicione seu primeiro veículo para começar a usar o Instauto.</p>
                  <Link href="/motorista/garagem">
                    <button className="bg-[#0047CC] hover:bg-[#0055EB] text-white px-6 py-4 rounded-xl font-medium transition-colors min-h-[48px] flex items-center justify-center mx-auto">
                      Adicionar Veículo
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Atividades Recentes */}
        <div>
          <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100">
            <div className="p-4 md:p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Atividades Recentes</h3>
            </div>
            
            <div className="p-4 md:p-6">
              <div className="space-y-3 md:space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'service' ? 'bg-green-500' :
                      activity.type === 'appointment' ? 'bg-blue-500' : 'bg-yellow-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                      {activity.oficina !== '-' && (
                        <p className="text-xs text-gray-400">{activity.oficina}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}