import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../environment';


@Injectable({
  providedIn: 'root'
})
export class GenericCrudService {
  constructor(private readonly http: HttpClient) {}

  create<T>(endpoint: string, data: T): Observable<T> {
    return this.http.post<T>(`${environment.apiUrl}/${endpoint}`, data);
  }

}
