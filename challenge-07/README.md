# Challenge 07 – Task App (Angular + Firebase)

Login / Register / Logout con Firebase Auth y una app de tareas (crear, editar, eliminar, marcar como hecha) con Firestore.

## Estructura
- `src/app/hooks/` → **custom hooks** con la lógica de Firebase (`useFirebase`, `useFirebaseAuth`, `useFirestoreTasks`)
- `src/app/services/auth.service.ts` → servicio para Login/Register
- `src/app/services/task.service.ts` → servicio para Tareas (usado por las páginas)
- `src/app/pages/` → `login`, `register`, `tasks`
- `src/app/guards/` → protege las rutas
- `src/styles.scss` + `src/styles/_variables.scss` → **SASS** + **Bootstrap**

## Configurar Firebase
1. Crea un proyecto en https://console.firebase.google.com
2. Authentication → Sign-in method → activa **Correo/contraseña**
3. Firestore Database → crea la base de datos (modo producción) y pega `firestore.rules` en la pestaña Reglas
4. Project settings → agrega una app Web y copia la config en `src/environments/environment.ts`

## Ejecutar
```bash
npm install
npm start
```
Abre http://localhost:4200
