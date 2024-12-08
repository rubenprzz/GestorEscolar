import { Component, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { BadgeModule } from 'primeng/badge';
import { NgClass, NgIf } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menubar.component.html',
  standalone: true,
  styleUrls: ['./menubar.component.css'],
  imports: [MenubarModule, AvatarModule, InputTextModule, RippleModule, BadgeModule, NgClass, NgIf]
})
export class MenuComponent implements OnInit {
  items: any[] = [];
  userRole: string | null = null;
  isAuthenticated: boolean = false;

  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  ngOnInit() {
    this.checkAuthenticationStatus();
  }

  checkAuthenticationStatus(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      const currentUser = this.authService.getCurrentUser();
      currentUser.subscribe(user => {
        this.userRole = user?.role;
      });
      this.items = this.getAuthenticatedMenuItems();
    } else {
      this.items = this.getUnauthenticatedMenuItems();
    }
  }

  onLogin(): void {
    this.router.navigate(['/login']);
  }

  onLogout(): void {
    this.authService.logout();
    this.checkAuthenticationStatus(); // Actualizamos el estado de autenticación
    this.router.navigate(['/login']); // Redirigimos al login
  }

  // Genera el menú para usuarios autenticados
  getAuthenticatedMenuItems() {
    return [
      { label: 'Alumnos', icon: 'pi pi-users', routerLink: '/alumnos' },
      { label: 'Justificantes', icon: 'pi pi-file', routerLink: '/justificante' },
      { label: 'Retrasos', icon: 'pi pi-clock', routerLink: '/retraso' },
      { label: 'Asistencias', icon: 'pi pi-check-square', routerLink: '/asistencia' },
      { label: 'Asignaturas', icon: 'pi pi-list', routerLink: '/asignatura' },
      ...(this.userRole === 'Director' ? [
        { label: 'Profesores', icon: 'pi pi-user', routerLink: '/profesor' },
        { label: 'Cursos', icon: 'pi pi-briefcase', routerLink: '/curso' },
        { label: 'Padres', icon: 'pi pi-users', routerLink: '/padre' },
      ] : []),
      ...(this.userRole ? [
        { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.onLogout() }, // Usamos command para el logout
      ] : []),
    ];
  }

  // Genera el menú para usuarios no autenticados
  getUnauthenticatedMenuItems() {
    return [
      { label: 'Login', icon: 'pi pi-sign-in', command: () => this.onLogin() } // Usamos command para navegar al login
    ];
  }
}
