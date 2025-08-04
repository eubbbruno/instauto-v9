"use client";

import { 
  HomeIcon, 
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  TruckIcon,
  ClockIcon
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
                    <span className="flex-1 relative z-10">{item.label}</span>
                    {item.badge && (
                      <span className="relative z-10 bg-[#FFDE59] text-[#0047CC] rounded-full h-5 min-w-5 flex items-center justify-center text-xs font-medium px-1">
                        {item.badge}
                      </span>
                    )}
                    {item.isNew && (
                      <span className="relative z-10 bg-green-500 text-white text-[9px] uppercase font-bold rounded-sm h-4 px-1.5 flex items-center">
                        Novo
                      </span>
                    )}
                  </>
                )}
                
                {/* Badge no modo colapsado */}
                {isCollapsed && item.badge && (
                  <div className="absolute -top-1 -right-1">
                    <span className="bg-[#FFDE59] text-[#0047CC] rounded-full h-5 min-w-5 flex items-center justify-center text-xs font-medium px-1">
                      {item.badge}
                    </span>
                  </div>
                )}
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

const mainNavItems: SidebarItem[] = [
  { icon: <HomeIcon className="h-5 w-5" />, label: "Dashboard", href: "/motorista" },
  { icon: <MagnifyingGlassIcon className="h-5 w-5" />, label: "Buscar Oficinas", href: "/motorista/buscar" },
  { icon: <TruckIcon className="h-5 w-5" />, label: "Minha Garagem", href: "/motorista/garagem" },
  { icon: <ClockIcon className="h-5 w-5" />, label: "Histórico de Manutenções", href: "/motorista/historico" },
];

const settingsItems: SidebarItem[] = [
  { icon: <UserCircleIcon className="h-5 w-5" />, label: "Meu Perfil", href: "/motorista/perfil" },
  { icon: <ArrowRightOnRectangleIcon className="h-5 w-5" />, label: "Sair", href: "/sair" },
];

export default function MotoristaSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
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
        <div className={`p-4 mb-6 flex ${isCollapsed ? 'justify-center' : 'justify-between'} items-center`}>
          <Link href="/" className={`relative ${isCollapsed ? 'w-10 h-10 overflow-hidden' : ''}`}>
            {isCollapsed ? (
              <div className="bg-gradient-to-r from-[#0047CC] to-[#0055EB] rounded-md flex items-center justify-center p-2">
                <div className="text-xl font-bold text-white font-syne">Ia</div>
              </div>
            ) : (
              <Image 
                src="/images/logo.svg" 
                alt="Instauto Logo" 
                width={120} 
                height={32}
                className="h-8 w-auto"
              />
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
        <div className="py-6 overflow-y-auto h-[calc(100vh-80px-80px)] px-2">
          <SidebarCategory items={mainNavItems} isCollapsed={isCollapsed} />
          <SidebarCategory title="Configurações" items={settingsItems} isCollapsed={isCollapsed} />
        </div>
        
        {/* Rodapé do Sidebar com perfil */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex-shrink-0 overflow-hidden flex items-center justify-center relative">
              <Image 
                src="/images/avatar-placeholder.jpg" 
                alt="Ricardo Silva" 
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
                <div className="font-medium text-white">Ricardo Silva</div>
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
      <div className="md:hidden">
        {/* Implementar versão mobile futuramente */}
      </div>
    </>
  );
} 