import { Component, OnInit } from '@angular/core';
import { AppTableComponent } from '../app-table/app-table.component';
import { JustificanteService } from '../../services/justificante.service';
import {AddJustificanteComponent} from '../add-justificante/add-justificante.component';
import {DialogService} from 'primeng/dynamicdialog';
import {MessageService} from 'primeng/api';


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

  constructor(private justificanteService: JustificanteService, private readonly dialogService: DialogService, private readonly messageService: MessageService) {}

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
  openNew() {
    const dialogRef = this.dialogService.open(AddJustificanteComponent, {
      header: 'Crear nuevo justificante',  // Título del diálogo
      width: '70%',
    });

    // Opcional: puedes escuchar si el alumno se crea correctamente
    dialogRef.onClose.subscribe((result) => {
      if (result) {
        this.cargarJustificantes();  // Recargar los alumnos si se crea uno nuevo
        this.messageService.add({severity: 'success', summary: 'Exito', detail: 'Alumno creado correctamente.'});
      }
    });
  }
  deleteJustificante(id: number): void {
    this.justificanteService.deleteJustificante(id).subscribe({
      next: () => {
        this.justificantes = this.justificantes.filter((a) => a.id !== id);  // Eliminarlo de la lista local
        this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Justificante eliminado' });
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el justificante' });
      }
    });
  }

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
  editJustificante(justificante: any) {
    const dialogRef = this.dialogService.open(AddJustificanteComponent, {
      header: 'Editar justificante',  // Título del diálogo
      width: '70%',
      data: {justificanteToEdit: justificante},
    });

    // Opcional: puedes escuchar si el alumno se crea correctamente
    dialogRef.onClose.subscribe((result) => {
      if (result) {
        this.cargarJustificantes();  // Recargar los alumnos si se crea uno nuevo
        this.messageService.add({severity: 'success', summary: 'Exito', detail: 'Justificante editado correctamente.'});
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
