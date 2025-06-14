import { useState, useEffect, useCallback } from 'react';

// Interfaces
interface Mensagem {
  id: string;
  conversaId: string;
  remetenteId: string;
  remetenteTipo: 'motorista' | 'oficina';
  conteudo: string;
  tipo: 'texto' | 'imagem' | 'documento' | 'localizacao';
  arquivo?: {
    nome: string;
    url: string;
    tipo: string;
    tamanho: number;
  };
  lida: boolean;
  criadaEm: string;
  editadaEm?: string;
}

interface Conversa {
  id: string;
  motoristaId: string;
  oficinaId: string;
  agendamentoId?: string;
  status: 'ativa' | 'arquivada' | 'bloqueada';
  ultimaMensagem?: Mensagem;
  mensagensNaoLidas: number;
  criadaEm: string;
  atualizadaEm: string;
  
  // Informações dos participantes
  motorista: {
    id: string;
    nome: string;
    avatar?: string;
    online: boolean;
    ultimaVisualizacao?: string;
  };
  
  oficina: {
    id: string;
    nome: string;
    avatar?: string;
    online: boolean;
    ultimaVisualizacao?: string;
  };
}

const useMensagens = (usuarioId: string, usuarioTipo: 'motorista' | 'oficina') => {
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [mensagens, setMensagens] = useState<Record<string, Mensagem[]>>({});
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [conversaAtiva, setConversaAtiva] = useState<string | null>(null);

  // Simular dados iniciais
  useEffect(() => {
    const carregarDados = async () => {
      setCarregando(true);
      try {
        // Simulando delay de API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const conversasIniciais: Conversa[] = [
          {
            id: 'conv-1',
            motoristaId: 'motorista-1',
            oficinaId: 'oficina-1',
            agendamentoId: 'agend-1',
            status: 'ativa',
            mensagensNaoLidas: usuarioTipo === 'motorista' ? 2 : 0,
            criadaEm: '2024-01-15T10:00:00Z',
            atualizadaEm: '2024-01-15T14:30:00Z',
            motorista: {
              id: 'motorista-1',
              nome: 'João Silva',
              avatar: '/images/avatar1.jpg',
              online: true,
              ultimaVisualizacao: '2024-01-15T14:25:00Z'
            },
            oficina: {
              id: 'oficina-1',
              nome: 'Auto Center Silva',
              avatar: '/images/oficina1.jpg',
              online: true,
              ultimaVisualizacao: '2024-01-15T14:30:00Z'
            }
          },
          {
            id: 'conv-2',
            motoristaId: 'motorista-1',
            oficinaId: 'oficina-2',
            status: 'ativa',
            mensagensNaoLidas: usuarioTipo === 'motorista' ? 0 : 1,
            criadaEm: '2024-01-14T08:00:00Z',
            atualizadaEm: '2024-01-14T18:45:00Z',
            motorista: {
              id: 'motorista-1',
              nome: 'João Silva',
              avatar: '/images/avatar1.jpg',
              online: true
            },
            oficina: {
              id: 'oficina-2',
              nome: 'Mecânica Express 24h',
              avatar: '/images/oficina2.jpg',
              online: false,
              ultimaVisualizacao: '2024-01-14T18:45:00Z'
            }
          }
        ];

        const mensagensIniciais: Record<string, Mensagem[]> = {
          'conv-1': [
            {
              id: 'msg-1',
              conversaId: 'conv-1',
              remetenteId: 'motorista-1',
              remetenteTipo: 'motorista',
              conteudo: 'Olá! Gostaria de agendar uma revisão para o meu carro.',
              tipo: 'texto',
              lida: true,
              criadaEm: '2024-01-15T10:00:00Z'
            },
            {
              id: 'msg-2',
              conversaId: 'conv-1',
              remetenteId: 'oficina-1',
              remetenteTipo: 'oficina',
              conteudo: 'Olá João! Claro, podemos agendar sim. Qual é o modelo do seu carro?',
              tipo: 'texto',
              lida: true,
              criadaEm: '2024-01-15T10:05:00Z'
            },
            {
              id: 'msg-3',
              conversaId: 'conv-1',
              remetenteId: 'motorista-1',
              remetenteTipo: 'motorista',
              conteudo: 'É um Honda Civic 2020. Preciso fazer a revisão dos 40 mil km.',
              tipo: 'texto',
              lida: true,
              criadaEm: '2024-01-15T10:10:00Z'
            },
            {
              id: 'msg-4',
              conversaId: 'conv-1',
              remetenteId: 'oficina-1',
              remetenteTipo: 'oficina',
              conteudo: 'Perfeito! Temos disponibilidade para amanhã às 14:00. Te mando o orçamento.',
              tipo: 'texto',
              lida: usuarioTipo === 'oficina',
              criadaEm: '2024-01-15T14:25:00Z'
            },
            {
              id: 'msg-5',
              conversaId: 'conv-1',
              remetenteId: 'oficina-1',
              remetenteTipo: 'oficina',
              conteudo: 'Revisão 40mil km Honda Civic: R$ 350,00',
              tipo: 'texto',
              lida: usuarioTipo === 'oficina',
              criadaEm: '2024-01-15T14:30:00Z'
            }
          ],
          'conv-2': [
            {
              id: 'msg-6',
              conversaId: 'conv-2',
              remetenteId: 'motorista-1',
              remetenteTipo: 'motorista',
              conteudo: 'Obrigado pelo excelente serviço! Recomendo a oficina.',
              tipo: 'texto',
              lida: true,
              criadaEm: '2024-01-14T18:45:00Z'
            },
            {
              id: 'msg-7',
              conversaId: 'conv-2',
              remetenteId: 'oficina-2',
              remetenteTipo: 'oficina',
              conteudo: 'Muito obrigado pelo feedback! Ficamos à disposição sempre.',
              tipo: 'texto',
              lida: usuarioTipo === 'oficina',
              criadaEm: '2024-01-14T19:00:00Z'
            }
          ]
        };

        // Adicionar última mensagem a cada conversa
        conversasIniciais.forEach(conversa => {
          const mensagensConversa = mensagensIniciais[conversa.id];
          if (mensagensConversa && mensagensConversa.length > 0) {
            conversa.ultimaMensagem = mensagensConversa[mensagensConversa.length - 1];
          }
        });

        setConversas(conversasIniciais);
        setMensagens(mensagensIniciais);
        setCarregando(false);
      } catch (error) {
        setErro('Erro ao carregar mensagens');
        setCarregando(false);
      }
    };

    carregarDados();
  }, [usuarioId, usuarioTipo]);

  // Enviar mensagem
  const enviarMensagem = useCallback(async (
    conversaId: string, 
    conteudo: string, 
    tipo: 'texto' | 'imagem' | 'documento' = 'texto'
  ) => {
    try {
      const novaMensagem: Mensagem = {
        id: `msg-${Date.now()}`,
        conversaId,
        remetenteId: usuarioId,
        remetenteTipo: usuarioTipo,
        conteudo,
        tipo,
        lida: false,
        criadaEm: new Date().toISOString()
      };

      // Adicionar mensagem
      setMensagens(prev => ({
        ...prev,
        [conversaId]: [...(prev[conversaId] || []), novaMensagem]
      }));

      // Atualizar conversa
      setConversas(prev => prev.map(conversa => 
        conversa.id === conversaId 
          ? { 
              ...conversa, 
              ultimaMensagem: novaMensagem, 
              atualizadaEm: new Date().toISOString()
            }
          : conversa
      ));

      return { sucesso: true, mensagem: novaMensagem };
    } catch (error) {
      return { sucesso: false, erro: 'Erro ao enviar mensagem' };
    }
  }, [usuarioId, usuarioTipo]);

  // Marcar mensagens como lidas
  const marcarComoLida = useCallback((conversaId: string) => {
    setMensagens(prev => ({
      ...prev,
      [conversaId]: prev[conversaId]?.map(msg => 
        msg.remetenteId !== usuarioId ? { ...msg, lida: true } : msg
      ) || []
    }));

    setConversas(prev => prev.map(conversa => 
      conversa.id === conversaId 
        ? { ...conversa, mensagensNaoLidas: 0 }
        : conversa
    ));
  }, [usuarioId]);

  // Criar nova conversa
  const criarConversa = useCallback(async (
    outroUsuarioId: string, 
    outroUsuarioTipo: 'motorista' | 'oficina',
    outroUsuarioNome: string,
    agendamentoId?: string
  ) => {
    try {
      const novaConversa: Conversa = {
        id: `conv-${Date.now()}`,
        motoristaId: usuarioTipo === 'motorista' ? usuarioId : outroUsuarioId,
        oficinaId: usuarioTipo === 'oficina' ? usuarioId : outroUsuarioId,
        agendamentoId,
        status: 'ativa',
        mensagensNaoLidas: 0,
        criadaEm: new Date().toISOString(),
        atualizadaEm: new Date().toISOString(),
        motorista: {
          id: usuarioTipo === 'motorista' ? usuarioId : outroUsuarioId,
          nome: usuarioTipo === 'motorista' ? 'Você' : outroUsuarioNome,
          online: true
        },
        oficina: {
          id: usuarioTipo === 'oficina' ? usuarioId : outroUsuarioId,
          nome: usuarioTipo === 'oficina' ? 'Você' : outroUsuarioNome,
          online: true
        }
      };

      setConversas(prev => [novaConversa, ...prev]);
      setMensagens(prev => ({ ...prev, [novaConversa.id]: [] }));
      
      return { sucesso: true, conversa: novaConversa };
    } catch (error) {
      return { sucesso: false, erro: 'Erro ao criar conversa' };
    }
  }, [usuarioId, usuarioTipo]);

  // Arquivar conversa
  const arquivarConversa = useCallback((conversaId: string) => {
    setConversas(prev => prev.map(conversa => 
      conversa.id === conversaId 
        ? { ...conversa, status: 'arquivada' }
        : conversa
    ));
  }, []);

  // Obter mensagens de uma conversa
  const obterMensagens = useCallback((conversaId: string) => {
    return mensagens[conversaId] || [];
  }, [mensagens]);

  // Obter total de mensagens não lidas
  const totalNaoLidas = conversas.reduce((total, conversa) => 
    total + conversa.mensagensNaoLidas, 0
  );

  return {
    conversas: conversas.filter(c => c.status === 'ativa'),
    conversasArquivadas: conversas.filter(c => c.status === 'arquivada'),
    mensagens,
    carregando,
    erro,
    conversaAtiva,
    totalNaoLidas,
    
    // Ações
    setConversaAtiva,
    enviarMensagem,
    marcarComoLida,
    criarConversa,
    arquivarConversa,
    obterMensagens
  };
};

export default useMensagens; 