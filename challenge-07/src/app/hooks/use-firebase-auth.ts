import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import { useFirebase } from './use-firebase';

/** Hook: toda la lógica de Firebase Auth (login, registro, logout, sesión). */
export function useFirebaseAuth() {
  const auth = getAuth(useFirebase());

  return {
    register: async (email: string, password: string, displayName?: string) => {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(cred.user, { displayName });
      }
      return cred.user;
    },
    login: async (email: string, password: string) => {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      return cred.user;
    },
    logout: () => signOut(auth),
    onUserChange: (callback: (user: User | null) => void) => onAuthStateChanged(auth, callback),
  };
}

/** Traduce los códigos de error de Firebase a mensajes claros. */
export function authErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code ?? '';
  switch (code) {
    case 'auth/invalid-email': return 'El correo no es válido.';
    case 'auth/missing-password': return 'Escribe tu contraseña.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential': return 'Correo o contraseña incorrectos.';
    case 'auth/email-already-in-use': return 'Ese correo ya está registrado.';
    case 'auth/weak-password': return 'La contraseña debe tener al menos 6 caracteres.';
    case 'auth/too-many-requests': return 'Demasiados intentos. Inténtalo más tarde.';
    case 'auth/network-request-failed': return 'Sin conexión. Revisa tu internet.';
    default: return 'Ocurrió un error. Inténtalo de nuevo.';
  }
}
