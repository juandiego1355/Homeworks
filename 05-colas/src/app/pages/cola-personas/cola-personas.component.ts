import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PERSONAS_MOCK } from '../../data/personas-mock';
import { Persona } from '../../models/persona';
import { Queue } from '../../models/queue';

@Component({
  selector: 'app-cola-personas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cola-personas.component.html',
  styleUrl: './cola-personas.component.css',
  providers: [DatePipe],
})
export class ColaPersonasComponent {
  private cola = new Queue<Persona>();
  private fb = inject(FormBuilder);

  personas = signal<Persona[]>([]);
  siguiente = signal<Persona | null>(null);
  total = signal(0);

  formulario = this.fb.nonNullable.group({
    name: ['', Validators.required],
    withdrawal: [0, [Validators.required, Validators.min(1)]],
    arrivalDate: ['', Validators.required],
  });

  constructor() {
    PERSONAS_MOCK.forEach((persona) => this.cola.enqueue(persona));
    this.refrescar();
  }

  agregarPersona(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const nuevaPersona = this.formulario.getRawValue();
    this.cola.enqueue(nuevaPersona);
    this.formulario.reset({
      name: '',
      withdrawal: 0,
      arrivalDate: '',
    });
    this.refrescar();
  }

  atenderPersona(): void {
    this.cola.dequeue();
    this.refrescar();
  }

  private refrescar(): void {
    this.personas.set(this.cola.print());
    this.siguiente.set(this.cola.peek());
    this.total.set(this.cola.size());
  }
}
