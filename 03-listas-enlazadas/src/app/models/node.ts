// Nodo genérico usado tanto por la lista enlazada simple como por la doble.
// "previous" solo lo usa la lista doblemente enlazada, pero no afecta a la
// lista simple dejarlo declarado aquí (queda en null).
export class Node<T> {
  value: T;
  next: Node<T> | null = null;
  previous: Node<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}
