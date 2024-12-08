import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  private readonly apiUrl = environment.apiUrl + '/asistencia';

  constructor(private readonly http: HttpClient
  ) {
  }

  getAsistencias(): Observable<any> {
    return this.http.get(this.apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`

      }
    });

  }
  updateAsistencia(id: number, asistencia: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, asistencia, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`

      }
    });
  }


  createAsistencia(asistencia: any): Observable<any> {
    return this.http.post(this.apiUrl, asistencia, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`

      }
    });
  }
  deleteAsistencia(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`

      }
    });
  }
  }
