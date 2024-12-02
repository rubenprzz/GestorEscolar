import { Component, OnInit } from '@angular/core';
import { AppTableComponent } from '../app-table/app-table.component';
import { JustificanteService } from '../../services/justificante.service';


@Component({
  selector: 'app-justificante',
  imports: [
    AppTableComponent
  ],
  templateUrl: './justificante.component.html',
  standalone: true,
  styleUrls: ['./justificante.component.css']
})
export class JustificanteComponent implements OnInit {
  justificantes: any[] = [];

  constructor(private justificanteService: JustificanteService) {}

  ngOnInit() {
    this.cargarJustificantes();
  }

  columns = [
    { field: 'alias', header: 'Alias', width: '22%', type: 'text' },
    { field: 'descripcion', header: 'Descripcion', width: '22%', type: 'text' },
    { field: 'fechaJustificacion', header: 'Fecha', width: '22%', type: 'text' },
    { field: 'asistenciaIdentificador', header: 'Identificador de asistencia', width: '12%', type: 'text' },
    { field: 'alumnoDni', header: 'DNI del alumno', width: '22%', type: 'text' },
  ];

  cargarJustificantes() {
    this.justificanteService.getJustificantes().subscribe({
      next: (data) => {
        this.justificantes = data.map((justificante: any) => ({
          ...justificante,
          fechaJustificacion: this.formatFecha(justificante.fechaJustificacion),
        }));
      },
      error: (error) => {
        console.error('Error al cargar justificantes:', error);
      }
    });
  }


  formatFecha(fecha: string): string {
    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
