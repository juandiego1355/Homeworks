import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Contacto } from '../../models/contacto';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent {
  // recibe la lista de contactos desde app.component
  @Input() contactos: Contacto[] = [];

  // avisa al padre cual id hay que borrar
  @Output() eliminarContacto = new EventEmitter<number>();

  borrar(id: number) {
    this.eliminarContacto.emit(id);
  }
}
