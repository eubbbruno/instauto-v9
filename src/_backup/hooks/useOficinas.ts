import { useState, useCallback } from 'react';
import { oficinasApi, handleApiError } from '@/utils/api';
import { Oficina, OficinaFilters, ApiListState, ApiState } from '@/types/api';

export const useOficinas = () => {
  const [listState, setListState] = useState<ApiListState<Oficina>>({
    data: [],
    meta: null,
    loading: false,
    error: null,
  });

  const [singleState, setSingleState] = useState<ApiState<Oficina>>({
    data: null,
    loading: false,
    error: null,
  });

  // Buscar lista de oficinas
  const fetchOficinas = useCallback(async (filters?: OficinaFilters) => {
    try {
      setListState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await oficinasApi.list(filters);
      
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

  // Buscar oficina específica
  const fetchOficina = useCallback(async (id: string) => {
    try {
      setSingleState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await oficinasApi.get(id);
      
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

  // Criar nova oficina
  const createOficina = useCallback(async (oficinaData: any) => {
    try {
      const response = await oficinasApi.create(oficinaData);
      
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

  // Atualizar oficina
  const updateOficina = useCallback(async (id: string, oficinaData: any) => {
    try {
      const response = await oficinasApi.update(id, oficinaData);
      
      // Atualizar lista local
      setListState(prev => ({
        ...prev,
        data: prev.data.map(oficina => 
          oficina.id === id ? response.data : oficina
        ),
      }));

      // Atualizar estado single se for a mesma oficina
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

  // Deletar oficina
  const deleteOficina = useCallback(async (id: string) => {
    try {
      await oficinasApi.delete(id);
      
      // Remover da lista local
      setListState(prev => ({
        ...prev,
        data: prev.data.filter(oficina => oficina.id !== id),
      }));

      return { success: true };
    } catch (error) {
      const errorMessage = handleApiError(error);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Buscar oficinas próximas (baseado em coordenadas)
  const findNearbyOficinas = useCallback(async (
    lat: number, 
    lng: number, 
    raio: number = 10
  ) => {
    try {
      setListState(prev => ({ ...prev, loading: true, error: null }));
      
      // TODO: Implementar busca por proximidade na API
      // Por enquanto, buscar todas e filtrar no frontend
      const response = await oficinasApi.list();
      
      // Calcular distância usando fórmula haversine (simplificada)
      const oficinasProximas = response.data?.filter((oficina: Oficina) => {
        const distance = calculateDistance(
          lat, lng, 
          oficina.coordenadas.lat, 
          oficina.coordenadas.lng
        );
        return distance <= raio;
      }) || [];

      setListState({
        data: oficinasProximas,
        meta: null,
        loading: false,
        error: null,
      });

      return { success: true, data: oficinasProximas };
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

  return {
    // Estados
    oficinas: listState.data,
    oficina: singleState.data,
    loading: listState.loading || singleState.loading,
    error: listState.error || singleState.error,
    meta: listState.meta,
    
    // Ações
    fetchOficinas,
    fetchOficina,
    createOficina,
    updateOficina,
    deleteOficina,
    findNearbyOficinas,
  };
};

// Função auxiliar para calcular distância
function calculateDistance(
  lat1: number, lng1: number, 
  lat2: number, lng2: number
): number {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
} 