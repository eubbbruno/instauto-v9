'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  WrenchScrewdriverIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  LightBulbIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { DiagnosticoResponse } from '@/lib/openai';

interface DiagnosticoIAProps {
  onDiagnosticoCompleto?: (diagnostico: DiagnosticoResponse) => void;
  userId?: string;
}

interface VeiculoInfo {
  marca: string;
  modelo: string;
  ano: string;
  kilometragem: string;
}

export default function DiagnosticoIA({ onDiagnosticoCompleto, userId }: DiagnosticoIAProps) {
  const [sintomas, setSintomas] = useState('');
  const [veiculo, setVeiculo] = useState<VeiculoInfo>({
    marca: '',
    modelo: '',
    ano: '',
    kilometragem: ''
  });
  const [contexto, setContexto] = useState('');
  const [loading, setLoading] = useState(false);
  const [diagnostico, setDiagnostico] = useState<DiagnosticoResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (sintomas.length < 10) {
      setError('Descreva os sintomas com mais detalhes (mínimo 10 caracteres)');
      return;
    }

    if (!veiculo.marca || !veiculo.modelo || !veiculo.ano) {
      setError('Preencha todas as informações obrigatórias do veículo');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/diagnostico', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sintomas,
          veiculo: {
            ...veiculo,
            ano: parseInt(veiculo.ano),
            kilometragem: veiculo.kilometragem ? parseInt(veiculo.kilometragem) : undefined
          },
          contexto,
          userId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar diagnóstico');
      }

      setDiagnostico(data.diagnostico);
      onDiagnosticoCompleto?.(data.diagnostico);

    } catch (error) {
      console.error('Erro no diagnóstico:', error);
      setError(error instanceof Error ? error.message : 'Erro ao processar diagnóstico');
    } finally {
      setLoading(false);
    }
  };

  const getUrgenciaColor = (urgencia: string) => {
    switch (urgencia) {
      case 'critica': return 'text-red-600 bg-red-50 border-red-200';
      case 'alta': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'media': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'baixa': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getProbabilidadeIcon = (probabilidade: string) => {
    switch (probabilidade) {
      case 'alta': return '🎯';
      case 'media': return '🤔';
      case 'baixa': return '❓';
      default: return '🔍';
    }
  };

  const resetForm = () => {
    setSintomas('');
    setVeiculo({ marca: '', modelo: '', ano: '', kilometragem: '' });
    setContexto('');
    setDiagnostico(null);
    setError(null);
  };

  if (diagnostico) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border p-6"
      >
        {/* Header do Resultado */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <SparklesIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Diagnóstico IA Completo</h3>
              <p className="text-sm text-gray-600">
                {veiculo.marca} {veiculo.modelo} {veiculo.ano}
              </p>
            </div>
          </div>
          <button
            onClick={resetForm}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Problemas Possíveis */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <WrenchScrewdriverIcon className="h-5 w-5 mr-2 text-blue-600" />
            Problemas Possíveis ({diagnostico.problemasPossiveis.length})
          </h4>
          
          <div className="space-y-3">
            {diagnostico.problemasPossiveis.map((problema, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">
                      {getProbabilidadeIcon(problema.probabilidade)}
                    </span>
                    <h5 className="font-medium text-gray-900">{problema.nome}</h5>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getUrgenciaColor(problema.urgencia)}`}>
                      {problema.urgencia}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {problema.probabilidade}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{problema.descricao}</p>
                
                <div className="flex items-center text-sm text-gray-500">
                  <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                  <span>
                    Custo estimado: R$ {problema.custoEstimado.min} - R$ {problema.custoEstimado.max}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recomendações */}
        {diagnostico.recomendacoes.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <LightBulbIcon className="h-5 w-5 mr-2 text-yellow-600" />
              Recomendações
            </h4>
            <ul className="space-y-2">
              {diagnostico.recomendacoes.map((recomendacao, index) => (
                <li key={index} className="flex items-start text-sm text-gray-600">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  {recomendacao}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Próximos Passos */}
        {diagnostico.proximosPassos.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <ClockIcon className="h-5 w-5 mr-2 text-blue-600" />
              Próximos Passos
            </h4>
            <ol className="space-y-2">
              {diagnostico.proximosPassos.map((passo, index) => (
                <li key={index} className="flex items-start text-sm text-gray-600">
                  <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 mr-2 flex-shrink-0">
                    {index + 1}
                  </span>
                  {passo}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Aviso Legal */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h5 className="font-medium text-yellow-800 mb-1">Aviso Importante</h5>
              <p className="text-sm text-yellow-700">{diagnostico.avisoLegal}</p>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => window.location.href = '/buscar-oficinas'}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            <WrenchScrewdriverIcon className="h-5 w-5 mr-2" />
            Buscar Oficinas
          </button>
          <button
            onClick={resetForm}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Novo Diagnóstico
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border p-6"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <SparklesIcon className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Diagnóstico Automotivo IA</h2>
        <p className="text-gray-600">
          Descreva os problemas do seu veículo e receba um diagnóstico preliminar inteligente
        </p>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sintomas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descreva os sintomas *
          </label>
          <textarea
            value={sintomas}
            onChange={(e) => setSintomas(e.target.value)}
            placeholder="Ex: Carro faz barulho estranho ao frear, vibração no volante, fumaça no escapamento..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {sintomas.length}/500 caracteres (mínimo 10)
          </p>
        </div>

        {/* Informações do Veículo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Informações do Veículo *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Marca (ex: Honda)"
              value={veiculo.marca}
              onChange={(e) => setVeiculo({...veiculo, marca: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Modelo (ex: Civic)"
              value={veiculo.modelo}
              onChange={(e) => setVeiculo({...veiculo, modelo: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <input
              type="number"
              placeholder="Ano (ex: 2020)"
              value={veiculo.ano}
              onChange={(e) => setVeiculo({...veiculo, ano: e.target.value})}
              min="1980"
              max="2025"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <input
              type="number"
              placeholder="Quilometragem (opcional)"
              value={veiculo.kilometragem}
              onChange={(e) => setVeiculo({...veiculo, kilometragem: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Contexto Adicional */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contexto Adicional (opcional)
          </label>
          <textarea
            value={contexto}
            onChange={(e) => setContexto(e.target.value)}
            placeholder="Quando o problema começou? Em que situações acontece? Há quanto tempo o veículo não passa por revisão?"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-3"
            >
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
              Analisando sintomas...
            </>
          ) : (
            <>
              <SparklesIcon className="h-5 w-5 mr-2" />
              Diagnosticar com IA
            </>
          )}
        </button>
      </form>

      {/* Disclaimer */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start">
          <ExclamationTriangleIcon className="h-5 w-5 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-600">
              <strong>Importante:</strong> Este diagnóstico é preliminar e baseado em inteligência artificial. 
              Sempre consulte um mecânico qualificado para confirmação e reparo seguro.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 