// FIX: Corrected React import to fix JSX typing errors.
import React, { useState } from 'react';
import { Menu, X, UserCircle } from 'lucide-react';

interface HeaderProps {
  setCurrentPage: (page: string) => void;
  currentPage: string;
}

const NavLink: React.FC<{ page: string; currentPage: string; onClick: () => void; children: React.ReactNode; isButton?: boolean }> = ({ page, currentPage, onClick, children, isButton = false }) => (
  <a
    href={`#${page}`}
    onClick={onClick}
    className={isButton 
      ? `flex items-center gap-2 bg-brandGreen text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brandGreen-dark transition-colors`
      : `px-3 py-2 rounded-md text-sm font-medium transition-colors text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.6)] ${
          currentPage === page
            ? 'font-bold text-brandLime'
            : 'hover:text-brandLime'
        }`
    }
  >
    {children}
  </a>
);

const Header: React.FC<HeaderProps> = ({ setCurrentPage, currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (page: string) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
  }
  
  const navItems = [
    { page: 'home', label: 'Início' },
    { page: 'comunicados', label: 'Comunicados' },
    { page: 'parceiros', label: 'Parceiros' },
    { page: 'documentos', label: 'Documentos' },
    { page: 'galeria', label: 'Galeria' },
    { page: 'eventos', label: 'Eventos' },
    { page: 'faq', label: 'FAQ' },
  ];

  return (
    <header className="relative bg-cover bg-center sticky top-0 z-50" style={{ backgroundImage: "url('/assets/header-bg.jpg')" }}>
      {/* IMPROVEMENT: Changed the solid overlay to a gradient for better aesthetics and readability of the navigation bar. */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(42, 60, 51, 0.8) 0%, rgba(42, 60, 51, 0.3) 100%)' }}></div>
      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <a href="#home" onClick={() => handleNavClick('home')} className="flex items-center">
              <img src="/assets/logo.png" alt="Collina Belvedere Logo" className="h-14 w-auto drop-shadow-lg" />
            </a>
          </div>

          <div className="hidden lg:flex lg:items-center lg:justify-center lg:gap-x-6">
            {navItems.map(item => (
              <NavLink key={item.page} page={item.page} currentPage={currentPage} onClick={() => handleNavClick(item.page)}>{item.label}</NavLink>
            ))}
          </div>

          <div className="hidden lg:flex lg:items-center">
             <NavLink page="sindico" currentPage={currentPage} onClick={() => handleNavClick('sindico')} isButton>
                <UserCircle size={20} />
                Área do Síndico
            </NavLink>
          </div>

          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/20 focus:outline-none"
              aria-controls="mobile-menu" 
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menu principal</span>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden absolute w-full bg-brandGreen-dark/95 backdrop-blur-sm" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             {navItems.map(item => (
              <a key={item.page} href={`#${item.page}`} onClick={() => handleNavClick(item.page)} className={`block px-3 py-2 rounded-md text-base font-medium ${currentPage === item.page ? 'bg-brandLime text-brandGreen-dark' : 'text-white hover:bg-brandGreen'}`}>{item.label}</a>
            ))}
            <div className="px-3 pt-4 pb-2">
                <NavLink page="sindico" currentPage={currentPage} onClick={() => handleNavClick('sindico')} isButton>
                    <UserCircle size={20} />
                    Área do Síndico
                </NavLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;