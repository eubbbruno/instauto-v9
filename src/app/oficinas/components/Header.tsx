"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const ctaButtonRef = useRef<HTMLAnchorElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  
  // Items do menu para a página de oficinas
  const navItems = [
    { label: "Como Funciona", href: "#como-funciona" },
    { label: "Benefícios", href: "#beneficios" },
    { label: "Planos", href: "#planos" },
    { label: "Demonstração", href: "/demonstracao" },
    { label: "FAQ", href: "#faq" },
  ];

  // Efeito de animação do botão CTA usando GSAP
  useEffect(() => {
    if (ctaButtonRef.current) {
      const tl = gsap.timeline({ repeat: -1, yoyo: true });
      tl.to(ctaButtonRef.current.querySelector('.btn-shine'), { 
        duration: 2.5, 
        backgroundPosition: '200% center',
        ease: "sine.inOut" 
      });
    }
  }, []);

  // Verificar o scroll para aplicar efeitos
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      // Detectar seção ativa para destacar no menu
      const sections = navItems.map(item => item.href.replace('#', ''));
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [navItems]);

  // Efeito de partículas no header
  useEffect(() => {
    const createParticleEffect = () => {
      if (!headerRef.current) return;
      
      // Limpar partículas anteriores
      const oldParticles = headerRef.current.querySelectorAll('.header-particle');
      oldParticles.forEach(p => p.remove());
      
      // Criar novas partículas
      const particleContainer = document.createElement('div');
      particleContainer.className = 'absolute inset-0 overflow-hidden pointer-events-none';
      headerRef.current.appendChild(particleContainer);
      
      // Criar 12 partículas
      for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = 'header-particle absolute rounded-full';
        
        // Tamanho aleatório
        const size = Math.random() * 6 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Cor azul com opacidade variável
        const opacity = Math.random() * 0.15 + 0.05;
        particle.style.backgroundColor = `rgb(37 99 235 / ${opacity})`; // Usando blue-600 do Tailwind
        
        // Posição aleatória
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Animação CSS
        particle.style.animation = `floatParticle ${Math.random() * 10 + 10}s infinite linear`;
        
        particleContainer.appendChild(particle);
      }
      
      // Adicionar keyframes se não existirem
      if (!document.getElementById('particle-keyframes')) {
        const style = document.createElement('style');
        style.id = 'particle-keyframes';
        style.textContent = `
          @keyframes floatParticle {
            0% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(30px, 15px) rotate(120deg); }
            66% { transform: translate(-20px, 20px) rotate(240deg); }
            100% { transform: translate(0, 0) rotate(360deg); }
          }
        `;
        document.head.appendChild(style);
      }
    };
    
    createParticleEffect();
    
    return () => {
      if (headerRef.current) {
        const particles = headerRef.current.querySelectorAll('.header-particle');
        particles.forEach(p => p.remove());
      }
      
      const style = document.getElementById('particle-keyframes');
      if (style) style.remove();
    };
  }, []);

  return (
    <header 
      ref={headerRef}
      className={`py-4 sticky top-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-white shadow-xl" 
          : "bg-white"
      }`}
      data-contrast="light"
    >
      {/* Linha decorativa superior */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-600"></div>
      
      <div className="container-custom flex justify-between items-center relative">
        {/* Logo SVG animada */}
        <div className="flex items-center">
          <Link href="/oficinas" className="flex items-center relative group">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              <Image 
                src="/images/logo-of-dark.svg" 
                alt="Instauto Logo" 
                width={150} 
                height={40}
                className="h-10 w-auto"
              />
              
              {/* Efeito de brilho sob o logo */}
              <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-blue-600/0 via-blue-600/70 to-blue-600/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </motion.div>
          </Link>
        </div>
        
        {/* Menu desktop */}
        <nav className="hidden md:flex space-x-6">
          {navItems.map((item) => {
            const isActive = `#${activeSection}` === item.href;
            
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`relative group py-2 px-1 font-medium transition-colors ${
                  isActive ? 'text-blue-600 font-semibold' : 'text-text-base hover:text-blue-600'
                }`}
              >
                <span className="relative z-10">{item.label}</span>
                
                {/* Linha de destaque animada */}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 transform origin-left transition-all duration-300 ${
                  isActive 
                    ? 'bg-blue-600 scale-x-100' 
                    : 'bg-blue-600/70 scale-x-0 group-hover:scale-x-100'
                }`}></span>
                
                {/* Efeito de hover */}
                <span className="absolute inset-0 bg-blue-600/5 rounded scale-0 group-hover:scale-100 transition-transform duration-200"></span>
              </Link>
            );
          })}
        </nav>
        
        {/* Botões desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <Link 
            href="/auth/oficina" 
            className="btn-outline"
          >
            Entrar
          </Link>
          <Link 
            href="/auth/oficina" 
            ref={ctaButtonRef}
            className="btn-secondary relative overflow-hidden group flex items-center"
          >
            <span className="relative z-10 flex items-center">
              Começar Agora
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
            {/* Efeito brilho */}
            <span className="btn-shine absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent bg-[length:200%_100%]"></span>
          </Link>
        </div>

        {/* Botão de menu mobile */}
        <div className="md:hidden">
          <button
            type="button"
            className="text-text-base hover:text-brand-blue transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-7 w-7" />
          </button>
        </div>
      </div>

      {/* Menu mobile deslizante */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="flex flex-col h-full p-6">
                <div className="flex items-center justify-between mb-8">
                  <Link href="/oficinas" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
                    <Image 
                      src="/images/logo-of-dark.svg" 
                      alt="Instauto Logo" 
                      width={120} 
                      height={32}
                      className="h-8 w-auto"
                    />
                  </Link>
                  <button
                    type="button"
                    className="text-text-base hover:text-brand-blue transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <nav className="space-y-6 mb-8">
                  {navItems.map((item) => (
                    <motion.a 
                      key={item.href}
                      href={item.href} 
                      className="flex items-center text-lg text-text-base hover:text-brand-blue border-b border-gray-200 pb-3"
                      onClick={() => setMobileMenuOpen(false)}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <ChevronDown className="w-4 h-4 mr-2 transform rotate-90 text-brand-blue" />
                      {item.label}
                    </motion.a>
                  ))}
                </nav>
                
                <div className="space-y-4 mt-auto">
                  <Link 
                    href="/motorista" 
                    className="btn-primary block w-full text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Para Motoristas
                  </Link>
                  
                  <Link 
                    href="/auth/oficina" 
                    className="btn-secondary block w-full text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Cadastrar Oficina
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header; 