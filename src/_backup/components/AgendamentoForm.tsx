"use client";

import { useState } from 'react';
import { CalendarIcon, ClockIcon, WrenchIcon, TruckIcon, PencilIcon } from '@heroicons/react/24/outline';

interface Servico {
  nome: string;
  descricao?: string;
  preco?: string;
}

interface Veiculo {
  id: string;
  marca: string;
  modelo: string;
  ano: number;
  placa?: string;
}

interface AgendamentoFormProps {
  servicos: Servico[];
  oficina: {
    id: string;
    nome: string;
  };
  onSubmit: (dados: AgendamentoDados) => void;
  className?: string;
}

export interface AgendamentoDados {
  servicoId: string;
  data: string;
  horario: string;
  veiculoId: string;
  veiculoCustom?: {
    marca: string;
    modelo: string;
    ano: number;
    placa?: string;
  };
  observacoes?: string;
}

const AgendamentoForm = ({ servicos, oficina, onSubmit, className = '' }: AgendamentoFormProps) => {
  // Estados do formulário
  const [servicoSelecionado, setServicoSelecionado] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState<string | null>(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null);
  const [veiculoSelecionado, setVeiculoSelecionado] = useState('');
  const [mostrarNovoVeiculo, setMostrarNovoVeiculo] = useState(false);
  const [novoVeiculo, setNovoVeiculo] = useState({
    marca: '',
    modelo: '',
    ano: new Date().getFullYear(),
    placa: ''
  });
  const [observacoes, setObservacoes] = useState('');
  const [erros, setErros] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Veículos do usuário (mockados)
  const veiculos: Veiculo[] = [
    { id: 'v1', marca: 'Fiat', modelo: 'Argo', ano: 2022 },
    { id: 'v2', marca: 'Honda', modelo: 'City', ano: 2020 },
    { id: 'v3', marca: 'Jeep', modelo: 'Compass', ano: 2021 },
  ];

  // Dias disponíveis para agendamento (próximos 7 dias)
  const diasDisponiveis = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });
  
  // Horários disponíveis (a cada 1 hora)
  const horariosDisponiveis = [
    "08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"
  ];
  
  // Função para formatar data em texto legível
  const formatarData = (data: Date) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);
    
    const dataComparacao = new Date(data);
    dataComparacao.setHours(0, 0, 0, 0);
    
    if (dataComparacao.getTime() === hoje.getTime()) {
      return "Hoje";
    } else if (dataComparacao.getTime() === amanha.getTime()) {
      return "Amanhã";
    } else {
      return data.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });
    }
  };

  // Validar formulário
  const validarFormulario = (): boolean => {
    const novosErros: Record<string, string> = {};
    
    if (!servicoSelecionado) {
      novosErros.servico = 'Selecione um serviço';
    }
    
    if (!dataSelecionada) {
      novosErros.data = 'Selecione uma data';
    }
    
    if (!horarioSelecionado) {
      novosErros.horario = 'Selecione um horário';
    }
    
    if (!veiculoSelecionado && !mostrarNovoVeiculo) {
      novosErros.veiculo = 'Selecione um veículo';
    }
    
    if (mostrarNovoVeiculo) {
      if (!novoVeiculo.marca) {
        novosErros.marca = 'Informe a marca do veículo';
      }
      
      if (!novoVeiculo.modelo) {
        novosErros.modelo = 'Informe o modelo do veículo';
      }
    }
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  // Enviar formulário
  const handleSubmit = () => {
    if (!validarFormulario()) {
      return;
    }
    
    setSubmitting(true);
    
    const dados: AgendamentoDados = {
      servicoId: servicoSelecionado,
      data: dataSelecionada!,
      horario: horarioSelecionado!,
      veiculoId: mostrarNovoVeiculo ? 'novo' : veiculoSelecionado,
      observacoes
    };
    
    if (mostrarNovoVeiculo) {
      dados.veiculoCustom = novoVeiculo;
    }
    
    // Simular envio
    setTimeout(() => {
      onSubmit(dados);
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Agendar Serviço</h2>
      
      {/* Tipo de serviço */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center">
            <WrenchIcon className="h-4 w-4 mr-2 text-gray-500" />
            <span>Tipo de serviço</span>
          </div>
        </label>
        <select 
          value={servicoSelecionado}
          onChange={(e) => setServicoSelecionado(e.target.value)}
          className={`w-full border ${erros.servico ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent`}
        >
          <option value="">Selecione um serviço</option>
          {servicos.map((servico, idx) => (
            <option key={idx} value={servico.nome}>{servico.nome}</option>
          ))}
        </select>
        {erros.servico && <p className="mt-1 text-xs text-red-500">{erros.servico}</p>}
      </div>
      
      {/* Data */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
            <span>Selecione uma data</span>
          </div>
        </label>
        <div className="grid grid-cols-7 gap-1 mb-1">
          {diasDisponiveis.map((data, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setDataSelecionada(data.toISOString())}
              className={`p-2 text-center rounded-lg ${
                dataSelecionada === data.toISOString()
                  ? 'bg-[#0047CC] text-white'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              }`}
            >
              <div className="text-xs font-medium">{data.toLocaleDateString('pt-BR', { weekday: 'short' }).substring(0, 3)}</div>
              <div className="font-medium">{formatarData(data)}</div>
            </button>
          ))}
        </div>
        {erros.data && <p className="mt-1 text-xs text-red-500">{erros.data}</p>}
      </div>
      
      {/* Horário */}
      {dataSelecionada && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-2 text-gray-500" />
              <span>Selecione um horário</span>
            </div>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {horariosDisponiveis.map((horario, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setHorarioSelecionado(horario)}
                className={`p-2 text-center rounded-lg text-sm ${
                  horarioSelecionado === horario
                    ? 'bg-[#0047CC] text-white'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
              >
                {horario}
              </button>
            ))}
          </div>
          {erros.horario && <p className="mt-1 text-xs text-red-500">{erros.horario}</p>}
        </div>
      )}
      
      {/* Veículo */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center">
            <TruckIcon className="h-4 w-4 mr-2 text-gray-500" />
            <span>Veículo</span>
          </div>
        </label>
        {!mostrarNovoVeiculo ? (
          <>
            <select 
              value={veiculoSelecionado}
              onChange={(e) => setVeiculoSelecionado(e.target.value)}
              className={`w-full border ${erros.veiculo ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent`}
            >
              <option value="">Selecione um veículo</option>
              {veiculos.map((veiculo) => (
                <option key={veiculo.id} value={veiculo.id}>
                  {veiculo.marca} {veiculo.modelo} {veiculo.ano}
                </option>
              ))}
            </select>
            {erros.veiculo && <p className="mt-1 text-xs text-red-500">{erros.veiculo}</p>}
            <button
              type="button"
              onClick={() => setMostrarNovoVeiculo(true)}
              className="mt-2 text-sm text-[#0047CC] hover:underline flex items-center"
            >
              <PencilIcon className="h-3 w-3 mr-1" />
              Adicionar novo veículo
            </button>
          </>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input 
                  type="text"
                  placeholder="Marca"
                  value={novoVeiculo.marca}
                  onChange={(e) => setNovoVeiculo({...novoVeiculo, marca: e.target.value})}
                  className={`w-full border ${erros.marca ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent`}
                />
                {erros.marca && <p className="mt-1 text-xs text-red-500">{erros.marca}</p>}
              </div>
              <div>
                <input 
                  type="text"
                  placeholder="Modelo"
                  value={novoVeiculo.modelo}
                  onChange={(e) => setNovoVeiculo({...novoVeiculo, modelo: e.target.value})}
                  className={`w-full border ${erros.modelo ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent`}
                />
                {erros.modelo && <p className="mt-1 text-xs text-red-500">{erros.modelo}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input 
                  type="number"
                  placeholder="Ano"
                  value={novoVeiculo.ano}
                  onChange={(e) => setNovoVeiculo({...novoVeiculo, ano: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                />
              </div>
              <div>
                <input 
                  type="text"
                  placeholder="Placa (opcional)"
                  value={novoVeiculo.placa}
                  onChange={(e) => setNovoVeiculo({...novoVeiculo, placa: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                />
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => setMostrarNovoVeiculo(false)}
              className="text-sm text-gray-600 hover:underline flex items-center"
            >
              Voltar para veículos salvos
            </button>
          </div>
        )}
      </div>
      
      {/* Observações */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center">
            <PencilIcon className="h-4 w-4 mr-2 text-gray-500" />
            <span>Observações (opcional)</span>
          </div>
        </label>
        <textarea 
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
          rows={3}
          placeholder="Descreva detalhes adicionais sobre o serviço..."
        ></textarea>
      </div>
      
      {/* Botão de agendamento */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className={`w-full py-3 rounded-lg font-medium transition-colors ${
          submitting
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-[#0047CC] hover:bg-[#0055EB] text-white'
        }`}
      >
        {submitting ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            <span>Processando...</span>
          </div>
        ) : (
          'Solicitar Agendamento'
        )}
      </button>
    </div>
  );
};

export default AgendamentoForm; 