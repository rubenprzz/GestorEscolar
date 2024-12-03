import {Padre} from './padre.model';
import {Asistencia} from './asistencia.model';
import {Retraso} from './retraso.model';
import {Justificante} from './justificante.model';
import {Nota} from './nota.model';

export interface Alumno {
  id: number;
  nombre: string;
  apellidos: string;
  dni: string;
  fechaNacimiento: string;
  email: string;
  telefono: string;
  cursoId: number;
  cursoNombre: string;
  urlFoto: string;
  padres: Padre[];
  cantidadAsistenciasFaltadas: number;
  cantidadRetrasos: number;
  asistencias: Asistencia[];
  justificantes: Justificante[];
  retrasos: Retraso[];
  notas: Nota[];

}
