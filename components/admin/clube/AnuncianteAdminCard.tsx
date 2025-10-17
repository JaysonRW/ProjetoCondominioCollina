import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Anunciante } from '../../../types/types';

interface AnuncianteAdminCardProps {
    anunciante: Anunciante;
    onEdit: (anunciante: Anunciante) => void;
}

const AnuncianteAdminCard: React.FC<AnuncianteAdminCardProps> = ({ anunciante, onEdit }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center border">
        <div>
            <p className="font-semibold text-gray-800">{anunciante.nome_empresa}</p>
            <p className="text-sm text-gray-500">Plano: <span className="font-medium capitalize">{anunciante.plano}</span></p>
        </div>
        <div className="flex items-center gap-3">
            <button onClick={() => onEdit(anunciante)} className="text-blue-600 hover:text-blue-800"><Edit size={20}/></button>
            <button className="text-red-600 hover:text-red-800"><Trash2 size={20}/></button>
        </div>
    </div>
  );
};

export default AnuncianteAdminCard;
