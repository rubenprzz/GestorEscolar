import { Component, Input, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {AlumnoService} from '../services/alumno.service';
import {PadreService} from '../services/padre.service';
import {InputTextModule} from 'primeng/inputtext';
import {NgClass, NgIf} from '@angular/common';
import {MultiSelectModule} from 'primeng/multiselect';
import {Button} from 'primeng/button';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-create-padre',
  standalone: true,
  imports: [
    InputTextModule,
    NgClass,
    ReactiveFormsModule,
    MultiSelectModule,
    Button,
    NgIf
  ],
  templateUrl: './create-padre.component.html',
  styleUrl: './create-padre.component.css'
})
export class CreatePadreComponent implements OnInit {
  padreForm: FormGroup = new FormGroup({});
  alumnos: any[] = [];
  @Input() padreToEdit: any;

  constructor(
    private readonly fb: FormBuilder,
    private readonly padreService: PadreService,
    private readonly alumnoService: AlumnoService,
    private readonly messageService: MessageService,
    private readonly ref: DynamicDialogRef, private readonly config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadHijos();

    const padreToEdit = this.config?.data.padreToEdit;

    this.padreForm = this.fb.group({
      id: [padreToEdit.id || ''],
      nombre: [padreToEdit.nombre || '', Validators.required],
      apellidos: [padreToEdit.apellidos || '', Validators.required],
      dni: [padreToEdit.dni || '', [Validators.required, Validators.pattern(/^\d{8}[A-Za-z]$/)]],
      telefono: [padreToEdit.telefono || '', Validators.required],
      alumnos: [padreToEdit.alumnos?.map((alumno: any) => alumno.dni) || [], Validators.required], // Campo para mult


  });
  }

  initializeForm() {
    this.padreForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}[A-Za-z]$/)]],
      telefono: ['', [Validators.required, Validators.pattern(/^([6789])\d{8}$/)]],
      alumnos: [[], Validators.required], // Campo para multiselect
    });
  }
  onSubmit() {
    if (this.padreForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, rellena todos los campos.',
      });
      return;
    }

    const padreData = this.padreForm.getRawValue();

    if (padreData.id) {
      // Si existe el ID, se actualiza el Padre
      this.padreService.updatePadre(padreData.id, padreData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Padre actualizado correctamente.',
          });
          this.ref.close(); // Cierra el diálogo si es necesario
        },
        error: (err) => {
          console.error('Error al actualizar el padre:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el padre.',
          });
        },
      });
    } else {
      // Si no existe el ID, se crea un nuevo Padre
      this.padreService.createPadre(padreData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Padre creado correctamente.',
          });
          this.padreForm.reset();
          this.ref.close(); // Cierra el diálogo si es necesario
          this.padreService.getPadres().subscribe(); // Recarga la lista de padres
        },
        error: (err) => {
          console.error('Error al crear el padre:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear el padre.',
          });
        },
      });
    }
  }




  loadHijos() {
    this.alumnoService.getAlumnos().subscribe({
      next: (data) => {
        this.alumnos = data;
      },
      error: (err) => {
        console.error('Error al cargar hijos:', err);
      },
    });
  }
  isFieldInvalid(field: string): any {
    const control = this.padreForm.get(field);
    return control?.invalid && (control?.dirty || control?.touched);
  }

}
