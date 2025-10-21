import React, { useState, useEffect, useCallback } from 'react';
import { getAdminBanners, deleteBanner } from '../../../services/api';
import { Banner } from '../../../types/types';
import { PlusCircle, Edit, Trash2, Image as ImageIcon, CheckCircle, XCircle, CalendarOff } from 'lucide-react';
import Skeleton from '../../Skeleton';

interface BannersClubeProps {
  refreshKey: number;
  onEditBanner: (banner: Banner) => void;
  onCreateBanner: () => void;
}

const BannersClube: React.FC<BannersClubeProps> = ({ refreshKey, onEditBanner, onCreateBanner }) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBanners = useCallback(async () => {
    setLoading(true);
    const data = await getAdminBanners();
    setBanners(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadBanners();
  }, [loadBanners, refreshKey]);

  const handleDelete = async (banner: Banner) => {
    if (window.confirm(`Tem certeza que deseja excluir o banner "${banner.titulo || 'sem título'}"?`)) {
      const success = await deleteBanner(banner.id, banner.url_imagem);
      if (success) {
        alert('Banner excluído com sucesso!');
        loadBanners();
      } else {
        alert('Falha ao excluir o banner.');
      }
    }
  };
  
  const StatusInfo: React.FC<{ banner: Banner }> = ({ banner }) => {
    const now = new Date();
    const inicio = banner.data_inicio ? new Date(banner.data_inicio) : null;
    const fim = banner.data_fim ? new Date(banner.data_fim) : null;
    let isActiveDate = true;
    if ((inicio && now < inicio) || (fim && now > fim)) {
        isActiveDate = false;
    }
    
    if (!banner.ativo) {
        return <span className="flex items-center gap-1.5 text-xs font-medium text-red-600"><XCircle size={14} /> Inativo</span>;
    }
    if (!isActiveDate) {
        return <span className="flex items-center gap-1.5 text-xs font-medium text-yellow-600"><CalendarOff size={14} /> Agendado/Expirado</span>;
    }
    return <span className="flex items-center gap-1.5 text-xs font-medium text-green-600"><CheckCircle size={14} /> Ativo Agora</span>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gerenciar Banners</h2>
        <button onClick={onCreateBanner} className="bg-brandGreen text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-brandGreen-dark transition-colors shadow">
          <PlusCircle size={20} /> Adicionar Banner
        </button>
      </div>
      
      <div className="space-y-4">
        {loading ? (
          <Skeleton className="h-24 w-full" />
        ) : banners.length > 0 ? (
          banners.map(banner => (
            <div key={banner.id} className="bg-gray-50 p-3 rounded-lg flex items-center justify-between border">
              <div className="flex items-center gap-4">
                <img src={banner.url_imagem} alt={banner.titulo} className="w-24 h-12 object-cover rounded-md bg-gray-200" />
                <div>
                  <p className="font-semibold text-gray-800">{banner.titulo || 'Banner sem título'}</p>
                  <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                    <span>Página: <strong className="capitalize">{banner.pagina}</strong></span>
                    <span>|</span>
                    <StatusInfo banner={banner} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => onEditBanner(banner)} className="text-blue-600 hover:text-blue-800 p-2 rounded-md hover:bg-blue-100 transition-colors"><Edit size={18}/></button>
                <button onClick={() => handleDelete(banner)} className="text-red-600 hover:text-red-800 p-2 rounded-md hover:bg-red-100 transition-colors"><Trash2 size={18}/></button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed">
            <ImageIcon size={40} className="mx-auto text-gray-400 mb-2"/>
            <p className="text-gray-600 font-medium">Nenhum banner cadastrado.</p>
            <p className="text-sm text-gray-500">Clique em "Adicionar Banner" para começar.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BannersClube;
