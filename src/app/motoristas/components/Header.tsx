"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MenuIcon, X, User, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Detecta scroll para mudar o estilo do header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Itens do menu
  const navItems = [
    { label: "Como Funciona", href: "#como-funciona" },
    { label: "Benefícios", href: "#beneficios" },
    { label: "Serviços", href: "#servicos" },
    { label: "Demonstração", href: "/demonstracao" },
    { label: "Dúvidas", href: "#faq" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#0047CC] py-3' 
          : 'bg-gradient-to-r from-[#0047CC] to-[#0055EB] py-5'
      }`}
    >
      {/* Padrão de fundo decorativo */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptMi0yaDF2MWgtMXYtMXptLTItNGgxdjFoLTF2LTF6bTQgMGgxdjFoLTF2LTF6bTIgMmgtMXYtMWgxdjF6bS0yIDRoMXYxaC0xdi0xek0zNCAzMGg0djFoLTR2LTF6bTAtMmgxdjFoLTF2LTF6bTAtNGgxdjFoLTF2LTF6TTMwIDI4aDFWMTdoLTF2MTF6bS0yIDJoMXYxaC0xdi0xem0tMi0yaDF2MWgtMXYtMXptLTItNGgxdjFoLTF2LTF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
      
      {/* Linha decorativa amarela no topo */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-[#FFDE59] ${isScrolled ? 'opacity-100' : 'opacity-70'}`}></div>
      
      <div className="container-custom relative z-10">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/motorista" className="relative z-50">
            <div className="flex items-center">
              <div className="relative overflow-hidden rounded-lg mr-2">
                <motion.div 
                  initial={{ x: -100 }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <Image 
                    src="/images/logo.svg" 
                    alt="Instauto Logo" 
                    width={150} 
                    height={40}
                    className="h-10 w-auto"
                  />
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="hidden sm:block"
              >
                <span className="text-white font-bold text-sm bg-white/10 px-2 py-1 rounded-md">
                  Para Motoristas
                </span>
              </motion.div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="group relative"
              >
                <Link 
                  href={item.href}
                  className="text-white font-medium transition-all group-hover:text-[#FFDE59]"
                >
                  {item.label}
                </Link>
                {/* Linha animada na parte inferior */}
                <motion.div 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FFDE59] rounded-full group-hover:w-full"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative group"
            >
              <Link href="/auth/motorista">
                <button 
                  className="px-4 py-2 rounded-lg font-medium border border-white/30 hover:bg-white/10 text-white transition-all group-hover:border-white"
                >
                  <div className="flex items-center">
                    <User size={18} className="mr-2" />
                    <span>Entrar / Cadastrar</span>
                  </div>
                </button>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <Link href="/buscar-oficinas">
                <button 
                  className="px-5 py-3 rounded-lg font-medium bg-[#FFDE59] hover:bg-[#FFD429] text-[#0047CC] font-bold transition-all shadow-lg relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center">
                    Quero Orçamento!
                    <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-0 bg-white transition-all duration-300 group-hover:h-full -z-0"></span>
                </button>
              </Link>
              
              {/* Partículas decorativas */}
              <div className="absolute -right-1 -top-1 w-3 h-3 bg-white rounded-full opacity-30 animate-ping"></div>
              <div className="absolute right-2 bottom-2 w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"></div>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden z-50 relative p-2 bg-white/10 rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <MenuIcon className="h-6 w-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          className="fixed inset-0 bg-[#0047CC] pt-24 px-6 z-40 flex flex-col"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Padrão de fundo decorativo para o menu móvel */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptMi0yaDF2MWgtMXYtMXptLTItNGgxdjFoLTF2LTF6bTQgMGgxdjFoLTF2LTF6bTIgMmgtMXYtMWgxdjF6bS0yIDRoMXYxaC0xdi0xek0zNCAzMGg0djFoLTR2LTF6bTAtMmgxdjFoLTF2LTF6bTAtNGgxdjFoLTF2LTF6TTMwIDI4aDFWMTdoLTF2MTF6bS0yIDJoMXYxaC0xdi0xem0tMi0yaDF2MWgtMXYtMXptLTItNGgxdjFoLTF2LTF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
          
          <nav className="flex flex-col space-y-6 pt-4 relative z-10">
            {navItems.map((item, index) => (
              <Link 
                key={index}
                href={item.href}
                className="text-white font-medium text-lg border-b border-white/10 pb-3 flex items-center justify-between hover:text-[#FFDE59] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
                <ChevronRight size={18} className="text-[#FFDE59]" />
              </Link>
            ))}

            <div className="pt-6 space-y-4">
              <Link 
                href="/auth/motorista"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full"
              >
                <button 
                  className="w-full px-4 py-3 rounded-lg font-medium border border-white/30 hover:bg-white/10 text-white transition-all flex items-center justify-center"
                >
                  <User size={18} className="mr-2" />
                  <span>Entrar / Cadastrar</span>
                </button>
              </Link>
              
              <Link 
                href="/buscar-oficinas"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full"
              >
                <button 
                  className="w-full px-4 py-3 rounded-lg font-bold bg-[#FFDE59] hover:bg-[#FFD429] text-[#0047CC] transition-all shadow-lg flex items-center justify-center"
                >
                  <span>Quero Orçamento!</span>
                  <ChevronRight size={18} className="ml-1" />
                </button>
              </Link>
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
