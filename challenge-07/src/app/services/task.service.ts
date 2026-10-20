import { Injectable, computed, effect, signal } from '@angular/core';
import { useFirestoreTasks } from '../hooks/use-firestore-tasks';
import { Task, TaskInput } from '../models/task.model';
import { AuthService } from './auth.service';

/** Servicio 2 (distinto al de login): maneja los datos de las Tareas para las páginas. */
@Injectable({ providedIn: 'root' })
export class TaskService {
  private firestoreTasks = useFirestoreTasks();
  private unsubscribe: (() => void) | null = null;

  private _tasks = signal<Task[]>([]);
  private _loading = signal(true);
  private _error = signal<string | null>(null);

  readonly tasks = this._tasks.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly pendingCount = computed(() => this._tasks().filter((t) => !t.done).length);
  readonly doneCount = computed(() => this._tasks().filter((t) => t.done).length);

  constructor(private auth: AuthService) {
    // Cada vez que cambia el usuario, cambia la suscripción a sus tareas.
    effect(() => {
      const user = this.auth.user();
      this.unsubscribe?.();
      this.unsubscribe = null;
      this._tasks.set([]);

      if (!user) {
        this._loading.set(false);
        return;
      }
      this._loading.set(true);
      this.unsubscribe = this.firestoreTasks.listen(
        user.uid,
        (tasks) => {
          this._tasks.set(tasks);
          this._loading.set(false);
          this._error.set(null);
        },
        () => {
          this._error.set('No se pudieron cargar las tareas. Revisa las reglas de Firestore.');
          this._loading.set(false);
        },
      );
    }, { allowSignalWrites: true });
  }

  create(input: TaskInput) {
    const user = this.auth.user();
    if (!user) throw new Error('No hay sesión');
    return this.firestoreTasks.create(user.uid, input);
  }

  update(id: string, input: TaskInput) {
    return this.firestoreTasks.update(id, input);
  }

  toggle(task: Task) {
    return this.firestoreTasks.toggle(task.id, !task.done);
  }

  remove(id: string) {
    return this.firestoreTasks.remove(id);
  }
}
