import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class RetrasoService {
  private readonly apiUrl = environment.apiUrl + '/Retraso';

  constructor(  private readonly http: HttpClient
  ) { }
  getRetrasos(){
    return this.http.get(this.apiUrl)
  }
}

