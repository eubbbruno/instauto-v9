import InstitutionalLayout from '@/components/InstitutionalLayout'
import Link from 'next/link'
import { PlayIcon, UserIcon, WrenchIcon, ChartBarIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

export default function DemonstracaoPage() {
  return (
    <InstitutionalLayout 
      title="Demonstração da Plataforma"
      description="Veja como a InstaAuto funciona na prática. Explore todas as funcionalidades para motoristas e oficinas."
    >
      <div className="space-y-12">
        {/* Video Demo */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white mb-8">
            <PlayIcon className="w-16 h-16 mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl font-bold mb-4">Vídeo Demonstração</h2>
            <p className="text-blue-100 mb-6">
              Assista ao nosso vídeo de 3 minutos e veja como é fácil usar a InstaAuto
            </p>
            <div className="aspect-video bg-black/20 rounded-lg flex items-center justify-center">
              <iframe
                src="https://www.youtube.com/embed/9GCOl9dXm6I"
                title="InstaAuto - Demonstração da Plataforma"
                className="w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        {/* Features Demo */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Explore as Funcionalidades
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Motorista Demo */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-600 p-3 rounded-lg">
                  <UserIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Para Motoristas</h3>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-1 rounded">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Busca Inteligente</h4>
                    <p className="text-gray-600 text-sm">Encontre oficinas próximas com filtros avançados</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-1 rounded">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Agendamento Fácil</h4>
                    <p className="text-gray-600 text-sm">Agende serviços em poucos cliques</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-1 rounded">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Histórico Completo</h4>
                    <p className="text-gray-600 text-sm">Acompanhe toda a manutenção do seu veículo</p>
                  </div>
                </div>
              </div>
              
              <Link 
                href="/login"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors"
              >
                🚗 Testar como Motorista
              </Link>
            </div>

            {/* Oficina Demo */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl border border-orange-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-orange-600 p-3 rounded-lg">
                  <WrenchIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Para Oficinas</h3>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="bg-orange-100 p-1 rounded">
                    <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Gestão de Agendamentos</h4>
                    <p className="text-gray-600 text-sm">Organize sua agenda de forma eficiente</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-orange-100 p-1 rounded">
                    <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Relatórios Detalhados</h4>
                    <p className="text-gray-600 text-sm">Acompanhe performance e faturamento</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-orange-100 p-1 rounded">
                    <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Chat Integrado</h4>
                    <p className="text-gray-600 text-sm">Comunicação direta com clientes</p>
                  </div>
                </div>
              </div>
              
              <Link 
                href="/oficinas/login"
                className="block w-full bg-orange-600 hover:bg-orange-700 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors"
              >
                🔧 Testar como Oficina
              </Link>
            </div>
          </div>
        </section>

        {/* Interactive Demo */}
        <section className="bg-gray-50 p-8 rounded-2xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Demonstração Interativa
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <ChartBarIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Dashboard Analytics</h3>
              <p className="text-gray-600 text-sm mb-4">
                Veja métricas em tempo real do seu negócio
              </p>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Ver Demo →
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <ChatBubbleLeftRightIcon className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Chat em Tempo Real</h3>
              <p className="text-gray-600 text-sm mb-4">
                Comunicação instantânea entre motoristas e oficinas
              </p>
              <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                Testar Chat →
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <svg className="w-12 h-12 text-purple-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sistema de Pagamentos</h3>
              <p className="text-gray-600 text-sm mb-4">
                Pagamentos seguros via PIX, cartão e boleto
              </p>
              <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                Ver Checkout →
              </button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 rounded-2xl text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para Começar?</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Junte-se a milhares de motoristas e oficinas que já usam a InstaAuto
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/login"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              🚗 Cadastrar como Motorista
            </Link>
            <Link 
              href="/oficinas/login"
              className="bg-blue-500 hover:bg-blue-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors border-2 border-blue-400"
            >
              🔧 Cadastrar Oficina
            </Link>
          </div>
        </section>
      </div>
    </InstitutionalLayout>
  )
}