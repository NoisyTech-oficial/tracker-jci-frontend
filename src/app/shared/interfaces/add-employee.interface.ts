export interface AddEmployee {
  name: string;
  documento: string;
  senha: string;
  permissao_visualizacao: string[];
  permissao_recebimento_leads: boolean;
}
