export class NodoCircular<T> {
  dato: T;
  siguiente: NodoCircular<T> | null = null;

  constructor(dato: T) {
    this.dato = dato;
  }
}

/** Lista circular simple — rotación de médicos de guardia */
export class ListaCircular<T> {
  private actual: NodoCircular<T> | null = null;
  private _tamano = 0;

  get tamano(): number {
    return this._tamano;
  }

  insertar(dato: T): void {
    const nodo = new NodoCircular(dato);
    if (!this.actual) {
      nodo.siguiente = nodo;
      this.actual = nodo;
    } else {
      nodo.siguiente = this.actual.siguiente;
      this.actual.siguiente = nodo;
    }
    this._tamano++;
  }

  obtenerActual(): T | null {
    return this.actual ? this.actual.dato : null;
  }

  /** Avanza al siguiente médico en la rotación */
  rotar(): T | null {
    if (!this.actual) return null;
    this.actual = this.actual.siguiente;
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
