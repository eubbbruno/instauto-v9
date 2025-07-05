"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { OficinaBase } from '@/types';
import useGeolocation from '@/hooks/useGeolocation';

interface GoogleMapViewProps {
  oficinas: OficinaBase[];
  height?: string;
  width?: string;
  className?: string;
  onOficinaSelecionada?: (oficina: OficinaBase) => void;
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
}

// Função para criar ícone personalizado da oficina
const createOficinaIcon = (isSelected: boolean = false) => {
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 0C8.954 0 0 8.954 0 20c0 20 20 30 20 30s20-10 20-30C40 8.954 31.046 0 20 0z" fill="${isSelected ? '#FFDE59' : '#0047CC'}"/>
        <circle cx="20" cy="20" r="12" fill="white"/>
        <path d="M15 15h2v5h3v2h-5v-7zm0-3h5v2h-5v-2z" fill="${isSelected ? '#0047CC' : '#0047CC'}"/>
      </svg>
    `)}`,
    scaledSize: new google.maps.Size(40, 50),
    anchor: new google.maps.Point(20, 50)
  };
};

// Função para criar ícone personalizado do usuário
const createUserIcon = () => {
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
        <circle cx="15" cy="15" r="15" fill="#FFDE59" stroke="#0047CC" stroke-width="3"/>
        <circle cx="15" cy="15" r="8" fill="#0047CC"/>
        <circle cx="15" cy="15" r="3" fill="white"/>
      </svg>
    `)}`,
    scaledSize: new google.maps.Size(30, 30),
    anchor: new google.maps.Point(15, 15)
  };
};

export default function GoogleMapView({
  oficinas = [],
  height = '400px',
  width = '100%',
  className = '',
  onOficinaSelecionada,
  centerLat,
  centerLng,
  zoom = 13
}: GoogleMapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);
  const [selectedOficina, setSelectedOficina] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { latitude, longitude, error: geoError, loading: geoLoading } = useGeolocation();

  // Inicializar Google Maps
  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
          version: 'weekly',
          libraries: ['places', 'geometry']
        });

        await loader.load();

        if (!mapRef.current) return;

        const center = {
          lat: centerLat || latitude || -23.5505,
          lng: centerLng || longitude || -46.6333
        };

        const mapInstance = new google.maps.Map(mapRef.current, {
          center,
          zoom,
          styles: [
            {
              "featureType": "poi",
              "elementType": "labels",
              "stylers": [{ "visibility": "off" }]
            }
          ],
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          gestureHandling: 'greedy'
        });

        setMap(mapInstance);
        
        const infoWindowInstance = new google.maps.InfoWindow();
        setInfoWindow(infoWindowInstance);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Erro ao carregar Google Maps:', err);
        setError('Erro ao carregar o mapa. Tente recarregar a página.');
        setIsLoading(false);
      }
    };

    initMap();
  }, [centerLat, centerLng, latitude, longitude, zoom]);

  // Limpar marcadores
  const clearMarkers = useCallback(() => {
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);
  }, [markers]);

  // Adicionar marcador do usuário
  useEffect(() => {
    if (!map || !latitude || !longitude) return;

    const userMarker = new google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map,
      icon: createUserIcon(),
      title: 'Sua localização',
      zIndex: 1000
    });

    // Círculo de raio de busca
    const searchCircle = new google.maps.Circle({
      center: { lat: latitude, lng: longitude },
      radius: 10000, // 10km
      strokeColor: '#0047CC',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#0047CC',
      fillOpacity: 0.1,
      map
    });

    return () => {
      userMarker.setMap(null);
      searchCircle.setMap(null);
    };
  }, [map, latitude, longitude]);

  // Adicionar marcadores das oficinas
  useEffect(() => {
    if (!map || !oficinas.length) return;

    clearMarkers();

    const newMarkers = oficinas.map((oficina) => {
      const marker = new google.maps.Marker({
        position: { lat: oficina.latitude, lng: oficina.longitude },
        map,
        icon: createOficinaIcon(selectedOficina === oficina.id),
        title: oficina.nome,
        animation: google.maps.Animation.DROP
      });

      marker.addListener('click', () => {
        if (infoWindow) {
          const content = `
            <div class="p-4 max-w-sm">
              <h3 class="text-lg font-bold text-gray-900 mb-1">${oficina.nome}</h3>
              <div class="flex items-center mb-2">
                ${Array.from({length: 5}, (_, i) => 
                  `<svg class="w-4 h-4 ${i < Math.floor(oficina.avaliacao) ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>`
                ).join('')}
                <span class="ml-1 text-sm text-gray-600">${oficina.avaliacao.toFixed(1)}</span>
              </div>
              <p class="text-sm text-gray-600 mb-2">${oficina.endereco}</p>
              ${oficina.distancia ? `<p class="text-xs text-blue-600 font-medium mb-3">${oficina.distancia.toFixed(1)}km de distância</p>` : ''}
              <div class="flex space-x-2">
                <button 
                  onclick="window.open('tel:${oficina.telefone}', '_self')"
                  class="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Ligar
                </button>
                <button 
                  onclick="document.dispatchEvent(new CustomEvent('selectOficina', { detail: '${oficina.id}' }))"
                  class="flex-1 bg-yellow-500 text-gray-900 px-3 py-2 rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors"
                >
                  Ver Detalhes
                </button>
              </div>
            </div>
          `;

          infoWindow.setContent(content);
          infoWindow.open(map, marker);
          setSelectedOficina(oficina.id);
          
          // Atualizar ícone para destacar oficina selecionada
          marker.setIcon(createOficinaIcon(true));
        }
      });

      return marker;
    });

    setMarkers(newMarkers);

    // Ajustar bounds para mostrar todas as oficinas
    if (newMarkers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      
      if (latitude && longitude) {
        bounds.extend({ lat: latitude, lng: longitude });
      }
      
      newMarkers.forEach(marker => {
        const position = marker.getPosition();
        if (position) {
          bounds.extend(position);
        }
      });

      map.fitBounds(bounds);
      
      // Garantir zoom mínimo
      google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
        if (map.getZoom()! > 15) {
          map.setZoom(15);
        }
      });
    }

    return () => clearMarkers();
  }, [map, oficinas, selectedOficina, infoWindow, latitude, longitude, clearMarkers]);

  // Listener para evento customizado de seleção de oficina
  useEffect(() => {
    const handleSelectOficina = (event: CustomEvent) => {
      const oficinaId = event.detail;
      const oficina = oficinas.find(o => o.id === oficinaId);
      if (oficina && onOficinaSelecionada) {
        onOficinaSelecionada(oficina);
      }
    };

    document.addEventListener('selectOficina', handleSelectOficina as EventListener);
    
    return () => {
      document.removeEventListener('selectOficina', handleSelectOficina as EventListener);
    };
  }, [oficinas, onOficinaSelecionada]);

  if (isLoading || geoLoading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} style={{ height, width }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0047CC] mx-auto mb-2"></div>
          <p className="text-gray-600">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  if (error || geoError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} style={{ height, width }}>
        <div className="text-center p-5">
          <div className="bg-red-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-red-600 font-medium mb-1">Erro ao carregar o mapa</h3>
          <p className="text-gray-600 text-sm">{error || geoError}</p>
          <button 
            className="mt-3 px-4 py-2 bg-[#0047CC] text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg overflow-hidden shadow-lg ${className}`} style={{ height, width }}>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}