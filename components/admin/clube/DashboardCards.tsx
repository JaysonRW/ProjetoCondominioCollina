import React, { useEffect, useState } from 'react';
import { getFinanceiroClube, getAdminAnunciantes } from '../../../services/api';
import { TrendingUp, Store, DollarSign, AlertTriangle, Eye, MousePointer } from 'lucide-react';
import Skeleton from '../../Skeleton';

interface DashboardMetrics {
  receitaMensal: number;
  receitaPotencialMensal: number;
  ganhoGestorMensal: number;
  ganhoCondominioMensal: number;
  totalAnunciantesAtivos: number;
  pagamentosPendentes: number; // Count
  valorPendente: number; // Sum
  anunciantesPagantesEsteMes: number;
  receitaMediaPorAnunciante: number;
  crescimentoReceitaPercentual: number;
  crescimentoGanhoPercentual: number;
  totalVisualizacoes: number;
  mediaVisualizacoesPorAnunciante: number;
  totalCliques: number;
  mediaCliquesPorAnunciante: number;
}

interface DashboardCardsProps {
  refreshKey: number;
}

const MetricCard: React.FC<{ title: string; value: string; icon: React.ElementType; color: string; bgColor: string; }> = ({ title, value, icon: Icon, color, bgColor }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
            </div>
            <div className={`p-3 rounded-full ${bgColor}`}>
                <Icon className={`w-6 h-6 ${color}`} />
            </div>
        </div>
    </div>
);

const DashboardCards: React.FC<DashboardCardsProps> = ({ refreshKey }) => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      setLoading(true);
      try {
        const today = new Date();
        const currentMonthStr = today.toISOString().slice(0, 7);
        const prevMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const prevMonthStr = prevMonthDate.toISOString().slice(0, 7);

        const [financeiroData, anunciantesData] = await Promise.all([
            getFinanceiroClube(),
            getAdminAnunciantes()
        ]);
        
        const pagamentosDoMesCorrente = financeiroData.filter(f => 
            f.mes_referencia.startsWith(currentMonthStr)
        );

        const pagamentosRecebidosEsteMes = pagamentosDoMesCorrente.filter(f => f.status === 'pago');
        const receitaMensal = pagamentosRecebidosEsteMes.reduce((acc, r) => acc + Number(r.valor_pago || 0), 0);
        
        const receitaPotencialMensal = pagamentosDoMesCorrente.reduce((acc, r) => acc + r.valor_contratado, 0);

        const pagamentosPendentesDoMes = pagamentosDoMesCorrente.filter(f => f.status === 'pendente' || f.status === 'atrasado');
        const valorPendente = pagamentosPendentesDoMes.reduce((acc, r) => acc + r.valor_contratado, 0);
        
        const receitaPagaMesAnterior = financeiroData
          .filter(f => f.mes_referencia.startsWith(prevMonthStr) && f.status === 'pago')
          .reduce((acc, r) => acc + Number(r.valor_pago || 0), 0);
        
        const ganhoGestorMensal = receitaMensal * 0.6; // 60% para o gestor
        const ganhoCondominioMensal = receitaMensal - ganhoGestorMensal; // 40% para o condomínio
        const ganhoGestorMesAnterior = receitaPagaMesAnterior * 0.6;
        
        let crescimentoReceitaPercentual = 0;
        if (receitaPagaMesAnterior > 0) {
            crescimentoReceitaPercentual = ((receitaMensal - receitaPagaMesAnterior) / receitaPagaMesAnterior) * 100;
        } else if (receitaMensal > 0) {
            crescimentoReceitaPercentual = 100;
        }

        let crescimentoGanhoPercentual = 0;
        if (ganhoGestorMesAnterior > 0) {
            crescimentoGanhoPercentual = ((ganhoGestorMensal - ganhoGestorMesAnterior) / ganhoGestorMesAnterior) * 100;
        } else if (ganhoGestorMensal > 0) {
            crescimentoGanhoPercentual = 100;
        }

        const anunciantesPagantesEsteMes = new Set(pagamentosRecebidosEsteMes.map(p => p.anunciante_id)).size;
        const receitaMediaPorAnunciante = anunciantesPagantesEsteMes > 0 ? receitaMensal / anunciantesPagantesEsteMes : 0;
        
        const totalAnunciantesAtivos = anunciantesData.filter(a => a.ativo).length;

        const totalVisualizacoes = anunciantesData.reduce((acc, a) => acc + (a.visualizacoes || 0), 0);
        const mediaVisualizacoesPorAnunciante = totalAnunciantesAtivos > 0 ? totalVisualizacoes / totalAnunciantesAtivos : 0;

        const totalCliques = anunciantesData.reduce((acc, a) => acc + (a.cliques || 0), 0);
        const mediaCliquesPorAnunciante = totalAnunciantesAtivos > 0 ? totalCliques / totalAnunciantesAtivos : 0;

        setMetrics({
          receitaMensal,
          receitaPotencialMensal,
          ganhoGestorMensal,
          ganhoCondominioMensal,
          totalAnunciantesAtivos,
          pagamentosPendentes: pagamentosPendentesDoMes.length,
          valorPendente,
          anunciantesPagantesEsteMes,
          receitaMediaPorAnunciante,
          crescimentoReceitaPercentual,
          crescimentoGanhoPercentual,
          totalVisualizacoes,
          mediaVisualizacoesPorAnunciante,
          totalCliques,
          mediaCliquesPorAnunciante
        });

      } catch (error) {
        console.error('Erro ao buscar métricas do dashboard:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-40" />)}
      </div>
    );
  }

  if (!metrics) return <p>Não foi possível carregar as métricas.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Receita Potencial (Mês) Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-600">Receita Potencial (Mês)</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                    {`R$ ${metrics.receitaPotencialMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                    Soma de todos os contratos para o mês corrente.
                </p>
            </div>
        </div>
        
        {/* Receita Mensal Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex justify-between items-start mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                {isFinite(metrics.crescimentoReceitaPercentual) && (
                    <span className={`flex items-center text-sm font-semibold ${metrics.crescimentoReceitaPercentual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <TrendingUp size={16} className="mr-1"/>
                        {metrics.crescimentoReceitaPercentual > 0 ? '+' : ''}{metrics.crescimentoReceitaPercentual.toFixed(1)}%
                    </span>
                )}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-600">Receita Mensal (Paga)</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                    {`R$ ${metrics.receitaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                </p>
                {metrics.anunciantesPagantesEsteMes > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                        {`${metrics.anunciantesPagantesEsteMes} anunciantes × média R$ ${metrics.receitaMediaPorAnunciante.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    </p>
                )}
            </div>
        </div>
        
        {/* Seu Ganho (Mês) Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex justify-between items-start mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                {isFinite(metrics.crescimentoGanhoPercentual) && (
                    <span className={`flex items-center text-sm font-semibold ${metrics.crescimentoGanhoPercentual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <TrendingUp size={16} className="mr-1"/>
                        {metrics.crescimentoGanhoPercentual > 0 ? '+' : ''}{metrics.crescimentoGanhoPercentual.toFixed(1)}%
                    </span>
                )}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-600">Seu Ganho (Mês)</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                    {`R$ ${metrics.ganhoGestorMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                    60% da receita total • Condomínio: R$ {metrics.ganhoCondominioMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
            </div>
        </div>

        {/* Visualizações Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-4 mb-4">
                <div className="bg-indigo-100 p-3 rounded-lg">
                    <Eye className="w-6 h-6 text-indigo-600" />
                </div>
                <p className="text-lg font-semibold text-gray-700">Visualizações</p>
            </div>
            <div>
                <p className="text-3xl font-bold text-gray-900">
                    {metrics.totalVisualizacoes.toLocaleString('pt-BR')}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                    Média {Math.round(metrics.mediaVisualizacoesPorAnunciante)} por anunciante
                </p>
            </div>
        </div>
        
        {/* Cliques Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-4 mb-4">
                <div className="bg-cyan-100 p-3 rounded-lg">
                    <MousePointer className="w-6 h-6 text-cyan-600" />
                </div>
                <p className="text-lg font-semibold text-gray-700">Cliques</p>
            </div>
            <div>
                <p className="text-3xl font-bold text-gray-900">
                    {metrics.totalCliques.toLocaleString('pt-BR')}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                    Média {Math.round(metrics.mediaCliquesPorAnunciante)} por anunciante
                </p>
            </div>
        </div>

        <MetricCard
            title="Anunciantes Ativos"
            value={metrics.totalAnunciantesAtivos.toString()}
            icon={Store}
            color="text-blue-600"
            bgColor="bg-blue-100"
        />

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex justify-between items-start mb-4">
                <div className="bg-red-100 p-3 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-600">Valor Pendente</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                    {`R$ ${metrics.valorPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                    {`em ${metrics.pagamentosPendentes} ${metrics.pagamentosPendentes === 1 ? 'fatura' : 'faturas'}`}
                </p>
            </div>
        </div>
    </div>
  );
}

export default DashboardCards;