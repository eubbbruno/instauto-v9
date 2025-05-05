"use client";

import Link from "next/link";
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
} from "@heroicons/react/24/outline";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = {
    produto: [
      { label: "Para Motoristas", href: "/" },
      { label: "Para Oficinas", href: "/oficinas" },
      { label: "Preços", href: "/precos" },
      { label: "Aplicativo", href: "/app" }
    ],
    empresa: [
      { label: "Sobre Nós", href: "/sobre" },
      { label: "Carreiras", href: "/carreiras" },
      { label: "Blog", href: "/blog" },
      { label: "Novidades", href: "/novidades" }
    ],
    suporte: [
      { label: "FAQ", href: "/faq" },
      { label: "Contato", href: "/contato" },
      { label: "Termos de Uso", href: "/termos" },
      { label: "Privacidade", href: "/privacidade" }
    ],
    social: [
      { label: "Instagram", href: "https://instagram.com", external: true },
      { label: "Facebook", href: "https://facebook.com", external: true },
      { label: "LinkedIn", href: "https://linkedin.com", external: true },
      { label: "YouTube", href: "https://youtube.com", external: true }
    ]
  };
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom">
        {/* Seção principal do footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Coluna com informações da empresa */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block">
              <div className="text-2xl font-bold mb-2">Instauto</div>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md">
              Conectando motoristas e oficinas de forma rápida e transparente. 
              Orçamentos práticos, agendamentos simples e manutenção sem complicação.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPinIcon className="h-5 w-5 text-blue mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">
                    Av. Paulista, 1000 - Bela Vista<br />
                    São Paulo - SP, 01310-100
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-blue flex-shrink-0" />
                <a href="tel:+551199999999" className="text-gray-300 hover:text-white transition-colors">
                  (11) 99999-9999
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-blue flex-shrink-0" />
                <a href="mailto:contato@instauto.com.br" className="text-gray-300 hover:text-white transition-colors">
                  contato@instauto.com.br
                </a>
              </div>
            </div>
          </div>
          
          {/* Links do footer */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4 border-b border-gray-700 pb-2">Produto</h3>
              <ul className="space-y-2">
                {footerLinks.produto.map((link, i) => (
                  <li key={i}>
                    <Link 
                      href={link.href} 
                      className="text-gray-300 hover:text-white transition-colors inline-block py-1"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4 border-b border-gray-700 pb-2">Empresa</h3>
              <ul className="space-y-2">
                {footerLinks.empresa.map((link, i) => (
                  <li key={i}>
                    <Link 
                      href={link.href} 
                      className="text-gray-300 hover:text-white transition-colors inline-block py-1"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4 border-b border-gray-700 pb-2">Suporte</h3>
              <ul className="space-y-2">
                {footerLinks.suporte.map((link, i) => (
                  <li key={i}>
                    <Link 
                      href={link.href} 
                      className="text-gray-300 hover:text-white transition-colors inline-block py-1"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4 border-b border-gray-700 pb-2">Redes Sociais</h3>
              <ul className="space-y-2">
                {footerLinks.social.map((link, i) => (
                  <li key={i}>
                    <a 
                      href={link.href} 
                      className="text-gray-300 hover:text-white transition-colors inline-block py-1"
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Newsletter */}
        <div className="py-8 border-t border-gray-800">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-bold text-xl mb-2">Fique por dentro das novidades</h3>
              <p className="text-gray-300">
                Receba dicas, novidades e promoções exclusivas sobre manutenção automotiva.
              </p>
            </div>
            <div>
              <form className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                <input 
                  type="email" 
                  placeholder="Seu email" 
                  className="bg-gray-800 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue border border-gray-700 w-full"
                />
                <button 
                  type="submit" 
                  className="btn-primary whitespace-nowrap"
                >
                  Inscrever-se
                </button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="py-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-400 text-sm">
            © {currentYear} Instauto. Todos os direitos reservados.
          </div>
          <div className="flex space-x-4">
            <Link href="/termos" className="text-gray-400 hover:text-white text-sm transition-colors">
              Termos de Uso
            </Link>
            <Link href="/privacidade" className="text-gray-400 hover:text-white text-sm transition-colors">
              Política de Privacidade
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
              Política de Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 