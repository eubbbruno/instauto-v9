// Tipos para as entidades da API

export interface Usuario {
  id: string;
  email: string;
  nome: string;
  tipo: 'motorista' | 'oficina';
  telefone?: string;
  criadoEm: string;
  atualizadoEm?: string;
}

export interface Motorista extends Usuario {
  tipo: 'motorista';
  cpf?: string;
  dataNascimento?: string;
}

export interface Oficina extends Usuario {
  tipo: 'oficina';
  cnpj: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  coordenadas: {
    lat: number;
    lng: number;
  };
  servicos: string[];
  avaliacoes: {
    media: number;
    total: number;
  };
  horarioFuncionamento: {
    [key: string]: string; // ex: "segunda": "08:00-18:00"
  };
  ativa: boolean;
  criadaEm: string;
}

export interface Veiculo {
  id: string;
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
  cor?: string;
  combustivel?: string;
  quilometragem?: number;
  motoristaId: string;
  criadoEm: string;
  atualizadoEm?: string;
}

export interface Agendamento {
  id: string;
  motoristaId: string;
  oficinaId: string;
  veiculo: {
    id: string;
    marca: string;
    modelo: string;
    ano: number;
    placa: string;
  };
  servico: string;
  descricaoProblema: string;
  dataAgendamento: string;
  status: AgendamentoStatus;
  valorEstimado?: number;
  valorFinal?: number;
  observacoes?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export type AgendamentoStatus = 
  | 'agendado' 
  | 'confirmado' 
  | 'em_andamento' 
  | 'concluido' 
  | 'cancelado';

export interface Avaliacao {
  id: string;
  agendamentoId: string;
  motoristaId: string;
  oficinaId: string;
  nota: number; // 1-5
  comentario?: string;
  criadaEm: string;
}

export interface OrdemServico {
  id: string;
  agendamentoId: string;
  numero: string;
  status: OrdemServicoStatus;
  itens: ItemOrdemServico[];
  valorTotal: number;
  observacoes?: string;
  criadaEm: string;
  atualizadaEm: string;
}

export type OrdemServicoStatus = 
  | 'aberta' 
  | 'em_andamento' 
  | 'pausada' 
  | 'concluida' 
  | 'cancelada';

export interface ItemOrdemServico {
  id: string;
  tipo: 'servico' | 'peca';
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

// Tipos para requests da API
export interface LoginRequest {
  email: string;
  senha: string;
  tipo: 'motorista' | 'oficina';
}

export interface RegisterRequest {
  email: string;
  senha: string;
  nome: string;
  tipo: 'motorista' | 'oficina';
  telefone?: string;
  // Campos específicos para motorista
  cpf?: string;
  dataNascimento?: string;
  // Campos específicos para oficina
  cnpj?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  servicos?: string[];
}

export interface CreateAgendamentoRequest {
  oficinaId: string;
  veiculoId: string;
  servico: string;
  descricaoProblema: string;
  dataAgendamento: string;
  observacoes?: string;
}

export interface UpdateAgendamentoRequest {
  status?: AgendamentoStatus;
  valorEstimado?: number;
  valorFinal?: number;
  observacoes?: string;
}

// Tipos para responses da API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: Usuario;
  token: string;
}

// Tipos para filtros de busca
export interface OficinaFilters {
  cidade?: string;
  servico?: string;
  avaliacao?: number;
  limite?: number;
  pagina?: number;
}

export interface AgendamentoFilters {
  status?: AgendamentoStatus;
  oficinaId?: string;
  limite?: number;
  pagina?: number;
}

// Estados de carregamento para hooks
export interface LoadingState {
  loading: boolean;
  error: string | null;
}

export interface ApiState<T> extends LoadingState {
  data: T | null;
}

export interface ApiListState<T> extends LoadingState {
  data: T[];
  meta: PaginationMeta | null;
} 