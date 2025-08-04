"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Notificacao } from '@/components/NotificacaoIndicador';
import { v4 as uuidv4 } from 'uuid';

// Interface para o contexto
interface NotificacaoContextType {
  notificacoes: Notificacao[];
  adicionarNotificacao: (notificacao: Omit<Notificacao, 'id'>) => void;
  removerNotificacao: (id: string) => void;
  marcarComoLida: (id: string) => void;
  marcarTodasComoLidas: () => void;
  limparNotificacoes: () => void;
}

// Criação do contexto
const NotificacaoContext = createContext<NotificacaoContextType | undefined>(undefined);

// Hook personalizado para usar o contexto
export const useNotificacoes = () => {
  const context = useContext(NotificacaoContext);
  if (context === undefined) {
    throw new Error('useNotificacoes deve ser usado dentro de um NotificacaoProvider');
  }
  return context;
};

// Propriedades do Provider
interface NotificacaoProviderProps {
  children: ReactNode;
}

// Chave para o localStorage
const STORAGE_KEY = 'instauto_notificacoes';

// Componente Provider
export function NotificacaoProvider({ children }: NotificacaoProviderProps) {
  // Estado das notificações
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  
  // Carregar notificações do localStorage na inicialização
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const salvas = localStorage.getItem(STORAGE_KEY);
      if (salvas) {
        try {
          setNotificacoes(JSON.parse(salvas));
        } catch (error) {
          console.error('Erro ao carregar notificações:', error);
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    }
  }, []);
  
  // Salvar notificações no localStorage quando o estado mudar
  useEffect(() => {
    if (typeof window !== 'undefined' && notificacoes.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notificacoes));
    }
  }, [notificacoes]);
  
  // Adicionar uma nova notificação
  const adicionarNotificacao = (notificacao: Omit<Notificacao, 'id'>) => {
    const novaNotificacao: Notificacao = {
      ...notificacao,
      id: uuidv4(),
      lida: false,
    };
    
    setNotificacoes(prev => [novaNotificacao, ...prev]);
    
    // Retornar o ID da notificação criada (útil para referência)
    return novaNotificacao.id;
  };
  
  // Remover uma notificação
  const removerNotificacao = (id: string) => {
    setNotificacoes(prev => prev.filter(n => n.id !== id));
  };
  
  // Marcar uma notificação como lida
  const marcarComoLida = (id: string) => {
    setNotificacoes(prev => prev.map(n => 
      n.id === id ? { ...n, lida: true } : n
    ));
  };
  
  // Marcar todas as notificações como lidas
  const marcarTodasComoLidas = () => {
    setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })));
  };
  
  // Limpar todas as notificações
  const limparNotificacoes = () => {
    setNotificacoes([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };
  
  const value = {
    notificacoes,
    adicionarNotificacao,
    removerNotificacao,
    marcarComoLida,
    marcarTodasComoLidas,
    limparNotificacoes,
  };
  
  return (
    <NotificacaoContext.Provider value={value}>
      {children}
    </NotificacaoContext.Provider>
  );
} 