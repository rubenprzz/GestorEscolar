import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { RetrasoService } from '../services/retraso.service';
import { AlumnoService } from '../services/alumno.service';
import { AsignaturaService } from '../services/asignatura.service';
import { MessageService } from 'primeng/api';
import {DropdownModule} from 'primeng/dropdown';
import {CalendarModule} from 'primeng/calendar';
import {InputTextModule} from 'primeng/inputtext';
import {NgClass, NgIf} from '@angular/common';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';

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
  @Input() retrasoToEdit: any;

  constructor(
    private readonly fb: FormBuilder,
    private readonly retrasoService: RetrasoService,
    private readonly alumnoService: AlumnoService,
    private readonly asignaturaService: AsignaturaService,
    private readonly messageService: MessageService,
    private readonly ref: DynamicDialogRef, private readonly config: DynamicDialogConfig
  ) {
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadAlumnos();
    this.loadAsignaturas();

    const retrasoToEdit = this.config?.data.retrasoToEdit;
    const fecha = retrasoToEdit.fecha ? new Date(retrasoToEdit.fecha) : null;
    this.retrasoForm = this.fb.group({
      id: [retrasoToEdit.id || ''],
      fecha: [fecha || '', Validators.required],
      minutosRetraso: [retrasoToEdit.minutosRetraso || '', Validators.required],
      horaLlegada: [retrasoToEdit.horaLlegada || '', Validators.required],
      alumnoDni: [retrasoToEdit.alumnoDni || '', Validators.required],
      justificado: [retrasoToEdit.justificado || false],
      motivo: [retrasoToEdit.motivo || '', [Validators.required, Validators.minLength(5)]],
      asignaturaNombre: [retrasoToEdit.asignaturaNombre || '', Validators.required]
    });

  }

  initializeForm() {
    this.retrasoForm = this.fb.group({
      alumnoDni: ['', Validators.required], // ID del alumno seleccionado
      asignaturaNombre: ['', Validators.required], // ID de la asignatura seleccionada
      fecha: ['', Validators.required], // Fecha del retraso
      motivo: ['', [Validators.required, Validators.minLength(5)]], // Motivo del retraso
      justificado: ['' , Validators.required], // Si el retraso está justificado
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
      // Si el formulario es inválido, marcar todos los campos como tocados
      Object.keys(this.retrasoForm.controls).forEach(field => {
        const control = this.retrasoForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }

    const retrasoData = this.retrasoForm.getRawValue();

    // Formatear la hora de llegada si es necesario
    if (retrasoData.horaLlegada) {
      const [hours, minutes] = retrasoData.horaLlegada.split(':');
      retrasoData.horaLlegada = `${hours}:${minutes}`; // Formato "HH:mm"
    }

    // Buscar el alumno y asignatura seleccionados
    const alumnoSeleccionado = this.alumnos.find(alumno => alumno.dni === retrasoData.alumnoDni);
    const asignaturaSeleccionada = this.asignaturas.find(asignatura => asignatura.nombre === retrasoData.asignaturaNombre);

    if (alumnoSeleccionado) {
      retrasoData.alumnoId = alumnoSeleccionado.id; // Asignar el ID del alumno
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se ha encontrado el alumno seleccionado'
      });
      return;
    }

    if (asignaturaSeleccionada) {
      retrasoData.asignaturaId = asignaturaSeleccionada.id; // Asignar el ID de la asignatura
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se ha encontrado la asignatura seleccionada'
      });
      return;
    }

    // Si hay un ID en el retrasoToEdit, significa que estamos editando un retraso existente
    if (retrasoData.id) {
      // Editar un retraso existente
      this.retrasoService.updateRetraso(retrasoData.id, retrasoData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Retraso actualizado',
            detail: 'El retraso se ha actualizado correctamente'
          });
          this.ref.close(true); // Cerrar el diálogo
          this.retrasoForm.reset(); // Reiniciar el formulario
        },
        error: (err) => {
          console.error('Error al actualizar el retraso:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error al actualizar el retraso',
            detail: 'Ha ocurrido un error al actualizar el retraso'
          });
        }
      });
    } else {
      // Crear un nuevo retraso
      this.retrasoService.createRetraso(retrasoData).subscribe({
        next: () => {

          this.ref.close(true); // Cerrar el diálogo
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
