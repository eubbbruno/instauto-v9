"use client";

import { useState, useEffect } from 'react';
import { useNotificacoes } from '@/contexts/NotificacaoContext';
import { Notificacao } from '@/components/NotificacaoIndicador';
import GlobalHeader from '@/components/GlobalHeader';
import { 
  BellIcon,
  EnvelopeIcon,
  CalendarIcon,
  StarIcon,
  WrenchIcon,
  CheckCircleIcon,
  TrashIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotificacoesPage() {
  const { 
    notificacoes, 
    marcarComoLida, 
    marcarTodasComoLidas, 
    removerNotificacao, 
    limparNotificacoes 
  } = useNotificacoes();
  
  const [filtroAtivo, setFiltroAtivo] = useState<string | null>(null);
  const [notificacoesFiltradas, setNotificacoesFiltradas] = useState<Notificacao[]>(notificacoes);
  
  // Aplicar filtro quando notificações ou filtro mudar
  useEffect(() => {
    if (filtroAtivo) {
      setNotificacoesFiltradas(notificacoes.filter(n => n.tipo === filtroAtivo));
    } else {
      setNotificacoesFiltradas(notificacoes);
    }
  }, [notificacoes, filtroAtivo]);
  
  // Lista de filtros disponíveis
  const filtros = [
    { id: 'servico', nome: 'Serviços', icone: <WrenchIcon className="h-5 w-5" /> },
    { id: 'agendamento', nome: 'Agendamentos', icone: <CalendarIcon className="h-5 w-5" /> },
    { id: 'avaliacao', nome: 'Avaliações', icone: <StarIcon className="h-5 w-5" /> },
    { id: 'mensagem', nome: 'Mensagens', icone: <EnvelopeIcon className="h-5 w-5" /> },
    { id: 'sistema', nome: 'Sistema', icone: <BellIcon className="h-5 w-5" /> }
  ];
  
  // Obter ícone com base no tipo de notificação
  const getIconeNotificacao = (tipo: string) => {
    switch(tipo) {
      case 'servico':
        return <div className="p-3 rounded-full bg-blue-100 text-blue-600"><WrenchIcon className="h-5 w-5" /></div>;
      case 'agendamento':
        return <div className="p-3 rounded-full bg-amber-100 text-amber-600"><CalendarIcon className="h-5 w-5" /></div>;
      case 'avaliacao':
        return <div className="p-3 rounded-full bg-green-100 text-green-600"><StarIcon className="h-5 w-5" /></div>;
      case 'mensagem':
        return <div className="p-3 rounded-full bg-purple-100 text-purple-600"><EnvelopeIcon className="h-5 w-5" /></div>;
      default:
        return <div className="p-3 rounded-full bg-gray-100 text-gray-600"><BellIcon className="h-5 w-5" /></div>;
    }
  };
  
  // Função para toggle de filtro
  const toggleFiltro = (filtroId: string) => {
    if (filtroAtivo === filtroId) {
      setFiltroAtivo(null);
    } else {
      setFiltroAtivo(filtroId);
    }
  };
  
  // Remover notificação com confirmação
  const confirmarRemover = (id: string) => {
    if (window.confirm('Deseja realmente remover esta notificação?')) {
      removerNotificacao(id);
    }
  };
  
  // Limpar todas as notificações com confirmação
  const confirmarLimparTodas = () => {
    if (window.confirm('Deseja realmente remover todas as notificações?')) {
      limparNotificacoes();
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalHeader 
        title="Notificações"
        showSearch={true}
      />
      
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Notificações</h1>
          <p className="text-gray-600">Gerencie todas as suas notificações em um só lugar</p>
        </div>
        
        {/* Filtros e ações */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {filtros.map(filtro => (
              <button
                key={filtro.id}
                onClick={() => toggleFiltro(filtro.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filtroAtivo === filtro.id 
                    ? 'bg-[#0047CC] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filtro.icone}
                {filtro.nome}
              </button>
            ))}
            
            {filtroAtivo && (
              <button
                onClick={() => setFiltroAtivo(null)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <ArrowPathIcon className="h-5 w-5" />
                Limpar filtro
              </button>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={marcarTodasComoLidas}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <CheckCircleIcon className="h-5 w-5" />
              Marcar todas como lidas
            </button>
            
            <button
              onClick={confirmarLimparTodas}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
            >
              <TrashIcon className="h-5 w-5" />
              Limpar todas
            </button>
          </div>
        </div>
        
        {/* Lista de notificações */}
        {notificacoesFiltradas.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
            {notificacoesFiltradas.map((notificacao, index) => (
              <motion.div 
                key={notificacao.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 sm:p-6 border-b last:border-b-0 ${!notificacao.lida ? 'bg-blue-50' : ''}`}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="shrink-0">
                    {getIconeNotificacao(notificacao.tipo)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-gray-800">{notificacao.titulo}</h3>
                      <span className="text-sm text-gray-500">{notificacao.tempo}</span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{notificacao.mensagem}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {notificacao.link && (
                        <Link 
                          href={notificacao.link}
                          className="text-sm font-medium text-[#0047CC] hover:underline"
                        >
                          Ver detalhes
                        </Link>
                      )}
                      
                      {!notificacao.lida && (
                        <button
                          onClick={() => marcarComoLida(notificacao.id)}
                          className="text-sm font-medium text-gray-600 hover:text-gray-800"
                        >
                          Marcar como lida
                        </button>
                      )}
                      
                      <button
                        onClick={() => confirmarRemover(notificacao.id)}
                        className="text-sm font-medium text-red-500 hover:text-red-700"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <BellIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              {filtroAtivo ? 'Nenhuma notificação encontrada' : 'Nenhuma notificação'}
            </h3>
            <p className="text-gray-600">
              {filtroAtivo 
                ? 'Não há notificações do tipo selecionado.'
                : 'Você está em dia! Não há notificações pendentes.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 