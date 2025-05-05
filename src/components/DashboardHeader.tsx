"use client";

import { BellIcon, UserIcon, MagnifyingGlassIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useState, useRef, useEffect } from "react";

type DashboardHeaderProps = {
  title: string;
  onToggleSidebar?: () => void;
  notificationCount?: number;
};

export default function DashboardHeader({
  title,
  onToggleSidebar,
  notificationCount = 0,
}: DashboardHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // Fecha os dropdowns quando clicar fora deles
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const notificationItems = [
    {
      id: 1,
      title: "Nova ordem de serviço",
      message: "João Silva acabou de solicitar um orçamento",
      time: "5 min atrás",
      read: false,
    },
    {
      id: 2,
      title: "Manutenção agendada",
      message: "Lembrete: Manutenção de Maria às 14h",
      time: "1 hora atrás",
      read: false,
    },
    {
      id: 3,
      title: "Nova avaliação",
      message: "Pedro deu 5 estrelas para seu serviço",
      time: "Ontem",
      read: true,
    }
  ];
  
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-30">
      <div className="flex items-center">
        <button 
          className="md:hidden p-2 mr-2 rounded-md hover:bg-gray-100 transition-colors"
          onClick={onToggleSidebar}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      
      <div className="hidden md:flex items-center relative bg-gray-100 px-3 py-2 rounded-lg">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 mr-2" />
        <input 
          type="text" 
          placeholder="Buscar..." 
          className="bg-transparent border-none outline-none text-gray-700 w-64"
        />
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative" ref={notificationsRef}>
          <button 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <BellIcon className="h-6 w-6 text-gray-600" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
          
          {/* Dropdown de notificações */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-200 animate-fade-in">
              <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold">Notificações</h3>
                <button className="text-blue text-sm hover:underline">Marcar todas como lidas</button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notificationItems.map((item) => (
                  <div key={item.id} className={`p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${!item.read ? 'bg-blue-light/20' : ''}`}>
                    <div className="flex justify-between">
                      <p className="font-medium text-gray-800">{item.title}</p>
                      <span className="text-xs text-gray-500">{item.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{item.message}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-gray-200 text-center">
                <button className="text-blue hover:underline text-sm">Ver todas notificações</button>
              </div>
            </div>
          )}
        </div>
        
        <div className="relative" ref={userMenuRef}>
          <button 
            className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">
              <UserIcon className="h-5 w-5 text-gray-600" />
            </div>
            <span className="hidden sm:inline-block font-medium">Carlos</span>
            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
          </button>
          
          {/* Dropdown do usuário */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-200 animate-fade-in">
              <div className="p-3 border-b border-gray-200 text-center">
                <p className="font-semibold">Carlos Oliveira</p>
                <p className="text-sm text-gray-600">Administrador</p>
              </div>
              <div className="py-1">
                <a href="/dashboard/perfil" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors">
                  Meu Perfil
                </a>
                <a href="/dashboard/configuracoes" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors">
                  Configurações
                </a>
                <a href="/suporte" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors">
                  Ajuda e Suporte
                </a>
              </div>
              <div className="py-1 border-t border-gray-200">
                <a href="/sair" className="block px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors">
                  Sair
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 