"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  MagnifyingGlassIcon, 
  PlusIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  TagIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  Square2StackIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from "@heroicons/react/24/outline";

// Tipos para produtos
type ProductCategory = 'peça' | 'óleo' | 'fluido' | 'acessório' | 'ferramenta' | 'outro';

type Product = {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  cost: number;
  stock: number;
  sku: string;
  brand?: string;
  minimumStock?: number;
  supplier?: string;
  lastPurchase?: string;
  location?: string;
  compatible?: string[];
  image?: string;
};

// Dados mockados de produtos
const mockProducts: Product[] = [
  {
    id: "P-001",
    name: "Filtro de Óleo Premium",
    description: "Filtro de óleo de alta qualidade compatível com vários modelos",
    category: "peça",
    price: 45.90,
    cost: 25.50,
    stock: 32,
    sku: "FLT-OL-001",
    brand: "FilterTech",
    minimumStock: 10,
    supplier: "Auto Peças Brasil",
    lastPurchase: "2023-09-15",
    location: "Prateleira A-3",
    compatible: ["Toyota", "Honda", "Hyundai"]
  },
  {
    id: "P-002",
    name: "Óleo Motor Sintético 5W30",
    description: "Óleo sintético de alta performance para motores modernos",
    category: "óleo",
    price: 120.00,
    cost: 85.00,
    stock: 45,
    sku: "OL-5W30-001",
    brand: "Petromax",
    minimumStock: 15,
    supplier: "Distribuidora Óleos",
    lastPurchase: "2023-09-10",
    location: "Estante B-2",
  },
  {
    id: "P-003",
    name: "Pastilha de Freio Dianteira",
    description: "Conjunto de pastilhas de freio para veículos de passeio",
    category: "peça",
    price: 89.90,
    cost: 55.00,
    stock: 18,
    sku: "FRE-PST-001",
    brand: "BrakeMaster",
    minimumStock: 8,
    supplier: "Auto Peças Brasil",
    lastPurchase: "2023-09-20",
    location: "Prateleira C-1",
    compatible: ["Fiat", "Volkswagen", "Chevrolet"]
  },
  {
    id: "P-004",
    name: "Fluido de Freio DOT 4",
    description: "Fluido de freio de alta qualidade, resistente a altas temperaturas",
    category: "fluido",
    price: 28.50,
    cost: 18.00,
    stock: 25,
    sku: "FL-FRE-001",
    brand: "BrakeFluid",
    minimumStock: 10,
    supplier: "Distribuidora Fluidos",
    lastPurchase: "2023-09-05",
    location: "Estante B-3",
  },
  {
    id: "P-005",
    name: "Vela de Ignição Iridium",
    description: "Vela de ignição de longa duração com ponta de irídio",
    category: "peça",
    price: 38.90,
    cost: 22.00,
    stock: 40,
    sku: "IGN-VL-001",
    brand: "SparkPro",
    minimumStock: 12,
    supplier: "Auto Peças Elétricas",
    lastPurchase: "2023-09-18",
    location: "Gaveta D-2",
    compatible: ["Multimarcas"]
  },
  {
    id: "P-006",
    name: "Correia Dentada",
    description: "Correia de distribuição para motores 1.0 a 1.6",
    category: "peça",
    price: 75.00,
    cost: 45.00,
    stock: 12,
    sku: "COR-DNT-001",
    brand: "BeltMaster",
    minimumStock: 5,
    supplier: "Auto Peças Brasil",
    lastPurchase: "2023-09-12",
    location: "Prateleira A-4",
    compatible: ["Fiat", "Volkswagen", "Ford"]
  },
];

export default function ProdutosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'all'>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'price'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filtrar e ordenar produtos
  const filteredProducts = products
    .filter(product => {
      // Filtro por termo de busca
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !product.sku.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !product.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filtro por categoria
      if (categoryFilter !== 'all' && product.category !== categoryFilter) {
        return false;
      }
      
      // Filtro por estoque
      if (stockFilter === 'low' && 
          (!product.minimumStock || product.stock > product.minimumStock)) {
        return false;
      }
      
      if (stockFilter === 'out' && product.stock > 0) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Ordenação
      if (sortBy === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      
      if (sortBy === 'stock') {
        return sortDirection === 'asc' 
          ? a.stock - b.stock
          : b.stock - a.stock;
      }
      
      if (sortBy === 'price') {
        return sortDirection === 'asc' 
          ? a.price - b.price
          : b.price - a.price;
      }
      
      return 0;
    });
  
  // Formatar categoria para exibição
  const formatCategory = (category: ProductCategory) => {
    const formats: Record<ProductCategory, string> = {
      'peça': 'Peça',
      'óleo': 'Óleo',
      'fluido': 'Fluido',
      'acessório': 'Acessório',
      'ferramenta': 'Ferramenta',
      'outro': 'Outro'
    };
    
    return formats[category] || category;
  };
  
  // Formatação de valores
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  // Verificar status de estoque
  const getStockStatus = (product: Product) => {
    if (product.stock === 0) {
      return { label: "Sem estoque", class: "bg-red-100 text-red-700" };
    }
    
    if (product.minimumStock && product.stock <= product.minimumStock) {
      return { label: "Estoque baixo", class: "bg-amber-100 text-amber-700" };
    }
    
    return { label: "Em estoque", class: "bg-green-100 text-green-700" };
  };
  
  // Calcular margem de lucro
  const calculateProfit = (price: number, cost: number) => {
    const profit = price - cost;
    const margin = (profit / price) * 100;
    
    return {
      profit,
      margin: margin.toFixed(1)
    };
  };
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Produtos & Peças</h1>
            <p className="text-gray-500 text-sm mt-1">Gerencie o catálogo de produtos da sua oficina</p>
          </div>
          
          <button
            className="px-4 py-2 bg-[#0047CC] text-white rounded-lg text-sm font-medium hover:bg-[#003CAD] transition-colors inline-flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Novo Produto
          </button>
        </div>
      </div>
      
      {/* Filtros e busca */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Campo de busca */}
          <div className="md:col-span-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nome, código ou descrição..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Filtros rápidos */}
          <div className="md:col-span-5 flex flex-wrap gap-2">
            {/* Filtro por categoria */}
            <select
              className="px-3 py-2 rounded-lg text-sm border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0047CC]"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
            >
              <option value="all">Todas categorias</option>
              <option value="peça">Peças</option>
              <option value="óleo">Óleos</option>
              <option value="fluido">Fluidos</option>
              <option value="acessório">Acessórios</option>
              <option value="ferramenta">Ferramentas</option>
              <option value="outro">Outros</option>
            </select>
            
            {/* Filtro por estoque */}
            <select
              className="px-3 py-2 rounded-lg text-sm border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0047CC]"
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
            >
              <option value="all">Todos estoques</option>
              <option value="low">Estoque baixo</option>
              <option value="out">Sem estoque</option>
            </select>
            
            {/* Ordenação */}
            <select
              className="px-3 py-2 rounded-lg text-sm border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0047CC]"
              value={`${sortBy}-${sortDirection}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-');
                setSortBy(field as any);
                setSortDirection(direction as any);
              }}
            >
              <option value="name-asc">Nome (A-Z)</option>
              <option value="name-desc">Nome (Z-A)</option>
              <option value="price-asc">Preço (menor-maior)</option>
              <option value="price-desc">Preço (maior-menor)</option>
              <option value="stock-asc">Estoque (menor-maior)</option>
              <option value="stock-desc">Estoque (maior-menor)</option>
            </select>
          </div>
          
          {/* Botão de filtros avançados */}
          <div className="md:col-span-2 flex justify-end">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 py-2 rounded-lg text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center"
            >
              <FunnelIcon className="h-4 w-4 mr-1" />
              Filtros
              <ChevronDownIcon className={`h-4 w-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
        
        {/* Filtros avançados (expandíveis) */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fornecedor</label>
              <select className="w-full px-3 py-2 rounded-lg text-sm border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0047CC]">
                <option value="">Todos os fornecedores</option>
                <option>Auto Peças Brasil</option>
                <option>Distribuidora Óleos</option>
                <option>Distribuidora Fluidos</option>
                <option>Auto Peças Elétricas</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Marca</label>
              <select className="w-full px-3 py-2 rounded-lg text-sm border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0047CC]">
                <option value="">Todas as marcas</option>
                <option>FilterTech</option>
                <option>Petromax</option>
                <option>BrakeMaster</option>
                <option>SparkPro</option>
                <option>BeltMaster</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Compatibilidade</label>
              <select className="w-full px-3 py-2 rounded-lg text-sm border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0047CC]">
                <option value="">Todos os veículos</option>
                <option>Toyota</option>
                <option>Honda</option>
                <option>Hyundai</option>
                <option>Fiat</option>
                <option>Volkswagen</option>
                <option>Chevrolet</option>
                <option>Ford</option>
                <option>Multimarcas</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Lista de produtos */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produto
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Custo
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Margem
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estoque
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </td>
                  </tr>
                ))
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-gray-100 p-4 rounded-full mb-4">
                        <TagIcon className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-1">Nenhum produto encontrado</h3>
                      <p className="text-gray-500 mb-4">Tente ajustar seus filtros ou adicione um novo produto</p>
                      <button
                        className="px-4 py-2 bg-[#0047CC] text-white rounded-lg text-sm font-medium hover:bg-[#003CAD] transition-colors inline-flex items-center"
                      >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Novo Produto
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, index) => {
                  const stockStatus = getStockStatus(product);
                  const { profit, margin } = calculateProfit(product.price, product.cost);
                  
                  return (
                    <motion.tr 
                      key={product.id} 
                      className="hover:bg-gray-50 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {product.image ? (
                            <div className="w-10 h-10 rounded-md bg-gray-100 mr-3 overflow-hidden flex-shrink-0">
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-md bg-gray-100 mr-3 flex items-center justify-center flex-shrink-0">
                              <TagIcon className="h-5 w-5 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-800">{product.name}</div>
                            <div className="text-xs text-gray-500">{product.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">
                          {formatCategory(product.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-800">
                          {formatCurrency(product.price)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">
                          {formatCurrency(product.cost)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-800">
                            {formatCurrency(profit)}
                          </span>
                          <span className="text-xs text-green-600">
                            {margin}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${stockStatus.class} mr-2`}>
                            {stockStatus.label}
                          </span>
                          <span className="text-sm font-medium text-gray-800">
                            {product.stock}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-gray-600 hover:text-gray-900 transition-colors">
                            <PencilSquareIcon className="h-5 w-5" />
                          </button>
                          <button className="p-1 text-gray-600 hover:text-gray-900 transition-colors">
                            <Square2StackIcon className="h-5 w-5" />
                          </button>
                          <button className="p-1 text-gray-600 hover:text-red-600 transition-colors">
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Resumo de estoque */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-800">Valor Total do Estoque</h3>
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <TagIcon className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {formatCurrency(products.reduce((sum, product) => sum + (product.cost * product.stock), 0))}
          </div>
          <p className="text-sm text-gray-500">
            {products.reduce((sum, product) => sum + product.stock, 0)} itens em estoque
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-800">Produtos com Estoque Baixo</h3>
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {products.filter(p => p.minimumStock && p.stock <= p.minimumStock && p.stock > 0).length}
          </div>
          <p className="text-sm text-gray-500">
            Produtos abaixo do estoque mínimo
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-800">Produtos sem Estoque</h3>
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {products.filter(p => p.stock === 0).length}
          </div>
          <p className="text-sm text-gray-500">
            Produtos que precisam ser repostos
          </p>
        </div>
      </div>
    </div>
  );
} 