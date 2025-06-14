"use client";

import { useState } from "react";
import { SparklesIcon, PaperAirplaneIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

export default function QuickDiagnosticAI() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>>([
    {
      role: 'system',
      content: 'Olá! Sou a IA de diagnóstico do Instauto. Descreva os sintomas do veículo e tentarei ajudar a identificar possíveis problemas mecânicos.'
    }
  ]);

  // Simula o envio de mensagem para a IA
  const handleSendMessage = () => {
    if (!input.trim() || isLoading) return;
    
    // Adiciona a mensagem do usuário
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    // Simula o processamento da IA (em produção seria uma chamada API)
    setTimeout(() => {
      const aiResponses: Record<string, string> = {
        "barulho suspensão": "Com base na descrição de barulho na suspensão, existem algumas possibilidades:\n\n1️⃣ **Amortecedores desgastados** - Causam ruídos ao passar por buracos\n2️⃣ **Buchas da bandeja danificadas** - Provocam estalos em curvas\n3️⃣ **Pivôs de suspensão gastos** - Geram barulhos metálicos\n4️⃣ **Terminal de direção com folga**\n\nRecomendo verificar esses componentes e fazer um alinhamento e balanceamento.",
        "carro não pega": "Para um carro que não dá partida, verifique:\n\n1️⃣ **Bateria fraca ou defeituosa** - Mais comum\n2️⃣ **Motor de arranque** - Se ouvir cliques\n3️⃣ **Alternador com defeito** - Bateria não carrega\n4️⃣ **Combustível** - Verificar nível e bomba\n5️⃣ **Sistema de ignição** - Velas ou bobinas\n\nSe as luzes do painel acendem normalmente, provavelmente não é problema na bateria.",
        "freio barulho": "Barulho nos freios geralmente indica:\n\n1️⃣ **Pastilhas desgastadas** - Rangido metálico agudo\n2️⃣ **Discos empenados** - Vibração ao frear\n3️⃣ **Pinças travadas** - Rangido constante\n4️⃣ **Desgaste irregular** - Chiado intermitente\n\nRecomendo verificar o sistema de freios assim que possível, pois afeta diretamente a segurança.",
        "óleo vazando": "Vazamento de óleo pode ter várias origens:\n\n1️⃣ **Juntas ou retentores desgastados**\n2️⃣ **Tampa do cárter mal vedada**\n3️⃣ **Sensor de óleo com folga**\n4️⃣ **Filtro de óleo mal instalado**\n5️⃣ **Rachaduras no bloco ou cárter**\n\nVerifique a coloração e consistência do óleo e onde está acumulando para identificar melhor a origem.",
        "default": "Baseado na sua descrição, posso sugerir algumas possíveis causas. Para um diagnóstico mais preciso, seria útil ter mais detalhes como:\n\n1️⃣ Modelo e ano do veículo\n2️⃣ Quando o problema começou\n3️⃣ Se ocorre em situações específicas\n4️⃣ Outros sintomas relacionados\n\nRecomendo levar seu veículo a uma oficina parceira Instauto para uma avaliação detalhada."
      };
      
      // Identifica uma resposta com base nas palavras-chave
      let responseContent = aiResponses.default;
      for (const [keyword, response] of Object.entries(aiResponses)) {
        if (keyword !== "default" && input.toLowerCase().includes(keyword)) {
          responseContent = response;
          break;
        }
      }
      
      const aiMessage = { 
        role: 'assistant' as const, 
        content: responseContent
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  // Reage ao pressionar Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Formata o conteúdo das mensagens (quebras de linha, etc)
  const formatMessage = (content: string) => {
    return content.split('\n').map((line, i) => (
      <span key={i} className="block mb-2">
        {line}
      </span>
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      {/* Cabeçalho */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-[#0047CC] to-[#0055EB] text-white">
        <div className="flex items-center">
          <SparklesIcon className="h-5 w-5 mr-2 text-[#FFDE59]" />
          <h3 className="font-bold">Diagnóstico Rápido com IA</h3>
        </div>
        <p className="text-xs text-white/80 mt-1">
          Descreva os sintomas do veículo para obter um diagnóstico preliminar
        </p>
      </div>
      
      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 max-h-72">
        {messages.map((message, index) => (
          <div 
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`rounded-lg p-3 max-w-[85%] ${
              message.role === 'user' 
                ? 'bg-[#0047CC] text-white' 
                : 'bg-white border border-gray-200'
            }`}>
              <div className={`text-sm ${message.role === 'user' ? 'text-white' : 'text-gray-800'}`}>
                {formatMessage(message.content)}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex items-center">
              <ArrowPathIcon className="h-4 w-4 text-[#0047CC] animate-spin mr-2" />
              <span className="text-sm text-gray-600">Analisando...</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Área de input */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex items-center">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Descreva o problema do veículo..."
            className="flex-1 bg-gray-100 border-none rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#0047CC]/20 text-sm"
            rows={2}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className={`ml-2 p-3 rounded-full ${
              input.trim() && !isLoading 
                ? 'bg-[#0047CC] text-white hover:bg-[#003CAD]' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            } transition-colors`}
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-2 text-center">
          <span className="text-xs text-gray-500">Digite ou escolha um problema comum:</span>
          <div className="flex flex-wrap gap-2 mt-2 justify-center">
            {["Barulho na suspensão", "Carro não pega", "Freio com barulho", "Óleo vazando"].map((problem) => (
              <button
                key={problem}
                onClick={() => setInput(problem)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs transition-colors"
              >
                {problem}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 