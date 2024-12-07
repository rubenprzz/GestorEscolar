import {Alumno} from './alumno.model';

export class Curso {
  id?: number;
  nombre?: string;
  asignaturas?: any[];
  alumnos?: Alumno[];
  fechaInicio?: Date;
  fechaFin?: Date;


}
