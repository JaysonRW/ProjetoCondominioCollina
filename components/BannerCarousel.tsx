import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getBanners } from '../services/api';
import { Banner } from '../types/types';
import Skeleton from './Skeleton';

interface BannerCarouselProps {
    pagina?: 'anunciantes' | 'home';
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({ pagina = 'anunciantes' }) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBanners() {
      try {
        setIsLoading(true);
        const activeBanners = await getBanners(pagina);
        setBanners(activeBanners);
      } catch (error) {
        console.error('Error fetching banners:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBanners();
  }, [pagina]);

  // Auto-rotação
  useEffect(() => {
    if (!isAutoPlaying || banners.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [banners.length, isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10s of inactivity
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? banners.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % banners.length;
    goToSlide(newIndex);
  };

  const handleBannerClick = (banner: Banner) => {
    if (banner.link_destino) {
      if (banner.link_destino.startsWith('http')) {
        window.open(banner.link_destino, '_blank');
      } else {
        window.location.href = banner.link_destino;
      }
    }
  };

  if (isLoading) {
    return (
      <Skeleton className="w-full h-64 md:h-80 lg:h-96 mb-8 rounded-lg" />
    );
  }

  if (!banners.length) return null;

  const currentBanner = banners[currentIndex];

  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 mb-8 overflow-hidden rounded-lg shadow-xl group">
      {/* Imagem do banner */}
      <div 
        className={`absolute inset-0 transition-opacity duration-700 ${
          currentBanner.link_destino ? 'cursor-pointer' : ''
        }`}
        onClick={() => handleBannerClick(currentBanner)}
      >
        <img
          src={currentBanner.url_imagem}
          alt={currentBanner.titulo || 'Banner'}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Conteúdo do banner */}
      {(currentBanner.titulo || currentBanner.descricao) && (
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
          <div className="max-w-4xl">
            {currentBanner.titulo && (
              <h2 className="text-white text-2xl md:text-4xl font-bold mb-2 animate-fade-in" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                {currentBanner.titulo}
              </h2>
            )}
            {currentBanner.descricao && (
              <p className="text-white/90 text-sm md:text-lg animate-fade-in-delay" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                {currentBanner.descricao}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Setas de navegação */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 z-20"
            aria-label="Banner anterior"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 z-20"
            aria-label="Próximo banner"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Indicadores */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 w-2 hover:bg-white/70'
              }`}
              aria-label={`Ir para slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .animate-fade-in-delay { animation: fade-in 0.6s ease-out 0.2s forwards; }
      `}</style>
    </div>
  );
};

export default BannerCarousel;
