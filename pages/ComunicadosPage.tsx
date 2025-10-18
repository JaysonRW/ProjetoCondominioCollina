// FIX: Corrected React import to fix JSX typing errors and updated hook calls.
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getComunicados } from '../services/api';
import { Comunicado } from '../types/types';
import Modal from '../components/Modal';
import { Search, Tag, Calendar, User } from 'lucide-react';
import { ComunicadoCardSkeleton } from '../components/Skeleton';

const ComunicadosPage: React.FC = () => {
  const [comunicados, setComunicados] = useState<Comunicado[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedComunicado, setSelectedComunicado] = useState<Comunicado | null>(null);

  const loadComunicados = useCallback(async () => {
    setLoading(true);
    const data = await getComunicados();
    setComunicados(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadComunicados();
  }, [loadComunicados]);

  const categories = useMemo(() => {
    const cats = new Set(comunicados.map(c => c.categoria));
    return ['all', ...Array.from(cats)];
  }, [comunicados]);

  const filteredComunicados = useMemo(() => {
    return comunicados.filter(comunicado => {
      const matchesCategory = selectedCategory === 'all' || comunicado.categoria === selectedCategory;
      const matchesSearch = searchTerm === '' || 
        comunicado.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
        comunicado.conteudo.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [comunicados, searchTerm, selectedCategory]);

  const getCategoriaBadgeStyle = (categoria: string) => {
    if (!categoria) {
      return 'bg-gray-100 text-gray-800 border-gray-200';
    }
    switch (categoria.toLowerCase()) {
      case 'urgente':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'aviso':
      case 'evento':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'manutenção':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'informativo':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 font-display">Mural de Comunicados</h1>
          <p className="mt-2 text-lg text-gray-600">Avisos, eventos e informações importantes do condomínio.</p>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por título ou conteúdo..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-auto">
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'Todas as Categorias' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comunicados Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
             Array.from({ length: 6 }).map((_, index) => <ComunicadoCardSkeleton key={index} />)
          ) : (
            filteredComunicados.map(comunicado => (
              <div
                key={comunicado.id}
                onClick={() => setSelectedComunicado(comunicado)}
                className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {comunicado.imagem_url && <img className="h-48 w-full object-cover" src={comunicado.imagem_url} alt={comunicado.titulo} />}
                <div className="p-6">
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${getCategoriaBadgeStyle(comunicado.categoria)}`}>
                    {comunicado.categoria}
                  </span>
                  <h3 className="mt-4 text-xl font-bold text-gray-900 line-clamp-2">{comunicado.titulo}</h3>
                  <p className="mt-2 text-gray-600 text-sm line-clamp-3">{comunicado.conteudo}</p>
                  <div className="mt-4 pt-4 border-t border-gray-200 flex items-center text-xs text-gray-500">
                    <Calendar size={14} className="mr-2" />
                    {new Date(comunicado.data_publicacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
         { !loading && filteredComunicados.length === 0 && (
            <div className="text-center col-span-full bg-white p-12 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-700">Nenhum comunicado encontrado</h3>
                <p className="text-gray-500 mt-2">Tente ajustar seus filtros de busca.</p>
            </div>
         )}
      </div>

      {/* Modal para ver comunicado */}
      {selectedComunicado && (
        <Modal
          isOpen={!!selectedComunicado}
          onClose={() => setSelectedComunicado(null)}
          title={selectedComunicado.titulo}
        >
          {selectedComunicado.imagem_url && <img className="h-64 w-full object-cover rounded-lg mb-6" src={selectedComunicado.imagem_url} alt={selectedComunicado.titulo} />}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 mb-4">
            <span className={`flex items-center px-3 py-1 rounded-full ${getCategoriaBadgeStyle(selectedComunicado.categoria)}`}>
                <Tag size={14} className="mr-1.5" /> {selectedComunicado.categoria}
            </span>
            <span className="flex items-center">
                <Calendar size={14} className="mr-1.5" /> Publicado em {new Date(selectedComunicado.data_publicacao).toLocaleString('pt-BR')}
            </span>
            <span className="flex items-center">
                <User size={14} className="mr-1.5" /> Por {selectedComunicado.autor}
            </span>
          </div>
          <div className="prose max-w-none text-gray-800 whitespace-pre-wrap">{selectedComunicado.conteudo}</div>
        </Modal>
      )}
    </div>
  );
};

export default ComunicadosPage;
