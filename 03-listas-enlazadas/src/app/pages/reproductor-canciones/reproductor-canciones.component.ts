import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LinkedList } from '../../models/linked-list';
import { Cancion } from '../../models/cancion';
import { CANCIONES_MOCK } from '../../data/canciones-mock';

@Component({
  selector: 'app-reproductor-canciones',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './reproductor-canciones.component.html',
  styleUrl: './reproductor-canciones.component.css',
})
export class ReproductorCancionesComponent {
  // La lista enlazada simple que contiene las canciones, en orden de reproducción.
  private listaCanciones = new LinkedList<Cancion>();

  // Índice de la canción que se está reproduciendo actualmente dentro de la lista.
  indiceActual = signal(0);

  // Todas las canciones, para pintar la lista completa en pantalla.
  canciones = signal<Cancion[]>([]);

  constructor() {
    CANCIONES_MOCK.forEach((cancion) => this.listaCanciones.append(cancion));
    this.canciones.set(this.listaCanciones.print());
  }

  get totalCanciones(): number {
    return this.listaCanciones.size();
  }

  get cancionActual(): Cancion | null {
    return this.listaCanciones.peek(this.indiceActual())?.value ?? null;
  }

  siguiente(): void {
    if (this.indiceActual() < this.totalCanciones - 1) {
      this.indiceActual.update((i) => i + 1);
    }
  }

  anterior(): void {
    if (this.indiceActual() > 0) {
      this.indiceActual.update((i) => i - 1);
    }
  }

  irACancion(indice: number): void {
    this.indiceActual.set(indice);
  }
}
