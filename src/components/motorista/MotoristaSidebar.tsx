"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  TruckIcon,
  CalendarDaysIcon,
  ClockIcon,
  StarIcon,
  MapPinIcon,
  CreditCardIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
  ChevronDownIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number | string;
  description?: string;
  submenu?: {
    name: string;
    href: string;
    icon?: React.ElementType;
  }[];
}

export default function MotoristaSidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const navigation: NavigationItem[] = [
    { 
      name: 'Dashboard', 
      href: '/motorista', 
      icon: HomeIcon,
      description: 'Visão geral dos seus veículos'
    },
    { 
      name: 'Buscar Oficinas', 
      href: '/motorista/buscar', 
      icon: MagnifyingGlassIcon,
      description: 'Encontre oficinas próximas'
    },
    { 
      name: 'Minha Garagem', 
      href: '/motorista/garagem', 
      icon: TruckIcon,
      badge: user?.vehicles?.length || 0,
      description: 'Gerencie seus veículos',
      submenu: [
        { name: 'Adicionar Veículo', href: '/motorista/garagem/novo' },
        { name: 'Histórico de Manutenções', href: '/motorista/garagem/historico' }
      ]
    },
    { 
      name: 'Agendamentos', 
      href: '/motorista/agendamentos', 
      icon: CalendarDaysIcon,
      badge: 2,
      description: 'Seus serviços agendados'
    },
    { 
      name: 'Histórico', 
      href: '/motorista/historico', 
      icon: ClockIcon,
      description: 'Histórico de serviços realizados'
    },
    { 
      name: 'Favoritos', 
      href: '/motorista/favoritos', 
      icon: StarIcon,
      description: 'Suas oficinas favoritas'
    },
    { 
      name: 'Localização', 
      href: '/motorista/localizacao', 
      icon: MapPinIcon,
      description: 'Serviços próximos a você'
    }
  ];

  const bottomNavigation = [
    { 
      name: 'Pagamentos', 
      href: '/motorista/pagamentos', 
      icon: CreditCardIcon,
      description: 'Histórico de pagamentos'
    },
    { 
      name: 'Suporte', 
      href: '/motorista/suporte', 
      icon: QuestionMarkCircleIcon,
      description: 'Central de ajuda'
    },
    { 
      name: 'Emergência', 
      href: '/motorista/emergencia', 
      icon: PhoneIcon,
      description: 'Guincho e socorro 24h',
      badge: '24h'
    }
  ];

  const isActivePath = (href: string) => {
    if (href === '/motorista') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const toggleSubmenu = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 40
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 40
      }
    }
  };

  const NavItem = ({ item, isBottom = false }: { item: NavigationItem; isBottom?: boolean }) => {
    const isActive = isActivePath(item.href);
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = expandedItems.includes(item.name);

    return (
      <div>
        <Link
          href={hasSubmenu ? '#' : item.href}
          onClick={(e) => {
            if (hasSubmenu) {
              e.preventDefault();
              toggleSubmenu(item.name);
            } else {
              onClose();
            }
          }}
          className={`group flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative ${
            isActive && !hasSubmenu
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          } ${isBottom ? 'border border-gray-200 hover:border-gray-300' : ''}`}
        >
          <div className={`p-2 rounded-lg mr-3 transition-colors ${
            isActive && !hasSubmenu
              ? 'bg-white/20' 
              : 'bg-gray-100 group-hover:bg-gray-200'
          }`}>
            <item.icon className={`h-5 w-5 transition-colors ${
              isActive && !hasSubmenu ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'
            }`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="truncate">{item.name}</span>
              <div className="flex items-center space-x-2">
                {item.badge && (
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full transition-colors ${
                    isActive && !hasSubmenu
                      ? 'bg-white/20 text-white' 
                      : typeof item.badge === 'number'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {hasSubmenu && (
                  <ChevronDownIcon className={`h-4 w-4 transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  } ${isActive ? 'text-white' : 'text-gray-400'}`} />
                )}
              </div>
            </div>
            {item.description && (
              <p className={`text-xs mt-0.5 truncate ${
                isActive && !hasSubmenu ? 'text-white/80' : 'text-gray-500'
              }`}>
                {item.description}
              </p>
            )}
          </div>

          {isActive && !hasSubmenu && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-green-300 rounded-l-full" />
          )}
        </Link>

        {/* Submenu */}
        <AnimatePresence>
          {hasSubmenu && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="ml-6 mt-2 space-y-1 overflow-hidden"
            >
              {item.submenu?.map((subItem) => (
                <Link
                  key={subItem.href}
                  href={subItem.href}
                  onClick={onClose}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActivePath(subItem.href)
                      ? 'bg-green-50 text-green-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  <div className="w-2 h-2 bg-gray-300 rounded-full mr-3"></div>
                  {subItem.name}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      {/* Backdrop para mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        className="fixed lg:static top-0 left-0 z-50 w-80 h-screen bg-white border-r border-gray-200/60 flex flex-col shadow-xl lg:shadow-none lg:translate-x-0"
      >
        {/* Header do Sidebar */}
        <div className="p-6 bg-gradient-to-r from-green-500 to-emerald-600 relative overflow-hidden">
          {/* Padrão decorativo */}
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <span className="text-white font-bold text-lg">🚗</span>
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">Motorista</h2>
                  <p className="text-green-100 text-sm">Painel de Controle</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Info do usuário */}
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-white font-medium truncate">
                {user?.name?.split(' ')[0] || 'Usuário'}
              </p>
              <p className="text-green-100 text-sm">
                {user?.vehicles?.length || 0} veículo{user?.vehicles?.length !== 1 ? 's' : ''} cadastrado{user?.vehicles?.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Navegação Principal */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
              Principal
            </h3>
            {navigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </div>

          {/* Seção Inferior */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
              Outros
            </h3>
            {bottomNavigation.map((item) => (
              <NavItem key={item.name} item={item} isBottom={true} />
            ))}
          </div>
        </nav>

        {/* Footer do Sidebar */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Versão 1.0.0
            </p>
            <p className="text-xs text-gray-400 mt-1">
              © 2024 Instauto
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
} 