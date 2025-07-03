import InstitutionalLayout from '@/components/InstitutionalLayout';

export default function TermosPage() {
  return (
    <InstitutionalLayout 
      title="Termos de Uso" 
      description="Última atualização: Janeiro de 2025"
    >
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Cadastro e Conta</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              <strong>3.1.</strong> Para utilizar determinados recursos da plataforma, você deve criar uma conta fornecendo informações precisas e completas.
            </p>
            <p>
              <strong>3.2.</strong> Você é responsável por manter a confidencialidade de sua senha e conta.
            </p>
            <p>
              <strong>3.3.</strong> Você concorda em notificar imediatamente o Instauto sobre qualquer uso não autorizado de sua conta.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Uso da Plataforma</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              <strong>4.1. Usos Permitidos:</strong> Você pode usar a plataforma para buscar oficinas, agendar serviços, comunicar-se com prestadores e gerenciar seu histórico automotivo.
            </p>
            <p>
              <strong>4.2. Usos Proibidos:</strong> É vedado usar a plataforma para:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Atividades ilegais ou fraudulentas</li>
              <li>Enviar spam ou conteúdo malicioso</li>
              <li>Violar direitos de propriedade intelectual</li>
              <li>Tentar acessar áreas restritas do sistema</li>
              <li>Prejudicar o funcionamento da plataforma</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Responsabilidades</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              <strong>5.1. Do Instauto:</strong> Fornecemos a plataforma tecnológica que facilita a conexão entre motoristas e oficinas, mas não somos responsáveis pela qualidade dos serviços prestados pelas oficinas.
            </p>
            <p>
              <strong>5.2. Do Usuário:</strong> Você é responsável por todas as atividades realizadas em sua conta e pela veracidade das informações fornecidas.
            </p>
            <p>
              <strong>5.3. Das Oficinas:</strong> As oficinas são responsáveis pela qualidade, segurança e legalidade dos serviços prestados.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Pagamentos e Taxas</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              <strong>6.1.</strong> Alguns serviços podem estar sujeitos a taxas, que serão claramente informadas antes da confirmação.
            </p>
            <p>
              <strong>6.2.</strong> Os pagamentos são processados através de parceiros seguros (como MercadoPago).
            </p>
            <p>
              <strong>6.3.</strong> Políticas de cancelamento e reembolso estão detalhadas em cada transação.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Propriedade Intelectual</h2>
          <p className="text-gray-600 leading-relaxed">
            Todo o conteúdo da plataforma, incluindo textos, gráficos, logos, ícones, imagens e software, é propriedade do Instauto ou de seus licenciadores e está protegido por leis de direitos autorais.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Privacidade</h2>
          <p className="text-gray-600 leading-relaxed">
            O uso de seus dados pessoais é regido por nossa <a href="/politicas" className="text-[#0047CC] hover:underline">Política de Privacidade</a>, que faz parte integrante destes Termos de Uso.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Modificações dos Termos</h2>
          <p className="text-gray-600 leading-relaxed">
            Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação na plataforma. O uso continuado após as modificações constitui aceitação dos novos termos.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Limitação de Responsabilidade</h2>
          <p className="text-gray-600 leading-relaxed">
            O Instauto não será responsável por danos indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo perda de lucros, dados ou outras perdas intangíveis.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Rescisão</h2>
          <p className="text-gray-600 leading-relaxed">
            Podemos suspender ou encerrar sua conta imediatamente, sem aviso prévio, por violação destes termos ou por qualquer outro motivo que julgarmos apropriado.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Lei Aplicável</h2>
          <p className="text-gray-600 leading-relaxed">
            Estes termos serão regidos e interpretados de acordo com as leis do Brasil, independentemente de conflitos de disposições legais.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contato</h2>
          <p className="text-gray-600 leading-relaxed">
            Para questões sobre estes Termos de Uso, entre em contato conosco:
          </p>
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <p className="text-gray-700">
              <strong>Email:</strong> legal@instauto.com.br<br />
              <strong>Telefone:</strong> 0800 123 4567<br />
              <strong>Endereço:</strong> Av. Paulista, 1000 - São Paulo, SP
            </p>
          </div>
        </section>

        <div className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            Ao utilizar o Instauto, você declara ter lido, compreendido e concordado com todos os termos aqui estabelecidos.
          </p>
        </div>
      </div>
    </InstitutionalLayout>
  );
} 