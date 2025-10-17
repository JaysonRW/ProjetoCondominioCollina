import React from 'react';
import { Users, DollarSign, Activity, CreditCard } from 'lucide-react';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-4 border">
        <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);


const DashboardCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Total de Anunciantes" value="12" icon={<Users size={24} />} />
      <StatCard title="Receita Mensal" value="R$ 1.250" icon={<DollarSign size={24} />} />
      <StatCard title="Visualizações Totais" value="15.2k" icon={<Activity size={24} />} />
      <StatCard title="Pagamentos Pendentes" value="2" icon={<CreditCard size={24} />} />
    </div>
  );
};

export default DashboardCards;
