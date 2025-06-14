import { useState, useCallback } from 'react';
import { agendamentosApi, handleApiError } from '@/utils/api';
import { 
  Agendamento, 
  AgendamentoFilters, 
  CreateAgendamentoRequest,
  UpdateAgendamentoRequest,
  ApiListState, 
  ApiState 
} from '@/types/api';

export const useAgendamentos = () => {
  const [listState, setListState] = useState<ApiListState<Agendamento>>({
    data: [],
    meta: null,
    loading: false,
    error: null,
  });

  const [singleState, setSingleState] = useState<ApiState<Agendamento>>({
    data: null,
    loading: false,
    error: null,
  });

  // Buscar lista de agendamentos
  const fetchAgendamentos = useCallback(async (filters?: AgendamentoFilters) => {
    try {
      setListState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await agendamentosApi.list(filters);
      
      setListState({
        data: response.data || [],
        meta: response.meta || null,
        loading: false,
        error: null,
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = handleApiError(error);
      
      setListState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      return { success: false, error: errorMessage };
    }
  }, []);

  // Buscar agendamento específico
  const fetchAgendamento = useCallback(async (id: string) => {
    try {
      setSingleState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await agendamentosApi.get(id);
      
      setSingleState({
        data: response.data,
        loading: false,
        error: null,
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = handleApiError(error);
      
      setSingleState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      return { success: false, error: errorMessage };
    }
  }, []);

  // Criar novo agendamento
  const createAgendamento = useCallback(async (agendamentoData: CreateAgendamentoRequest) => {
    try {
      const response = await agendamentosApi.create(agendamentoData);
      
      // Atualizar lista local
      setListState(prev => ({
        ...prev,
        data: [response.data, ...prev.data],
      }));

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = handleApiError(error);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Atualizar agendamento
  const updateAgendamento = useCallback(async (id: string, agendamentoData: UpdateAgendamentoRequest) => {
    try {
      const response = await agendamentosApi.update(id, agendamentoData);
      
      // Atualizar lista local
      setListState(prev => ({
        ...prev,
        data: prev.data.map(agendamento => 
          agendamento.id === id ? response.data : agendamento
        ),
      }));

      // Atualizar estado single se for o mesmo agendamento
      setSingleState(prev => 
        prev.data?.id === id 
          ? { ...prev, data: response.data }
          : prev
      );

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = handleApiError(error);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Cancelar agendamento
  const cancelAgendamento = useCallback(async (id: string) => {
    try {
      await agendamentosApi.cancel(id);
      
      // Atualizar status na lista local
      setListState(prev => ({
        ...prev,
        data: prev.data.map(agendamento => 
          agendamento.id === id 
            ? { ...agendamento, status: 'cancelado' }
            : agendamento
        ),
      }));

      // Atualizar estado single se for o mesmo agendamento
      setSingleState(prev => 
        prev.data?.id === id 
          ? { ...prev, data: { ...prev.data, status: 'cancelado' } }
          : prev
      );

      return { success: true };
    } catch (error) {
      const errorMessage = handleApiError(error);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Filtrar agendamentos por status
  const getAgendamentosByStatus = useCallback((status: string) => {
    return listState.data.filter(agendamento => agendamento.status === status);
  }, [listState.data]);

  // Verificar se pode cancelar agendamento
  const canCancelAgendamento = useCallback((agendamento: Agendamento) => {
    const statusCancelaveis = ['agendado', 'confirmado'];
    const dataAgendamento = new Date(agendamento.dataAgendamento);
    const agora = new Date();
    const diferencaHoras = (dataAgendamento.getTime() - agora.getTime()) / (1000 * 60 * 60);
    
    return statusCancelaveis.includes(agendamento.status) && diferencaHoras > 2; // 2 horas de antecedência
  }, []);

  // Verificar se pode editar agendamento
  const canEditAgendamento = useCallback((agendamento: Agendamento) => {
    const statusEditaveis = ['agendado'];
    const dataAgendamento = new Date(agendamento.dataAgendamento);
    const agora = new Date();
    const diferencaHoras = (dataAgendamento.getTime() - agora.getTime()) / (1000 * 60 * 60);
    
    return statusEditaveis.includes(agendamento.status) && diferencaHoras > 24; // 24 horas de antecedência
  }, []);

  // Obter próximos agendamentos
  const getProximosAgendamentos = useCallback((limite: number = 5) => {
    const agora = new Date();
    return listState.data
      .filter(agendamento => {
        const dataAgendamento = new Date(agendamento.dataAgendamento);
        return dataAgendamento > agora && agendamento.status !== 'cancelado';
      })
      .sort((a, b) => 
        new Date(a.dataAgendamento).getTime() - new Date(b.dataAgendamento).getTime()
      )
      .slice(0, limite);
  }, [listState.data]);

  return {
    // Estados
    agendamentos: listState.data,
    agendamento: singleState.data,
    loading: listState.loading || singleState.loading,
    error: listState.error || singleState.error,
    meta: listState.meta,
    
    // Ações
    fetchAgendamentos,
    fetchAgendamento,
    createAgendamento,
    updateAgendamento,
    cancelAgendamento,
    
    // Helpers
    getAgendamentosByStatus,
    canCancelAgendamento,
    canEditAgendamento,
    getProximosAgendamentos,
  };
}; 