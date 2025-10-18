import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PlusCircle, Search } from 'lucide-react';
import AnuncianteAdminCard from './AnuncianteAdminCard';
import { Anunciante } from '../../../types/types';
import { getAdminAnunciantes, deleteAnunciante } from '../../../services/api';
import Skeleton from '../../Skeleton';

interface AnunciantesClubeProps {
  refreshKey: number;
  onEditAnunciante: (anunciante: Anunciante) => void;
  onCreateAnunciante: () => void;
}

const AnunciantesClube: React.FC<AnunciantesClubeProps> = ({ refreshKey, onEditAnunciante, onCreateAnunciante }) => {
  const [anunciantes, setAnunciantes] = useState<Anunciante[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos'); // todos, ativos, inativos
  const [planoFilter, setPlanoFilter] = useState('todos'); // todos, bronze, prata, ouro, morador

  const loadAnunciantes = useCallback(async () => {
    setLoading(true);
    const data = await getAdminAnunciantes();
    setAnunciantes(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAnunciantes();
  }, [loadAnunciantes, refreshKey]);

  const filteredAnunciantes = useMemo(() => {
    return anunciantes.filter(anunciante => {
      const matchesSearch = anunciante.nome_empresa.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'todos' || (statusFilter === 'ativos' && anunciante.ativo) || (statusFilter === 'inativos' && !anunciante.ativo);
      const matchesPlano = planoFilter === 'todos' || anunciante.plano === planoFilter;
      return matchesSearch && matchesStatus && matchesPlano;
    });
  }, [anunciantes, searchTerm, statusFilter, planoFilter]);

  const handleDelete = async (anunciante: Anunciante) => {
    if (window.confirm(`Tem certeza que deseja excluir o anunciante "${anunciante.nome_empresa}"?`)) {
      const success = await deleteAnunciante(anunciante.id, anunciante.logo_url, anunciante.banner_url);
      if (success) {
        alert('Anunciante excluído com sucesso!');
        loadAnunciantes();
      } else {
        alert('Falha ao excluir anunciante.');
      }
    }
  };
  
  const FilterButton: React.FC<{ value: string, currentFilter: string, setFilter: (val: string) => void, children: React.ReactNode }> = ({ value, currentFilter, setFilter, children }) => (
    <button
        onClick={() => setFilter(value)}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${currentFilter === value ? 'bg-brandGreen text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
    >
        {children}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gerenciar Anunciantes</h2>
        <button onClick={onCreateAnunciante} className="bg-brandGreen text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-brandGreen-dark transition-colors shadow">
          <PlusCircle size={20} /> Adicionar
        </button>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Buscar por nome..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"/>
        </div>
        <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium mr-2">Status:</p>
            <FilterButton value="todos" currentFilter={statusFilter} setFilter={setStatusFilter}>Todos</FilterButton>
            <FilterButton value="ativos" currentFilter={statusFilter} setFilter={setStatusFilter}>Ativos</FilterButton>
            <FilterButton value="inativos" currentFilter={statusFilter} setFilter={setStatusFilter}>Inativos</FilterButton>
        </div>
        <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium mr-2">Plano:</p>
            <FilterButton value="todos" currentFilter={planoFilter} setFilter={setPlanoFilter}>Todos</FilterButton>
            <FilterButton value="morador" currentFilter={planoFilter} setFilter={setPlanoFilter}>Morador</FilterButton>
            <FilterButton value="bronze" currentFilter={planoFilter} setFilter={setPlanoFilter}>Bronze</FilterButton>
            <FilterButton value="prata" currentFilter={planoFilter} setFilter={setPlanoFilter}>Prata</FilterButton>
            <FilterButton value="ouro" currentFilter={planoFilter} setFilter={setPlanoFilter}>Ouro</FilterButton>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
            <Skeleton className="h-24 w-full" />
        ) : filteredAnunciantes.length > 0 ? filteredAnunciantes.map(anunciante => (
          <AnuncianteAdminCard key={anunciante.id} anunciante={anunciante} onEdit={onEditAnunciante} onDelete={handleDelete} />
        )) : (
          <p className="text-gray-500 text-center py-8">Nenhum anunciante encontrado com os filtros aplicados.</p>
        )}
      </div>
    </div>
  );
};

export default AnunciantesClube;