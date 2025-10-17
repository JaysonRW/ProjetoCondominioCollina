import React, { useState, useEffect, useCallback } from 'react';
import { LogOut, PlusCircle, UploadCloud, FileImage, Bell, ImageIcon, Calendar, FileText, HelpCircle, Edit, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';
import { createComunicado, getFaqs, createFaq, updateFaq, deleteFaq, getEventos, createEvento, updateEvento, deleteEvento } from '../services/api';
import { Faq, Evento } from '../types/types';
import Skeleton from '../components/Skeleton';

interface AdminPageProps {
  onLogout: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('comunicados');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for Comunicados
  const [isComunicadoModalOpen, setIsComunicadoModalOpen] = useState(false);
  const [newComunicadoData, setNewComunicadoData] = useState({
    titulo: '', conteudo: '', categoria: 'informativo', autor: 'Administração',
  });
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

  useEffect(() => {
    if (activeTab === 'faq') {
      loadFaqs();
    }
    if (activeTab === 'eventos') {
      loadEventos();
    }
  }, [activeTab, loadFaqs, loadEventos]);

  const handleCreateComunicadoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await createComunicado(newComunicadoData, imageFile || undefined);
    if (result) {
      alert('Comunicado criado com sucesso!');
      setIsComunicadoModalOpen(false);
      setNewComunicadoData({ titulo: '', conteudo: '', categoria: 'informativo', autor: 'Administração' });
      setImageFile(null);
      // Here you would typically refetch the list of comunicados
    } else {
      alert('Falha ao criar comunicado. Tente novamente.');
    }
    setIsSubmitting(false);
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
      case 'galeria':
      case 'documentos':
        return <PlaceholderContent />;
      default: return null;
    }
  };

  const ComunicadosContent = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Gerenciar Comunicados</h2>
      <button onClick={() => setIsComunicadoModalOpen(true)} className="bg-brandGreen text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-brandGreen-dark transition-colors shadow-md">
        <PlusCircle size={20} /> Criar Novo Comunicado
      </button>
      <div className="mt-8 bg-gray-100 p-6 rounded-lg">
        <h3 className="font-semibold text-lg text-gray-700">Em breve</h3>
        <p className="text-gray-600 mt-2">Aqui você poderá ver, editar e apagar os comunicados existentes.</p>
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

  const PlaceholderContent = () => (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
      <h3 className="font-bold text-yellow-800">Em Desenvolvimento</h3>
      <p className="text-yellow-700 mt-1">A funcionalidade para gerenciar "{activeTab}" está sendo construída e estará disponível em breve!</p>
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

      {/* Modal para criar comunicado */}
      <Modal isOpen={isComunicadoModalOpen} onClose={() => setIsComunicadoModalOpen(false)} title="Criar Novo Comunicado">
        <form onSubmit={handleCreateComunicadoSubmit} className="space-y-6">
          {/* ... campos do formulário de comunicado ... */}
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

    </div>
  );
};

export default AdminPage;