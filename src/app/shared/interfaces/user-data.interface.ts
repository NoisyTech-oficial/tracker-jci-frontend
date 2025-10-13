import { PerfilUsuarioEnum } from "../enums/profile-user.enum";

export interface UserData {
  nome: string | null;
  documento: string;
  documento_empresa: string | null;
  id_advogado: null | string;
  perfil: PerfilUsuarioEnum;
  primeiro_acesso: boolean;
  permissao_visualizacao: string[];
  usuario_ativo: boolean;
  email: string;
  foto: string | null;
  image?: string | null;
  advogado?: UsuarioAdvogado | null;
  plan?: string | null;
}

export interface DadosPerfilUsuario {
  nome: string | null;
  documento: string;
  email: string;
  foto: string | null;
}

export interface UsuarioAdvogado {
  nome?: string | null;
  oab?: string | null;
  email?: string | null;
  telefone?: string | null;
}
