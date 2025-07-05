"use client";

import { useState, useEffect } from "react";
import { MagnifyingGlassIcon, ChatBubbleLeftRightIcon, PlusIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useMessages } from "@/hooks/useSupabase";

// Mock de dados para demonstração
const mockConversas = [
  {
    id: "conv-1",
    nome: "Auto Center Silva",
    tipo: "oficina",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
    ultimaMensagem: "Seu agendamento foi confirmado para amanhã às 14h",
    horario: "14:30",
    naoLidas: 2,
    online: true
  },
  {
    id: "conv-2", 
    nome: "Oficina Costa & Cia",
    tipo: "oficina",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
    ultimaMensagem: "O orçamento para troca dos freios ficou em R$ 320",
    horario: "12:15",
    naoLidas: 0,
    online: false
  },
  {
    id: "conv-3",
    nome: "Mecânica do João",
    tipo: "oficina", 
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
    ultimaMensagem: "Você: Obrigado pelo atendimento!",
    horario: "Ontem",
    naoLidas: 0,
    online: true
  }
];

const mockMensagens = [
  {
    id: "msg-1",
    conversaId: "conv-1",
    remetente: "oficina",
    conteudo: "Olá! Recebi sua solicitação de agendamento.",
    horario: "14:25",
    lida: true
  },
  {
    id: "msg-2", 
    conversaId: "conv-1",
    remetente: "usuario",
    conteudo: "Oi! Gostaria de agendar uma revisão para meu Honda Civic.",
    horario: "14:26",
    lida: true
  },
  {
    id: "msg-3",
    conversaId: "conv-1", 
    remetente: "oficina",
    conteudo: "Seu agendamento foi confirmado para amanhã às 14h",
    horario: "14:30",
    lida: false
  }
];

export default function MensagensPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [conversaSelecionada, setConversaSelecionada] = useState<string | null>(null);
  const [mensagens, setMensagens] = useState(mockMensagens);
  const [novaMensagem, setNovaMensagem] = useState("");

  // Hook para mensagens em tempo real
  const { messages, loading } = useMessages(conversaSelecionada || undefined);

  const conversasFiltradas = mockConversas.filter(conversa =>
    conversa.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const conversaAtual = mockConversas.find(c => c.id === conversaSelecionada);
  const mensagensConversa = mensagens.filter(m => m.conversaId === conversaSelecionada);

  const enviarMensagem = () => {
    if (!novaMensagem.trim() || !conversaSelecionada) return;

    const mensagem = {
      id: `msg-${Date.now()}`,
      conversaId: conversaSelecionada,
      remetente: "usuario",
      conteudo: novaMensagem,
      horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      lida: true
    };

    setMensagens(prev => [...prev, mensagem]);
    setNovaMensagem("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Mensagens</h1>
          <p className="text-gray-600 mt-1">Converse com motoristas e oficinas</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border overflow-hidden h-[calc(100vh-200px)]">
          <div className="flex h-full">
            {/* Lista de conversas */}
            <div className={`w-full md:w-1/3 border-r border-gray-200 flex flex-col ${
              conversaSelecionada ? 'hidden md:flex' : 'flex'
            }`}>
              {/* Header da lista */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Conversas</h2>
                  <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                    <PlusIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar conversas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Lista de conversas */}
              <div className="flex-1 overflow-y-auto">
                {conversasFiltradas.map((conversa) => (
                  <motion.div
                    key={conversa.id}
                    whileHover={{ backgroundColor: "#f9fafb" }}
                    onClick={() => setConversaSelecionada(conversa.id)}
                    className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                      conversaSelecionada === conversa.id ? 'bg-blue-50 border-r-4 border-r-blue-600' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={conversa.avatar}
                          alt={conversa.nome}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        {conversa.online && (
                          <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900 truncate">{conversa.nome}</h3>
                          <span className="text-xs text-gray-500">{conversa.horario}</span>
                        </div>
                        <p className={`text-sm truncate mt-1 ${
                          conversa.naoLidas > 0 ? 'font-medium text-gray-900' : 'text-gray-500'
                        }`}>
                          {conversa.ultimaMensagem}
                        </p>
                      </div>
                      
                      {conversa.naoLidas > 0 && (
                        <div className="bg-blue-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium">
                          {conversa.naoLidas}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Área de chat */}
            <div className={`flex-1 flex flex-col ${
              conversaSelecionada ? 'flex' : 'hidden md:flex'
            }`}>
              {conversaAtual ? (
                <>
                  {/* Header do chat */}
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setConversaSelecionada(null)}
                        className="md:hidden p-2 hover:bg-gray-100 rounded-full"
                      >
                        ←
                      </button>
                      <img
                        src={conversaAtual.avatar}
                        alt={conversaAtual.nome}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{conversaAtual.nome}</h3>
                        <p className="text-sm text-gray-500">
                          {conversaAtual.online ? 'Online agora' : 'Visto por último hoje'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mensagens */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {mensagensConversa.map((mensagem) => (
                      <div
                        key={mensagem.id}
                        className={`flex ${
                          mensagem.remetente === 'usuario' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-2xl ${
                            mensagem.remetente === 'usuario'
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-900 shadow-sm'
                          }`}
                        >
                          <p className="text-sm">{mensagem.conteudo}</p>
                          <p className={`text-xs mt-1 text-right ${
                            mensagem.remetente === 'usuario' ? 'text-blue-100' : 'text-gray-400'
                          }`}>
                            {mensagem.horario}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input de mensagem */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Digite sua mensagem..."
                        value={novaMensagem}
                        onChange={(e) => setNovaMensagem(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && enviarMensagem()}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                      <button
                        onClick={enviarMensagem}
                        disabled={!novaMensagem.trim()}
                        className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Selecione uma conversa
                    </h3>
                    <p className="text-gray-600">
                      Escolha uma conversa para começar a trocar mensagens
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