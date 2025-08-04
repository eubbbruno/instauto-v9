import { useState, useEffect } from 'react';
import { OficinaBase } from '@/types';

export interface Favorito extends OficinaBase {
  adicionadoEm: string;
  imagem?: string;
}

const useFavoritos = () => {
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Carregar favoritos do localStorage ao inicializar
  useEffect(() => {
    const favoritosLocalStorage = localStorage.getItem('favoritos');
    if (favoritosLocalStorage) {
      try {
        const favoritosParsed = JSON.parse(favoritosLocalStorage);
        setFavoritos(favoritosParsed);
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
      }
    }
    setCarregando(false);
  }, []);

  // Salvar favoritos no localStorage sempre que mudar
  useEffect(() => {
    if (!carregando) {
      localStorage.setItem('favoritos', JSON.stringify(favoritos));
    }
  }, [favoritos, carregando]);

  // Verificar se uma oficina está nos favoritos
  const isFavorito = (id: string): boolean => {
    return favoritos.some(fav => fav.id === id);
  };

  // Adicionar oficina aos favoritos
  const adicionarFavorito = (oficina: OficinaBase): void => {
    if (!isFavorito(oficina.id)) {
      const novoFavorito: Favorito = {
        ...oficina,
        adicionadoEm: new Date().toISOString()
      };
      setFavoritos(prevFavoritos => [...prevFavoritos, novoFavorito]);
    }
  };

  // Remover oficina dos favoritos
  const removerFavorito = (id: string): void => {
    setFavoritos(prevFavoritos => prevFavoritos.filter(fav => fav.id !== id));
  };

  // Alternar estado de favorito (adicionar/remover)
  const toggleFavorito = (oficina: OficinaBase): void => {
    if (isFavorito(oficina.id)) {
      removerFavorito(oficina.id);
    } else {
      adicionarFavorito(oficina);
    }
  };

  return {
    favoritos,
    carregando,
    isFavorito,
    adicionarFavorito,
    removerFavorito,
    toggleFavorito
  };
};

export default useFavoritos; 