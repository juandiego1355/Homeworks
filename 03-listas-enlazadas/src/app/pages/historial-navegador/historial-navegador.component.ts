import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DoublyLinkedList } from '../../models/doubly-linked-list';
import { PAGINAS_MOCK } from '../../data/paginas-mock';

@Component({
  selector: 'app-historial-navegador',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './historial-navegador.component.html',
  styleUrl: './historial-navegador.component.css',
})
export class HistorialNavegadorComponent {
  // Lista doblemente enlazada: cada página conoce tanto a la anterior como a la siguiente.
  private historial = new DoublyLinkedList<string>();

  indiceActual = signal(0);
  paginas = signal<string[]>([]);

  constructor() {
    PAGINAS_MOCK.forEach((pagina) => this.historial.append(pagina));
    this.paginas.set(this.historial.print());
  }

  get totalPaginas(): number {
    return this.historial.size();
  }

  get paginaActual(): string | null {
    return this.historial.peek(this.indiceActual())?.value ?? null;
  }

  // "Atrás": usa el "previous" del nodo actual, como en el historial real de un navegador.
  atras(): void {
    const nodoActual = this.historial.peek(this.indiceActual());
    if (nodoActual?.previous) {
      this.indiceActual.update((i) => i - 1);
    }
  }

  // "Adelante": usa el "next" del nodo actual.
  adelante(): void {
    const nodoActual = this.historial.peek(this.indiceActual());
    if (nodoActual?.next) {
      this.indiceActual.update((i) => i + 1);
    }
  }

  irAPagina(indice: number): void {
    this.indiceActual.set(indice);
  }
}
