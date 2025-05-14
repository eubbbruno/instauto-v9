"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Items do menu para a página de oficinas
  const navItems = [
    { label: "Como Funciona", href: "#como-funciona" },
    { label: "Benefícios", href: "#beneficios" },
    { label: "Planos", href: "#planos" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header className="py-4 sticky top-0 z-50 bg-white shadow-sm">
      <div className="container-custom flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-blue flex items-center">
            <div className="bg-blue text-white rounded-lg w-10 h-10 flex items-center justify-center mr-2 shadow-sm">
              <span className="font-syne">Ia</span>
            </div>
            <span className="font-syne">Instauto</span>
          </Link>
        </div>
        
        {/* Menu desktop */}
        <nav className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <a 
              key={item.href}
              href={item.href} 
              className="text-gray-600 hover:text-blue transition-colors font-sans"
            >
              {item.label}
            </a>
          ))}
        </nav>
        
        {/* Botões desktop */}
        <div className="hidden md:flex space-x-4">
          <Link href="/" className="border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-50 transition-all">
            <span className="font-sans">Para Motoristas</span>
          </Link>
          
          <Link href="/cadastro" className="bg-blue hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-all duration-300 shadow-sm hover:shadow-md">
            <span className="font-sans">Entrar</span>
          </Link>
        </div>

        {/* Botão de menu mobile */}
        <div className="md:hidden">
          <button
            type="button"
            className="text-gray-700 hover:text-blue"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 backdrop-blur-sm">
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-lg p-6">
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="text-2xl font-bold text-blue flex items-center">
                <div className="bg-blue text-white rounded-lg w-8 h-8 flex items-center justify-center mr-2">
                  <span className="font-syne">Ia</span>
                </div>
                <span className="font-syne">Instauto</span>
              </Link>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <nav className="space-y-6 mb-8">
              {navItems.map((item) => (
                <a 
                  key={item.href}
                  href={item.href} 
                  className="block text-lg text-gray-700 hover:text-blue"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            
            <div className="space-y-4">
              <Link 
                href="/" 
                className="block w-full text-center border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-50 transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Para Motoristas
              </Link>
              <Link 
                href="/cadastro" 
                className="block w-full text-center bg-blue hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Entrar
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 