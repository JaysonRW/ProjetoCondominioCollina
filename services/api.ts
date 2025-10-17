import { supabase } from './supabase';
import { Anunciante, Categoria, Comunicado, Cupom, Faq, Evento } from '../types/types';

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

// ==================
// EVENTOS API
// ==================

export const getEventos = async (isAdmin: boolean = false): Promise<Evento[]> => {
    let query = supabase.from('eventos').select('*').order('data_evento', { ascending: false });
    if (!isAdmin) {
      query = query.eq('ativo', true);
    }
    const { data, error } = await query;
    if (error) {
      console.error('Error fetching eventos:', error);
      return [];
    }
    return data as Evento[];
};

export const createEvento = async (
  eventoData: Omit<Evento, 'id' | 'ativo'>,
  imageFile?: File
): Promise<Evento | null> => {
  let imageUrl: string | undefined = undefined;

  if (imageFile) {
    const filePath = `public/eventos/${Date.now()}-${imageFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from('eventos-imagens')
      .upload(filePath, imageFile);

    if (uploadError) {
      console.error('Error uploading event image:', uploadError);
    } else {
      const { data: urlData } = supabase.storage
        .from('eventos-imagens')
        .getPublicUrl(filePath);
      imageUrl = urlData.publicUrl;
    }
  }

  const dataToInsert = { ...eventoData, imagem_url: imageUrl, ativo: true };
  const { data, error } = await supabase
    .from('eventos')
    .insert([dataToInsert])
    .select()
    .single();

  if (error) {
    console.error('Error creating evento:', error);
    return null;
  }
  return data as Evento;
};

export const updateEvento = async (
  id: string,
  eventoData: Partial<Omit<Evento, 'id'>>,
  imageFile?: File
): Promise<Evento | null> => {
  let imageUrl: string | undefined = eventoData.imagem_url;

  if (imageFile) {
    const filePath = `public/eventos/${Date.now()}-${imageFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from('eventos-imagens')
      .upload(filePath, imageFile);

    if (uploadError) {
      console.error('Error uploading new event image:', uploadError);
    } else {
      const { data: urlData } = supabase.storage
        .from('eventos-imagens')
        .getPublicUrl(filePath);
      imageUrl = urlData.publicUrl;
    }
  }

  const dataToUpdate = { ...eventoData, imagem_url: imageUrl };
  const { data, error } = await supabase
    .from('eventos')
    .update(dataToUpdate)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating evento:', error);
    return null;
  }
  return data as Evento;
};

export const deleteEvento = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('eventos').delete().eq('id', id);
  if (error) {
    console.error('Error deleting evento:', error);
    return false;
  }
  return true;
};

export const getEventosPaginados = async (options: {
  page: number;
  pageSize: number;
  filter: 'proximos' | 'anteriores';
}): Promise<{ data: Evento[]; count: number }> => {
  const { page, pageSize, filter } = options;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISOString = today.toISOString();

  let query = supabase
    .from('eventos')
    .select('*', { count: 'exact' })
    .eq('ativo', true);

  if (filter === 'proximos') {
    query = query
      .gte('data_evento', todayISOString)
      .order('data_evento', { ascending: true });
  } else { // 'anteriores'
    query = query
      .lt('data_evento', todayISOString)
      .order('data_evento', { ascending: false });
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    console.error('Error fetching paginated eventos:', error);
    return { data: [], count: 0 };
  }

  return { data: data as Evento[], count: count ?? 0 };
};
