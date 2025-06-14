"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  ClockIcon,
  ArrowPathIcon,
  BookOpenIcon,
  Squares2X2Icon,
  QuestionMarkCircleIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";

type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
};

type SuggestedQuestion = {
  id: string;
  text: string;
};

type HelpCategory = {
  id: string;
  title: string;
  icon: JSX.Element;
  description: string;
};

// Perguntas sugeridas para o assistente
const suggestedQuestions: SuggestedQuestion[] = [
  { id: "q1", text: "Como adicionar um novo cliente no sistema?" },
  { id: "q2", text: "Como registrar uma nova ordem de serviço?" },
  { id: "q3", text: "Como emitir uma nota fiscal?" },
  { id: "q4", text: "Como verificar o estoque de peças?" },
  { id: "q5", text: "Como gerar relatórios de faturamento?" },
  { id: "q6", text: "Como configurar notificações automáticas?" }
];

// Categorias de ajuda
const helpCategories: HelpCategory[] = [
  {
    id: "cat1",
    title: "Guias e Tutoriais",
    icon: <BookOpenIcon className="h-6 w-6 text-blue-600" />,
    description: "Aprenda a usar todas as funcionalidades do sistema"
  },
  {
    id: "cat2",
    title: "Perguntas Frequentes",
    icon: <QuestionMarkCircleIcon className="h-6 w-6 text-green-600" />,
    description: "Respostas para as dúvidas mais comuns"
  },
  {
    id: "cat3",
    title: "Vídeos Explicativos",
    icon: <Squares2X2Icon className="h-6 w-6 text-purple-600" />,
    description: "Tutoriais em vídeo para facilitar o aprendizado"
  }
];

export default function SuportePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      content: "Olá! Sou o assistente virtual da Instauto. Como posso ajudar você hoje?",
      role: "assistant",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recentTopics, setRecentTopics] = useState<string[]>([
    "Adicionar cliente",
    "Emitir nota fiscal",
    "Cadastrar veículo"
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Função para rolar para a última mensagem
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  // Função para enviar mensagem
  const sendMessage = () => {
    if (!input.trim()) return;
    
    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      role: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    // Simular resposta do assistente após um breve atraso
    setTimeout(() => {
      const assistantResponse: Message = {
        id: `assistant-${Date.now()}`,
        content: generateResponse(input),
        role: "assistant",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantResponse]);
      setIsLoading(false);
      
      // Atualizar tópicos recentes
      if (!recentTopics.includes(input) && recentTopics.length >= 3) {
        setRecentTopics(prev => [input, ...prev.slice(0, 2)]);
      } else if (!recentTopics.includes(input)) {
        setRecentTopics(prev => [input, ...prev]);
      }
    }, 1500);
  };
  
  // Função para selecionar pergunta sugerida
  const selectSuggestedQuestion = (question: string) => {
    setInput(question);
    sendMessage();
  };
  
  // Simular resposta do assistente com base na pergunta
  const generateResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes("adicionar") && lowerQuestion.includes("cliente")) {
      return "Para adicionar um novo cliente, acesse o menu 'Clientes' e clique no botão '+ Adicionar Cliente' no canto superior direito. Preencha as informações básicas como nome, telefone e e-mail. Você também pode adicionar informações sobre os veículos do cliente na mesma tela. Quando terminar, clique em 'Salvar'.";
    } else if (lowerQuestion.includes("ordem de serviço") || lowerQuestion.includes("os")) {
      return "Para registrar uma nova ordem de serviço, acesse o menu 'Serviços' e clique em '+ Nova OS'. Selecione o cliente, o veículo e adicione os serviços a serem realizados. Você pode incluir peças do estoque, definir o status e atribuir a um mecânico. Finalize clicando em 'Criar OS'.";
    } else if (lowerQuestion.includes("nota fiscal") || lowerQuestion.includes("nf")) {
      return "Para emitir uma nota fiscal, acesse a ordem de serviço concluída e clique no botão 'Emitir NF-e'. Revise os dados fiscais, os itens e serviços incluídos, e clique em 'Emitir'. O sistema irá processar a emissão junto à SEFAZ e você poderá imprimir ou enviar por e-mail para o cliente.";
    } else if (lowerQuestion.includes("estoque") || lowerQuestion.includes("peças")) {
      return "Para verificar o estoque, acesse o menu 'Estoque' onde você verá todas as peças cadastradas, suas quantidades atuais e preços. Você pode usar os filtros para localizar itens específicos, visualizar produtos com estoque baixo e gerar relatórios de movimentação.";
    } else if (lowerQuestion.includes("relatório") || lowerQuestion.includes("faturamento")) {
      return "Para gerar relatórios de faturamento, vá até o menu 'Relatórios' e selecione 'Faturamento'. Defina o período desejado (diário, semanal, mensal ou personalizado), selecione os filtros necessários como serviços ou clientes específicos, e clique em 'Gerar Relatório'. Você pode exportar os dados em Excel ou PDF.";
    } else if (lowerQuestion.includes("notificações") || lowerQuestion.includes("automáticas")) {
      return "Para configurar notificações automáticas, acesse 'Configurações' e depois 'Notificações'. Lá você pode definir quais eventos devem gerar notificações (conclusão de serviços, pagamentos, aniversários de clientes, etc.) e por quais canais (e-mail, SMS ou WhatsApp). Configure também os modelos de mensagens para cada tipo de notificação.";
    } else {
      return "Entendi sua pergunta sobre " + question + ". Para obter informações mais detalhadas sobre este tópico, recomendo consultar nossa documentação completa ou entrar em contato com nosso suporte técnico pelo e-mail suporte@instauto.com.br.";
    }
  };
  
  // Formatação de data e hora
  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Suporte com IA</h1>
        <p className="text-gray-500 text-sm mt-1">Tire suas dúvidas com nosso assistente virtual inteligente</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Coluna da esquerda - Chat com IA */}
        <div className="lg:col-span-3">
          <motion.div 
            className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-240px)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Cabeçalho do chat */}
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center">
              <div className="mr-3 bg-blue-100 p-2 rounded-full">
                <SparklesIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="font-medium text-gray-800">Assistente Instauto</h2>
                <p className="text-xs text-gray-500">Assistente com IA para suporte e treinamento</p>
              </div>
            </div>
            
            {/* Área de mensagens */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mr-2">
                      <SparklesIcon className="h-5 w-5 text-blue-600" />
                    </div>
                  )}
                  
                  <div 
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-white text-gray-700 shadow-sm rounded-tl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <div className={`text-xs mt-1 text-right ${message.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                      {formatMessageTime(message.timestamp)}
                    </div>
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center ml-2">
                      <span className="text-white font-medium text-sm">
                        {/* Iniciais do usuário */}
                        CO
                      </span>
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mr-2">
                    <SparklesIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="bg-white text-gray-700 rounded-2xl rounded-tl-none p-4 shadow-sm max-w-[80%]">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce"></div>
                      <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Referência para rolar para o final */}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Perguntas sugeridas */}
            {messages.length < 3 && (
              <div className="p-3 border-t border-gray-100 bg-gray-50">
                <p className="text-xs text-gray-500 mb-2">Perguntas sugeridas:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.slice(0, 3).map((question) => (
                    <button
                      key={question.id}
                      className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => selectSuggestedQuestion(question.text)}
                    >
                      {question.text}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Input de mensagem */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Digite sua pergunta aqui..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className={`px-4 py-2 rounded-r-lg ${
                    !input.trim() || isLoading
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  } transition-colors`}
                >
                  {isLoading ? (
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  ) : (
                    <PaperAirplaneIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                O assistente virtual usa IA para responder suas perguntas com base no conhecimento disponível.
              </p>
            </div>
          </motion.div>
        </div>
        
        {/* Coluna da direita - Informações adicionais */}
        <div className="lg:col-span-1">
          {/* Tópicos recentes */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm overflow-hidden mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
              <h3 className="font-medium text-gray-800 flex items-center">
                <ClockIcon className="h-5 w-5 mr-2 text-gray-500" />
                Tópicos Recentes
              </h3>
            </div>
            <div className="p-4">
              {recentTopics.length > 0 ? (
                <ul className="space-y-2">
                  {recentTopics.map((topic, index) => (
                    <li key={index}>
                      <button 
                        className="text-sm text-gray-700 hover:text-blue-600 transition-colors flex items-center w-full text-left"
                        onClick={() => selectSuggestedQuestion(topic)}
                      >
                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                        {topic}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">Nenhum tópico recente</p>
              )}
            </div>
          </motion.div>
          
          {/* Categorias de ajuda */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
              <h3 className="font-medium text-gray-800 flex items-center">
                <QuestionMarkCircleIcon className="h-5 w-5 mr-2 text-gray-500" />
                Centro de Ajuda
              </h3>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {helpCategories.map((category) => (
                  <a 
                    key={category.id}
                    href="#"
                    className="block p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-3 p-2 bg-gray-100 rounded-lg">
                          {category.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 text-sm">{category.title}</h4>
                          <p className="text-xs text-gray-500">{category.description}</p>
                        </div>
                      </div>
                      <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  </a>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <h4 className="font-medium text-blue-800 text-sm mb-1">Precisa de mais ajuda?</h4>
                <p className="text-xs text-blue-700 mb-2">Entre em contato com nosso suporte técnico.</p>
                <a 
                  href="mailto:suporte@instauto.com.br"
                  className="text-xs text-blue-600 font-medium hover:underline flex items-center"
                >
                  suporte@instauto.com.br
                  <ChevronRightIcon className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 