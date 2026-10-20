import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { authErrorMessage } from '../../hooks/use-firebase-auth';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-wrap">
      <form class="auth-card" [formGroup]="form" (ngSubmit)="submit()">
        <h1>Iniciar sesión</h1>
        <p class="text-muted mb-4">Entra para ver tus tareas.</p>

        @if (error()) {
          <div class="alert alert-danger py-2">{{ error() }}</div>
        }

        <div class="mb-3">
          <label class="form-label" for="email">Correo</label>
          <input id="email" type="email" class="form-control" formControlName="email" autocomplete="email">
          @if (form.controls.email.touched && form.controls.email.invalid) {
            <div class="form-text text-danger">Escribe un correo válido.</div>
          }
        </div>

        <div class="mb-4">
          <label class="form-label" for="password">Contraseña</label>
          <input id="password" type="password" class="form-control" formControlName="password" autocomplete="current-password">
          @if (form.controls.password.touched && form.controls.password.invalid) {
            <div class="form-text text-danger">Escribe tu contraseña.</div>
          }
        </div>

        <button class="btn btn-primary w-100" type="submit" [disabled]="form.invalid || loading()">
          {{ loading() ? 'Entrando…' : 'Iniciar sesión' }}
        </button>

        <p class="text-center mt-3 mb-0">
          ¿No tienes cuenta? <a routerLink="/register">Crea una</a>
        </p>
      </form>
    </div>
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  async submit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set(null);
    try {
      const { email, password } = this.form.getRawValue();
      await this.auth.login(email, password);
      this.router.navigate(['/tasks']);
    } catch (e) {
      this.error.set(authErrorMessage(e));
    } finally {
      this.loading.set(false);
    }
  }
}
