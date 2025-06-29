"use client";

import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon,
  BuildingStorefrontIcon,
  StarIcon,
  MapPinIcon,
  PaperAirplaneIcon,
  PlusIcon,
  PhotoIcon,
  XMarkIcon,
  ClockIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  ShareIcon,
  FunnelIcon,
  MapIcon
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface Oficina {
  id: number;
  nome: string;
  avaliacao: number;
  totalAvaliacoes: number;
  especialidades: string[];
  endereco: string;
  distancia: string;
  preco: string;
  horarioFuncionamento: string;
  telefone: string;
  imagem: string;
  tempoResposta: string;
  promocao?: string;
  verified: boolean;
}

export default function BuscarOficinasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("todos");
  const [selectedOfficinas, setSelectedOfficinas] = useState<number[]>([]);
  const [favoriteOfficinas, setFavoriteOfficinas] = useState<number[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
  // Filtros avançados
  const [filters, setFilters] = useState({
    maxDistancia: 10,
    precoRange: "todos", // todos, baixo, medio, alto
    horario: "todos", // todos, agora, 24h
    avaliacao: 0, // mínimo de estrelas
    promocao: false
  });

  // Lista de oficinas expandida e mais realista
  const oficinas: Oficina[] = [
    {
      id: 1,
      nome: "Auto Center Silva",
      avaliacao: 4.8,
      totalAvaliacoes: 127,
      especialidades: ["Troca de óleo", "Freios", "Suspensão", "Alinhamento"],
      endereco: "Av. Paulista, 1500 - São Paulo, SP",
      distancia: "2,5 km",
      preco: "$$",
      horarioFuncionamento: "8h - 18h",
      telefone: "(11) 99999-1111",
      imagem: "/images/oficina1.jpg",
      tempoResposta: "~2h",
      promocao: "20% OFF em troca de óleo",
      verified: true
    },
    {
      id: 2,
      nome: "Mecânica Expressa 24h",
      avaliacao: 4.5,
      totalAvaliacoes: 89,
      especialidades: ["Elétrica", "Injeção eletrônica", "Diagnóstico", "Scanner"],
      endereco: "Rua Augusta, 800 - São Paulo, SP",
      distancia: "3,8 km",
      preco: "$$$",
      horarioFuncionamento: "24h",
      telefone: "(11) 99999-2222",
      imagem: "/images/oficina2.jpg",
      tempoResposta: "~1h",
      verified: true
    },
    {
      id: 3,
      nome: "Pneus & Rodas Premium",
      avaliacao: 4.7,
      totalAvaliacoes: 156,
      especialidades: ["Pneus", "Rodas", "Alinhamento", "Balanceamento"],
      endereco: "Av. Rebouças, 500 - São Paulo, SP",
      distancia: "5,1 km",
      preco: "$$",
      horarioFuncionamento: "7h - 19h",
      telefone: "(11) 99999-3333",
      imagem: "/images/oficina3.jpg",
      tempoResposta: "~3h",
      verified: false
    },
    {
      id: 4,
      nome: "Centro Automotivo Garcia",
      avaliacao: 4.9,
      totalAvaliacoes: 203,
      especialidades: ["Revisão completa", "Motor", "Câmbio", "Arrefecimento"],
      endereco: "Rua da Consolação, 1200 - São Paulo, SP",
      distancia: "4,3 km",
      preco: "$$$",
      horarioFuncionamento: "8h - 17h",
      telefone: "(11) 99999-4444",
      imagem: "/images/oficina4.jpg",
      tempoResposta: "~4h",
      verified: true
    },
    {
      id: 5,
      nome: "Oficina do João - Funilaria",
      avaliacao: 4.6,
      totalAvaliacoes: 78,
      especialidades: ["Funilaria", "Pintura", "Polimento", "Restauração"],
      endereco: "Av. Brigadeiro Faria Lima, 2500 - São Paulo, SP",
      distancia: "6,7 km",
      preco: "$",
      horarioFuncionamento: "8h - 18h",
      telefone: "(11) 99999-5555",
      imagem: "/images/oficina5.jpg",
      tempoResposta: "~6h",
      promocao: "Orçamento grátis",
      verified: false
    },
    {
      id: 6,
      nome: "AutoElétrica Moderna",
      avaliacao: 4.4,
      totalAvaliacoes: 65,
      especialidades: ["Elétrica", "Ar condicionado", "Som automotivo", "Alarmes"],
      endereco: "Rua dos Pinheiros, 900 - São Paulo, SP",
      distancia: "3,2 km",
      preco: "$$",
      horarioFuncionamento: "9h - 18h",
      telefone: "(11) 99999-6666",
      imagem: "/images/oficina6.jpg",
      tempoResposta: "~2h",
      verified: true
    }
  ];
  
  // Filtro de oficinas com lógica mais avançada
  const filteredOfficinas = oficinas.filter(oficina => {
    // Filtro por texto de busca
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesText = (
        oficina.nome.toLowerCase().includes(searchLower) ||
        oficina.especialidades.some(esp => esp.toLowerCase().includes(searchLower)) ||
        oficina.endereco.toLowerCase().includes(searchLower)
      );
      if (!matchesText) return false;
    }
    
    // Filtro por categoria
    if (selectedFilter !== "todos") {
      const matchesCategory = oficina.especialidades.some(esp => 
        esp.toLowerCase().includes(selectedFilter.toLowerCase())
      );
      if (!matchesCategory) return false;
    }
    
    // Filtros avançados
    if (filters.maxDistancia < 10) {
      const distanciaNum = parseFloat(oficina.distancia.replace(" km", ""));
      if (distanciaNum > filters.maxDistancia) return false;
    }
    
    if (filters.precoRange !== "todos") {
      const precoMatch = {
        baixo: oficina.preco === "$",
        medio: oficina.preco === "$$", 
        alto: oficina.preco === "$$$"
      };
      if (!precoMatch[filters.precoRange as keyof typeof precoMatch]) return false;
    }
    
    if (filters.horario === "24h" && !oficina.horarioFuncionamento.includes("24h")) {
      return false;
    }
    
    if (filters.avaliacao > 0 && oficina.avaliacao < filters.avaliacao) {
      return false;
    }
    
    if (filters.promocao && !oficina.promocao) {
      return false;
    }
    
    return true;
  });
  
  // Manipulação da seleção de oficinas
  const toggleOfficina = (id: number) => {
    if (selectedOfficinas.includes(id)) {
      setSelectedOfficinas(selectedOfficinas.filter(item => item !== id));
    } else {
      setSelectedOfficinas([...selectedOfficinas, id]);
    }
  };
  
  // Manipulação de favoritos
  const toggleFavorite = (id: number) => {
    if (favoriteOfficinas.includes(id)) {
      setFavoriteOfficinas(favoriteOfficinas.filter(item => item !== id));
    } else {
      setFavoriteOfficinas([...favoriteOfficinas, id]);
    }
  };
  
  // Manipulação de upload de imagens
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newPreviewUrls = filesArray.map(file => URL.createObjectURL(file));
      
      setSelectedImages([...selectedImages, ...filesArray]);
      setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    }
  };
  
  // Remover imagem
  const removeImage = (index: number) => {
    const newImages = [...selectedImages];
    const newPreviews = [...previewUrls];
    
    URL.revokeObjectURL(newPreviews[index]);
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setSelectedImages(newImages);
    setPreviewUrls(newPreviews);
  };
  
  // Enviar solicitação para as oficinas selecionadas
  const submitRequest = () => {
    console.log("Solicitação enviada para as oficinas:", selectedOfficinas);
    console.log("Descrição:", description);
    console.log("Imagens:", selectedImages);
    
    // Reset do formulário
    setDescription("");
    setSelectedImages([]);
    setPreviewUrls([]);
    setIsFormOpen(false);
    setSelectedOfficinas([]);
    
    alert("Solicitação enviada com sucesso! As oficinas entrarão em contato em breve.");
  };
  
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
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Buscar Oficinas</h1>
          <p className="text-sm md:text-base text-gray-600">Encontre as melhores oficinas para o serviço que você precisa.</p>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => setShowMap(!showMap)}
            className={`p-3 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
              showMap 
                ? 'bg-[#0047CC] text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Ver no mapa"
          >
            <MapIcon className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
              showFilters 
                ? 'bg-[#0047CC] text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Filtros avançados"
          >
            <FunnelIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Barra de pesquisa - Mobile Optimized */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 md:p-6">
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Digite o serviço, nome da oficina..."
                  className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent text-sm md:text-base min-h-[48px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex-shrink-0">
                <button className="flex items-center justify-center w-full sm:w-auto px-6 py-4 bg-[#0047CC] text-white rounded-lg hover:bg-[#0055EB] transition-colors font-medium min-h-[48px]">
                  <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                  Buscar
                </button>
              </div>
            </div>
          
            {/* Filtros rápidos - Mobile Scroll */}
            <div className="border-t border-gray-100 pt-3 md:pt-4">
              <span className="text-xs md:text-sm text-gray-500 flex items-center font-medium mb-2">
                <AdjustmentsHorizontalIcon className="h-4 w-4 mr-1" /> Filtros Rápidos:
              </span>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {["todos", "mecânica", "elétrica", "funilaria", "pneus", "revisão", "24h"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-4 py-2 text-sm rounded-full capitalize transition-colors whitespace-nowrap min-h-[40px] ${
                      selectedFilter === filter
                        ? "bg-[#0047CC] text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {filter === "24h" ? "24 Horas" : filter}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filtros Avançados */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros Avançados</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {/* Distância */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distância máxima: {filters.maxDistancia}km
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={filters.maxDistancia}
                    onChange={(e) => setFilters({...filters, maxDistancia: parseInt(e.target.value)})}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200"
                  />
                </div>
                
                {/* Preço */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Faixa de preço</label>
                  <select
                    value={filters.precoRange}
                    onChange={(e) => setFilters({...filters, precoRange: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#0047CC] min-h-[44px] text-sm md:text-base"
                  >
                    <option value="todos">Todos os preços</option>
                    <option value="baixo">$ - Econômico</option>
                    <option value="medio">$$ - Médio</option>
                    <option value="alto">$$$ - Premium</option>
                  </select>
                </div>
                
                {/* Horário */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Horário</label>
                  <select
                    value={filters.horario}
                    onChange={(e) => setFilters({...filters, horario: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#0047CC] min-h-[44px] text-sm md:text-base"
                  >
                    <option value="todos">Qualquer horário</option>
                    <option value="agora">Aberto agora</option>
                    <option value="24h">24 horas</option>
                  </select>
                </div>
                
                {/* Avaliação */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avaliação mínima: {filters.avaliacao} estrelas
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={filters.avaliacao}
                    onChange={(e) => setFilters({...filters, avaliacao: parseFloat(e.target.value)})}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200"
                  />
                </div>
              </div>
              
              {/* Checkbox para promoções */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.promocao}
                  onChange={(e) => setFilters({...filters, promocao: e.target.checked})}
                  className="rounded border-gray-300 text-[#0047CC] focus:ring-[#0047CC]"
                />
                <label className="ml-2 text-sm text-gray-700">Apenas oficinas com promoções</label>
              </div>
              
              {/* Botão para limpar filtros */}
              <div className="flex justify-end">
                <button
                  onClick={() => setFilters({
                    maxDistancia: 10,
                    precoRange: "todos",
                    horario: "todos",
                    avaliacao: 0,
                    promocao: false
                  })}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mapa (placeholder) */}
      <AnimatePresence>
        {showMap && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="h-64 bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <MapIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Mapa em desenvolvimento</p>
                <p className="text-sm text-gray-500">Em breve você poderá ver as oficinas no mapa</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Botão para enviar solicitação - Mobile Optimized */}
      {selectedOfficinas.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#0047CC] to-[#0055EB] text-white p-4 md:p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-lg">{selectedOfficinas.length} oficina(s) selecionada(s)</span>
              <p className="text-white/80 mt-1">Selecione quantas oficinas quiser para enviar sua solicitação de orçamento.</p>
            </div>
            <button 
              onClick={() => setIsFormOpen(true)}
              className="bg-[#FFDE59] hover:bg-[#FFD327] text-[#0047CC] px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center shadow-md hover:shadow-lg"
            >
              <PaperAirplaneIcon className="h-5 w-5 mr-2" />
              Enviar Solicitação
            </button>
          </div>
        </motion.div>
      )}
      
      {/* Resultados */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {filteredOfficinas.length} oficina(s) encontrada(s)
        </h2>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Ordenar por:</span>
          <select className="border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#0047CC]">
            <option>Distância</option>
            <option>Avaliação</option>
            <option>Preço</option>
            <option>Tempo de resposta</option>
          </select>
        </div>
      </div>
      
      {/* Formulário de solicitação */}
      {isFormOpen && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Enviar Solicitação de Serviço</h2>
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-600 text-sm mb-2">Enviando para {selectedOfficinas.length} oficina(s):</p>
                <div className="flex flex-wrap gap-2">
                  {selectedOfficinas.map(id => {
                    const oficina = oficinas.find(o => o.id === id);
                    return (
                      <div key={id} className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full">
                        {oficina?.nome}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descreva o serviço que você precisa:
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                  rows={5}
                  placeholder="Detalhe o problema ou serviço necessário. Quanto mais informações, melhor para as oficinas avaliarem."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adicione fotos (opcional):
                </label>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square border rounded-lg overflow-hidden">
                      <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                      <button 
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-red-50"
                      >
                        <XMarkIcon className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                  
                  {previewUrls.length < 6 && (
                    <label className="aspect-square border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                      <PhotoIcon className="h-8 w-8 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500">Adicionar foto</span>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        multiple
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-gray-500">Você pode adicionar até 6 imagens (máx. 5MB cada)</p>
              </div>
              
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button 
                  onClick={submitRequest}
                  className="px-4 py-2 bg-[#0047CC] text-white rounded-lg hover:bg-[#0055EB]"
                >
                  Enviar Solicitação
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Lista de oficinas - Mobile Responsive */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6"
      >
        {filteredOfficinas.length > 0 ? (
          filteredOfficinas.map((oficina) => (
            <motion.div
              key={oficina.id}
              variants={fadeInUp}
              className={`bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 relative ${
                selectedOfficinas.includes(oficina.id) ? "ring-2 ring-[#0047CC] shadow-lg" : ""
              }`}
            >
              {/* Header do Card */}
              <div className="relative">
                {/* Imagem da oficina */}
                <div className="h-40 md:h-48 relative bg-gradient-to-br from-blue-50 to-blue-100">
                  <div className="w-full h-full flex items-center justify-center">
                    <BuildingStorefrontIcon className="h-16 w-16 text-[#0047CC]/20" />
                  </div>
                  
                  {/* Badges superiores */}
                  <div className="absolute top-3 left-3 flex flex-col space-y-2">
                    {oficina.verified && (
                      <div className="bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center">
                        ✓ Verificada
                      </div>
                    )}
                    {oficina.promocao && (
                      <div className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                        🎯 Promoção
                      </div>
                    )}
                  </div>
                  
                  {/* Ações do card */}
                  <div className="absolute top-3 right-3 flex flex-col space-y-2">
                    <button 
                      onClick={() => toggleFavorite(oficina.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all ${
                        favoriteOfficinas.includes(oficina.id) 
                          ? "bg-red-500 text-white" 
                          : "bg-white/80 text-gray-600 hover:bg-white"
                      }`}
                      title="Adicionar aos favoritos"
                    >
                      {favoriteOfficinas.includes(oficina.id) ? (
                        <HeartSolidIcon className="h-5 w-5" />
                      ) : (
                        <HeartIcon className="h-5 w-5" />
                      )}
                    </button>
                    
                    <button 
                      className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-600 flex items-center justify-center backdrop-blur-sm transition-all"
                      title="Compartilhar"
                    >
                      <ShareIcon className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {/* Info overlay inferior */}
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between">
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg flex items-center text-sm font-medium">
                      <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                      <span>{oficina.avaliacao}</span>
                      <span className="text-gray-500 text-xs ml-1">({oficina.totalAvaliacoes})</span>
                    </div>
                    
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg flex items-center text-sm">
                      <MapPinIcon className="h-4 w-4 text-[#0047CC] mr-1" />
                      <span className="font-medium">{oficina.distancia}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Conteúdo do Card - Mobile Optimized */}
              <div className="p-4 md:p-5">
                {/* Nome e preço */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">{oficina.nome}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2">{oficina.endereco}</p>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0">
                    <div className="text-lg font-bold text-[#0047CC]">{oficina.preco}</div>
                    <div className="text-xs text-gray-500">Preço médio</div>
                  </div>
                </div>
                
                {/* Horário e tempo de resposta */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-1 text-sm">
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{oficina.horarioFuncionamento}</span>
                  </div>
                  <div className="text-green-600 font-medium text-xs sm:text-sm">
                    ⚡ Responde em {oficina.tempoResposta}
                  </div>
                </div>
                
                {/* Promoção */}
                {oficina.promocao && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-3">
                    <p className="text-yellow-800 text-sm font-medium">🎉 {oficina.promocao}</p>
                  </div>
                )}
                
                {/* Especialidades */}
                <div className="mb-4">
                  <h4 className="text-xs font-medium text-gray-500 mb-2">Especialidades:</h4>
                  <div className="flex flex-wrap gap-1">
                    {oficina.especialidades.slice(0, 3).map((esp, i) => (
                      <span 
                        key={i}
                        className={`text-xs px-2 py-1 rounded-full ${
                          searchTerm && esp.toLowerCase().includes(searchTerm.toLowerCase())
                            ? "bg-blue-100 text-blue-800 font-medium"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {esp}
                      </span>
                    ))}
                    {oficina.especialidades.length > 3 && (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500">
                        +{oficina.especialidades.length - 3}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Ações do card - Mobile Optimized */}
                <div className="space-y-3">
                  {/* Botões de ação - Touch Friendly */}
                  <div className="flex gap-2">
                    <a
                      href={`tel:${oficina.telefone}`}
                      className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center min-h-[44px] touch-manipulation"
                    >
                      <PhoneIcon className="h-4 w-4 mr-1" />
                      Ligar
                    </a>
                    
                    <a
                      href={`https://wa.me/55${oficina.telefone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center min-h-[44px] touch-manipulation"
                    >
                      <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                      WhatsApp
                    </a>
                  </div>
                  
                  {/* Botão de seleção - Touch Friendly */}
                  <button 
                    onClick={() => toggleOfficina(oficina.id)}
                    className={`w-full py-4 rounded-lg flex items-center justify-center transition-all font-medium min-h-[48px] touch-manipulation ${
                      selectedOfficinas.includes(oficina.id)
                        ? "bg-[#0047CC] text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {selectedOfficinas.includes(oficina.id) ? (
                      <>
                        ✓ Selecionada para orçamento
                      </>
                    ) : (
                      <>
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Selecionar para orçamento
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <MagnifyingGlassIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">Nenhuma oficina encontrada</h3>
            <p className="text-gray-500 mb-4">Tente ajustar os filtros ou buscar por outros termos.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedFilter("todos");
                setFilters({
                  maxDistancia: 10,
                  precoRange: "todos",
                  horario: "todos",
                  avaliacao: 0,
                  promocao: false
                });
              }}
              className="text-[#0047CC] hover:text-[#0055EB] font-medium"
            >
              Limpar todos os filtros
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
} 