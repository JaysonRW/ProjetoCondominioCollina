import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ComunicadosPage from './pages/ComunicadosPage';
import ParceirosPage from './pages/ParceirosPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import FaqPage from './pages/FaqPage';
import EventosPage from './pages/EventosPage';
import DocumentosPage from './pages/DocumentosPage';
import GaleriaPage from './pages/GaleriaPage';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (loggedIn) {
        setIsLoggedIn(true);
    }
    
    const handleHashChange = () => {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            setCurrentPage(hash);
        } else {
            setCurrentPage('home');
        }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Set initial page based on hash

    return () => {
        window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleSetCurrentPage = (page: string) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo(0, 0);
  }

  const handleLogin = () => {
    sessionStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
    handleSetCurrentPage('admin');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    handleSetCurrentPage('home');
  };

  const renderPage = () => {
    if (currentPage === 'admin' && !isLoggedIn) {
        return <LoginPage onLoginSuccess={handleLogin} />;
    }

    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={handleSetCurrentPage} />;
      case 'comunicados':
        return <ComunicadosPage />;
      case 'parceiros':
        return <ParceirosPage />;
      case 'eventos':
        return <EventosPage />;
      case 'galeria':
        return <GaleriaPage />;
      case 'documentos':
        return <DocumentosPage />;
      case 'faq':
        return <FaqPage />;
      case 'admin':
        return isLoggedIn ? <AdminPage onLogout={handleLogout} /> : <LoginPage onLoginSuccess={handleLogin} />;
      default:
        return <HomePage setCurrentPage={handleSetCurrentPage} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Header 
        currentPage={currentPage} 
        setCurrentPage={handleSetCurrentPage}
        isLoggedIn={isLoggedIn}
      />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
