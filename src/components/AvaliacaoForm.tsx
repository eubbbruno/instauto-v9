"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  StarIcon,
  PhotoIcon,
  XMarkIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface AvaliacaoFormProps {
  oficinaId: string;
  oficinaNome: string;
  agendamentoId?: string;
  onSubmit: (avaliacao: AvaliacaoData) => void;
  onCancel: () => void;
}

interface AvaliacaoData {
  nota: number;
  comentario: string;
  aspectos: {
    atendimento: number;
    qualidade: number;
    preco: number;
    prazo: number;
  };
  recomenda: boolean;
  fotos?: File[];
}

const AvaliacaoForm = ({ oficinaId, oficinaNome, agendamentoId, onSubmit, onCancel }: AvaliacaoFormProps) => {
  const [nota, setNota] = useState(0);
  const [notaHover, setNotaHover] = useState(0);
  const [comentario, setComentario] = useState('');
  const [aspectos, setAspectos] = useState({
    atendimento: 0,
    qualidade: 0,
    preco: 0,
    prazo: 0
  });
  const [recomenda, setRecomenda] = useState<boolean | null>(null);
  const [fotos, setFotos] = useState<File[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [etapa, setEtapa] = useState<'avaliacao' | 'aspectos' | 'comentario' | 'sucesso'>('avaliacao');

  const aspectosLabels = {
    atendimento: 'Atendimento',
    qualidade: 'Qualidade do Serviço',
    preco: 'Preço Justo',
    prazo: 'Cumprimento do Prazo'
  };

  const renderStars = (rating: number, onRate: (rate: number) => void, hoverRating?: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRate(star)}
            onMouseEnter={() => setNotaHover && setNotaHover(star)}
            onMouseLeave={() => setNotaHover && setNotaHover(0)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            {star <= (hoverRating || rating) ? (
              <StarSolidIcon className="h-8 w-8 text-yellow-400" />
            ) : (
              <StarIcon className="h-8 w-8 text-gray-300" />
            )}
          </button>
        ))}
      </div>
    );
  };

  const renderSmallStars = (rating: number, onRate: (rate: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRate(star)}
            className="focus:outline-none"
          >
            {star <= rating ? (
              <StarSolidIcon className="h-5 w-5 text-yellow-400" />
            ) : (
              <StarIcon className="h-5 w-5 text-gray-300" />
            )}
          </button>
        ))}
      </div>
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB max
    );
    
    if (validFiles.length !== files.length) {
      alert('Apenas imagens até 5MB são permitidas');
    }
    
    setFotos(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 fotos
  };

  const removePhoto = (index: number) => {
    setFotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (nota === 0) {
      alert('Por favor, dê uma nota para a oficina');
      return;
    }

    setEnviando(true);
    
    try {
      const avaliacaoData: AvaliacaoData = {
        nota,
        comentario,
        aspectos,
        recomenda: recomenda ?? true,
        fotos
      };

      // Simular envio
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setEtapa('sucesso');
      
      setTimeout(() => {
        onSubmit(avaliacaoData);
      }, 2000);
      
    } catch (error) {
      alert('Erro ao enviar avaliação. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  const podeAvancar = () => {
    switch (etapa) {
      case 'avaliacao':
        return nota > 0;
      case 'aspectos':
        return Object.values(aspectos).every(v => v > 0);
      case 'comentario':
        return true; // Comentário é opcional
      default:
        return false;
    }
  };

  const getNotaTexto = (nota: number) => {
    if (nota === 0) return '';
    if (nota <= 2) return 'Insatisfeito';
    if (nota <= 3) return 'Regular';
    if (nota <= 4) return 'Bom';
    return 'Excelente';
  };

  if (etapa === 'sucesso') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Avaliação enviada com sucesso!
        </h3>
        <p className="text-gray-600">
          Obrigado por compartilhar sua experiência. Sua avaliação ajuda outros motoristas.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Avaliar Oficina</h3>
          <p className="text-sm text-gray-600">{oficinaNome}</p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <XMarkIcon className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center mb-6">
        {['avaliacao', 'aspectos', 'comentario'].map((step, index) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              etapa === step 
                ? 'bg-[#0047CC] text-white' 
                : index < ['avaliacao', 'aspectos', 'comentario'].indexOf(etapa)
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {index + 1}
            </div>
            {index < 2 && (
              <div className={`w-8 h-0.5 mx-2 ${
                index < ['avaliacao', 'aspectos', 'comentario'].indexOf(etapa)
                  ? 'bg-green-500'
                  : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Conteúdo por etapa */}
      <div className="min-h-[300px]">
        {etapa === 'avaliacao' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center"
          >
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Como foi sua experiência?
            </h4>
            <p className="text-gray-600 mb-6">
              Dê uma nota geral para a oficina
            </p>
            
            <div className="mb-4">
              {renderStars(nota, setNota, notaHover)}
            </div>
            
            {nota > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg font-medium text-[#0047CC] mb-6"
              >
                {getNotaTexto(nota)}
              </motion.p>
            )}
          </motion.div>
        )}

        {etapa === 'aspectos' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Avalie aspectos específicos
            </h4>
            <p className="text-gray-600 mb-6">
              Nos ajude a entender melhor sua experiência
            </p>
            
            <div className="space-y-4">
              {Object.entries(aspectosLabels).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                  {renderSmallStars(
                    aspectos[key as keyof typeof aspectos],
                    (rating) => setAspectos(prev => ({ ...prev, [key]: rating }))
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {etapa === 'comentario' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Conte mais sobre sua experiência
            </h4>
            <p className="text-gray-600 mb-4">
              Seu comentário ajuda outros motoristas (opcional)
            </p>
            
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Descreva sua experiência com a oficina..."
              className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC] resize-none"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {comentario.length}/500 caracteres
            </p>

            {/* Upload de fotos */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adicionar fotos (opcional)
              </label>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {fotos.map((foto, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(foto)}
                      alt={`Foto ${index + 1}`}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                
                {fotos.length < 5 && (
                  <label className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#0047CC] transition-colors">
                    <PhotoIcon className="h-6 w-6 text-gray-400" />
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Recomendação */}
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Você recomendaria esta oficina?
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setRecomenda(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    recomenda === true
                      ? 'bg-green-100 text-green-800 border-2 border-green-300'
                      : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                  }`}
                >
                  👍 Sim
                </button>
                <button
                  onClick={() => setRecomenda(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    recomenda === false
                      ? 'bg-red-100 text-red-800 border-2 border-red-300'
                      : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                  }`}
                >
                  👎 Não
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Botões de ação */}
      <div className="flex space-x-3 mt-6">
        {etapa !== 'avaliacao' && (
          <button
            onClick={() => {
              const etapas = ['avaliacao', 'aspectos', 'comentario'];
              const currentIndex = etapas.indexOf(etapa);
              setEtapa(etapas[currentIndex - 1] as any);
            }}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Voltar
          </button>
        )}
        
        <button
          onClick={() => {
            if (etapa === 'comentario') {
              handleSubmit();
            } else {
              const etapas = ['avaliacao', 'aspectos', 'comentario'];
              const currentIndex = etapas.indexOf(etapa);
              setEtapa(etapas[currentIndex + 1] as any);
            }
          }}
          disabled={!podeAvancar() || enviando}
          className="flex-1 px-4 py-3 bg-[#0047CC] text-white font-medium rounded-lg hover:bg-[#003DA6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {enviando ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Enviando...
            </div>
          ) : etapa === 'comentario' ? (
            'Enviar Avaliação'
          ) : (
            'Continuar'
          )}
        </button>
      </div>
    </div>
  );
};

export default AvaliacaoForm; 