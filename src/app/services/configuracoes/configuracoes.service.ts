import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { EditarConfiguracoes, ObterConfiguracoes } from 'src/app/shared/interfaces/configuracoes.interface';

@Injectable({ providedIn: 'root' })
export class ConfiguracoesService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getConfiguracoes(chave: string): Observable<ObterConfiguracoes> {
    return this.http.get<ObterConfiguracoes>(`${this.baseUrl}/configuracao/${chave}`);
  }

  updateConfiguracoes(chave: string, valor: string): Observable<EditarConfiguracoes> {
    return this.http.put<EditarConfiguracoes>(`${this.baseUrl}/configuracao/${chave}`, { valor: valor });
  }
}
