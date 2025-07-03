import InstitutionalLayout from '@/components/InstitutionalLayout';

export default function CookiesPage() {
  return (
    <InstitutionalLayout 
      title="Política de Cookies" 
      description="Como utilizamos cookies e tecnologias similares"
    >
      <div className="prose prose-lg max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">O que são Cookies?</h2>
          <p className="text-gray-600 leading-relaxed">
            Cookies são pequenos arquivos de texto armazenados em seu dispositivo quando você visita nosso site. 
            Eles nos ajudam a melhorar sua experiência, lembrar suas preferências e entender como você usa nossa plataforma.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tipos de Cookies que Utilizamos</h2>
          
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">🔒 Cookies Essenciais</h3>
              <p className="text-gray-600 mb-2">
                Necessários para o funcionamento básico do site. Sem eles, recursos essenciais não funcionarão.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Autenticação e login seguro</li>
                <li>• Manutenção da sessão do usuário</li>
                <li>• Preferências de privacidade</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">📊 Cookies de Análise</h3>
              <p className="text-gray-600 mb-2">
                Nos ajudam a entender como os visitantes interagem com nosso site.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Google Analytics</li>
                <li>• Métricas de desempenho</li>
                <li>• Análise de comportamento do usuário</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">🎯 Cookies de Funcionalidade</h3>
              <p className="text-gray-600 mb-2">
                Permitem recursos aprimorados e personalização.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Idioma e região preferidos</li>
                <li>• Preferências de exibição</li>
                <li>• Histórico de pesquisas recentes</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">📢 Cookies de Marketing</h3>
              <p className="text-gray-600 mb-2">
                Usados para exibir anúncios relevantes para você.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Facebook Pixel</li>
                <li>• Google Ads</li>
                <li>• Remarketing</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies de Terceiros</h2>
          <p className="text-gray-600 mb-4">
            Alguns de nossos parceiros podem definir cookies em nosso site:
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Provedor</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Finalidade</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Duração</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-600">Google Analytics</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Análise de tráfego</td>
                  <td className="px-6 py-4 text-sm text-gray-600">2 anos</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-600">Facebook</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Login social</td>
                  <td className="px-6 py-4 text-sm text-gray-600">90 dias</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-600">MercadoPago</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Processamento de pagamentos</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Sessão</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Gerenciar Cookies</h2>
          <p className="text-gray-600 mb-6">
            Você tem controle total sobre os cookies em seu dispositivo:
          </p>
          
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-gray-900">Configurações do Navegador</h3>
              <p className="text-gray-600 text-sm mt-1">
                A maioria dos navegadores permite bloquear ou deletar cookies. Consulte a documentação do seu navegador:
              </p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>• <a href="https://support.google.com/chrome/answer/95647" className="text-[#0047CC] hover:underline" target="_blank" rel="noopener noreferrer">Chrome</a></li>
                <li>• <a href="https://support.mozilla.org/kb/enable-and-disable-cookies-website-preferences" className="text-[#0047CC] hover:underline" target="_blank" rel="noopener noreferrer">Firefox</a></li>
                <li>• <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" className="text-[#0047CC] hover:underline" target="_blank" rel="noopener noreferrer">Safari</a></li>
                <li>• <a href="https://support.microsoft.com/windows/manage-cookies-in-microsoft-edge" className="text-[#0047CC] hover:underline" target="_blank" rel="noopener noreferrer">Edge</a></li>
              </ul>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-gray-900">Preferências de Cookies</h3>
              <p className="text-gray-600 text-sm mt-1">
                Você pode ajustar suas preferências de cookies a qualquer momento clicando no botão &quot;Configurações de Cookies&quot; no rodapé do site.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-gray-900">Opt-Out de Analytics</h3>
              <p className="text-gray-600 text-sm mt-1">
                Para desativar o Google Analytics, instale o <a href="https://tools.google.com/dlpage/gaoptout" className="text-[#0047CC] hover:underline" target="_blank" rel="noopener noreferrer">complemento de desativação</a>.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Consequências de Desabilitar Cookies</h2>
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <p className="text-yellow-800 mb-3">
              ⚠️ <strong>Atenção:</strong> Desabilitar cookies pode afetar sua experiência:
            </p>
            <ul className="text-yellow-700 space-y-1 text-sm">
              <li>• Você precisará fazer login novamente a cada visita</li>
              <li>• Suas preferências não serão salvas</li>
              <li>• Alguns recursos podem não funcionar corretamente</li>
              <li>• A navegação pode ser menos personalizada</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tecnologias Similares</h2>
          <p className="text-gray-600 mb-4">
            Além de cookies, também usamos:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li><strong>Local Storage:</strong> Para armazenar preferências localmente</li>
            <li><strong>Session Storage:</strong> Para dados temporários durante sua visita</li>
            <li><strong>Pixels de rastreamento:</strong> Para análise de conversões</li>
            <li><strong>Web beacons:</strong> Para verificar se emails foram abertos</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Atualizações desta Política</h2>
          <p className="text-gray-600">
            Esta política pode ser atualizada periodicamente. Notificaremos sobre mudanças significativas 
            através de um aviso em nosso site. A data da última atualização sempre estará visível no topo desta página.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contato</h2>
          <p className="text-gray-600 mb-4">
            Para dúvidas sobre nossa política de cookies:
          </p>
          <div className="bg-gray-100 p-6 rounded-lg">
            <p className="text-gray-700">
              <strong>Email:</strong> cookies@instauto.com.br<br />
              <strong>Telefone:</strong> 0800 123 4567<br />
              <strong>Endereço:</strong> Av. Paulista, 1000 - São Paulo, SP
            </p>
          </div>
        </section>

        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-center">
            Ao continuar navegando em nosso site, você concorda com o uso de cookies conforme descrito nesta política.
          </p>
        </div>
      </div>
    </InstitutionalLayout>
  );
}
