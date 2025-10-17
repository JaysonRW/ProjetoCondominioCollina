import React from 'react';
import DashboardCards from './DashboardCards';
import PagamentosPendentes from './PagamentosPendentes';
import PerformanceAnunciantes from './PerformanceAnunciantes';

const DashboardClube: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
       <h2 className="text-xl font-bold text-gray-800 mb-4">Dashboard</h2>
       <div className="space-y-6">
            <DashboardCards />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                <PerformanceAnunciantes />
                </div>
                <div>
                <PagamentosPendentes />
                </div>
            </div>
        </div>
    </div>
  );
};

export default DashboardClube;
