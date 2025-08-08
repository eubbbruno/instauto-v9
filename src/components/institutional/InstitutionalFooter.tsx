'use client'
import Link from 'next/link'
import Image from 'next/image'
import { 
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

export default function InstitutionalFooter() {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'Para Motoristas',
      links: [
        { name: 'Como Funciona', href: '/motoristas#como-funciona' },
        { name: 'Baixar App', href: '/motoristas#download' },
        { name: 'Buscar Oficinas', href: '/buscar-oficinas' },
        { name: 'Cobertura', href: '/cobertura' },
        { name: 'Preços', href: '/motoristas#precos' },
        { name: 'Central de Ajuda', href: '/ajuda/motoristas' }
      ]
    },
    {
      title: 'Para Oficinas',
      links: [
        { name: 'Planos e Preços', href: '/oficinas/planos' },
        { name: 'Como Funciona', href: '/oficinas#como-funciona' },
        { name: 'Recursos', href: '/oficinas#recursos' },
        { name: 'Casos de Sucesso', href: '/oficinas#cases' },
        { name: 'Cadastrar Oficina', href: '/criar-oficina' },
        { name: 'Suporte Técnico', href: '/ajuda/oficinas' }
      ]
    },
    {
      title: 'Empresa',
      links: [
        { name: 'Sobre Nós', href: '/sobre' },
        { name: 'Nossa Missão', href: '/missao' },
        { name: 'Trabalhe Conosco', href: '/carreiras' },
        { name: 'Imprensa', href: '/imprensa' },
        { name: 'Blog', href: '/blog' },
        { name: 'Investidores', href: '/investidores' }
      ]
    },
    {
      title: 'Suporte',
      links: [
        { name: 'Central de Ajuda', href: '/ajuda' },
        { name: 'Contato', href: '/contato' },
        { name: 'Status da Plataforma', href: '/status' },
        { name: 'Whatsapp', href: 'https://wa.me/5511999999999' },
        { name: 'Chat Online', href: '/chat' },
        { name: 'Demonstração', href: '/demonstracao' }
      ]
    }
  ]

  const socialLinks = [
    { name: 'Facebook', href: 'https://facebook.com/instauto', icon: '📘' },
    { name: 'Instagram', href: 'https://instagram.com/instauto', icon: '📷' },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/instauto', icon: '💼' },
    { name: 'YouTube', href: 'https://youtube.com/instauto', icon: '📺' },
    { name: 'Twitter', href: 'https://twitter.com/instauto', icon: '🐦' }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Image
                src="/images/logo.svg"
                alt="InstaAuto"
                width={40}
                height={40}
                className="w-10 h-10 filter brightness-0 invert"
              />
              <div>
                <h3 className="text-xl font-bold">InstaAuto</h3>
                <p className="text-sm text-gray-400">Conectando você à oficina ideal</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              A maior plataforma de serviços automotivos do Brasil. 
              Conectamos motoristas às melhores oficinas com transparência, 
              qualidade e preços justos.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <MapPinIcon className="h-4 w-4 text-blue-400" />
                <span>São Paulo, SP - Brasil</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <PhoneIcon className="h-4 w-4 text-blue-400" />
                <a href="tel:0800123456" className="hover:text-white transition-colors">
                  0800 123 456
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <EnvelopeIcon className="h-4 w-4 text-blue-400" />
                <a href="mailto:contato@instauto.com.br" className="hover:text-white transition-colors">
                  contato@instauto.com.br
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <ClockIcon className="h-4 w-4 text-blue-400" />
                <span>Atendimento 24h via app</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="lg:col-span-1">
              <h4 className="text-lg font-semibold mb-4 text-white">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-lg font-semibold mb-2">Fique por dentro das novidades</h4>
              <p className="text-gray-300 text-sm">
                Receba dicas de manutenção, promoções exclusivas e novidades da plataforma.
              </p>
            </div>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              />
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap">
                Inscrever
              </button>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-sm font-semibold mb-3 text-center sm:text-left">Nos siga nas redes sociais</h4>
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors text-lg"
                    title={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* App Download Buttons */}
            <div>
              <h4 className="text-sm font-semibold mb-3 text-center">Baixe nosso app</h4>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="bg-gray-800 hover:bg-gray-700 transition-colors rounded-lg px-4 py-2 flex items-center gap-2"
                >
                  <span className="text-lg">🍎</span>
                  <div className="text-left">
                    <div className="text-xs text-gray-400">Baixar na</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </a>
                <a
                  href="#"
                  className="bg-gray-800 hover:bg-gray-700 transition-colors rounded-lg px-4 py-2 flex items-center gap-2"
                >
                  <span className="text-lg">🤖</span>
                  <div className="text-left">
                    <div className="text-xs text-gray-400">Baixar no</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-400">
              © {currentYear} InstaAuto. Todos os direitos reservados.
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link href="/termos" className="hover:text-white transition-colors">
                Termos de Uso
              </Link>
              <Link href="/privacidade" className="hover:text-white transition-colors">
                Política de Privacidade
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Cookies
              </Link>
              <Link href="/politicas" className="hover:text-white transition-colors">
                Políticas
              </Link>
            </div>
          </div>

          {/* Certifications */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-gray-500">
                InstaAuto é uma marca registrada. CNPJ: 00.000.000/0001-00
              </div>
              <div className="flex items-center gap-4">
                <div className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                  🔒 Site Seguro SSL
                </div>
                <div className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                  ⭐ Reclame Aqui
                </div>
                <div className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                  📱 PWA Ready
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
