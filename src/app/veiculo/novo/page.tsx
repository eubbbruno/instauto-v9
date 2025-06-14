"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeftIcon, 
  PlusIcon, 
  CheckCircleIcon,
  PhotoIcon
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export default function NovoVeiculoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // Estado para os dados do veículo
  const [veiculoData, setVeiculoData] = useState({
    marca: "",
    modelo: "",
    versao: "",
    ano: "",
    placa: "",
    cor: "",
    quilometragem: "",
    combustivel: "flex", // gasolina, etanol, flex, diesel, eletrico, hibrido
    chassi: "",
    renavam: "",
    dataAquisicao: "",
    ultimaRevisao: "",
    foto: null as File | null
  });
  
  // Lista de marcas de veículos comuns
  const marcasComuns = [
    "Chevrolet", "Fiat", "Ford", "Honda", "Hyundai", "Jeep", 
    "Nissan", "Renault", "Toyota", "Volkswagen", "Audi", "BMW", 
    "Mercedes-Benz", "Peugeot", "Citroën", "Mitsubishi", "Kia"
  ];
  
  // Lista de tipos de combustível
  const tiposCombustivel = [
    { id: "gasolina", nome: "Gasolina" },
    { id: "etanol", nome: "Etanol" },
    { id: "flex", nome: "Flex" },
    { id: "diesel", nome: "Diesel" },
    { id: "eletrico", nome: "Elétrico" },
    { id: "hibrido", nome: "Híbrido" }
  ];
  
  // Função para lidar com o upload de imagem
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVeiculoData({...veiculoData, foto: file});
      
      // Criar uma URL para preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Função para formatar a placa
  const formatarPlaca = (placa: string) => {
    // Remove caracteres não alfanuméricos
    placa = placa.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    
    // Novo padrão: ABC1D23 ou ABC1234
    if (placa.length <= 3) {
      return placa;
    } else if (placa.length <= 4) {
      return `${placa.substring(0, 3)}-${placa.substring(3)}`;
    } else if (placa.length <= 6) {
      if (/[A-Z]/.test(placa.charAt(4))) {
        // Novo padrão Mercosul
        return `${placa.substring(0, 3)}${placa.substring(3, 4)}${placa.substring(4)}`;
      } else {
        // Padrão antigo
        return `${placa.substring(0, 3)}-${placa.substring(3)}`;
      }
    } else {
      if (/[A-Z]/.test(placa.charAt(4))) {
        // Novo padrão Mercosul
        return `${placa.substring(0, 3)}${placa.substring(3, 4)}${placa.substring(4, 5)}${placa.substring(5)}`;
      } else {
        // Padrão antigo
        return `${placa.substring(0, 3)}-${placa.substring(3)}`;
      }
    }
  };
  
  // Função para validar o formulário
  const validateForm = () => {
    return (
      veiculoData.marca !== "" &&
      veiculoData.modelo !== "" &&
      veiculoData.ano !== "" &&
      veiculoData.placa !== "" &&
      veiculoData.quilometragem !== "" &&
      veiculoData.combustivel !== ""
    );
  };
  
  // Função para enviar os dados do veículo
  const submitVeiculo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulando envio para uma API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Dados enviados:", veiculoData);
      
      // Mostrar mensagem de sucesso
      setSuccess(true);
      
      // Redirecionar após alguns segundos
      setTimeout(() => {
        router.push("/minha-garagem");
      }, 2000);
      
    } catch (error) {
      console.error("Erro ao cadastrar veículo:", error);
      setIsLoading(false);
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Veículo Cadastrado!</h2>
            <p className="text-gray-600 mb-6">
              Seu veículo foi cadastrado com sucesso. Você será redirecionado para sua garagem.
            </p>
            <Link
              href="/minha-garagem"
              className="inline-block bg-[#0047CC] hover:bg-[#0055EB] text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Ver Minha Garagem
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
          <Link href="/minha-garagem" className="flex items-center text-gray-600 hover:text-[#0047CC]">
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            <span>Voltar para Minha Garagem</span>
          </Link>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Título da página */}
          <div className="flex items-center mb-6">
            <PlusIcon className="h-6 w-6 text-[#0047CC] mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Adicionar Novo Veículo</h1>
          </div>
          
          {/* Formulário */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-6"
          >
            <form onSubmit={submitVeiculo} className="space-y-6">
              {/* Seção de foto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto do Veículo (opcional)
                </label>
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  {/* Preview da imagem */}
                  <div className="w-full md:w-1/3 aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                    {previewImage ? (
                      <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-4">
                        <PhotoIcon className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Nenhuma imagem selecionada</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Input para upload */}
                  <div className="w-full md:w-2/3">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                          </svg>
                          <p className="mb-1 text-sm text-gray-500">
                            <span className="font-semibold">Clique para enviar</span> ou arraste e solte
                          </p>
                          <p className="text-xs text-gray-500">JPG, PNG ou WEBP (máx. 5MB)</p>
                        </div>
                        <input 
                          type="file" 
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Adicione uma foto do seu veículo para facilitar a identificação.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Dados do Veículo</h2>
                
                {/* Informações básicas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Marca */}
                  <div>
                    <label htmlFor="marca" className="block text-sm font-medium text-gray-700 mb-1">
                      Marca*
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="marca"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                        placeholder="Ex: Honda"
                        value={veiculoData.marca}
                        onChange={(e) => setVeiculoData({...veiculoData, marca: e.target.value})}
                        list="marcas-list"
                        required
                      />
                      <datalist id="marcas-list">
                        {marcasComuns.map((marca) => (
                          <option key={marca} value={marca} />
                        ))}
                      </datalist>
                    </div>
                  </div>
                  
                  {/* Modelo */}
                  <div>
                    <label htmlFor="modelo" className="block text-sm font-medium text-gray-700 mb-1">
                      Modelo*
                    </label>
                    <input
                      type="text"
                      id="modelo"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                      placeholder="Ex: Civic"
                      value={veiculoData.modelo}
                      onChange={(e) => setVeiculoData({...veiculoData, modelo: e.target.value})}
                      required
                    />
                  </div>
                  
                  {/* Versão */}
                  <div>
                    <label htmlFor="versao" className="block text-sm font-medium text-gray-700 mb-1">
                      Versão
                    </label>
                    <input
                      type="text"
                      id="versao"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                      placeholder="Ex: EXL"
                      value={veiculoData.versao}
                      onChange={(e) => setVeiculoData({...veiculoData, versao: e.target.value})}
                    />
                  </div>
                  
                  {/* Ano */}
                  <div>
                    <label htmlFor="ano" className="block text-sm font-medium text-gray-700 mb-1">
                      Ano*
                    </label>
                    <input
                      type="text"
                      id="ano"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                      placeholder="Ex: 2020"
                      value={veiculoData.ano}
                      onChange={(e) => {
                        // Apenas números e limitado a 4 dígitos
                        const value = e.target.value.replace(/\D/g, "").substring(0, 4);
                        setVeiculoData({...veiculoData, ano: value})
                      }}
                      required
                    />
                  </div>
                  
                  {/* Placa */}
                  <div>
                    <label htmlFor="placa" className="block text-sm font-medium text-gray-700 mb-1">
                      Placa*
                    </label>
                    <input
                      type="text"
                      id="placa"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                      placeholder="Ex: ABC1234"
                      value={veiculoData.placa}
                      onChange={(e) => {
                        const formattedPlate = formatarPlaca(e.target.value);
                        setVeiculoData({...veiculoData, placa: formattedPlate})
                      }}
                      maxLength={8}
                      required
                    />
                  </div>
                  
                  {/* Cor */}
                  <div>
                    <label htmlFor="cor" className="block text-sm font-medium text-gray-700 mb-1">
                      Cor
                    </label>
                    <input
                      type="text"
                      id="cor"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                      placeholder="Ex: Preto"
                      value={veiculoData.cor}
                      onChange={(e) => setVeiculoData({...veiculoData, cor: e.target.value})}
                    />
                  </div>
                  
                  {/* Quilometragem */}
                  <div>
                    <label htmlFor="quilometragem" className="block text-sm font-medium text-gray-700 mb-1">
                      Quilometragem*
                    </label>
                    <input
                      type="text"
                      id="quilometragem"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                      placeholder="Ex: 45000"
                      value={veiculoData.quilometragem}
                      onChange={(e) => {
                        // Apenas números
                        const value = e.target.value.replace(/\D/g, "");
                        setVeiculoData({...veiculoData, quilometragem: value})
                      }}
                      required
                    />
                  </div>
                  
                  {/* Combustível */}
                  <div>
                    <label htmlFor="combustivel" className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Combustível*
                    </label>
                    <select
                      id="combustivel"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                      value={veiculoData.combustivel}
                      onChange={(e) => setVeiculoData({...veiculoData, combustivel: e.target.value})}
                      required
                    >
                      {tiposCombustivel.map((tipo) => (
                        <option key={tipo.id} value={tipo.id}>
                          {tipo.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Informações Adicionais</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Chassi */}
                  <div>
                    <label htmlFor="chassi" className="block text-sm font-medium text-gray-700 mb-1">
                      Chassi
                    </label>
                    <input
                      type="text"
                      id="chassi"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                      placeholder="Ex: 9BWHE21JX24060960"
                      value={veiculoData.chassi}
                      onChange={(e) => setVeiculoData({...veiculoData, chassi: e.target.value.toUpperCase()})}
                      maxLength={17}
                    />
                  </div>
                  
                  {/* Renavam */}
                  <div>
                    <label htmlFor="renavam" className="block text-sm font-medium text-gray-700 mb-1">
                      Renavam
                    </label>
                    <input
                      type="text"
                      id="renavam"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                      placeholder="Ex: 00123456789"
                      value={veiculoData.renavam}
                      onChange={(e) => {
                        // Apenas números e limitado a 11 dígitos
                        const value = e.target.value.replace(/\D/g, "").substring(0, 11);
                        setVeiculoData({...veiculoData, renavam: value})
                      }}
                    />
                  </div>
                  
                  {/* Data de aquisição */}
                  <div>
                    <label htmlFor="dataAquisicao" className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Aquisição
                    </label>
                    <input
                      type="date"
                      id="dataAquisicao"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                      value={veiculoData.dataAquisicao}
                      onChange={(e) => setVeiculoData({...veiculoData, dataAquisicao: e.target.value})}
                    />
                  </div>
                  
                  {/* Última revisão */}
                  <div>
                    <label htmlFor="ultimaRevisao" className="block text-sm font-medium text-gray-700 mb-1">
                      Data da Última Revisão
                    </label>
                    <input
                      type="date"
                      id="ultimaRevisao"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                      value={veiculoData.ultimaRevisao}
                      onChange={(e) => setVeiculoData({...veiculoData, ultimaRevisao: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              {/* Botão de submit */}
              <div className="flex justify-end border-t border-gray-200 pt-6">
                <button
                  type="submit"
                  disabled={!validateForm() || isLoading}
                  className={`px-6 py-3 rounded-lg text-white font-medium transition-colors ${
                    validateForm() && !isLoading
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
                  ) : (
                    "Cadastrar Veículo"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 