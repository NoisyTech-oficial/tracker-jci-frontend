import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddEmployee } from 'src/app/shared/interfaces/add-employee.interface';
import { EmployeesData } from 'src/app/shared/interfaces/employees-data.interface';
import { PutEmployeeViewData } from 'src/app/shared/interfaces/put-employee-view-data';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<EmployeesData[]> {
    return this.http.get<EmployeesData[]>(`${this.baseUrl}/funcionarios/por-documento-empresa`);
  }

  postEmployee(data: AddEmployee): Observable<any> {
    data.permissao_visualizacao = this.rulesPermission(data.permissao_visualizacao);
    return this.http.post<any>(`${this.baseUrl}/funcionarios/cadastrar`, data);
  }

  putEmployeeView(data: PutEmployeeViewData): Observable<any> {
    data.permissao_visualizacao = this.rulesPermission(data.permissao_visualizacao);
    return this.http.put<any>(`${this.baseUrl}/funcionarios/permissoes-visualizacao`, data);
  }

  deleteEmployee(documento: string): Observable<any> {
    const options = {
      body: { documento: documento }
    };
    return this.http.delete<any>(`${this.baseUrl}/funcionarios/deletar`, options);
  }

  rulesPermission(arr: string[]): string[] {
    return arr.map(item =>
      item
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "_")
        .toUpperCase()
    );
  }
}
