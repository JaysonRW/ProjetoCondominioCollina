export interface Comunicado {
  id: string;
  titulo: string;
  conteudo: string;
  categoria: string;
  data_publicacao: string;
  autor: string;
  imagem_url?: string;
  ativo?: boolean;
}

export interface Categoria {
  id: string;
  nome: string;
  cor: string;
  icone: string;
}

export interface Cupom {
  id: string;
  codigo: string;
  descricao: string;
  anunciante_id: string;
}

export interface Anunciante {
  id: string;
  nome_empresa: string;
  descricao: string;
  logo_url: string;
  banner_url?: string;
  plano: 'bronze' | 'prata' | 'ouro';
  valor_mensal: number;
  categoria_id: string;
  categorias_anunciantes: Categoria; 
  endereco?: string;
  telefone?: string;
  email?: string;
  whatsapp?: string;
  site_url?: string;
  instagram?: string;
  cupons_desconto: Cupom[];
  ativo: boolean;
  visualizacoes: number;
  cliques: number;
  
  // Novos campos financeiros e de contrato
  contrato_inicio?: string;
  contrato_duracao?: number;
  contrato_fim?: string;
  dia_vencimento?: number;
  renovacao_automatica?: boolean;
  comissao_gestor?: number;
  notas_internas?: string;
}

export interface Faq {
  id: string;
  pergunta: string;
  resposta: string;
  ordem: number;
  ativo?: boolean;
}

export interface Evento {
  id: string;
  titulo: string;
  descricao: string;
  data_evento: string;
  horario: string;
  local: string;
  imagem_url?: string;
  ativo?: boolean;
}

export interface Documento {
  id: string;
  titulo: string;
  descricao?: string;
  categoria: string;
  url_arquivo: string;
  data_upload: string;
}

export interface GaleriaImagem {
  id: string;
  titulo: string;
  descricao?: string;
  album: string;
  url_imagem: string;
  data_upload: string;
}

export interface FinanceiroClube {
  id: string;
  anunciante_id: string;
  anunciantes: { nome_empresa: string };
  mes_referencia: string;
  valor_contratado: number;
  valor_pago?: number;
  data_pagamento?: string;
  status: 'pendente' | 'pago' | 'atrasado' | 'cancelado';
}
