import { Component, signal } from '@angular/core';
import { LoaderComponent } from './components/loader/loader.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { ContactListComponent } from './components/contact-list/contact-list.component';
import { Contacto } from './models/contacto';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoaderComponent, ContactFormComponent, ContactListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'contactos-app';

  // signal para saber si todavia estamos "cargando" los datos iniciales
  cargando = signal(true);

  // signal con la lista de contactos
  contactos = signal<Contacto[]>([]);

  // esto solo es para ir generando ids nuevos cada que agregamos un contacto
  private siguienteId = 1;

  constructor() {
    this.cargarContactosIniciales();
  }

  cargarContactosIniciales() {
    // simulamos una carga de datos como si viniera de un backend
    setTimeout(() => {
      const datosIniciales: Contacto[] = [
        { id: this.siguienteId++, nombre: 'Camila Rios', telefono: '300 456 7890' },
        { id: this.siguienteId++, nombre: 'Andres Gomez', telefono: '311 222 3344' },
        { id: this.siguienteId++, nombre: 'Laura Peña', telefono: '320 555 1212' },
      ];

      this.contactos.set(datosIniciales);
      this.cargando.set(false);
    }, 1500);
  }

  agregarContacto(nuevo: { nombre: string; telefono: string }) {
    const contacto: Contacto = {
      id: this.siguienteId++,
      nombre: nuevo.nombre,
      telefono: nuevo.telefono,
    };

    this.contactos.update((lista) => [...lista, contacto]);
  }

  eliminarContacto(id: number) {
    this.contactos.update((lista) => lista.filter((c) => c.id !== id));
  }
}
