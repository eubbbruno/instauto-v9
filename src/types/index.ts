// Interface compartilhada para dados de Oficina
export interface Oficina {
  id: string;
  nome: string;
  endereco: string;
  latitude: number;
  longitude: number;
  avaliacao: number;
  distancia: number;
  totalAvaliacoes: number;
  servicos: string[];
  horarios: {
    aberto: boolean;
    fechaAs?: string;
    abreAs?: string;
  };
  aceitaAgendamento: boolean;
  aceitaEmergencia: boolean;
  precoMedio: string;
  imagem: string;
  tempoResposta: string;
  especialidades: string[];
  tiposVeiculo: string[];
  certificacoes: string[];
  meioPagamento: string[];
  tempoDiagnostico: number;  // em minutos
  garantia: boolean;
  garantiaPeriodo?: string;
}

// Interface para dados parciais de Oficina (para componentes que não precisam de todos os campos)
export interface OficinaBase {
  id: string;
  nome: string;
  endereco: string;
  avaliacao: number;
  telefone: string;
  cidade: string;
  estado: string;
}

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