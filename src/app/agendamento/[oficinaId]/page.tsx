"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClockIcon,
  MapPinIcon,
  StarIcon,
  PhoneIcon,
  CheckCircleIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import GlobalHeader from "@/components/GlobalHeader";
import Footer from "@/components/Footer";

interface Servico {
  id: string;
  nome: string;
  descricao: string;
  preco: string;
  duracao: string;
  categoria: string;
}

interface HorarioDisponivel {
  hora: string;
  disponivel: boolean;
}

export default function AgendamentoPage({ params }: { params: { oficinaId: string } }) {
  const [etapaAtual, setEtapaAtual] = useState<"servicos" | "data" | "dados" | "confirmacao">("servicos");
  const [servicosSelecionados, setServicosSelecionados] = useState<string[]>([]);
  const [dataSelecionada, setDataSelecionada] = useState<string | null>(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null);
  const [dadosCliente, setDadosCliente] = useState({
    nome: "",
    telefone: "",
    email: "",
    veiculo: {
      marca: "",
      modelo: "",
      ano: "",
      placa: ""
    },
    observacoes: ""
  });

  // Mock da oficina
  const oficina = {
    id: params.oficinaId,
    nome: "Auto Center Silva Premium",
    endereco: "Av. Paulista, 1500 - Bela Vista, São Paulo - SP",
    telefone: "(11) 3333-4444",
    avaliacao: 4.8,
    totalAvaliacoes: 254,
    foto: "/images/oficina1.jpg"
  };

  // Mock dos serviços
  const servicos: Servico[] = [
    { id: "1", nome: "Troca de óleo", descricao: "Inclui óleo sintético e filtro original", preco: "R$ 149,90", duracao: "30 min", categoria: "Manutenção" },
    { id: "2", nome: "Freios", descricao: "Troca de pastilhas e discos", preco: "R$ 249,90", duracao: "1h 30min", categoria: "Segurança" },
    { id: "3", nome: "Alinhamento", descricao: "Alinhamento e balanceamento", preco: "R$ 179,90", duracao: "45 min", categoria: "Rodas" },
    { id: "4", nome: "Revisão completa", descricao: "Checagem de 60+ itens", preco: "R$ 349,90", duracao: "2h", categoria: "Manutenção" },
    { id: "5", nome: "Diagnóstico", descricao: "Escaneamento eletrônico", preco: "R$ 119,90", duracao: "1h", categoria: "Diagnóstico" },
    { id: "6", nome: "Ar condicionado", descricao: "Limpeza e recarga", preco: "R$ 199,90", duracao: "1h 15min", categoria: "Conforto" }
  ];

  // Próximos 7 dias úteis
  const diasDisponiveis = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1); // Começar do próximo dia
    // Pular fins de semana (sábado=6, domingo=0)
    while (date.getDay() === 0 || date.getDay() === 6) {
      date.setDate(date.getDate() + 1);
    }
    return date;
  });

  // Horários disponíveis
  const horariosDisponiveis: HorarioDisponivel[] = [
    { hora: "08:00", disponivel: true },
    { hora: "09:00", disponivel: true },
    { hora: "10:00", disponivel: false },
    { hora: "11:00", disponivel: true },
    { hora: "13:00", disponivel: true },
    { hora: "14:00", disponivel: true },
    { hora: "15:00", disponivel: false },
    { hora: "16:00", disponivel: true },
    { hora: "17:00", disponivel: true }
  ];

  const etapas = [
    { id: "servicos", label: "Serviços", concluida: etapaAtual !== "servicos" },
    { id: "data", label: "Data e Hora", concluida: etapaAtual === "dados" || etapaAtual === "confirmacao" },
    { id: "dados", label: "Seus Dados", concluida: etapaAtual === "confirmacao" },
    { id: "confirmacao", label: "Confirmação", concluida: false }
  ];

  const toggleServico = (servicoId: string) => {
    setServicosSelecionados(prev =>
      prev.includes(servicoId)
        ? prev.filter(id => id !== servicoId)
        : [...prev, servicoId]
    );
  };

  const formatDate = (date: Date) => {
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    if (date.toDateString() === hoje.toDateString()) {
      return "Hoje";
    } else if (date.toDateString() === amanha.toDateString()) {
      return "Amanhã";
    } else {
      return date.toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };

  const calcularPrecoTotal = () => {
    return servicosSelecionados.reduce((total, servicoId) => {
      const servico = servicos.find(s => s.id === servicoId);
      if (servico) {
        const preco = parseFloat(servico.preco.replace('R$ ', '').replace(',', '.'));
        return total + preco;
      }
      return total;
    }, 0);
  };

  const calcularDuracaoTotal = () => {
    let totalMinutos = 0;
    servicosSelecionados.forEach(servicoId => {
      const servico = servicos.find(s => s.id === servicoId);
      if (servico) {
        const duracao = servico.duracao;
        if (duracao.includes('h')) {
          const horas = parseInt(duracao.split('h')[0]);
          totalMinutos += horas * 60;
          if (duracao.includes('min')) {
            const minutos = parseInt(duracao.split('h')[1].replace(' ', '').replace('min', ''));
            totalMinutos += minutos;
          }
        } else if (duracao.includes('min')) {
          totalMinutos += parseInt(duracao.replace(' min', ''));
        }
      }
    });
    
    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;
    
    if (horas > 0 && minutos > 0) {
      return `${horas}h ${minutos}min`;
    } else if (horas > 0) {
      return `${horas}h`;
    } else {
      return `${minutos}min`;
    }
  };

  const podeAvancar = () => {
    switch (etapaAtual) {
      case "servicos":
        return servicosSelecionados.length > 0;
      case "data":
        return dataSelecionada && horarioSelecionado;
      case "dados":
        return dadosCliente.nome && dadosCliente.telefone && dadosCliente.email;
      default:
        return false;
    }
  };

  const proximaEtapa = () => {
    if (etapaAtual === "servicos") setEtapaAtual("data");
    else if (etapaAtual === "data") setEtapaAtual("dados");
    else if (etapaAtual === "dados") setEtapaAtual("confirmacao");
  };

  const etapaAnterior = () => {
    if (etapaAtual === "confirmacao") setEtapaAtual("dados");
    else if (etapaAtual === "dados") setEtapaAtual("data");
    else if (etapaAtual === "data") setEtapaAtual("servicos");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Global */}
      <GlobalHeader 
        title="Agendamento de Serviço"
        showSearch={false}
        customActions={
          <Link 
            href={`/oficinas/${params.oficinaId}`} 
            className="hidden md:flex items-center space-x-2 px-4 py-2 text-sm font-medium text-[#0047CC] hover:bg-blue-50 rounded-lg transition-colors"
          >
            <span>Voltar para oficina</span>
          </Link>
        }
      />

      {/* Header de Navegação */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <Link 
            href={`/oficinas/${params.oficinaId}`} 
            className="flex items-center text-[#0047CC] hover:text-[#003DA6] text-sm font-medium"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Voltar para oficina
          </Link>
        </div>
      </div>

      {/* Card da Oficina */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Image
              src={oficina.foto}
              alt={oficina.nome}
              width={64}
              height={64}
              className="rounded-lg object-cover"
            />
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900">{oficina.nome}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                <div className="flex items-center space-x-1">
                  <MapPinIcon className="h-4 w-4" />
                  <span>{oficina.endereco}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                  <span>{oficina.avaliacao} ({oficina.totalAvaliacoes} avaliações)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de Etapas */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <nav className="flex justify-center">
            {etapas.map((etapa, index) => (
              <div key={etapa.id} className="flex items-center">
                <div className={`flex items-center space-x-2 ${
                  etapa.id === etapaAtual ? 'text-[#0047CC]' : 
                  etapa.concluida ? 'text-green-600' : 'text-gray-400'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    etapa.id === etapaAtual ? 'bg-[#0047CC] text-white' :
                    etapa.concluida ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {etapa.concluida ? '✓' : index + 1}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{etapa.label}</span>
                </div>
                {index < etapas.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    etapa.concluida ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={etapaAtual}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                {etapaAtual === "servicos" && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Selecione os serviços desejados
                    </h2>
                    
                    <div className="space-y-4">
                      {servicos.map((servico) => (
                        <div
                          key={servico.id}
                          onClick={() => toggleServico(servico.id)}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            servicosSelecionados.includes(servico.id)
                              ? 'border-[#0047CC] bg-blue-50 ring-2 ring-[#0047CC]/20'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className={`w-5 h-5 rounded border-2 mt-0.5 flex items-center justify-center ${
                                servicosSelecionados.includes(servico.id)
                                  ? 'border-[#0047CC] bg-[#0047CC]'
                                  : 'border-gray-300'
                              }`}>
                                {servicosSelecionados.includes(servico.id) && (
                                  <CheckCircleIcon className="h-3 w-3 text-white" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium text-gray-900">{servico.nome}</h3>
                                <p className="text-sm text-gray-600 mt-1">{servico.descricao}</p>
                                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                  <span className="flex items-center">
                                    <ClockIcon className="h-3 w-3 mr-1" />
                                    {servico.duracao}
                                  </span>
                                  <span className="px-2 py-1 bg-gray-100 rounded-full">
                                    {servico.categoria}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-[#0047CC]">{servico.preco}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {etapaAtual === "data" && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Escolha data e horário
                    </h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Data</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {diasDisponiveis.map((dia, index) => (
                            <button
                              key={index}
                              onClick={() => setDataSelecionada(dia.toISOString())}
                              className={`p-3 rounded-lg border text-center transition-all ${
                                dataSelecionada === dia.toISOString()
                                  ? 'border-[#0047CC] bg-blue-50 text-[#0047CC]'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="text-sm font-medium">
                                {formatDate(dia)}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {dia.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Horário</h3>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                          {horariosDisponiveis.map((horario) => (
                            <button
                              key={horario.hora}
                              disabled={!horario.disponivel}
                              onClick={() => setHorarioSelecionado(horario.hora)}
                              className={`p-3 rounded-lg border text-center transition-all ${
                                !horario.disponivel
                                  ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : horarioSelecionado === horario.hora
                                    ? 'border-[#0047CC] bg-blue-50 text-[#0047CC]'
                                    : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="text-sm font-medium">{horario.hora}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {etapaAtual === "dados" && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Seus dados
                    </h2>
                    
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nome completo *
                          </label>
                          <input
                            type="text"
                            value={dadosCliente.nome}
                            onChange={(e) => setDadosCliente(prev => ({ ...prev, nome: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC] outline-none"
                            placeholder="Seu nome completo"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Telefone *
                          </label>
                          <input
                            type="tel"
                            value={dadosCliente.telefone}
                            onChange={(e) => setDadosCliente(prev => ({ ...prev, telefone: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC] outline-none"
                            placeholder="(11) 99999-9999"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          E-mail *
                        </label>
                        <input
                          type="email"
                          value={dadosCliente.email}
                          onChange={(e) => setDadosCliente(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC] outline-none"
                          placeholder="seu@email.com"
                        />
                      </div>

                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Dados do veículo</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Marca
                            </label>
                            <input
                              type="text"
                              value={dadosCliente.veiculo.marca}
                              onChange={(e) => setDadosCliente(prev => ({ 
                                ...prev, 
                                veiculo: { ...prev.veiculo, marca: e.target.value }
                              }))}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC] outline-none"
                              placeholder="Ex: Toyota"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Modelo
                            </label>
                            <input
                              type="text"
                              value={dadosCliente.veiculo.modelo}
                              onChange={(e) => setDadosCliente(prev => ({ 
                                ...prev, 
                                veiculo: { ...prev.veiculo, modelo: e.target.value }
                              }))}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC] outline-none"
                              placeholder="Ex: Corolla"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Ano
                            </label>
                            <input
                              type="text"
                              value={dadosCliente.veiculo.ano}
                              onChange={(e) => setDadosCliente(prev => ({ 
                                ...prev, 
                                veiculo: { ...prev.veiculo, ano: e.target.value }
                              }))}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC] outline-none"
                              placeholder="Ex: 2020"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Placa
                            </label>
                            <input
                              type="text"
                              value={dadosCliente.veiculo.placa}
                              onChange={(e) => setDadosCliente(prev => ({ 
                                ...prev, 
                                veiculo: { ...prev.veiculo, placa: e.target.value }
                              }))}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC] outline-none"
                              placeholder="Ex: ABC-1234"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Observações (opcional)
                        </label>
                        <textarea
                          value={dadosCliente.observacoes}
                          onChange={(e) => setDadosCliente(prev => ({ ...prev, observacoes: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC] outline-none"
                          placeholder="Descreva qualquer informação adicional sobre o problema ou serviço..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {etapaAtual === "confirmacao" && (
                  <div>
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircleIcon className="h-8 w-8 text-green-600" />
                      </div>
                      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        Agendamento realizado!
                      </h2>
                      <p className="text-gray-600">
                        Seu agendamento foi confirmado com sucesso. Você receberá uma confirmação por e-mail e WhatsApp.
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Oficina:</span>
                        <span className="font-medium">{oficina.nome}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Data:</span>
                        <span className="font-medium">
                          {dataSelecionada && formatDate(new Date(dataSelecionada))}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Horário:</span>
                        <span className="font-medium">{horarioSelecionado}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Duração estimada:</span>
                        <span className="font-medium">{calcularDuracaoTotal()}</span>
                      </div>
                      
                      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                        <span className="text-gray-700 font-medium">Total estimado:</span>
                        <span className="font-semibold text-[#0047CC] text-lg">
                          R$ {calcularPrecoTotal().toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-4 mt-8">
                      <Link
                        href="/motorista/agendamentos"
                        className="flex-1 bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-medium text-center hover:bg-gray-200 transition-colors"
                      >
                        Ver meus agendamentos
                      </Link>
                      <Link
                        href="/motoristas"
                        className="flex-1 bg-[#0047CC] text-white py-3 px-4 rounded-lg font-medium text-center hover:bg-[#003DA6] transition-colors"
                      >
                        Voltar ao início
                      </Link>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar com Resumo */}
          <div className="space-y-6">
            {/* Resumo do Agendamento */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo</h3>
              
              <div className="space-y-4">
                {servicosSelecionados.length > 0 ? (
                  <>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Serviços selecionados</h4>
                      <div className="space-y-2">
                        {servicosSelecionados.map(servicoId => {
                          const servico = servicos.find(s => s.id === servicoId);
                          return servico ? (
                            <div key={servicoId} className="flex justify-between text-sm">
                              <span className="text-gray-700">{servico.nome}</span>
                              <span className="font-medium">{servico.preco}</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">Total estimado</span>
                        <span className="font-semibold text-[#0047CC] text-lg">
                          R$ {calcularPrecoTotal().toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-600">Duração estimada</span>
                        <span className="text-sm font-medium">{calcularDuracaoTotal()}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 text-sm">Nenhum serviço selecionado</p>
                )}

                {dataSelecionada && horarioSelecionado && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Data e horário</h4>
                    <div className="text-sm text-gray-700">
                      <div>{formatDate(new Date(dataSelecionada))}</div>
                      <div>às {horarioSelecionado}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contato da Oficina */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contato</h3>
              
              <div className="space-y-3">
                <a
                  href={`tel:${oficina.telefone}`}
                  className="flex items-center space-x-3 text-sm text-gray-700 hover:text-[#0047CC]"
                >
                  <PhoneIcon className="h-4 w-4" />
                  <span>{oficina.telefone}</span>
                </a>
                
                <div className="flex items-center space-x-3 text-sm text-gray-700">
                  <MapPinIcon className="h-4 w-4" />
                  <span>{oficina.endereco}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botões de Navegação */}
        {etapaAtual !== "confirmacao" && (
          <div className="flex justify-between mt-8">
            <button
              onClick={etapaAnterior}
              disabled={etapaAtual === "servicos"}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                etapaAtual === "servicos"
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Voltar
            </button>
            
            <button
              onClick={proximaEtapa}
              disabled={!podeAvancar()}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                podeAvancar()
                  ? 'bg-[#0047CC] text-white hover:bg-[#003DA6]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {etapaAtual === "dados" ? "Confirmar agendamento" : "Continuar"}
            </button>
          </div>
        )}
      </div>

      {/* Footer Global */}
      <Footer />
    </div>
  );
} 