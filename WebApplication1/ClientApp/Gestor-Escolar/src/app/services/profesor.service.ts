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
}
