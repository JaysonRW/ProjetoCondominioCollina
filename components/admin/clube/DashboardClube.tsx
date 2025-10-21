import React, { useState } from 'react';
import DashboardCards from './DashboardCards';
import PagamentosPendentes from './PagamentosPendentes';
import PerformanceAnunciantes from './PerformanceAnunciantes';
import { Store, DollarSign, RefreshCw, Clock, Zap } from 'lucide-react';
import { gerarCobrancasMesAtual, atualizarStatusPagamentosAtrasados } from '../../../services/api';

interface DashboardClubeProps {
  onNewAnuncianteClick: () => void;
  onRegisterPaymentClick: () => void;
  refreshKey: number;
  triggerRefresh: () => void;
}

const ActionButton: React.FC<{ icon: React.ReactNode; onClick: () => void; children: React.ReactNode; disabled?: boolean; }> = ({ icon, onClick, children, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="bg-white border border-gray-200 p-4 rounded-lg flex flex-col items-center justify-center text-center text-gray-700 hover:bg-gray-50 hover:border-brandGreen transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <div className="mb-2 text-brandGreen-dark">{icon}</div>
    <span className="font-semibold text-sm">{children}</span>
  </button>
);

const DashboardClube: React.FC<DashboardClubeProps> = ({ onNewAnuncianteClick, onRegisterPaymentClick, refreshKey, triggerRefresh }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleGerarCobrancas = async () => {
    if (!window.confirm('Isso irá verificar e criar registros de cobrança para todos os anunciantes ativos no mês atual. Deseja continuar?')) return;
    setIsGenerating(true);
    const result = await gerarCobrancasMesAtual();
    setIsGenerating(false);
    if (result.success) {
      alert(`${result.count} anunciantes foram verificados/atualizados com sucesso!`);
      triggerRefresh();
    } else {
      alert('Ocorreu um erro ao gerar cobranças. Verifique o console.');
    }
  };

  const handleAtualizarStatus = async () => {
    if (!window.confirm('Isso irá atualizar o status de pagamentos pendentes com data de vencimento passada para "Atrasado". Deseja continuar?')) return;
    setIsUpdatingStatus(true);
    const result = await atualizarStatusPagamentosAtrasados();
    setIsUpdatingStatus(false);
    if (result.success) {
      alert(`${result.count} pagamentos foram atualizados para "Atrasado".`);
      triggerRefresh();
    } else {
      alert('Ocorreu um erro ao atualizar os status. Verifique o console.');
    }
  };

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
            <ActionButton icon={<DollarSign size={24} />} onClick={onRegisterPaymentClick}>Registrar Pagamento</ActionButton>
            <ActionButton 
                icon={<RefreshCw size={24} className={isGenerating ? 'animate-spin' : ''} />} 
                onClick={handleGerarCobrancas}
                disabled={isGenerating}
            >
                {isGenerating ? 'Gerando...' : 'Gerar Cobranças'}
            </ActionButton>
            <ActionButton 
                icon={<Clock size={24} />} 
                onClick={handleAtualizarStatus}
                disabled={isUpdatingStatus}
            >
                {isUpdatingStatus ? 'Atualizando...' : 'Atualizar Atrasos'}
            </ActionButton>
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