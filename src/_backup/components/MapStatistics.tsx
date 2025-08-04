"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

type StateStatusCounts = {
  active: number;
  coming: number;
  planned: number;
};

type RegionCoverage = {
  name: string;
  totalStates: number;
  activeCoverage: number;
};

interface MapStatisticsProps {
  className?: string;
  totalOfficinas: number;
  totalCities: number;
  stateStatusCounts: StateStatusCounts;
  regionCoverage: RegionCoverage[];
}

const MapStatistics: React.FC<MapStatisticsProps> = ({
  className = '',
  totalOfficinas = 3600,
  totalCities = 600,
  stateStatusCounts = { active: 14, coming: 8, planned: 5 },
  regionCoverage = [
    { name: 'Norte', totalStates: 7, activeCoverage: 20 },
    { name: 'Nordeste', totalStates: 9, activeCoverage: 60 },
    { name: 'Centro-Oeste', totalStates: 4, activeCoverage: 50 },
    { name: 'Sudeste', totalStates: 4, activeCoverage: 100 },
    { name: 'Sul', totalStates: 3, activeCoverage: 100 }
  ]
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className={`bg-gradient-to-br from-blue-900/10 to-blue-800/5 backdrop-blur-md rounded-3xl p-8 border border-blue-500/10 shadow-xl relative overflow-hidden ${className}`}>
      {/* Efeito de brilho */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-3xl"></div>
      
      <motion.div 
        className="relative z-10"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-700/30 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <MapPin className="w-8 h-8 text-blue-300" />
          </div>
          <h3 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
            Cobertura Nacional
          </h3>
          <p className="text-blue-100 text-sm max-w-md mx-auto">
            O Instauto está em constante expansão para atender motoristas em todo o Brasil.
          </p>
        </motion.div>
        
        {/* Estatísticas Principais */}
        <motion.div variants={item} className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-xl p-4 flex flex-col items-center justify-center">
            <p className="text-blue-300 text-xs mb-1">Oficinas</p>
            <p className="text-white text-2xl font-bold">{totalOfficinas}+</p>
          </div>
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-xl p-4 flex flex-col items-center justify-center">
            <p className="text-blue-300 text-xs mb-1">Cidades</p>
            <p className="text-white text-2xl font-bold">{totalCities}+</p>
          </div>
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-xl p-4 flex flex-col items-center justify-center">
            <p className="text-blue-300 text-xs mb-1">UFs</p>
            <p className="text-white text-2xl font-bold">27</p>
          </div>
        </motion.div>
        
        {/* Status dos Estados */}
        <motion.div variants={item} className="mb-8">
          <h4 className="text-sm font-medium text-blue-200 mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
            Status por Estado
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-green-900/20 rounded-lg p-3 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <p className="text-green-300 text-xs">Ativos</p>
              </div>
              <p className="text-green-100 text-xl font-bold">{stateStatusCounts.active}</p>
            </div>
            <div className="bg-yellow-900/20 rounded-lg p-3 border border-yellow-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-yellow-400" />
                <p className="text-yellow-300 text-xs">Em breve</p>
              </div>
              <p className="text-yellow-100 text-xl font-bold">{stateStatusCounts.coming}</p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-600/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-gray-400" />
                <p className="text-gray-300 text-xs">Planejados</p>
              </div>
              <p className="text-gray-100 text-xl font-bold">{stateStatusCounts.planned}</p>
            </div>
          </div>
        </motion.div>
        
        {/* Cobertura por Região */}
        <motion.div variants={item}>
          <h4 className="text-sm font-medium text-blue-200 mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
            Cobertura por Região
          </h4>
          <div className="space-y-3">
            {regionCoverage.map((region, idx) => (
              <div key={idx} className="bg-blue-900/20 rounded-lg p-3 border border-blue-500/10">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-blue-100 text-xs font-medium">{region.name}</p>
                  <p className="text-blue-300 text-xs">{region.activeCoverage}%</p>
                </div>
                <div className="w-full h-2 bg-blue-900/30 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${region.activeCoverage}%` }}
                    transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                  />
                </div>
                <p className="text-blue-200 text-[10px] mt-1">{Math.ceil(region.totalStates * region.activeCoverage / 100)} de {region.totalStates} estados</p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MapStatistics; 