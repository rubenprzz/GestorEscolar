import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {NgClass, NgIf} from '@angular/common';
import {InputTextModule} from 'primeng/inputtext';
import {CalendarModule} from 'primeng/calendar';
import {DropdownModule} from 'primeng/dropdown';
import { AlumnoService } from '../../services/alumno.service';
import { CursoService } from '../../services/curso.service';
import {FileUploadModule} from 'primeng/fileupload';

@Component({
  selector: 'app-crear-alumno',
  templateUrl: './crear-alumno.component.html',
  imports: [
    NgClass,
    ReactiveFormsModule,
    InputTextModule,
    NgIf,
    CalendarModule,
    DropdownModule,
    FormsModule,
    FileUploadModule
  ],
  standalone: true
})
export class CrearAlumnoComponent implements OnInit {
  alumnoForm: FormGroup = new FormGroup({});
  cursos: any[] = [];
  @Input() alumnoToEdit: any;

  constructor(private readonly fb: FormBuilder, private readonly alumnoService: AlumnoService, private readonly messageService: MessageService, private readonly cursoService: CursoService) {
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadCursos();  // Cargar los cursos cuando se inicializa el componente

    // Si existe un alumno a editar, cargar sus datos en el formulario
    if (this.alumnoToEdit) {
      this.alumnoForm.patchValue({
        nombre: this.alumnoToEdit.nombre,
        apellidos: this.alumnoToEdit.apellidos,
        dni: this.alumnoToEdit.dni,
        fechaNacimiento: new Date(this.alumnoToEdit.fechaNacimiento),
        email: this.alumnoToEdit.email,
        telefono: this.alumnoToEdit.telefono,
        foto: this.alumnoToEdit.foto, // Si ya existe una foto, cargarla
        cursoNombre: this.alumnoToEdit.cursoNombre,
        padresDnis: this.alumnoToEdit.padresDnis?.join(', '), // Si es un array, unir los DNIs
      });
    }
  }

  initializeForm() {
    this.alumnoForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}[A-Za-z]$/)]], // Validación del DNI
      fechaNacimiento: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      foto: [''],
      cursoNombre: ['', Validators.required],
      padresDnis: [''],
    });
  }

  loadCursos() {
    this.cursoService.getCursos().subscribe({
      next: (data) => {
        this.cursos = data;  // Asigna los cursos al arreglo
      },
      error: (error) => {
        console.error('Error al cargar los cursos:', error);
      }
    });
  }

  // Función para verificar si el campo es inválido
  isFieldInvalid(field: string): any {
    const control = this.alumnoForm?.get(field);
    return control?.invalid && (control?.touched || control?.dirty);
  }

  // Función que se ejecuta al enviar el formulario
  onSubmit() {
    if (this.alumnoForm.invalid) {
      return;
    }

    const formData = new FormData();

    formData.append('nombre', this.alumnoForm.get('nombre')?.value);
    formData.append('apellidos', this.alumnoForm.get('apellidos')?.value);
    formData.append('dni', this.alumnoForm.get('dni')?.value);
    const fechaNacimiento = this.alumnoForm.get('fechaNacimiento')?.value;
    if (fechaNacimiento) {
      formData.append('fechaNacimiento', fechaNacimiento.toISOString());
    }
    formData.append('email', this.alumnoForm.get('email')?.value);
    formData.append('telefono', this.alumnoForm.get('telefono')?.value);
    const cursoNombre = this.alumnoForm.get('cursoNombre')?.value;
    formData.append('cursoNombre', typeof cursoNombre === 'string' ? cursoNombre : cursoNombre.nombre);

    // Si hay foto, agregarla al FormData
    const foto = this.alumnoForm.get('foto')?.value;
    if (foto) {
      formData.append('foto', foto, foto.name);
    }

    const padresDnis = this.alumnoForm.get('padresDnis')?.value;
    if (padresDnis) {
      padresDnis.split(',').forEach((dni: string) => {
        formData.append('padresDnis', dni.trim());
      });
    }

    if (this.alumnoToEdit) {
      // Actualizar el alumno
      this.alumnoService.updateAlumno(this.alumnoToEdit.id, formData).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Alumno actualizado' });
        },
        error: (err) => {
          console.error('Error al actualizar el alumno:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el alumno' });
        }
      });
    } else {
      // Crear nuevo alumno
      this.alumnoService.createAlumno(formData).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Alumno creado' });
          this.alumnoForm.reset();
        },
        error: (err) => {
          console.error('Error al crear el alumno:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el alumno' });
        }
      });
    }
  }

  /*  onCursoChange(event: any) {
      const selectedCurso = event.value;
      if (selectedCurso && selectedCurso.nombre) {
        this.alumnoForm.patchValue({
          cursoNombre: selectedCurso.nombre
        });
      }
    }*/

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.alumnoForm.patchValue({
        foto: file
      });
    }
  }
}

