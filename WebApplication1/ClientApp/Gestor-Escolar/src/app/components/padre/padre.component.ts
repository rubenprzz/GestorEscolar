import {Component, OnInit} from '@angular/core';
import {PadreService} from '../../services/padre.service';
import {Padre} from '../../models/padre.model';
import {AppTableComponent} from '../app-table/app-table.component';
import {CrearAlumnoComponent} from '../crear-alumno/crear-alumno.component';
import {DialogService} from 'primeng/dynamicdialog';
import {MessageService} from 'primeng/api';
import {CreatePadreComponent} from '../../create-padre/create-padre.component';
import {CreateProfesorComponent} from '../../create-profesor/create-profesor.component';
import {ViewPadreComponent} from '../../view-padre/view-padre.component';

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

  constructor(private readonly padreService:PadreService, private readonly dialogService: DialogService, private readonly messageService: MessageService) {}


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

  viewPadre(padre: any) {
    const dialogRef = this.dialogService.open(ViewPadreComponent, {
      header: 'Ver Padre',  // Título del diálogo
      width: '70%',
      data: {padreToView: padre},  // Pasar el alumno
    });
  }

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
  cargarPadre(id:number){
    this.padreService.getPadreById(id).subscribe({
      next: (data) => {
        this.padres = data.map((padre: Padre) => ({
          ...padre,

        }));
      },
      error: (error) => {
        console.error('Error al cargar padres:', error);
      },
    });
  }

  openNew() {
    // Abre el dialog que contiene el formulario de crear alumno
    const dialogRef = this.dialogService.open(CreatePadreComponent, {
      header: 'Crear Nuevo Padre',  // Título del diálogo
      width: '70%',
    });

    // Opcional: puedes escuchar si el alumno se crea correctamente
    dialogRef.onClose.subscribe((result) => {
      if (result) {
        this.cargarPadres();  // Recargar los alumnos si se crea uno nuevo
        this.messageService.add({severity: 'success', summary: 'Exito', detail: 'Padre creado correctamente.'});
      }
    });
    this.cargarPadres();
  }
  editPadre(padre: any) {
    const dialogRef = this.dialogService.open(CreatePadreComponent, {
      header: 'Editar Padre',
      width: '70%',
      data: {
        padreToEdit: padre,
      },
    });
    dialogRef.onClose.subscribe((result) => {
      if (result) {
        this.cargarPadre(padre.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Padre actualizado correctamente.',
        });
        this.cargarPadres();
      }
    });
  }

  deletePadre(id: number): void {
    this.padreService.deletePadre(id).subscribe({
      next: () => {
        this.padres = this.padres.filter((a) => a.id !== id);  // Eliminarlo de la lista local
        this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Padre eliminado' });
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el padre' });
      }
    });
  }



}
