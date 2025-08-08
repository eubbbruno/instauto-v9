import InstitutionalLayout from '@/components/institutional/InstitutionalLayout'

export default function TermosPage() {
  return (
    <InstitutionalLayout>
      <div className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Termos de Uso</h1>
          <p className="text-gray-600 mb-8">Última atualização: Janeiro de 2025</p>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="prose prose-lg max-w-none">
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
                <p className="text-gray-600 leading-relaxed">
                  Ao acessar e usar a plataforma Instauto, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso. Se você não concordar com qualquer parte destes termos, não deverá usar nossa plataforma.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Descrição do Serviço</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  O Instauto é uma plataforma digital que conecta motoristas a oficinas mecânicas, facilitando:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Busca e localização de oficinas mecânicas</li>
                  <li>Agendamento de serviços automotivos</li>
                  <li>Comunicação entre motoristas e oficinas</li>
                  <li>Avaliação de serviços prestados</li>
                  <li>Gestão de histórico de manutenções</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Responsabilidades do Usuário</h2>
                <ul className="text-gray-600 mb-6 space-y-2">
                  <li>• Fornecer informações verdadeiras e atualizadas</li>
                  <li>• Manter a confidencialidade de suas credenciais de acesso</li>
                  <li>• Usar a plataforma de forma ética e legal</li>
                  <li>• Respeitar os direitos de outros usuários</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Responsabilidades da Plataforma</h2>
                <p className="text-gray-600 mb-6">
                  O Instauto se compromete a manter a plataforma funcionando adequadamente e proteger os dados dos usuários conforme nossa Política de Privacidade.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Limitações de Responsabilidade</h2>
                <p className="text-gray-600 mb-6">
                  A plataforma atua como intermediadora. A qualidade dos serviços prestados pelas oficinas é de responsabilidade exclusiva das mesmas.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Contato</h2>
                <p className="text-gray-600">
                  Para dúvidas sobre estes termos, entre em contato conosco através do e-mail: juridico@instauto.com.br
                </p>
              </section>

              <div className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  Ao utilizar o Instauto, você declara ter lido, compreendido e concordado com todos os termos aqui estabelecidos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </InstitutionalLayout>
  )
}