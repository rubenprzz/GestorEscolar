import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { NgClass, NgIf } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { AlumnoService } from '../../services/alumno.service';
import { AsistenciaService } from '../../services/asistencia.service';
import {JustificanteService} from '../../services/justificante.service';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-crear-justificante',
  templateUrl: './add-justificante.component.html',
  imports: [
    NgClass,
    ReactiveFormsModule,
    InputTextModule,
    NgIf,
    CalendarModule,
    DropdownModule,
    FormsModule
  ],
  standalone: true
})
export class AddJustificanteComponent implements OnInit {
  justificanteForm: FormGroup = new FormGroup({});
  alumnos: any[] = [];
  asistencias: any[] = [];
  @Input() justificanteToEdit: any;
  constructor(
    private readonly fb: FormBuilder,
    private readonly alumnoService: AlumnoService,
    private readonly asistenciaService: AsistenciaService,
    private readonly messageService: MessageService,
    private readonly justi: JustificanteService,
    private readonly ref: DynamicDialogRef, private readonly config: DynamicDialogConfig
  ) {
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadAlumnos();
    this.loadAsistencias();

    const justificanteToEdit = this.config?.data.justificanteToEdit;


    this.justificanteForm = this.fb.group({
      id: [justificanteToEdit.id || ''],
      alias: [{value: justificanteToEdit.alias, disabled: true}],
      fechaJustificacion: [justificanteToEdit.fechaJustificacion || '', Validators.required],
      descripcion: [justificanteToEdit.descripcion || '', Validators.required],
      alumnoDni: [justificanteToEdit.alumnoDni || '', Validators.required],
      motivo: [justificanteToEdit.motivo || '', Validators.required],
      asistenciaIdentificador: [justificanteToEdit.asistenciaIdentificador || '', Validators.required],
    });
  }

  initializeForm() {
    this.justificanteForm = this.fb.group({
      alias: [{value: '', disabled: true}],
      fechaJustificacion: ['', Validators.required],
      descripcion: ['', Validators.required],
      alumnoDni: ['', Validators.required],
      motivo: ['', Validators.required],
      asistenciaIdentificador: ['', Validators.required],
    });
  }

  loadAlumnos() {
    this.alumnoService.getAlumnos().subscribe({
      next: (data) => {
        this.alumnos = data; // Cargar la lista de alumnos
      },
      error: (error) => {
        console.error('Error al cargar los alumnos:', error);
      }
    });
  }

  loadAsistencias() {
    this.asistenciaService.getAsistencias().subscribe({
      next: (data) => {
        this.asistencias = data; // Cargar la lista de asistencias
      },
      error: (error) => {
        console.error('Error al cargar las asistencias:', error);
      }
    });
  }

  // Verifica si un campo del formulario es inválido
  isFieldInvalid(field: string): any {
    const control = this.justificanteForm?.get(field);
    return control?.invalid && (control?.touched || control?.dirty);
  }

  // Genera automáticamente el alias basado en el DNI del alumno y el identificador de asistencia
  generateAlias() {
    const alumnoDni = this.justificanteForm.get('alumnoDni')?.value || '';
    const asistenciaIdentificador = this.justificanteForm.get('asistenciaIdentificador')?.value || '';

    if (alumnoDni && asistenciaIdentificador) {
      const alias = `${alumnoDni.substring(0, 4)}${asistenciaIdentificador}${alumnoDni.slice(-1)}`;
      this.justificanteForm.patchValue({alias});
    }
  }

  onSubmit() {
    if (this.justificanteForm.invalid) {
      // Si el formulario es inválido, marcar todos los campos como tocados para mostrar los errores
      Object.keys(this.justificanteForm.controls).forEach(field => {
        const control = this.justificanteForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }

    const justificanteData = this.justificanteForm.getRawValue();

    // Formatear la fecha si es necesaria
    if (justificanteData.fechaJustificacion) {
      justificanteData.fechaJustificacion = justificanteData.fechaJustificacion.toISOString().split('T')[0]; // Formato yyyy-MM-dd
    }

    if (justificanteData.id) {
      // Si el justificante tiene un ID, se realiza una actualización
      this.justi.updateJustificante(justificanteData.id, justificanteData).subscribe({
        next: () => {

          // Opcional: cerrar el diálogo si es necesario
          this.ref.close(true);

          // Resetear el formulario
          this.justificanteForm.reset();
        },
        error: (error) => {
          console.error('Error al actualizar el justificante:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el justificante. Intente nuevamente.' });
        }
      });
    } else {
      // Si no existe un ID, se crea un nuevo justificante
      this.justi.createJustificante(justificanteData).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Justificante creado correctamente.' });

          // Opcional: cerrar el diálogo si es necesario
          this.ref.close(true);

          // Resetear el formulario
          this.justificanteForm.reset();
        },
        error: (error) => {
          console.error('Error al crear el justificante:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el justificante. Intente nuevamente.' });
        }
      });
    }
  }

}
