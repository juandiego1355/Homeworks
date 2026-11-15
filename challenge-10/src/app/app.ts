import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { Session, User } from '@supabase/supabase-js';
import { SupabaseService, Task } from './supabase.service';

type TaskFilter = 'all' | 'open' | 'done';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
})
export class App implements OnInit, OnDestroy {
  readonly today = new Date();
  readonly configured: boolean;
  readonly user = signal<User | null>(null);
  readonly tasks = signal<Task[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly notice = signal('');
  readonly filter = signal<TaskFilter>('all');
  readonly authMode = signal<'login' | 'register'>('login');
  readonly dialogOpen = signal(false);
  readonly editingTask = signal<Task | null>(null);
  readonly filteredTasks = computed(() => {
    const filter = this.filter();
    return this.tasks().filter((task) => {
      if (filter === 'open') return !task.completed;
      if (filter === 'done') return task.completed;
      return true;
    });
  });
  readonly openCount = computed(() => this.tasks().filter((task) => !task.completed).length);
  readonly completedCount = computed(() => this.tasks().filter((task) => task.completed).length);

  authEmail = '';
  authPassword = '';
  fullName = '';
  taskTitle = '';
  taskDescription = '';

  private authSubscription?: { unsubscribe: () => void };
  private taskSubscription?: ReturnType<SupabaseService['watchTasks']>;
  private activeSessionUserId: string | null | undefined;

  constructor(private readonly supabase: SupabaseService) {
    this.configured = supabase.configured;
  }

  ngOnInit(): void {
    if (!this.configured) return;

    const { data } = this.supabase.client.auth.onAuthStateChange(
      (_event, session) => {
        queueMicrotask(() => void this.applySession(session));
      },
    );
    this.authSubscription = data.subscription;
    void this.initialize();
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
    this.taskSubscription?.unsubscribe();
  }

  async authenticate(): Promise<void> {
    this.error.set('');
    this.notice.set('');
    this.saving.set(true);
    try {
      if (this.authMode() === 'register') {
        const session = await this.supabase.register(
          this.authEmail.trim(),
          this.authPassword,
          this.fullName.trim(),
        );
        if (session) {
          await this.applySession(session);
        } else {
          this.notice.set(
            'Cuenta creada. Revisa tu correo para confirmar el registro y luego inicia sesión.',
          );
          this.authMode.set('login');
        }
      } else {
        const session = await this.supabase.login(this.authEmail.trim(), this.authPassword);
        await this.applySession(session);
      }
      this.authPassword = '';
    } catch (error) {
      this.error.set(this.errorMessage(error));
    } finally {
      this.saving.set(false);
    }
  }

  async signOut(): Promise<void> {
    this.error.set('');
    try {
      await this.supabase.logout();
      this.taskSubscription?.unsubscribe();
      this.user.set(null);
      this.tasks.set([]);
    } catch (error) {
      this.error.set(this.errorMessage(error));
    }
  }

  openNewTask(): void {
    this.editingTask.set(null);
    this.taskTitle = '';
    this.taskDescription = '';
    this.error.set('');
    this.dialogOpen.set(true);
  }

  openEditTask(task: Task): void {
    this.editingTask.set(task);
    this.taskTitle = task.title;
    this.taskDescription = task.description ?? '';
    this.error.set('');
    this.dialogOpen.set(true);
  }

  closeDialog(): void {
    this.dialogOpen.set(false);
    this.editingTask.set(null);
  }

  async saveTask(): Promise<void> {
    const user = this.user();
    const title = this.taskTitle.trim();
    if (!user || !title) return;

    this.saving.set(true);
    this.error.set('');
    try {
      const task = this.editingTask();
      if (task) {
        await this.supabase.updateTask(task.id, {
          title,
          description: this.taskDescription.trim(),
        });
      } else {
        await this.supabase.createTask({
          title,
          description: this.taskDescription.trim(),
          user_id: user.id,
          completed: false,
        });
      }
      await this.loadTasks();
      this.closeDialog();
    } catch (error) {
      this.error.set(this.errorMessage(error));
    } finally {
      this.saving.set(false);
    }
  }

  async toggleTask(task: Task): Promise<void> {
    this.error.set('');
    try {
      await this.supabase.updateTask(task.id, { completed: !task.completed });
      await this.loadTasks();
    } catch (error) {
      this.error.set(this.errorMessage(error));
    }
  }

  async deleteTask(task: Task): Promise<void> {
    if (!window.confirm(`¿Eliminar "${task.title}"? Esta acción no se puede deshacer.`)) return;
    this.error.set('');
    try {
      await this.supabase.deleteTask(task.id);
      await this.loadTasks();
      this.notice.set('Tarea eliminada.');
    } catch (error) {
      this.error.set(this.errorMessage(error));
    }
  }

  async uploadAvatar(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    const user = this.user();
    if (!file || !user) return;
    this.error.set('');
    this.notice.set('');
    try {
      const updatedUser = await this.supabase.uploadAvatar(user.id, file);
      this.user.set(updatedUser);
      this.notice.set('Foto de perfil actualizada.');
    } catch (error) {
      this.error.set(this.errorMessage(error));
    } finally {
      (event.target as HTMLInputElement).value = '';
    }
  }

  displayName(): string {
    const user = this.user();
    return user?.user_metadata['full_name'] || user?.email || 'Usuario';
  }

  avatarUrl(): string | null {
    return this.user()?.user_metadata['avatar_url'] ?? null;
  }

  formatDate(date: string): string {
    return new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short' }).format(new Date(date));
  }

  trackTask(_index: number, task: Task): string {
    return task.id;
  }

  private async initialize(): Promise<void> {
    try {
      const { data, error } = await this.supabase.client.auth.getSession();
      if (error) throw error;
      await this.applySession(data.session);
    } catch (error) {
      this.error.set(this.errorMessage(error));
    }
  }

  private async applySession(session: Session | null): Promise<void> {
    const userId = session?.user.id ?? null;
    if (userId === this.activeSessionUserId) return;
    this.activeSessionUserId = userId;
    this.user.set(session?.user ?? null);
    this.taskSubscription?.unsubscribe();
    this.taskSubscription = undefined;
    if (!session) {
      this.tasks.set([]);
      return;
    }
    this.tasks.set([]);
    await this.loadTasks();
    this.taskSubscription = this.supabase.watchTasks(session.user.id, () => {
      void this.loadTasks();
    }, (message) => {
      this.error.set(message);
    });
  }

  private async loadTasks(): Promise<void> {
    if (!this.user()) return;
    this.loading.set(true);
    try {
      this.tasks.set(await this.supabase.getTasks());
    } catch (error) {
      this.error.set(this.errorMessage(error));
    } finally {
      this.loading.set(false);
    }
  }

  private errorMessage(error: unknown): string {
    return error instanceof Error
      ? error.message
      : 'Ocurrió un error inesperado. Inténtalo de nuevo.';
  }
}
