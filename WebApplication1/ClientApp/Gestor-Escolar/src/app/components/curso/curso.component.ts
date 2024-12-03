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

  ngOnInit() {
    this.cargarCursos();
  }
  cargarCursos() {
    this.curs.getCursos().subscribe({
      next: (data) => {
        this.cursos = data;
      },
      error: (error) => {
        console.error('Error al cargar cursos:', error);
      }
    });
  }



}
