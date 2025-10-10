import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { CreateStatusDto, StatusItem, UpdateStatusDto } from 'src/app/shared/interfaces/status.interface';

@Injectable({ providedIn: 'root' })
export class StatusService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getStatuses(): Observable<StatusItem[]> {
    return this.http.get<StatusItem[]>(`${this.baseUrl}/status`);
  }

  createStatus(payload: CreateStatusDto): Observable<StatusItem> {
    return this.http.post<StatusItem>(`${this.baseUrl}/status`, payload);
  }

  updateStatus(id: number | string, payload: UpdateStatusDto): Observable<StatusItem> {
    return this.http.put<StatusItem>(`${this.baseUrl}/status/${id}`, payload);
  }

  deleteStatus(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/status/${id}`);
  }
}
