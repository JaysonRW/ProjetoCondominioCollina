import React from 'react';

const PagamentosPendentes: React.FC = () => {
  const pagamentos = [
      { id: 1, nome: 'Pizzaria do Zé', valor: 'R$ 150,00', vencimento: '05/08/2024'},
      { id: 2, nome: 'Salão da Maria', valor: 'R$ 100,00', vencimento: '10/08/2024'},
  ]  
  return (
    <div className="bg-gray-50 p-4 rounded-lg h-full border">
      <h3 className="font-bold text-gray-800 mb-4">Pagamentos Pendentes</h3>
      <div className="space-y-3">
        {pagamentos.map(p => (
            <div key={p.id} className="bg-white p-3 rounded-md border text-sm">
                <p className="font-semibold text-gray-700">{p.nome}</p>
                <p className="text-gray-500">Valor: <span className="font-medium text-red-600">{p.valor}</span></p>
                <p className="text-gray-500">Vencimento: {p.vencimento}</p>
            </div>
        ))}
      </div>
    </div>
  );
};

export default PagamentosPendentes;
