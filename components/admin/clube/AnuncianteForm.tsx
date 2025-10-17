import React, { useState, useEffect } from 'react';
import { Anunciante, Categoria } from '../../../types/types';
import { getCategorias, createAnunciante, updateAnunciante } from '../../../services/api';
import { UploadCloud } from 'lucide-react';

interface AnuncianteFormProps {
  anunciante: Anunciante | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const AnuncianteForm: React.FC<AnuncianteFormProps> = ({ anunciante, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Anunciante>>({
    nome_empresa: '',
    descricao: '',
    plano: 'bronze',
    valor_mensal: 200,
    categoria_id: '',
    endereco: '',
    telefone: '',
    whatsapp: '',
    site_url: '',
    instagram: '',
    ativo: true,
    contrato_inicio: new Date().toISOString().split('T')[0],
    dia_vencimento: 5,
    ...anunciante
  });
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadCategorias() {
      const cats = await getCategorias();
      setCategorias(cats);
      if (!anunciante && cats.length > 0) {
        setFormData(prev => ({ ...prev, categoria_id: cats[0].id }));
      }
    }
    loadCategorias();
  }, [anunciante]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    // FIX: Check if the element is a checkbox before accessing 'checked'
    const inputValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;
    setFormData({ ...formData, [name]: inputValue });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, categorias_anunciantes, cupons_desconto, ...submitData} = formData;

    try {
      if (anunciante) {
        await updateAnunciante(anunciante.id, submitData, logoFile || undefined, bannerFile || undefined);
      } else {
        await createAnunciante(submitData as any, logoFile || undefined, bannerFile || undefined);
      }
      alert(`Anunciante ${anunciante ? 'atualizado' : 'criado'} com sucesso!`);
      onSuccess();
    } catch (error) {
      alert('Ocorreu um erro ao salvar o anunciante.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nome_empresa" className="block font-medium text-gray-700">Nome da Empresa</label>
          <input type="text" name="nome_empresa" id="nome_empresa" value={formData.nome_empresa} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandGreen focus:border-brandGreen" required />
        </div>
        <div>
            <label htmlFor="categoria_id" className="block font-medium text-gray-700">Categoria</label>
            <select name="categoria_id" id="categoria_id" value={formData.categoria_id} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandGreen focus:border-brandGreen" required>
                {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nome}</option>)}
            </select>
        </div>
      </div>
      <div>
        <label htmlFor="descricao" className="block font-medium text-gray-700">Descrição</label>
        <textarea name="descricao" id="descricao" rows={3} value={formData.descricao} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandGreen focus:border-brandGreen"></textarea>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="plano" className="block font-medium text-gray-700">Plano</label>
          <select name="plano" id="plano" value={formData.plano} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandGreen focus:border-brandGreen">
            <option value="bronze">Bronze</option>
            <option value="prata">Prata</option>
            <option value="ouro">Ouro</option>
          </select>
        </div>
         <div>
          <label htmlFor="valor_mensal" className="block font-medium text-gray-700">Valor Mensal (R$)</label>
          <input type="number" name="valor_mensal" id="valor_mensal" value={formData.valor_mensal} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandGreen focus:border-brandGreen" required />
        </div>
        <div>
          <label htmlFor="dia_vencimento" className="block font-medium text-gray-700">Dia Vencimento</label>
          <input type="number" name="dia_vencimento" id="dia_vencimento" min="1" max="31" value={formData.dia_vencimento} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandGreen focus:border-brandGreen" required />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label htmlFor="logoFile" className="block font-medium text-gray-700">Logo</label>
            <input type="file" name="logoFile" id="logoFile" onChange={e => setLogoFile(e.target.files?.[0] || null)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brandGreen-light file:text-brandGreen-dark hover:file:bg-brandGreen" />
        </div>
        <div>
            <label htmlFor="bannerFile" className="block font-medium text-gray-700">Banner</label>
            <input type="file" name="bannerFile" id="bannerFile" onChange={e => setBannerFile(e.target.files?.[0] || null)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brandGreen-light file:text-brandGreen-dark hover:file:bg-brandGreen" />
        </div>
      </div>
      <div>
        <label className="flex items-center gap-2">
            <input type="checkbox" name="ativo" checked={formData.ativo} onChange={handleInputChange} className="h-4 w-4 rounded border-gray-300 text-brandGreen focus:ring-brandGreen" />
            <span className="font-medium text-gray-700">Anunciante Ativo</span>
        </label>
      </div>

      {/* FIX: Removed invalid <style jsx> tag which was causing a TypeScript error. Replaced with Tailwind CSS classes directly on the elements. */}

      <div className="pt-4 flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
          Cancelar
        </button>
        <button type="submit" disabled={isSubmitting} className="bg-brandGreen text-white px-4 py-2 rounded-md hover:bg-brandGreen-dark disabled:bg-gray-400">
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
};

export default AnuncianteForm;
