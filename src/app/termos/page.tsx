import Link from 'next/link'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'

export default function TermosPage() {
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
              Termos de Uso
            </h1>
            <p className="text-lg text-gray-600">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Aceitação dos Termos</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Bem-vindo ao <strong>Instauto</strong>! Estes Termos de Uso regulam o uso de nossa plataforma 
                que conecta motoristas e oficinas mecânicas. Ao acessar ou usar nossos serviços, você concorda 
                em cumprir estes termos.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Se você não concorda com qualquer parte destes termos, não deve usar nossa plataforma.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Definições</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>&quot;Plataforma&quot;</strong>: O site e aplicativo Instauto</li>
                <li><strong>&quot;Usuário&quot;</strong>: Qualquer pessoa que acesse ou use a plataforma</li>
                <li><strong>&quot;Motorista&quot;</strong>: Usuário que procura serviços automotivos</li>
                <li><strong>&quot;Oficina&quot;</strong>: Prestador de serviços automotivos cadastrado</li>
                <li><strong>&quot;Serviços&quot;</strong>: Funcionalidades oferecidas pela plataforma</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Elegibilidade</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Para usar nossa plataforma, você deve:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Ter pelo menos 18 anos de idade</li>
                <li>Fornecer informações verdadeiras e atualizadas</li>
                <li>Ter capacidade legal para celebrar contratos</li>
                <li>Não estar suspenso ou banido da plataforma</li>
                <li>Cumprir todas as leis aplicáveis</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Cadastro e Conta</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">4.1 Responsabilidades do Usuário</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Manter informações de conta atualizadas e precisas</li>
                <li>Proteger credenciais de acesso</li>
                <li>Notificar imediatamente sobre uso não autorizado</li>
                <li>Ser responsável por todas as atividades em sua conta</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">4.2 Verificação</h3>
              <p className="text-gray-700 leading-relaxed">
                Reservamo-nos o direito de verificar informações fornecidas e solicitar documentos 
                adicionais quando necessário para garantir a segurança da plataforma.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Uso da Plataforma</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">5.1 Uso Permitido</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Encontrar e agendar serviços automotivos</li>
                <li>Gerenciar veículos e histórico de manutenções</li>
                <li>Comunicar-se com oficinas através da plataforma</li>
                <li>Avaliar e comentar sobre serviços recebidos</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">5.2 Uso Proibido</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Fornecer informações falsas ou enganosas</li>
                <li>Usar a plataforma para atividades ilegais</li>
                <li>Interferir no funcionamento da plataforma</li>
                <li>Tentar acessar contas de outros usuários</li>
                <li>Spam, assédio ou comportamento abusivo</li>
                <li>Violar direitos de propriedade intelectual</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Pagamentos e Tarifas</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">6.1 Para Motoristas</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                O uso básico da plataforma é gratuito para motoristas. Alguns serviços premium 
                podem estar sujeitos a taxas que serão claramente informadas.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">6.2 Para Oficinas</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Oficinas podem escolher entre planos gratuitos (com limitações) ou pagos. 
                As taxas são cobradas conforme o plano selecionado.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">6.3 Processamento de Pagamentos</h3>
              <p className="text-gray-700 leading-relaxed">
                Utilizamos processadores terceirizados para pagamentos. Ao fazer um pagamento, 
                você concorda com os termos do processador de pagamento.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Relacionamento com Oficinas</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>IMPORTANTE:</strong> O Instauto atua apenas como intermediário, facilitando 
                a conexão entre motoristas e oficinas. Não somos responsáveis por:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Qualidade dos serviços prestados pelas oficinas</li>
                <li>Disputas entre motoristas e oficinas</li>
                <li>Danos ou prejuízos resultantes dos serviços</li>
                <li>Cumprimento de garantias oferecidas pelas oficinas</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Propriedade Intelectual</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Todo conteúdo da plataforma (textos, imagens, logos, software) é protegido por 
                direitos autorais e outras leis de propriedade intelectual.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Você pode usar o conteúdo apenas para fins pessoais e não comerciais, conforme 
                permitido por estes termos.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">9. Limitação de Responsabilidade</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                A plataforma é fornecida &quot;como está&quot;. Na máxima extensão permitida por lei, 
                não garantimos que a plataforma será:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Livre de erros ou interrupções</li>
                <li>Segura contra acesso não autorizado</li>
                <li>Compatível com todos os dispositivos</li>
                <li>Disponível 24/7 sem manutenção</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Nossa responsabilidade total não excederá o valor pago por você nos últimos 12 meses.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">10. Suspensão e Encerramento</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Podemos suspender ou encerrar sua conta a qualquer momento se:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Violar estes termos de uso</li>
                <li>Fornecer informações falsas</li>
                <li>Usar a plataforma de forma inadequada</li>
                <li>Não pagar taxas devidas</li>
                <li>Por motivos de segurança</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">11. Lei Aplicável</h2>
              <p className="text-gray-700 leading-relaxed">
                Estes termos são regidos pelas leis brasileiras. Disputas serão resolvidas 
                nos tribunais de São Paulo/SP, salvo quando a lei exigir foro diferente.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">12. Alterações dos Termos</h2>
              <p className="text-gray-700 leading-relaxed">
                Podemos modificar estes termos a qualquer momento. Alterações significativas 
                serão notificadas com 30 dias de antecedência. O uso continuado da plataforma 
                após as alterações constitui aceitação dos novos termos.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">13. Contato</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Para questões sobre estes termos, entre em contato:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Email:</strong> juridico@instauto.com.br</p>
                <p className="text-gray-700 mb-2"><strong>Telefone:</strong> (11) 4000-0000</p>
                <p className="text-gray-700"><strong>Endereço:</strong> Avenida Paulista, 1000 - São Paulo/SP</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
} 