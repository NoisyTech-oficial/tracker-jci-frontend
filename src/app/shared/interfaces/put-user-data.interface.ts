export interface PutUserData {
  nome?: string;
  advogado?: AdvogadoDados | null;
  primeiro_acesso?: boolean;
  aceitou_termos?: boolean;
}

export interface AdvogadoDados {
  email: string;
  senha: string;
  totip: string;
}
