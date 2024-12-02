import {Asignatura} from './asignatura.model';
import {Alumno} from './alumno.model';

export class Retraso {
  id?: number;
  fecha?: Date;
  minutosRetraso?: number;
  alumnoId?: number;
  alumno?: Alumno; // Relación con Alumno
  justificado?: boolean;
  motivo?: string;
  asignaturaId?: number;
  asignatura?: string;


}
