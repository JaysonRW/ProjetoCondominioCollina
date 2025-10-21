import React, { useState, useEffect, useCallback } from 'react';
import { getFinanceiroClube, marcarPagamentoComoRecebido } from '../../../services/api';
import { FinanceiroClube } from '../../../types/types';
import Skeleton from '../../Skeleton';
import { CheckCircle, DollarSign, Send, Bell } from 'lucide-react';

interface PagamentosManagerProps {
  onSuccess: () => void;
}

const PagamentosManager: React.FC<PagamentosManagerProps> = ({ onSuccess }) => {
  const [pagamentosDoMes, setPagamentosDoMes] = useState<FinanceiroClube[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchPagamentos = useCallback(async () => {
    setLoading(true);
    const data = await getFinanceiroClube();
    const currentMonthStr = new Date().toISOString().slice(0, 7);
    
    const doMes = data
      .filter(p => p.mes_referencia.startsWith(currentMonthStr))
      .sort((a, b) => (a.status === 'pago' ? 1 : -1) || a.anunciantes.nome_empresa.localeCompare(b.anunciantes.nome_empresa));

    setPagamentosDoMes(doMes);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPagamentos();
  }, [fetchPagamentos]);

  const handleMarcarComoPago = async (pagamento: FinanceiroClube) => {
    if (updatingId) return;
    setUpdatingId(pagamento.id);
    const result = await marcarPagamentoComoRecebido(pagamento.id, pagamento.valor_contratado);
    if (result) {
      await fetchPagamentos(); // Refresh the list in the modal
      onSuccess(); // Refresh the dashboard in the background
    } else {
      alert('Falha ao registrar pagamento.');
    }
    setUpdatingId(null);
  };

  const handlePlaceholderClick = (action: string) => {
    alert(`A funcionalidade "${action}" será implementada em breve.`);
  }

  const StatusBadge: React.FC<{ status: FinanceiroClube['status'] }> = ({ status }) => {
    const styles = {
      pendente: 'bg-yellow-100 text-yellow-800',
      atrasado: 'bg-red-100 text-red-800',
      pago: 'bg-green-100 text-green-800',
      cancelado: 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${styles[status]}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
        <div className="space-y-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
      <p className="text-sm text-gray-600 mb-4">Gerencie os pagamentos do mês corrente. Registre os recebimentos para atualizar o dashboard financeiro.</p>
      {pagamentosDoMes.length > 0 ? (
        pagamentosDoMes.map(pagamento => (
          <div key={pagamento.id} className="bg-gray-50 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between border gap-3">
            <div className="flex-grow">
              <p className="font-semibold text-gray-800">{pagamento.anunciantes.nome_empresa}</p>
              <p className="text-sm text-gray-600">
                Valor: <span className="font-bold">R$ {pagamento.valor_contratado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </p>
              <div className="mt-1">
                <StatusBadge status={pagamento.status} />
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
              {pagamento.status === 'pago' ? (
                 <span className="w-full sm:w-auto text-center bg-green-200 text-green-800 font-semibold px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-sm cursor-default">
                    <CheckCircle size={16} /> Pago
                </span>
              ) : (
                <>
                  <button
                    onClick={() => handleMarcarComoPago(pagamento)}
                    disabled={updatingId === pagamento.id}
                    className="flex-1 bg-green-600 text-white font-semibold px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 hover:bg-green-700 transition-colors disabled:bg-gray-400 text-sm"
                  >
                    <CheckCircle size={16} />
                    {updatingId === pagamento.id ? '...' : 'Registrar'}
                  </button>
                   <button
                    onClick={() => handlePlaceholderClick('Cobrar')}
                    className="flex-1 bg-orange-500 text-white font-semibold px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 hover:bg-orange-600 transition-colors text-sm"
                  >
                    <Send size={16} /> Cobrar
                  </button>
                   <button
                    onClick={() => handlePlaceholderClick('Lembrar')}
                    className="flex-1 bg-blue-500 text-white font-semibold px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 hover:bg-blue-600 transition-colors text-sm"
                  >
                    <Bell size={16} /> Lembrar
                  </button>
                </>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
            <DollarSign size={40} className="mx-auto text-gray-300 mb-2" />
            <p className="text-gray-600 font-medium">Nenhum faturamento este mês</p>
            <p className="text-sm text-gray-500">Não há registros financeiros para o mês atual.</p>
        </div>
      )}
    </div>
  );
};

export default PagamentosManager;