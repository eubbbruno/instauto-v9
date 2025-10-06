import InstitutionalLayout from '@/components/InstitutionalLayout'

export default function PrivacidadePage() {
  return (
    <InstitutionalLayout 
      title="Proteção de Dados"
      description="Como protegemos seus dados pessoais e garantimos sua privacidade na InstaAuto"
    >
      <div className="prose prose-lg max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Compromisso com a Privacidade</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            A <strong>InstaAuto</strong> está comprometida em proteger sua privacidade e dados pessoais. 
            Esta página detalha nossas práticas específicas de proteção de dados e como garantimos 
            que suas informações estejam sempre seguras.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Princípios de Proteção</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">🔒 Segurança por Design</h3>
              <p className="text-blue-800 text-sm">
                Implementamos medidas de segurança desde o desenvolvimento, garantindo proteção em todas as camadas.
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-3">🎯 Minimização de Dados</h3>
              <p className="text-green-800 text-sm">
                Coletamos apenas os dados estritamente necessários para fornecer nossos serviços.
              </p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">⚡ Transparência Total</h3>
              <p className="text-purple-800 text-sm">
                Você sempre saberá quais dados coletamos, como usamos e por quanto tempo mantemos.
              </p>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-orange-900 mb-3">👤 Controle do Usuário</h3>
              <p className="text-orange-800 text-sm">
                Você tem controle total sobre seus dados, podendo acessar, corrigir ou excluir a qualquer momento.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Medidas de Segurança Técnica</h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="bg-blue-100 p-1 rounded">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Criptografia End-to-End</h3>
                <p className="text-gray-600 text-sm">Todos os dados são criptografados durante transmissão e armazenamento</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-green-100 p-1 rounded">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Autenticação Multifator</h3>
                <p className="text-gray-600 text-sm">Camadas adicionais de segurança para proteger sua conta</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-purple-100 p-1 rounded">
                <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Monitoramento 24/7</h3>
                <p className="text-gray-600 text-sm">Sistemas de detecção de anomalias e resposta a incidentes</p>
              </div>
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Conformidade Legal</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-700 leading-relaxed mb-4">
              Estamos em total conformidade com:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>LGPD</strong> - Lei Geral de Proteção de Dados Pessoais (Brasil)</li>
              <li><strong>Marco Civil da Internet</strong> - Lei 12.965/2014</li>
              <li><strong>Código de Defesa do Consumidor</strong> - Lei 8.078/1990</li>
              <li><strong>ISO 27001</strong> - Padrões internacionais de segurança da informação</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Exercer Seus Direitos</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Para exercer qualquer um dos seus direitos de proteção de dados, entre em contato conosco:
          </p>
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">📧 Email do DPO</h4>
                <p className="text-blue-800">dpo@instauto.com.br</p>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">📞 Telefone</h4>
                <p className="text-blue-800">(11) 4000-0000</p>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">⏱️ Prazo de Resposta</h4>
                <p className="text-blue-800">Até 15 dias úteis</p>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">🆔 Identificação</h4>
                <p className="text-blue-800">Documento necessário</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">🛡️ Compromisso Contínuo</h3>
          <p className="text-blue-800 text-sm">
            A proteção dos seus dados é uma responsabilidade que levamos muito a sério. 
            Continuamos investindo em tecnologia e processos para garantir o mais alto nível de segurança.
          </p>
        </div>
      </div>
    </InstitutionalLayout>
  )
}