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
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {MultiSelectModule} from 'primeng/multiselect';
import {PadreService} from '../../services/padre.service';
import {Padre} from '../../models/padre.model';

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
    FileUploadModule,
    MultiSelectModule
  ],
  standalone: true
})
export class CrearAlumnoComponent implements OnInit {
  alumnoForm: FormGroup = new FormGroup({});
  cursos: any[] = [];
  padres: any[] = [];
  @Input() alumnoToEdit: any;
  public reff?: DynamicDialogRef
  public configg?: DynamicDialogConfig

  constructor(private readonly fb: FormBuilder, private readonly alumnoService: AlumnoService, private readonly messageService: MessageService, private readonly padreService: PadreService , private readonly cursoService: CursoService, private readonly ref: DynamicDialogRef, private readonly config: DynamicDialogConfig) { }


  ngOnInit(): void {
    this.initializeForm();
    console.log('Alumno a editar:', this.alumnoToEdit);
    this.loadCursos();
    this.loadPadres();
    // Cargar los cursos cuando se inicializa el componente

    const alumnoToEdit = this.config?.data.alumnoToEdit;
    const fechaNacimiento = alumnoToEdit.fechaNacimiento ? new Date(alumnoToEdit.fechaNacimiento) : null;

    const padresDnis = Array.isArray(alumnoToEdit.padresDnis)
      ? alumnoToEdit.padresDnis.map((padre: Padre) => padre.dni)
      : [];


    this.alumnoForm = this.fb.group({
      id: [alumnoToEdit.id || ''],
      nombre: [alumnoToEdit.nombre || '', Validators.required],
      apellidos: [alumnoToEdit.apellidos || '', Validators.required],
      dni: [alumnoToEdit.dni || '', [Validators.required, Validators.pattern(/^\d{8}[A-Za-z]$/)]], // Validación del DNI
      fechaNacimiento: [fechaNacimiento || '', Validators.required],
      email: [alumnoToEdit.email || '', [Validators.required, Validators.email]],
      telefono: [alumnoToEdit.telefono || ''],
      urlFoto: [alumnoToEdit.urlFoto || ''],
      cursoNombre: [alumnoToEdit.curso || '', Validators.required],
      padresDnis: [padresDnis || [], Validators.required],  // Asignar solo los DNIs

      });


  }

  initializeForm() {
    this.alumnoForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}[A-Za-z]$/)]], // Validación del DNI
      fechaNacimiento: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      urlFoto: [''],
      cursoNombre: ['', Validators.required],
      padresDnis: [[], Validators.required],
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
  loadPadres() {
    this.padreService.getPadres().subscribe({
      next: (data) => {
        this.padres = data.map((padre: any) => ({ dni: padre.dni }));  // Mapea los datos para crear un array de objetos con la propiedad `dni`
      },
      error: (error) => {
        console.error('Error al cargar los padres:', error);
      }
    });
  }


  // Función para verificar si el campo es inválido
  isFieldInvalid(field: string): any {
    const control = this.alumnoForm?.get(field);
    return control?.invalid && (control?.touched || control?.dirty);
  }

  onSubmit() {
    if (this.alumnoForm.invalid) {
      return;
    }

    const formData = new FormData();
    const alumnoData = this.alumnoForm.value;
    formData.append('id', alumnoData.id);
    formData.append('nombre', alumnoData.nombre);
    formData.append('apellidos', alumnoData.apellidos);
    formData.append('dni', alumnoData.dni);

    if (alumnoData.fechaNacimiento) {
      formData.append('fechaNacimiento', alumnoData.fechaNacimiento.toISOString());
    }

    formData.append('email', alumnoData.email);
    formData.append('telefono', alumnoData.telefono || '');
    formData.append('cursoNombre', alumnoData.cursoNombre);

    // Si el campo 'padresDnis' es un array de objetos, se puede mapear para enviar los DNIs.
    const padresDnis = alumnoData.padresDnis.map((padre: any) => padre.dni);
    padresDnis.forEach((dni: string) => {
      formData.append('padresDnis', dni);
    });

    if (alumnoData.urlFoto) {
      formData.append('urlFoto', alumnoData.urlFoto);  // Aquí deberías enviar el archivo
    }

    // Enviar el FormData
    if (this.alumnoForm.get('id')?.value) {
      // Actualizar el alumno
      const alumnoId = this.alumnoForm.get('id')?.value;
      this.alumnoService.updateAlumno(alumnoId, formData).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Alumno actualizado' });
        },
        error: (err) => {
          console.error('Error al actualizar el alumno:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el alumno' });
        },
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
        },
      });
    }
  }


  onFileChange(event: any) {
    const file = event.files[0];
    if (file) {
      this.alumnoForm.patchValue({
        urlFoto: file
      });
      console.log("Archivo seleccionado: ", file.name); // Verificar si el archivo se ha asignado correctamente
    }
  }

}

