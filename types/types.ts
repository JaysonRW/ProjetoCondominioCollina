export interface Categoria {
  id: string;
  nome: string;
  icone: string;
  cor: string;
  ordem: number;
}

export interface Cupom {
  id: string;
  anunciante_id: string;
  codigo: string;
  descricao: string;
  percentual_desconto?: number;
  valor_desconto?: number;
  data_validade: string;
  ativo: boolean;
}

export interface Anunciante {
  id: string;
  nome_empresa: string;
  categoria_id: string;
  descricao: string;
  telefone?: string;
  whatsapp?: string;
  email?: string;
  endereco?: string;
  site_url?: string;
  instagram?: string;
  logo_url?: string;
  banner_url?: string;
  plano: 'bronze' | 'prata' | 'ouro';
  ativo: boolean;
  destaque: boolean;
  visualizacoes: number;
  cliques: number;
  cupons_desconto?: Cupom[];
  categorias_anunciantes: Categoria;
}

export interface Comunicado {
  id: string;
  titulo: string;
  conteudo: string;
  data_publicacao: string;
  autor: string;
  categoria: 'urgente' | 'informativo' | 'evento' | string;
  imagem_url?: string;
  ativo: boolean;
}

export interface Faq {
  id: string;
  pergunta: string;
  resposta: string;
  ordem: number;
  ativo: boolean;
}

export interface Evento {
  id: string;
  titulo: string;
  descricao: string;
  data_evento: string;
  horario: string;
  local: string;
  imagem_url?: string;
  ativo: boolean;
}