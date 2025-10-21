import React from 'react';
import DashboardCards from './DashboardCards';
import PagamentosPendentes from './PagamentosPendentes';
import PerformanceAnunciantes from './PerformanceAnunciantes';
import { Store, Calendar, DollarSign, AlertTriangle, Zap } from 'lucide-react';

interface DashboardClubeProps {
  onNewAnuncianteClick: () => void;
  onRegisterPaymentClick: () => void;
  refreshKey: number;
}

const ActionButton: React.FC<{ icon: React.ReactNode; onClick: () => void; children: React.ReactNode }> = ({ icon, onClick, children }) => (
  <button
    onClick={onClick}
    className="bg-white border border-gray-200 p-4 rounded-lg flex flex-col items-center justify-center text-center text-gray-700 hover:bg-gray-50 hover:border-brandGreen transition-all duration-200 shadow-sm"
  >
    <div className="mb-2 text-brandGreen-dark">{icon}</div>
    <span className="font-semibold text-sm">{children}</span>
  </button>
);

const DashboardClube: React.FC<DashboardClubeProps> = ({ onNewAnuncianteClick, onRegisterPaymentClick, refreshKey }) => {
  const handleGenerateReport = () => {
    alert('A funcionalidade de gerar relatório mensal será implementada em breve.');
  };
  
  const handleSendBilling = () => {
      alert('A funcionalidade de enviar cobranças será implementada em breve.');
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h2>
        <DashboardCards refreshKey={refreshKey} />
      </div>
      
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Zap size={20} className="text-orange-500" /> Ações Rápidas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <ActionButton icon={<Store size={24} />} onClick={onNewAnuncianteClick}>Novo Anunciante</ActionButton>
            <ActionButton icon={<Calendar size={24} />} onClick={handleGenerateReport}>Gerar Relatório</ActionButton>
            <ActionButton icon={<DollarSign size={24} />} onClick={onRegisterPaymentClick}>Registrar Pagamento</ActionButton>
            <ActionButton icon={<AlertTriangle size={24} />} onClick={handleSendBilling}>Enviar Cobranças</ActionButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <PerformanceAnunciantes refreshKey={refreshKey} />
        </div>
        <div className="lg:col-span-1">
            <PagamentosPendentes refreshKey={refreshKey} />
        </div>
      </div>
    </div>
  );
};

export default DashboardClube;