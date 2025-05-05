"use client";

import { CheckCircleIcon, ChevronRightIcon, ArrowPathIcon, UserGroupIcon, ChartBarIcon, ClockIcon, BuildingOfficeIcon, CogIcon, StarIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function OficinasPage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <header className="bg-white shadow-sm py-4 sticky top-0 z-50">
        <div className="container-custom flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue">
              Instauto
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#como-funciona" className="text-gray-600 hover:text-blue transition-colors">
              Como Funciona
            </a>
            <a href="#beneficios" className="text-gray-600 hover:text-blue transition-colors">
              Benefícios
            </a>
            <a href="#planos" className="text-gray-600 hover:text-blue transition-colors">
              Planos
            </a>
          </nav>
          <div className="flex space-x-4">
            <Link href="/" className="btn-outline">
              Para Motoristas
            </Link>
            <Link href="/dashboard" className="btn-primary">
              Entrar
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue py-16 relative overflow-hidden">
        <div className="absolute inset-0 pattern-grid"></div>
        <div className="container-custom relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="bg-yellow text-gray-900 px-4 py-1 rounded-full text-sm font-medium">
                Sistema Completo para Oficinas
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6">
                ERP + CRM especializado para sua oficina
              </h1>
              <p className="text-white/90 text-lg mb-8">
                Gerencie ordens de serviço, clientes, estoque, agendamentos e finanças em um único lugar. Aumente sua receita com novos clientes.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/cadastro" className="btn-secondary">
                  Experimentar Grátis
                </Link>
                <Link href="#planos" className="bg-white hover:bg-gray-100 text-blue font-medium py-3 px-6 rounded-md transition-all duration-300">
                  Ver Planos
                </Link>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center text-white">
                  <CheckCircleIcon className="h-5 w-5 text-yellow mr-2" />
                  <p>14 dias grátis</p>
                </div>
                <div className="flex items-center text-white">
                  <CheckCircleIcon className="h-5 w-5 text-yellow mr-2" />
                  <p>Sem cartão de crédito</p>
                </div>
              </div>
            </div>

            <div className="hidden md:block relative h-[500px]">
              <div className="absolute inset-0 bg-white rounded-lg shadow-xl overflow-hidden">
                <img src="/images/dashboard-preview.png" alt="Dashboard do Instauto" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="py-10 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "+12.500", label: "Oficinas cadastradas" },
              { value: "+650", label: "Cidades atendidas" },
              { value: "25%", label: "Aumento médio no faturamento" },
              { value: "4.8/5", label: "Avaliação média das oficinas" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-blue">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-20 bg-gray-100">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Como funciona o Instauto?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Otimize a gestão da sua oficina e atraia novos clientes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BuildingOfficeIcon className="h-10 w-10 text-blue" />,
                title: "Cadastre sua oficina",
                description: "Crie seu perfil completo, adicione fotos, serviços e sua equipe em minutos."
              },
              {
                icon: <ArrowPathIcon className="h-10 w-10 text-blue" />,
                title: "Receba solicitações",
                description: "Motoristas próximos enviarão pedidos de orçamento diretamente para você."
              },
              {
                icon: <CogIcon className="h-10 w-10 text-blue" />,
                title: "Gerencie seu negócio",
                description: "Use o painel completo para organizar serviços, clientes, estoque e finanças."
              }
            ].map((step, i) => (
              <div key={i} className="bg-white rounded-lg p-8 text-center relative">
                <div className="absolute -top-4 -left-4 bg-yellow w-10 h-10 rounded-full flex items-center justify-center font-bold">{i + 1}</div>
                <div className="flex justify-center mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section id="beneficios" className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Benefícios para oficinas mecânicas</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Um sistema completo para simplificar suas operações diárias e aumentar sua receita
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="bg-blue-light p-1 inline-block rounded mb-4">
                <UserGroupIcon className="h-8 w-8 text-blue" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Gestão de clientes avançada</h3>
              <p className="text-gray-600 mb-6">
                Mantenha um registro completo de todos os seus clientes, histórico de serviços, preferências e lembretes automáticos para manutenções futuras.
              </p>
              <ul className="space-y-3">
                {[
                  "Cadastro completo de clientes e veículos",
                  "Histórico detalhado de serviços por cliente",
                  "Lembretes automáticos para revisões preventivas",
                  "Comunicação direta via WhatsApp integrado"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-blue mr-2 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-100 rounded-lg h-[350px]">
              {/* Imagem placeholder para gestão de clientes */}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 md:order-1 bg-gray-100 rounded-lg h-[350px]">
              {/* Imagem placeholder para gestão de serviços */}
            </div>
            <div className="order-1 md:order-2">
              <div className="bg-blue-light p-1 inline-block rounded mb-4">
                <ClockIcon className="h-8 w-8 text-blue" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Ordens de serviço simplificadas</h3>
              <p className="text-gray-600 mb-6">
                Crie, acompanhe e gerencie ordens de serviço completas com fotos, diagnósticos, peças utilizadas e status em tempo real para seus clientes.
              </p>
              <ul className="space-y-3">
                {[
                  "Criação de O.S. com diagnóstico e fotos",
                  "Adição de peças e serviços com preços automáticos",
                  "Status de progresso com notificações para clientes",
                  "Histórico completo de serviços realizados"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-blue mr-2 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-blue-light p-1 inline-block rounded mb-4">
                <ChartBarIcon className="h-8 w-8 text-blue" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Análises e relatórios detalhados</h3>
              <p className="text-gray-600 mb-6">
                Tenha visibilidade completa do desempenho da sua oficina com relatórios de faturamento, serviços mais realizados, clientes recorrentes e muito mais.
              </p>
              <ul className="space-y-3">
                {[
                  "Dashboard com KPIs da sua oficina",
                  "Relatórios financeiros detalhados",
                  "Análise de serviços mais lucrativos",
                  "Projeções de receita e metas"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-blue mr-2 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-100 rounded-lg h-[350px]">
              {/* Imagem placeholder para análises */}
            </div>
          </div>
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="py-20 bg-gray-100">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Planos para todos os tamanhos de oficina</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Escolha o plano ideal para as necessidades da sua oficina
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Plano Básico */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Plano Básico</h3>
                <p className="text-gray-600 mb-4">Ideal para oficinas pequenas iniciando com tecnologia</p>
                <div className="flex items-end mb-6">
                  <span className="text-4xl font-bold">R$99</span>
                  <span className="text-gray-500 ml-2">/mês</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {[
                    "Até 2 usuários",
                    "100 ordens de serviço/mês",
                    "Gestão de clientes básica",
                    "Gestão financeira simplificada",
                    "Agenda de serviços",
                    "Recebimento de orçamentos online"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-blue mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className="btn-outline w-full">Começar Grátis</button>
              </div>
            </div>

            {/* Plano Profissional */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
              <div className="absolute top-0 inset-x-0 bg-blue text-white text-center py-1 text-sm font-medium">
                Mais Popular
              </div>
              <div className="p-6 pt-12">
                <h3 className="text-xl font-bold mb-2">Plano Profissional</h3>
                <p className="text-gray-600 mb-4">Para oficinas em crescimento que precisam de mais recursos</p>
                <div className="flex items-end mb-6">
                  <span className="text-4xl font-bold">R$199</span>
                  <span className="text-gray-500 ml-2">/mês</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {[
                    "Até 5 usuários",
                    "Ordens de serviço ilimitadas",
                    "Gestão de clientes avançada",
                    "Gestão financeira completa",
                    "Controle de estoque",
                    "Relatórios detalhados",
                    "Integração com WhatsApp",
                    "Comissões para mecânicos",
                    "Suporte prioritário"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-blue mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className="btn-primary w-full">Começar Grátis</button>
              </div>
            </div>

            {/* Plano Enterprise */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Plano Enterprise</h3>
                <p className="text-gray-600 mb-4">Para redes de oficinas e negócios maiores</p>
                <div className="flex items-end mb-6">
                  <span className="text-4xl font-bold">R$349</span>
                  <span className="text-gray-500 ml-2">/mês</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {[
                    "Usuários ilimitados",
                    "Múltiplas filiais",
                    "Todas as funcionalidades do Profissional",
                    "API para integrações personalizadas",
                    "Painel gerencial consolidado",
                    "Diagnóstico com IA avançado",
                    "Personalização de marca",
                    "Gestão de fornecedores",
                    "Suporte 24/7 prioritário",
                    "Consultoria de implementação"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-blue mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className="btn-outline w-full">Falar com Consultor</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">O que dizem nossos parceiros</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Oficinas mecânicas que transformaram seus negócios com o Instauto
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Carlos Oliveira",
                business: "Auto Center Oliveira",
                location: "São Paulo, SP",
                review: "Desde que implementamos o Instauto, aumentamos nosso faturamento em 30%. A gestão ficou muito mais simples e os clientes adoram receber atualizações pelo WhatsApp."
              },
              {
                name: "Maria Santos",
                business: "Mecânica Express",
                location: "Rio de Janeiro, RJ",
                review: "O controle financeiro e de estoque é sensacional. Consigo saber exatamente a lucratividade por serviço e nunca mais perdi peças no estoque."
              },
              {
                name: "Pedro Almeida",
                business: "Oficina do Pedro",
                location: "Belo Horizonte, MG",
                review: "Os novos clientes que chegam pela plataforma já representam 25% do nosso faturamento. O investimento se pagou no primeiro mês."
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-gray-100 p-6 rounded-lg">
                <div className="flex items-center space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} className="h-5 w-5 text-yellow" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">&quot;{testimonial.review}&quot;</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-300 mr-3" />
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.business}</p>
                    <p className="text-xs text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perguntas Frequentes */}
      <section className="py-20 bg-gray-100">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Perguntas Frequentes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tire suas dúvidas sobre o Instauto para oficinas
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "Como funciona o período de teste gratuito?",
                answer: "Você tem acesso a todas as funcionalidades do plano Profissional por 14 dias, sem a necessidade de cartão de crédito. Após esse período, você pode escolher um plano ou continuar usando recursos básicos gratuitamente."
              },
              {
                question: "Preciso ter conhecimento técnico para usar o sistema?",
                answer: "Não! O Instauto foi desenvolvido pensando na facilidade de uso. Nossa interface é intuitiva e oferecemos treinamento gratuito durante a implementação. Além disso, temos tutoriais em vídeo e suporte disponível."
              },
              {
                question: "Como os clientes encontram minha oficina através do Instauto?",
                answer: "Quando um motorista busca serviços na plataforma, as oficinas próximas a ele aparecem nos resultados. Quanto melhor sua avaliação e quanto mais completo seu perfil, mais chances de ser escolhido. Também oferecemos destaque para oficinas parceiras em planos mais avançados."
              },
              {
                question: "O sistema funciona em dispositivos móveis?",
                answer: "Sim! O Instauto é 100% responsivo e funciona em qualquer dispositivo com acesso à internet. Além disso, temos aplicativos dedicados para Android e iOS para facilitar ainda mais o acesso."
              },
              {
                question: "Posso migrar meus dados de outro sistema para o Instauto?",
                answer: "Sim, oferecemos suporte para migração de dados. Nossa equipe pode ajudar a importar sua base de clientes, histórico de serviços e outros dados importantes para o Instauto. Esse serviço está incluso nos planos Profissional e Enterprise."
              },
              {
                question: "Quais são as formas de pagamento aceitas?",
                answer: "Aceitamos cartão de crédito, boleto bancário e PIX para pagamentos mensais ou anuais. Planos anuais têm desconto de 20% sobre o valor mensal."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold">{faq.question}</h3>
                  <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                </div>
                <p className="text-gray-600 mt-2">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/faq" className="text-blue font-medium inline-flex items-center">
              Ver todas as perguntas
              <ChevronRightIcon className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Diagnóstico IA */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="bg-yellow text-gray-900 px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
                Exclusivo
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Diagnóstico com IA para sua oficina
              </h2>
              <p className="text-gray-600 mb-6">
                O Instauto possui um assistente de inteligência artificial que ajuda a identificar problemas em veículos a partir de sintomas ou códigos de erro. Economize tempo e aumente a precisão dos seus diagnósticos.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Base de dados com +10.000 problemas mecânicos",
                  "Sugestões de peças e serviços necessários",
                  "Atualização constante com novos casos",
                  "Integração com escaneadores OBD"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-blue mr-2 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/ia-diagnostico" className="btn-primary inline-flex items-center">
                Saiba mais
                <ChevronRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="bg-gray-100 rounded-lg h-[400px] flex items-center justify-center">
              {/* Imagem placeholder para AI */}
              <div className="bg-white rounded-lg shadow-lg p-6 w-[80%] mx-auto">
                <div className="flex items-start mb-4">
                  <div className="bg-blue-light p-2 rounded-full mr-3">
                    <CogIcon className="h-6 w-6 text-blue" />
                  </div>
                  <div>
                    <p className="font-bold">Assistente Instauto</p>
                    <p className="text-sm text-gray-600">Com base nos sintomas e no código de erro P0420, o problema mais provável é o catalisador com eficiência reduzida. Recomendo verificar:</p>
                    <ul className="mt-2 text-sm space-y-1">
                      <li>• Estado do catalisador</li>
                      <li>• Sensores de oxigênio</li>
                      <li>• Vazamentos no sistema de escape</li>
                    </ul>
                    <p className="text-sm text-gray-600 mt-2">Peças potencialmente necessárias: catalisador, sensores de oxigênio.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-blue">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 pattern-stripes"></div>
        </div>
        <div className="container-custom text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para transformar sua oficina?
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Junte-se a milhares de oficinas que já estão economizando tempo, reduzindo custos e aumentando seus lucros com o Instauto.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cadastro" className="btn-secondary">
              Começar Teste Grátis
            </Link>
            <Link href="#planos" className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-medium py-3 px-6 rounded-md transition-all duration-300">
              Ver Demonstração
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Instauto</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Sobre nós</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Carreiras</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Para Motoristas</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Como funciona</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Encontrar oficinas</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Serviços</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Perguntas frequentes</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Para Oficinas</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Registrar oficina</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Sistema ERP</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Planos e preços</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Suporte</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Termos de uso</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Política de privacidade</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Instauto. Todos os direitos reservados.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 