import {Component, OnInit} from '@angular/core';
import {CursoService} from '../../services/curso.service';
import {AppTableComponent} from '../app-table/app-table.component';
import {CrearAlumnoComponent} from '../crear-alumno/crear-alumno.component';
import {DialogService} from 'primeng/dynamicdialog';
import {CreateCursoComponent} from '../../create-curso/create-curso.component';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-curso',
  imports: [
    AppTableComponent
  ],
  templateUrl: './curso.component.html',
  standalone: true,
  styleUrl: './curso.component.css'
})
export class CursoComponent  implements OnInit{
  cursos : any[] = [];


  columns = [
    { field: 'nombre', header: 'Nombre', width: '16%', type: 'text' },
    { field: 'fechaInicio', header: 'Fecha Inicio', width: '16%', type: 'text' },
    { field: 'fechaFin', header: 'Fecha Fin', width: '16%', type: 'text' },
    { field: 'alumnos', header: 'Alumnos', width: '16%', type: 'text' },


  ];

  constructor(private readonly curs: CursoService, private readonly dialogService: DialogService, private readonly messageService: MessageService) {}

  openNew() {
    const dialogRef = this.dialogService.open(CreateCursoComponent, {
      header: 'Crear Nuevo Curso',
      width: '70%',
    });

    // Opcional: puedes escuchar si el alumno se crea correctamente
    dialogRef.onClose.subscribe((result) => {
      if (result) {
        this.cargarCursos();
        this.messageService.add({severity: 'success', summary: 'Exito', detail: 'Alumno creado correctamente.'});
      }
    });
  }
  deleteCurso(id: number): void {
    this.curs.deleteCurso(id).subscribe({
      next: () => {
        this.cursos = this.cursos.filter((a) => a.id !== id);  // Eliminarlo de la lista local
        this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Curso eliminado' });
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el curso' });
      }
    });
  }
  ngOnInit() {
    this.cargarCursos();
  }

  editCurso(curso: any) {
    const dialogRef = this.dialogService.open(CreateCursoComponent, {
      header: 'Editar Curso',
      width: '70%',
      data: {
        cursoToEdit: curso
      }
    });

    dialogRef.onClose.subscribe((result) => {
      if (result) {
        this.cargarCursos();
        this.messageService.add({severity: 'success', summary: 'Exito', detail: 'Curso editado correctamente.'});
      }
    });
  }
  cargarCursos() {
    this.curs.getCursos().subscribe({
      next: (data) => {
        this.cursos = data.map((curso: any) => {
          curso.alumnos = curso.alumnos.map((alumno: any) => alumno.dni);
          return curso;
        });
      },
      error: (error) => {
        console.error('Error al cargar cursos:', error);
      }
    });
  }




}
