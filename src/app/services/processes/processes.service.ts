import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FiltersProcesses, ProcessesData, TotalNumberProcesses } from 'src/app/shared/interfaces/processes-data.interface';
import { environment } from '../../../environments/environment.prod';
import { NumberProcessObtained, ProcessObtained, putStatusOrNotesProcess } from 'src/app/shared/interfaces/processes-obtained-data.interface';

@Injectable({
  providedIn: 'root'
})
export class ProcessesService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getTotalNumberProcesses(data: FiltersProcesses | null): Observable<TotalNumberProcesses> {
    const body = data || {};
    return this.http.post<TotalNumberProcesses>(`${this.baseUrl}/processes/total-number`, body);
  }

  getProcesses(data?: FiltersProcesses): Observable<ProcessesData> {
    const body = data || {};
    return this.http.post<ProcessesData>(`${this.baseUrl}/processes/export`, body);
  }

  getProcessesObtained(): Observable<ProcessObtained[]> {
    return this.http.get<ProcessObtained[]>(`${this.baseUrl}/processes-obtained/details`);
  }

  getNumberProcessesObtained(): Observable<NumberProcessObtained> {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    return this.http.get<NumberProcessObtained>(`${this.baseUrl}/processes-obtained/total-number?month=${month}&year=${year}`);
  }

  putStatusOrNotesProcess(data: putStatusOrNotesProcess): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/processes-obtained/details`, data);
  }

}
