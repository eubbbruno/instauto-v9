'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  ShieldCheckIcon, 
  CircleStackIcon,
  EnvelopeIcon,
  PlayCircleIcon
} from '@heroicons/react/24/outline';

interface InstitutionalLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function InstitutionalLayout({ 
  children, 
  title,
  description 
}: InstitutionalLayoutProps) {
  const pathname = usePathname();

  const navigationLinks = [
    { href: '/', label: 'Início', icon: HomeIcon },
    { href: '/termos', label: 'Termos de Uso', icon: DocumentTextIcon },
    { href: '/politicas', label: 'Políticas', icon: ShieldCheckIcon },
    { href: '/privacidade', label: 'Privacidade', icon: ShieldCheckIcon },
    { href: '/cookies', label: 'Cookies', icon: CircleStackIcon },
    { href: '/contato', label: 'Contato', icon: EnvelopeIcon },
  ];

  const footerLinks = {
    produto: [
      { href: '/motoristas', label: 'Para Motoristas' },
      { href: '/oficinas', label: 'Para Oficinas' },
      { href: '/demonstracao', label: 'Demonstração' },
      { href: '/cobertura', label: 'Áreas de Cobertura' },
    ],
    empresa: [
      { href: '/sobre', label: 'Sobre Nós' },
      { href: '/contato', label: 'Fale Conosco' },
      { href: '/trabalhe-conosco', label: 'Trabalhe Conosco' },
      { href: '/imprensa', label: 'Imprensa' },
    ],
    legal: [
      { href: '/termos', label: 'Termos de Uso' },
      { href: '/politicas', label: 'Política de Privacidade' },
      { href: '/privacidade', label: 'Proteção de Dados' },
      { href: '/cookies', label: 'Política de Cookies' },
    ],
    suporte: [
      { href: '/ajuda', label: 'Central de Ajuda' },
      { href: '/faq', label: 'Perguntas Frequentes' },
      { href: '/status', label: 'Status do Sistema' },
      { href: '/contato', label: 'Contato' },
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/logo-instauto.svg"
                alt="Instauto"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold text-gray-900">Instauto</span>
            </Link>

            {/* Navigation Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center space-x-2 text-sm font-medium transition-colors
                      ${isActive 
                        ? 'text-[#0047CC]' 
                        : 'text-gray-600 hover:text-[#0047CC]'
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/motorista"
                className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/demonstracao"
                className="inline-flex items-center space-x-2 bg-[#0047CC] hover:bg-[#0055EB] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <PlayCircleIcon className="h-4 w-4" />
                <span>Ver Demo</span>
              </Link>
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="md:hidden border-t py-3 -mx-4 px-4 overflow-x-auto">
            <div className="flex space-x-6 whitespace-nowrap">
              {navigationLinks.map((link) => {
                const isActive = pathname === link.href;
                
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors
                      ${isActive 
                        ? 'text-[#0047CC]' 
                        : 'text-gray-600 hover:text-[#0047CC]'
                      }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </header>

      {/* Page Header */}
      {(title || description) && (
        <div className="bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {title && (
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Footer Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
            {/* Logo & Description */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <Image
                  src="/logo-instauto.svg"
                  alt="Instauto"
                  width={32}
                  height={32}
                  className="h-8 w-auto brightness-0 invert"
                />
                <span className="text-xl font-bold">Instauto</span>
              </div>
              <p className="text-sm text-gray-400">
                Conectando motoristas e oficinas para um atendimento automotivo mais eficiente.
              </p>
            </div>

            {/* Links Columns */}
            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">
                Produto
              </h3>
              <ul className="space-y-2">
                {footerLinks.produto.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">
                Empresa
              </h3>
              <ul className="space-y-2">
                {footerLinks.empresa.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">
                Legal
              </h3>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">
                Suporte
              </h3>
              <ul className="space-y-2">
                {footerLinks.suporte.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} Instauto. Todos os direitos reservados.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-6">
                <Link
                  href="https://facebook.com/instauto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                </Link>
                
                <Link
                  href="https://instagram.com/instauto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
                  </svg>
                </Link>
                
                <Link
                  href="https://linkedin.com/company/instauto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 