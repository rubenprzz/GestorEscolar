import { Component, Input, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { AlumnoService } from '../services/alumno.service';
import { MessageService } from 'primeng/api';
import { CursoService } from '../services/curso.service';
import { AsignaturaService } from '../services/asignatura.service';
import {MultiSelectModule} from 'primeng/multiselect';
import {CalendarModule} from 'primeng/calendar';
import {InputTextModule} from 'primeng/inputtext';
import {NgIf} from '@angular/common';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';

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
  @Input() cursoToEdit: any;

  constructor(
    private readonly fb: FormBuilder,
    private readonly cursoService: CursoService,
    private readonly messageService: MessageService,
    private readonly alumnoService: AlumnoService,
    private readonly asignaturaService: AsignaturaService,
    private readonly ref: DynamicDialogRef, private readonly config: DynamicDialogConfig
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadAlumnos();
    this.loadAsignaturas();

    const cursoToEdit = this.config?.data.cursoToEdit;
    const fechaInicio = cursoToEdit.fechaInicio ? new Date(cursoToEdit.fechaInicio) : null;
    const fechaFin = cursoToEdit.fechaFin ? new Date(cursoToEdit.fechaFin) : null;
    const alumnos = cursoToEdit.alumnos || [];

    this.cursoForm = this.fb.group({
      id: [cursoToEdit.id || ''],
      nombre: [cursoToEdit.nombre || '', Validators.required],
      fechaInicio: [fechaInicio || '', Validators.required],
      fechaFin: [fechaFin|| '', Validators.required],
      alumnos: [alumnos, Validators.required], // Campo para mult
      asignaturas: [cursoToEdit.asignaturas?.map((asignatura: any) => asignatura.nombre) || [], Validators.required] // Campo para mult
    });
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
      // Si el formulario es inválido, marcar todos los campos como tocados para mostrar los errores
      Object.keys(this.cursoForm.controls).forEach(field => {
        const control = this.cursoForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }

    const cursoData = this.cursoForm.getRawValue();
    cursoData.fechaInicio = new Date(cursoData.fechaInicio);
    cursoData.fechaFin = new Date(cursoData.fechaFin);
    // Formatear las fechas si es necesario
    if (cursoData.fechaInicio) {
      cursoData.fechaInicio = cursoData.fechaInicio.toISOString().split('T')[0];
    }
    if (cursoData.fechaFin) {
      cursoData.fechaFin = cursoData.fechaFin.toISOString().split('T')[0]; // Formato yyyy-MM-dd
    }

    // Asegurarse de que las asignaturas y alumnos sean arrays si están vacíos
    if (!cursoData.alumnos) cursoData.alumnos = [];
    if (!cursoData.asignaturas) cursoData.asignaturas = [];

    // Extraer solo los identificadores de los alumnos seleccionados
    cursoData.alumnos = cursoData.alumnos.map((alumno: any) => alumno.dni);

    // Extraer solo los nombres de las asignaturas seleccionadas
    cursoData.asignaturas = cursoData.asignaturas.map((asignatura: any) => asignatura.nombre);

    if (cursoData.id) {
      // Si existe el ID, se realiza una actualización
      this.cursoService.updateCurso(cursoData.id, cursoData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Curso actualizado correctamente.'
          });
          this.ref.close(true); // Opcional: cerrar el diálogo si es necesario
          this.cursoForm.reset(); // Reiniciar el formulario
        },
        error: (error) => {
          console.error('Error al actualizar el curso:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error al actualizar el curso',
            detail: 'No se pudo actualizar el curso.'
          });
        }
      });
    } else {
      // Si no existe el ID, se crea un nuevo curso
      this.cursoService.createCurso(cursoData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Curso creado correctamente.'
          });
          this.cursoForm.reset(); // Reiniciar el formulario
          this.ref.close(true); // Opcional: cerrar el diálogo si es necesario
        },
        error: (error) => {
          console.error('Error al crear el curso:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error al crear el curso',
            detail: 'No se pudo crear el curso.'
          });
        }
      });
    }
  }

}
