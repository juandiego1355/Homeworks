import { Paciente } from './paciente';
import { Medico } from './medico';

export interface Atencion {
  paciente: Paciente;
  medico: Medico;
  fecha: Date;
  notas: string;
}
