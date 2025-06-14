"use client";

import { useState } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { OficinaBase } from '@/types';
import useFavoritos from '@/hooks/useFavoritos';

interface FavoritoButtonProps {
  oficina: OficinaBase;
  tamanho?: 'sm' | 'md' | 'lg';
  className?: string;
  mostrarTexto?: boolean;
  corAtivo?: string;
  corInativo?: string;
  onToggle?: (isFavorito: boolean) => void;
}

const FavoritoButton = ({
  oficina,
  tamanho = 'md',
  className = '',
  mostrarTexto = false,
  corAtivo = 'text-red-500',
  corInativo = 'text-gray-400',
  onToggle
}: FavoritoButtonProps) => {
  const { isFavorito, toggleFavorito } = useFavoritos();
  const [animando, setAnimando] = useState(false);

  // Determinar tamanho do ícone
  const tamanhoIcone = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }[tamanho];
  
  // Determinar tamanho do botão
  const tamanhoBotao = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5'
  }[tamanho];

  const favoritado = isFavorito(oficina.id);

  const handleClick = () => {
    // Aplicar animação
    setAnimando(true);
    setTimeout(() => setAnimando(false), 300);
    
    // Alterar estado de favorito
    toggleFavorito(oficina);
    
    // Callback opcional
    if (onToggle) {
      onToggle(!favoritado);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${tamanhoBotao} rounded-full border transition-all duration-200 flex items-center justify-center group ${
        favoritado 
          ? `bg-red-50 border-red-200 ${corAtivo}` 
          : `bg-white border-gray-200 hover:bg-gray-50 ${corInativo}`
      } ${animando ? 'scale-125' : 'scale-100'} ${className}`}
      aria-label={favoritado ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      {favoritado ? (
        <HeartIconSolid className={`${tamanhoIcone} ${corAtivo} transition-colors`} />
      ) : (
        <HeartIcon className={`${tamanhoIcone} group-hover:${corAtivo} transition-colors`} />
      )}
      
      {mostrarTexto && (
        <span className={`ml-2 text-sm font-medium ${
          favoritado ? corAtivo : 'text-gray-600'
        }`}>
          {favoritado ? 'Salvo' : 'Salvar'}
        </span>
      )}
    </button>
  );
};

export default FavoritoButton; 