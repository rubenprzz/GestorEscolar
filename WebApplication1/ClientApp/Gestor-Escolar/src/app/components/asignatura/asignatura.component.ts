import { Component, OnInit } from '@angular/core';
import {AppTableComponent} from '../app-table/app-table.component';
import {AsignaturaService} from '../../services/asignatura.service';
import {CrearAlumnoComponent} from '../crear-alumno/crear-alumno.component';
import { DialogService } from 'primeng/dynamicdialog';
import {MessageService} from 'primeng/api';
import {CreateAsignaturaComponent} from '../../create-asignatura/create-asignatura.component';

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
  constructor(private readonly as: AsignaturaService, private readonly dialogService: DialogService, private readonly asigService: AsignaturaService, private readonly messageService: MessageService) { }

  openNew() {
    // Abre el dialog que contiene el formulario de crear alumno
    const dialogRef = this.dialogService.open(CreateAsignaturaComponent, {
      header: 'Crear Nueva Asignatura',  // Título del diálogo
      width: '70%',
    });

    // Opcional: puedes escuchar si el alumno se crea correctamente
    dialogRef.onClose.subscribe((result) => {
      if (result) {
        this.cargarAsignaturas();  // Recargar los alumnos si se crea uno nuevo
        this.messageService.add({severity: 'success', summary: 'Exito', detail: 'Alumno creado correctamente.'});
      }
    });
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
