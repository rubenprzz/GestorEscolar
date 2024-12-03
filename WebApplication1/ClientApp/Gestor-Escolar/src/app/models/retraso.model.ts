import {Asignatura} from './asignatura.model';
import {Alumno} from './alumno.model';

export class Retraso {
  id?: number;
  fecha?: Date;
  minutosRetraso?: number;
  alumnoDni?: number;
  justificado?: boolean;
  motivo?: string;
  asignaturaNombre?: string;


}
