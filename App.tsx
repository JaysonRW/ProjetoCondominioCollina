// FIX: Corrected React import to fix JSX typing errors and updated hook calls.
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ComunicadosPage from './pages/ComunicadosPage';
import ParceirosPage from './pages/ParceirosPage';

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
    <div className="flex items-center justify-center h-96">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
            <p className="text-gray-600 mt-2">Esta página está em construção.</p>
        </div>
    </div>
);

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const validPages = ['home', 'comunicados', 'parceiros', 'documentos', 'galeria', 'eventos', 'faq', 'sindico'];
    
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (validPages.includes(hash)) {
        setCurrentPage(hash);
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'comunicados': return <ComunicadosPage />;
      case 'parceiros': return <ParceirosPage />;
      case 'documentos': return <PlaceholderPage title="Documentos" />;
      case 'galeria': return <PlaceholderPage title="Galeria" />;
      case 'eventos': return <PlaceholderPage title="Eventos" />;
      case 'faq': return <PlaceholderPage title="FAQ" />;
      case 'sindico': return <PlaceholderPage title="Área do Síndico" />;
      case 'home':
      default:
        return <HomePage setCurrentPage={(page) => window.location.hash = page} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">
      <Header setCurrentPage={(page) => window.location.hash = page} currentPage={currentPage} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App;