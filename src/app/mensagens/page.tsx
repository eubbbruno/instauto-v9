"use client";

import { useState, useEffect } from 'react';
import { 
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';
import ChatComponent, { Mensagem, ContatoChat, MensagemTipo, MensagemStatus } from '@/components/ChatComponent';
import GlobalHeader from '@/components/GlobalHeader';
import { v4 as uuidv4 } from 'uuid';

// Tipos de contato
type TipoContato = 'motorista' | 'oficina';

// Interface de contato
interface Contato extends ContatoChat {
  tipo: TipoContato;
  telefone?: string;
  ultimaMensagem?: {
    texto: string;
    dataHora: string;
    lida: boolean;
  };
  naoLidas: number;
}

// Componente principal
export default function MensagensPage() {
  // Estado para contatos e mensagens
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [mensagens, setMensagens] = useState<Record<string, Mensagem[]>>({});
  const [contatoAtivo, setContatoAtivo] = useState<string | null>(null);
  const [buscaContato, setBuscaContato] = useState('');
  
  // Carregar dados mockados na inicialização
  useEffect(() => {
    // Contatos mockados
    const contatosMock: Contato[] = [
      {
        id: '1',
        nome: 'Oficina do Carlos',
        tipo: 'oficina',
        avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
        online: true,
        telefone: '(11) 98765-4321',
        ultimaMensagem: {
          texto: 'Seu veículo está pronto para retirada!',
          dataHora: '2023-10-19T14:30:00Z',
          lida: false,
        },
        naoLidas: 2
      },
      {
        id: '2',
        nome: 'AutoCenter Express',
        tipo: 'oficina',
        avatar: 'https://images.unsplash.com/photo-1583912086296-be5c9a219713?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
        online: false,
        ultimaVisto: '2023-10-19T12:30:00Z',
        telefone: '(11) 97654-3210',
        ultimaMensagem: {
          texto: 'Quando você pretende trazer o veículo?',
          dataHora: '2023-10-18T16:20:00Z',
          lida: true,
        },
        naoLidas: 0
      },
      {
        id: '3',
        nome: 'Mecânica Rápida',
        tipo: 'oficina',
        online: false,
        ultimaVisto: '2023-10-18T08:15:00Z',
        telefone: '(11) 96543-2109',
        ultimaMensagem: {
          texto: 'Orçamento enviado. Aguardo sua confirmação.',
          dataHora: '2023-10-17T10:10:00Z',
          lida: true,
        },
        naoLidas: 0
      },
    ];
    
    // Mensagens mockadas
    const mensagensMock: Record<string, Mensagem[]> = {
      '1': [
        {
          id: uuidv4(),
          texto: 'Olá! Gostaria de saber se meu carro já está pronto.',
          dataHora: '2023-10-19T13:45:00Z',
          remetente: 'usuario',
          status: 'lida',
          tipo: 'texto',
        },
        {
          id: uuidv4(),
          texto: 'Bom dia! Sim, acabamos de finalizar o serviço. Pode vir buscar a qualquer momento hoje.',
          dataHora: '2023-10-19T13:50:00Z',
          remetente: 'contato',
          status: 'lida',
          tipo: 'texto',
        },
        {
          id: uuidv4(),
          texto: 'Ótimo! Vou passar aí depois do almoço.',
          dataHora: '2023-10-19T13:55:00Z',
          remetente: 'usuario',
          status: 'lida',
          tipo: 'texto',
        },
        {
          id: uuidv4(),
          texto: 'Aqui está a nota fiscal do serviço.',
          dataHora: '2023-10-19T14:10:00Z',
          remetente: 'contato',
          status: 'entregue',
          tipo: 'documento',
          anexoUrl: 'https://example.com/nota-fiscal.pdf',
        },
        {
          id: uuidv4(),
          texto: 'Seu veículo está pronto para retirada!',
          dataHora: '2023-10-19T14:30:00Z',
          remetente: 'contato',
          status: 'entregue',
          tipo: 'texto',
        },
      ],
      '2': [
        {
          id: uuidv4(),
          texto: 'Bom dia! Gostaria de agendar uma revisão para meu veículo.',
          dataHora: '2023-10-18T09:30:00Z',
          remetente: 'usuario',
          status: 'lida',
          tipo: 'texto',
        },
        {
          id: uuidv4(),
          texto: 'Olá! Claro, temos disponibilidade para a próxima semana. Qual o modelo do seu veículo?',
          dataHora: '2023-10-18T09:45:00Z',
          remetente: 'contato',
          status: 'lida',
          tipo: 'texto',
        },
        {
          id: uuidv4(),
          texto: 'É um Honda Civic 2019.',
          dataHora: '2023-10-18T10:00:00Z',
          remetente: 'usuario',
          status: 'lida',
          tipo: 'texto',
        },
        {
          id: uuidv4(),
          texto: 'Perfeito! Temos vaga na terça ou quinta da próxima semana, pela manhã. Qual prefere?',
          dataHora: '2023-10-18T10:15:00Z',
          remetente: 'contato',
          status: 'lida',
          tipo: 'texto',
        },
        {
          id: uuidv4(),
          texto: 'Quinta pela manhã seria ótimo.',
          dataHora: '2023-10-18T15:30:00Z',
          remetente: 'usuario',
          status: 'lida',
          tipo: 'texto',
        },
        {
          id: uuidv4(),
          texto: 'Quando você pretende trazer o veículo?',
          dataHora: '2023-10-18T16:20:00Z',
          remetente: 'contato',
          status: 'lida',
          tipo: 'texto',
        },
      ],
      '3': [
        {
          id: uuidv4(),
          texto: 'Bom dia, queria um orçamento para troca de pastilhas de freio.',
          dataHora: '2023-10-16T09:20:00Z',
          remetente: 'usuario',
          status: 'lida',
          tipo: 'texto',
        },
        {
          id: uuidv4(),
          texto: 'Olá! Posso saber qual é o modelo do seu carro?',
          dataHora: '2023-10-16T09:30:00Z',
          remetente: 'contato',
          status: 'lida',
          tipo: 'texto',
        },
        {
          id: uuidv4(),
          texto: 'É um Hyundai HB20 2020.',
          dataHora: '2023-10-16T09:35:00Z',
          remetente: 'usuario',
          status: 'lida',
          tipo: 'texto',
        },
        {
          id: uuidv4(),
          texto: 'Segue a foto da pastilha atual para referência.',
          dataHora: '2023-10-16T09:36:00Z',
          remetente: 'usuario',
          status: 'lida',
          tipo: 'imagem',
          anexoUrl: 'https://images.unsplash.com/photo-1600259828526-77f8617cedc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        },
        {
          id: uuidv4(),
          texto: 'Obrigado pela informação. Vou preparar o orçamento e te envio em breve.',
          dataHora: '2023-10-16T09:45:00Z',
          remetente: 'contato',
          status: 'lida',
          tipo: 'texto',
        },
        {
          id: uuidv4(),
          texto: 'Orçamento enviado. Aguardo sua confirmação.',
          dataHora: '2023-10-17T10:10:00Z',
          remetente: 'contato',
          status: 'lida',
          tipo: 'documento',
          anexoUrl: 'https://example.com/orcamento.pdf',
        },
      ],
    };
    
    setContatos(contatosMock);
    setMensagens(mensagensMock);
    setContatoAtivo('1'); // Selecionar o primeiro contato por padrão
  }, []);
  
  // Filtrar contatos com base na busca
  const contatosFiltrados = contatos.filter(contato => 
    contato.nome.toLowerCase().includes(buscaContato.toLowerCase()) ||
    (contato.telefone && contato.telefone.includes(buscaContato))
  );
  
  // Manipulador para enviar mensagem
  const enviarMensagem = (texto: string, tipo: MensagemTipo, anexo?: File) => {
    if (!contatoAtivo) return;
    
    // Em um app real, aqui enviaria para o backend
    // Simular envio com timeout
    const novaMensagem: Mensagem = {
      id: uuidv4(),
      texto,
      dataHora: new Date().toISOString(),
      remetente: 'usuario',
      status: 'enviada',
      tipo,
      anexoUrl: anexo ? URL.createObjectURL(anexo) : undefined,
    };
    
    // Atualizar estado de mensagens
    setMensagens(prev => ({
      ...prev,
      [contatoAtivo]: [...(prev[contatoAtivo] || []), novaMensagem],
    }));
    
    // Simular mudança de status
    setTimeout(() => {
      setMensagens(prev => ({
        ...prev,
        [contatoAtivo]: prev[contatoAtivo].map(m => 
          m.id === novaMensagem.id ? { ...m, status: 'entregue' as MensagemStatus } : m
        ),
      }));
      
      // Simular resposta em 2-5 segundos
      if (Math.random() > 0.3) {
        const delay = 2000 + Math.random() * 3000;
        setTimeout(() => {
          const resposta: Mensagem = {
            id: uuidv4(),
            texto: 'Obrigado pela sua mensagem! Retornaremos em breve.',
            dataHora: new Date(Date.now() + delay).toISOString(),
            remetente: 'contato',
            status: 'enviada',
            tipo: 'texto',
          };
          
          setMensagens(prev => ({
            ...prev,
            [contatoAtivo]: [...prev[contatoAtivo], resposta],
          }));
        }, delay);
      }
    }, 1000);
  };
  
  // Manipulador para marcar mensagem como lida
  const marcarComoLida = (mensagemId: string) => {
    if (!contatoAtivo) return;
    
    setMensagens(prev => ({
      ...prev,
      [contatoAtivo]: prev[contatoAtivo].map(m => 
        m.id === mensagemId ? { ...m, status: 'lida' } : m
      ),
    }));
    
    // Atualizar contatos
    setContatos(prev => prev.map(c => 
      c.id === contatoAtivo ? { ...c, naoLidas: 0 } : c
    ));
  };
  
  // Manipulador para evento de digitação
  const notificarDigitando = () => {
    // Em um app real, enviaria via websocket
    console.log('Digitando...');
  };
  
  // Formatar horário para exibição na lista de contatos
  const formatarHorario = (dataHora: string) => {
    const data = new Date(dataHora);
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(hoje.getDate() - 1);
    
    // Se for hoje, mostrar apenas a hora
    if (data.toDateString() === hoje.toDateString()) {
      return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }
    
    // Se for ontem, mostrar "Ontem"
    if (data.toDateString() === ontem.toDateString()) {
      return 'Ontem';
    }
    
    // Caso contrário, mostrar a data
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalHeader 
        title="Central de Mensagens"
        showSearch={true}
      />
      
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Mensagens</h1>
          <p className="text-gray-600">Comunique-se com oficinas e motoristas</p>
        </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[70vh]">
        {/* Lista de contatos */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden md:col-span-1 border h-full flex flex-col">
          {/* Barra de busca */}
          <div className="p-3 border-b">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar contato..."
                className="w-full rounded-lg pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                value={buscaContato}
                onChange={(e) => setBuscaContato(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          
          {/* Lista de contatos */}
          <div className="flex-1 overflow-y-auto">
            {contatosFiltrados.length > 0 ? (
              <div className="divide-y">
                {contatosFiltrados.map((contato) => (
                  <div
                    key={contato.id}
                    className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                      contatoAtivo === contato.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setContatoAtivo(contato.id)}
                  >
                    <div className="flex items-center">
                      <div className="relative mr-3">
                        {contato.avatar ? (
                          <img
                            src={contato.avatar}
                            alt={contato.nome}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            {contato.tipo === 'oficina' ? (
                              <BuildingStorefrontIcon className="h-6 w-6 text-gray-500" />
                            ) : (
                              <UserCircleIcon className="h-6 w-6 text-gray-500" />
                            )}
                          </div>
                        )}
                        {contato.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-gray-900 truncate">{contato.nome}</h3>
                          {contato.ultimaMensagem && (
                            <span className="text-xs text-gray-500">
                              {formatarHorario(contato.ultimaMensagem.dataHora)}
                            </span>
                          )}
                        </div>
                        {contato.ultimaMensagem && (
                          <p className={`text-sm truncate ${
                            contato.naoLidas > 0 ? 'font-medium text-gray-900' : 'text-gray-500'
                          }`}>
                            {contato.ultimaMensagem.texto}
                          </p>
                        )}
                      </div>
                      {contato.naoLidas > 0 && (
                        <span className="ml-2 bg-[#0047CC] text-white text-xs font-medium rounded-full h-5 min-w-[20px] flex items-center justify-center px-1">
                          {contato.naoLidas}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Nenhum contato encontrado</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Área de chat */}
        <div className="md:col-span-2 h-full">
          {contatoAtivo ? (
            <ChatComponent
              contato={contatos.find(c => c.id === contatoAtivo) as ContatoChat}
              mensagens={mensagens[contatoAtivo] || []}
              usuarioId="usuario-123"
              usuarioNome="João Silva"
              usuarioAvatar="https://randomuser.me/api/portraits/men/32.jpg"
              onEnviarMensagem={enviarMensagem}
              onDigitando={notificarDigitando}
              onVisualizarMensagem={marcarComoLida}
              className="h-full"
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-white rounded-lg shadow-md">
              <div className="text-center p-6">
                <div className="mx-auto w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <ChatBubbleLeftRightIcon className="h-10 w-10 text-[#0047CC]" />
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
  );
} 