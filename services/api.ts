import { supabase } from './supabase';
import { Comunicado, Faq, Evento, Documento, GaleriaImagem, Anunciante, Categoria, FinanceiroClube, Cupom, Banner } from '../types/types';

// Helper for file uploads
const uploadFile = async (file: File, bucket: string, path: string): Promise<string | null> => {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file);
    if (error) {
        console.error(`Error uploading file to ${bucket}:`, error);
        return null;
    }
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return publicUrl;
};

// Helper for file deletion
const deleteFile = async (bucket: string, url: string): Promise<boolean> => {
    try {
        const path = new URL(url).pathname.split(`/${bucket}/`)[1];
        if (!path) return false;
        const { error } = await supabase.storage.from(bucket).remove([path]);
        if (error) {
            console.error(`Error deleting file from ${bucket}:`, error);
            return false;
        }
        return true;
    } catch (e) {
        console.error('Invalid URL for file deletion:', e);
        return false;
    }
};

// Comunicados API
export const getComunicados = async ({ limit, isAdmin = false }: { limit?: number, isAdmin?: boolean } = {}): Promise<Comunicado[]> => {
    let query = supabase.from('comunicado').select('*').order('data_publicacao', { ascending: false });
    if (limit) {
        query = query.limit(limit);
    }
    if (!isAdmin) {
        query = query.eq('ativo', true);
    }
    const { data, error } = await query;
    if (error) console.error('Error fetching comunicados:', error);
    return data || [];
};

export const createComunicado = async (comunicado: Omit<Comunicado, 'id' | 'data_publicacao'>, imageFile?: File): Promise<Comunicado | null> => {
    let imageUrl: string | undefined = undefined;
    if (imageFile) {
        const filePath = `comunicados/${Date.now()}_${imageFile.name}`;
        imageUrl = await uploadFile(imageFile, 'imagens', filePath) || undefined;
    }
    const { data, error } = await supabase.from('comunicado').insert([{ ...comunicado, imagem_url: imageUrl }]).select();
    if (error) {
        console.error('Error creating comunicado:', error);
        return null;
    }
    return data ? data[0] : null;
};

export const updateComunicado = async (id: string, updates: Partial<Comunicado>, imageFile?: File): Promise<Comunicado | null> => {
    let imageUrl = updates.imagem_url;
    if (imageFile) {
        const filePath = `comunicados/${Date.now()}_${imageFile.name}`;
        imageUrl = await uploadFile(imageFile, 'imagens', filePath) || undefined;
    }
    const { data, error } = await supabase.from('comunicado').update({ ...updates, imagem_url: imageUrl }).eq('id', id).select();
    if (error) {
        console.error('Error updating comunicado:', error);
        return null;
    }
    return data ? data[0] : null;
};

export const deleteComunicado = async (id: string, imageUrl?: string): Promise<boolean> => {
    if (imageUrl) {
        await deleteFile('imagens', imageUrl);
    }
    const { error } = await supabase.from('comunicado').delete().eq('id', id);
    if (error) {
        console.error('Error deleting comunicado:', error);
        return false;
    }
    return true;
};

// FAQ API
export const getFaqs = async (isAdmin = false): Promise<Faq[]> => {
    let query = supabase.from('faq').select('*').order('ordem', { ascending: true });
    if (!isAdmin) {
        query = query.eq('ativo', true);
    }
    const { data, error } = await query;
    if (error) console.error('Error fetching FAQs:', error);
    return data || [];
};

export const createFaq = async (faq: Omit<Faq, 'id' | 'ativo'>): Promise<Faq | null> => {
    const { data, error } = await supabase.from('faq').insert([faq]).select();
    if (error) {
        console.error('Error creating FAQ:', error);
        return null;
    }
    return data ? data[0] : null;
};

export const updateFaq = async (id: string, updates: Partial<Faq>): Promise<Faq | null> => {
    const { data, error } = await supabase.from('faq').update(updates).eq('id', id).select();
    if (error) {
        console.error('Error updating FAQ:', error);
        return null;
    }
    return data ? data[0] : null;
};

export const deleteFaq = async (id: string): Promise<boolean> => {
    const { error } = await supabase.from('faq').delete().eq('id', id);
    if (error) {
        console.error('Error deleting FAQ:', error);
        return false;
    }
    return true;
};

// Eventos API
export const getEventos = async (isAdmin = false): Promise<Evento[]> => {
    let query = supabase.from('evento').select('*').order('data_evento', { ascending: false });
    if (!isAdmin) {
        query = query.eq('ativo', true);
    }
    const { data, error } = await query;
    if (error) console.error('Error fetching eventos:', error);
    return data || [];
};

export const getEventosPaginados = async ({ page, pageSize, filter }: { page: number, pageSize: number, filter: 'proximos' | 'anteriores' }): Promise<{ data: Evento[], count: number }> => {
    const today = new Date().toISOString().split('T')[0];
    const isUpcoming = filter === 'proximos';

    let query = supabase.from('evento')
        .select('*', { count: 'exact' })
        .eq('ativo', true)
        .order('data_evento', { ascending: isUpcoming });

    if (isUpcoming) {
        query = query.gte('data_evento', today);
    } else {
        query = query.lt('data_evento', today);
    }
    
    const { data, error, count } = await query.range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
        console.error('Error fetching paginated eventos:', error);
        return { data: [], count: 0 };
    }
    return { data: data || [], count: count || 0 };
};


export const createEvento = async (evento: Omit<Evento, 'id'>, imageFile?: File): Promise<Evento | null> => {
    let imageUrl: string | undefined = undefined;
    if (imageFile) {
        const filePath = `eventos/${Date.now()}_${imageFile.name}`;
        imageUrl = await uploadFile(imageFile, 'imagens', filePath) || undefined;
    }
    const { data, error } = await supabase.from('evento').insert([{ ...evento, imagem_url: imageUrl }]).select();
    if (error) console.error('Error creating evento:', error);
    return data ? data[0] : null;
};

export const updateEvento = async (id: string, updates: Partial<Evento>, imageFile?: File): Promise<Evento | null> => {
    let imageUrl = updates.imagem_url;
    if (imageFile) {
        const filePath = `eventos/${Date.now()}_${imageFile.name}`;
        imageUrl = await uploadFile(imageFile, 'imagens', filePath) || undefined;
    }
    const { data, error } = await supabase.from('evento').update({ ...updates, imagem_url: imageUrl }).eq('id', id).select();
    if (error) console.error('Error updating evento:', error);
    return data ? data[0] : null;
};

export const deleteEvento = async (id: string): Promise<boolean> => {
    // Note: This assumes image deletion is handled separately if needed, as URL isn't passed.
    const { error } = await supabase.from('evento').delete().eq('id', id);
    if (error) console.error('Error deleting evento:', error);
    return !error;
};


// Documentos API
export const getDocumentos = async (): Promise<Documento[]> => {
    const { data, error } = await supabase.from('documento').select('*').order('data_upload', { ascending: false });
    if (error) console.error('Error fetching documentos:', error);
    return data || [];
};

export const createDocumento = async (docData: Omit<Documento, 'id' | 'url_arquivo' | 'data_upload'>, file: File): Promise<Documento | null> => {
    const filePath = `documentos/${Date.now()}_${file.name}`;
    const fileUrl = await uploadFile(file, 'documentos', filePath);
    if (!fileUrl) return null;
    const { data, error } = await supabase.from('documento').insert([{ ...docData, url_arquivo: fileUrl }]).select();
    if (error) {
        console.error('Error creating documento:', error);
        return null;
    }
    return data ? data[0] : null;
};

export const deleteDocumento = async (id: string, fileUrl: string): Promise<boolean> => {
    await deleteFile('documentos', fileUrl);
    const { error } = await supabase.from('documento').delete().eq('id', id);
    if (error) {
        console.error('Error deleting documento:', error);
        return false;
    }
    return true;
};

// Galeria API
export const getImagensGaleria = async (): Promise<GaleriaImagem[]> => {
    const { data, error } = await supabase.from('galeria_imagem').select('*').order('data_upload', { ascending: false });
    if (error) console.error('Error fetching galeria imagens:', error);
    return data || [];
};

export const createImagemGaleria = async (imgData: Omit<GaleriaImagem, 'id' | 'url_imagem' | 'data_upload'>, file: File): Promise<GaleriaImagem | null> => {
    const filePath = `galeria/${imgData.album}/${Date.now()}_${file.name}`;
    const fileUrl = await uploadFile(file, 'imagens', filePath);
    if (!fileUrl) return null;

    const { data, error } = await supabase.from('galeria_imagem').insert([{ ...imgData, url_imagem: fileUrl }]).select();
    if (error) {
        console.error('Error creating imagem galeria:', error);
        return null;
    }
    return data ? data[0] : null;
};

export const deleteImagemGaleria = async (id: string, imageUrl: string): Promise<boolean> => {
    await deleteFile('imagens', imageUrl);
    const { error } = await supabase.from('galeria_imagem').delete().eq('id', id);
    if (error) {
        console.error('Error deleting imagem galeria:', error);
        return false;
    }
    return true;
};

// ANUNCIANTES E CATEGORIAS API

export const getAnunciantes = async (): Promise<Anunciante[]> => {
    const { data, error } = await supabase
        .from('anunciantes')
        .select('*, categorias_anunciantes(*), cupons_desconto(*)')
        .eq('ativo', true)
        .order('plano');
    if (error) console.error('Error fetching anunciantes:', error);
    return (data as any) || [];
};

export const getCategorias = async (): Promise<Categoria[]> => {
    const { data, error } = await supabase.from('categorias_anunciantes').select('*').order('nome');
    if (error) console.error('Error fetching categorias:', error);
    return data || [];
};

export const createCategoria = async (catData: Omit<Categoria, 'id'>): Promise<Categoria | null> => {
    const { data, error } = await supabase.from('categorias_anunciantes').insert([catData]).select().single();
    if (error) {
        console.error('Error creating categoria:', error);
        throw error;
    }
    return data;
};

export const deleteCategoria = async (id: string): Promise<boolean> => {
    // Check if any anunciante is using this category
    const { data: anunciantes, error: fetchError } = await supabase
        .from('anunciantes')
        .select('id')
        .eq('categoria_id', id)
        .limit(1);

    if (fetchError) {
        console.error('Error checking for anunciantes in category:', fetchError);
        return false;
    }

    if (anunciantes && anunciantes.length > 0) {
        alert('Não é possível excluir esta categoria pois ela já está sendo utilizada por um ou mais anunciantes.');
        return false;
    }

    const { error } = await supabase.from('categorias_anunciantes').delete().eq('id', id);
    if (error) {
        console.error('Error deleting categoria:', error);
        return false;
    }
    return true;
};


export const trackAnuncianteView = async (id: string) => {
    const { error } = await supabase.rpc('increment_view_count', { anunciante_id: id });
    if (error) console.error('Error tracking view:', error);
};

export const trackAnuncianteClick = async (id: string) => {
    const { error } = await supabase.rpc('increment_click_count', { anunciante_id: id });
    if (error) console.error('Error tracking click:', error);
};

// Admin view for Clube de Vantagens
export const getAdminAnunciantes = async (): Promise<Anunciante[]> => {
    const { data, error } = await supabase
        .from('anunciantes')
        .select('*, categorias_anunciantes(*), cupons_desconto(*)')
        .order('nome_empresa');
    if (error) console.error('Error fetching admin anunciantes:', error);
    return (data as any) || [];
};

export const createAnunciante = async (anuncianteData: Omit<Anunciante, 'id' | 'categorias_anunciantes' | 'cupons_desconto'>, logoFile?: File, bannerFile?: File): Promise<Anunciante | null> => {
    let logo_url = '';
    let banner_url;

    if (logoFile) {
        logo_url = await uploadFile(logoFile, 'imagens_anunciantes', `anunciantes/${Date.now()}_logo_${logoFile.name}`) ?? '';
    }
    if (bannerFile) {
        banner_url = await uploadFile(bannerFile, 'imagens_anunciantes', `anunciantes/${Date.now()}_banner_${bannerFile.name}`);
    }

    const { data, error } = await supabase
        .from('anunciantes')
        .insert([{ ...anuncianteData, logo_url, banner_url }])
        .select('*, cupons_desconto(*)')
        .single();
    if (error) {
        console.error('Error creating anunciante:', error);
        return null;
    }
    return data as Anunciante;
};

export const updateAnunciante = async (id: string, updates: Partial<Anunciante>, logoFile?: File, bannerFile?: File): Promise<Anunciante | null> => {
    const finalUpdates: Partial<Anunciante> = { ...updates };

    if (logoFile) {
        finalUpdates.logo_url = await uploadFile(logoFile, 'imagens_anunciantes', `anunciantes/${id}_logo_${logoFile.name}`) ?? undefined;
    }
    if (bannerFile) {
        finalUpdates.banner_url = await uploadFile(bannerFile, 'imagens_anunciantes', `anunciantes/${id}_banner_${bannerFile.name}`) ?? undefined;
    }

    const { data, error } = await supabase
        .from('anunciantes')
        .update(finalUpdates)
        .eq('id', id)
        .select('*, cupons_desconto(*)')
        .single();
    
    if (error) {
        console.error('Error updating anunciante:', error);
        return null;
    }
    return data as Anunciante;
};

export const deleteAnunciante = async (id: string, logoUrl?: string, bannerUrl?: string): Promise<boolean> => {
    // First, delete associated financial records to maintain data integrity
    await supabase.from('financeiro_clube').delete().eq('anunciante_id', id);
    
    if (logoUrl) await deleteFile('imagens_anunciantes', logoUrl);
    if (bannerUrl) await deleteFile('imagens_anunciantes', bannerUrl);

    const { error } = await supabase.from('anunciantes').delete().eq('id', id);
    if (error) {
        console.error('Error deleting anunciante:', error);
        return false;
    }
    return true;
};

// Cupons API
export const createCupom = async (cupomData: Omit<Cupom, 'id'>): Promise<Cupom | null> => {
    const { data, error } = await supabase.from('cupons_desconto').insert([cupomData]).select().single();
    if (error) {
        console.error('Error creating cupom:', error);
        return null;
    }
    return data;
};

export const deleteCupom = async (id: string): Promise<boolean> => {
    const { error } = await supabase.from('cupons_desconto').delete().eq('id', id);
    if (error) {
        console.error('Error deleting cupom:', error);
        return false;
    }
    return true;
};


// Financeiro Clube API
export const getFinanceiroClube = async (): Promise<FinanceiroClube[]> => {
    const { data, error } = await supabase
        .from('financeiro_clube')
        .select('*, anunciantes(nome_empresa)')
        .order('mes_referencia', { ascending: false });

    if (error) {
        console.error('Error fetching financeiro data:', error);
        return [];
    }
    return data || [];
};

export const marcarPagamentoComoRecebido = async (financeiroId: string, valorContratado: number): Promise<FinanceiroClube | null> => {
  const { data, error } = await supabase
    .from('financeiro_clube')
    .update({
      status: 'pago',
      data_pagamento: new Date().toISOString().split('T')[0], // FIX: Format to YYYY-MM-DD
      valor_pago: valorContratado
    })
    .eq('id', financeiroId)
    .select()
    .single();

  if (error) {
    console.error('Error marking payment as received:', error);
    return null;
  }
  return data;
};

export const syncCurrentMonthFinancialRecord = async (anunciante: Anunciante) => {
  const today = new Date();
  const mesReferencia = `${today.toISOString().slice(0, 7)}-01`;
  const diaVencimento = anunciante.dia_vencimento || 5;
  // Garante que o dia do vencimento não cause problemas em meses curtos
  const safeDiaVencimento = Math.min(diaVencimento, 28);
  const dataVencimento = new Date(today.getFullYear(), today.getMonth(), safeDiaVencimento).toISOString().split('T')[0];


  const { data: existingRecord } = await supabase
    .from('financeiro_clube')
    .select('id, status')
    .eq('anunciante_id', anunciante.id)
    .eq('mes_referencia', mesReferencia)
    .maybeSingle();

  const shouldHaveRecord = anunciante.ativo && anunciante.valor_mensal && anunciante.valor_mensal > 0;

  if (shouldHaveRecord) {
    // Announcer should have a financial record for this month
    const recordData = {
      anunciante_id: anunciante.id,
      mes_referencia: mesReferencia,
      valor_contratado: anunciante.valor_mensal,
      status: 'pendente' as const,
      data_vencimento: dataVencimento,
    };
    
    if (existingRecord) {
      // Update only if it's not already paid
      if (existingRecord.status !== 'pago') {
        await supabase.from('financeiro_clube').update({ 
            valor_contratado: anunciante.valor_mensal,
            data_vencimento: dataVencimento
        }).eq('id', existingRecord.id);
      }
    } else {
      // Create a new pending record
      await supabase.from('financeiro_clube').insert(recordData);
    }
  } else {
    // Announcer is inactive or free, should NOT have a pending record
    if (existingRecord && existingRecord.status !== 'pago') {
      // If a pending/atrasado record exists, remove it
      await supabase.from('financeiro_clube').delete().eq('id', existingRecord.id);
    }
  }
};


/**
 * Gera cobranças para TODOS os anunciantes ativos do mês atual
 * Útil para rodar manualmente quando necessário
 */
export const gerarCobrancasMesAtual = async (): Promise<{ success: boolean, count: number }> => {
  const { data: anunciantesAtivos, error } = await supabase
    .from('anunciantes')
    .select('*')
    .eq('ativo', true);

  if (error) {
    console.error('Error fetching active advertisers:', error);
    return { success: false, count: 0 };
  }
  
  if (!anunciantesAtivos) {
    return { success: true, count: 0 };
  }

  let count = 0;
  for (const anunciante of anunciantesAtivos) {
    await syncCurrentMonthFinancialRecord(anunciante);
    count++;
  }
  
  return { success: true, count };
};


/**
 * Atualizar status de pagamentos para 'atrasado'
 */
export const atualizarStatusPagamentosAtrasados = async (): Promise<{ success: boolean, count: number }> => {
  const today = new Date().toISOString().split('T')[0];

  const { error, count } = await supabase
    .from('financeiro_clube')
    .update({ status: 'atrasado' })
    .eq('status', 'pendente')
    .lt('data_vencimento', today);

  if (error) {
    console.error('Erro ao atualizar status de pagamentos atrasados:', error);
    return { success: false, count: 0 };
  }

  return { success: true, count: count || 0 };
};

// Banners API

export const getBanners = async (pagina: string): Promise<Banner[]> => {
    const { data, error } = await supabase
        .from('banner')
        .select('*')
        .eq('pagina', pagina)
        .eq('ativo', true)
        .order('ordem', { ascending: true });

    if (error) {
        console.error('Error fetching banners:', error);
        return [];
    }
    
    // Filtrar por datas ativas
    const now = new Date();
    const activeBanners = (data || []).filter(banner => {
      const inicio = banner.data_inicio ? new Date(banner.data_inicio) : null;
      const fim = banner.data_fim ? new Date(banner.data_fim) : null;
      
      if (inicio && now < inicio) return false;
      if (fim && now > fim) return false;
      return true;
    });

    return activeBanners;
};

export const getAdminBanners = async (): Promise<Banner[]> => {
    const { data, error } = await supabase
        .from('banner')
        .select('*')
        .order('pagina')
        .order('ordem');
    if (error) console.error('Error fetching admin banners:', error);
    return data || [];
};

export const createBanner = async (bannerData: Omit<Banner, 'id'>, imageFile: File): Promise<Banner | null> => {
    const filePath = `banners/${Date.now()}_${imageFile.name}`;
    const url_imagem = await uploadFile(imageFile, 'imagens', filePath);
    if (!url_imagem) return null;

    const { data, error } = await supabase
        .from('banner')
        .insert([{ ...bannerData, url_imagem }])
        .select()
        .single();
    if (error) {
        console.error('Error creating banner:', error);
        return null;
    }
    return data;
};

export const updateBanner = async (id: string, updates: Partial<Banner>, imageFile?: File): Promise<Banner | null> => {
    const finalUpdates = { ...updates };
    if (imageFile) {
        const filePath = `banners/${id}_${imageFile.name}`;
        finalUpdates.url_imagem = await uploadFile(imageFile, 'imagens', filePath) || undefined;
    }
    const { data, error } = await supabase
        .from('banner')
        .update(finalUpdates)
        .eq('id', id)
        .select()
        .single();
    if (error) {
        console.error('Error updating banner:', error);
        return null;
    }
    return data;
};

export const deleteBanner = async (id: string, imageUrl: string): Promise<boolean> => {
    await deleteFile('imagens', imageUrl);
    const { error } = await supabase.from('banner').delete().eq('id', id);
    if (error) {
        console.error('Error deleting banner:', error);
        return false;
    }
    return true;
};
