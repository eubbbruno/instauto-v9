"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BellIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'reminder';
  date: string;
  read: boolean;
  actionRequired?: boolean;
}

export default function NotificacoesPage() {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const [notificacoes, setNotificacoes] = useState<Notification[]>([
    {
      id: '1',
      title: 'Lembrete de Revisão',
      message: 'Seu Honda Civic está próximo da revisão programada (próximos 7 dias).',
      type: 'reminder',
      date: '2024-01-20T08:00:00Z',
      read: false,
      actionRequired: true
    },
    {
      id: '2',
      title: 'Agendamento Confirmado',
      message: 'Seu agendamento para troca de óleo foi confirmado para 25/01/2024 às 14:00.',
      type: 'success',
      date: '2024-01-19T16:30:00Z',
      read: false
    },
    {
      id: '3',
      title: 'Documentação Vencida',
      message: 'O seguro do seu Fiat Uno vence em 3 dias. Renove para continuar protegido.',
      type: 'warning',
      date: '2024-01-19T09:15:00Z',
      read: true,
      actionRequired: true
    }
  ]);

  const markAsRead = (id: string) => {
    setNotificacoes(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotificacoes(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotificacoes(prev => prev.filter(notif => notif.id !== id));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'warning':
        return ExclamationTriangleIcon;
      case 'success':
        return CheckCircleIcon;
      case 'reminder':
        return ClockIcon;
      default:
        return InformationCircleIcon;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'reminder':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredNotifications = notificacoes.filter(notif => {
    if (filter === 'read' && !notif.read) return false;
    if (filter === 'unread' && notif.read) return false;
    return true;
  });

  const unreadCount = notificacoes.filter(n => !n.read).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Notificações</h1>
          <p className="text-gray-600">
            Acompanhe lembretes, atualizações e informações importantes sobre seus veículos.
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-2 rounded-lg">
            <BellIcon className="h-5 w-5 mr-2" />
            <span className="font-medium">{unreadCount} não lidas</span>
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="bg-[#0047CC] hover:bg-[#0055EB] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <CheckIcon className="h-4 w-4 mr-2" />
              Marcar todas como lidas
            </button>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex space-x-2">
          {[
            { value: 'all', label: 'Todas' },
            { value: 'unread', label: 'Não lidas' },
            { value: 'read', label: 'Lidas' }
          ].map(option => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === option.value
                  ? 'bg-[#0047CC] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Notificações */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma notificação encontrada</h3>
            <p className="text-gray-600">Não há notificações que correspondam aos filtros selecionados.</p>
          </div>
        ) : (
          filteredNotifications.map((notification, index) => {
            const Icon = getNotificationIcon(notification.type);
            const colorClass = getNotificationColor(notification.type);
            
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${
                  !notification.read ? 'bg-blue-50/30 border-blue-200' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className={`font-semibold mb-1 ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                          {!notification.read && (
                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full ml-2"></span>
                          )}
                        </h3>
                        <p className="text-gray-600 mb-2">{notification.message}</p>
                        
                        <div className="text-sm text-gray-500">
                          <span>{new Date(notification.date).toLocaleDateString('pt-BR')} às {new Date(notification.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Marcar como lida"
                          >
                            <CheckIcon className="h-4 w-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => removeNotification(notification.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remover notificação"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {notification.actionRequired && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex space-x-3">
                          <button className="bg-[#0047CC] hover:bg-[#0055EB] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            Agendar serviço
                          </button>
                          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            Ver detalhes
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
} 