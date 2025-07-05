'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

// Componente Google Maps inline
function GoogleMapComponent({ oficinas }: { oficinas: typeof mockOficinas }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        () => {
          setUserLocation({ latitude: -23.5505, longitude: -46.6333 });
        }
      );
    } else {
      setUserLocation({ latitude: -23.5505, longitude: -46.6333 });
    }
  }, []);

  useEffect(() => {
    if (!userLocation) return;
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
          version: 'weekly',
        });
        await loader.load();
        if (!mapRef.current) return;
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: { lat: userLocation.latitude, lng: userLocation.longitude },
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
        });
        new google.maps.Marker({
          position: { lat: userLocation.latitude, lng: userLocation.longitude },
          map: mapInstance,
          title: 'Sua localização',
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                <circle cx="15" cy="15" r="15" fill="#FFDE59" stroke="#0047CC" stroke-width="3"/>
                <circle cx="15" cy="15" r="8" fill="#0047CC"/>
                <circle cx="15" cy="15" r="3" fill="white"/>
              </svg>
            `)}`,
            scaledSize: new google.maps.Size(30, 30),
            anchor: new google.maps.Point(15, 15)
          }
        });
        new google.maps.Circle({
          center: { lat: userLocation.latitude, lng: userLocation.longitude },
          radius: 10000,
          strokeColor: '#0047CC',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#0047CC',
          fillOpacity: 0.1,
          map: mapInstance
        });
        setIsLoading(false);
        oficinas.forEach((oficina) => {
          if (oficina.latitude && oficina.longitude) {
            const marker = new google.maps.Marker({
              position: { lat: oficina.latitude, lng: oficina.longitude },
              map: mapInstance,
              title: oficina.nome,
              icon: {
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                  <svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 0C8.954 0 0 8.954 0 20c0 20 20 30 20 30s20-10 20-30C40 8.954 31.046 0 20 0z" fill="#0047CC"/>
                    <circle cx="20" cy="20" r="12" fill="white"/>
                    <path d="M15 15h2v5h3v2h-5v-7zm0-3h5v2h-5v-2z" fill="#0047CC"/>
                  </svg>
                `)}`,
                scaledSize: new google.maps.Size(40, 50),
                anchor: new google.maps.Point(20, 50)
              }
            });
            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div class="p-3 max-w-xs">
                  <h3 class="font-bold text-gray-900 mb-1">${oficina.nome}</h3>
                  <div class="flex items-center mb-2">
                    ${Array.from({length: 5}, (_, i) => 
                      `<svg class="w-4 h-4 ${i < Math.floor(oficina.avaliacao) ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>`
                    ).join('')}
                    <span class="ml-1 text-sm text-gray-600">${oficina.avaliacao.toFixed(1)}</span>
                  </div>
                  <p class="text-sm text-gray-600 mb-2">${oficina.endereco}</p>
                  <p class="text-xs text-blue-600 font-medium mb-3">${oficina.distancia}km de distância</p>
                  <div class="flex space-x-2">
                    <a href="tel:${oficina.telefone}" class="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center">
                      📞 Ligar
                    </a>
                    <a href="/oficinas/${oficina.id}" class="flex-1 bg-yellow-500 text-gray-900 px-3 py-2 rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors text-center">
                      👁️ Ver
                    </a>
                  </div>
                </div>
              `,
            });
            marker.addListener('click', () => {
              infoWindow.open(mapInstance, marker);
            });
          }
        });
        if (oficinas.length > 0) {
          const bounds = new google.maps.LatLngBounds();
          bounds.extend({ lat: userLocation.latitude, lng: userLocation.longitude });
          oficinas.forEach(oficina => {
            if (oficina.latitude && oficina.longitude) {
              bounds.extend({ lat: oficina.latitude, lng: oficina.longitude });
            }
          });
          mapInstance.fitBounds(bounds);
          google.maps.event.addListenerOnce(mapInstance, 'bounds_changed', () => {
            if (mapInstance.getZoom()! > 15) {
              mapInstance.setZoom(15);
            }
          });
        }
      } catch {
        setIsLoading(false);
      }
    };
    initMap();
  }, [oficinas, userLocation]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0047CC] mx-auto mb-2"></div>
            <p className="text-gray-600">Carregando mapa...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="h-96 rounded-lg overflow-hidden">
        <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
}

// Dados mockados de oficinas
const mockOficinas = [
  {
    id: '1',
    nome: 'Auto Center Silva',
    endereco: 'Rua das Oficinas, 123 - Vila Madalena, São Paulo',
    distancia: 0.8,
    avaliacao: 4.8,
    totalAvaliacoes: 156,
    telefone: '(11) 99999-0000',
    whatsapp: '(11) 99999-0000',
    verificada: true,
    foto: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=200&fit=crop',
    latitude: -23.5505,
    longitude: -46.6333,
    servicos: [
      'Mecânica Geral',
      'Elétrica Automotiva',
      'Funilaria e Pintura',
      'Troca de Óleo',
      'Alinhamento e Balanceamento',
      'Ar Condicionado'
    ],
    especialidades: ['Honda', 'Toyota', 'Ford', 'Chevrolet'],
    precoMedio: 150,
    tempoMedioServico: '2-4 horas',
    favorita: false,
    promocoes: [
      'Troca de óleo + filtro por R$ 89,90',
      '10% de desconto na primeira visita'
    ]
  },
  {
    id: '2',
    nome: 'Oficina Costa & Cia',
    endereco: 'Av. Principal, 456 - Pinheiros, São Paulo',
    distancia: 1.2,
    avaliacao: 4.5,
    totalAvaliacoes: 89,
    telefone: '(11) 88888-1111',
    whatsapp: '(11) 88888-1111',
    verificada: true,
    foto: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=400&h=200&fit=crop',
    latitude: -23.5489,
    longitude: -46.6388,
    servicos: [
      'Revisão Preventiva',
      'Troca de Óleo',
      'Sistema de Freios',
      'Suspensão',
      'Câmbio'
    ],
    especialidades: ['Volkswagen', 'Fiat', 'Renault'],
    precoMedio: 120,
    tempoMedioServico: '1-3 horas',
    favorita: true,
    promocoes: [
      'Revisão completa por R$ 199,90'
    ]
  }
];

function BuscarOficinasClient() {
  // Aqui você pode adicionar lógica de filtro, busca, etc.
  // Exemplo de uso do GoogleMapComponent e mockOficinas:
  return (
    <div>
      <GoogleMapComponent oficinas={mockOficinas} />
      {/* Outras seções da página podem ser adicionadas aqui */}
    </div>
  );
}

export default BuscarOficinasClient; 