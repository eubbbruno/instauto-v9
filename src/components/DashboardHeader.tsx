"use client";

import { 
  UserCircleIcon, 
  MagnifyingGlassIcon, 
  ChevronDownIcon, 
  Bars3Icon,
  XMarkIcon,
  ChatBubbleLeftEllipsisIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  UserIcon
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import NotificacaoIndicador from "./NotificacaoIndicador";
import { useNotificacoes } from "@/contexts/NotificacaoContext";

type DashboardHeaderProps = {
  title: string;
  onToggleSidebar?: () => void;
};

export default function DashboardHeader({
  title,
  onToggleSidebar,
}: DashboardHeaderProps) {
  const { user, logout } = useAuth();
  const { notificacoes, marcarComoLida, marcarTodasComoLidas } = useNotificacoes();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Fecha os dropdowns quando clicar fora deles
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // Foca no input de busca quando abrir
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);
  
  const dropdownAnimation = {
    hidden: { opacity: 0, y: -5, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        duration: 0.3,
        staggerChildren: 0.05
      }
    },
    exit: { 
      opacity: 0, 
      y: -5, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  // Determinar tipo de usuário e ajustar links
  const isMotorista = user?.type === 'motorista';
  const perfilLink = isMotorista ? '/motorista/perfil' : '/oficina-basica/perfil';
  const configuracoesLink = isMotorista ? '/motorista/configuracoes' : '/oficina-basica/configuracoes';
  const suporteLink = isMotorista ? '/motorista/suporte' : '/oficina-basica/suporte';

  // Nome do usuário (primeiro nome)
  const userName = user?.name?.split(' ')[0] || 'Usuário';
  const userRole = isMotorista ? 'Motorista' : ((user as { businessName?: string })?.businessName || 'Oficina');

  return (
    <header className="bg-gradient-to-r from-[#0047CC] to-[#0055EB] shadow-md p-4 sticky top-0 z-30">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex justify-between items-center">
          {/* Esquerda - Título e menu mobile */}
          <div className="flex items-center">
            <button 
              className="md:hidden p-2 mr-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
              onClick={onToggleSidebar}
              aria-label="Abrir menu lateral"
            >
              <Bars3Icon className="h-6 w-6 text-white" />
            </button>
            
            <div className="pl-0">
              <h1 className="text-xl font-bold font-syne text-white">{title}</h1>
              <p className="text-sm text-white/80 hidden sm:block">Bem-vindo ao seu painel de controle</p>
            </div>
          </div>
          
          {/* Direita - Busca, notificações e perfil */}
          <div className="flex items-center space-x-3 md:space-x-5 pr-0">
            {/* Botão de busca em telas pequenas */}
            <button 
              className="md:hidden p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Buscar"
            >
              {showSearch ? (
                <XMarkIcon className="h-6 w-6 text-white" />
              ) : (
                <MagnifyingGlassIcon className="h-6 w-6 text-white" />
              )}
            </button>
            
            {/* Campo de busca em telas maiores */}
            <div className="hidden md:flex items-center relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-[#0047CC]/70" />
                </div>
                <input 
                  type="text" 
                  placeholder="Buscar..." 
                  className="bg-white border-none rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFDE59] transition-all w-40 focus:w-64"
                />
              </div>
            </div>
            
            {/* Campo de busca para telas pequenas (modal) */}
            <AnimatePresence>
              {showSearch && (
                <motion.div 
                  className="absolute top-0 left-0 right-0 bg-[#0047CC] p-4 md:hidden z-50 border-b border-[#0055EB] shadow-md"
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative">
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Buscar..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg pl-10 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFDE59] text-white"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-white/70" />
                    </div>
                    <button
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/70 hover:text-white"
                      onClick={() => setShowSearch(false)}
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Ícone de Chat */}
            <Link href="/mensagens" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors relative">
              <ChatBubbleLeftEllipsisIcon className="h-6 w-6 text-white" />
              <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 flex items-center justify-center h-5 w-5 rounded-full bg-[#FFDE59] text-[#0047CC] text-xs font-medium">
                3
              </span>
            </Link>
            
            {/* Notificações */}
            <NotificacaoIndicador 
              notificacoes={notificacoes}
              onLerNotificacao={marcarComoLida}
              onLerTodasNotificacoes={marcarTodasComoLidas}
            />
            
            {/* Perfil do usuário */}
            <div className="relative" ref={userMenuRef}>
              <button 
                className="flex items-center space-x-2 rounded-full bg-white/10 hover:bg-white/20 px-2 py-1 transition-colors"
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-label="Menu do usuário"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 overflow-hidden flex items-center justify-center">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserCircleIcon className="h-6 w-6 text-white" />
                  )}
                </div>
                <span className="hidden sm:inline-block font-medium text-white">{userName}</span>
                <ChevronDownIcon className="h-4 w-4 text-white/80" />
              </button>
              
              {/* Dropdown do usuário */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div 
                    className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl overflow-hidden z-50 border border-gray-200"
                    variants={dropdownAnimation}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className="p-4 border-b border-gray-200 bg-gradient-to-br from-[#031023] to-[#0047CC] text-white">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center overflow-hidden">
                          {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <UserCircleIcon className="h-8 w-8 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold">{user?.name || 'Usuário'}</p>
                          <p className="text-sm text-white/80">{userRole}</p>
                        </div>
                      </div>
                      {!isMotorista && (
                        <div className="mt-3 p-2 rounded-lg bg-white/10 text-sm">
                          <div className="flex justify-between items-center">
                            <span>Plano Básico</span>
                            <span className="text-xs bg-[#FFDE59] text-[#0047CC] px-2 py-0.5 rounded-full font-medium">Ativo</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="py-2">
                      <Link 
                        href={perfilLink} 
                        className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <UserCircleIcon className="h-5 w-5 mr-3 text-gray-500" />
                        Meu Perfil
                      </Link>
                      <Link 
                        href={configuracoesLink} 
                        className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <svg className="h-5 w-5 mr-3 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Configurações
                      </Link>
                      <Link 
                        href={suporteLink} 
                        className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <svg className="h-5 w-5 mr-3 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Ajuda e Suporte
                      </Link>
                    </div>
                    <div className="py-2 border-t border-gray-200 bg-gray-50">
                      <button 
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                        }}
                        className="w-full flex items-center px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <svg className="h-5 w-5 mr-3 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
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
    </header>
  );
} 