"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  PhoneIcon,
  VideoCameraIcon,
  EllipsisVerticalIcon,
  ArchiveBoxIcon,
  TrashIcon,
  PaperClipIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import GlobalHeader from '@/components/GlobalHeader';
import Footer from '@/components/Footer';
import useMensagens from '@/hooks/useMensagens';

export default function MensagensPage() {
  const [busca, setBusca] = useState('');
  const [conversaSelecionada, setConversaSelecionada] = useState<string | null>(null);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [mostrarMenu, setMostrarMenu] = useState(false);

  // Mock do usuário atual
  const usuarioAtual = {
    id: 'motorista-1',
    tipo: 'motorista' as const,
    nome: 'João Silva'
  };

  const {
    conversas,
    totalNaoLidas,
    enviarMensagem,
    marcarComoLida,
    obterMensagens,
    arquivarConversa,
    carregando
  } = useMensagens(usuarioAtual.id, usuarioAtual.tipo);

  // Filtrar conversas por busca
  const conversasFiltradas = conversas.filter(conversa =>
    conversa.oficina.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const conversaAtual = conversaSelecionada 
    ? conversas.find(c => c.id === conversaSelecionada)
    : null;

  const mensagens = conversaAtual ? obterMensagens(conversaAtual.id) : [];

  const handleSelecionarConversa = (conversaId: string) => {
    setConversaSelecionada(conversaId);
    marcarComoLida(conversaId);
    setMostrarMenu(false);
  };

  const handleEnviarMensagem = async () => {
    if (!novaMensagem.trim() || !conversaSelecionada) return;

    await enviarMensagem(conversaSelecionada, novaMensagem);
    setNovaMensagem('');
  };

  const formatarHorario = (timestamp: string) => {
    const data = new Date(timestamp);
    const agora = new Date();
    const diffMs = agora.getTime() - data.getTime();
    const diffHoras = diffMs / (1000 * 60 * 60);

    if (diffHoras < 24) {
      return data.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit'
      });
    }
  };

  const formatarUltimaMensagem = (mensagem: string) => {
    return mensagem.length > 50 ? mensagem.substring(0, 50) + '...' : mensagem;
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-gray-50">
        <GlobalHeader title="Mensagens" />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0047CC] mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando mensagens...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalHeader title="Mensagens" />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[calc(100vh-200px)]">
          <div className="flex h-full">
            {/* Lista de conversas */}
            <div className={`w-full md:w-1/3 border-r border-gray-200 flex flex-col ${
              conversaSelecionada ? 'hidden md:flex' : 'flex'
            }`}>
              {/* Header da lista */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Conversas
                  </h2>
                  {totalNaoLidas > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {totalNaoLidas}
                    </span>
                  )}
                </div>

                {/* Busca */}
                <div className="relative">
                  <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar conversas..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC] text-sm"
                  />
                </div>
              </div>

              {/* Lista de conversas */}
              <div className="flex-1 overflow-y-auto">
                {conversasFiltradas.length === 0 ? (
                  <div className="p-8 text-center">
                    <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                      {busca ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa ainda'}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {conversasFiltradas.map((conversa) => (
                      <motion.div
                        key={conversa.id}
                        whileHover={{ backgroundColor: '#f9fafb' }}
                        onClick={() => handleSelecionarConversa(conversa.id)}
                        className={`p-4 cursor-pointer transition-colors ${
                          conversaSelecionada === conversa.id 
                            ? 'bg-blue-50 border-r-2 border-[#0047CC]' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          {/* Avatar */}
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                            {conversa.oficina.avatar ? (
                              <img
                                src={conversa.oficina.avatar}
                                alt={conversa.oficina.nome}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-medium text-gray-600">
                                {conversa.oficina.nome.charAt(0)}
                              </span>
                            )}
                          </div>

                          {/* Conteúdo */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className={`text-sm font-medium truncate ${
                                conversa.mensagensNaoLidas > 0 ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {conversa.oficina.nome}
                              </h3>
                              <div className="flex items-center space-x-2">
                                {conversa.ultimaMensagem && (
                                  <span className="text-xs text-gray-500">
                                    {formatarHorario(conversa.ultimaMensagem.criadaEm)}
                                  </span>
                                )}
                                {conversa.mensagensNaoLidas > 0 && (
                                  <div className="w-2 h-2 bg-[#0047CC] rounded-full"></div>
                                )}
                              </div>
                            </div>

                            {conversa.ultimaMensagem && (
                              <p className={`text-sm truncate ${
                                conversa.mensagensNaoLidas > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'
                              }`}>
                                {conversa.ultimaMensagem.remetenteTipo === usuarioAtual.tipo ? 'Você: ' : ''}
                                {formatarUltimaMensagem(conversa.ultimaMensagem.conteudo)}
                              </p>
                            )}

                            {/* Status online */}
                            <div className="flex items-center mt-1">
                              <div className={`w-2 h-2 rounded-full mr-2 ${
                                conversa.oficina.online ? 'bg-green-400' : 'bg-gray-300'
                              }`}></div>
                              <span className="text-xs text-gray-500">
                                {conversa.oficina.online ? 'Online' : 'Offline'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Área de chat */}
            <div className={`flex-1 flex flex-col ${
              !conversaSelecionada ? 'hidden md:flex' : 'flex'
            }`}>
              {!conversaAtual ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      Selecione uma conversa
                    </h3>
                    <p className="text-gray-500">
                      Escolha uma conversa da lista para começar a conversar
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Header do chat */}
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => setConversaSelecionada(null)}
                          className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                        >
                          ←
                        </button>
                        
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {conversaAtual.oficina.avatar ? (
                            <img
                              src={conversaAtual.oficina.avatar}
                              alt={conversaAtual.oficina.nome}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-medium text-gray-600">
                              {conversaAtual.oficina.nome.charAt(0)}
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="font-medium text-gray-900">
                            {conversaAtual.oficina.nome}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {conversaAtual.oficina.online ? 'Online agora' : 'Offline'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <PhoneIcon className="h-5 w-5 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <VideoCameraIcon className="h-5 w-5 text-gray-600" />
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => setMostrarMenu(!mostrarMenu)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
                          </button>

                          <AnimatePresence>
                            {mostrarMenu && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
                              >
                                <button
                                  onClick={() => {
                                    arquivarConversa(conversaAtual.id);
                                    setMostrarMenu(false);
                                    setConversaSelecionada(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                >
                                  <ArchiveBoxIcon className="h-4 w-4 mr-2" />
                                  Arquivar conversa
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mensagens */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {mensagens.map((mensagem) => (
                      <div
                        key={mensagem.id}
                        className={`flex ${
                          mensagem.remetenteId === usuarioAtual.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-2xl ${
                            mensagem.remetenteId === usuarioAtual.id
                              ? 'bg-[#0047CC] text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{mensagem.conteudo}</p>
                          <p className={`text-xs mt-1 ${
                            mensagem.remetenteId === usuarioAtual.id ? 'text-white/70' : 'text-gray-500'
                          }`}>
                            {formatarHorario(mensagem.criadaEm)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input de mensagem */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex items-center space-x-3">
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <PaperClipIcon className="h-5 w-5" />
                      </button>
                      
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <PhotoIcon className="h-5 w-5" />
                      </button>

                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={novaMensagem}
                          onChange={(e) => setNovaMensagem(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleEnviarMensagem()}
                          placeholder="Digite sua mensagem..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC]"
                        />
                      </div>

                      <button
                        onClick={handleEnviarMensagem}
                        disabled={!novaMensagem.trim()}
                        className="p-3 bg-[#0047CC] text-white rounded-full hover:bg-[#003DA6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <PaperAirplaneIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 