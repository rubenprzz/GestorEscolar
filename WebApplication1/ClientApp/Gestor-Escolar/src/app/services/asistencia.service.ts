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
    return this.http.get(this.apiUrl);

  }
  updateAsistencia(id: number, asistencia: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, asistencia);
  }


  createAsistencia(asistencia: any): Observable<any> {
    return this.http.post(this.apiUrl, asistencia);
  }
  deleteAsistencia(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
  }
