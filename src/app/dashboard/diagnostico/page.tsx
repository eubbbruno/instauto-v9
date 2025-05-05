"use client";

import { 
  HomeIcon, 
  WrenchScrewdriverIcon, 
  ClipboardDocumentListIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  StarIcon,
  ChatBubbleBottomCenterTextIcon,
  CogIcon,
  BellIcon,
  ArchiveBoxIcon,
  ArrowPathIcon,
  PaperAirplaneIcon,
  MicrophoneIcon,
  PhotoIcon,
  QuestionMarkCircleIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function DiagnosticoPage() {
  return (
    <div className="min-h-screen bg-neutral-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--primary-blue)] text-white min-h-screen fixed left-0 top-0 hidden md:block">
        <div className="p-4 border-b border-blue-700">
          <div className="text-2xl font-bold">Instauto</div>
          <div className="text-sm text-white/70">Oficina do Carlos</div>
        </div>
        
        <nav className="mt-6 px-4">
          <ul className="space-y-1">
            {[
              { icon: <HomeIcon className="h-5 w-5" />, label: "Dashboard", href: "/dashboard" },
              { icon: <WrenchScrewdriverIcon className="h-5 w-5" />, label: "Ordens de Serviço", href: "/dashboard/ordens" },
              { icon: <ClipboardDocumentListIcon className="h-5 w-5" />, label: "Diagnóstico", href: "/dashboard/diagnostico", active: true },
              { icon: <CalendarIcon className="h-5 w-5" />, label: "Agendamentos", href: "/dashboard/agendamentos" },
              { icon: <CurrencyDollarIcon className="h-5 w-5" />, label: "Financeiro", href: "/dashboard/financeiro" },
              { icon: <ChartBarIcon className="h-5 w-5" />, label: "Relatórios", href: "/dashboard/relatorios" },
              { icon: <StarIcon className="h-5 w-5" />, label: "Avaliações", href: "/dashboard/avaliacoes" },
              { icon: <ChatBubbleBottomCenterTextIcon className="h-5 w-5" />, label: "WhatsApp", href: "/dashboard/whatsapp" },
            ].map((item, i) => (
              <li key={i}>
                <Link 
                  href={item.href} 
                  className={`flex items-center space-x-3 p-3 rounded-md ${item.active 
                    ? 'bg-white/10 font-medium' 
                    : 'hover:bg-white/5'}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="border-t border-blue-700 my-6 pt-6">
            <ul className="space-y-1">
              {[
                { icon: <CogIcon className="h-5 w-5" />, label: "Configurações", href: "/dashboard/configuracoes" },
                { icon: <QuestionMarkCircleIcon className="h-5 w-5" />, label: "Suporte com IA", href: "/dashboard/suporte" },
              ].map((item, i) => (
                <li key={i}>
                  <Link 
                    href={item.href} 
                    className="flex items-center space-x-3 p-3 rounded-md hover:bg-white/5"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white/30 flex-shrink-0"></div>
            <div>
              <div className="font-medium">Carlos Oliveira</div>
              <div className="text-sm text-white/70">Administrador</div>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center">
            <button className="md:hidden p-2 mr-2 rounded-md hover:bg-neutral-gray-100">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-bold">Diagnóstico com IA</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-neutral-gray-100 relative">
              <BellIcon className="h-6 w-6 text-neutral-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-neutral-gray-300"></div>
              <span className="hidden sm:inline-block">Carlos</span>
            </button>
          </div>
        </header>
        
        {/* Content */}
        <div className="flex-1 grid md:grid-cols-4 gap-0">
          {/* Sidebar - History */}
          <div className="hidden md:block bg-white border-r border-neutral-gray-200">
            <div className="p-4 border-b border-neutral-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold">Histórico</h2>
                <button className="text-[var(--primary-blue)] text-sm hover:underline flex items-center">
                  <ArrowPathIcon className="h-4 w-4 mr-1" />
                  Atualizar
                </button>
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Buscar diagnóstico..." 
                  className="w-full p-2 pl-8 bg-neutral-gray-100 rounded text-sm"
                />
                <svg className="h-4 w-4 text-neutral-gray-500 absolute left-2 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
              {[
                {
                  vehicle: "Honda Civic 2020",
                  plate: "ABC-1234",
                  date: "Hoje, 14:35",
                  query: "Check engine aceso - Código P0420",
                  active: true
                },
                {
                  vehicle: "Toyota Corolla 2019",
                  plate: "DEF-5678",
                  date: "Hoje, 11:20",
                  query: "Vibração ao frear"
                },
                {
                  vehicle: "Fiat Uno 2017",
                  plate: "GHI-9012",
                  date: "Ontem, 16:45",
                  query: "Problema no alternador"
                },
                {
                  vehicle: "VW Gol 2021",
                  plate: "JKL-3456",
                  date: "25/04/2025",
                  query: "Código P0300 - Falha na ignição"
                },
              ].map((item, i) => (
                <div 
                  key={i}
                  className={`p-4 border-b border-neutral-gray-200 cursor-pointer ${
                    item.active ? 'bg-[var(--light-blue)]' : 'hover:bg-neutral-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-medium">{item.vehicle}</div>
                    <div className="text-xs text-neutral-gray-500">{item.date}</div>
                  </div>
                  <div className="text-sm text-neutral-gray-500 mb-1">{item.plate}</div>
                  <div className="text-sm truncate">{item.query}</div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-neutral-gray-200">
              <button className="btn-primary w-full flex items-center justify-center">
                <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                Novo Diagnóstico
              </button>
            </div>
          </div>
          
          {/* Main Chat Area */}
          <div className="col-span-2 flex flex-col h-full">
            {/* Vehicle Information */}
            <div className="bg-white p-4 border-b border-neutral-gray-200">
              <div className="flex items-center">
                <div className="flex-1">
                  <h2 className="font-bold">Honda Civic 2020</h2>
                  <div className="flex space-x-4 text-sm text-neutral-gray-600">
                    <span>ABC-1234</span>
                    <span>•</span>
                    <span>Motor 1.8 Flex</span>
                  </div>
                </div>
                <button className="btn-outline text-sm py-1 px-3">Ver Ficha</button>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-neutral-gray-50" style={{ minHeight: '400px' }}>
              {/* User Message */}
              <div className="flex justify-end">
                <div className="bg-[var(--primary-blue)] text-white rounded-lg p-3 max-w-[80%]">
                  <p>Olá! Estou com um Honda Civic 2020 que está com o check engine aceso. O escaner mostrou o código P0420. O cliente relata que o carro está perdendo potência em subidas.</p>
                </div>
              </div>
              
              {/* AI Response */}
              <div className="flex">
                <div className="flex-shrink-0 mr-3">
                  <div className="bg-[var(--light-blue)] h-8 w-8 rounded-full flex items-center justify-center">
                    <CogIcon className="h-5 w-5 text-[var(--primary-blue)]" />
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 max-w-[80%] shadow-sm">
                  <div className="font-bold mb-1">Assistente Instauto</div>
                  <p className="mb-3">O código P0420 geralmente indica &quot;Eficiência do Catalisador Abaixo do Limiar&quot;. Baseado neste código e nos sintomas relatados, aqui está minha análise:</p>
                  
                  <div className="mb-3">
                    <div className="font-medium mb-1">Possíveis causas:</div>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Catalisador com eficiência reduzida ou danificado</li>
                      <li>Sensores de oxigênio defeituosos (antes ou depois do catalisador)</li>
                      <li>Vazamentos no sistema de escape</li>
                      <li>Problemas na mistura ar/combustível</li>
                    </ul>
                  </div>
                  
                  <div className="mb-3">
                    <div className="font-medium mb-1">Recomendações para diagnóstico:</div>
                    <ol className="list-decimal pl-5 space-y-1 text-sm">
                      <li>Verifique os valores dos sensores de oxigênio com o escaner em tempo real</li>
                      <li>Inspecione o sistema de escape para vazamentos</li>
                      <li>Examine o catalisador para possíveis danos físicos</li>
                      <li>Verifique se há atualizações de software disponíveis para a ECU</li>
                    </ol>
                  </div>
                  
                  <div>
                    <div className="font-medium mb-1">Peças potencialmente necessárias:</div>
                    <div className="bg-neutral-gray-100 p-2 rounded text-sm">
                      <div className="flex justify-between mb-1">
                        <span>Catalisador Honda Civic 2020</span>
                        <span className="font-medium">R$ 1.850,00</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span>Sensor de oxigênio pré-catalisador</span>
                        <span className="font-medium">R$ 380,00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sensor de oxigênio pós-catalisador</span>
                        <span className="font-medium">R$ 420,00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* User Message */}
              <div className="flex justify-end">
                <div className="bg-[var(--primary-blue)] text-white rounded-lg p-3 max-w-[80%]">
                  <p>Obrigado! Se eu quiser checar os sensores de oxigênio, quais valores devo esperar ver no escaner?</p>
                </div>
              </div>
              
              {/* AI Response */}
              <div className="flex">
                <div className="flex-shrink-0 mr-3">
                  <div className="bg-[var(--light-blue)] h-8 w-8 rounded-full flex items-center justify-center">
                    <CogIcon className="h-5 w-5 text-[var(--primary-blue)]" />
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 max-w-[80%] shadow-sm">
                  <div className="font-bold mb-1">Assistente Instauto</div>
                  <p className="mb-3">Ao monitorar os sensores de oxigênio no escaner para o Honda Civic 2020, você deve observar os seguintes padrões:</p>
                  
                  <div className="mb-3">
                    <div className="font-medium mb-1">Sensor pré-catalisador (O2S1/Sensor 1):</div>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Deve mostrar uma oscilação constante entre 0.1V e 0.9V (ou 100-900mV)</li>
                      <li>A frequência deve ser de várias vezes por segundo em marcha lenta</li>
                      <li>Este sensor deve reagir rapidamente às mudanças de aceleração</li>
                    </ul>
                  </div>
                  
                  <div className="mb-3">
                    <div className="font-medium mb-1">Sensor pós-catalisador (O2S2/Sensor 2):</div>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Deve mostrar uma leitura mais estável, geralmente entre 0.6V e 0.7V</li>
                      <li>As oscilações devem ser muito menos frequentes e de menor amplitude</li>
                      <li>Se este sensor estiver oscilando de forma similar ao sensor 1, indica um catalisador ineficiente</li>
                    </ul>
                  </div>
                  
                  <p>Se os dois sensores estiverem mostrando padrões semelhantes, isso confirma que o catalisador não está funcionando corretamente, pois não está alterando suficientemente a composição dos gases de escape.</p>
                </div>
              </div>
            </div>
            
            {/* Message Input */}
            <div className="bg-white p-4 border-t border-neutral-gray-200">
              <div className="flex items-center mb-2">
                <button className="p-2 rounded-full hover:bg-neutral-gray-100 text-neutral-gray-600">
                  <PhotoIcon className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-full hover:bg-neutral-gray-100 text-neutral-gray-600 mr-2">
                  <ArchiveBoxIcon className="h-5 w-5" />
                </button>
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    placeholder="Digite uma mensagem ou um código de erro..." 
                    className="w-full p-3 pr-10 bg-neutral-gray-100 rounded-lg text-sm"
                  />
                  <button className="absolute right-3 top-3 text-[var(--primary-blue)]">
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </button>
                </div>
                <button className="p-2 rounded-full hover:bg-neutral-gray-100 text-neutral-gray-600 ml-2">
                  <MicrophoneIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="text-xs text-neutral-gray-500 text-center">
                O assistente IA é uma ferramenta de apoio. Sempre utilize seu conhecimento técnico para validar as informações.
              </div>
            </div>
          </div>
          
          {/* Right Sidebar - Details */}
          <div className="hidden md:block bg-white border-l border-neutral-gray-200">
            <div className="p-4 border-b border-neutral-gray-200">
              <h2 className="font-bold mb-4">Detalhes do Veículo</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-neutral-gray-500 mb-1">Proprietário</div>
                  <div className="font-medium">João Silva</div>
                  <div className="text-sm text-neutral-gray-600">(11) 98765-4321</div>
                </div>
                
                <div>
                  <div className="text-xs text-neutral-gray-500 mb-1">Veículo</div>
                  <div className="font-medium">Honda Civic EXL</div>
                  <div className="text-sm text-neutral-gray-600">2020 • Preto • ABC-1234</div>
                </div>
                
                <div>
                  <div className="text-xs text-neutral-gray-500 mb-1">Motor</div>
                  <div className="text-sm text-neutral-gray-600">1.8 Flex • 140cv</div>
                </div>
                
                <div>
                  <div className="text-xs text-neutral-gray-500 mb-1">Quilometragem</div>
                  <div className="text-sm text-neutral-gray-600">58.432 km</div>
                </div>
                
                <div>
                  <div className="text-xs text-neutral-gray-500 mb-1">Última Manutenção</div>
                  <div className="text-sm text-neutral-gray-600">15/03/2025 (Troca de óleo e filtros)</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-b border-neutral-gray-200">
              <h2 className="font-bold mb-4">Histórico de Alertas</h2>
              
              <div className="space-y-3">
                {[
                  { 
                    code: "P0420", 
                    description: "Eficiência do Catalisador Abaixo do Limiar",
                    date: "Hoje",
                    status: "Ativo"
                  },
                  { 
                    code: "B1000", 
                    description: "Problemas no Airbag",
                    date: "10/01/2025",
                    status: "Resolvido"
                  },
                ].map((alert, i) => (
                  <div key={i} className="p-3 bg-neutral-gray-50 rounded-lg">
                    <div className="flex justify-between">
                      <div className="font-medium">{alert.code}</div>
                      <div className={`text-xs px-2 py-0.5 rounded-full ${
                        alert.status === "Ativo" 
                          ? "bg-red-100 text-red-800" 
                          : "bg-green-100 text-green-800"
                      }`}>
                        {alert.status}
                      </div>
                    </div>
                    <div className="text-sm text-neutral-gray-600">{alert.description}</div>
                    <div className="text-xs text-neutral-gray-500 mt-1">{alert.date}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4">
              <h2 className="font-bold mb-4">Ações</h2>
              
              <div className="space-y-3">
                <button className="btn-primary w-full justify-center">
                  Criar Ordem de Serviço
                </button>
                <button className="btn-outline w-full justify-center">
                  Agendar Serviço
                </button>
                <button className="w-full py-2 px-3 border border-neutral-gray-300 rounded-md text-neutral-gray-700 hover:bg-neutral-gray-50 transition-colors">
                  Compartilhar Diagnóstico
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 