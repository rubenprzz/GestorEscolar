import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { RetrasoService } from '../services/retraso.service';
import { AlumnoService } from '../services/alumno.service';
import { AsignaturaService } from '../services/asignatura.service';
import { MessageService } from 'primeng/api';
import {DropdownModule} from 'primeng/dropdown';
import {CalendarModule} from 'primeng/calendar';
import {InputTextModule} from 'primeng/inputtext';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-create-retraso',
  templateUrl: './create-retraso.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DropdownModule,
    CalendarModule,
    InputTextModule,
    NgClass,
    NgIf
  ],
  styleUrls: ['./create-retraso.component.css']
})
export class CreateRetrasoComponent implements OnInit {
  retrasoForm: FormGroup = new FormGroup({});
  alumnos: any[] = [];
  asignaturas: any[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly retrasoService: RetrasoService,
    private readonly alumnoService: AlumnoService,
    private readonly asignaturaService: AsignaturaService,
    private readonly messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadAlumnos();
    this.loadAsignaturas();
  }

  initializeForm() {
    this.retrasoForm = this.fb.group({
      alumnoDni: ['', Validators.required], // ID del alumno seleccionado
      asignaturaNombre: ['', Validators.required], // ID de la asignatura seleccionada
      fecha: ['', Validators.required], // Fecha del retraso
      motivo: ['', [Validators.required, Validators.minLength(5)]], // Motivo del retraso
      horaLlegada: ['', Validators.required] // Hora de llegada del alumno
    });
  }

  loadAlumnos() {
    this.alumnoService.getAlumnos().subscribe({
      next: (data) => {
        this.alumnos = data; // Supone que `data` es un array de alumnos con `id` y `nombre`
      },
      error: (error) => {
        console.error('Error al cargar alumnos:', error);
      }
    });
  }

  loadAsignaturas() {
    this.asignaturaService.getAsignaturas().subscribe({
      next: (data) => {
        this.asignaturas = data; // Supone que `data` es un array de asignaturas con `id` y `nombre`
      },
      error: (error) => {
        console.error('Error al cargar asignaturas:', error);
      }
    });
  }

  isFieldInvalid(field: string): any {
    const control = this.retrasoForm.get(field);
    return control?.invalid && (control?.touched || control?.dirty);
  }

  onSubmit() {
    if (this.retrasoForm.invalid) {
      return;
    }

    const retrasoData = this.retrasoForm.getRawValue();

    // Formatear la hora antes de enviarla
    if (retrasoData.hora) {
      // Aquí le asignamos un valor por defecto si la hora es '00:00:00' o alguna otra lógica que necesites
      const [hours, minutes] = retrasoData.hora.split(':');
      retrasoData.horaLlegada = `${hours}:${minutes}`;  // Formato "HH:mm"
    }

    const alumnoSeleccionado = this.alumnos.find(alumno => alumno.dni === retrasoData.alumnoDni);
    const asignaturaSeleccionada = this.asignaturas.find(asignatura => asignatura.nombre === retrasoData.asignaturaId);

    if (alumnoSeleccionado) {
      retrasoData.alumnoId = alumnoSeleccionado.id;

      if (asignaturaSeleccionada) {
        retrasoData.asignaturaNombre = asignaturaSeleccionada.nombre;
      }

      // Enviar los datos del formulario
      this.retrasoService.createRetraso(retrasoData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Retraso creado',
            detail: 'El retraso se ha creado correctamente'
          });
          this.retrasoForm.reset(); // Reiniciar el formulario
        },
        error: (err) => {
          console.error('Error al crear el retraso:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error al crear el retraso',
            detail: 'Ha ocurrido un error al crear el retraso'
          });
        }
      });
    }
  }
}
