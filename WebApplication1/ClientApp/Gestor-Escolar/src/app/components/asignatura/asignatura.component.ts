import { Component, OnInit } from '@angular/core';
import {AppTableComponent} from '../app-table/app-table.component';
import {AsignaturaService} from '../../services/asignatura.service';

@Component({
  selector: 'app-asignatura',
  imports: [
    AppTableComponent
  ],
  templateUrl: './asignatura.component.html',
  standalone: true,
  styleUrl: './asignatura.component.css'
})
export class AsignaturaComponent implements OnInit {

  asignaturas: any[] = [];
  dayMapping: { [key: number]: string } = {
    1: 'Lunes',
    2: 'Martes',
    3: 'Miércoles',
    4: 'Jueves',
    5: 'Viernes',
    6: 'Sábado',
    7: 'Domingo',
  };

  columns = [
    { field: 'nombre', header: 'Nombre', width: '1%' , type: 'text' },
    { field: 'dias', header: 'Dias', width: '16%', type: 'text' },
    { field: 'profesorDni', header: 'Profesor', width: '16%',type: 'text' },
    { field: 'horasInicio', header: 'Hora Inicio', width: '16%', type: 'text' },
    { field: 'horasFin', header: 'Hora Fin', width: '16%', type: 'text' },
  ];
  constructor(private readonly as: AsignaturaService) {
  }

  ngOnInit() {
    this.cargarAsignaturas();
  }

  cargarAsignaturas() {
    this.as.getAsignaturas().subscribe({
      next: (data) => {
        this.asignaturas = data;
      },
      error: (error) => {
        console.error('Error al cargar asignaturas:', error);
      }
    });
  }

}
