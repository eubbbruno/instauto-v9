"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronLeftIcon, 
  CalendarIcon, 
  ClockIcon, 
  WrenchIcon, 
  TruckIcon, 
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

// Interfaces
interface Servico {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  duracao: number;
  categoria: string;
}

interface Veiculo {
  id: string;
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
}

interface Oficina {
  id: string;
  nome: string;
  endereco: string;
  cidade: string;
  estado: string;
  telefone: string;
  avaliacao: number;
  totalAvaliacoes: number;
  foto?: string;
  horarioFuncionamento: {
    inicio: string;
    fim: string;
    diasAtendimento: number[]
  }
}

// Dados de agendamento
interface DadosAgendamento {
  oficinaId: string;
  veiculoId: string;
  servicosIds: string[];
  data: string;
  horario: string;
  observacoes: string;
}

export default function AgendamentoPage({ params }: { params: { oficinaId: string } }) {
  const router = useRouter();
  
  // Estados
  const [etapa, setEtapa] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  
  // Estados do formulário
  const [veiculoSelecionado, setVeiculoSelecionado] = useState<string>('');
  const [servicosSelecionados, setServicosSelecionados] = useState<string[]>([]);
  const [dataSelecionada, setDataSelecionada] = useState<string>('');
  const [horarioSelecionado, setHorarioSelecionado] = useState<string>('');
  const [observacoes, setObservacoes] = useState<string>('');
  
  // Dados mockados
  const [oficina, setOficina] = useState<Oficina | null>(null);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [horarios, setHorarios] = useState<string[]>([]);
  
  // Data minima para agendamento (hoje)
  const hoje = new Date().toISOString().split('T')[0];
  
  // Carregamento inicial de dados
  useEffect(() => {
    const carregarDados = async () => {
      setCarregando(true);
      try {
        // Simular delay de carregamento
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Em um app real, faria chamadas para a API para cada tipo de dado
        
        // Dados mockados da oficina
        setOficina({
          id: params.oficinaId,
          nome: "Oficina " + params.oficinaId.substring(0, 4).toUpperCase(),
          endereco: "Av. das Oficinas, 123",
          cidade: "São Paulo",
          estado: "SP",
          telefone: "(11) 98765-4321",
          avaliacao: 4.7,
          totalAvaliacoes: 35,
          foto: "https://images.unsplash.com/photo-1597762470488-3877b1f538c6?q=80&w=600&auto=format&fit=crop",
          horarioFuncionamento: {
            inicio: "08:00",
            fim: "18:00",
            diasAtendimento: [1, 2, 3, 4, 5, 6] // Seg a Sab
          }
        });
        
        // Dados mockados de serviços
        setServicos([
          {
            id: "srv-001",
            nome: "Troca de Óleo",
            descricao: "Troca de óleo do motor com filtro incluído",
            preco: 120.00,
            duracao: 30,
            categoria: "manutencao"
          },
          {
            id: "srv-002",
            nome: "Balanceamento",
            descricao: "Balanceamento das quatro rodas",
            preco: 100.00,
            duracao: 45,
            categoria: "rodas"
          },
          {
            id: "srv-003",
            nome: "Alinhamento",
            descricao: "Alinhamento completo da direção",
            preco: 150.00,
            duracao: 60,
            categoria: "rodas"
          },
          {
            id: "srv-004",
            nome: "Revisão Preventiva",
            descricao: "Checagem completa dos principais componentes",
            preco: 250.00,
            duracao: 120,
            categoria: "revisao"
          },
          {
            id: "srv-005",
            nome: "Troca de Pastilhas de Freio",
            descricao: "Substituição das pastilhas de freio dianteiras",
            preco: 180.00,
            duracao: 60,
            categoria: "freios"
          }
        ]);
        
        // Dados mockados de veículos do usuário
        setVeiculos([
          {
            id: "veh-001",
            marca: "Honda",
            modelo: "Civic",
            ano: 2019,
            placa: "ABC-1234"
          },
          {
            id: "veh-002",
            marca: "Toyota",
            modelo: "Corolla",
            ano: 2020,
            placa: "DEF-5678"
          },
          {
            id: "veh-003",
            marca: "Volkswagen",
            modelo: "Golf",
            ano: 2018,
            placa: "GHI-9012"
          }
        ]);
        
        // Horários disponíveis mockados
        gerarHorariosDisponiveis();
        
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setErro("Erro ao carregar dados. Por favor, tente novamente.");
      } finally {
        setCarregando(false);
      }
    };
    
    carregarDados();
  }, [params.oficinaId]);
  
  // Gerar horários disponíveis com base na data selecionada
  const gerarHorariosDisponiveis = () => {
    // Em uma implementação real, isso viria do backend com base na disponibilidade real
    const horariosMock = [];
    
    // Gerar horários de 08:00 às 18:00 a cada 30 minutos
    for (let hora = 8; hora < 18; hora++) {
      for (const minuto of [0, 30]) {
        // Simular alguns horários indisponíveis aleatoriamente
        if (Math.random() > 0.3) {
          const horaFormatada = hora.toString().padStart(2, '0');
          const minutoFormatado = minuto.toString().padStart(2, '0');
          horariosMock.push(`${horaFormatada}:${minutoFormatado}`);
        }
      }
    }
    
    setHorarios(horariosMock);
  };
  
  // Atualizar horários quando a data muda
  useEffect(() => {
    if (dataSelecionada) {
      gerarHorariosDisponiveis();
    }
  }, [dataSelecionada]);
  
  // Manipular seleção de serviços (toggle)
  const toggleServico = (id: string) => {
    setServicosSelecionados(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };
  
  // Calcular preço total dos serviços selecionados
  const calcularTotal = () => {
    return servicos
      .filter(s => servicosSelecionados.includes(s.id))
      .reduce((total, s) => total + s.preco, 0);
  };
  
  // Avançar para a próxima etapa
  const avancarEtapa = () => {
    // Validar dados da etapa atual
    if (etapa === 1 && !veiculoSelecionado) {
      setErro("Por favor, selecione um veículo para continuar.");
      return;
    }
    
    if (etapa === 2 && servicosSelecionados.length === 0) {
      setErro("Por favor, selecione pelo menos um serviço para continuar.");
      return;
    }
    
    if (etapa === 3 && (!dataSelecionada || !horarioSelecionado)) {
      setErro("Por favor, selecione data e horário para continuar.");
      return;
    }
    
    // Limpar erro e avançar
    setErro(null);
    setEtapa(prev => prev + 1);
  };
  
  // Voltar para etapa anterior
  const voltarEtapa = () => {
    setEtapa(prev => prev - 1);
  };
  
  // Enviar agendamento
  const enviarAgendamento = async () => {
    setEnviando(true);
    setErro(null);
    
    try {
      // Montar objeto com dados do agendamento
      const dadosAgendamento: DadosAgendamento = {
        oficinaId: params.oficinaId,
        veiculoId: veiculoSelecionado,
        servicosIds: servicosSelecionados,
        data: dataSelecionada,
        horario: horarioSelecionado,
        observacoes
      };
      
      // Simular envio para API
      console.log('Enviando agendamento:', dadosAgendamento);
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Marcar como sucesso
      setSucesso(true);
      
      // Em um app real, redirecionaria para página de sucesso ou histórico
      setTimeout(() => {
        router.push(`/motorista`);
      }, 3000);
      
    } catch (error) {
      console.error("Erro ao enviar agendamento:", error);
      setErro("Ocorreu um erro ao agendar. Por favor, tente novamente.");
    } finally {
      setEnviando(false);
    }
  };
  
  // Formatar preço para exibição
  const formatarPreco = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  
  // Formatar data para exibição
  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Verificar dia da semana
  const obterDiaSemana = (data: string) => {
    const diasSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    const d = new Date(data);
    return diasSemana[d.getDay()];
  };
  
  // Tela de carregamento
  if (carregando) {
    return (
      <div className="max-w-5xl mx-auto p-4 h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0047CC]"></div>
          <p className="mt-4 text-gray-600">Carregando informações...</p>
        </div>
      </div>
    );
  }
  
  // Tela de erro
  if (erro && !oficina) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-red-700 mb-2">Erro ao carregar</h2>
          <p className="text-red-600 mb-4">{erro}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#0047CC] text-white rounded-lg inline-flex items-center"
          >
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }
  
  // Tela de sucesso
  if (sucesso) {
    return (
      <div className="max-w-5xl mx-auto p-4 mt-8">
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-green-800 mb-2">Agendamento realizado com sucesso!</h1>
          <p className="text-green-700 mb-2">
            Seu agendamento foi confirmado para {formatarData(dataSelecionada)} às {horarioSelecionado}.
          </p>
          <p className="text-green-700 mb-6">
            Você receberá uma confirmação por e-mail e notificação no aplicativo.
          </p>
          <p className="text-sm text-green-600">
            Redirecionando para o painel...
          </p>
        </div>
      </div>
    );
  }
  
  // Verificar se dados foram carregados
  if (!oficina) return null;
  
  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="mb-6">
        <Link 
          href={`/oficina/${params.oficinaId}`}
          className="inline-flex items-center text-[#0047CC] hover:underline"
        >
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          <span>Voltar para oficina</span>
        </Link>
      </div>
      
      {/* Cabeçalho da oficina */}
      <div className="bg-white rounded-xl shadow-sm border mb-6">
        <div className="p-4 flex items-center border-b">
          {oficina.foto ? (
            <img 
              src={oficina.foto} 
              alt={oficina.nome} 
              className="w-16 h-16 rounded-lg object-cover mr-4"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
              <TruckIcon className="h-8 w-8 text-gray-400" />
            </div>
          )}
          
          <div>
            <h1 className="text-xl font-bold text-gray-800">{oficina.nome}</h1>
            <p className="text-gray-600 text-sm">
              {oficina.endereco}, {oficina.cidade}/{oficina.estado}
            </p>
            <div className="flex items-center mt-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(oficina.avaliacao)
                        ? 'text-[#FFDE59]'
                        : i < oficina.avaliacao
                        ? 'text-[#FFDE59]/50'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-1 text-sm text-gray-600">
                {oficina.avaliacao.toFixed(1)} ({oficina.totalAvaliacoes} avaliações)
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Indicador de etapas */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {["Veículo", "Serviços", "Data e Hora", "Confirmação"].map((etapaLabel, index) => (
            <div 
              key={etapaLabel} 
              className={`text-xs sm:text-sm font-medium ${
                etapa > index + 1 
                  ? "text-[#0047CC]"
                  : etapa === index + 1
                  ? "text-gray-800"
                  : "text-gray-400"
              }`}
            >
              {etapaLabel}
            </div>
          ))}
        </div>
        
        <div className="relative">
          <div className="h-1 bg-gray-200 rounded-full"></div>
          <div 
            className="absolute top-0 h-1 bg-[#0047CC] rounded-full transition-all"
            style={{ width: `${(etapa - 1) * 33.3}%` }}
          ></div>
          {[1, 2, 3, 4].map((step) => (
            <div 
              key={step}
              className={`absolute top-0 w-6 h-6 rounded-full flex items-center justify-center -mt-2.5 transform -translate-x-1/2 border-2
                ${
                  etapa > step
                    ? "bg-[#0047CC] border-[#0047CC] text-white"
                    : etapa === step
                    ? "bg-white border-[#0047CC] text-[#0047CC]"
                    : "bg-white border-gray-300 text-gray-400"
                }
              `}
              style={{ left: `${(step - 1) * 33.3}%` }}
            >
              <span className="text-xs font-bold">{step}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Mensagem de erro */}
      {erro && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {erro}
        </div>
      )}
      
      {/* Conteúdo da etapa atual */}
      <div className="bg-white rounded-xl shadow-md">
        
        {/* Etapa 1: Seleção de Veículo */}
        {etapa === 1 && (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Selecione o veículo para o serviço</h2>
            
            <div className="space-y-4">
              {veiculos.map((veiculo) => (
                <div 
                  key={veiculo.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    veiculoSelecionado === veiculo.id
                      ? 'border-[#0047CC] bg-blue-50'
                      : 'border-gray-200 hover:border-[#0047CC]/50 hover:bg-blue-50/50'
                  }`}
                  onClick={() => setVeiculoSelecionado(veiculo.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-800">{veiculo.marca} {veiculo.modelo}</h3>
                      <p className="text-sm text-gray-600">Ano {veiculo.ano} • Placa {veiculo.placa}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      veiculoSelecionado === veiculo.id
                        ? 'border-[#0047CC] bg-[#0047CC]'
                        : 'border-gray-300'
                    }`}>
                      {veiculoSelecionado === veiculo.id && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Etapa 2: Seleção de Serviços */}
        {etapa === 2 && (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Selecione os serviços desejados</h2>
            
            <div className="space-y-4">
              {servicos.map((servico) => (
                <div 
                  key={servico.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    servicosSelecionados.includes(servico.id)
                      ? 'border-[#0047CC] bg-blue-50'
                      : 'border-gray-200 hover:border-[#0047CC]/50 hover:bg-blue-50/50'
                  }`}
                  onClick={() => toggleServico(servico.id)}
                >
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <h3 className="font-medium text-gray-800">{servico.nome}</h3>
                        <span className="font-medium text-gray-800">{formatarPreco(servico.preco)}</span>
                      </div>
                      <p className="text-sm text-gray-600">{servico.descricao}</p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        <span>{servico.duracao} minutos</span>
                      </div>
                    </div>
                    <div className="ml-4 self-center">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        servicosSelecionados.includes(servico.id)
                          ? 'border-[#0047CC] bg-[#0047CC]'
                          : 'border-gray-300'
                      }`}>
                        {servicosSelecionados.includes(servico.id) && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Total */}
              {servicosSelecionados.length > 0 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-700">{servicosSelecionados.length} {servicosSelecionados.length === 1 ? 'serviço' : 'serviços'} selecionado{servicosSelecionados.length > 1 ? 's' : ''}</p>
                    </div>
                    <div className="text-lg font-bold text-[#0047CC]">
                      {formatarPreco(calcularTotal())}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Etapa 3: Data e Hora */}
        {etapa === 3 && (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Selecione a data e hora</h2>
            
            <div className="space-y-6">
              {/* Seleção de data */}
              <div>
                <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-2">
                  Data
                </label>
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <input 
                    type="date" 
                    id="data"
                    value={dataSelecionada}
                    min={hoje}
                    onChange={(e) => {
                      setDataSelecionada(e.target.value);
                      setHorarioSelecionado('');
                    }}
                    className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                  />
                </div>
                
                {dataSelecionada && (
                  <p className="text-sm text-gray-600 mt-1">
                    {obterDiaSemana(dataSelecionada)} • {formatarData(dataSelecionada)}
                  </p>
                )}
              </div>
              
              {/* Seleção de horário */}
              {dataSelecionada && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horário
                  </label>
                  
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {horarios.length > 0 ? (
                      horarios.map((horario) => (
                        <button
                          key={horario}
                          type="button"
                          onClick={() => setHorarioSelecionado(horario)}
                          className={`p-2 border rounded-lg text-center text-sm transition-colors ${
                            horarioSelecionado === horario
                              ? 'bg-[#0047CC] text-white border-[#0047CC]'
                              : 'border-gray-300 hover:border-[#0047CC]/50'
                          }`}
                        >
                          {horario}
                        </button>
                      ))
                    ) : (
                      <div className="col-span-full text-center p-4 text-gray-500">
                        Nenhum horário disponível nesta data
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Observações */}
              <div>
                <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-2">
                  Observações (opcional)
                </label>
                <textarea
                  id="observacoes"
                  rows={3}
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Informe detalhes adicionais sobre o serviço, se necessário"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                  maxLength={500}
                />
                <div className="flex justify-end text-xs text-gray-500 mt-1">
                  {observacoes.length}/500
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Etapa 4: Confirmação */}
        {etapa === 4 && (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Confirmar agendamento</h2>
            
            <div className="space-y-6">
              {/* Resumo do agendamento */}
              <div className="space-y-4">
                {/* Veículo */}
                <div className="rounded-lg border border-gray-200 p-4">
                  <h3 className="font-medium text-gray-700 mb-2">Veículo</h3>
                  {veiculos.find(v => v.id === veiculoSelecionado) && (
                    <div className="flex items-center">
                      <TruckIcon className="h-5 w-5 text-gray-500 mr-2" />
                      <div>
                        <p className="text-gray-800">
                          {veiculos.find(v => v.id === veiculoSelecionado)?.marca} {veiculos.find(v => v.id === veiculoSelecionado)?.modelo}
                        </p>
                        <p className="text-sm text-gray-600">
                          Ano {veiculos.find(v => v.id === veiculoSelecionado)?.ano} • 
                          Placa {veiculos.find(v => v.id === veiculoSelecionado)?.placa}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Serviços */}
                <div className="rounded-lg border border-gray-200 p-4">
                  <h3 className="font-medium text-gray-700 mb-2">Serviços</h3>
                  <div className="space-y-3">
                    {servicosSelecionados.map(id => {
                      const servico = servicos.find(s => s.id === id);
                      if (!servico) return null;
                      
                      return (
                        <div key={id} className="flex justify-between text-sm">
                          <div className="flex items-start">
                            <WrenchIcon className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                            <p className="text-gray-800">{servico.nome}</p>
                          </div>
                          <p className="text-gray-700">{formatarPreco(servico.preco)}</p>
                        </div>
                      );
                    })}
                    
                    <div className="border-t pt-3 mt-3 flex justify-between font-medium">
                      <span>Total</span>
                      <span className="text-[#0047CC]">{formatarPreco(calcularTotal())}</span>
                    </div>
                  </div>
                </div>
                
                {/* Data e hora */}
                <div className="rounded-lg border border-gray-200 p-4">
                  <h3 className="font-medium text-gray-700 mb-2">Data e Hora</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
                      <p className="text-gray-800">{formatarData(dataSelecionada)} ({obterDiaSemana(dataSelecionada)})</p>
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-5 w-5 text-gray-500 mr-2" />
                      <p className="text-gray-800">{horarioSelecionado}</p>
                    </div>
                  </div>
                </div>
                
                {/* Observações */}
                {observacoes && (
                  <div className="rounded-lg border border-gray-200 p-4">
                    <h3 className="font-medium text-gray-700 mb-2">Observações</h3>
                    <p className="text-gray-800 text-sm">{observacoes}</p>
                  </div>
                )}
                
                {/* Política de cancelamento */}
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <p><strong>Política de cancelamento:</strong> Cancelamentos gratuitos até 24 horas antes do horário agendado. Após esse período, poderá ser cobrada uma taxa de cancelamento.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Botões de navegação */}
        <div className="border-t p-4 flex justify-between">
          {etapa > 1 ? (
            <button
              onClick={voltarEtapa}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={enviando}
            >
              Voltar
            </button>
          ) : (
            <div></div>
          )}
          
          {etapa < 4 ? (
            <button
              onClick={avancarEtapa}
              className="px-6 py-2 bg-[#0047CC] text-white rounded-lg hover:bg-[#0039A6] transition-colors"
            >
              Continuar
            </button>
          ) : (
            <button
              onClick={enviarAgendamento}
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
                  Processando...
                </>
              ) : (
                'Confirmar Agendamento'
              )}
            </button>
          )}
        </div>
        
      </div>
    </div>
  );
} 