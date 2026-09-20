import { Node } from './node';

// Pila (LIFO): el último libro que entra es el primero que sale.
export class Stack<T> {
  private top: Node<T> | null = null;
  private length = 0;

  // Agrega un elemento en la cima.
  push(value: T): void {
    const nuevo = new Node(value);
    nuevo.next = this.top;
    this.top = nuevo;
    this.length++;
  }

  // Quita y retorna el elemento de la cima.
  pop(): T | null {
    if (!this.top) return null;

    const valor = this.top.value;
    this.top = this.top.next;
    this.length--;
    return valor;
  }

  // Consulta la cima sin quitarla.
  peek(): T | null {
    return this.top?.value ?? null;
  }

  size(): number {
    return this.length;
  }

  isEmpty(): boolean {
    return this.length === 0;
  }

  // Recorre de cima a base para imprimir la pila en pantalla.
  print(): T[] {
    const valores: T[] = [];
    let actual = this.top;

    while (actual) {
      valores.push(actual.value);
      actual = actual.next;
    }

    return valores;
  }
}
