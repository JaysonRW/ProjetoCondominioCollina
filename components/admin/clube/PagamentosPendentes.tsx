import React, { useState, useEffect } from 'react';
import { getFinanceiroClube } from '../../../services/api';
import { FinanceiroClube } from '../../../types/types';
import Skeleton from '../../Skeleton';

interface PagamentosPendentesProps {
  refreshKey: number;
}

const PagamentosPendentes: React.FC<PagamentosPendentesProps> = ({ refreshKey }) => {
  const [pendentes, setPendentes] = useState<FinanceiroClube[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        const data = await getFinanceiroClube();
        const filtered = data.filter(p => p.status === 'pendente' || p.status === 'atrasado');
        setPendentes(filtered);
        setLoading(false);
    }
    fetchData();
  }, [refreshKey]);

  return (
    <div className="bg-white p-4 rounded-lg h-full border border-gray-200 shadow-sm">
      <h3 className="font-bold text-gray-800 mb-4">Pagamentos Pendentes</h3>
      {loading ? (
        <div className="space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
        </div>
      ) : pendentes.length > 0 ? (
        <div className="space-y-3">
            {pendentes.map(p => (
                <div key={p.id} className="bg-gray-50 p-3 rounded-md border text-sm">
                    <p className="font-semibold text-gray-700">{p.anunciantes.nome_empresa}</p>
                    <p className="text-gray-500">Valor: <span className="font-medium text-red-600">R$ {p.valor_contratado.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span></p>
                    <p className={`text-xs font-semibold ${p.status === 'atrasado' ? 'text-red-700' : 'text-yellow-700'}`}>
                        {p.status.toUpperCase()}
                    </p>
                </div>
            ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center py-8">Nenhum pagamento pendente.</p>
      )}
    </div>
  );
};

export default PagamentosPendentes;