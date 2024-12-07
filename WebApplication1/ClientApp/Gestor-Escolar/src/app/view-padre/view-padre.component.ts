import { Component, Input } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import {AccordionModule} from 'primeng/accordion';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-view-padre',
  standalone: true,
  imports: [
    AccordionModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './view-padre.component.html',
  styleUrl: './view-padre.component.css'
})
export class ViewPadreComponent {

  @Input() padre: any | undefined;

  constructor(private readonly config: DynamicDialogConfig) {
  }
  ngOnInit(): void {
    this.padre = this.config.data.padreToView;

  }

}
