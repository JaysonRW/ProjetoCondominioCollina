import React from 'react';
import DashboardCards from './DashboardCards';
import PagamentosPendentes from './PagamentosPendentes';
import PerformanceAnunciantes from './PerformanceAnunciantes';
import { PlusCircle } from 'lucide-react';

interface DashboardClubeProps {
  onNewAnuncianteClick: () => void;
  refreshKey: number;
}

const DashboardClube: React.FC<DashboardClubeProps> = ({ onNewAnuncianteClick, refreshKey }) => {
  const handleGenerateReport = () => {
    alert('A funcionalidade de gerar relatório mensal será implementada em breve.');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h2>
        <DashboardCards refreshKey={refreshKey} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <PerformanceAnunciantes refreshKey={refreshKey} />
        </div>
        <div className="lg:col-span-1">
            <PagamentosPendentes refreshKey={refreshKey} />
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Ações Rápidas</h3>
        <div className="flex flex-wrap gap-4">
            <button 
              onClick={onNewAnuncianteClick}
              className="bg-brandGreen text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-brandGreen-dark transition-colors shadow-md"
            >
                <PlusCircle size={20} /> Novo Anunciante
            </button>
            <button 
              onClick={handleGenerateReport}
              className="bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-300 transition-colors"
            >
                Gerar Relatório Mensal
            </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardClube;