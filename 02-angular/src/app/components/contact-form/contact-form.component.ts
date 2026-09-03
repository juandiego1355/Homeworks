import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css'
})
export class ContactFormComponent {
  // le avisamos al padre (app.component) que hay un contacto nuevo
  @Output() nuevoContacto = new EventEmitter<{ nombre: string; telefono: string }>();

  nombre = '';
  telefono = '';

  capturarNombre(e: any) {
    this.nombre = e.target.value;
  }

  capturarTelefono(e: any) {
    this.telefono = e.target.value;
  }

  agregar() {
    // validacion bien basica, que no manden campos vacios
    if (this.nombre.trim() === '' || this.telefono.trim() === '') {
      alert('Falta el nombre o el telefono');
      return;
    }

    this.nuevoContacto.emit({ nombre: this.nombre, telefono: this.telefono });

    // limpiamos el formulario despues de agregar
    this.nombre = '';
    this.telefono = '';
  }
}
