import {Component, OnInit} from '@angular/core';
import {AsistenciaService} from '../../services/asistencia.service';
import {AppTableComponent} from '../app-table/app-table.component';
import {Asistencia} from '../../models/asistencia.model';
import {CrearAlumnoComponent} from '../crear-alumno/crear-alumno.component';
import {MessageService} from 'primeng/api';
import {DialogService} from 'primeng/dynamicdialog';
import {CreateAsistenciaComponent} from '../../create-asistencia/create-asistencia.component';

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
  asistenciaToEdit: any;
  dayMapping: { [key: number]: string } = {
    1: 'Lunes',
    2: 'Martes',
    3: 'Miércoles',
    4: 'Jueves',
    5: 'Viernes',
    6: 'Sábado',
    7: 'Domingo',
  };

  constructor(private readonly as: AsistenciaService,private readonly messageService:MessageService, private readonly dialogService:DialogService) {}

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

  deleteAsistencia(id: number): void {
    this.as.deleteAsistencia(id).subscribe({
      next: () => {
        this.asistencias = this.asistencias.filter((a) => a.id !== id);  // Eliminarlo de la lista local
        this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Asistencia eliminada' });
      },
      error: (err) => {
        console.error('Error al eliminar asistencia', err);
      },
    });
  }
  editAsistencia(asistencia: any) {
    const dialogRef = this.dialogService.open(CreateAsistenciaComponent, {
      header: 'Editar Asistencia',  // Título del diálogo
      width: '70%',
      data: {asistenciaToEdit: asistencia},  // Pasar el alumno a editar
    });

    // Opcional: puedes escuchar si el alumno se edita correctamente
    dialogRef.onClose.subscribe((result) => {
      if (result) {
        this.cargarAsistencias();  // Recargar los alumnos si se edita uno
        this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Asistencia editada correctamente.' });
      }
    });
  }

  openNew() {
    // Abre el dialog que contiene el formulario de crear alumno
    const dialogRef = this.dialogService.open(CreateAsistenciaComponent, {
      header: 'Crear Nueva Asistencia',  // Título del diálogo
      width: '70%',
    });

    // Opcional: puedes escuchar si el alumno se crea correctamente
    dialogRef.onClose.subscribe((result) => {
      if (result) {
        this.cargarAsistencias();  // Recargar los alumnos si se crea uno nuevo
        this.messageService.add({severity: 'success', summary: 'Exito', detail: 'Asistencia creada correctamente.'});
      }
    });
  }


}
