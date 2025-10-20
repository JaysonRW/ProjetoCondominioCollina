import React, { useState, useEffect } from 'react';
import { getEventosPaginados } from '../services/api';
import { Evento } from '../types/types';
import Modal from '../components/Modal';
import { Calendar, Clock, MapPin, ChevronRight, ChevronLeft } from 'lucide-react';
import Skeleton from '../components/Skeleton';

const PAGE_SIZE = 10;

const EventosPage: React.FC = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);
  const [activeTab, setActiveTab] = useState<'proximos' | 'anteriores'>('proximos');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const loadEventos = async () => {
      setLoading(true);
      window.scrollTo(0, 0); // Scroll to top on page change
      const { data, count } = await getEventosPaginados({
        page: currentPage,
        pageSize: PAGE_SIZE,
        filter: activeTab,
      });
      setEventos(data);
      setTotalPages(Math.ceil(count / PAGE_SIZE));
      setLoading(false);
    };
    loadEventos();
  }, [currentPage, activeTab]);

  const handleTabChange = (tab: 'proximos' | 'anteriores') => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset page when changing tabs
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const EventCard: React.FC<{ evento: Evento }> = ({ evento }) => (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer flex flex-col md:flex-row items-stretch group"
      onClick={() => setSelectedEvento(evento)}
    >
      <img
        src={evento.imagem_url || '/assets/default-event.jpg'}
        alt={evento.titulo}
        className="w-full md:w-1/3 h-48 md:h-auto object-cover"
      />
      <div className="p-6 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-xl font-bold text-brandGreen-dark mb-2">{evento.titulo}</h3>
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <Calendar size={16} className="mr-2 text-brandGreen" />
            <span>{new Date(evento.data_evento).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</span>
          </div>
          <p className="text-gray-700 line-clamp-3">{evento.descricao}</p>
        </div>
        <div className="mt-4 flex items-center text-brandGreen font-semibold">
          <span>Ver Detalhes</span>
          <ChevronRight size={20} className="transition-transform group-hover:translate-x-1.5" />
        </div>
      </div>
    </div>
  );
  
  const EventCardSkeleton: React.FC = () => (
     <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row items-stretch">
        <Skeleton className="w-full md:w-1/3 h-48 md:h-full" />
        <div className="p-6 flex-grow space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
            <Skeleton className="h-5 w-1/4 mt-4" />
        </div>
     </div>
  );

  const TabButton: React.FC<{ tab: 'proximos' | 'anteriores'; children: React.ReactNode }> = ({ tab, children }) => (
    <button
      onClick={() => handleTabChange(tab)}
      className={`px-6 py-2 font-semibold rounded-md transition-colors focus:outline-none ${
        activeTab === tab
          ? 'bg-brandGreen text-white'
          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 font-display">Calendário de Eventos</h1>
          <p className="mt-2 text-lg text-gray-600">Fique por dentro das atividades e confraternizações do condomínio.</p>
        </div>

        <div className="flex space-x-4 mb-8">
            <TabButton tab="proximos">Próximos Eventos</TabButton>
            <TabButton tab="anteriores">Eventos Anteriores</TabButton>
        </div>

        {loading ? (
            <div className="space-y-8">
                {Array.from({ length: 3 }).map((_, i) => <EventCardSkeleton key={i} />)}
            </div>
        ) : eventos.length > 0 ? (
            <>
                <div className="space-y-8">
                    {eventos.map(evento => <EventCard key={evento.id} evento={evento} />)}
                </div>

                {totalPages > 1 && (
                    <div className="mt-12 flex justify-between items-center">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className="flex items-center gap-2 px-4 py-2 bg-brandGreen text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-brandGreen-dark transition-colors group"
                        >
                            <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-1" />
                            Anterior
                        </button>
                        <span className="text-gray-700 font-medium">
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-2 px-4 py-2 bg-brandGreen text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-brandGreen-dark transition-colors group"
                        >
                            Próximo
                            <ChevronRight size={20} className="transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                )}
            </>
        ) : (
            <div className="bg-white text-center p-12 rounded-lg shadow-sm">
                <p className="text-gray-600">Nenhum evento encontrado para esta categoria.</p>
            </div>
        )}
      </div>

      {selectedEvento && (
        <Modal
          isOpen={!!selectedEvento}
          onClose={() => setSelectedEvento(null)}
          title={selectedEvento.titulo}
        >
          {selectedEvento.imagem_url && <img className="h-64 w-full object-cover rounded-lg mb-6" src={selectedEvento.imagem_url} alt={selectedEvento.titulo} />}
          <div className="space-y-4 text-gray-700">
             <div className="flex items-center">
                <Calendar size={18} className="mr-3 text-brandGreen" />
                <strong>Data:</strong>&nbsp;{new Date(selectedEvento.data_evento).toLocaleDateString('pt-BR', {timeZone: 'UTC', day: '2-digit', month: 'long', year: 'numeric'})}
            </div>
             <div className="flex items-center">
                <Clock size={18} className="mr-3 text-brandGreen" />
                <strong>Horário:</strong>&nbsp;{selectedEvento.horario}
            </div>
             <div className="flex items-start">
                <MapPin size={18} className="mr-3 text-brandGreen mt-1" />
                <div>
                    <strong>Local:</strong>&nbsp;{selectedEvento.local}
                </div>
            </div>
          </div>
          <div className="prose max-w-none mt-6 border-t pt-4 text-gray-800 whitespace-pre-wrap">
            {selectedEvento.descricao}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EventosPage;