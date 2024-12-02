import {Component, OnInit} from '@angular/core';
import {AsistenciaService} from '../../services/asistencia.service';
import {AppTableComponent} from '../app-table/app-table.component';
import {Asistencia} from '../../models/asistencia.model';

@Component({
  selector: 'app-asistencia',
  imports: [
    AppTableComponent
  ],
  templateUrl: './asistencia.component.html',
  standalone: true,
  styleUrl: './asistencia.component.css'
})
export class AsistenciaComponent implements OnInit {
  asistencias: any[] = [];

  dayMapping: { [key: number]: string } = {
    1: 'Lunes',
    2: 'Martes',
    3: 'Miércoles',
    4: 'Jueves',
    5: 'Viernes',
    6: 'Sábado',
    7: 'Domingo',
  };

  constructor(private readonly as: AsistenciaService) {}

  columns = [
    { field: 'dia', header: 'Día', width: '16%', type: 'text' },
    { field: 'isPresente', header: 'Asistencia', width: '16%', type: 'text' },
    { field: 'alumnoDni', header: 'Alumno', width: '16%', type: 'text' },
    { field: 'identificador', header: 'Identificador', width: '16%', type: 'text' },
    { field: 'horaInicio', header: 'Hora Inicio', width: '16%', type: 'text' },
    { field: 'horaFin', header: 'Hora Fin', width: '16%', type: 'text' },
    { field: 'asignaturaNombre', header: 'Asignatura', width: '16%', type: 'text' },
  ];

  ngOnInit() {
    this.cargarAsistencias();
  }

  cargarAsistencias() {
    this.as.getAsistencias().subscribe({
      next: (data) => {
        this.asistencias = data.map((asistencia: Asistencia) => ({
          ...asistencia,
          dia: this.dayMapping[asistencia.dia as number] || 'Día desconocido',
          isPresente: asistencia.isPresente ? 'Presente' : 'Ausente',
        }));
      },
      error: (error) => {
        console.error('Error al cargar asistencias:', error);
      },
    });
  }
}
