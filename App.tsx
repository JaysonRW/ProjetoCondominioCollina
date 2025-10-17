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
import ClubeAdminPage from './pages/ClubeAdminPage';

type AdminType = 'sindico' | 'clube';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [adminType, setAdminType] = useState<AdminType | null>(null);

  useEffect(() => {
    const loggedInType = sessionStorage.getItem('adminType') as AdminType | null;
    if (loggedInType) {
        setAdminType(loggedInType);
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
    handleHashChange();

    return () => {
        window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleSetCurrentPage = (page: string) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo(0, 0);
  }

  const handleLogin = (type: AdminType) => {
    sessionStorage.setItem('adminType', type);
    setAdminType(type);
    const adminPage = type === 'sindico' ? 'sindico-admin' : 'clube-admin';
    handleSetCurrentPage(adminPage);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminType');
    setAdminType(null);
    handleSetCurrentPage('home');
  };

  const renderPage = () => {
    const needsLogin = (currentPage === 'sindico-admin' && adminType !== 'sindico') || (currentPage === 'clube-admin' && adminType !== 'clube');
    if (needsLogin) {
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
      case 'sindico-admin':
        return adminType === 'sindico' ? <AdminPage onLogout={handleLogout} /> : <LoginPage onLoginSuccess={handleLogin} />;
      case 'clube-admin':
        return adminType === 'clube' ? <ClubeAdminPage onLogout={handleLogout} /> : <LoginPage onLoginSuccess={handleLogin} />;
      default:
        return <HomePage setCurrentPage={handleSetCurrentPage} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Header 
        currentPage={currentPage} 
        setCurrentPage={handleSetCurrentPage}
        adminType={adminType}
      />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
