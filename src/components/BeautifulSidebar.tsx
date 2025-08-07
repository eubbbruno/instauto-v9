'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  HomeIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  CogIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  WrenchScrewdriverIcon,
  TruckIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  StarIcon,
  SparklesIcon,
  DocumentTextIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'

interface SidebarItem {
  icon: any
  label: string
  href: string
  badge?: string
  isUpgrade?: boolean
}

interface BeautifulSidebarProps {
  userType: 'motorista' | 'oficina-free' | 'oficina-pro'
  userName?: string
  userEmail?: string
  onLogout?: () => void
}

const menuItems = {
  motorista: [
    { icon: HomeIcon, label: 'Dashboard', href: '/motorista' },
    { icon: TruckIcon, label: 'Minha Garagem', href: '/motorista/garagem' },
    { icon: MapPinIcon, label: 'Buscar Oficinas', href: '/motorista/buscar' },
    { icon: CalendarDaysIcon, label: 'Agendamentos', href: '/motorista/agendamentos' },
    { icon: DocumentTextIcon, label: 'Histórico', href: '/motorista/historico' },
    { icon: ChatBubbleLeftRightIcon, label: 'Mensagens', href: '/motorista/mensagens' },
    { icon: BellIcon, label: 'Notificações', href: '/motorista/notificacoes' },
    { icon: PhoneIcon, label: 'Emergência', href: '/motorista/emergencia' },
    { icon: CogIcon, label: 'Configurações', href: '/motorista/configuracoes' }
  ],
  'oficina-free': [
    { icon: HomeIcon, label: 'Dashboard', href: '/oficina-free' },
    { icon: UsersIcon, label: 'Clientes', href: '/oficina-free/clientes' },
    { icon: ClipboardDocumentListIcon, label: 'Ordens', href: '/oficina-free/ordens' },
    { icon: CalendarDaysIcon, label: 'Agendamentos', href: '/oficina-free/agendamentos' },
    { icon: ChatBubbleLeftRightIcon, label: 'Mensagens', href: '/oficina-free/mensagens' },
    { icon: StarIcon, label: 'Upgrade PRO', href: '/oficina-free/upgrade', isUpgrade: true, badge: 'PRO' },
    { icon: CogIcon, label: 'Configurações', href: '/oficina-free/configuracoes' }
  ],
  'oficina-pro': [
    { icon: HomeIcon, label: 'Dashboard', href: '/oficina-pro' },
    { icon: UsersIcon, label: 'Clientes', href: '/oficina-pro/clientes' },
    { icon: ClipboardDocumentListIcon, label: 'Ordens', href: '/oficina-pro/ordens' },
    { icon: CalendarDaysIcon, label: 'Agendamentos', href: '/oficina-pro/agendamentos' },
    { icon: ChartBarIcon, label: 'Relatórios', href: '/oficina-pro/relatorios' },
    { icon: CreditCardIcon, label: 'Financeiro', href: '/oficina-pro/financeiro' },
    { icon: ChatBubbleLeftRightIcon, label: 'WhatsApp', href: '/oficina-pro/whatsapp' },
    { icon: BuildingStorefrontIcon, label: 'Estoque', href: '/oficina-pro/estoque' },
    { icon: CogIcon, label: 'Configurações', href: '/oficina-pro/configuracoes' }
  ]
}

const getThemeColors = (userType: string) => {
  switch (userType) {
    case 'motorista':
      return {
        gradient: 'from-[#031023] via-[#0047CC] to-[#031023]',
        accent: '#FFDE59',
        primary: '#0047CC',
        text: 'text-white'
      }
    case 'oficina-free':
      return {
        gradient: 'from-[#0D4F3C] via-[#10B981] to-[#0D4F3C]',
        accent: '#FCD34D',
        primary: '#10B981',
        text: 'text-white'
      }
    case 'oficina-pro':
      return {
        gradient: 'from-[#451A03] via-[#D97706] to-[#451A03]',
        accent: '#FCD34D',
        primary: '#D97706',
        text: 'text-white'
      }
    default:
      return {
        gradient: 'from-gray-800 via-gray-700 to-gray-800',
        accent: '#60A5FA',
        primary: '#3B82F6',
        text: 'text-white'
      }
  }
}

export default function BeautifulSidebar({ 
  userType, 
  userName = 'Usuário', 
  userEmail = 'usuario@email.com',
  onLogout = () => {}
}: BeautifulSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()

  const theme = getThemeColors(userType)
  const items = menuItems[userType] || menuItems.motorista

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className={`hidden md:block w-64 h-screen bg-gradient-to-b ${theme.gradient}`}>
        <div className="p-6 animate-pulse">
          <div className="w-32 h-8 bg-white/20 rounded mb-6"></div>
        </div>
      </div>
    )
  }

  const SidebarContent = () => (
    <>
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.07] pointer-events-none"></div>
      <div className="absolute top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* Partículas decorativas */}
      <div className="absolute top-10 left-[10%] w-1 h-1 bg-white/30 rounded-full"></div>
      <div className="absolute top-[30%] right-[15%] w-2 h-2 bg-white/20 rounded-full"></div>
      <div className="absolute bottom-[20%] left-[20%] w-1.5 h-1.5 bg-white/20 rounded-full"></div>

      {/* Header com Logo */}
      <div className={`flex items-center justify-between p-6 ${isCollapsed ? 'px-4' : ''}`}>
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="relative">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center`}>
              <WrenchScrewdriverIcon className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-lg text-white">InstaAuto</h1>
              <p className="text-xs text-white/70">
                {userType === 'oficina-pro' ? 'PRO' : userType === 'oficina-free' ? 'FREE' : 'DRIVER'}
              </p>
            </div>
          )}
        </div>
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex w-8 h-8 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all"
        >
          <Bars3Icon className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="px-4 space-y-1">
        {items.map((item, index) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative ${
                  isActive 
                    ? 'bg-white/15 backdrop-blur-sm border border-white/20 text-white shadow-lg' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                } ${item.isUpgrade ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30' : ''}`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                )}
                
                <div className={`flex-shrink-0 ${isCollapsed ? 'mx-auto' : ''}`}>
                  <Icon className={`w-5 h-5 ${item.isUpgrade ? 'text-yellow-400' : ''}`} />
                </div>
                
                {!isCollapsed && (
                  <>
                    <span className={`font-medium flex-1 ${item.isUpgrade ? 'text-yellow-400' : ''}`}>
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold rounded-full">
                        {item.badge}
                      </span>
                    )}
                    {item.isUpgrade && (
                      <SparklesIcon className="w-4 h-4 text-yellow-400 animate-pulse" />
                    )}
                  </>
                )}
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="absolute bottom-4 left-4 right-4">
        {userType === 'oficina-pro' && !isCollapsed && (
          <div className="mb-4 p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-400/30">
            <div className="flex items-center gap-2 text-yellow-400 text-sm font-semibold">
              <ShieldCheckIcon className="w-4 h-4" />
              <span>Plano PRO Ativo</span>
            </div>
          </div>
        )}
        
        <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 ${isCollapsed ? 'px-2' : ''}`}>
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-white/20 to-white/5 rounded-full flex items-center justify-center border border-white/20">
                  <UserCircleIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{userName}</p>
                  <p className="text-white/60 text-xs truncate">{userEmail}</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all text-sm"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </>
          ) : (
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              title="Sair"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-gray-900 text-white rounded-lg flex items-center justify-center shadow-lg"
      >
        <Bars3Icon className="w-5 h-5" />
      </button>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <>
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileOpen(false)}
          />
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className={`md:hidden fixed left-0 top-0 h-screen w-80 z-50 bg-gradient-to-b ${theme.gradient} relative`}
          >
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-6 right-6 w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center"
            >
              <XMarkIcon className="w-5 h-5 text-white" />
            </button>
            <SidebarContent />
          </motion.aside>
        </>
      )}

      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:block fixed left-0 top-0 h-screen z-30 transition-all duration-300 bg-gradient-to-b ${theme.gradient} relative ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  )
}