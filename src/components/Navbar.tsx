"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, LogIn, UserPlus, Wrench } from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

type NavbarProps = {
  items?: NavItem[];
  showOfficinasLink?: boolean;
  transparent?: boolean;
};

export default function Navbar({
  items = [],
  showOfficinasLink = true,
  transparent = false,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Efeito de scroll para mudar o fundo da navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <header 
      className={`py-3 sticky top-0 z-50 transition-all duration-300 ${
        isScrolled || !transparent 
          ? 'bg-white shadow-sm' 
          : isMobileMenuOpen 
            ? 'bg-white' 
            : 'bg-transparent backdrop-blur-sm bg-white/5'
      }`}
    >
      <div className="container-custom flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="relative flex items-center">
            <Image 
              src="/images/logo-of.svg" 
              alt="Instauto Logo" 
              width={160} 
              height={45} 
              className="h-12 w-auto"
              priority
            />
          </Link>
        </div>
        
        {/* Menu desktop */}
        {items.length > 0 && (
          <nav className="hidden md:flex space-x-10 mx-8 flex-1 justify-center">
            {items.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="text-gray-700 hover:text-blue transition-colors relative group font-medium"
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>
        )}
        
        {/* Botões desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <Link 
            href="/entrar" 
            className="text-gray-700 hover:text-blue transition-colors px-4 py-2 flex items-center gap-1.5 font-medium"
          >
            <LogIn className="h-4 w-4" />
            Entrar
          </Link>
          
          <Link 
            href="/cadastrar" 
            className="text-gray-700 hover:text-blue transition-colors px-4 py-2 flex items-center gap-1.5 font-medium"
          >
            <UserPlus className="h-4 w-4" />
            Cadastrar
          </Link>
          
          {showOfficinasLink && (
            <Link 
              href="/oficinas" 
              className="btn-primary flex items-center gap-1.5"
            >
              <Wrench className="h-4 w-4" />
              Sou Oficina Mecânica
            </Link>
          )}
        </div>
        
        {/* Botão mobile menu */}
        <button 
          className="md:hidden text-gray-700 hover:text-blue transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>
      
      {/* Menu mobile */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="container-custom py-4 flex flex-col space-y-4 bg-white">
          {items.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="text-gray-700 hover:text-blue transition-colors py-2 border-b border-gray-100 font-medium"
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          
          <div className="flex flex-col space-y-3 pt-2">
            <Link 
              href="/entrar" 
              className="btn-outline flex items-center justify-center gap-1.5"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <LogIn className="h-4 w-4" />
              Entrar
            </Link>
            
            <Link 
              href="/cadastrar" 
              className="btn-outline flex items-center justify-center gap-1.5"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <UserPlus className="h-4 w-4" />
              Cadastrar
            </Link>
            
            {showOfficinasLink && (
              <Link 
                href="/oficinas" 
                className="btn-primary flex items-center justify-center gap-1.5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Wrench className="h-4 w-4" />
                Sou Oficina Mecânica
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 