import React, { useEffect, useState } from 'react';
import { getFinanceiroClube, getAdminAnunciantes } from '../../../services/api';
import { FinanceiroClube } from '../../../types/types';
import { TrendingUp, Store, DollarSign, AlertTriangle } from 'lucide-react';
import Skeleton from '../../Skeleton';

interface DashboardMetrics {
  receitaMensal: number;
  totalAnunciantes: number;
  pagamentosPendentes: number;
  ganhoGestor: number;
}

const DashboardCards: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const mesAtual = new Date().toISOString().slice(0, 7);
        const financeiroData = await getFinanceiroClube();
        const anunciantesData = await getAdminAnunciantes();

        const receitaMensal = financeiroData
          .filter(f => f.mes_referencia.startsWith(mesAtual) && f.status === 'pago')
          .reduce((acc, r) => acc + Number(r.valor_pago || 0), 0);

        const ganhoGestor = receitaMensal * 0.5; // Assumindo 50%

        const pagamentosPendentes = financeiroData
          .filter(f => f.status === 'pendente' || f.status === 'atrasado').length;
          
        const totalAnunciantes = anunciantesData.filter(a => a.ativo).length;

        setMetrics({
          receitaMensal,
          totalAnunciantes,
          pagamentosPendentes,
          ganhoGestor
        });

      } catch (error) {
        console.error('Erro ao buscar métricas:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
      </div>
    );
  }

  if (!metrics) return <p>Não foi possível carregar as métricas.</p>;

  const cards = [
    {
      title: 'Receita Mensal',
      value: `R$ ${metrics.receitaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Anunciantes Ativos',
      value: metrics.totalAnunciantes.toString(),
      icon: Store,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
     {
      title: 'Seu Ganho (Mês)',
      value: `R$ ${metrics.ganhoGestor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Pagamentos Pendentes',
      value: metrics.pagamentosPendentes.toString(),
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
            </div>
            <div className={`p-3 rounded-full ${card.bgColor}`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashboardCards;
