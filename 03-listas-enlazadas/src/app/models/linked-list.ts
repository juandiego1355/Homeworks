import { Node } from './node';

// Implementación de una Lista Enlazada Simple, siguiendo la convención
// vista en clase: append, peek, size, remove, print.
export class LinkedList<T> {
  head: Node<T> | null = null;
  tail: Node<T> | null = null;
  length = 0;

  // Agrega un nuevo nodo al final de la lista.
  append(value: T): void {
    const newNode = new Node<T>(value);

    if (!this.head) {
      this.head = newNode;
    } else {
      this.tail!.next = newNode;
    }

    this.tail = newNode;
    this.length++;
  }

  // Devuelve el nodo ubicado en la posición "index" (0 = head).
  peek(index: number): Node<T> | null {
    if (index < 0 || index >= this.length) return null;

    let current = this.head;
    let contador = 0;

    while (current && contador < index) {
      current = current.next;
      contador++;
    }

    return current;
  }

  // Retorna el número de elementos de la lista.
  size(): number {
    return this.length;
  }

  // Elimina el nodo que contiene "value" y reconecta al anterior con el siguiente.
  remove(value: T): boolean {
    let current = this.head;
    let previous: Node<T> | null = null;

    while (current) {
      if (current.value === value) {
        if (previous) {
          previous.next = current.next;
        } else {
          this.head = current.next;
        }

        if (current === this.tail) {
          this.tail = previous;
        }

        this.length--;
        return true;
      }

      previous = current;
      current = current.next;
    }

    return false;
  }

  // Retorna un arreglo con los valores de la lista, en orden, para
  // imprimir o recorrer fácilmente desde los componentes de Angular.
  print(): T[] {
    const valores: T[] = [];
    let current = this.head;

    while (current) {
      valores.push(current.value);
      current = current.next;
    }

    return valores;
  }
}
