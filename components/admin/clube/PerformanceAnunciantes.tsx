import React from 'react';
import { BarChart } from 'lucide-react';

const PerformanceAnunciantes: React.FC = () => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg h-full border">
      <h3 className="font-bold text-gray-800 mb-4">Performance dos Anunciantes (Visualizações)</h3>
      <div className="flex items-center justify-center h-48 bg-gray-200 rounded-md">
        <div className="text-center text-gray-500">
            <BarChart size={40} className="mx-auto mb-2" />
            <p>Gráfico de performance indisponível.</p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnunciantes;
