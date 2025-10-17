import React from 'react';
import { Edit, Trash2, Ticket } from 'lucide-react';
import { Anunciante } from '../../../types/types';

interface AnuncianteAdminCardProps {
    anunciante: Anunciante;
    onEdit: (anunciante: Anunciante) => void;
    onDelete: (anunciante: Anunciante) => void;
}

const PlanoBadge: React.FC<{ plano: Anunciante['plano'] }> = ({ plano }) => {
    const styles = {
        bronze: 'bg-orange-100 text-orange-800',
        prata: 'bg-gray-200 text-gray-800',
        ouro: 'bg-yellow-100 text-yellow-800',
    };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[plano]}`}>{plano}</span>;
};


const AnuncianteAdminCard: React.FC<AnuncianteAdminCardProps> = ({ anunciante, onEdit, onDelete }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center border gap-4">
        <div className="flex items-center gap-4">
            <img src={anunciante.logo_url} alt={anunciante.nome_empresa} className="w-12 h-12 rounded-full object-cover"/>
            <div>
                <p className="font-semibold text-gray-800 flex items-center gap-2">
                    {anunciante.nome_empresa}
                    <span className={`w-3 h-3 rounded-full ${anunciante.ativo ? 'bg-green-500' : 'bg-red-500'}`} title={anunciante.ativo ? 'Ativo' : 'Inativo'}></span>
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <PlanoBadge plano={anunciante.plano} />
                    <span>|</span>
                    <span>{anunciante.categorias_anunciantes?.nome || 'Sem categoria'}</span>
                    <span>|</span>
                    <span className="flex items-center gap-1"><Ticket size={14}/> {anunciante.cupons_desconto?.length || 0}</span>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto justify-end">
            <button onClick={() => onEdit(anunciante)} className="text-blue-600 hover:text-blue-800 p-2 rounded-md hover:bg-blue-100 transition-colors"><Edit size={20}/></button>
            <button onClick={() => onDelete(anunciante)} className="text-red-600 hover:text-red-800 p-2 rounded-md hover:bg-red-100 transition-colors"><Trash2 size={20}/></button>
        </div>
    </div>
  );
};

export default AnuncianteAdminCard;