"use client";

import { 
  HomeIcon, 
  WrenchScrewdriverIcon, 
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  ChartBarIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  BuildingStorefrontIcon,
  UsersIcon,
  TruckIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  MapPinIcon,
  CreditCardIcon,
  PhoneIcon
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

type SidebarItem = {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: number;
  isNew?: boolean;
};

type SidebarCategoryProps = {
  title?: string;
  items: SidebarItem[];
  isCollapsed: boolean;
};

interface DashboardSidebarProps {
  userType?: 'oficina' | 'motorista';
}

function SidebarCategory({ title, items, isCollapsed }: SidebarCategoryProps) {
  const pathname = usePathname();
  
  return (
    <div className="mb-6">
      {title && !isCollapsed && (
        <h3 className="text-xs uppercase font-medium px-4 mb-3 text-[#FFDE59]/80">{title}</h3>
      )}
      <ul className="space-y-1.5">
        {items.map((item, i) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <motion.li 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.2 }}
            >
              <Link 
                href={item.href} 
                className={`group flex items-center px-4 py-2.5 rounded-lg text-sm transition-all relative overflow-hidden ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#0047CC]/90 to-[#0055EB]/90 text-white font-medium' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {/* Background decorativo ao passar o mouse */}
                <div className={`absolute inset-0 bg-gradient-to-r from-[#0047CC]/60 to-[#0055EB]/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${isActive ? 'opacity-100' : ''}`}></div>
                
                {/* Barra lateral quando ativo */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FFDE59]"></div>
                )}
                
                {/* Conteúdo do item */}
                <div className={`relative z-10 ${isCollapsed ? 'mx-auto' : 'mr-3'}`}>
                  {item.icon}
                </div>
                
                {!isCollapsed && (
                  <>
                    <span className="relative z-10 flex-1">{item.label}</span>
                    <div className="relative z-10 flex items-center">
                      {item.badge && (
                        <span className="bg-[#FFDE59] text-[#0047CC] text-xs px-2 py-0.5 rounded-full font-medium ml-2">
                          {item.badge}
                        </span>
                      )}
                      {item.isNew && (
                        <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium ml-2">
                          Novo
                        </span>
                      )}
                    </div>
                  </>
                )}
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

// Itens de navegação para oficinas premium
const oficinaMainNavItems: SidebarItem[] = [
  { icon: <HomeIcon className="h-5 w-5" />, label: "Dashboard", href: "/dashboard" },
  { icon: <WrenchScrewdriverIcon className="h-5 w-5" />, label: "Ordens de Serviço", href: "/dashboard/ordens", badge: 3 },
  { icon: <ClipboardDocumentListIcon className="h-5 w-5" />, label: "Diagnóstico", href: "/dashboard/diagnostico" },
  { icon: <CalendarDaysIcon className="h-5 w-5" />, label: "Agendamentos", href: "/dashboard/agendamentos", badge: 2 },
  { icon: <BanknotesIcon className="h-5 w-5" />, label: "Financeiro", href: "/dashboard/financeiro" },
  { icon: <ChartBarIcon className="h-5 w-5" />, label: "Relatórios", href: "/dashboard/relatorios" },
];

// Itens de navegação para oficina básica
const oficinaBasicaMainNavItems: SidebarItem[] = [
  { icon: <HomeIcon className="h-5 w-5" />, label: "Dashboard", href: "/oficina-basica" },
  { icon: <WrenchScrewdriverIcon className="h-5 w-5" />, label: "Ordens de Serviço", href: "/oficina-basica/ordens", badge: 3 },
  { icon: <CalendarDaysIcon className="h-5 w-5" />, label: "Agendamentos", href: "/oficina-basica/agendamentos", badge: 2 },
  { icon: <TruckIcon className="h-5 w-5" />, label: "Veículos", href: "/oficina-basica/veiculos" },
  { icon: <BanknotesIcon className="h-5 w-5" />, label: "Orçamentos", href: "/oficina-basica/orcamentos" },
  { icon: <ChartBarIcon className="h-5 w-5" />, label: "Relatórios", href: "/oficina-basica/relatorios" },
];

const catalogItems: SidebarItem[] = [
  { icon: <BuildingStorefrontIcon className="h-5 w-5" />, label: "Produtos & Peças", href: "/dashboard/produtos" },
  { icon: <TruckIcon className="h-5 w-5" />, label: "Estoque", href: "/dashboard/estoque", isNew: true },
];

const engagementItems: SidebarItem[] = [
  { icon: <StarIcon className="h-5 w-5" />, label: "Avaliações", href: "/dashboard/avaliacoes", badge: 5 },
  { icon: <ChatBubbleLeftRightIcon className="h-5 w-5" />, label: "WhatsApp", href: "/dashboard/whatsapp" },
  { icon: <UsersIcon className="h-5 w-5" />, label: "Clientes", href: "/dashboard/clientes" },
];

// Itens de navegação para oficina básica - seção atendimento
const oficinaBasicaAtendimentoItems: SidebarItem[] = [
  { icon: <StarIcon className="h-5 w-5" />, label: "Avaliações", href: "/oficina-basica/avaliacoes", badge: 3 },
  { icon: <ChatBubbleLeftRightIcon className="h-5 w-5" />, label: "WhatsApp", href: "/oficina-basica/whatsapp" },
  { icon: <QuestionMarkCircleIcon className="h-5 w-5" />, label: "Suporte", href: "/oficina-basica/suporte" },
];

// Itens de navegação para motoristas
const motoristaMainNavItems: SidebarItem[] = [
  { icon: <HomeIcon className="h-5 w-5" />, label: "Dashboard", href: "/motorista" },
  { icon: <MagnifyingGlassIcon className="h-5 w-5" />, label: "Buscar Oficinas", href: "/motorista/buscar" },
  { icon: <TruckIcon className="h-5 w-5" />, label: "Minha Garagem", href: "/motorista/garagem" },
  { icon: <CalendarDaysIcon className="h-5 w-5" />, label: "Agendamentos", href: "/motorista/agendamentos", badge: 2 },
  { icon: <ClockIcon className="h-5 w-5" />, label: "Histórico", href: "/motorista/historico" },
  { icon: <StarIcon className="h-5 w-5" />, label: "Favoritos", href: "/motorista/favoritos" },
];

const motoristaServiceItems: SidebarItem[] = [
  { icon: <MapPinIcon className="h-5 w-5" />, label: "Localização", href: "/motorista/localizacao" },
  { icon: <CreditCardIcon className="h-5 w-5" />, label: "Pagamentos", href: "/motorista/pagamentos" },
  { icon: <PhoneIcon className="h-5 w-5" />, label: "Emergência 24h", href: "/motorista/emergencia", badge: 1 },
];

const settingsItems: SidebarItem[] = [
  { icon: <UserCircleIcon className="h-5 w-5" />, label: "Meu Perfil", href: "/dashboard/perfil" },
  { icon: <Cog6ToothIcon className="h-5 w-5" />, label: "Configurações", href: "/dashboard/configuracoes" },
  { icon: <QuestionMarkCircleIcon className="h-5 w-5" />, label: "Suporte com IA", href: "/dashboard/suporte" },
  { icon: <ArrowRightOnRectangleIcon className="h-5 w-5" />, label: "Sair", href: "/sair" },
];

const oficinaBasicaSettingsItems: SidebarItem[] = [
  { icon: <UserCircleIcon className="h-5 w-5" />, label: "Meu Perfil", href: "/oficina-basica/perfil" },
  { icon: <Cog6ToothIcon className="h-5 w-5" />, label: "Configurações", href: "/oficina-basica/configuracoes" },
  { icon: <ArrowRightOnRectangleIcon className="h-5 w-5" />, label: "Sair", href: "/sair" },
];

const motoristaSettingsItems: SidebarItem[] = [
  { icon: <UserCircleIcon className="h-5 w-5" />, label: "Meu Perfil", href: "/motorista/perfil" },
  { icon: <Cog6ToothIcon className="h-5 w-5" />, label: "Configurações", href: "/motorista/configuracoes" },
  { icon: <QuestionMarkCircleIcon className="h-5 w-5" />, label: "Suporte", href: "/motorista/suporte" },
  { icon: <ArrowRightOnRectangleIcon className="h-5 w-5" />, label: "Sair", href: "/sair" },
];

export default function DashboardSidebar({ userType = 'oficina' }: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  
  // Detectar automaticamente o tipo de usuário e oficina baseado na rota
  const detectedUserType = pathname.startsWith('/motorista') ? 'motorista' : 'oficina';
  const isOficinaBasica = pathname.startsWith('/oficina-basica');
  const currentUserType = userType || detectedUserType;
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return null;
  }
  
  return (
    <>
      {/* Sidebar desktop */}
      <aside 
        className={`hidden md:block fixed left-0 top-0 h-screen z-50 transition-all duration-300 bg-gradient-to-b from-[#031023] via-[#0047CC] to-[#031023] ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Elementos decorativos de fundo */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.07] pointer-events-none"></div>
        <div className="absolute top-20 -right-20 w-64 h-64 bg-[#FFDE59]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-20 -left-20 w-64 h-64 bg-[#0047CC]/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        {/* Partículas decorativas */}
        <div className="absolute top-10 left-[10%] w-1 h-1 bg-[#FFDE59]/30 rounded-full"></div>
        <div className="absolute top-[30%] right-[15%] w-2 h-2 bg-[#0047CC]/20 rounded-full"></div>
        <div className="absolute bottom-[20%] left-[20%] w-1.5 h-1.5 bg-[#FFDE59]/20 rounded-full"></div>
        
        {/* Header do Sidebar com logo */}
        <div className={`flex items-center justify-between p-6 ${isCollapsed ? 'px-4' : ''}`}>
          <Link href="/" className={`relative ${isCollapsed ? 'w-10 h-10 overflow-hidden' : ''}`}>
            {isCollapsed ? (
              <div className="bg-gradient-to-r from-[#0047CC] to-[#0055EB] rounded-md flex items-center justify-center p-2">
                <div className="text-xl font-bold text-white font-syne">I</div>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-[#0047CC] to-[#0055EB] rounded-xl flex items-center justify-center shadow-md mr-3">
                  <span className="text-white font-bold text-lg font-syne">I</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white font-syne">Instauto</h1>
                  <p className="text-xs text-white/60">
                    {currentUserType === 'motorista' ? 'Motorista' : isOficinaBasica ? 'Oficina Básica' : 'Oficina Premium'}
                  </p>
                </div>
              </div>
            )}
          </Link>
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`text-white/70 hover:text-white transition-colors duration-300 w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center ${isCollapsed ? 'mt-4' : ''}`}
            aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {/* Conteúdo do sidebar */}
        <div className="px-2 pb-20 h-full overflow-y-auto">
          {currentUserType === 'motorista' ? (
            <>
              <SidebarCategory items={motoristaMainNavItems} isCollapsed={isCollapsed} />
              <SidebarCategory title="Serviços" items={motoristaServiceItems} isCollapsed={isCollapsed} />
              <SidebarCategory title="Configurações" items={motoristaSettingsItems} isCollapsed={isCollapsed} />
            </>
          ) : isOficinaBasica ? (
            <>
              <SidebarCategory items={oficinaBasicaMainNavItems} isCollapsed={isCollapsed} />
              <SidebarCategory title="Atendimento" items={oficinaBasicaAtendimentoItems} isCollapsed={isCollapsed} />
              <SidebarCategory title="Configurações" items={oficinaBasicaSettingsItems} isCollapsed={isCollapsed} />
            </>
          ) : (
            <>
              <SidebarCategory items={oficinaMainNavItems} isCollapsed={isCollapsed} />
              <SidebarCategory title="Catálogo" items={catalogItems} isCollapsed={isCollapsed} />
              <SidebarCategory title="Engajamento" items={engagementItems} isCollapsed={isCollapsed} />
              <SidebarCategory title="Configurações" items={settingsItems} isCollapsed={isCollapsed} />
            </>
          )}
        </div>
        
        {/* Rodapé do Sidebar com perfil */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex-shrink-0 overflow-hidden flex items-center justify-center relative">
              <Image 
                src="/images/avatar-placeholder.jpg" 
                alt="Usuário" 
                width={40} 
                height={40}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <UserCircleIcon className="h-6 w-6 text-white" />
            </div>
            
            {!isCollapsed && (
              <div>
                <div className="font-medium text-white">
                  {currentUserType === 'motorista' ? 'Bruno Silva' : 'Carlos Oliveira'}
                </div>
                <div className="text-xs text-white/70 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                  Online
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
      
      {/* Overlay para dispositivos móveis */}
      <div>
        {/* Implementar versão mobile futuramente */}
      </div>
    </>
  );
} 