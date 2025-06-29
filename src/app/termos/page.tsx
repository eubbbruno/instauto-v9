import Link from 'next/link'

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
      {/* Header */}
      <div className="p-4">
        <Link href="/" className="inline-flex items-center text-blue-200 hover:text-white font-semibold transition-colors">
          ← Voltar para início
        </Link>
      </div>

      {/* Conteúdo */}
      <div className="flex items-center justify-center p-4">
        <div className="bg-yellow-400 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
          <div className="p-8 bg-white rounded-2xl m-4">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Termos de Serviço</h1>
              <p className="text-gray-600">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
            </div>

            <div className="prose max-w-none text-gray-800 space-y-6">
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">1. Aceite dos Termos</h2>
                <p>
                  Ao acessar e usar o Instauto (&quot;Plataforma&quot;), você concorda em ficar vinculado a estes 
                  Termos de Serviço e nossa Política de Privacidade. Se você não concordar com qualquer 
                  parte destes termos, não use nossa plataforma.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">2. Descrição do Serviço</h2>
                <p>
                  O Instauto é uma plataforma digital que conecta motoristas com oficinas mecânicas, 
                  facilitando o agendamento de serviços, orçamentos e acompanhamento de manutenções 
                  veiculares.
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Para Motoristas:</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Busca e comparação de oficinas</li>
                  <li>Solicitação de orçamentos</li>
                  <li>Agendamento de serviços</li>
                  <li>Histórico de manutenções</li>
                </ul>
                <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Para Oficinas:</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Gestão de clientes e agendamentos</li>
                  <li>Sistema de orçamentos</li>
                  <li>Dashboard de controle</li>
                  <li>Ferramentas de marketing</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">3. Registro e Conta de Usuário</h2>
                <p>
                  Para usar nossa plataforma, você deve criar uma conta fornecendo informações precisas, 
                  atuais e completas. Você é responsável por manter a confidencialidade de sua conta 
                  e senha.
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Requisitos:</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Ser maior de 18 anos</li>
                  <li>Fornecer informações verdadeiras</li>
                  <li>Manter dados atualizados</li>
                  <li>Não compartilhar credenciais</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">4. Responsabilidades</h2>
                <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Do Instauto:</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Manter a plataforma funcionando</li>
                  <li>Proteger dados dos usuários</li>
                  <li>Facilitar a comunicação entre as partes</li>
                  <li>Fornecer suporte técnico</li>
                </ul>
                <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Dos Usuários:</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Usar a plataforma de forma adequada</li>
                  <li>Fornecer informações verdadeiras</li>
                  <li>Respeitar outros usuários</li>
                  <li>Cumprir acordos feitos através da plataforma</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">5. Pagamentos e Taxas</h2>
                <p>
                  O Instauto pode cobrar taxas pelos serviços premium. Todas as taxas são claramente 
                  informadas antes da contratação. Os pagamentos são processados através de parceiros 
                  seguros como Mercado Pago.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">6. Privacidade e Dados</h2>
                <p>
                  Respeitamos sua privacidade. Nossa coleta e uso de dados pessoais está descrita 
                  em nossa Política de Privacidade, que faz parte integrante destes termos.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">7. Proibições</h2>
                <p>É proibido:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Usar a plataforma para atividades ilegais</li>
                  <li>Tentar hackear ou comprometer a segurança</li>
                  <li>Criar múltiplas contas falsas</li>
                  <li>Spam ou comportamento abusivo</li>
                  <li>Violar direitos de terceiros</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">8. Limitação de Responsabilidade</h2>
                <p>
                  O Instauto atua como intermediário. Não somos responsáveis pela qualidade dos 
                  serviços prestados pelas oficinas ou pelo comportamento dos usuários. Nossa 
                  responsabilidade limita-se ao funcionamento da plataforma.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">9. Modificações</h2>
                <p>
                  Reservamos o direito de modificar estes termos a qualquer momento. Mudanças 
                  significativas serão comunicadas com antecedência de 30 dias.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">10. Contato</h2>
                <p>
                  Para dúvidas sobre estes termos, entre em contato conosco:
                </p>
                <ul className="list-none space-y-1">
                  <li><strong>Email:</strong> suporte@instauto.com.br</li>
                  <li><strong>Telefone:</strong> (11) 99999-9999</li>
                  <li><strong>Endereço:</strong> São Paulo, SP</li>
                </ul>
              </section>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Estes termos são válidos a partir de {new Date().toLocaleDateString('pt-BR')} e 
                substituem todos os acordos anteriores.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 