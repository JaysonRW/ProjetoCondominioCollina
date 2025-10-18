import React, { useState, useEffect, useMemo } from 'react';
import { getFaqs } from '../services/api';
import { Faq } from '../types/types';
import { Search, ChevronDown } from 'lucide-react';
import Skeleton from '../components/Skeleton';

const FaqPage: React.FC = () => {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  useEffect(() => {
    const loadFaqs = async () => {
      setLoading(true);
      const data = await getFaqs();
      setFaqs(data);
      setLoading(false);
    };
    loadFaqs();
  }, []);

  const filteredFaqs = useMemo(() => {
    if (!searchTerm) return faqs;
    return faqs.filter(
      faq =>
        faq.pergunta.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.resposta.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [faqs, searchTerm]);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const FaqSkeleton: React.FC = () => (
    <div className="border border-gray-200 rounded-lg p-5">
      <Skeleton className="h-5 w-3/4" />
    </div>
  );

  return (
    <>
      {/* Header Section */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg, #3E594D 0%, #A3C168 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white font-display">Perguntas Frequentes (FAQ)</h1>
          <p className="mt-4 text-lg text-white/90">
            Encontre respostas para as dúvidas mais comuns sobre o condomínio.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 -mt-12">
        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
          <input
            type="text"
            placeholder="Buscar por uma pergunta..."
            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg shadow-sm focus:ring-brandGreen focus:border-brandGreen text-lg"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => <FaqSkeleton key={index} />)
          ) : filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div key={faq.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full flex justify-between items-center text-left p-5 focus:outline-none"
                  aria-expanded={openAccordion === faq.id}
                  aria-controls={`faq-answer-${faq.id}`}
                >
                  <h2 className="text-lg font-semibold text-gray-800">
                    {index + 1}. {faq.pergunta}
                  </h2>
                  <ChevronDown
                    className={`h-6 w-6 text-gray-500 transition-transform duration-300 ${openAccordion === faq.id ? 'rotate-180' : ''}`}
                  />
                </button>
                <div
                  id={`faq-answer-${faq.id}`}
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${openAccordion === faq.id ? 'max-h-screen' : 'max-h-0'}`}
                >
                  <div className="p-5 pt-0">
                    <div className="prose max-w-none text-gray-600 border-t border-gray-200 pt-4 whitespace-pre-wrap">
                      {faq.resposta}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center bg-white p-12 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-700">Nenhuma pergunta encontrada</h3>
              <p className="text-gray-500 mt-2">Tente buscar por outros termos.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FaqPage;
