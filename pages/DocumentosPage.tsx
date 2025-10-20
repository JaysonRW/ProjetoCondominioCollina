import React, { useState, useEffect, useMemo } from 'react';
import { getDocumentos } from '../services/api';
import { Documento } from '../types/types';
import { Search, FileText, Download, Calendar, Folder } from 'lucide-react';
import Skeleton from '../components/Skeleton';

const DocumentoSkeleton: React.FC = () => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
            <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        </div>
        <Skeleton className="h-10 w-28 rounded-md" />
    </div>
);


const DocumentosPage: React.FC = () => {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const loadDocumentos = async () => {
      setLoading(true);
      const data = await getDocumentos();
      setDocumentos(data);
      setLoading(false);
    };
    loadDocumentos();
  }, []);

  const categories = useMemo(() => {
    if (loading) return [];
    const cats = new Set(documentos.map(d => d.categoria));
    return ['all', ...Array.from(cats)];
  }, [documentos, loading]);

  const filteredDocumentos = useMemo(() => {
    return documentos.filter(doc => {
      const matchesCategory = selectedCategory === 'all' || doc.categoria === selectedCategory;
      const matchesSearch = searchTerm === '' || 
        doc.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (doc.descricao && doc.descricao.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [documentos, searchTerm, selectedCategory]);

  return (
    <>
      <section className="py-16 bg-brandGreen-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white font-display">Central de Documentos</h1>
          <p className="mt-4 text-lg text-white/90">
            Acesse atas de reunião, regulamentos, balancetes e outros documentos importantes.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 -mt-12">
        <div className="bg-white p-4 rounded-lg shadow-md mb-8 sticky top-24 z-30 flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por título ou descrição..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-brandGreen focus:border-brandGreen"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-auto">
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brandGreen focus:border-brandGreen bg-white"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              aria-label="Filtrar por categoria"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'Todas as Categorias' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => <DocumentoSkeleton key={index} />)
          ) : filteredDocumentos.length > 0 ? (
            filteredDocumentos.map(doc => (
              <div key={doc.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-brandGreen-light text-brandGreen-dark p-3 rounded-lg flex-shrink-0">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{doc.titulo}</h3>
                    <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-1 mt-1">
                        <span className="flex items-center gap-1.5"><Folder size={14} /> {doc.categoria}</span>
                        <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(doc.data_upload).toLocaleDateString('pt-BR')}</span>
                    </div>
                     {doc.descricao && <p className="text-sm text-gray-600 mt-2">{doc.descricao}</p>}
                  </div>
                </div>
                <a
                  href={doc.url_arquivo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brandLime hover:bg-opacity-90 text-brandGreen-dark font-bold py-2 px-5 rounded-md transition-all inline-flex items-center justify-center gap-2 w-full sm:w-auto flex-shrink-0 group"
                >
                  <Download size={18} className="transition-transform group-hover:translate-y-0.5" />
                  Baixar
                </a>
              </div>
            ))
          ) : (
            <div className="text-center bg-white p-12 rounded-lg shadow-sm">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">Nenhum documento encontrado</h3>
              <p className="text-gray-500 mt-2">Tente buscar por outros termos ou selecionar uma categoria diferente.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DocumentosPage;