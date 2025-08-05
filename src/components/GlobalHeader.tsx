"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// Removido useAuth
import NotificacoesBadge from '@/components/NotificacoesBadge';
import {
  BellIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  MagnifyingGlassIcon,
  CogIcon,
  SunIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
  PhoneIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface GlobalHeaderProps {
  onToggleSidebar?: () => void;
  title?: string;
  showSearch?: boolean;
  customActions?: React.ReactNode;
}

export default function GlobalHeader({ 
  onToggleSidebar, 
  title, 
  showSearch = true,
  customActions 
}: GlobalHeaderProps) {
  // Header simplificado - sem auth
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock de notificações
  const notifications = [
    {
      id: 1,
      title: user?.type === 'oficina' ? 'Nova ordem de serviço' : 'Serviço concluído',
      message: user?.type === 'oficina' ? 'João Silva agendou um serviço' : 'Troca de óleo foi concluída',
      time: '5 min',
      unread: true,
      type: 'info'
    },
    {
      id: 2,
      title: user?.type === 'oficina' ? 'Pagamento recebido' : 'Lembrete de revisão',
      message: user?.type === 'oficina' ? 'R$ 450,00 - Maria Santos' : 'Seu Honda Civic precisa de revisão',
      time: '1h',
      unread: true,
      type: user?.type === 'oficina' ? 'success' : 'warning'
    },
    {
      id: 3,
      title: user?.type === 'oficina' ? 'Avaliação recebida' : 'Novo orçamento',
      message: user?.type === 'oficina' ? '⭐ 5 estrelas de Pedro Costa' : 'Auto Center Silva enviou orçamento',
      time: '2h',
      unread: false,
      type: 'info'
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      default: return '💬';
    }
  };

  const handleLogout = () => {
    logout();
    setShowProfile(false);
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200/80 backdrop-blur-md shadow-sm">
      {/* Linha decorativa colorida */}
      <div className="h-1 bg-gradient-to-r from-[#0047CC] via-[#0055EB] to-[#FFDE59]"></div>
      
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Lado Esquerdo - Menu Mobile + Logo + Título */}
          <div className="flex items-center space-x-4">
            {/* Botão Menu Mobile */}
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Abrir menu"
              >
                <Bars3Icon className="h-6 w-6 text-gray-700" />
              </button>
            )}

            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-[#0047CC] to-[#0055EB] rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg font-syne">I</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#FFDE59] rounded-full"></div>
              </div>
              
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900 font-syne">Instauto</h1>
                {title && (
                  <p className="text-sm text-gray-600">{title}</p>
                )}
              </div>
            </Link>

            {/* Badge do tipo de usuário */}
            <div className={`hidden md:flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              user?.type === 'oficina' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {user?.type === 'oficina' ? '🔧 Oficina' : '🚗 Motorista'}
            </div>
          </div>

          {/* Lado Direito - Busca + Notificações + Perfil */}
          <div className="flex items-center space-x-3">
            {/* Busca (se habilitada) */}
            {showSearch && (
              <div className="hidden md:flex items-center">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={user?.type === 'oficina' ? 'Buscar clientes, ordens...' : 'Buscar oficinas, serviços...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC] transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Ações customizadas */}
            {customActions}

            {/* Botão de ajuda */}
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Central de Ajuda">
              <QuestionMarkCircleIcon className="h-5 w-5 text-gray-600" />
            </button>

            {/* Notificações */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Notificações"
              >
                <BellIcon className="h-5 w-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown de Notificações */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900">Notificações</h3>
                        {unreadCount > 0 && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                            {unreadCount} novas
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-l-4 ${
                            notification.unread 
                              ? 'border-l-[#0047CC] bg-blue-50/30' 
                              : 'border-l-transparent'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <span className="text-sm">{getNotificationIcon(notification.type)}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{notification.time} atrás</p>
                            </div>
                            {notification.unread && (
                              <div className="w-2 h-2 bg-[#0047CC] rounded-full mt-2"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="px-4 py-2 border-t border-gray-100">
                      <button className="w-full text-center text-sm text-[#0047CC] hover:text-[#0055EB] font-medium">
                        Ver todas as notificações
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Perfil do Usuário */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {user?.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="rounded-full ring-2 ring-gray-200"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-r from-[#0047CC] to-[#0055EB] rounded-full flex items-center justify-center ring-2 ring-gray-200">
                    <span className="text-white text-xs font-bold">
                      {user?.name ? getUserInitials(user.name) : 'U'}
                    </span>
                  </div>
                )}
                
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-32">
                    {user?.name?.split(' ')[0] || 'Usuário'}
                  </p>
                  {user?.type === 'oficina' && user?.businessName && (
                    <p className="text-xs text-gray-600 truncate max-w-32">
                      {user.businessName}
                    </p>
                  )}
                </div>
              </button>

              {/* Dropdown do Perfil */}
              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                  >
                    {/* Info do usuário */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        {user?.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-r from-[#0047CC] to-[#0055EB] rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">
                              {user?.name ? getUserInitials(user.name) : 'U'}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user?.name}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {user?.email}
                          </p>
                          {user?.type === 'oficina' && user?.businessName && (
                            <p className="text-xs text-blue-600 truncate">
                              {user.businessName}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Links do menu */}
                    <div className="py-2">
                      <Link
                        href={user?.type === 'oficina' ? '/oficina-basica/configuracoes' : '/motorista/perfil'}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowProfile(false)}
                      >
                        <UserCircleIcon className="h-4 w-4 mr-3 text-gray-500" />
                        Meu Perfil
                      </Link>
                      
                      <Link
                        href={user?.type === 'oficina' ? '/oficina-basica/configuracoes' : '/motorista/configuracoes'}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowProfile(false)}
                      >
                        <CogIcon className="h-4 w-4 mr-3 text-gray-500" />
                        Configurações
                      </Link>

                      <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full">
                        <SunIcon className="h-4 w-4 mr-3 text-gray-500" />
                        Modo escuro
                      </button>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                        Sair
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Busca mobile */}
      {showSearch && (
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={user?.type === 'oficina' ? 'Buscar clientes, ordens...' : 'Buscar oficinas, serviços...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC] transition-colors"
            />
          </div>
        </div>
      )}

      {/* Overlay para fechar dropdowns */}
      {(showNotifications || showProfile) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowProfile(false);
          }}
        />
      )}
    </header>
  );
} 