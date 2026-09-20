// Nodo genérico de la pila: apunta al elemento que quedó debajo.
export class Node<T> {
  value: T;
  next: Node<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}
