import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { AlumnoService } from '../services/alumno.service';
import { AsignaturaService } from '../services/asignatura.service';
import { AsistenciaService } from '../services/asistencia.service';
import {DropdownModule} from 'primeng/dropdown';
import {Button} from 'primeng/button';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-create-asistencia',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DropdownModule,
    Button
  ],
  templateUrl: './create-asistencia.component.html',
  styleUrls: ['./create-asistencia.component.css'],
})
export class CreateAsistenciaComponent implements OnInit {
  alumnos: any[] = [];
  asignaturas: any[] = [];
  estadoAsistencia = [
    { label: 'Presente', value: true },
    { label: 'Ausente', value: false },
  ];
  asistenciaForm: FormGroup;

  constructor(
    private readonly alumnoService: AlumnoService,
    private readonly asignaturaService: AsignaturaService,
    private readonly asistenciaService: AsistenciaService,
    private readonly messageService: MessageService,
    private readonly fb: FormBuilder
  ) {
    this.asistenciaForm = this.fb.group({
      alumnoDni: ['', Validators.required],
      asignaturaNombre: ['', Validators.required],
      isPresent: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadAlumnos();
    this.loadAsignaturas();
  }

  loadAlumnos() {
    this.alumnoService.getAlumnos().subscribe({
      next: (data) => {
        this.alumnos = data.map((alumno: any) => ({
          dni: alumno.dni,
          nombre: alumno.nombre,
        }));
      },
      error: (error) => {
        console.error('Error al cargar alumnos:', error);
      },
    });
  }
  loadAsistencias() {
    this.asistenciaService.getAsistencias().subscribe({
      next: (data) => {
        this.alumnos = data.map((asistencia: any) => ({
          dni: asistencia.dni,
          nombre: asistencia.nombre,
          asignatura: asistencia.asignatura,
          presente: asistencia.presente,
        }));
      },
      error: (error) => {
        console.error('Error al cargar asistencias:', error);
      },
    });
  }

  loadAsignaturas() {
    this.asignaturaService.getAsignaturas().subscribe({
      next: (data) => {
        this.asignaturas = data.map((asignatura: any) => ({
          nombre: asignatura.nombre,
        }));
      },
      error: (error) => {
        console.error('Error al cargar asignaturas:', error);
      },
    });
  }

  onSubmit() {
    if (this.asistenciaForm.invalid) {
      return;
    }

    const asistencia = this.asistenciaForm.value;
    this.asistenciaService.createAsistencia(asistencia).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Asignatura creada',
          detail: 'La asignatura se ha creado correctamente'
        });
        this.asistenciaForm.reset();
      },
      error: (error) => {
        console.error('Error al crear asistencia:', error);
      },
    });
    this.loadAsistencias();
  }
}
