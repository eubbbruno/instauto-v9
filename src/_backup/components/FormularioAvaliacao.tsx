"use client";

import { useState, useRef } from "react";
import { StarIcon, PaperAirplaneIcon, XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";

export type AvaliacaoProps = {
  oficinaId: string;
  servicoId?: string;
  usuarioId: string;
  onSubmit: (avaliacao: AvaliacaoDados) => Promise<void>;
  onCancel?: () => void;
  className?: string;
};

export type AvaliacaoDados = {
  nota: number;
  comentario: string;
  fotos: File[];
  servicoId?: string;
  recomenda: boolean;
};

export default function FormularioAvaliacao({
  oficinaId,
  servicoId,
  usuarioId,
  onSubmit,
  onCancel,
  className = ""
}: AvaliacaoProps) {
  // Estados do formulário
  const [nota, setNota] = useState(0);
  const [hoverNota, setHoverNota] = useState(0);
  const [comentario, setComentario] = useState("");
  const [fotos, setFotos] = useState<File[]>([]);
  const [fotosPreview, setFotosPreview] = useState<string[]>([]);
  const [recomenda, setRecomenda] = useState<boolean | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  
  // Referência para input de arquivo oculto
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Manipular envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar entrada
    if (nota === 0) {
      setErro("Por favor, selecione uma classificação por estrelas");
      return;
    }
    
    if (!comentario.trim()) {
      setErro("Por favor, adicione um comentário à sua avaliação");
      return;
    }
    
    if (recomenda === null) {
      setErro("Por favor, indique se você recomenda esta oficina");
      return;
    }
    
    setErro(null);
    setEnviando(true);
    
    try {
      // Criar objeto de dados para enviar
      const dados: AvaliacaoDados = {
        nota,
        comentario: comentario.trim(),
        fotos,
        servicoId,
        recomenda
      };
      
      // Enviar dados usando a função de callback
      await onSubmit(dados);
      
      // Resetar formulário após sucesso
      resetForm();
    } catch (error) {
      setErro("Houve um erro ao enviar sua avaliação. Por favor, tente novamente.");
      console.error("Erro ao enviar avaliação:", error);
    } finally {
      setEnviando(false);
    }
  };
  
  // Resetar formulário
  const resetForm = () => {
    setNota(0);
    setComentario("");
    setFotos([]);
    setFotosPreview([]);
    setRecomenda(null);
    setErro(null);
  };
  
  // Abrir seletor de arquivo para fotos
  const handleFotoClick = () => {
    fileInputRef.current?.click();
  };
  
  // Processar seleção de fotos
  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivos = e.target.files;
    if (!arquivos) return;
    
    // Limitar a 5 fotos
    const totalFotos = fotos.length + arquivos.length;
    if (totalFotos > 5) {
      setErro("Você pode adicionar no máximo 5 fotos");
      return;
    }
    
    setErro(null);
    
    // Adicionar novas fotos
    const novosFotos: File[] = [];
    const novosPreview: string[] = [];
    
    Array.from(arquivos).forEach(arquivo => {
      // Verificar tipo de arquivo
      if (!arquivo.type.startsWith("image/")) return;
      
      // Verificar tamanho (2MB máximo)
      if (arquivo.size > 2 * 1024 * 1024) {
        setErro("As imagens devem ter no máximo 2MB cada");
        return;
      }
      
      novosFotos.push(arquivo);
      
      // Criar URL para preview
      const preview = URL.createObjectURL(arquivo);
      novosPreview.push(preview);
    });
    
    setFotos([...fotos, ...novosFotos]);
    setFotosPreview([...fotosPreview, ...novosPreview]);
    
    // Limpar input de arquivo
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  
  // Remover foto
  const handleRemoverFoto = (index: number) => {
    const novosFotos = [...fotos];
    const novosPreview = [...fotosPreview];
    
    // Revogar URL da foto removida para liberar memória
    URL.revokeObjectURL(novosPreview[index]);
    
    novosFotos.splice(index, 1);
    novosPreview.splice(index, 1);
    
    setFotos(novosFotos);
    setFotosPreview(novosPreview);
  };
  
  // Renderizar estrelas para seleção
  const renderEstrelas = () => {
    return [1, 2, 3, 4, 5].map((valor) => (
      <button
        key={valor}
        type="button"
        className="relative p-1 transition-transform hover:scale-110 focus:outline-none"
        onMouseEnter={() => setHoverNota(valor)}
        onMouseLeave={() => setHoverNota(0)}
        onClick={() => setNota(valor)}
        aria-label={`${valor} ${valor === 1 ? "estrela" : "estrelas"}`}
      >
        {(hoverNota > 0 ? valor <= hoverNota : valor <= nota) ? (
          <StarIconSolid className="h-8 w-8 text-[#FFDE59] drop-shadow-sm" />
        ) : (
          <StarIcon className="h-8 w-8 text-gray-300" />
        )}
      </button>
    ));
  };
  
  return (
    <div className={`bg-white rounded-xl shadow-md ${className}`}>
      <div className="p-5 border-b bg-gradient-to-r from-[#0047CC]/5 to-[#FFDE59]/5">
        <h2 className="text-xl font-bold text-gray-800">Avaliar Oficina</h2>
        <p className="text-gray-600 text-sm">Compartilhe sua experiência para ajudar outros motoristas</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-5">
        {/* Classificação por estrelas */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Classificação Geral</label>
          <div className="flex" onMouseLeave={() => setHoverNota(0)}>
            {renderEstrelas()}
          </div>
          {nota > 0 && (
            <p className="mt-1 text-sm text-gray-600">
              {nota === 1 && "Muito ruim"}
              {nota === 2 && "Ruim"}
              {nota === 3 && "Regular"}
              {nota === 4 && "Bom"}
              {nota === 5 && "Excelente"}
            </p>
          )}
        </div>
        
        {/* Recomendação */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Você recomenda esta oficina?</label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setRecomenda(true)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                recomenda === true 
                  ? 'bg-green-50 border-green-500 text-green-700' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              Sim, recomendo
            </button>
            <button
              type="button"
              onClick={() => setRecomenda(false)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                recomenda === false
                  ? 'bg-red-50 border-red-500 text-red-700' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              Não recomendo
            </button>
          </div>
        </div>
        
        {/* Campo de comentário */}
        <div className="mb-6">
          <label htmlFor="comentario" className="block text-sm font-medium text-gray-700 mb-2">
            Sua Avaliação
          </label>
          <textarea
            id="comentario"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
            rows={5}
            placeholder="Descreva sua experiência com esta oficina..."
            maxLength={500}
          />
          <div className="mt-1 text-xs text-gray-500 flex justify-end">
            {comentario.length}/500 caracteres
          </div>
        </div>
        
        {/* Upload de fotos */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adicionar Fotos (opcional)
          </label>
          <div className="flex flex-wrap gap-2">
            {/* Botão de adicionar foto */}
            {fotos.length < 5 && (
              <button
                type="button"
                onClick={handleFotoClick}
                className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-[#0047CC] transition-colors"
              >
                <PhotoIcon className="h-8 w-8 text-gray-400" />
                <span className="text-xs text-gray-500 mt-1">Adicionar</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFotoChange}
                  className="hidden"
                />
              </button>
            )}
            
            {/* Previews das fotos */}
            {fotosPreview.map((url, index) => (
              <div key={index} className="relative w-24 h-24">
                <img
                  src={url}
                  alt={`Foto ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => handleRemoverFoto(index)}
                  className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Máximo 5 fotos (2MB cada)
          </p>
        </div>
        
        {/* Mensagem de erro */}
        <AnimatePresence>
          {erro && (
            <motion.div
              className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {erro}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Botões de ação */}
        <div className="flex justify-end space-x-3 mt-6">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={enviando}
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className={`px-6 py-2 bg-[#0047CC] text-white rounded-lg hover:bg-[#0039A6] transition-colors flex items-center ${
              enviando ? 'opacity-80 cursor-not-allowed' : ''
            }`}
            disabled={enviando}
          >
            {enviando ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
              </>
            ) : (
              <>
                <PaperAirplaneIcon className="h-5 w-5 mr-1" />
                Enviar Avaliação
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 