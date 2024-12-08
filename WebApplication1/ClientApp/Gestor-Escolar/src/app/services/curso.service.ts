import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private readonly apiUrl = environment.apiUrl + '/curso';

  constructor(  private readonly http: HttpClient
  ) { }
  getCursos(): Observable<any> {
    return this.http.get(this.apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`

      }
    });
  }
  createCurso(curso: any): Observable<any> {
    return this.http.post(this.apiUrl, curso, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`

      }
    });
  }
  updateCurso(id:number,curso: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, curso, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`

      }
    });
  }

  deleteCurso(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`

      }
    });

  }
}
