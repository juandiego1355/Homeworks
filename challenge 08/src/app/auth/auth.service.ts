import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly demoEmail = 'user@mail.com';
  private readonly demoPassword = '123';

  readonly currentUser = signal<string | null>(null);
  readonly isAuthenticated = signal(false);

  login(email: string, password: string): boolean {
    if (email.trim().toLowerCase() !== this.demoEmail || password !== this.demoPassword) {
      return false;
    }

    this.currentUser.set(this.demoEmail);
    this.isAuthenticated.set(true);
    return true;
  }

  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }
}
