import {Component, OnInit} from '@angular/core';
import {AlumnoService} from '../../services/alumno.service';
import {AppTableComponent} from '../app-table/app-table.component';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import { CrearAlumnoComponent } from '../crear-alumno/crear-alumno.component';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ViewAlumnoComponent} from '../view-alumno/view-alumno.component';


@Component({
  selector: 'app-alumnos',
  imports: [
    AppTableComponent,
    DialogModule,
    InputTextModule,
    FormsModule,
    Button,
    ConfirmDialogModule
  ],
  standalone: true,
  templateUrl: './alumno.component.html',
})
export class AlumnoComponent implements OnInit {
  alumnos: any[] = [];
  displayDialog: boolean = false;
  displayConfirmDialog: boolean = false;
  selectedAlumno: any = {};
  columns = [
    { field: 'nombre', header: 'Nombre', width: '16%', type: 'text' },
    { field: 'apellidos', header: 'Apellidos', width: '16%', type: 'text' },
    { field: 'dni', header: 'DNI', width: '16%', type: 'text' },
    { field: 'curso', header: 'Curso', width: '16%', type: 'text' },
    { field: 'urlFoto' , header: 'Foto', width: '16%', type: 'image' },
  ];
  getImageUrl(urlFoto: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(urlFoto);
  }


  constructor(private readonly alumnoService: AlumnoService , private readonly messageService: MessageService,    private readonly dialogService: DialogService, private readonly sanitizer: DomSanitizer,
  private readonly confirmationService:ConfirmationService) {}

  ngOnInit() {
    this.cargarAlumnos();
  }
  alumnoToDelete: any = null; // Variable para almacenar el alumno a eliminar

  confirmDelete(item: any): void {
    this.alumnoToDelete = item;  // Guardamos el alumno a eliminar
    this.displayConfirmDialog = true; // Mostramos el cuadro de confirmación
  }

  // Eliminar el alumno si se confirma
  /*confirm1(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon:"none",
      rejectIcon:"none",
      rejectButtonStyleClass:"p-button-text",
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }

  confirm2(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass:"p-button-danger p-button-text",
      rejectButtonStyleClass:"p-button-text p-button-text",
      acceptIcon:"none",
      rejectIcon:"none",

      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      }
    });
  }*/

  cargarAlumnos() {
    this.alumnoService.getAlumnos().subscribe({
      next: (data) => {
        this.alumnos = data;
      },
      error: (error) => {
        console.error('Error al cargar alumnos:', error);
      }
    });
  }
  cargarAlumno(id: string): void {
    this.alumnoService.getAlumnoById(id).subscribe({
      next: (data) => {
        this.selectedAlumno = data;
      },
      error: (error) => {
        console.error('Error al cargar el alumno:', error);
      }
    });
  }
  viewAlumno(alumno: any): void {
    const ref: DynamicDialogRef = this.dialogService.open(ViewAlumnoComponent, {
      header: 'Ver Alumno',
      width: '70%',
      data: { alumnoToView: alumno }, // Pass the entire alumno object
    });

    ref.onClose.subscribe((result) => {
      if (result) {
        this.cargarAlumno(alumno.id);
      }
    });
  }

  editAlumno(alumno: any): void {
    const ref: DynamicDialogRef = this.dialogService.open(CrearAlumnoComponent, {
      header: 'Editar Alumno',
      width: '70%',
      data: { alumnoToEdit: alumno }, // Pasar solo el ID
    });

    ref.onClose.subscribe((result) => {
      if (result) {
        this.cargarAlumno(alumno.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Alumno actualizado correctamente.',
        });
      }
    });
  }

  saveAlumno() {
    if (this.selectedAlumno.id) {
      const index = this.alumnos.findIndex((a) => a.id === this.selectedAlumno.id);
      if (index !== -1) {
        this.alumnos[index] = { ...this.selectedAlumno };
      }
    } else {
      this.selectedAlumno.id = this.alumnos.length ? Math.max(...this.alumnos.map((a) => a.id)) + 1 : 1;
      this.alumnos.push({ ...this.selectedAlumno });
    }
    this.displayDialog = false;
  }

  deleteAlumno(id: string): void {
    this.alumnoService.deleteAlumno(id).subscribe({
      next: () => {
        this.alumnos = this.alumnos.filter((a) => a.id !== id);  // Eliminarlo de la lista local
        this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Alumno eliminado' });
      },
      error: (err) => {
        console.error('Error al eliminar alumno', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el alumno' });
      }
    });
  }
  openNew() {
    // Abre el dialog que contiene el formulario de crear alumno
    const dialogRef = this.dialogService.open(CrearAlumnoComponent, {
      header: 'Crear Nuevo Alumno',  // Título del diálogo
      width: '70%',
    });

    // Opcional: puedes escuchar si el alumno se crea correctamente
    dialogRef.onClose.subscribe((result) => {
      if (result) {
        this.cargarAlumnos();  // Recargar los alumnos si se crea uno nuevo
        this.messageService.add({severity: 'success', summary: 'Exito', detail: 'Alumno creado correctamente.'});
      }
    });
  }



}


