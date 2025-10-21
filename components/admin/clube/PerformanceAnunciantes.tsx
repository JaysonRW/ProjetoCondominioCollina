import React, { useState, useEffect } from 'react';
import { getAdminAnunciantes } from '../../../services/api';
import { Anunciante } from '../../../types/types';
import Skeleton from '../../Skeleton';
import { TrendingUp, Eye } from 'lucide-react';

interface PerformanceAnunciantesProps {
  refreshKey: number;
}

const PerformanceAnunciantes: React.FC<PerformanceAnunciantesProps> = ({ refreshKey }) => {
  const [ranking, setRanking] = useState<Anunciante[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        const data = await getAdminAnunciantes();
        const sorted = [...data].sort((a, b) => b.visualizacoes - a.visualizacoes).slice(0, 5);
        setRanking(sorted);
        setLoading(false);
    }
    fetchData();
  }, [refreshKey]);

  return (
    <div className="bg-white p-4 rounded-lg h-full border border-gray-200 shadow-sm">
      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
        <TrendingUp size={20} className="text-brandGreen"/> Top 5 Anunciantes (Visualizações)
      </h3>
       {loading ? (
        <div className="space-y-2">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
        </div>
      ) : ranking.length > 0 ? (
        <ul className="space-y-2">
            {ranking.map((anunciante, index) => (
                <li key={anunciante.id} className="flex justify-between items-center p-2 rounded-md bg-gray-50">
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-500 text-sm w-5">{index + 1}.</span>
                        <img src={anunciante.logo_url} alt={anunciante.nome_empresa} className="w-8 h-8 rounded-full object-cover"/>
                        <p className="font-semibold text-gray-800">{anunciante.nome_empresa}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-brandGreen">
                        <Eye size={14}/>
                        {anunciante.visualizacoes.toLocaleString('pt-BR')}
                    </div>
                </li>
            ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 text-center py-8">Não há dados de performance para exibir.</p>
      )}
    </div>
  );
};

export default PerformanceAnunciantes;