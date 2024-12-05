import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PadreService {
  private readonly apiUrl = environment.apiUrl + '/Padre';

  constructor(  private readonly http: HttpClient
  ) { }
  getPadres(): Observable<any> {
    return this.http.get(this.apiUrl)
  }
  createPadre(padre: any): Observable<any> {
    return this.http.post(this.apiUrl, padre);
  }

  updatePadre(id: number, padre: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, padre);
  }
  getPadreById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  deletePadre(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

