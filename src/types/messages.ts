// ===== INTERFACES DE MENSAGENS =====
export interface Mensagem {
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

export interface Conversa {
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

export interface StatusOnline {
  userId: string;
  userTipo: 'motorista' | 'oficina';
  online: boolean;
  ultimaVisualizacao: string;
}

// ===== INTERFACES DE NOTIFICAÇÕES =====
export interface Notificacao {
  id: string;
  usuarioId: string;
  userTipo: 'motorista' | 'oficina';
  tipo: 'mensagem' | 'agendamento' | 'avaliacao' | 'promocao' | 'sistema';
  titulo: string;
  conteudo: string;
  dados?: Record<string, any>; // Dados adicionais específicos do tipo
  lida: boolean;
  criadaEm: string;
  expiresEm?: string;
} 