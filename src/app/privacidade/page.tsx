import InstitutionalLayout from '@/components/InstitutionalLayout';

export default function PrivacidadePage() {
  return (
    <InstitutionalLayout 
      title="Proteção de Dados" 
      description="Como protegemos seus dados pessoais de acordo com a LGPD"
    >
      <div className="prose prose-lg max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Nosso Compromisso com sua Privacidade</h2>
          <p className="text-gray-600 leading-relaxed">
            No Instauto, levamos a proteção de dados muito a sério. Implementamos as melhores práticas de segurança e privacidade para garantir que suas informações pessoais estejam sempre protegidas, em conformidade com a Lei Geral de Proteção de Dados (LGPD).
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Princípios de Proteção de Dados</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Transparência</h3>
              <p className="text-gray-600">
                Somos transparentes sobre como coletamos, usamos e protegemos seus dados. Todas as nossas práticas estão documentadas e disponíveis para consulta.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Minimização de Dados</h3>
              <p className="text-gray-600">
                Coletamos apenas os dados estritamente necessários para fornecer nossos serviços. Não solicitamos informações desnecessárias ou excessivas.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Consentimento</h3>
              <p className="text-gray-600">
                Sempre solicitamos seu consentimento explícito antes de coletar ou processar dados pessoais sensíveis.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">4. Segurança</h3>
              <p className="text-gray-600">
                Utilizamos criptografia de ponta a ponta e outras medidas de segurança para proteger seus dados contra acesso não autorizado.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Medidas de Segurança Implementadas</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Criptografia SSL/TLS em todas as comunicações</li>
            <li>Autenticação de dois fatores (2FA) disponível</li>
            <li>Backups regulares e criptografados</li>
            <li>Monitoramento 24/7 de atividades suspeitas</li>
            <li>Controle de acesso baseado em funções (RBAC)</li>
            <li>Auditorias regulares de segurança</li>
            <li>Treinamento contínuo da equipe em LGPD</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Seus Direitos sob a LGPD</h2>
          <div className="bg-blue-50 p-6 rounded-lg">
            <p className="text-gray-700 mb-4">
              Como titular dos dados, você tem direitos garantidos pela LGPD:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span className="text-gray-700"><strong>Confirmação e Acesso:</strong> Saber se processamos seus dados e acessá-los</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span className="text-gray-700"><strong>Correção:</strong> Solicitar correção de dados incorretos</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span className="text-gray-700"><strong>Exclusão:</strong> Pedir a exclusão de seus dados</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span className="text-gray-700"><strong>Portabilidade:</strong> Transferir seus dados para outro serviço</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span className="text-gray-700"><strong>Revogação:</strong> Retirar seu consentimento a qualquer momento</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Exercer seus Direitos</h2>
          <p className="text-gray-600 mb-4">
            Para exercer qualquer um dos seus direitos relacionados à proteção de dados:
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-gray-600">
            <li>Acesse sua conta e vá até &quot;Configurações de Privacidade&quot;</li>
            <li>Ou envie um email para: <a href="mailto:privacidade@instauto.com.br" className="text-[#0047CC] hover:underline">privacidade@instauto.com.br</a></li>
            <li>Inclua seu nome completo e o direito que deseja exercer</li>
            <li>Responderemos em até 15 dias úteis</li>
          </ol>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Encarregado de Proteção de Dados (DPO)</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <p className="text-gray-700 mb-2">
              Nosso Encarregado de Proteção de Dados está disponível para esclarecer dúvidas:
            </p>
            <p className="text-gray-700">
              <strong>Nome:</strong> João Silva<br />
              <strong>Email:</strong> dpo@instauto.com.br<br />
              <strong>Telefone:</strong> 0800 123 4568
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Relatório de Transparência</h2>
          <p className="text-gray-600 mb-4">
            Publicamos relatórios semestrais sobre solicitações de dados e nossa resposta a elas, mantendo total transparência sobre nossas práticas.
          </p>
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              Último relatório: Janeiro 2025<br />
              Próximo relatório: Julho 2025
            </p>
          </div>
        </section>

        <div className="mt-12 p-6 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium mb-2">
            🛡️ Certificações e Conformidade
          </p>
          <p className="text-green-700 text-sm">
            Estamos em processo de certificação ISO 27001 e seguimos rigorosamente todas as diretrizes da LGPD e regulamentações internacionais de proteção de dados.
          </p>
        </div>
      </div>
    </InstitutionalLayout>
  );
}
