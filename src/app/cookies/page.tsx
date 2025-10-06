import InstitutionalLayout from '@/components/InstitutionalLayout'

export default function CookiesPage() {
  return (
    <InstitutionalLayout 
      title="Política de Cookies"
      description="Como utilizamos cookies e tecnologias similares para melhorar sua experiência na InstaAuto"
    >
      <div className="prose prose-lg max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">O que são Cookies?</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Cookies são pequenos arquivos de texto que são armazenados no seu dispositivo quando você visita um site. 
            Eles nos ajudam a melhorar sua experiência, lembrando suas preferências e fornecendo funcionalidades personalizadas.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tipos de Cookies que Utilizamos</h2>
          
          <div className="space-y-6">
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-900 mb-3">🔧 Cookies Essenciais</h3>
              <p className="text-green-800 text-sm mb-3">
                Necessários para o funcionamento básico do site. Não podem ser desabilitados.
              </p>
              <ul className="list-disc list-inside text-green-700 text-sm space-y-1">
                <li>Autenticação de usuário</li>
                <li>Segurança da sessão</li>
                <li>Preferências de idioma</li>
                <li>Carrinho de compras</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">📊 Cookies de Performance</h3>
              <p className="text-blue-800 text-sm mb-3">
                Coletam informações sobre como você usa nosso site para melhorarmos a experiência.
              </p>
              <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                <li>Google Analytics</li>
                <li>Tempo de carregamento das páginas</li>
                <li>Páginas mais visitadas</li>
                <li>Erros de navegação</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">🎯 Cookies de Funcionalidade</h3>
              <p className="text-purple-800 text-sm mb-3">
                Permitem que o site lembre suas escolhas e forneça recursos aprimorados.
              </p>
              <ul className="list-disc list-inside text-purple-700 text-sm space-y-1">
                <li>Preferências de localização</li>
                <li>Configurações de interface</li>
                <li>Histórico de pesquisas</li>
                <li>Favoritos salvos</li>
              </ul>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-900 mb-3">📢 Cookies de Marketing</h3>
              <p className="text-orange-800 text-sm mb-3">
                Usados para fornecer anúncios mais relevantes para você e seus interesses.
              </p>
              <ul className="list-disc list-inside text-orange-700 text-sm space-y-1">
                <li>Facebook Pixel</li>
                <li>Google Ads</li>
                <li>Remarketing</li>
                <li>Análise de conversão</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cookies de Terceiros</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Alguns cookies são definidos por serviços de terceiros que aparecem em nossas páginas:
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">Serviço</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">Finalidade</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">Duração</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">Google Analytics</td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">Análise de tráfego e comportamento</td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">2 anos</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">Google Maps</td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">Funcionalidade de mapas</td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">Sessão</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">MercadoPago</td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">Processamento de pagamentos</td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">1 ano</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">Supabase</td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">Autenticação e banco de dados</td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">1 semana</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Como Controlar Cookies</h2>
          
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">🎛️ Configurações do Navegador</h3>
            <p className="text-blue-800 text-sm mb-4">
              Você pode controlar e/ou excluir cookies conforme desejar através das configurações do seu navegador:
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Chrome</h4>
                <p className="text-blue-700">Configurações → Privacidade e segurança → Cookies</p>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Firefox</h4>
                <p className="text-blue-700">Preferências → Privacidade e segurança</p>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Safari</h4>
                <p className="text-blue-700">Preferências → Privacidade</p>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Edge</h4>
                <p className="text-blue-700">Configurações → Cookies e permissões do site</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h3 className="text-lg font-semibold text-yellow-900 mb-3">⚠️ Importante</h3>
            <p className="text-yellow-800 text-sm">
              Desabilitar cookies pode afetar a funcionalidade do site. Alguns recursos podem não funcionar corretamente 
              se você optar por bloquear ou excluir cookies.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Opt-out de Cookies de Marketing</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Você pode optar por não receber cookies de marketing através dos seguintes links:
          </p>
          <ul className="space-y-2">
            <li>
              <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" 
                 className="text-blue-600 hover:text-blue-800 underline">
                Google Analytics Opt-out
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/settings?tab=ads" target="_blank" rel="noopener noreferrer"
                 className="text-blue-600 hover:text-blue-800 underline">
                Facebook Ads Preferences
              </a>
            </li>
            <li>
              <a href="http://optout.aboutads.info/" target="_blank" rel="noopener noreferrer"
                 className="text-blue-600 hover:text-blue-800 underline">
                Digital Advertising Alliance Opt-out
              </a>
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Atualizações desta Política</h2>
          <p className="text-gray-700 leading-relaxed">
            Podemos atualizar esta Política de Cookies periodicamente para refletir mudanças em nossas práticas 
            ou por outros motivos operacionais, legais ou regulamentares. Recomendamos que você revise esta 
            página regularmente para se manter informado sobre nosso uso de cookies.
          </p>
        </section>

        <div className="mt-12 p-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900 mb-3">🍪 Consentimento</h3>
          <p className="text-green-800 text-sm">
            Ao continuar a usar nosso site, você concorda com o uso de cookies conforme descrito nesta política. 
            Você pode alterar suas preferências de cookies a qualquer momento através das configurações do seu navegador.
          </p>
        </div>
      </div>
    </InstitutionalLayout>
  )
}