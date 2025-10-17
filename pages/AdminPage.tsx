import React, { useState, useEffect, useCallback } from 'react';
import { LogOut, PlusCircle, UploadCloud, FileImage, Bell, ImageIcon, Calendar, FileText, HelpCircle, Edit, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';
import { 
  createComunicado, 
  getFaqs, createFaq, updateFaq, deleteFaq, 
  getEventos, createEvento, updateEvento, deleteEvento,
  getDocumentos, createDocumento, deleteDocumento,
  getImagensGaleria, createImagemGaleria, deleteImagemGaleria,
  getComunicados,
  updateComunicado,
  deleteComunicado
} from '../services/api';
import { Faq, Evento, Documento, GaleriaImagem, Comunicado } from '../types/types';
import Skeleton from '../components/Skeleton';

interface AdminPageProps {
  onLogout: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('comunicados');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for Comunicados
  const [comunicados, setComunicados] = useState<Comunicado[]>([]);
  const [loadingComunicados, setLoadingComunicados] = useState(false);
  const [isComunicadoModalOpen, setIsComunicadoModalOpen] = useState(false);
  const [currentComunicado, setCurrentComunicado] = useState<Partial<Comunicado>>({});
  const [isEditingComunicado, setIsEditingComunicado] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // State for FAQ
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loadingFaqs, setLoadingFaqs] = useState(false);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [currentFaq, setCurrentFaq] = useState<Partial<Faq>>({});
  const [isEditingFaq, setIsEditingFaq] = useState(false);
  
  // State for Eventos
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loadingEventos, setLoadingEventos] = useState(false);
  const [isEventoModalOpen, setIsEventoModalOpen] = useState(false);
  const [currentEvento, setCurrentEvento] = useState<Partial<Evento>>({});
  const [isEditingEvento, setIsEditingEvento] = useState(false);
  const [eventoImageFile, setEventoImageFile] = useState<File | null>(null);

  // State for Documentos
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loadingDocumentos, setLoadingDocumentos] = useState(false);
  const [isDocumentoModalOpen, setIsDocumentoModalOpen] = useState(false);
  const [newDocumentoData, setNewDocumentoData] = useState({
    titulo: '', descricao: '', categoria: 'Atas',
  });
  const [documentoFile, setDocumentoFile] = useState<File | null>(null);

  // State for Galeria
  const [imagensGaleria, setImagensGaleria] = useState<GaleriaImagem[]>([]);
  const [loadingGaleria, setLoadingGaleria] = useState(false);
  const [isGaleriaModalOpen, setIsGaleriaModalOpen] = useState(false);
  const [newImagemData, setNewImagemData] = useState({
    titulo: '', descricao: '', album: 'Geral',
  });
  const [imagemGaleriaFile, setImagemGaleriaFile] = useState<File | null>(null);

  const loadComunicados = useCallback(async () => {
    setLoadingComunicados(true);
    const data = await getComunicados({ isAdmin: true });
    setComunicados(data);
    setLoadingComunicados(false);
  }, []);

  const loadFaqs = useCallback(async () => {
    setLoadingFaqs(true);
    const data = await getFaqs(true); // admin fetches all
    setFaqs(data);
    setLoadingFaqs(false);
  }, []);
  
  const loadEventos = useCallback(async () => {
    setLoadingEventos(true);
    const data = await getEventos(true);
    setEventos(data);
    setLoadingEventos(false);
  }, []);

  const loadDocumentos = useCallback(async () => {
    setLoadingDocumentos(true);
    const data = await getDocumentos();
    setDocumentos(data);
    setLoadingDocumentos(false);
  }, []);

  const loadImagensGaleria = useCallback(async () => {
    setLoadingGaleria(true);
    const data = await getImagensGaleria();
    setImagensGaleria(data);
    setLoadingGaleria(false);
  }, []);

  useEffect(() => {
    if (activeTab === 'comunicados') {
      loadComunicados();
    }
    if (activeTab === 'faq') {
      loadFaqs();
    }
    if (activeTab === 'eventos') {
      loadEventos();
    }
    if (activeTab === 'documentos') {
      loadDocumentos();
    }
    if (activeTab === 'galeria') {
      loadImagensGaleria();
    }
  }, [activeTab, loadComunicados, loadFaqs, loadEventos, loadDocumentos, loadImagensGaleria]);

  const openComunicadoModal = (comunicado?: Comunicado) => {
    if (comunicado) {
        setCurrentComunicado(comunicado);
        setIsEditingComunicado(true);
    } else {
        setCurrentComunicado({ titulo: '', conteudo: '', categoria: 'Informativo', autor: 'Administração', ativo: true });
        setIsEditingComunicado(false);
    }
    setImageFile(null);
    setIsComunicadoModalOpen(true);
  };

  const handleComunicadoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    let success = false;
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, data_publicacao, ...comunicadoData } = currentComunicado;

    if (isEditingComunicado && id) {
        const result = await updateComunicado(id, comunicadoData, imageFile || undefined);
        if (result) success = true;
    } else {
        const result = await createComunicado(comunicadoData as Omit<Comunicado, 'id' | 'data_publicacao' | 'ativo'>, imageFile || undefined);
        if (result) success = true;
    }

    if (success) {
        alert(`Comunicado ${isEditingComunicado ? 'atualizado' : 'criado'} com sucesso!`);
        setIsComunicadoModalOpen(false);
        loadComunicados();
    } else {
        alert('Ocorreu um erro. Tente novamente.');
    }
    setIsSubmitting(false);
  };
  
  const handleComunicadoDelete = async (id: string, imagem_url?: string) => {
    if (window.confirm('Tem certeza que deseja excluir este comunicado?')) {
      const success = await deleteComunicado(id, imagem_url);
      if (success) {
        alert('Comunicado excluído com sucesso!');
        loadComunicados();
      } else {
        alert('Falha ao excluir o comunicado.');
      }
    }
  };

  const openFaqModal = (faq?: Faq) => {
    if (faq) {
      setCurrentFaq(faq);
      setIsEditingFaq(true);
    } else {
      setCurrentFaq({ pergunta: '', resposta: '', ordem: faqs.length + 1 });
      setIsEditingFaq(false);
    }
    setIsFaqModalOpen(true);
  };

  const handleFaqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    let success = false;
    if (isEditingFaq && currentFaq.id) {
      const { id, ...updateData } = currentFaq;
      const result = await updateFaq(id, updateData);
      if (result) success = true;
    } else {
      const result = await createFaq(currentFaq as Omit<Faq, 'id' | 'ativo'>);
      if (result) success = true;
    }
    
    if (success) {
      alert(`FAQ ${isEditingFaq ? 'atualizado' : 'criado'} com sucesso!`);
      setIsFaqModalOpen(false);
      loadFaqs();
    } else {
      alert('Ocorreu um erro. Tente novamente.');
    }
    setIsSubmitting(false);
  };

  const handleFaqDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
      const success = await deleteFaq(id);
      if (success) {
        alert('FAQ excluído com sucesso!');
        loadFaqs();
      } else {
        alert('Falha ao excluir o FAQ.');
      }
    }
  };
  
  const openEventoModal = (evento?: Evento) => {
    if (evento) {
        setCurrentEvento(evento);
        setIsEditingEvento(true);
    } else {
        setCurrentEvento({ titulo: '', descricao: '', data_evento: '', horario: '', local: ''});
        setIsEditingEvento(false);
    }
    setEventoImageFile(null);
    setIsEventoModalOpen(true);
  };

  const handleEventoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    let success = false;
    
    const { id, ...eventoData } = currentEvento;

    if (isEditingEvento && id) {
        const result = await updateEvento(id, eventoData, eventoImageFile || undefined);
        if (result) success = true;
    } else {
        const result = await createEvento(eventoData as Omit<Evento, 'id' | 'ativo'>, eventoImageFile || undefined);
        if (result) success = true;
    }

    if (success) {
        alert(`Evento ${isEditingEvento ? 'atualizado' : 'criado'} com sucesso!`);
        setIsEventoModalOpen(false);
        loadEventos();
    } else {
        alert('Ocorreu um erro. Tente novamente.');
    }
    setIsSubmitting(false);
  };
  
  const handleEventoDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este evento?')) {
      const success = await deleteEvento(id);
      if (success) {
        alert('Evento excluído com sucesso!');
        loadEventos();
      } else {
        alert('Falha ao excluir o evento.');
      }
    }
  };

  const handleDocumentoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentoFile) {
        alert('Por favor, selecione um arquivo para o documento.');
        return;
    }
    setIsSubmitting(true);
    const result = await createDocumento(newDocumentoData, documentoFile);
    if (result) {
        alert('Documento adicionado com sucesso!');
        setIsDocumentoModalOpen(false);
        setNewDocumentoData({ titulo: '', descricao: '', categoria: 'Atas' });
        setDocumentoFile(null);
        loadDocumentos();
    } else {
        alert('Falha ao adicionar documento. Tente novamente.');
    }
    setIsSubmitting(false);
  };
  
  const handleDocumentoDelete = async (id: string, url_arquivo: string) => {
    if (window.confirm('Tem certeza que deseja excluir este documento? O arquivo será removido permanentemente.')) {
        const success = await deleteDocumento(id, url_arquivo);
        if (success) {
            alert('Documento excluído com sucesso!');
            loadDocumentos();
        } else {
            alert('Falha ao excluir o documento.');
        }
    }
  };
  
  const handleImagemGaleriaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagemGaleriaFile) {
        alert('Por favor, selecione uma imagem.');
        return;
    }
    setIsSubmitting(true);
    const result = await createImagemGaleria(newImagemData, imagemGaleriaFile);
    if (result) {
        alert('Imagem adicionada com sucesso!');
        setIsGaleriaModalOpen(false);
        setNewImagemData({ titulo: '', descricao: '', album: 'Geral' });
        setImagemGaleriaFile(null);
        loadImagensGaleria();
    } else {
        alert('Falha ao adicionar imagem. Tente novamente.');
    }
    setIsSubmitting(false);
  };

  const handleImagemGaleriaDelete = async (id: string, url_imagem: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta imagem?')) {
        const success = await deleteImagemGaleria(id, url_imagem);
        if (success) {
            alert('Imagem excluída com sucesso!');
            loadImagensGaleria();
        } else {
            alert('Falha ao excluir a imagem.');
        }
    }
  };


  const TabButton: React.FC<{tabName: string; icon: React.ReactNode; children: React.ReactNode}> = ({tabName, icon, children}) => (
    <button onClick={() => setActiveTab(tabName)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === tabName ? 'bg-brandLime text-brandGreen-dark' : 'text-gray-600 hover:bg-gray-200'}`}>
      {icon}
      {children}
    </button>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'comunicados': return <ComunicadosContent />;
      case 'eventos': return <EventosContent />;
      case 'faq': return <FaqContent />;
      case 'galeria': return <GaleriaContent />;
      case 'documentos': return <DocumentosContent />;
      default: return null;
    }
  };

  const ComunicadosContent = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gerenciar Comunicados</h2>
        <button onClick={() => openComunicadoModal()} className="bg-brandGreen text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-brandGreen-dark transition-colors shadow-md">
          <PlusCircle size={20} /> Criar Novo Comunicado
        </button>
      </div>
       <div className="space-y-4">
        {loadingComunicados ? (
          Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
        ) : comunicados.map(comunicado => (
          <div key={comunicado.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center border">
            <div>
              <p className="font-semibold text-gray-800">{comunicado.titulo}</p>
              <p className="text-sm text-gray-500">
                {new Date(comunicado.data_publicacao).toLocaleDateString('pt-BR', {timeZone: 'UTC'})} - <span className="font-medium">{comunicado.categoria}</span>
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button onClick={() => openComunicadoModal(comunicado)} className="text-blue-600 hover:text-blue-800"><Edit size={20}/></button>
              <button onClick={() => handleComunicadoDelete(comunicado.id, comunicado.imagem_url)} className="text-red-600 hover:text-red-800"><Trash2 size={20}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  const EventosContent = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gerenciar Eventos</h2>
        <button onClick={() => openEventoModal()} className="bg-brandGreen text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-brandGreen-dark transition-colors shadow-md">
          <PlusCircle size={20} /> Criar Novo Evento
        </button>
      </div>
      <div className="space-y-4">
        {loadingEventos ? (
          Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
        ) : eventos.map(evento => (
          <div key={evento.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center border">
            <div>
              <p className="font-semibold text-gray-800">{evento.titulo}</p>
              <p className="text-sm text-gray-500">
                {new Date(evento.data_evento).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button onClick={() => openEventoModal(evento)} className="text-blue-600 hover:text-blue-800"><Edit size={20}/></button>
              <button onClick={() => handleEventoDelete(evento.id)} className="text-red-600 hover:text-red-800"><Trash2 size={20}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  const FaqContent = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gerenciar FAQ</h2>
        <button onClick={() => openFaqModal()} className="bg-brandGreen text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-brandGreen-dark transition-colors shadow-md">
          <PlusCircle size={20} /> Adicionar Pergunta
        </button>
      </div>
      <div className="space-y-4">
        {loadingFaqs ? (
          Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
        ) : faqs.map(faq => (
          <div key={faq.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center border">
            <div>
              <p className="font-semibold text-gray-800">{faq.pergunta}</p>
              <p className="text-sm text-gray-500 line-clamp-1">{faq.resposta}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button onClick={() => openFaqModal(faq)} className="text-blue-600 hover:text-blue-800"><Edit size={20}/></button>
              <button onClick={() => handleFaqDelete(faq.id)} className="text-red-600 hover:text-red-800"><Trash2 size={20}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const DocumentosContent = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gerenciar Documentos</h2>
        <button onClick={() => setIsDocumentoModalOpen(true)} className="bg-brandGreen text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-brandGreen-dark transition-colors shadow-md">
          <PlusCircle size={20} /> Adicionar Documento
        </button>
      </div>
      <div className="space-y-4">
        {loadingDocumentos ? (
          Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
        ) : documentos.map(doc => (
          <div key={doc.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center border">
            <div className="flex items-center gap-4">
              <FileText className="text-brandGreen h-8 w-8 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-800">{doc.titulo}</p>
                <p className="text-sm text-gray-500">{doc.categoria}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <a href={doc.url_arquivo} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                <UploadCloud size={20}/>
              </a>
              <button onClick={() => handleDocumentoDelete(doc.id, doc.url_arquivo)} className="text-red-600 hover:text-red-800">
                <Trash2 size={20}/>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const GaleriaContent = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gerenciar Galeria</h2>
        <button onClick={() => setIsGaleriaModalOpen(true)} className="bg-brandGreen text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-brandGreen-dark transition-colors shadow-md">
          <PlusCircle size={20} /> Adicionar Imagem
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loadingGaleria ? (
          Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)
        ) : imagensGaleria.map(img => (
          <div key={img.id} className="relative group bg-gray-100 rounded-lg overflow-hidden">
            <img src={img.url_imagem} alt={img.titulo} className="h-40 w-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
              <p className="text-white font-bold text-sm line-clamp-1">{img.titulo}</p>
              <p className="text-gray-300 text-xs line-clamp-1">{img.album}</p>
            </div>
            <button onClick={() => handleImagemGaleriaDelete(img.id, img.url_imagem)} className="absolute top-2 right-2 bg-red-600/80 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700">
              <Trash2 size={16}/>
            </button>
          </div>
        ))}
      </div>
    </div>
  );


  return (
    <div className="bg-gray-100 min-h-[calc(100vh-148px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-brandGreen-dark font-display">Painel Administrativo</h1>
                <p className="text-gray-600">Bem-vindo, Síndico!</p>
            </div>
            <button onClick={onLogout} className="mt-4 md:mt-0 bg-red-500 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors">
                <LogOut size={18} /> Sair
            </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-1/4">
                <div className="bg-white p-4 rounded-lg shadow-sm space-y-2">
                   <TabButton tabName="comunicados" icon={<Bell size={20} />}>Comunicados</TabButton>
                   <TabButton tabName="eventos" icon={<Calendar size={20} />}>Eventos</TabButton>
                   <TabButton tabName="galeria" icon={<ImageIcon size={20} />}>Galeria</TabButton>
                   <TabButton tabName="documentos" icon={<FileText size={20} />}>Documentos</TabButton>
                   <TabButton tabName="faq" icon={<HelpCircle size={20} />}>FAQ</TabButton>
                </div>
            </aside>
            
            <main className="w-full md:w-3/4">
                <div className="bg-white p-8 rounded-lg shadow-sm">
                    {renderContent()}
                </div>
            </main>
        </div>
      </div>
      
      {/* Modal para criar/editar FAQ */}
       <Modal isOpen={isFaqModalOpen} onClose={() => setIsFaqModalOpen(false)} title={isEditingFaq ? 'Editar Pergunta' : 'Adicionar Nova Pergunta'}>
        <form onSubmit={handleFaqSubmit} className="space-y-4">
          <div>
            <label htmlFor="pergunta" className="block text-sm font-medium text-gray-700">Pergunta</label>
            <input type="text" name="pergunta" id="pergunta" required value={currentFaq.pergunta || ''} onChange={(e) => setCurrentFaq({...currentFaq, pergunta: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandGreen focus:border-brandGreen" />
          </div>
          <div>
            <label htmlFor="resposta" className="block text-sm font-medium text-gray-700">Resposta</label>
            <textarea name="resposta" id="resposta" rows={5} required value={currentFaq.resposta || ''} onChange={(e) => setCurrentFaq({...currentFaq, resposta: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandGreen focus:border-brandGreen"></textarea>
          </div>
           <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsFaqModalOpen(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="bg-brandGreen text-white px-4 py-2 rounded-md hover:bg-brandGreen-dark transition-colors disabled:bg-gray-400">
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal para criar/editar comunicado */}
      <Modal isOpen={isComunicadoModalOpen} onClose={() => setIsComunicadoModalOpen(false)} title={isEditingComunicado ? 'Editar Comunicado' : 'Criar Novo Comunicado'}>
        <form onSubmit={handleComunicadoSubmit} className="space-y-4">
          <div>
            <label htmlFor="comunicado-titulo" className="block text-sm font-medium text-gray-700">Título</label>
            <input type="text" id="comunicado-titulo" required value={currentComunicado.titulo || ''} onChange={(e) => setCurrentComunicado({...currentComunicado, titulo: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brandGreen focus:border-brandGreen" />
          </div>
          <div>
            <label htmlFor="comunicado-conteudo" className="block text-sm font-medium text-gray-700">Conteúdo</label>
            <textarea id="comunicado-conteudo" rows={5} required value={currentComunicado.conteudo || ''} onChange={(e) => setCurrentComunicado({...currentComunicado, conteudo: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brandGreen focus:border-brandGreen"></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label htmlFor="comunicado-categoria" className="block text-sm font-medium text-gray-700">Categoria</label>
                <select id="comunicado-categoria" required value={currentComunicado.categoria || 'Informativo'} onChange={(e) => setCurrentComunicado({...currentComunicado, categoria: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brandGreen focus:border-brandGreen">
                  <option>Informativo</option>
                  <option>Urgente</option>
                  <option>Evento</option>
                  <option>Manutenção</option>
                  <option>Aviso</option>
                </select>
            </div>
             <div>
                <label htmlFor="comunicado-autor" className="block text-sm font-medium text-gray-700">Autor</label>
                <input type="text" id="comunicado-autor" required value={currentComunicado.autor || 'Administração'} onChange={(e) => setCurrentComunicado({...currentComunicado, autor: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brandGreen focus:border-brandGreen" />
            </div>
          </div>
          <div>
            <label htmlFor="comunicado-imagem" className="block text-sm font-medium text-gray-700">Imagem (Opcional)</label>
            <input type="file" id="comunicado-imagem" accept="image/*" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brandGreen-light file:text-brandGreen-dark hover:file:bg-brandGreen" />
          </div>
           <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsComunicadoModalOpen(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="bg-brandGreen text-white px-4 py-2 rounded-md hover:bg-brandGreen-dark transition-colors disabled:bg-gray-400">
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal para criar/editar Evento */}
      <Modal isOpen={isEventoModalOpen} onClose={() => setIsEventoModalOpen(false)} title={isEditingEvento ? 'Editar Evento' : 'Criar Novo Evento'}>
        <form onSubmit={handleEventoSubmit} className="space-y-4">
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título</label>
            <input type="text" name="titulo" id="titulo" required value={currentEvento.titulo || ''} onChange={(e) => setCurrentEvento({...currentEvento, titulo: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandGreen focus:border-brandGreen" />
          </div>
          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea name="descricao" id="descricao" rows={5} required value={currentEvento.descricao || ''} onChange={(e) => setCurrentEvento({...currentEvento, descricao: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandGreen focus:border-brandGreen"></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
              <label htmlFor="data_evento" className="block text-sm font-medium text-gray-700">Data</label>
              <input type="date" name="data_evento" id="data_evento" required value={currentEvento.data_evento || ''} onChange={(e) => setCurrentEvento({...currentEvento, data_evento: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandGreen focus:border-brandGreen" />
            </div>
             <div>
              <label htmlFor="horario" className="block text-sm font-medium text-gray-700">Horário</label>
              <input type="time" name="horario" id="horario" required value={currentEvento.horario || ''} onChange={(e) => setCurrentEvento({...currentEvento, horario: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandGreen focus:border-brandGreen" />
            </div>
          </div>
           <div>
            <label htmlFor="local" className="block text-sm font-medium text-gray-700">Local</label>
            <input type="text" name="local" id="local" required value={currentEvento.local || ''} onChange={(e) => setCurrentEvento({...currentEvento, local: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandGreen focus:border-brandGreen" />
          </div>
          <div>
            <label htmlFor="imagem" className="block text-sm font-medium text-gray-700">Imagem do Evento</label>
            <input type="file" name="imagem" id="imagem" accept="image/*" onChange={(e) => setEventoImageFile(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brandGreen-light file:text-brandGreen-dark hover:file:bg-brandGreen" />
          </div>
           <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsEventoModalOpen(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="bg-brandGreen text-white px-4 py-2 rounded-md hover:bg-brandGreen-dark transition-colors disabled:bg-gray-400">
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal para criar Documento */}
      <Modal isOpen={isDocumentoModalOpen} onClose={() => setIsDocumentoModalOpen(false)} title="Adicionar Novo Documento">
        <form onSubmit={handleDocumentoSubmit} className="space-y-4">
          <div>
            <label htmlFor="doc-titulo" className="block text-sm font-medium text-gray-700">Título</label>
            <input type="text" id="doc-titulo" required value={newDocumentoData.titulo} onChange={(e) => setNewDocumentoData({...newDocumentoData, titulo: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brandGreen focus:border-brandGreen" />
          </div>
          <div>
            <label htmlFor="doc-descricao" className="block text-sm font-medium text-gray-700">Descrição (Opcional)</label>
            <textarea id="doc-descricao" rows={3} value={newDocumentoData.descricao || ''} onChange={(e) => setNewDocumentoData({...newDocumentoData, descricao: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brandGreen focus:border-brandGreen"></textarea>
          </div>
          <div>
            <label htmlFor="doc-categoria" className="block text-sm font-medium text-gray-700">Categoria</label>
            <select id="doc-categoria" value={newDocumentoData.categoria} onChange={(e) => setNewDocumentoData({...newDocumentoData, categoria: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brandGreen focus:border-brandGreen">
              <option>Atas</option>
              <option>Regulamentos</option>
              <option>Financeiro</option>
              <option>Outros</option>
            </select>
          </div>
          <div>
            <label htmlFor="doc-file" className="block text-sm font-medium text-gray-700">Arquivo</label>
            <input type="file" id="doc-file" required onChange={(e) => setDocumentoFile(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brandGreen-light file:text-brandGreen-dark hover:file:bg-brandGreen" />
          </div>
           <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsDocumentoModalOpen(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="bg-brandGreen text-white px-4 py-2 rounded-md hover:bg-brandGreen-dark disabled:bg-gray-400">
              {isSubmitting ? 'Enviando...' : 'Salvar Documento'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal para adicionar Imagem na Galeria */}
      <Modal isOpen={isGaleriaModalOpen} onClose={() => setIsGaleriaModalOpen(false)} title="Adicionar Imagem à Galeria">
        <form onSubmit={handleImagemGaleriaSubmit} className="space-y-4">
          <div>
            <label htmlFor="img-titulo" className="block text-sm font-medium text-gray-700">Título</label>
            <input type="text" id="img-titulo" required value={newImagemData.titulo} onChange={(e) => setNewImagemData({...newImagemData, titulo: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brandGreen focus:border-brandGreen" />
          </div>
          <div>
            <label htmlFor="img-descricao" className="block text-sm font-medium text-gray-700">Descrição (Opcional)</label>
            <textarea id="img-descricao" rows={3} value={newImagemData.descricao || ''} onChange={(e) => setNewImagemData({...newImagemData, descricao: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brandGreen focus:border-brandGreen"></textarea>
          </div>
          <div>
            <label htmlFor="img-album" className="block text-sm font-medium text-gray-700">Álbum</label>
            <input type="text" id="img-album" required value={newImagemData.album} onChange={(e) => setNewImagemData({...newImagemData, album: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brandGreen focus:border-brandGreen" placeholder="Ex: Festa Junina 2024" />
          </div>
          <div>
            <label htmlFor="img-file" className="block text-sm font-medium text-gray-700">Arquivo de Imagem</label>
            <input type="file" id="img-file" accept="image/*" required onChange={(e) => setImagemGaleriaFile(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brandGreen-light file:text-brandGreen-dark hover:file:bg-brandGreen" />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsGaleriaModalOpen(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="bg-brandGreen text-white px-4 py-2 rounded-md hover:bg-brandGreen-dark disabled:bg-gray-400">
              {isSubmitting ? 'Enviando...' : 'Salvar Imagem'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default AdminPage;