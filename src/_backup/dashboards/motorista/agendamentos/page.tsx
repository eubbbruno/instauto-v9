"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  CalendarIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  ArrowPathIcon, 
  XCircleIcon,
  MapPinIcon,
  WrenchIcon,
  TruckIcon
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import GlobalHeader from "@/components/GlobalHeader";
import Footer from "@/components/Footer";

// Definição da interface expandida para um agendamento
interface Agendamento {
  id: string;
  oficina: {
    id: string;
    nome: string;
    endereco: string;
    avaliacao: number;
    foto?: string;
    telefone: string;
    distancia: string;
  };
  veiculo: {
    id: string;
    marca: string;
    modelo: string;
    ano: number;
    placa: string;
  };
  servicos: {
    nome: string;
    preco: number;
    tempo: string;
  }[];
  data: string;
  horario: string;
  status: "agendado" | "confirmado" | "em_andamento" | "concluido" | "cancelado";
  observacoes?: string;
  avaliado: boolean;
  notificacoes: number;
  prioridade: "normal" | "alta" | "urgente";
  metodoPagamento?: string;
  feedback?: string;
  oficinaId: string;
  oficinaNome: string;
  oficinaEndereco: string;
  oficinaTelefone: string;
  dataAgendamento: string;
  precoTotal: number;
  duracaoEstimada: string;
}

export default function AgendamentosPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [carregando, setCarregando] = useState(true);

  // Carregar dados dos agendamentos expandidos
  useEffect(() => {
    const carregarAgendamentos = async () => {
      setCarregando(true);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const dataAtual = new Date();
        const agendamentosMock: Agendamento[] = [
          {
            id: "agd001",
            oficina: {
              id: "of001",
              nome: "Auto Center Silva",
              endereco: "Av. Paulista, 1500 - São Paulo, SP",
              avaliacao: 4.8,
              foto: "https://images.unsplash.com/photo-1597762470488-3877b1f538c6?q=80&w=600&auto=format&fit=crop",
              telefone: "(11) 99999-1111",
              distancia: "2,5 km"
            },
            veiculo: {
              id: "veh001",
              marca: "Honda",
              modelo: "Civic",
              ano: 2019,
              placa: "ABC-1234"
            },
            servicos: [
              { nome: "Troca de óleo", preco: 120, tempo: "30min" },
              { nome: "Alinhamento", preco: 100, tempo: "45min" }
            ],
            data: new Date(dataAtual.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            horario: "14:30",
            status: "agendado",
            observacoes: "Favor verificar também os níveis de fluidos.",
            avaliado: false,
            notificacoes: 2,
            prioridade: "normal",
            metodoPagamento: "Cartão de Crédito",
            oficinaId: "of001",
            oficinaNome: "Auto Center Silva",
            oficinaEndereco: "Av. Paulista, 1500 - São Paulo, SP",
            oficinaTelefone: "(11) 99999-1111",
            dataAgendamento: "2024-11-20",
            precoTotal: 329.80,
            duracaoEstimada: "1h 15min"
          },
          {
            id: "agd002",
            oficina: {
              id: "of002",
              nome: "Mecânica Express 24h",
              endereco: "Rua Augusta, 800 - São Paulo, SP",
              avaliacao: 4.5,
              foto: "https://images.unsplash.com/photo-1629784565254-c54a7963d697?q=80&w=600&auto=format&fit=crop",
              telefone: "(11) 99999-2222",
              distancia: "3,8 km"
            },
            veiculo: {
              id: "veh002",
              marca: "Toyota",
              modelo: "Corolla",
              ano: 2020,
              placa: "DEF-5678"
            },
            servicos: [
              { nome: "Revisão completa", preco: 350, tempo: "2h" }
            ],
            data: new Date().toISOString().split('T')[0],
            horario: "09:00",
            status: "em_andamento",
            observacoes: "Veículo será utilizado para viagem longa.",
            avaliado: false,
            notificacoes: 1,
            prioridade: "alta",
            metodoPagamento: "PIX",
            oficinaId: "of002",
            oficinaNome: "Mecânica Express 24h",
            oficinaEndereco: "Rua Augusta, 800 - São Paulo, SP",
            oficinaTelefone: "(11) 99999-2222",
            dataAgendamento: "2024-11-15",
            precoTotal: 350,
            duracaoEstimada: "2h"
          },
          {
            id: "agd003",
            oficina: {
              id: "of003",
              nome: "Oficina do João",
              endereco: "Rua Vergueiro, 1200 - São Paulo, SP",
              avaliacao: 4.2,
              telefone: "(11) 99999-3333",
              distancia: "1,2 km"
            },
            veiculo: {
              id: "veh001",
              marca: "Honda",
              modelo: "Civic",
              ano: 2019,
              placa: "ABC-1234"
            },
            servicos: [
              { nome: "Troca de pastilhas de freio", preco: 180, tempo: "1h" },
              { nome: "Verificação de suspensão", preco: 90, tempo: "30min" }
            ],
            data: new Date(dataAtual.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            horario: "11:00",
            status: "concluido",
            avaliado: true,
            notificacoes: 0,
            prioridade: "normal",
            metodoPagamento: "Dinheiro",
            feedback: "Excelente atendimento!",
            oficinaId: "of003",
            oficinaNome: "Oficina do João",
            oficinaEndereco: "Rua Vergueiro, 1200 - São Paulo, SP",
            oficinaTelefone: "(11) 99999-3333",
            dataAgendamento: "2024-11-15",
            precoTotal: 349.90,
            duracaoEstimada: "2h"
          },
          {
            id: "agd004",
            oficina: {
              id: "of004",
              nome: "AutoElétrica Moderna",
              endereco: "Av. Brigadeiro Faria Lima, 2500 - São Paulo, SP",
              avaliacao: 4.9,
              foto: "https://images.unsplash.com/photo-1560269507-0ecbc7a69e58?q=80&w=600&auto=format&fit=crop",
              telefone: "(11) 99999-4444",
              distancia: "5,7 km"
            },
            veiculo: {
              id: "veh002",
              marca: "Toyota",
              modelo: "Corolla",
              ano: 2020,
              placa: "DEF-5678"
            },
            servicos: [
              { nome: "Diagnóstico computadorizado", preco: 150, tempo: "45min" },
              { nome: "Recarga de ar condicionado", preco: 200, tempo: "1h30min" }
            ],
            data: new Date(dataAtual.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            horario: "16:00",
            status: "confirmado",
            avaliado: false,
            notificacoes: 3,
            prioridade: "normal",
            metodoPagamento: "Cartão de Débito",
            oficinaId: "of004",
            oficinaNome: "AutoElétrica Moderna",
            oficinaEndereco: "Av. Brigadeiro Faria Lima, 2500 - São Paulo, SP",
            oficinaTelefone: "(11) 99999-4444",
            dataAgendamento: "2024-11-19",
            precoTotal: 349.90,
            duracaoEstimada: "2h"
          },
          {
            id: "agd005",
            oficina: {
              id: "of005",
              nome: "Pneus & Rodas Premium",
              endereco: "Av. Rebouças, 1000 - São Paulo, SP",
              avaliacao: 4.7,
              telefone: "(11) 99999-5555",
              distancia: "4,1 km"
            },
            veiculo: {
              id: "veh003",
              marca: "Fiat",
              modelo: "Uno",
              ano: 2018,
              placa: "GHI-9012"
            },
            servicos: [
              { nome: "Troca de pneus", preco: 800, tempo: "2h" }
            ],
            data: new Date(dataAtual.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            horario: "14:00",
            status: "cancelado",
            observacoes: "Cliente cancelou por indisponibilidade.",
            avaliado: false,
            notificacoes: 0,
            prioridade: "normal",
            oficinaId: "of005",
            oficinaNome: "Pneus & Rodas Premium",
            oficinaEndereco: "Av. Rebouças, 1000 - São Paulo, SP",
            oficinaTelefone: "(11) 99999-5555",
            dataAgendamento: "2024-11-15",
            precoTotal: 800,
            duracaoEstimada: "2h"
          }
        ];
        
        setAgendamentos(agendamentosMock);
      } catch (error) {
        console.error("Erro ao carregar agendamentos:", error);
      } finally {
        setCarregando(false);
      }
    };
    
    carregarAgendamentos();
  }, []);

  // Calcular estatísticas dos agendamentos
  const stats = {
    total: agendamentos.length,
    hoje: agendamentos.filter(a => a.data === new Date().toISOString().split('T')[0]).length,
    proximos: agendamentos.filter(a => {
      const hoje = new Date().toISOString().split('T')[0];
      return a.data > hoje && (a.status === "agendado" || a.status === "confirmado");
    }).length,
    concluidos: agendamentos.filter(a => a.status === "concluido").length,
    gastoTotal: agendamentos
      .filter(a => a.status === "concluido")
      .reduce((total, a) => total + a.servicos.reduce((sum, s) => sum + s.preco, 0), 0),
    notificacoes: agendamentos.reduce((total, a) => total + a.notificacoes, 0)
  };

  // Filtrar agendamentos
  const agendamentosFiltrados = () => {
    let resultado = [...agendamentos];
    
    if (filtroStatus !== "todos") {
      resultado = resultado.filter(agendamento => agendamento.status === filtroStatus);
    }
    
    const hoje = new Date().toISOString().split('T')[0];
    if (filtroPeriodo === "passados") {
      resultado = resultado.filter(agendamento => agendamento.data < hoje);
    } else if (filtroPeriodo === "hoje") {
      resultado = resultado.filter(agendamento => agendamento.data === hoje);
    } else if (filtroPeriodo === "futuros") {
      resultado = resultado.filter(agendamento => agendamento.data > hoje);
    }
    
    if (termoBusca.trim() !== "") {
      const termo = termoBusca.toLowerCase();
      resultado = resultado.filter(agendamento =>
        agendamento.oficina.nome.toLowerCase().includes(termo) ||
        agendamento.veiculo.marca.toLowerCase().includes(termo) ||
        agendamento.veiculo.modelo.toLowerCase().includes(termo) ||
        agendamento.veiculo.placa.toLowerCase().includes(termo) ||
        agendamento.servicos.some(s => s.nome.toLowerCase().includes(termo))
      );
    }
    
    return resultado.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  };

  // Funções auxiliares
  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const calcularTotal = (servicos: {nome: string, preco: number}[]) => {
    return servicos.reduce((total, servico) => total + servico.preco, 0);
  };

  const getStatusColor = (status: Agendamento['status']) => {
    switch (status) {
      case "agendado": return "bg-blue-50 text-blue-700 border-blue-200";
      case "confirmado": return "bg-green-50 text-green-700 border-green-200";
      case "em_andamento": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "concluido": return "bg-purple-50 text-purple-700 border-purple-200";
      case "cancelado": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: Agendamento['status']) => {
    switch (status) {
      case "agendado": return ClockIcon;
      case "confirmado": return CheckCircleIcon;
      case "em_andamento": return ArrowPathIcon;
      case "concluido": return SparklesIcon;
      case "cancelado": return XCircleIcon;
      default: return ClockIcon;
    }
  };

  const getStatusText = (status: Agendamento['status']) => {
    switch (status) {
      case "agendado": return "Agendado";
      case "confirmado": return "Confirmado";
      case "em_andamento": return "Em Andamento";
      case "concluido": return "Concluído";
      case "cancelado": return "Cancelado";
      default: return "Desconhecido";
    }
  };

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case "alta": return "text-orange-600";
      case "urgente": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getStatusActions = (agendamento: Agendamento) => {
    switch (agendamento.status) {
          case "agendado":
      return (
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => {
              // Lógica para cancelar agendamento
              console.log('Cancelar agendamento:', agendamento.id);
            }}
            className="px-4 py-3 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors min-h-[44px] border border-red-200"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              // Lógica para remarcar agendamento
              console.log('Remarcar agendamento:', agendamento.id);
            }}
            className="px-4 py-3 text-sm font-medium text-[#0047CC] hover:text-[#003DA6] hover:bg-blue-50 rounded-lg transition-colors min-h-[44px] border border-blue-200"
          >
            Remarcar
          </button>
        </div>
      );
          case "confirmado":
      return (
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => {
              // Lógica para cancelar agendamento
              console.log('Cancelar agendamento:', agendamento.id);
            }}
            className="px-4 py-3 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors min-h-[44px] border border-red-200"
          >
            Cancelar
          </button>
          <Link
            href={`/motorista/agendamentos/${agendamento.id}/acompanhar`}
            className="px-4 py-3 text-sm font-medium text-[#0047CC] hover:text-[#003DA6] hover:bg-blue-50 rounded-lg transition-colors min-h-[44px] border border-blue-200 text-center flex items-center justify-center"
          >
            Acompanhar
          </Link>
        </div>
      );
      case "em_andamento":
        return (
          <div className="flex items-center space-x-2">
            <Link
              href={`/motorista/agendamentos/${agendamento.id}/acompanhar`}
              className="px-3 py-1 text-sm text-[#0047CC] hover:text-[#003DA6] hover:bg-blue-50 rounded-lg transition-colors"
            >
              Acompanhar
            </Link>
          </div>
        );
      case "concluido":
        return (
          <div className="flex items-center space-x-2">
            {!agendamento.avaliado && (
              <Link
                href={`/motorista/agendamentos/${agendamento.id}/avaliar`}
                className="px-3 py-1 text-sm text-[#FFDE59] hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors border border-[#FFDE59]"
              >
                Avaliar
              </Link>
            )}
            <Link
              href={`/motorista/agendamentos/${agendamento.id}/detalhes`}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Ver detalhes
            </Link>
          </div>
        );
      case "cancelado":
        return (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                // Lógica para reagendar
                console.log('Reagendar:', agendamento.id);
              }}
              className="px-3 py-1 text-sm text-[#0047CC] hover:text-[#003DA6] hover:bg-blue-50 rounded-lg transition-colors"
            >
              Reagendar
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  // Animações
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalHeader 
        title="Meus Agendamentos"
        showSearch={false}
        customActions={
          <Link 
            href="/motorista/dashboard" 
            className="hidden md:flex items-center space-x-2 px-4 py-2 text-sm font-medium text-[#0047CC] hover:bg-blue-50 rounded-lg transition-colors"
          >
            <span>Dashboard</span>
          </Link>
        }
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header da página */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Meus Agendamentos</h1>
              <p className="text-gray-600">Acompanhe seus serviços agendados</p>
            </div>
            
            <Link 
              href="/oficinas/busca"
              className="bg-[#0047CC] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#003DA6] transition-colors"
            >
              Novo agendamento
            </Link>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: "todos", label: "Todos" },
              { key: "agendado", label: "Agendados" },
              { key: "confirmado", label: "Confirmados" },
              { key: "em_andamento", label: "Em andamento" },
              { key: "concluido", label: "Concluídos" }
            ].map((filtro) => (
              <button
                key={filtro.key}
                onClick={() => setFiltroStatus(filtro.key)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filtroStatus === filtro.key
                    ? 'bg-[#0047CC] text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {filtro.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Agendamentos */}
        <div className="space-y-4">
          {agendamentosFiltrados().length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 md:p-12 text-center">
              <WrenchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum agendamento encontrado
              </h3>
              <p className="text-gray-600 mb-6 text-sm md:text-base">
                {filtroStatus === "todos" 
                  ? "Você ainda não tem agendamentos."
                  : `Não há agendamentos com status "${getStatusText(filtroStatus as Agendamento['status']).toLowerCase()}".`
                }
              </p>
              <Link 
                href="/oficinas/busca"
                className="bg-[#0047CC] text-white px-6 py-4 rounded-lg font-medium hover:bg-[#003DA6] transition-colors inline-block min-h-[48px] flex items-center justify-center"
              >
                Agendar serviço
              </Link>
            </div>
          ) : (
            agendamentosFiltrados().map((agendamento, index) => {
              const StatusIcon = getStatusIcon(agendamento.status);
              
              return (
                <motion.div
                  key={agendamento.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-4 md:p-6">
                    {/* Header do agendamento - Responsivo */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 space-y-3 sm:space-y-0">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {agendamento.oficina.nome}
                          </h3>
                          <div className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full w-fit ${getStatusColor(agendamento.status)}`}>
                            <StatusIcon className="h-3 w-3" />
                            <span>{getStatusText(agendamento.status)}</span>
                          </div>
                        </div>
                        
                        {/* Info mobile-friendly */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <CalendarIcon className="h-4 w-4 flex-shrink-0" />
                            <span>{formatarData(agendamento.data)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ClockIcon className="h-4 w-4 flex-shrink-0" />
                            <span>{agendamento.horario}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <TruckIcon className="h-4 w-4 flex-shrink-0" />
                            <span>{agendamento.veiculo.marca} {agendamento.veiculo.modelo}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPinIcon className="h-4 w-4 flex-shrink-0" />
                            <span>{agendamento.oficina.distancia}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Botões de ação - Mobile-friendly */}
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 w-full sm:w-auto">
                        {getStatusActions(agendamento)}
                      </div>
                    </div>

                    {/* Serviços */}
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Serviços:</h4>
                      <div className="space-y-1">
                        {agendamento.servicos.map((servico, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <span className="text-gray-700">{servico.nome}</span>
                            <span className="font-medium text-gray-900">R$ {servico.preco}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Total - Destacado */}
                      <div className="border-t mt-3 pt-3 flex justify-between items-center">
                        <span className="font-semibold text-gray-900">Total:</span>
                        <span className="text-lg font-bold text-[#0047CC]">
                          R$ {calcularTotal(agendamento.servicos).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Observações se houver */}
                    {agendamento.observacoes && (
                      <div className="border-t pt-4 mt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Observações:</h4>
                        <p className="text-sm text-gray-600 italic">{agendamento.observacoes}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
} 