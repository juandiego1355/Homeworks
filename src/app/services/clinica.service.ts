import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Paciente } from '../models/paciente';
import { Medico } from '../models/medico';
import { Atencion } from '../models/atencion';
import { Miembro } from '../models/miembro';
import { ListaSimple } from '../structures/lista-simple';
import { ListaDoble } from '../structures/lista-doble';
import { ListaCircular } from '../structures/lista-circular';
import { ListaCircularDoble } from '../structures/lista-circular-doble';

@Injectable({ providedIn: 'root' })
export class ClinicaService implements OnDestroy {
  private espera = new ListaSimple<Paciente>();
  private historial = new ListaDoble<Atencion>();
  private medicos = new ListaCircular<Medico>();
  private comite = new ListaCircularDoble<Miembro>();

  private idPaciente = 1;
  private idMedico = 1;
  private idMiembro = 1;
  private timer: ReturnType<typeof setInterval> | null = null;

  espera$ = new BehaviorSubject<Paciente[]>([]);
  historial$ = new BehaviorSubject<Atencion[]>([]);
  medicos$ = new BehaviorSubject<Medico[]>([]);
  medicoGuardia$ = new BehaviorSubject<Medico | null>(null);
  comite$ = new BehaviorSubject<Miembro[]>([]);
  miembroActual$ = new BehaviorSubject<Miembro | null>(null);
  segundosRotacion$ = new BehaviorSubject<number>(10);

  private segundosRestantes = 10;

  constructor() {
    this.cargarDatosIniciales();
    this.iniciarRotacion();
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  private cargarDatosIniciales(): void {
    this.agregarMedico('Dra. Laura Méndez', 'Medicina general');
    this.agregarMedico('Dr. Cristiano Ronaldo', 'Pediatría');
    this.agregarMedico('Dra. Sofía Vargas', 'Urgencias');

    this.agregarMiembro('Ana Torres', 'Directora');
    this.agregarMiembro('Miguel Peña', 'Administrador');
    this.agregarMiembro('Elena Castro', 'Contabilidad');

    this.registrarPaciente('Juan Pérez', '1098765432', 'Dolor de cabeza');
    this.registrarPaciente('María Gómez', '1087654321', 'Control de presión');
    this.registrarPaciente('Pedro López', '1076543210', 'Fiebre');
  }

  private notificar(): void {
    this.espera$.next(this.espera.aArray());
    this.historial$.next(this.historial.aArrayReciente());
    this.medicos$.next(this.medicos.aArray());
    this.medicoGuardia$.next(this.medicos.obtenerActual());
    this.comite$.next(this.comite.aArray());
    this.miembroActual$.next(this.comite.obtenerActual());
  }

  private iniciarRotacion(): void {
    this.segundosRestantes = 10;
    this.segundosRotacion$.next(this.segundosRestantes);

    this.timer = setInterval(() => {
      this.segundosRestantes--;
      if (this.segundosRestantes <= 0) {
        this.medicos.rotar();
        this.medicoGuardia$.next(this.medicos.obtenerActual());
        this.medicos$.next(this.medicos.aArray());
        this.segundosRestantes = 10;
      }
      this.segundosRotacion$.next(this.segundosRestantes);
    }, 1000);
  }

  registrarPaciente(nombre: string, documento: string, motivo: string): void {
    const paciente: Paciente = {
      id: this.idPaciente++,
      nombre: nombre.trim(),
      documento: documento.trim(),
      motivo: motivo.trim(),
      llegada: new Date(),
    };
    this.espera.encolar(paciente);
    this.notificar();
  }

  atenderSiguiente(notas = ''): Atencion | null {
    const paciente = this.espera.desencolar();
    const medico = this.medicos.obtenerActual();
    if (!paciente || !medico) {
      if (paciente) this.espera.encolar(paciente);
      return null;
    }

    const atencion: Atencion = {
      paciente,
      medico,
      fecha: new Date(),
      notas: notas.trim() || 'Atención registrada',
    };
    this.historial.agregarAlFinal(atencion);
    this.notificar();
    return atencion;
  }

  agregarMedico(nombre: string, especialidad: string): void {
    this.medicos.insertar({
      id: this.idMedico++,
      nombre: nombre.trim(),
      especialidad: especialidad.trim(),
    });
    this.notificar();
  }

  agregarMiembro(nombre: string, cargo: string): void {
    this.comite.insertar({
      id: this.idMiembro++,
      nombre: nombre.trim(),
      cargo: cargo.trim(),
    });
    this.notificar();
  }

  comiteAvanzar(): void {
    this.comite.avanzar();
    this.miembroActual$.next(this.comite.obtenerActual());
    this.comite$.next(this.comite.aArray());
  }

  comiteRetroceder(): void {
    this.comite.retroceder();
    this.miembroActual$.next(this.comite.obtenerActual());
    this.comite$.next(this.comite.aArray());
  }

  cantidadEspera(): number {
    return this.espera.tamano;
  }
}
