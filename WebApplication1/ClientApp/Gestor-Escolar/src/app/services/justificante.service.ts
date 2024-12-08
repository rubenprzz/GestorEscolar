import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JustificanteService {
  private readonly apiUrl = environment.apiUrl + '/Justificante';

  constructor(  private readonly http: HttpClient
  ) { }
  getJustificantes():  Observable<any>  {
    return this.http.get(this.apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`

      }
    });
  }
  createJustificante(justificante: any): Observable<any> {
    return this.http.post(this.apiUrl, justificante, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`

      }
    });
  }
  updateJustificante(id: number, justificante:any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, justificante, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`

      }
    });
  }

  deleteJustificante(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`

      }
    });
  }

}
