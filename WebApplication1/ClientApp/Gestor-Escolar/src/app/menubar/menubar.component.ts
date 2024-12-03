import { Component, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { BadgeModule } from 'primeng/badge';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-menu',
  templateUrl: './menubar.component.html',
  standalone: true,
  styleUrls: ['./menubar.component.css'],
  imports: [MenubarModule, AvatarModule, InputTextModule, RippleModule, BadgeModule, NgClass, NgIf]
})
export class MenuComponent implements OnInit {
  items: any[] = [];

  ngOnInit() {
    this.items = [
      { label: 'Alumnos', icon: 'pi pi-users', routerLink: '/alumnos' },
      { label: 'Justificantes', icon: 'pi pi-file', routerLink: '/justificante' },
      { label: 'Retrasos', icon: 'pi pi-clock', routerLink: '/retraso' },
      { label: 'Profesores', icon: 'pi pi-user', routerLink: '/profesor' },
      { label: 'Asistencias', icon: 'pi pi-check-square', routerLink: '/asistencia' },
      { label: 'Cursos', icon: 'pi pi-briefcase', routerLink: '/curso' },
      { label: 'Padres', icon: 'pi pi-users', routerLink: '/padre' },
      { label: 'Asignaturas', icon: 'pi pi-list', routerLink: '/asignatura' },
      { label: 'Login', icon: 'pi pi-sign-in', routerLink: '/login' }
    ];
  }
}
