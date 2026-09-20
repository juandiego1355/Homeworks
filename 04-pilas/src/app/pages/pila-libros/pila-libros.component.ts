import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LIBROS_MOCK } from '../../data/libros-mock';
import { Libro } from '../../models/libro';
import { Stack } from '../../models/stack';

@Component({
  selector: 'app-pila-libros',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './pila-libros.component.html',
  styleUrl: './pila-libros.component.css',
})
export class PilaLibrosComponent {
  private pila = new Stack<Libro>();
  private fb = inject(FormBuilder);

  libros = signal<Libro[]>([]);
  cima = signal<Libro | null>(null);
  total = signal(0);

  formulario = this.fb.nonNullable.group({
    name: ['', Validators.required],
    isbn: ['', Validators.required],
    author: ['', Validators.required],
    editorial: ['', Validators.required],
  });

  constructor() {
    LIBROS_MOCK.forEach((libro) => this.pila.push(libro));
    this.refrescar();
  }

  agregarLibro(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.pila.push(this.formulario.getRawValue());
    this.formulario.reset();
    this.refrescar();
  }

  sacarLibro(): void {
    this.pila.pop();
    this.refrescar();
  }

  private refrescar(): void {
    this.libros.set(this.pila.print());
    this.cima.set(this.pila.peek());
    this.total.set(this.pila.size());
  }
}
