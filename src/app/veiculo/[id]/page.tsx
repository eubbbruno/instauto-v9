"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowLeftIcon, 
  CalendarIcon, 
  ClockIcon, 
  DocumentTextIcon, 
  ExclamationTriangleIcon,
  WrenchScrewdriverIcon, 
  ChevronRightIcon, 
  PlusIcon,
  IdentificationIcon,
  KeyIcon,
  ClipboardDocumentListIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";

export default function VeiculoDetalhesPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<"info" | "historico" | "lembretes">("info");
  
  // Dados mockados do veículo
  const veiculo = {
    id: params.id,
    marca: "Honda",
    modelo: "Civic",
    versao: "EXL",
    ano: "2020",
    placa: "ABC1234",
    cor: "Preto",
    km: 45000,
    combustivel: "Flex",
    ultimaRevisao: "12/01/2023",
    proximaRevisao: "12/07/2023",
    status: "Em dia",
    imagem: "/images/honda-civic.jpg",
    documentos: [
      { nome: "CRLV", status: "Regular", validade: "31/12/2023" },
      { nome: "IPVA", status: "Pago", validade: "31/03/2023" },
      { nome: "Seguro", status: "Vigente", validade: "15/08/2023" }
    ],
    dadosTecnicos: {
      motor: "2.0 16V",
      potencia: "155 cv",
      torque: "19,5 kgfm",
      cambio: "Automático CVT",
      direcao: "Elétrica",
      tracao: "Dianteira",
      freios: "Discos ventilados (diant.) e sólidos (tras.)",
      suspensao: "Independente nas 4 rodas"
    },
    manutencoes: [
      {
        id: "m001",
        data: "12/01/2023",
        km: 42500,
        tipo: "Revisão Programada",
        descricao: "Revisão completa dos 40.000 km",
        itens: [
          "Troca de óleo e filtro",
          "Troca de filtro de ar",
          "Verificação de freios",
          "Alinhamento e balanceamento",
          "Verificação de suspensão"
        ],
        oficina: "Auto Center Silva",
        valor: "R$ 850,00",
        status: "Concluído"
      },
      {
        id: "m002",
        data: "05/10/2022",
        km: 35000,
        tipo: "Manutenção Corretiva",
        descricao: "Reparo no sistema de ar condicionado",
        itens: [
          "Recarga de gás",
          "Troca do filtro de cabine",
          "Limpeza do sistema"
        ],
        oficina: "Refrigeração Automotiva Express",
        valor: "R$ 450,00",
        status: "Concluído"
      },
      {
        id: "m003",
        data: "18/06/2022",
        km: 30000,
        tipo: "Revisão Programada",
        descricao: "Revisão completa dos 30.000 km",
        itens: [
          "Troca de óleo e filtro",
          "Verificação da bateria",
          "Verificação de freios",
          "Troca de filtro de combustível"
        ],
        oficina: "Concessionária Honda",
        valor: "R$ 780,00",
        status: "Concluído"
      }
    ],
    lembretes: [
      {
        id: "l001",
        titulo: "Próxima revisão",
        descricao: "Agendamento da revisão dos 50.000 km",
        data: "12/07/2023",
        tipo: "Revisão",
        status: "Pendente",
        prioridade: "Alta"
      },
      {
        id: "l002",
        titulo: "Troca de correia dentada",
        descricao: "Realizar troca preventiva da correia dentada",
        data: "15/09/2023",
        tipo: "Manutenção",
        status: "Pendente",
        prioridade: "Média"
      },
      {
        id: "l003",
        titulo: "Renovação do seguro",
        descricao: "Contatar seguradora para renovação",
        data: "10/08/2023",
        tipo: "Documentação",
        status: "Pendente",
        prioridade: "Alta"
      }
    ]
  };
  
  // Função para determinar cor de prioridade
  const getPrioridadeCor = (prioridade: string) => {
    switch (prioridade.toLowerCase()) {
      case 'alta':
        return 'text-red-600 bg-red-50';
      case 'média':
        return 'text-orange-600 bg-orange-50';
      case 'baixa':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/minha-garagem" className="flex items-center text-gray-600 hover:text-[#0047CC]">
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            <span>Voltar para Minha Garagem</span>
          </Link>
        </div>
      </header>
      
      {/* Detalhes principais do veículo */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Imagem do veículo */}
            <div className="w-full md:w-1/3 h-64 md:h-auto bg-gray-100 rounded-lg overflow-hidden relative">
              {veiculo.imagem ? (
                <Image
                  src={veiculo.imagem}
                  alt={`${veiculo.marca} ${veiculo.modelo}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-100">
                  <div className="text-gray-400 text-center">
                    <svg className="h-12 w-12 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>Sem imagem disponível</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Informações básicas */}
            <div className="w-full md:w-2/3">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {veiculo.marca} {veiculo.modelo} {veiculo.versao}
              </h1>
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                  {veiculo.ano}
                </div>
                <div className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                  {veiculo.placa}
                </div>
                <div className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                  {veiculo.cor}
                </div>
                <div className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                  {veiculo.combustivel}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Quilometragem</div>
                  <div className="text-xl font-bold text-gray-900">{veiculo.km.toLocaleString()} km</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Última Revisão</div>
                  <div className="text-xl font-bold text-gray-900">{veiculo.ultimaRevisao}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Próxima Revisão</div>
                  <div className="text-xl font-bold text-gray-900">{veiculo.proximaRevisao}</div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/veiculo/${veiculo.id}/manutencao/nova`}
                  className="bg-[#0047CC] hover:bg-[#0055EB] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Registrar Manutenção
                </Link>
                <Link
                  href={`/oficinas?veiculo=${veiculo.id}`}
                  className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center"
                >
                  <WrenchScrewdriverIcon className="h-4 w-4 mr-2" />
                  Agendar Serviço
                </Link>
                <Link
                  href={`/veiculo/${veiculo.id}/editar`}
                  className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center"
                >
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  Editar Informações
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs de navegação */}
      <div className="container mx-auto px-4 py-4">
        <div className="bg-white rounded-xl shadow-sm p-1 mb-6 flex">
          <button
            onClick={() => setActiveTab("info")}
            className={`flex-1 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "info"
                ? "bg-[#0047CC]/10 text-[#0047CC]"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span className="flex items-center justify-center">
              <IdentificationIcon className="h-4 w-4 mr-2" />
              Informações Técnicas
            </span>
          </button>
          <button
            onClick={() => setActiveTab("historico")}
            className={`flex-1 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "historico"
                ? "bg-[#0047CC]/10 text-[#0047CC]"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span className="flex items-center justify-center">
              <ClipboardDocumentListIcon className="h-4 w-4 mr-2" />
              Histórico de Manutenções
            </span>
          </button>
          <button
            onClick={() => setActiveTab("lembretes")}
            className={`flex-1 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "lembretes"
                ? "bg-[#0047CC]/10 text-[#0047CC]"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span className="flex items-center justify-center">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Lembretes
            </span>
          </button>
        </div>
        
        {/* Conteúdo das tabs */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          {activeTab === "info" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Dados Técnicos</h2>
                <Link 
                  href={`/veiculo/${veiculo.id}/editar-tecnicos`}
                  className="text-sm text-[#0047CC] hover:underline flex items-center"
                >
                  Editar
                  <ChevronRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {Object.entries(veiculo.dadosTecnicos).map(([key, value]) => (
                  <div key={key} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <KeyIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500 capitalize">{key}</div>
                      <div className="font-medium">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Documentos</h2>
                <Link 
                  href={`/veiculo/${veiculo.id}/documentos`}
                  className="text-sm text-[#0047CC] hover:underline flex items-center"
                >
                  Gerenciar Documentos
                  <ChevronRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
              
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg mb-6">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Documento</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Validade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {veiculo.documentos.map((doc, idx) => (
                      <tr key={idx}>
                        <td className="py-4 pl-4 pr-3 text-sm">
                          <div className="font-medium text-gray-900">{doc.nome}</div>
                        </td>
                        <td className="px-3 py-4 text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            doc.status === "Regular" || doc.status === "Vigente" || doc.status === "Pago" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">{doc.validade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
          
          {activeTab === "historico" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Histórico de Manutenções</h2>
                <Link 
                  href={`/veiculo/${veiculo.id}/manutencao/nova`}
                  className="bg-[#0047CC] hover:bg-[#0055EB] text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Nova Manutenção
                </Link>
              </div>
              
              <div className="space-y-6">
                {veiculo.manutencoes.map((manutencao) => (
                  <div key={manutencao.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{manutencao.tipo}</h3>
                        <p className="text-sm text-gray-500">{manutencao.descricao}</p>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-2 mt-2 md:mt-0">
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {manutencao.data}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 md:ml-4">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {manutencao.km.toLocaleString()} km
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Itens realizados:</h4>
                        <ul className="space-y-1">
                          {manutencao.itens.map((item, idx) => (
                            <li key={idx} className="flex items-start">
                              <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              <span className="text-sm text-gray-600">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-500 mr-2">Oficina:</div>
                          <div className="text-sm font-medium">{manutencao.oficina}</div>
                        </div>
                        <div className="flex items-center mt-2 md:mt-0">
                          <div className="text-sm font-medium text-gray-500 mr-2">Valor:</div>
                          <div className="text-sm font-medium text-[#0047CC]">{manutencao.valor}</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-between items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        manutencao.status === "Concluído" 
                          ? "bg-green-100 text-green-800" 
                          : manutencao.status === "Em andamento"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {manutencao.status}
                      </span>
                      <Link 
                        href={`/veiculo/${veiculo.id}/manutencao/${manutencao.id}`}
                        className="text-sm text-[#0047CC] hover:underline flex items-center"
                      >
                        Ver Detalhes
                        <ChevronRightIcon className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              
              {veiculo.manutencoes.length === 0 && (
                <div className="text-center py-12">
                  <WrenchScrewdriverIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma manutenção registrada</h3>
                  <p className="text-gray-500 mb-4">Registre as manutenções do seu veículo para manter um histórico completo.</p>
                  <Link 
                    href={`/veiculo/${veiculo.id}/manutencao/nova`}
                    className="bg-[#0047CC] hover:bg-[#0055EB] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 inline-flex items-center"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Registrar Primeira Manutenção
                  </Link>
                </div>
              )}
            </motion.div>
          )}
          
          {activeTab === "lembretes" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Lembretes e Alertas</h2>
                <Link 
                  href={`/veiculo/${veiculo.id}/lembrete/novo`}
                  className="bg-[#0047CC] hover:bg-[#0055EB] text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Novo Lembrete
                </Link>
              </div>
              
              {veiculo.lembretes.length > 0 ? (
                <div className="space-y-4">
                  {veiculo.lembretes.map((lembrete) => (
                    <div key={lembrete.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="flex items-start">
                            {lembrete.tipo === "Revisão" ? (
                              <WrenchScrewdriverIcon className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                            ) : lembrete.tipo === "Documentação" ? (
                              <DocumentTextIcon className="h-5 w-5 text-purple-500 mr-3 flex-shrink-0" />
                            ) : (
                              <ShieldCheckIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                            )}
                            <div>
                              <h3 className="font-medium text-gray-900">{lembrete.titulo}</h3>
                              <p className="text-sm text-gray-500 mt-1">{lembrete.descricao}</p>
                            </div>
                          </div>
                          <div className="flex items-center mt-3 md:mt-0">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPrioridadeCor(lembrete.prioridade)}`}>
                              {lembrete.prioridade}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mt-4 pt-3 border-t border-gray-100">
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-600">{lembrete.data}</span>
                          </div>
                          <div className="flex mt-2 md:mt-0">
                            <button className="text-sm text-gray-500 hover:text-gray-700 mr-4">
                              Marcar como Concluído
                            </button>
                            <Link 
                              href={`/veiculo/${veiculo.id}/lembrete/${lembrete.id}`}
                              className="text-sm text-[#0047CC] hover:underline flex items-center"
                            >
                              Editar
                              <ChevronRightIcon className="h-4 w-4 ml-1" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CalendarIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum lembrete configurado</h3>
                  <p className="text-gray-500 mb-4">Crie lembretes para manutenções futuras, vencimentos de documentos e outros eventos importantes.</p>
                  <Link 
                    href={`/veiculo/${veiculo.id}/lembrete/novo`}
                    className="bg-[#0047CC] hover:bg-[#0055EB] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 inline-flex items-center"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Criar Primeiro Lembrete
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </div>
        
        {/* Card de alerta caso haja manutenções pendentes ou documentos vencendo */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 md:p-6 mb-6 flex items-start">
          <div className="rounded-full bg-amber-100 p-2 mr-4 flex-shrink-0">
            <ExclamationTriangleIcon className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h3 className="font-medium text-amber-800 mb-1">Manutenção Recomendada</h3>
            <p className="text-sm text-amber-700 mb-3">
              Sua próxima revisão está programada para {veiculo.proximaRevisao} ou quando atingir {(veiculo.km + 10000).toLocaleString()} km. 
              Faltam aproximadamente {(veiculo.km + 10000 - veiculo.km).toLocaleString()} km.
            </p>
            <Link 
              href="/oficinas"
              className="inline-flex items-center text-sm font-medium text-amber-800 hover:text-amber-900"
            >
              Encontrar oficinas próximas
              <ChevronRightIcon className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 