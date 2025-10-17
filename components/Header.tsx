import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { logoUrl } from '../assets/logo';

type AdminType = 'sindico' | 'clube';

interface HeaderProps {
    currentPage: string;
    setCurrentPage: (page: string) => void;
    adminType: AdminType | null;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage, adminType }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const baseNavItems = [
        { key: 'home', label: 'Início' },
        { key: 'comunicados', label: 'Comunicados' },
        { key: 'parceiros', label: 'Clube de Vantagens Colina Belvedere' },
        { key: 'eventos', label: 'Eventos' },
        { key: 'galeria', label: 'Galeria' },
        { key: 'documentos', label: 'Documentos' },
        { key: 'faq', label: 'FAQ' },
    ];
    
    const getNavItems = () => {
        const navItems = [...baseNavItems];
        if (adminType === 'sindico') {
            navItems.push({ key: 'sindico-admin', label: 'Painel Síndico' });
        } else if (adminType === 'clube') {
            navItems.push({ key: 'clube-admin', label: 'Painel Clube' });
        } else {
            // Se não estiver logado, mostra o botão de login
            navItems.push({ key: 'login', label: 'Acesso Restrito' });
        }
        return navItems;
    };
    
    const navItems = getNavItems();

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
                             <img src={logoUrl} alt="Collina Belvedere Logo" className="h-12" />
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