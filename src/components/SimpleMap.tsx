"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

type RegionProps = {
  name: string;
  color: string;
  path: string;
  isActive?: boolean;
};

const regions: RegionProps[] = [
  {
    name: "Norte",
    color: "#3182CE",
    path: "M250,200 Q350,150,400,200 Q450,250,400,300 Q350,350,300,300 Q250,250,250,200 Z",
    isActive: true
  },
  {
    name: "Nordeste",
    color: "#DD6B20",
    path: "M400,200 Q450,150,500,200 Q550,250,500,300 Q450,350,400,300 Q350,250,400,200 Z",
    isActive: true
  },
  {
    name: "Centro-Oeste",
    color: "#38A169",
    path: "M300,300 Q350,250,400,300 Q450,350,400,400 Q350,450,300,400 Q250,350,300,300 Z",
    isActive: false
  },
  {
    name: "Sudeste",
    color: "#E53E3E",
    path: "M400,300 Q450,250,500,300 Q550,350,500,400 Q450,450,400,400 Q350,350,400,300 Z",
    isActive: true
  },
  {
    name: "Sul",
    color: "#805AD5",
    path: "M400,400 Q450,350,500,400 Q550,450,500,500 Q450,550,400,500 Q350,450,400,400 Z",
    isActive: false
  }
];

interface SimpleMapProps {
  className?: string;
  onRegionClick?: (region: string | null) => void;
  selectedRegion?: string | null;
}

const SimpleMap: React.FC<SimpleMapProps> = ({ 
  className = '',
  onRegionClick,
  selectedRegion = null
}) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const handleRegionClick = (regionName: string) => {
    if (onRegionClick) {
      onRegionClick(regionName === selectedRegion ? null : regionName);
    }
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      <svg
        viewBox="0 0 800 700"
        width="100%"
        height="100%"
        className="drop-shadow-lg"
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Fundo do mapa */}
        <path
          d="M200,100 Q400,50,600,100 Q700,150,700,350 Q700,550,500,600 Q300,650,200,500 Q100,350,200,100 Z"
          fill="rgba(13, 71, 161, 0.1)"
          stroke="#1E40AF"
          strokeWidth="1"
          strokeOpacity="0.3"
        />
        
        {/* Regiões */}
        {regions.map((region) => {
          const isActive = selectedRegion === region.name || hoveredRegion === region.name || region.isActive;
          
          return (
            <motion.g key={region.name}>
              <motion.path
                d={region.path}
                fill={isActive ? region.color : `${region.color}80`}
                stroke="#ffffff"
                strokeWidth={selectedRegion === region.name ? 2 : 1}
                strokeOpacity={isActive ? 0.8 : 0.3}
                initial={{ scale: 1 }}
                animate={{ 
                  scale: selectedRegion === region.name ? 1.05 : 1,
                  opacity: isActive ? 1 : 0.7
                }}
                transition={{ duration: 0.3 }}
                onClick={() => handleRegionClick(region.name)}
                onMouseEnter={() => setHoveredRegion(region.name)}
                onMouseLeave={() => setHoveredRegion(null)}
                whileHover={{ scale: 1.02 }}
                style={{ cursor: 'pointer' }}
              />
              
              {/* Labels das regiões */}
              <motion.text
                x={region.path.split(' ')[1].split(',')[0]}
                y={region.path.split(' ')[1].split(',')[1]}
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize={14}
                fontWeight={selectedRegion === region.name ? "bold" : "normal"}
                fill="#FFFFFF"
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0.7 }}
                transition={{ duration: 0.2 }}
              >
                {region.name}
              </motion.text>
              
              {/* Indicador de status para regiões ativas */}
              {region.isActive && selectedRegion !== region.name && hoveredRegion !== region.name && (
                <motion.circle
                  cx={region.path.split(' ')[1].split(',')[0]}
                  cy={Number(region.path.split(' ')[1].split(',')[1]) - 20}
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
        
        {/* Legenda */}
        <g transform="translate(580, 150)">
          <rect width="150" height="130" fill="white" fillOpacity="0.8" rx="5" ry="5" />
          <text x="75" y="30" textAnchor="middle" fontWeight="bold">Legenda</text>
          
          <circle cx="20" cy="50" r="6" fill="#10B981" />
          <text x="35" y="55" fontSize="12">Ativo</text>
          
          <circle cx="20" cy="80" r="6" fill="#FBBF24" />
          <text x="35" y="85" fontSize="12">Em breve</text>
          
          <circle cx="20" cy="110" r="6" fill="#9CA3AF" />
          <text x="35" y="115" fontSize="12">Planejado</text>
        </g>
      </svg>
    </div>
  );
};

export default SimpleMap; 