"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartIcon, 
  MagnifyingGlassIcon,
  MapPinIcon,
  StarIcon,
  PhoneIcon,
  ClockIcon,
  TrashIcon,
  ShareIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import GlobalHeader from '@/components/GlobalHeader';
import Footer from '@/components/Footer';
import useFavoritos from '@/hooks/useFavoritos';

export default function FavoritosPage() {
  const { favoritos, carregando, removerFavorito } = useFavoritos();
  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState<'nome' | 'avaliacao' | 'distancia' | 'recente'>('recente');

  // Filtrar favoritos baseado na busca
  const favoritosFiltrados = favoritos.filter(oficina =>
    oficina.nome.toLowerCase().includes(busca.toLowerCase()) ||
    oficina.endereco.toLowerCase().includes(busca.toLowerCase())
  );

  // Ordenar favoritos
  const favoritosOrdenados = [...favoritosFiltrados].sort((a, b) => {
    switch (ordenacao) {
      case 'nome':
        return a.nome.localeCompare(b.nome);
      case 'avaliacao':
        return b.avaliacao - a.avaliacao;
      case 'recente':
        return new Date(b.adicionadoEm).getTime() - new Date(a.adicionadoEm).getTime();
      default:
        return 0;
    }
  });

  const formatarDataAdicao = (data: string) => {
    const agora = new Date();
    const dataAdicao = new Date(data);
    const diffMs = agora.getTime() - dataAdicao.getTime();
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDias === 0) return 'Hoje';
    if (diffDias === 1) return 'Ontem';
    if (diffDias < 7) return `${diffDias} dias atrás`;
    if (diffDias < 30) return `${Math.floor(diffDias / 7)} semanas atrás`;
    return dataAdicao.toLocaleDateString('pt-BR');
  };

  const handleRemoverFavorito = (id: string) => {
    if (confirm('Tem certeza que deseja remover esta oficina dos favoritos?')) {
      removerFavorito(id);
    }
  };

  const handleCompartilhar = async (oficina: any) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: oficina.nome,
          text: `Confira esta oficina: ${oficina.nome}`,
          url: `/oficinas/${oficina.id}`
        });
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
      }
    } else {
      // Fallback para navegadores que não suportam Web Share API
      navigator.clipboard.writeText(`${window.location.origin}/oficinas/${oficina.id}`);
      alert('Link copiado para a área de transferência!');
    }
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-gray-50">
        <GlobalHeader title="Meus Favoritos" />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0047CC] mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando favoritos...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalHeader title="Meus Favoritos" />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header da página */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <HeartSolidIcon className="h-7 w-7 text-red-500 mr-2" />
                Meus Favoritos
              </h1>
              <p className="text-gray-600 mt-1">
                {favoritos.length} {favoritos.length === 1 ? 'oficina salva' : 'oficinas salvas'}
              </p>
            </div>
          </div>

          {/* Barra de busca e filtros */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar oficinas..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC]"
              />
            </div>
            
            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value as any)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC] bg-white min-w-[200px]"
            >
              <option value="recente">Mais recentes</option>
              <option value="nome">Nome A-Z</option>
              <option value="avaliacao">Melhor avaliação</option>
            </select>
          </div>
        </div>

        {/* Lista de favoritos */}
        {favoritosOrdenados.length === 0 ? (
          <div className="text-center py-12">
            <HeartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {busca ? 'Nenhuma oficina encontrada' : 'Nenhum favorito ainda'}
            </h3>
            <p className="text-gray-500 mb-6">
              {busca 
                ? 'Tente ajustar sua busca para encontrar oficinas' 
                : 'Adicione oficinas aos favoritos para vê-las aqui'
              }
            </p>
            {!busca && (
              <Link 
                href="/oficinas/busca"
                className="inline-flex items-center px-6 py-3 bg-[#0047CC] text-white font-medium rounded-xl hover:bg-[#003DA6] transition-colors"
              >
                <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                Buscar Oficinas
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {favoritosOrdenados.map((oficina, index) => (
                <motion.div
                  key={oficina.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-200"
                >
                  {/* Imagem */}
                  <div className="relative h-48">
                    <Image
                      src={oficina.imagem || '/images/oficina-placeholder.jpg'}
                      alt={oficina.nome}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 right-3 flex space-x-2">
                      <button
                        onClick={() => handleCompartilhar(oficina)}
                        className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                      >
                        <ShareIcon className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleRemoverFavorito(oficina.id)}
                        className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                      >
                        <TrashIcon className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg">
                      <p className="text-xs text-gray-600">
                        Salvo {formatarDataAdicao(oficina.adicionadoEm)}
                      </p>
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="p-6">
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {oficina.nome}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        <span>{oficina.endereco}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{oficina.avaliacao}</span>
                        <span className="text-xs text-gray-500">(124 avaliações)</span>
                      </div>
                      <div className="flex items-center text-sm text-green-600">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        <span>Aberto</span>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex space-x-2">
                      <Link
                        href={`/oficinas/${oficina.id}`}
                        className="flex-1 px-4 py-2 bg-[#0047CC] text-white text-sm font-medium rounded-lg hover:bg-[#003DA6] transition-colors text-center flex items-center justify-center"
                      >
                        <EyeIcon className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </Link>
                      <Link
                        href={`/agendar/${oficina.id}`}
                        className="px-4 py-2 border-2 border-[#0047CC] text-[#0047CC] text-sm font-medium rounded-lg hover:bg-[#0047CC] hover:text-white transition-colors flex items-center justify-center"
                      >
                        Agendar
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
} 