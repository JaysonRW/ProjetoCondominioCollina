import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getImagensGaleria } from '../services/api';
import { GaleriaImagem } from '../types/types';
import { X, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import Skeleton from '../components/Skeleton';

const GaleriaPage: React.FC = () => {
  const [imagens, setImagens] = useState<GaleriaImagem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeAlbumImages, setActiveAlbumImages] = useState<GaleriaImagem[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      const data = await getImagensGaleria();
      setImagens(data);
      setLoading(false);
    };
    loadImages();
  }, []);

  const albums = useMemo(() => {
    return imagens.reduce((acc, image) => {
      (acc[image.album] = acc[image.album] || []).push(image);
      return acc;
    }, {} as Record<string, GaleriaImagem[]>);
  }, [imagens]);

  const openLightbox = (albumName: string, imageIndex: number) => {
    setActiveAlbumImages(albums[albumName]);
    setCurrentImageIndex(imageIndex);
    setIsLightboxOpen(true);
  };
  
  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const showNextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % activeAlbumImages.length);
  }, [activeAlbumImages.length]);

  const showPrevImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + activeAlbumImages.length) % activeAlbumImages.length);
  }, [activeAlbumImages.length]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === 'ArrowRight') showNextImage();
      if (e.key === 'ArrowLeft') showPrevImage();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, showNextImage, showPrevImage]);


  const Lightbox = () => {
    if (!isLightboxOpen || activeAlbumImages.length === 0) return null;
    const image = activeAlbumImages[currentImageIndex];


    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={closeLightbox}>
        <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <img 
            src={image.url_imagem} 
            alt={image.titulo} 
            className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg shadow-2xl" 
          />
          {/* Close Button */}
          <button onClick={closeLightbox} className="absolute top-4 right-4 text-white/80 hover:text-white transition-opacity">
            <X size={32} />
          </button>

          {/* Prev Button */}
          <button onClick={showPrevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors">
            <ChevronLeft size={28} />
          </button>
          {/* Next Button */}
          <button onClick={showNextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors">
            <ChevronRight size={28} />
          </button>

          {/* Image Info */}
          <div className="absolute bottom-4 left-4 right-4 text-white text-center bg-black/50 p-3 rounded-lg">
            <h3 className="font-bold text-lg">{image.titulo}</h3>
            {image.descricao && <p className="text-sm text-gray-300">{image.descricao}</p>}
             <p className="text-xs text-gray-400 mt-2">{currentImageIndex + 1} / {activeAlbumImages.length}</p>
          </div>
        </div>
      </div>
    );
  };
  
  const AlbumSkeleton = () => (
    <div className="mb-12">
        <Skeleton className="h-8 w-1/3 mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-lg" />
            ))}
        </div>
    </div>
  );


  return (
    <>
      <div className="bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 font-display">Galeria de Fotos</h1>
            <p className="mt-2 text-lg text-gray-600">Relembre os melhores momentos do nosso condomínio.</p>
          </div>

          {loading ? (
            <>
                <AlbumSkeleton />
                <AlbumSkeleton />
            </>
          ) : Object.keys(albums).length > 0 ? (
            Object.entries(albums).map(([albumName, images]) => (
              <div key={albumName} className="mb-12">
                <h2 className="text-2xl font-bold text-brandGreen-dark mb-6 border-b-2 border-brandLime pb-2">{albumName}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={image.id}
                      className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer group relative"
                      onClick={() => openLightbox(albumName, index)}
                    >
                      <img src={image.url_imagem} alt={image.titulo} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                         <p className="text-white font-semibold text-sm line-clamp-2">{image.titulo}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center col-span-full bg-white p-12 rounded-lg shadow-sm">
                <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700">A galeria está vazia</h3>
                <p className="text-gray-500 mt-2">Nenhuma imagem foi adicionada ainda. Volte em breve!</p>
            </div>
          )}
        </div>
      </div>
      <Lightbox />
    </>
  );
};

export default GaleriaPage;