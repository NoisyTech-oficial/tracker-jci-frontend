import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Banks } from 'src/app/shared/interfaces/banks.interface';
import { Cep } from 'src/app/shared/interfaces/cep.interface';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class GeneralDataService {

  // Defina a base URL a partir do environment
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getStateAndCities(): Observable<Cep> {
    return this.http.get<Cep>(`${this.baseUrl}/general-data/cities-and-states`);
  }

  getBanksContainLawsuits(): Observable<Banks[]> {
    return this.http.get<Banks[]>(`${this.baseUrl}/general-data/banks-contain-lawsuits`);
  }
}
