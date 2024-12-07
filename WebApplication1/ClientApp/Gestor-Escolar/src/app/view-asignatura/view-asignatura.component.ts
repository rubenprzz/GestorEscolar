import {Component, Input} from '@angular/core';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-view-asignatura',
  standalone: true,
  imports: [],
  templateUrl: './view-asignatura.component.html',
  styleUrl: './view-asignatura.component.css'
})
export class ViewAsignaturaComponent {

  @Input() asignatura: any | undefined;

  constructor(private readonly config: DynamicDialogConfig) {
  }
  ngOnInit(): void {
    this.asignatura = this.config.data.asignaturaToView;
  }


}
