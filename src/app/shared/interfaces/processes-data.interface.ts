export interface FiltersProcesses {
  banks?: string[]
  minimum_value?: number
  maximum_value?: number
  city?: string[]
  state?: string[]
}

export interface TotalNumberProcesses {
  total: number
}

export interface ProcessesData {
  data: Process[]
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