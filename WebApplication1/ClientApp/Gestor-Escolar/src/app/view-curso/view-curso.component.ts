import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AccordionModule } from 'primeng/accordion';
import { DatePipe, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-view-curso',
  standalone: true,
  imports: [AccordionModule, DatePipe, NgIf, NgForOf],
  templateUrl: './view-curso.component.html',
  styleUrls: ['./view-curso.component.css'],
})
export class ViewCursoComponent implements OnInit {
  curso: any;

  constructor(private readonly config: DynamicDialogConfig) {}

  ngOnInit(): void {
    this.curso = this.config.data.cursoToView;
  }
}
