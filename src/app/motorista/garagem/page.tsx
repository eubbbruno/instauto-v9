"use client";

import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  TruckIcon,
  BellIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  WrenchScrewdriverIcon,
  BeakerIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

// Tipos expandidos
interface Manutencao {
  id: number;
  tipo: string;
  data: string;
  km: string;
  valor: number;
  oficina: string;
  observacoes?: string;
}

interface Documento {
  id: number;
  tipo: string;
  numero: string;
  validade: string;
  arquivo?: string;
}

interface Veiculo {
  id: number;
  modelo: string;
  marca: string;
  ano: string;
  placa: string;
  cor: string;
  km: string;
  combustivel: string;
  ultimaRevisao: string;
  proximaRevisao: string;
  seguro: {
    possui: boolean;
    empresa?: string;
    vigencia?: string;
  };
  manutencoes: Manutencao[];
  documentos: Documento[];
  foto?: string;
  chassi?: string;
  renavam?: string;
}

export default function GaragemPage() {
  // Lista de veículos expandida
  const [veiculos, setVeiculos] = useState<Veiculo[]>([
    {
      id: 1,
      modelo: "Civic",
      marca: "Honda",
      ano: "2020",
      placa: "ABC-1234",
      cor: "Prata",
      km: "35.450",
      combustivel: "Flex",
      ultimaRevisao: "15/05/2023",
      proximaRevisao: "15/11/2023",
      seguro: {
        possui: true,
        empresa: "Seguradora XYZ",
        vigencia: "01/01/2023 a 01/01/2024"
      },
      manutencoes: [
        { id: 1, tipo: "Troca de óleo", data: "15/05/2023", km: "33.200", valor: 180, oficina: "Auto Center Silva" },
        { id: 2, tipo: "Alinhamento", data: "02/03/2023", km: "31.500", valor: 120, oficina: "Pneus & Rodas" }
      ],
      documentos: [
        { id: 1, tipo: "CRLV", numero: "123456789", validade: "31/12/2023" },
        { id: 2, tipo: "Seguro", numero: "POL789123", validade: "01/01/2024" }
      ],
      chassi: "9BWZZZ377VT004251",
      renavam: "12345678901"
    },
    {
      id: 2,
      modelo: "Uno",
      marca: "Fiat",
      ano: "2018",
      placa: "XYZ-9876",
      cor: "Vermelho",
      km: "65.800",
      combustivel: "Etanol",
      ultimaRevisao: "10/06/2023",
      proximaRevisao: "10/12/2023",
      seguro: {
        possui: false
      },
      manutencoes: [
        { id: 3, tipo: "Revisão completa", data: "10/06/2023", km: "63.500", valor: 350, oficina: "Mecânica do João" }
      ],
      documentos: [
        { id: 3, tipo: "CRLV", numero: "987654321", validade: "28/02/2024" }
      ],
      chassi: "9BD15906XG0123456",
      renavam: "98765432101"
    }
  ]);
  
  // Estados para modais e visualizações
  const [showModal, setShowModal] = useState(false);
  const [editingVeiculo, setEditingVeiculo] = useState<Veiculo | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Estado para formulário expandido
  const [formData, setFormData] = useState<Partial<Veiculo>>({
    modelo: "",
    marca: "",
    ano: "",
    placa: "",
    cor: "",
    km: "",
    combustivel: "",
    ultimaRevisao: "",
    proximaRevisao: "",
    seguro: { possui: false },
    manutencoes: [],
    documentos: [],
    chassi: "",
    renavam: ""
  });

  // Calcular estatísticas
  const stats = {
    totalVeiculos: veiculos.length,
    proximasRevisoes: veiculos.filter(v => {
      const proxima = new Date(v.proximaRevisao.split('/').reverse().join('-'));
      const hoje = new Date();
      const diffTime = proxima.getTime() - hoje.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30;
    }).length,
    semSeguro: veiculos.filter(v => !v.seguro.possui).length,
    gastoTotal: veiculos.reduce((total, v) => 
      total + v.manutencoes.reduce((sum, m) => sum + m.valor, 0), 0
    )
  };

  // Função para abrir modal de adição
  const handleAddVeiculo = () => {
    setEditingVeiculo(null);
    setFormData({
      modelo: "",
      marca: "",
      ano: "",
      placa: "",
      cor: "",
      km: "",
      combustivel: "",
      ultimaRevisao: "",
      proximaRevisao: "",
      seguro: { possui: false },
      manutencoes: [],
      documentos: [],
      chassi: "",
      renavam: ""
    });
    setShowModal(true);
  };

  // Função para abrir modal de edição
  const handleEditVeiculo = (veiculo: Veiculo) => {
    setEditingVeiculo(veiculo);
    setFormData(veiculo);
    setShowModal(true);
  };

  // Função para salvar veículo
  const handleSaveVeiculo = () => {
    if (editingVeiculo) {
      setVeiculos(veiculos.map(v => 
        v.id === editingVeiculo.id ? { ...formData, id: v.id } as Veiculo : v
      ));
    } else {
      const newId = Math.max(0, ...veiculos.map(v => v.id)) + 1;
      setVeiculos([...veiculos, { 
        ...formData, 
        id: newId,
        manutencoes: [],
        documentos: []
      } as Veiculo]);
    }
    setShowModal(false);
  };

  // Função para remover veículo
  const handleRemoveVeiculo = (id: number) => {
    if (confirm("Tem certeza que deseja remover este veículo?")) {
      setVeiculos(veiculos.filter(v => v.id !== id));
    }
  };

  // Verificar se precisa de atenção
  const needsAttention = (veiculo: Veiculo) => {
    const proxima = new Date(veiculo.proximaRevisao.split('/').reverse().join('-'));
    const hoje = new Date();
    const diffDays = Math.ceil((proxima.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 30 || !veiculo.seguro.possui;
  };

  // Animações
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      {/* Header aprimorado */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Minha Garagem</h1>
          <p className="text-gray-600">Gerencie seus veículos, acompanhe manutenções e documentos.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="p-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            <BellIcon className="h-5 w-5" />
          </button>
          
          <button
            onClick={handleAddVeiculo}
            className="bg-[#0047CC] hover:bg-[#0055EB] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center shadow-md hover:shadow-lg"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Adicionar Veículo
          </button>
        </div>
      </div>

      {/* Dashboard de estatísticas */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {[
          {
            label: "Total de Veículos",
            value: stats.totalVeiculos,
            icon: <TruckIcon className="h-5 w-5" />,
            bgColor: "bg-blue-50",
            textColor: "text-blue-600"
          },
          {
            label: "Revisões Próximas", 
            value: stats.proximasRevisoes,
            icon: <CalendarDaysIcon className="h-5 w-5" />,
            bgColor: "bg-orange-50",
            textColor: "text-orange-600"
          },
          {
            label: "Sem Seguro",
            value: stats.semSeguro,
            icon: <ExclamationTriangleIcon className="h-5 w-5" />,
            bgColor: "bg-red-50",
            textColor: "text-red-600"
          },
          {
            label: "Gasto Total",
            value: `R$ ${stats.gastoTotal.toLocaleString()}`,
            icon: <WrenchScrewdriverIcon className="h-5 w-5" />,
            bgColor: "bg-green-50",
            textColor: "text-green-600"
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <span className={stat.textColor}>{stat.icon}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Alertas e lembretes inteligentes */}
      {veiculos.some(v => needsAttention(v)) && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6 mb-6">
          <div className="flex items-center mb-4">
            <ExclamationTriangleIcon className="h-6 w-6 text-orange-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Atenção Necessária</h3>
          </div>
          
          <div className="space-y-3">
            {veiculos.filter(v => needsAttention(v)).map(veiculo => {
              const proxima = new Date(veiculo.proximaRevisao.split('/').reverse().join('-'));
              const hoje = new Date();
              const diffDays = Math.ceil((proxima.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <div key={veiculo.id} className="flex items-center justify-between bg-white rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                      <TruckIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{veiculo.marca} {veiculo.modelo}</p>
                      <p className="text-sm text-gray-600">
                        {diffDays <= 30 && diffDays > 0 && `Revisão em ${diffDays} dias`}
                        {diffDays <= 0 && "Revisão vencida"}
                        {!veiculo.seguro.possui && "Sem seguro"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/motorista/buscar`}
                      className="text-sm bg-[#0047CC] text-white px-3 py-1.5 rounded-lg hover:bg-[#0055EB] transition-colors"
                    >
                      Agendar
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lista de veículos aprimorada */}
      {veiculos.length > 0 ? (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {veiculos.map((veiculo) => (
            <motion.div
              key={veiculo.id}
              variants={fadeInUp}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Header do card com foto do veículo */}
              <div className="relative">
                <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                  {veiculo.foto ? (
                    <img src={veiculo.foto} alt={`${veiculo.marca} ${veiculo.modelo}`} className="w-full h-full object-cover" />
                  ) : (
                    <TruckIcon className="h-16 w-16 text-gray-400" />
                  )}
                </div>
                
                {/* Badge de atenção */}
                {needsAttention(veiculo) && (
                  <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center">
                    <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                    Atenção
                  </div>
                )}
                
                {/* Ações do card */}
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button 
                    onClick={() => handleEditVeiculo(veiculo)}
                    className="w-8 h-8 bg-white/80 backdrop-blur-sm text-gray-600 rounded-lg flex items-center justify-center hover:bg-white transition-all"
                    title="Editar veículo"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  
                  <button 
                    onClick={() => handleRemoveVeiculo(veiculo.id)}
                    className="w-8 h-8 bg-white/80 backdrop-blur-sm text-red-600 rounded-lg flex items-center justify-center hover:bg-white transition-all"
                    title="Remover veículo"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Conteúdo do card */}
              <div className="p-6">
                {/* Informações principais */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {veiculo.marca} {veiculo.modelo}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{veiculo.ano} • {veiculo.cor}</span>
                    <span className="font-medium">{veiculo.placa}</span>
                  </div>
                </div>

                {/* Métricas do veículo */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center bg-gray-50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-gray-900">{veiculo.km}</p>
                    <p className="text-xs text-gray-600">Quilometragem</p>
                  </div>
                  
                  <div className="text-center bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-center mb-1">
                      <BeakerIcon className="h-4 w-4 text-gray-600 mr-1" />
                      <span className="text-sm font-medium text-gray-900">{veiculo.combustivel}</span>
                    </div>
                    <p className="text-xs text-gray-600">Combustível</p>
                  </div>
                </div>

                {/* Status de manutenção */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <ArrowPathIcon className="h-4 w-4 text-[#0047CC] mr-2" />
                      <span className="text-gray-600">Última Revisão:</span>
                    </div>
                    <span className="font-medium text-gray-900">{veiculo.ultimaRevisao}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <CalendarDaysIcon className="h-4 w-4 text-orange-600 mr-2" />
                      <span className="text-gray-600">Próxima Revisão:</span>
                    </div>
                    <span className="font-medium text-gray-900">{veiculo.proximaRevisao}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <ShieldCheckIcon className={`h-4 w-4 mr-2 ${veiculo.seguro.possui ? 'text-green-500' : 'text-red-500'}`} />
                      <span className="text-gray-600">Seguro:</span>
                    </div>
                    <span className={`font-medium ${veiculo.seguro.possui ? 'text-green-700' : 'text-red-700'}`}>
                      {veiculo.seguro.possui ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>

                {/* Resumo de gastos */}
                <div className="bg-green-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700">Gastos em Manutenção:</span>
                    <span className="font-bold text-green-800">
                      R$ {veiculo.manutencoes.reduce((sum, m) => sum + m.valor, 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Ações */}
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href={`/motorista/garagem/${veiculo.id}`}
                    className="bg-[#0047CC] hover:bg-[#0055EB] text-white px-4 py-2.5 rounded-lg text-sm font-medium text-center transition-colors flex items-center justify-center"
                  >
                    <DocumentTextIcon className="h-4 w-4 mr-1" />
                    Ver Detalhes
                  </Link>
                  
                  <Link
                    href={`/motorista/buscar`}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium text-center transition-colors flex items-center justify-center"
                  >
                    <WrenchScrewdriverIcon className="h-4 w-4 mr-1" />
                    Agendar Serviço
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
            <TruckIcon className="h-10 w-10 text-[#0047CC]/50" />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">Nenhum veículo cadastrado</h3>
          <p className="text-gray-500 mb-6">Adicione seu primeiro veículo para começar a gerenciar sua garagem digital.</p>
          <button
            onClick={handleAddVeiculo}
            className="bg-[#0047CC] hover:bg-[#0055EB] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 inline-flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Adicionar Veículo
          </button>
        </div>
      )}
      
      {/* Modal de adição/edição expandido */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingVeiculo ? 'Editar Veículo' : 'Adicionar Veículo'}
                </h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              {/* Tabs */}
              <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab("basic")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "basic"
                      ? "bg-white text-[#0047CC] shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Informações Básicas
                </button>
                <button
                  onClick={() => setActiveTab("details")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "details"
                      ? "bg-white text-[#0047CC] shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Detalhes e Documentos
                </button>
              </div>

              {/* Conteúdo das tabs */}
              {activeTab === "basic" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Marca *</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                        value={formData.marca || ''}
                        onChange={(e) => setFormData({...formData, marca: e.target.value})}
                        placeholder="Ex: Honda, Fiat, Volkswagen"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Modelo *</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                        value={formData.modelo || ''}
                        onChange={(e) => setFormData({...formData, modelo: e.target.value})}
                        placeholder="Ex: Civic, Uno, Gol"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ano *</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                        value={formData.ano || ''}
                        onChange={(e) => setFormData({...formData, ano: e.target.value})}
                        placeholder="Ex: 2020"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Placa *</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                        value={formData.placa || ''}
                        onChange={(e) => setFormData({...formData, placa: e.target.value})}
                        placeholder="Ex: ABC-1234"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cor</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                        value={formData.cor || ''}
                        onChange={(e) => setFormData({...formData, cor: e.target.value})}
                        placeholder="Ex: Branco, Preto, Prata"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Combustível</label>
                      <select
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                        value={formData.combustivel || ''}
                        onChange={(e) => setFormData({...formData, combustivel: e.target.value})}
                      >
                        <option value="">Selecionar</option>
                        <option value="Gasolina">Gasolina</option>
                        <option value="Etanol">Etanol</option>
                        <option value="Flex">Flex</option>
                        <option value="Diesel">Diesel</option>
                        <option value="GNV">GNV</option>
                        <option value="Híbrido">Híbrido</option>
                        <option value="Elétrico">Elétrico</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quilometragem Atual</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                        value={formData.km || ''}
                        onChange={(e) => setFormData({...formData, km: e.target.value})}
                        placeholder="Ex: 50.000"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "details" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Chassi</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                        value={formData.chassi || ''}
                        onChange={(e) => setFormData({...formData, chassi: e.target.value})}
                        placeholder="Ex: 9BWZZZ377VT004251"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">RENAVAM</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                        value={formData.renavam || ''}
                        onChange={(e) => setFormData({...formData, renavam: e.target.value})}
                        placeholder="Ex: 12345678901"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Última Revisão</label>
                      <input
                        type="date"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                        value={formData.ultimaRevisao || ''}
                        onChange={(e) => setFormData({...formData, ultimaRevisao: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Próxima Revisão</label>
                      <input
                        type="date"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                        value={formData.proximaRevisao || ''}
                        onChange={(e) => setFormData({...formData, proximaRevisao: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  {/* Seguro */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        id="possuiSeguro"
                        className="h-4 w-4 text-[#0047CC] focus:ring-[#0047CC] border-gray-300 rounded"
                        checked={formData.seguro?.possui || false}
                        onChange={(e) => setFormData({
                          ...formData, 
                          seguro: {
                            ...formData.seguro,
                            possui: e.target.checked
                          }
                        })}
                      />
                      <label htmlFor="possuiSeguro" className="ml-3 block text-sm font-medium text-gray-700">
                        Possui seguro
                      </label>
                    </div>
                    
                    {formData.seguro?.possui && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Seguradora</label>
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                            value={formData.seguro?.empresa || ''}
                            onChange={(e) => setFormData({
                              ...formData, 
                              seguro: {
                                ...formData.seguro,
                                possui: formData.seguro?.possui || false,
                                empresa: e.target.value
                              }
                            })}
                            placeholder="Ex: Porto Seguro"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Vigência</label>
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                            value={formData.seguro?.vigencia || ''}
                            onChange={(e) => setFormData({
                              ...formData, 
                              seguro: {
                                ...formData.seguro,
                                possui: formData.seguro?.possui || false,
                                vigencia: e.target.value
                              }
                            })}
                            placeholder="Ex: 01/01/2023 a 01/01/2024"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                <button 
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveVeiculo}
                  className="px-6 py-3 bg-[#0047CC] text-white rounded-lg hover:bg-[#0055EB] font-medium transition-colors"
                >
                  {editingVeiculo ? 'Salvar Alterações' : 'Adicionar Veículo'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 