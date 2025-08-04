"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  PhoneIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  FaceSmileIcon,
  EllipsisVerticalIcon,
  CheckIcon,
  ClockIcon,
  UserCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { CheckIcon as CheckCheckIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

// Dados mockados para conversas
const mockConversas = [
  {
    id: '1',
    cliente: {
      nome: 'João Silva',
      telefone: '(11) 98765-4321',
      avatar: 'https://ui-avatars.com/api/?name=João+Silva&background=0047CC&color=fff',
      online: true,
      veiculo: 'Honda Civic 2020'
    },
    ultimaMensagem: {
      texto: 'Bom dia! Meu carro está fazendo um barulho estranho no freio. Vocês podem dar uma olhada?',
      horario: '09:15',
      remetente: 'cliente',
      lida: false
    },
    naoLidas: 2,
    mensagens: [
      {
        id: '1',
        texto: 'Bom dia! Tudo bem?',
        horario: '09:10',
        remetente: 'cliente',
        status: 'entregue'
      },
      {
        id: '2',
        texto: 'Bom dia! Meu carro está fazendo um barulho estranho no freio. Vocês podem dar uma olhada?',
        horario: '09:15',
        remetente: 'cliente',
        status: 'entregue'
      },
      {
        id: '3',
        texto: 'Claro! Vamos ajudá-lo. Pode nos descrever melhor o tipo de barulho?',
        horario: '09:18',
        remetente: 'oficina',
        status: 'lida'
      },
      {
        id: '4',
        texto: 'É um barulho meio chiado quando piso no freio, principalmente quando estou parando em baixa velocidade.',
        horario: '09:22',
        remetente: 'cliente',
        status: 'entregue'
      },
      {
        id: '5',
        texto: 'Entendi. Isso pode ser pastilha de freio. Você pode trazer o carro hoje para avaliarmos? Temos um horário livre às 14h.',
        horario: '09:25',
        remetente: 'oficina',
        status: 'entregue'
      }
    ]
  },
  {
    id: '2',
    cliente: {
      nome: 'Maria Santos',
      telefone: '(11) 91234-5678',
      avatar: 'https://ui-avatars.com/api/?name=Maria+Santos&background=28A745&color=fff',
      online: false,
      ultimaVista: '10:30',
      veiculo: 'Toyota Corolla 2019'
    },
    ultimaMensagem: {
      texto: 'Obrigada pelo excelente atendimento! Recomendo vocês! 👏',
      horario: '10:45',
      remetente: 'cliente',
      lida: true
    },
    naoLidas: 0,
    mensagens: [
      {
        id: '1',
        texto: 'Olá! Gostaria de agendar uma revisão para meu Corolla.',
        horario: '10:30',
        remetente: 'cliente',
        status: 'lida'
      },
      {
        id: '2',
        texto: 'Perfeito! Temos disponibilidade para amanhã às 9h. Serve para você?',
        horario: '10:32',
        remetente: 'oficina',
        status: 'lida'
      },
      {
        id: '3',
        texto: 'Sim, perfeito! Confirmo para amanhã às 9h.',
        horario: '10:35',
        remetente: 'cliente',
        status: 'lida'
      },
      {
        id: '4',
        texto: 'Agendamento confirmado! Esperamos você amanhã. 😊',
        horario: '10:36',
        remetente: 'oficina',
        status: 'lida'
      },
      {
        id: '5',
        texto: 'Obrigada pelo excelente atendimento! Recomendo vocês! 👏',
        horario: '10:45',
        remetente: 'cliente',
        status: 'lida'
      }
    ]
  },
  {
    id: '3',
    cliente: {
      nome: 'Carlos Ferreira',
      telefone: '(11) 99887-6543',
      avatar: 'https://ui-avatars.com/api/?name=Carlos+Ferreira&background=FD7E14&color=fff',
      online: true,
      veiculo: 'Ford Ka 2021'
    },
    ultimaMensagem: {
      texto: 'Posso remarcar meu agendamento para 15:00?',
      horario: '08:30',
      remetente: 'cliente',
      lida: false
    },
    naoLidas: 1,
    mensagens: [
      {
        id: '1',
        texto: 'Bom dia! Posso remarcar meu agendamento para 15:00?',
        horario: '08:30',
        remetente: 'cliente',
        status: 'entregue'
      }
    ]
  },
  {
    id: '4',
    cliente: {
      nome: 'Ana Costa',
      telefone: '(11) 95555-1234',
      avatar: 'https://ui-avatars.com/api/?name=Ana+Costa&background=E83E8C&color=fff',
      online: false,
      ultimaVista: 'ontem',
      veiculo: 'Volkswagen Gol 2018'
    },
    ultimaMensagem: {
      texto: 'Vou aprovar o orçamento. Quando vocês podem começar?',
      horario: 'ontem',
      remetente: 'cliente',
      lida: true
    },
    naoLidas: 0,
    mensagens: [
      {
        id: '1',
        texto: 'Recebi o orçamento. Vou analisar e te retorno.',
        horario: 'ontem',
        remetente: 'cliente',
        status: 'lida'
      },
      {
        id: '2',
        texto: 'Vou aprovar o orçamento. Quando vocês podem começar?',
        horario: 'ontem',
        remetente: 'cliente',
        status: 'lida'
      }
    ]
  }
];

export default function MensagensPage() {
  const [conversas, setConversas] = useState(mockConversas);
  const [conversaAtiva, setConversaAtiva] = useState<string | null>(null);
  const [mensagemTexto, setMensagemTexto] = useState('');
  const [busca, setBusca] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const mensagensRef = useRef<HTMLDivElement>(null);

  // Detectar se é mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto scroll para última mensagem
  useEffect(() => {
    if (mensagensRef.current) {
      mensagensRef.current.scrollTop = mensagensRef.current.scrollHeight;
    }
  }, [conversaAtiva]);

  const conversaAtual = conversas.find(c => c.id === conversaAtiva);

  const enviarMensagem = () => {
    if (!mensagemTexto.trim() || !conversaAtiva) return;

    const novaMensagem = {
      id: Date.now().toString(),
      texto: mensagemTexto,
      horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      remetente: 'oficina' as const,
      status: 'enviada' as const
    };

    setConversas(prev => prev.map(conversa => {
      if (conversa.id === conversaAtiva) {
        return {
          ...conversa,
          mensagens: [...conversa.mensagens, novaMensagem],
          ultimaMensagem: {
            texto: mensagemTexto,
            horario: novaMensagem.horario,
            remetente: 'oficina',
            lida: true
          }
        };
      }
      return conversa;
    }));

    setMensagemTexto('');
    
    // Simular status de entrega
    setTimeout(() => {
      setConversas(prev => prev.map(conversa => {
        if (conversa.id === conversaAtiva) {
          return {
            ...conversa,
            mensagens: conversa.mensagens.map(msg => 
              msg.id === novaMensagem.id ? { ...msg, status: 'entregue' } : msg
            )
          };
        }
        return conversa;
      }));
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'enviada':
        return <ClockIcon className="h-4 w-4 text-gray-400" />;
      case 'entregue':
        return <CheckIcon className="h-4 w-4 text-gray-400" />;
      case 'lida':
        return <CheckCheckIcon className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const conversasFiltradas = conversas.filter(conversa =>
    conversa.cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
    conversa.cliente.telefone.includes(busca) ||
    conversa.ultimaMensagem.texto.toLowerCase().includes(busca.toLowerCase())
  );

  const totalNaoLidas = conversas.reduce((total, conversa) => total + conversa.naoLidas, 0);

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link href="/oficina-basica" className="mr-4 md:hidden">
                <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Central de Mensagens</h1>
                <p className="text-gray-600">
                  {totalNaoLidas > 0 ? `${totalNaoLidas} mensagem${totalNaoLidas > 1 ? 's' : ''} não lida${totalNaoLidas > 1 ? 's' : ''}` : 'Todas as mensagens lidas'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar - Lista de Conversas */}
        <div className={`${isMobile && conversaAtiva ? 'hidden' : ''} w-full md:w-80 bg-white border-r border-gray-200 flex flex-col`}>
          {/* Busca */}
          <div className="p-4 border-b">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar conversas..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
              />
            </div>
          </div>

          {/* Lista de Conversas */}
          <div className="flex-1 overflow-y-auto">
            {conversasFiltradas.map((conversa) => (
              <motion.div
                key={conversa.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  conversaAtiva === conversa.id ? 'bg-blue-50 border-r-2 border-r-[#0047CC]' : ''
                }`}
                onClick={() => setConversaAtiva(conversa.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={conversa.cliente.avatar}
                      alt={conversa.cliente.nome}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    {conversa.cliente.online && (
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate">{conversa.cliente.nome}</h3>
                      <span className="text-xs text-gray-500">{conversa.ultimaMensagem.horario}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conversa.cliente.veiculo}</p>
                    <p className={`text-sm truncate mt-1 ${conversa.naoLidas > 0 ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                      {conversa.ultimaMensagem.texto}
                    </p>
                  </div>
                  
                  {conversa.naoLidas > 0 && (
                    <div className="bg-[#0047CC] text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium">
                      {conversa.naoLidas}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Área do Chat */}
        <div className={`${!conversaAtiva && isMobile ? 'hidden' : ''} flex-1 flex flex-col`}>
          {conversaAtual ? (
            <>
              {/* Header do Chat */}
              <div className="bg-white border-b p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {isMobile && (
                    <button 
                      onClick={() => setConversaAtiva(null)}
                      className="mr-2"
                    >
                      <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
                    </button>
                  )}
                  <img
                    src={conversaAtual.cliente.avatar}
                    alt={conversaAtual.cliente.nome}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{conversaAtual.cliente.nome}</h3>
                    <p className="text-sm text-gray-500">
                      {conversaAtual.cliente.online 
                        ? 'Online agora' 
                        : conversaAtual.cliente.ultimaVista 
                          ? `Visto por último ${conversaAtual.cliente.ultimaVista}`
                          : 'Offline'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <PhoneIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <EllipsisVerticalIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Mensagens */}
              <div 
                ref={mensagensRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
              >
                {conversaAtual.mensagens.map((mensagem) => (
                  <motion.div
                    key={mensagem.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${mensagem.remetente === 'oficina' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      mensagem.remetente === 'oficina'
                        ? 'bg-[#0047CC] text-white'
                        : 'bg-white text-gray-900 border'
                    }`}>
                      <p className="text-sm">{mensagem.texto}</p>
                      <div className={`flex items-center justify-end mt-1 space-x-1 ${
                        mensagem.remetente === 'oficina' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        <span className="text-xs">{mensagem.horario}</span>
                        {mensagem.remetente === 'oficina' && getStatusIcon(mensagem.status)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Campo de Mensagem */}
              <div className="bg-white border-t p-4">
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <PaperClipIcon className="h-5 w-5" />
                  </button>
                  
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={mensagemTexto}
                      onChange={(e) => setMensagemTexto(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && enviarMensagem()}
                      placeholder="Digite sua mensagem..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                    />
                  </div>
                  
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <FaceSmileIcon className="h-5 w-5" />
                  </button>
                  
                  <button
                    onClick={enviarMensagem}
                    disabled={!mensagemTexto.trim()}
                    className="p-2 bg-[#0047CC] text-white rounded-full hover:bg-[#0055EB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Estado vazio */
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <UserCircleIcon className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione uma conversa</h3>
                <p className="text-gray-500">Escolha uma conversa da lista para começar a chatear</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 