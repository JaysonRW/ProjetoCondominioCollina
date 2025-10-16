// FIX: Corrected React import to fix JSX typing errors.
import React from 'react';
import { Building2 } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Building2 className="h-6 w-6" />
            <span className="font-bold text-lg">Collina Belvedere</span>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Condomínio Collina Belvedere. Todos os direitos reservados.</p>
            <p className="text-sm text-gray-400">Contato da Administração: (11) 1234-5678</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;