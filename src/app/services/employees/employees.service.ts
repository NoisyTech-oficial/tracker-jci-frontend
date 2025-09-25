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
    return this.http.get<EmployeesData[]>(`${this.baseUrl}/employee/employees-by-company-document`);
  }

  postEmployee(data: AddEmployee): Observable<any> {
    data.viewing_permission = this.rulesPermission(data.viewing_permission);
    return this.http.post<any>(`${this.baseUrl}/employee/register`, data);
  }

  putEmployeeView(data: PutEmployeeViewData): Observable<any> {
    data.viewing_permission = this.rulesPermission(data.viewing_permission);
    return this.http.put<any>(`${this.baseUrl}/employee/viewing-permission`, data);
  }

  deleteEmployee(document: string): Observable<any> {
    const options = {
      body: { document: document }
    };
    return this.http.delete<any>(`${this.baseUrl}/employee/delete`, options);
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
