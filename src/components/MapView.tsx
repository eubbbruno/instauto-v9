"use client";

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import useGeolocation from '@/hooks/useGeolocation';
import { OficinaBase } from '@/types';

// Props do componente MapView
interface MapViewProps {
  oficinas: OficinaBase[];
  height?: string;
  width?: string;
  className?: string;
  onOficinaSelecionada?: (oficina: OficinaBase) => void;
}

// Componente de recentralização
function SetViewOnLocation({ coords }: { coords: [number, number] | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (coords) {
      map.setView(coords, 13);
    }
  }, [coords, map]);
  
  return null;
}

// Componente principal do mapa
const MapView = ({
  oficinas = [],
  height = '400px',
  width = '100%',
  className = '',
  onOficinaSelecionada
}: MapViewProps) => {
  const { latitude, longitude, error, loading } = useGeolocation();
  
  // Corrigir o problema dos ícones do Leaflet
  useEffect(() => {
    // Apenas executa no lado do cliente
    const iconDefault = L.Icon.Default.prototype as unknown as Record<string, unknown>;
    delete iconDefault._getIconUrl;
    
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/images/markers/marker-icon-2x.png',
      iconUrl: '/images/markers/marker-icon.png',
      shadowUrl: '/images/markers/marker-shadow.png',
    });
  }, []);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height, width }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0047CC] mx-auto mb-2"></div>
          <p className="text-gray-600">Carregando mapa...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center bg-gray-100 rounded-lg" style={{ height, width }}>
        <div className="text-center p-5">
          <div className="bg-red-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-red-600 font-medium mb-1">Erro de localização</h3>
          <p className="text-gray-600 text-sm">{error}</p>
          <button 
            className="mt-3 px-4 py-2 bg-[#0047CC] text-white rounded-lg text-sm"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }
  
  if (!latitude || !longitude) {
    return (
      <div className="flex items-center justify-center bg-gray-100 rounded-lg" style={{ height, width }}>
        <div className="text-center p-5">
          <p className="text-gray-600">Localização não disponível</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`rounded-lg overflow-hidden ${className}`} style={{ height, width }}>
      <MapContainer
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        zoom={13}
        center={[latitude, longitude]}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Marcador da localização do usuário */}
        <Marker position={[latitude, longitude]}>
          <Popup>
            <div className="text-center">
              <h3 className="font-medium text-gray-800">Sua localização</h3>
            </div>
          </Popup>
        </Marker>
        
        {/* Círculo do raio de busca (10km padrão) */}
        <Circle 
          center={[latitude, longitude]} 
          pathOptions={{ fillColor: '#0047CC', fillOpacity: 0.1, color: '#0047CC', opacity: 0.3 }}
          radius={10000} // 10km em metros
        />
        
        {/* Marcadores das oficinas */}
        {oficinas.map((oficina) => (
          <Marker
            key={oficina.id}
            position={[oficina.latitude, oficina.longitude]}
            eventHandlers={{
              click: () => {
                if (onOficinaSelecionada) {
                  onOficinaSelecionada(oficina);
                }
              }
            }}
          >
            <Popup>
              <div className="text-center p-1">
                <h3 className="font-medium text-gray-800">{oficina.nome}</h3>
                <p className="text-sm text-gray-600">{oficina.endereco}</p>
                <div className="flex items-center justify-center my-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(oficina.avaliacao) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-1 text-sm text-gray-600">{oficina.avaliacao.toFixed(1)}</span>
                </div>
                {oficina.distancia && (
                  <p className="text-xs text-gray-500">
                    {oficina.distancia < 1 
                      ? `${(oficina.distancia * 1000).toFixed(0)}m de distância` 
                      : `${oficina.distancia.toFixed(1)}km de distância`}
                  </p>
                )}
                <button
                  onClick={() => {
                    if (onOficinaSelecionada) {
                      onOficinaSelecionada(oficina);
                    }
                  }}
                  className="mt-2 px-3 py-1 bg-[#0047CC] text-white rounded text-xs"
                >
                  Ver detalhes
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
        
        <SetViewOnLocation coords={latitude && longitude ? [latitude, longitude] : null} />
      </MapContainer>
    </div>
  );
};

export default MapView; 