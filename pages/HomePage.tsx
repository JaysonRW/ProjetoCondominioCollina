// FIX: Corrected React import to fix JSX typing errors and updated hook calls.
import React, { useState, useEffect } from 'react';
import { getComunicados } from '../services/api';
import { Comunicado } from '../types/types';
import { ArrowRight, ExternalLink, MessageSquare, FileText, Store, CalendarDays, Send, Calendar as CalendarIcon } from 'lucide-react';
import { ComunicadoCardSkeleton } from '../components/Skeleton';

const HomePage: React.FC<{ setCurrentPage: (page: string) => void }> = ({ setCurrentPage }) => {
  const [comunicados, setComunicados] = useState<Comunicado[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({
    nome: '',
    bloco: '',
    apartamento: '',
    mensagem: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const comunicadosData = await getComunicados({ limit: 3 });
      setComunicados(comunicadosData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({...prev, [name]: value}));
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { nome, bloco, apartamento, mensagem } = contactForm;
    const fullMessage = `Olá, sou ${nome} do Bloco ${bloco}, Apto ${apartamento}.\n\nMensagem: ${mensagem}`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=SEU_NUMERO_AQUI&text=${encodeURIComponent(fullMessage)}`;
    window.open(whatsappUrl, '_blank');
  }

  const exploreItems = [
    { title: 'Comunicados', description: 'Fique por dentro das novidades e informações importantes.', icon: MessageSquare, color: 'blue', page: 'comunicados' },
    { title: 'Documentos', description: 'Acesse atas, relatórios e regulamentos.', icon: FileText, color: 'green', page: 'documentos' },
    { title: 'Clube de Vantagens', description: 'Descontos e benefícios exclusivos para moradores.', icon: Store, color: 'purple', page: 'parceiros' },
    { title: 'Eventos', description: 'Calendário de eventos e assembleias.', icon: CalendarDays, color: 'yellow', page: 'eventos' }
  ];
  
  const exploreColors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600',
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative text-white text-left py-20 sm:py-24 md:py-32 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1920&auto=format&fit=crop')` }}>
        <div className="absolute inset-0 bg-brandGreen-dark opacity-70"></div>
        <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-4">Portal de Transparência</h1>
                <p className="text-lg md:text-xl mb-8">Bem-vindo ao portal oficial do condomínio Collina Belvedere</p>
                <button onClick={() => setCurrentPage('comunicados')} className="bg-brandLime hover:bg-opacity-90 text-brandGreen-dark font-bold py-3 px-8 rounded-md transition-all transform hover:scale-105 inline-flex items-center gap-2">
                    Ver Comunicados <ExternalLink size={20} />
                </button>
            </div>
        </div>
      </section>

      {/* Explore o Portal */}
      <section className="py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-brandGreen mb-12 font-display">Explore o Portal</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {exploreItems.map(item => (
              <a href={`#${item.page}`} onClick={() => setCurrentPage(item.page)} key={item.title} className={`p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 text-center ${exploreColors[item.color as keyof typeof exploreColors].split(' ')[0]}`}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${exploreColors[item.color as keyof typeof exploreColors]}`}>
                  <item.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Últimos Comunicados */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-brandGreen mb-2 font-display">Últimos Comunicados</h2>
           <p className="text-center text-gray-500 mb-12">Fique por dentro das novidades e avisos importantes.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
                Array.from({ length: 3 }).map((_, index) => <ComunicadoCardSkeleton key={index} />)
            ) : (
                comunicados.map(comunicado => (
                    <div key={comunicado.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between">
                        <div>
                            <span className="bg-brandGreen text-white text-xs font-bold uppercase px-2 py-1 rounded">{comunicado.categoria || 'Aviso'}</span>
                            <h3 className="mt-4 mb-2 text-xl font-bold text-gray-900 line-clamp-2">{comunicado.titulo}</h3>
                            <div className="flex items-center text-sm text-gray-500 mb-4">
                                <CalendarIcon size={16} className="mr-2" />
                                {new Date(comunicado.data_publicacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                            </div>
                            <p className="text-gray-600 line-clamp-3 mb-4">{comunicado.conteudo}</p>
                        </div>
                        <a href="#comunicados" onClick={() => setCurrentPage('comunicados')} className="font-semibold text-brandGreen hover:text-brandGreen-dark transition-colors flex items-center">
                            Ler Mais <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                    </div>
                ))
            )}
          </div>
          <div className="text-center mt-12">
            <button onClick={() => setCurrentPage('comunicados')} className="bg-brandLime hover:bg-opacity-90 text-brandGreen-dark font-bold py-3 px-8 rounded-md transition-all">
              Ver Todos os Comunicados
            </button>
          </div>
        </div>
      </section>
      
      {/* Acesso Rápido */}
       <section className="py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-brandGreen mb-12 font-display">Acesso Rápido</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-lg border-2 border-brandLime-DEFAULT shadow-lg">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Aplicativo do Morador</h3>
                    <p className="text-gray-600 mb-6">Faça reservas de espaços e solicite serviços pelo aplicativo oficial.</p>
                    <a 
                        href="https://sindacadministr.superlogica.net/clients/areadocondomino" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block bg-brandLime hover:bg-opacity-90 text-brandGreen-dark font-bold py-2 px-6 rounded-md transition-all"
                    >
                        Acessar Aplicativo
                    </a>
                </div>
                <div className="bg-white p-8 rounded-lg border-2 border-brandLime-DEFAULT shadow-lg">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Suporte e Dúvidas</h3>
                    <p className="text-gray-600 mb-6">Entre em contato conosco através do WhatsApp durante o horário comercial.</p>
                    <button className="bg-brandLime hover:bg-opacity-90 text-brandGreen-dark font-bold py-2 px-6 rounded-md transition-all">Entrar em Contato</button>
                </div>
            </div>
        </div>
      </section>

      {/* Entre em Contato */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-8 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold text-center text-brandGreen mb-8 font-display">Entre em Contato</h2>
                <form onSubmit={handleContactSubmit}>
                    <div className="mb-4">
                        <label htmlFor="nome" className="block text-gray-700 font-medium mb-1">Nome</label>
                        <input type="text" name="nome" id="nome" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brandGreen focus:border-brandGreen" onChange={handleInputChange} value={contactForm.nome} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="bloco" className="block text-gray-700 font-medium mb-1">Bloco</label>
                            <input type="text" name="bloco" id="bloco" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brandGreen focus:border-brandGreen" onChange={handleInputChange} value={contactForm.bloco} />
                        </div>
                        <div>
                            <label htmlFor="apartamento" className="block text-gray-700 font-medium mb-1">Apartamento</label>
                            <input type="text" name="apartamento" id="apartamento" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brandGreen focus:border-brandGreen" onChange={handleInputChange} value={contactForm.apartamento} />
                        </div>
                    </div>
                     <div className="mb-6">
                        <label htmlFor="mensagem" className="block text-gray-700 font-medium mb-1">Mensagem</label>
                        <textarea name="mensagem" id="mensagem" rows={4} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brandGreen focus:border-brandGreen" onChange={handleInputChange} value={contactForm.mensagem}></textarea>
                    </div>
                    <button type="submit" className="w-full bg-brandLime hover:bg-opacity-90 text-brandGreen-dark font-bold py-3 px-8 rounded-md transition-all flex items-center justify-center gap-2">
                        <Send size={20} /> Enviar via WhatsApp
                    </button>
                </form>
            </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;