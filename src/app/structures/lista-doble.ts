export class NodoDoble<T> {
  dato: T;
  siguiente: NodoDoble<T> | null = null;
  anterior: NodoDoble<T> | null = null;

  constructor(dato: T) {
    this.dato = dato;
  }
}

/** Lista doblemente enlazada — historial de atención */
export class ListaDoble<T> {
  private cabeza: NodoDoble<T> | null = null;
  private cola: NodoDoble<T> | null = null;
  private _tamano = 0;

  get tamano(): number {
    return this._tamano;
  }

  agregarAlFinal(dato: T): void {
    const nodo = new NodoDoble(dato);
    if (!this.cabeza) {
      this.cabeza = nodo;
      this.cola = nodo;
    } else {
      nodo.anterior = this.cola;
      this.cola!.siguiente = nodo;
      this.cola = nodo;
    }
    this._tamano++;
  }

  /** Del más reciente al más antiguo */
  aArrayReciente(): T[] {
    const arr: T[] = [];
    let actual = this.cola;
    while (actual) {
      arr.push(actual.dato);
      actual = actual.anterior;
    }
    return arr;
  }

  aArray(): T[] {
    const arr: T[] = [];
    let actual = this.cabeza;
    while (actual) {
      arr.push(actual.dato);
      actual = actual.siguiente;
    }
    return arr;
  }
}
