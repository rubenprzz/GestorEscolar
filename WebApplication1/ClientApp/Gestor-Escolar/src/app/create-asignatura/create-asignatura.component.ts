import { Component, OnInit } from '@angular/core';
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
    private readonly messageService: MessageService
  ) {
    this.asignaturaForm = this.fb.group({
      nombre: ['', Validators.required],
      profesorDni: ['', Validators.required],
      cursoNombre: ['', Validators.required],
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

    const asignaturaData = this.asignaturaForm.getRawValue();

    // Asegurar que cursoNombres sea siempre un array
    const cursosSeleccionados = Array.isArray(asignaturaData.cursoNombre)
      ? asignaturaData.cursoNombre
      : [asignaturaData.cursoNombre];

    const asignatura = {
      nombre: asignaturaData.nombre,
      profesorDni: asignaturaData.profesorDni,
      cursoNombres: cursosSeleccionados, // Aseguramos que es un array
      dias: asignaturaData.dias,
      horasInicio: asignaturaData.horasInicio,
      horasFin: asignaturaData.horasFin
    };

    console.log('Asignatura a crear:', asignatura);

    this.asignaturaService.createAsignatura(asignatura).subscribe({
      next: (response) => {
        console.log('Asignatura creada con éxito:', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Asignatura creada',
          detail: 'La asignatura se ha creado correctamente'
        });
        this.asignaturaForm.reset();
      },
      error: (error) => {
        console.error('Error al crear asignatura:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error al crear asignatura',
          detail: 'Ha ocurrido un error al crear la asignatura'
        });
      }
    });
  }


  isFieldInvalid(field: string): any {
    const control = this.asignaturaForm.get(field);
    return control?.invalid && (control?.dirty || control?.touched);
  }
}
