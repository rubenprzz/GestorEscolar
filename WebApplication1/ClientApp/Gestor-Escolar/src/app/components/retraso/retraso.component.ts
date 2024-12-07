import {Component, OnInit} from '@angular/core';
import {AppTableComponent} from '../app-table/app-table.component';
import {RetrasoService} from '../../services/retraso.service';
import {AlumnoService} from '../../services/alumno.service';
import {CrearAlumnoComponent} from '../crear-alumno/crear-alumno.component';
import {CreateRetrasoComponent} from '../../create-retraso/create-retraso.component';
import {DialogService} from 'primeng/dynamicdialog';
import {MessageService} from 'primeng/api';
import {ViewRetrasoComponent} from '../../view-retraso/view-retraso.component';

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
    {field: 'fecha', header: 'Fecha', width: '16%', type: 'date'},
    {field: 'minutosRetraso', header: 'Minutos de retraso', width: '16%', type: 'number'},
    {field: 'alumnoDni', header: 'DNI del alumno', width: '16%', type: 'number'},
    {field: 'justificado', header: 'Justificado', width: '16%', type: 'boolean'},
    {field: 'motivo', header: 'Motivo', width: '16%', type: 'text'},
    {field: 'asignaturaNombre', header: 'Nombre de la asignatura', width: '16%', type: 'text'},
    {field: 'horaInicio', header: 'Hora de inicio', width: '16%', type: 'text'},
    {field: 'horaLlegada', header: 'Hora de llegada', width: '16%', type: 'text' }
  ];


  constructor(private readonly retrasoService: RetrasoService, private readonly alumnoService: AlumnoService, private readonly dialogService: DialogService, private readonly messageService: MessageService) {
  }



  ngOnInit() {
    this.cargarRetrasos();
  }
  deleteRetraso(id: number): void {
    this.retrasoService.deleteRetraso(id).subscribe({
      next: () => {
        this.retrasos = this.retrasos.filter((a) => a.id !== id);  // Eliminarlo de la lista local
        this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Retraso eliminado' });
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el retraso' });
      }
    });
  }

  viewRetraso(retraso: any) {
    const dialogRef = this.dialogService.open(ViewRetrasoComponent, {
      header: 'Ver retraso',
      width: '70%',
      data: {retrasoToView: retraso},
    });
  }

  cargarRetrasos() {
    this.retrasoService.getRetrasos().subscribe({
      next: (data) => {

        this.retrasos = data.map((retraso: { justificado: any; }) => {
          return {
            ...retraso,
            justificado: retraso.justificado ? 'Justificado' : 'Sin Justificar'  // Conversión
          };
        });
      },
      error: (error) => {
        console.error('Error al cargar retrasos:', error);
      }
    });
  }

  openNew() {
    const dialogRef = this.dialogService.open(CreateRetrasoComponent, {
      header: 'Crear Nuevo Retraso',  // Título del diálogo
      width: '70%',
    });

    // Opcional: puedes escuchar si el alumno se crea correctamente
    dialogRef.onClose.subscribe((result) => {
      if (result) {
        this.cargarRetrasos();  // Recargar los alumnos si se crea uno nuevo
        this.messageService.add({severity: 'success', summary: 'Exito', detail: 'Retraso creado correctamente.'});
      }
    });
  }
  editRetraso(retraso: any) {
    const dialogRef = this.dialogService.open(CreateRetrasoComponent, {
      header: 'Editar Retraso',
      width: '70%',
      data: {retrasoToEdit: retraso}
    });

    dialogRef.onClose.subscribe((result) => {
      if (result) {
        this.cargarRetrasos();
        this.messageService.add({severity: 'success', summary: 'Exito', detail: 'Retraso actualizado correctamente.'});
      }
    });
  }


}
