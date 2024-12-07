import { Component, Input, OnInit } from '@angular/core';
import { AlumnoService } from '../../services/alumno.service';

import { Alumno } from '../../models/alumno.model';
import { MessageService } from 'primeng/api';
import {AccordionModule} from 'primeng/accordion';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';
import {Padre} from '../../models/padre.model';

@Component({
  selector: 'app-alumno-details',
  templateUrl: './view-alumno.component.html',
  styleUrls: ['./view-alumno.component.css'],
  imports: [
    AccordionModule,
    DatePipe,
    NgIf,
    NgForOf
  ],
  standalone: true
})
export class ViewAlumnoComponent implements OnInit {
  @Input() alumnoToView: any | undefined;
  alumno: any | undefined;
  justificantes: any[] = [];
  padres: any[] = [];

  constructor(
    private readonly alumnoService: AlumnoService,
    private readonly messageService: MessageService,
    public config: DynamicDialogConfig
  ) {
  }

  loadJustificantes(): void {
    console.log('Cargando justificantes');
    console.log(this.alumno.justificantes + "justi");
  }


  ngOnInit(): void {
    if (this.config.data.alumnoToView) {
      this.alumno = this.config.data.alumnoToView;
      console.log(this.alumno);
      this.loadJustificantes()
    }


    // Cargar todos los retrasos de un alumno
    /* loadRetrasos(): void {
       if (this.alumno?.id) {
         this.retrasoService.getRetrasosByAlumno(this.alumno.id).subscribe({
           next: (data: any[]) => {
             this.retrasos = data;
           },
           error: (error: any) => {
             console.error('Error al cargar los retrasos:', error);
             this.messageService.add({
               severity: 'error',
               summary: 'Error',
               detail: 'No se pudieron cargar los retrasos',
             });
           },
         });
       }
     }

     // Cargar todos los padres de un alumno (si tienes un array de DNIs)
     loadPadres(): void {
       if (this.alumno?.id) {
         this.padreService.getPadresByAlumno(this.alumno.id).subscribe({
           next: (data: any[]) => {
             this.padres = data; // Aquí asignamos los datos de los padres
           },
           error: (error: any) => {
             console.error('Error al cargar los padres:', error);
             this.messageService.add({
               severity: 'error',
               summary: 'Error',
               detail: 'No se pudieron cargar los padres',
             });
           },
         });
       }
     }*/
  }
}
