"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeftIcon, 
  PlusIcon, 
  XMarkIcon, 
  CalendarIcon, 
  WrenchScrewdriverIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export default function NovaManutencaoPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [step, setStep] = useState<"info" | "items" | "oficina" | "confirmation">("info");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Estados para os dados do formulário
  const [manutencaoData, setManutencaoData] = useState({
    data: "",
    quilometragem: "",
    tipo: "revisao", // revisao, corretiva, preventiva
    descricao: "",
    valorTotal: "",
    oficina: "",
    oficinaTelefone: "",
    notaFiscal: null as File | null,
    items: [] as string[],
    garantia: "3" // em meses
  });
  
  const [currentItem, setCurrentItem] = useState("");
  
  // Tipos de manutenção disponíveis
  const tiposManutencao = [
    { id: "revisao", nome: "Revisão Programada" },
    { id: "corretiva", nome: "Manutenção Corretiva" },
    { id: "preventiva", nome: "Manutenção Preventiva" },
    { id: "acessorio", nome: "Instalação de Acessório" },
    { id: "outro", nome: "Outro" }
  ];
  
  // Opções de garantia
  const opcoesGarantia = [
    { value: "0", label: "Sem garantia" },
    { value: "3", label: "3 meses" },
    { value: "6", label: "6 meses" },
    { value: "12", label: "1 ano" },
    { value: "24", label: "2 anos" },
    { value: "36", label: "3 anos" }
  ];
  
  // Lista de serviços comuns para sugerir
  const servicosComuns = [
    "Troca de óleo e filtro",
    "Troca de filtro de ar",
    "Troca de filtro de combustível",
    "Troca de filtro de cabine/ar condicionado",
    "Alinhamento e balanceamento",
    "Troca de pastilhas de freio",
    "Troca de discos de freio",
    "Troca de fluido de freio",
    "Verificação de suspensão",
    "Troca de bateria",
    "Troca de correia dentada",
    "Troca de velas",
    "Higienização de ar condicionado",
    "Diagnóstico eletrônico",
    "Recarga de gás do ar condicionado",
    "Troca de amortecedores"
  ];
  
  // Adicionar um item à lista
  const addItem = () => {
    if (currentItem.trim() !== "") {
      setManutencaoData({
        ...manutencaoData,
        items: [...manutencaoData.items, currentItem.trim()]
      });
      setCurrentItem("");
    }
  };
  
  // Remover um item da lista
  const removeItem = (index: number) => {
    const newItems = [...manutencaoData.items];
    newItems.splice(index, 1);
    setManutencaoData({
      ...manutencaoData,
      items: newItems
    });
  };
  
  // Adicionar um serviço comum
  const addServicoComum = (servico: string) => {
    if (!manutencaoData.items.includes(servico)) {
      setManutencaoData({
        ...manutencaoData,
        items: [...manutencaoData.items, servico]
      });
    }
  };
  
  // Função para validar o formulário atual
  const validateCurrentStep = () => {
    switch (step) {
      case "info":
        return manutencaoData.data && 
               manutencaoData.quilometragem && 
               manutencaoData.tipo && 
               manutencaoData.descricao;
      case "items":
        return manutencaoData.items.length > 0;
      case "oficina":
        return manutencaoData.oficina && manutencaoData.valorTotal;
      default:
        return true;
    }
  };
  
  // Função para avançar para o próximo passo
  const nextStep = () => {
    if (!validateCurrentStep()) return;
    
    switch (step) {
      case "info":
        setStep("items");
        break;
      case "items":
        setStep("oficina");
        break;
      case "oficina":
        setStep("confirmation");
        break;
      case "confirmation":
        submitManutencao();
        break;
    }
  };
  
  // Função para voltar ao passo anterior
  const prevStep = () => {
    switch (step) {
      case "items":
        setStep("info");
        break;
      case "oficina":
        setStep("items");
        break;
      case "confirmation":
        setStep("oficina");
        break;
    }
  };
  
  // Função para enviar os dados da manutenção
  const submitManutencao = async () => {
    setIsLoading(true);
    
    try {
      // Simulando envio para uma API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Dados enviados:", manutencaoData);
      
      // Mostrar mensagem de sucesso
      setSuccess(true);
      
      // Redirecionar após alguns segundos
      setTimeout(() => {
        router.push(`/veiculo/${params.id}`);
      }, 2000);
      
    } catch (error) {
      console.error("Erro ao registrar manutenção:", error);
      setIsLoading(false);
    }
  };
  
  // Renderizar o conteúdo com base no passo atual
  const renderStepContent = () => {
    switch (step) {
      case "info":
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Informações Básicas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-1">
                  Data da Manutenção*
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="data"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                    value={manutencaoData.data}
                    onChange={(e) => setManutencaoData({...manutencaoData, data: e.target.value})}
                    required
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label htmlFor="quilometragem" className="block text-sm font-medium text-gray-700 mb-1">
                  Quilometragem*
                </label>
                <input
                  type="text"
                  id="quilometragem"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                  placeholder="Ex: 45000"
                  value={manutencaoData.quilometragem}
                  onChange={(e) => {
                    // Apenas números
                    const value = e.target.value.replace(/\D/g, "");
                    setManutencaoData({...manutencaoData, quilometragem: value})
                  }}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Manutenção*
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {tiposManutencao.map((tipo) => (
                  <button
                    key={tipo.id}
                    type="button"
                    onClick={() => setManutencaoData({...manutencaoData, tipo: tipo.id})}
                    className={`flex items-center justify-center py-2.5 px-4 border rounded-lg ${
                      manutencaoData.tipo === tipo.id
                        ? "bg-[#0047CC] text-white border-[#0047CC]"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {tipo.nome}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição da Manutenção*
              </label>
              <textarea
                id="descricao"
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                placeholder="Descreva a manutenção realizada..."
                value={manutencaoData.descricao}
                onChange={(e) => setManutencaoData({...manutencaoData, descricao: e.target.value})}
                required
              />
            </div>
          </div>
        );
        
      case "items":
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Serviços Realizados</h2>
            
            <div>
              <label htmlFor="item" className="block text-sm font-medium text-gray-700 mb-1">
                Adicionar Serviço ou Peça
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="item"
                  className="flex-1 px-3 py-2.5 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                  placeholder="Ex: Troca de óleo e filtro"
                  value={currentItem}
                  onChange={(e) => setCurrentItem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addItem()}
                />
                <button
                  type="button"
                  onClick={addItem}
                  className="bg-[#0047CC] hover:bg-[#0055EB] text-white px-4 py-2.5 rounded-r-lg"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Lista de itens adicionados */}
            {manutencaoData.items.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Serviços/Peças Adicionados
                </label>
                <ul className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                  {manutencaoData.items.map((item, index) => (
                    <li key={index} className="px-4 py-3 flex justify-between items-center">
                      <span className="text-sm">{item}</span>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Sugestões de serviços comuns */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Serviços Comuns (clique para adicionar)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {servicosComuns.map((servico, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => addServicoComum(servico)}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      manutencaoData.items.includes(servico)
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200"
                    }`}
                  >
                    {servico}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
        
      case "oficina":
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Dados da Oficina e Custo</h2>
            
            <div>
              <label htmlFor="oficina" className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Oficina*
              </label>
              <input
                type="text"
                id="oficina"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                placeholder="Ex: Auto Center Silva"
                value={manutencaoData.oficina}
                onChange={(e) => setManutencaoData({...manutencaoData, oficina: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label htmlFor="oficinaTelefone" className="block text-sm font-medium text-gray-700 mb-1">
                Telefone da Oficina
              </label>
              <input
                type="tel"
                id="oficinaTelefone"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                placeholder="Ex: (11) 99999-9999"
                value={manutencaoData.oficinaTelefone}
                onChange={(e) => setManutencaoData({...manutencaoData, oficinaTelefone: e.target.value})}
              />
            </div>
            
            <div>
              <label htmlFor="valorTotal" className="block text-sm font-medium text-gray-700 mb-1">
                Valor Total (R$)*
              </label>
              <input
                type="text"
                id="valorTotal"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                placeholder="Ex: 350,00"
                value={manutencaoData.valorTotal}
                onChange={(e) => {
                  // Formatar para aceitar apenas números e vírgula
                  const value = e.target.value.replace(/[^\d,]/g, "");
                  setManutencaoData({...manutencaoData, valorTotal: value})
                }}
                required
              />
            </div>
            
            <div>
              <label htmlFor="garantia" className="block text-sm font-medium text-gray-700 mb-1">
                Período de Garantia
              </label>
              <select
                id="garantia"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                value={manutencaoData.garantia}
                onChange={(e) => setManutencaoData({...manutencaoData, garantia: e.target.value})}
              >
                {opcoesGarantia.map((opcao) => (
                  <option key={opcao.value} value={opcao.value}>
                    {opcao.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="notaFiscal" className="block text-sm font-medium text-gray-700 mb-1">
                Nota Fiscal ou Comprovante (opcional)
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p className="mb-1 text-sm text-gray-500">
                      <span className="font-semibold">Clique para enviar</span> ou arraste e solte
                    </p>
                    <p className="text-xs text-gray-500">PDF, JPG ou PNG (máx. 5MB)</p>
                  </div>
                  <input 
                    id="notaFiscal"
                    type="file" 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setManutencaoData({...manutencaoData, notaFiscal: e.target.files[0]});
                      }
                    }}
                  />
                </label>
              </div>
              {manutencaoData.notaFiscal && (
                <p className="mt-2 text-sm text-green-600">
                  Arquivo selecionado: {manutencaoData.notaFiscal.name}
                </p>
              )}
            </div>
          </div>
        );
        
      case "confirmation":
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirmar Informações</h2>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-gray-800 mb-3">Informações Básicas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Data:</span>
                  <span className="ml-2">{manutencaoData.data}</span>
                </div>
                <div>
                  <span className="text-gray-500">Quilometragem:</span>
                  <span className="ml-2">{Number(manutencaoData.quilometragem).toLocaleString()} km</span>
                </div>
                <div>
                  <span className="text-gray-500">Tipo:</span>
                  <span className="ml-2">
                    {tiposManutencao.find(t => t.id === manutencaoData.tipo)?.nome}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-gray-500">Descrição:</span>
                  <p className="mt-1">{manutencaoData.descricao}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-gray-800 mb-3">Serviços Realizados</h3>
              <ul className="space-y-1">
                {manutencaoData.items.map((item, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-3">Oficina e Custo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Oficina:</span>
                  <span className="ml-2">{manutencaoData.oficina}</span>
                </div>
                {manutencaoData.oficinaTelefone && (
                  <div>
                    <span className="text-gray-500">Telefone:</span>
                    <span className="ml-2">{manutencaoData.oficinaTelefone}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Valor Total:</span>
                  <span className="ml-2 font-medium">R$ {manutencaoData.valorTotal}</span>
                </div>
                <div>
                  <span className="text-gray-500">Garantia:</span>
                  <span className="ml-2">
                    {opcoesGarantia.find(g => g.value === manutencaoData.garantia)?.label}
                  </span>
                </div>
                {manutencaoData.notaFiscal && (
                  <div>
                    <span className="text-gray-500">Nota Fiscal:</span>
                    <span className="ml-2">{manutencaoData.notaFiscal.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  };
  
  // Se a submissão foi bem-sucedida, mostrar mensagem de sucesso
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Manutenção Registrada!</h2>
            <p className="text-gray-600 mb-6">
              A manutenção do seu veículo foi registrada com sucesso. Você será redirecionado para a página do veículo.
            </p>
            <Link
              href={`/veiculo/${params.id}`}
              className="inline-block bg-[#0047CC] hover:bg-[#0055EB] text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Voltar para o Veículo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href={`/veiculo/${params.id}`} className="flex items-center text-gray-600 hover:text-[#0047CC]">
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            <span>Voltar para Detalhes do Veículo</span>
          </Link>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Título da página */}
          <div className="flex items-center mb-6">
            <WrenchScrewdriverIcon className="h-6 w-6 text-[#0047CC] mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Registrar Nova Manutenção</h1>
          </div>
          
          {/* Progresso */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div 
                  className={`h-2 rounded-full ${
                    step === "info" || step === "items" || step === "oficina" || step === "confirmation"
                      ? "bg-[#0047CC]" 
                      : "bg-gray-200"
                  }`}
                ></div>
              </div>
              <div className="w-4"></div>
              <div className="flex-1">
                <div 
                  className={`h-2 rounded-full ${
                    step === "items" || step === "oficina" || step === "confirmation"
                      ? "bg-[#0047CC]" 
                      : "bg-gray-200"
                  }`}
                ></div>
              </div>
              <div className="w-4"></div>
              <div className="flex-1">
                <div 
                  className={`h-2 rounded-full ${
                    step === "oficina" || step === "confirmation"
                      ? "bg-[#0047CC]" 
                      : "bg-gray-200"
                  }`}
                ></div>
              </div>
              <div className="w-4"></div>
              <div className="flex-1">
                <div 
                  className={`h-2 rounded-full ${
                    step === "confirmation"
                      ? "bg-[#0047CC]" 
                      : "bg-gray-200"
                  }`}
                ></div>
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Informações</span>
              <span>Serviços</span>
              <span>Oficina</span>
              <span>Confirmação</span>
            </div>
          </div>
          
          {/* Formulário */}
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-6"
          >
            {renderStepContent()}
          </motion.div>
          
          {/* Botões de navegação */}
          <div className="flex justify-between">
            {step !== "info" ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Voltar
              </button>
            ) : (
              <div></div>
            )}
            
            <button
              type="button"
              onClick={nextStep}
              disabled={!validateCurrentStep() || isLoading}
              className={`px-6 py-2.5 rounded-lg text-white font-medium transition-colors ${
                validateCurrentStep() && !isLoading
                  ? "bg-[#0047CC] hover:bg-[#0055EB]"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processando...
                </span>
              ) : step === "confirmation" ? (
                "Registrar Manutenção"
              ) : (
                "Continuar"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 