export class NodoSimple<T> {
  dato: T;
  siguiente: NodoSimple<T> | null = null;

  constructor(dato: T) {
    this.dato = dato;
  }
}

/** Lista enlazada simple — cola de pacientes en espera */
export class ListaSimple<T> {
  private cabeza: NodoSimple<T> | null = null;
  private cola: NodoSimple<T> | null = null;
  private _tamano = 0;

  get tamano(): number {
    return this._tamano;
  }

  estaVacia(): boolean {
    return this.cabeza === null;
  }

  encolar(dato: T): void {
    const nodo = new NodoSimple(dato);
    if (!this.cabeza) {
      this.cabeza = nodo;
      this.cola = nodo;
    } else {
      this.cola!.siguiente = nodo;
      this.cola = nodo;
    }
    this._tamano++;
  }

  desencolar(): T | null {
    if (!this.cabeza) return null;
    const dato = this.cabeza.dato;
    this.cabeza = this.cabeza.siguiente;
    if (!this.cabeza) this.cola = null;
    this._tamano--;
    return dato;
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
