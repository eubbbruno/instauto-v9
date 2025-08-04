"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  PlayCircleIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface FAQ {
  id: string;
  pergunta: string;
  resposta: string;
  categoria: string;
}

interface Ticket {
  id: string;
  assunto: string;
  status: 'aberto' | 'em-andamento' | 'resolvido' | 'fechado';
  data: string;
  ultimaResposta: string;
}

export default function SuportePage() {
  const [busca, setBusca] = useState('');
  const [faqAberta, setFaqAberta] = useState<string | null>(null);
  const [categoriaFAQ, setCategoriaFAQ] = useState('todas');
  const [novoTicket, setNovoTicket] = useState({
    assunto: '',
    categoria: '',
    descricao: '',
    prioridade: 'media'
  });
  const [showNovoTicket, setShowNovoTicket] = useState(false);

  const faqs: FAQ[] = [
    {
      id: '1',
      pergunta: 'Como agendar um serviço?',
      resposta: 'Para agendar um serviço, acesse "Buscar Oficinas", escolha uma oficina, selecione o serviço desejado e clique em "Agendar". Você pode escolher data e horário disponíveis.',
      categoria: 'agendamento'
    },
    {
      id: '2',
      pergunta: 'Como adicionar um novo veículo?',
      resposta: 'Vá até "Minha Garagem" e clique em "Adicionar Veículo". Preencha as informações como marca, modelo, ano e placa. Você pode adicionar uma foto também.',
      categoria: 'veiculos'
    },
    {
      id: '3',
      pergunta: 'Como cancelar um agendamento?',
      resposta: 'Acesse "Agendamentos", encontre o serviço que deseja cancelar e clique em "Cancelar". Atenção aos prazos de cancelamento de cada oficina.',
      categoria: 'agendamento'
    },
    {
      id: '4',
      pergunta: 'Posso alterar minha forma de pagamento?',
      resposta: 'Sim! Vá até "Pagamentos" para adicionar, remover ou alterar seus métodos de pagamento. Você pode cadastrar cartões, PIX ou outros métodos.',
      categoria: 'pagamento'
    },
    {
      id: '5',
      pergunta: 'Como avaliar uma oficina?',
      resposta: 'Após a conclusão do serviço, você receberá uma notificação para avaliar. Você também pode acessar "Histórico" e avaliar serviços anteriores.',
      categoria: 'avaliacao'
    },
    {
      id: '6',
      pergunta: 'Como encontrar oficinas próximas?',
      resposta: 'Use a função "Oficinas Próximas" no menu. O sistema usará sua localização para mostrar as oficinas mais próximas, com distância e avaliações.',
      categoria: 'busca'
    }
  ];

  const tickets: Ticket[] = [
    {
      id: 'T001',
      assunto: 'Problema com pagamento',
      status: 'em-andamento',
      data: '2024-01-20',
      ultimaResposta: 'Aguardando resposta da equipe financeira'
    },
    {
      id: 'T002',
      assunto: 'Dúvida sobre agendamento',
      status: 'resolvido',
      data: '2024-01-18',
      ultimaResposta: 'Problema resolvido com sucesso'
    }
  ];

  const faqsFiltradas = faqs.filter(faq => {
    const matchBusca = faq.pergunta.toLowerCase().includes(busca.toLowerCase()) ||
                      faq.resposta.toLowerCase().includes(busca.toLowerCase());
    const matchCategoria = categoriaFAQ === 'todas' || faq.categoria === categoriaFAQ;
    return matchBusca && matchCategoria;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aberto': return 'bg-blue-100 text-blue-800';
      case 'em-andamento': return 'bg-yellow-100 text-yellow-800';
      case 'resolvido': return 'bg-green-100 text-green-800';
      case 'fechado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui seria enviado o ticket
    console.log('Novo ticket:', novoTicket);
    setShowNovoTicket(false);
    setNovoTicket({
      assunto: '',
      categoria: '',
      descricao: '',
      prioridade: 'media'
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Central de Ajuda</h1>
        <p className="text-gray-600">
          Encontre respostas para suas dúvidas ou entre em contato conosco.
        </p>
      </div>

      {/* Canais de Atendimento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Chat Online</h3>
              <p className="text-sm text-gray-600">Resposta imediata</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium">Online agora</span>
            </div>
            <ChevronRightIcon className="h-5 w-5 text-gray-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <PhoneIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Telefone</h3>
              <p className="text-sm text-gray-600">(11) 4000-1234</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Seg-Sex: 8h às 18h</span>
            <ChevronRightIcon className="h-5 w-5 text-gray-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center mb-4">
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <EnvelopeIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Email</h3>
              <p className="text-sm text-gray-600">suporte@instauto.com</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Resposta em 24h</span>
            <ChevronRightIcon className="h-5 w-5 text-gray-400" />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQ */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Perguntas Frequentes</h3>
              
              {/* Busca e Filtros */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar dúvidas..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC]"
                  />
                </div>
                
                <select
                  value={categoriaFAQ}
                  onChange={(e) => setCategoriaFAQ(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC]"
                >
                  <option value="todas">Todas</option>
                  <option value="agendamento">Agendamento</option>
                  <option value="veiculos">Veículos</option>
                  <option value="pagamento">Pagamento</option>
                  <option value="avaliacao">Avaliação</option>
                  <option value="busca">Busca</option>
                </select>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {faqsFiltradas.map((faq, index) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => setFaqAberta(faqAberta === faq.id ? null : faq.id)}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{faq.pergunta}</span>
                      <ChevronDownIcon 
                        className={`h-5 w-5 text-gray-400 transition-transform ${
                          faqAberta === faq.id ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                    
                    {faqAberta === faq.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-gray-200 p-4 bg-gray-50"
                      >
                        <p className="text-gray-700">{faq.resposta}</p>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
              
              {faqsFiltradas.length === 0 && (
                <div className="text-center py-8">
                  <QuestionMarkCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma dúvida encontrada</h3>
                  <p className="text-gray-600">Tente buscar por outros termos ou categorias.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Meus Tickets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Meus Tickets</h3>
              <button
                onClick={() => setShowNovoTicket(true)}
                className="bg-[#0047CC] text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-[#0055EB] transition-colors"
              >
                Novo
              </button>
            </div>
            
            <div className="space-y-3">
              {tickets.map(ticket => (
                <div key={ticket.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">#{ticket.id}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{ticket.assunto}</h4>
                  <p className="text-sm text-gray-600">{ticket.ultimaResposta}</p>
                  <div className="flex items-center text-xs text-gray-500 mt-2">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    {new Date(ticket.data).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              ))}
              
              {tickets.length === 0 && (
                <div className="text-center py-4">
                  <DocumentTextIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Nenhum ticket aberto</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Links Úteis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Links Úteis</h3>
            
            <div className="space-y-3">
              <a href="#" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <DocumentTextIcon className="h-5 w-5 text-gray-600 mr-3" />
                <span className="text-gray-900">Termos de Uso</span>
              </a>
              
              <a href="#" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <DocumentTextIcon className="h-5 w-5 text-gray-600 mr-3" />
                <span className="text-gray-900">Política de Privacidade</span>
              </a>
              
              <a href="#" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <PlayCircleIcon className="h-5 w-5 text-gray-600 mr-3" />
                <span className="text-gray-900">Tutoriais em Vídeo</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal Novo Ticket */}
      {showNovoTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Novo Ticket de Suporte</h3>
            
            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assunto
                </label>
                <input
                  type="text"
                  value={novoTicket.assunto}
                  onChange={(e) => setNovoTicket({...novoTicket, assunto: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC]"
                  placeholder="Descreva brevemente o problema"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <select
                  value={novoTicket.categoria}
                  onChange={(e) => setNovoTicket({...novoTicket, categoria: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC]"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="tecnico">Problema Técnico</option>
                  <option value="pagamento">Pagamento</option>
                  <option value="agendamento">Agendamento</option>
                  <option value="conta">Conta e Perfil</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridade
                </label>
                <select
                  value={novoTicket.prioridade}
                  onChange={(e) => setNovoTicket({...novoTicket, prioridade: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC]"
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={novoTicket.descricao}
                  onChange={(e) => setNovoTicket({...novoTicket, descricao: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC]"
                  placeholder="Descreva detalhadamente o problema..."
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNovoTicket(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0047CC] text-white rounded-lg hover:bg-[#0055EB] transition-colors flex items-center"
                >
                  <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                  Enviar Ticket
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
} 