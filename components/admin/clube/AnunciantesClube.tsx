import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import Modal from '../../Modal';
import AnuncianteForm from './AnuncianteForm';
import AnuncianteAdminCard from './AnuncianteAdminCard';
import { Anunciante } from '../../../types/types'; // Assuming types are defined

const AnunciantesClube: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnunciante, setEditingAnunciante] = useState<Anunciante | null>(null);

  const handleEdit = (anunciante: Anunciante) => {
    setEditingAnunciante(anunciante);
    setIsModalOpen(true);
  };
  
  const handleCreate = () => {
    setEditingAnunciante(null);
    setIsModalOpen(true);
  };

  const MOCK_ANUNCIANTES: Anunciante[] = []; // In a real app, this would be fetched from an API

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Gerenciar Anunciantes</h2>
        <button onClick={handleCreate} className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
          <PlusCircle size={20} /> Adicionar Anunciante
        </button>
      </div>

      <div className="space-y-4">
        {MOCK_ANUNCIANTES.length > 0 ? MOCK_ANUNCIANTES.map(anunciante => (
          <AnuncianteAdminCard key={anunciante.id} anunciante={anunciante} onEdit={handleEdit} />
        )) : (
          <p className="text-gray-500 text-center py-8">Nenhum anunciante cadastrado.</p>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAnunciante ? 'Editar Anunciante' : 'Novo Anunciante'}
      >
        <AnuncianteForm 
            anunciante={editingAnunciante} 
            onSuccess={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
};

export default AnunciantesClube;
