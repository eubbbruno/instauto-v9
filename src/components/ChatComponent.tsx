"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PaperAirplaneIcon,
  FaceSmileIcon,
  PaperClipIcon,
  PhotoIcon,
  DocumentIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

// Tipos para o chat
export type MensagemStatus = 'enviada' | 'entregue' | 'lida' | 'pendente';
export type MensagemTipo = 'texto' | 'imagem' | 'documento';

export type Mensagem = {
  id: string;
  texto: string;
  dataHora: string;
  remetente: 'usuario' | 'contato';
  status: MensagemStatus;
  tipo: MensagemTipo;
  anexoUrl?: string;
};

export type ContatoChat = {
  id: string;
  nome: string;
  avatar?: string;
  online?: boolean;
  ultimaVisto?: string;
  digitando?: boolean;
};

type ChatComponentProps = {
  contato: ContatoChat;
  mensagens: Mensagem[];
  usuarioId: string;
  usuarioNome: string;
  usuarioAvatar?: string;
  onEnviarMensagem: (texto: string, tipo: MensagemTipo, anexo?: File) => void;
  onDigitando?: () => void;
  onVisualizarMensagem?: (mensagemId: string) => void;
  className?: string;
};

export default function ChatComponent({
  contato,
  mensagens,
  usuarioId,
  usuarioNome,
  usuarioAvatar,
  onEnviarMensagem,
  onDigitando,
  onVisualizarMensagem,
  className = ""
}: ChatComponentProps) {
  const [mensagemTexto, setMensagemTexto] = useState("");
  const [anexoAberto, setAnexoAberto] = useState(false);
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const mensagensRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Rolar para a última mensagem quando novas mensagens são adicionadas
  useEffect(() => {
    if (mensagensRef.current) {
      mensagensRef.current.scrollTop = mensagensRef.current.scrollHeight;
    }
  }, [mensagens]);
  
  // Marcar mensagens como visualizadas quando entrar no chat
  useEffect(() => {
    if (onVisualizarMensagem) {
      mensagens
        .filter(m => m.remetente === 'contato' && m.status !== 'lida')
        .forEach(m => onVisualizarMensagem(m.id));
    }
  }, [mensagens, onVisualizarMensagem]);
  
  // Formatar horário da mensagem
  const formatarHoraMensagem = (dataHora: string) => {
    const data = new Date(dataHora);
    return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };
  
  // Enviar mensagem
  const enviarMensagem = () => {
    if (mensagemTexto.trim() || arquivoSelecionado) {
      if (arquivoSelecionado) {
        // Determinar o tipo de arquivo
        const tipo = arquivoSelecionado.type.startsWith('image/') ? 'imagem' : 'documento';
        onEnviarMensagem(mensagemTexto.trim(), tipo, arquivoSelecionado);
      } else {
        onEnviarMensagem(mensagemTexto.trim(), 'texto');
      }
      
      // Limpar campos
      setMensagemTexto("");
      setArquivoSelecionado(null);
      setPreviewUrl(null);
      setAnexoAberto(false);
    }
  };
  
  // Lidar com tecla Enter
  const handleTeclaEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem();
    }
  };
  
  // Lidar com alteração de texto e evento de digitação
  const handleAlteracaoTexto = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMensagemTexto(e.target.value);
    if (onDigitando) {
      onDigitando();
    }
  };
  
  // Abrir seletor de arquivo
  const abrirSeletorArquivo = (tipo: 'imagem' | 'documento') => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = tipo === 'imagem' ? 'image/*' : '.pdf,.doc,.docx,.txt';
      fileInputRef.current.click();
    }
  };
  
  // Manipular seleção de arquivo
  const handleSelecaoArquivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0];
    if (arquivo) {
      setArquivoSelecionado(arquivo);
      
      // Criar preview para imagens
      if (arquivo.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(arquivo);
      } else {
        setPreviewUrl(null);
      }
    }
  };
  
  // Renderizar status da mensagem
  const renderizarStatusMensagem = (status: MensagemStatus) => {
    switch (status) {
      case 'enviada':
        return <span className="text-gray-400">✓</span>;
      case 'entregue':
        return <span className="text-gray-500">✓✓</span>;
      case 'lida':
        return <span className="text-blue-500">✓✓</span>;
      default:
        return <span className="text-gray-300">⏱</span>;
    }
  };
  
  // Agrupar mensagens por data
  const mensagensPorData = mensagens.reduce<{ [data: string]: Mensagem[] }>((grupos, mensagem) => {
    const data = new Date(mensagem.dataHora).toLocaleDateString('pt-BR');
    if (!grupos[data]) {
      grupos[data] = [];
    }
    grupos[data].push(mensagem);
    return grupos;
  }, {});
  
  return (
    <div className={`flex flex-col bg-white rounded-lg shadow-md overflow-hidden h-full ${className}`}>
      {/* Cabeçalho do chat */}
      <div className="flex items-center justify-between p-3 border-b bg-gradient-to-r from-[#0047CC] to-[#0055EB] text-white">
        <div className="flex items-center">
          <div className="relative w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
            {contato.avatar ? (
              <img src={contato.avatar} alt={contato.nome} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <span className="text-white font-medium">{contato.nome.substring(0, 2).toUpperCase()}</span>
            )}
            {contato.online && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            )}
          </div>
          <div>
            <h3 className="font-medium leading-tight">{contato.nome}</h3>
            <p className="text-xs text-white/80">
              {contato.digitando ? (
                'Digitando...'
              ) : contato.online ? (
                'Online'
              ) : contato.ultimaVisto ? (
                `Visto por último ${new Date(contato.ultimaVisto).toLocaleDateString('pt-BR')}`
              ) : (
                'Offline'
              )}
            </p>
          </div>
        </div>
      </div>
      
      {/* Área de mensagens */}
      <div 
        ref={mensagensRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-50"
        style={{ minHeight: '300px' }}
      >
        {Object.entries(mensagensPorData).map(([data, mensagensDoDia]) => (
          <div key={data} className="mb-6">
            <div className="flex justify-center mb-4">
              <span className="px-3 py-1 bg-gray-200 rounded-full text-xs text-gray-600">{data}</span>
            </div>
            <div className="space-y-3">
              {mensagensDoDia.map((mensagem) => (
                <div 
                  key={mensagem.id}
                  className={`flex ${mensagem.remetente === 'usuario' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[75%] rounded-lg px-4 py-2 shadow-sm ${
                      mensagem.remetente === 'usuario' 
                        ? 'bg-[#0047CC] text-white rounded-br-none' 
                        : 'bg-white text-gray-800 rounded-bl-none border'
                    }`}
                  >
                    {/* Conteúdo da mensagem baseado no tipo */}
                    {mensagem.tipo === 'texto' && (
                      <p className="whitespace-pre-wrap">{mensagem.texto}</p>
                    )}
                    
                    {mensagem.tipo === 'imagem' && mensagem.anexoUrl && (
                      <div className="mb-2">
                        <img 
                          src={mensagem.anexoUrl} 
                          alt="Imagem" 
                          className="rounded-md max-w-full cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => window.open(mensagem.anexoUrl, '_blank')}
                        />
                        {mensagem.texto && <p className="mt-2 whitespace-pre-wrap">{mensagem.texto}</p>}
                      </div>
                    )}
                    
                    {mensagem.tipo === 'documento' && mensagem.anexoUrl && (
                      <div className="mb-2">
                        <a 
                          href={mensagem.anexoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                        >
                          <DocumentIcon className="h-5 w-5 mr-2 text-gray-600" />
                          <span className="text-sm text-gray-800 truncate">
                            {mensagem.anexoUrl.split('/').pop() || 'Documento'}
                          </span>
                        </a>
                        {mensagem.texto && <p className="mt-2 whitespace-pre-wrap">{mensagem.texto}</p>}
                      </div>
                    )}
                    
                    {/* Horário e status */}
                    <div className={`flex justify-end items-center text-xs mt-1 gap-1 ${
                      mensagem.remetente === 'usuario' ? 'text-white/70' : 'text-gray-500'
                    }`}>
                      <span>{formatarHoraMensagem(mensagem.dataHora)}</span>
                      {mensagem.remetente === 'usuario' && (
                        <span>{renderizarStatusMensagem(mensagem.status)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {/* Estado de digitação */}
        {contato.digitando && (
          <div className="flex justify-start mb-4">
            <div className="bg-white rounded-lg p-3 shadow-sm max-w-[75%]">
              <div className="flex space-x-1">
                <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Área de prévia de anexo */}
      {arquivoSelecionado && (
        <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
          <div className="flex items-start bg-white p-2 rounded-md border">
            <div className="flex-1 min-w-0">
              {previewUrl ? (
                <div className="relative">
                  <img src={previewUrl} alt="Preview" className="h-20 rounded-md object-contain" />
                  <button 
                    onClick={() => {
                      setArquivoSelecionado(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-0.5"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <DocumentIcon className="h-8 w-8 text-gray-500 mr-2" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{arquivoSelecionado.name}</p>
                    <p className="text-xs text-gray-500">
                      {(arquivoSelecionado.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setArquivoSelecionado(null);
                      setPreviewUrl(null);
                    }}
                    className="ml-2 p-1 text-gray-500 hover:text-gray-700"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Área de entrada de mensagem */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <div className="flex items-end gap-2">
          {/* Menu de anexos */}
          <div className="relative">
            <button 
              className="p-2 text-gray-500 hover:text-[#0047CC] hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setAnexoAberto(!anexoAberto)}
            >
              <PaperClipIcon className="h-6 w-6" />
            </button>
            
            <AnimatePresence>
              {anexoAberto && (
                <motion.div 
                  className="absolute bottom-12 left-0 bg-white rounded-lg shadow-lg border overflow-hidden"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="py-1">
                    <button 
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                      onClick={() => abrirSeletorArquivo('imagem')}
                    >
                      <PhotoIcon className="h-5 w-5 mr-2 text-[#0047CC]" />
                      Imagem
                    </button>
                    <button 
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                      onClick={() => abrirSeletorArquivo('documento')}
                    >
                      <DocumentIcon className="h-5 w-5 mr-2 text-[#0047CC]" />
                      Documento
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Input para upload de arquivo (escondido) */}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleSelecaoArquivo}
              className="hidden"
            />
          </div>
          
          {/* Botão de emojis */}
          <button className="p-2 text-gray-500 hover:text-[#0047CC] hover:bg-gray-100 rounded-full transition-colors">
            <FaceSmileIcon className="h-6 w-6" />
          </button>
          
          {/* Campo de texto */}
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={mensagemTexto}
              onChange={handleAlteracaoTexto}
              onKeyDown={handleTeclaEnter}
              placeholder="Digite uma mensagem..."
              className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent resize-none overflow-hidden"
              rows={1}
              style={{ maxHeight: '120px', minHeight: '40px' }}
            />
          </div>
          
          {/* Botão de enviar */}
          <button 
            className={`p-2 rounded-full ${
              mensagemTexto.trim() || arquivoSelecionado
                ? 'bg-[#0047CC] text-white hover:bg-[#0055EB]'
                : 'bg-gray-200 text-gray-400'
            } transition-colors`}
            onClick={enviarMensagem}
            disabled={!mensagemTexto.trim() && !arquivoSelecionado}
          >
            <PaperAirplaneIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
} 