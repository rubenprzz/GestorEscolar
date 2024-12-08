import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly apiUrl = `${environment.apiUrl}/account/login`;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { email, password }).pipe(
      tap(response => {
        if (response.token) {
          this.authService.setToken(response.token);
        }
      })
    );
  }

}
