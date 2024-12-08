import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';  // Si deseas usar float labels
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password'; // Para el campo de contraseña
import { RegisterService } from '../register.service';
import {ButtonDirective} from 'primeng/button';
import {CardModule} from 'primeng/card';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, FloatLabelModule, InputTextModule, PasswordModule, NgIf, ButtonDirective, CardModule]
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}[A-Za-z]$')]]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    const { username, email, password, dni } = this.registerForm.value;

    this.registerService.register({ username, email, password, dni }).subscribe({
      next: (response: any) => {
        this.router.navigate(['/alumnos']);
      },
      error: (err: any) => {
        this.errorMessage = 'Hubo un error al registrar el usuario. Por favor, intente nuevamente.';
      }
    });
  }
}
