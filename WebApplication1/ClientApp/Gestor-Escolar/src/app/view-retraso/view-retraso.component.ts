import {Component, Input, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {DatePipe} from '@angular/common';
import {AccordionModule} from 'primeng/accordion';

@Component({
  selector: 'app-view-retraso',
  standalone: true,
  imports: [
    DatePipe,
    AccordionModule
  ],
  templateUrl: './view-retraso.component.html',
  styleUrl: './view-retraso.component.css'
})
export class ViewRetrasoComponent implements OnInit{

  @Input() retraso: any | undefined;

  constructor(private readonly config: DynamicDialogConfig) {

  }
  ngOnInit(): void {
    this.retraso = this.config.data.retrasoToView;
  }

}
