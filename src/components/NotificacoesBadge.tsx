"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BellIcon,
  XMarkIcon,
  CheckIcon,
  TrashIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';
import { BellIcon as BellSolidIcon } from '@heroicons/react/24/solid';
import useNotificacoes from '@/hooks/useNotificacoes';

const NotificacoesBadge = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const {
    notificacoes,
    naoLidas,
    carregando,
    marcarComoLida,
    marcarTodasComoLidas,
    removerNotificacao,
    limparTodas,
    formatarTempo
  } = useNotificacoes();

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIconeNotificacao = (tipo: string) => {
    switch (tipo) {
      case 'agendamento': return '📅';
      case 'mensagem': return '💬';
      case 'promocao': return '🎉';
      case 'avaliacao': return '⭐';
      case 'sistema': return '🔔';
      default: return '📢';
    }
  };

  const getCorNotificacao = (tipo: string) => {
    switch (tipo) {
      case 'agendamento': return 'bg-blue-100 text-blue-800';
      case 'mensagem': return 'bg-green-100 text-green-800';
      case 'promocao': return 'bg-yellow-100 text-yellow-800';
      case 'avaliacao': return 'bg-purple-100 text-purple-800';
      case 'sistema': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (carregando) {
    return (
      <div className="relative">
        <div className="p-2 rounded-full bg-gray-100 animate-pulse">
          <BellIcon className="h-6 w-6 text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botão de notificações */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0047CC]/20"
      >
        {naoLidas > 0 ? (
          <BellSolidIcon className="h-6 w-6 text-[#0047CC]" />
        ) : (
          <BellIcon className="h-6 w-6 text-gray-600" />
        )}
        
        {/* Badge de contagem */}
        {naoLidas > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
          >
            {naoLidas > 99 ? '99+' : naoLidas}
          </motion.div>
        )}
      </button>

      {/* Dropdown de notificações */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Notificações
                </h3>
                <div className="flex items-center space-x-2">
                  {naoLidas > 0 && (
                    <button
                      onClick={marcarTodasComoLidas}
                      className="text-sm text-[#0047CC] hover:text-[#003DA6] font-medium"
                    >
                      Marcar todas como lidas
                    </button>
                  )}
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <EllipsisVerticalIcon className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>
              
              {naoLidas > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  Você tem {naoLidas} {naoLidas === 1 ? 'notificação não lida' : 'notificações não lidas'}
                </p>
              )}
            </div>

            {/* Menu de ações */}
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-b border-gray-100 bg-gray-50"
                >
                  <div className="p-2">
                    <button
                      onClick={() => {
                        limparTodas();
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center"
                    >
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Limpar todas as notificações
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Lista de notificações */}
            <div className="max-h-80 overflow-y-auto">
              {notificacoes.length === 0 ? (
                <div className="p-8 text-center">
                  <BellIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Nenhuma notificação</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notificacoes.map((notificacao) => (
                    <motion.div
                      key={notificacao.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notificacao.lida ? 'bg-blue-50/50' : ''
                      }`}
                      onClick={() => marcarComoLida(notificacao.id)}
                    >
                      <div className="flex items-start space-x-3">
                        {/* Ícone */}
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                          getCorNotificacao(notificacao.tipo)
                        }`}>
                          {getIconeNotificacao(notificacao.tipo)}
                        </div>

                        {/* Conteúdo */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${
                                !notificacao.lida ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {notificacao.titulo}
                              </p>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {notificacao.conteudo}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {formatarTempo(notificacao.criadaEm)}
                              </p>
                            </div>

                            {/* Ações */}
                            <div className="flex items-center space-x-1 ml-2">
                              {!notificacao.lida && (
                                <div className="w-2 h-2 bg-[#0047CC] rounded-full"></div>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removerNotificacao(notificacao.id);
                                }}
                                className="p-1 hover:bg-gray-200 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <XMarkIcon className="h-3 w-3 text-gray-500" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notificacoes.length > 0 && (
              <div className="p-3 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-sm text-[#0047CC] hover:text-[#003DA6] font-medium"
                >
                  Ver todas as notificações
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificacoesBadge; 