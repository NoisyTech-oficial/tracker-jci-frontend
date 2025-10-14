import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PutUserData, putUsuario } from 'src/app/shared/interfaces/put-user-data.interface';
import { UserData } from 'src/app/shared/interfaces/user-data.interface';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = environment.apiUrl;
  userData!: UserData;

  constructor(private http: HttpClient) { }

  getUser(): Observable<UserData> {
    return this.http.get<UserData>(`${this.baseUrl}/usuario/dados`);
  }

  PutUsuarioPrimeiroLogin(user: PutUserData): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/usuario/dados`, user);
  }

  putUsuario(user: FormData): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/usuario/perfil`, user);
  }

  uploadAvatar(image: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post<any>(`${this.baseUrl}/usuario/avatar`, formData);
  }

  setUser(user: UserData): void {
    const foto = user.foto ?? user.image ?? null;
    this.userData = { ...user, foto };
  }

  getUserData(): UserData {
    return this.userData;
  }
}
