import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav class="navbar bg-white border-bottom">
      <div class="container">
        <a class="navbar-brand fw-bold text-primary" routerLink="/tasks">Task App</a>
        <div class="d-flex align-items-center gap-2">
          @if (auth.isLoggedIn()) {
            <span class="text-muted small d-none d-sm-inline">{{ auth.user()?.displayName || auth.user()?.email }}</span>
            <button class="btn btn-outline-secondary btn-sm" (click)="logout()">Cerrar sesión</button>
          } @else {
            <a class="btn btn-outline-primary btn-sm" routerLink="/login">Iniciar sesión</a>
            <a class="btn btn-primary btn-sm" routerLink="/register">Crear cuenta</a>
          }
        </div>
      </div>
    </nav>
    <router-outlet />
  `,
})
export class AppComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }
}
