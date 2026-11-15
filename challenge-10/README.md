# Taskflow — tareas con Angular y Supabase

Aplicación en español con registro e inicio de sesión, tareas privadas (crear, editar, completar y eliminar), actualizaciones en tiempo real y carga de foto de perfil.

## Requisitos

- Node.js 20.19+ (o 22.12+)
- Un proyecto Supabase

## Preparar Supabase

1. Abre el **SQL Editor** de tu proyecto Supabase y ejecuta [`supabase/schema.sql`](./supabase/schema.sql). Crea la tabla `tasks`, activa RLS, limita el acceso a las tareas al usuario propietario, crea el bucket público `avatars` con límite de 5 MB y configura las políticas de almacenamiento y Realtime.
2. En **Project Settings → API**, copia el Project URL y la clave publicable (`anon` heredada o `sb_publishable_`).
3. Reemplaza los dos valores de ejemplo en [`src/environments/environment.ts`](./src/environments/environment.ts). La clave `service_role` es secreta y **no** debe ponerse en Angular.
4. En **Authentication → Providers → Email**, ajusta la confirmación de correo a tu preferencia. Con la confirmación activada, la persona usuaria debe validar su correo antes de iniciar sesión.

## Ejecutar localmente

```bash
npm install
npm start
```

Abre la dirección indicada por Angular CLI (normalmente `http://localhost:4200`). Sin credenciales válidas se muestra una guía de configuración; no se usa un backend simulado.

## Scripts disponibles

- `npm start` — servidor de desarrollo.
- `npm run build` — compilación de producción.
- `npm test` — pruebas unitarias.

La app crea y filtra tareas por el usuario autenticado. Supabase Realtime actualiza la lista ante cambios remotos. Las fotos se guardan en la ruta `<user-id>/<uuid>.<ext>` del bucket `avatars`; las reglas de Storage limitan escritura a esa carpeta propia.
