import { Component } from '@angular/core';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';
import {AccordionModule} from 'primeng/accordion';

@Component({
  selector: 'app-view-asistencia',
  standalone: true,
  imports: [
    AccordionModule
  ],
  templateUrl: './view-asistencia.component.html',
  styleUrl: './view-asistencia.component.css'
})
export class ViewAsistenciaComponent {

  asistencia: any;

  constructor(private readonly config: DynamicDialogConfig) {
  }

  ngOnInit(): void {
    this.asistencia = this.config.data.asistenciaToView;
  }

}
