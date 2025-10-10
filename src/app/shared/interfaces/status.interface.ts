export interface StatusItem {
  id: number | string;
  nome: string;
  descricao?: string | null;
  codigo_cor?: string | null;
}

export interface CreateStatusDto {
  nome: string;
  descricao?: string | null;
  codigo_cor?: string | null;
}

export interface UpdateStatusDto {
  nome: string;
  descricao?: string | null;
  codigo_cor?: string | null;
}
