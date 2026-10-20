import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <main class="container py-4" style="max-width: 760px">
      <div class="d-flex justify-content-between align-items-end mb-3">
        <h1 class="h3 fw-bold mb-0">Mis tareas</h1>
        <span class="text-muted small">
          {{ taskService.pendingCount() }} pendientes · {{ taskService.doneCount() }} hechas
        </span>
      </div>

      <form class="card card-body mb-4" [formGroup]="form" (ngSubmit)="save()">
        <h2 class="h6 fw-semibold mb-3">{{ editingId() ? 'Editar tarea' : 'Nueva tarea' }}</h2>
        <div class="mb-2">
          <input class="form-control" placeholder="Título" formControlName="title" aria-label="Título">
        </div>
        <div class="mb-3">
          <textarea class="form-control" rows="2" placeholder="Descripción (opcional)" formControlName="description" aria-label="Descripción"></textarea>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-primary" type="submit" [disabled]="form.invalid || saving()">
            {{ editingId() ? 'Guardar cambios' : 'Agregar tarea' }}
          </button>
          @if (editingId()) {
            <button class="btn btn-outline-secondary" type="button" (click)="cancelEdit()">Cancelar</button>
          }
        </div>
      </form>

      @if (taskService.error()) {
        <div class="alert alert-danger">{{ taskService.error() }}</div>
      }

      @if (taskService.loading()) {
        <div class="text-center py-4"><div class="spinner-border text-primary" role="status"></div></div>
      } @else if (taskService.tasks().length === 0) {
        <p class="text-center text-muted py-4">Aún no tienes tareas. Crea la primera arriba.</p>
      } @else {
        <ul class="list-unstyled d-grid gap-2">
          @for (task of taskService.tasks(); track task.id) {
            <li class="task-item p-3 d-flex align-items-start gap-3" [class.done]="task.done">
              <input class="form-check-input mt-1" type="checkbox" [checked]="task.done"
                     (change)="taskService.toggle(task)" [attr.aria-label]="'Marcar ' + task.title">
              <div class="flex-grow-1">
                <div class="task-title fw-semibold">{{ task.title }}</div>
                @if (task.description) {
                  <div class="text-muted small">{{ task.description }}</div>
                }
              </div>
              <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-secondary" (click)="edit(task)">Editar</button>
                <button class="btn btn-outline-danger" (click)="remove(task)">Eliminar</button>
              </div>
            </li>
          }
        </ul>
      }
    </main>
  `,
})
export class TasksComponent {
  taskService = inject(TaskService);
  private fb = inject(FormBuilder);

  editingId = signal<string | null>(null);
  saving = signal(false);

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: [''],
  });

  async save() {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    const input = { title: value.title.trim(), description: value.description.trim() };
    if (!input.title) return;

    this.saving.set(true);
    try {
      const id = this.editingId();
      if (id) {
        await this.taskService.update(id, input);
      } else {
        await this.taskService.create(input);
      }
      this.cancelEdit();
    } finally {
      this.saving.set(false);
    }
  }

  edit(task: Task) {
    this.editingId.set(task.id);
    this.form.setValue({ title: task.title, description: task.description });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.editingId.set(null);
    this.form.reset({ title: '', description: '' });
  }

  async remove(task: Task) {
    if (!confirm(`¿Eliminar "${task.title}"?`)) return;
    await this.taskService.remove(task.id);
    if (this.editingId() === task.id) this.cancelEdit();
  }
}
