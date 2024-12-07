import {Component, OnInit} from '@angular/core';
import {ProfesorService} from '../../services/profesor.service';
import {AppTableComponent} from '../app-table/app-table.component';
import {Asignatura} from '../../models/asignatura.model';
import {Profesor} from '../../models/profesor.model';
import {DialogService} from 'primeng/dynamicdialog';
import {MessageService} from 'primeng/api';
import {CreateProfesorComponent} from '../../create-profesor/create-profesor.component';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ViewProfesorComponent} from '../../view-profesor/view-profesor.component';

@Component({
  selector: 'app-profesor',
  imports: [
    AppTableComponent,
    DialogModule,
    InputTextModule,
    FormsModule,
    Button,
    ConfirmDialogModule
  ],
  standalone: true,
  templateUrl: './profesor.component.html'
})
export class ProfesorComponent implements OnInit {

  profesores: any[] = [];
  selectedProfesor: any = {};

  constructor(private readonly profesorService: ProfesorService, private readonly dialogService: DialogService, private readonly messageService: MessageService) {
  }

  ngOnInit() {
    this.cargarProfesores();
  }

  columns = [
    {field: 'nombre', header: 'Nombre', width: '16%', type: 'text'},
    {field: 'apellidos', header: 'Apellido', width: '16%', type: 'text'},
    {field: 'dni', header: 'DNI', width: '16%', type: 'text'},
    {field: 'email', header: 'Email', width: '16%', type: 'text'},
    {field: 'telefono', header: 'Teléfono', width: '16%', type: 'text'},
    {field: 'asignaturasNombre', header: 'Asignaturas', width: '16%', type: 'text'},
  ];

  viewProfesor(profesor: any) {
    const dialogRef = this.dialogService.open(ViewProfesorComponent, {
      header: 'Ver Profesor',
      width: '70%',
      data: {profesorToView: profesor},
    });
  }



  cargarProfesores() {
    this.profesorService.getProfesores().subscribe({
      next: (data) => {
        this.profesores = data.map((profesor: Profesor) => ({
          ...profesor,
          asignaturasNombre: profesor.asignaturas?.map((asignatura: Asignatura) => asignatura.nombre).join(', ') ?? 'Sin asignaturas',
        }));
      },
      error: (error) => {
        console.error('Error al cargar profesores:', error);
      },
    });
  }

  cargarProfesor(id: number): void {
    this.profesorService.getPronfesorById(id).subscribe({
      next: (data) => {
        this.selectedProfesor = data;
      },
      error: (error) => {
        console.error('Error al cargar el alumno:', error);
      }
    });
  }

  deleteProfesor(id: number): void {
    this.profesorService.deleteProfesor(id).subscribe({
      next: () => {
        this.profesores = this.profesores.filter((a) => a.id !== id);  // Eliminarlo de la lista local
        this.messageService.add({severity: 'success', summary: 'Exito', detail: 'Profesor eliminado'});
      },
      error: (error) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al eliminar el profesor'});
      }
    });
  }

  editProfesor(profesor: any) {
    const dialogRef = this.dialogService.open(CreateProfesorComponent, {
      header: 'Editar Profesor',
      width: '70%',
      data: {
        profesorToEdit: profesor,
      },
    });
    dialogRef.onClose.subscribe((result) => {
      if (result) {
        this.cargarProfesor(profesor.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Alumno actualizado correctamente.',
        });
      }
    });
  }

  openNew() {
    const dialogRef = this.dialogService.open(CreateProfesorComponent, {
      header: 'Crear Nuevo Profesor',
      width: '70%',
    });

    dialogRef.onClose.subscribe((result) => {
      if (result) {
        this.cargarProfesores();
        this.messageService.add({severity: 'success', summary: 'Exito', detail: 'Alumno creado correctamente.'});
      }
    });
  }
}




