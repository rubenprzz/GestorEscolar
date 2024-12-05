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
    return this.http.get(this.apiUrl)
  }
  createRetraso(retraso: any) : Observable<any> {
    return this.http.post(this.apiUrl, retraso)
  }
  updateRetraso(id:number,retraso: any) : Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, retraso)
  }

  deleteRetraso(id: number) : Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
  }
}

