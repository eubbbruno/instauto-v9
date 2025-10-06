'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  HomeIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface InstitutionalLayoutProps {
  children: ReactNode
  title: string
  description?: string
}

export default function InstitutionalLayout({ 
  children, 
  title, 
  description 
}: InstitutionalLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/images/logo-of.svg"
                alt="InstaAuto"
                width={40}
                height={40}
                className="w-8 h-8 md:w-10 md:h-10"
              />
              <span className="text-xl md:text-2xl font-bold text-gray-900">
                InstaAuto
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                href="/" 
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <HomeIcon className="w-5 h-5" />
                <span>Início</span>
              </Link>
              <Link 
                href="/motoristas" 
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Motoristas
              </Link>
              <Link 
                href="/oficinas" 
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Oficinas
              </Link>
              <Link 
                href="/contato" 
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Contato
              </Link>
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-3">
              <Link 
                href="/login"
                className="hidden sm:block px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Entrar
              </Link>
              <Link 
                href="/oficinas/login"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105"
              >
                Sou Oficina
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
          >
            {title}
          </motion.h1>
          {description && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto"
            >
              {description}
            </motion.p>
          )}
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 lg:p-12"
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Image
                  src="/images/logo-of-dark.svg"
                  alt="InstaAuto"
                  width={32}
                  height={32}
                />
                <span className="text-xl font-bold">InstaAuto</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                A plataforma que conecta motoristas às melhores oficinas do Brasil. 
                Agendamento rápido, serviços de qualidade.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm">
                    Página Inicial
                  </Link>
                </li>
                <li>
                  <Link href="/motoristas" className="text-gray-300 hover:text-white transition-colors text-sm">
                    Para Motoristas
                  </Link>
                </li>
                <li>
                  <Link href="/oficinas" className="text-gray-300 hover:text-white transition-colors text-sm">
                    Para Oficinas
                  </Link>
                </li>
                <li>
                  <Link href="/cobertura" className="text-gray-300 hover:text-white transition-colors text-sm">
                    Cobertura
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/termos" className="text-gray-300 hover:text-white transition-colors text-sm">
                    Termos de Serviço
                  </Link>
                </li>
                <li>
                  <Link href="/politicas" className="text-gray-300 hover:text-white transition-colors text-sm">
                    Política de Privacidade
                  </Link>
                </li>
                <li>
                  <Link href="/privacidade" className="text-gray-300 hover:text-white transition-colors text-sm">
                    Privacidade
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-gray-300 hover:text-white transition-colors text-sm">
                    Política de Cookies
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contato</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2 text-sm text-gray-300">
                  <EnvelopeIcon className="w-4 h-4" />
                  <span>contato@instauto.com.br</span>
                </li>
                <li className="flex items-center space-x-2 text-sm text-gray-300">
                  <PhoneIcon className="w-4 h-4" />
                  <span>(11) 99999-9999</span>
                </li>
                <li className="flex items-center space-x-2 text-sm text-gray-300">
                  <MapPinIcon className="w-4 h-4" />
                  <span>São Paulo, SP</span>
                </li>
                <li className="flex items-center space-x-2 text-sm text-gray-300">
                  <ClockIcon className="w-4 h-4" />
                  <span>24h por dia</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 InstaAuto. Todos os direitos reservados.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link href="/demonstracao" className="text-gray-400 hover:text-white text-sm transition-colors">
                Demonstração
              </Link>
              <Link href="/status" className="text-gray-400 hover:text-white text-sm transition-colors">
                Status
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}