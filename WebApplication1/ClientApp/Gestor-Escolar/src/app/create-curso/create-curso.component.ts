import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { JustificanteService } from '../services/justificante.service';
import { AlumnoService } from '../services/alumno.service';
import { MessageService } from 'primeng/api';
import { CursoService } from '../services/curso.service';
import { AsignaturaService } from '../services/asignatura.service';
import {MultiSelectModule} from 'primeng/multiselect';
import {CalendarModule} from 'primeng/calendar';
import {InputTextModule} from 'primeng/inputtext';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-create-curso',
  standalone: true,
  imports: [
    MultiSelectModule,
    ReactiveFormsModule,
    CalendarModule,
    InputTextModule,
    NgIf
  ],
  templateUrl: './create-curso.component.html',
  styleUrls: ['./create-curso.component.css']
})
export class CreateCursoComponent implements OnInit {
  cursoForm: FormGroup = new FormGroup({});
  alumnos: any[] = [];
  asignaturas: any[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly cursoService: CursoService,
    private readonly messageService: MessageService,
    private readonly alumnoService: AlumnoService,
    private readonly asignaturaService: AsignaturaService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadAlumnos();
    this.loadAsignaturas();
  }


  initializeForm() {
    this.cursoForm = this.fb.group({
      nombre: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      alumnos: [[], Validators.required], // Cambiado a array para seleccionar varios alumnos
      asignaturas: [[], Validators.required] // Cambiado a array para seleccionar varias asignaturas
    });
  }

  loadAlumnos() {
    this.alumnoService.getAlumnos().subscribe({
      next: (data) => {
        this.alumnos = data;
      },
      error: (error) => {
        console.error('Error al cargar los alumnos:', error);
      }
    });
  }

  loadAsignaturas() {
    this.asignaturaService.getAsignaturas().subscribe({
      next: (data) => {
        this.asignaturas = data;
      },
      error: (error) => {
        console.error('Error al cargar las asignaturas:', error);
      }
    });
  }

  isFieldInvalid(field: string): any {
    const control = this.cursoForm?.get(field);
    return control?.invalid && (control?.touched || control?.dirty);
  }

  onSubmit() {
    if (this.cursoForm.invalid) {
      return;
    }

    const cursoData = this.cursoForm.getRawValue();

    if (cursoData.fechaInicio) {
      cursoData.fechaInicio = cursoData.fechaInicio.toISOString().split('T')[0]; // Formato yyyy-MM-dd
    }
    if (cursoData.fechaFin) {
      cursoData.fechaFin = cursoData.fechaFin.toISOString().split('T')[0]; // Formato yyyy-MM-dd
    }

    // Asegurarse de que las asignaturas y alumnos sean arrays si están vacíos
    if (!cursoData.alumnos) cursoData.alumnos = [];
    if (!cursoData.asignaturas) cursoData.asignaturas = [];


    cursoData.alumnos = cursoData.alumnos.map((alumno: any) => alumno.dni);

    // Extraer solo los identificadores de las asignaturas seleccionadas (si aplica)
    cursoData.asignaturas = cursoData.asignaturas.map((asignatura: any) => asignatura.nombre);

    // Enviar el formulario al servicio para crear el curso
    this.cursoService.createCurso(cursoData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Curso creado',
          detail: 'El curso se ha creado correctamente'
        });
        this.cursoForm.reset(); // Reiniciar el formulario
      },
      error: (error) => {
        console.error('Error al crear el curso:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error al crear el curso',
          detail: 'Ha ocurrido un error al crear el curso'
        });
      }
    });
  }
}
