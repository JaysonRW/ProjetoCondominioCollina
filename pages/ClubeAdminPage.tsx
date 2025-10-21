import React, { useState, useCallback } from 'react';
import { LogOut, LayoutDashboard, Store } from 'lucide-react';
import DashboardClube from '../components/admin/clube/DashboardClube';
import AnunciantesClube from '../components/admin/clube/AnunciantesClube';
import Modal from '../components/Modal';
import AnuncianteForm from '../components/admin/clube/AnuncianteForm';
import PagamentosManager from '../components/admin/clube/PagamentosManager';
import { Anunciante } from '../types/types';

interface ClubeAdminPageProps {
  onLogout: () => void;
}

const ClubeAdminPage: React.FC<ClubeAdminPageProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAnuncianteModalOpen, setIsAnuncianteModalOpen] = useState(false);
  const [isPagamentoModalOpen, setIsPagamentoModalOpen] = useState(false);
  const [editingAnunciante, setEditingAnunciante] = useState<Anunciante | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  const handleOpenCreateModal = () => {
    setEditingAnunciante(null);
    setIsAnuncianteModalOpen(true);
  };

  const handleOpenEditModal = (anunciante: Anunciante) => {
    setEditingAnunciante(anunciante);
    setIsAnuncianteModalOpen(true);
  };

  const handleAnuncianteModalSuccess = () => {
    setIsAnuncianteModalOpen(false);
    triggerRefresh();
  };

  const handlePagamentoModalSuccess = () => {
    // We don't close the modal automatically, to allow multiple registrations
    triggerRefresh();
  };
  
  const handleModalClose = () => {
      setIsAnuncianteModalOpen(false);
      setIsPagamentoModalOpen(false);
  };

  const TabButton: React.FC<{tabName: string; icon: React.ReactNode; children: React.ReactNode}> = ({tabName, icon, children}) => (
    <button onClick={() => setActiveTab(tabName)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === tabName ? 'bg-brandLime text-brandGreen-dark' : 'text-gray-600 hover:bg-gray-200'}`}>
      {icon}
      {children}
    </button>
  );

  const renderContent = () => {
    switch(activeTab) {
        case 'dashboard':
            return <DashboardClube 
                      onNewAnuncianteClick={handleOpenCreateModal} 
                      onRegisterPaymentClick={() => setIsPagamentoModalOpen(true)}
                      refreshKey={refreshKey}
                      triggerRefresh={triggerRefresh} 
                   />;
        case 'anunciantes':
            return <AnunciantesClube 
                      refreshKey={refreshKey} 
                      onEditAnunciante={handleOpenEditModal} 
                      onCreateAnunciante={handleOpenCreateModal} 
                   />;
        default:
            return null;
    }
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-148px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-brandGreen-dark font-display">Painel - Clube de Vantagens</h1>
                <p className="text-gray-600">Bem-vindo, Gestor!</p>
            </div>
            <button onClick={onLogout} className="mt-4 md:mt-0 bg-red-500 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors">
                <LogOut size={18} /> Sair
            </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-1/4">
                <div className="bg-white p-4 rounded-lg shadow-sm space-y-2">
                   <TabButton tabName="dashboard" icon={<LayoutDashboard size={20} />}>Dashboard</TabButton>
                   <TabButton tabName="anunciantes" icon={<Store size={20} />}>Anunciantes</TabButton>
                </div>
            </aside>
            
            <main className="w-full md:w-3/4">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    {renderContent()}
                </div>
            </main>
        </div>
      </div>
      
      <Modal
        isOpen={isAnuncianteModalOpen}
        onClose={() => setIsAnuncianteModalOpen(false)}
        title={editingAnunciante ? 'Editar Anunciante' : 'Novo Anunciante'}
      >
        <AnuncianteForm 
            anunciante={editingAnunciante} 
            onSuccess={handleAnuncianteModalSuccess}
            onCancel={() => setIsAnuncianteModalOpen(false)}
        />
      </Modal>

       <Modal
        isOpen={isPagamentoModalOpen}
        onClose={() => setIsPagamentoModalOpen(false)}
        title="Registrar Pagamentos"
      >
        <PagamentosManager 
            onSuccess={handlePagamentoModalSuccess}
        />
      </Modal>
    </div>
  );
};

export default ClubeAdminPage;