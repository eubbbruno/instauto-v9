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
    <div className="min-h-screen bg-gray-50">
      <GlobalHeader 
        title="Central de Mensagens"
        showSearch={true}
      />
      
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Mensagens</h1>
          <p className="text-sm md:text-base text-gray-600">Comunique-se com oficinas e motoristas</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden h-[calc(100vh-180px)] md:h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-3 h-full">
            
            <div className={`${
              mostrarChat ? 'hidden md:flex' : 'flex'
            } bg-white md:col-span-1 border-r border-gray-200 h-full flex-col`}>
              
              <div className="p-3 md:p-4 border-b border-gray-200">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar contato..."
                    className="w-full rounded-lg pl-10 pr-4 py-3 md:py-2 text-base md:text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation"
                    value={buscaContato}
                    onChange={(e) => setBuscaContato(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {contatosFiltrados.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {contatosFiltrados.map((contato) => (
                      <div
                        key={contato.id}
                        className={`p-4 md:p-3 hover:bg-gray-50 cursor-pointer transition-colors touch-manipulation min-h-[72px] md:min-h-[60px] ${
                          contatoAtivo === contato.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => handleContatoClick(contato.id)}
                      >
                        <div className="flex items-center">
                          <div className="relative mr-3 md:mr-3">
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
                              <span className="absolute bottom-0 right-0 w-4 h-4 md:w-3 md:h-3 bg-green-500 rounded-full border-2 border-white"></span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium text-gray-900 truncate text-base md:text-sm">{contato.nome}</h3>
                              <div className="flex items-center gap-2 ml-2">
                                {contato.ultimaMensagem && (
                                  <span className="text-xs text-gray-500 whitespace-nowrap">
                                    {formatarHorario(contato.ultimaMensagem.dataHora)}
                                  </span>
                                )}
                                {contato.naoLidas > 0 && (
                                  <span className="bg-blue-600 text-white text-xs font-medium rounded-full h-5 min-w-[20px] flex items-center justify-center px-1">
                                    {contato.naoLidas}
                                  </span>
                                )}
                              </div>
                            </div>
                            {contato.ultimaMensagem && (
                              <p className={`text-sm md:text-xs truncate mt-1 ${
                                contato.naoLidas > 0 ? 'font-medium text-gray-900' : 'text-gray-500'
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
                  <div className="p-6 md:p-4 text-center">
                    <ChatBubbleLeftRightIcon className="h-16 w-16 md:h-12 md:w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-base md:text-sm">Nenhum contato encontrado</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className={`${
              mostrarChat ? 'flex' : 'hidden md:flex'
            } md:col-span-2 h-full flex-col bg-white`}>
              
              {contatoAtivo ? (
                <div className="h-full flex flex-col">
                  <div className="p-4 border-b border-gray-200 md:hidden">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={voltarParaLista}
                        className="p-2 hover:bg-gray-100 rounded-full touch-manipulation"
                      >
                        <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
                      </button>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <BuildingStorefrontIcon className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {contatos.find(c => c.id === contatoAtivo)?.nome}
                          </h3>
                          <p className="text-sm text-gray-500">Online</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-4 md:p-6 flex items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                        <ChatBubbleLeftRightIcon className="h-8 w-8 md:h-10 md:w-10 text-blue-600" />
                      </div>
                      <h3 className="text-lg md:text-xl font-medium text-gray-800 mb-2">Chat em Desenvolvimento</h3>
                      <p className="text-gray-600 text-sm md:text-base max-w-md">
                        Sistema de mensagens será implementado em breve
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="mx-auto w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                      <ChatBubbleLeftRightIcon className="h-10 w-10 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Suas conversas</h3>
                    <p className="text-gray-600 mb-6 max-w-md">
                      Selecione um contato para iniciar uma conversa ou continuar uma conversa existente.
                    </p>
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
