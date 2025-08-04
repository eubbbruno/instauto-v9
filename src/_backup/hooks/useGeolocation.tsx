import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
  loading: boolean;
  timestamp: number | null;
  address: string | null;
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  getAddress?: boolean;
}

const useGeolocation = (options: GeolocationOptions = {}) => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    loading: true,
    timestamp: null,
    address: null
  });

  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
    getAddress: true,
    ...options
  };

  // Função para obter o endereço a partir das coordenadas (geocoding reverso)
  const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'pt-BR' } }
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        return data.display_name;
      }
      return null;
    } catch (error) {
      console.error('Erro ao obter endereço:', error);
      return null;
    }
  };

  // Função para obter a localização atual
  const getCurrentPosition = () => {
    setState(prev => ({ ...prev, loading: true }));

    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocalização não é suportada pelo seu navegador',
        loading: false
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        let address = null;

        if (defaultOptions.getAddress) {
          address = await getAddressFromCoordinates(latitude, longitude);
        }

        setState({
          latitude,
          longitude,
          accuracy,
          error: null,
          loading: false,
          timestamp: position.timestamp,
          address
        });
      },
      (error) => {
        let errorMessage = 'Erro desconhecido ao obter localização';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Acesso à localização foi negado pelo usuário';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Informações de localização indisponíveis';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tempo esgotado ao tentar obter localização';
            break;
        }

        setState(prev => ({
          ...prev,
          error: errorMessage,
          loading: false
        }));
      },
      defaultOptions
    );
  };

  // Efetua a busca automaticamente ao montar o componente
  useEffect(() => {
    getCurrentPosition();
  }, []);

  return {
    ...state,
    getCurrentPosition,
    // Função para calcular a distância entre dois pontos (em km)
    calculateDistance: (targetLat: number, targetLon: number) => {
      if (!state.latitude || !state.longitude) return null;
      
      // Fórmula de Haversine para calcular distância entre coordenadas
      const toRad = (value: number) => (value * Math.PI) / 180;
      const R = 6371; // Raio da Terra em km
      
      const dLat = toRad(targetLat - state.latitude);
      const dLon = toRad(targetLon - state.longitude);
      
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(state.latitude)) * Math.cos(toRad(targetLat)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distância em km
      
      return parseFloat(distance.toFixed(1));
    }
  };
};

export default useGeolocation; 