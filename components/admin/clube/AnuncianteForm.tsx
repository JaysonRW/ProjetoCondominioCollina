import React, { useState } from 'react';
import { Anunciante } from '../../../types/types';

interface AnuncianteFormProps {
  anunciante: Anunciante | null;
  onSuccess: () => void;
}

const AnuncianteForm: React.FC<AnuncianteFormProps> = ({ anunciante, onSuccess }) => {
  const [formData, setFormData] = useState({
    nome_empresa: anunciante?.nome_empresa || '',
    plano: anunciante?.plano || 'bronze',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to create/update advertiser would go here
    console.log('Submitting form data:', formData);
    alert('Funcionalidade ainda não implementada.');
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nome_empresa" className="block text-sm font-medium text-gray-700">Nome da Empresa</label>
        <input
          type="text"
          id="nome_empresa"
          value={formData.nome_empresa}
          onChange={(e) => setFormData({ ...formData, nome_empresa: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
      <div>
        <label htmlFor="plano" className="block text-sm font-medium text-gray-700">Plano</label>
        <select
          id="plano"
          value={formData.plano}
          onChange={(e) => setFormData({ ...formData, plano: e.target.value as any })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="bronze">Bronze</option>
          <option value="prata">Prata</option>
          <option value="ouro">Ouro</option>
        </select>
      </div>
      <div className="pt-4 flex justify-end gap-3">
        <button type="button" onClick={onSuccess} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
          Cancelar
        </button>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Salvar
        </button>
      </div>
    </form>
  );
};

export default AnuncianteForm;
