import {Alumno} from './alumno.model';
import {Asignatura} from './asignatura.model';

export interface Nota {

  id: number;
  notaValue: number;
  motivo: string;
  fecha: string;
  alumnoId: number;
  asignaturaId: number;
  asignatura: Asignatura;
  alumno: Alumno;

}
