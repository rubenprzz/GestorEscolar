import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RetrasoService {
  private readonly apiUrl = environment.apiUrl + '/Retraso';

  constructor(  private readonly http: HttpClient
  ) { }
  getRetrasos() : Observable<any> {
    return this.http.get(this.apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`

      }
    });
  }
  createRetraso(retraso: any) : Observable<any> {
    return this.http.post(this.apiUrl, retraso, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`

      }
    });
  }
  updateRetraso(id:number,retraso: any) : Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, retraso, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`

      }
    });
  }

  deleteRetraso(id: number) : Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`

      }
    });
  }
}

