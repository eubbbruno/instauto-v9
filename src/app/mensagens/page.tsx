'use client';

import { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  ChatBubbleLeftRightIcon,
  BuildingStorefrontIcon,
  UserCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import GlobalHeader from '@/components/GlobalHeader';

interface ContatoChat {
  id: string;
  nome: string;
  avatar?: string;
  tipo: 'oficina' | 'motorista';
  online: boolean;
  ultimaMensagem?: {
    texto: string;
    dataHora: string;
    remetente: string;
  };
  naoLidas: number;
}

export default function MensagensPage() {
  const [buscaContato, setBuscaContato] = useState('');
  const [contatoAtivo, setContatoAtivo] = useState<string | null>(null);
  const [mostrarChat, setMostrarChat] = useState(false);
  
  const contatos: ContatoChat[] = [
    {
      id: '1',
      nome: 'Auto Center Silva',
      avatar: '',
      tipo: 'oficina',
      online: true,
      ultimaMensagem: {
        texto: 'Seu agendamento foi confirmado para amanhã às 14h',
        dataHora: new Date().toISOString(),
        remetente: 'oficina'
      },
      naoLidas: 2
    },
    {
      id: '2',
      nome: 'Mecânica do João',
      avatar: '',
      tipo: 'oficina',
      online: false,
      ultimaMensagem: {
        texto: 'Orçamento aprovado. Iniciando os reparos.',
        dataHora: new Date(Date.now() - 3600000).toISOString(),
        remetente: 'oficina'
      },
      naoLidas: 0
    }
  ];

  const contatosFiltrados = contatos.filter(contato =>
    contato.nome.toLowerCase().includes(buscaContato.toLowerCase())
  );

  const formatarHorario = (dataHora: string) => {
    const data = new Date(dataHora);
    const agora = new Date();
    const diferenca = agora.getTime() - data.getTime();
    const minutos = Math.floor(diferenca / 60000);
    const horas = Math.floor(diferenca / 3600000);
    
    if (minutos < 1) return 'agora';
    if (minutos < 60) return `${minutos}m`;
    if (horas < 24) return `${horas}h`;
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const handleContatoClick = (contatoId: string) => {
    setContatoAtivo(contatoId);
    setMostrarChat(true);
  };

  const voltarParaLista = () => {
    setMostrarChat(false);
    setContatoAtivo(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-safe">
      <GlobalHeader 
        title="Central de Mensagens"
        showSearch={true}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
        <div className="mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Mensagens</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Comunique-se com oficinas e motoristas</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ height: 'calc(100dvh - 160px)' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 h-full">
            {/* Lista de Contatos */}
            <div className={`${
              mostrarChat ? 'hidden md:flex' : 'flex'
            } bg-white md:col-span-1 border-r border-gray-200 h-full flex-col`}>
              {/* Busca */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar contato..."
                    className="w-full rounded-lg pl-10 pr-4 py-3 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation min-h-[48px]"
                    value={buscaContato}
                    onChange={(e) => setBuscaContato(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              
              {/* Lista */}
              <div className="flex-1 overflow-y-auto">
                {contatosFiltrados.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {contatosFiltrados.map((contato) => (
                      <div
                        key={contato.id}
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors touch-manipulation min-h-[80px] active:bg-gray-100 ${
                          contatoAtivo === contato.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                        }`}
                        onClick={() => handleContatoClick(contato.id)}
                      >
                        <div className="flex items-center">
                          <div className="relative mr-3">
                            {contato.avatar ? (
                              <img
                                src={contato.avatar}
                                alt={contato.nome}
                                className="w-14 h-14 md:w-12 md:h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-14 h-14 md:w-12 md:h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                {contato.tipo === 'oficina' ? (
                                  <BuildingStorefrontIcon className="h-7 w-7 md:h-6 md:w-6 text-gray-500" />
                                ) : (
                                  <UserCircleIcon className="h-7 w-7 md:h-6 md:w-6 text-gray-500" />
                                )}
                              </div>
                            )}
                            {contato.online && (
                              <span className="absolute bottom-0 right-0 w-4 h-4 md:w-3 md:h-3 bg-green-500 rounded-full border-2 border-white ring-2 ring-white"></span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h3 className="font-semibold text-gray-900 truncate text-base md:text-sm pr-2">
                                {contato.nome}
                              </h3>
                              <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                                {contato.ultimaMensagem && (
                                  <span className="text-xs text-gray-500 whitespace-nowrap">
                                    {formatarHorario(contato.ultimaMensagem.dataHora)}
                                  </span>
                                )}
                                {contato.naoLidas > 0 && (
                                  <span className="bg-blue-600 text-white text-xs font-bold rounded-full h-6 min-w-[24px] flex items-center justify-center px-1.5">
                                    {contato.naoLidas}
                                  </span>
                                )}
                              </div>
                            </div>
                            {contato.ultimaMensagem && (
                              <p className={`text-sm truncate mt-1 pr-2 ${
                                contato.naoLidas > 0 ? 'font-medium text-gray-900' : 'text-gray-600'
                              }`}>
                                {contato.ultimaMensagem.texto}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-base">Nenhum contato encontrado</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Área do Chat */}
            <div className={`${
              mostrarChat ? 'flex' : 'hidden md:flex'
            } md:col-span-2 h-full flex-col bg-gray-50`}>
              
              {contatoAtivo ? (
                <div className="h-full flex flex-col">
                  {/* Header do Chat Mobile */}
                  <div className="p-4 bg-white border-b border-gray-200 flex items-center gap-3 md:hidden">
                    <button
                      onClick={voltarParaLista}
                      className="p-2 hover:bg-gray-100 rounded-full touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center active:bg-gray-200"
                    >
                      <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
                    </button>
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <BuildingStorefrontIcon className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {contatos.find(c => c.id === contatoAtivo)?.nome}
                        </h3>
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Online
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Área de Mensagens */}
                  <div className="flex-1 p-6 md:p-8 flex items-center justify-center">
                    <div className="text-center max-w-sm">
                      <div className="mx-auto w-20 h-20 md:w-24 md:h-24 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                        <ChatBubbleLeftRightIcon className="h-10 w-10 md:h-12 md:w-12 text-blue-600" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
                        Chat em Desenvolvimento
                      </h3>
                      <p className="text-gray-600 text-base md:text-lg">
                        Sistema de mensagens em tempo real será implementado em breve
                      </p>
                      <div className="mt-6">
                        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors min-h-[48px] touch-manipulation">
                          Receber Notificação
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Input de Mensagem (Preview) */}
                  <div className="p-4 bg-white border-t border-gray-200">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        placeholder="Digite sua mensagem..."
                        className="flex-1 px-4 py-3 bg-gray-100 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-blue-500 touch-manipulation min-h-[48px]"
                        disabled
                      />
                      <button 
                        className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center disabled:opacity-50 touch-manipulation"
                        disabled
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-6">
                  <div className="text-center max-w-md">
                    <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                      <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-3">Suas conversas</h3>
                    <p className="text-gray-600 text-lg mb-8">
                      Selecione um contato para iniciar uma conversa ou continuar uma conversa existente.
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">
                        💡 <strong>Dica:</strong> Use o chat para tirar dúvidas sobre orçamentos, agendamentos e serviços.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
