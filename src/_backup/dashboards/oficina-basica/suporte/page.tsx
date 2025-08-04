"use client";

import { 
  QuestionMarkCircleIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { motion } from "framer-motion";

export default function SuportePage() {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<{
    type: "user" | "ai";
    content: string;
    timestamp: Date;
  }[]>([
    {
      type: "ai",
      content: "Olá! Sou o assistente de IA do Instauto. Como posso ajudar você hoje?",
      timestamp: new Date()
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Adiciona a mensagem do usuário
    const userMessage = {
      type: "user" as const,
      content: message,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setMessage("");

    // Simula resposta da IA após um pequeno delay
    setTimeout(() => {
      const aiResponse = {
        type: "ai" as const,
        content: getAiResponse(message),
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  // Função para simular respostas da IA
  const getAiResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes("orçamento") || lowerQuestion.includes("orcamento")) {
      return "Para enviar um orçamento, acesse a página de Ordens de Serviço, selecione a ordem desejada e clique no botão 'Enviar Orçamento'. Você pode incluir os itens, valores e observações importantes para o cliente.";
    } else if (lowerQuestion.includes("upgrade") || lowerQuestion.includes("plano pro")) {
      return "O plano Pro do Instauto oferece recursos avançados como controle de estoque, gestão financeira, relatórios detalhados e integrações com WhatsApp. Para mais informações ou para fazer o upgrade, acesse a página de Planos ou entre em contato com nosso suporte comercial.";
    } else if (lowerQuestion.includes("cliente") || lowerQuestion.includes("motorista")) {
      return "O Instauto conecta você diretamente aos motoristas. Quando um motorista solicita um serviço, você recebe a notificação e pode enviar um orçamento. No plano Pro, você tem acesso a um CRM completo para gerenciar todos os seus clientes, histórico e preferências.";
    } else {
      return "Entendi sua pergunta. Como assistente em versão básica, tenho informações limitadas. Para obter suporte mais detalhado, considere fazer upgrade para o plano Pro ou entre em contato com nosso suporte por e-mail: suporte@instauto.com.br";
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <QuestionMarkCircleIcon className="h-6 w-6 mr-2 text-[#0047CC]" />
            Suporte com IA
          </h1>
          <p className="text-gray-600 mt-1">
            Tire suas dúvidas com nosso assistente virtual
          </p>
        </div>
        
        <div className="bg-[#0047CC]/10 text-[#0047CC] px-3 py-1.5 rounded-lg text-sm font-medium inline-flex items-center">
          <SparklesIcon className="h-4 w-4 mr-1.5" />
          Versão Básica
        </div>
      </div>
      
      {/* Container do Chat */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col max-h-[calc(100vh-220px)]">
        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((msg, i) => (
            <motion.div
              key={i}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.type === "user" 
                    ? "bg-[#0047CC] text-white rounded-tr-none" 
                    : "bg-gray-100 text-gray-800 rounded-tl-none"
                }`}
              >
                <div className="text-sm">{msg.content}</div>
                <div className={`text-[10px] mt-1 ${msg.type === "user" ? "text-white/70" : "text-gray-500"}`}>
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Input da Mensagem */}
        <div className="border-t p-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Digite sua pergunta aqui..."
              className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-[#0047CC] focus:border-[#0047CC] text-sm"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#0047CC] hover:text-[#0055EB] p-2 rounded-full transition-colors"
              onClick={handleSendMessage}
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Sugestões de Perguntas */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Perguntas sugeridas:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "Como enviar um orçamento para o cliente?",
            "Quais os benefícios do plano Pro?",
            "Como funciona a comunicação com os motoristas?",
            "Posso personalizar as informações da minha oficina?"
          ].map((question, i) => (
            <button
              key={i}
              className="text-left bg-white border border-gray-200 hover:border-[#0047CC]/30 p-3 rounded-lg text-sm text-gray-700 hover:bg-[#0047CC]/5 transition-colors flex items-center justify-between group"
              onClick={() => {
                setMessage(question);
                // Opcional: enviar diretamente a pergunta
                // handleSendMessage();
              }}
            >
              <span>{question}</span>
              <ChevronRightIcon className="h-4 w-4 text-gray-400 group-hover:text-[#0047CC] transition-colors" />
            </button>
          ))}
        </div>
      </div>
      
      {/* Upgrade CTA */}
      <div className="mt-6">
        <div className="bg-[#0047CC]/5 border border-[#0047CC]/20 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-700 mb-2">
            <span className="font-medium">Suporte com IA limitado no plano básico.</span> Faça upgrade para obter respostas mais detalhadas e personalizadas.
          </p>
          <button className="bg-[#0047CC] hover:bg-[#0055EB] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 inline-flex items-center">
            <SparklesIcon className="h-4 w-4 mr-2" />
            Conhecer o Plano Pro
          </button>
        </div>
      </div>
    </div>
  );
} 