// FIX: Changed React import to a namespace import and updated hook calls to fix JSX typing errors.
import * as React from 'react';
import { getComunicados, getAnunciantesDestaque } from '../services/api';
import { Anunciante, Comunicado } from '../types/types';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { ComunicadoCardSkeleton } from '../components/Skeleton';

const HomePage: React.FC<{ setCurrentPage: (page: string) => void }> = ({ setCurrentPage }) => {
  const [comunicados, setComunicados] = React.useState<Comunicado[]>([]);
  const [anunciantes, setAnunciantes] = React.useState<Anunciante[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [comunicadosData, anunciantesData] = await Promise.all([
        getComunicados(3),
        getAnunciantesDestaque(4),
      ]);
      setComunicados(comunicadosData);
      setAnunciantes(anunciantesData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const getCategoriaBadgeStyle = (categoria: string) => {
    switch (categoria) {
      case 'urgente':
        return 'bg-red-100 text-red-800';
      case 'evento':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative text-white text-center py-24 md:py-40 bg-cover bg-center" style={{ backgroundImage: `url('/assets/hero-background.png')` }}>
        <div className="absolute inset-0 bg-brandGreen-dark opacity-60"></div>
        <div className="relative max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">Portal de Transparência</h1>
          <p className="text-lg md:text-xl mb-8">Bem-vindo ao portal oficial do condominio Collina Belvedere</p>
          <button onClick={() => setCurrentPage('comunicados')} className="bg-brandLime hover:bg-opacity-90 text-brandGreen-dark font-bold py-3 px-8 rounded-md transition-all transform hover:scale-105 inline-flex items-center gap-2">
            Ver Comunicados <ExternalLink size={20} />
          </button>
        </div>
      </section>

      {/* Últimos Comunicados */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2 font-display">Últimos Comunicados</h2>
           <p className="text-center text-gray-500 mb-12">Fique por dentro das novidades e avisos importantes do condomínio.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
                Array.from({ length: 3 }).map((_, index) => <ComunicadoCardSkeleton key={index} />)
            ) : (
                comunicados.map(comunicado => (
              <div key={comunicado.id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:-translate-y-2 duration-300">
                {comunicado.imagem_url && <img className="h-48 w-full object-cover" src={comunicado.imagem_url} alt={comunicado.titulo} />}
                <div className="p-6">
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full uppercase ${getCategoriaBadgeStyle(comunicado.categoria)}`}>
                    {comunicado.categoria}
                  </span>
                  <h3 className="mt-4 text-xl font-bold text-gray-900">{comunicado.titulo}</h3>
                  <p className="mt-2 text-gray-600 line-clamp-3">{comunicado.conteudo}</p>
                   <p className="mt-4 text-sm text-gray-500">{new Date(comunicado.data_publicacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
            )))}
          </div>
          <div className="text-center mt-12">
            <button onClick={() => setCurrentPage('comunicados')} className="text-brandGreen font-semibold hover:text-brandGreen-dark transition-colors flex items-center justify-center mx-auto">
              Ver todos os comunicados <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
      
      {/* Parceiros em Destaque */}
       <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2 font-display">Nossos Parceiros em Destaque</h2>
           <p className="text-center text-gray-500 mb-12">Serviços e produtos com vantagens exclusivas para moradores.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
                 Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="bg-gray-100 p-6 rounded-lg animate-pulse h-48"></div>
                ))
            ) : (
                anunciantes.map(anunciante => (
              <div key={anunciante.id} className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center transform transition-transform hover:scale-105 duration-300">
                <img src={anunciante.logo_url} alt={anunciante.nome_empresa} className="h-16 w-16 rounded-full mx-auto mb-4 object-cover" />
                <h3 className="text-lg font-bold text-gray-900">{anunciante.nome_empresa}</h3>
                <p className="text-sm text-gray-500">{anunciante.categorias_anunciantes.nome}</p>
              </div>
            )))}
          </div>
           <div className="text-center mt-12">
            <button onClick={() => setCurrentPage('parceiros')} className="bg-brandGreen text-white font-bold py-3 px-6 rounded-lg hover:bg-brandGreen-dark transition-colors">
              Ver todos os parceiros
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;