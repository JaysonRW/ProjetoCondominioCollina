import React, { useState, useEffect, useRef } from 'react';
import { Banner } from '../../../types/types';
import { createBanner, updateBanner } from '../../../services/api';

interface BannerFormProps {
  banner: Banner | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const BannerForm: React.FC<BannerFormProps> = ({ banner, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Banner>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (banner) {
      setFormData(banner);
      setImagePreview(banner.url_imagem);
    } else {
      setFormData({
        titulo: '',
        descricao: '',
        link_destino: '',
        pagina: 'anunciantes',
        ordem: 0,
        ativo: true,
        data_inicio: '',
        data_fim: '',
      });
      setImagePreview(null);
    }
    setImageFile(null);
  }, [banner]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const inputValue = isCheckbox ? (e.target as HTMLInputElement).checked : (type === 'number' ? parseInt(value, 10) || 0 : value);
    setFormData(prev => ({ ...prev, [name]: inputValue }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!banner && !imageFile) {
      alert('É obrigatório selecionar uma imagem para criar um novo banner.');
      return;
    }
    setIsSubmitting(true);
    
    const { id, ...submitData } = formData;

    try {
      const result = banner
        ? await updateBanner(banner.id, submitData, imageFile || undefined)
        : await createBanner(submitData as Omit<Banner, 'id'>, imageFile!);
      
      if (result) {
        alert(`Banner ${banner ? 'atualizado' : 'criado'} com sucesso!`);
        onSuccess();
      } else {
        throw new Error('Falha na operação com o banner.');
      }
    } catch (error) {
      console.error('Erro ao salvar banner:', error);
      alert('Ocorreu um erro ao salvar. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Imagem do Banner*</label>
        <div 
          onClick={() => imageInputRef.current?.click()}
          className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-brandGreen transition-colors cursor-pointer aspect-[3/1] flex flex-col justify-center items-center bg-gray-50"
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Preview do Banner" className="max-h-full max-w-full object-contain rounded-md" />
          ) : (
            <>
              <div className="text-4xl mb-2">🖼️</div>
              <span className="text-sm text-gray-600">Clique para selecionar uma imagem</span>
              <p className="text-xs text-gray-500 mt-1">Recomendado: 1200x400px</p>
            </>
          )}
        </div>
        <input type="file" ref={imageInputRef} hidden accept="image/*" onChange={handleFileChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título</label>
            <input type="text" id="titulo" name="titulo" value={formData.titulo || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brandGreen focus:border-brandGreen" />
        </div>
        <div>
            <label htmlFor="pagina" className="block text-sm font-medium text-gray-700">Página de Exibição</label>
            <select id="pagina" name="pagina" value={formData.pagina || 'anunciantes'} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brandGreen focus:border-brandGreen">
                <option value="anunciantes">Clube de Vantagens</option>
                <option value="home">Página Inicial</option>
            </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição</label>
        <textarea id="descricao" name="descricao" rows={2} value={formData.descricao || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brandGreen focus:border-brandGreen" />
      </div>
      
      <div>
        <label htmlFor="link_destino" className="block text-sm font-medium text-gray-700">Link de Destino (Opcional)</label>
        <input type="url" id="link_destino" name="link_destino" value={formData.link_destino || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brandGreen focus:border-brandGreen" placeholder="https://exemplo.com" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label htmlFor="data_inicio" className="block text-sm font-medium text-gray-700">Data de Início (Opcional)</label>
            <input type="date" id="data_inicio" name="data_inicio" value={formData.data_inicio?.split('T')[0] || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
            <label htmlFor="data_fim" className="block text-sm font-medium text-gray-700">Data de Fim (Opcional)</label>
            <input type="date" id="data_fim" name="data_fim" value={formData.data_fim?.split('T')[0] || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
         <div>
            <label htmlFor="ordem" className="block text-sm font-medium text-gray-700">Ordem</label>
            <input type="number" id="ordem" name="ordem" value={formData.ordem || 0} onChange={handleInputChange} className="mt-1 w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
        <div className="flex items-center gap-2">
            <input type="checkbox" id="ativo" name="ativo" checked={formData.ativo ?? true} onChange={handleInputChange} className="h-4 w-4 text-brandGreen focus:ring-brandGreen border-gray-300 rounded" />
            <label htmlFor="ativo" className="text-sm font-medium text-gray-700">Ativo</label>
        </div>
      </div>
      
      <div className="pt-4 flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="bg-brandGreen text-white px-4 py-2 rounded-md hover:bg-brandGreen-dark transition-colors disabled:bg-gray-400">
          {isSubmitting ? 'Salvando...' : 'Salvar Banner'}
        </button>
      </div>
    </form>
  );
};

export default BannerForm;
