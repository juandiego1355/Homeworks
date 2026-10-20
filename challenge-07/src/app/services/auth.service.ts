import { Injectable, computed, signal } from '@angular/core';
import { User } from 'firebase/auth';
import { useFirebaseAuth } from '../hooks/use-firebase-auth';

/** Servicio 1: maneja los datos de Login / Register / Logout. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private firebaseAuth = useFirebaseAuth();

  private _user = signal<User | null>(null);
  private _ready = signal(false);

  readonly user = this._user.asReadonly();
  readonly ready = this._ready.asReadonly();
  readonly isLoggedIn = computed(() => this._user() !== null);

  constructor() {
    this.firebaseAuth.onUserChange((user) => {
      this._user.set(user);
      this._ready.set(true);
    });
  }

  /** Promesa que se resuelve cuando Firebase ya revisó si hay sesión guardada. */
  whenReady(): Promise<void> {
    if (this._ready()) return Promise.resolve();
    return new Promise((resolve) => {
      const check = setInterval(() => {
        if (this._ready()) {
          clearInterval(check);
          resolve();
        }
      }, 30);
    });
  }

  register(email: string, password: string, name?: string) {
    return this.firebaseAuth.register(email, password, name);
  }

  login(email: string, password: string) {
    return this.firebaseAuth.login(email, password);
  }

  logout() {
    return this.firebaseAuth.logout();
  }
}
