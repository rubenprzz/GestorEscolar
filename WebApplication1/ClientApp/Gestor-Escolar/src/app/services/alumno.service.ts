import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // Importa HttpClient
import { Observable } from 'rxjs';
import {environment} from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {
  private readonly apiUrl = environment.apiUrl + '/Alumno';

  constructor(private readonly http: HttpClient) { }

  getAlumnos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createAlumno(alumno: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, alumno);
  }

  updateAlumno(alumno: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${alumno.id}`, alumno);
  }

  deleteAlumno(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

