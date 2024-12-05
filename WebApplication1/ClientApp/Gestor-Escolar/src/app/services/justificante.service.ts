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
    return this.http.get(this.apiUrl)
  }
  createJustificante(justificante: any): Observable<any> {
    return this.http.post(this.apiUrl, justificante);
  }
  updateJustificante(id: number, justificante:any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, justificante);
  }

  deleteJustificante(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

}
