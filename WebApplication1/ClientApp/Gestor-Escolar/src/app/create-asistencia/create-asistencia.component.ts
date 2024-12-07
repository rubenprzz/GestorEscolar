import { Component, Input, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { AlumnoService } from '../services/alumno.service';
import { AsignaturaService } from '../services/asignatura.service';
import { AsistenciaService } from '../services/asistencia.service';
import {DropdownModule} from 'primeng/dropdown';
import {Button} from 'primeng/button';
import {MessageService} from 'primeng/api';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';

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
  @Input() asistenciaToEdit: any;

  constructor(
    private readonly alumnoService: AlumnoService,
    private readonly asignaturaService: AsignaturaService,
    private readonly asistenciaService: AsistenciaService,
    private readonly messageService: MessageService,
    private readonly fb: FormBuilder,
    private readonly ref: DynamicDialogRef, private readonly config: DynamicDialogConfig
  ) {
    this.asistenciaForm = this.fb.group({
      alumnoDni: ['', Validators.required],
      asignaturaNombre: ['', Validators.required],
      isPresent: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadAlumnos();
    this.loadAsignaturas();

    this.asistenciaToEdit = this.config?.data.asistenciaToEdit;

    this.asistenciaForm = this.fb.group({
      id: [this.asistenciaToEdit.id || ''],
      alumnoDni: [this.asistenciaToEdit.alumnoDni || '', Validators.required],
      asignaturaNombre: [this.asistenciaToEdit.asignaturaNombre || '', Validators.required],
      isPresent: [this.asistenciaToEdit.isPresent || '', Validators.required],
    });
  }
  /*initializeForm() {
    this.alumnoForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}[A-Za-z]$/)]], // Validación del DNI
      fechaNacimiento: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      urlFoto: [''],
      cursoNombre: ['', Validators.required],
      padresDnis: [''],
    });
  }
*/

  initializeForm() {
    this.asistenciaForm = this.fb.group({
      alumnoDni: ['', Validators.required],
      asignaturaNombre: ['', Validators.required],
      isPresent: [null, Validators.required],
    });
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

    const asistenciaData = this.asistenciaForm.value;

    if (asistenciaData.id) {
      // Actualizar asistencia existente
      this.asistenciaService.updateAsistencia(asistenciaData.id, asistenciaData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Asistencia actualizada correctamente'
          });
          this.asistenciaForm.reset();
          this.loadAsistencias();
        },
        error: (err) => {
          console.error('Error al actualizar la asistencia:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar la asistencia'
          });
        },
      });
    } else {
      // Crear nueva asistencia
      this.asistenciaService.createAsistencia(asistenciaData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Asistencia creada correctamente'
          });
          this.asistenciaForm.reset();
          this.loadAsistencias();
        },
        error: (err) => {
          console.error('Error al crear la asistencia:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear la asistencia'
          });
        },
      });
    }
  }
}
