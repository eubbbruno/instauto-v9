'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bars3Icon, 
  XMarkIcon,
  ChevronDownIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon
} from '@heroicons/react/24/outline'

interface InstitutionalHeaderProps {
  transparent?: boolean
  fixed?: boolean
}

export default function InstitutionalHeader({ transparent = false, fixed = true }: InstitutionalHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false)

  const navigation = [
    { name: 'Início', href: '/' },
    { 
      name: 'Para Motoristas', 
      href: '/motoristas',
      submenu: [
        { name: 'Como Funciona', href: '/motoristas#como-funciona' },
        { name: 'Baixar App', href: '/motoristas#download' },
        { name: 'Cobertura', href: '/cobertura' },
        { name: 'Preços', href: '/motoristas#precos' }
      ]
    },
    { 
      name: 'Para Oficinas', 
      href: '/oficinas',
      submenu: [
        { name: 'Planos', href: '/oficinas/planos' },
        { name: 'Como Funciona', href: '/oficinas#como-funciona' },
        { name: 'Recursos', href: '/oficinas#recursos' },
        { name: 'Casos de Sucesso', href: '/oficinas#cases' }
      ]
    },
    { name: 'Buscar Oficinas', href: '/buscar-oficinas' },
    { name: 'Contato', href: '/contato' }
  ]

  const headerClasses = `
    ${fixed ? 'fixed' : 'relative'} top-0 left-0 right-0 z-50 transition-all duration-300
    ${transparent ? 'bg-transparent' : 'bg-white border-b border-gray-200 shadow-sm'}
  `

  return (
    <header className={headerClasses}>
      {/* Top Bar */}
      <div className="bg-blue-600 text-white py-2 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <a href="tel:0800123456" className="flex items-center gap-1 hover:text-blue-200">
                <PhoneIcon className="h-4 w-4" />
                0800 123 456
              </a>
              <a href="mailto:contato@instauto.com.br" className="hidden sm:flex items-center gap-1 hover:text-blue-200">
                <EnvelopeIcon className="h-4 w-4" />
                contato@instauto.com.br
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="flex items-center gap-1 hover:text-blue-200">
                <UserIcon className="h-4 w-4" />
                Entrar
              </Link>
              <Link 
                href="/login" 
                className="bg-yellow-500 text-blue-900 px-3 py-1 rounded hover:bg-yellow-400 font-medium"
              >
                Cadastrar
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logo.svg"
                alt="InstaAuto"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <div>
                <h1 className={`text-xl font-bold ${transparent ? 'text-white' : 'text-gray-900'}`}>
                  InstaAuto
                </h1>
                <p className={`text-xs ${transparent ? 'text-blue-200' : 'text-blue-600'}`}>
                  Conectando você à oficina ideal
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.submenu ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setServicesDropdownOpen(true)}
                    onMouseLeave={() => setServicesDropdownOpen(false)}
                  >
                    <button
                      className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        transparent 
                          ? 'text-white hover:text-blue-200' 
                          : 'text-gray-700 hover:text-blue-600'
                      }`}
                    >
                      {item.name}
                      <ChevronDownIcon className="h-4 w-4" />
                    </button>
                    
                    <AnimatePresence>
                      {servicesDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                        >
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      transparent 
                        ? 'text-white hover:text-blue-200' 
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/buscar-oficinas"
              className="text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              Buscar Oficina
            </Link>
            <Link
              href="/oficinas/planos"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Cadastrar Oficina
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              type="button"
              className={`p-2 rounded-md ${
                transparent ? 'text-white' : 'text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl lg:hidden z-50"
            >
              <div className="p-6">
                {/* Close Button */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/images/logo.svg"
                      alt="InstaAuto"
                      width={32}
                      height={32}
                      className="w-8 h-8"
                    />
                    <span className="text-lg font-bold text-gray-900">InstaAuto</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-md text-gray-700"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-4">
                  {navigation.map((item) => (
                    <div key={item.name}>
                      <Link
                        href={item.href}
                        className="block text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                      {item.submenu && (
                        <div className="ml-4 mt-2 space-y-2">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>

                {/* Mobile CTA Buttons */}
                <div className="mt-8 space-y-3">
                  <Link
                    href="/buscar-oficinas"
                    className="block w-full text-center text-blue-600 border border-blue-600 px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Buscar Oficina
                  </Link>
                  <Link
                    href="/oficinas/planos"
                    className="block w-full text-center bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Cadastrar Oficina
                  </Link>
                </div>

                {/* Contact Info */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Contato</h3>
                  <div className="space-y-3">
                    <a href="tel:0800123456" className="flex items-center gap-2 text-sm text-gray-600">
                      <PhoneIcon className="h-4 w-4" />
                      0800 123 456
                    </a>
                    <a href="mailto:contato@instauto.com.br" className="flex items-center gap-2 text-sm text-gray-600">
                      <EnvelopeIcon className="h-4 w-4" />
                      contato@instauto.com.br
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
