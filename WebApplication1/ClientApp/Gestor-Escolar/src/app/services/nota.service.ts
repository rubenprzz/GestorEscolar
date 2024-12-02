import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class NotaService {

  private readonly apiUrl = environment.apiUrl + '/Nota';

  constructor(  private readonly http: HttpClient
  ) { }
  getNotas(){
    return this.http.get(this.apiUrl)
  }

}
