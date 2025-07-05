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

interface Veiculo {
  marca: string;
  modelo: string;
  ano: string;
  motor?: string;
  uso?: string;
}

interface DiagnosticoIAProps {
  veiculo?: Veiculo;
  onVeiculoChange?: (veiculo: Veiculo) => void;
  className?: string;
}

type TipoAnalise = 'diagnostico' | 'manutencao_preventiva' | 'comparacao_precos' | 'recomendacao_pecas';

interface TipoAnaliseOption {
  id: TipoAnalise;
  nome: string;
  descricao: string;
  icon: string;
  color: string;
}

const tiposAnalise: TipoAnaliseOption[] = [
  {
    id: 'diagnostico',
    nome: 'Diagnóstico de Problemas',
    descricao: 'Analisa sintomas e identifica possíveis causas',
    icon: '🔧',
    color: 'bg-red-500'
  },
  {
    id: 'manutencao_preventiva',
    nome: 'Manutenção Preventiva',
    descricao: 'Cria plano personalizado de manutenção',
    icon: '📅',
    color: 'bg-green-500'
  },
  {
    id: 'comparacao_precos',
    nome: 'Comparação de Preços',
    descricao: 'Compara preços entre diferentes tipos de oficinas',
    icon: '💰',
    color: 'bg-blue-500'
  },
  {
    id: 'recomendacao_pecas',
    nome: 'Recomendação de Peças',
    descricao: 'Sugere as melhores opções de peças',
    icon: '🔩',
    color: 'bg-purple-500'
  }
];

export default function DiagnosticoIA({ veiculo, onVeiculoChange, className = "" }: DiagnosticoIAProps) {
  const [tipoSelecionado, setTipoSelecionado] = useState<TipoAnalise>('diagnostico');
  const [veiculoLocal, setVeiculoLocal] = useState<Veiculo>(veiculo || {
    marca: '',
    modelo: '',
    ano: '',
    motor: '',
    uso: 'urbano'
  });
  const [sintomas, setSintomas] = useState('');
  const [quilometragem, setQuilometragem] = useState('');
  const [ultimaManutencao, setUltimaManutencao] = useState('');
  const [orcamento, setOrcamento] = useState('');
  const [localizacao, setLocalizacao] = useState('São Paulo, SP');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<Record<string, unknown> | null>(null);
  const [erro, setErro] = useState('');

  const handleVeiculoChange = (field: keyof Veiculo, value: string) => {
    const novoVeiculo = { ...veiculoLocal, [field]: value };
    setVeiculoLocal(novoVeiculo);
    onVeiculoChange?.(novoVeiculo);
  };

  const handleAnalise = async () => {
    if (!veiculoLocal.marca || !veiculoLocal.modelo || !veiculoLocal.ano) {
      setErro('Preencha as informações básicas do veículo');
      return;
    }

    if (!sintomas.trim()) {
      const campos = {
        diagnostico: 'sintomas do problema',
        manutencao_preventiva: 'tipo de uso do veículo',
        comparacao_precos: 'serviço desejado',
        recomendacao_pecas: 'peça necessária'
      };
      setErro(`Descreva ${campos[tipoSelecionado]}`);
      return;
    }

    setLoading(true);
    setErro('');
    setResultado(null);

    try {
      const response = await fetch('/api/ai/diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: tipoSelecionado,
          veiculo: veiculoLocal,
          sintomas,
          quilometragem,
          ultimaManutencao,
          orcamento,
          localizacao
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Erro na análise');
      }

      setResultado(data.data);
      
    } catch (error) {
      console.error('Erro na análise IA:', error);
      setErro(error instanceof Error ? error.message : 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  const renderCampoEspecifico = () => {
    switch (tipoSelecionado) {
      case 'diagnostico':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descreva os sintomas do problema *
              </label>
              <textarea
                value={sintomas}
                onChange={(e) => setSintomas(e.target.value)}
                placeholder="Ex: Carro está fazendo barulho estranho no motor quando acelero..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quilometragem atual
                </label>
                <input
                  type="text"
                  value={quilometragem}
                  onChange={(e) => setQuilometragem(e.target.value)}
                  placeholder="Ex: 85.000 km"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Última manutenção
                </label>
                <input
                  type="text"
                  value={ultimaManutencao}
                  onChange={(e) => setUltimaManutencao(e.target.value)}
                  placeholder="Ex: Revisão há 6 meses"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 'manutencao_preventiva':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de uso do veículo *
              </label>
              <select
                value={sintomas}
                onChange={(e) => setSintomas(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Selecione o tipo de uso</option>
                <option value="urbano_leve">Urbano leve (até 30 km/dia)</option>
                <option value="urbano_intenso">Urbano intenso (mais de 50 km/dia)</option>
                <option value="rodoviario">Rodoviário (viagens longas)</option>
                <option value="misto">Misto (urbano + rodoviário)</option>
                <option value="severo">Severo (taxi, uber, delivery)</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quilometragem atual *
                </label>
                <input
                  type="text"
                  value={quilometragem}
                  onChange={(e) => setQuilometragem(e.target.value)}
                  placeholder="Ex: 85.000 km"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localização
                </label>
                <input
                  type="text"
                  value={localizacao}
                  onChange={(e) => setLocalizacao(e.target.value)}
                  placeholder="Cidade, Estado"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        );

      case 'comparacao_precos':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Serviço ou reparo desejado *
              </label>
              <input
                type="text"
                value={sintomas}
                onChange={(e) => setSintomas(e.target.value)}
                placeholder="Ex: Troca de pastilhas de freio, revisão dos 60 mil km..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Orçamento disponível
                </label>
                <input
                  type="text"
                  value={orcamento}
                  onChange={(e) => setOrcamento(e.target.value)}
                  placeholder="Ex: 1500"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localização
                </label>
                <input
                  type="text"
                  value={localizacao}
                  onChange={(e) => setLocalizacao(e.target.value)}
                  placeholder="Cidade, Estado"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 'recomendacao_pecas':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peça necessária *
              </label>
              <input
                type="text"
                value={sintomas}
                onChange={(e) => setSintomas(e.target.value)}
                placeholder="Ex: Pastilhas de freio dianteiras, filtro de ar..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Orçamento disponível
              </label>
              <input
                type="text"
                value={orcamento}
                onChange={(e) => setOrcamento(e.target.value)}
                placeholder="Ex: 300"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">🤖 Assistente IA Automotivo</h2>
        <p className="text-gray-600">Análise inteligente com tecnologia GPT-4 especializada em veículos</p>
      </div>

      {/* Seleção do tipo de análise */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tipo de Análise</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {tiposAnalise.map((tipo) => (
            <motion.button
              key={tipo.id}
              onClick={() => setTipoSelecionado(tipo.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                tipoSelecionado === tipo.id
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">{tipo.icon}</span>
                <div className={`w-3 h-3 rounded-full ${tipo.color} ${
                  tipoSelecionado === tipo.id ? 'opacity-100' : 'opacity-40'
                }`}></div>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm mb-1">{tipo.nome}</h4>
              <p className="text-xs text-gray-600">{tipo.descricao}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Informações do veículo */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do Veículo</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Marca *</label>
            <input
              type="text"
              value={veiculoLocal.marca}
              onChange={(e) => handleVeiculoChange('marca', e.target.value)}
              placeholder="Ex: Volkswagen"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Modelo *</label>
            <input
              type="text"
              value={veiculoLocal.modelo}
              onChange={(e) => handleVeiculoChange('modelo', e.target.value)}
              placeholder="Ex: Gol"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ano *</label>
            <input
              type="text"
              value={veiculoLocal.ano}
              onChange={(e) => handleVeiculoChange('ano', e.target.value)}
              placeholder="Ex: 2018"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </div>

      {/* Campos específicos por tipo */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {tiposAnalise.find(t => t.id === tipoSelecionado)?.nome}
        </h3>
        {renderCampoEspecifico()}
      </div>

      {/* Botão de análise */}
      <motion.button
        onClick={handleAnalise}
        disabled={loading}
        className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
        }`}
        whileHover={!loading ? { scale: 1.02 } : undefined}
        whileTap={!loading ? { scale: 0.98 } : undefined}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Analisando com IA...
          </div>
        ) : (
          `🚀 Analisar com IA`
        )}
      </motion.button>

      {/* Erro */}
      <AnimatePresence>
        {erro && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-red-700 text-sm">❌ {erro}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resultado */}
      <AnimatePresence>
        {resultado && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 p-6 bg-gray-50 rounded-lg border"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">{tiposAnalise.find(t => t.id === tipoSelecionado)?.icon}</span>
              Resultado da Análise IA
            </h3>
            <div className="prose prose-sm max-w-none">
              <div 
                className="text-gray-700 whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ 
                  __html: resultado.resposta
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n/g, '<br/>')
                }}
              />
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Análise gerada em: {new Date(resultado.timestamp).toLocaleString('pt-BR')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 