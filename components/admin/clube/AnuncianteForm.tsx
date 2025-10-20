import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Anunciante, Categoria } from '../../../types/types';
import { getCategorias, createAnunciante, updateAnunciante } from '../../../services/api';
import { Check, ChevronRight, ChevronLeft, UploadCloud, X } from 'lucide-react';

interface AnuncianteFormProps {
  anunciante: Anunciante | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const AnuncianteForm: React.FC<AnuncianteFormProps> = ({ anunciante, onSuccess, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Anunciante>>({});
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const loadCategorias = useCallback(async () => {
    const cats = await getCategorias();
    setCategorias(cats);
    return cats;
  }, []);

  useEffect(() => {
    loadCategorias();
  }, [loadCategorias]);

  useEffect(() => {
    const initializeForm = async () => {
      const availableCategories = categorias.length > 0 ? categorias : await loadCategorias();
      const defaultData: Partial<Anunciante> = {
        nome_empresa: '',
        descricao: '',
        descricao_curta: '',
        plano: 'bronze',
        valor_mensal: 200,
        categoria_id: availableCategories.length > 0 ? availableCategories[0].id : '',
        whatsapp: '',
        ativo: true,
        destaque: false,
        renovacao_automatica: true,
        contrato_inicio: new Date().toISOString().split('T')[0],
        contrato_duracao: 12,
        dia_vencimento: 5,
        comissao_gestor: 50,
        ordem_exibicao: 99,
      };

      if (anunciante) {
        setFormData(anunciante);
        if (anunciante.logo_url) setLogoPreview(anunciante.logo_url);
        if (anunciante.banner_url) setBannerPreview(anunciante.banner_url);
      } else {
        setFormData(defaultData);
        setLogoPreview(null);
        setBannerPreview(null);
      }
    };
    initializeForm();
  }, [anunciante, categorias, loadCategorias]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const inputValue = isCheckbox ? (e.target as HTMLInputElement).checked : (type.includes('number') ? parseFloat(value) || 0 : value);
    setFormData(prev => ({ ...prev, [name]: inputValue }));
  };

  const handlePlanoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value as Anunciante['plano'] | 'morador';
    const prices: Record<Anunciante['plano'], number> = { bronze: 200, prata: 300, ouro: 400 };
    if (selected === 'morador') {
        setFormData(prev => ({...prev, plano: 'bronze', valor_mensal: 0}));
    } else {
        setFormData(prev => ({...prev, plano: selected, valor_mensal: prices[selected]}));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'logo' | 'banner') => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (fileType === 'logo') {
        setLogoFile(file);
        setLogoPreview(previewUrl);
      } else {
        setBannerFile(file);
        setBannerPreview(previewUrl);
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.nome_empresa || !formData.categoria_id) {
        alert('Por favor, preencha o Nome da Empresa e a Categoria antes de salvar.');
        setCurrentStep(1);
        return;
    }
    setIsSubmitting(true);
    const { id, categorias_anunciantes, cupons_desconto, ...submitData } = formData;

    try {
        const savedAnunciante = anunciante
            ? await updateAnunciante(anunciante.id, submitData, logoFile || undefined, bannerFile || undefined)
            : await createAnunciante(submitData as any, logoFile || undefined, bannerFile || undefined);

        if (savedAnunciante) {
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

  const steps = [
    { id: 1, title: 'Informações', icon: '📋' },
    { id: 2, title: 'Contato', icon: '📞' },
    { id: 3, title: 'Plano & Valores', icon: '💰' },
    { id: 4, title: 'Mídia', icon: '🎨' }
  ];

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const displayPlano = (formData.valor_mensal ?? 0) === 0 ? 'morador' : formData.plano;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {anunciante ? 'Editar Anunciante' : 'Novo Anunciante'}
          </h1>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center justify-between relative">
          {steps.map((step, index) => (
            <div key={step.id} className="flex-1 relative">
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-semibold transition-all ${currentStep === step.id ? 'bg-brandGreen text-white scale-110 shadow-lg' : currentStep > step.id ? 'bg-brandGreen-light text-brandGreen-dark' : 'bg-gray-100 text-gray-400'}`}>
                  {currentStep > step.id ? <Check className="w-6 h-6" /> : step.icon}
                </div>
                <span className={`mt-2 text-xs font-medium ${currentStep === step.id ? 'text-brandGreen' : 'text-gray-500'}`}>{step.title}</span>
              </div>
              {index < steps.length - 1 && <div className={`absolute top-6 left-1/2 w-full h-0.5 -z-10 ${currentStep > step.id ? 'bg-brandGreen' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 mb-6">
        {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="nome_empresa" className="block text-sm font-medium text-gray-700 mb-2">Nome da Empresa *</label>
                <input id="nome_empresa" name="nome_empresa" type="text" value={formData.nome_empresa || ''} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brandGreen focus:border-transparent" placeholder="Ex: Pizzaria Bella Napoli" required />
              </div>
              <div>
                <label htmlFor="categoria_id" className="block text-sm font-medium text-gray-700 mb-2">Categoria *</label>
                <select id="categoria_id" name="categoria_id" value={formData.categoria_id || ''} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brandGreen focus:border-transparent" required>
                  <option value="" disabled>Selecione...</option>
                  {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nome}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="descricao_curta" className="block text-sm font-medium text-gray-700 mb-2">Descrição Curta (para os cards)<span className="text-gray-400 text-xs ml-2">Máx. 100 caracteres</span></label>
                <input id="descricao_curta" name="descricao_curta" type="text" maxLength={100} value={formData.descricao_curta || ''} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brandGreen focus:border-transparent" placeholder="Ex: Tudo para seu pet em um só lugar!" />
                <p className="text-xs text-gray-500 mt-1">{(formData.descricao_curta || '').length}/100 caracteres</p>
              </div>
              <div>
                <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">Descrição Completa *</label>
                <textarea id="descricao" name="descricao" rows={6} value={formData.descricao || ''} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brandGreen focus:border-transparent" placeholder="Descreva os principais produtos/serviços, diferenciais, etc." required />
              </div>
            </div>
        )}
        {currentStep === 2 && (
             <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                  <input type="tel" name="telefone" value={formData.telefone || ''} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brandGreen focus:border-transparent" placeholder="(41) 3333-4444" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp *</label>
                  <input type="tel" name="whatsapp" value={formData.whatsapp || ''} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brandGreen focus:border-transparent" placeholder="5541999887766" required/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                <input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brandGreen focus:border-transparent" placeholder="contato@empresa.com.br" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                  <div className="flex"><span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">@</span><input type="text" name="instagram" value={formData.instagram || ''} onChange={handleInputChange} className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-brandGreen focus:border-transparent" placeholder="nome_usuario" /></div>
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                  <input type="text" name="facebook" value={formData.facebook || ''} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brandGreen focus:border-transparent" placeholder="Nome da Página" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input type="url" name="site_url" value={formData.site_url || ''} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brandGreen focus:border-transparent" placeholder="https://www.exemplo.com.br" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                  <input type="text" name="endereco" value={formData.endereco || ''} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brandGreen focus:border-transparent" placeholder="Rua, Número, Bairro" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                  <input type="text" name="cep" value={formData.cep || ''} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brandGreen focus:border-transparent" placeholder="82400-000" />
                </div>
              </div>
            </div>
        )}
        {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4"><p className="text-sm text-blue-800">💡 <strong>Dica:</strong> Planos mais altos têm maior destaque visual e mais funcionalidades.</p></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Plano *</label>
                  <select value={displayPlano} onChange={handlePlanoChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brandGreen focus:border-transparent">
                    <option value="morador">🏢 Morador (Grátis)</option>
                    <option value="bronze">🥉 Bronze</option>
                    <option value="prata">🥈 Prata</option>
                    <option value="ouro">🥇 Ouro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valor Mensal (R$) *</label>
                  <input type="number" name="valor_mensal" value={formData.valor_mensal || 0} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brandGreen focus:border-transparent disabled:bg-gray-100" placeholder="150.00" disabled={displayPlano === 'morador'} />
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-2">Divisão de Receita</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-yellow-800 mb-1">Comissão Gestor (%)</label>
                    <input type="number" name="comissao_gestor" value={formData.comissao_gestor || 0} onChange={handleInputChange} className="w-full px-4 py-2 border border-yellow-300 rounded-lg" min="0" max="100" />
                    <p className="text-xs text-yellow-700 mt-1">Você: R$ {(((formData.valor_mensal || 0) * (formData.comissao_gestor || 0)) / 100).toFixed(2)}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-yellow-800 mb-1">Condomínio (%)</label>
                    <input type="number" value={100 - (formData.comissao_gestor || 0)} disabled className="w-full px-4 py-2 border border-yellow-300 rounded-lg bg-yellow-100" />
                    <p className="text-xs text-yellow-700 mt-1">Condomínio: R$ {(((formData.valor_mensal || 0) * (100 - (formData.comissao_gestor || 0))) / 100).toFixed(2)}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Início Contrato</label>
                  <input type="date" name="contrato_inicio" value={formData.contrato_inicio?.split('T')[0] || ''} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brandGreen focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duração (meses)</label>
                  <input type="number" name="contrato_duracao" value={formData.contrato_duracao || 12} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brandGreen focus:border-transparent" min="1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dia Vencimento</label>
                  <input type="number" name="dia_vencimento" value={formData.dia_vencimento || 5} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brandGreen focus:border-transparent" min="1" max="28" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="renovacao_automatica" checked={formData.renovacao_automatica || false} onChange={handleInputChange} className="w-5 h-5 text-brandGreen rounded focus:ring-brandGreen" />
                  <span className="text-sm font-medium text-gray-700">Renovação Automática</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notas Internas (apenas você vê)</label>
                <textarea rows={3} name="notas_internas" value={formData.notas_internas || ''} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brandGreen focus:border-transparent" placeholder="Anotações privadas sobre negociação, histórico, etc." />
              </div>
            </div>
        )}
        {currentStep === 4 && (
            <div className="space-y-6">
                <input type="file" ref={logoInputRef} hidden accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} />
                <input type="file" ref={bannerInputRef} hidden accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                  <div onClick={() => logoInputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-brandGreen transition-colors cursor-pointer aspect-square flex flex-col justify-center items-center">
                    {logoPreview ? <img src={logoPreview} alt="Preview do Logo" className="max-h-full max-w-full object-contain rounded-md" /> : <> <div className="text-4xl mb-2">📷</div> <button type="button" className="px-4 py-2 bg-brandGreen text-white rounded-lg hover:bg-brandGreen-dark text-sm">Escolher Arquivo</button> <p className="text-xs text-gray-500 mt-2">PNG, JPG até 2MB</p> </>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Banner</label>
                  <div onClick={() => bannerInputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-brandGreen transition-colors cursor-pointer aspect-video flex flex-col justify-center items-center">
                    {bannerPreview ? <img src={bannerPreview} alt="Preview do Banner" className="max-h-full max-w-full object-contain rounded-md" /> : <> <div className="text-4xl mb-2">🖼️</div> <button type="button" className="px-4 py-2 bg-brandGreen text-white rounded-lg hover:bg-brandGreen-dark text-sm">Escolher Arquivo</button> <p className="text-xs text-gray-500 mt-2">1200x400px recomendado</p> </>}
                  </div>
                </div>
              </div>
              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Configurações de Exibição</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer p-4 border-2 rounded-lg hover:border-brandGreen transition-colors">
                    <input type="checkbox" name="ativo" checked={formData.ativo ?? true} onChange={handleInputChange} className="w-5 h-5 text-brandGreen rounded focus:ring-brandGreen" />
                    <div><div className="font-medium text-gray-900">Anunciante Ativo</div><div className="text-xs text-gray-500">Visível no site</div></div>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-4 border-2 rounded-lg hover:border-brandGreen transition-colors">
                    <input type="checkbox" name="destaque" checked={formData.destaque || false} onChange={handleInputChange} className="w-5 h-5 text-brandGreen rounded focus:ring-brandGreen" />
                    <div><div className="font-medium text-gray-900">Destaque</div><div className="text-xs text-gray-500">Carrossel topo</div></div>
                  </label>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ordem Exibição</label>
                    <input type="number" name="ordem_exibicao" value={formData.ordem_exibicao || 0} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brandGreen focus:border-transparent" placeholder="0" />
                    <p className="text-xs text-gray-500 mt-1">Menor = primeiro</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4"><h4 className="font-medium text-green-900 mb-2">✅ Tudo pronto!</h4><p className="text-sm text-green-800">Revise as informações e clique em "Salvar" para adicionar o anunciante.</p></div>
            </div>
        )}
      </div>

      <div className="flex justify-between items-center bg-white rounded-lg p-4">
        <button onClick={prevStep} disabled={currentStep === 1} className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><ChevronLeft className="w-5 h-5" /> Anterior</button>
        <div className="text-sm text-gray-500">Passo {currentStep} de {steps.length}</div>
        {currentStep < steps.length ? (
          <button onClick={nextStep} className="flex items-center gap-2 px-6 py-3 bg-brandGreen text-white rounded-lg hover:bg-brandGreen-dark transition-colors">Próximo <ChevronRight className="w-5 h-5" /></button>
        ) : (
          <button onClick={handleSubmit} disabled={isSubmitting} className="px-8 py-3 bg-brandGreen text-white rounded-lg hover:bg-brandGreen-dark font-medium transition-colors disabled:bg-gray-400">{isSubmitting ? 'Salvando...' : 'Salvar Anunciante'}</button>
        )}
      </div>
    </div>
  );
};

export default AnuncianteForm;
