import { Node } from './node';

export class Queue<T> {
  private front: Node<T> | null = null;
  private rear: Node<T> | null = null;
  private length = 0;

  enqueue(value: T): void {
    const nuevo = new Node(value);

    if (!this.rear) {
      this.front = nuevo;
      this.rear = nuevo;
      this.length++;
      return;
    }

    this.rear.next = nuevo;
    this.rear = nuevo;
    this.length++;
  }

  dequeue(): T | null {
    if (!this.front) {
      return null;
    }

    const valor = this.front.value;
    this.front = this.front.next;

    if (!this.front) {
      this.rear = null;
    }

    this.length--;
    return valor;
  }

  peek(): T | null {
    return this.front?.value ?? null;
  }

  size(): number {
    return this.length;
  }

  isEmpty(): boolean {
    return this.length === 0;
  }

  print(): T[] {
    const valores: T[] = [];
    let actual = this.front;

    while (actual) {
      valores.push(actual.value);
      actual = actual.next;
    }

    return valores;
  }
}
