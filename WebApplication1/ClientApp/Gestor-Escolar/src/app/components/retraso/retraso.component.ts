import { Component, OnInit } from '@angular/core';
import {AppTableComponent} from '../app-table/app-table.component';
import {RetrasoService} from '../../services/retraso.service';
import {AlumnoService} from '../../services/alumno.service';

@Component({
  selector: 'app-retraso',
  imports: [
    AppTableComponent
  ],
  templateUrl: './retraso.component.html',
  standalone: true,
  styleUrl: './retraso.component.css'
})
export class RetrasoComponent implements OnInit {

  retrasos: any[] = [];

  columns = [
    { field: 'fecha', header: 'Fecha', width: '16%', type: 'date' },
    { field: 'minutosRetraso', header: 'Minutos de retraso', width: '16%', type: 'number' },
    { field: 'alumnoDni', header: 'DNI del alumno', width: '16%', type: 'number' },
    { field: 'justificado', header: 'Justificado', width: '16%', type: 'boolean' },
    { field: 'motivo', header: 'Motivo', width: '16%', type: 'text' },
    { field: 'asignaturaNombre', header: 'Nombre de la asignatura', width: '16%', type: 'text' }
  ];


  constructor(private readonly retrasoService: RetrasoService, private readonly alumnoService: AlumnoService) { }

  ngOnInit() {
    this.cargarRetrasos();
  }

  cargarRetrasos() {
    this.retrasoService.getRetrasos().subscribe({
      next: (data) => {
        this.retrasos = data;
      },
      error: (error) => {
        console.error('Error al cargar retrasos:', error);
      }
    });
  }





}
