// FIX: Corrected React import to fix JSX typing errors and updated hook calls.
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createComunicado, getComunicados } from '../services/api';
import { Comunicado } from '../types/types';
import Modal from '../components/Modal';
import { Search, Tag, Calendar, User, PlusCircle, UploadCloud, FileImage } from 'lucide-react';
import { ComunicadoCardSkeleton } from '../components/Skeleton';

const ComunicadosPage: React.FC = () => {
  const [comunicados, setComunicados] = useState<Comunicado[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedComunicado, setSelectedComunicado] = useState<Comunicado | null>(null);

  // State for creating new comunicado
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newComunicadoData, setNewComunicadoData] = useState({
    titulo: '',
    conteudo: '',
    categoria: 'informativo',
    autor: 'Administração', // Hardcoded for now
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    switch (categoria) {
      case 'urgente': return 'bg-red-100 text-red-800 border-red-200';
      case 'evento': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewComunicadoData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    } else {
      setImageFile(null);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await createComunicado(newComunicadoData, imageFile || undefined);

    if (result) {
      alert('Comunicado criado com sucesso!');
      setIsCreateModalOpen(false);
      setNewComunicadoData({ titulo: '', conteudo: '', categoria: 'informativo', autor: 'Administração' });
      setImageFile(null);
      await loadComunicados(); // Refresh list
    } else {
      alert('Falha ao criar comunicado. Tente novamente.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 font-display">Mural de Comunicados</h1>
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
          <div className="w-full md:w-auto">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full bg-brandGreen text-white font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-brandGreen-dark transition-colors"
            >
              <PlusCircle size={20} />
              Novo Comunicado
            </button>
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

      {/* Modal para criar comunicado */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Criar Novo Comunicado"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-6">
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título</label>
            <input type="text" name="titulo" id="titulo" required value={newComunicadoData.titulo} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandGreen focus:border-brandGreen"/>
          </div>
          <div>
            <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoria</label>
            <select name="categoria" id="categoria" value={newComunicadoData.categoria} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brandGreen focus:border-brandGreen">
              <option value="informativo">Informativo</option>
              <option value="evento">Evento</option>
              <option value="urgente">Urgente</option>
              <option value="manutenção">Manutenção</option>
            </select>
          </div>
          <div>
            <label htmlFor="conteudo" className="block text-sm font-medium text-gray-700">Conteúdo</label>
            <textarea name="conteudo" id="conteudo" rows={5} required value={newComunicadoData.conteudo} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandGreen focus:border-brandGreen"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Imagem (Opcional)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {imageFile ? (
                  <>
                    <FileImage className="mx-auto h-12 w-12 text-brandGreen" />
                    <p className="text-sm text-gray-600">{imageFile.name}</p>
                    <button type="button" onClick={() => setImageFile(null)} className="text-xs text-red-500 hover:underline">Remover</button>
                  </>
                ) : (
                  <>
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brandGreen hover:text-brandGreen-dark focus-within:outline-none">
                        <span>Carregar um arquivo</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*"/>
                      </label>
                      <p className="pl-1">ou arraste e solte</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="bg-brandGreen text-white px-4 py-2 rounded-md hover:bg-brandGreen-dark transition-colors disabled:bg-gray-400">
              {isSubmitting ? 'Publicando...' : 'Publicar Comunicado'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ComunicadosPage;
