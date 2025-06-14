// Utilitário centralizado para chamadas de API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    total: number;
    pagina: number;
    limite: number;
    totalPaginas: number;
  };
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

async function apiRequest<T = any>(
  endpoint: string, 
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, headers = {} } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include', // Inclui cookies automaticamente
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Erro HTTP: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
}

// ===== AUTH API =====
export const authApi = {
  login: (email: string, senha: string, tipo: 'motorista' | 'oficina') =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: { email, senha, tipo }
    }),

  register: (userData: any) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: userData
    }),

  logout: () =>
    apiRequest('/auth/logout', { method: 'POST' }),

  getMe: () =>
    apiRequest('/auth/me'),
};

// ===== OFICINAS API =====
export const oficinasApi = {
  list: (params?: {
    cidade?: string;
    servico?: string;
    avaliacao?: number;
    limite?: number;
    pagina?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const queryString = searchParams.toString();
    return apiRequest(`/oficinas${queryString ? `?${queryString}` : ''}`);
  },

  get: (id: string) =>
    apiRequest(`/oficinas/${id}`),

  create: (oficinaData: any) =>
    apiRequest('/oficinas', {
      method: 'POST',
      body: oficinaData
    }),

  update: (id: string, oficinaData: any) =>
    apiRequest(`/oficinas/${id}`, {
      method: 'PUT',
      body: oficinaData
    }),

  delete: (id: string) =>
    apiRequest(`/oficinas/${id}`, { method: 'DELETE' }),
};

// ===== AGENDAMENTOS API =====
export const agendamentosApi = {
  list: (params?: {
    status?: string;
    oficinaId?: string;
    limite?: number;
    pagina?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const queryString = searchParams.toString();
    return apiRequest(`/agendamentos${queryString ? `?${queryString}` : ''}`);
  },

  get: (id: string) =>
    apiRequest(`/agendamentos/${id}`),

  create: (agendamentoData: {
    oficinaId: string;
    veiculoId: string;
    servico: string;
    descricaoProblema: string;
    dataAgendamento: string;
    observacoes?: string;
  }) =>
    apiRequest('/agendamentos', {
      method: 'POST',
      body: agendamentoData
    }),

  update: (id: string, agendamentoData: any) =>
    apiRequest(`/agendamentos/${id}`, {
      method: 'PUT',
      body: agendamentoData
    }),

  cancel: (id: string) =>
    apiRequest(`/agendamentos/${id}`, { method: 'DELETE' }),
};

// ===== HELPER FUNCTIONS =====
export const handleApiError = (error: any): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Erro desconhecido';
};

export const isAuthError = (error: any): boolean => {
  return error?.message?.includes('Token') || error?.message?.includes('401');
};

// Export default
export default {
  auth: authApi,
  oficinas: oficinasApi,
  agendamentos: agendamentosApi,
  handleApiError,
  isAuthError,
}; 