"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  MagnifyingGlassIcon, 
  PaperAirplaneIcon,
  PhoneIcon,
  UserCircleIcon,
  PlusIcon,
  FaceSmileIcon,
  PaperClipIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  EllipsisHorizontalIcon,
  PhotoIcon,
  DocumentIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  TagIcon,
  Bars3BottomLeftIcon
} from "@heroicons/react/24/outline";

// Tipos para o chat
type MessageStatus = 'enviada' | 'entregue' | 'lida' | 'pendente';
type MessageType = 'texto' | 'imagem' | 'documento' | 'localizacao' | 'contato';

type Message = {
  id: string;
  text: string;
  timestamp: string;
  sender: 'user' | 'client';
  status: MessageStatus;
  type: MessageType;
  attachmentUrl?: string;
  metadata?: any;
};

type Contact = {
  id: string;
  name: string;
  phoneNumber: string;
  profilePic?: string;
  lastMessage?: {
    text: string;
    timestamp: string;
    status: MessageStatus;
    isUnread: boolean;
  };
  tags?: string[];
  isOnline?: boolean;
  lastSeen?: string;
  isTyping?: boolean;
  unreadCount: number;
};

// Dados mockados para contatos
const mockContacts: Contact[] = [
  {
    id: "C-001",
    name: "João Silva",
    phoneNumber: "+55 11 98765-4321",
    profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
    lastMessage: {
      text: "Obrigado pelo orçamento! Vou confirmar amanhã.",
      timestamp: "2023-10-19T14:30:00Z",
      status: "lida",
      isUnread: false
    },
    tags: ["cliente ativo", "revisão", "orçamento"],
    isOnline: true,
    unreadCount: 0
  },
  {
    id: "C-002",
    name: "Maria Oliveira",
    phoneNumber: "+55 11 97654-3210",
    profilePic: "https://randomuser.me/api/portraits/women/1.jpg",
    lastMessage: {
      text: "Quando meu carro estará pronto?",
      timestamp: "2023-10-19T13:45:00Z",
      status: "entregue",
      isUnread: true
    },
    isOnline: false,
    lastSeen: "2023-10-19T12:30:00Z",
    unreadCount: 2
  },
  {
    id: "C-003",
    name: "Pedro Santos",
    phoneNumber: "+55 11 96543-2109",
    lastMessage: {
      text: "Preciso agendar uma revisão para semana que vem.",
      timestamp: "2023-10-18T16:20:00Z",
      status: "lida",
      isUnread: false
    },
    tags: ["agendamento", "revisão"],
    isOnline: false,
    lastSeen: "2023-10-19T09:15:00Z",
    unreadCount: 0
  },
  {
    id: "C-004",
    name: "Ana Costa",
    phoneNumber: "+55 11 95432-1098",
    profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
    lastMessage: {
      text: "A peça chegou? Estou aguardando o conserto do meu veículo.",
      timestamp: "2023-10-17T10:10:00Z",
      status: "lida",
      isUnread: false
    },
    isOnline: false,
    lastSeen: "2023-10-18T20:45:00Z",
    unreadCount: 0
  },
  {
    id: "C-005",
    name: "Carlos Mendes",
    phoneNumber: "+55 11 94321-0987",
    profilePic: "https://randomuser.me/api/portraits/men/2.jpg",
    lastMessage: {
      text: "Você enviou uma localização",
      timestamp: "2023-10-16T15:30:00Z",
      status: "lida",
      isUnread: false
    },
    tags: ["cliente novo", "orçamento"],
    isOnline: true,
    unreadCount: 0
  }
];

// Dados mockados para mensagens
const mockMessages: Record<string, Message[]> = {
  "C-001": [
    {
      id: "msg-001",
      text: "Olá João, segue o orçamento para a revisão do seu Civic conforme conversamos. O valor total ficou em R$ 560,00 incluindo peças e mão de obra.",
      timestamp: "2023-10-19T14:15:00Z",
      sender: "user",
      status: "lida",
      type: "texto"
    },
    {
      id: "msg-002",
      text: "Também estamos com uma promoção de 10% de desconto para agendamentos feitos até sexta-feira.",
      timestamp: "2023-10-19T14:16:00Z",
      sender: "user",
      status: "lida",
      type: "texto"
    },
    {
      id: "msg-003",
      text: "Obrigado pelo orçamento! Vou confirmar amanhã.",
      timestamp: "2023-10-19T14:30:00Z",
      sender: "client",
      status: "lida",
      type: "texto"
    }
  ],
  "C-002": [
    {
      id: "msg-004",
      text: "Bom dia, gostaria de saber quando meu carro estará pronto?",
      timestamp: "2023-10-19T09:30:00Z",
      sender: "client",
      status: "lida",
      type: "texto"
    },
    {
      id: "msg-005",
      text: "Bom dia Maria! Estamos finalizando a troca dos freios, seu carro estará pronto até as 15h de hoje.",
      timestamp: "2023-10-19T09:45:00Z",
      sender: "user",
      status: "entregue",
      type: "texto"
    },
    {
      id: "msg-006",
      text: "Quando meu carro estará pronto?",
      timestamp: "2023-10-19T13:45:00Z",
      sender: "client",
      status: "entregue",
      type: "texto"
    }
  ]
};

// Templates de mensagens rápidas
const quickReplies = [
  {
    id: "qr1",
    title: "Confirmação de Agendamento",
    text: "Olá! Confirmamos seu agendamento para o dia {data} às {hora}. Por favor, chegue com 15 minutos de antecedência. Qualquer dúvida estamos à disposição."
  },
  {
    id: "qr2",
    title: "Veículo Pronto",
    text: "Olá! Seu veículo já está pronto e disponível para retirada. Nosso horário de funcionamento é de segunda a sexta das 8h às 18h e sábados das 8h às 13h."
  },
  {
    id: "qr3",
    title: "Solicitação de Feedback",
    text: "Olá! Gostaríamos de saber como foi sua experiência com nossos serviços. Sua opinião é muito importante para nós. Poderia nos avaliar respondendo a esta mensagem? Agradecemos a preferência!"
  }
];

export default function WhatsAppPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState<Contact[]>(mockContacts);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Filtrar contatos pela busca
  const filteredContacts = conversations.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phoneNumber.includes(searchTerm)
  );
  
  // Carregar mensagens quando um contato é selecionado
  useEffect(() => {
    if (currentContact) {
      setIsLoading(true);
      
      // Simulando carregamento de mensagens
      setTimeout(() => {
        setMessages(mockMessages[currentContact.id] || []);
        setIsLoading(false);
      }, 500);
    }
  }, [currentContact]);
  
  // Rolar para a última mensagem
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  // Enviar mensagem
  const sendMessage = () => {
    if (!message.trim() || !currentContact) return;
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      text: message,
      timestamp: new Date().toISOString(),
      sender: "user",
      status: "enviada",
      type: "texto"
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage("");
    
    // Atualizar última mensagem do contato
    setConversations(prev => 
      prev.map(contact => 
        contact.id === currentContact.id 
          ? {
              ...contact,
              lastMessage: {
                text: message,
                timestamp: new Date().toISOString(),
                status: "enviada",
                isUnread: false
              }
            }
          : contact
      )
    );
    
    // Simular resposta após 2 segundos
    setTimeout(() => {
      // Atualizar status da mensagem para "entregue"
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: "entregue" as MessageStatus }
            : msg
        )
      );
    }, 1000);
  };
  
  // Selecionar resposta rápida
  const selectQuickReply = (text: string) => {
    setMessage(text);
    setShowQuickReplies(false);
  };
  
  // Formatação de data
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatConversationTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
    }
  };
  
  // Status da mensagem
  const renderMessageStatus = (status: MessageStatus) => {
    switch (status) {
      case 'enviada':
        return <CheckCircleIcon className="h-4 w-4 text-gray-400" />;
      case 'entregue':
        return <div className="flex"><CheckCircleIcon className="h-4 w-4 text-blue-500" /><CheckCircleIcon className="h-4 w-4 text-blue-500 -ml-2" /></div>;
      case 'lida':
        return <div className="flex"><CheckCircleIcon className="h-4 w-4 text-green-500" /><CheckCircleIcon className="h-4 w-4 text-green-500 -ml-2" /></div>;
      case 'pendente':
        return <ClockIcon className="h-4 w-4 text-gray-400" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="p-0 bg-gray-50 min-h-screen flex flex-col">
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <h1 className="text-xl font-bold text-gray-800">WhatsApp Business</h1>
        <p className="text-gray-500 text-sm">Gerencie suas conversas com clientes</p>
      </div>
      
      <div className="flex flex-1 h-[calc(100vh-140px)]">
        {/* Lista de conversas */}
        <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 bg-white overflow-hidden flex flex-col">
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar conversa..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-y-auto flex-1">
            {filteredContacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="bg-gray-100 p-4 rounded-full mb-3">
                  <ChatBubbleLeftRightIcon className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">Nenhuma conversa encontrada</p>
                <p className="text-gray-500 text-sm mt-1">Tente uma nova busca ou inicie uma conversa</p>
              </div>
            ) : (
              filteredContacts.map((contact, index) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${currentContact?.id === contact.id ? 'bg-blue-50' : ''}`}
                  onClick={() => setCurrentContact(contact)}
                >
                  <div className="flex items-start">
                    <div className="relative mr-3">
                      {contact.profilePic ? (
                        <img
                          src={contact.profilePic}
                          alt={contact.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <UserCircleIcon className="h-8 w-8 text-blue-600" />
                        </div>
                      )}
                      {contact.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-800 truncate">{contact.name}</h3>
                        {contact.lastMessage && (
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                            {formatConversationTime(contact.lastMessage.timestamp)}
                          </span>
                        )}
                      </div>
                      {contact.lastMessage && (
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-sm text-gray-600 truncate pr-2">
                            {contact.lastMessage.text}
                          </p>
                          <div className="flex items-center">
                            {contact.unreadCount > 0 ? (
                              <span className="bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {contact.unreadCount}
                              </span>
                            ) : (
                              renderMessageStatus(contact.lastMessage.status)
                            )}
                          </div>
                        </div>
                      )}
                      {contact.isTyping && (
                        <div className="text-xs text-green-600 mt-1">
                          Digitando...
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
          
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <button className="w-full py-2 bg-[#0047CC] text-white rounded-lg text-sm font-medium hover:bg-[#003CAD] transition-colors flex items-center justify-center">
              <PlusIcon className="h-5 w-5 mr-2" />
              Nova Conversa
            </button>
          </div>
        </div>
        
        {/* Área de chat */}
        <div className="hidden md:flex md:w-2/3 lg:w-3/4 flex-col">
          {currentContact ? (
            <>
              {/* Cabeçalho do chat */}
              <div className="p-3 border-b border-gray-200 bg-white flex justify-between items-center">
                <div className="flex items-center">
                  <div className="relative mr-3">
                    {currentContact.profilePic ? (
                      <img
                        src={currentContact.profilePic}
                        alt={currentContact.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <UserCircleIcon className="h-6 w-6 text-blue-600" />
                      </div>
                    )}
                    {currentContact.isOnline && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{currentContact.name}</h3>
                    <p className="text-xs text-gray-500">
                      {currentContact.isOnline 
                        ? "Online" 
                        : currentContact.lastSeen 
                          ? `Visto por último ${formatConversationTime(currentContact.lastSeen)}`
                          : currentContact.phoneNumber
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                    <PhoneIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                    <MagnifyingGlassIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                    <EllipsisHorizontalIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              {/* Área de mensagens */}
              <div className="flex-1 bg-gray-100 p-4 overflow-y-auto" style={{ backgroundImage: "url('https://i.imgur.com/2pReMAu.png')" }}>
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="flex items-center space-x-2">
                      <ArrowPathIcon className="h-5 w-5 text-gray-500 animate-spin" />
                      <span className="text-gray-500">Carregando mensagens...</span>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="bg-white p-4 rounded-full mb-3 shadow-sm">
                      <ChatBubbleLeftRightIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-700 font-medium">Nenhuma mensagem ainda</p>
                    <p className="text-gray-500 text-sm mt-1">Comece a conversar com {currentContact.name}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((msg, index) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[75%] rounded-lg p-3 ${
                            msg.sender === 'user' 
                              ? 'bg-[#D9FDD3] text-gray-800' 
                              : 'bg-white text-gray-800'
                          }`}
                        >
                          <p>{msg.text}</p>
                          <div className={`flex justify-end items-center mt-1 space-x-1 text-xs ${
                            msg.sender === 'user' ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            <span>{formatMessageTime(msg.timestamp)}</span>
                            {msg.sender === 'user' && renderMessageStatus(msg.status)}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
              
              {/* Input de mensagem */}
              <div className="p-3 border-t border-gray-200 bg-white">
                <div className="flex items-center">
                  <div className="flex space-x-2 mr-3">
                    <button 
                      className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
                      onClick={() => setShowQuickReplies(!showQuickReplies)}
                    >
                      <Bars3BottomLeftIcon className="h-5 w-5" />
                    </button>
                    <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                      <PaperClipIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Digite uma mensagem..."
                      className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full text-gray-500 hover:bg-gray-100">
                      <FaceSmileIcon className="h-5 w-5" />
                    </button>
                    
                    {/* Respostas rápidas */}
                    {showQuickReplies && (
                      <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto z-10">
                        <div className="p-2 border-b border-gray-100">
                          <h4 className="font-medium text-sm text-gray-700">Respostas Rápidas</h4>
                        </div>
                        {quickReplies.map((reply) => (
                          <div 
                            key={reply.id}
                            className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                            onClick={() => selectQuickReply(reply.text)}
                          >
                            <div className="font-medium text-sm text-gray-800 mb-1">{reply.title}</div>
                            <div className="text-xs text-gray-600 line-clamp-2">{reply.text}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    className="ml-3 p-2 rounded-full bg-[#0047CC] text-white hover:bg-[#003CAD] transition-colors"
                    onClick={sendMessage}
                    disabled={!message.trim()}
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-6">
              <div className="bg-white p-6 rounded-xl shadow-sm text-center max-w-md">
                <div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
                  <ChatBubbleLeftRightIcon className="h-10 w-10 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Suas conversas no WhatsApp</h2>
                <p className="text-gray-600 mb-6">Selecione uma conversa à esquerda ou inicie uma nova para começar a se comunicar com seus clientes.</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 rounded-lg bg-gray-50">
                    <UserGroupIcon className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-700 font-medium">Clientes</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50">
                    <TagIcon className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-700 font-medium">Etiquetas</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50">
                    <Bars3BottomLeftIcon className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-700 font-medium">Templates</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Mensagem para telas pequenas */}
        <div className="md:hidden flex-1 flex items-center justify-center bg-gray-50 p-6 text-center">
          <div>
            <div className="bg-gray-100 p-4 rounded-full inline-block mb-3">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">Selecione uma conversa</h3>
            <p className="text-gray-500 text-sm">Escolha um contato para visualizar as mensagens</p>
          </div>
        </div>
      </div>
    </div>
  );
} 