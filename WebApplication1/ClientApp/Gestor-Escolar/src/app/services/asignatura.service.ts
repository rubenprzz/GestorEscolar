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
    return this.http.get(this.apiUrl);
  }
  createAsignatura(asignatura: any): Observable<any> {
    return this.http.post(this.apiUrl, asignatura);
  }
  deleteAsignatura(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
