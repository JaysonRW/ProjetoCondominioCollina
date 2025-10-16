
import { supabase } from './supabase';
import { Anunciante, Categoria, Comunicado, Cupom } from '../types/types';

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
        .select(`
            *,
            cupons_desconto(*),
            categorias_anunciantes(*)
        `)
        .eq('ativo', true)
        .order('destaque', { ascending: false })
        .order('ordem_exibicao', { ascending: true });

    if (error) {
        console.error('Error fetching anunciantes:', error);
        return [];
    }
    return data as Anunciante[];
};

export const getAnunciantesDestaque = async (limit: number = 5): Promise<Anunciante[]> => {
    const { data, error } = await supabase
        .from('anunciantes')
        .select(`*, categorias_anunciantes(*)`)
        .eq('ativo', true)
        .eq('destaque', true)
        .order('ordem_exibicao', { ascending: true })
        .limit(limit);
    
    if (error) {
        console.error('Error fetching anunciantes em destaque:', error);
        return [];
    }
    return data as Anunciante[];
};

export const trackAnuncianteView = async (id: string): Promise<void> => {
  const { error } = await supabase.rpc('increment_anunciante_view', { anunciante_id_param: id });
  if (error) {
    console.error('Error tracking view:', error);
  }
};

export const trackAnuncianteClick = async (id: string): Promise<void> => {
  const { error } = await supabase.rpc('increment_anunciante_click', { anunciante_id_param: id });
  if (error) {
    console.error('Error tracking click:', error);
  }
};
