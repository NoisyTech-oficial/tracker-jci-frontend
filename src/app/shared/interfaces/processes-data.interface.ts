export interface LeadOwner {
  id: number;
  nome: string | null;
  image: string | null;
}

export interface ObterLeads {
  id: number;
  nome: string;
  cpf: string;
  numero_processo: string;
  telefone_1: string | null;
  telefone_2: string | null;
  email: string | null;
  banco: string;
  status_id: number;
  pertence_a: number;
  createdAt: string;
  owner?: LeadOwner | null;
}

export interface DetalhesLead {
  nome: string
  banco: string
  processo_assunto: string
  processo_classe: string
  processo_foro: string
  processo_vara: string
  processo_juiz: string
  processo_distribuicao: string
  processo_valor_acao: string
  processo_requerente: string
  processo_advogado_requerente: string
  processo_movimentacoes?: ProcessoMovimentac[]
  processo_documentos?: ProcessoDocumento[]
}

export interface ProcessoMovimentac {
  data: string
  titulo?: string
  descricao: string
}

export interface ProcessoDocumento {
  nome: string
  descricao: string
}

export interface Process {
  process_number: string;
  applicant_name: string | null;
  value: string | null;
  cpf_cnpj: string | null;
  company_name: string | null;
  phone1: string | null;
  phone2: string | null;
  email?: string | null;
  address?: string | null;
  installment_amount?: number | null;
  remaining_installments?: number | null;
  paid_installments?: number | null;
  overdue_installments?: number | null;
  vehicle_brand?: string | null;
  vehicle_model?: string | null;
  vehicle_color?: string | null;
  vehicle_year?: string | null;
  vehicle_plate?: string | null;
  vehicle_renavam?: string | null;
  contract_interest_rate?: number | null;
  contract_fee?: number | null;
  credit_life_insurance?: boolean | null;
  contract_number?: string | null;
  cep: CEP | null;
  distribution_date: string | null;
  created_at: string | null;
}

export interface CEP {
  city: string | null;
  state: string | null;
}

export interface LeadProcessDetails {
  nome: string | null;
  cpf?: string | null;
  banco: string | null;
  numero_processo?: string | null;
  telefone_1?: string | null;
  telefone_2?: string | null;
  email?: string | null;
  status_id?: number | null;
  pertence_a?: number | null;
  createdAt?: string | null;
  owner?: LeadOwner | null;
  processo_assunto: string | null;
  processo_classe: string | null;
  processo_foro: string | null;
  processo_vara: string | null;
  processo_juiz: string | null;
  processo_distribuicao: string | null;
  processo_valor_acao: string | null;
  processo_requerente: string | null;
  processo_requerido?: string | null;
  processo_advogado_requerente: string | null;
  processo_movimentacoes?: ProcessoMovimentac[];
}
