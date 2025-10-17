import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { logoBase64 } from '../assets/logo';

interface HeaderProps {
    currentPage: string;
    setCurrentPage: (page: string) => void;
    isLoggedIn: boolean;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage, isLoggedIn }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { key: 'home', label: 'Início' },
        { key: 'comunicados', label: 'Comunicados' },
        { key: 'parceiros', label: 'Clube de Vantagens' },
        { key: 'eventos', label: 'Eventos' },
        { key: 'galeria', label: 'Galeria' },
        { key: 'documentos', label: 'Documentos' },
        { key: 'faq', label: 'FAQ' },
    ];
    
    if (isLoggedIn) {
        navItems.push({ key: 'admin', label: 'Painel Admin' });
    }

    const NavLink: React.FC<{ itemKey: string; label: string }> = ({ itemKey, label }) => (
        <a
            href={`#${itemKey}`}
            onClick={(e) => {
                e.preventDefault();
                setCurrentPage(itemKey);
                setIsMenuOpen(false);
            }}
            className={`font-medium transition-colors ${currentPage === itemKey ? 'text-brandLime' : 'text-white hover:text-brandLime'}`}
        >
            {label}
        </a>
    );

    return (
        <header className="bg-brandGreen-dark text-white sticky top-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <a href="#home" onClick={() => setCurrentPage('home')} className="flex items-center gap-2">
                             <img src={logoBase64} alt="Collina Belvedere Logo" className="h-12" />
                        </a>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex md:items-center md:space-x-8">
                        {navItems.map(item => (
                            <NavLink key={item.key} itemKey={item.key} label={item.label} />
                        ))}
                    </nav>
                    
                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white hover:text-brandLime">
                            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-brandGreen-dark border-t border-brandGreen">
                    <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
                        {navItems.map(item => (
                            <a
                                key={item.key}
                                href={`#${item.key}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentPage(item.key);
                                    setIsMenuOpen(false);
                                }}
                                className={`block w-full text-center px-3 py-2 rounded-md text-base font-medium transition-colors ${currentPage === item.key ? 'bg-brandLime text-brandGreen-dark' : 'text-white hover:bg-brandGreen hover:text-white'}`}
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
