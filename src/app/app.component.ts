import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClinicaService } from './services/clinica.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  nombre = '';
  documento = '';
  motivo = '';
  notas = '';

  medNombre = '';
  medEspecialidad = '';

  miNombre = '';
  miCargo = '';

  mensaje = '';

  constructor(public clinica: ClinicaService) {}

  registrar(): void {
    if (!this.nombre.trim() || !this.documento.trim() || !this.motivo.trim()) {
      this.mensaje = 'Completa los datos del paciente.';
      return;
    }
    this.clinica.registrarPaciente(this.nombre, this.documento, this.motivo);
    this.nombre = '';
    this.documento = '';
    this.motivo = '';
    this.mensaje = 'Paciente agregado a la cola.';
  }

  atender(): void {
    const atencion = this.clinica.atenderSiguiente(this.notas);
    this.notas = '';
    if (!atencion) {
      this.mensaje = 'No hay pacientes en espera o no hay médico de guardia.';
      return;
    }
    this.mensaje = `Atendido: ${atencion.paciente.nombre} → ${atencion.medico.nombre}`;
  }

  agregarMedico(): void {
    if (!this.medNombre.trim() || !this.medEspecialidad.trim()) {
      this.mensaje = 'Completa nombre y especialidad del médico.';
      return;
    }
    this.clinica.agregarMedico(this.medNombre, this.medEspecialidad);
    this.medNombre = '';
    this.medEspecialidad = '';
    this.mensaje = 'Médico agregado a la rotación.';
  }

  agregarMiembro(): void {
    if (!this.miNombre.trim() || !this.miCargo.trim()) {
      this.mensaje = 'Completa nombre y cargo del miembro.';
      return;
    }
    this.clinica.agregarMiembro(this.miNombre, this.miCargo);
    this.miNombre = '';
    this.miCargo = '';
    this.mensaje = 'Miembro agregado al comité.';
  }
}
