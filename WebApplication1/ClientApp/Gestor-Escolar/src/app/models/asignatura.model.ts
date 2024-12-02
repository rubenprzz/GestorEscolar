import {Curso} from './curso.model';
import {Asistencia} from './asistencia.model';
import {Retraso} from './retraso.model';
import {Nota} from './nota.model';

export class Asignatura {


  id?: number;
  nombre?: string;
  profesorDni?: any;
  cursos?: Curso[];
  asistencias?: Asistencia[];
  retrasos?: Retraso[];
  dias?: any[];
  horasInicio?: any[];
  horasFin?: any[];

  notas?: Nota[];

}
