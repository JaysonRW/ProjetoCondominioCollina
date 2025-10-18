import React, { useState, useEffect } from 'react';
import { Anunciante, Categoria, Cupom } from '../../../types/types';
import { getCategorias, createAnunciante, updateAnunciante, createCupom, deleteCupom } from '../../../services/api';
import { Trash2 } from 'lucide-react';

interface AnuncianteFormProps {
  anunciante: Anunciante | null;
  onSuccess: () => void;
  onCancel: () => void;
}

// FIX: Moved FormSection outside of AnuncianteForm. 
// Defining a component inside another causes it to be recreated on every render,
// leading to state loss, focus loss, and scroll jumping issues.
const FormSection: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <div className="pt-4 border-t">
        <h3 className="text-md font-semibold text-gray-800 mb-3">{title}</h3>
        {children}
    </div>
);

const AnuncianteForm: React.FC<AnuncianteFormProps> = ({ anunciante, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Anunciante>>({});
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coupons, setCoupons] = useState<Partial<Cupom>[]>([]);
  const [newCoupon, setNewCoupon] = useState({ titulo: '', codigo: '', descricao: '', data_validade: '' });
  
  useEffect(() => {
    async function loadCategorias() {
      const cats = await getCategorias();
      setCategorias(cats);
    }
    loadCategorias();
  }, []);

  useEffect(() => {
    const defaultData = {
        nome_empresa: '',
        descricao: '',
        descricao_curta: '',
        // FIX: Explicitly cast 'plano' to the Anunciante['plano'] type to prevent it from being widened to a generic 'string', resolving the type error on line 57.
        plano: 'bronze' as Anunciante['plano'],
        valor_mensal: 200,
        categoria_id: categorias.length > 0 ? categorias[0].id : '',
        endereco: '',
        cep: '',
        telefone: '',
        whatsapp: '',
        email: '',
        site_url: '',
        instagram: '',
        facebook: '',
        ativo: true,
        destaque: false,
        contrato_inicio: new Date().toISOString().split('T')[0],
        contrato_duracao: 12,
        dia_vencimento: 5,
        renovacao_automatica: false,
        comissao_gestor: 50,
        ordem_exibicao: 99,
        notas_internas: '',
    };
    
    const dataToSet = anunciante ? { ...anunciante } : defaultData;
    setFormData(dataToSet);
    setCoupons(anunciante?.cupons_desconto || []);
    setLogoFile(null);
    setBannerFile(null);

  }, [anunciante, categorias]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const inputValue = isCheckbox ? (e.target as HTMLInputElement).checked : (type === 'number' ? parseFloat(value) || 0 : value);
    setFormData({ ...formData, [name]: inputValue });
  };
  
  const handleAddCoupon = () => {
    if (newCoupon.titulo && newCoupon.codigo && newCoupon.descricao && newCoupon.data_validade) {
        setCoupons([...coupons, { ...newCoupon }]);
        setNewCoupon({ titulo: '', codigo: '', descricao: '', data_validade: '' });
    } else {
        alert('Por favor, preencha todos os campos do cupom, incluindo a data de validade.');
    }
  };

  const handleRemoveCoupon = (indexToRemove: number) => {
    setCoupons(coupons.filter((_, index) => index !== indexToRemove));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoria_id) {
        alert('Por favor, selecione uma categoria.');
        return;
    }
    setIsSubmitting(true);
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, categorias_anunciantes, cupons_desconto, ...submitData} = formData;

    try {
      let savedAnunciante: Anunciante | null;
      if (anunciante) {
        savedAnunciante = await updateAnunciante(anunciante.id, submitData, logoFile || undefined, bannerFile || undefined);
      } else {
        savedAnunciante = await createAnunciante(submitData as any, logoFile || undefined, bannerFile || undefined);
      }
      
      if (savedAnunciante) {
        const originalCoupons = anunciante?.cupons_desconto || [];
        const couponPromises = [];

        // Coupons to delete
        for (const original of originalCoupons) {
            if (!coupons.find(c => c.id === original.id)) {
                couponPromises.push(deleteCupom(original.id));
            }
        }

        // Coupons to add
        for (const newC of coupons) {
            if (!newC.id) { // New coupons don't have an ID
                couponPromises.push(createCupom({
                    titulo: newC.titulo!,
                    codigo: newC.codigo!,
                    descricao: newC.descricao!,
                    anunciante_id: savedAnunciante.id,
                    data_validade: newC.data_validade!,
                }));
            }
        }
        
        await Promise.all(couponPromises);

        alert(`Anunciante ${anunciante ? 'atualizado' : 'criado'} com sucesso!`);
        onSuccess();

      } else {
          throw new Error('Falha ao salvar o anunciante.');
      }
    } catch (error) {
      alert('Ocorreu um erro ao salvar o anunciante.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      {/* Informações Principais */}
      <div>
        <h3 className="text-md font-semibold text-gray-800 mb-2">Informações Principais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nome_empresa" className="block font-medium text-gray-700">Nome da Empresa</label>
            <input type="text" name="nome_empresa" id="nome_empresa" value={formData.nome_empresa || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandGreen focus:border-brandGreen" required />
          </div>
          <div>
              <label htmlFor="categoria_id" className="block font-medium text-gray-700">Categoria</label>
              <select name="categoria_id" id="categoria_id" value={formData.categoria_id || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandGreen focus:border-brandGreen" required>
                  <option value="" disabled>Selecione...</option>
                  {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nome}</option>)}
              </select>
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="descricao_curta" className="block font-medium text-gray-700">Descrição Curta (para os cards)</label>
          <input type="text" name="descricao_curta" id="descricao_curta" value={formData.descricao_curta || ''} onChange={handleInputChange} maxLength={100} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandGreen focus:border-brandGreen" />
        </div>
        <div className="mt-4">
          <label htmlFor="descricao" className="block font-medium text-gray-700">Descrição Completa</label>
          <textarea name="descricao" id="descricao" rows={3} value={formData.descricao || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandGreen focus:border-brandGreen"></textarea>
        </div>
      </div>

      {/* Informações de Contato */}
      <FormSection title="Informações de Contato">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label htmlFor="telefone" className="block font-medium text-gray-700">Telefone</label>
              <input type="tel" name="telefone" id="telefone" value={formData.telefone || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandGreen focus:border-brandGreen" />
            </div>
            <div>
              <label htmlFor="whatsapp" className="block font-medium text-gray-700">WhatsApp</label>
              <input type="tel" name="whatsapp" id="whatsapp" value={formData.whatsapp || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandGreen focus:border-brandGreen" placeholder="Ex: 5511999998888" />
            </div>
             <div>
              <label htmlFor="email" className="block font-medium text-gray-700">E-mail</label>
              <input type="email" name="email" id="email" value={formData.email || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandGreen focus:border-brandGreen" />
            </div>
            <div>
              <label htmlFor="site_url" className="block font-medium text-gray-700">Website</label>
              <input type="url" name="site_url" id="site_url" value={formData.site_url || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandGreen focus:border-brandGreen" placeholder="https://..." />
            </div>
            <div>
              <label htmlFor="instagram" className="block font-medium text-gray-700">Instagram</label>
              <input type="text" name="instagram" id="instagram" value={formData.instagram || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandGreen focus:border-brandGreen" placeholder="usuario_sem_@" />
            </div>
            <div>
              <label htmlFor="facebook" className="block font-medium text-gray-700">Facebook</label>
              <input type="text" name="facebook" id="facebook" value={formData.facebook || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandGreen focus:border-brandGreen" placeholder="usuario_facebook" />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="md:col-span-2">
            <label htmlFor="endereco" className="block font-medium text-gray-700">Endereço</label>
            <input type="text" name="endereco" id="endereco" value={formData.endereco || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandGreen focus:border-brandGreen" />
          </div>
          <div>
            <label htmlFor="cep" className="block font-medium text-gray-700">CEP</label>
            <input type="text" name="cep" id="cep" value={formData.cep || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandGreen focus:border-brandGreen" />
          </div>
        </div>
      </FormSection>

      {/* Plano, Financeiro e Contrato */}
      <FormSection title="Plano, Financeiro e Contrato">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="plano" className="block font-medium text-gray-700">Plano</label>
              <select name="plano" id="plano" value={formData.plano || 'bronze'} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandGreen focus:border-brandGreen">
                <option value="bronze">Bronze</option>
                <option value="prata">Prata</option>
                <option value="ouro">Ouro</option>
              </select>
            </div>
             <div>
              <label htmlFor="valor_mensal" className="block font-medium text-gray-700">Valor (R$)</label>
              <input type="number" name="valor_mensal" id="valor_mensal" value={formData.valor_mensal || 0} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandGreen focus:border-brandGreen" required />
            </div>
             <div>
              <label htmlFor="comissao_gestor" className="block font-medium text-gray-700">Comissão Gestor (%)</label>
              <input type="number" name="comissao_gestor" id="comissao_gestor" min="0" max="100" value={formData.comissao_gestor || 0} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandGreen focus:border-brandGreen" />
            </div>
            <div>
              <label htmlFor="dia_vencimento" className="block font-medium text-gray-700">Dia Venc.</label>
              <input type="number" name="dia_vencimento" id="dia_vencimento" min="1" max="31" value={formData.dia_vencimento || 1} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandGreen focus:border-brandGreen" required />
            </div>
            <div>
              <label htmlFor="contrato_inicio" className="block font-medium text-gray-700">Início Contrato</label>
              <input type="date" name="contrato_inicio" id="contrato_inicio" value={formData.contrato_inicio || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandGreen focus:border-brandGreen" />
            </div>
            <div>
              <label htmlFor="contrato_duracao" className="block font-medium text-gray-700">Duração (meses)</label>
              <input type="number" name="contrato_duracao" id="contrato_duracao" value={formData.contrato_duracao || 0} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandGreen focus:border-brandGreen" />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="renovacao_automatica" checked={formData.renovacao_automatica || false} onChange={handleInputChange} className="h-4 w-4 rounded border-gray-300 text-brandGreen focus:ring-brandGreen" />
                <span className="font-medium text-gray-700">Renov. Automática</span>
              </label>
            </div>
          </div>
      </FormSection>
      
      {/* Mídia e Visibilidade */}
      <FormSection title="Mídia e Visibilidade">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="logoFile" className="block font-medium text-gray-700">Logo</label>
                <input type="file" name="logoFile" id="logoFile" accept="image/*" onChange={e => setLogoFile(e.target.files?.[0] || null)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brandGreen-light file:text-brandGreen-dark hover:file:bg-brandGreen" />
            </div>
            <div>
                <label htmlFor="bannerFile" className="block font-medium text-gray-700">Banner</label>
                <input type="file" name="bannerFile" id="bannerFile" accept="image/*" onChange={e => setBannerFile(e.target.files?.[0] || null)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brandGreen-light file:text-brandGreen-dark hover:file:bg-brandGreen" />
            </div>
        </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-end pb-2">
                <label className="flex items-center gap-2">
                    <input type="checkbox" name="ativo" checked={formData.ativo || false} onChange={handleInputChange} className="h-4 w-4 rounded border-gray-300 text-brandGreen focus:ring-brandGreen" />
                    <span className="font-medium text-gray-700">Anunciante Ativo</span>
                </label>
            </div>
             <div className="flex items-end pb-2">
                <label className="flex items-center gap-2">
                    <input type="checkbox" name="destaque" checked={formData.destaque || false} onChange={handleInputChange} className="h-4 w-4 rounded border-gray-300 text-brandGreen focus:ring-brandGreen" />
                    <span className="font-medium text-gray-700">Anunciante Destaque</span>
                </label>
            </div>
            <div>
                <label htmlFor="ordem_exibicao" className="block font-medium text-gray-700">Ordem de Exibição</label>
                <input type="number" name="ordem_exibicao" id="ordem_exibicao" value={formData.ordem_exibicao || 0} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="Menor = Mais alto" />
            </div>
        </div>
      </FormSection>

      {/* Notas Internas */}
      <FormSection title="Administrativo">
        <div>
          <label htmlFor="notas_internas" className="block font-medium text-gray-700">Notas Internas (visível apenas para admin)</label>
          <textarea name="notas_internas" id="notas_internas" rows={3} value={formData.notas_internas || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea>
        </div>
      </FormSection>

      {/* Cupons de Desconto */}
      <FormSection title="Cupons de Desconto">
          <div className="space-y-2">
              {coupons.length > 0 && coupons.map((cupom, index) => (
                  <div key={cupom.id || `new-${index}`} className="flex items-start justify-between bg-gray-100 p-3 rounded-md">
                      <div>
                          <p className="font-semibold text-gray-800">{cupom.titulo}</p>
                          <p className="font-bold text-brandGreen">{cupom.codigo}</p>
                          <p className="text-gray-600">{cupom.descricao}</p>
                          {cupom.data_validade && (
                            <p className="text-xs text-gray-500 mt-1">
                                Válido até: {new Date(cupom.data_validade).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                            </p>
                          )}
                      </div>
                      <button type="button" onClick={() => handleRemoveCoupon(index)} className="text-red-500 hover:text-red-700 p-1 flex-shrink-0">
                          <Trash2 size={16} />
                      </button>
                  </div>
              ))}
          </div>
          <div className="mt-4 border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  <div>
                      <label htmlFor="cupom-titulo" className="block font-medium text-gray-700">Título do Cupom</label>
                      <input id="cupom-titulo" type="text" value={newCoupon.titulo} onChange={e => setNewCoupon(c => ({...c, titulo: e.target.value}))} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                  </div>
                  <div>
                      <label htmlFor="cupom-codigo" className="block font-medium text-gray-700">Código</label>
                      <input id="cupom-codigo" type="text" value={newCoupon.codigo} onChange={e => setNewCoupon(c => ({...c, codigo: e.target.value.toUpperCase()}))} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                  </div>
                  <div className="md:col-span-2">
                      <label htmlFor="cupom-descricao" className="block font-medium text-gray-700">Descrição</label>
                      <input id="cupom-descricao" type="text" value={newCoupon.descricao} onChange={e => setNewCoupon(c => ({...c, descricao: e.target.value}))} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                  </div>
                  <div>
                      <label htmlFor="cupom-validade" className="block font-medium text-gray-700">Data de Validade</label>
                      <input id="cupom-validade" type="date" value={newCoupon.data_validade} onChange={e => setNewCoupon(c => ({...c, data_validade: e.target.value}))} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                  </div>
              </div>
              <div className="flex justify-end">
                  <button type="button" onClick={handleAddCoupon} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 h-10">
                      Adicionar
                  </button>
              </div>
          </div>
      </FormSection>
      
      {/* Botões */}
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