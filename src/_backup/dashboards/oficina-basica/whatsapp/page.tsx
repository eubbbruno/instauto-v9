"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  PhoneIcon,
  ClockIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  PhotoIcon,
  LinkIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  QrCodeIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface Chat {
  id: string;
  clienteNome: string;
  clienteTelefone: string;
  ultimaMensagem: string;
  horario: string;
  status: 'nova' | 'respondida' | 'aguardando' | 'finalizada';
  naoLidas: number;
  avatar?: string;
  veiculo?: string;
  servico?: string;
}

interface Mensagem {
  id: string;
  remetente: 'oficina' | 'cliente';
  conteudo: string;
  tipo: 'texto' | 'imagem' | 'documento' | 'orcamento' | 'template';
  horario: string;
  status: 'enviado' | 'entregue' | 'lido';
  templateTipo?: string;
  valor?: number;
}

interface Template {
  id: string;
  nome: string;
  categoria: 'boas-vindas' | 'orcamento' | 'conclusao' | 'follow-up' | 'lembrete';
  conteudo: string;
  variaveis: string[];
}

export default function WhatsAppPage() {
  const { user } = useAuth();
  
  const [chatAtivo, setChatAtivo] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [novaMensagem, setNovaMensagem] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showNovoOrcamento, setShowNovoOrcamento] = useState(false);
  
  // Estado para orçamento
  const [novoOrcamento, setNovoOrcamento] = useState({
    servico: '',
    descricao: '',
    valor: '',
    prazo: '',
    observacoes: ''
  });

  // Dados mockados
  const chats: Chat[] = [
    {
      id: '1',
      clienteNome: 'João Silva',
      clienteTelefone: '(11) 98765-4321',
      ultimaMensagem: 'Obrigado! Quando posso buscar o carro?',
      horario: '14:30',
      status: 'nova',
      naoLidas: 2,
      avatar: 'https://ui-avatars.com/api/?name=João+Silva&background=0047CC&color=fff',
      veiculo: 'Honda Civic 2020',
      servico: 'Troca de óleo'
    },
    {
      id: '2',
      clienteNome: 'Maria Santos',
      clienteTelefone: '(11) 91234-5678',
      ultimaMensagem: 'Preciso do orçamento para o alinhamento',
      horario: '13:45',
      status: 'aguardando',
      naoLidas: 0,
      avatar: 'https://ui-avatars.com/api/?name=Maria+Santos&background=0047CC&color=fff',
      veiculo: 'Toyota Corolla 2019',
      servico: 'Alinhamento'
    },
    {
      id: '3',
      clienteNome: 'Pedro Costa',
      clienteTelefone: '(11) 99876-5432',
      ultimaMensagem: 'Serviço finalizado, muito obrigado!',
      horario: 'Ontem',
      status: 'finalizada',
      naoLidas: 0,
      avatar: 'https://ui-avatars.com/api/?name=Pedro+Costa&background=0047CC&color=fff',
      veiculo: 'VW Golf 2021',
      servico: 'Revisão completa'
    }
  ];

  const mensagens: { [key: string]: Mensagem[] } = {
    '1': [
      {
        id: '1',
        remetente: 'cliente',
        conteudo: 'Oi! Gostaria de agendar uma troca de óleo',
        tipo: 'texto',
        horario: '13:20',
        status: 'lido'
      },
      {
        id: '2',
        remetente: 'oficina',
        conteudo: 'Olá João! Claro, temos disponibilidade para amanhã às 14h. O valor da troca de óleo com filtro é R$ 85. Confirma?',
        tipo: 'texto',
        horario: '13:25',
        status: 'lido'
      },
      {
        id: '3',
        remetente: 'cliente',
        conteudo: 'Perfeito! Confirmo para amanhã às 14h',
        tipo: 'texto',
        horario: '13:30',
        status: 'lido'
      },
      {
        id: '4',
        remetente: 'oficina',
        conteudo: '✅ *SERVIÇO CONCLUÍDO*\n\n🚗 Veículo: Honda Civic 2020\n⚙️ Serviço: Troca de óleo + filtro\n💰 Valor: R$ 85,00\n\nSeu carro está pronto para retirada! Obrigado pela confiança! 😊',
        tipo: 'template',
        templateTipo: 'conclusao',
        horario: '14:20',
        status: 'entregue'
      },
      {
        id: '5',
        remetente: 'cliente',
        conteudo: 'Obrigado! Quando posso buscar o carro?',
        tipo: 'texto',
        horario: '14:30',
        status: 'enviado'
      }
    ]
  };

  const templates: Template[] = [
    {
      id: '1',
      nome: 'Boas-vindas',
      categoria: 'boas-vindas',
      conteudo: 'Olá {nome}! 👋\n\nSeja bem-vindo(a) à {oficina}!\n\nEstamos aqui para cuidar do seu {veiculo} com excelência. Como podemos ajudar?',
      variaveis: ['nome', 'oficina', 'veiculo']
    },
    {
      id: '2',
      nome: 'Orçamento Aprovado',
      categoria: 'orcamento',
      conteudo: '✅ *ORÇAMENTO APROVADO*\n\n🚗 Veículo: {veiculo}\n⚙️ Serviço: {servico}\n💰 Valor: R$ {valor}\n📅 Prazo: {prazo}\n\nVamos iniciar o serviço! Manteremos você informado.',
      variaveis: ['veiculo', 'servico', 'valor', 'prazo']
    },
    {
      id: '3',
      nome: 'Serviço Concluído',
      categoria: 'conclusao',
      conteudo: '✅ *SERVIÇO CONCLUÍDO*\n\n🚗 Veículo: {veiculo}\n⚙️ Serviço: {servico}\n💰 Valor: R$ {valor}\n\nSeu carro está pronto para retirada! Obrigado pela confiança! 😊',
      variaveis: ['veiculo', 'servico', 'valor']
    },
    {
      id: '4',
      nome: 'Lembrete de Revisão',
      categoria: 'lembrete',
      conteudo: '🔔 *LEMBRETE DE REVISÃO*\n\n{nome}, seu {veiculo} está próximo da próxima revisão!\n\n📅 Última revisão: {ultimaRevisao}\n⚠️ Próxima revisão: {proximaRevisao}\n\nAgende já e mantenha seu veículo sempre em dia!',
      variaveis: ['nome', 'veiculo', 'ultimaRevisao', 'proximaRevisao']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nova': return 'bg-blue-100 text-blue-800';
      case 'respondida': return 'bg-green-100 text-green-800';
      case 'aguardando': return 'bg-yellow-100 text-yellow-800';
      case 'finalizada': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'enviado': return <ClockIcon className="h-4 w-4 text-gray-400" />;
      case 'entregue': return <CheckCircleIcon className="h-4 w-4 text-blue-500" />;
      case 'lido': return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      default: return null;
    }
  };

  const enviarMensagem = () => {
    if (!novaMensagem.trim() || !chatAtivo) return;
    
    // Aqui integraria com API do WhatsApp
    console.log('Enviando mensagem:', novaMensagem);
    setNovaMensagem('');
  };

  const enviarTemplate = (template: Template) => {
    // Aqui integraria com API do WhatsApp
    console.log('Enviando template:', template);
    setShowTemplates(false);
  };

  const chatsFiltrados = chats.filter(chat =>
    chat.clienteNome.toLowerCase().includes(busca.toLowerCase()) ||
    chat.clienteTelefone.includes(busca)
  );

  const enviarOrcamento = () => {
    if (!novoOrcamento.servico || !novoOrcamento.valor) return;
    
    const mensagemOrcamento = `💰 *ORÇAMENTO SOLICITADO*

🚗 Veículo: ${chats.find(c => c.id === chatAtivo)?.veiculo}
🔧 Serviço: ${novoOrcamento.servico}
📝 Descrição: ${novoOrcamento.descricao}
💵 Valor: R$ ${novoOrcamento.valor}
⏰ Prazo: ${novoOrcamento.prazo}

${novoOrcamento.observacoes ? `📋 Observações: ${novoOrcamento.observacoes}` : ''}

*Aguardamos sua aprovação para iniciarmos o serviço!* ✅

Para aprovar, responda: "APROVADO"
Para mais informações, responda: "DÚVIDAS"`;

    console.log('Enviando orçamento:', mensagemOrcamento);
    
    // Reset form
    setNovoOrcamento({
      servico: '',
      descricao: '',
      valor: '',
      prazo: '',
      observacoes: ''
    });
    setShowNovoOrcamento(false);
  };

  const servicosComuns = [
    'Troca de óleo',
    'Alinhamento e balanceamento',
    'Revisão completa',
    'Troca de pastilhas de freio',
    'Diagnóstico eletrônico',
    'Embreagem',
    'Suspensão',
    'Sistema elétrico',
    'Ar condicionado',
    'Injeção eletrônica'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">WhatsApp Business</h1>
              <p className="text-sm text-gray-600">{user?.businessName || 'Oficina'}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
              <QrCodeIcon className="h-5 w-5 mr-2" />
              QR Code
            </button>
            <button className="bg-[#0047CC] hover:bg-[#0055EB] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
              <PlusIcon className="h-5 w-5 mr-2" />
              Nova Conversa
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar - Lista de Chats */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Busca */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar conversas..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* Lista de Chats */}
          <div className="flex-1 overflow-y-auto">
            {chatsFiltrados.map((chat) => (
              <motion.div
                key={chat.id}
                whileHover={{ backgroundColor: '#f3f4f6' }}
                onClick={() => setChatAtivo(chat.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                  chatAtivo === chat.id ? 'bg-green-50 border-l-4 border-l-green-500' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <Image
                      src={chat.avatar || ''}
                      alt={chat.clienteNome}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    {chat.naoLidas > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">{chat.naoLidas}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 truncate">{chat.clienteNome}</h3>
                      <span className="text-xs text-gray-500">{chat.horario}</span>
                    </div>
                    
                    <p className="text-sm text-gray-600 truncate mt-1">{chat.ultimaMensagem}</p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(chat.status)}`}>
                        {chat.status}
                      </span>
                      {chat.veiculo && (
                        <span className="text-xs text-gray-500">{chat.veiculo}</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Área de Chat */}
        <div className="flex-1 flex flex-col">
          {chatAtivo ? (
            <>
              {/* Header do Chat */}
              <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={chats.find(c => c.id === chatAtivo)?.avatar || ''}
                      alt="Cliente"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <h2 className="font-semibold text-gray-900">
                        {chats.find(c => c.id === chatAtivo)?.clienteNome}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {chats.find(c => c.id === chatAtivo)?.clienteTelefone}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <PhoneIcon className="h-5 w-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Mensagens */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {mensagens[chatAtivo]?.map((mensagem) => (
                  <motion.div
                    key={mensagem.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${mensagem.remetente === 'oficina' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      mensagem.remetente === 'oficina'
                        ? 'bg-green-500 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}>
                      <p className="whitespace-pre-wrap">{mensagem.conteudo}</p>
                      <div className={`flex items-center justify-between mt-1 ${
                        mensagem.remetente === 'oficina' ? 'text-green-100' : 'text-gray-500'
                      }`}>
                        <span className="text-xs">{mensagem.horario}</span>
                        {mensagem.remetente === 'oficina' && getStatusIcon(mensagem.status)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Input de Mensagem */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setShowTemplates(true)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                    title="Templates"
                  >
                    <DocumentTextIcon className="h-5 w-5" />
                  </button>
                  
                  <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                    <PhotoIcon className="h-5 w-5" />
                  </button>
                  
                  <button 
                    onClick={() => setShowNovoOrcamento(true)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                    title="Enviar Orçamento"
                  >
                    <LinkIcon className="h-5 w-5" />
                  </button>
                  
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Digite sua mensagem..."
                      value={novaMensagem}
                      onChange={(e) => setNovaMensagem(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && enviarMensagem()}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  
                  <button 
                    onClick={enviarMensagem}
                    disabled={!novaMensagem.trim()}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Tela Inicial */
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">WhatsApp Business</h3>
                <p className="text-gray-600 mb-6">Selecione uma conversa para começar a interagir com seus clientes</p>
                
                <div className="grid grid-cols-2 gap-4 max-w-md">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Conversas Ativas</h4>
                    <p className="text-2xl font-bold text-green-600">{chats.filter(c => c.status === 'nova' || c.status === 'aguardando').length}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Mensagens Não Lidas</h4>
                    <p className="text-2xl font-bold text-blue-600">{chats.reduce((acc, chat) => acc + chat.naoLidas, 0)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Orçamento */}
      <AnimatePresence>
        {showNovoOrcamento && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowNovoOrcamento(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Enviar Orçamento</h2>
                    <p className="text-gray-600">Para: {chats.find(c => c.id === chatAtivo)?.clienteNome}</p>
                  </div>
                  <button 
                    onClick={() => setShowNovoOrcamento(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <XMarkIcon className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Serviço */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Serviço *
                  </label>
                  <select
                    value={novoOrcamento.servico}
                    onChange={(e) => setNovoOrcamento({...novoOrcamento, servico: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Selecione o serviço</option>
                    {servicosComuns.map((servico) => (
                      <option key={servico} value={servico}>{servico}</option>
                    ))}
                  </select>
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={novoOrcamento.descricao}
                    onChange={(e) => setNovoOrcamento({...novoOrcamento, descricao: e.target.value})}
                    placeholder="Descreva detalhes do serviço..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                {/* Valor e Prazo */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor (R$) *
                    </label>
                    <div className="relative">
                      <CurrencyDollarIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        step="0.01"
                        value={novoOrcamento.valor}
                        onChange={(e) => setNovoOrcamento({...novoOrcamento, valor: e.target.value})}
                        placeholder="0,00"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prazo
                    </label>
                    <div className="relative">
                      <CalendarDaysIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={novoOrcamento.prazo}
                        onChange={(e) => setNovoOrcamento({...novoOrcamento, prazo: e.target.value})}
                        placeholder="Ex: 2 horas"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Observações */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações
                  </label>
                  <textarea
                    value={novoOrcamento.observacoes}
                    onChange={(e) => setNovoOrcamento({...novoOrcamento, observacoes: e.target.value})}
                    placeholder="Informações adicionais..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                {/* Preview */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Preview da Mensagem:</h4>
                  <div className="bg-white p-3 rounded-lg border text-sm">
                    <p className="whitespace-pre-wrap">
                      💰 <strong>ORÇAMENTO SOLICITADO</strong>
                      {'\n\n'}
                      🚗 Veículo: {chats.find(c => c.id === chatAtivo)?.veiculo}
                      {'\n'}
                      🔧 Serviço: {novoOrcamento.servico || '[Serviço]'}
                      {novoOrcamento.descricao && `\n📝 Descrição: ${novoOrcamento.descricao}`}
                      {'\n'}
                      💵 Valor: R$ {novoOrcamento.valor || '[Valor]'}
                      {novoOrcamento.prazo && `\n⏰ Prazo: ${novoOrcamento.prazo}`}
                      {novoOrcamento.observacoes && `\n\n📋 Observações: ${novoOrcamento.observacoes}`}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
                <button 
                  onClick={() => setShowNovoOrcamento(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={enviarOrcamento}
                  disabled={!novoOrcamento.servico || !novoOrcamento.valor}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
                >
                  <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                  Enviar Orçamento
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Templates */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowTemplates(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Templates de Mensagem</h2>
                <p className="text-gray-600">Escolha um template para enviar rapidamente</p>
              </div>
              
              <div className="p-6 space-y-4">
                {templates.map((template) => (
                  <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{template.nome}</h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{template.categoria}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 whitespace-pre-wrap">{template.conteudo}</p>
                    <button 
                      onClick={() => enviarTemplate(template)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Enviar Template
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 