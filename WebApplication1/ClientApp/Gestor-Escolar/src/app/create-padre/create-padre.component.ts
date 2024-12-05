import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {AlumnoService} from '../services/alumno.service';
import {PadreService} from '../services/padre.service';
import {InputTextModule} from 'primeng/inputtext';
import {NgClass, NgIf} from '@angular/common';
import {MultiSelectModule} from 'primeng/multiselect';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-create-padre',
  standalone: true,
  imports: [
    InputTextModule,
    NgClass,
    ReactiveFormsModule,
    MultiSelectModule,
    Button,
    NgIf
  ],
  templateUrl: './create-padre.component.html',
  styleUrl: './create-padre.component.css'
})
export class CreatePadreComponent {
  padreForm: FormGroup = new FormGroup({});
  alumnos: any[] = []; // Lista de hijos

  constructor(
    private readonly fb: FormBuilder,
    private readonly padreService: PadreService,
    private readonly alumnoService: AlumnoService,
    private readonly messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadHijos();
  }

  initializeForm() {
    this.padreForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      dni: ['', Validators.required],
      telefono: ['', Validators.required],
      AlumnosAsociados: [[], Validators.required], // Campo para multiselect
    });
  }
  onSubmit() {
    if (this.padreForm.invalid) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Por favor, rellena todos los campos.'});
      return;
    }

    this.padreService.createPadre(this.padreForm.value).subscribe({
      next: () => {
        this.messageService.add({severity: 'success', summary: 'Exito', detail: 'Padre creado correctamente.'});
        this.padreForm.reset();
      },
      error: (err) => {
        console.error('Error al crear padre:', err);
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al crear padre.'});
      },
    });
  }

  loadHijos() {
    this.alumnoService.getAlumnos().subscribe({
      next: (data) => {
        this.alumnos = data; // Se espera que `data` sea un array de hijos con `id` y `nombre`
      },
      error: (err) => {
        console.error('Error al cargar hijos:', err);
      },
    });
  }
  isFieldInvalid(field: string): any {
    const control = this.padreForm.get(field);
    return control?.invalid && (control?.dirty || control?.touched);
  }

}
