"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BrazilMapProps {
  className?: string;
  onRegionClick?: (region: string | null) => void;
  selectedRegion?: string | null;
  showStateDetails?: boolean;
}

// Representação simplificada das regiões do Brasil usando SVG paths
const regions = [
  {
    id: "Norte",
    name: "Norte",
    color: "#3182CE",
    path: "M100,150 C150,100 200,100 250,150 C300,200 300,250 250,300 C200,350 150,350 100,300 C50,250 50,200 100,150 Z",
    states: ["AC", "AM", "AP", "PA", "RO", "RR", "TO"],
    description: "Maior região do Brasil, com rica biodiversidade amazônica"
  },
  {
    id: "Nordeste",
    name: "Nordeste",
    color: "#DD6B20",
    path: "M250,150 C300,100 350,100 400,150 C450,200 450,250 400,300 C350,350 300,350 250,300 C200,250 200,200 250,150 Z",
    states: ["AL", "BA", "CE", "MA", "PB", "PE", "PI", "RN", "SE"],
    description: "Região com riqueza cultural e belíssimas praias"
  },
  {
    id: "Centro-Oeste",
    name: "Centro-Oeste",
    color: "#38A169",
    path: "M150,300 C200,250 250,250 300,300 C350,350 350,400 300,450 C250,500 200,500 150,450 C100,400 100,350 150,300 Z",
    states: ["DF", "GO", "MT", "MS"],
    description: "Centro político e produtivo, sede da capital federal"
  },
  {
    id: "Sudeste",
    name: "Sudeste",
    color: "#E53E3E",
    path: "M300,300 C350,250 400,250 450,300 C500,350 500,400 450,450 C400,500 350,500 300,450 C250,400 250,350 300,300 Z",
    states: ["ES", "MG", "RJ", "SP"],
    description: "Região mais populosa e industrializada do país"
  },
  {
    id: "Sul",
    name: "Sul",
    color: "#805AD5",
    path: "M250,450 C300,400 350,400 400,450 C450,500 450,550 400,600 C350,650 300,650 250,600 C200,550 200,500 250,450 Z",
    states: ["PR", "RS", "SC"],
    description: "Clima subtropical com forte influência europeia"
  }
];

// Lista de estados com suas siglas, nomes e coordenadas simplificadas
const states = [
  { 
    code: "AC", 
    name: "Acre", 
    region: "Norte", 
    coordinates: { x: 120, y: 200 },
    officinas: 28,
    status: "active" 
  },
  { 
    code: "AL", 
    name: "Alagoas", 
    region: "Nordeste", 
    coordinates: { x: 370, y: 200 },
    officinas: 95,
    status: "active" 
  },
  { 
    code: "AM", 
    name: "Amazonas", 
    region: "Norte", 
    coordinates: { x: 150, y: 170 },
    officinas: 42,
    status: "coming" 
  },
  { 
    code: "AP", 
    name: "Amapá", 
    region: "Norte", 
    coordinates: { x: 200, y: 120 },
    officinas: 0,
    status: "planned" 
  },
  { 
    code: "BA", 
    name: "Bahia", 
    region: "Nordeste", 
    coordinates: { x: 340, y: 230 },
    officinas: 320,
    status: "active" 
  },
  { 
    code: "CE", 
    name: "Ceará", 
    region: "Nordeste", 
    coordinates: { x: 350, y: 160 },
    officinas: 110,
    status: "active" 
  },
  { 
    code: "DF", 
    name: "Distrito Federal", 
    region: "Centro-Oeste", 
    coordinates: { x: 270, y: 350 },
    officinas: 280,
    status: "active" 
  },
  { 
    code: "ES", 
    name: "Espírito Santo", 
    region: "Sudeste", 
    coordinates: { x: 380, y: 340 },
    officinas: 180,
    status: "active" 
  },
  { 
    code: "GO", 
    name: "Goiás", 
    region: "Centro-Oeste", 
    coordinates: { x: 230, y: 380 },
    officinas: 250,
    status: "active" 
  },
  { 
    code: "MA", 
    name: "Maranhão", 
    region: "Nordeste", 
    coordinates: { x: 300, y: 180 },
    officinas: 70,
    status: "coming" 
  },
  { 
    code: "MG", 
    name: "Minas Gerais", 
    region: "Sudeste", 
    coordinates: { x: 320, y: 360 },
    officinas: 600,
    status: "active" 
  },
  { 
    code: "MS", 
    name: "Mato Grosso do Sul", 
    region: "Centro-Oeste", 
    coordinates: { x: 200, y: 400 },
    officinas: 0,
    status: "planned" 
  },
  { 
    code: "MT", 
    name: "Mato Grosso", 
    region: "Centro-Oeste", 
    coordinates: { x: 180, y: 320 },
    officinas: 0,
    status: "planned" 
  },
  { 
    code: "PA", 
    name: "Pará", 
    region: "Norte", 
    coordinates: { x: 180, y: 200 },
    officinas: 45,
    status: "coming" 
  },
  { 
    code: "PB", 
    name: "Paraíba", 
    region: "Nordeste", 
    coordinates: { x: 380, y: 170 },
    officinas: 85,
    status: "active" 
  },
  { 
    code: "PE", 
    name: "Pernambuco", 
    region: "Nordeste", 
    coordinates: { x: 360, y: 190 },
    officinas: 120,
    status: "active" 
  },
  { 
    code: "PI", 
    name: "Piauí", 
    region: "Nordeste", 
    coordinates: { x: 320, y: 200 },
    officinas: 0,
    status: "planned" 
  },
  { 
    code: "PR", 
    name: "Paraná", 
    region: "Sul", 
    coordinates: { x: 300, y: 500 },
    officinas: 450,
    status: "active" 
  },
  { 
    code: "RJ", 
    name: "Rio de Janeiro", 
    region: "Sudeste", 
    coordinates: { x: 360, y: 380 },
    officinas: 850,
    status: "active" 
  },
  { 
    code: "RN", 
    name: "Rio Grande do Norte", 
    region: "Nordeste", 
    coordinates: { x: 370, y: 150 },
    officinas: 75,
    status: "active" 
  },
  { 
    code: "RO", 
    name: "Rondônia", 
    region: "Norte", 
    coordinates: { x: 140, y: 250 },
    officinas: 30,
    status: "coming" 
  },
  { 
    code: "RR", 
    name: "Roraima", 
    region: "Norte", 
    coordinates: { x: 150, y: 120 },
    officinas: 0,
    status: "planned" 
  },
  { 
    code: "RS", 
    name: "Rio Grande do Sul", 
    region: "Sul", 
    coordinates: { x: 300, y: 580 },
    officinas: 480,
    status: "active" 
  },
  { 
    code: "SC", 
    name: "Santa Catarina", 
    region: "Sul", 
    coordinates: { x: 320, y: 530 },
    officinas: 400,
    status: "active" 
  },
  { 
    code: "SE", 
    name: "Sergipe", 
    region: "Nordeste", 
    coordinates: { x: 380, y: 220 },
    officinas: 65,
    status: "active" 
  },
  { 
    code: "SP", 
    name: "São Paulo", 
    region: "Sudeste", 
    coordinates: { x: 350, y: 420 },
    officinas: 1250,
    status: "active" 
  },
  { 
    code: "TO", 
    name: "Tocantins", 
    region: "Norte", 
    coordinates: { x: 230, y: 250 },
    officinas: 35,
    status: "coming" 
  }
];

const BrazilMapComponent: React.FC<BrazilMapProps> = ({
  className = '',
  onRegionClick,
  selectedRegion = null,
  showStateDetails = true
}) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  
  // Resetar estado selecionado quando a região mudar
  useEffect(() => {
    setSelectedState(null);
  }, [selectedRegion]);

  const handleRegionClick = (regionId: string) => {
    if (onRegionClick) {
      onRegionClick(regionId === selectedRegion ? null : regionId);
    }
  };
  
  const handleStateClick = (stateCode: string) => {
    setSelectedState(stateCode === selectedState ? null : stateCode);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svgRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - svgRect.left;
    const y = e.clientY - svgRect.top;
    setTooltipPos({ x, y });
  };

  // Função para obter a região atual (selecionada ou em hover)
  const getCurrentRegion = () => {
    if (selectedRegion) return regions.find(r => r.id === selectedRegion);
    if (hoveredRegion) return regions.find(r => r.id === hoveredRegion);
    return null;
  };

  const currentRegion = getCurrentRegion();
  const selectedStateInfo = selectedState ? states.find(s => s.code === selectedState) : null;
  
  // Função para obter a cor de estado com base no status
  const getStateStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981'; // verde
      case 'coming': return '#F59E0B'; // amarelo
      case 'planned': return '#6B7280'; // cinza
      default: return '#6B7280';
    }
  };
  
  // Função para obter o texto de status do estado
  const getStateStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'coming': return 'Em breve';
      case 'planned': return 'Planejado';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      <svg
        viewBox="0 0 600 700"
        width="100%"
        height="100%"
        className="drop-shadow-lg"
        onMouseMove={handleMouseMove}
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <radialGradient id="regionGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.2" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Contorno do Brasil */}
        <path
          d="M75,100 C200,50 400,50 525,100 C600,150 600,350 525,500 C450,600 350,650 300,650 C250,650 150,600 75,500 C0,350 0,150 75,100 Z"
          fill="rgba(13, 71, 161, 0.1)"
          stroke="#1E40AF"
          strokeWidth="1"
          strokeOpacity="0.3"
        />

        {/* Regiões */}
        {regions.map((region) => {
          const isActive = selectedRegion === region.id || hoveredRegion === region.id;

          return (
            <motion.g key={region.id}>
              <motion.path
                d={region.path}
                fill={isActive ? region.color : `${region.color}80`}
                stroke="#ffffff"
                strokeWidth={selectedRegion === region.id ? 2 : 1}
                strokeOpacity={isActive ? 0.8 : 0.3}
                initial={{ scale: 1 }}
                animate={{
                  scale: selectedRegion === region.id ? 1.05 : 1,
                  opacity: isActive ? 1 : 0.7
                }}
                transition={{ duration: 0.3 }}
                onClick={() => handleRegionClick(region.id)}
                onMouseEnter={() => setHoveredRegion(region.id)}
                onMouseLeave={() => setHoveredRegion(null)}
                whileHover={{ scale: 1.02 }}
                style={{ cursor: 'pointer' }}
              />

              {/* Nome da região */}
              <motion.text
                x={region.path.split(" ")[1].split(",")[0]}
                y={region.path.split(" ")[1].split(",")[1]}
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize={14}
                fontWeight={selectedRegion === region.id ? "bold" : "normal"}
                fill="#FFFFFF"
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0.7 }}
                transition={{ duration: 0.2 }}
              >
                {region.name}
              </motion.text>

              {/* Indicador de regiões com estados ativos */}
              {region.id !== selectedRegion && region.id !== hoveredRegion && (
                <motion.circle
                  cx={region.path.split(" ")[1].split(",")[0]}
                  cy={Number(region.path.split(" ")[1].split(",")[1]) - 20}
                  r={4}
                  fill={region.color}
                  initial={{ scale: 0 }}
                  animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.6, 1, 0.6] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              )}
            </motion.g>
          );
        })}

        {/* Estados (pontos) */}
        {currentRegion && states
          .filter(state => state.region === currentRegion.id)
          .map(state => {
            const isSelected = selectedState === state.code;
            const stateStatusColor = getStateStatusColor(state.status);
            
            return (
              <motion.g 
                key={state.code}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                onMouseEnter={() => setHoveredState(state.code)}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => showStateDetails && handleStateClick(state.code)}
              >
                <motion.circle
                  cx={state.coordinates.x}
                  cy={state.coordinates.y}
                  r={isSelected ? 12 : 8}
                  fill={isSelected ? stateStatusColor : currentRegion.color}
                  stroke="#ffffff"
                  strokeWidth={isSelected ? 2 : 1}
                  animate={{ 
                    scale: isSelected ? 1.2 : 1,
                    boxShadow: isSelected ? "0px 0px 8px rgba(255,255,255,0.8)" : "none"
                  }}
                  whileHover={{ scale: 1.3 }}
                  style={{ cursor: 'pointer' }}
                />
                <motion.text
                  x={state.coordinates.x}
                  y={state.coordinates.y + 20}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={10}
                  fontWeight={isSelected ? "bold" : "medium"}
                >
                  {state.code}
                </motion.text>
                {isSelected && (
                  <motion.circle
                    cx={state.coordinates.x}
                    cy={state.coordinates.y}
                    r={20}
                    fill="transparent"
                    stroke={stateStatusColor}
                    strokeWidth={2}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.1, 0.5, 0.1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                )}
              </motion.g>
            );
          })}

        {/* Legenda */}
        <g transform="translate(470, 150)">
          <rect width="120" height="150" fill="white" fillOpacity="0.8" rx="5" ry="5" />
          <text x="60" y="30" textAnchor="middle" fontWeight="bold" fontSize="12">Regiões</text>

          {regions.map((region, index) => (
            <g 
              key={region.id} 
              transform={`translate(15, ${50 + index * 20})`}
              style={{ cursor: 'pointer' }}
              onClick={() => handleRegionClick(region.id)}
            >
              <circle cx="0" cy="0" r="5" fill={region.color} />
              <text 
                x="15" 
                y="4" 
                fontSize="10"
                fontWeight={selectedRegion === region.id ? "bold" : "normal"}
              >
                {region.name}
              </text>
            </g>
          ))}
        </g>

        {/* Tooltip para estado */}
        {hoveredState && !selectedState && (
          <g transform={`translate(${tooltipPos.x + 20}, ${tooltipPos.y - 30})`}>
            <rect 
              width="140" 
              height="60" 
              rx="5" 
              ry="5" 
              fill="rgba(0,0,0,0.8)" 
              stroke="#555"
              strokeWidth="1"
            />
            <text x="10" y="20" fontSize="12" fill="#fff" fontWeight="bold">
              {states.find(s => s.code === hoveredState)?.name}
            </text>
            <text x="10" y="35" fontSize="10" fill="#ccc">
              Região: {states.find(s => s.code === hoveredState)?.region}
            </text>
            <text x="10" y="50" fontSize="10" fill="#ccc">
              Oficinas: {states.find(s => s.code === hoveredState)?.officinas || 0}
            </text>
          </g>
        )}
      </svg>

      {/* Descrição da região */}
      {currentRegion && !selectedStateInfo && (
        <motion.div 
          className="absolute bottom-4 left-0 right-0 bg-black/50 text-white p-3 rounded-lg mx-4 text-center text-sm backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <p className="font-bold">{currentRegion.name}</p>
          <p className="text-xs mt-1">{currentRegion.description}</p>
          <p className="text-xs mt-2 text-blue-300">{currentRegion.states.length} estados • Clique para detalhes</p>
        </motion.div>
      )}
      
      {/* Informações do estado selecionado */}
      <AnimatePresence>
        {selectedStateInfo && showStateDetails && (
          <motion.div 
            className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 rounded-t-lg backdrop-blur-md"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold">
                  {selectedStateInfo.name}
                  <span className="text-xs ml-2 font-normal">({selectedStateInfo.code})</span>
                </h3>
                <p className="text-sm text-gray-300">Região {selectedStateInfo.region}</p>
              </div>
              <button 
                onClick={() => setSelectedState(null)}
                className="bg-gray-700 hover:bg-gray-600 rounded-full p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className={`bg-opacity-20 p-3 rounded-lg flex flex-col items-center justify-center ${
                selectedStateInfo.status === 'active' ? 'bg-green-500' : 
                selectedStateInfo.status === 'coming' ? 'bg-yellow-500' : 
                'bg-gray-500'
              }`}>
                <span className="text-xs uppercase">Status</span>
                <span className={`font-bold ${
                  selectedStateInfo.status === 'active' ? 'text-green-300' : 
                  selectedStateInfo.status === 'coming' ? 'text-yellow-300' : 
                  'text-gray-300'
                }`}>
                  {getStateStatusText(selectedStateInfo.status)}
                </span>
              </div>
              
              <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg flex flex-col items-center justify-center">
                <span className="text-xs uppercase">Oficinas</span>
                <span className="font-bold text-blue-300">{selectedStateInfo.officinas}</span>
              </div>
            </div>
            
            <div className="mt-3 flex justify-center">
              <button 
                className={`py-2 px-4 rounded-lg text-sm font-medium ${
                  selectedStateInfo.status === 'active' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-600 cursor-not-allowed opacity-70'
                }`}
                disabled={selectedStateInfo.status !== 'active'}
              >
                Ver oficinas em {selectedStateInfo.name}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BrazilMapComponent; 