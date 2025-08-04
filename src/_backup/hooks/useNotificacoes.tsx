import { useState, useEffect, useCallback } from 'react';

interface Notificacao {
  id: string;
  tipo: 'agendamento' | 'mensagem' | 'promocao' | 'sistema' | 'avaliacao';
  titulo: string;
  conteudo: string;
  lida: boolean;
  criadaEm: string;
  dados?: Record<string, any>;
  icone?: string;
  cor?: string;
}

const useNotificacoes = () => {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Carregar notificações do localStorage
  useEffect(() => {
    const notificacoesStorage = localStorage.getItem('notificacoes');
    if (notificacoesStorage) {
      try {
        const notificacoesParsed = JSON.parse(notificacoesStorage);
        setNotificacoes(notificacoesParsed);
      } catch (error) {
        console.error('Erro ao carregar notificações:', error);
      }
    } else {
      // Notificações iniciais de exemplo
      const notificacoesIniciais: Notificacao[] = [
        {
          id: '1',
          tipo: 'agendamento',
          titulo: 'Agendamento confirmado',
          conteudo: 'Seu agendamento na Auto Center Silva foi confirmado para amanhã às 14:00',
          lida: false,
          criadaEm: new Date().toISOString(),
          dados: { agendamentoId: 'ag-1', oficinaId: 'of-1' },
          icone: '📅',
          cor: 'blue'
        },
        {
          id: '2',
          tipo: 'mensagem',
          titulo: 'Nova mensagem',
          conteudo: 'Auto Center Silva enviou uma mensagem sobre seu agendamento',
          lida: false,
          criadaEm: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min atrás
          dados: { conversaId: 'conv-1', oficinaId: 'of-1' },
          icone: '💬',
          cor: 'green'
        },
        {
          id: '3',
          tipo: 'promocao',
          titulo: 'Oferta especial!',
          conteudo: 'Mecânica Express está oferecendo 20% de desconto em revisões',
          lida: true,
          criadaEm: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h atrás
          dados: { oficinaId: 'of-2', promocaoId: 'promo-1' },
          icone: '🎉',
          cor: 'yellow'
        }
      ];
      setNotificacoes(notificacoesIniciais);
    }
    setCarregando(false);
  }, []);

  // Salvar notificações no localStorage
  useEffect(() => {
    if (!carregando) {
      localStorage.setItem('notificacoes', JSON.stringify(notificacoes));
    }
  }, [notificacoes, carregando]);

  // Adicionar nova notificação
  const adicionarNotificacao = useCallback((notificacao: Omit<Notificacao, 'id' | 'criadaEm' | 'lida'>) => {
    const novaNotificacao: Notificacao = {
      ...notificacao,
      id: Date.now().toString(),
      criadaEm: new Date().toISOString(),
      lida: false
    };

    setNotificacoes(prev => [novaNotificacao, ...prev]);
    
    // Mostrar notificação do navegador se permitido
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notificacao.titulo, {
        body: notificacao.conteudo,
        icon: '/favicon.ico'
      });
    }

    return novaNotificacao;
  }, []);

  // Marcar como lida
  const marcarComoLida = useCallback((id: string) => {
    setNotificacoes(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, lida: true } : notif
      )
    );
  }, []);

  // Marcar todas como lidas
  const marcarTodasComoLidas = useCallback(() => {
    setNotificacoes(prev => 
      prev.map(notif => ({ ...notif, lida: true }))
    );
  }, []);

  // Remover notificação
  const removerNotificacao = useCallback((id: string) => {
    setNotificacoes(prev => prev.filter(notif => notif.id !== id));
  }, []);

  // Limpar todas as notificações
  const limparTodas = useCallback(() => {
    setNotificacoes([]);
  }, []);

  // Solicitar permissão para notificações
  const solicitarPermissaoNotificacao = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  // Notificações específicas por tipo
  const criarNotificacaoAgendamento = useCallback((
    titulo: string, 
    conteudo: string, 
    agendamentoId: string, 
    oficinaId: string
  ) => {
    return adicionarNotificacao({
      tipo: 'agendamento',
      titulo,
      conteudo,
      dados: { agendamentoId, oficinaId },
      icone: '📅',
      cor: 'blue'
    });
  }, [adicionarNotificacao]);

  const criarNotificacaoMensagem = useCallback((
    titulo: string, 
    conteudo: string, 
    conversaId: string, 
    remetenteId: string
  ) => {
    return adicionarNotificacao({
      tipo: 'mensagem',
      titulo,
      conteudo,
      dados: { conversaId, remetenteId },
      icone: '💬',
      cor: 'green'
    });
  }, [adicionarNotificacao]);

  const criarNotificacaoPromocao = useCallback((
    titulo: string, 
    conteudo: string, 
    oficinaId: string, 
    promocaoId?: string
  ) => {
    return adicionarNotificacao({
      tipo: 'promocao',
      titulo,
      conteudo,
      dados: { oficinaId, promocaoId },
      icone: '🎉',
      cor: 'yellow'
    });
  }, [adicionarNotificacao]);

  const criarNotificacaoSistema = useCallback((
    titulo: string, 
    conteudo: string, 
    dados?: Record<string, any>
  ) => {
    return adicionarNotificacao({
      tipo: 'sistema',
      titulo,
      conteudo,
      dados,
      icone: '🔔',
      cor: 'gray'
    });
  }, [adicionarNotificacao]);

  // Estatísticas
  const naoLidas = notificacoes.filter(n => !n.lida).length;
  const porTipo = notificacoes.reduce((acc, notif) => {
    acc[notif.tipo] = (acc[notif.tipo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Formatação de tempo
  const formatarTempo = useCallback((timestamp: string) => {
    const agora = new Date();
    const data = new Date(timestamp);
    const diffMs = agora.getTime() - data.getTime();
    const diffMinutos = Math.floor(diffMs / (1000 * 60));
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutos < 1) return 'Agora';
    if (diffMinutos < 60) return `${diffMinutos}m atrás`;
    if (diffHoras < 24) return `${diffHoras}h atrás`;
    if (diffDias < 7) return `${diffDias}d atrás`;
    return data.toLocaleDateString('pt-BR');
  }, []);

  return {
    notificacoes,
    carregando,
    naoLidas,
    porTipo,
    
    // Ações
    adicionarNotificacao,
    marcarComoLida,
    marcarTodasComoLidas,
    removerNotificacao,
    limparTodas,
    solicitarPermissaoNotificacao,
    
    // Helpers específicos
    criarNotificacaoAgendamento,
    criarNotificacaoMensagem,
    criarNotificacaoPromocao,
    criarNotificacaoSistema,
    formatarTempo
  };
};

export default useNotificacoes; 