'use client';

import InstitutionalLayout from '@/components/InstitutionalLayout';
import { useState } from 'react';
import { PlayCircleIcon, UserIcon, WrenchIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function DemonstracaoPage() {
  const [activeDemo, setActiveDemo] = useState<'motorista' | 'oficina'>('motorista');

  return (
    <InstitutionalLayout 
      title="Demonstração da Plataforma" 
      description="Veja como o Instauto funciona na prática"
    >
      <div className="max-w-6xl mx-auto">
        {/* Video Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Assista ao Vídeo de Apresentação</h2>
            <p className="text-lg mb-6 text-blue-100">
              Entenda em 3 minutos como o Instauto conecta motoristas e oficinas
            </p>
            <div className="aspect-w-16 aspect-h-9 max-w-3xl mx-auto">
              <iframe 
                src="https://www.youtube.com/embed/9GCOl9dXm6I"
                title="Instauto - Apresentação"
                className="w-full h-full rounded-lg shadow-2xl"
                style={{ minHeight: '400px' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        {/* Interactive Demo Selector */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Explore a Plataforma
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-lg mx-auto">
            <button
              onClick={() => setActiveDemo('motorista')}
              className={`flex-1 py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-3
                ${activeDemo === 'motorista' 
                  ? 'bg-[#0047CC] text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <UserIcon className="w-5 h-5" />
              Sou Motorista
            </button>
            <button
              onClick={() => setActiveDemo('oficina')}
              className={`flex-1 py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-3
                ${activeDemo === 'oficina' 
                  ? 'bg-[#0047CC] text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <WrenchIcon className="w-5 h-5" />
              Sou Oficina
            </button>
          </div>

          {/* Demo Content */}
          {activeDemo === 'motorista' ? (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                🚗 Jornada do Motorista
              </h3>
              
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      1
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Cadastre-se Gratuitamente
                    </h4>
                    <p className="text-gray-600 mb-3">
                      Crie sua conta em menos de 2 minutos. Você pode usar seu email ou fazer login com Google/Facebook.
                    </p>
                    <img 
                      src="/images/demo/motorista-cadastro.png" 
                      alt="Tela de cadastro"
                      className="rounded-lg shadow-md border border-gray-200"
                    />
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      2
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Adicione seus Veículos
                    </h4>
                    <p className="text-gray-600 mb-3">
                      Cadastre seus veículos na garagem virtual e mantenha todo histórico de manutenções organizado.
                    </p>
                    <img 
                      src="/images/demo/motorista-garagem.png" 
                      alt="Minha garagem"
                      className="rounded-lg shadow-md border border-gray-200"
                    />
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      3
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Encontre a Oficina Ideal
                    </h4>
                    <p className="text-gray-600 mb-3">
                      Use nossos filtros inteligentes para encontrar oficinas por localização, serviço, preço e avaliações.
                    </p>
                    <img 
                      src="/images/demo/motorista-busca.png" 
                      alt="Busca de oficinas"
                      className="rounded-lg shadow-md border border-gray-200"
                    />
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      4
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Agende com Segurança
                    </h4>
                    <p className="text-gray-600 mb-3">
                      Escolha data e horário, descreva o problema e pague com segurança pelo MercadoPago.
                    </p>
                    <img 
                      src="/images/demo/motorista-agendamento.png" 
                      alt="Agendamento"
                      className="rounded-lg shadow-md border border-gray-200"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Link
                  href="/auth/motorista"
                  className="inline-flex items-center gap-2 bg-[#0047CC] hover:bg-[#0055EB] text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  <PlayCircleIcon className="w-5 h-5" />
                  Começar Agora
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                🔧 Jornada da Oficina
              </h3>
              
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold">
                      1
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Cadastre sua Oficina
                    </h4>
                    <p className="text-gray-600 mb-3">
                      Preencha informações básicas, adicione fotos e serviços oferecidos. Plano gratuito disponível!
                    </p>
                    <img 
                      src="/images/demo/oficina-cadastro.png" 
                      alt="Cadastro de oficina"
                      className="rounded-lg shadow-md border border-gray-200"
                    />
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold">
                      2
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Receba Agendamentos
                    </h4>
                    <p className="text-gray-600 mb-3">
                      Receba notificações de novos agendamentos e gerencie sua agenda de forma eficiente.
                    </p>
                    <img 
                      src="/images/demo/oficina-agendamentos.png" 
                      alt="Gestão de agendamentos"
                      className="rounded-lg shadow-md border border-gray-200"
                    />
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold">
                      3
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Gerencie Ordens de Serviço
                    </h4>
                    <p className="text-gray-600 mb-3">
                      Crie orçamentos, acompanhe o progresso e mantenha o cliente informado em tempo real.
                    </p>
                    <img 
                      src="/images/demo/oficina-ordens.png" 
                      alt="Ordens de serviço"
                      className="rounded-lg shadow-md border border-gray-200"
                    />
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold">
                      4
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Cresça seu Negócio
                    </h4>
                    <p className="text-gray-600 mb-3">
                      Acompanhe métricas, receba avaliações positivas e atraia mais clientes para sua oficina.
                    </p>
                    <img 
                      src="/images/demo/oficina-dashboard.png" 
                      alt="Dashboard analytics"
                      className="rounded-lg shadow-md border border-gray-200"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Link
                  href="/auth/oficina"
                  className="inline-flex items-center gap-2 bg-[#FFDE59] hover:bg-[#FFD700] text-gray-900 px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  <PlayCircleIcon className="w-5 h-5" />
                  Cadastrar Oficina
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Features Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Recursos Principais
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                100% Mobile
              </h3>
              <p className="text-gray-600">
                Plataforma totalmente responsiva. Use no celular, tablet ou computador.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Pagamento Seguro
              </h3>
              <p className="text-gray-600">
                Transações protegidas com MercadoPago. PIX, cartão ou boleto.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Avaliações Reais
              </h3>
              <p className="text-gray-600">
                Sistema de avaliações transparente para escolhas mais seguras.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Chat Integrado
              </h3>
              <p className="text-gray-600">
                Converse diretamente com a oficina sem sair da plataforma.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Dashboard Completo
              </h3>
              <p className="text-gray-600">
                Acompanhe tudo em um só lugar: agendamentos, histórico e métricas.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Grátis para Começar
              </h3>
              <p className="text-gray-600">
                Motoristas sempre grátis. Oficinas com plano gratuito disponível.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pronto para Começar?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de motoristas e oficinas que já estão transformando 
              a forma de cuidar de veículos no Brasil.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/motorista"
                className="inline-flex items-center justify-center gap-2 bg-[#0047CC] hover:bg-[#0055EB] text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                <UserIcon className="w-5 h-5" />
                Sou Motorista
              </Link>
              <Link
                href="/auth/oficina"
                className="inline-flex items-center justify-center gap-2 bg-[#FFDE59] hover:bg-[#FFD700] text-gray-900 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                <WrenchIcon className="w-5 h-5" />
                Sou Oficina
              </Link>
            </div>
          </div>
        </section>

        {/* Note about demo images */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            * As imagens acima são ilustrativas. A interface real pode variar ligeiramente.
          </p>
        </div>
      </div>
    </InstitutionalLayout>
  );
}
