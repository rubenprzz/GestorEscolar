import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { NgClass } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import {MessageService, SelectItem} from 'primeng/api';
import { CursoService } from '../services/curso.service';
import { ProfesorService } from '../services/profesor.service';
import { InputTextModule } from 'primeng/inputtext';
import {Button, ButtonDirective} from 'primeng/button';
import {AsignaturaService} from '../services/asignatura.service';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-create-asignatura',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    DropdownModule,
    MultiSelectModule,
    InputTextModule,
    ButtonDirective,
    Button,
    FormsModule
  ],
  templateUrl: './create-asignatura.component.html',
  styleUrls: ['./create-asignatura.component.css']
})
export class CreateAsignaturaComponent implements OnInit {
  asignaturaForm: FormGroup;
  @Input() asignaturaToEdit: any;
  cursos: any[] = []; // Lista de cursos
  profesores: any[] = []; // Lista de profesores
  dias: any[] = []; // Días de la semana
  horasDisponiblesInicio: any[] = []; // Horas disponibles
  horasDisponiblesFin: any[] = []; // Horas disponibles

  constructor(
    private readonly fb: FormBuilder,
    private readonly cursoService: CursoService,
    private readonly profesorService: ProfesorService,
    private readonly asignaturaService: AsignaturaService,
    private readonly messageService: MessageService,
    private readonly config:DynamicDialogConfig
  ) {
    this.asignaturaForm = this.fb.group({
      nombre: ['', Validators.required],
      profesorDni: ['', Validators.required],
      cursoNombres: [[], Validators.required],
      dias: [[], Validators.required],  // MultiSelect de días
      horasInicio: ['', Validators.required],  // Hora de inicio
      horasFin: ['', Validators.required],  // Hora de fin
    });
  }

  ngOnInit(): void {
    this.loadCursos();
    this.loadProfesores();
    this.loadDias();
    this.loadHorasDisponiblesFin();
    this.loadHorasDisponiblesInicio();
    const asignaturaToEdit = this.config?.data.asignaturaToEdit;

    this.asignaturaForm = this.fb.group({
      id: [asignaturaToEdit.id || ''],
      nombre: [asignaturaToEdit.nombre || '', Validators.required],
      profesorDni: [asignaturaToEdit.profesorDni || '', Validators.required],
      cursoNombres: [asignaturaToEdit.cursoNombres || '', Validators.required],
      dias: [asignaturaToEdit.dias || '', Validators.required],  // MultiSelect de días
      horasInicio: [asignaturaToEdit.horasInicio || '', Validators.required],  // Hora de inicio
      horasFin: [asignaturaToEdit.horasFin || '', Validators.required],  // Hora de fin
    });


  }

  loadDias() {
    this.dias = [
      { label: 'Lunes', value: 'Lunes' },
      { label: 'Martes', value: 'Martes' },
      { label: 'Miércoles', value: 'Miércoles' },
      { label: 'Jueves', value: 'Jueves' },
      { label: 'Viernes', value: 'Viernes' },
    ];
  }

  loadCursos() {
    this.cursoService.getCursos().subscribe({
      next: (data) => {
        this.cursos = data;
      },
      error: (error) => {
        console.error('Error al cargar los cursos:', error);
      }
    });
  }

  loadProfesores() {
    this.profesorService.getProfesores().subscribe({
      next: (data) => {
        this.profesores = data;
      },
      error: (error) => {
        console.error('Error al cargar los profesores:', error);
      }
    });
  }

  loadHorasDisponiblesInicio() {
    this.horasDisponiblesInicio = [
      { label: '08:00', value: '08:00' },
      { label: '09:00', value: '09:00' },
      { label: '10:00', value: '10:00' },
      { label: '11:00', value: '11:00' },
      { label: '12:00', value: '12:00' },
      { label: '13:00', value: '13:00' },
      { label: '14:00', value: '14:00' },
      { label: '15:00', value: '15:00' },
      { label: '16:00', value: '16:00' },
      { label: '17:00', value: '17:00' }
    ];
  }
  loadHorasDisponiblesFin() {
    this.horasDisponiblesFin = [
      { label: '08:00', value: '08:00' },
      { label: '09:00', value: '09:00' },
      { label: '10:00', value: '10:00' },
      { label: '11:00', value: '11:00' },
      { label: '12:00', value: '12:00' },
      { label: '13:00', value: '13:00' },
      { label: '14:00', value: '14:00' },
      { label: '15:00', value: '15:00' },
      { label: '16:00', value: '16:00' },
      { label: '17:00', value: '17:00' }
    ];
  }


  onSubmit(): void {
    if (this.asignaturaForm.invalid) {
      return;
    }

    const asignaturaData = this.asignaturaForm.value;

    if (asignaturaData.id) {
      // Actualizar asignatura existente
      this.asignaturaService.updateAsignatura(asignaturaData.id, asignaturaData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Asignatura actualizada',
            detail: 'Los datos se han actualizado correctamente.'
          });
        },
        error: (error) => {
          console.error('Error al actualizar asignatura:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar la asignatura.'
          });
        }
      });
    } else {
      // Crear nueva asignatura
      this.asignaturaService.createAsignatura(asignaturaData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Asignatura creada',
            detail: 'Se ha creado una nueva asignatura.'
          });
          this.asignaturaForm.reset();
        },
        error: (error) => {
          console.error('Error al crear asignatura:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear la asignatura.'
          });
        }
      });
    }
  }


  isFieldInvalid(field: string): any {
    const control = this.asignaturaForm.get(field);
    return control?.invalid && (control?.touched || control?.dirty);
  }


}
