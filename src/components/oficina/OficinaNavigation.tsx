"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  CogIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  TruckIcon,
  DocumentTextIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

export default function OficinaNavigation() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/oficina-basica', icon: HomeIcon },
    { name: 'WhatsApp', href: '/oficina-basica/whatsapp', icon: ChatBubbleLeftRightIcon, badge: 3 },
    { name: 'Ordens de Serviço', href: '/oficina-basica/ordens', icon: ClipboardDocumentListIcon },
    { name: 'Agendamentos', href: '/oficina-basica/agendamentos', icon: CalendarDaysIcon },
    { name: 'Veículos', href: '/oficina-basica/veiculos', icon: TruckIcon },
    { name: 'Relatórios', href: '/oficina-basica/relatorios', icon: ChartBarIcon },
    { name: 'Orçamentos', href: '/oficina-basica/orcamentos', icon: DocumentTextIcon },
  ];

  const isActivePath = (href: string) => {
    if (href === '/oficina-basica') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-white/20 hover:bg-white transition-all duration-200"
        >
          {isOpen ? (
            <XMarkIcon className="h-5 w-5 text-slate-600" />
          ) : (
            <Bars3Icon className="h-5 w-5 text-slate-600" />
          )}
        </button>
      </div>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:static top-0 left-0 z-40 w-64 h-screen bg-gradient-to-b from-slate-50 to-white border-r border-slate-200/60 flex flex-col transition-transform duration-300 ease-in-out shadow-xl md:shadow-none`}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center space-x-3">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                width={44}
                height={44}
                className="rounded-full ring-2 ring-white/20"
              />
            ) : (
              <div className="w-11 h-11 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center ring-2 ring-white/20">
                <UserCircleIcon className="h-6 w-6 text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-white truncate">
                {user?.name}
              </h2>
              <p className="text-xs text-blue-100 truncate">
                {user?.businessName}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = isActivePath(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <item.icon className={`h-5 w-5 mr-3 flex-shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'
                }`} />
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <span className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded-full transition-colors ${
                    isActive 
                      ? 'bg-white/20 text-white backdrop-blur-sm' 
                      : 'bg-red-100 text-red-600 group-hover:bg-red-200'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-300 rounded-l-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Settings and Logout */}
        <div className="p-4 border-t border-slate-200/60 space-y-1 bg-gradient-to-r from-slate-50 to-slate-100/50">
          <Link
            href="/oficina-basica/configuracoes"
            onClick={() => setIsOpen(false)}
            className={`group flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              pathname === '/oficina-basica/configuracoes'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <CogIcon className={`h-5 w-5 mr-3 transition-colors ${
              pathname === '/oficina-basica/configuracoes' 
                ? 'text-white' 
                : 'text-slate-500 group-hover:text-slate-700'
            }`} />
            Configurações
          </Link>
          
          <button
            onClick={handleLogout}
            className="w-full group flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3 text-red-500 group-hover:text-red-600 transition-colors" />
            Sair
          </button>
        </div>
      </div>
    </>
  );
} 