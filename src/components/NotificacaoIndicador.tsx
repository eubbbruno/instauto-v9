"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BellIcon, 
  EnvelopeIcon, 
  CalendarIcon, 
  StarIcon, 
  WrenchIcon,
  ChevronRightIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

export type Notificacao = {
  id: string;
  titulo: string;
  mensagem: string;
  tempo: string;
  lida: boolean;
  tipo: "servico" | "avaliacao" | "agendamento" | "mensagem" | "sistema";
  link?: string;
};

type NotificacaoIndicadorProps = {
  notificacoes: Notificacao[];
  onLerNotificacao?: (id: string) => void;
  onLerTodasNotificacoes?: () => void;
  className?: string;
};

export default function NotificacaoIndicador({
  notificacoes,
  onLerNotificacao,
  onLerTodasNotificacoes,
  className = ""
}: NotificacaoIndicadorProps) {
  const [mostrarPainel, setMostrarPainel] = useState(false);
  const painelRef = useRef<HTMLDivElement>(null);
  
  // Contador de notificações não lidas
  const naoLidas = notificacoes.filter(n => !n.lida).length;
  
  // Fecha o painel quando clicar fora dele
  useEffect(() => {
    function fecharAoClicarFora(event: MouseEvent) {
      if (painelRef.current && !painelRef.current.contains(event.target as Node)) {
        setMostrarPainel(false);
      }
    }
    
    document.addEventListener("mousedown", fecharAoClicarFora);
    return () => document.removeEventListener("mousedown", fecharAoClicarFora);
  }, []);
  
  // Manipulador de clique em notificação
  const handleNotificacaoClick = (id: string) => {
    if (onLerNotificacao) {
      onLerNotificacao(id);
    }
    // Não fechar o painel ao clicar, para permitir múltiplas interações
  };
  
  // Obter ícone com base no tipo de notificação
  const getIconeNotificacao = (tipo: string) => {
    switch(tipo) {
      case 'servico':
        return <div className="p-2 rounded-full bg-blue-100 text-blue-600"><WrenchIcon className="h-5 w-5" /></div>;
      case 'agendamento':
        return <div className="p-2 rounded-full bg-amber-100 text-amber-600"><CalendarIcon className="h-5 w-5" /></div>;
      case 'avaliacao':
        return <div className="p-2 rounded-full bg-green-100 text-green-600"><StarIcon className="h-5 w-5" /></div>;
      case 'mensagem':
        return <div className="p-2 rounded-full bg-purple-100 text-purple-600"><EnvelopeIcon className="h-5 w-5" /></div>;
      default:
        return <div className="p-2 rounded-full bg-gray-100 text-gray-600"><BellIcon className="h-5 w-5" /></div>;
    }
  };
  
  // Animações
  const painelAnimacao = {
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
  
  const itemAnimacao = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <div className={`relative ${className}`} ref={painelRef}>
      {/* Botão de notificações */}
      <button 
        className="relative p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        onClick={() => setMostrarPainel(!mostrarPainel)}
        aria-label="Notificações"
      >
        <BellIcon className="h-6 w-6 text-white" />
        
        {/* Indicador de notificações não lidas */}
        {naoLidas > 0 && (
          <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 flex items-center justify-center h-5 w-5 rounded-full bg-[#FFDE59] text-[#0047CC] text-xs font-medium">
            {naoLidas > 9 ? '9+' : naoLidas}
          </span>
        )}
      </button>
      
      {/* Painel de notificações */}
      <AnimatePresence>
        {mostrarPainel && (
          <motion.div 
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg overflow-hidden z-50"
            variants={painelAnimacao}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Cabeçalho do painel */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-medium text-gray-800">Notificações</h3>
              
              <div className="flex items-center gap-2">
                {naoLidas > 0 && (
                  <button 
                    className="text-xs text-[#0047CC] hover:underline"
                    onClick={onLerTodasNotificacoes}
                  >
                    Marcar todas como lidas
                  </button>
                )}
                
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setMostrarPainel(false)}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Lista de notificações */}
            <div className="max-h-[400px] overflow-y-auto">
              {notificacoes.length > 0 ? (
                <div>
                  {notificacoes.map((notificacao) => (
                    <motion.div 
                      key={notificacao.id}
                      variants={itemAnimacao}
                      className={`p-4 border-b ${!notificacao.lida ? 'bg-blue-50' : ''} hover:bg-gray-50 transition-colors cursor-pointer`}
                      onClick={() => handleNotificacaoClick(notificacao.id)}
                    >
                      <div className="flex">
                        <div className="mr-3">
                          {getIconeNotificacao(notificacao.tipo)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-gray-800 text-sm">{notificacao.titulo}</h4>
                            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{notificacao.tempo}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{notificacao.mensagem}</p>
                          
                          {notificacao.link && (
                            <Link
                              href={notificacao.link}
                              className="mt-2 text-xs text-[#0047CC] hover:underline inline-flex items-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Ver detalhes
                              <ChevronRightIcon className="h-3 w-3 ml-1" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <BellIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">Você não tem notificações</p>
                </div>
              )}
            </div>
            
            {/* Rodapé do painel */}
            <div className="p-3 bg-gray-50 border-t text-center">
              <Link 
                href="/notificacoes" 
                className="text-sm text-[#0047CC] hover:underline"
                onClick={() => setMostrarPainel(false)}
              >
                Ver todas as notificações
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 