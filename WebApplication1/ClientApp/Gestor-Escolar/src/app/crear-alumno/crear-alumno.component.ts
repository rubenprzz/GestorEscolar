import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { AlumnoService } from '../services/alumno.service';
import {MessageService} from 'primeng/api';
import {NgClass, NgIf} from '@angular/common';
import {InputTextModule} from 'primeng/inputtext';
import {CalendarModule} from 'primeng/calendar';
import {CursoService} from '../services/curso.service';
import {DropdownModule} from 'primeng/dropdown';

@Component({
  selector: 'app-crear-alumno',
  templateUrl: './crear-alumno.component.html',
  imports: [
    NgClass,
    ReactiveFormsModule,
    InputTextModule,
    NgIf,
    CalendarModule,
    DropdownModule
  ],
  standalone: true
})
export class CrearAlumnoComponent implements OnInit {
  alumnoForm: FormGroup = new FormGroup({});
  cursos: any[] = [];


  constructor(private readonly fb: FormBuilder, private readonly alumnoService: AlumnoService, private readonly messageService: MessageService, private readonly cursoService: CursoService) {
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadCursos();  // Cargar los cursos cuando se inicializa el componente

  }

  initializeForm() {
    this.alumnoForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}[A-Za-z]$/)]], // Validación del DNI
      fechaNacimiento: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      foto: [''],
      cursoNombre: ['', Validators.required],
      padresDnis: [''],
    });
  }

  loadCursos() {
    this.cursoService.getCursos().subscribe({
      next: (data) => {
        this.cursos = data;  // Asigna los cursos al arreglo
      },
      error: (error) => {
        console.error('Error al cargar los cursos:', error);
      }
    });
  }

  // Función para verificar si el campo es inválido
  isFieldInvalid(field: string): any {
    const control = this.alumnoForm?.get(field);
    return control?.invalid && (control?.touched || control?.dirty);
  }

  // Función que se ejecuta al enviar el formulario
  onSubmit() {
    if (this.alumnoForm.invalid) {
      return;
    }

    const formData = new FormData();

    // Agregar los datos del formulario al FormData
    formData.append('nombre', this.alumnoForm.get('nombre')?.value);
    formData.append('apellidos', this.alumnoForm.get('apellidos')?.value);
    formData.append('dni', this.alumnoForm.get('dni')?.value);
    const fechaNacimiento = this.alumnoForm.get('fechaNacimiento')?.value;
    if (fechaNacimiento) {
      formData.append('fechaNacimiento', fechaNacimiento.toISOString());
    }
    formData.append('email', this.alumnoForm.get('email')?.value);
    formData.append('telefono', this.alumnoForm.get('telefono')?.value);
    formData.append('cursoNombre', this.alumnoForm.get('cursoNombre')?.value);

    // Si hay foto, agregarla al FormData
    const foto = this.alumnoForm.get('foto')?.value;
    if (foto) {
      formData.append('foto', foto, foto.name);
    }

    const padresDnis = this.alumnoForm.get('padresDnis')?.value;
    if (padresDnis) {
      padresDnis.split(',').forEach((dni: string) => {
        formData.append('padresDnis', dni.trim());
      });
    }

    // Realizar la solicitud HTTP POST
    this.alumnoService.createAlumno(formData).subscribe({
      next: () => {
        this.messageService.add({severity: 'success', summary: 'Exito', detail: 'Alumno creado'});
        this.alumnoForm.reset();  // Reiniciar el formulario
      },
      error: (err) => {
        console.error('Error al crear el alumno:', err);
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se pudo crear el alumno'});
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.alumnoForm.patchValue({
        foto: file
      });
    }
  }
}

