"use client";

import Link from "next/link";

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
  return (
    <header className={`py-4 sticky top-0 z-50 ${transparent ? 'bg-transparent' : 'bg-white shadow-sm'}`}>
      <div className="container-custom flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600 flex items-center">
            <div className="bg-blue-600 text-white rounded-lg w-10 h-10 flex items-center justify-center mr-2 shadow-sm">
              <span className="font-syne">Ia</span>
            </div>
            <span className="font-syne">Instauto</span>
          </Link>
        </div>
        
        {/* Menu desktop */}
        {items.length > 0 && (
          <nav className="hidden md:flex space-x-8">
            {items.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="text-gray-600 hover:text-blue-600 transition-colors font-sans"
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
        
        {/* Botões desktop */}
        <div className="flex space-x-4">
          <Link href="/" className="btn-outline hidden md:inline-block">
            <span className="font-sans">Para Motoristas</span>
          </Link>
          
          {showOfficinasLink && (
            <Link href="/oficinas" className="bg-yellow-400 text-gray-900 font-medium py-2 px-4 rounded-md transition-all duration-300 hover:bg-yellow-500">
              <span className="font-sans">Para Oficinas</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
} 