import { Injectable } from '@angular/core';
import {environment} from '../../environment';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {


  private readonly apiUrl = environment.apiUrl + '/Profesor';

  constructor(private readonly http: HttpClient) {

  }

  getProfesores(): Observable<any> {
    return this.http.get(this.apiUrl)
  }
  createProfesor(profesor: any): Observable<any> {
    return this.http.post(this.apiUrl, profesor);
  }
  updateProfesor(id:number, profesor: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, profesor);
  }
  deleteProfesor(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
  getPronfesorById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
