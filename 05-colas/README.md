# Challenge 05 — Colas

Proyecto Angular generado con Angular CLI 18.2.21, hecho para el **Challenge 05**
de Estructuras de Datos II (clase de Colas).

## Enunciado

1. Crear y manejar una cola de personas en un ATM. Cada persona debe tener name, withdrawal y arrivalDate.
2. Llenar la cola con datos mock.
3. Crear una pantalla en Angular con un formulario para agregar una persona nueva y meterla en la cola.
4. Imprimir la cola en pantalla ordenada por la fecha de llegada.

## Cómo está resuelto

- `src/app/models/persona.ts`: interfaz de la persona (`name`, `withdrawal`, `arrivalDate`).
- `src/app/models/node.ts`: nodo genérico (`value`, `next`).
- `src/app/models/queue.ts`: **Cola (FIFO)** con `enqueue`, `dequeue`, `peek`, `size`, `isEmpty` y `print`.
- `src/app/data/personas-mock.ts`: tres personas de ejemplo.
- `src/app/pages/cola-personas`: formulario para hacer `enqueue` y lista visual de la cola.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.
