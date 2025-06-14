"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { MapPinIcon, StarIcon, ClockIcon } from "@heroicons/react/24/outline";

// Importação dinâmica do mapa para evitar problemas de SSR
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

interface Oficina {
  id: string;
  nome: string;
  endereco: string;
  latitude: number;
  longitude: number;
  avaliacao: number;
  totalAvaliacoes: number;
  distancia?: number;
  foto?: string;
  telefone?: string;
  horarios?: {
    aberto: boolean;
    fechaAs?: string;
  };
  promocao?: string;
}

interface MapaInterativoProps {
  oficinas: Oficina[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  onOficinaClick?: (oficina: Oficina) => void;
  oficinaAtiva?: string | null;
  mostrarLocalizacaoUsuario?: boolean;
}

export default function MapaInterativo({
  oficinas,
  center = [-23.5505, -46.6333], // São Paulo centro
  zoom = 12,
  height = "400px",
  onOficinaClick,
  oficinaAtiva,
  mostrarLocalizacaoUsuario = true
}: MapaInterativoProps) {
  const [isClient, setIsClient] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    
    // Importar Leaflet dinamicamente
    import("leaflet").then((leaflet) => {
      setL(leaflet.default);
      
      // Configurar ícones do Leaflet
      delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl;
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: "/images/marker-icon-2x.png",
        iconUrl: "/images/marker-icon.png",
        shadowUrl: "/images/marker-shadow.png",
      });
    });

    // Obter localização do usuário
    if (mostrarLocalizacaoUsuario && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.warn("Erro ao obter localização:", error);
        }
      );
    }
  }, [mostrarLocalizacaoUsuario]);

  // Criar ícone customizado para oficinas
  const createOficinaIcon = (oficina: Oficina) => {
    if (!L) return null;
    
    const isActive = oficinaAtiva === oficina.id;
    const color = isActive ? "#0047CC" : "#059669";
    
    return L.divIcon({
      className: "custom-marker",
      html: `
        <div class="relative">
          <div class="w-8 h-8 ${isActive ? 'bg-[#0047CC]' : 'bg-green-600'} rounded-full border-2 border-white shadow-lg flex items-center justify-center transform ${isActive ? 'scale-110' : 'scale-100'} transition-all">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
            </svg>
          </div>
          ${oficina.promocao ? `
            <div class="absolute -top-2 -right-1 bg-yellow-400 text-xs px-1 rounded text-black font-bold">
              %
            </div>
          ` : ''}
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  };

  // Criar ícone para localização do usuário
  const createUserIcon = () => {
    if (!L) return null;
    
    return L.divIcon({
      className: "user-location-marker",
      html: `
        <div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
        <div class="w-8 h-8 bg-blue-500/20 rounded-full absolute -top-2 -left-2 animate-ping"></div>
      `,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
  };

  if (!isClient) {
    return (
      <div 
        className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0047CC] mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-lg overflow-hidden shadow-sm border border-gray-200"
      style={{ height }}
    >
      <MapContainer
        center={userLocation || center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Marcadores das oficinas */}
        {oficinas.map((oficina) => (
          <Marker
            key={oficina.id}
            position={[oficina.latitude, oficina.longitude]}
            icon={createOficinaIcon(oficina)}
            eventHandlers={{
              click: () => onOficinaClick?.(oficina)
            }}
          >
            <Popup className="custom-popup" closeButton={false}>
              <div className="p-2 min-w-[280px]">
                <div className="flex items-start space-x-3">
                  {oficina.foto && (
                    <img 
                      src={oficina.foto}
                      alt={oficina.nome}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                      {oficina.nome}
                    </h3>
                    
                    <div className="flex items-center space-x-1 mb-2">
                      <StarIcon className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs font-medium">{oficina.avaliacao}</span>
                      <span className="text-xs text-gray-500">({oficina.totalAvaliacoes})</span>
                    </div>
                    
                    <div className="flex items-center space-x-1 mb-2 text-xs text-gray-600">
                      <MapPinIcon className="h-3 w-3" />
                      <span className="truncate">{oficina.endereco}</span>
                    </div>
                    
                    {oficina.distancia && (
                      <div className="text-xs text-gray-500 mb-2">
                        {oficina.distancia}km de distância
                      </div>
                    )}
                    
                    {oficina.horarios && (
                      <div className={`flex items-center space-x-1 text-xs mb-3 ${
                        oficina.horarios.aberto ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <ClockIcon className="h-3 w-3" />
                        <span>
                          {oficina.horarios.aberto 
                            ? `Aberto até ${oficina.horarios.fechaAs}` 
                            : 'Fechado'
                          }
                        </span>
                      </div>
                    )}
                    
                    {oficina.promocao && (
                      <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium mb-3">
                        {oficina.promocao}
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.open(`tel:${oficina.telefone}`)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors"
                      >
                        Ligar
                      </button>
                      <button
                        onClick={() => window.open(`/oficinas/${oficina.id}`)}
                        className="px-3 py-1 bg-[#0047CC] text-white text-xs rounded hover:bg-[#003DA6] transition-colors"
                      >
                        Ver detalhes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Marcador da localização do usuário */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={createUserIcon()}
          >
            <Popup>
              <div className="text-center p-2">
                <p className="font-medium text-sm">Sua localização</p>
                <p className="text-xs text-gray-600">Localização atual detectada</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
      
      {/* Controles customizados */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col space-y-2">
        {userLocation && (
          <button
            onClick={() => {
              // Centralize no usuário (implementar se necessário)
            }}
            className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
            title="Centralizar na minha localização"
          >
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          </button>
        )}
        
        <div className="bg-white p-2 rounded-lg shadow-md border border-gray-200">
          <div className="text-xs text-gray-600 text-center">
            <div className="flex items-center space-x-1 mb-1">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span>Oficinas</span>
            </div>
            {userLocation && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Você</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// CSS customizado para os popups (adicionar ao globals.css)
export const leafletStyles = `
  .custom-popup .leaflet-popup-content-wrapper {
    border-radius: 8px;
    padding: 0;
  }
  
  .custom-popup .leaflet-popup-content {
    margin: 0;
    line-height: 1.4;
  }
  
  .custom-popup .leaflet-popup-tip {
    background: white;
  }
  
  .custom-marker {
    background: transparent;
    border: none;
  }
  
  .user-location-marker {
    background: transparent;
    border: none;
  }
`; 