# Challenge 04 — Pilas

Proyecto Angular generado con Angular CLI 18.2.21, hecho para el **Challenge 04**
de Estructuras de Datos II (clase de Pilas).

## Enunciado

1. Crear y manejar una pila de libros. Cada libro debe tener Name, ISBN, Author y Editorial.
2. Llenar la pila con datos mock.
3. Crear un proyecto en Angular con una pantalla y un formulario para crear un libro nuevo
   y agregarlo a la pila.
4. Imprimir la pila de libros en pantalla.

## Cómo está resuelto

- `src/app/models/libro.ts`: interfaz del libro (`name`, `isbn`, `author`, `editorial`).
- `src/app/models/node.ts`: nodo genérico (`value`, `next`).
- `src/app/models/stack.ts`: **Pila (LIFO)** con `push`, `pop`, `peek`, `size`, `isEmpty` y `print`.
- `src/app/data/libros-mock.ts`: tres libros de ejemplo que se apilan al iniciar.
- `src/app/pages/pila-libros`: formulario para hacer `push` de un libro nuevo y lista
  visual de la pila (cima primero). El botón Pop saca el libro de la cima.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.
