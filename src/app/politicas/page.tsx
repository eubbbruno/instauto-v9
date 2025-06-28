import Link from 'next/link'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'

export default function PoliticasPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5 mr-2" />
            Voltar para início
          </Link>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Política de Privacidade
            </h1>
            <p className="text-lg text-gray-600">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Informações Gerais</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                A <strong>Instauto</strong> (&quot;nós&quot;, &quot;nossa&quot; ou &quot;nosso&quot;) se compromete a proteger sua privacidade. 
                Esta Política de Privacidade descreve como coletamos, usamos, processamos e protegemos suas 
                informações pessoais quando você utiliza nossa plataforma de conectar motoristas e oficinas mecânicas.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Ao utilizar nossos serviços, você concorda com a coleta e uso de informações de acordo com esta política.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Informações que Coletamos</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">2.1 Informações Pessoais</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Nome completo e informações de contato (email, telefone)</li>
                <li>Documentos (CPF para motoristas, CNPJ para oficinas)</li>
                <li>Informações de localização para encontrar oficinas próximas</li>
                <li>Dados de veículos (marca, modelo, ano, placa)</li>
                <li>Histórico de serviços e avaliações</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">2.2 Informações Técnicas</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Endereço IP e informações do dispositivo</li>
                <li>Tipo de navegador e sistema operacional</li>
                <li>Dados de uso da plataforma</li>
                <li>Cookies e tecnologias similares</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Como Usamos suas Informações</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Facilitar a conexão entre motoristas e oficinas</li>
                <li>Processar agendamentos e pagamentos</li>
                <li>Personalizar sua experiência na plataforma</li>
                <li>Enviar notificações importantes sobre seus serviços</li>
                <li>Melhorar nossos serviços e desenvolver novos recursos</li>
                <li>Garantir a segurança e prevenir fraudes</li>
                <li>Cumprir obrigações legais e regulamentares</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Compartilhamento de Informações</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Não vendemos, trocamos ou transferimos suas informações pessoais para terceiros, exceto nas seguintes situações:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Com oficinas parceiras:</strong> Para facilitar agendamentos e prestação de serviços</li>
                <li><strong>Provedores de serviço:</strong> Empresas que nos ajudam a operar a plataforma (hospedagem, pagamentos, analytics)</li>
                <li><strong>Conformidade legal:</strong> Quando exigido por lei ou processo legal</li>
                <li><strong>Proteção de direitos:</strong> Para proteger nossos direitos, propriedade ou segurança</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Segurança dos Dados</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Criptografia de dados em trânsito e em repouso</li>
                <li>Controles de acesso rigorosos</li>
                <li>Monitoramento contínuo de segurança</li>
                <li>Auditorias regulares de segurança</li>
                <li>Treinamento de equipe em proteção de dados</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Seus Direitos</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem os seguintes direitos:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Acesso:</strong> Solicitar informações sobre seus dados pessoais</li>
                <li><strong>Correção:</strong> Corrigir dados incompletos, inexatos ou desatualizados</li>
                <li><strong>Exclusão:</strong> Solicitar a eliminação de dados pessoais</li>
                <li><strong>Portabilidade:</strong> Solicitar a transferência de dados para outro fornecedor</li>
                <li><strong>Oposição:</strong> Opor-se ao tratamento de dados pessoais</li>
                <li><strong>Revogação:</strong> Revogar consentimento a qualquer momento</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Cookies</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Utilizamos cookies e tecnologias similares para:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Manter você conectado à plataforma</li>
                <li>Lembrar suas preferências</li>
                <li>Analisar o uso da plataforma</li>
                <li>Personalizar conteúdo e anúncios</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Você pode controlar cookies através das configurações do seu navegador.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Retenção de Dados</h2>
              <p className="text-gray-700 leading-relaxed">
                Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir as finalidades 
                descritas nesta política, atender requisitos legais ou resolver disputas. Dados de transações 
                podem ser mantidos por períodos mais longos conforme exigido por lei.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">9. Alterações nesta Política</h2>
              <p className="text-gray-700 leading-relaxed">
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre alterações 
                significativas através da plataforma ou por email. A data da última atualização será sempre 
                indicada no topo desta página.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">10. Contato</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Se você tiver dúvidas sobre esta Política de Privacidade ou quiser exercer seus direitos, 
                entre em contato conosco:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Email:</strong> privacidade@instauto.com.br</p>
                <p className="text-gray-700 mb-2"><strong>Telefone:</strong> (11) 4000-0000</p>
                <p className="text-gray-700"><strong>Endereço:</strong> São Paulo/SP - Brasil</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
} 