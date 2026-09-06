# Challenge 03 — Listas Enlazadas

Proyecto Angular generado con Angular CLI 18.2.21, hecho para el **Challenge 03** de
Estructuras de Datos II (clase de Listas).

## Enunciado

1. Implementar una lista enlazada para reproducir canciones en orden (con datos mock).
2. Implementar una lista doblemente enlazada para navegar hacia atrás/adelante entre
   páginas visitadas en un navegador (con datos falsos).
3. Crear un proyecto en Angular con 2 páginas nuevas: lista enlazada y lista
   doblemente enlazada.
4. Usar las listas implementadas en cada página, navegando con botones dentro de las
   páginas.

## Cómo está resuelto

- `src/app/models/node.ts`: nodo genérico (`value`, `next`, `previous`).
- `src/app/models/linked-list.ts`: **Lista Enlazada Simple**, con los métodos vistos
  en clase (`append`, `peek`, `size`, `remove`, `print`).
- `src/app/models/doubly-linked-list.ts`: **Lista Doblemente Enlazada**, con los
  mismos métodos más `printReverse` (recorrido de tail a head usando `previous`).
- `src/app/pages/inicio`: página de inicio con enlaces a las 2 páginas del reto.
- `src/app/pages/reproductor-canciones`: usa `LinkedList<Cancion>` llena con datos
  mock (`src/app/data/canciones-mock.ts`). Botones "Anterior" / "Siguiente" avanzan
  el índice de reproducción recorriendo la lista.
- `src/app/pages/historial-navegador`: usa `DoublyLinkedList<string>` llena con
  URLs de ejemplo (`src/app/data/paginas-mock.ts`). Botones "Atrás" / "Adelante"
  se apoyan en `previous` y `next` del nodo actual, tal como el historial real de
  un navegador.
- El ruteo entre las 3 páginas está definido en `src/app/app.routes.ts`.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The
application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the
`dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
