import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DetalhesLead, LeadProcessDetails, ObterLeads } from 'src/app/shared/interfaces/processes-data.interface';
import { environment } from '../../../environments/environment.prod';
import { NumberProcessObtained, ProcessObtained, putStatusOrNotesProcess } from 'src/app/shared/interfaces/processes-obtained-data.interface';

@Injectable({
  providedIn: 'root'
})
export class ProcessesService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getLeads(): Observable<ObterLeads[]> {
    return this.http.get<ObterLeads[]>(`${this.baseUrl}/leads`);
  }

  getDetalhesLeads(id: string): Observable<DetalhesLead> {
    return this.http.get<DetalhesLead>(`${this.baseUrl}/leads/${id}`);
  }

  getLeadProcessDetails(id: string): Observable<LeadProcessDetails> {
    return this.http.get<LeadProcessDetails>(`${this.baseUrl}/leads/${id}/processo`);
  }

  getDocumentos(id: string) {
    return this.http.get<DetalhesLead>(`${this.baseUrl}/documentos-processo/solicitar/${id}`);
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
