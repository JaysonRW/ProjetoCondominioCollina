import { supabase } from './supabase';
import { Anunciante, Categoria, Comunicado, Cupom, Faq } from '../types/types';

// ==================
// COMUNICADOS API
// ==================

export const getComunicados = async (limit?: number): Promise<Comunicado[]> => {
  let query = supabase
    .from('comunicados')
    .select('*')
    .eq('ativo', true)
    .order('data_publicacao', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching comunicados:', error);
    return [];
  }
  return data as Comunicado[];
};

export const createComunicado = async (
  comunicadoData: Omit<Comunicado, 'id' | 'data_publicacao' | 'ativo'>,
  imageFile?: File
): Promise<Comunicado | null> => {
  let imageUrl: string | undefined = undefined;

  if (imageFile) {
    const filePath = `public/${Date.now()}-${imageFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from('comunicados-imagens')
      .upload(filePath, imageFile);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
    } else {
        const { data: urlData } = supabase.storage
          .from('comunicados-imagens')
          .getPublicUrl(filePath);
        imageUrl = urlData.publicUrl;
    }
  }

  const dataToInsert = { ...comunicadoData, imagem_url: imageUrl };
  const { data, error } = await supabase
    .from('comunicados')
    .insert([dataToInsert])
    .select()
    .single();

  if (error) {
    console.error('Error creating comunicado:', error);
    return null;
  }
  return data as Comunicado;
};


// ==================
// PARCEIROS API
// ==================

export const getCategorias = async (): Promise<Categoria[]> => {
    const { data, error } = await supabase
      .from('categorias_anunciantes')
      .select('*')
      .eq('ativo', true)
      .order('ordem', { ascending: true });
  
    if (error) {
      console.error('Error fetching categorias:', error);
      return [];
    }
    return data as Categoria[];
};

export const getAnunciantes = async (): Promise<Anunciante[]> => {
    const { data, error } = await supabase
        .from('anunciantes')
        .select(`*, cupons_desconto(*), categorias_anunciantes(*)`)
        .eq('ativo', true)
        .order('destaque', { ascending: false })
        .order('ordem_exibicao', { ascending: true });

    if (error) {
        console.error('Error fetching anunciantes:', error);
        return [];
    }
    return data as Anunciante[];
};

export const trackAnuncianteView = async (id: string): Promise<void> => {
  const { error } = await supabase.rpc('increment_anunciante_view', { anunciante_id_param: id });
  if (error) console.error('Error tracking view:', error);
};

export const trackAnuncianteClick = async (id: string): Promise<void> => {
  const { error } = await supabase.rpc('increment_anunciante_click', { anunciante_id_param: id });
  if (error) console.error('Error tracking click:', error);
};

// ==================
// FAQ API
// ==================

export const getFaqs = async (isAdmin: boolean = false): Promise<Faq[]> => {
  let query = supabase.from('faq').select('*').order('ordem', { ascending: true });
  
  if (!isAdmin) {
    query = query.eq('ativo', true);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }
  return data as Faq[];
};

export const createFaq = async (faqData: Omit<Faq, 'id' | 'ativo'>): Promise<Faq | null> => {
  const { data, error } = await supabase
    .from('faq')
    .insert([{ ...faqData, ativo: true }])
    .select()
    .single();

  if (error) {
    console.error('Error creating FAQ:', error);
    return null;
  }
  return data;
};

export const updateFaq = async (id: string, faqData: Partial<Omit<Faq, 'id'>>): Promise<Faq | null> => {
  const { data, error } = await supabase
    .from('faq')
    .update(faqData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating FAQ:', error);
    return null;
  }
  return data;
};

export const deleteFaq = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('faq')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting FAQ:', error);
    return false;
  }
  return true;
};
