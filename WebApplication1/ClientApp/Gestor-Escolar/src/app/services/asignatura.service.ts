import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class AsignaturaService {
  private readonly apiUrl = environment.apiUrl + '/Asignatura';

  constructor(  private readonly http: HttpClient
  ) { }

  getAsignaturas(): Observable<any> {
    return this.http.get(this.apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`

      }
    });
  }
  createAsignatura(asignatura: any): Observable<any> {
    return this.http.post(this.apiUrl, asignatura, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`

      }
    });
  }

  updateAsignatura(id:number,asignatura: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, asignatura, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`

      }
    });
  }
  deleteAsignatura(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`

      }
    });
  }
}
