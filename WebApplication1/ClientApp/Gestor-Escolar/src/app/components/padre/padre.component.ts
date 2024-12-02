import {Component, OnInit} from '@angular/core';
import {PadreService} from '../../services/padre.service';
import {Padre} from '../../models/padre.model';
import {AppTableComponent} from '../app-table/app-table.component';

@Component({
  selector: 'app-padre',
  imports: [
    AppTableComponent
  ],
  templateUrl: './padre.component.html',
  standalone: true,
  styleUrl: './padre.component.css'
})
export class PadreComponent implements OnInit{
  padres: any[] = [];

  constructor(private readonly padreService:PadreService) {}


  ngOnInit() {
    this.cargarPadres();
  }
  columns = [
    { field: 'nombre', header: 'Nombre', width: '16%', type: 'text' },
    { field: 'apellidos', header: 'Apellido', width: '16%', type: 'text' },
    { field: 'dni', header: 'DNI', width: '16%', type: 'text' },
    { field: 'telefono', header: 'Teléfono', width: '16%', type: 'text' },
    /*{ field: 'alumnosDni', header: 'Alumnos', width: '16%', type: 'text' },*/
  ];

  cargarPadres() {
    this.padreService.getPadres().subscribe({
      next: (data) => {
        this.padres = data.map((padre: Padre) => ({
          ...padre,
          /*alumnosDni: padre.alumnos?.join(', ') || 'Sin alumnos',*/
        }));
      },
      error: (error) => {
        console.error('Error al cargar padres:', error);
      },
    });
  }

}
