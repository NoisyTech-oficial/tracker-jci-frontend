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

export interface putUsuario {
  nome: string | null;
  email: string | null;
  foto: string | null;
}
