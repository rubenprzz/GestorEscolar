import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ProfesorService } from '../services/profesor.service';
import { AsignaturaService } from '../services/asignatura.service';
import { MessageService } from 'primeng/api';
import {MultiSelectModule} from 'primeng/multiselect';
import {NgClass, NgIf} from '@angular/common';
import {Button} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';

@Component({
  selector: 'app-create-profesor',
  templateUrl: './create-profesor.component.html',
  styleUrls: ['./create-profesor.component.css'],
  imports: [
    ReactiveFormsModule,
    MultiSelectModule,
    NgClass,
    Button,
    InputTextModule,
    NgIf
  ],
  standalone: true
})
export class CreateProfesorComponent implements OnInit {
  profesorForm: FormGroup = new FormGroup({});
  asignaturas: any[] = []; // Lista de asignaturas

  constructor(
    private readonly fb: FormBuilder,
    private readonly profesorService: ProfesorService,
    private readonly asignaturaService: AsignaturaService,
    private readonly messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadAsignaturas();
  }

  initializeForm() {
    this.profesorForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      dni: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      asignaturasId: [[], Validators.required], // Campo para multiselect
    });
  }

  loadAsignaturas() {
    this.asignaturaService.getAsignaturas().subscribe({
      next: (data) => {
        this.asignaturas = data; // Se espera que `data` sea un array de asignaturas con `id` y `nombre`
      },
      error: (err) => {
        console.error('Error al cargar asignaturas:', err);
      },
    });
  }

  isFieldInvalid(field: string): any {
    const control = this.profesorForm.get(field);
    return control?.invalid && (control?.dirty || control?.touched);
  }

  onSubmit() {
    if (this.profesorForm.invalid) {
      return;
    }

    const profesorData = this.profesorForm.getRawValue();

    this.profesorService.createProfesor(profesorData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Profesor creado',
          detail: 'El profesor ha sido creado exitosamente',
        });
        this.profesorForm.reset(); // Reiniciar el formulario
      },
      error: (err: any) => {
        console.error('Error al crear profesor:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error al crear profesor',
          detail: 'Hubo un problema al crear el profesor',
        });
      },
    });
  }
}
