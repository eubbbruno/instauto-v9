"use client";

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, Calendar, FileText, Settings, Wrench, Users, Crown, 
  BarChart, DollarSign, Menu, Bell, LogOut, User,
  ChevronDown, Home, MessageSquare, Heart, Search
} from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToastHelpers } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';

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

const menuItems: MenuConfig = {
  motorista: [
    { icon: Home, label: 'Dashboard', href: '/motorista' },
    { icon: Car, label: 'Minha Garagem', href: '/motorista/garagem' },
    { icon: Search, label: 'Buscar Oficinas', href: '/motorista/buscar' },
    { icon: Calendar, label: 'Agendamentos', href: '/motorista/agendamentos' },
    { icon: FileText, label: 'Histórico', href: '/motorista/historico' },
    { icon: Heart, label: 'Favoritos', href: '/motorista/favoritos' },
    { icon: MessageSquare, label: 'Mensagens', href: '/motorista/mensagens' },
    { icon: Settings, label: 'Configurações', href: '/motorista/configuracoes' }
  ],
  oficinaFree: [
    { icon: Home, label: 'Dashboard', href: '/oficina-basica' },
    { icon: Wrench, label: 'Serviços', href: '/oficina-basica/veiculos' },
    { icon: Users, label: 'Clientes', href: '/oficina-basica/clientes' },
    { icon: Calendar, label: 'Agendamentos', href: '/oficina-basica/agendamentos' },
    { icon: FileText, label: 'Orçamentos', href: '/oficina-basica/orcamentos' },
    { icon: MessageSquare, label: 'Mensagens', href: '/oficina-basica/mensagens' },
    { icon: Crown, label: 'Upgrade PRO', href: '/oficina-basica/upgrade', highlight: true, badge: 'Premium' },
    { icon: Settings, label: 'Configurações', href: '/oficina-basica/perfil' }
  ],
  oficinaPro: [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: Wrench, label: 'Ordens de Serviço', href: '/dashboard/ordens' },
    { icon: Users, label: 'Clientes', href: '/dashboard/clientes' },
    { icon: Calendar, label: 'Agendamentos', href: '/dashboard/agendamentos' },
    { icon: BarChart, label: 'Relatórios', href: '/dashboard/relatorios' },
    { icon: DollarSign, label: 'Financeiro', href: '/dashboard/financeiro' },
    { icon: MessageSquare, label: 'Mensagens', href: '/dashboard/whatsapp' },
    { icon: Settings, label: 'Configurações', href: '/dashboard/configuracoes' }
  ]
};

interface DynamicLayoutProps {
  children: React.ReactNode;
}

export default function DynamicLayout({ children }: DynamicLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { success } = useToastHelpers();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Não mostrar layout nas páginas auth e home
  const isAuthPage = pathname?.startsWith('/auth') || pathname === '/';
  if (isAuthPage || !user) {
    return <>{children}</>;
  }

  const getUserMenuKey = () => {
    if (user?.type === 'motorista') return 'motorista';
    if (user?.type === 'oficina') {
      return user?.planType === 'pro' ? 'oficinaPro' : 'oficinaFree';
    }
    return 'motorista'; // fallback
  };

  const getThemeColors = () => {
    const userType = user?.type;
    const planType = user?.planType;
    
    if (userType === 'motorista') {
      return {
        primary: 'bg-blue-600',
        primaryHover: 'hover:bg-blue-700',
        primaryLight: 'bg-blue-50',
        primaryText: 'text-blue-600',
        gradient: 'from-blue-600 to-indigo-700'
      };
    }
    
    if (userType === 'oficina' && planType === 'pro') {
      return {
        primary: 'bg-amber-600',
        primaryHover: 'hover:bg-amber-700',
        primaryLight: 'bg-amber-50',
        primaryText: 'text-amber-600',
        gradient: 'from-amber-600 to-orange-600'
      };
    }
    
    // Oficina Free
    return {
      primary: 'bg-green-600',
      primaryHover: 'hover:bg-green-700',
      primaryLight: 'bg-green-50',
      primaryText: 'text-green-600',
      gradient: 'from-green-600 to-emerald-700'
    };
  };

  const colors = getThemeColors();
  const currentMenuItems = menuItems[getUserMenuKey()] || [];

  const handleLogout = async () => {
    try {
      await logout();
      success('Logout realizado com sucesso!', 'Até logo!');
      router.push('/');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getPlanBadge = () => {
    if (user?.type === 'oficina') {
      return user?.planType === 'pro' ? 
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
          ⭐ PRO
        </span> :
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          🆓 FREE
        </span>;
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        🚗 MOTORISTA
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.div 
        initial={false}
        animate={{ 
          width: sidebarOpen ? 280 : 64,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        className={`
          bg-white shadow-lg border-r border-gray-200 relative z-20
          ${sidebarOpen ? 'w-70' : 'w-16'} 
          hidden md:block
        `}
      >
        <div className="p-4">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3 mb-8">
            <div className={`w-8 h-8 rounded-lg ${colors.primary} flex items-center justify-center`}>
              <span className="text-white font-bold text-sm">I</span>
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-bold text-gray-900"
                >
                  Instauto
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            {currentMenuItems.map((item, index) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                    ${isActive ? 
                      `${colors.primary} text-white shadow-md` : 
                      `text-gray-600 hover:bg-gray-100 ${colors.primaryHover.replace('bg-', 'hover:text-').replace('-600', '-600').replace('-700', '-700')}`
                    }
                    ${item.highlight ? 'border-2 border-dashed border-amber-300 bg-amber-50' : ''}
                  `}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${item.highlight ? 'text-amber-600' : ''}`} />
                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-between w-full"
                      >
                        <span className={`font-medium ${item.highlight ? 'text-amber-700' : ''}`}>
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="bg-amber-200 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">
                            {item.badge}
                          </span>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`
            absolute -right-3 top-20 w-6 h-6 rounded-full ${colors.primary} 
            text-white flex items-center justify-center text-xs shadow-lg
            hover:scale-110 transition-transform
          `}
        >
          {sidebarOpen ? '<' : '>'}
        </button>
      </motion.div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className={`bg-gradient-to-r ${colors.gradient} shadow-sm`}>
          <div className="px-4 py-3 flex items-center justify-between">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-white hover:bg-white/20"
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Page Title (mobile) */}
            <div className="flex items-center gap-3 md:hidden">
              <h1 className="text-white font-semibold">Instauto</h1>
            </div>

            {/* Right side - User info */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-white hover:bg-white/20 transition-colors"
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name || 'Avatar'} 
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <span className="text-sm font-medium text-white">
                        {getUserInitials()}
                      </span>
                    )}
                  </div>

                  {/* User Info (desktop) */}
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-white">
                      {user?.name || 'Usuário'}
                    </div>
                    <div className="text-xs text-white/70">
                      {user?.email}
                    </div>
                  </div>

                  <ChevronDown className="w-4 h-4 text-white/70" />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                    >
                      {/* User Info Card */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            {user?.avatar ? (
                              <img 
                                src={user.avatar} 
                                alt={user.name || 'Avatar'} 
                                className="w-12 h-12 rounded-full"
                              />
                            ) : (
                              <span className="text-lg font-medium text-gray-600">
                                {getUserInitials()}
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {user?.name || 'Usuário'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user?.email}
                            </div>
                            <div className="mt-1">
                              {getPlanBadge()}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <Link
                          href={user?.type === 'motorista' ? '/motorista/perfil' : user?.planType === 'pro' ? '/dashboard/perfil' : '/oficina-basica/perfil'}
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          Meu Perfil
                        </Link>
                        <Link
                          href={user?.type === 'motorista' ? '/motorista/configuracoes' : user?.planType === 'pro' ? '/dashboard/configuracoes' : '/oficina-basica/perfil'}
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Configurações
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4" />
                          Sair
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 