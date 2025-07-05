"use client";

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface Oficina {
  id: string;
  nome: string;
  endereco: string;
  avaliacao: number;
  distancia: string;
  telefone: string;
  servicos: string[];
  precoMedio: number;
  tempoMedio: string;
  coords: {
    lat: number;
    lng: number;
  };
}

interface GoogleMapViewProps {
  oficinas: Oficina[];
  onOficinaSelect?: (oficina: Oficina) => void;
  className?: string;
  showRoutes?: boolean;
  selectedOficinaId?: string;
}

export default function GoogleMapView({ 
  oficinas, 
  onOficinaSelect, 
  className = "",
  showRoutes = true,
  selectedOficinaId 
}: GoogleMapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
    oficina: Oficina;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTransportMode, setSelectedTransportMode] = useState<google.maps.TravelMode>(google.maps.TravelMode.DRIVING);
  
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

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

        // Obter localização do usuário
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userPos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              setUserLocation(userPos);
              initializeMap(userPos);
            },
            () => {
              // Fallback para São Paulo
              const fallbackPos = { lat: -23.5505, lng: -46.6333 };
              setUserLocation(fallbackPos);
              initializeMap(fallbackPos);
            }
          );
        } else {
          const fallbackPos = { lat: -23.5505, lng: -46.6333 };
          setUserLocation(fallbackPos);
          initializeMap(fallbackPos);
        }
      } catch (error) {
        console.error('Erro ao carregar Google Maps:', error);
        setLoading(false);
      }
    };

    const initializeMap = (center: { lat: number; lng: number }) => {
      const mapInstance = new google.maps.Map(mapRef.current!, {
        center,
        zoom: 13,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        gestureHandling: 'cooperative'
      });

      setMap(mapInstance);

      // Inicializar serviços de rota
      const directionsServiceInstance = new google.maps.DirectionsService();
      const directionsRendererInstance = new google.maps.DirectionsRenderer({
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: '#0047CC',
          strokeWeight: 4,
          strokeOpacity: 0.8
        }
      });
      
      directionsRendererInstance.setMap(mapInstance);
      setDirectionsService(directionsServiceInstance);
      setDirectionsRenderer(directionsRendererInstance);

      // Criar marcador do usuário
      createUserMarker(mapInstance, center);
      
      // Criar marcadores das oficinas
      createOfficeMarkers(mapInstance);
      
      // Ajustar bounds
      adjustMapBounds(mapInstance, center);
      
      setLoading(false);
    };

    initMap();

    return () => {
      clearMarkers();
    };
  }, []);

  // Atualizar rota quando oficina for selecionada
  useEffect(() => {
    if (selectedOficinaId && userLocation && directionsService && directionsRenderer) {
      const selectedOficina = oficinas.find(o => o.id === selectedOficinaId);
      if (selectedOficina) {
        calculateRoute(selectedOficina);
      }
    } else if (directionsRenderer) {
      // Limpar rota se nenhuma oficina selecionada
      directionsRenderer.setDirections({ routes: [] } as any);
      setRouteInfo(null);
    }
  }, [selectedOficinaId, userLocation, directionsService, directionsRenderer]);

  const createUserMarker = (mapInstance: google.maps.Map, position: { lat: number; lng: number }) => {
    // Marcador personalizado do usuário
    const userMarker = new google.maps.Marker({
      position,
      map: mapInstance,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: '#FFDE59',
        fillOpacity: 1,
        strokeColor: '#0047CC',
        strokeWeight: 3
      },
      title: 'Sua localização'
    });

    // Círculo de raio de busca
    new google.maps.Circle({
      strokeColor: '#0047CC',
      strokeOpacity: 0.3,
      strokeWeight: 2,
      fillColor: '#0047CC',
      fillOpacity: 0.1,
      map: mapInstance,
      center: position,
      radius: 10000 // 10km
    });

    markersRef.current.push(userMarker);
  };

  const createOfficeMarkers = (mapInstance: google.maps.Map) => {
    oficinas.forEach((oficina) => {
      const marker = new google.maps.Marker({
        position: oficina.coords,
        map: mapInstance,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="40" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2c-7.7 0-14 6.3-14 14 0 10.5 14 22 14 22s14-11.5 14-22c0-7.7-6.3-14-14-14z" 
                    fill="#0047CC" stroke="#fff" stroke-width="2"/>
              <circle cx="16" cy="15" r="6" fill="#FFDE59"/>
              <path d="M13 15l2 2 4-4" stroke="#0047CC" stroke-width="2" fill="none" stroke-linecap="round"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 40),
          anchor: new google.maps.Point(16, 40)
        },
        title: oficina.nome
      });

      // InfoWindow rica
      const infoContent = `
        <div style="max-width: 300px; padding: 8px;">
          <h3 style="margin: 0 0 8px 0; color: #0047CC; font-size: 16px; font-weight: bold;">
            ${oficina.nome}
          </h3>
          <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
            📍 ${oficina.endereco}
          </p>
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <span style="color: #FFD700; margin-right: 4px;">⭐</span>
            <span style="font-weight: bold; margin-right: 8px;">${oficina.avaliacao}</span>
            <span style="color: #666; font-size: 12px;">• ${oficina.distancia}</span>
          </div>
          <p style="margin: 0 0 8px 0; color: #666; font-size: 12px;">
            💰 Preço médio: R$ ${oficina.precoMedio} • ⏱️ ${oficina.tempoMedio}
          </p>
          <div style="margin: 8px 0;">
            <button onclick="window.calculateRouteToOficina('${oficina.id}')" 
                    style="background: #0047CC; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; margin-right: 8px; font-size: 12px;">
              🗺️ Ver Rota
            </button>
            <button onclick="window.openInGoogleMaps(${oficina.coords.lat}, ${oficina.coords.lng})" 
                    style="background: #FFDE59; color: #0047CC; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;">
              📱 Navegar
            </button>
          </div>
        </div>
      `;

      marker.addListener('click', () => {
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
        }
        
        infoWindowRef.current = new google.maps.InfoWindow({
          content: infoContent
        });
        
        infoWindowRef.current.open(mapInstance, marker);
        
        onOficinaSelect?.(oficina);
      });

      markersRef.current.push(marker);
    });
  };

  const calculateRoute = async (oficina: Oficina) => {
    if (!directionsService || !directionsRenderer || !userLocation) return;

    try {
      const request: google.maps.DirectionsRequest = {
        origin: userLocation,
        destination: oficina.coords,
        travelMode: selectedTransportMode,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
      };

      const result = await directionsService.route(request);
      directionsRenderer.setDirections(result);

      const route = result.routes[0];
      if (route) {
        setRouteInfo({
          distance: route.legs[0].distance?.text || '',
          duration: route.legs[0].duration?.text || '',
          oficina
        });
      }
    } catch (error) {
      console.error('Erro ao calcular rota:', error);
    }
  };

  const adjustMapBounds = (mapInstance: google.maps.Map, userPos: { lat: number; lng: number }) => {
    const bounds = new google.maps.LatLngBounds();
    
    // Incluir posição do usuário
    bounds.extend(userPos);
    
    // Incluir todas as oficinas
    oficinas.forEach(oficina => {
      bounds.extend(oficina.coords);
    });
    
    mapInstance.fitBounds(bounds);
    
    // Limitar zoom máximo
    const listener = google.maps.event.addListener(mapInstance, 'bounds_changed', () => {
      if (mapInstance.getZoom()! > 15) {
        mapInstance.setZoom(15);
      }
      google.maps.event.removeListener(listener);
    });
  };

  const clearMarkers = () => {
    markersRef.current.forEach(marker => {
      marker.setMap(null);
    });
    markersRef.current = [];
    
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }
  };

  const changeTravelMode = (mode: google.maps.TravelMode) => {
    setSelectedTransportMode(mode);
    if (selectedOficinaId && userLocation) {
      const selectedOficina = oficinas.find(o => o.id === selectedOficinaId);
      if (selectedOficina) {
        calculateRoute(selectedOficina);
      }
    }
  };

  // Funções globais para InfoWindow
  useEffect(() => {
    (window as any).calculateRouteToOficina = (oficinaId: string) => {
      const oficina = oficinas.find(o => o.id === oficinaId);
      if (oficina) {
        calculateRoute(oficina);
      }
    };

    (window as any).openInGoogleMaps = (lat: number, lng: number) => {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
      window.open(url, '_blank');
    };

    return () => {
      delete (window as any).calculateRouteToOficina;
      delete (window as any).openInGoogleMaps;
    };
  }, [oficinas]);

  if (loading) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Controles de Transporte */}
      {showRoutes && (
        <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-md p-2 flex space-x-2">
          <button
            onClick={() => changeTravelMode(google.maps.TravelMode.DRIVING)}
            className={`p-2 rounded ${selectedTransportMode === google.maps.TravelMode.DRIVING ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
            title="Carro"
          >
            🚗
          </button>
          <button
            onClick={() => changeTravelMode(google.maps.TravelMode.WALKING)}
            className={`p-2 rounded ${selectedTransportMode === google.maps.TravelMode.WALKING ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
            title="A pé"
          >
            🚶
          </button>
          <button
            onClick={() => changeTravelMode(google.maps.TravelMode.TRANSIT)}
            className={`p-2 rounded ${selectedTransportMode === google.maps.TravelMode.TRANSIT ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
            title="Transporte público"
          >
            🚌
          </button>
        </div>
      )}

      {/* Informações da Rota */}
      {routeInfo && (
        <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-md p-4 max-w-xs">
          <h4 className="font-semibold text-gray-900 mb-2">Rota para {routeInfo.oficina.nome}</h4>
          <div className="space-y-1 text-sm">
            <div className="flex items-center">
              <span className="text-gray-600">📍 Distância:</span>
              <span className="ml-2 font-medium">{routeInfo.distance}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600">⏱️ Tempo:</span>
              <span className="ml-2 font-medium">{routeInfo.duration}</span>
            </div>
          </div>
          <button
            onClick={() => {
              const url = `https://www.google.com/maps/dir/?api=1&destination=${routeInfo.oficina.coords.lat},${routeInfo.oficina.coords.lng}&travelmode=driving`;
              window.open(url, '_blank');
            }}
            className="mt-3 w-full bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors"
          >
            Navegar no Google Maps
          </button>
        </div>
      )}

      <div 
        ref={mapRef} 
        className={`rounded-lg border ${className}`}
        style={{ minHeight: '400px' }}
      />
    </div>
  );
}