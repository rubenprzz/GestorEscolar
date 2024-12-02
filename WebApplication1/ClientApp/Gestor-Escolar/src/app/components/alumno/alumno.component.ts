import {Component, OnInit} from '@angular/core';
import {AlumnoService} from '../../services/alumno.service';
import {AppTableComponent} from '../app-table/app-table.component';
import {MessageService} from 'primeng/api';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {CrearAlumnoComponent} from '../../crear-alumno/crear-alumno.component';
import {DialogService} from 'primeng/dynamicdialog';


@Component({
  selector: 'app-alumnos',
  imports: [
    AppTableComponent,
    DialogModule,
    InputTextModule,
    FormsModule,
    Button
  ],
  standalone: true,
  templateUrl: './alumno.component.html'
})
export class AlumnoComponent implements OnInit {
  alumnos: any[] = [];
  displayDialog: boolean = false;
  selectedAlumno: any = {};
  columns = [
    { field: 'nombre', header: 'Nombre', width: '16%', type: 'text' },
    { field: 'apellidos', header: 'Apellidos', width: '16%', type: 'text' },
    { field: 'dni', header: 'DNI', width: '16%', type: 'text' },
    { field: 'curso', header: 'Curso', width: '16%', type: 'text' },
  ];

  constructor(private readonly alumnoService: AlumnoService , private readonly messageService: MessageService,    private readonly dialogService: DialogService
  ) {}

  ngOnInit() {
    this.cargarAlumnos();
  }

  cargarAlumnos() {
    this.alumnoService.getAlumnos().subscribe({
      next: (data) => {
        this.alumnos = data;
      },
      error: (error) => {
        console.error('Error al cargar alumnos:', error);
      }
    });
  }

  editAlumno(alumno: any): void {
    this.selectedAlumno = { ...alumno };  // Copiar los datos del alumno
    this.displayDialog = true;  // Mostrar el diálogo
  }

  saveAlumno() {
    if (this.selectedAlumno.id) {
      const index = this.alumnos.findIndex((a) => a.id === this.selectedAlumno.id);
      if (index !== -1) {
        this.alumnos[index] = { ...this.selectedAlumno };
      }
    } else {
      this.selectedAlumno.id = this.alumnos.length ? Math.max(...this.alumnos.map((a) => a.id)) + 1 : 1;
      this.alumnos.push({ ...this.selectedAlumno });
    }
    this.displayDialog = false;
  }

  deleteAlumno(id: string): void {
    this.alumnoService.deleteAlumno(id).subscribe({
      next: () => {
        this.alumnos = this.alumnos.filter((a) => a.id !== id);  // Eliminarlo de la lista local
        this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Alumno eliminado' });
      },
      error: (err) => {
        console.error('Error al eliminar alumno', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el alumno' });
      }
    });
  }
  openNew() {
    // Abre el dialog que contiene el formulario de crear alumno
    const dialogRef = this.dialogService.open(CrearAlumnoComponent, {
      header: 'Crear Nuevo Alumno',  // Título del diálogo
      width: '70%',
    });

    // Opcional: puedes escuchar si el alumno se crea correctamente
    dialogRef.onClose.subscribe((result) => {
      if (result) {
        this.cargarAlumnos();  // Recargar los alumnos si se crea uno nuevo
        this.messageService.add({severity: 'success', summary: 'Exito', detail: 'Alumno creado correctamente.'});
      }
    });
  }



}


