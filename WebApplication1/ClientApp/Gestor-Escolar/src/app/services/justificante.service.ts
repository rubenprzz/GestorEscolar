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

}
