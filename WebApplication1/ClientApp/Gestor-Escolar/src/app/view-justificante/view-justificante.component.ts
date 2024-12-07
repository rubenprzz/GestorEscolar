import { Component, Input, OnInit } from '@angular/core';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';
import {AccordionModule} from 'primeng/accordion';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-view-justificante',
  standalone: true,
  imports: [
    AccordionModule,
    DatePipe
  ],
  templateUrl: './view-justificante.component.html',
  styleUrl: './view-justificante.component.css'
})
export class ViewJustificanteComponent implements OnInit {

  @Input() justificante: any | undefined;

  constructor(private readonly config: DynamicDialogConfig) {
  }


  ngOnInit(): void {
    if (this.config.data.justificanteToView) {
      this.justificante = this.config.data.justificanteToView;
    }
  }
}
