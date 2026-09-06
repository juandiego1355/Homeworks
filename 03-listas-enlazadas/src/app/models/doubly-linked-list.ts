import { Node } from './node';

// Lista Doblemente Enlazada: cada nodo conoce a su "previous" y a su "next",
// por lo que se puede recorrer en ambos sentidos (head -> tail y tail -> head).
export class DoublyLinkedList<T> {
  head: Node<T> | null = null;
  tail: Node<T> | null = null;
  length = 0;

  // Agrega un nuevo nodo al final, enlazando también su "previous".
  append(value: T): void {
    const newNode = new Node<T>(value);

    if (!this.head) {
      this.head = newNode;
    } else {
      this.tail!.next = newNode;
      newNode.previous = this.tail;
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

  size(): number {
    return this.length;
  }

  // Elimina el nodo con "value" reconectando previous <-> next en ambas direcciones.
  remove(value: T): boolean {
    let current = this.head;

    while (current) {
      if (current.value === value) {
        if (current.previous) {
          current.previous.next = current.next;
        } else {
          this.head = current.next;
        }

        if (current.next) {
          current.next.previous = current.previous;
        } else {
          this.tail = current.previous;
        }

        this.length--;
        return true;
      }

      current = current.next;
    }

    return false;
  }

  // Recorre de head a tail.
  print(): T[] {
    const valores: T[] = [];
    let current = this.head;

    while (current) {
      valores.push(current.value);
      current = current.next;
    }

    return valores;
  }

  // Recorre de tail a head (aprovechando "previous").
  printReverse(): T[] {
    const valores: T[] = [];
    let current = this.tail;

    while (current) {
      valores.push(current.value);
      current = current.previous;
    }

    return valores;
  }
}
