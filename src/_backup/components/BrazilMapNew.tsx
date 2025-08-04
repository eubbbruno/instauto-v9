"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type StateData = {
  code: string;
  name: string;
  status: 'active' | 'coming' | 'planned' | 'none';
  path: string;
  offices?: number;
  region: string;
  coordinates: {
    x: number;
    y: number;
  };
  partners?: string[];
};

type BrazilMapNewProps = {
  statesData: StateData[];
  onStateClick?: (stateCode: string | null) => void;
  selectedState?: string | null;
  className?: string;
};

const BrazilMapNew: React.FC<BrazilMapNewProps> = ({
  statesData,
  onStateClick,
  selectedState,
  className = '',
}) => {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Adicionar um pequeno atraso para permitir a animação de entrada
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Função para obter o status de um estado
  const getStateStatus = (stateCode: string) => {
    const stateData = statesData.find(state => state.code === stateCode);
    return stateData?.status || 'none';
  };

  // Função para obter a cor com base no status
  const getStateColor = (stateCode: string) => {
    const status = getStateStatus(stateCode);
    
    switch (status) {
      case 'active':
        return '#10B981'; // Verde
      case 'coming':
        return '#FBBF24'; // Amarelo
      case 'planned':
        return '#9CA3AF'; // Cinza
      default:
        return '#E5E7EB'; // Cinza claro
    }
  };

  // Função para obter o estilo de preenchimento do estado
  const getStateFill = (stateCode: string) => {
    const status = getStateStatus(stateCode);
    const isSelected = selectedState === stateCode;
    const isHovered = hoveredState === stateCode;
    
    if (status === 'none') return 'rgba(255, 255, 255, 0.1)';
    
    const baseColor = getStateColor(stateCode);
    
    if (isSelected) {
      return baseColor;
    } else if (isHovered) {
      return baseColor;
    } else {
      return status === 'active' 
        ? `url(#gradient-${stateCode})` 
        : status === 'coming' 
          ? `url(#gradient-coming-${stateCode})` 
          : `url(#gradient-planned-${stateCode})`;
    }
  };

  // Função para lidar com o clique em um estado
  const handleStateClick = (stateCode: string) => {
    if (onStateClick) {
      onStateClick(stateCode === selectedState ? null : stateCode);
    }
  };

  const statesList = statesData.filter(state => state.path);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ 
          opacity: isLoaded ? 1 : 0, 
          scale: isLoaded ? 1 : 0.95 
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full h-full"
      >
        <svg
          viewBox="0 0 800 800"
          width="100%"
          height="100%"
          className="drop-shadow-lg"
          style={{ filter: 'drop-shadow(0px 5px 15px rgba(0, 0, 0, 0.2))' }}
        >
          <defs>
            {/* Gradientes para estados ativos */}
            {statesList.filter(state => state.status === 'active').map(state => (
              <linearGradient 
                key={`gradient-${state.code}`} 
                id={`gradient-${state.code}`} 
                x1="0%" 
                y1="0%" 
                x2="100%" 
                y2="100%"
              >
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.9" />
              </linearGradient>
            ))}
            
            {/* Gradientes para estados em breve */}
            {statesList.filter(state => state.status === 'coming').map(state => (
              <linearGradient 
                key={`gradient-coming-${state.code}`} 
                id={`gradient-coming-${state.code}`} 
                x1="0%" 
                y1="0%" 
                x2="100%" 
                y2="100%"
              >
                <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#D97706" stopOpacity="0.8" />
              </linearGradient>
            ))}
            
            {/* Gradientes para estados planejados */}
            {statesList.filter(state => state.status === 'planned').map(state => (
              <linearGradient 
                key={`gradient-planned-${state.code}`} 
                id={`gradient-planned-${state.code}`} 
                x1="0%" 
                y1="0%" 
                x2="100%" 
                y2="100%"
              >
                <stop offset="0%" stopColor="#9CA3AF" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#6B7280" stopOpacity="0.6" />
              </linearGradient>
            ))}
            
            {/* Filtro de brilho */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            {/* Filtro de sombra */}
            <filter id="drop-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.3" />
            </filter>
          </defs>
          
          {/* Contorno do Brasil - cor base */}
          <path
            d="M400 120 Q500 150, 550 250 Q600 350, 580 450 Q560 550, 500 600 Q440 650, 400 680 Q360 650, 300 600 Q240 550, 220 450 Q200 350, 250 250 Q300 150, 400 120 Z"
            fill="rgba(13, 71, 161, 0.1)"
            stroke="#1E40AF"
            strokeWidth="1"
            strokeOpacity="0.3"
          />
          
          {/* Estados do Brasil */}
          {statesList.map(state => {
            const isSelected = selectedState === state.code;
            const isHovered = hoveredState === state.code;
            const status = state.status;
            
            return (
              <motion.g key={state.code}>
                <motion.path
                  d={state.path}
                  fill={getStateFill(state.code)}
                  stroke={isSelected || isHovered ? "#ffffff" : "#1E40AF"}
                  strokeWidth={isSelected || isHovered ? 2 : 1}
                  strokeOpacity={isSelected || isHovered ? 0.8 : 0.3}
                  initial={{ scale: 1, opacity: 0.7 }}
                  animate={{ 
                    scale: isSelected ? 1.05 : 1,
                    opacity: status === 'none' ? 0.2 : isSelected || isHovered ? 1 : 0.8,
                    filter: isSelected || isHovered ? 'brightness(1.2)' : 'brightness(1)',
                  }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleStateClick(state.code)}
                  onMouseEnter={() => setHoveredState(state.code)}
                  onMouseLeave={() => setHoveredState(null)}
                  style={{ cursor: 'pointer' }}
                  whileHover={{ scale: 1.02 }}
                />
                
                {/* Efeito de brilho para estados selecionados */}
                {isSelected && (
                  <motion.path
                    d={state.path}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth={4}
                    strokeOpacity={0.4}
                    filter="url(#glow)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                
                {/* Labels dos estados */}
                {(status !== 'none' || isHovered) && (
                  <motion.text
                    x={state.coordinates.x}
                    y={state.coordinates.y}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontSize={12}
                    fontWeight={isSelected ? "bold" : "normal"}
                    fill="#FFFFFF"
                    filter={isSelected ? "url(#drop-shadow)" : ""}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isSelected || isHovered ? 1 : 0.7 }}
                    transition={{ duration: 0.2 }}
                  >
                    {state.code}
                  </motion.text>
                )}
                
                {/* Indicador de status para estados ativos */}
                {status === 'active' && !isSelected && !isHovered && (
                  <motion.circle
                    cx={state.coordinates.x}
                    cy={state.coordinates.y - 15}
                    r={4}
                    fill="#10B981"
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
        </svg>
      </motion.div>
    </div>
  );
};

export default BrazilMapNew; 