// FIX: Corrected React import to fix JSX typing errors and updated hook calls.
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getAnunciantes, getCategorias, trackAnuncianteView, trackAnuncianteClick } from '../services/api';
import { Anunciante, Categoria, Cupom } from '../types/types';
import Modal from '../components/Modal';
import Icon from '../components/Icon';
import { AnuncianteCardSkeleton } from '../components/Skeleton';
import { Search, MapPin, Phone, Mail, Globe, Instagram, Ticket, Star, ShieldCheck, Gem, Home, User } from 'lucide-react';

const PlanoBadge: React.FC<{ plano: Anunciante['plano'] }> = ({ plano }) => {
    const styles = {
        bronze: { bg: 'bg-orange-100', text: 'text-orange-800', icon: <ShieldCheck size={14} /> },
        prata: { bg: 'bg-gray-200', text: 'text-gray-800', icon: <Star size={14} /> },
        ouro: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <Gem size={14} /> },
    };
    const style = styles[plano] || styles.bronze;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
            {style.icon}
            {plano.charAt(0).toUpperCase() + plano.slice(1)}
        </span>
    );
};

interface AnuncianteCardProps {
    anunciante: Anunciante;
    onDetailsClick: (anunciante: Anunciante) => void;
    onActionClick: (id: string, url?: string) => void;
}

const AnuncianteCard: React.FC<AnuncianteCardProps> = ({ anunciante, onDetailsClick, onActionClick }) => {
    const isMorador = anunciante.valor_mensal === 0;

    if (isMorador) {
        return (
            <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col relative h-full">
                 <span className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 z-10">
                    <Home size={14} /> MORADOR
                </span>
                <div className="p-5 flex-grow flex flex-col">
                    <div className="flex items-center space-x-4">
                        <img className="h-16 w-16 object-cover rounded-md border" src={anunciante.logo_url} alt={anunciante.nome_empresa} />
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-blue-900">{anunciante.nome_empresa}</h3>
                        </div>
                    </div>
                     <p className="text-emerald-700 font-semibold mt-3">Apoie seu Vizinho!</p>
                    <p className="mt-2 text-sm text-gray-600 flex-grow">{anunciante.descricao}</p>
                </div>
                <div className="p-4 bg-gray-50 border-t mt-auto">
                    <a 
                        href={`https://wa.me/${anunciante.whatsapp}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        onClick={() => onActionClick(anunciante.id, `https://wa.me/${anunciante.whatsapp}`)}
                        className="w-full text-center bg-emerald-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors block"
                    >
                        Falar com o Morador
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
            <div className="p-5 flex-grow">
                <div className="flex items-center space-x-4">
                    <img className="h-16 w-16 rounded-lg object-cover border" src={anunciante.logo_url} alt={anunciante.nome_empresa} />
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{anunciante.nome_empresa}</h3>
                        {anunciante.categorias_anunciantes && (
                             <span style={{ backgroundColor: anunciante.categorias_anunciantes.cor + '20', color: anunciante.categorias_anunciantes.cor }} className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1`}>
                                <Icon name={anunciante.categorias_anunciantes.icone as any} className="mr-1.5" size={12} /> {anunciante.categorias_anunciantes.nome}
                            </span>
                        )}
                    </div>
                </div>
                <p className="mt-4 text-sm text-gray-600 line-clamp-3 flex-grow">{anunciante.descricao_curta || anunciante.descricao}</p>
            </div>
            <div className="p-5 bg-gray-50 border-t mt-auto">
                 <div className="flex justify-between items-center">
                     <PlanoBadge plano={anunciante.plano} />
                    <button onClick={() => onDetailsClick(anunciante)} className="bg-brandGreen text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brandGreen-dark transition-colors">
                        Ver Detalhes
                    </button>
                </div>
            </div>
        </div>
    );
};


const ParceirosPage: React.FC = () => {
    const [anunciantes, setAnunciantes] = useState<Anunciante[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedAnunciante, setSelectedAnunciante] = useState<Anunciante | null>(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const [anunciantesData, categoriasData] = await Promise.all([getAnunciantes(), getCategorias()]);
            setAnunciantes(anunciantesData);
            setCategorias(categoriasData);
            setLoading(false);
        };
        loadData();
    }, []);

    const filteredAnunciantes = useMemo(() => {
        return anunciantes.filter(anunciante => {
            const matchesSearch = searchTerm === '' || anunciante.nome_empresa.toLowerCase().includes(searchTerm.toLowerCase());
            
            let matchesCategory = true;
            if (selectedCategory === 'all') {
                matchesCategory = true;
            } else if (selectedCategory === 'morador') {
                matchesCategory = anunciante.valor_mensal === 0;
            } else {
                matchesCategory = anunciante.categoria_id === selectedCategory;
            }

            return matchesCategory && matchesSearch;
        });
    }, [anunciantes, searchTerm, selectedCategory]);

    const hasMoradores = useMemo(() => anunciantes.some(a => a.valor_mensal === 0), [anunciantes]);
    
    const handleDetailsClick = useCallback((anunciante: Anunciante) => {
        setSelectedAnunciante(anunciante);
        trackAnuncianteView(anunciante.id);
    }, []);
    
    const handleActionClick = useCallback((id: string, url?: string) => {
        trackAnuncianteClick(id);
        if (url) {
            window.open(url, '_blank');
        }
    }, []);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Add toast notification here in a real app
        alert(`Cupom "${text}" copiado!`);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 font-display">Clube de Vantagens</h1>
                    <p className="mt-2 text-lg text-gray-600">Apoie o comércio local e aproveite vantagens exclusivas.</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm mb-8 sticky top-20 z-40 flex flex-col gap-4">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por nome do parceiro..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-brandGreen focus:border-brandGreen"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === 'all' ? 'bg-brandGreen text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            Todos
                        </button>
                         {hasMoradores && (
                            <button
                                onClick={() => setSelectedCategory('morador')}
                                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors flex items-center gap-2 ${
                                    selectedCategory === 'morador' 
                                    ? 'bg-emerald-500 text-white' 
                                    : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                                }`}
                            >
                                <User size={14} /> Morador
                            </button>
                        )}
                        {categorias.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${selectedCategory === cat.id ? 'text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                style={selectedCategory === cat.id ? {backgroundColor: cat.cor, color: 'white'} : {backgroundColor: cat.cor + '20', color: cat.cor}}
                            >
                                <Icon name={cat.icone as any} size={14} /> {cat.nome}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        Array.from({ length: 9 }).map((_, index) => <AnuncianteCardSkeleton key={index} />)
                    ) : (
                        filteredAnunciantes.map(anunciante => (
                            <AnuncianteCard key={anunciante.id} anunciante={anunciante} onDetailsClick={handleDetailsClick} onActionClick={handleActionClick} />
                        ))
                    )}
                </div>

                { !loading && filteredAnunciantes.length === 0 && (
                    <div className="text-center col-span-full bg-white p-12 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-700">Nenhum parceiro encontrado</h3>
                        <p className="text-gray-500 mt-2">Tente ajustar seus filtros de busca.</p>
                    </div>
                 )}
            </div>

            {selectedAnunciante && (
                <Modal
                    isOpen={!!selectedAnunciante}
                    onClose={() => setSelectedAnunciante(null)}
                    title={selectedAnunciante.nome_empresa}
                >
                    {selectedAnunciante.banner_url && <img className="h-48 w-full object-cover rounded-lg mb-6" src={selectedAnunciante.banner_url} alt={`${selectedAnunciante.nome_empresa} banner`} />}
                    
                    <p className="text-gray-700 mb-6">{selectedAnunciante.descricao}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
                        {selectedAnunciante.endereco && <div className="flex items-start"><MapPin className="text-brandGreen mt-1 mr-3 flex-shrink-0" size={18} /><span>{selectedAnunciante.endereco}</span></div>}
                        {selectedAnunciante.telefone && <div className="flex items-center"><Phone className="text-brandGreen mr-3 flex-shrink-0" size={18} /><span>{selectedAnunciante.telefone}</span></div>}
                        {selectedAnunciante.email && <div className="flex items-center"><Mail className="text-brandGreen mr-3 flex-shrink-0" size={18} /><span>{selectedAnunciante.email}</span></div>}
                    </div>

                     <div className="flex flex-wrap gap-3 mb-8">
                        {selectedAnunciante.whatsapp && <button onClick={() => handleActionClick(selectedAnunciante.id, `https://wa.me/${selectedAnunciante.whatsapp}`)} className="flex-1 text-center bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"><Icon name="MessageCircle" size={18}/>WhatsApp</button>}
                        {selectedAnunciante.site_url && <button onClick={() => handleActionClick(selectedAnunciante.id, selectedAnunciante.site_url)} className="flex-1 text-center bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"><Globe size={18} />Website</button>}
                        {selectedAnunciante.instagram && <button onClick={() => handleActionClick(selectedAnunciante.id, `https://instagram.com/${selectedAnunciante.instagram}`)} className="flex-1 text-center bg-pink-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-pink-600 transition-colors flex items-center justify-center gap-2"><Instagram size={18} />Instagram</button>}
                    </div>

                    {selectedAnunciante.cupons_desconto && selectedAnunciante.cupons_desconto.length > 0 && (
                        <div>
                            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><Ticket className="text-secondary mr-2" />Cupons de Desconto</h4>
                            <div className="space-y-3">
                                {selectedAnunciante.cupons_desconto.map(cupom => (
                                    <div key={cupom.id} className="bg-emerald-50 border-l-4 border-secondary p-4 rounded-r-lg flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-secondary">{cupom.codigo}</p>
                                            <p className="text-sm text-gray-700">{cupom.descricao}</p>
                                        </div>
                                        <button onClick={() => copyToClipboard(cupom.codigo)} className="bg-secondary text-white text-xs font-bold px-3 py-1 rounded hover:bg-green-600">COPIAR</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Modal>
            )}
        </div>
    );
};

export default ParceirosPage;