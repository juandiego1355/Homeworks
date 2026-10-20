import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';

/** Hook: devuelve la instancia única de Firebase (la inicializa si hace falta). */
export function useFirebase(): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(environment.firebase);
}
