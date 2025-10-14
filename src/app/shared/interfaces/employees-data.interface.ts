export interface EmployeesData {
  nome: string | null;
  documento: string;
  permissao_visualizacao: string[];
  permissao_recebimento_leads?: boolean;
}
