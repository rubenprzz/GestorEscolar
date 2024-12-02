import {Component, OnInit} from '@angular/core';
import {CursoService} from '../../services/curso.service';
import {AppTableComponent} from '../app-table/app-table.component';

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

  constructor(private readonly curs: CursoService) {}

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
