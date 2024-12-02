import {Component, OnInit} from '@angular/core';
import {ProfesorService} from '../../services/profesor.service';
import {AppTableComponent} from '../app-table/app-table.component';
import {Asignatura} from '../../models/asignatura.model';
import {Profesor} from '../../models/profesor.model';

@Component({
  selector: 'app-profesor',
  imports: [
    AppTableComponent
  ],
  templateUrl: './profesor.component.html',
  standalone: true,
  styleUrl: './profesor.component.css'
})
export class ProfesorComponent implements OnInit{
  profesores: any[] = [];

  constructor(private readonly  profesorService:  ProfesorService) {}

  ngOnInit() {
    this.cargarProfesores();
  }
  columns = [
    { field: 'nombre', header: 'Nombre', width: '16%', type: 'text' },
    { field: 'apellidos', header: 'Apellido', width: '16%', type: 'text' },
    { field: 'dni', header: 'DNI', width: '16%', type: 'text' },
    { field: 'email', header: 'Email', width: '16%', type: 'text' },
    { field: 'telefono', header: 'Teléfono', width: '16%', type: 'text' },
    { field: 'asignaturasNombre', header: 'Asignaturas', width: '16%', type: 'text' },
  ];
  cargarProfesores() {
    this.profesorService.getProfesores().subscribe({
      next: (data) => {
        this.profesores = data.map((profesor: Profesor) => ({
          ...profesor,
          asignaturasNombre: profesor.asignaturas?.map((asignatura: Asignatura) => asignatura.nombre).join(', ') || 'Sin asignaturas',
        }));
      },
      error: (error) => {
        console.error('Error al cargar profesores:', error);
      },
    });
  }


}
