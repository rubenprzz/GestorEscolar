import { Component, Input, OnInit } from '@angular/core';
import { Alumno } from '../../models/alumno.model';
import {AlumnoService} from '../../services/alumno.service';
import {ActivatedRoute} from '@angular/router';
import {Button} from 'primeng/button';
import {CardModule} from 'primeng/card';

@Component({
  selector: 'app-alumno-details',
  templateUrl: './view-alumno.component.html',
  standalone: true,
  styleUrls: ['view-alumno.component.css'],
  imports: [
    Button,
    CardModule
  ]
})
export class ViewAlumnoComponent implements OnInit {
  alumno: Alumno | undefined;

  constructor(
    private readonly alumnoService: AlumnoService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.cargarAlumno(id);
  }

  cargarAlumno(id: number): void {
    this.alumnoService.getAlumnoById(id).subscribe({
      next: (data) => {
        this.alumno = data;
      },
      error: (error) => {
        console.error('Error al cargar el alumno:', error);
      }
    });
  }
}
