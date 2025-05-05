"use client";

import { 
  HomeIcon, 
  WrenchScrewdriverIcon, 
  ClipboardDocumentListIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  StarIcon,
  ChatBubbleBottomCenterTextIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  ArrowLeftOnRectangleIcon,
  UserIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type SidebarItem = {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: number;
};

type SidebarCategoryProps = {
  title?: string;
  items: SidebarItem[];
  isCollapsed: boolean;
};

function SidebarCategory({ title, items, isCollapsed }: SidebarCategoryProps) {
  const pathname = usePathname();
  
  return (
    <div className="mb-6">
      {title && !isCollapsed && (
        <h3 className="text-xs uppercase text-white/60 font-medium px-4 mb-2">{title}</h3>
      )}
      <ul className="space-y-1">
        {items.map((item, i) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={i}>
              <Link 
                href={item.href} 
                className={`group flex items-center px-4 py-3 rounded-md text-sm transition-all duration-300 ${
                  isActive 
                    ? 'bg-white/15 font-medium text-white' 
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className={`${isCollapsed ? 'mx-auto' : 'mr-3'}`}>
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="bg-yellow text-gray-900 rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const mainNavItems: SidebarItem[] = [
  { icon: <HomeIcon className="h-5 w-5" />, label: "Dashboard", href: "/dashboard" },
  { icon: <WrenchScrewdriverIcon className="h-5 w-5" />, label: "Ordens de Serviço", href: "/dashboard/ordens", badge: 3 },
  { icon: <ClipboardDocumentListIcon className="h-5 w-5" />, label: "Diagnóstico", href: "/dashboard/diagnostico" },
  { icon: <CalendarIcon className="h-5 w-5" />, label: "Agendamentos", href: "/dashboard/agendamentos", badge: 2 },
  { icon: <CurrencyDollarIcon className="h-5 w-5" />, label: "Financeiro", href: "/dashboard/financeiro" },
  { icon: <ChartBarIcon className="h-5 w-5" />, label: "Relatórios", href: "/dashboard/relatorios" },
];

const engagementItems: SidebarItem[] = [
  { icon: <StarIcon className="h-5 w-5" />, label: "Avaliações", href: "/dashboard/avaliacoes", badge: 5 },
  { icon: <ChatBubbleBottomCenterTextIcon className="h-5 w-5" />, label: "WhatsApp", href: "/dashboard/whatsapp" },
];

const settingsItems: SidebarItem[] = [
  { icon: <UserIcon className="h-5 w-5" />, label: "Meu Perfil", href: "/dashboard/perfil" },
  { icon: <CogIcon className="h-5 w-5" />, label: "Configurações", href: "/dashboard/configuracoes" },
  { icon: <QuestionMarkCircleIcon className="h-5 w-5" />, label: "Suporte com IA", href: "/dashboard/suporte" },
  { icon: <ArrowLeftOnRectangleIcon className="h-5 w-5" />, label: "Sair", href: "/sair" },
];

export default function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <aside 
      className={`bg-blue min-h-screen fixed left-0 top-0 hidden md:block transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className={`p-4 border-b border-blue-dark flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <Link href="/" className={`block ${isCollapsed ? 'w-10 h-10 overflow-hidden' : ''}`}>
          <div className="text-2xl font-bold text-white">
            {isCollapsed ? 'I' : 'Instauto'}
          </div>
          {!isCollapsed && (
            <div className="text-sm text-white/70">Oficina do Carlos</div>
          )}
        </Link>
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white/70 hover:text-white transition-colors duration-300"
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
      
      <div className="py-6 overflow-y-auto h-[calc(100vh-80px)]">
        <SidebarCategory items={mainNavItems} isCollapsed={isCollapsed} />
        <SidebarCategory title="Engajamento" items={engagementItems} isCollapsed={isCollapsed} />
        <SidebarCategory title="Configurações" items={settingsItems} isCollapsed={isCollapsed} />
      </div>
      
      <div className={`absolute bottom-0 left-0 right-0 p-4 border-t border-blue-dark ${isCollapsed ? 'flex justify-center' : ''}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="w-10 h-10 rounded-full bg-white/30 flex-shrink-0 overflow-hidden flex items-center justify-center">
            <UserIcon className="h-6 w-6 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <div className="font-medium text-white">Carlos Oliveira</div>
              <div className="text-sm text-white/70">Administrador</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
} 