import {Component, Input, OnInit} from '@angular/core';
import {AccordionModule} from 'primeng/accordion';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-view-profesor',
  standalone: true,
  imports: [
    AccordionModule
  ],
  templateUrl: './view-profesor.component.html',
  styleUrl: './view-profesor.component.css'
})
export class ViewProfesorComponent implements OnInit {

  @Input() profesor: any | undefined;

  constructor(private readonly config: DynamicDialogConfig) {
  }
  ngOnInit(): void {
    this.profesor = this.config.data.profesorToView;

  }


}
