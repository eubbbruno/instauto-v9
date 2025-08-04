'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Home, Car, Calendar, FileText, Settings, Wrench, Users, Crown, 
  BarChart, DollarSign, Menu, LogOut, User, Search, MessageSquare,
  Package, ShoppingBag, Cpu, Star, Heart, MapPin
} from 'lucide-react';

interface MenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  highlight?: boolean;
  badge?: string;
}

interface MenuConfig {
  [key: string]: MenuItem[];
}

interface ThemeConfig {
  [key: string]: {
    primary: string;
    secondary: string;
    accent: string;
    gradient: string;
  };
}

const menuItems: MenuConfig = {
  motorista: [
    { icon: Home, label: 'Dashboard', href: '/new-dashboard?type=motorista' },
    { icon: Car, label: 'Minha Garagem', href: '/new-dashboard?type=motorista&section=garagem' },
    { icon: Search, label: 'Buscar Oficinas', href: '/new-dashboard?type=motorista&section=buscar' },
    { icon: Calendar, label: 'Agendamentos', href: '/new-dashboard?type=motorista&section=agendamentos' },
    { icon: FileText, label: 'Histórico', href: '/new-dashboard?type=motorista&section=historico' },
    { icon: Heart, label: 'Favoritos', href: '/new-dashboard?type=motorista&section=favoritos' },
    { icon: MessageSquare, label: 'Mensagens', href: '/new-dashboard?type=motorista&section=mensagens' },
    { icon: Settings, label: 'Configurações', href: '/new-dashboard?type=motorista&section=configuracoes' }
  ],
  oficinaFree: [
    { icon: Home, label: 'Dashboard', href: '/new-dashboard?type=oficina&plan=free' },
    { icon: Wrench, label: 'Serviços', href: '/new-dashboard?type=oficina&plan=free&section=servicos' },
    { icon: Users, label: 'Clientes', href: '/new-dashboard?type=oficina&plan=free&section=clientes' },
    { icon: Calendar, label: 'Agendamentos', href: '/new-dashboard?type=oficina&plan=free&section=agendamentos' },
    { icon: FileText, label: 'Orçamentos', href: '/new-dashboard?type=oficina&plan=free&section=orcamentos' },
    { icon: MessageSquare, label: 'Mensagens', href: '/new-dashboard?type=oficina&plan=free&section=mensagens' },
    { icon: Crown, label: 'Upgrade PRO', href: '/new-dashboard?type=oficina&plan=free&section=upgrade', highlight: true, badge: 'Premium' },
    { icon: Settings, label: 'Configurações', href: '/new-dashboard?type=oficina&plan=free&section=configuracoes' }
  ],
  oficinaPro: [
    { icon: Home, label: 'Dashboard', href: '/new-dashboard?type=oficina&plan=pro' },
    { icon: Users, label: 'Clientes', href: '/new-dashboard?type=oficina&plan=pro&section=clientes' },
    { icon: Calendar, label: 'Agendamentos', href: '/new-dashboard?type=oficina&plan=pro&section=agendamentos' },
    { icon: Wrench, label: 'Ordens de Serviço', href: '/new-dashboard?type=oficina&plan=pro&section=ordens' },
    { icon: Package, label: 'Estoque', href: '/new-dashboard?type=oficina&plan=pro&section=estoque' },
    { icon: ShoppingBag, label: 'Produtos', href: '/new-dashboard?type=oficina&plan=pro&section=produtos' },
    { icon: Cpu, label: 'Diagnóstico IA', href: '/new-dashboard?type=oficina&plan=pro&section=diagnostico' },
    { icon: Star, label: 'Avaliações', href: '/new-dashboard?type=oficina&plan=pro&section=avaliacoes' },
    { icon: BarChart, label: 'Relatórios', href: '/new-dashboard?type=oficina&plan=pro&section=relatorios' },
    { icon: DollarSign, label: 'Financeiro', href: '/new-dashboard?type=oficina&plan=pro&section=financeiro' },
    { icon: MessageSquare, label: 'WhatsApp', href: '/new-dashboard?type=oficina&plan=pro&section=whatsapp' },
    { icon: Settings, label: 'Configurações', href: '/new-dashboard?type=oficina&plan=pro&section=configuracoes' }
  ]
};

const themes: ThemeConfig = {
  motorista: {
    primary: 'bg-blue-600',
    secondary: 'bg-blue-50',
    accent: 'text-blue-600',
    gradient: 'from-blue-600 to-blue-800'
  },
  oficinaFree: {
    primary: 'bg-green-600',
    secondary: 'bg-green-50',
    accent: 'text-green-600',
    gradient: 'from-green-600 to-green-800'
  },
  oficinaPro: {
    primary: 'bg-amber-600',
    secondary: 'bg-amber-50',
    accent: 'text-amber-600',
    gradient: 'from-amber-600 to-amber-800'
  }
};

interface SharedSidebarProps {
  type: 'motorista' | 'oficinaFree' | 'oficinaPro';
  userName: string;
  userEmail: string;
  currentPath?: string;
  onLogout: () => void;
}

export function SharedSidebar({ type, userName, userEmail, currentPath, onLogout }: SharedSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const items = menuItems[type] || [];
  const theme = themes[type] || themes.motorista;

  const getTitle = () => {
    switch (type) {
      case 'motorista': return 'Painel Motorista';
      case 'oficinaFree': return 'Oficina - Plano Free';
      case 'oficinaPro': return 'Oficina - Plano Pro';
      default: return 'Dashboard';
    }
  };

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} ${theme.primary} text-white transition-all duration-300 flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold">{getTitle()}</h1>
              <p className="text-white/80 text-sm truncate">{userName}</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 p-4 space-y-2">
        {items.map((item, index) => {
          const isActive = currentPath === item.href;
          const IconComponent = item.icon;
          
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={item.href}
                className={`group flex items-center p-3 rounded-lg transition-all relative overflow-hidden ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : 'hover:bg-white/10 text-white/80 hover:text-white'
                } ${item.highlight ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}`}
              >
                <IconComponent className="w-5 h-5 flex-shrink-0" />
                
                {!isCollapsed && (
                  <>
                    <span className="ml-3 font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto px-2 py-1 text-xs bg-yellow-500 text-yellow-900 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-1 bg-white"
                    layoutId="activeIndicator"
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        {!isCollapsed && (
          <div className="mb-3">
            <p className="text-white/60 text-xs">{userEmail}</p>
          </div>
        )}
        
        <div className="space-y-2">
          <Link
            href="/new-dashboard?section=perfil"
            className="flex items-center p-2 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white"
          >
            <User className="w-5 h-5" />
            {!isCollapsed && <span className="ml-3">Perfil</span>}
          </Link>
          
          <button
            onClick={onLogout}
            className="w-full flex items-center p-2 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white"
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span className="ml-3">Sair</span>}
          </button>
        </div>
      </div>
    </div>
  );
}