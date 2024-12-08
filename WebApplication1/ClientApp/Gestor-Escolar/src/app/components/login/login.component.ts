import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {LoginService} from '../../services/login.service';
import {Router} from '@angular/router';
import {FloatLabelModule} from 'primeng/floatlabel';
import {InputTextModule} from 'primeng/inputtext';
import {NgIf} from '@angular/common';
import {ButtonDirective} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {PasswordModule} from 'primeng/password';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FloatLabelModule,
    ReactiveFormsModule,
    InputTextModule,
    NgIf,
    ButtonDirective,
    CardModule,
    PasswordModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: LoginService,
    private readonly router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response: { token: string; }) => {
        localStorage.setItem('authToken', response.token);
        this.router.navigate(['/alumnos']);  // Redirigir a la página de inicio o dashboard
      },
      error: (err) => {
        this.errorMessage = 'Credenciales inválidas, por favor intente nuevamente.';
      }
    });
  }

}
