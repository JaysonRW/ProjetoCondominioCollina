import React from 'react';
import DashboardClube from '../components/admin/clube/DashboardClube';
import AnunciantesClube from '../components/admin/clube/AnunciantesClube';

const ClubeAdminPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-display mb-6">
        Admin - Clube de Vantagens
      </h1>
      
      <div className="space-y-8">
        <DashboardClube />
        <AnunciantesClube />
      </div>
    </div>
  );
};

export default ClubeAdminPage;
