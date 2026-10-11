import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let auth: AuthService;

  beforeEach(() => {
    auth = TestBed.inject(AuthService);
  });

  it('authenticates the demo user and exposes the signed-in user', () => {
    expect(auth.login('user@mail.com', '123')).toBeTrue();
    expect(auth.isAuthenticated()).toBeTrue();
    expect(auth.currentUser()).toBe('user@mail.com');
  });

  it('rejects incorrect credentials without authenticating', () => {
    expect(auth.login('user@mail.com', 'wrong')).toBeFalse();
    expect(auth.isAuthenticated()).toBeFalse();
    expect(auth.currentUser()).toBeNull();
  });

  it('clears the signed-in user on logout', () => {
    auth.login('user@mail.com', '123');
    auth.logout();

    expect(auth.isAuthenticated()).toBeFalse();
    expect(auth.currentUser()).toBeNull();
  });
});
