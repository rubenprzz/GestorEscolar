import { Routes } from '@angular/router';
import {AlumnoComponent} from './components/alumno/alumno.component';
import {RetrasoComponent} from './components/retraso/retraso.component';
import {ProfesorComponent} from './components/profesor/profesor.component';
import {CursoComponent} from './components/curso/curso.component';
import {AsistenciaComponent} from './components/asistencia/asistencia.component';
import {NotaComponent} from './components/nota/nota.component';
import {PadreComponent} from './components/padre/padre.component';
import {AsignaturaComponent} from './components/asignatura/asignatura.component';
import {JustificanteComponent} from './components/justificante/justificante.component';
import {LoginComponent} from './components/login/login.component';
import {ViewAlumnoComponent} from './components/view-alumno/view-alumno.component';
import {AddJustificanteComponent} from './components/add-justificante/add-justificante.component';
import {RegisterComponent} from './register/register.component';

export const routes: Routes = [
  { path: 'alumnos', component: AlumnoComponent },
  { path: 'justificante', component: JustificanteComponent },
  { path: 'retraso', component: RetrasoComponent },
  { path: 'profesor', component: ProfesorComponent },
  { path: 'nota', component: NotaComponent },
  { path: 'asistencia', component: AsistenciaComponent },
  { path: 'curso', component: CursoComponent },
  { path: 'padre', component: PadreComponent },
  { path: 'asignatura', component: AsignaturaComponent },
  { path: 'login', component: LoginComponent },
  { path: 'alumnos/:id', component: ViewAlumnoComponent },
  { path: 'register', component: RegisterComponent },








];
