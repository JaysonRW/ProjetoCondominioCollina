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
  ordem: number;
  slug: string;
}

export interface Cupom {
  id: string;
  titulo: string;
  codigo: string;
  descricao: string;
  anunciante_id: string;
  data_validade: string;
}

export interface Anunciante {
  id: string;
  nome_empresa: string;
  descricao: string;
  descricao_curta?: string;
  logo_url: string;
  banner_url?: string;
  plano: 'bronze' | 'prata' | 'ouro' | 'morador';
  valor_mensal: number;
  categoria_id: string;
  categorias_anunciantes: Categoria; 
  endereco?: string;
  cep?: string;
  telefone?: string;
  email?: string;
  whatsapp?: string;
  site_url?: string;
  instagram?: string;
  facebook?: string;
  cupons_desconto: Cupom[];
  ativo: boolean;
  destaque?: boolean;
  ordem_exibicao?: number;
  visualizacoes: number;
  cliques: number;
  
  // Campos financeiros e de contrato
  contrato_inicio?: string;
  contrato_duracao?: number; // em meses
  contrato_fim?: string;
  dia_vencimento?: number;
  renovacao_automatica?: boolean;
  comissao_gestor?: number; // percentual
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