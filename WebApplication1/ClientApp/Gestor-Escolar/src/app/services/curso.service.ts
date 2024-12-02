import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private readonly apiUrl = environment.apiUrl + '/curso';

  constructor(  private readonly http: HttpClient
  ) { }
  getCursos(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
