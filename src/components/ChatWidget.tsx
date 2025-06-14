"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  PhoneIcon,
  VideoCameraIcon,
  PhotoIcon,
  PaperClipIcon
} from '@heroicons/react/24/outline';
import useMensagens from '@/hooks/useMensagens';

interface ChatWidgetProps {
  usuarioId: string;
  usuarioTipo: 'motorista' | 'oficina';
  conversaId?: string;
  outroUsuario?: {
    id: string;
    nome: string;
    avatar?: string;
    tipo: 'motorista' | 'oficina';
  };
}

const ChatWidget = ({ 
  usuarioId, 
  usuarioTipo, 
  conversaId,
  outroUsuario
}: ChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [digitando, setDigitando] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    conversas,
    totalNaoLidas,
    enviarMensagem,
    marcarComoLida,
    obterMensagens,
    criarConversa
  } = useMensagens(usuarioId, usuarioTipo);

  // Encontrar conversa ativa
  const conversaAtual = conversaId 
    ? conversas.find(c => c.id === conversaId)
    : conversas[0]; // Primeira conversa se não especificada

  const mensagens = conversaAtual ? obterMensagens(conversaAtual.id) : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  useEffect(() => {
    if (isOpen && conversaAtual) {
      marcarComoLida(conversaAtual.id);
    }
  }, [isOpen, conversaAtual, marcarComoLida]);

  const handleEnviarMensagem = async () => {
    if (!novaMensagem.trim()) return;

    let conversaParaUsar = conversaAtual;

    // Se não há conversa e temos dados do outro usuário, criar nova conversa
    if (!conversaParaUsar && outroUsuario) {
      const resultado = await criarConversa(
        outroUsuario.id,
        outroUsuario.tipo,
        outroUsuario.nome
      );
      
      if (resultado.sucesso) {
        conversaParaUsar = resultado.conversa;
      }
    }

    if (!conversaParaUsar) return;

    await enviarMensagem(conversaParaUsar.id, novaMensagem);
    setNovaMensagem('');

    // Simular resposta automática (apenas para demo)
    if (usuarioTipo === 'motorista') {
      setTimeout(() => {
        setDigitando(true);
        setTimeout(async () => {
          const respostasAuto = [
            'Obrigado pela mensagem! Vou verificar e te respondo em breve.',
            'Recebido! Estou analisando sua solicitação.',
            'Perfeito! Vou preparar um orçamento para você.',
            'Entendi! Podemos agendar para esta semana.'
          ];
          const resposta = respostasAuto[Math.floor(Math.random() * respostasAuto.length)];
          await enviarMensagem(conversaParaUsar!.id, resposta);
          setDigitando(false);
        }, 2000);
      }, 1000);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && conversaAtual) {
      // Aqui seria implementado o upload do arquivo
      console.log('Upload de arquivo:', file.name);
    }
  };

  const formatarHorario = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOutroUsuario = () => {
    if (!conversaAtual) return outroUsuario;
    
    return usuarioTipo === 'motorista' 
      ? conversaAtual.oficina 
      : conversaAtual.motorista;
  };

  const outroUsuarioInfo = getOutroUsuario();

  return (
    <>
      {/* Botão flutuante */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 p-4 bg-[#0047CC] text-white rounded-full shadow-lg hover:bg-[#003DA6] transition-colors ${
          isOpen ? 'hidden' : 'block'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChatBubbleLeftRightIcon className="h-6 w-6" />
        {totalNaoLidas > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
            {totalNaoLidas > 99 ? '99+' : totalNaoLidas}
          </div>
        )}
      </motion.button>

      {/* Widget de chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#0047CC] text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  {outroUsuarioInfo?.avatar ? (
                    <img 
                      src={outroUsuarioInfo.avatar} 
                      alt={outroUsuarioInfo.nome} 
                      className="w-8 h-8 rounded-full object-cover" 
                    />
                  ) : (
                    <span className="text-sm font-medium">
                      {outroUsuarioInfo?.nome?.charAt(0) || '?'}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-sm">
                    {outroUsuarioInfo?.nome || 'Chat'}
                  </h3>
                  <p className="text-xs text-white/80">
                    {outroUsuarioInfo?.online ? 'Online agora' : 'Offline'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-1.5 hover:bg-white/20 rounded-full transition-colors">
                  <PhoneIcon className="h-4 w-4" />
                </button>
                <button className="p-1.5 hover:bg-white/20 rounded-full transition-colors">
                  <VideoCameraIcon className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {mensagens.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Nenhuma mensagem ainda</p>
                  <p className="text-xs">Envie uma mensagem para começar</p>
                </div>
              ) : (
                mensagens.map((mensagem) => (
                  <div
                    key={mensagem.id}
                    className={`flex ${
                      mensagem.remetenteId === usuarioId ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-2xl ${
                        mensagem.remetenteId === usuarioId
                          ? 'bg-[#0047CC] text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{mensagem.conteudo}</p>
                      <p className={`text-xs mt-1 ${
                        mensagem.remetenteId === usuarioId ? 'text-white/70' : 'text-gray-500'
                      }`}>
                        {formatarHorario(mensagem.criadaEm)}
                      </p>
                    </div>
                  </div>
                ))
              )}
              
              {digitando && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input de mensagem */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <PaperClipIcon className="h-4 w-4" />
                </button>
                
                <input
                  type="text"
                  value={novaMensagem}
                  onChange={(e) => setNovaMensagem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleEnviarMensagem()}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC] text-sm"
                />
                
                <button
                  onClick={handleEnviarMensagem}
                  disabled={!novaMensagem.trim()}
                  className="p-2 bg-[#0047CC] text-white rounded-full hover:bg-[#003DA6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PaperAirplaneIcon className="h-4 w-4" />
                </button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget; 