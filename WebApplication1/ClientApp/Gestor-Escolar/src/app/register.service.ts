import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = `${environment.apiUrl}/account/register`; // URL del endpoint de registro

  constructor(private http: HttpClient) {}

  register(userData: { username: string, email: string, password: string, dni: string }): Observable<any> {
    return this.http.post(this.apiUrl, userData);
  }
}
