import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { authErrorMessage } from '../../hooks/use-firebase-auth';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-wrap">
      <form class="auth-card" [formGroup]="form" (ngSubmit)="submit()">
        <h1>Crear cuenta</h1>
        <p class="text-muted mb-4">Regístrate para guardar tus tareas.</p>

        @if (error()) {
          <div class="alert alert-danger py-2">{{ error() }}</div>
        }

        <div class="mb-3">
          <label class="form-label" for="name">Nombre</label>
          <input id="name" type="text" class="form-control" formControlName="name" autocomplete="name">
          @if (form.controls.name.touched && form.controls.name.invalid) {
            <div class="form-text text-danger">Escribe tu nombre.</div>
          }
        </div>

        <div class="mb-3">
          <label class="form-label" for="email">Correo</label>
          <input id="email" type="email" class="form-control" formControlName="email" autocomplete="email">
          @if (form.controls.email.touched && form.controls.email.invalid) {
            <div class="form-text text-danger">Escribe un correo válido.</div>
          }
        </div>

        <div class="mb-3">
          <label class="form-label" for="password">Contraseña</label>
          <input id="password" type="password" class="form-control" formControlName="password" autocomplete="new-password">
          @if (form.controls.password.touched && form.controls.password.invalid) {
            <div class="form-text text-danger">Mínimo 6 caracteres.</div>
          }
        </div>

        <div class="mb-4">
          <label class="form-label" for="confirm">Repite la contraseña</label>
          <input id="confirm" type="password" class="form-control" formControlName="confirm" autocomplete="new-password">
          @if (form.controls.confirm.touched && mismatch()) {
            <div class="form-text text-danger">Las contraseñas no coinciden.</div>
          }
        </div>

        <button class="btn btn-primary w-100" type="submit" [disabled]="form.invalid || mismatch() || loading()">
          {{ loading() ? 'Creando…' : 'Crear cuenta' }}
        </button>

        <p class="text-center mt-3 mb-0">
          ¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión</a>
        </p>
      </form>
    </div>
  `,
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirm: ['', Validators.required],
  });

  mismatch() {
    const { password, confirm } = this.form.getRawValue();
    return password !== confirm;
  }

  async submit() {
    if (this.form.invalid || this.mismatch()) return;
    this.loading.set(true);
    this.error.set(null);
    try {
      const { email, password, name } = this.form.getRawValue();
      await this.auth.register(email, password, name);
      this.router.navigate(['/tasks']);
    } catch (e) {
      this.error.set(authErrorMessage(e));
    } finally {
      this.loading.set(false);
    }
  }
}
