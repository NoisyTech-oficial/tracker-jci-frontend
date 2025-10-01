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
}