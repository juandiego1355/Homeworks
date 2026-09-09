export class NodoCircularDoble<T> {
  dato: T;
  siguiente: NodoCircularDoble<T> | null = null;
  anterior: NodoCircularDoble<T> | null = null;

  constructor(dato: T) {
    this.dato = dato;
  }
}

/** Lista circular doblemente enlazada — comité administrativo */
export class ListaCircularDoble<T> {
  private actual: NodoCircularDoble<T> | null = null;
  private _tamano = 0;

  get tamano(): number {
    return this._tamano;
  }

  insertar(dato: T): void {
    const nodo = new NodoCircularDoble(dato);
    if (!this.actual) {
      nodo.siguiente = nodo;
      nodo.anterior = nodo;
      this.actual = nodo;
    } else {
      const siguiente = this.actual.siguiente!;
      nodo.siguiente = siguiente;
      nodo.anterior = this.actual;
      this.actual.siguiente = nodo;
      siguiente.anterior = nodo;
    }
    this._tamano++;
  }

  obtenerActual(): T | null {
    return this.actual ? this.actual.dato : null;
  }

  avanzar(): T | null {
    if (!this.actual) return null;
    this.actual = this.actual.siguiente;
    return this.actual!.dato;
  }

  retroceder(): T | null {
    if (!this.actual) return null;
    this.actual = this.actual.anterior;
    return this.actual!.dato;
  }

  aArray(): T[] {
    if (!this.actual) return [];
    const arr: T[] = [];
    let nodo = this.actual;
    do {
      arr.push(nodo.dato);
      nodo = nodo.siguiente!;
    } while (nodo !== this.actual);
    return arr;
  }
}
